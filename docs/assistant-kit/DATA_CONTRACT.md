# Data Contract

Updated: 2026-09-28

## Principle

The canonical dataset is a graph.

Hierarchies such as:
`Account → Year → Genre → Artist → Release → Track`

are generated navigation projections, not the only stored truth.

## Core entities

- Account;
- Artist;
- Release;
- Track;
- TrackVersion;
- Genre;
- Year;
- YouTubeItem;
- Playlist;
- Snapshot;
- Provenance;
- AuditEvent.

## Account

Provider-neutral Account fields should include:
- `id`;
- `provider`;
- `externalAccountId` / channel ID when available;
- `displayName`;
- `handle`;
- `publicUrl`;
- `status`;
- `lastInventoryAt`;
- `provenance`.

Authentication tokens/secrets are not canonical graph data and never enter Git.

Possible edges:
- ACCOUNT_HAS_PLAYLIST;
- ACCOUNT_HAS_ITEM;
- ACCOUNT_MATCHES_TRACK_VERSION;
- RELATED_ACCOUNT when explicitly supported.

## Stable IDs

Canonical examples:
- `account:...`;
- `artist:...`;
- `release:...`;
- `track:...`;
- `version:...`;
- `youtube:video:<videoId>`;
- `youtube:playlist:<playlistId>`.

External IDs remain opaque.

## Track vs TrackVersion

Track = project-level musical work/title identity.

TrackVersion = a specific original/remix/edit/live/demo/remaster/recording variant.

A remix normally links by `REMIX_OF`, not as an unrelated title-only duplicate.

## Release

Fields should include:
- id;
- artistIds;
- title;
- year;
- type;
- ordered trackVersionIds;
- provenance;
- external IDs;
- flags.

## World projection metadata

The canonical graph may expose projection helpers:
- navigation role;
- available child dimensions;
- contextual filter facets;
- counts;
- relationship summaries.

These are derived metadata and must not replace canonical IDs/edges.

## Track detail aggregation

Track/TrackVersion details may aggregate:
- all releases;
- all artists;
- years/genres;
- version relationships;
- account matches;
- playlists;
- exact YouTube/YTM IDs + URLs;
- duration/availability;
- provenance;
- verification state;
- duplicate/mismatch flags.

Unknown values remain unknown.

## Provenance

Every disputed/imported value keeps source/provenance and verification state.

## Validation

Fail on:
- duplicate canonical IDs;
- dangling edges;
- missing versions referenced by releases;
- remix edge without target;
- duplicate external videoId mapped to incompatible identities unless explicitly marked review;
- Account edge to missing entity.

Warn on:
- missing year;
- unknown genre;
- title-only match;
- multiple candidate originals;
- account/channel identity not yet verified.

Never discard original source title/artist text. Store normalized search fields separately.
