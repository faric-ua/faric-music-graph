# Termux Workflow

## Repository

Live Git checkout:

`$HOME/faric-music-graph`

Shared exports/snapshots/builds:

`/storage/emulated/0/Documents/FARIC-Music-Graph/`

## Clone

```bash
git clone --branch main --single-branch git@github.com:faric-ua/faric-music-graph.git "$HOME/faric-music-graph"
cd "$HOME/faric-music-graph"
```

## Install menu aliases

```bash
bash tools/install_termux_aliases.sh
source ~/.bashrc 2>/dev/null || true
source ~/.zshrc 2>/dev/null || true
```

Aliases:
- `music-code`
- `music-menu`
- `music-graph`
- `music-status`
- `music-stop`

## Safe update

The project menu refuses automatic pull when the tree is dirty.

Manual:

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
