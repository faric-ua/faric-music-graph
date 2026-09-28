# v0.2.0 Phone Test

Status: READY / NOT RUN.

Validated runtime/code baseline:
`f25cb380fe7b95a76abc56426bbdc8174ef04e27`

Validation evidence:
- pre-merge validation source `acb642f40bb9bf6f3567dd15aa4050e0e9c7a713`, CI `36376536482` — PASS;
- PR #19 validation run `36435030701` — PASS;
- post-merge `main` run `36435075892` — PASS.

A docs-only handoff merge may advance `main` after this validated code baseline. Phone QA must first update to current `main`, record the actual HEAD in step 6, and must not use a checkout older than `f25cb380fe7b95a76abc56426bbdc8174ef04e27`.

## Start on phone

1. Open **FARIC Music Graph** through Termux:Widget/menu.
2. Choose **1 — Оновити проєкт з GitHub**.
3. Confirm the update completes without local-change refusal.
4. Choose **2 — Запустити Music Graph**.
5. Choose **3 — Відкрити Music Graph у браузері**.
6. Record the exact Git HEAD from **5 — Git / server status** before accepting any PASS.

Do not record phone evidence against an older `main`.

## Test 1 — Universe / direct drill

Expected:
- Universe loads without a JavaScript/runtime error;
- both Account fixture nodes are visible;
- mobile `− / + / ⋮` controls remain compact at the top;
- short tap on `FARIC UA` enters the Account world immediately without raw JSON and without requiring →;
- long press on a non-terminal node selects/focuses it without entering, so advanced `+ node / − node` remains possible;
- Back/Home and breadcrumb stay usable;
- one-finger pan does not accidentally enter nodes.

The explicit →/Enter control may remain in the advanced/fallback surface, but ordinary browsing must not depend on it.

Important regression check:
the page must not fail because `currentControlCapabilities`, `renderNavigationState` or `renderNodeControls` is undefined.

## Test 2 — Canonical drill

Use:

`Universe → FARIC UA → 1994 → Big Beat → The Prodigy → Music for the Jilted Generation → Voodoo People`

At each non-terminal level:
- one short tap enters the tapped node directly;
- no second →/Enter tap is required;
- breadcrumb matches the current semantic path;
- Back returns exactly one level;
- Home returns to Universe;
- dragging the graph does not accidentally drill.

At Track:
- one short tap opens structured Track details;
- Track remains terminal;
- the normal view is user-facing rather than raw JSON.

## Test 3 — Structured Track details

For **Voodoo People** verify the default view leads with:
- Track title;
- **Де ви зараз**: Account / Year / Genre / Artist / Release;
- **У бібліотеці**;
- plain-language YouTube / YouTube Music state;
- short **Стан даних** explanation.

Then open **Технічні дані** and verify:
- canonical/projection IDs and internal status data remain available there;
- prototype-only/account verification warnings are not lost;
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

## Test 8 — Gesture ownership / 3D HOLD-ORBIT / occlusion

In 2D portrait and landscape:
- one-finger drag pans and does not enter nodes;
- short tap drills;
- long press selects only;
- pinch zoom works.

In **Sphere 3D**:
- without HOLD, one-finger drag moves/pans the sphere on screen;
- press and keep holding the bottom **HOLD / ORBIT** control with one finger;
- while HOLD is pressed, drag the graph with another finger and confirm yaw/pitch rotation;
- releasing HOLD immediately returns drag to pan mode;
- pinch zoom still works;
- a normal drag/orbit does not accidentally drill.

For both renderers:
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
