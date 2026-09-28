# FARIC Music Graph — Current Handoff

Updated: 2026-09-28

Repository: `faric-ua/faric-music-graph`
Default branch: `main`

## Stable foundation

- project isolated from YTM/Renault;
- Termux private checkout + menu + Widget smoke PASS;
- crash-recovery `ACTIVE_PLAN.md` rule active;
- release/QA documentation workflow active;
- initial Prodigy + Linkin Park prepared catalog known;
- v0.1.1 produced an improved 2D prototype and a simple spherical Canvas prototype;
- v0.1.1 implementation/CI evidence is preserved as prototype history.

## Product direction accepted 2026-09-28

The flat “one big graph” model is no longer the target UX.

Primary product model:
**Nested 3D Worlds**.

```text
Universe → Account → Year → Genre → Artist → Release → Track
```

At every graph level:
- contextual filters;
- breadcrumb;
- floating node-control palette;
- Expand/Collapse selected;
- Expand/Collapse all;
- explicit Enter/Back/Home;
- Fit;
- selection separate from drill navigation.

Filter panel:
- single-column;
- portrait bottom sheet about 45–55% height;
- landscape/tablet side sheet about 40–50% width;
- scrollable body;
- Reset/Apply always visible;
- draft filters do not change graph before Apply by default.

Final product target:
**signed Android APK**.

Web/PWA is the development/prototyping surface.

Sibling YTM/Renault repositories are read-only engineering references for this project.

## Current milestone

`v0.2.0 — Nested 3D Worlds foundation`

Release/product docs created before feature code:
- `docs/product/PRODUCT_VISION.md`;
- `docs/architecture/NESTED_3D_WORLDS.md`;
- `docs/design/MOBILE_UI_BLUEPRINT.md`;
- `docs/android/APK_DELIVERY_CONTRACT.md`;
- `docs/v.0.2.0/`.

## Next exact work

Read `ACTIVE_PLAN.md`.

Implementation checkpoint:
- renderer-independent `GraphSessionState` + command reducer implemented on source `2bc8c90adae36cc7ee3d6402a3a4cfe1c99a82b2`;
- state tests cover selection vs Enter, expand/collapse, draft/apply filters, Back/Home/breadcrumb-depth navigation and serialization/restore;
- first CI run `36361888481` correctly failed because one test assumed Expand All should erase unrelated expansion state;
- test semantics were corrected without weakening the implementation contract;
- CI run `36362006903` — PASS.

Projection checkpoint:
- nested world projection engine implemented on source `8e7f16bf9b80bf9414b424dfa86488a48dba68fc`;
- it separates canonical/projection data from rendering, obeys current scope, drill level, applied filters and expand/collapse state;
- facet-aware filters do not erase deeper node types that do not own that facet;
- predicted full expansion counts unique node IDs rather than duplicate graph paths;
- CI runs `36362295175` and `36362342273` exposed the initial overcount contract issue;
- corrected CI run `36362381756` and PR run `36362384151` — PASS.

Account checkpoint:
- provider-neutral Account model implemented on `dd4b7ca3c01a583f570361445d6e3ca41fde6cbf`;
- `@faric_ua` is represented as the known public target with unverified `externalAccountId=null`;
- a second account is explicitly synthetic/fixture-only;
- auth/secrets are forbidden from the fixture/model;
- Universe supports visible non-navigation `RELATED_ACCOUNT` edges;
- canonical identity is separated from contextual projection identity;
- CI run `36362670818` — PASS.

Adaptive filter checkpoint:
- implementation branch: `feat/v0.2.0-adaptive-filter-panel`;
- source: `ab5071e83a8eec60ec4242b9ae0ecb656364ec8a`;
- filter panel is one-column with independently scrollable body and fixed Reset/Apply footer;
- portrait uses a 45–55% bottom sheet; landscape/tablet/desktop uses a 40–50% side sheet;
- filter changes write only to `draftFilters`; graph data is rebuilt only after explicit Apply;
- Reset returns draft filters to defaults without silently applying them;
- applied-filter badge and pending-draft marker are separate;
- semantic filters implemented for search, artist, year range, genre and release type;
- renderer/legacy structure controls remain prototype-only and are not counted as semantic filters;
- automated filter/layout contract added;
- CI run `36368444005` — PASS;
- browser/phone UX acceptance is still pending and must not be inferred from CI.

Node-control palette checkpoint:
- implementation source: `fd4e13c1e88f0573cd67ccf0e728de5ed4ff9730`;
- persistent approximately 50%-transparent two-column floating palette added;
- commands exposed: Expand All, Collapse All, Expand Node, Collapse Node, Back, Enter, Home and Fit;
- node selection is wired into `GraphSessionState`;
- `FIT_VIEW` is a renderer-independent transient command and does not pollute serialized session state;
- current legacy renderer supplies visible/expandable command context, while Enter remains safely disabled until canonical nested projection marks a node enterable;
- dedicated command/palette contract tests added;
- CI run `36374847098` — PASS;
- browser/phone ergonomics remain unaccepted until later QA.

First unchecked step:
**implement breadcrumb + Enter/Back/Home navigation on top of the canonical drill-path contract.**

Do not start YouTube write actions. Do not start Android packaging before the graph state/navigation contracts are implemented and phone-testable.
