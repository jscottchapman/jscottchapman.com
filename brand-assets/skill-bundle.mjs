// Skill bundles (.zip) for jscottchapman.com — one command, in sync with the page.
//
//   node brand-assets/skill-bundle.mjs                     # build any missing bundle
//   node brand-assets/skill-bundle.mjs --only persona-exorcist
//   node brand-assets/skill-bundle.mjs --force             # rebuild everything
//
// A single-file skill ships its SKILL.md as one /downloads/<slug>.skill file. A
// MULTI-FILE skill (scripts, references) can't: its SKILL.md tells you to run
// scripts that a lone file wouldn't include. So we zip the whole skill folder
// into /downloads/<slug>.skill.zip, which unzips into ~/.claude/skills as a
// working skill.
//
// SOURCE OF TRUTH: src/data/<slug>/ — the exact same files the skill page shows
// with ?raw. Build the zip FROM that folder so the download can never drift from
// what the page displays. Add a bundled skill by appending to BUNDLES and
// rendering; point the page at /downloads/<slug>.skill.zip.
//
// NOTES / scars worth keeping:
//  - The zip's top entry is the slug folder (persona-exorcist/SKILL.md, …) so it
//    unzips into ~/.claude/skills/<slug>/ in one step. Don't flatten it.
//  - We shell out to the system `zip`; -X drops extraneous file attributes to
//    keep the artifact lean. The .zip is a committed artifact, like the OG PNGs.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const DOWNLOADS = join(ROOT, 'public', 'downloads');

// One entry per bundled (multi-file) skill. `src` is the folder under src/data/
// whose contents become the zip; `out` is the file written to public/downloads/.
const BUNDLES = [
  { slug: 'persona-exorcist', src: 'persona-exorcist', out: 'persona-exorcist.skill.zip' },
  { slug: 'ticket-driven-dev-harness', src: 'ticket-driven-dev-harness', out: 'ticket-driven-dev-harness.skill.zip' },
];

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

let built = 0;
for (const bundle of BUNDLES) {
  if (only && only !== bundle.slug && only !== bundle.out) continue;

  const srcDir = join(DATA, bundle.src);
  if (!existsSync(srcDir)) {
    console.error(`✗ ${bundle.slug}: source folder missing at ${srcDir}`);
    process.exitCode = 1;
    continue;
  }

  const outPath = join(DOWNLOADS, bundle.out);
  if (existsSync(outPath) && !force) {
    console.log(`• ${bundle.out} exists — skipping (use --force to rebuild)`);
    continue;
  }
  // zip won't replace in place cleanly; remove any prior artifact first.
  if (existsSync(outPath)) rmSync(outPath);

  // Run from src/data so the archive's top-level entry is the slug folder
  // itself (persona-exorcist/SKILL.md, persona-exorcist/scripts/…).
  execFileSync('zip', ['-r', '-X', '-q', outPath, bundle.src], { cwd: DATA });
  console.log(`✓ ${bundle.out}  (from src/data/${bundle.src}/)`);
  built++;
}

if (built === 0 && !only) console.log('Nothing to build. Use --force to rebuild bundles.');
