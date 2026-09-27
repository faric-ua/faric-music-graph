# FARIC Music Graph — Current Handoff

Updated: 2026-09-27

Repository: `faric-ua/faric-music-graph`
Default branch: `main`
Bootstrap branch: `feat/v0.1.0-bootstrap`

## Current state

- repository initialized;
- reusable workflow rules from YTM and Renault are being adapted;
- initial catalog scope: The Prodigy + Linkin Park;
- prepared source catalog: 88 release/list entities and 863 normalized track-title entities;
- channel target: `https://music.youtube.com/@faric_ua`;
- live channel inventory is not yet repository truth.

## Milestone

`v0.1.0 — repository + data-contract + graph prototype foundation`

## Next exact work

1. merge bootstrap skeleton;
2. import full prepared seed through the canonical data contract;
3. validate IDs/edges/duplicates;
4. accept first graph view on phone;
5. inventory `@faric_ua` read-only;
6. record channel match states without remote mutation.

Do not add YouTube write actions before read-only audit has browser/phone PASS.
