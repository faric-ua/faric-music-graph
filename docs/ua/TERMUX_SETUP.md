# FARIC Music Graph — Termux setup

Це канонічна коротка інструкція для першого встановлення і щоденної роботи.

## 1. Ізоляція проєкту

Music Graph — окремий проєкт.

Git checkout:
```text
$HOME/faric-music-graph
```

Shared data:
```text
/storage/emulated/0/Documents/FARIC-Music-Graph/
```

Він не використовує Git worktree Renault або YTM і має власні:
- repository;
- aliases `music-*`;
- Termux menu;
- local server PID/log;
- data/snapshots/exports/backups.

## 2. Перше клонування

```bash
set -euo pipefail

REPO="$HOME/faric-music-graph"
SHARED="/storage/emulated/0/Documents/FARIC-Music-Graph"

if [ -d "$REPO/.git" ]; then
  cd "$REPO"
  git status --short --branch
  git fetch origin main
  git switch main
  git pull --ff-only origin main
elif [ -e "$REPO" ]; then
  echo "STOP: $REPO існує, але це не Git repository."
  exit 1
else
  git clone --branch main --single-branch     git@github.com:faric-ua/faric-music-graph.git     "$REPO"
  cd "$REPO"
fi

mkdir -p   "$SHARED/data"   "$SHARED/snapshots"   "$SHARED/exports"   "$SHARED/artifacts"   "$SHARED/backups"

bash tools/install_termux_aliases.sh
bash tools/install_termux_widget.sh

source "$HOME/.bashrc" 2>/dev/null || true
source "$HOME/.zshrc" 2>/dev/null || true

python -B scripts/validate_repo.py
git status --short --branch
git rev-parse HEAD
```

Якщо checkout уже існує і має локальні зміни — не робити автоматичний pull, спочатку розібрати зміни.

## 3. Команди

```text
music-code    — перейти в repository
music-menu    — відкрити меню
music-graph   — запустити local graph server
music-status  — Git/server status
music-stop    — зупинити server
```

## 4. Termux:Widget

Shortcut installer створює один top-level файл:

```text
$HOME/.shortcuts/Music Graph
```

Він відкриває:

```text
scripts/termux-menu.sh
```

Installer **не видаляє і не переписує** Renault/YTM shortcuts.

Після:

```bash
music-code
bash tools/install_termux_widget.sh
```

натиснути **Refresh** у Termux:Widget.

### Чому кнопки могло не бути

`tools/install_termux_aliases.sh` створює тільки shell aliases. Alias `music-menu` сам по собі не створює кнопку у Termux:Widget.

Для Widget потрібен окремий executable shortcut у `$HOME/.shortcuts/`. Тепер його створює `tools/install_termux_widget.sh`.

Якщо самого Termux:Widget на домашньому екрані немає — спочатку має бути встановлений Termux:Widget і доданий Android widget. Якщо Renault/YTM уже видно у віджеті, достатньо запустити installer вище і Refresh.

## 5. Щоденне оновлення

Найпростіше:

```bash
music-menu
```

і вибрати:

```text
1 — Оновити проєкт з GitHub
```

Автоматичний update дозволений лише при чистому Git tree і використовує fast-forward pull.

## 6. Перед змінами/commit

```bash
music-code
git status --short --branch
python -B scripts/validate_repo.py
git diff --check
```

Stage тільки конкретні файли, які належать поточній зміні. Routine `git add -A` не використовувати.

Після staging:

```bash
git diff --cached --name-status
git diff --cached --stat
git diff --cached --check
git diff --cached --diff-filter=D --name-status
```

Unexpected deletion = STOP.

## 7. Основні шляхи

```text
$HOME/faric-music-graph/
  app/
  data/
  docs/
  scripts/
  tools/

/storage/emulated/0/Documents/FARIC-Music-Graph/
  data/
  snapshots/
  exports/
  artifacts/
  backups/
```
