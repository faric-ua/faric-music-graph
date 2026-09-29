# Mobile UI Blueprint — Nested 3D Worlds

Updated: 2026-09-28

## Portrait layout

```text
┌─────────────────────────────────────┐
│ ‹  Universe › Account › 1997   ⋮   │
├─────────────────────────────────────┤
│                                     │
│              3D WORLD               │
│                                     │
│     ○────○            ○             │
│          ╲           ╱              │
│            ● selected               │
│                                     │
│                         [−][+][⋮]   │
│                                     │
│              tap → enter            │
│                                     │
│   [HOLD ORBIT]                      │
│                                     │
│ [ Filters • 3 ]                     │
└─────────────────────────────────────┘
```

## Filter panel — portrait

Opens over the graph as a bottom sheet occupying about 45–55% of the viewport height.

```text
┌─────────────────────────────────────┐
│ 3D graph remains visible behind     │
│                                     │
├─────────────────────────────────────┤
│ ФІЛЬТРИ                    ×        │ fixed header
├─────────────────────────────────────┤
│ Пошук                               │
│ [.................................] │
│                                     │
│ Рік                                 │
│ [1991] — [2026]                    │
│                                     │
│ Жанр                                │
│ [ ... ]                             │
│                                     │
│ Виконавець                          │ scrollable body
│ [ ... ]                             │
│                                     │
│ Тип релізу                          │
│ [ ... ]                             │
│            ⋮                        │
├─────────────────────────────────────┤
│ [ Скинути ]       [ Застосувати ]  │ fixed footer
└─────────────────────────────────────┘
```

Footer actions never scroll away.

## Filter panel — landscape/tablet

Use a side sheet approximately 40–50% of viewport width.

The graph stays visible in the remaining area.

## Pending filter state

Editing a filter changes `draftFilters` only.

Visual cues:
- Filter button badge = count of active applied filters;
- small pending marker when draft differs from applied;
- Apply button enabled only when draft differs;
- Reset returns draft to contextual defaults.

Manual Apply is the default until performance measurements justify debounced live mode.

## Graph controls

Primary mobile interaction is tap-first. The graph itself is the main navigation surface.

Compact quick row:
```text
[ − ] [ + ] [ ⋮ ]
```

The `⋮` menu exposes advanced commands:
```text
Visibility
[ Expand all ] [ Collapse all ]
[ Expand node] [ Collapse node]

Navigation / utility
[ Back ] [ Enter fallback ]
[ Home ] [ Fit ]
```

The advanced panel keeps an approximately 50% transparent background and 48dp-class touch targets. It is hidden by default on narrow phones so it does not permanently cover the graph.

`Enter` remains a semantic command and accessibility/fallback action, but ordinary drilling should not require the user to press it after every tap.

## Gesture ownership

Default graph navigation:
- short tap on a non-terminal node = enter that nested world;
- short tap on Track = open Track details;
- tap empty graph space while Track details are open = close Track details;
- long press on a node = select/focus only, for advanced Expand/Collapse commands;
- header Back/breadcrumb returns to parent scope;
- swipe right from the left graph edge = one semantic level back.

2D Map:
- one-finger drag = pan;
- pinch = zoom.

Sphere 3D:
- one-finger drag without HOLD = move/pan the sphere on screen;
- hold the bottom `HOLD / ORBIT` control with one finger and drag the graph with another = rotate around the sphere axes;
- pinch = zoom;
- releasing HOLD immediately returns drag to pan mode.

Tap-vs-drag is movement-thresholded so normal panning/orbiting does not accidentally enter a node.

Panel:
- interactions inside panel belong to panel;
- gestures outside panel belong to graph.

## Breadcrumb

Always visible or reachable without opening filters.

Rules:
- shows current drill path;
- supports horizontal scrolling;
- tapping a parent returns directly to that parent;
- current node is visually distinct;
- rotation/restoration keeps the same path.

## Track view

Track is information-heavy, so it may replace the graph with a dedicated detail surface or use an expandable sheet.

Recommended default grouping:

```text
Track title
Current Account / Year / Genre / Artist / Release
Library/account occurrences
YouTube / YTM user-facing state
Short data-quality note
[ Technical data ▸ ]
```

Canonical/projection IDs, prototype assignment codes, verification internals and raw warning codes belong under the collapsed **Technical data** disclosure by default.

Raw JSON is a debug view only, not the normal product UI.

## Accessibility / mobile rules

- critical touch targets ~48dp or larger;
- safe insets;
- portrait + landscape QA;
- long labels wrap or ellipsize without covering controls;
- color is never the only status signal;
- panel transparency must not reduce text/icon contrast below practical readability;
- no animation may block Back or make controls move unpredictably.


## Viewport breathing room

Renderer-local Fit should not stretch the graph to the full physical viewport.

For the phone prototype, 2D Fit targets approximately 80% of the available canvas span so nodes and labels keep visible space from the screen boundaries. This is a presentation rule only; it does not change graph topology, scope or filters.

## Spatial drill feedback

Normal nested navigation should preserve a sense of place.

On short-tap drill:
1. show a brief node-kind hint near the tap;
2. the tapped node becomes the focus of the next world;
3. the next world expands outward from that focus over a short transition;
4. the animation never becomes the source of semantic state.

Example hint copy:
- `Акаунт · FARIC UA`;
- `Рік · 1994`;
- `Жанр · Big Beat`;
- `Виконавець · The Prodigy`;
- `Реліз · Music for the Jilted Generation`;
- `Трек · Voodoo People`.

Hints fade automatically and never require dismissal.

## Sphere spatial hierarchy

Sphere 3D should communicate both the current world and the path that led to it.

Prototype rule:
- current scope = center focus node;
- current children/visible neighbors = distributed around a sphere;
- previous scopes = low-opacity depth-trail ghosts behind the current focus;
- parent ghost tap = semantic jump back to that ancestor;
- HOLD/ORBIT rotates the current sphere and its links together.

The depth trail is contextual background, not a second source of graph truth.

## Empty-space dismissal

On phone, a short tap on empty graph space dismisses transient overlays in this order-independent sense:
- Track details close if open;
- the `⋮` advanced node-control palette closes if open.

The explicit × / menu controls remain available.

## History starfield depth

The earlier “few ghost dots behind the focus” prototype is superseded.

Sphere 3D should preserve prior nested worlds as actual visual background layers:
- each prior semantic scope is re-projected with its visible nodes and links;
- the nearest prior world is visibly larger/brighter than older worlds;
- deeper history layers progressively shrink and fade toward a starfield-like background;
- the active world remains the foreground interaction layer;
- the nearest parent focus gets a clearly tappable `← parent` Back target;
- HOLD/ORBIT rotates the spatial composition consistently, including background history structures;
- renderer depth history is reconstructed from semantic session history after reload where possible.

The effect should communicate “I travelled deeper into the graph” rather than “the previous page disappeared.”

## Frozen depth frames

History worlds are not a shared camera scene.

When the user drills into a child:
1. capture the current world's renderer camera;
2. commit semantic ENTER;
3. move the complete outgoing world into background depth;
4. freeze that world in the camera/orientation it had when it was left;
5. create the child world as the new active foreground world.

While a child world is active:
- pan affects only the active world;
- pinch zoom affects only the active world;
- HOLD / ORBIT affects only the active world;
- prior worlds remain visually fixed in screen-space depth.

When navigating Back:
- the current child world fades/recedes;
- the nearest saved parent world moves forward;
- the parent's saved camera is restored;
- once foreground again, that parent world becomes interactive and may be moved/rotated/zoomed normally.

This is intentionally closer to a stack of nested spatial scenes than one giant camera containing every historical world.
