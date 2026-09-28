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
