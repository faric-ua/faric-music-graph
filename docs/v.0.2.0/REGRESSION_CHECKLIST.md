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


## Automated canonical nested-drill contract
- [x] Universe projects both Account fixtures;
- [x] FARIC UA Account projects Year worlds from the sample assignment;
- [x] 1994 projects contextual Genre worlds;
- [x] Big Beat projects The Prodigy;
- [x] The Prodigy projects Music for the Jilted Generation;
- [x] the Release projects its Track children;
- [x] entering Voodoo People produces terminal Track scope;
- [x] deep breadcrumb contains all seven hierarchy levels;
- [x] contextual IDs remain unique;
- [x] repeated contextual releases preserve one canonical release ID;
- [x] browser Account fixture matches canonical account JSON;
- [x] sample assignments cannot load unless explicitly marked non-inventory;
- [x] descendant-search enrichment preserves paths to matching content.


## Automated structured Track-detail contract
- [x] Track terminal details resolve through canonical ID while retaining projection ID;
- [x] contextual genre/account copies dedupe canonical Artist and Release facts;
- [x] multi-account prototype appearances aggregate without becoming live-inventory claims;
- [x] TrackVersion state remains explicitly unmodeled when absent;
- [x] YouTube/YTM IDs and URLs remain null/unknown when absent;
- [x] duration, availability and playlists remain unknown when absent;
- [x] prototype assignment and unverified inventory warnings are asserted;
- [x] fixture-account context warning is asserted;
- [x] normal Track UI uses structured groups rather than raw JSON;
- [x] inspector open/close commands are wired into GraphSessionState.


## Automated semantic-restoration contract
- [x] drill path and current scope restore without replaying Enter;
- [x] selected node restores;
- [x] applied filters restore;
- [x] pending draft filters restore independently from applied filters;
- [x] open filter panel restores;
- [x] open Track inspector target/mode restores;
- [x] renderer mode restores;
- [x] stale canonical path fails closed to Universe;
- [x] invalid inspector target does not destroy otherwise-valid session state;
- [x] corrupt/blocked browser storage degrades safely;
- [x] restore does not dispatch semantic commands.


## Automated Expand All performance-guard contract
- [x] full-expansion estimate is produced before bulk expansion;
- [x] bulk expansion IDs are limited to the current canonical scope;
- [x] unmeasured phone budget requires explicit confirmation;
- [x] measured-limit policy supports immediate apply below/equal to tested budget;
- [x] measured-limit policy confirms above tested budget;
- [x] Cancel is an exact semantic no-op;
- [x] confirmed expansion reaches the predicted scoped visible-node count;
- [x] Collapse All uses the same scoped bulk IDs;
- [x] missing browser control/navigation runtime definitions are now CI-asserted.


## Final automated validation gate
- [x] repository/static validation PASS;
- [x] JavaScript syntax PASS;
- [x] all v0.2.0 semantic/unit suites PASS in one CI run;
- [x] canonical Account fixture conforms to JSON Schema;
- [x] schema negative controls cover required/type/const/additionalProperties;
- [x] Git whitespace check PASS.
