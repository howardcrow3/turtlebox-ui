#!/usr/bin/env python3
"""Generate css/tokens.css from tokens/tokens.json. Run from the repo root: python3 scripts/build-tokens.py"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
t = json.loads((root / "tokens" / "tokens.json").read_text())

def block(d):
    return "\n".join(f"  --{k}:{v};" for k, v in d.items())

shared = (
    f"  --sans:{t['font']['sans']};\n"
    + "\n".join(f"  --r-{k}:{v};" for k, v in t["radius"].items())
)
light, dark = t["color"]["light"], t["color"]["dark"]
out = f"""/* Generated from tokens/tokens.json. Do not edit by hand. */
:root {{
{shared}
{block(light)}
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
{block(dark)}
  color-scheme: dark; }}
}}
:root[data-theme="dark"], .tb-dark {{
{block(dark)}
  color-scheme: dark;
}}
.tb-light {{
{block(light)}
  color-scheme: light;
}}
.tb-light, .tb-dark {{ background: var(--paper); color: var(--body); }}
"""
(root / "css" / "tokens.css").write_text(out)
print("wrote css/tokens.css")
