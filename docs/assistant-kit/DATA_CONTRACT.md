# Data Contract

## Principle

The canonical dataset is a graph. Hierarchies such as
`year → genre → artist → album → track`
are generated views.

## Stable IDs

Canonical IDs:
- `artist:...`
- `release:...`
- `track:...`
- `version:...`
- `youtube:video:<videoId>`
- `youtube:playlist:<playlistId>`

External IDs remain opaque values.

## Track vs version

Track = project-level musical work/title identity.

TrackVersion = a specific original/remix/edit/live/demo/remaster/recording variant.

A remix should normally be a TrackVersion linked by `REMIX_OF`, not an unrelated title-only duplicate.

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

## Provenance

Every disputed/imported value keeps source/provenance and verification state.

## Validation

Fail on:
- duplicate canonical IDs;
- dangling edges;
- missing versions referenced by releases;
- remix edge without target;
- duplicate external videoId mapped to incompatible canonical identities unless marked for review.

Warn on:
- missing year;
- unknown genre;
- title-only match;
- multiple candidate originals.

Never discard original source title/artist text. Store normalized search fields separately.
