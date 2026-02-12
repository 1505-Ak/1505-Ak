# Mac File Workflow Builder

A practical setup to make Finder feel "organized by default".

> You asked for real Finder edits (not just recommendations). This project now includes direct-run scripts that move files from Finder folders immediately.

## What actually edits Finder files

These scripts operate on your real folders:
- `~/Downloads`
- `~/Desktop`

And move items into:
- `~/Workspace/Code` for code/project files.
- `~/Workspace/Organized/Documents`
- `~/Workspace/Organized/Media`
- `~/Workspace/Organized/Archives`
- `~/Workspace/Organized/Apps`
- `~/Workspace/Organized/Misc`

### One-click from Finder (double-click)

- `run_finder_organizer_dry_run.command` → preview what would move (safe).
- `run_finder_organizer.command` → performs actual moves.

Both scripts can be double-clicked in Finder.

## Core organizer logic

`organize_finder.py` handles:
- extension-based sorting,
- project-folder detection (`.git`, `package.json`, `pyproject.toml`, etc.),
- collision-safe renaming,
- undo log for rollback.

### Code-related logic
- Source files (`.py`, `.js`, `.ts`, `.swift`, `.java`, `.rs`, etc.) go to `~/Workspace/Code`.
- Folders with project markers are treated as code projects and moved to `~/Workspace/Code`.

## Run organizer manually

Dry run:

```bash
cd mac-file-workflow-builder
python3 organize_finder.py --dry-run
```

Real execution:

```bash
python3 organize_finder.py
```

Custom sources:

```bash
python3 organize_finder.py --sources ~/Downloads ~/Desktop ~/Documents
```

## Undo support

Moves are logged to `~/.finder_organizer_undo.jsonl`.

Preview undo:

```bash
python3 organize_finder.py --undo --dry-run
```

Apply undo:

```bash
python3 organize_finder.py --undo
```

## Auto-run with LaunchAgent (macOS)

Install + enable (runs every 30 minutes and at login):

```bash
./install_launch_agent.sh
```

Disable:

```bash
launchctl unload ~/Library/LaunchAgents/com.finder.organizer.plist
```

## Optional recommendation UI

You can still use the local UI (`index.html`) for strategy selection, but actual file moving is done by the scripts above.

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
