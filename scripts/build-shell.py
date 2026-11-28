#!/usr/bin/env python3
"""Generate css/shell.css from css/components.css.

components.css uses short global class names (.row, .bar, .chip, .col, .list...) that collide with an app's own screens.
shell.css keeps only the app shell (sidebar, wordmark, nav, account menu), whose names are unlikely to collide.
Apps with many existing screens (Golden) load shell.css instead of components.css.
"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "css/components.css").read_text()
KEEP = (".side", ".wm", ".nav", ".recent", ".acct", ".av", ".pop", ".tb-shell", ".tb-main")
out = ["/* Generated from components.css by scripts/build-shell.py. Do not edit by hand. App shell only. */"]
for line in src.splitlines():
    s = line.strip()
    if s.startswith(KEEP) and not s.startswith((".side .lbl", ".side .grow")) or s.startswith((".side .lbl", ".side .grow")):
        out.append(line)
(root / "css/shell.css").write_text("\n".join(out) + "\n")
