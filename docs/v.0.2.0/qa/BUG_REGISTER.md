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

