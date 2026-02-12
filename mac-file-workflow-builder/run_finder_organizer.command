#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT="$ROOT_DIR/organize_finder.py"
LOG="$HOME/Library/Logs/finder-organizer-manual.log"

mkdir -p "$HOME/Library/Logs"

echo "[$(date)] Running Finder Organizer" >> "$LOG"
/usr/bin/python3 "$SCRIPT" >> "$LOG" 2>&1

/usr/bin/osascript <<'APPLESCRIPT'
display notification "Files organized from Desktop/Downloads" with title "Finder Organizer"
APPLESCRIPT

/usr/bin/open "$HOME/Workspace"
