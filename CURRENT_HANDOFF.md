# FARIC Music Graph — Current Handoff

Updated: 2026-09-28

Repository: `faric-ua/faric-music-graph`
Default branch: `main`

## Stable foundation

- project isolated from YTM/Renault;
- Termux private checkout + menu + Widget smoke PASS;
- crash-recovery `ACTIVE_PLAN.md` rule active;
- release/QA documentation workflow active;
- initial Prodigy + Linkin Park prepared catalog known;
- v0.1.1 produced an improved 2D prototype and a simple spherical Canvas prototype;
- v0.1.1 implementation/CI evidence is preserved as prototype history.

## Product direction accepted 2026-09-28

The flat “one big graph” model is no longer the target UX.

Primary product model:
**Nested 3D Worlds**.

```text
Universe → Account → Year → Genre → Artist → Release → Track
```

At every graph level:
- contextual filters;
- breadcrumb;
- floating node-control palette;
- Expand/Collapse selected;
- Expand/Collapse all;
- explicit Enter/Back/Home;
- Fit;
- selection separate from drill navigation.

Filter panel:
- single-column;
- portrait bottom sheet about 45–55% height;
- landscape/tablet side sheet about 40–50% width;
- scrollable body;
- Reset/Apply always visible;
- draft filters do not change graph before Apply by default.

Final product target:
**signed Android APK**.

Web/PWA is the development/prototyping surface.

Sibling YTM/Renault repositories are read-only engineering references for this project.

## Current milestone

`v0.2.0 — Nested 3D Worlds foundation`

Release/product docs created before feature code:
- `docs/product/PRODUCT_VISION.md`;
- `docs/architecture/NESTED_3D_WORLDS.md`;
- `docs/design/MOBILE_UI_BLUEPRINT.md`;
- `docs/android/APK_DELIVERY_CONTRACT.md`;
- `docs/v.0.2.0/`.

## Next exact work

Read `ACTIVE_PLAN.md`.

First unchecked step:
**implement renderer-independent GraphSessionState + command reducer/state machine.**

Do not start YouTube write actions. Do not start Android packaging before the graph state/navigation contracts are implemented and phone-testable.
