# FARIC Music Graph — Current Handoff

Updated: 2026-09-28

Repository: `faric-ua/faric-music-graph`
Default branch: `main`

## Current state

- repository foundation merged to main;
- project is isolated from YTM/Renault;
- canonical workflow/contracts/release skeleton exist;
- Termux aliases/menu/server tooling exists;
- Termux:Widget installer exists and creates one top-level `Music Graph` shortcut without changing Renault/YTM shortcuts;
- canonical phone setup is `docs/ua/TERMUX_SETUP.md`;
- initial known catalog scope: The Prodigy + Linkin Park;
- prepared source catalog: 88 release/list entities and 863 normalized track-title entities;
- channel target: `https://music.youtube.com/@faric_ua`;
- live channel inventory is not yet repository truth.

## Current milestone

`v0.1.0 — repository + data-contract + graph prototype foundation`

## Next exact work

1. clone/pull main into `$HOME/faric-music-graph`;
2. install aliases + Termux:Widget shortcut;
3. run repository validation;
4. run first phone/browser graph smoke;
5. import the full prepared seed through the canonical data contract;
6. inventory `@faric_ua` read-only.

Do not add YouTube write actions before read-only audit has browser/phone PASS.
