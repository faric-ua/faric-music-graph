# v0.2.0 Phone Test

Status: NOT RUN.

Phone QA starts only after implementation + CI PASS.

## Required paths

### Universe
- identify multiple Account nodes when fixture supports them;
- rotate/orbit;
- tap/select;
- Enter selected Account.

### Drill path
Test:
`Account → Year → Genre → Artist → Release → Track`.

At every level:
- selection works;
- node controls remain reachable;
- breadcrumb is correct;
- Back returns exactly one level.

### Filter panel
Portrait:
- opens as bottom sheet around half-height;
- one-column body scrolls;
- footer stays visible;
- editing does not change graph before Apply.

Landscape:
- side panel around 40–50% width;
- footer stays visible.

### Node controls
- Expand selected;
- Collapse selected;
- Expand all;
- Collapse all;
- Enter;
- Back;
- Home;
- Fit.

### Rotation
Rotate with:
- deep drill path;
- selected node;
- filter panel open with unapplied draft.

Expected:
- same semantic state restored;
- no operation re-executed.

### Track
Verify structured track information groups and exact IDs/URLs where fixture provides them.
