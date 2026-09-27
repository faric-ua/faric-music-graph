# Phone / Termux workflow

## Live checkout

Тримати Git у private Termux storage:

`$HOME/faric-music-graph`

Shared storage використовувати для:
- exported channel snapshots;
- generated catalog packages;
- backups;
- future APK/PWA artifacts.

Stable shared root:

`/storage/emulated/0/Documents/FARIC-Music-Graph/`

## First setup

```bash
pkg update
pkg install git python openssh
termux-setup-storage

git clone --branch main --single-branch git@github.com:faric-ua/faric-music-graph.git "$HOME/faric-music-graph"
cd "$HOME/faric-music-graph"

bash tools/install_termux_aliases.sh
source ~/.bashrc 2>/dev/null || true
```

## Daily entry

```bash
music-menu
```

## Rules

- update only with clean tree;
- pull only fast-forward;
- no routine `git add -A`;
- assistant supplies exact staging/commit block for real changes;
- run `python -B scripts/validate_repo.py` before commit;
- real phone/browser test results are documented under the current release;
- future OAuth tokens/secrets remain outside Git.

## Termux:Widget

Later add one top-level launcher named `Music Graph` that opens `music-menu`. Do not create many widget shortcuts for internal actions; keep the nested project menu as the owner.
