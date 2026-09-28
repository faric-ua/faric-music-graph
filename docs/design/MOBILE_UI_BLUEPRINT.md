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
