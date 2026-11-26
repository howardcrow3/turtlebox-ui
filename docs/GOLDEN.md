# Golden's use of Turtlebox UI

Golden (Tauri 2, Svelte 5) is the second app on the framework. This page records how it consumes it, so the next app can copy the approach.

## How it is consumed

Golden vendors the generated CSS into `apps/desktop/src/turtlebox/`: `tokens.css`, `base.css`, `shell.css`, `extensions.css`, `charts.css`. Nothing there is edited in Golden. Fixes go in this repo and are copied over. Inter is self-hosted with `@fontsource-variable/inter`.

Golden's own `app.css` does three things:

1. Aliases the names its older screens used (`--gold`, `--bad`, `--good`, `--ivory`, `--charcoal`) to role tokens.
2. Styles bare `button`, `input`, `select`, `textarea` and `table` elements to the compact framework look, so screens need no per-element classes.
3. Styles the old message classes once (`.err`, `.ok`, `.hint`, `.muted`).

## Why shell.css and not components.css

`components.css` uses short global class names (`.row`, `.bar`, `.chip`, `.col`, `.toggle`, `.list`). Golden's screens already used the same names for their own layouts, and the framework rules leaked in (a 44px `.bar`, a switch knob on `.toggle`). `css/shell.css` is generated from `components.css` by `scripts/build-shell.py` and keeps only the shell. New pieces are added to `extensions.css` with the `tb-` prefix. The prefix rename of `components.css` planned for 1.0 would make this split unnecessary.

## What was adopted

| Framework piece | Where in Golden |
| --- | --- |
| Sidebar shell (`.side`, `.wm`, `.nav`) | App navigation, wordmark, selected state |
| Settings modal (`tb-modal` and friends) | Licence, Privacy, About, Send feedback, opened from Settings at the bottom of the sidebar |
| Chat (`tb-composer`, `tb-sug`, `tb-msg-u`) | Ask and What if |
| Segmented control (`tb-seg`) | Overview time grain |
| Stat tiles (`.kpis`, `.kpi`) | This-period income, spending and kept |
| Chart palette (`--s1` to `--s3`) | Scenario lines |
| Light and dark | Follows the system, every screen |

## Rules Golden follows

- No hex colours in screens. Role tokens only, and no `var(--x, #fallback)`, which hides a missing token in dark mode.
- Gold is a fill or an edge, never text. A warning is ink text with a gold left edge, not coloured text.
- Numbers are tabular and right-aligned in tables.
- Hidden amounts (the screen-sharing mask) is an app feature, not a framework one.

## Also adopted

- Chat dock: a 320px `<aside>` beside the work screens, reusing the Ask thread and composer classes (`tb-thread`, `tb-msg-u`, `tb-msg-a`, `tb-composer`, `tb-sug`). It can be hidden from the sidebar.
- `tb-charts.js` on Cash flow: a thin Svelte action calls `TBChart.columns` with dollar values and `--s1` / `--s2` series colours.
- Bulk select on lists: a checkbox column, shift-click range, select-all and a bulk bar that sits above the table while anything is selected. Built from the existing `tb-seg` / field styles, so no new classes.

## Not yet adopted

- `tb-charts.js` for the fan chart and the Sankey (still Svelte components).
- A board view for lists, and the bulk bar on lists other than Transactions.
- Per-screen conversion of the remaining cards to `.tb-section`.
