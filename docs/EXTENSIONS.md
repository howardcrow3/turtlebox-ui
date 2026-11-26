# Extensions for Golden (v0.3)

`css/extensions.css` adds the pieces Golden needed that v0.2 did not have. They use role tokens only and follow the same rules as the rest of the framework: Inter, compact sizes, gold as a fill never text, borders for structure.

| Class | Use |
| --- | --- |
| `.tb-seg` | Segmented control for one choice from a few (week, month, quarter, year). Buttons with `aria-pressed`. |
| `.tb-field`, `.tb-fields` | Label above a control with help or error text; an auto-fill grid of fields. |
| `.tb-notice` (`ok`, `warn`, `danger`) | A message inside a screen. Pair colour with words. |
| `.tb-badge` (`accent`, `ok`, `danger`) | Short status label, such as Trial, Licensed, Approximate. |
| `.tb-empty` | What is missing and the one action that fixes it. |
| `.tb-progress` | Determinate bar, set with `--v` from 0 to 1. |
| `.tb-data` | Dense data table for screens, numbers right-aligned and tabular. |
| `.tb-section` | Titled group with the group-label heading. |

Golden also uses `css/charts.css` and `js/tb-charts.js` unchanged.

## Rules added

- Numbers are tabular and right-aligned in tables.
- A choice of 2 to 5 short options is a segmented control, not a row of separate buttons.
- Screens group content in sections with a group label, not in a stack of cards. Use a card (`.cardx`) only for a self-contained tool or a headline number.
- Estimates and approximations get a `.tb-badge` or a `.tb-notice.warn` with words, never colour alone.
