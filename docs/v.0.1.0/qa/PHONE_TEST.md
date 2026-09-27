# v0.1.0 Phone Test

Status: PARTIAL.

## A. Termux setup — PASS

Verified on 2026-09-28 for source:

`2cc968cc0fece74de6f07872bbd7f0bf9975d90c`

Confirmed:
- checkout exists at `$HOME/faric-music-graph`;
- shared root exists at `/storage/emulated/0/Documents/FARIC-Music-Graph`;
- Git state is clean and aligned: `## main...origin/main`;
- repository HEAD matches expected source;
- `$HOME/.shortcuts/Music Graph` exists and is executable;
- existing `Phone Diagnostics`, `Renault`, and `YTM Importer` shortcuts remain present.

## B. Termux:Widget UI — PENDING

Still to confirm:
1. press Refresh in Termux:Widget;
2. verify `Music Graph` is visible;
3. tap `Music Graph`;
4. verify `scripts/termux-menu.sh` opens the Music Graph menu.

## C. Graph browser smoke — NOT RUN

Planned:
1. open graph through Termux local server;
2. portrait interaction;
3. landscape interaction;
4. zoom/pan/select;
5. isolate artist/release;
6. refresh/reopen state smoke;
7. verify no YouTube write controls exist.
