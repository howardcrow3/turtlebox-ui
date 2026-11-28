#!/usr/bin/env python3
"""Generate css/tokens.css (light and dark) and css/tokens-light.css (light only, for websites) from tokens/tokens.json.
Run from the repo root: python3 scripts/build-tokens.py"""
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
web = t.get("web", {})
web_vars = "\n".join(
    [f"  --space-{k}:{v};" for k, v in web.get("space", {}).items()]
    + [f"  --{k}:{v};" for k, v in web.get("density", {}).items()]
    + [f"  --measure-{k}:{v};" for k, v in web.get("measure", {}).items()]
)
light_only = f"""/* Generated from tokens/tokens.json. Do not edit by hand. Light only: for websites, which always render light. */
:root {{
{shared}
{block(light)}
{web_vars}
  color-scheme: light;
}}
"""
(root / "css" / "tokens-light.css").write_text(light_only)
print("wrote css/tokens.css and css/tokens-light.css")
