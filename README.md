# Turtlebox UI

The shared UX framework for Turtlebox apps: design tokens, component styles, and the layout rules for chat-first desktop apps. CeeVee is the first app to adopt it, and Golden is the second.

Status: draft v0.1, first uploaded for review. The design is not final until Howard approves it.

## What is here

| Path | What |
| --- | --- |
| `tokens/tokens.json` | Source of truth for color (light and dark), type, radius, density, space and motion |
| `css/tokens.css` | Generated from `tokens.json` by `scripts/build-tokens.py`. Do not edit by hand |
| `css/base.css` | Inter-only base type, focus ring, reduced motion |
| `css/components.css` | Framework-neutral styles for buttons, toggle, select, input, chip, nav, rows, modal, chat composer, result list, approval card, data table, board and chat dock |
| `docs/DESIGN.md` | Principles, layout patterns, density, lists, chat and forms, themes, references, adoption plan |
| `preview/ux-plan-v0.1.html` | The live review page with all mockups. Open it in a browser |
| `scripts/build-tokens.py` | Regenerates `css/tokens.css` |

## Use

```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
```

Inter is loaded by the app, self-hosted in desktop apps. Light and dark follow the system by default. Set `data-theme="light"` or `data-theme="dark"` on the root element to force one.

Regenerate tokens after editing `tokens/tokens.json`:

```
python3 scripts/build-tokens.py
```

## Not here yet

- Svelte components. CeeVee's UI is SvelteKit, so these come first, built on this CSS.
- Class name prefixes. The names in `components.css` are provisional.
- A license. Add one before other people use this.
- Icon set. The preview uses a small hand-drawn stroke set that still needs to be replaced with a licensed one.
