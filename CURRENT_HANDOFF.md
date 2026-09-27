# FARIC Music Graph — Current Handoff

Updated: 2026-09-28

Repository: `faric-ua/faric-music-graph`
Default branch: `main`

## Current state

- repository foundation merged to main;
- project is isolated from YTM/Renault;
- canonical workflow/contracts/release skeleton exist;
- Termux aliases/menu/server tooling exists;
- canonical phone setup is `docs/ua/TERMUX_SETUP.md`;
- phone setup completed on source `2cc968cc0fece74de6f07872bbd7f0bf9975d90c`;
- local checkout path verified: `$HOME/faric-music-graph`;
- shared root verified: `/storage/emulated/0/Documents/FARIC-Music-Graph`;
- Git status verified clean and aligned: `## main...origin/main`;
- `$HOME/.shortcuts/Music Graph` exists and is executable;
- existing `Renault`, `YTM Importer`, and `Phone Diagnostics` shortcuts remain present;
- Termux:Widget UI smoke PASS: `Music Graph` is visible after Refresh and opens the project menu;
- first phone graph feedback received: current Canvas controls are poor on mobile and no usable pinch zoom is available; mobile graph acceptance is FAIL/PENDING REDESIGN;
- spherical/3D graph mode is now an explicit prototype/research track;
- initial known catalog scope: The Prodigy + Linkin Park;
- prepared source catalog: 88 release/list entities and 863 normalized track-title entities;
- channel target: `https://music.youtube.com/@faric_ua`;
- live channel inventory is not yet repository truth.

## Current milestone

`v0.1.0 — repository + data-contract + graph prototype foundation`

## Next exact work

Use `ACTIVE_PLAN.md` as the ordered execution source.

Immediate next step: implement a mobile-first graph interaction prototype with real pinch zoom and compare it with a spherical/3D prototype before accepting the graph engine.

Do not add YouTube write actions before read-only audit has browser/phone PASS.
