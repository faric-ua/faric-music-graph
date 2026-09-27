#!/data/data/com.termux/files/usr/bin/bash
set -u
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PORT="${MUSIC_GRAPH_PORT:-8787}"

pause_menu() {
  echo
  printf "Натисни Enter, щоб повернутися в меню..."
  read -r _
}

update_project() {
  clear
  cd "$ROOT" || exit 1
  echo "Оновлення FARIC Music Graph"
  echo
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Є локальні зміни. git pull скасовано."
    echo
    git status --short
    pause_menu
    return
  fi
  git fetch origin main && git pull --ff-only origin main
  pause_menu
}

serve_graph() { clear; bash "$ROOT/tools/termux/music-serve.sh"; pause_menu; }
open_graph() {
  clear
  local url="http://127.0.0.1:$PORT"
  echo "$url"
  command -v termux-open-url >/dev/null 2>&1 && termux-open-url "$url"
  pause_menu
}
validate_project() {
  clear
  cd "$ROOT" || exit 1
  python -B scripts/validate_repo.py
  echo
  git diff --check
  pause_menu
}
show_status() { clear; bash "$ROOT/tools/termux/music-status.sh"; pause_menu; }
stop_graph() { clear; bash "$ROOT/tools/termux/music-stop.sh"; pause_menu; }
show_paths() {
  clear
  echo "Код:"
  echo "  $ROOT"
  echo
  echo "Shared data/builds:"
  echo "  /storage/emulated/0/Documents/FARIC-Music-Graph"
  pause_menu
}

while true; do
  clear
  echo "========================================"
  echo "       FARIC Music Graph Menu"
  echo "========================================"
  echo
  echo "1 — Оновити проєкт з GitHub"
  echo "2 — Запустити Music Graph"
  echo "3 — Відкрити Music Graph у браузері"
  echo "4 — Валідація проєкту"
  echo "5 — Git / server status"
  echo "6 — Зупинити Music Graph server"
  echo "7 — Показати основні папки"
  echo "0 — Вийти"
  echo
  printf "Вибір: "
  read -r choice
  case "$choice" in
    1) update_project ;;
    2) serve_graph ;;
    3) open_graph ;;
    4) validate_project ;;
    5) show_status ;;
    6) stop_graph ;;
    7) show_paths ;;
    0) clear; exit 0 ;;
    *) echo; echo "Невідомий пункт: $choice"; sleep 1 ;;
  esac
done
