// Share images (OG cards) for jscottchapman.com: one command, on brand.
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
//    default here SKIPS files that already exist: it never silently overwrites
//    a live, cached card. Use --force only for a deliberate redesign.
//  - Fonts must be loaded before the screenshot or the text reflows. We wait on
//    document.fonts.ready; keep that.
//  - Headlines shrink to fit (at most three lines), so a long one never runs
//    into the footer. `headlineSize` is the starting size, not a promise.
//  - The `-lattice` suffix marks the October 2026 Vienna Lattice redesign. The
//    older cream cards stay in public/ so links shared before it keep working.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Brand tokens: mirror src/styles/global.css and DESIGN.md.
const WHITE = '#F4F4F1';
const BLACK = '#0F0F0F';
const GRAPHITE = '#4A4C50';
const PALLADIUM = '#8C9096';

// One card per page. `tab` sits in the black tab on the frame's top-left edge.
// `headline` may contain <em>, which renders upright: the lattice has no italic.
const CARDS = [
  {
    out: 'og-home-lattice.png',
    tab: 'Free Claude skills',
    label: 'Missoula, Montana',
    headline: 'J Scott Chapman',
    deck: 'An AI product consultant who builds the thing, ships it, and finds out whether it worked.',
    footerLeft: 'jscottchapman.com',
    footerRight: 'AI Product Consultant',
    headlineSize: 118,
    deckWidth: '34ch',
  },
  {
    out: 'og-skill-lattice.png',
    tab: 'A free Claude skill',
    label: 'Magical Service Design',
    headline: 'Brainstorming, but it refuses to be boring.',
    deck: 'Describe a customer moment. Get back ideas ranked by how audacious they are.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    headlineSize: 76,
    deckWidth: '40ch',
  },
  {
    out: 'og-persona-exorcist-lattice.png',
    tab: 'A free Claude skill',
    label: 'Persona Exorcist',
    headline: 'The persona you deleted keeps coming back.',
    deck: 'Find every AI persona in a codebase, and the channel still summoning the ghost.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    headlineSize: 76,
    deckWidth: '40ch',
  },
  {
    out: 'og-ticket-driven-dev-harness-lattice.png',
    tab: 'A free Claude skill',
    label: 'Ticket-Driven Dev Harness',
    headline: 'A ticket goes in. A tested PR comes out.',
    deck: 'It detects your stack, writes the test before the code, gets your nod, then opens the PR that closes the ticket.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    headlineSize: 76,
    deckWidth: '44ch',
  },
  {
    out: 'og-calculus-tutor-lattice.png',
    tab: 'A free Claude skill',
    label: 'Calculus Tutor',
    headline: 'Calculus, one step at a time.',
    deck: 'Share the problem. It guides you through it, and you answer by letter, so you never type math.',
    footerLeft: 'jscottchapman.com / skills',
    footerRight: 'J Scott Chapman',
    headlineSize: 84,
    deckWidth: '40ch',
  },
  {
    out: 'og-join-lattice.png',
    tab: 'One email, now and then',
    label: 'The list',
    headline: 'The occasional note, worth the inbox.',
    deck: 'I build AI products end to end, then write up what actually worked. No fixed schedule, no spam.',
    footerLeft: 'jscottchapman.com / join',
    footerRight: 'J Scott Chapman',
    headlineSize: 76,
    deckWidth: '40ch',
  },
];

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus+SC&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">`;

const card = (c) => `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONTS}
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body { background: ${WHITE}; color: ${BLACK}; font-family: 'Jost', sans-serif; padding: 36px; overflow: hidden; }
  .frame {
    position: relative; height: 100%; border: 2px solid ${BLACK};
    outline: 1px solid ${PALLADIUM}; outline-offset: -12px;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 30px 64px 0;
  }
  .stud { position: absolute; width: 14px; height: 14px; background: ${BLACK}; }
  .stud.tl { top: -8px; left: -8px; } .stud.tr { top: -8px; right: -8px; }
  .stud.bl { bottom: -8px; left: -8px; } .stud.br { bottom: -8px; right: -8px; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; margin: -32px -66px 0; }
  .tab {
    background: ${BLACK}; color: ${WHITE}; font-weight: 600; font-size: 16px;
    letter-spacing: 0.22em; text-transform: uppercase; padding: 16px 26px 15px 30px;
  }
  .label {
    font-weight: 500; font-size: 15px; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${GRAPHITE}; padding: 46px 66px 0 0;
  }
  .mid { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 12px 0 18px; }
  h1 {
    font-family: 'Marcellus SC', serif; font-weight: 400; font-size: ${c.headlineSize ?? 80}px;
    line-height: 1.08; letter-spacing: 0.05em; max-width: 21ch; text-wrap: balance;
  }
  h1 em { font-style: normal; }
  .deck { font-size: 27px; line-height: 1.42; color: ${GRAPHITE}; max-width: ${c.deckWidth ?? '40ch'}; margin-top: 26px; }
  .pierce {
    height: 12px; margin: 0 -2px;
    background: repeating-linear-gradient(90deg, ${BLACK} 0 12px, transparent 12px 24px);
  }
  .bottom {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 16px; letter-spacing: 0.2em; text-transform: uppercase; color: ${GRAPHITE};
    padding: 20px 0 26px;
  }
  .bottom .site { color: ${BLACK}; font-weight: 600; }
</style></head><body>
  <div class="frame">
    <span class="stud tl"></span><span class="stud tr"></span><span class="stud bl"></span><span class="stud br"></span>
    <div class="top"><span class="tab">${c.tab}</span><span class="label">${c.label}</span></div>
    <div class="mid"><h1>${c.headline}</h1><p class="deck">${c.deck}</p></div>
    <div class="pierce"></div>
    <div class="bottom"><span class="site">${c.footerLeft}</span><span>${c.footerRight}</span></div>
  </div>
</body></html>`;

// Shrink the headline until it holds three lines or fewer and the middle block
// fits its space. Runs in the page, after fonts load.
const fitHeadline = () => {
  const h1 = document.querySelector('h1');
  const mid = document.querySelector('.mid');
  let size = parseFloat(getComputedStyle(h1).fontSize);
  const lines = () => Math.round(h1.getBoundingClientRect().height / (size * 1.08));
  while (size > 40 && (lines() > 3 || mid.scrollHeight > mid.clientHeight)) {
    size -= 2;
    h1.style.fontSize = size + 'px';
  }
};

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
  await page.evaluate(fitHeadline);
  await page.waitForTimeout(150);
  await page.screenshot({ path: dest, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await page.close();
  console.log('wrote', c.out);
}
await browser.close();
