# Mobile Graph / 3D / Spherical Research

Date: 2026-09-28

## Goal

Find a touch-friendly graph direction for FARIC Music Graph after the first phone feedback rejected the current Canvas interaction.

## References

### 1. Spherical Projection — closest to the requested idea

Live:
https://rodighiero.github.io/spherical-projection/

Source:
https://github.com/rodighiero/spherical-projection

Relevant behavior:
- force simulation runs in 3D;
- custom force constrains nodes to the surface of a sphere;
- drag rotates the sphere;
- scroll/pinch zooms;
- node click highlights relationships;
- the sphere has no fixed visual edge/center.

This is the closest reference for a real "graph on a ball".

### 2. 3D Force Graph — practical 3D engine reference

Examples:
https://vasturiano.github.io/3d-force-graph/

Relevant examples include:
- Orbit controls;
- click to focus;
- expand/collapse;
- fit graph to canvas;
- highlight nodes/links;
- large graph example.

Technology:
- Three.js / WebGL;
- d3-force-3d or ngraph.

This is a strong candidate for the first FARIC 3D prototype.

### 3. cosmos.gl — touch-first 2D baseline

Source:
https://github.com/cosmosgl/graph

Relevant behavior:
- WebGL/GPU graph rendering;
- phone/tablet tap, drag and pinch-to-zoom support;
- fit-to-points / focus / selection helpers;
- suitable as a comparison against 3D rather than keeping the current hand-written Canvas interaction.

## Initial decision

Do not replace the entire graph with sphere-only navigation yet.

Prototype two views over the same canonical data:

1. **2D Map**
   - pinch zoom;
   - one-finger pan;
   - fast search/filter/isolate;
   - best for labels and exact browsing.

2. **Sphere / 3D Explore**
   - orbit with one finger;
   - pinch zoom/dolly;
   - tap node → focus/highlight;
   - isolate artist/release/album branch;
   - best for overview and visually exploring relationships.

The user should be able to switch views without changing data or filters.

## Phone acceptance comparison

Compare both views on the same sample/full seed:
- portrait;
- landscape;
- pinch zoom;
- pan/orbit;
- node tap accuracy;
- focus/isolate/reset;
- label readability;
- 500+ / 1000+ node performance;
- battery/heat over several minutes.

Only after phone comparison choose the default mode.
