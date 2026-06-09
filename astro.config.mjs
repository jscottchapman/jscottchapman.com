// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { skills } from './src/data/skills';

// Pages are prerendered static. The one exception is the /api/subscribe
// endpoint (prerender = false), a Vercel function that proxies newsletter
// signups to Beehiiv so the API key stays server-side.

// Stamp each skill page's sitemap entry with a lastmod from skills.ts (the same
// date the page's schema uses), so search engines get a real freshness signal
// instead of no lastmod at all. Keyed by URL; non-skill pages pass through.
const skillLastmod = Object.fromEntries(
  skills.map((s) => [`https://jscottchapman.com/skills/${s.slug}/`, new Date(s.updated ?? s.date)]),
);

export default defineConfig({
  site: 'https://jscottchapman.com',
  adapter: vercel(),
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = skillLastmod[item.url];
        if (lastmod) item.lastmod = lastmod.toISOString();
        return item;
      },
    }),
  ],
});
