---
name: ticket-driven-dev-harness
description: Orchestrates a GitHub-issue-to-PR development cycle for jscottchapman.com (Astro static site on Vercel) using a plan-test-implement-evaluate loop. Use when implementing features or fixes from a GitHub issue (e.g. "work on #12", "implement issue 12", "start dev cycle", "pick up the next issue", "run the harness"). Fetches the issue, writes Playwright smoke tests first, gets human approval on coverage, then implements code to pass them. Evaluator grades against the issue's acceptance criteria, not vibes.
---

# Ticket-Driven Development Harness (jscottchapman.com)

This is the project-local adaptation of Scott's [ticket-driven-dev-harness]. The
original targets Music Unincorporated (Next.js + Supabase + Linear). This site is
different, so the harness is adapted to match reality here:

| Axis | MU original | This project |
|------|-------------|--------------|
| Ticket source | Linear (`MUS-*`) | **GitHub Issues** (`gh issue view N`) |
| Stack | Next.js + Supabase | **Astro static site on Vercel** |
| Tests | Vitest + full Playwright E2E | **Playwright smoke only** (`npm test`) |
| Target branch | `dev` | **`main`** |
| Ship model | branch + PR | **branch + PR per issue** (Vercel previews) |

Everything else — the test-first discipline, the human checkpoints, the
skeptical self-evaluation — carries over unchanged.

## When This Skill Activates

- User references a GitHub issue ("work on #12", "implement issue 12")
- User says "start dev cycle", "pick up a ticket", "work on the next issue"
- User asks to implement a feature/fix and an issue exists for it
- User says "run the harness" or "ticket-driven" workflow

**No issue yet?** If the user describes work with no issue, offer to create one
first (`gh issue create`) so there's a ticket to drive the cycle and a target for
`Fixes #N`. For genuinely trivial one-line changes the user can opt out, but the
default is: ticket first.

## Architecture

A three-phase generator-evaluator loop where the evaluator (tests) is written
BEFORE the generator (implementation). The human is the quality gate between phases.

```
GITHUB ISSUE → PLAN → TESTS (human review) → IMPLEMENT → EVALUATE → PR
```

---

## Phase 1: PLAN (Expand the Ticket)

### Step 0: Sync with main

```bash
git checkout main && git pull origin main
```

Never start work on stale code.

### Step 1: Fetch the issue

```bash
gh issue view {number}
```

Extract: title and body (what to build), labels (bug/feature/improvement —
determines focus), acceptance criteria (if present, these become test assertions),
linked issues (scope context).

### Step 2: Scope the work

Produce a brief spec (NOT a novel) answering:

1. **What changes?** — files/components/pages touched
2. **What doesn't change?** — explicit scope boundaries to prevent drift
3. **Pages/journeys affected** — which pages or flows does this touch? Think as a
   visitor: a recruiter skimming Work, someone reading a Note, someone signing up
   for a Skill via the email gate.
4. **Edge cases** — empty states, broken links, mobile vs desktop, OG/meta
   correctness, build-time failures, console errors
5. **Acceptance criteria** — restate from the issue or derive. Must be testable
   assertions, not vibes.

### Step 3: Present plan to human

> "Here's my plan for #{number}. Before I write tests, does this scope look right?
> Anything missing from the pages affected or edge cases?"

**Do NOT proceed until the human approves the plan.**

---

## Phase 2: TEST-FIRST (Write Smoke Tests Before Code)

This is a content site, so "tests" means **Playwright smoke tests** that assert
the visitor-facing result, not DOM trivia. The suite lives in `tests/`, runs with
`npm test`, and auto-builds + serves the site via Playwright's `webServer`.

### Strategy by issue type

| Label | Focus |
|-------|-------|
| Bug | Reproduce the broken behavior as a failing smoke assertion, then fix |
| Feature | Cover the new page/section: it renders, key content present, no console errors, links work |
| Improvement | Assert the before/after visitor-visible change |

### Rules for good smoke tests

1. **Assert what a visitor sees**, not implementation. "The Skills page shows the
   email signup" beats "a `<form>` element exists."
2. **Cover the states that matter for a static site:** page returns 200 / builds,
   expected heading/content renders, primary nav works, no `console.error`, OG/meta
   and canonical are correct when the change touches them.
3. **Mobile and desktop** — the Playwright config defines both a Desktop Chrome and
   a Mobile Safari project. UI/layout changes should pass on both.
4. **Match existing patterns** — look at the specs already in `tests/` for
   conventions (the `pageLoadsCleanly` helper, the page list, console-error capture).
5. **Keep it smoke, not E2E** — there's no backend. Don't mock Kit/ConvertKit;
   assert the signup form is present and points at the right action, not that an
   email actually sends.

### Present tests to human

> "Here are the smoke tests I've written for #{number}. They cover [list].
> Before I implement, does this coverage look complete? Any visitor scenario I'm
> missing?"

**Do NOT proceed to implementation until the human approves the coverage.**

---

## Phase 3: IMPLEMENT (Generate Code to Pass Tests)

1. **Run the tests first — they should fail.** `npm test`. If they pass before you
   write code, they aren't testing anything new.
2. **Implement the minimum** to pass them. Do not gold-plate.
3. **Re-run tests after each significant change** to track progress.
4. **If a test must change** because an assumption was wrong, flag it to the human
   before changing it. Never silently weaken a test.

### Smoke test against a running server

Before the full suite, verify end-to-end against a real server:

1. `npm run dev` (or `npm run build && npm run preview` for the production build)
2. Hit the changed page (browser tools, MCP browser automation, or `curl`)
3. Check for console errors, failed requests, broken layout
4. Stop the server

### Implementation checklist

- [ ] Smoke tested against a running dev/preview server
- [ ] `npm run build` completes clean (this is the real gate for a static site)
- [ ] `npm test` passes on Desktop Chrome
- [ ] `npm test` passes on Mobile Safari
- [ ] No new console errors on touched pages
- [ ] Existing pages still build and render (regression check)

---

## Phase 4: EVALUATE (Grade Against the Issue)

Evaluate against the original issue — NOT your own sense of "done."

### Rubric (score each 1-5)

| Dimension | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|-----------|----------|----------------|----------------|
| **Issue completion** | Missing acceptance criteria | All criteria met | Criteria exceeded, edge cases handled |
| **Visitor coverage** | Only happy path | Main pages/flows | All states, mobile + desktop, meta/OG correct |
| **Regression safety** | No tests added | Tests cover the change | Tests prevent this bug class recurring |
| **Code quality** | Breaks conventions | Follows patterns (Base layout, voice rules) | Improves patterns |

### Rules

- **Score of 1 on any dimension = do not proceed.** Fix it.
- **Average below 3 = another implementation pass.**
- **Be skeptical of your own work.** Ask: "If I were reviewing this PR, what would I
  flag?" Watch the voice rules — no em-dashes, "J Scott Chapman" never "J. Scott".

### Present evaluation to human

Show the scores with brief justification, areas of concern, and a recommendation:
ship, iterate, or rethink.

---

## Phase 5: PR (Create the Pull Request)

Only after evaluation passes:

1. Branch named `issue-{number}/{short-description}`
2. Commit referencing the issue: `#{number}: {description}` (end commit body with
   the standard `Co-Authored-By` trailer)
3. Open the PR with:
   - Title referencing the issue
   - Body including `Fixes #{number}` so the issue auto-closes on merge
   - A test plan listing the smoke tests added
   - The standard `🤖 Generated with [Claude Code]` footer
4. **Ask the human before pushing.** (Established preference.)

Vercel builds a preview deployment for the branch automatically. Share that
preview URL in the PR for visual review before merge.

---

## Anti-Patterns to Avoid

1. **Writing tests after code** — they become confirmations, not specifications.
2. **DOM-trivia tests** — "nav element exists" is worthless; "visitor can get from
   the homepage to a Skill signup" is valuable.
3. **Skipping the human checkpoint** — the human catches scope drift the evaluator can't.
4. **Silently weakening tests** — a test that needs to change is worth discussing.
5. **Scope creep** — implement only what the issue asks. File new issues for adjacent work.
6. **Lenient self-evaluation** — straight 5/5 means you're not looking hard enough.
7. **Committing straight to main** — every issue gets a branch and a PR here.

---

## Quick Reference: GitHub Issue CLI

```bash
# View an issue
gh issue view {number}

# List open issues
gh issue list

# Create an issue (when none exists yet)
gh issue create --title "..." --body "..."

# Create the PR
gh pr create --title "#{number}: ..." --body "Fixes #{number}\n\n..."
```

## Quick Reference: Running Tests

```bash
npm test                                   # all smoke tests, all projects
npm test -- --project="Desktop Chrome"     # desktop only
npm test -- --project="Mobile Safari"      # mobile only
npm run test:headed                        # watch it run in a visible browser
```
