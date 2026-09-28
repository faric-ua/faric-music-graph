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
│                          ┌────────┐  │
│                          │ + all  │  │
│                          │ - all  │  │
│                          │ + node │  │
│                          │ - node │  │
│                          │ →      │  │
│                          │ ←      │  │
│                          │ Fit    │  │
│                          └────────┘  │
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

## Floating node controls

The panel background is approximately 50% transparent.

The icons/buttons themselves must remain readable and meet touch target requirements.

Initial command grouping:

```text
Visibility
[ Expand all ] [ Collapse all ]
[ Expand node] [ Collapse node]

Navigation
[ Back ] [ Enter ]
[ Home ] [ Fit ]
```

On narrow portrait, labels may become icons with accessible labels/tooltips/help.

## Gesture ownership

Graph:
- one finger drag = orbit/pan;
- pinch = zoom;
- tap = select/focus.

Panel:
- interactions inside panel belong to panel;
- gestures outside panel belong to graph.

Do not make node tap immediately drill into a deeper world. Selection and navigation are separate so the user can rotate/select without accidental entry.

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

Recommended grouping:

```text
Track identity
Version / relationship
Artist + releases
Accounts + playlists
YouTube / YTM exact IDs and URLs
Channel state
Availability / duration
Provenance / verification
Warnings / duplicates / mismatches
```

Raw JSON is a debug view only, not the normal product UI.

## Accessibility / mobile rules

- critical touch targets ~48dp or larger;
- safe insets;
- portrait + landscape QA;
- long labels wrap or ellipsize without covering controls;
- color is never the only status signal;
- panel transparency must not reduce text/icon contrast below practical readability;
- no animation may block Back or make controls move unpredictably.
