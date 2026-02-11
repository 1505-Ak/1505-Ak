# Mac File Workflow Builder

This is a standalone static app you can publish as its own GitHub repository.

## What it does

- Helps users choose one of two paths:
  - Replace Finder with a power-user file manager stack.
  - Keep Finder and automate/organize files in the background.
- Uses weighted preferences (keyboard, automation, cloud, lightweight) to rank and recommend tools.
- Returns a top-3 recommendation set.

## Run locally

```bash
cd mac-file-workflow-builder
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish as a new GitHub repository

From inside `mac-file-workflow-builder`:

```bash
git init
git add .
git commit -m "Initial commit: Mac File Workflow Builder"
git branch -M main
git remote add origin git@github.com:<your-username>/mac-file-workflow-builder.git
git push -u origin main
```
