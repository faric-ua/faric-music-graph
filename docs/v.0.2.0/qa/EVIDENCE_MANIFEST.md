# v0.2.0 Evidence Manifest

No implementation/phone evidence yet.

## Existing product evidence

2026-09-28 user product direction:
- filters in a single-column dedicated panel;
- panel occupies a substantial portion of screen and scrolls;
- Reset/Apply footer always visible;
- filters need not apply immediately;
- node expand/collapse all and per-selected-node controls;
- forward/back node navigation;
- approximately 50% transparent floating control palette;
- multiple account nodes in 3D;
- drill into Account → Year → Genre → Artist → Album/Release → Track;
- level-specific controls;
- terminal Track information view;
- final product is Android APK;
- every step documented with diagrams and recoverable plan.

This records requirements, not implementation PASS.


## GraphSessionState implementation — 2026-09-28

Implementation source:
`2bc8c90adae36cc7ee3d6402a3a4cfe1c99a82b2`

Automated CI:
- run `36361888481` — FAIL in the new graph-state test only;
- cause: the test incorrectly expected `EXPAND_ALL` to discard an unrelated pre-existing expanded node;
- correction kept the implementation semantics and isolated the test scope;
- run `36362006903` — PASS.

Verified by automated tests:
- node selection does not implicitly drill;
- Enter changes scope and pushes recoverable navigation state;
- Back restores prior scope, selection, filters and camera state;
- Home returns to Universe;
- breadcrumb-depth jump restores an ancestor scope;
- expand/collapse selected and bulk membership semantics;
- draft filters remain separate from applied filters until Apply;
- session state serializes/restores with version checking.

This is automated state-machine evidence only. It does not prove renderer, browser touch UX, rotation, or phone behavior.


## Projection engine — 2026-09-28

Tested source:
`8e7f16bf9b80bf9414b424dfa86488a48dba68fc`

CI history:
- `36362295175` — FAIL: predicted expansion counted a shared graph node through more than one path;
- `36362342273` — FAIL: filter semantics were corrected but the unique-node count issue remained;
- implementation updated so performance estimates count unique node IDs;
- `36362381756` — PASS;
- PR validation `36362384151` — PASS.

Automated coverage proves:
- Universe projects Account children;
- drill scopes project only the next navigation dimension;
- descendants appear only after explicit expand;
- collapse hides descendants;
- draft filters do not affect projection before Apply;
- applied filters are facet-aware;
- range/search filters work;
- visible edges never reference hidden nodes;
- breadcrumb/action capabilities are derived from session state;
- Track is terminal;
- dangling navigation edges are rejected.

This is semantic projection evidence, not renderer or phone evidence.


## Provider-neutral Account foundation — 2026-09-28

Tested source:
`dd4b7ca3c01a583f570361445d6e3ca41fde6cbf`

CI:
`36362670818` — PASS.

Verified:
- Account model validates provider-neutral public account metadata;
- account fixture explicitly declares `authDataIncluded=false`;
- secret-like keys are rejected;
- known target `@faric_ua` maps to `account:youtube_music:faric_ua`;
- its external provider/channel ID remains null until a real read-only verification;
- second account is explicitly synthetic and fixture-only;
- account-to-account `RELATED_ACCOUNT` is visible but non-navigation;
- channel target references the canonical Account identity;
- canonical identity and contextual projection identity are documented separately.

No live account inventory or authentication was performed by this step.


## Adaptive filter panel — 2026-09-28

Implementation source:
`ab5071e83a8eec60ec4242b9ae0ecb656364ec8a`

CI:
`36368444005` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- GraphSessionState tests PASS;
- Projection engine tests PASS;
- Account model tests PASS;
- adaptive filter panel model/state/layout tests PASS;
- Git whitespace check PASS.

Implemented behavior:
- portrait filter panel is a bottom sheet targeted at 45–55% viewport height;
- wider/landscape layouts use a side sheet targeted at 40–50% viewport width;
- body is one column and independently scrollable;
- Reset/Apply footer is outside the scroll body and remains fixed inside the panel;
- filter edits modify `draftFilters` only;
- graph rebuild/filter effect occurs only after explicit Apply;
- Reset returns only the draft to defaults;
- button badge counts applied filters;
- pending marker shows unapplied draft changes;
- search, artist, year range, genre and release type are covered by the filter model.

Not proven by this checkpoint:
- browser visual fit;
- portrait/landscape touch behavior;
- real-phone ergonomics;
- Android/WebView behavior.

Those remain later QA gates.


## Floating node-control palette — 2026-09-28

Implementation source:
`c22d538e80b70632ef54520e422bdb6ca05c5c2f`

CI:
`36368864096` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- prior semantic/projection/account/filter suites remain PASS;
- new node-control palette model/wiring tests PASS;
- Git whitespace check PASS.

Implemented behavior:
- floating palette includes Expand All / Collapse All;
- floating palette includes Expand selected / Collapse selected;
- floating palette includes Back / Enter / Home / Fit;
- palette uses a roughly 50%-transparent container;
- node buttons keep minimum 48px touch targets;
- availability is computed from selected node, drill path, current scope, expanded IDs and graph child relationships;
- selecting a node updates `GraphSessionState`;
- Enter pushes semantic scope/history;
- Back/Home use reducer navigation;
- expand/collapse membership affects visible descendants in the current Canvas prototype;
- Fit remains a renderer-local camera action.

Boundary:
the current Canvas visibility adapter exists only to exercise command wiring. It does not prove or replace the future canonical nested 3D projection through Account → Year → Genre → Artist → Release → Track.

Not yet proven:
- browser layout/occlusion behavior;
- portrait/landscape touch comfort;
- phone usability;
- final renderer behavior.


## Breadcrumb + shared navigation surface — 2026-09-28

Implementation source:
`c0f95baef1d1110ef2f3ec228605d996fe8eb006`

CI:
`36369197076` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- all previous state/projection/account/filter/node-control suites remain PASS;
- new breadcrumb/navigation contract tests PASS;
- Git whitespace check PASS.

Implemented behavior:
- breadcrumb is generated from semantic `drillPath`;
- current scope is marked as current/non-clickable;
- ancestors dispatch direct `JUMP_TO_DEPTH`;
- breadcrumb is horizontally scrollable for deep paths;
- header exposes compact Back/Home/Enter navigation;
- header and floating palette call the same Enter/Back/Home functions;
- capability state prevents invalid Enter and disables Back/Home at Universe.

Not yet proven:
- header crowding on real narrow devices;
- breadcrumb touch ergonomics;
- portrait/landscape visual fit;
- Android/WebView behavior.

These remain explicit later QA gates.


## Canonical Nested 3D drill projection — 2026-09-28

Implementation source:
`802d652d2cfc57b95ab0cd02685c1c99f3465b04`

CI:
`36369595825` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- all prior state/projection/account/filter/node-control/breadcrumb suites remain PASS;
- canonical nested-drill suite PASS;
- Git whitespace check PASS.

Verified semantic path:
`Universe → FARIC UA → 1994 → Big Beat → The Prodigy → Music for the Jilted Generation → Voodoo People`.

Verified:
- Universe has two Account nodes from the account fixture;
- Account → Year → Genre → Artist → Release → Track sequence is enforced by the projection engine;
- Track scope is terminal;
- canonical IDs survive contextual projection;
- one canonical release can produce multiple contextual IDs under different genre paths;
- contextual IDs are unique;
- non-navigation Account relationship remains visible when both Accounts are visible;
- ancestor search enrichment can keep the 2003 path visible for query `Numb`;
- browser Account fixture is semantically identical to `data/accounts.fixture.json`;
- prototype assignments are rejected unless explicitly marked `PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY`.

Truth boundary:
- the browser sample contains only 7 releases;
- `@faric_ua` account assignment in this prototype is not a live account inventory claim;
- prepared 88 release / 863 track migration remains pending;
- no YouTube read/write mutation occurred.

Not yet proven:
- actual browser visual correctness;
- touch/gesture usability;
- phone performance;
- Android/WebView behavior.


## Structured Track terminal details — 2026-09-28

Implementation source:
`1b081ee404a35cedd7451d3f559fd7a4e18acf57`

CI:
`36375617001` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- all previous semantic/projection/account/filter/control/navigation/nested-drill suites remain PASS;
- dedicated structured Track detail tests PASS;
- Git whitespace check PASS.

Implemented behavior:
- terminal Track uses a grouped detail surface instead of normal-product raw JSON;
- detail identity keeps both contextual projection ID and stable canonical Track ID;
- all contextual appearances of the same canonical Track are aggregated and canonical Artist/Release/Account facts are deduplicated;
- current Account → Year → Genre → Artist → Release context remains visible;
- prototype-only account assignment is surfaced as `PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY`;
- live account inventory is explicitly not claimed;
- TrackVersion/relationship data remains `unmodeled`;
- playlists, exact YouTube/YTM IDs and URLs, duration and availability remain `unknown` when no source exists;
- fixture context and missing verification/data produce explicit warning codes;
- inspector open/close is mirrored into GraphSessionState.

Truth boundary:
- this checkpoint does not add live channel inventory;
- it does not infer remix/original relationships from titles;
- it does not invent YouTube/YTM identities, duration or availability;
- browser/phone visual and interaction acceptance is still pending.


## Semantic session restoration — 2026-09-28

Implementation source:
`cfbc6540b95a336e8096a1a25bbd709da1373340`

CI:
`36375948517` — PASS.

Automated evidence:
- deep path restore preserves Account → Year → Genre → Artist → Release scope;
- selected terminal Track restores without replaying Enter;
- applied filters and a distinct pending draft both restore;
- open filter panel restores;
- open Track inspector target/mode restores;
- renderer mode restores;
- restored world still contains the selected Track under the applied filter;
- stale canonical navigation path fails closed to Universe and is discarded;
- invalid inspector target closes only the inspector;
- corrupt JSON fails closed;
- unavailable/throwing storage does not break startup or state transitions;
- restore path is proven not to call GraphState.reducer.

Boundary:
- transient pointer/gesture/animation state is intentionally not persisted;
- camera/orbit persistence remains “when practical” and is not claimed by this checkpoint;
- actual browser refresh, Android recreation and rotation remain later browser/phone lifecycle QA.


## Expand All performance guard — 2026-09-28

Implementation source:
`f3e1db37a0ed620f5e1c51c9b05937e6ea373a87`

CI:
`36376362499` — PASS.

Automated evidence:
- projection exposes scope-specific bulk-expand IDs;
- confirmed bulk expansion reveals exactly the predicted fully-expanded scoped node count in the prototype fixture;
- after full expansion, semantic `canExpandAll` becomes false and `canCollapseAll` becomes true;
- unmeasured device budget requires confirmation rather than assuming a guessed safe threshold;
- a supplied tested limit applies immediately below/equal to the tested budget and asks for confirmation above it;
- Cancel returns the exact same GraphSessionState object and serialized state;
- guard dialog includes current/predicted/budget information and explicit Cancel/Expand actions;
- Escape/click-outside cancel the transient guard;
- Collapse All uses the same scoped bulk IDs.

Runtime defect found/fixed:
- three browser runtime wiring functions were missing while still referenced;
- restored functions now derive controls from the canonical projected world;
- the new guard suite statically asserts those definitions remain present.

Boundary:
- the immediate-expansion threshold remains intentionally unmeasured until real target-phone performance QA;
- confirmation-dialog rotation restoration is not claimed; losing this pre-action dialog is Cancel-equivalent and cannot execute expansion;
- no remote action is involved.


## Final static/unit/schema validation gate — 2026-09-28

Tested source:
`acb642f40bb9bf6f3567dd15aa4050e0e9c7a713`

CI:
`36376536482` — PASS.

One run verified:
- repository foundation/static validation;
- JavaScript syntax across app/test modules;
- GraphSessionState semantics;
- nested projection semantics;
- Account model and no-secret contract;
- adaptive filter draft/apply contract;
- node-control command surface;
- breadcrumb/shared navigation;
- canonical Account → Year → Genre → Artist → Release → Track drill;
- structured terminal Track details;
- semantic session restore/no-replay behavior;
- Expand All predicted-size guard and Cancel=no-op;
- JSON Schema conformance for `data/accounts.fixture.json` against `data/schemas/account.schema.json`;
- Git whitespace cleanliness.

Schema gate negative controls prove enforcement of:
- required fields;
- const values;
- union types;
- `additionalProperties=false`.

This closes automated/static validation only. Browser/phone QA remains explicitly NOT RUN.

## Merged candidate delivered to main — 2026-09-28

Merge sequence:
- PR #15 — canonical nested drill;
- PR #16 — structured Track terminal details;
- PR #17 — semantic session restoration;
- PR #18 — Expand All performance guard;
- PR #19 — final validation gate before phone QA.

Validated runtime/code baseline:
`f25cb380fe7b95a76abc56426bbdc8174ef04e27`

A later docs-only handoff merge may advance `main` without changing app/runtime code; the real-phone record must therefore include the actual tested HEAD.

Fresh validation:
- PR #19 run `36435030701` — PASS;
- post-merge `main` run `36435075892` — PASS.

This establishes the exact source for real-phone v0.2.0 QA. It does not itself prove portrait/landscape layout, gestures, restoration under rotation/reload, or target-phone performance.

## Real-phone UX revision — tap-first drill + 3D HOLD/ORBIT — 2026-09-28

Phone observation before the revision:
- the raw non-Track JSON regression was no longer the main blocker;
- compact top `− / + / ⋮` controls were visible;
- the current dark graph/card visual direction was accepted;
- explicit select → Enter browsing was reported as confusing/mechanical for ordinary use;
- Track details were structurally useful but exposed too much developer terminology by default.

Implementation source:
`0d93e8af0d130b678bc806929d98b5ee1fd824f1`

Automated CI:
`36444364055` — PASS.

Implemented and regression-asserted:
- short tap on non-terminal node routes through semantic `ENTER_NODE` and drills directly;
- short tap on Track opens the structured Track inspector;
- long press preserves selection-only behavior for advanced node commands;
- movement-thresholded drag does not become a tap;
- Sphere 3D has independent screen-pan state;
- without HOLD, 3D drag pans the sphere;
- with `HOLD / ORBIT` pressed, drag changes yaw/pitch;
- pinch remains sphere zoom;
- Track details lead with understandable context/library/media state;
- technical identity/provenance/warnings remain available under collapsed `Технічні дані`.

Boundary:
- this is implementation/CI evidence only;
- real-phone acceptance of direct drill, long press, 3D HOLD/ORBIT ergonomics and the revised Track detail hierarchy is still pending;
- no YouTube/YTM remote mutation is involved.

## Merged direct-drill phone candidate — 2026-09-28

PR:
`#23 — v0.2.0 — tap-first nested drill and HOLD/ORBIT 3D UX`

Runtime/code baseline:
`4b89444c795e2a17e34984087ea24065f7abc111`

Fresh validation:
- PR run `36444841889` — PASS;
- post-merge `main` run `36444887504` — PASS.

The next evidence gate is real-phone acceptance of:
- one-tap nested drill;
- long-press selection-only fallback;
- simplified Track detail hierarchy;
- 2D pan/tap ownership;
- Sphere 3D pan vs HOLD/ORBIT rotation;
- pinch zoom and control occlusion in portrait/landscape.

## Back / empty-dismiss / fit refinement — 2026-09-28

Phone feedback:
- tap-first forward drill feels natural;
- returning one level was not equally discoverable;
- Track detail sheet should dismiss when the user taps empty graph space;
- auto-Fit placed graph content too close to viewport boundaries.

Implemented:
- explicit header Back remains available;
- right-swipe beginning at the left graph edge dispatches semantic `BACK_SCOPE`;
- edge-swipe requires horizontal distance and bounded vertical drift;
- empty graph tap dismisses an open Track inspector while × remains available;
- 2D Fit uses `FIT_OCCUPANCY=.80` to preserve approximately 10% breathing room per side before scale clamps.

Automated regression source includes assertions for all three interaction rules.

Boundary:
- phone acceptance remains pending;
- no graph semantics, account data or remote YouTube/YTM state are mutated by these renderer/input changes.

## Spatial navigation prototype — 2026-09-28

Phone-driven product direction:
- nested drill should preserve visual depth instead of feeling like flat-page teleportation;
- current world should be spatially obvious;
- previous worlds should remain faintly understandable in the background;
- node taps should provide immediate visible feedback;
- empty graph tap should dismiss transient overlays.

Implemented on `feat/v0.2.0-spatial-drill-feedback`:
- current Sphere scope fixed at the center;
- deterministic spherical distribution for other visible nodes;
- low-opacity ancestor ghost trail from semantic `drillPath`;
- ghost tap routes through existing depth navigation;
- short entry transition expands the new world from the tapped node position;
- fading user-facing node-kind hints;
- empty-space dismissal for both Track inspector and mobile advanced menu.

Automated regression source:
`ba70cc53e7cc21d3de7bd831884ae3d67a334ccf` — CI PASS.

Boundary:
- this is renderer/input behavior only;
- no canonical graph identity or remote YouTube/YTM state is changed;
- real-phone visual/gesture acceptance is still required.
