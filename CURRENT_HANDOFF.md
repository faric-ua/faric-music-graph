# FARIC Music Graph — Current Handoff

Updated: 2026-09-28

Repository: `faric-ua/faric-music-graph`
Default branch: `main`
Active feature branch: `feat/v0.1.1-mobile-graph`

## Current state

- repository foundation merged to main;
- project is isolated from YTM/Renault;
- canonical workflow/contracts/release skeleton exist;
- mandatory `ACTIVE_PLAN.md` crash-recovery checklist is active;
- Termux aliases/menu/server tooling exists;
- canonical phone setup is `docs/ua/TERMUX_SETUP.md`;
- phone setup and Termux:Widget project-menu smoke PASS;
- first phone graph feedback: current Canvas controls are poor on mobile and no usable pinch zoom is available;
- spherical/3D graph mode is an explicit prototype/research track;
- v0.1.1 release skeleton created before feature code;
- v0.1.1 2D Map + Sphere 3D prototype implemented on source `742161cd614d02c72a5c1ff85d3e597c611dc7f2`;
- CI Validate run `36358246425` PASS, including repository validation and `node --check`;
- initial known catalog scope: The Prodigy + Linkin Park;
- prepared source catalog: 88 release/list entities and 863 normalized track-title entities;
- channel target: `https://music.youtube.com/@faric_ua`;
- live channel inventory is not yet repository truth.

## Current milestone

`v0.1.1 — mobile 2D + Sphere 3D interaction prototype`

## Next exact work

Use `ACTIVE_PLAN.md` as the ordered execution source.

Immediate next step: merge the CI-clean v0.1.1 prototype, pull it on the phone, then execute the 2D-vs-Sphere comparison in `docs/v.0.1.1/qa/PHONE_TEST.md`.

Do not add YouTube write actions before read-only audit has browser/phone PASS.
