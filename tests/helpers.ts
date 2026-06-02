import { expect, type Page } from '@playwright/test';

/**
 * Load a page and assert it came up cleanly: HTTP 200 and no console errors.
 * Returns the captured console errors so callers can make extra assertions.
 *
 * Console-error capture must be wired up BEFORE navigation, so this helper owns
 * the goto. Pass the path (e.g. "/work/").
 */
export async function pageLoadsCleanly(page: Page, path: string) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const response = await page.goto(path);
  expect(response?.status(), `${path} should return 200`).toBe(200);

  // Astro hydration / font loading shouldn't log errors. Allow none.
  expect(errors, `${path} logged console errors`).toEqual([]);

  return errors;
}

/** The primary nav links that appear on every page via Base.astro. */
export const NAV = [
  { href: '/work/', label: 'Work' },
  { href: '/notes/', label: 'Notes' },
  { href: '/skills/', label: 'Skills' },
  { href: '/about/', label: 'About' },
];
