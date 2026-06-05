// Share images (OG cards) for jscottchapman.com — one command, on brand.
//
//   node brand-assets/og.mjs                # render any card missing from public/
//   node brand-assets/og.mjs --only skill   # render just one (by `out` or its name)
//   node brand-assets/og.mjs --force        # re-render everything
//
// ADD A PAGE: append one entry to CARDS below with a FRESH `out` filename, run
// the script, then point the page at it: <Base ogImage="/og-<name>.png">.
//
// Why config-driven: the skill card used to be a hand-wrestled HTML file plus a
// one-off screenshot. This makes "nice share image" a thirty-second, on-brand
// operation for every new page, with the learnings baked in (see NOTES).
//
// NOTES / scars worth keeping:
//  - 1200x630, rendered 1:1, so it matches the og:image:width/height that
//    Base.astro declares. Don't bump deviceScaleFactor without updating Base.
//  - Changing an image a page ALREADY ships? Give it a NEW filename. Crawlers
//    (LinkedIn, X, iMessage, Slack) cache OG images hard by URL; same filename =
//    stale preview. New filename is the reliable cache-bust. That's why the
//    default here SKIPS files that already exist — it never silently overwrites
//    a live, cached card. Use --force only for a deliberate redesign.
//  - Fonts must be loaded before the screenshot or the text reflows. We wait on
//    document.fonts.ready; keep that.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Brand tokens — mirror src/styles/global.css.
const PAPER = '#F1ECE0';
const INK = '#1F1B14';
const INK2 = '#3B362A';
const CLAY = '#B5532A';
const MUTE = '#6A6356';

// One card per page. `headline` may contain a single <em>…</em>; it renders
// italic clay — the signature one-word lift. `accent` is the bottom border bar
// (ink reads as the site itself; clay reads lighter, e.g. a free skill).
const CARDS = [
  {
    out: 'og-home.png',
    eyebrowLeft: 'A field journal',
    eyebrowRight: 'Missoula, Montana',
    headline: 'J Scott <em>Chapman</em>',
    deck: 'An AI product consultant who builds the thing, ships it, and finds out whether it worked.',
    footerLeft: 'jscottchapman.com',
    footerRight: 'AI Product Consultant',
    accent: INK,
    headlineSize: 132,
    deckWidth: '24ch',
  },
  {
    out: 'og-skill.png',
    eyebrowLeft: 'Magical Service Design',
    eyebrowRight: 'A free Claude skill',
    headline: 'Brainstorming, but it refuses to be <em>boring</em>.',
    deck: 'Describe a customer moment. Get back ideas ranked by how audacious they are.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    accent: CLAY,
    headlineSize: 92,
    deckWidth: '30ch',
  },
  {
    out: 'og-persona-exorcist.png',
    eyebrowLeft: 'Persona Exorcist',
    eyebrowRight: 'A free Claude skill',
    headline: 'The persona you deleted keeps coming <em>back</em>.',
    deck: 'Find every AI persona in a codebase, and the channel still summoning the ghost.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    accent: CLAY,
    headlineSize: 86,
    deckWidth: '30ch',
  },
];

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">`;

const card = (c) => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: ${PAPER};
    color: ${INK};
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 64px 80px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 16px solid ${c.accent ?? INK};
    overflow: hidden;
  }
  .top {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 17px; letter-spacing: 0.2em; text-transform: uppercase;
    color: ${INK2}; border-bottom: 3px double ${INK}; padding-bottom: 18px;
  }
  .top .lead { font-weight: 600; color: ${INK}; }
  .mid { padding: 8px 0 0; }
  h1 {
    font-family: 'Newsreader', serif; font-weight: 500;
    font-size: ${c.headlineSize ?? 100}px; line-height: 0.96;
    letter-spacing: -0.02em; max-width: 18ch;
  }
  h1 em { font-style: italic; color: ${CLAY}; }
  .deck {
    font-family: 'Newsreader', serif; font-style: italic; font-size: 31px;
    line-height: 1.38; color: ${INK2}; max-width: ${c.deckWidth ?? '30ch'};
    margin-top: 28px;
  }
  .bottom {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase;
    color: ${MUTE}; padding-bottom: 40px;
  }
  .bottom .site { color: ${CLAY}; font-weight: 600; }
</style></head><body>
  <div class="top"><span class="lead">${c.eyebrowLeft}</span><span>${c.eyebrowRight}</span></div>
  <div class="mid"><h1>${c.headline}</h1><p class="deck">${c.deck}</p></div>
  <div class="bottom"><span class="site">${c.footerLeft}</span><span>${c.footerRight}</span></div>
</body></html>`;

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx > -1 ? args[onlyIdx + 1] : null;
const nameOf = (out) => out.replace(/^og-/, '').replace(/\.png$/, '');

const browser = await chromium.launch();
for (const c of CARDS) {
  if (only && only !== c.out && only !== nameOf(c.out)) continue;
  const dest = join(PUBLIC, c.out);
  if (!force && existsSync(dest)) {
    console.log('skip (exists, --force to overwrite):', c.out);
    continue;
  }
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(card(c), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: dest, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await page.close();
  console.log('wrote', c.out);
}
await browser.close();
