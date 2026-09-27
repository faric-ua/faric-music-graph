# System Behavior Contract

## State restoration

Refresh, orientation change, app recreation or route remount must restore the same semantic view when practical:
- selected artist/release;
- filters;
- expanded branch;
- graph viewport;
- inspector state;
- completed operation result.

Restoration must not repeat a remote action.

## Long operations

Scanning/importing/matching/channel work owns state outside a transient modal. Closing a result dialog must not destroy the completed status state.

## Navigation ownership

Back/Cancel always have an explicit owner and destination. System picker cancel returns to the parent app state without starting another action.

## Destructive actions

Delete/unlink/channel mutation requires:
- clear target identity;
- preview;
- explicit confirmation;
- verified result;
- audit record.

## Identity

External IDs are opaque. Never infer identity from a suffix, title spelling or filename.
