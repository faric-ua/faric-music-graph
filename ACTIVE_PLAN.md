# FARIC Music Graph — ACTIVE PLAN

Updated: 2026-09-28

Purpose: live crash-recovery checklist. Read immediately after `CURRENT_HANDOFF.md`; continue from the first unchecked item.

## v0.2.0 — Nested 3D Worlds foundation

- [x] Repository/project skeleton established.
- [x] Termux private checkout, menu and Widget smoke established.
- [x] Initial 2D + simple Sphere prototype built and CI-validated in v0.1.1.
- [x] Record first mobile feedback that the flat Canvas interaction is not acceptable as final UX.
- [x] Accept final product direction: signed Android APK.
- [x] Accept primary UX direction: Nested 3D Worlds.
- [x] Read YTM/Renault reusable Android/workflow lessons as read-only references.
- [x] Define canonical product vision: Universe → Account → Year → Genre → Artist → Release → Track.
- [x] Define adaptive filter panel with draft/applied state and fixed Reset/Apply footer.
- [x] Define persistent floating ~50%-transparent node-control palette.
- [x] Define renderer-independent Expand/Collapse/Enter/Back/Home/Fit semantics.
- [x] Define track terminal information model and breadcrumb/state restoration contract.
- [x] Define Music Graph-specific APK/signing/artifact contract.
- [x] Create v0.2.0 release/QA/diagram skeleton before feature code.
- [x] Implement renderer-independent GraphSessionState + command reducer/state machine.
- [x] Implement projection engine for current scope/drill level/filters/expand state.
- [x] Add Account entity + multi-account fixture without storing auth secrets.
- [x] Implement adaptive filter panel: one column, scroll body, sticky footer, draft/applied state.
- [x] Implement floating node-control palette and command wiring.
- [x] Implement breadcrumb + Enter/Back/Home navigation.
- [x] Implement Nested 3D drill projection through Account → Year → Genre → Artist → Release → Track.
- [x] Implement structured Track terminal details.
- [x] Add restoration tests for drill path, filters, selected node and open panels.
- [x] Add performance guard for Expand All.
- [x] Run static/unit/schema tests and CI.
- [ ] Run real-phone v0.2.0 portrait/landscape/gesture/filter/drill QA.
- [ ] Decide production renderer from measured phone/full-seed evidence.
- [ ] Migrate full The Prodigy + Linkin Park seed through the canonical graph.
- [ ] Validate canonical IDs, provenance and version/remix edges.
- [ ] Add read-only multi-account/channel inventory and overlays.
- [ ] Start Android packaging milestone only after graph UX/data state is stable enough to embed.
- [ ] Establish Music Graph-specific stable dev signing and signed APK CI.
- [ ] Install versioned APK on phone and run separate APK lifecycle/performance QA.

## Update rule

After every successful project-progress step:
1. mark only the evidence-backed checkbox `[x]`;
2. update release QA/findings/diagrams when applicable;
3. update `CURRENT_HANDOFF.md` when the resume point changes;
4. keep the next action as the first unchecked item.

Do not use chat memory as the only progress record.
