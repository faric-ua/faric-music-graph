# FARIC Music Graph — Product Vision

Updated: 2026-09-28

## Product target

FARIC Music Graph is a **mobile-first nested music knowledge graph** whose final user-facing product is a signed Android APK.

The browser/PWA build is a development, debugging and rapid-prototyping surface. It is not the final delivery target.

The application must eventually manage multiple music/channel accounts, explore their catalog relationships, audit YouTube/YouTube Music state and, only after separate safety gates, support controlled remote changes.

## Core interaction — Nested 3D Worlds

The application does not present one permanently huge graph.

Instead, the user moves through nested contextual graph worlds:

```text
Universe
  ↓ Account
Account world
  ↓ Year
Year world
  ↓ Genre
Genre world
  ↓ Artist
Artist world
  ↓ Release / Album
Release world
  ↓ Track
Track details / linked identities
```

The canonical data is still a graph, not a directory tree. The sequence above is the **primary navigation projection**.

A node can participate in more than one relationship, release, playlist, account or version. The drill path only controls what is currently visible.

## Multi-account universe

The top-level world may contain many account/channel nodes.

Examples:
- one YouTube Music account/channel;
- another YouTube channel;
- a future imported/local music identity;
- other supported providers if added later.

Account nodes may be connected by explicit or derived relationships, but authentication secrets are never graph data.

Entering an Account changes the active scope to that account. The 3D renderer then shows only information relevant to that account plus intentionally exposed cross-links.

## Drill navigation

Primary mobile navigation is **tap-first**:
- short tap on a non-terminal node — enter that node and push it onto the drill stack;
- short tap on Track — open the Track detail surface;
- long press — select/focus only for advanced node commands;
- **Back** — return one drill level;
- **Home** — return to Universe;
- breadcrumb — jump back to any already visited parent level;
- **Forward / Enter** remains available as a renderer-independent fallback/accessibility command, but ordinary browsing should not require it after every tap.

The interaction layer distinguishes tap from drag/orbit by movement threshold, so navigation stays direct without making ordinary camera gestures enter nodes accidentally.

Suggested visual transition:
1. tapped node focuses briefly;
2. unrelated nodes fade;
3. camera/world transitions into the node;
4. next contextual world appears;
5. semantic state commits through the same renderer-independent `ENTER_NODE` command used by fallback controls.

## Node visibility controls

A persistent floating node-control palette accompanies every graph world.

Required commands:
- Expand selected node;
- Collapse selected node;
- Expand all nodes in current scope;
- Collapse all nodes in current scope;
- Forward / Enter selected;
- Back;
- Home;
- Fit / Center;
- optional Isolate selected.

Semantic distinction:

```text
Expand = reveal children/related nodes inside current world.
Collapse = hide descendants but stay in current world.
Enter = make selected node the new world/scope.
Back = leave current world and restore previous world.
```

Expand All must use a performance guard for large scopes. It may progressively render or ask for confirmation when the predicted visible-node count is large.

## Filter experience

The filter UI is a dedicated adaptive panel, not a row of controls over the graph.

### Phone portrait
- full width;
- approximately 45–55% of screen height;
- single vertical column;
- scrollable filter body;
- fixed footer with **Скинути** and **Застосувати** always visible.

### Landscape / tablet
- side sheet;
- approximately 40–50% of screen width;
- single vertical column;
- scrollable body;
- fixed footer.

Filter changes use two states:
- `draftFilters` — what the user is currently editing;
- `appliedFilters` — what is actually controlling the graph.

Default v0.2 behavior: **manual Apply**.

Live/debounced filter application may be added only after measured full-data latency proves that it stays responsive. If enabled, the UI must still clearly indicate pending/applied state.

`Скинути` resets the draft to contextual defaults. It does not silently mutate remote data or unrelated app state.

## Contextual filters

There are two filter groups:

1. **Global filters** — persist across compatible drill levels:
   - account/provider;
   - channel state;
   - availability;
   - search text;
   - version/status facets where meaningful.

2. **Context filters** — change with the current world.

Initial contextual model:

| World | Primary filters |
| --- | --- |
| Universe | provider/account type, account status |
| Account | year/range, playlist, channel state, availability |
| Year | genre, artist, release type |
| Genre | artist, year/range, release type |
| Artist | year/range, release type, original/remix/live/demo/edit |
| Release | track/version status, channel presence, availability |
| Track | no required graph filter; show complete detail and linked identities |

The filter registry must be data-driven so later levels can add filters without hardcoding a separate screen implementation.

## Graph control surface

On phones, the graph is the primary navigation surface.

A compact quick row exposes zoom and a `⋮` advanced-menu handle. The node-control palette is hidden by default and opened only when advanced Expand/Collapse/Back/Home/Fit/Enter fallback commands are needed.

Design:
- compact quick controls must not permanently cover important graph space;
- advanced panel background approximately 50% transparent;
- buttons/icons remain sufficiently opaque and readable;
- controls use at least ~48dp touch targets;
- the panel must not steal graph gestures outside its own bounds;
- safe insets are respected;
- portrait and landscape positions are tested independently.

## Breadcrumb / location

The user must always know where they are.

Example:

```text
Universe › @faric_ua › 1997 › Big Beat › The Prodigy › The Fat of the Land
```

Breadcrumb behavior:
- horizontally scrollable when long;
- every parent segment is tappable;
- tapping a parent only moves backward/up the existing drill path;
- no remote action is triggered;
- state restoration returns to the same breadcrumb path.

## Track terminal view

Track is the first required terminal information level.

The default Track surface should lead with understandable music context, while technical identity/provenance remains available under a collapsed technical disclosure. Raw internal codes must not dominate the normal view.

User-facing first:
- title;
- current Account / Year / Genre / Artist / Release;
- library/account occurrences;
- YouTube/YTM state in plain language;
- short data-quality note.

Technical disclosure may then expose the full model, including:
- canonical track ID;
- title and normalized/search title;
- artist(s);
- release(s);
- year;
- genre(s);
- TrackVersion type;
- original/remix/live/demo/edit/remaster relationships;
- account(s);
- playlist occurrence(s);
- YouTube/YTM video ID;
- YouTube/YTM playlist ID;
- exact URL(s);
- channel match state;
- availability/unavailable state;
- duration;
- source package/file;
- provenance and verification status;
- duplicate/variant mismatch flags;
- notes;
- future safe actions such as Open URL / Copy ID.

Missing data is shown as unknown/not available, never invented.

## 3D gesture model

For Sphere 3D, camera translation and orbit are intentionally separate:
- drag without a modifier pans/moves the sphere on screen;
- while the user holds a bottom **HOLD / ORBIT** control, drag rotates the sphere around its axes;
- releasing HOLD immediately returns drag to pan;
- pinch controls zoom.

This keeps ordinary browsing spatially predictable while still allowing deliberate 3D rotation with two-hand interaction.

## Read-only first

Remote channel work remains gated:

```text
inventory
→ match
→ classify
→ dry-run/preview
→ explicit confirmation
→ write
→ read-after-write verification
→ audit
```

Nested 3D navigation itself never implies remote mutation.

## Final Android product

The final deliverable is a signed APK.

Expected path:
1. stabilize graph state/navigation in browser/PWA;
2. validate real-phone performance;
3. package the accepted UI into Android;
4. add Android lifecycle/storage/navigation integration;
5. establish stable development signing;
6. establish release signing through GitHub Actions secrets;
7. verify APK with apksigner + zipalign + SHA-256;
8. install and run separate real-phone QA.

Initial packaging candidate remains Capacitor/WebView because the graph UI is web-oriented. A native renderer is chosen only if measured Android performance or platform integration proves the web renderer insufficient.
