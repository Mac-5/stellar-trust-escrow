# Issue 3 — WalletConnectButton edge-case test coverage

**Category:** Testing · **Priority:** Low

## What was implemented

Added `frontend/tests/components/WalletConnectButton.test.jsx` covering the
existing happy-path behavior plus the previously-untested edge cases:

- **Empty input** — an empty string `address=""` falls back to the
  `"Connect wallet"` label, same as omitting the prop entirely.
- **Malformed data** — a too-short/malformed address (`"GABC"`, well under
  the 56-character length of a real Stellar public key) is rendered without
  throwing, documenting the current `slice(0, 4)` / `slice(-4)` overlap
  behavior for short strings.
- **Unhappy path** — a non-string, falsy `address` value (`null`) falls back
  to the default label instead of crashing on `.slice()`, and clicking the
  button when `onClick` is omitted (the component's own default no-op)
  resolves without throwing.
- An additional accessible-name check confirms the visible button text and
  the accessible name stay in sync (relevant since the button relies on
  `aria-label` mirroring its own children).

Seven test cases total (three happy-path + four edge-case), well above the
"at least 3 new test cases" bar. `frontend/components/WalletConnectButton.jsx`
was **not modified** — this is test-only coverage, per the acceptance
criteria.

## Acceptance criteria

- [x] At least 3 new test cases covering documented edge cases (4 added:
      empty input, malformed address, non-string/null address, missing
      onClick handler).
- [ ] Tests pass in CI — not run in this change; no test/build step was
      executed as part of this task. The suite follows the same
      `@testing-library/react` + `jest` patterns already used elsewhere in
      `frontend/tests/components/`, so it should run under the existing
      Jest config (`frontend/jest.config.js`) without extra setup.
- [x] No change to production code — only the new test file was added.
