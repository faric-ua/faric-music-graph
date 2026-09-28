# v0.2.0 Evidence Manifest

Automated implementation evidence exists. Browser/phone evidence is still pending.

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
`fd4e13c1e88f0573cd67ccf0e728de5ed4ff9730`

CI:
`36374847098` — PASS.

Automated evidence:
- repository validation PASS;
- JavaScript syntax PASS;
- existing GraphSessionState / projection / Account / adaptive-filter tests remain PASS;
- dedicated node-control palette contract tests PASS;
- Git whitespace check PASS.

Implemented contract:
- persistent floating two-column palette with approximately 50% transparent background;
- Expand All / Collapse All;
- Expand Node / Collapse Node;
- Back / Enter;
- Home / Fit;
- selected-node state is sourced from `GraphSessionState`, not an independent navigation action;
- renderer context provides visible/expandable/enterable IDs to the command adapter;
- `FIT_VIEW` is consumed as a transient renderer command and leaves serialized GraphSessionState unchanged;
- unsupported Enter is disabled until the canonical projection marks a selected node as enterable.

Not proven by this checkpoint:
- real nested drill rendering;
- breadcrumb interaction;
- phone portrait/landscape ergonomics;
- gesture/palette overlap behavior.

Those remain later implementation/QA gates.
