# UI Contract

Updated: 2026-09-28

## Primary interaction model

The primary product UX is **Nested 3D Worlds**, not one permanently expanded graph.

Primary drill projection:
`Universe → Account → Year → Genre → Artist → Release → Track`.

## Selection vs navigation

Tap node:
- select/focus;
- show selection state;
- never automatically perform a remote action.

Enter:
- explicit command;
- selected node becomes current scope;
- drill path advances.

Back:
- previous scope;
- restores previous world/filter/camera state when practical.

## Graph gestures

Required:
- one-finger orbit/pan;
- two-finger pinch zoom;
- tap/select without drag conflict;
- Fit/Center;
- predictable zoom/orbit limits.

## Floating node-control palette

Always available in graph worlds.

Required:
- Expand all;
- Collapse all;
- Expand selected;
- Collapse selected;
- Enter;
- Back;
- Home;
- Fit.

Design:
- approximately 50% transparent panel background;
- readable opaque controls;
- ~48dp critical touch targets;
- safe insets;
- may collapse to compact handle;
- graph gestures outside panel remain owned by graph.

## Filter panel

Single-column dedicated panel.

Portrait:
- full width;
- bottom sheet about 45–55% of viewport height.

Landscape/tablet:
- side sheet about 40–50% width.

Structure:
- fixed header;
- scrollable body;
- fixed footer;
- `Скинути` and `Застосувати` always visible.

State:
- filter editing changes `draftFilters`;
- graph uses `appliedFilters`;
- v0.2 default: Apply is explicit;
- show pending state when draft != applied.

Live/debounced filtering may be introduced only after measured performance.

## Contextual filters

Filter definitions depend on current world and come from a registry/schema, not separate hardcoded screen implementations.

Global filters persist only when semantically compatible with the next scope.

## Breadcrumb

Always visible/reachable.

- shows current drill path;
- scrolls horizontally if long;
- parent segments are tappable;
- parent tap only navigates backward;
- rotation/reload restores same semantic path.

## Track terminal details

Normal UI is structured groups, not raw JSON.

Show all known applicable information:
- Track / TrackVersion identity;
- artists/releases/year/genre;
- original/remix/live/demo/edit relationships;
- accounts/playlists;
- exact YouTube/YTM IDs and URLs;
- channel state;
- availability/duration;
- provenance/verification;
- duplicate/mismatch warnings.

## Mobile lifecycle/layout

- portrait and landscape are both supported;
- do not lock orientation to hide layout defects;
- safe insets;
- critical targets ~48dp+;
- long labels wrap/ellipsize safely;
- color is not the only status cue;
- filter footer cannot scroll offscreen.

## Modal/sheet rule

App-owned sheets/dialogs use one shared presentation/state contract when Android packaging begins.

Rotation restores open sheet/dialog/draft without triggering the positive action.

## Remote safety

No graph/filter/navigation gesture may directly mutate YouTube/YTM.
