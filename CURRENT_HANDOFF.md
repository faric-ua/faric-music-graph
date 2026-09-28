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

Node-control checkpoint:
- implementation branch: `feat/v0.2.0-node-controls`;
- source: `c22d538e80b70632ef54520e422bdb6ca05c5c2f`;
- floating palette uses an approximately 50%-transparent surface and 48px minimum touch targets;
- controls implemented for Expand All, Collapse All, Expand selected, Collapse selected, Enter, Back, Home and Fit;
- control enable/disable state is derived from `GraphSessionState` plus the current prototype graph;
- current Canvas prototype now honors scope + expand state for visible-node projection;
- selection is wired into `GraphSessionState`;
- Enter changes scope; Back/Home restore semantic navigation state; Fit remains renderer-local;
- this prototype visibility adapter is temporary and does not replace the upcoming canonical Account → Year → Genre → Artist → Release → Track projection;
- automated node-control capability/layout contract added;
- CI run `36368864096` — PASS;
- browser/phone UX acceptance remains pending.

Breadcrumb/navigation checkpoint:
- implementation branch: `feat/v0.2.0-breadcrumb-navigation`;
- source: `c0f95baef1d1110ef2f3ec228605d996fe8eb006`;
- header now exposes an always-reachable horizontal breadcrumb derived from `GraphSessionState.drillPath`;
- current scope is visually distinct; ancestor crumbs are tappable and dispatch `JUMP_TO_DEPTH`;
- breadcrumb scrolls horizontally for deep paths rather than wrapping over the graph;
- compact header Back/Home/Enter uses the same handlers as the floating node-control palette;
- Enter is enabled only for a selected node with children; Back/Home follow semantic drill history;
- mobile header uses compact controls while preserving breadcrumb access;
- automated breadcrumb/shared-command contract added;
- CI run `36369197076` — PASS;
- browser/phone layout and gesture acceptance remain pending.

Canonical nested-drill checkpoint:
- implementation branch: `feat/v0.2.0-canonical-nested-drill`;
- source: `802d652d2cfc57b95ab0cd02685c1c99f3465b04`;
- `app.js` now renders `GraphProjection.projectWorld()` instead of the temporary Artist/Year Canvas hierarchy;
- browser prototype graph is built through `NestedWorldModel` as Universe → Account → Year → Genre → Artist → Release → Track;
- canonical IDs are separated from contextual projection IDs, so one canonical release may appear in multiple genre contexts without identity collision;
- provider-neutral Account fixture is the Universe root source;
- browser Account fixture is regression-checked against `data/accounts.fixture.json`;
- sample account-to-release assignments are explicitly marked `PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY`; they are not claimed as live @faric_ua inventory;
- current 7-release browser sample is used only for this navigation foundation; the prepared 88-release / 863-track migration remains a later separate gate;
- ancestor search terms are propagated so descendant text search can preserve a visible path through parent worlds;
- legacy user-selectable hierarchy switch was removed; the product hierarchy is now fixed;
- CI run `36369595825` — PASS, including an automated full drill to terminal Track;
- browser/phone UX acceptance remains pending.

Structured Track terminal-details checkpoint:
- implementation branch: `feat/v0.2.0-track-terminal-details`;
- source: `1b081ee404a35cedd7451d3f559fd7a4e18acf57`;
- terminal Track selection now renders grouped product-facing details instead of raw JSON;
- the detail model aggregates one canonical Track across contextual Account/Year/Genre/Artist/Release appearances while preserving the selected projection ID;
- known sample facts are grouped into identity, current context, artists/releases and account contexts;
- TrackVersion relationships, playlists, exact YouTube/YTM IDs/URLs, duration and availability remain explicitly unknown/unmodeled instead of being inferred;
- prototype Account assignments are clearly marked `PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY`; live account inventory is not claimed;
- fixture-account context, unverified inventory, unavailable TrackVersion data and unknown external media identity emit explicit warning codes;
- opening/closing the inspector is now represented in `GraphSessionState.inspector`, preparing later restoration coverage;
- CI run `36375617001` — PASS;
- browser/phone visual acceptance remains pending.

Semantic session-restoration checkpoint:
- implementation branch: `feat/v0.2.0-session-restoration`;
- source: `cfbc6540b95a336e8096a1a25bbd709da1373340`;
- semantic session is persisted under a versioned local-storage key;
- restore validates the stored drill path against current canonical navigation edges before accepting it;
- valid restore preserves drill path/current scope, selected node, applied filters, pending draft filters, filter-panel visibility, inspector target/mode and renderer mode;
- Track inspector is rebuilt from semantic inspector state instead of replaying selection/Enter;
- stale graph paths or corrupt serialized state fail closed to a fresh Universe session and the invalid stored session is discarded;
- a missing inspector target closes only the inspector while preserving the rest of a valid session;
- blocked/unavailable browser storage degrades safely without breaking startup;
- automated test uses a GraphState wrapper whose reducer throws during restore, proving restore does not replay semantic commands;
- CI run `36375948517` — PASS;
- camera/orbit persistence remains optional/later and phone/WebView lifecycle acceptance remains pending.

Expand All performance-guard checkpoint:
- implementation branch: `feat/v0.2.0-expand-all-guard`;
- source: `f3e1db37a0ed620f5e1c51c9b05937e6ea373a87`;
- projection now exposes scope-limited `bulkExpandNodeIds`, so bulk commands no longer write expandable IDs from unrelated worlds into the session;
- predicted fully-expanded node count is used as the guard input;
- no permanent node threshold was guessed: `EXPAND_ALL_TESTED_IMMEDIATE_NODE_LIMIT=null` until measured on the real target phone;
- with an unmeasured budget, non-trivial Expand All requires explicit confirmation;
- Cancel returns the exact unchanged semantic session object;
- a future measured limit can allow immediate application below the tested budget and confirmation above it;
- confirmation UI shows current visible count, predicted count/additional nodes and whether a tested budget exists;
- Collapse All now uses the same scope-limited bulk ID set;
- CI run `36376362499` — PASS.

Runtime wiring correction discovered during this step:
- `currentControlCapabilities()`, `renderNavigationState()` and `renderNodeControls()` had been accidentally lost from `app.js` during earlier canonical-projection work while call sites remained;
- prior CI did not execute the browser entrypoint, so syntax/unit checks did not catch the missing runtime functions;
- the functions were restored and a static runtime-wiring assertion was added to prevent recurrence.

Final static/unit/schema validation checkpoint:
- validation branch: `test/v0.2.0-validation-gate`;
- tested source: `acb642f40bb9bf6f3567dd15aa4050e0e9c7a713`;
- CI run `36376536482` — PASS;
- repository/static validation PASS;
- JavaScript syntax PASS;
- GraphState PASS;
- projection engine PASS;
- Account model PASS;
- adaptive filters PASS;
- node-control palette PASS;
- breadcrumb/navigation PASS;
- canonical nested drill PASS;
- structured Track details PASS;
- semantic session restoration PASS;
- Expand All performance guard PASS;
- JSON Schema conformance PASS;
- Git whitespace check PASS;
- Account schema test verifies the canonical fixture and negative required/type/const/additionalProperties cases.

Merged phone-QA candidate checkpoint:
- PRs #15–#19 were merged through the established PR workflow;
- validated runtime/code baseline: `f25cb380fe7b95a76abc56426bbdc8174ef04e27`;
- PR #19 validation run `36435030701` — PASS;
- post-merge `main` validation run `36435075892` — PASS;
- docs-only handoff then advanced `main` without changing runtime code.

Real-phone QA finding/fix checkpoint:
- BUG-002 found on phone: non-Track tap opened raw debug JSON and Enter capability stayed stale after selection;
- UX-004: persistent mobile controls occupied too much graph space;
- PR #21 merged the fix into `main` at `ef0a6029b7593a33933e803477523d6f3355a4e9`;
- PR validation run `36441340178` — PASS;
- post-merge `main` validation run `36441389775` — PASS;
- non-Track nodes now select without opening debug JSON;
- selection rebuilds projection/capabilities so →/Enter can enable immediately;
- mobile `− / + / ⋮` quick controls are grouped at the top; the node palette opens on demand.

First unchecked step:
**update the phone to current `main`, record the tested HEAD, and retest BUG-002/UX-004 before continuing canonical Test 2.**

Do not start YouTube write actions. Do not start Android packaging before the graph state/navigation contracts are implemented and phone-testable.
