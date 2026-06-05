import { test, expect } from '@playwright/test';

// Issue #3: the signup is now a reusable <Signup> component placed across the
// site. Each instance posts JSON { email, campaign } to our own /api/subscribe
// proxy (which talks to Beehiiv server-side), where `campaign` says which spot
// the visitor signed up from. These tests fulfill the proxy at the network
// layer so CI never touches a real email service, and assert the request shape
// + success UX on both the skill page and a non-skill page.
//
// Real end-to-end confirmation (that Beehiiv actually records the campaign) is
// the separate live-verify step in the EVALUATE phase, run with a real key.

const SKILL_PAGE = '/skills/magical-service-design/';
const HOME_PAGE = '/';

// Component selectors — scoped to the signup root, never global ids.
const ROOT = '[data-signup]';
const EMAIL_INPUT = `${ROOT} input[name="email_address"]`;
const SUBMIT = `${ROOT} button[type="submit"]`;
const SUCCESS = `${ROOT} .unlocked`;

/** Stub /api/subscribe and block any real third-party traffic. */
async function stubSubscribe(page: import('@playwright/test').Page) {
  await page.route('**/app.kit.com/**', (r) => r.abort());
  await page.route('**/api.beehiiv.com/**', (r) => r.abort());
  const calls: Record<string, unknown>[] = [];
  await page.route('**/api/subscribe', async (route) => {
    calls.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
  return calls;
}

test('skill page signup posts email + campaign and shows success', async ({ page }) => {
  const calls = await stubSubscribe(page);

  await page.goto(SKILL_PAGE);
  await page.fill(EMAIL_INPUT, 'harness-test@example.com');
  await page.click(SUBMIT);

  await expect(page.locator(SUCCESS)).toBeVisible();

  expect(calls, 'POST /api/subscribe should have been called').toHaveLength(1);
  expect(calls[0]).toMatchObject({
    email: 'harness-test@example.com',
    campaign: 'magical-service-design',
  });
});

test('a non-skill page renders a signup and posts its own campaign', async ({ page }) => {
  const calls = await stubSubscribe(page);

  await page.goto(HOME_PAGE);
  await expect(page.locator(ROOT)).toHaveCount(1);

  await page.fill(EMAIL_INPUT, 'homepage-test@example.com');
  await page.click(SUBMIT);

  await expect(page.locator(SUCCESS)).toBeVisible();

  expect(calls, 'POST /api/subscribe should have been called').toHaveLength(1);
  expect(calls[0]).toMatchObject({
    email: 'homepage-test@example.com',
    campaign: 'homepage',
  });
});

test('the signup never posts directly to a third-party email service', async ({ page }) => {
  const externalCalls: string[] = [];
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('app.kit.com') || u.includes('api.beehiiv.com')) externalCalls.push(u);
  });
  await page.route('**/api/subscribe', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );

  await page.goto(SKILL_PAGE);
  await page.fill(EMAIL_INPUT, 'harness-test2@example.com');
  await page.click(SUBMIT);

  await expect(page.locator(SUCCESS)).toBeVisible();
  expect(externalCalls, 'the browser must not call Kit/Beehiiv directly; the key lives server-side').toEqual([]);
});

test('signup state is scoped to its root, with no collision-prone global ids', async ({ page }) => {
  await page.goto(SKILL_PAGE);

  // The old hand-inlined version used id="signup" / id="signup-form" /
  // id="signup-done"; multiple instances per page would collide on those. The
  // component must carry none of them.
  for (const stale of ['#signup', '#signup-form', '#signup-done', '#signup-submit']) {
    await expect(page.locator(stale)).toHaveCount(0);
  }

  // Form and its success state share one [data-signup] root, so toggling one
  // instance can never reveal another's success message.
  const root = page.locator(ROOT).first();
  await expect(root.locator('form')).toHaveCount(1);
  await expect(root.locator('.unlocked')).toHaveCount(1);
});
