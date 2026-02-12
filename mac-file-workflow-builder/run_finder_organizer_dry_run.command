#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT="$ROOT_DIR/organize_finder.py"
LOG="$HOME/Library/Logs/finder-organizer-dry-run.log"

mkdir -p "$HOME/Library/Logs"

echo "[$(date)] Dry run Finder Organizer" >> "$LOG"
/usr/bin/python3 "$SCRIPT" --dry-run >> "$LOG" 2>&1

echo "Dry run complete. Review: $LOG"
/usr/bin/open "$LOG"
