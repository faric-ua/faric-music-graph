# YouTube / YouTube Music Channel Contract

Target: `@faric_ua`.

## Phase A — read-only

Allowed:
- resolve channel identity;
- list public/account-visible videos/playlists/items;
- snapshot;
- match;
- classify;
- calculate differences;
- estimate quota.

No remote mutation.

Matching states:
- MATCHED;
- MISSING;
- DUPLICATE;
- VARIANT_MISMATCH;
- NEEDS_REVIEW;
- UNAVAILABLE;
- UNRESOLVED.

Store match confidence/evidence. Prefer exact external IDs over title matching.

## Phase B — preview

A write plan must show:
- exact target channel/playlist ID;
- exact item/version;
- operation;
- duplicate impact;
- quota estimate;
- warnings;
- what remains unchanged.

Cancel = no-op.

## Phase C — write

Only after explicit user confirmation.

Requirements:
- duplicate/idempotency guard where possible;
- per-item result;
- read-after-write verification;
- audit log;
- no hidden retry that can duplicate content.

OAuth tokens, refresh tokens, client secrets and private API keys never enter Git.
