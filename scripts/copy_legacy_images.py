"""Copy legacy Hexo post images into Astro's public directory."""

from __future__ import annotations

import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "legacy-hexo-static"
PUBLIC_ROOT = ROOT / "public"
IMAGE_SUFFIXES = {".gif", ".jpeg", ".jpg", ".png", ".webp"}


def main() -> None:
    """Copy legacy post images while preserving their public paths."""
    copied = []
    for source in sorted((SOURCE_ROOT / "2025").rglob("*")):
        if not source.is_file() or source.suffix.lower() not in IMAGE_SUFFIXES:
            continue

        target = PUBLIC_ROOT / source.relative_to(SOURCE_ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        copied.append(target)

    print(f"Copied {len(copied)} legacy images.")


if __name__ == "__main__":
    main()
