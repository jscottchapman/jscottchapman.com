# Tracker reference

Per-tracker commands and conventions. Phase 0 of the skill detects which one applies. Use the matching section; ignore the rest.

## Contents
- [Detecting which tracker](#detecting-which-tracker)
- [Linear](#linear)
- [GitHub Issues](#github-issues)
- [Jira](#jira)
- [No tracker (pasted ticket)](#no-tracker-pasted-ticket)

---

## Detecting which tracker

Signals, in rough priority order:

1. **The ID the user gave you.**
   - `ABC-123` (letters, dash, number): Linear or Jira. Disambiguate by which CLI is installed and which remote/config exists.
   - `#123` or a full `github.com/.../issues/123` URL: GitHub Issues.
   - No ID, just prose or a file path: no tracker, use the pasted-ticket fallback.
2. **Installed CLI:** `command -v linear`, `command -v gh`, `command -v jira`.
3. **Repo signals:** `git remote -v` (github.com), a `.linear/` or Linear config, an Atlassian/Jira config file or `JIRA_*` env vars.

If two are plausible, prefer the one whose ID format matches the user's reference. If still unsure, ask the human one short question rather than guessing.

---

## Linear

ID format: `TEAM-123` (e.g. `MUS-123`, `ENG-45`). Linear's GitHub integration auto-links a branch when the issue ID is in the branch name, and auto-closes the issue when a merged PR body says `Fixes TEAM-123`.

```bash
# View a ticket (always use --no-pager in an agent context)
linear issue show TEAM-123 --no-pager

# List tickets by state
linear issue list --team TEAM --state started --all-assignees --sort priority --no-pager
linear issue list --team TEAM --state unstarted --sort priority --no-pager

# Move ticket through states
linear issue update TEAM-123 --state started
linear issue update TEAM-123 --state completed

# Cycles
linear cycle list --team TEAM --no-pager
```

- **Branch name:** `team-123/short-description` (lowercase id). The id in the branch is what triggers auto-link.
- **PR auto-close keyword:** put `Fixes TEAM-123` in the PR body.
- **Commit message:** prefix with `TEAM-123:`.

---

## GitHub Issues

ID format: `#123`. Use the `gh` CLI. Issues, PRs, and auto-close all live in GitHub, so this is the simplest end-to-end path.

```bash
# View an issue
gh issue view 123

# List issues
gh issue list --state open --limit 30
gh issue list --assignee @me --state open

# Comment / update state
gh issue comment 123 --body "..."
gh issue close 123

# Open a PR
gh pr create --title "Fix: ..." --body "Closes #123\n\n## Test plan\n- ..."
```

- **Branch name:** any clear name, e.g. `fix/short-description` or `123-short-description`. GitHub does not require the number in the branch, the closing keyword in the PR body does the linking.
- **PR auto-close keyword:** `Closes #123`, `Fixes #123`, or `Resolves #123` in the PR body.
- **Commit message:** reference the issue, e.g. `Fix login redirect (#123)`.

---

## Jira

ID format: `PROJ-123` (e.g. `ENG-456`). Common CLIs are `jira` (ankitpokhrel/jira-cli) or the Atlassian MCP server. Jira does not auto-close from a GitHub PR by default; closing usually happens via a smart commit (if the Jira-GitHub/Bitbucket integration is enabled) or by transitioning the issue with the CLI after merge.

```bash
# View an issue
jira issue view PROJ-123

# List issues
jira issue list --status "In Progress" --assignee $(jira me)
jira issue list --status "To Do" -q "project = PROJ"

# Transition state
jira issue move PROJ-123 "In Progress"
jira issue move PROJ-123 "Done"
```

- **Branch name:** include the key, e.g. `PROJ-123-short-description`, so integrations and humans can trace it.
- **PR / commit close:** if smart commits are enabled, `PROJ-123 #close` in the commit message transitions the issue. Otherwise transition explicitly with `jira issue move PROJ-123 "Done"` after the PR merges, and ask the human whether to do so.
- **Commit message:** prefix with `PROJ-123:`.

If only the Atlassian MCP server is available (no `jira` CLI), use its tools instead of these shell commands, but follow the same branch and transition conventions.

---

## No tracker (pasted ticket)

When the user pastes a description or points at a markdown/issue file instead of giving a tracker ID:

- Treat the pasted text (or file contents) as the ticket. Derive title, type, acceptance criteria, and scope from it exactly as you would from a fetched ticket.
- Skip all tracker CLI calls.
- **Branch name:** a clear descriptive slug, e.g. `feat/short-description` or `fix/short-description`.
- **PR body:** no auto-close keyword exists, so summarize the spec and link back to wherever the request came from (the markdown file path, a Slack permalink, etc.) if one exists.
- Still run the full plan -> test -> implement -> evaluate loop. The absence of a tracker changes only how you fetch the ticket and close it, not the discipline.
