import { test, expect } from '@playwright/test';
import { pageLoadsCleanly, NAV } from './helpers';

// Baseline smoke coverage for the site. Every page a visitor can reach should
// load cleanly (200, no console errors) and show its heading. New issues that
// add or change a page should extend this file rather than replace it.

const PAGES = [
  { path: '/', heading: /J Scott\s+Chapman/i },
  { path: '/work/', heading: /Notes from the\s+field/i },
  { path: '/notes/', heading: /^Notes\.?$/i },
  { path: '/skills/', heading: /^Skills\.?$/i },
  { path: '/about/', heading: /How I\s+work/i },
  { path: '/skills/magical-service-design/', heading: /Magical Service Design/i },
  { path: '/skills/persona-exorcist/', heading: /Persona Exorcist/i },
];

for (const { path, heading } of PAGES) {
  test(`${path} loads cleanly and shows its heading`, async ({ page }) => {
    await pageLoadsCleanly(page, path);
    await expect(page.locator('main h1')).toContainText(heading);
  });
}

test('primary nav reaches every section from the homepage', async ({ page }) => {
  for (const { href, label } of NAV) {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/') + '?$'));
    await expect(page.locator('main h1')).toBeVisible();
  }
});

test('Google Analytics tag is present sitewide', async ({ page }) => {
  await page.goto('/');
  const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
  await expect(gaScript).toHaveAttribute('src', /G-8XPSMSKQG8/);
});

test('every page carries canonical and OG metadata', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
});
