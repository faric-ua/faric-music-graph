# v0.1.1 — Mobile Graph Interaction Prototype

## Goal

Replace the rejected phone interaction of the initial Canvas graph with a testable comparison:

1. **2D Map**
   - one-finger pan;
   - two-finger pinch zoom;
   - visible +/- zoom;
   - fit/reset;
   - reliable tap selection.

2. **Sphere 3D**
   - graph nodes projected onto a sphere surface;
   - one-finger orbit/rotation;
   - pinch zoom;
   - visible +/- zoom;
   - fit/reset;
   - reliable tap selection.

Both views use the same filters and graph data.

## Non-goals

- no YouTube write;
- no full catalog import yet;
- no final production graph-engine decision;
- no claim that Sphere is better before phone comparison.

Research basis:
`docs/research/GRAPH_MOBILE_3D_RESEARCH.md`.


## Implementation checkpoint

Prototype source:
`742161cd614d02c72a5c1ff85d3e597c611dc7f2`

CI Validate:
`36358246425` — PASS.

Phone comparison remains mandatory before accepting either view.
