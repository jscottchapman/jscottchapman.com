import { test, expect } from '@playwright/test';

// Issue #7: every skill page is rendered by the shared SkillPage layout, so the
// three behaviors must be present and working on each one: click-to-copy source,
// a download button serving a .skill file, and the email signup at the bottom.
//
// Checking BOTH the original (magical-service-design) and the new
// (persona-exorcist) page is the point: it proves the layout is the single
// source of truth — the new page got the behavior for free, and the refactor
// didn't strip it from the original.

const SKILL_PAGES = ['/skills/magical-service-design/', '/skills/persona-exorcist/'];

for (const path of SKILL_PAGES) {
  test(`${path} has copy, download, and signup from the shared layout`, async ({ page, context, browserName }) => {
    // Clipboard permissions are a Chromium concept; WebKit ignores the grant.
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    await page.goto(path);

    // Download button: present, marked as a download, points at a .skill file.
    const dl = page.locator('a.download');
    await expect(dl).toBeVisible();
    await expect(dl).toHaveAttribute('href', /\/downloads\/.+\.skill$/);
    expect(await dl.getAttribute('download'), 'download attribute present').not.toBeNull();

    // Email signup at the bottom (the reusable <Signup> component).
    await expect(page.locator('[data-signup]')).toHaveCount(1);

    // Click-to-copy reacts to a click on every browser (success on Chromium,
    // the ⌘C fallback where the clipboard API is unavailable).
    const copyBtn = page.locator('[data-copy-btn]');
    await expect(copyBtn).toHaveText('Copy');
    await copyBtn.click();
    await expect(copyBtn).toHaveText(/Copied|⌘C/);
  });
}

test('click-to-copy puts the on-page skill source on the clipboard', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard read only reliable in Chromium');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/skills/persona-exorcist/');
  await page.locator('[data-copy-btn]').click();
  await expect(page.locator('[data-copy-btn]')).toHaveText(/Copied/);

  const onPage = (await page.locator('[data-copy-source]').textContent())?.trim() ?? '';
  const onClipboard = (await page.evaluate(() => navigator.clipboard.readText())).trim();
  expect(onClipboard.length).toBeGreaterThan(0);
  expect(onClipboard).toBe(onPage);
});
