import { defineConfig, devices } from '@playwright/test';

// Smoke tests for a static Astro site. Playwright builds the site and serves the
// production output, then runs the specs against it. This is intentionally light:
// there's no backend, so we assert what a visitor sees, not data flows.
const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  // Run the Astro dev server. It serves both the prerendered pages and the
  // /api/subscribe route. (The Vercel adapter doesn't support `astro preview`,
  // so we can't serve the production build here; `npm run build` is validated
  // separately in CI.)
  webServer: {
    command: 'npm run dev -- --port ' + PORT,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
