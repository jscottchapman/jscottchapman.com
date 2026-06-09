# Testing reference

How to detect the repo's test stack and write tests that match it. Phase 0 detects the framework; Phase 2 writes the tests. The goal is to fit the repo's existing conventions, never to impose a framework it does not use.

## Contents
- [Detecting the test stack](#detecting-the-test-stack)
- [Unit / integration frameworks](#unit--integration-frameworks)
- [End-to-end / browser frameworks](#end-to-end--browser-frameworks)
- [Enabling browser automation tools](#enabling-browser-automation-tools)
- [When there is no test layer](#when-there-is-no-test-layer)

---

## Detecting the test stack

Look for config files and manifest entries, not just guesses:

| Signal | Framework |
|--------|-----------|
| `playwright.config.*`, `@playwright/test` in deps | Playwright (e2e) |
| `cypress.config.*`, `cypress` in deps | Cypress (e2e) |
| `vitest.config.*`, `vitest` in deps | Vitest (unit) |
| `jest.config.*`, `jest` in deps | Jest (unit) |
| `pytest.ini`, `pyproject.toml [tool.pytest]`, `conftest.py` | pytest (Python) |
| `.rspec`, `spec/` with `*_spec.rb` | RSpec (Ruby) |
| `*_test.go` files | Go testing |
| `vendor/bin/phpunit`, `phpunit.xml` | PHPUnit (PHP) |

Identify two layers separately: a **unit/integration** layer and an optional **end-to-end/browser** layer. A repo may have one, both, or neither. Always read a couple of existing test files before writing new ones, so you copy local helpers, fixtures, setup/teardown, and naming.

Run tests through the detected package manager / runner:

```bash
# JS/TS examples (use the detected manager: pnpm | npm | yarn | bun)
pnpm test                      # unit
pnpm exec playwright test      # e2e, all projects
pnpm exec playwright test path/to/file.spec.ts
pnpm exec playwright test --project="Desktop Chrome"
pnpm exec playwright test --headed

# Other stacks
pytest -q
bundle exec rspec
go test ./...
```

---

## Unit / integration frameworks

- Put new tests where the repo already keeps them (`__tests__/`, `*.test.ts`, `spec/`, `tests/`).
- Test behavior and logic, not the framework or implementation details.
- Cover happy path, error cases, and the edge cases named in the plan.
- For data-layer code (ORM queries, row-level security, migrations), test the query/permission logic and the expectations around it.

---

## End-to-end / browser frameworks

The high-value rule: **test user journeys, not DOM presence.** "User can complete checkout" beats "the button renders."

- **Roles:** detect the app's user roles (auth guards, route middleware, permission checks) and write a journey per role the feature touches.
- **States:** loading, empty, success, error, auth-required.
- **Viewports:** if the e2e config defines multiple projects/viewports (desktop and mobile), exercise both.
- **Dependent flows:** use the framework's serial/ordered mode for multi-step journeys that build on prior state (e.g. Playwright `test.describe.serial()`).
- **Fixtures and helpers:** reuse the repo's sign-in helpers, seed/cleanup utilities, and email-capture helpers (Mailpit, Mailhog) rather than reinventing them.

Read the existing e2e config to learn the base URL, global timeout, per-action timeout, pre-seeded auth state (storageState), and which browser projects exist. Mirror those settings instead of hardcoding new ones.

---

## Enabling browser automation tools

End-to-end work and visual smoke tests need a browser the agent can drive. In priority order:

1. **A Playwright MCP server** (or the repo's own browser-automation MCP) if one is configured. Some repos gate this behind a swap-in config file (for example copying a `.mcp.testing.json` into place); if you see such a pattern, use it, and restore the default config after the PR is opened so future sessions do not auto-launch browsers.
2. **The framework's own runner** (`playwright test`, `cypress run`) for writing and running the actual spec files. You do not need an MCP server to author and run Playwright/Cypress tests, only to drive a browser interactively during a smoke test.
3. **curl / HTTP checks** when the change is API-only and no browser is needed.

Keep browser tooling opt-in. Do not leave a testing MCP config active in the repo after you finish, or unrelated future sessions will pay the cost of launching browsers.

---

## When there is no test layer

If the repo has no test framework at all:

- Do not silently skip testing. Tell the human, and propose the lightest framework that fits the stack (for a JS repo, Vitest for unit and Playwright for e2e are reasonable defaults).
- If the human does not want to add a framework, fall back to a documented manual test plan in the PR body and a smoke test against the running app, and call out the regression risk explicitly in Phase 4.
