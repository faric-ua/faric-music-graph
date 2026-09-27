# UI Contract

The graph is an exploration surface, not decoration.

Required:
- zoom/pan;
- select/inspect;
- expand/collapse;
- isolate branch;
- reset;
- search;
- combine filters;
- show channel-state overlays.

Core filters:
- year/range;
- genre;
- artist;
- release;
- release type;
- remix/live/demo/original;
- Best Of;
- Exclusive;
- on channel;
- missing;
- duplicate;
- variant mismatch;
- needs review.

Mobile rules:
- critical targets at least 48dp;
- collapsible filter panel;
- inspector must not permanently cover the graph;
- portrait and landscape supported;
- stable first frame;
- safe insets;
- long labels wrap/ellipsize safely.

Use semantic visual tokens. Color cannot be the only status cue.
