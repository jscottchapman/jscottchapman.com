import { test, expect } from '@playwright/test';
import { inflateRawSync } from 'node:zlib';

// Issue #7: every skill page is rendered by the shared SkillPage layout, so the
// three behaviors must be present and working on each one: click-to-copy source,
// a download button serving the skill file, and the email signup at the bottom.
//
// Issue #9: a skill can be a multi-file bundle. Persona Exorcist ships scripts
// (sweep.py / scrub.py) that its SKILL.md tells you to run, so the page shows
// those scripts as extra source blocks and the download is a complete .zip of
// the whole skill folder — not a lone SKILL.md that references missing files.
// The single-file skill (magical-service-design) keeps its one block + .skill
// download, which is the point of checking both: the layout serves both shapes.

const SKILL_PAGES = [
  '/skills/magical-service-design/',
  '/skills/persona-exorcist/',
  '/skills/ticket-driven-dev-harness/',
  '/skills/calculus-tutor/',
];

for (const path of SKILL_PAGES) {
  test(`${path} has copy, download, and signup from the shared layout`, async ({ page, context, browserName }) => {
    // Clipboard permissions are a Chromium concept; WebKit ignores the grant.
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    await page.goto(path);

    // Download button: present, marked as a download, points at a skill file
    // (a single .skill for one-file skills, or a .skill.zip bundle).
    const dl = page.locator('a.download');
    await expect(dl).toBeVisible();
    await expect(dl).toHaveAttribute('href', /\/downloads\/.+\.skill(\.zip)?$/);
    expect(await dl.getAttribute('download'), 'download attribute present').not.toBeNull();

    // Email signup at the bottom (the reusable <Signup> component).
    await expect(page.locator('[data-signup]')).toHaveCount(1);

    // Click-to-copy reacts to a click on every browser (success on Chromium,
    // the ⌘C fallback where the clipboard API is unavailable). The first block
    // is always SKILL.md; multi-file skills add more blocks below it.
    const copyBtn = page.locator('[data-copy-btn]').first();
    await expect(copyBtn).toHaveText('Copy');
    await copyBtn.click();
    await expect(copyBtn).toHaveText(/Copied|⌘C/);
  });
}

test('single-file skill shows exactly one source block', async ({ page }) => {
  await page.goto('/skills/magical-service-design/');
  await expect(page.locator('.source')).toHaveCount(1);
  await expect(page.locator('[data-copy-btn]')).toHaveCount(1);
});

test('persona-exorcist shows its scripts alongside SKILL.md', async ({ page }) => {
  await page.goto('/skills/persona-exorcist/');

  // SKILL.md + sweep.py + scrub.py = three source blocks, each with its own copy.
  await expect(page.locator('.source')).toHaveCount(3);
  await expect(page.locator('[data-copy-btn]')).toHaveCount(3);

  // The script blocks are labelled (scope to the label bar — the filenames also
  // appear inside SKILL.md and the script bodies) and actually carry the script
  // source, so the page no longer references code it doesn't show.
  await expect(page.locator('.source-name', { hasText: 'scripts/sweep.py' })).toHaveCount(1);
  await expect(page.locator('.source-name', { hasText: 'scripts/scrub.py' })).toHaveCount(1);
  const blocks = page.locator('.source pre');
  await expect(blocks.filter({ hasText: 'persona-exorcist sweep' })).toHaveCount(1);
  await expect(blocks.filter({ hasText: 'def cmd_restore' })).toHaveCount(1);

  // Each copy button works independently.
  const lastCopy = page.locator('[data-copy-btn]').last();
  await lastCopy.click();
  await expect(lastCopy).toHaveText(/Copied|⌘C/);
});

test('persona-exorcist download is a complete zip bundle', async ({ page }) => {
  await page.goto('/skills/persona-exorcist/');
  const dl = page.locator('a.download');
  await expect(dl).toHaveAttribute('href', /\/downloads\/persona-exorcist\.skill\.zip$/);

  // The bundle is actually fetchable (committed artifact, served statically) and
  // is a real zip, not an HTML 404 body.
  const href = await dl.getAttribute('href');
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  const body = await res.body();
  expect(body.slice(0, 2).toString('latin1')).toBe('PK'); // zip magic number
});

test('ticket-driven-dev-harness shows its reference files alongside SKILL.md', async ({ page }) => {
  await page.goto('/skills/ticket-driven-dev-harness/');

  // SKILL.md + references/trackers.md + references/testing.md = three source
  // blocks, each with its own copy button — the page shows every file the
  // bundle ships, not just the spine.
  await expect(page.locator('.source')).toHaveCount(3);
  await expect(page.locator('[data-copy-btn]')).toHaveCount(3);

  // The reference blocks are labelled (scope to the label bar — these filenames
  // also appear inside SKILL.md's own prose) and carry the real reference text.
  await expect(page.locator('.source-name', { hasText: 'references/trackers.md' })).toHaveCount(1);
  await expect(page.locator('.source-name', { hasText: 'references/testing.md' })).toHaveCount(1);
  // Assert the reference *bodies* are on the page, using strings that live only
  // in each reference file — not phrases SKILL.md also quotes, which would match
  // the spine block too.
  const blocks = page.locator('.source pre');
  await expect(blocks.filter({ hasText: 'ankitpokhrel/jira-cli' })).toHaveCount(1); // trackers.md only
  await expect(blocks.filter({ hasText: 'storageState' })).toHaveCount(1); // testing.md only
});

test('skill pages carry datePublished/dateModified in the SoftwareApplication schema', async ({ page }) => {
  // Schema-only dating: the page shows no visible date (a skill is an evergreen
  // tool), but the JSON-LD must carry the freshness signal for search + AI
  // engines. The dates come from src/data/skills.ts.
  await page.goto('/skills/ticket-driven-dev-harness/');
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  const schema = JSON.parse(ld ?? '{}');
  expect(schema['@type']).toBe('SoftwareApplication');
  expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(schema.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test('ticket-driven-dev-harness download is a complete zip bundle', async ({ page }) => {
  await page.goto('/skills/ticket-driven-dev-harness/');
  const dl = page.locator('a.download');
  await expect(dl).toHaveAttribute('href', /\/downloads\/ticket-driven-dev-harness\.skill\.zip$/);

  // The bundle is actually fetchable (committed artifact, served statically) and
  // is a real zip, not an HTML 404 body.
  const href = await dl.getAttribute('href');
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  const body = await res.body();
  expect(body.slice(0, 2).toString('latin1')).toBe('PK'); // zip magic number
});

test('click-to-copy puts the on-page skill source on the clipboard', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard read only reliable in Chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/skills/persona-exorcist/');
  // Scope to the first block (SKILL.md) — the page now has several.
  const firstCopy = page.locator('[data-copy-btn]').first();
  await firstCopy.click();
  await expect(firstCopy).toHaveText(/Copied/);

  const onPage = (await page.locator('[data-copy-source]').first().textContent())?.trim() ?? '';
  const onClipboard = (await page.evaluate(() => navigator.clipboard.readText())).trim();
  expect(onClipboard.length).toBeGreaterThan(0);
  expect(onClipboard).toBe(onPage);
});

// Issue #18: Magical Service Design gained follow-up rounds that open with
// "What if this was really fun?", and lost its em dashes (a site voice rule).
// Its single-file .skill download is a hand-built zip, so it can silently lag
// the page; the second test reads SKILL.md out of the zip and compares.

// First file in a zip, read via the central directory (a local header's sizes
// can be zero when the archiver streams with a data descriptor).
function firstZipEntry(zip: Buffer): { name: string; text: string } {
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const cd = zip.readUInt32LE(eocd + 16);
  const method = zip.readUInt16LE(cd + 10);
  const size = zip.readUInt32LE(cd + 20);
  const name = zip.toString('utf8', cd + 46, cd + 46 + zip.readUInt16LE(cd + 28));
  const local = zip.readUInt32LE(cd + 42);
  const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
  const raw = zip.subarray(start, start + size);
  return { name, text: (method === 8 ? inflateRawSync(raw) : raw).toString('utf8') };
}

test('magical-service-design source asks the fun question and has no em dashes', async ({ page }) => {
  await page.goto('/skills/magical-service-design/');
  const source = (await page.locator('[data-copy-source]').first().textContent()) ?? '';
  expect(source).toContain('What if this was really fun?');
  expect(source).not.toContain('—');
});

test('magical-service-design download carries the same SKILL.md the page shows', async ({ page }) => {
  await page.goto('/skills/magical-service-design/');
  const onPage = (await page.locator('[data-copy-source]').first().textContent())?.trim() ?? '';
  const res = await page.request.get('/downloads/magical-service-design.skill');
  expect(res.status()).toBe(200);
  const entry = firstZipEntry(await res.body());
  expect(entry.name).toBe('magical-service-design/SKILL.md');
  expect(entry.text.trim()).toBe(onPage);
});

// Issue #20: Calculus Tutor ships as a single-file skill. It is a study tool,
// not a developer tool, so its schema says EducationalApplication. It is the
// newest skill, so the index lists it first, and llms.txt lists it for AI
// engines (hand-maintained, so a test is the only thing that keeps it honest).

test('calculus-tutor shows one SKILL.md block and its download matches the page', async ({ page }) => {
  await page.goto('/skills/calculus-tutor/');
  await expect(page.locator('.source')).toHaveCount(1);
  const onPage = (await page.locator('[data-copy-source]').first().textContent())?.trim() ?? '';
  expect(onPage).toContain('name: "calculus-tutor"');
  expect(onPage).not.toContain('—');

  const dl = page.locator('a.download');
  await expect(dl).toHaveAttribute('href', '/downloads/calculus-tutor.skill');
  const res = await page.request.get('/downloads/calculus-tutor.skill');
  expect(res.status()).toBe(200);
  const entry = firstZipEntry(await res.body());
  expect(entry.name).toBe('calculus-tutor/SKILL.md');
  expect(entry.text.trim()).toBe(onPage);
});

test('calculus-tutor schema is an EducationalApplication with dates and features', async ({ page }) => {
  await page.goto('/skills/calculus-tutor/');
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  const schema = JSON.parse(ld ?? '{}');
  expect(schema['@type']).toBe('SoftwareApplication');
  expect(schema.applicationCategory).toBe('EducationalApplication');
  expect(schema.url).toBe('https://jscottchapman.com/skills/calculus-tutor/');
  expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(Array.isArray(schema.featureList) && schema.featureList.length).toBeTruthy();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og-calculus-tutor-lattice\.png$/);
});

test('calculus-tutor is listed first on /skills and in llms.txt', async ({ page }) => {
  await page.goto('/skills/');
  await expect(page.locator('.entry').first()).toHaveAttribute('href', '/skills/calculus-tutor/');
  // Skills are free and ungated; the index description used to say otherwise.
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /No email required/);

  const llms = await (await page.request.get('/llms.txt')).text();
  expect(llms).toContain('(https://jscottchapman.com/skills/calculus-tutor/)');

  const og = await page.request.get('/og-calculus-tutor-lattice.png');
  expect(og.status()).toBe(200);
});
