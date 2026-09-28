# v0.2.0 Bug / Finding Register

## FINDING-004 — Mobile graph controls
Status: carried forward. v0.2.0 replaces flat Canvas interaction with the new navigation/control contract.

## FINDING-005 — Spherical/3D feasibility
Status: product direction accepted as primary exploration model; renderer still unaccepted until phone/performance QA.

## PRODUCT-001 — Nested 3D Worlds
Status: FOUNDATION IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-001 — Adaptive filter panel
Status: IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-002 — Persistent floating node-control palette
Status: IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-003 — Explicit selection vs Enter
Status: IMPLEMENTED / CI PASS / PHONE QA PENDING.

Reason: orbit/pan gestures must not accidentally drill into nodes.

## BUG-001 — Browser runtime control/navigation functions were missing
Status: FIXED / CI REGRESSION ASSERTION ADDED.

Found during Expand All guard work:
`app.js` still called `currentControlCapabilities()`, `renderNavigationState()` and `renderNodeControls()`, but their definitions had been lost during earlier canonical-projection edits. Prior CI parsed the browser entrypoint but did not execute it.

Fix:
- restore all three runtime functions;
- derive capability overrides from the current canonical projected world;
- assert function definitions in automated guard tests.

Fixed source:
`f3e1db37a0ed620f5e1c51c9b05937e6ea373a87`.

CI:
`36376362499` — PASS.

## PERF-001 — Expand All immediate threshold is unmeasured
Status: OPEN MEASUREMENT / SAFE GUARD IMPLEMENTED.

Until real target-phone measurement establishes a safe immediate node budget, non-trivial Expand All requires explicit confirmation. No production threshold is guessed in code or docs.

## BUG-002 — Non-Track tap opened raw debug JSON and left Enter stale
Status: MERGED / CI PASS / PHONE RETEST PENDING.

Found during real-phone v0.2.0 QA on 2026-09-28.

Observed:
- tapping `FARIC UA` selected the Account but immediately opened a raw JSON debug inspector;
- the inspector obscured the graph/control palette on mobile;
- `canEnter` was still taken from the pre-selection projected world, so the visible Enter/→ control could remain disabled until another rebuild.

Fix:
- Account/Year/Genre/Artist/Release tap now performs selection only;
- automatic inspector opening is restricted to terminal Track nodes;
- selection triggers a projection rebuild so Enter/expand capabilities reflect the new selection immediately;
- legacy non-Track debug inspector rendering is removed from the normal product path.

Merged source:
`ef0a6029b7593a33933e803477523d6f3355a4e9`

CI:
- PR run `36441340178` — PASS;
- post-merge `main` run `36441389775` — PASS.

Phone recheck:
- select `FARIC UA`;
- verify no JSON inspector opens;
- verify →/Enter becomes enabled immediately;
- enter Account and continue canonical drill.

## UX-004 — Compact mobile graph controls
Status: MERGED / CI PASS / PHONE RETEST PENDING.

Real-phone feedback: persistent right-side node controls plus bottom-right zoom controls consume too much graph space.

Adjustment:
- mobile zoom `− / +` moved into one compact top-right graph row;
- node controls are hidden by default on mobile and opened from a compact `⋮` button in the same row;
- desktop floating palette behavior remains unchanged.
