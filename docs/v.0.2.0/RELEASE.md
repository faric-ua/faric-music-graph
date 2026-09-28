# v0.2.0 — Nested 3D Worlds Foundation

## Goal

Replace the flat prototype UX with the product navigation model:

```text
Universe → Account → Year → Genre → Artist → Release → Track
```

## Scope

- renderer-independent session/navigation state;
- drill path + breadcrumb;
- contextual world projection;
- adaptive filter panel with draft/applied state;
- fixed filter footer;
- floating translucent node controls;
- expand/collapse selected;
- expand/collapse all;
- Enter / Back / Home / Fit;
- Track terminal detail model;
- state restoration contract;
- tests for navigation/filter semantics.

## Explicit non-goals

- final production renderer decision;
- YouTube write actions;
- final Android APK release;
- full account/channel mutation flow.

## Product source

- `docs/product/PRODUCT_VISION.md`
- `docs/architecture/NESTED_3D_WORLDS.md`
- `docs/design/MOBILE_UI_BLUEPRINT.md`
