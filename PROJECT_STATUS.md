# Project Status

Updated: 2026-09-28

## Product

**FARIC Music Graph** is a mobile-first nested 3D music catalog, research graph, multi-account/channel workspace and future controlled YouTube/YouTube Music management tool.

Final product target: **signed Android APK**.

## Accepted primary UX

Nested 3D Worlds:

`Universe → Account → Year → Genre → Artist → Release → Track`.

The canonical graph remains many-to-many. Drill hierarchy is a projection.

## Prepared seed

- 2 artists;
- 88 release/list entities;
- 863 track-title entities;
- years represented from 1991 through 2026;
- studio/live/expanded/remix/EP/singles/special categories represented.

These are prepared-source counts, not yet the final canonical migrated dataset.

## Channel/account model

Current known target includes `@faric_ua`, but the product model now supports multiple provider/account nodes.

Live multi-account inventory: **PENDING READ-ONLY IMPLEMENTATION/AUDIT**.

## Engineering

- repository + recovery docs: established;
- v0.1.1 interaction prototype: implemented/CI PASS, historical prototype;
- product/UX contract: v0.2.0 Nested 3D Worlds accepted;
- renderer-independent session state: implemented + CI PASS;
- projection engine: implemented + CI PASS;
- provider-neutral Account foundation: implemented + CI PASS;
- adaptive filter panel: implemented + CI PASS; browser/phone UX acceptance pending;
- floating node controls: implemented + CI PASS; browser/phone UX acceptance pending;
- breadcrumb + shared Enter/Back/Home navigation: implemented + CI PASS; browser/phone UX acceptance pending;
- canonical nested drill projection Account → Year → Genre → Artist → Release → Track: implemented + CI PASS on prototype sample; browser/phone UX acceptance pending;
- structured terminal Track details: implemented + CI PASS; external media/version facts remain explicit unknown until sourced; browser/phone UX acceptance pending;
- semantic session restoration: implemented + CI PASS for path/filter/selection/open-panel restore; browser/phone lifecycle acceptance pending;
- full seed migration: pending;
- read-only channel inventory: pending;
- Android app packaging: planned after graph state/UX stabilization;
- YouTube write layer: disabled/not implemented.

Quality rule:

`contract != implementation != CI PASS != browser PASS != phone PASS != APK PASS != channel mutation PASS`.
