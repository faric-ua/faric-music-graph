#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SHELL_RC="$HOME/.bashrc"
case "$(basename "$SHELL")" in
  zsh) SHELL_RC="$HOME/.zshrc" ;;
esac

touch "$SHELL_RC"
START="# >>> FARIC Music Graph >>>"
END="# <<< FARIC Music Graph <<<"
TMP="$(mktemp)"
awk -v s="$START" -v e="$END" '
  $0==s {skip=1; next}
  $0==e {skip=0; next}
  !skip {print}
' "$SHELL_RC" > "$TMP"

cat >> "$TMP" <<EOF
$START
alias music-code='cd "$ROOT"'
alias music-menu='bash "$ROOT/scripts/termux-menu.sh"'
alias music-graph='bash "$ROOT/tools/termux/music-serve.sh"'
alias music-status='bash "$ROOT/tools/termux/music-status.sh"'
alias music-stop='bash "$ROOT/tools/termux/music-stop.sh"'
$END
EOF

mv "$TMP" "$SHELL_RC"
echo "Aliases installed in $SHELL_RC"
