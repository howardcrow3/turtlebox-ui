# Web layer

The part of Turtlebox UI that every website uses: highturtle.com, turtlebox.studio and any portfolio company site that does not have its own brand. It is the same system as the apps (tokens, warm neutrals, one gold accent, Inter, rounded corners, borders before shadows) set at website scale.

## Light mode only

Websites always render light. `css/tokens-light.css` holds the light roles only and sets `color-scheme: light`, so a visitor whose computer is in dark mode still gets the light pages. Pages also set `<html data-theme="light">`, `<meta name="color-scheme" content="light">` and `<meta name="theme-color" content="#F7F3EA">`. The apps keep both themes through `css/tokens.css`.

## Files

| Path | What |
| --- | --- |
| `css/tokens-light.css` | Generated. Light roles, radius, plus the web spacing, density and measure tokens from `tokens.json` under `web` |
| `css/fonts.css` | Inter 400, 500 and 600, self-hosted from `fonts/` |
| `css/web.css` | Website components |
| `dist/web-light.css` | Generated bundle of the three files above. Sites vendor this file and `dist/fonts/` |

Build: `python3 scripts/build-tokens.py && python3 scripts/build-web.py`.

Do not load `web.css` together with `components.css`: both define `.btn` and `.bar`.

## Scale

| Element | Web | App |
| --- | --- | --- |
| Body | 16px / 1.6, Regular | 13px |
| Display (one per page) | 40 to 64px, SemiBold, -0.035em | 20px |
| Section title | 26 to 34px, SemiBold | 15px |
| Card title | 20px, SemiBold | 13px |
| Label, eyebrow | 13px Medium, sentence case, body color | 11px |
| Button | 40px (48px large, 34px small), 14px Medium, `r-sm` | 26px |
| Input | 44px, 16px text, `r-sm` | 28px |
| Nav item | 36px, 14px Medium, `r-sm` fill on hover, `selected` fill for the current page | 28px |
| Card | `surface`, 1px `line`, `r-lg`, 32px padding | `r-md` |

`muted` is 4.3:1 on `paper`, so on websites it is only used for placeholders. Labels and fine print use `body`.

## Components

Class names match the ones the sites already used, so pages adopt the layer without markup changes.

- Page: `.wrap`, `.skip`, `.site-header` with `.bar`, `.brand`, `.brand-mark`, `.brand-name` and `nav`, `.site-footer` with `.foot`.
- Type: `.display`, `.lede`, `.eyebrow`, `.label`, `.fine`, `.prose`.
- Actions: `.btn` (ink fill, gold on hover), `.btn-lg` / `.btn-buy`, `.btn-sm` / `.btn-small`, `.btn-secondary` / `.btn-quiet`, `.btn-ghost`, `.link` (gold underline, 44px hit area).
- Layout: `.hero`, `.hero-split`, `.cta-row`, `.page-head`, `.section`, `.section-head`, `.points`, `.simple`.
- Plates: `.card`, `.app-card`, grids `.cards` and `.apps`.
- Status and messages: `.status` (`.status-live`, `.status-on`), `.chip`, `.dot`, `.notice` (`.warn`, `.error`).
- Forms: `.field`, `.input` and plain inputs, `.field-row`, `.form-status` (`.is-error`, `.is-ok`), `.hp` honeypot.

## Adopted

- 2026-11-28: highturtle.com and turtlebox.studio (howardcrow3/highturtle, vendored in `turtlebox/design-system/ui/`). Their older page sheets reach the new roles through `turtlebox/design-system/compat.css`. Montoya.ai keeps its own brand.
