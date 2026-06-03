import { test, expect } from '@playwright/test';

// Issue #1: the skill signup must post to our own /api/subscribe proxy (which
// talks to Beehiiv server-side), carrying the email and which skill it came
// from. These tests fulfill the proxy at the network layer so CI never touches
// a real email service, and assert the request shape + success UX.
//
// Real end-to-end confirmation (that Beehiiv actually records source/skill) is
// the separate live-verify step in the EVALUATE phase, run with a real key.

const SKILL_PAGE = '/skills/magical-service-design/';
const EMAIL_INPUT = '#signup-form input[name="email_address"]';

test('submitting the signup calls /api/subscribe with email + skill and shows success', async ({ page }) => {
  // Never let a test reach a real third-party service.
  await page.route('**/app.kit.com/**', (r) => r.abort());
  await page.route('**/api.beehiiv.com/**', (r) => r.abort());

  let captured: Record<string, unknown> | null = null;
  await page.route('**/api/subscribe', async (route) => {
    captured = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto(SKILL_PAGE);
  await page.fill(EMAIL_INPUT, 'harness-test@example.com');
  await page.click('#signup-submit');

  await expect(page.locator('#signup-done')).toBeVisible();

  expect(captured, 'POST /api/subscribe should have been called').not.toBeNull();
  expect(captured).toMatchObject({
    email: 'harness-test@example.com',
    skill: 'magical-service-design',
  });
});

test('the signup no longer posts directly to a third-party email service', async ({ page }) => {
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
  await page.click('#signup-submit');

  await expect(page.locator('#signup-done')).toBeVisible();
  expect(externalCalls, 'the browser must not call Kit/Beehiiv directly; the key lives server-side').toEqual([]);
});
