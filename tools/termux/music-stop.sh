#!/data/data/com.termux/files/usr/bin/bash
set -u
PIDFILE="$HOME/.faric-music-graph-server.pid"
if [ ! -f "$PIDFILE" ]; then
  echo "Server PID not found."
  exit 0
fi
PID="$(cat "$PIDFILE")"
if kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  echo "Stopped PID $PID"
else
  echo "Process already stopped."
fi
rm -f "$PIDFILE"
