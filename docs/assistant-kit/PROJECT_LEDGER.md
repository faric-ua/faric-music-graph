# Project Ledger

Updated: 2026-09-28

Long-term facts that must survive chat/session loss.

## Product baseline

- project: FARIC Music Graph;
- repository: `faric-ua/faric-music-graph`;
- final product target: signed Android APK;
- web/PWA: development and rapid-prototype surface;
- initial prepared artists: The Prodigy, Linkin Park;
- channel/account policy: read-only first;
- remote writes require preview + explicit confirmation + verification + audit.

## Primary UX baseline

Accepted product direction:
**Nested 3D Worlds**.

Primary drill:
`Universe → Account → Year → Genre → Artist → Release → Track`.

- tap selects/focuses;
- Enter drills forward;
- Back moves one scope up;
- Home returns to Universe;
- breadcrumb exposes location;
- Expand/Collapse affects visibility without changing scope;
- floating node palette accompanies graph worlds.

## Filter baseline

- one-column adaptive filter panel;
- portrait: bottom sheet about half-height;
- landscape/tablet: side sheet about 40–50% width;
- scrollable body;
- fixed Reset/Apply footer;
- draft/applied filter state separated;
- manual Apply is default until performance evidence supports live/debounced apply.

## Data baseline

- canonical graph is not the navigation tree;
- Account is provider-neutral;
- Track and TrackVersion are distinct;
- remix/live/demo/edit relationships are explicit;
- provenance retained;
- external IDs opaque;
- auth tokens/secrets are not canonical graph data.

## Android/APK baseline

- Music Graph uses its own signing identity;
- YTM/Renault keys are never reused;
- track repository/build/installed versions separately;
- target pipeline includes tests → build → sign → apksigner → zipalign → metadata → SHA-256 → artifact → phone install → phone QA.

## Sibling-project baseline

YTM and Renault are read-only engineering references while Music Graph is active.

Useful lessons may be adapted and documented locally.

## Termux baseline

- checkout: `$HOME/faric-music-graph`;
- shared root: `/storage/emulated/0/Documents/FARIC-Music-Graph/`;
- project remains isolated from Renault/YTM;
- Widget owns one top-level Music Graph entry.

## Workflow baseline

- repository/live Git wins over old chat memory;
- `CURRENT_HANDOFF.md` + `ACTIVE_PLAN.md` restore the session;
- release skeleton + diagrams precede major feature code;
- every verified step updates the live plan;
- historical evidence remains historical;
- CI/browser/phone/APK/remote-mutation PASS are distinct.

Update this ledger when accepted product, architecture, workflow, data, APK or QA contracts change.
