# v0.2.0 Phone Test

Status: READY / NOT RUN.

Merged phone-QA source:
`f25cb380fe7b95a76abc56426bbdc8174ef04e27`

Validation evidence:
- pre-merge validation source `acb642f40bb9bf6f3567dd15aa4050e0e9c7a713`, CI `36376536482` — PASS;
- PR #19 validation run `36435030701` — PASS;
- post-merge `main` run `36435075892` — PASS.

Phone QA must run against exact `main` `f25cb380fe7b95a76abc56426bbdc8174ef04e27`. If step 6 reports another HEAD, update first and do not record PASS/FAIL evidence yet.

## Start on phone

1. Open **FARIC Music Graph** through Termux:Widget/menu.
2. Choose **1 — Оновити проєкт з GitHub**.
3. Confirm the update completes without local-change refusal.
4. Choose **2 — Запустити Music Graph**.
5. Choose **3 — Відкрити Music Graph у браузері**.
6. Record the exact Git HEAD from **5 — Git / server status** before accepting any PASS.

Do not record phone evidence against an older `main`.

## Test 1 — Universe / selection / Enter

Expected:
- Universe loads without a JavaScript/runtime error;
- both Account fixture nodes are visible;
- graph can pan/orbit and zoom;
- tap selects without drilling;
- **Enter** explicitly enters the selected Account;
- Back/Home/Enter controls and breadcrumb stay usable.

Important regression check:
the page must not fail because `currentControlCapabilities`, `renderNavigationState` or `renderNodeControls` is undefined.

## Test 2 — Canonical drill

Use:

`Universe → FARIC UA → 1994 → Big Beat → The Prodigy → Music for the Jilted Generation → Voodoo People`

At each level:
- select is separate from Enter;
- breadcrumb matches the current semantic path;
- Back returns exactly one level;
- Home returns to Universe;
- no accidental Enter occurs during drag/orbit.

At Track:
- Track is terminal;
- Enter is unavailable;
- structured details open instead of raw JSON.

## Test 3 — Structured Track details

For **Voodoo People** verify visible groups for:
- identity;
- current context;
- version/relationship;
- artists/releases;
- accounts/playlists;
- YouTube/YTM;
- availability/duration;
- provenance/verification;
- warnings.

Expected truth boundary:
- prototype-only account assignment is visibly identified;
- live inventory is not claimed;
- absent TrackVersion/media ID/URL/duration/availability data remains unknown/unmodeled;
- no invented exact YouTube/YTM ID appears.

## Test 4 — Filter panel portrait

In portrait:
- Filters opens as a bottom sheet around half height;
- body is one column and scrollable;
- Reset/Apply footer remains visible;
- edit Search/Year/Genre/Artist/Release Type;
- graph does **not** change before Apply;
- pending marker appears;
- Apply changes the graph;
- Reset changes draft only until Apply.

## Test 5 — Filter panel landscape

Rotate to landscape:
- side sheet uses about 40–50% width;
- graph remains visible;
- footer remains reachable;
- long labels do not break layout.

## Test 6 — Semantic restoration

Prepare a deep path, selected node and pending filter draft.

A. With filter panel open:
- rotate portrait → landscape → portrait;
- reload the page once.

B. With Track inspector open:
- rotate and reload once.

Expected:
- same drill path/current scope;
- same selected node when still valid;
- applied filters preserved;
- pending draft preserved separately;
- open filter panel restored;
- Track inspector target/mode restored;
- no selected node is Entered again automatically;
- no remote action occurs.

## Test 7 — Node controls

Verify:
- Expand selected;
- Collapse selected;
- Collapse All;
- Fit;
- Back;
- Enter;
- Home.

For **Expand All**:
- before target-phone benchmark there is no guessed immediate threshold;
- non-trivial Expand All opens the confirmation guard;
- guard shows current visible count and predicted full-expand count;
- Cancel changes nothing;
- confirm expands the current scope;
- after full expansion, Expand All disables and Collapse All is available.

Record whether confirmation itself feels responsive and whether expansion causes visible freeze, heat or browser instability.

## Test 8 — Gesture ownership / occlusion

In portrait and landscape:
- one-finger graph drag does not click buttons or Enter nodes;
- pinch zoom works;
- controls do not make key nodes permanently unreachable;
- filter panel owns gestures inside itself;
- graph owns gestures outside the panel;
- inspector can scroll without moving the graph.

## Test 9 — Performance notes

For the largest prototype scope available:
- record approximate visible/predicted node count before Expand All;
- note whether confirmed Expand All is instant / briefly delayed / visibly janky / freezes;
- note browser heat or instability;
- note 2D Map vs Sphere behavior separately.

Do **not** set a permanent immediate-expansion limit from guesswork. The measured phone result will decide the next threshold.

## Result format

For each test record:
- PASS / FAIL;
- portrait/landscape where relevant;
- exact symptom if FAIL;
- screenshot/video if useful;
- exact Git HEAD.

Any FAIL becomes a finding before the renderer decision.
