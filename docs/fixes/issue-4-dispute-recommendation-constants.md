# Issue 4 — Named constants for dispute resolution scoring

**Category:** Refactor · **Priority:** Medium

## Note on target file

`backend/api/routes/disputeRoutes.js` itself contains no inline numeric
literals — it's a thin router that delegates to
`disputeController.js` and already uses named `TTL.LIST`/`TTL.DETAIL`
constants for caching. The unexplained magic numbers actually live one
layer down, in the controller function that powers the route's
`GET /:id/resolve/recommendation` endpoint
(`disputeRoutes.js:88-95` → `disputeController.getRecommendation` →
`generateResolutionRecommendation`), so the extraction was applied there.

## What was implemented

Replaced the bare numeric literals in `generateResolutionRecommendation()`
with named, documented constants declared near the existing
`DISPUTE_MAX_LIMIT`:

| Old literal | New constant | Meaning |
|---|---|---|
| `0.5` (starting confidence) | `RECOMMENDATION_BASE_CONFIDENCE` | Baseline confidence for the default "manual_review" outcome |
| `0.2` (file evidence bump) | `FILE_EVIDENCE_CONFIDENCE_BOOST` | Bump when documentary evidence exists |
| `0.1` (imbalance bump, ×2) | `EVIDENCE_IMBALANCE_CONFIDENCE_BOOST` | Bump when one side's evidence count clearly outweighs the other's |
| `2` (imbalance threshold, ×2) | `EVIDENCE_COUNT_IMBALANCE_THRESHOLD` | Minimum lead needed before treating an evidence count gap as significant |
| `0.9` (cap) | `RECOMMENDATION_MAX_CONFIDENCE` | Ceiling so the heuristic never reports full certainty |

Each constant has a one-line comment explaining what it represents and why
that value was chosen. The arithmetic and control flow are unchanged — this
is a pure rename/extraction, so `generateResolutionRecommendation()` still
produces identical output for identical input.

## Acceptance criteria

- [x] All magic numbers replaced with named constants (in the recommendation
      scoring function that backs the referenced route).
- [x] Each constant has a short comment explaining its value.
- [x] Behavior is unchanged — only literal→constant substitution, no logic
      changes.
