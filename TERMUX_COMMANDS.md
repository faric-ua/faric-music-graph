# Termux Workflow

Canonical full setup: `docs/ua/TERMUX_SETUP.md`.

## Repository

Live Git checkout:

`$HOME/faric-music-graph`

Shared exports/snapshots/builds:

`/storage/emulated/0/Documents/FARIC-Music-Graph/`

Music Graph is isolated from Renault and YTM: separate repository, aliases, menu, server state and shared-data root.

## First setup

```bash
git clone --branch main --single-branch   git@github.com:faric-ua/faric-music-graph.git   "$HOME/faric-music-graph"

cd "$HOME/faric-music-graph"

mkdir -p   /storage/emulated/0/Documents/FARIC-Music-Graph/{data,snapshots,exports,artifacts,backups}

bash tools/install_termux_aliases.sh
bash tools/install_termux_widget.sh

source "$HOME/.bashrc" 2>/dev/null || true
source "$HOME/.zshrc" 2>/dev/null || true

python -B scripts/validate_repo.py
git status --short --branch
```

## Commands

- `music-code` — repository;
- `music-menu` — project menu;
- `music-graph` — local graph server;
- `music-status` — Git/server status;
- `music-stop` — stop local graph server.

## Termux:Widget

Aliases and Widget shortcuts are different things.

`tools/install_termux_aliases.sh` configures shell commands.

`tools/install_termux_widget.sh` creates:

`$HOME/.shortcuts/Music Graph`

which opens `scripts/termux-menu.sh`.

After installing/updating the shortcut, press **Refresh** in Termux:Widget.

The Music Graph installer does not modify Renault/YTM shortcuts.

## Safe update

The menu refuses automatic pull if the working tree is dirty.

Manual equivalent:

```bash
music-code
git status --short
git fetch origin main
git pull --ff-only origin main
```

## Commit discipline

Use exact-path staging supplied by the assistant:

```bash
git add path/to/file1 path/to/file2
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached --diff-filter=D --name-status
```

Do not make `git add -A` the default.
