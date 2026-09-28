# v0.2.0 Evidence Manifest

No implementation/phone evidence yet.

## Existing product evidence

2026-09-28 user product direction:
- filters in a single-column dedicated panel;
- panel occupies a substantial portion of screen and scrolls;
- Reset/Apply footer always visible;
- filters need not apply immediately;
- node expand/collapse all and per-selected-node controls;
- forward/back node navigation;
- approximately 50% transparent floating control palette;
- multiple account nodes in 3D;
- drill into Account → Year → Genre → Artist → Album/Release → Track;
- level-specific controls;
- terminal Track information view;
- final product is Android APK;
- every step documented with diagrams and recoverable plan.

This records requirements, not implementation PASS.


## GraphSessionState implementation — 2026-09-28

Implementation source:
`2bc8c90adae36cc7ee3d6402a3a4cfe1c99a82b2`

Automated CI:
- run `36361888481` — FAIL in the new graph-state test only;
- cause: the test incorrectly expected `EXPAND_ALL` to discard an unrelated pre-existing expanded node;
- correction kept the implementation semantics and isolated the test scope;
- run `36362006903` — PASS.

Verified by automated tests:
- node selection does not implicitly drill;
- Enter changes scope and pushes recoverable navigation state;
- Back restores prior scope, selection, filters and camera state;
- Home returns to Universe;
- breadcrumb-depth jump restores an ancestor scope;
- expand/collapse selected and bulk membership semantics;
- draft filters remain separate from applied filters until Apply;
- session state serializes/restores with version checking.

This is automated state-machine evidence only. It does not prove renderer, browser touch UX, rotation, or phone behavior.
