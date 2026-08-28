# Magic-number extraction — dispute chat component

## What was implemented

The issue targeted `frontend/components/DisputePanel.jsx`, but no such file
exists in this repository. The dispute-related frontend components are:

- `frontend/components/dispute/DisputeSubmissionForm.jsx` — already uses
  named constants (`MAX_FILE_SIZE`, `MAX_FILES`, `ALLOWED_TYPES`) with
  explanatory comments; nothing to extract there.
- `frontend/components/escrow/DisputeModal.jsx` — only has cosmetic literals
  (`rows={4}`, `maxLength={2000}`), not timeouts/limits/thresholds.
- `frontend/components/chat/DisputeChat.jsx` — the real-time dispute chat
  panel, which had three genuine unexplained magic numbers governing actual
  behavior (a timeout, a page-size limit, and a length threshold). This is
  the closest match to the issue's description and is the file that was
  edited.

Extracted from `DisputeChat.jsx`:

| Constant | Value | Was |
|---|---|---|
| `MESSAGE_PAGE_SIZE` | 30 | inline `limit=30` in the history-fetch URL |
| `TYPING_STOP_DELAY_MS` | 2000 | inline `2000` in the typing-indicator `setTimeout` |
| `MAX_MESSAGE_LENGTH` | 1000 | inline `maxLength={1000}` on the message textarea |

Each constant has a one-line comment explaining what it represents and why
that value was chosen. Behavior is unchanged — same values, same call sites,
now named.
