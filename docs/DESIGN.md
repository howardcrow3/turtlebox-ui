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

## Charts

See `docs/CHARTS.md`. Time-based dashboards share one time bar, and every chart has hover, a legend and a table view.

## Themes

Tokens are in `tokens/tokens.json`. Default follows the system. `data-theme` forces light or dark. Text pairs hold 4.5:1 in both. The Google button uses Google's light and dark variants.

## References

Unsloth Studio (left sidebar with New chat, model picker top-left in chat, stacked form sections with collapsible groups and an action card, full-page progress view with a stop dialog) and the Claude apps (session sidebar with filters and sections, side chat in its own pane, panels beside chat, detail-level toggle, shortcut sheet). The public docs do not describe spacing, type sizes or where settings live, so those come from the product owner's direction.

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
