#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SHORTCUT_DIR="$HOME/.shortcuts"
SHORTCUT="$SHORTCUT_DIR/Music Graph"

mkdir -p "$SHORTCUT_DIR"
chmod 700 "$SHORTCUT_DIR"

cat > "$SHORTCUT" <<EOF
#!/data/data/com.termux/files/usr/bin/bash
exec bash "$REPO/scripts/termux-menu.sh"
EOF

chmod 700 "$SHORTCUT"

echo "Termux:Widget shortcut installed:"
echo
echo "  Music Graph"
echo
echo "Existing Renault / YTM shortcuts were not changed."
echo "Press Refresh on the Termux:Widget."
