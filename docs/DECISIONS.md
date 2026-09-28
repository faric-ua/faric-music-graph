# Architecture / Product Decisions

Updated: 2026-09-28

## ADR-001 — Web/PWA as development surface
Status: ACCEPTED.

Reason: graph visualization and rapid iteration are web-oriented.

Clarification 2026-09-28: Web/PWA is not the final product target. Final target is signed Android APK.

## ADR-002 — Graph, not directory tree
Status: ACCEPTED.

Reason: music has many-to-many relationships. Hierarchies are projections.

## ADR-003 — Separate Track from TrackVersion
Status: ACCEPTED.

## ADR-004 — YouTube read/write separation
Status: ACCEPTED.

## ADR-005 — Production graph engine
Status: OPEN / EVIDENCE-DRIVEN.

Earlier Graphology + Sigma.js was only a proposal. Nested 3D requirements mean the final renderer must be re-evaluated.

Data/algorithm and renderer choices may be separate.

## ADR-006 — Nested 3D Worlds
Status: ACCEPTED PRODUCT DIRECTION.

Primary navigation projection:
`Universe → Account → Year → Genre → Artist → Release → Track`.

Reason:
- avoids one giant unreadable graph;
- matches phone drill-down use;
- keeps visible node count bounded;
- allows level-specific filters/actions;
- preserves many-to-many canonical data beneath the view.

## ADR-007 — Selection is separate from Enter
Status: ACCEPTED.

Tap selects/focuses.
Explicit Enter changes scope.

Reason: orbit/pan/tap on mobile must not cause accidental navigation.

## ADR-008 — Draft vs applied filters
Status: ACCEPTED.

v0.2 defaults to explicit Apply.

Live/debounced apply can be enabled later only after measured latency proves it is comfortable.

## ADR-009 — Adaptive filter sheet
Status: ACCEPTED.

Portrait = bottom sheet around half-height.
Landscape/tablet = side sheet around 40–50% width.
Scrollable body + fixed Reset/Apply footer.

## ADR-010 — Floating node-control palette
Status: ACCEPTED.

Persistent semi-transparent graph overlay with Expand/Collapse/Enter/Back/Home/Fit.

## ADR-011 — APK is final product
Status: ACCEPTED.

Browser is development/test surface.
Signed Android APK is the product delivery target.

## ADR-012 — Sibling repositories are read-only references
Status: ACCEPTED.

YTM/Renault engineering lessons may be adapted, but those repositories are not modified during Music Graph work and their signing/security material is never reused.
