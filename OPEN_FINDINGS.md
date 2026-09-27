# Open Findings

## FINDING-001 — Full seed migration
Prepared Prodigy + Linkin Park data predates the canonical v0.1.0 data contract.

Status: OPEN.

Close when the full seed is migrated with canonical IDs, validated edges and provenance.

## FINDING-002 — Channel inventory
The target URL is known, but a complete live inventory has not yet been stored/verified.

Status: OPEN.

## FINDING-003 — Graph engine
The static Canvas prototype proves the interaction concept. Production candidate: Graphology + Sigma.js.

Status: PROPOSED.

Acceptance requires mobile performance/interaction testing.


## FINDING-004 — Mobile graph gestures are not acceptable

Real-phone feedback on 2026-09-28: the current Canvas prototype is difficult to control on a phone and has no usable pinch zoom.

Status: OPEN / BLOCKING MOBILE GRAPH ACCEPTANCE.

Required:
- real two-finger pinch zoom;
- one-finger pan that does not fight node selection;
- tap/select with touch-sized hit targets;
- fit/reset control;
- predictable zoom limits;
- portrait and landscape smoke.

Do not mark the current graph interaction PHONE PASS until these are verified.

## FINDING-005 — Spherical / 3D graph mode feasibility

The user requested investigation of a sphere-like graph where the network can be rotated and explored spatially.

Status: RESEARCHED / PROTOTYPE NEEDED.

Research direction:
- spherical-surface layout: nodes constrained to a sphere, rotatable with pinch/orbit;
- free 3D force graph as comparison;
- keep hierarchical 2D view available until phone evidence proves a 3D mode is better.

Acceptance:
- touch orbit/pan and pinch zoom are comfortable on Android;
- node tap/focus/isolate is reliable;
- labels remain readable;
- full seed performance is acceptable;
- switching view does not change canonical graph data.
