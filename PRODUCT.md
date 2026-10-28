# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed 2026-10-28): people who find J Scott Chapman through his free Claude skills and his notes. They are builders and AI tinkerers who use Claude, Claude Code, or Claude in Chrome. They arrive from a LinkedIn post, a search, or an AI answer engine, usually landing on one skill page or one note. Their job: understand what the skill does, read or copy its source, download it, and decide whether to follow along by newsletter.

Secondary: potential consulting clients deciding whether to hire him as an AI product consultant. The Work and About pages and the homepage close ("let's talk") serve them.

## Product Purpose

jscottchapman.com is the personal site of J Scott Chapman, an AI product consultant in Missoula, Montana. It gives away Claude skills he built for his own work, publishes short notes on building and AI tooling, and shows case studies of software he built end to end. Success is a skill download, a newsletter signup, or (for clients) an email or intro call.

## Positioning

The skills are real tools he uses himself, shown in full on the page (source, copy button, download), free with no email gate. The case studies are solo, end-to-end builds with measured outcomes, by someone who came to code from running fire protection crews at a nuclear plant.

## Operating Context

- Astro 6 on Vercel, mostly prerendered static pages; one serverless function (`/api/subscribe`) posts signups to Beehiiv.
- Pages: `/` (home), `/work/`, `/about/`, `/notes/` (Markdown content collection), `/skills/` index plus one page per skill, `/join/` (stand-alone signup).
- Skill pages all render through `src/layouts/SkillPage.astro`; shared chrome lives in `src/layouts/Base.astro` and `src/styles/global.css`.
- Every new page ships a 1200x630 share card made by `brand-assets/og.mjs`.
- Playwright smoke tests (`npm test`, Desktop Chrome and Mobile Safari) assert visitor-visible behavior: headings, copy buttons, downloads, signup, schema, OG tags.

## Capabilities and Constraints

- Skills are free and never gated. The signup is optional and sits below the skill.
- SEO and AEO matter: JSON-LD schema, canonical links, sitemap lastmod, OG cards, and a hand-maintained `public/llms.txt` must survive any redesign.
- Google Analytics (GA4) tag stays sitewide.

## Brand Commitments

- The name is always "J Scott Chapman", never "J. Scott".
- No em dashes anywhere, in copy or headings.
- Voice: short, plain, first person, share-not-sell. Show the artifact in place rather than describing it.
- The June 2026 field-journal look (cream paper, terracotta accent, newspaper styling with section numbers and hairline rules) is retired as of 2026-10-28. Scott found it "too Claude-y" and wants a fresh start. Keep only content and pages from it.

## Evidence on Hand

- Case studies: TechFix SMS (2025, +100% engagement YoY, 10 admin hours/week recovered), Morphose (2019 to 2022, HIPAA 3D physical therapy platform, 850+ animations, solo developer), CGM visualization at Estenda Solutions (2019, BLE to cloud pipeline, pharma customer).
- Free skills: Calculus Tutor, Ticket-Driven Dev Harness, Persona Exorcist, Magical Service Design (sources in `src/data/`).
- Notes: one published note in `src/content/notes/`.
- Background: founder of Ravenview Services (2016), four AWS AI/ML certifications (2025), conference talks at Big Sky Dev Con and Carolina Code Conference.
- No testimonials, client logos, or photography of Scott exist in the repo. Do not invent them.

## Product Principles

- Show the real thing: the skill's source, the outcome's number, the actual note.
- Free means free: no gate, no upsell between a visitor and the download.
- Plain words over persuasion.
- Every page is findable and citable by search and AI engines.
