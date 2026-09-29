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

## Merged prior-world history starfield — 2026-09-29

Phone feedback on the first ghost prototype:
- previous worlds still appeared to disappear;
- the small ancestor ghost representation did not create the intended depth/starfield effect;
- Back through the background was not sufficiently usable.

PR:
`#29 — v0.2.0 — depth-history starfield worlds`

Runtime/code baseline:
`af4bf577018ccebfb6df63667c60a6a8a1f8ade5`

Validation:
- branch `03228ebdbda02cc2c8f604ebb8dd9b4643e7fdb0`, CI `36512041432` — PASS;
- PR run `36512072699` — PASS;
- post-merge `main` run `36512101160` — PASS.

Implemented:
- semantic history snapshots are re-projected into prior-world layers;
- each layer retains its own visible nodes and links;
- up to five worlds recede with decreasing scale/opacity, producing a starfield-like depth history;
- newest prior world animates backward during direct drill;
- nearest parent focus is a larger tappable Back target;
- prior-world depth can be reconstructed after session restore.

Boundary:
- this is automated implementation evidence only;
- actual phone readability, perceived depth and parent Back accuracy still require real-phone acceptance.

## Frozen prior-world cameras — 2026-09-29

Phone clarification from the three Sphere screenshots:
- traversed worlds should remain behind as frozen spatial frames;
- active camera manipulation must not transform already-traversed worlds;
- Back should restore the exact parent scene orientation rather than rebuilding it under the child's current camera.

Implementation:
- camera snapshot captured through `SET_CAMERA` immediately before `ENTER_NODE`;
- camera persists inside existing semantic history snapshots;
- history layers render using their own saved zoom/pan/yaw/pitch;
- current active Sphere camera is independent from background history cameras;
- Back/Home/depth jump restore the target scope camera;
- reverse transition advances the restored parent from depth while the child frame fades.

Automated regression:
- source `6a2c0866a75b92ced6207a2fe920968135634b8e`;
- CI `36514903035` — PASS.

Boundary:
- phone acceptance of perceived depth, camera freezing and reverse Back transition is still pending;
- no remote YouTube/YTM mutation is involved.

## Merged frozen-history candidate — 2026-09-29

PR:
`#31 — v0.2.0 — freeze prior worlds and restore parent camera on Back`

Runtime/code baseline:
`68f228625012c1dfa379f3d6130bfc4669cb829f`

Fresh validation:
- PR run `36515005067` — PASS;
- post-merge `main` run `36515026683` — PASS.

Next evidence gate:
- real-phone verification that background worlds remain fixed while the active Sphere is panned / zoomed / orbited;
- parent Back restores the saved parent camera and brings that world forward;
- child world fades away during the reverse transition.

## Movable HOLD + partial history zoom — 2026-09-29

Phone-driven refinement:
- HOLD / ORBIT should be placeable where the user's thumb is most comfortable;
- already-traversed worlds should remain frozen for pan/orientation;
- zoom should give background depth a small shared response instead of leaving it completely rigid.

Implementation:
- HOLD pointer movement beyond a 10px threshold switches to control repositioning and disables ORBIT during that drag;
- normalized HOLD center coordinates persist under `faric.musicGraph.orbitHoldPosition.v1`;
- position is clamped inside the graph viewport and restored after refresh/reopen/resize;
- active Sphere zoom remains full-strength;
- history layer radius applies `1 + (activeZoom - 1) × 0.30`;
- saved background pan/yaw/pitch remain independent from the active camera.

Automated regression:
- runtime/test source `0086cc834948b41ed81dcadf96f547d5f54d4318`;
- CI `36516158319` — PASS.

Boundary:
- real-phone ergonomics and persistence across the user's actual browser/app lifecycle remain to be accepted;
- the 30% coupling is a UX-tuning value and may be adjusted after phone feel-testing.

## Merged 50% history zoom with node scaling — 2026-09-29

Phone feedback on the merged 30% candidate:
- background zoom response was too weak;
- node spacing changed, but the history node circles themselves stayed nearly the same size.

PR:
`#35 — v0.2.0 — 50% history zoom with node scaling`

Runtime/code baseline:
`12915ae2b325ab17e8efaf57526cd2088574f225`

Implemented:
- `HISTORY_ZOOM_COUPLING` raised from `0.30` to `0.50`;
- history layout radius uses the 50% coupling;
- history focus-node radius uses the same coupling;
- history non-focus node radius uses the same coupling;
- background pan/yaw/pitch remain frozen.

Validation:
- runtime + regression source `1c0087d026a53fa7e5675131e0f750bbfb2fb95f`, CI `36517819907` — PASS;
- latest branch `7944cc5fc62835f6720e915a5b4581c89bf94cc8`, CI `36517862632` — PASS;
- PR validation `36517894886` — PASS;
- post-merge `main` validation `36517918698` — PASS.

Boundary:
- 50% remains a phone-feel tuning value and may still change after direct acceptance;
- no semantic graph or remote YouTube/YTM state is affected.

## HOLD pin / unpin candidate — 2026-09-29

Phone feedback:
- movable HOLD position is useful;
- after placement, accidental button movement is inconvenient;
- the control needs an explicit placement lock without sacrificing normal HOLD / ORBIT.

Implementation:
- persistent pin state stored under `faric.musicGraph.orbitHoldPinned.v1`;
- approximately 1.5 second stationary long-press opens a contextual pin menu;
- menu is suppressed if the HOLD pointer crosses the drag threshold or the Sphere camera changes during the hold;
- `📌 Закріпити` disables reposition drag but preserves HOLD / ORBIT;
- `📌 Відкріпити` restores reposition drag;
- pin state and normalized button position persist independently;
- pinned state has a visible badge.

Automated regression:
- runtime/test source `2e13ffa4de5dea9a70b872c94db02812a5968a8c`;
- CI `36518600090` — PASS.

Boundary:
- real-phone ergonomics, long-press timing and persistence still require acceptance;
- the 1.5 second threshold is a UX value and may be tuned after phone feel-testing.

## Merged HOLD pin / unpin candidate — 2026-09-29

PR:
`#37 — v0.2.0 — pin / unpin HOLD control`

Runtime/code baseline:
`d9a4baaf9f070c114b256e09c98969f1f268d1c8`

Validation:
- runtime/test source `2e13ffa4de5dea9a70b872c94db02812a5968a8c`, CI `36518600090` — PASS;
- latest feature source `932d44cd08c5cc20fd9b617a767fe198cc160b5f`, CI `36518683990` — PASS;
- PR validation `36518720143` — PASS;
- post-merge `main` validation `36518757439` — PASS.

Next evidence gate:
- real-phone confirmation that long-press timing feels natural;
- menu does not appear during real ORBIT/zoom;
- pin blocks reposition but preserves HOLD behavior;
- pin state and button position survive refresh/reopen.

## Active Sphere node-size zoom — 2026-09-29

Phone feedback:
- active Sphere spacing/link geometry zoomed correctly;
- active node circles stayed too visually static.

Implementation:
- active geometry/positions keep full `sphereZoom`;
- active node-circle/label depth scale applies `1 + (sphereZoom - 1) × 0.80`;
- background-history zoom remains unchanged at 50% for both geometry and node radii.

Automated regression:
- runtime source `0b7c26c7259b82ce6fff2d6dff55c6a445577565`;
- test source `6984dda06ddbdbe6ac7e0693c0502fa070c86ed2`;
- branch CI for both sources — PASS.

Boundary:
- 80% is a phone-feel tuning value and still requires real-phone acceptance;
- semantic graph state and remote YouTube/YTM data are unaffected.
