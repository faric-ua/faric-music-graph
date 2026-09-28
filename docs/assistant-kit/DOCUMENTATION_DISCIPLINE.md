# Documentation Discipline

Updated: 2026-09-28

Documentation is part of the implementation.

## Before feature code

For a new release/major behavior:
1. update the product/behavior contract;
2. create release skeleton;
3. add/update architecture or flow diagram;
4. update `ACTIVE_PLAN.md`;
5. only then change feature code.

## After each verified step

Update:
- `ACTIVE_PLAN.md`;
- relevant release QA/evidence;
- finding status when applicable;
- `CURRENT_HANDOFF.md` when resume point changes.

## Diagrams

Use editable text/vector sources as canonical records:
- Mermaid;
- PlantUML;
- SVG;
- source-controlled HTML diagrams.

Raster screenshots are evidence/previews, not the only architecture record.

Each major flow should have:
- happy path;
- Back/Cancel;
- rotation/recreation;
- error/empty state where relevant.

## Historical integrity

Do not rewrite old FAIL/PASS records to fit a newer design.

A newer release may supersede an old prototype while preserving the old evidence.

## State vs evidence

Document separately:
- intended contract;
- implementation state;
- CI result;
- browser result;
- real-phone result;
- remote mutation result.

Never infer a later state from an earlier one.
