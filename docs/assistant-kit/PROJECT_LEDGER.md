# Project Ledger

Long-term facts that must survive chat/session loss.

## Product baseline

- project: FARIC Music Graph;
- repository: `faric-ua/faric-music-graph`;
- target channel: `@faric_ua`;
- initial artists: The Prodigy, Linkin Park;
- catalog model: normalized graph, not folder hierarchy;
- channel policy: read-only first;
- remote writes require preview + explicit confirmation + verification + audit.

## Architecture baseline

- graph UI is web/PWA-first;
- production graph candidate: Graphology + Sigma.js;
- external IDs are opaque;
- Track and TrackVersion are distinct;
- remix/live/demo/edit relationships are explicit edges;
- provenance is retained;
- YouTube read and write adapters are separate.

## Termux baseline

- live Git checkout: `$HOME/faric-music-graph`;
- shared data root: `/storage/emulated/0/Documents/FARIC-Music-Graph/`;
- Music Graph is isolated from Renault/YTM;
- aliases use `music-*`;
- Termux:Widget owns one top-level `Music Graph` shortcut;
- Widget shortcut opens `scripts/termux-menu.sh`;
- Music Graph widget installer must not delete or overwrite Renault/YTM shortcuts.

## Workflow baseline

- repository/live Git wins over old chat memory;
- exact-path staging is default;
- historical release/QA evidence is preserved;
- CI PASS, browser PASS, phone PASS and remote-mutation PASS are separate states;
- release skeleton is created before feature code;
- real findings are recorded before they can be forgotten.

Update this ledger when architecture, accepted UX, data contracts, workflow, channel policy or release baseline changes.
