#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$ROOT_DIR/organize_finder.py"
TEMPLATE="$ROOT_DIR/com.finder.organizer.plist"
TARGET="$HOME/Library/LaunchAgents/com.finder.organizer.plist"

if [[ ! -f "$SCRIPT_PATH" ]]; then
  echo "organize_finder.py not found at $SCRIPT_PATH"
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents"

sed \
  -e "s#__SCRIPT_PATH__#$SCRIPT_PATH#g" \
  -e "s#__HOME__#$HOME#g" \
  "$TEMPLATE" > "$TARGET"

launchctl unload "$TARGET" >/dev/null 2>&1 || true
launchctl load "$TARGET"

echo "Installed launch agent: $TARGET"
echo "It will run every 30 minutes and on login."
echo "Use 'launchctl unload $TARGET' to disable."
