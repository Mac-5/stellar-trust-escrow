# Issue 1 — Ledger keyboard accessibility

**Category:** Accessibility · **Priority:** Medium

## Note on target file

The issue referenced `backend/services/ledgerService.js`, which does not exist
in this repository (it is a backend Node module path and has no interactive
UI elements — key handlers don't apply there). The closest real match for
"ledger" + "interactive elements operable only by mouse" is the transaction
ledger UI at `frontend/components/profile/WalletLedger.jsx`, so the fix was
applied there.

## What was implemented

- Added an explicit `onKeyDown` handler (`handleRowKeyDown`) to each
  transaction row toggle button:
  - `Enter` explicitly toggles the row open/closed (in addition to the
    browser's native Enter/Space handling for `<button>` elements).
  - `Escape` collapses the currently expanded row and returns focus to its
    toggle button, so keyboard users don't need to hunt for the control
    again after closing details.
- Added an `onKeyDown` handler (`handleLinkKeyDown`) to the nested "View on
  Stellar Expert" link that stops `Enter`/`Space` from bubbling up and
  re-triggering the row's own toggle — mirroring the `stopPropagation`
  already applied to that link's `onClick`, so keyboard behavior matches
  mouse behavior.
- Switched focus ring classes from `focus:ring-2` to
  `focus-visible:ring-2` with `focus-visible:ring-offset-2` on both the row
  button and the link, so the focus indicator is clearly visible for
  keyboard users without adding a ring on mouse clicks.

## Acceptance criteria

- [x] Component is fully operable via keyboard (Tab moves between the
      native `<button>`/`<a>` elements, Enter/Space activates them, Escape
      collapses an open row).
- [x] Focus states are visible (`focus-visible` ring + offset).
- [x] No regression to existing click handlers — `onClick` handlers were
      left untouched; only `onKeyDown` handlers were added alongside them.
