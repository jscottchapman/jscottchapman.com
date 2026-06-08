---
name: persona-exorcist
description: >-
  Hunt AI agent personas/personalities across a project AND trace every hidden
  channel that keeps re-invoking a persona you already deleted. Use this whenever
  the user mentions AI personas, agent personalities, role-play agents, a "team"
  or "cast" of AI characters/roles, persona/agent definition files, OR — most
  importantly — complains that a deleted, removed, or "killed" persona, agent,
  character, sub-agent, or role keeps coming back, getting invoked, summoned,
  resurfacing, re-appearing, or "won't stay gone" in agent.md / AGENTS.md /
  CLAUDE.md, skills, sub-agents, hooks, memory, settings, or script/prompt
  folders. Also trigger on "ghost persona", "why does X keep getting summoned",
  "I deleted the persona but it still runs", "phantom agent", or any request to
  audit / inventory / clean up AI persona definitions across a codebase. Trigger
  even if the user never says the word "persona" but describes an AI character or
  named role that re-appears after deletion. Hunts every scope — the repo, its
  parent directories, and the user-level global config (~/.claude) — because one
  poisoned global hook or CLAUDE.md re-summons a persona in EVERY project, the
  usual reason "I deleted it everywhere and it still comes back." Can also
  safely and reversibly scrub the persona once found.
---

# Persona Exorcist

Find AI-agent personas in a project and, crucially, trace the **re-injection
channels** that keep summoning one after its obvious definition file is deleted.

The easy half is grepping for `persona.md`. The half that matters — and the
reason the user is here — is the *ghost*: a persona they removed that keeps
getting invoked because something else still feeds it in. Your job is to find
that something else.

## Mental model (read this first)

A persona has two kinds of presence:

- **Definition** — text that describes the character. Deleting it removes one
  description.
- **Re-injection channel** — anything that causes the persona to be loaded into a
  model's context or spawned as an agent. Channels outlive definition files.

> A ghost = a deleted persona still re-injected because a channel (a) holds an
> inline copy, (b) points to / regenerates a definition, or (c) auto-triggers on
> the persona's name or role.

So when someone says "I deleted it but it keeps running," do **not** go looking
for another copy of the definition. Go looking for the *channel*. The full
catalog of definition surfaces and channels — and why each one matters — is in
`references/surfaces.md`. Read it before reporting; it's the substance of the
skill.

## Scope: a channel can live above the repo

The second thing that makes ghosts immortal: a re-injection channel doesn't have
to be *in* the repo. The same persona text in a parent monorepo's `CLAUDE.md`, in
a user-level `~/.claude/settings.json` hook, or in `~/.claude/CLAUDE.md`, loads
into **every** project. Someone can scrub their repo perfectly and the persona
returns, because the source sits one or more levels up. This is the usual reason
for "I deleted it everywhere and it *still* won't die."

So the hunt has nested scopes, and the sweep walks them on demand:

| Scope | What it covers | When |
|---|---|---|
| `repo` | the project tree (deep) | default; inventory; first pass |
| `up` | repo + every ancestor dir to `$HOME` (surface) | monorepo / nested projects |
| `user` | `~/.claude` global + editor configs (surface) | suspect global poisoning |
| `all` | `up` + `user` | **a real ghost hunt — use this** |

Rule of thumb: if a `repo`-scope sweep finds no live channel that explains the
resurrection, the ghost is almost certainly above the repo — escalate to
`--scope all` immediately. A user-level source is the highest-priority finding
because its blast radius is every project the user has.

## Workflow

### 1. Scope the hunt
Ask (or infer) which persona(s) are the problem and whether the user is doing a
broad **inventory** ("find all personas") or chasing a specific **ghost** ("X
keeps coming back"). Confirm the project root. If they don't have a name yet,
that's fine — the sweep will discover candidates.

### 2. Sweep
Run the bundled script to gather raw signal across every surface at once. It
reasons about nothing; it just collects, so you don't miss a channel:

```bash
python3 <skill-dir>/scripts/sweep.py <project-root> --scope all --name "Persona Name"
```

- **Pick the scope** from the table above. For a "deleted but still invoked"
  ghost, default to `--scope all` so a parent-dir or `~/.claude` source can't
  hide. For a plain inventory, `--scope repo` is enough.
- Repeat `--name` for several personas. Omit it on a first pass to discover
  candidate names from definition files, then re-run with the names found.
- Add `--all-text` to also scan source/config files (`.py/.js/.ts/.json/.yaml`)
  for personas embedded as system-prompt strings — slower and noisier, worth it
  when scripts are implicated (which they often are).

Output is grouped — **definition surfaces**, **hooks**, **import chains**,
**symlinks**, **name matches** — and every line is tagged with its scope
(`[REPO]`, `[ANCESTOR:…]`, `[USER(~)]`). User-level matches are pulled to the top
under a loud banner; treat those as the headline. The script also lists **manual
checks** it can't reach (git history, cron/routines, MCP `instructions`,
generators) — actually perform them; they hide real ghosts.

### 3. Classify
For every hit, decide which it is, using the labels from `references/surfaces.md`:
**Confirmed source**, **Likely source**, **Definition (inert)**, or **Mention
only**. Re-injection requires the text to actually reach a model's context or
spawn an agent — a changelog that names the persona is a mention, not a source.

### 4. Trace the ghost
For a "deleted but still invoked" persona, walk the channels in priority order.
**Read the actual hook commands and any scripts they call** — a `SessionStart` or
`UserPromptSubmit` hook whose stdout echoes the persona (or reads a file that
still contains it) is the single most common real culprit, followed by
auto-loaded memory files and triggering skill/sub-agent descriptions. Don't stop
at "this file mentions X"; confirm the path by which it re-enters context.

### 5. Report
Present findings grouped by source, strongest first:

```
## Persona Exorcist — findings for "<persona>"

### 🔴 USER-LEVEL sources  (poison EVERY project — fix first)
- [USER(~)] <file>:<line> — <what it is> — <why it re-invokes>

### Confirmed re-injection sources  (fix these to stop the ghost)
- [<scope>] <file>:<line> — <what it is> — <why it re-invokes> — <confidence>

### Likely sources
- ...

### Inert definitions  (describe the persona; nothing auto-loads them)
- ...

### Mentions only  (safe to ignore)
- ...

### Manual checks performed
- git history: ... | routines: ... | MCP/plugins: ... | generators: ...
```

Always tag each source with its scope, and surface any `USER(~)` source first —
its blast radius is every project, so it's the headline even if a repo-level
source also exists. Lead with the source(s) that explain the resurrection. Be
explicit when you *didn't* find a live channel — "no remaining re-injection
source found in any scope; the persona is inert" is a real and useful result.

### 6. Scrub — safely and reversibly
The user wants the ghost *gone*, but scrubbing can touch shared, high-stakes
config (a user-level hook, a global `CLAUDE.md`, a parent monorepo's
instructions) that may be load-bearing for other projects. So never hard-delete.
Use the bundled `scrub.py`, which quarantines to a timestamped backup with a
one-command undo:

```bash
# whole-file source (a persona file, or a hook script that only injects it):
python3 <skill-dir>/scripts/scrub.py quarantine <path> [<path> ...]

# line-level source (one line in MEMORY.md, one hook block in settings.json):
python3 <skill-dir>/scripts/scrub.py backup <path>     # then edit the original
```

Process:
1. **Confirm per source, loudest for user-level.** Before touching anything in
   `~/.claude` or an ancestor dir, say plainly that it affects every project and
   get explicit approval for *that* file. Repo-only changes are lower-stakes but
   still confirm.
2. **Quarantine whole-file sources; back-up-then-edit line-level ones.** For a
   line in `settings.json`/`MEMORY.md`/a triggering description, `backup` the
   file first, then make the precise edit with the Edit tool.
3. **Reversibility is the safety net.** `scrub.py restore latest` (or
   `restore <session-dir>`) puts everything back if a "garbage" file turns out to
   matter. Tell the user this exists; it's why quarantining beats `rm`.

### 7. Re-sweep to confirm the kill
Re-run the sweep at the **same scope you scrubbed** (usually `--scope all`) for
the same `--name`. The whole point is that the ghost stays dead across every
scope — show the user that no live re-injection source remains anywhere. This
close-the-loop step is what distinguishes an exorcism from another round of
deleting files.

## Notes
- **Read before you delete.** A persona file you're told is "garbage" may be
  load-bearing for a real workflow. Surface what you find and let the user
  decide; channels are the safe thing to cut, definitions less so. Quarantine
  (don't `rm`) so any mistake is one `restore` away.
- **User-level edits are global.** A change in `~/.claude` or an ancestor dir
  affects every project the user has, not just this repo. Treat those as the
  highest-stakes, highest-priority edits and confirm each one explicitly.
