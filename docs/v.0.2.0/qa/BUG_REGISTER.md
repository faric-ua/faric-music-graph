# v0.2.0 Bug / Finding Register

## FINDING-004 — Mobile graph controls
Status: carried forward. v0.2.0 replaces flat Canvas interaction with the new navigation/control contract.

## FINDING-005 — Spherical/3D feasibility
Status: product direction accepted as primary exploration model; renderer still unaccepted until phone/performance QA.

## PRODUCT-001 — Nested 3D Worlds
Status: FOUNDATION IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-001 — Adaptive filter panel
Status: IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-002 — Persistent floating node-control palette
Status: IMPLEMENTED / CI PASS / PHONE QA PENDING.

## UX-003 — Explicit selection vs Enter
Status: SUPERSEDED BY REAL-PHONE UX FEEDBACK.

The original v0.2.0 contract required tap → select and a separate Enter action. Phone use showed that this makes ordinary nested browsing feel mechanical and unclear.

Revised contract:
- short tap on non-terminal node = direct drill;
- long press = explicit selection/focus for advanced node commands;
- explicit Enter remains only as fallback/advanced semantic control;
- drag/orbit remains movement-thresholded to prevent accidental drill.

## BUG-001 — Browser runtime control/navigation functions were missing
Status: FIXED / CI REGRESSION ASSERTION ADDED.

Found during Expand All guard work:
`app.js` still called `currentControlCapabilities()`, `renderNavigationState()` and `renderNodeControls()`, but their definitions had been lost during earlier canonical-projection edits. Prior CI parsed the browser entrypoint but did not execute it.

Fix:
- restore all three runtime functions;
- derive capability overrides from the current canonical projected world;
- assert function definitions in automated guard tests.

Fixed source:
`f3e1db37a0ed620f5e1c51c9b05937e6ea373a87`.

CI:
`36376362499` — PASS.

## PERF-001 — Expand All immediate threshold is unmeasured
Status: OPEN MEASUREMENT / SAFE GUARD IMPLEMENTED.

Until real target-phone measurement establishes a safe immediate node budget, non-trivial Expand All requires explicit confirmation. No production threshold is guessed in code or docs.

## BUG-002 — Non-Track tap opened raw debug JSON and left Enter stale
Status: PHONE BEHAVIOR OBSERVED FIXED / FORMAL TESTED-HEAD RECORD STILL PENDING.

Found during real-phone v0.2.0 QA on 2026-09-28.

Observed:
- tapping `FARIC UA` selected the Account but immediately opened a raw JSON debug inspector;
- the inspector obscured the graph/control palette on mobile;
- `canEnter` was still taken from the pre-selection projected world, so the visible Enter/→ control could remain disabled until another rebuild.

Fix:
- Account/Year/Genre/Artist/Release tap now performs selection only;
- automatic inspector opening is restricted to terminal Track nodes;
- selection triggers a projection rebuild so Enter/expand capabilities reflect the new selection immediately;
- legacy non-Track debug inspector rendering is removed from the normal product path.

Merged source:
`ef0a6029b7593a33933e803477523d6f3355a4e9`

CI:
- PR run `36441340178` — PASS;
- post-merge `main` run `36441389775` — PASS.

Phone recheck:
- select `FARIC UA`;
- verify no JSON inspector opens;
- verify →/Enter becomes enabled immediately;
- enter Account and continue canonical drill.

## UX-004 — Compact mobile graph controls
Status: PHONE-ACCEPTED FOR NOW / MAY REVISIT.

Real-phone screenshots show the compact top `− / + / ⋮` row working. The `⋮` popout remains visually bulky, but the user explicitly accepted leaving it this way for now.

Real-phone feedback: persistent right-side node controls plus bottom-right zoom controls consume too much graph space.

Adjustment:
- mobile zoom `− / +` moved into one compact top-right graph row;
- node controls are hidden by default on mobile and opened from a compact `⋮` button in the same row;
- desktop floating palette behavior remains unchanged.


## UX-005 — Tap-first nested drill
Status: MERGED / CI PASS / PHONE QA PENDING.

Real-phone feedback: ordinary browsing should feel like opening nested music worlds, not selecting a node and then hunting for a separate Enter command.

Implemented interaction:
- short tap on Account / Year / Genre / Artist / Release enters that world immediately;
- Track tap opens Track details;
- long press preserves selection-only behavior for advanced Expand/Collapse-selected commands;
- semantic state still uses the existing renderer-independent `ENTER_NODE` reducer command;
- movement threshold prevents normal drag from being interpreted as tap.

## UX-006 — Track detail readability
Status: MERGED / CI PASS / PHONE QA PENDING.

Real-phone screenshots confirmed the card/skin direction is acceptable, but the default Track surface exposed too much developer terminology.

Adjustment:
- default view leads with `Де ви зараз`, library/account context, plain-language YouTube/YTM state and a short data-state note;
- canonical/projection IDs, internal assignment codes, verification details and full warnings move under collapsed `Технічні дані`;
- no data is removed or invented.

## UX-007 — Sphere 3D HOLD / ORBIT gesture
Status: MERGED / CI PASS / PHONE QA PENDING.

Requested mobile gesture model:
- normal 3D drag pans/moves the sphere on screen;
- holding the bottom `HOLD / ORBIT` button changes drag into yaw/pitch rotation;
- release returns drag to pan immediately;
- pinch remains zoom;
- the gesture modifier is renderer-local and does not mutate semantic graph state.


Merged UX revision evidence:
- PR #23;
- runtime/code baseline `4b89444c795e2a17e34984087ea24065f7abc111`;
- PR validation `36444841889` — PASS;
- post-merge main validation `36444887504` — PASS.

## UX-008 — One-level Back must match tap-first drill
Status: MERGED / CI PASS / PHONE QA PENDING.

Phone feedback after tap-first drill: moving forward became natural, but moving one level back was not equally obvious.

Adjustment:
- header Back is explicitly labeled as “На рівень вище”;
- swipe right starting from the left edge of the graph dispatches the same semantic `BACK_SCOPE` command;
- the edge gesture is distance/vertical-thresholded so ordinary graph pan away from the edge remains available.

## UX-009 — Empty graph tap dismisses Track details
Status: MERGED / CI PASS / PHONE QA PENDING.

When the Track inspector is open:
- tapping empty graph space closes it;
- × remains as the explicit close action;
- tapping a Track/node still performs its normal action.

## UX-010 — Auto-Fit needs viewport breathing room
Status: MERGED / CI PASS / PHONE QA PENDING.

Phone feedback: projected graph content felt too close to viewport edges after entering deeper worlds.

Adjustment:
- 2D auto-Fit targets about 80% of the available canvas width/height;
- roughly 10% breathing room per side is reserved before renderer-local max/min scale clamps;
- semantic graph state is unchanged.


Merged Back/dismiss/Fit evidence:
- PR #25;
- runtime/code baseline `9a88a6e2808c4be4065ee23a1e3cc886f4b14109`;
- PR validation `36447186710` — PASS;
- post-merge main validation `36447243829` — PASS.

## UX-011 — Empty graph tap also dismisses advanced menu
Status: MERGED / CI PASS / PHONE QA PENDING.

Phone feedback: when the mobile `⋮` node-control palette is open, tapping empty graph space should dismiss it just like an open Track detail sheet.

Adjustment:
- empty graph tap closes Track details when open;
- the same empty tap also closes the mobile advanced node-control palette;
- node taps and panel taps keep their own actions.

## UX-012 — Spatial drill transition + node-kind feedback
Status: MERGED / CI PASS / PHONE QA PENDING.

Requested interaction direction:
- drilling should feel like entering nested music space, not teleporting between flat screens;
- the tapped node visually becomes the next focus;
- the new world expands outward from that focus over a short renderer-local transition;
- every node tap shows a short fading hint such as `Рік · 1994`, `Виконавець · The Prodigy`, `Реліз · Experience`;
- the hint is feedback only and does not change semantic graph state.

## UX-013 — Sphere focus + depth trail / tappable parent ghost
Status: SUPERSEDED BY UX-014 AFTER REAL-PHONE FEEDBACK.

3D scene model prototype:
- current scope node is fixed at the center of the Sphere world;
- other visible nodes use deterministic spherical distribution around it;
- up to three ancestor scopes are rendered as faint ghost nodes behind the current focus;
- the nearest/visible ghost trail communicates where the user came from;
- tapping a ghost jumps back to that semantic ancestor through the existing breadcrumb-depth command path;
- HOLD/ORBIT rotates the current sphere while the semantic drill path remains independent of renderer camera state.

This is a first spatial-navigation prototype, not yet a production renderer decision.


Merged spatial-navigation evidence:
- PR #27;
- runtime/code baseline `f61ab0b06827fe172043e489732f019ce1ea9331`;
- PR validation `36449377254` — PASS;
- post-merge main validation `36449424526` — PASS.

## UX-014 — Prior worlds must remain as real background depth
Status: MERGED / CI PASS / PHONE QA PENDING.

Real-phone feedback: the first “ghost trail” implementation did not match the intended spatial model. Parent nodes appeared to disappear, and Back via the tiny ghost representation was not discoverable/reliable enough.

Revised Sphere contract:
- every semantic navigation history snapshot is re-projected into its own prior-world visual layer;
- prior worlds keep their own visible nodes and links instead of collapsing into one decorative dot;
- layers recede behind the active world with progressively smaller scale and lower opacity, creating a starfield/depth-history effect;
- the nearest parent world exposes its focus node as a larger tappable `← parent` Back target;
- tapping that target uses existing semantic depth navigation;
- up to five prior worlds are rendered to keep the background bounded;
- history worlds are reconstructed from persisted `GraphSessionState.history`, so the spatial depth can survive a page refresh/session restore.

The background layers remain renderer-local presentation; canonical graph identity and drill semantics remain unchanged.


Merged history-starfield evidence:
- PR #29;
- runtime/code baseline `af4bf577018ccebfb6df63667c60a6a8a1f8ade5`;
- PR validation `36512072699` — PASS;
- post-merge main validation `36512101160` — PASS.

## UX-015 — Prior worlds are frozen depth frames, not part of the active camera
Status: MERGED / CI PASS / PHONE QA PENDING.

Real-phone clarification from Sphere screenshots:
- the active world is the only world that should respond to pan / zoom / HOLD-ORBIT;
- worlds already traversed must remain spatially frozen in the background;
- a prior world should preserve the camera/orientation it had when the user left it;
- selecting a child pushes the complete current world backward as a frozen depth frame;
- returning Back should bring the saved parent world forward again with its saved camera, while the child world fades away.

Implementation:
- renderer camera state is snapshotted immediately before semantic ENTER;
- that camera is stored in the existing GraphSessionState history snapshot;
- each reconstructed prior-world layer renders from its own saved camera;
- current Sphere pan/zoom/yaw/pitch no longer transforms background worlds;
- Back / Home / breadcrumb-depth navigation restores the saved parent camera;
- Back uses a short reverse transition: parent advances from depth while the child frame fades;
- no new canonical graph entities or remote state are introduced.


Merged frozen-history evidence:
- PR #31;
- runtime/code baseline `68f228625012c1dfa379f3d6130bfc4669cb829f`;
- PR validation `36515005067` — PASS;
- post-merge main validation `36515026683` — PASS.

## UX-016 — Draggable persistent HOLD / ORBIT control
Status: MERGED / CI PASS / PHONE QA PENDING.

Phone feedback: the HOLD / ORBIT modifier should be movable to the thumb position that is most comfortable for the user.

Contract:
- press and keep the HOLD control mostly stationary = enable ORBIT for the active Sphere;
- moving the HOLD finger beyond a drag threshold switches from ORBIT-hold to control repositioning;
- dragged position is clamped to the graph viewport;
- position is stored as normalized viewport coordinates in local browser storage;
- refresh / browser reopen restores the saved position;
- normalized storage allows the position to adapt across viewport/orientation changes.

## UX-017 — Background worlds receive partial zoom coupling
Status: MERGED / CI PASS / PHONE QA PENDING.

Phone feedback on the merged 30% candidate:
- 30% background response was too weak;
- only inter-node spacing visibly scaled because history node radii did not use the coupling factor.

Revised contract:
- pan and HOLD / ORBIT still affect only the active foreground world;
- pinch / +/- zoom changes the active world at full strength;
- prior frozen worlds receive 50% of the active zoom delta;
- both history-world spacing/radius and the history node circles scale with that same 50% coupling;
- saved prior-world pan/yaw/pitch stay frozen;
- partial zoom remains renderer-only depth feedback and does not change semantic history.

Example:
- active zoom 1.0 → 2.0;
- background geometry and node radii couple approximately 1.0 → 1.5, not 2.0.


Merged movable-HOLD / depth-zoom evidence:
- PR #33;
- runtime/code baseline `d7dbf6768594d1816ef0f5050e84fc4f6d8130b9`;
- PR validation `36516280631` — PASS;
- post-merge main validation `36516314234` — PASS.


Merged 50% history-zoom evidence:
- PR #35;
- runtime/code baseline `12915ae2b325ab17e8efaf57526cd2088574f225`;
- PR validation `36517894886` — PASS;
- post-merge main validation `36517918698` — PASS.
