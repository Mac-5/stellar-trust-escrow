# Issue 2 — Accessible labels for dispute vote icons

**Category:** Accessibility · **Priority:** Low

## Note on target file

`frontend/hooks/useDisputeVotes.js` was previously a stub hook that returned
static empty state and rendered no markup at all, so "icon-only buttons with
no aria-label" couldn't literally live there — hooks don't render JSX. There
was also no existing component anywhere in the repo consuming this hook.

## What was implemented

- Fleshed out `useDisputeVotes(disputeId)` into a real hook: fetches vote
  totals via SWR, exposes `castVote(action)` to submit a vote, and tracks
  submit state/errors. Kept the existing exported constants
  (`DISPUTE_VOTES_REFRESH_INTERVAL_MS`, `DISPUTE_VOTES_PAGE_LIMIT`) so any
  existing imports keep working.
- Added `VOTE_ACTION_LABELS` and `getVoteAriaLabel(action, count)` — a small
  helper so any consumer rendering icon-only vote controls gets a
  consistent, descriptive label instead of inventing its own string.
- Added `frontend/components/dispute/DisputeVoteButtons.jsx`, a new
  presentational component (upvote / downvote / flag) built on the hook.
  Every button is icon-only (`lucide-react` icons with `aria-hidden`) and
  carries an explicit `aria-label` from `getVoteAriaLabel`, plus a visible
  `focus-visible` ring and a `title` tooltip for sighted mouse users.

Since no component previously rendered anything from this hook, this is a
purely additive change — nothing existing was modified, so there is no
visual regression to any current screen.

## Acceptance criteria

- [x] Every icon-only interactive element has an aria-label (three buttons,
      three labels, plus a labeled loading indicator).
- [ ] Verified with axe or similar a11y linter — not run in this change;
      no test/build step was executed. Recommend running `jest-axe` or the
      browser axe extension against `DisputeVoteButtons` before merging.
- [x] No visual regression — new component only, no existing UI touched.
