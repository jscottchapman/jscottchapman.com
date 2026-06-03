// Generates Beehiiv publication assets in the jscottchapman.com brand.
// Renders HTML with the real site fonts and screenshots at exact pixel sizes.
//   node brand-assets/generate.mjs
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = dirname(fileURLToPath(import.meta.url));

// Brand tokens (from src/styles/global.css)
const PAPER = '#F1ECE0';
const PAPER2 = '#E8E1D1';
const INK = '#1F1B14';
const INK2 = '#3B362A';
const CLAY = '#B5532A';
const MUTE = '#6A6356';

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
`;
const SERIF = `'Newsreader', Georgia, serif`;
const SANS = `'IBM Plex Sans', system-ui, sans-serif`;

const page = (w, h, body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8">${FONTS}
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${w}px; height:${h}px; }
  body { font-family:${SANS}; -webkit-font-smoothing:antialiased; }
  .eyebrow { font-family:${SANS}; font-weight:700; text-transform:uppercase; letter-spacing:.18em; }
  ${extraCss}
</style></head><body>${body}</body></html>`;

// ---- 1200x630 thumbnail: newsletter-tuned OG card ----
const thumbnail = page(1200, 630, `
  <div style="width:1200px;height:630px;background:${PAPER};padding:64px 76px;position:relative;display:flex;flex-direction:column;">
    <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:21px;color:${INK};">
      <span class="eyebrow">The Field Journal</span>
      <span class="eyebrow">Missoula, Montana</span>
    </div>
    <div style="height:3px;background:${INK};margin-top:18px;"></div>

    <div style="margin-top:64px;font-family:${SERIF};font-weight:600;font-size:128px;line-height:.98;color:${INK};letter-spacing:-1px;">
      J Scott <span style="font-style:italic;font-weight:600;color:${CLAY};">Chapman</span>
    </div>

    <div style="margin-top:34px;font-family:${SERIF};font-style:italic;font-weight:400;font-size:33px;line-height:1.35;color:${INK2};max-width:760px;">
      Notes from building AI products, shipping them, and finding out whether they actually worked.
    </div>

    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;font-size:20px;">
      <span class="eyebrow" style="color:${CLAY};">jscottchapman.com</span>
      <span class="eyebrow" style="color:${MUTE};">The Newsletter</span>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:1200px;height:14px;background:${INK};"></div>
`);

// ---- 800x800 logo options. Full-bleed so platforms can mask/round it. ----
const logoTile = (bg, inner) => `<div style="width:800px;height:800px;background:${bg};display:flex;align-items:center;justify-content:center;">${inner}</div>`;

// A: ink tile, two-tone "JS" (J paper, S clay), clay rule under. RECOMMENDED.
const logoA = page(800, 800, logoTile(INK, `
  <div style="text-align:center;">
    <div style="font-family:${SERIF};font-weight:600;font-size:440px;line-height:1;letter-spacing:-8px;">
      <span style="color:${PAPER};">J</span><span style="font-style:italic;color:${CLAY};">S</span>
    </div>
    <div style="width:300px;height:10px;background:${CLAY};margin:28px auto 0;border-radius:5px;"></div>
  </div>
`));

// B: paper tile, ink "JS", hairline ink frame. No dot.
const logoB = page(800, 800, logoTile(PAPER, `
  <div style="width:732px;height:732px;border:7px solid ${INK};border-radius:60px;display:flex;align-items:center;justify-content:center;">
    <div style="font-family:${SERIF};font-weight:600;font-size:430px;line-height:1;letter-spacing:-6px;color:${INK};">
      JS
    </div>
  </div>
`));

// C: ink tile, single clay italic "S" (refined homage to the current favicon).
const logoC = page(800, 800, logoTile(INK, `
  <div style="font-family:${SERIF};font-style:italic;font-weight:600;font-size:560px;line-height:1;color:${CLAY};">S</div>
`));

// Contact sheet so the options are easy to compare at a glance.
const sheet = page(1240, 480, `
  <div style="width:1240px;height:480px;background:${PAPER2};display:flex;gap:40px;align-items:center;justify-content:center;padding:40px;">
    ${['A — ink, two-tone JS','B — paper, JS•','C — ink, clay S'].map((label,i)=>`
      <div style="text-align:center;">
        <div style="width:300px;height:300px;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(31,27,20,.18);">
          <iframe style="border:0;width:800px;height:800px;transform:scale(.375);transform-origin:top left;" srcdoc="${[logoA,logoB,logoC][i].replace(/"/g,'&quot;')}"></iframe>
        </div>
        <div class="eyebrow" style="margin-top:18px;font-size:18px;color:${INK2};">${label}</div>
      </div>`).join('')}
  </div>
`);

const targets = [
  { name: 'thumbnail-1200x630.png', html: thumbnail, w: 1200, h: 630 },
  { name: 'logo-A-800.png', html: logoA, w: 800, h: 800 },
  { name: 'logo-B-800.png', html: logoB, w: 800, h: 800 },
  { name: 'logo-C-800.png', html: logoC, w: 800, h: 800 },
  { name: 'logo-options-sheet.png', html: sheet, w: 1240, h: 480 },
];

const browser = await chromium.launch();
for (const t of targets) {
  const p = await browser.newPage({ viewport: { width: t.w, height: t.h }, deviceScaleFactor: 2 });
  await p.setContent(t.html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: join(OUT, t.name), clip: { x: 0, y: 0, width: t.w, height: t.h } });
  await p.close();
  console.log('wrote', t.name);
}
await browser.close();
