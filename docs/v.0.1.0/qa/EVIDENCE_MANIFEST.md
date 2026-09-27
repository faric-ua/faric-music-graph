# Evidence Manifest

## 2026-09-28 — Termux setup

Source SHA:

`2cc968cc0fece74de6f07872bbd7f0bf9975d90c`

Evidence type: user-provided Termux console output.

Proves:
- local HEAD matches the expected main commit;
- local branch is `main` and aligned with `origin/main`;
- Music Graph repository path is `$HOME/faric-music-graph`;
- shared root is `/storage/emulated/0/Documents/FARIC-Music-Graph`;
- executable `Music Graph` Widget shortcut exists;
- `Phone Diagnostics`, `Renault`, and `YTM Importer` shortcut files remain present.

Privacy:
- no account token, secret, channel credential, or private API key was included in the evidence.

## 2026-09-28 — Termux:Widget smoke

Source under test:

`2cc968cc0fece74de6f07872bbd7f0bf9975d90c`

Evidence type: user confirmation.

User result:

`Widget +, menu +`

Proves:
- Android Termux:Widget refresh exposed `Music Graph`;
- tapping the shortcut opened the FARIC Music Graph project menu;
- the installed shortcut points to a working project menu path.

Does not prove:
- graph local server behavior;
- browser rendering/interactions;
- portrait/landscape behavior;
- YouTube integration.


## 2026-09-28 — Mobile graph interaction finding

Evidence type: direct user phone feedback.

Reported:
- current graph control on phone is poor;
- no usable zoom is available.

Proves:
- current mobile interaction is not accepted;
- graph UX requires another prototype/QA cycle.

Does not prove:
- performance of the future full catalog;
- suitability of spherical/3D layout;
- final graph engine choice.
