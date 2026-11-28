# Turtlebox UX framework, draft v0.2

This supersedes the marketing-site design system where they conflict. The preview page (`preview/ux-plan-v0.2.html`) is the visual reference. Where this file and the preview differ, ask.

## Principles

- Chat anchors the app. Home is a conversation. Work areas sit in the sidebar.
- Everything set once or changed occasionally lives in a settings modal with tabs down the left. It opens from an account menu at the bottom left of the sidebar.
- Sign in with Google is prominent and optional. The app works fully without it.
- Inter only. No serif. Small and tight: 13px body, 12.5px buttons, 15px dialog titles.
- Compact controls. Toggles, segmented controls and selects instead of checkboxes and long forms.
- Warm neutrals and one gold accent. Gold is a fill, never text. `danger` is the only added hue.
- Borders carry structure. One soft shadow is allowed on menus and dialogs.
- Light and dark are both first class. Components use role tokens only, never hex.

## Density

| Element | Size |
| --- | --- |
| Button | 26px, small 22px |
| Input, select | 28px, 26px |
| Toggle | 26 by 15px |
| Chip | 22px |
| Nav item | 28px, sub-item 26px |
| Table row | 30px, header 26px |

## Job types (CeeVee)

A job type is a saved search with its own rules: role (titles, level, function, industry), where and how much (location, remote, minimum salary, words to leave out), where to look (career pages, boards, alert emails, watched companies) and what happens next (daily search, automation level, alerts). Job types sit in the sidebar under Chat, with counts of new matches. Jobs and applications are tracked by job type and by company. Search criteria are not in the settings modal.

## Layout

- **Three panes** for ongoing work: sidebar, work surface (list, form or detail), chat. The chat pane knows what is open: filters, the open object, the selected rows. It can be hidden.
- **Chat page**: the middle pane is the conversation. A right pane opens only when chat produces something to edit.
- **Two-column modal** for short tasks with a clear end (create, review, approve): chat on the left, live draft form on the right. Either side works alone.
- **Settings modal with tabs** for occasional setup. No chat.
- **Confirm dialog** for one decision.

## Chat and forms

- Both edit the same object. Chat changes are shown in the form: changed fields get a gold dot and the old value, the bar shows the count of unsaved changes, and nothing saves until the user accepts.
- Manual edits are visible to chat. The chat pane shows a context chip with what it is looking at.
- In chat, results are three to five compact rows with "Show all in <list>", which opens the full list with the same filters applied.
- Approval cards in chat are compact. The same items also collect in Inbox under "Needs you".

## Lists

- Dense table, one line per row, rows load as you scroll.
- Filters are removable chips above the list. Sort and group controls sit on the right.
- Select with the checkbox, `x`, or shift-click. A bulk bar offers the actions for the selection. Row actions are hover icons only.
- Click a row to open detail in a side panel. Keyboard: `j` and `k` to move, `x` to select.
- Applications default to a board with a column per stage, top cards, and "+N more". A table view is available.
- Controls are compact: 26px buttons, 22px inside rows. Row actions are icons on hover.

## Charts

See `docs/CHARTS.md`. Time-based dashboards share one time bar, and every chart has hover, a legend and a table view.

## Themes

Tokens are in `tokens/tokens.json`. Default follows the system. `data-theme` forces light or dark. Text pairs hold 4.5:1 in both. The Google button uses Google's light and dark variants.

## References

Unsloth Studio (left sidebar with New chat, model picker top-left in chat, stacked form sections with collapsible groups and an action card, full-page progress view with a stop dialog) and the Claude apps (session sidebar with filters and sections, side chat in its own pane, panels beside chat, detail-level toggle, shortcut sheet). Boldin (a competitor to Golden) shows one place for all charts, a Chance of Success headline number, up to 10 saved what-if scenarios compared side by side, and optimistic, average and pessimistic assumption sets. The public docs do not describe spacing, type sizes or where settings live, so those come from the product owner's direction.

## Account pill and menu (rules, v0.5)

The pill is the one place for who you are, your license and every setting. These rules apply to every Turtlebox app.

1. **Pinned.** The pill is always at the bottom left of the window, at every window size, and never needs scrolling to reach. The shell is exactly the window height (`.tb-shell`, `height:100vh`, `overflow:hidden`). Only the page area (`.tb-main`) and the middle of the sidebar (`.side .scroll`) scroll. The pill lives in `.side .acct-foot`, outside the scrolling part.
2. **Shows the license.** The pill's second line is the trial or license status: "Trial · 12 days left", "Trial ended · read-only" or "Licensed". There is no trial or license banner at the top of the page.
3. **One open shows everything.** The menu opens upward from the pill and lists, in order: who is signed in (or a Sign in row), the license block (status, a Buy button during the trial and after it, and "Enter a key"), every settings category as its own row that opens the settings modal on that tab, Send feedback and Help, and the System, Light or Dark control. It caps at the window height minus 80px and scrolls inside itself only on very short windows.
4. **Per-app categories.** Each app lists its own settings tabs from the same registry that drives its settings modal, so a new tab shows up in the menu without extra work.

Classes: `.tb-shell`, `.tb-main`, `.side .scroll`, `.side .acct-foot`, `.acct` (with `.av`, `.n`, `.s`, `.s.soon`, `.s.ended`, `.chev`), `.pop` (with `.who`, `.grp`, `.lic`, `.nav`, `hr`). See `css/components.css`.

## Adoption plan (CeeVee first)

1. Tokens and base CSS
2. Core controls, with tests
3. App shell and account menu
4. Settings modal, one tab at a time
5. Job types: sidebar item, list and editor
6. Lists: table, filters, selection, then the board
7. Three-pane chat handoff and the two-column modal
8. Chat home
9. Sign in with Google
10. Retire the old header and replaced pages

Each step is a small pull request that passes tests before merge. Golden adopts the same tokens and controls after CeeVee's shell is done.

## Adopted in CeeVee (steps 1 to 4, 2026-11-26)

- Tokens are vendored as a copy of `css/tokens.css`, and the old role names are kept as aliases so existing pages did not need to change.
- Account menu at the bottom left holds Settings, Send feedback and a System, Light or Dark control. The choice is stored locally and sets `data-theme`.
- The settings modal is driven by a small tab registry (id and label) so other features add a tab without touching the shell. Other screens open a tab by id.
- A job type is a saved search shown as one dense row with a 26 by 15px switch. Creating one uses an inline form; editing and deleting wait on backend support.
- A button styled as an inline link is used for text that opens a dialog, so it stays keyboard accessible.

## Adopted in CeeVee (steps 5 to 9, 2026-11-27)

- Jobs is one dense table (30px rows) with a status segment and a text filter. Opening a row shows a 300px detail panel on the right; the whole row is the target and it is keyboard operable.
- Applications is a board with at most five cards per column and a "+N more" control, plus a Table view. Status changes use a select on each card; drag and drop is not built yet. Items waiting for approval sit in a strip above the board.
- Sign in with Google is one prominent button with clear states. It appears in setup and under Settings, Accounts, and is optional.
- Chat is the home screen: a centered thread, suggestion chips and one composer. The same chat component opens as a 320px pane beside Jobs and Applications ("Ask CeeVee"), and it is told what is open so "this job" has a meaning. The pane state is remembered per viewer.
- Chat answers only for now. Acting from chat uses the agent harness: reversible changes run, anything riskier becomes an approval.

