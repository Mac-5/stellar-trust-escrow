# Null/undefined check standardization — escrow routes & controller

## What was implemented

`backend/api/routes/escrowRoutes.js` is pure route wiring (imports +
`router.get/post/...` calls) and, on inspection, contained no null/undefined
checks of its own — the actual `== null` / `=== undefined` / truthy-check
inconsistency lived one layer down, in `backend/api/controllers/escrowController.js`,
which the routes file wires up directly. Both files were addressed:

- **`backend/api/controllers/escrowController.js`**
  - Added a file-level comment documenting the convention now used:
    `value == null` / `value != null` for "is this absent?" checks where
    `null` and `undefined` should be treated the same, and `value === undefined`
    reserved for the few spots where an explicit `null` is a distinct,
    meaningful input (documented inline at each such spot).
  - Consolidated four genuinely-equivalent checks onto the `== null` /
    `!= null` pattern: the CSV export cursor check, the broadcast-created
    `escrowId` check, the `updateEscrowMetadata` guard (previously
    `=== undefined || === null`), and the cache-hit check in `getEscrow`
    (previously `!== null && !== undefined`).
  - Left the three-state checks in `cloneEscrow` and `broadcastCreateEscrow`
    (`amountOverride`, `deadlineOverride`, `fundingDeadline`) using
    `!== undefined` / `=== null` as separate, explicit conditions, each now
    with a comment explaining why they're exceptions — collapsing them to
    `== null` would change behavior (an explicit `null` currently means
    "clear this field" or "invalid input", not "not provided").
- **`backend/api/routes/escrowRoutes.js`** — replaced the one bare truthy
  check (`req.query.cursor || 'first'`, used to build a cache tag) with an
  explicit absence check, matching the convention above.

## Regression test

Added to `backend/tests/escrowController.test.js`, under `broadcastCreateEscrow`:
- Omitting `fundingDeadline` entirely still succeeds with no validation.
- An **explicit** `fundingDeadline: null` is still rejected with 400, rather
  than being silently treated as "not provided" — this is the exact
  behavior a naive `!= null` collapse would have broken.

## Behavior

No behavior change for valid inputs. The four consolidated checks were
provably equivalent to their originals; the three-state checks were left
alone precisely to avoid changing behavior.
