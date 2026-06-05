// Skills you publish and share. The /skills index reads this list.
// Flagship skills get their own bespoke page under src/pages/skills/<slug>.astro;
// this list just powers the index cards + shared config.

export interface Skill {
  slug: string;
  name: string;
  tagline: string;
  date: string; // ISO; shown as the "when"
  draft?: boolean;
}

export const skills: Skill[] = [
  {
    slug: 'persona-exorcist',
    name: 'Persona Exorcist',
    tagline: 'Find every AI persona in a codebase, and the hidden channel that keeps resurrecting the one you already deleted.',
    date: '2026-06-05',
  },
  {
    slug: 'magical-service-design',
    name: 'Magical Service Design',
    tagline: 'A brainstorm partner that refuses to be boring. Describe a customer moment, get back ideas ranked by how audacious they are.',
    date: '2026-06-01',
  },
];

// Newsletter signup. The reusable <Signup> component posts JSON { email,
// campaign } to our own /api/subscribe serverless function, which subscribes
// the address to the jscottchapman.com Beehiiv publication server-side (so the
// API key is never exposed). source/campaign ride along so site signups stay
// separable from the Ready For Ultra (Kit) audience and we can see which
// placement drove each signup.
export const SUBSCRIBE_ENDPOINT = '/api/subscribe';
export const SITE_SOURCE = 'jscottchapman.com';
