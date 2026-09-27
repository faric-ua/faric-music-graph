# Backlog

## P0 — Foundation
- [ ] Merge v0.1.0 bootstrap.
- [ ] Import full The Prodigy + Linkin Park catalog.
- [ ] Validate IDs, duplicate relationships, counts and remix→original edges.
- [ ] Establish accepted mobile graph interaction.
- [ ] Add snapshot backup/restore for catalog data.

## P1 — Channel inventory
- [ ] Resolve stable channel identity for `@faric_ua`.
- [ ] Read playlists/videos/items without mutation.
- [ ] Store timestamped channel snapshot.
- [ ] Match items to canonical tracks/versions.
- [ ] Classify MATCHED / MISSING / DUPLICATE / VARIANT_MISMATCH / NEEDS_REVIEW / UNAVAILABLE.
- [ ] Add channel-state graph filters.

## P2 — Search and graph UX
- [ ] text search;
- [ ] year range;
- [ ] genre;
- [ ] artist/release;
- [ ] release type;
- [ ] remix/live/demo/original;
- [ ] Best Of / Exclusive;
- [ ] isolate branch;
- [ ] saved views;
- [ ] mobile inspector/breadcrumbs.

## P3 — YouTube write planning

No direct write yet.

- [ ] dry-run plan;
- [ ] quota estimate;
- [ ] exact target identity;
- [ ] duplicate guard;
- [ ] per-item proposed action;
- [ ] explicit confirmation;
- [ ] idempotency;
- [ ] audit trail;
- [ ] recovery model where possible.

## P4 — Packaging

After web/PWA acceptance:
- [ ] evaluate Capacitor;
- [ ] use native Kotlin/Compose only for a concrete requirement;
- [ ] signed build pipeline;
- [ ] real-phone QA.
