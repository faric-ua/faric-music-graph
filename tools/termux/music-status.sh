#!/data/data/com.termux/files/usr/bin/bash
set -u
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"
PIDFILE="$HOME/.faric-music-graph-server.pid"
cd "$ROOT" || exit 1
echo "Repository:"
pwd
echo
git status --short --branch
echo
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "Graph server: RUNNING (PID $(cat "$PIDFILE"))"
else
  echo "Graph server: STOPPED"
fi
