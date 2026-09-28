# v0.2.0 — Nested 3D Worlds Foundation

## Goal

Replace the flat prototype UX with the product navigation model:

```text
Universe → Account → Year → Genre → Artist → Release → Track
```

## Scope

- renderer-independent session/navigation state;
- drill path + breadcrumb;
- contextual world projection;
- adaptive filter panel with draft/applied state;
- fixed filter footer;
- floating translucent node controls;
- expand/collapse selected;
- expand/collapse all;
- Enter / Back / Home / Fit;
- Track terminal detail model;
- state restoration contract;
- tests for navigation/filter semantics.

## Explicit non-goals

- final production renderer decision;
- YouTube write actions;
- final Android APK release;
- full account/channel mutation flow.

## Product source

- `docs/product/PRODUCT_VISION.md`
- `docs/architecture/NESTED_3D_WORLDS.md`
- `docs/design/MOBILE_UI_BLUEPRINT.md`


## Implementation checkpoint — GraphSessionState

Implemented renderer-independent semantic session state:
- drill path/current scope;
- selected node;
- expanded/collapsed node IDs;
- draft/applied filters;
- filter-panel visibility;
- renderer mode;
- camera state;
- inspector state;
- navigation snapshots/history;
- serialization/restore.

Tested source:
`2bc8c90adae36cc7ee3d6402a3a4cfe1c99a82b2`

CI:
`36362006903` — PASS.

Next implementation unit: projection engine.


## Implementation checkpoint — Projection Engine

Added renderer-independent nested-world projection:
- level sequence enforcement;
- current-scope projection;
- facet-aware applied filters;
- explicit expansion/collapse visibility;
- breadcrumb and command capabilities;
- visible node/edge metrics;
- unique-node full-expansion estimate;
- terminal Track handling;
- dangling-edge validation.

Tested source:
`8e7f16bf9b80bf9414b424dfa86488a48dba68fc`

CI:
`36362381756` — PASS.

Next unit: provider-neutral Account data + multi-account fixture.


## Implementation checkpoint — Account model

Added:
- provider-neutral Account entity model;
- public-target record for `@faric_ua`;
- synthetic second account for Universe testing;
- no-auth-data guard;
- Account JSON schema;
- non-navigation account relationship;
- channel-target → Account link;
- canonical vs contextual projection identity rule.

Tested source:
`dd4b7ca3c01a583f570361445d6e3ca41fde6cbf`

CI:
`36362670818` — PASS.

Next unit: adaptive filter panel.


## Implementation checkpoint — Adaptive filter panel

Added:
- responsive filter sheet with one-column content;
- portrait bottom-sheet sizing at roughly 45–55% of viewport height;
- landscape/tablet/desktop side-sheet sizing at roughly 40–50% of viewport width;
- independently scrollable filter body;
- fixed Reset/Apply action footer;
- explicit draft/applied state through `GraphSessionState`;
- pending-draft marker separate from applied-filter count;
- semantic filter model for search, artist, year range, genre and release type;
- Reset-as-draft-only behavior;
- Apply-only graph rebuild;
- automated model/state/layout contract checks.

Tested source:
`ab5071e83a8eec60ec4242b9ae0ecb656364ec8a`

CI:
`36368444005` — PASS.

Evidence level:
automated/static only. Browser portrait/landscape and real-phone gesture/filter acceptance remain pending.

Next unit: floating node-control palette and command wiring.


## Implementation checkpoint — Floating node controls

Added:
- persistent floating node-control palette;
- approximately 50%-transparent palette surface;
- minimum 48px touch targets;
- Expand All / Collapse All;
- Expand selected / Collapse selected;
- Enter / Back / Home / Fit;
- capability-driven enabled/disabled states;
- selection wiring into `GraphSessionState`;
- temporary prototype visibility adapter so expand/collapse and scope navigation are visible on the existing Canvas prototype;
- separate zoom controls retained outside the semantic node palette.

Tested source:
`c22d538e80b70632ef54520e422bdb6ca05c5c2f`

CI:
`36368864096` — PASS.

Evidence level:
automated/static only. Browser and real-phone ergonomics are still pending.

Important:
the temporary Canvas visibility adapter is not the final nested-world projection. The canonical Account → Year → Genre → Artist → Release → Track renderer projection remains a later checklist item.

Next unit: breadcrumb + Enter/Back/Home navigation surface.


## Implementation checkpoint — Breadcrumb navigation

Added:
- always-reachable header breadcrumb derived from `GraphSessionState.drillPath`;
- horizontally scrollable deep-path behavior;
- current-scope emphasis;
- direct ancestor jump through `JUMP_TO_DEPTH`;
- compact header Back / Home / Enter controls;
- shared command handlers between header navigation and floating node palette;
- capability-driven navigation state so terminal/non-child selections cannot Enter.

Tested source:
`c0f95baef1d1110ef2f3ec228605d996fe8eb006`

CI:
`36369197076` — PASS.

Evidence level:
automated/static only. Header fit, touch comfort, portrait/landscape behavior and real-phone acceptance remain pending.

Next unit: canonical Nested 3D drill projection through Account → Year → Genre → Artist → Release → Track.


## Implementation checkpoint — Canonical nested drill

Added:
- canonical browser graph builder for Universe → Account → Year → Genre → Artist → Release → Track;
- renderer now consumes `GraphProjection.projectWorld()`;
- contextual projection IDs separated from canonical entity IDs;
- multi-genre contextual paths can point to the same canonical Artist/Release/Track identity;
- Account fixture drives the Universe level;
- browser Account fixture is checked against canonical `data/accounts.fixture.json`;
- prototype-only account→release assignments carry the explicit status `PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY`;
- current 7-release browser sample only; no false claim that the prepared 88/863 catalog or live channel inventory has been migrated;
- ancestor search enrichment to retain navigable paths to matching descendants;
- fixed product hierarchy; the legacy hierarchy selector was removed.

Tested source:
`802d652d2cfc57b95ab0cd02685c1c99f3465b04`

CI:
`36369595825` — PASS.

Automated drill proof:
`Universe → FARIC UA → 1994 → Big Beat → The Prodigy → Music for the Jilted Generation → Voodoo People`,
with Track terminality and a seven-level breadcrumb asserted.

Evidence level:
automated/static only. Browser/phone UX remains pending.

Next unit: structured terminal Track details.


## Implementation checkpoint — Structured Track terminal details

Added:
- renderer-independent Track detail aggregation keyed by canonical Track identity;
- structured terminal UI replacing raw Track JSON;
- grouped identity, current context, Artist/Release, Account/playlist, external-media, availability, provenance and warning sections;
- contextual appearance aggregation with canonical deduplication;
- explicit unknown/unmodeled states for data not yet present in the canonical sample;
- explicit prototype-only account-assignment boundary;
- inspector open/close state wired into GraphSessionState for later restore coverage.

Tested source:
`1b081ee404a35cedd7451d3f559fd7a4e18acf57`

CI:
`36375617001` — PASS.

Evidence level:
automated/static only. Browser and real-phone layout/usability remain pending.

Next unit: restoration tests for drill path, filters, selected node and open panels.
