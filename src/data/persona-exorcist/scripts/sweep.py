#!/usr/bin/env python3
"""
persona-exorcist sweep
======================
Gathers raw signal about AI-persona DEFINITIONS and the RE-INJECTION CHANNELS
that can keep loading a persona into a model's context even after its obvious
definition file is deleted.

Crucially, a ghost can live ABOVE the repo. The same persona text in a parent
monorepo's CLAUDE.md, or in a user-level ~/.claude/settings.json hook, or in
~/.claude/CLAUDE.md, re-injects into EVERY project. That is the textbook cause of
"I deleted it everywhere in my repo and it still won't die." So this sweep can
walk outward by scope:

    repo      just the project (deep recursive scan)        [default]
    up        repo + every ancestor directory up to $HOME    (surface scan)
    user      only ~/.claude global + editor configs         (surface scan)
    all       up + user  (the full exorcism — use this when chasing a ghost
              that has no source inside the repo)

This script decides nothing. It surfaces candidates + the channels that could
resurface them, labelled by scope, and the model traces and reports. Fixing a
USER-scope source affects all projects — the report must flag that loudly.

Usage:
    python3 sweep.py [ROOT] [--scope repo|up|user|all] [--name "Name" ...] [--all-text]
"""
import argparse
import fnmatch
import glob
import os
import re
import sys

SKIP_DIRS = {
    ".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build",
    ".next", ".turbo", ".cache", "coverage", ".pytest_cache", "vendor",
    ".mypy_cache", ".ruff_cache", "target",
}
DEFINITION_FILENAMES = {
    "claude.md", "agents.md", "agent.md", ".cursorrules", ".windsurfrules",
    "gemini.md", "copilot-instructions.md", "system-prompt.md", "persona.md",
    "personas.md", "characters.md", "roles.md", "team.md",
}
DEFINITION_DIRHINTS = {
    "personas", "persona", "characters", "agents", "subagents", "roles",
    "team", "prompts", "prompt", "system-prompts",
}
SETTINGS_FILENAMES = {"settings.json", "settings.local.json"}
INJECTING_HOOK_EVENTS = {
    "SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse",
    "Stop", "SubagentStop", "Notification",
}
IMPORT_RE = re.compile(r"(?m)^\s*@([^\s]+\.(?:md|markdown|txt))\s*$")
FM_NAME_RE = re.compile(r"(?mi)^\s*name\s*:\s*(.+?)\s*$")
FM_DESC_RE = re.compile(r"(?mi)^\s*description\s*:\s*(.+?)\s*$")
TEXT_EXT = {".md", ".markdown", ".txt", ".json", ".yaml", ".yml", ".toml", ".sh", ".bash"}
CODE_EXT = {".py", ".js", ".ts", ".tsx", ".jsx", ".rb", ".go"}

# Auto-load surfaces checked at every scope (relative to a scope root).
SURFACE_FILES = [
    "CLAUDE.md", "AGENTS.md", "agent.md", "GEMINI.md", ".cursorrules",
    ".windsurfrules", ".github/copilot-instructions.md", ".claude/CLAUDE.md",
    ".claude/settings.json", ".claude/settings.local.json", "MEMORY.md",
]
SURFACE_GLOBS = [
    ".claude/agents/*.md", ".claude/commands/*.md", ".claude/skills/*/SKILL.md",
    ".claude/hooks/*", "memory/*.md", ".claude/memory/*.md",
]
# Extra surfaces that only exist at the user/global root (~ / $HOME).
USER_GLOBS = [
    ".claude/projects/*/memory/*.md", ".claude/projects/*/MEMORY.md",
    ".cursor/rules/*", ".codeium/*",
    ".claude/plugins/**/SKILL.md",  # plugin-bundled personas (name-grep only)
]


def read(path, limit=200_000):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read(limit)
    except (OSError, UnicodeError):
        return ""


def rel(base, path):
    try:
        return os.path.relpath(path, base)
    except ValueError:
        return path


def section(title):
    print("\n" + "=" * 72 + f"\n{title}\n" + "=" * 72)


def grep_text(text, names):
    """Return [(lineno, line)] where any name matches (case-insensitive)."""
    if not names:
        return []
    pats = [re.compile(re.escape(n), re.IGNORECASE) for n in names]
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        if any(p.search(line) for p in pats):
            hits.append((i, line.strip()[:160]))
    return hits


# ---------------------------------------------------------------- deep scan
def iter_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            yield os.path.join(dirpath, name)


def scan_deep(root, names, all_text, out):
    base = root
    grep_ext = TEXT_EXT | (CODE_EXT if all_text else set())
    for path in iter_files(root):
        fn = os.path.basename(path)
        low = fn.lower()
        parts = {p.lower() for p in path.split(os.sep)}
        text = None
        # definitions
        is_def = low in DEFINITION_FILENAMES or low == "skill.md" or (
            (parts & DEFINITION_DIRHINTS) and low.endswith((".md", ".txt", ".json", ".yaml", ".yml")))
        if is_def:
            text = read(path)
            n = FM_NAME_RE.search(text[:1500])
            d = FM_DESC_RE.search(text[:1500])
            out["def"].append(("REPO", rel(base, path), n.group(1) if n else "",
                               d.group(1)[:160] if d else ""))
        # hooks
        if fn in SETTINGS_FILENAMES:
            text = text if text is not None else read(path)
            events = [e for e in INJECTING_HOOK_EVENTS if f'"{e}"' in text]
            cmds = re.findall(r'"command"\s*:\s*"([^"]+)"', text)
            out["hook"].append(("REPO", rel(base, path), events, cmds))
        # imports
        if low in {"claude.md", "agents.md", "agent.md"}:
            text = text if text is not None else read(path)
            imps = IMPORT_RE.findall(text)
            if imps:
                out["import"].append(("REPO", rel(base, path), imps))
        # name matches
        if names and (os.path.splitext(path)[1].lower() in grep_ext or low in DEFINITION_FILENAMES):
            text = text if text is not None else read(path)
            for ln, line in grep_text(text, names):
                out["name"].append(("REPO", rel(base, path), ln, line))
    # symlinks
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in list(dirnames) + filenames:
            p = os.path.join(dirpath, name)
            if os.path.islink(p):
                out["link"].append(("REPO", rel(base, p), os.readlink(p)))


# ------------------------------------------------------------- surface scan
def scan_surface(root, label, names, out, user=False):
    """Scan only the known auto-load surfaces at one scope level (no deep walk —
    we must NOT recurse a parent dir or we'd crawl every sibling repo)."""
    candidates = [os.path.join(root, f) for f in SURFACE_FILES]
    for g in SURFACE_GLOBS + (USER_GLOBS if user else []):
        recursive = "**" in g
        candidates += glob.glob(os.path.join(root, g), recursive=recursive)
    seen = set()
    for path in candidates:
        if path in seen or not os.path.isfile(path):
            continue
        seen.add(path)
        fn = os.path.basename(path)
        low = fn.lower()
        text = read(path)
        if fn in SETTINGS_FILENAMES:
            events = [e for e in INJECTING_HOOK_EVENTS if f'"{e}"' in text]
            cmds = re.findall(r'"command"\s*:\s*"([^"]+)"', text)
            out["hook"].append((label, path, events, cmds))
        if low in {"claude.md", "agents.md", "agent.md"}:
            imps = IMPORT_RE.findall(text)
            if imps:
                out["import"].append((label, path, imps))
        if low == "skill.md" or low.endswith(".md"):
            n = FM_NAME_RE.search(text[:1500])
            d = FM_DESC_RE.search(text[:1500])
            if n or d or "/agents/" in path or "/skills/" in path or "/commands/" in path:
                out["def"].append((label, path, n.group(1) if n else "",
                                   d.group(1)[:160] if d else ""))
        for ln, line in grep_text(text, names):
            out["name"].append((label, path, ln, line))


def ancestors(root, home):
    out = []
    cur = os.path.dirname(os.path.abspath(root))
    home = os.path.abspath(home)
    while cur and cur not in ("/",) and cur != home:
        out.append(cur)
        parent = os.path.dirname(cur)
        if parent == cur:
            break
        cur = parent
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--scope", choices=["repo", "up", "user", "all"], default="repo")
    ap.add_argument("--name", action="append", default=[], dest="names")
    ap.add_argument("--all-text", action="store_true")
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    home = os.path.abspath(os.path.expanduser("~"))

    out = {"def": [], "hook": [], "import": [], "link": [], "name": []}

    print("PERSONA-EXORCIST SWEEP")
    print(f"root:  {root}")
    print(f"scope: {args.scope}")
    print(f"home:  {home}")
    print(f"candidate names: {args.names or '(none — discovering from definitions)'}")

    scan_deep(root, args.names, args.all_text, out)
    if args.scope in ("up", "all"):
        for a in ancestors(root, home):
            scan_surface(a, f"ANCESTOR:{a}", args.names, out)
    if args.scope in ("user", "all"):
        scan_surface(home, "USER(~)", args.names, out, user=True)

    section("DEFINITION SURFACES  (where a persona is described)")
    if not out["def"]:
        print("(none found)")
    for scope, path, name, desc in out["def"]:
        print(f"\n• [{scope}] {path}")
        if name:
            print(f"    name: {name}")
        if desc:
            print(f"    description: {desc}")

    section("RE-INJECTION: HOOKS  (settings.json — the #1 ghost source)")
    print("Hook stdout is injected into context every session/turn.")
    if not out["hook"]:
        print("(none found)")
    for scope, path, events, cmds in out["hook"]:
        warn = "  <-- USER LEVEL: affects EVERY project!" if scope.startswith("USER") else ""
        print(f"\n• [{scope}] {path}{warn}")
        print(f"    injecting hook events: {events or 'none'}")
        for c in cmds:
            print(f"    hook command -> {c}")

    section("RE-INJECTION: IMPORT CHAINS  (@file pulled into CLAUDE.md/AGENTS.md)")
    if not out["import"]:
        print("(none found)")
    for scope, path, imps in out["import"]:
        print(f"\n• [{scope}] {path} imports:")
        for i in imps:
            print(f"    @{i}")

    section("RE-INJECTION: SYMLINKS  (a deleted file may live behind a link)")
    if not out["link"]:
        print("(none)")
    for scope, path, target in out["link"]:
        print(f"• [{scope}] {path} -> {target}")

    section("NAME MATCHES  (every line mentioning a candidate persona)")
    if not args.names:
        print("No --name given. Review DEFINITION SURFACES, pick the persona")
        print("name(s)/role(s), then re-run with --name (and --scope all) to trace.")
    elif not out["name"]:
        print("(no matches in any scanned scope)")
    else:
        user_hits = [m for m in out["name"] if m[0].startswith("USER")]
        if user_hits:
            print("!!! USER-LEVEL MATCHES — these poison EVERY project. Fix first:")
            for scope, path, ln, line in user_hits:
                print(f"  [{scope}] {path}:{ln}: {line}")
            print("")
        for scope, path, ln, line in out["name"]:
            if scope.startswith("USER"):
                continue
            print(f"  [{scope}] {path}:{ln}: {line}")

    section("MANUAL CHECKS NOT COVERED BY THIS SWEEP")
    print("- git history / stashes:  git log --all -p -S '<persona>'")
    print("- scheduled/cron agents (routines) that name the persona")
    print("- MCP server `instructions` fields injected at session start")
    print("- generators/templates that RECREATE a persona file on some command")
    if args.scope == "repo":
        print("- !! You scanned scope=repo only. If no in-repo source explains the")
        print("     ghost, re-run with --scope all to reach ancestors + ~/.claude.")


if __name__ == "__main__":
    main()
