# System Behavior Contract

Updated: 2026-09-28

## Serializable semantic session

The app must be able to restore the user's semantic location.

Required state includes:
- drill path;
- current scope;
- selected node;
- expanded/collapsed node state;
- applied filters;
- draft filters when filter panel is open;
- filter-panel visibility;
- inspector/track-detail state;
- renderer mode;
- camera/orbit/zoom when practical.

Transient pointer/animation state does not need restoration.

## Restoration

Refresh, orientation change, Android recreation or route remount should return to the same semantic world.

Example:

`Universe › Account › 1997 › Big Beat › The Prodigy`

after rotation must remain the same logical path.

Restoration must not:
- Enter the selected node again;
- re-run import;
- repeat a destructive action;
- repeat a remote write.

## Navigation ownership

Commands have explicit semantics:
- Select;
- Expand;
- Collapse;
- Enter;
- Back;
- Home;
- Fit.

Expand/Collapse never change the drill scope.

Enter/Back/Home do.

## Filters

Keep `draftFilters` and `appliedFilters` separate.

Changing a UI control does not change the graph until Apply in the default v0.2 mode.

Reset changes the draft to contextual defaults; Apply commits it.

If live/debounced apply is later enabled, it must be an explicit accepted mode backed by performance evidence.

## Large expansion

Expand All is not allowed to freeze the UI.

Use predicted size, progressive work, cancellation/confirmation or another tested guard for large scopes.

## Long operations

Inventory/import/matching/build-like work owns durable state outside a transient modal.

Closing result UI does not destroy completed operation state.

## Destructive/remote actions

Delete/unlink/channel mutation requires:
- clear target identity;
- preview;
- explicit confirmation;
- verified result;
- audit record.

## Identity

External IDs are opaque. Never infer identity from a suffix, title spelling or filename.

## Android lifecycle

When packaged:
- system Back and visual Back tested separately;
- background/foreground must not corrupt drill/filter state;
- Android system UI cancellation returns to correct parent;
- no Activity recreation may auto-repeat a remote/destructive action.
