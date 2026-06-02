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
    slug: 'magical-service-design',
    name: 'Magical Service Design',
    tagline: 'A brainstorm partner that refuses to be boring. Describe a customer moment, get back ideas ranked by how audacious they are.',
    date: '2026-06-01',
  },
];

// Kit (ConvertKit) newsletter form. The styled signup posts here directly.
// Form 9511459 on the ready-for-ultra.kit.com account. Collects email only.
export const KIT_FORM_ENDPOINT = 'https://app.kit.com/forms/9511459/subscriptions';
