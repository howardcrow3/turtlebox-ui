# Downloads panel (v0.6)

Use this whenever an app does a long-running download: a local AI model, an update, a data pack, an export bundle. The pattern is the one people already know from model managers: a button in the toolbar, a count badge while something is downloading, and a popover that lists every download with its progress. Only the pattern is borrowed. The look is Turtlebox: Inter, role tokens, light and dark.

## Parts

| Part | Class | Rules |
| --- | --- | --- |
| Toolbar button | `.tb-dl-btn` in `.tb-dl-anchor` | Top right of the page area, 28px, download glyph. Hidden (`data-idle="true"`) when the app has never downloaded anything this session. |
| Count badge | `.tb-dl-badge` | Accent fill with a number: how many downloads are running or waiting. Gone when the count is 0. Never colour alone: the button's `aria-label` says "Downloads, 1 active". |
| Popover | `.tb-dl` | 400px wide, opens under the button, closes on Escape, outside click or the close button. Header "Downloads", then a filter box. |
| Filter | `.tb-dl-filter` | Filters both groups by name as you type. |
| Groups | `.tb-dl-group`, `.tb-dl-glabel` | **Ongoing** (running, waiting, paused) and **Completed** (done, failed, canceled, newest first). "Clear all" on Completed forgets finished items. An empty group is not shown. |
| Row | `.tb-dl-item` | Name, a `.tb-progress` bar, then one status line, and the actions on the right. |
| Status line | `.tb-dl-meta` | `31.75 GB of 63.39 GB • 2.00 MB/s • 4 hrs 24 mins left`. Paused: `Paused • 31.75 GB of 63.39 GB`. Failed: `Failed • the reason`, with a Retry action. |
| Actions | `.tb-dl-act` | Round 22px icon buttons. Running: Pause and Cancel. Paused: Resume and Cancel. Failed or canceled: Retry. Every one has an `aria-label` and a title. |
| Inline card | `.tb-dl-card` | The same row inside a screen, for onboarding or a settings tab. Same state, same words, same actions. |

## One state for the whole app

`js/tb-downloads.js` holds the state. An app creates one store, feeds it progress from whatever does the download, and every view draws from it: the popover, the toolbar badge and any inline card. A download is never tracked by a screen on its own, because then two screens would disagree.

```js
import { createDownloads } from './tb-downloads.js';
const downloads = createDownloads();
downloads.update({ id: 'model:qwen', name: 'Qwen 3 8B', total: 4_900_000_000, done: 1_200_000_000, state: 'running',
  actions: { pause, cancel } });
```

States: `queued`, `running`, `paused`, `failed`, `canceled`, `done`. Speed is a moving average of how fast `done` grows, and the time left comes from it, so the number does not jump. If an app cannot pause a transfer, leave `pause` out and the button is not drawn. If the partial file is kept, pause can be implemented as cancel plus a later resume.

## Rules

1. Any download that can take more than a few seconds goes in the panel. Opening the popover is never required: the inline card may show the same item where the user is already looking.
2. The user can always stop it. Cancel is present on every active row.
3. Failed items stay in the list with the reason and a Retry action until cleared.
4. Sizes are decimal (GB, MB), speed is MB/s, time left uses "hrs" and "mins". Sizes in the app's own data are bytes.
5. Nothing blocks the app while a download runs. The row says so only when the app would not work without it.
6. Reduced motion: the bar still moves in steps, with no animation.

## Adoption

CeeVee (local AI model download, setup card and onboarding), Golden and backer load `css/downloads.css` and `js/tb-downloads.js` and mount the button in their page toolbar. See `preview/downloads.html` for the pattern in light and dark.
