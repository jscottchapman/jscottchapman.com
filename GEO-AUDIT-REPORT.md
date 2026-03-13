# GEO/SEO/AEO Audit Report
## jscottchapman.com (currently at jscottchapmancom.vercel.app)
### Audit Date: 2026-03-12

---

## Executive Summary

**Composite GEO Score: 31/100**

The site has strong content fundamentals -- authentic voice, real case studies with quantified results, and genuine expertise signals. However, it is missing nearly every technical SEO element, has zero structured data, no AI crawler accessibility files, and no optimization for generative engine platforms. The content quality is high but invisible to machines.

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability & Visibility | 42/100 | 25% | 10.5 |
| Brand Authority Signals | 45/100 | 20% | 9.0 |
| Content Quality & E-E-A-T | 58/100 | 20% | 11.6 |
| Technical Foundations | 18/100 | 15% | 2.7 |
| Structured Data | 0/100 | 10% | 0.0 |
| Platform Optimization | 12/100 | 10% | 1.2 |
| **COMPOSITE** | | | **35/100** |

---

## Phase 2: Detailed Analysis

---

### 1. AI Citability Scoring: 42/100

#### Answer Block Quality (30% weight) -- Score: 45/100

**Strengths:**
- Case studies use answer-first structure ("I dug in and discovered the real problem...")
- Quantified results present: "2x student engagement", "98%+ SMS delivery rate", "10 hrs/wk admin time saved", "850+ interactive 3D exercise animations"
- Services section provides clear capability definitions

**Weaknesses:**
- No definition patterns ("X is..." or "X means...")
- No FAQ section with explicit question-answer pairs
- Content uses conversational/narrative style rather than extractable answer blocks
- No bullet-point summaries of key claims
- AI systems will struggle to extract clean factual snippets

#### Passage Self-Containment (25% weight) -- Score: 50/100

**Strengths:**
- "J. Scott Chapman" is named explicitly in the hero
- Case studies name the client/project (TechFix, Morphose, Estenda Solutions)
- Most paragraphs can stand alone conceptually

**Weaknesses:**
- Heavy use of first-person pronouns ("I build", "I dug in", "I hold") without restating the subject name -- AI models extracting passages lose context about WHO
- No re-identification patterns (e.g., "Chapman, a product engineer based in Montana, built...")
- No location mentioned anywhere on the page (city, state, timezone)
- No "About J. Scott Chapman" style introductory definition passage

#### Structural Readability (20% weight) -- Score: 55/100

**Strengths:**
- Clean H1 > H2 > H3 hierarchy (H1: name, H2: sections, H3: subsections)
- H4 used for tech stack categories
- Semantic HTML: `<article>`, `<section>`, `<blockquote>`, `<cite>`, `<main>`, `<nav>`, `<footer>`
- Paragraph lengths are reasonable (2-4 sentences)

**Weaknesses:**
- No bulleted or numbered lists anywhere on the page
- No tables
- Tech stack is in paragraph form rather than structured lists
- Certifications listed in prose instead of a structured list
- No summary/TL;DR blocks

#### Statistical Density (15% weight) -- Score: 35/100

**Named entities per ~800 words of content:**
- Companies: TechFix, ATG, Morphose, Estenda Solutions, Montana Code Girls
- Technologies: ~25 named technologies
- Conferences: Big Sky Dev Con, Carolina Code Conference
- Certifications: 4x AWS AI/ML certs, ITIL Foundation
- University: Western Governors

**Numbers/stats:**
- "2x student engagement"
- "98%+ SMS delivery rate"
- "10 hrs/wk admin time saved"
- "850+ interactive 3D exercise animations"
- "Ten years ago"
- "pack and a half a day"

**Weaknesses:**
- Only ONE case study has quantified results (TechFix)
- Morphose and CGM case studies have zero metrics
- No dates on any case studies
- No revenue/user/scale numbers
- No "years of experience" as a number (says "ten years" in prose)

#### Uniqueness & Original Data (10% weight) -- Score: 30/100

**Strengths:**
- TechFix case study is original and detailed
- Personal narrative (nuclear plant to coding) is unique
- Real client testimonial with attribution

**Weaknesses:**
- Only one testimonial
- No original frameworks, methodologies, or named approaches
- No blog posts, talks, or linked original content
- No portfolio screenshots or demos
- Morphose and CGM studies lack depth comparable to TechFix

---

### 2. Technical SEO: 18/100

#### Present:
- `<html lang="en">` -- language declared
- `<meta charset="UTF-8">` -- character encoding
- `<meta name="viewport">` -- mobile viewport
- `<title>` tag -- "J. Scott Chapman | Product Engineer"
- `<meta name="description">` -- present and reasonable
- Semantic HTML (`main`, `nav`, `section`, `article`, `blockquote`, `cite`, `footer`)
- HTTPS (via Vercel)
- Content is server-rendered static HTML (good for crawlers)

#### MISSING (Critical):
- **No `robots.txt`** -- 404. AI crawlers and search engines have no crawl directives
- **No `sitemap.xml`** -- 404. Search engines cannot discover pages
- **No `llms.txt`** -- 404. AI systems have no structured site summary
- **No canonical URL** (`<link rel="canonical">`) -- duplicate content risk between vercel.app and future jscottchapman.com
- **No favicon** (`<link rel="icon">`) -- no brand in browser tabs or bookmarks
- **No Open Graph tags** (`og:title`, `og:description`, `og:image`, `og:url`) -- no social preview cards
- **No Twitter Card tags** (`twitter:card`, `twitter:title`, etc.)
- **No JSON-LD structured data** -- zero schema markup
- **No `rel="noopener"` or `target="_blank"` on external links**
- **No hreflang** (single language, minor issue)
- **No preload for critical CSS** (fonts are preconnected, good)

#### Performance Notes:
- 6 Google Fonts loaded (JetBrains Mono, Space Grotesk, Pacifico, Quicksand, Press Start 2P, Righteous) -- only 2 are used per theme. This is a significant render-blocking penalty
- No `font-display: swap` visible in the Google Fonts URL
- CSS `* { transition }` rule forces layout recalculation on every element

---

### 3. E-E-A-T Assessment: 58/100

#### Experience (15/25)
**Present:**
- First-person account of career transition (nuclear plant to software)
- Detailed case study narratives showing hands-on work
- Real client quote with attribution

**Missing:**
- No dates on projects (when was this work done?)
- No project duration indicators
- Only 3 case studies, only 1 with measurable outcomes
- No process documentation ("here's how I approach...")

#### Expertise (18/25)
**Present:**
- 4 AWS AI/ML certifications mentioned
- ITIL Foundation certification
- CS degree in progress at Western Governors
- Conference speaking (Big Sky Dev Con, Carolina Code Conference)
- Teaching at Montana Code Girls
- Technical depth in descriptions (BLE, HIPAA, GraphQL)

**Missing:**
- Certifications not linked or verifiable (no badge URLs)
- No publication list
- No links to talks or slides
- No GitHub project descriptions (just a link)

#### Authoritativeness (10/25)
**Present:**
- Conference speaking credentials
- Client testimonial
- Teaching role

**Missing:**
- Only 1 testimonial
- No media mentions
- No industry association memberships
- No thought leadership content (blog, newsletter, podcast)
- No backlink-worthy content on the page
- No professional headshot or personal brand imagery

#### Trustworthiness (15/25)
**Present:**
- HTTPS (via Vercel)
- Real email address (scott@jscottchapman.com)
- GitHub and LinkedIn profiles linked
- Real client name attributed to testimonial

**Missing:**
- No physical location / service area
- No privacy policy (not critical for a personal site, but helps)
- No professional headshot
- External links lack `rel="noopener noreferrer"`

---

### 4. Schema / Structured Data Analysis: 0/100

**Current state:** Zero JSON-LD or microdata markup of any kind.

#### Recommended Schema (to be added):

**1. Person Schema (primary)**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "J. Scott Chapman",
  "jobTitle": "Product Engineer",
  "url": "https://jscottchapman.com",
  "email": "scott@jscottchapman.com",
  "sameAs": [
    "https://github.com/JScottChapman",
    "https://linkedin.com/in/jscottchapman"
  ],
  "knowsAbout": [
    "Product Engineering",
    "AI & Machine Learning",
    "Healthcare Technology",
    "Full-Stack Development",
    "AWS",
    "React",
    "Next.js",
    "Node.js",
    "HIPAA Compliance"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certification",
      "name": "AWS Certified Machine Learning"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certification",
      "name": "ITIL Foundation"
    }
  ],
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Western Governors University"
  }
}
```

**2. WebSite Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "J. Scott Chapman",
  "url": "https://jscottchapman.com",
  "description": "J. Scott Chapman builds software that solves real problems. Healthcare platforms, AI-powered products, and data-driven systems that actually work."
}
```

**3. ProfilePage Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "J. Scott Chapman"
  },
  "dateModified": "2026-03-12"
}
```

**4. Organization Schema (for consulting practice)**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "J. Scott Chapman Consulting",
  "founder": {
    "@type": "Person",
    "name": "J. Scott Chapman"
  },
  "serviceType": [
    "Product Engineering",
    "AI & Machine Learning Consulting",
    "Healthcare Technology Development"
  ],
  "url": "https://jscottchapman.com"
}
```

---

### 5. AI Crawler Access: 5/100

**robots.txt:** MISSING (404)
**sitemap.xml:** MISSING (404)
**llms.txt:** MISSING (404)

All three files are completely absent. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot) have no directives and no structured content summary.

#### Recommended robots.txt:
```
User-agent: *
Allow: /

# AI Crawlers - explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: ChatGPT-User
Allow: /

Sitemap: https://jscottchapman.com/sitemap.xml
```

#### Recommended llms.txt:
```
# J. Scott Chapman

> Product Engineer specializing in healthcare platforms, AI-powered products, and full-stack systems.

## About

J. Scott Chapman is a product engineer who builds full-stack products from idea to launch. He holds four AWS AI/ML certifications, an ITIL Foundation cert, and is completing a CS degree at Western Governors University. He has spoken at Big Sky Dev Con and Carolina Code Conference, and teaches at Montana Code Girls.

## Specializations

- Product Engineering (full idea-to-launch lifecycle)
- AI & Machine Learning (AWS Bedrock, LLM Orchestration, Agentic Systems)
- Healthcare Technology (HIPAA-compliant platforms, medical device data pipelines)
- Systems Automation (onboarding, engagement campaigns, failover systems)

## Notable Projects

- TechFix SMS: Automated student engagement platform (2x engagement, 98%+ delivery, 10hrs/wk saved)
- Morphose: HIPAA-compliant 3D physical therapy platform (850+ exercise animations)
- Continuous Glucose Monitor: BLE-to-dashboard visualization for clinicians (Estenda Solutions)

## Contact

- Email: scott@jscottchapman.com
- GitHub: https://github.com/JScottChapman
- LinkedIn: https://linkedin.com/in/jscottchapman
- Website: https://jscottchapman.com
```

---

### 6. Platform-Specific Readiness

#### Google AI Overviews (AIO): 15/100
- No structured data for entity recognition
- No FAQ markup
- Content lacks the definition-style passages Google extracts for AI Overviews
- No canonical URL means Google may not index the preferred domain
- Strong: content is in static HTML (not client-rendered SPA)

#### ChatGPT Web Search (via Bing): 10/100
- No Bing Webmaster Tools submission evident
- No sitemap for Bing to discover
- No OG tags for rich previews
- GPTBot not addressed in robots.txt (file missing entirely)
- Content quality is good but discoverability is near zero

#### Perplexity: 10/100
- PerplexityBot has no robots.txt guidance
- No structured data to extract
- No llms.txt for quick summarization
- Content is well-written but lacks the structured answer blocks Perplexity prefers

#### Bing Copilot: 10/100
- Same issues as ChatGPT Web Search
- No schema markup for entity cards
- No Bing IndexNow or submission

---

## Phase 3: Prioritized Fixes

---

### CRITICAL (Do These First)

#### C1. Add robots.txt
**Impact:** Unlocks all search engine and AI crawler access.
**File:** `/robots.txt` (new file in project root)
**Effort:** 5 minutes

#### C2. Add sitemap.xml
**Impact:** Enables search engine page discovery.
**File:** `/sitemap.xml` (new file in project root)
**Effort:** 5 minutes
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jscottchapman.com/</loc>
    <lastmod>2026-03-12</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

#### C3. Add canonical URL tag
**Impact:** Prevents duplicate content between vercel.app and jscottchapman.com domains.
**File:** `index.html` -- add to `<head>`:
```html
<link rel="canonical" href="https://jscottchapman.com/">
```

#### C4. Add JSON-LD structured data
**Impact:** Enables AI systems and search engines to identify you as a named entity with credentials, services, and social profiles.
**File:** `index.html` -- add Person, WebSite, and ProfilePage schemas in a `<script type="application/ld+json">` block in `<head>`.
**Effort:** 15 minutes

---

### HIGH Priority

#### H1. Add Open Graph and Twitter Card meta tags
**Impact:** Social sharing previews, Bing rich results, AI system metadata extraction.
**File:** `index.html` -- add to `<head>`:
```html
<meta property="og:type" content="website">
<meta property="og:title" content="J. Scott Chapman | Product Engineer">
<meta property="og:description" content="I build healthcare platforms, AI-powered products, and data-driven systems that actually work.">
<meta property="og:url" content="https://jscottchapman.com/">
<meta property="og:image" content="https://jscottchapman.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="J. Scott Chapman | Product Engineer">
<meta name="twitter:description" content="I build healthcare platforms, AI-powered products, and data-driven systems that actually work.">
```
**Note:** Requires creating an OG image (1200x630px).

#### H2. Add llms.txt
**Impact:** Direct AI system summarization file. Increasingly adopted by AI search providers.
**File:** `/llms.txt` (new file in project root)
**Effort:** 10 minutes (content drafted above)

#### H3. Add favicon
**Impact:** Brand recognition in tabs, bookmarks, search results.
**File:** Add `<link rel="icon" href="/favicon.ico">` and generate favicon files.
**Effort:** 15 minutes

#### H4. Add location/service area
**Impact:** Local SEO, AI entity disambiguation, E-E-A-T trust signals.
**Where:** About section or footer. Example: "Based in Montana" or "Montana, USA".
**Also add to Person schema:** `"address": { "@type": "PostalAddress", "addressRegion": "MT", "addressCountry": "US" }`

#### H5. Convert certifications to a structured list
**Impact:** AI extractability, visual scanability, schema enrichment.
**Currently:** Buried in a prose paragraph.
**Recommended:** Add a dedicated "Credentials" section or convert to `<ul>` with individual `<li>` elements.

---

### MEDIUM Priority

#### M1. Add quantified results to Morphose and CGM case studies
**Impact:** AI citability, statistical density. Currently only TechFix has numbers.
**Examples:** Number of therapists using Morphose, patient outcomes, CGM reading accuracy, number of clinicians served.

#### M2. Add an FAQ section
**Impact:** Direct answer extraction for Google AIO, ChatGPT, Perplexity.
**Suggested questions:**
- "What does a product engineer do?"
- "What healthcare platforms has J. Scott Chapman built?"
- "What AWS certifications does J. Scott Chapman hold?"
Use `FAQPage` schema markup.

#### M3. Optimize Google Fonts loading
**Impact:** Page speed (Core Web Vitals), which affects search ranking.
**Current:** 6 font families loaded on every page load, but only 2 are used per theme.
**Fix:** Load only the active theme's fonts, or use `font-display=swap` parameter in the Google Fonts URL, and consider subsetting.
**Quick fix:** Add `&display=swap` to the Google Fonts URL.

#### M4. Add `rel="noopener noreferrer" target="_blank"` to external links
**Impact:** Security and SEO best practice for outbound links.
**Files:** `index.html` -- GitHub and LinkedIn links.

#### M5. Add a professional headshot / about image
**Impact:** E-E-A-T trust, Person schema `image` property, OG image personalization.

#### M6. Rewrite key passages for self-containment
**Impact:** AI citability. Replace pronoun-heavy passages with entity-named ones.
**Example:** Change "I build full-stack products from the ground up" to "J. Scott Chapman builds full-stack products from the ground up" in at least one passage (the meta description or an intro paragraph).

#### M7. Add dates to case studies
**Impact:** Freshness signals, AI context, E-E-A-T experience evidence.
**Even approximate:** "2024" or "2023-2024" is better than nothing.

---

### LOW Priority

#### L1. Add a blog or writing section
**Impact:** Long-term authority building, backlink generation, keyword coverage.
**Note:** Even 2-3 articles on topics like "building HIPAA-compliant platforms" or "agentic AI systems in production" would significantly boost authority.

#### L2. Link to conference talks
**Impact:** E-E-A-T authoritativeness. If slides or recordings exist for Big Sky Dev Con or Carolina Code Conference talks, link them.

#### L3. Add more testimonials
**Impact:** E-E-A-T trust. Request quotes from Morphose and Estenda Solutions contacts.

#### L4. Submit to Bing Webmaster Tools and Google Search Console
**Impact:** Direct indexing for the two platforms that power AI search (Google AIO + ChatGPT/Copilot via Bing).

#### L5. Add IndexNow support
**Impact:** Instant Bing/Yandex notification when content changes. Vercel may support this via plugin.

#### L6. Consider adding a `/humans.txt` file
**Impact:** Minor trust signal, but signals craftsmanship.

---

## Files to Create/Modify Summary

| File | Action | Priority |
|---|---|---|
| `robots.txt` | CREATE | Critical |
| `sitemap.xml` | CREATE | Critical |
| `llms.txt` | CREATE | High |
| `index.html` | MODIFY -- add canonical, OG tags, Twitter cards, JSON-LD, favicon link, structured lists | Critical + High |
| `favicon.ico` / `favicon.png` | CREATE (design needed) | High |
| `og-image.png` | CREATE (design needed, 1200x630) | High |

---

## Score Projection After Fixes

If all Critical and High items are implemented:

| Category | Current | Projected |
|---|---|---|
| AI Citability & Visibility | 42 | 60 |
| Brand Authority Signals | 45 | 62 |
| Content Quality & E-E-A-T | 58 | 68 |
| Technical Foundations | 18 | 72 |
| Structured Data | 0 | 75 |
| Platform Optimization | 12 | 55 |
| **Composite GEO Score** | **35** | **65** |

If Medium items are also completed, projected composite: **75/100**.

---

*Report generated 2026-03-12. Methodology: GEO/SEO/AEO audit framework covering AI citability, technical SEO, E-E-A-T assessment, structured data analysis, and platform-specific optimization.*
