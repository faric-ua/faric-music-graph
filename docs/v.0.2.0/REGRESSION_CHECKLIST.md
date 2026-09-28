# v0.2.0 Regression Checklist

## Navigation
- [ ] Universe renders;
- [ ] Account select/focus;
- [ ] Enter selected Account;
- [ ] Year → Genre → Artist → Release → Track path;
- [ ] Back one level;
- [ ] Home to Universe;
- [ ] breadcrumb jump to parent;
- [ ] accidental graph drag does not enter a node.

## Node controls
- [ ] Expand selected;
- [ ] Collapse selected;
- [ ] Expand all with performance guard;
- [ ] Collapse all;
- [ ] Fit/Center.

## Filters
- [ ] one-column filter body;
- [ ] adaptive bottom/side panel;
- [ ] body scrolls independently;
- [ ] Reset + Apply remain visible;
- [ ] draft changes do not affect graph before Apply;
- [ ] contextual filters change by world;
- [ ] pending/applied indicator accurate.

## State
- [ ] reload restores semantic path where supported;
- [ ] portrait ↔ landscape restores drill/filter state;
- [ ] open filter panel restores draft;
- [ ] no remote action repeats.

## Safety
- [ ] no YouTube write controls;
- [ ] no secrets in repository;
- [ ] current release docs and diagrams updated.


## Automated semantic-state contract
- [x] select does not implicitly Enter;
- [x] Enter pushes scope/history;
- [x] Back restores previous semantic state;
- [x] Home returns to Universe;
- [x] ancestor-depth jump works;
- [x] draft filters stay separate until Apply;
- [x] expand/collapse state semantics tested;
- [x] serialize/restore round-trip tested;


## Automated projection contract
- [x] current scope projects only the next navigation dimension;
- [x] expansion reveals descendants without changing scope;
- [x] collapse hides descendants;
- [x] only applied filters affect projection;
- [x] facet-aware filters preserve unrelated deeper dimensions;
- [x] visible-edge closure tested;
- [x] Track terminal projection tested;
- [x] unique-node expansion estimate tested.


## Automated Account contract
- [x] provider-neutral Account normalization;
- [x] duplicate/dangling Account relationship checks;
- [x] auth-data declaration must be false;
- [x] secret-like key guard;
- [x] known public target keeps unverified external ID null;
- [x] synthetic account is fixture-only;
- [x] visible account-to-account non-navigation edge tested.


## Automated adaptive-filter contract
- [x] semantic filter defaults are normalized;
- [x] active applied-filter count is deterministic;
- [x] search / artist / year range / genre / release-type filtering covered;
- [x] inverted year range normalizes safely;
- [x] draft edit does not mutate applied filters;
- [x] Reset mutates draft only;
- [x] Apply copies draft to applied;
- [x] one-column scrollable filter body is structurally asserted;
- [x] fixed Reset/Apply footer is structurally asserted;
- [x] portrait bottom-sheet and wider side-sheet breakpoints are asserted.


## Automated node-control contract
- [x] palette includes Expand All / Collapse All;
- [x] palette includes Expand selected / Collapse selected;
- [x] palette includes Enter / Back / Home / Fit;
- [x] palette surface transparency is structurally asserted;
- [x] minimum 48px touch targets are structurally asserted;
- [x] selected-node capability state is derived from semantic state;
- [x] terminal node cannot Enter;
- [x] Back/Home capability follows drill scope;
- [x] expanded selected node switches from Expand to Collapse capability.


## Automated breadcrumb/navigation contract
- [x] Universe breadcrumb is the initial current crumb;
- [x] deep drill path emits ordered breadcrumb items;
- [x] only ancestor crumbs are clickable;
- [x] current crumb is non-clickable/current;
- [x] Back/Home capability follows drill depth/scope;
- [x] header Enter capability is supplied by the same semantic node capability as the floating palette;
- [x] header and floating Enter share one handler;
- [x] header and floating Back share one handler;
- [x] header and floating Home share one handler;
- [x] ancestor breadcrumb jump dispatches `JUMP_TO_DEPTH`;
- [x] breadcrumb container is horizontally scrollable.
