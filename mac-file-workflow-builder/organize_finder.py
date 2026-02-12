#!/usr/bin/env python3
"""Finder Organizer: rules-based file arrangement for macOS folders.

Default behavior (dry-run safe):
- Scan Downloads and Desktop.
- Move code-related files/folders into ~/Workspace/Code.
- Move documents/media/archives/apps into ~/Workspace/Organized/<Category>.
- Record undo operations in a JSONL log.

Run examples:
  python3 organize_finder.py --dry-run
  python3 organize_finder.py
  python3 organize_finder.py --sources ~/Downloads ~/Desktop ~/Documents
  python3 organize_finder.py --undo --undo-log ~/.finder_organizer_undo.jsonl
"""

from __future__ import annotations

import argparse
import json
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Optional

CODE_EXTENSIONS = {
    ".py", ".ipynb", ".js", ".ts", ".tsx", ".jsx", ".java", ".kt", ".swift", ".go", ".rs",
    ".c", ".cc", ".cpp", ".h", ".hpp", ".cs", ".rb", ".php", ".scala", ".r", ".sql",
    ".html", ".css", ".scss", ".json", ".yaml", ".yml", ".toml", ".md", ".sh", ".zsh",
}

DOC_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".rtf"}
MEDIA_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".heic", ".svg", ".mp4", ".mov", ".mkv", ".mp3", ".wav",
}
ARCHIVE_EXTENSIONS = {".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".rar"}
APP_EXTENSIONS = {".dmg", ".pkg", ".app"}

PROJECT_MARKERS = {
    ".git", "package.json", "pyproject.toml", "requirements.txt", "Pipfile", "Cargo.toml", "go.mod", "pom.xml",
    "build.gradle", "Makefile", "Dockerfile",
}


@dataclass
class MoveAction:
    src: Path
    dst: Path


class Organizer:
    def __init__(self, code_root: Path, organized_root: Path, dry_run: bool, undo_log: Path):
        self.code_root = code_root.expanduser()
        self.organized_root = organized_root.expanduser()
        self.dry_run = dry_run
        self.undo_log = undo_log.expanduser()
        self.actions: list[MoveAction] = []

    def classify(self, item: Path) -> Optional[Path]:
        if item.name.startswith('.'):
            return None

        # Project folders (or source folders with project markers) -> Code root.
        if item.is_dir():
            marker_names = {p.name for p in item.iterdir()} if item.exists() else set()
            if marker_names.intersection(PROJECT_MARKERS):
                return self.code_root
            return None

        ext = item.suffix.lower()
        if ext in CODE_EXTENSIONS:
            return self.code_root
        if ext in DOC_EXTENSIONS:
            return self.organized_root / "Documents"
        if ext in MEDIA_EXTENSIONS:
            return self.organized_root / "Media"
        if ext in ARCHIVE_EXTENSIONS:
            return self.organized_root / "Archives"
        if ext in APP_EXTENSIONS:
            return self.organized_root / "Apps"
        return self.organized_root / "Misc"

    def unique_destination(self, dst_dir: Path, name: str) -> Path:
        dst = dst_dir / name
        if not dst.exists():
            return dst
        stem, suffix = Path(name).stem, Path(name).suffix
        idx = 1
        while True:
            candidate = dst_dir / f"{stem}_{idx}{suffix}"
            if not candidate.exists():
                return candidate
            idx += 1

    def stage(self, item: Path, target_root: Path) -> None:
        destination = self.unique_destination(target_root, item.name)
        self.actions.append(MoveAction(src=item, dst=destination))

    def execute(self) -> None:
        if not self.actions:
            print("No matching files found. Nothing to organize.")
            return

        if not self.dry_run:
            self.undo_log.parent.mkdir(parents=True, exist_ok=True)

        for action in self.actions:
            print(f"MOVE: {action.src} -> {action.dst}")
            if self.dry_run:
                continue
            action.dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(action.src), str(action.dst))
            with self.undo_log.open("a", encoding="utf-8") as f:
                f.write(json.dumps({"moved_to": str(action.dst), "from": str(action.src)}) + "\n")

        print(f"Completed {len(self.actions)} moves." + (" (dry run)" if self.dry_run else ""))


def collect_items(sources: Iterable[Path]) -> list[Path]:
    items: list[Path] = []
    for source in sources:
        src = source.expanduser()
        if not src.exists() or not src.is_dir():
            continue
        for item in src.iterdir():
            if item.name.startswith('.'):
                continue
            items.append(item)
    return items


def undo_from_log(log_path: Path, dry_run: bool = False) -> None:
    path = log_path.expanduser()
    if not path.exists():
        print(f"Undo log not found: {path}")
        return

    entries = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not entries:
        print("Undo log is empty.")
        return

    for row in reversed(entries):
        moved_to = Path(row["moved_to"]).expanduser()
        original = Path(row["from"]).expanduser()
        print(f"UNDO: {moved_to} -> {original}")
        if dry_run:
            continue
        if not moved_to.exists():
            continue
        original.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(moved_to), str(original))

    if not dry_run:
        path.unlink(missing_ok=True)
    print(f"Undo processed for {len(entries)} operations." + (" (dry run)" if dry_run else ""))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Arrange Finder-facing folders with practical rules.")
    parser.add_argument("--sources", nargs="*", default=["~/Downloads", "~/Desktop"], help="Source folders to scan")
    parser.add_argument("--code-root", default="~/Workspace/Code", help="Target folder for code-related files")
    parser.add_argument(
        "--organized-root",
        default="~/Workspace/Organized",
        help="Base folder for non-code categories (Documents, Media, Archives, Apps, Misc)",
    )
    parser.add_argument("--undo-log", default="~/.finder_organizer_undo.jsonl", help="Path to undo log")
    parser.add_argument("--dry-run", action="store_true", help="Preview moves without changing files")
    parser.add_argument("--undo", action="store_true", help="Undo moves from undo log")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.undo:
        undo_from_log(Path(args.undo_log), dry_run=args.dry_run)
        return 0

    organizer = Organizer(
        code_root=Path(args.code_root),
        organized_root=Path(args.organized_root),
        dry_run=args.dry_run,
        undo_log=Path(args.undo_log),
    )

    items = collect_items(Path(s) for s in args.sources)
    for item in items:
        try:
            target = organizer.classify(item)
        except PermissionError:
            print(f"SKIP (permission): {item}")
            continue

        if target is None:
            continue
        organizer.stage(item, target)

    print(f"Run at: {datetime.now().isoformat(timespec='seconds')}")
    organizer.execute()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
