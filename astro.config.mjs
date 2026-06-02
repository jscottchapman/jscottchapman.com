// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static. The newsletter signup posts directly to Kit (ConvertKit),
// so there's no server code — Vercel just serves the built files.
export default defineConfig({
  site: 'https://jscottchapman.com',
  integrations: [sitemap()],
});
