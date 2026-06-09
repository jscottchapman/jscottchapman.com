---
name: ticket-driven-dev-harness
description: >-
  Orchestrates a ticket-to-PR development cycle using a test-first loop (plan, then tests, then implementation, then evaluation), built GAN-style so the tests (the evaluator) are written BEFORE the code (the generator), and right-sized so a one-line fix gets a one-line plan while a big feature gets full rigor. Use this whenever implementing a feature, bug fix, refactor, or improvement that comes from an issue tracker (Linear, GitHub Issues, or Jira) or from a pasted ticket or spec, even if the user never says the word "harness". Triggers on phrases like "implement ABC-123", "work on this ticket", "pick up issue 45", "start a dev cycle", "run the harness", "build this feature", "fix this bug". Auto-detects the tracker, test framework, package manager, and target branch from the repo, writes the failing test first, gets a quick human nod on scope and coverage, implements to pass, checks the result against the ticket's acceptance criteria (not vibes), then opens a PR that closes the ticket.
---

# Ticket-Driven Development Harness

A repo-agnostic harness for turning a ticket into a reviewed, test-backed pull request. It works against any issue tracker and any test stack because it detects the environment first and adapts, rather than hardcoding one workflow.

## The core idea

This is a **generator-evaluator loop where the evaluator is built first**. In a GAN, a generator produces candidates and an evaluator judges them. Here the generator is the implementation code and the evaluator is the test suite plus a grading rubric. Writing the evaluator before the generator is what forces honesty: if tests are written after the code, they only confirm what was built instead of specifying what should be built.

```
TICKET -> PLAN -> TESTS (human review) -> IMPLEMENT -> EVALUATE -> PR
```

The human is the quality gate between phases. They catch scope drift and missing user journeys that an automated evaluator cannot see.

---

## Match the ceremony to the ticket

The default is light. Most tickets are small, and a one-line fix does not need a five-section spec, a multi-role test matrix, and a formal scored rubric. Ceremony that outweighs the work wastes time and, worse, trains people to skip the harness entirely. So scale the process to the ticket. The discipline never disappears (you still detect the environment, still write the test before the fix, still get a quick human nod, still check your own work honestly), only the paperwork scales.

Pick a size as you scope the ticket in Phase 1:

- **Trivial** (a one-liner, a copy change, an obvious bug with a clear repro, a small refactor with no behavior change): the plan is a sentence or two. One focused test (for a bug, the failing repro). A single quick checkpoint that bundles "here is the fix and the test I will add, ok?". Skip the scored rubric: a one-line honest check against the acceptance criteria is enough. Do not invent out-of-scope decision points or edge cases the ticket did not raise.
- **Standard** (a feature or fix touching a few files, more than one state or role): the full loop below, right-sized. This is the common case.
- **Substantial** (spans many files or roles, touches data migrations, or is risky or hard to reverse): full rigor, separate checkpoints, the scored rubric, and consider splitting the ticket if the plan balloons.

When in doubt, start light and escalate. It is cheap to add rigor once you discover a ticket is bigger than it looked, and expensive to make someone sit through ceremony they did not need. The human can move this dial at any time ("be thorough", "this is high-risk, full rigor", or "just fix it"), and a repo can set its own default in its contributor docs. These are sane defaults, not a cage.

---

## Phase 0: Detect the project

Before any work, figure out what kind of repo this is. Do this quickly and quietly, then state your conclusions in one short block so the human can correct you. Detection beats assumption: the same skill should work in a Next.js + Linear repo, a Rails + Jira repo, and a Go + GitHub Issues repo.

Detect these five things. `references/trackers.md` has the exact commands and ID conventions for each tracker; `references/testing.md` covers test frameworks and browser automation.

1. **Issue tracker.** Match the ticket reference the user gave you against tracker conventions, then confirm a working CLI exists:
   - An ID like `ABC-123` points to Linear or Jira. A bare `#123` points to GitHub Issues.
   - Check `git remote -v` (a github.com remote means `gh` is likely the tracker) and which CLIs are installed (`command -v linear`, `command -v gh`, `command -v jira`).
   - If the user pasted a description or pointed at a markdown file instead of an ID, there is no tracker: treat the pasted text as the ticket and skip tracker CLI calls.
   - When two trackers are plausible, prefer the one whose ID format matches the user's reference. If still ambiguous, ask.

2. **Test framework.** Read the manifest and look for config files: `package.json` devDependencies plus `playwright.config.*`, `vitest.config.*`, `jest.config.*`, `cypress.config.*` for JS/TS; `pytest`/`pyproject.toml` for Python; `*_spec.rb`/`.rspec` for Ruby; `go test` for Go. Note whether there is an end-to-end/browser layer (Playwright, Cypress) in addition to a unit layer.

3. **Package manager / task runner.** Infer from the lockfile: `pnpm-lock.yaml` -> pnpm, `package-lock.json` -> npm, `yarn.lock` -> yarn, `bun.lockb` -> bun. For non-JS repos use the native runner (`make`, `bundle exec`, `uv`/`poetry`, `go`).

4. **Dev server command.** Look at the manifest scripts (`dev`, `start`, `serve`) or a `Procfile`/`docker-compose.yml`. You need this for the smoke test in Phase 3.

5. **Target branch.** Use `git symbolic-ref refs/remotes/origin/HEAD` or fall back to the obvious default (`main`, then `master`, then `dev`). Confirm with the human if the repo uses an unusual integration branch.

Then sync with the target branch so you never start on stale code:

```bash
git checkout <target-branch> && git pull origin <target-branch>
```

State your detected setup compactly, for example:
> Detected: Linear (linear CLI), Playwright + Vitest, pnpm, dev server `pnpm dev`, target branch `dev`. Correct me if any of that is wrong.

---

## Phase 1: PLAN (expand the ticket)

### Fetch the ticket

Pull the full ticket using the detected tracker's CLI (see `references/trackers.md`). Extract:

- **Title and description** (what needs to be built)
- **Labels / type** (bug, feature, improvement) which drives the test strategy
- **Acceptance criteria** if present, which become test assertions
- **Linked issues** for scope boundaries

If there is no tracker, treat the pasted text as the ticket and derive the same fields from it.

### Scope the work

Produce a brief spec, not a novel, answering:

1. **What changes?** The files and components that will be touched.
2. **What does not change?** Explicit scope boundaries to prevent drift.
3. **User journeys affected.** Think from the perspective of each role your app actually has (detect these from the codebase: auth roles, route guards, permission checks). What does each type of user do with this feature?
4. **Edge cases.** Empty states, error states, auth boundaries, mobile vs desktop, concurrency.
5. **Acceptance criteria.** Restate from the ticket or derive them. These must be testable assertions, not vibes.

For a trivial ticket this collapses to a sentence or two: what you will change and how you will prove it. The five-part structure is the ceiling for standard and substantial work, not a form to complete for every ticket. Match the depth to the size you picked above.

### Present the plan to the human

> Here is my plan for {ticket}. Before I write tests, does this scope look right? Anything missing from the user journeys or edge cases?

**Do not proceed until the human approves the plan.**

For a trivial ticket, fold this into one lightweight confirmation that also names the test you will write ("I will add a failing test for X, then the one-line fix, ok?"), so the human approves scope and coverage in a single step instead of two separate checkpoints.

---

## Phase 2: TEST-FIRST (write tests before code)

### Choose a strategy by ticket type

| Type | Unit tests | End-to-end tests | Focus |
|------|-----------|------------------|-------|
| Bug | Reproduce the bug as a failing test | If the bug is UI-visible | Regression prevention |
| Feature | Core logic | Full user journey | Coverage of all states |
| Improvement | Changed behavior | If the UX changes | Before/after behavior match |

Adapt to what the repo actually has. If there is no end-to-end layer, write strong unit/integration tests and note the gap rather than forcing a framework the repo does not use. See `references/testing.md` for detection and per-framework conventions, including enabling browser automation tools.

### Write unit/integration tests

- Place them where the repo's existing tests live and follow local naming conventions.
- Test the logic, not the framework.
- Cover happy path, error cases, and the edge cases from your plan.

### Write end-to-end tests as user journeys, not DOM assertions

This is the part that usually gets skipped, and it is the most valuable part. Scale it to the change: a trivial single-surface fix needs one focused test, not a role-by-role, viewport-by-viewport matrix. Multi-role and multi-viewport journeys are for work that actually spans roles and viewports.

1. **Think like a user, not a developer.** Test "a user can upload a file and see it in their library", not "the upload button renders".
2. **Cover every relevant role.** If the feature affects more than one kind of user, write a journey for each.
3. **Test all states:** loading, empty, success, error, auth-required.
4. **Test mobile and desktop** if the repo's e2e config supports multiple viewports.
5. **Use serial/dependent flows** for multi-step journeys that build on prior state.
6. **Match existing patterns.** Read the current test files first and mirror their helpers, fixtures, and structure. Consistency matters more than your personal preference.

### Present the tests to the human

> Here are the tests for {ticket}. They cover {list the journeys}. Before I implement, is this coverage complete? Any user scenarios I am missing?

**Do not proceed to implementation until the human approves the test coverage.** (On a trivial ticket you already bundled this into the single Phase 1 confirmation, so there is no second checkpoint here, just write the one test and go.)

---

## Phase 3: IMPLEMENT (generate code to pass the tests)

1. **Run the tests first. They should fail.** If they pass before you write code, they are not testing anything new.
2. **Implement the minimum code to pass.** Do not gold-plate.
3. **Re-run tests after each significant change** to track progress.
4. **If a test needs to change** because reality does not match an assumption, flag it to the human before changing it. Never silently weaken a test to make it green.

### Smoke test against a running app

Automated tests miss misconfigurations, missing env vars, build errors, and visual regressions. Before trusting the suite:

1. Start the detected dev server.
2. Exercise the actual feature or fix (curl an endpoint, hit a page, use browser automation).
3. Watch for console errors, failed requests, and unexpected behavior.
4. Stop the server.

If the server cannot start (missing external dependency, no database), note that and continue with the automated tests.

### Implementation checklist

- [ ] Smoke tested against a running dev server (when possible)
- [ ] All unit/integration tests pass
- [ ] All end-to-end tests pass on every configured viewport
- [ ] No type errors (if the stack is typed)
- [ ] No new lint warnings
- [ ] Existing tests still pass (regression check)

---

## Phase 4: EVALUATE (grade against the ticket)

Grade against the original ticket, not your own sense of "done." The point of this phase is to catch what the generator missed, so be skeptical of your own work.

For trivial work, skip the scored table: do a one-line honest check that each acceptance criterion is met and that you did not break anything nearby, then move on. The formal rubric below earns its keep on standard and substantial tickets, where there is enough surface area for real self-deception.

Score each dimension 1 to 5:

| Dimension | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|-----------|----------|----------------|---------------|
| **Ticket completion** | Missing acceptance criteria | All criteria met | Criteria met plus edge cases handled |
| **User journey coverage** | Only happy path | Main flows for all roles | All states, all roles, all viewports |
| **Regression safety** | No tests added | Tests cover new code | Tests prevent this class of bug |
| **Code quality** | Breaks conventions | Follows local patterns | Improves the patterns |

Rules:

- **A score of 1 on any dimension means do not proceed.** Fix it.
- **An average below 3 means another implementation pass.**
- Ask yourself: "If I were reviewing someone else's PR, what would I flag?"

Present the scores with brief justification, any concerns, and a recommendation: ship, iterate, or rethink.

---

## Phase 5: PR (open the pull request)

Only after evaluation passes. Use the tracker's conventions (see `references/trackers.md` for the exact branch and closing-keyword syntax per tracker):

1. **Branch name** that the tracker can auto-link to the ticket (for example `abc-123/short-description` for Linear, or any clear name plus a closing keyword in the PR body for GitHub/Jira).
2. **Commit message** referencing the ticket ID.
3. **PR body** containing the tracker's auto-close keyword (`Fixes ABC-123`, `Closes #123`) so merging the PR resolves the ticket, plus a test plan listing the journeys and unit tests added.
4. **Ask the human before pushing.**

---

## Anti-patterns to avoid

1. **Writing tests after the code.** This defeats the entire architecture. Tests become confirmations instead of specifications.
2. **Low-level DOM assertions.** "Button exists" is worthless. "User can complete checkout" is valuable.
3. **Skipping the human checkpoints.** The human catches scope drift the evaluator cannot.
4. **Silently weakening tests.** A test that needs to change is a signal worth discussing.
5. **Scope creep.** Implement only what the ticket asks. File new tickets for adjacent work.
6. **Lenient self-evaluation.** If you are scoring yourself 5/5 on everything, you are not actually evaluating.
7. **Assuming the stack.** Always run Phase 0. A skill that hardcodes one tracker or one test runner is brittle.
8. **Over-ceremony on trivial work.** A five-part spec and a scored rubric for a one-line fix is its own anti-pattern. It wastes time and pushes people to bypass the harness. Right-size: keep the discipline, drop the paperwork.

---

## Reference files

- `references/trackers.md` — per-tracker CLI commands, ID formats, branch naming, and PR auto-close keywords for Linear, GitHub Issues, and Jira, plus the no-tracker fallback.
- `references/testing.md` — detecting the test framework, conventions per framework, and enabling browser automation for end-to-end tests.
