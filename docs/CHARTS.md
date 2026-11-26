# Charts and dashboards, draft v0.2

Built first for Golden (household finance and retirement planning), usable by any Turtlebox app. The live example is the "Charts and dashboards" section of `preview/ux-plan-v0.2.html`.

## Files

- `js/tb-charts.js`: the chart kit, no dependencies. Exposes `window.TBChart`.
- `css/charts.css`: chart chrome, tooltip, tables, stat tiles, time bar, card layout.
- Chart colors are tokens in `tokens/tokens.json`: `s1`, `s2`, `s3`, `grid`, `axis`.

## Chart types

| Function | Use |
| --- | --- |
| `columns(root, {cats, series, heads, height})` | Grouped columns by period, such as income and spending |
| `line(root, {cats, series, area, bands, endLabel, tip})` | Lines over time, an area wash for a single series, bands for projections, a custom tooltip |
| `hbars(root, {items})` | Ranked categories with the value and share at the tip |
| `spark(root, values, color)` | Sparkline for a stat tile |
| `navigator(root, {values, start, len, onChange})` | Overview with a draggable time window, keyboard accessible |
| `table(root, {cats, series})` | Table view of the same data |

All charts redraw when their container changes width. Names and labels are inserted with `textContent`, so data from files or tools cannot inject markup.

## Time model

One time bar above the content sets the range for everything below it, so numbers always agree.

- Grain: week, month, quarter, year. Changing grain keeps the same moment in view.
- Back and forward move by half a window. Plus and minus change how many periods show.
- The overview below the main chart shows the whole history. Drag the window or use the arrow keys.
- Today jumps to the latest period. The latest period is labeled "to date".
- Forward-looking charts (projections) have their own axis, such as age, and say so.

Aggregation into periods belongs in the app's core (Rust in Golden). The preview aggregates made-up weekly data in the browser only to show the interaction.

## Rules

- Data colors are separate from the gold UI accent. Series order is fixed: blue, orange, aqua. A fourth series folds into "Other" or becomes a separate chart.
- The first three colors were checked for color-blind separation and for contrast on both surfaces. In light mode orange and aqua are below 3:1 on the surface, so every chart also has a legend, a hover readout and a table view.
- One axis per chart. Never two scales on one chart.
- Thin marks: columns up to 16px with 4px rounded tops, lines 2px, end dots 8px with a 2px surface ring, area washes at about 10%.
- Hover shows every series at that point. The main charts also have a table view.
- Text is never colored by a series. A colored mark beside the text carries identity.
- Axis labels: full numbers under 10,000, compact (K, M) on an axis that reaches it.

## Not built yet

Drag to pan and wheel or pinch zoom on the main chart, comparing two time ranges, annotations (a job change, a purchase), and large-data downsampling. The first three are interactions on the existing charts. Downsampling belongs in the core.
