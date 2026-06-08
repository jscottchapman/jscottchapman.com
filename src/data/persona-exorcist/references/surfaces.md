# Surface catalog: where AI personas live and how deleted ones come back

A persona has two kinds of presence. Keep them separate in your head — it's the
whole reason ghosts exist.

- **Definition** — text that *describes* the character (its name, voice, role,
  instructions). Deleting a definition file removes one description.
- **Re-injection channel** — anything that *causes* a persona to be loaded into a
  model's context or spawned as an agent. Channels survive the deletion of a
  definition file, and that is why "I deleted it but it keeps getting invoked."

A ghost = a persona the user removed that is still re-injected because a channel
either (a) still contains an inline copy of it, (b) still points to or regenerates
a definition, or (c) auto-triggers on the persona's name or role.

The value of this skill is *thoroughness across channels*. Grepping for
`persona.md` is easy; the miss is always a channel nobody thinks of.

---

## Scopes: a channel can live above the repo

Channels nest outward, and config at every level auto-loads into a session:

| Scope | Where | Blast radius |
|---|---|---|
| **repo** | the project tree | this project |
| **ancestor** | any parent dir up to `$HOME` (a monorepo root, a containing folder) — its own `CLAUDE.md`, `.claude/settings.json`, etc. | this project + siblings under that parent |
| **user / global** | `~/.claude/CLAUDE.md`, `~/.claude/settings.json` hooks, `~/.claude/agents`, `~/.claude/skills`, auto-memory under `~/.claude/projects/*/memory`, plus editor configs (`~/.cursor`, `~/.codeium`) | **every project the user has** |

A user-level source is the worst kind of ghost: the user scrubs their repo
perfectly and the persona still loads, because a single global hook or a line in
`~/.claude/CLAUDE.md` re-injects it everywhere. When a repo-scope sweep finds no
channel that explains the resurrection, the source is almost always an ancestor
or the user level — escalate to `--scope all`. Fix user-level sources first;
their blast radius is everything. Because those files are shared, scrub them
*reversibly* (quarantine, don't delete) in case they're load-bearing elsewhere.

---

## Definition surfaces (where a persona is described)

| Surface | Notes |
|---|---|
| `agent.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Project + nested. May embed a whole cast inline. |
| `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md` | Other tools' instruction files, easy to forget. |
| `.claude/agents/*.md` | Subagent definitions — `name` + `description` frontmatter. Each is its own auto-triggerable persona. |
| `.claude/skills/*/SKILL.md` and standalone skill `.md` files | A skill can *be* a persona, or define one in its body. |
| `.claude/commands/*.md` | Slash commands frequently open with "You are <persona>…". |
| `personas/ characters/ roles/ team/ prompts/` dirs | Framework conventions (CrewAI, AutoGen, hand-rolled). |
| Script folders (`.py/.js/.ts`) | System-prompt strings / persona configs embedded in code. Use `--all-text`. |
| `.json/.yaml/.toml` configs | Agent configs (e.g. `agents:` lists, `system:` fields). |

## Re-injection channels (what reloads a persona) — in rough order of sneakiness

1. **Hooks** in `settings.json` / `settings.local.json` (project **and** global
   `~/.claude/settings.json`). `SessionStart` and `UserPromptSubmit` hooks run a
   script whose stdout is injected into context *every session/turn*. If that
   script echoes a persona, or reads a file that still contains it, the persona
   is summoned no matter how many definition files you delete. **Check this
   first.** Read the hook's actual command and any script it calls.
2. **Memory files** — `MEMORY.md` and `memory/*.md` are auto-loaded each session.
   A persona mentioned here returns silently forever.
3. **Import chains** — `@some/file.md` lines inside `CLAUDE.md`/`AGENTS.md` pull
   other files in transitively. The persona may sit two hops away.
4. **Skill / subagent descriptions** — a `description` that triggers on the
   persona's name or role will auto-surface the skill that embodies it. The
   definition file can be gone while the *description* keeps inviting it in.
5. **Symlinks** — a definition "deleted" from the repo may actually live at a
   symlink target outside the tree (e.g. a skill linked into an Obsidian vault).
   `rm` on the link, or editing the link, doesn't touch the source.
6. **Scheduled / cron agents (routines)** — a recurring job that names the persona
   re-invokes it on a timer, with no trace in the working tree.
7. **MCP server instructions** — server config or `instructions` fields injected
   at session start.
8. **Plugins / marketplace caches** — a bundled plugin under `plugins/cache/…`
   can ship a persona you never wrote.
9. **Generators / templates** — a scaffold or codegen step that *recreates* the
   persona file whenever it runs. Deleting the output is futile; the template is
   the source.
10. **Git history & stashes** — the file is gone from HEAD but recoverable, and a
    stray `git checkout`/`git stash pop` resurrects it. Not a live re-injection,
    but explains "it came back after I switched branches."
11. **Global / editor config outside the repo** — `~/.claude/CLAUDE.md`,
    `~/.cursor`, `~/.codeium`. Lives above every project.

## Tracing a ghost (the core diagnostic)

Given "persona X is deleted but still invoked":

1. Confirm the obvious definition files are actually gone (`--name X` should show
   no remaining definition, or only references).
2. Walk channels 1→11. For each channel that mentions X *or* could regenerate it,
   you've found a live source. Hooks, memory, and descriptions explain the large
   majority of real ghosts.
3. For each candidate source, read it and decide: does this actually re-inject X,
   or merely mention it harmlessly? Re-injection requires the text to reach a
   model's context (hook stdout, auto-loaded memory, import, triggering
   description) or to spawn an agent.
4. The fix targets the *channel*, not another copy of the definition.

## Confidence labels to use in the report

- **Confirmed source** — you read it and it demonstrably re-injects the persona.
- **Likely source** — a channel that references/regenerates the persona but you
  couldn't fully confirm the runtime path.
- **Definition (inert)** — describes the persona but nothing auto-loads it.
- **Mention only** — names the persona but cannot cause invocation (e.g. a
  changelog, a comment).
