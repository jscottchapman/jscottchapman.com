#!/usr/bin/env python3
"""
persona-exorcist scrub  (safe, reversible removal)
==================================================
Scrubbing a persona ghost often means touching high-stakes, shared config:
a user-level ~/.claude/settings.json hook, a global CLAUDE.md, a parent
monorepo's instructions. Those can be load-bearing for OTHER projects, so this
tool never hard-deletes. It QUARANTINES (moves to a timestamped backup with a
manifest) so any over-eager removal is one command to undo.

Two granularities:
  - Whole-file source (a persona definition file, or a hook script that exists
    only to inject the persona): `quarantine` it (move out, reversible).
  - Line-level source (one line in MEMORY.md, one hook block in settings.json):
    `backup` the file first, then edit the original in place with your editor /
    the Edit tool. The backup lets you restore if the edit goes wrong.

Quarantine root: ~/.persona-exorcist-quarantine/<timestamp>/
A manifest.json in each session maps original <-> quarantined paths.

Usage:
    python3 scrub.py backup     <path> [<path> ...]      # copy aside, leave original
    python3 scrub.py quarantine <path> [<path> ...]      # copy aside, remove original
    python3 scrub.py list                                # show sessions
    python3 scrub.py restore    [<session-dir>|latest]   # put everything back

ALWAYS run with the user's explicit approval per source. Print what you did.
"""
import json
import os
import shutil
import sys
from datetime import datetime

QROOT = os.path.expanduser("~/.persona-exorcist-quarantine")


def _session_dir():
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    d = os.path.join(QROOT, ts)
    os.makedirs(d, exist_ok=True)
    return d


def _safe_rel(path):
    # Mirror the absolute path under the session dir, stripping the leading sep.
    ap = os.path.abspath(path)
    return ap.lstrip(os.sep)


def _load_manifest(session):
    mf = os.path.join(session, "manifest.json")
    if os.path.exists(mf):
        return json.load(open(mf)), mf
    return {"entries": []}, mf


def _do(paths, remove):
    missing = [p for p in paths if not os.path.exists(p)]
    if missing:
        print(f"ERROR: not found: {missing}")
        sys.exit(1)
    session = _session_dir()
    manifest, mf = _load_manifest(session)
    for p in paths:
        ap = os.path.abspath(p)
        dest = os.path.join(session, _safe_rel(ap))
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if os.path.islink(ap):
            link_target = os.readlink(ap)
            with open(dest + ".symlink", "w") as f:
                f.write(link_target)
            entry = {"original": ap, "backup": dest + ".symlink", "type": "symlink",
                     "target": link_target, "removed": remove}
            if remove:
                os.unlink(ap)
        elif os.path.isdir(ap):
            shutil.copytree(ap, dest, symlinks=True)
            entry = {"original": ap, "backup": dest, "type": "dir", "removed": remove}
            if remove:
                shutil.rmtree(ap)
        else:
            shutil.copy2(ap, dest)
            entry = {"original": ap, "backup": dest, "type": "file", "removed": remove}
            if remove:
                os.remove(ap)
        manifest["entries"].append(entry)
        verb = "QUARANTINED (moved)" if remove else "BACKED UP (kept original)"
        print(f"{verb}: {ap}\n  -> {dest}")
    json.dump(manifest, open(mf, "w"), indent=2)
    print(f"\nManifest: {mf}")
    print(f"Undo with: python3 scrub.py restore {session}")


def cmd_list():
    if not os.path.isdir(QROOT):
        print("(no quarantine sessions)")
        return
    for d in sorted(os.listdir(QROOT)):
        sd = os.path.join(QROOT, d)
        man, _ = _load_manifest(sd)
        n = len(man.get("entries", []))
        removed = sum(1 for e in man["entries"] if e.get("removed"))
        print(f"{sd}  ({n} entries, {removed} moved)")


def cmd_restore(which):
    if not os.path.isdir(QROOT):
        print("(nothing to restore)")
        return
    sessions = sorted(os.path.join(QROOT, d) for d in os.listdir(QROOT)
                      if os.path.isdir(os.path.join(QROOT, d)))
    if not sessions:
        print("(nothing to restore)")
        return
    session = sessions[-1] if which in (None, "latest") else os.path.abspath(which)
    man, _ = _load_manifest(session)
    for e in man.get("entries", []):
        orig, typ = e["original"], e["type"]
        os.makedirs(os.path.dirname(orig), exist_ok=True)
        if typ == "symlink":
            if os.path.lexists(orig):
                os.unlink(orig)
            os.symlink(e["target"], orig)
        elif typ == "dir":
            if os.path.exists(orig):
                shutil.rmtree(orig)
            shutil.copytree(e["backup"], orig, symlinks=True)
        else:
            shutil.copy2(e["backup"], orig)
        print(f"RESTORED: {orig}")
    print(f"\nRestored from {session}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    rest = sys.argv[2:]
    if cmd == "backup":
        _do(rest, remove=False)
    elif cmd == "quarantine":
        _do(rest, remove=True)
    elif cmd == "list":
        cmd_list()
    elif cmd == "restore":
        cmd_restore(rest[0] if rest else "latest")
    else:
        print(f"unknown command: {cmd}\n")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
