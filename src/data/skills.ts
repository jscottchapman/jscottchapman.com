// Skills you publish and share. The /skills index reads this list.
// Flagship skills get their own bespoke page under src/pages/skills/<slug>.astro;
// this list just powers the index cards + shared config.

export interface Skill {
  slug: string;
  name: string;
  tagline: string;
  date: string; // ISO publish date. Stamped on the skill's cell on the home
  // and /skills pages ("Added Jun 2026"), and fed to the SoftwareApplication
  // schema as datePublished and to the sitemap as lastmod, the freshness
  // signals for search and AI engines. The skill page itself shows no date.
  updated?: string; // ISO; bump when a skill changes materially. Drives
  // dateModified (the signal engines actually weight). Defaults to `date`.
  origin: string; // the job it was written for, drawn from the skill page's
  // own intro. Shown under the tagline on the homepage and /skills cells.
  draft?: boolean;
}

const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** The stamp on a skill's cell: "Updated Oct 2026" once it has changed, else "Added Jun 2026". */
export const stampFor = (s: Skill) =>
  s.updated ? `Updated ${monthYear(s.updated)}` : `Added ${monthYear(s.date)}`;

export const skills: Skill[] = [
  {
    slug: 'calculus-tutor',
    name: 'Calculus Tutor',
    tagline: 'Share a calculus problem and it walks you through it one step at a time. You answer with a letter, so you never type math.',
    date: '2026-10-28',
    origin: "Written for the calculus course I'm working through, to translate a textbook that seems written for people who already understand the material.",
  },
  {
    slug: 'ticket-driven-dev-harness',
    name: 'Ticket-Driven Dev Harness',
    tagline: 'A ticket goes in, a tested PR comes out. It writes the test before the code, gets your nod, then opens the PR that closes the ticket.',
    date: '2026-06-08',
    origin: "Written so the test comes first and specifies what to build, instead of agreeing with code already written.",
  },
  {
    slug: 'persona-exorcist',
    name: 'Persona Exorcist',
    tagline: 'Find every AI persona in a codebase, and the hidden channel that keeps resurrecting the one you already deleted.',
    date: '2026-06-05',
    origin: "Built to find whatever keeps summoning back an AI persona you already deleted.",
  },
  {
    slug: 'magical-service-design',
    name: 'Magical Service Design',
    tagline: 'A brainstorm partner that refuses to be boring. Describe a customer moment, get back ideas ranked by how audacious they are.',
    date: '2026-06-01',
    origin: "Written so people can borrow an LLM's creativity while they design a service.",
    updated: '2026-10-17',
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
