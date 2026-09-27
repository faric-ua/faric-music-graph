# Architecture / Product Decisions

## ADR-001 — Web/PWA first
Status: ACCEPTED FOR v0.x.

Reason: graph visualization, filtering and cross-platform access are naturally web-oriented. Termux can serve the prototype locally with almost no setup.

## ADR-002 — Graph, not directory tree
Status: ACCEPTED.

Reason: music has many-to-many relationships. Folder hierarchy remains an optional visual projection.

## ADR-003 — Separate Track from TrackVersion
Status: ACCEPTED.

Reason: originals, remixes, edits, live versions and demos must connect without title-only duplication.

## ADR-004 — YouTube read/write separation
Status: ACCEPTED.

Reason: channel analysis must be safe before any mutation is enabled.

## ADR-005 — Graphology + Sigma.js production candidate
Status: PROPOSED.

Reason: expected catalog/channel growth and interactive filtering favor a graph model + WebGL renderer.

Must be confirmed by mobile prototype performance before locking.
