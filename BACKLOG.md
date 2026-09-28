# Backlog

Updated: 2026-09-28

## P0 — Nested 3D product foundation

- [ ] GraphSessionState / reducer/state machine;
- [ ] scope/drill projection engine;
- [ ] Account entity + multi-account fixture;
- [ ] breadcrumb;
- [ ] adaptive filter panel;
- [ ] draft/applied filters;
- [ ] floating node controls;
- [ ] expand/collapse semantics;
- [ ] Enter/Back/Home/Fit;
- [ ] Track detail aggregation;
- [ ] rotation/reload state restoration;
- [ ] performance guard for large expansion;
- [ ] phone portrait/landscape QA.

## P1 — Canonical catalog

- [ ] migrate full The Prodigy + Linkin Park prepared seed;
- [ ] stable canonical IDs;
- [ ] Track vs TrackVersion;
- [ ] remix/live/demo/edit/original edges;
- [ ] release ordering;
- [ ] provenance;
- [ ] validation/audits;
- [ ] local snapshot backup/restore.

## P2 — Multi-account read-only inventory

- [ ] provider-neutral Account model;
- [ ] resolve stable public channel/account identities;
- [ ] inventory playlists/videos/items without mutation;
- [ ] timestamped account snapshots;
- [ ] match items to canonical TrackVersion;
- [ ] classify MATCHED / MISSING / DUPLICATE / VARIANT_MISMATCH / NEEDS_REVIEW / UNAVAILABLE;
- [ ] account/channel-state overlays and contextual filters.

## P3 — Production graph renderer

Decide only from measured evidence:
- [ ] compare candidate 3D/WebGL renderers;
- [ ] full-seed FPS/memory/heat tests;
- [ ] Android WebView/Capacitor performance test;
- [ ] select primary 3D renderer;
- [ ] keep 2D/debug/fallback mode if useful;
- [ ] accessibility/label-density strategy.

## P4 — Android APK

- [ ] verify current Android/Capacitor toolchain versions;
- [ ] Android shell/scaffold;
- [ ] lifecycle/session persistence bridge;
- [ ] stable Music Graph development signing;
- [ ] signed GitHub Actions build;
- [ ] apksigner + zipalign + package metadata + SHA-256;
- [ ] stable versioned phone artifact folder;
- [ ] install/update QA;
- [ ] rotation/background/restore QA;
- [ ] performance/thermal QA.

## P5 — Safe remote write planning

No direct write until read-only layers are accepted.

- [ ] dry-run plan;
- [ ] quota estimate;
- [ ] exact target identity;
- [ ] duplicate guard;
- [ ] explicit confirmation;
- [ ] idempotency;
- [ ] read-after-write verification;
- [ ] audit trail;
- [ ] recovery/rollback model where possible.

## P6 — Product hardening

- [ ] search;
- [ ] saved views;
- [ ] offline/local persistence;
- [ ] backup/restore;
- [ ] update flow;
- [ ] accessibility;
- [ ] settings/theme;
- [ ] crash diagnostics;
- [ ] release closeout discipline.
