"""Migrate generated Hexo HTML posts into AstroPaper Markdown files."""

from __future__ import annotations

import html
import re
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "legacy-hexo-static"
TARGET_ROOT = ROOT / "src" / "content" / "posts"


MONTHS = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
}


def clean_text(value: str) -> str:
    """Return plain text from an HTML fragment."""
    value = re.sub(r"<script[\s\S]*?</script>", "", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", "", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    return re.sub(r"\s+", " ", value).strip()


def escape_yaml(value: str) -> str:
    """Escape a value for double-quoted YAML."""
    return value.replace("\\", "\\\\").replace('"', '\\"')


def parse_pub_datetime(page: str) -> datetime:
    """Parse Hexo's English post date format."""
    match = re.search(
        r"Date:\s*<a[^>]*>\s*([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})&nbsp;&nbsp;(\d{1,2}):(\d{2}):(\d{2})",
        page,
    )
    if not match:
        raise ValueError("Post date not found")

    month_name, day, year, hour, minute, second = match.groups()
    return datetime(
        int(year),
        MONTHS[month_name],
        int(day),
        int(hour),
        int(minute),
        int(second),
    )


def extract_content(page: str) -> str:
    """Extract the post content block from a generated Hexo page."""
    marker = '<div class="post-content">'
    start = page.find(marker)
    if start == -1:
        raise ValueError("Post content not found")

    start += len(marker)
    end_candidates = [
        page.find('<section class="post-copyright"', start),
        page.find('<section class="post-tags"', start),
        page.find('<div class="post-nav"', start),
    ]
    end_candidates = [index for index in end_candidates if index != -1]
    if not end_candidates:
        raise ValueError("Post content end not found")

    return page[start : min(end_candidates)].strip()


def extract_article(page: str) -> tuple[str, str, datetime, list[str]]:
    """Extract title, content, datetime, and tags from a Hexo post page."""
    title_match = re.search(r'<h1 class="post-title">([\s\S]*?)</h1>', page)
    if not title_match:
        raise ValueError("Post title not found")
    title = clean_text(title_match.group(1))

    content = extract_content(page)

    pub_datetime = parse_pub_datetime(page)

    tag_values = re.findall(
        r'<section class="post-tags">[\s\S]*?<a[^>]*>#\s*([\s\S]*?)</a>',
        page,
    )
    tags = [clean_text(tag) for tag in tag_values if clean_text(tag)]
    return title, content, pub_datetime, tags or ["blog"]


def write_post(source: Path) -> Path:
    """Write one AstroPaper post from one Hexo generated page."""
    page = source.read_text(encoding="utf-8")
    title, content, pub_datetime, tags = extract_article(page)

    relative = source.relative_to(SOURCE_ROOT)
    target = TARGET_ROOT / relative.parent / f"{relative.parent.name}.md"
    target.parent.mkdir(parents=True, exist_ok=True)

    description = clean_text(content)[:150] or title
    tag_lines = "\n".join(f'  - "{escape_yaml(tag)}"' for tag in tags)
    markdown = f"""---
title: "{escape_yaml(title)}"
pubDatetime: {pub_datetime.isoformat()}+08:00
draft: false
featured: false
tags:
{tag_lines}
description: "{escape_yaml(description)}"
---

{content}
"""

    target.write_text(markdown, encoding="utf-8")
    return target


def main() -> None:
    """Run the migration."""
    migrated = []
    for source in sorted(SOURCE_ROOT.glob("2025/**/index.html")):
        try:
            migrated.append(write_post(source))
        except ValueError as exc:
            raise ValueError(f"{source}: {exc}") from exc

    print(f"Migrated {len(migrated)} posts:")
    for path in migrated:
        print(f"- {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
