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
- graph/browser smoke is still pending;
- initial known catalog scope: The Prodigy + Linkin Park;
- prepared source catalog: 88 release/list entities and 863 normalized track-title entities;
- channel target: `https://music.youtube.com/@faric_ua`;
- live channel inventory is not yet repository truth.

## Current milestone

`v0.1.0 — repository + data-contract + graph prototype foundation`

## Next exact work

1. pull latest `main` on phone;
2. run first phone/browser graph smoke from Music Graph menu;
3. verify portrait/landscape, zoom/pan/select and refresh behavior;
4. import the full prepared seed through the canonical data contract;
5. inventory `@faric_ua` read-only.

Do not add YouTube write actions before read-only audit has browser/phone PASS.
