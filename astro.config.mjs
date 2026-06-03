// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Pages are prerendered static. The one exception is the /api/subscribe
// endpoint (prerender = false), a Vercel function that proxies newsletter
// signups to Beehiiv so the API key stays server-side.
export default defineConfig({
  site: 'https://jscottchapman.com',
  adapter: vercel(),
  integrations: [sitemap()],
});
