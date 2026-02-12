# Mac File Workflow Builder

A practical setup to make Finder feel "organized by default".

This project now includes:
1. A small recommendation UI (`index.html`) for choosing your strategy.
2. A real automation script (`organize_finder.py`) to arrange files with sensible rules.

## What gets organized

By default, the organizer scans:
- `~/Downloads`
- `~/Desktop`

And moves content to:
- `~/Workspace/Code` for code/project files.
- `~/Workspace/Organized/Documents`
- `~/Workspace/Organized/Media`
- `~/Workspace/Organized/Archives`
- `~/Workspace/Organized/Apps`
- `~/Workspace/Organized/Misc`

### Code-related logic
- Source files (`.py`, `.js`, `.ts`, `.swift`, `.java`, `.rs`, etc.) are moved to `~/Workspace/Code`.
- Folders containing project markers (`.git`, `package.json`, `pyproject.toml`, `Cargo.toml`, etc.) are treated as code projects and moved to `~/Workspace/Code`.

## Run locally (UI)

```bash
cd mac-file-workflow-builder
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Run organizer manually

Start with a dry run:

```bash
cd mac-file-workflow-builder
python3 organize_finder.py --dry-run
```

Then execute for real:

```bash
python3 organize_finder.py
```

Custom folders example:

```bash
python3 organize_finder.py --sources ~/Downloads ~/Desktop ~/Documents
```

## Undo support

Every move is recorded in `~/.finder_organizer_undo.jsonl`.

Dry-run undo preview:

```bash
python3 organize_finder.py --undo --dry-run
```

Actual undo:

```bash
python3 organize_finder.py --undo
```

## Auto-run with LaunchAgent (macOS)

Install and enable (runs every 30 minutes + at login):

```bash
./install_launch_agent.sh
```

Disable:

```bash
launchctl unload ~/Library/LaunchAgents/com.finder.organizer.plist
```

## Publish as a new GitHub repository

From inside `mac-file-workflow-builder`:

```bash
git init
git add .
git commit -m "Initial commit: Finder organizer + workflow UI"
git branch -M main
git remote add origin git@github.com:<your-username>/mac-file-workflow-builder.git
git push -u origin main
```
