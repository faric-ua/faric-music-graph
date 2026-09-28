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
