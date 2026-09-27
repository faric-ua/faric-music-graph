#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
PORT="${MUSIC_GRAPH_PORT:-8787}"
PIDFILE="$HOME/.faric-music-graph-server.pid"
LOGFILE="$HOME/.faric-music-graph-server.log"

if [ ! -f "$ROOT/app/index.html" ]; then
  echo "app/index.html ще не доданий у поточний checkout."
  exit 1
fi

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Server already running: http://127.0.0.1:$PORT"
  exit 0
fi

cd "$ROOT"
nohup python -m http.server "$PORT" --directory app >"$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
sleep 1
echo "Music Graph: http://127.0.0.1:$PORT"
