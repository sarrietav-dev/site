#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_SRC="$HOME/Documents/Writing/blog/"
POSTS_DST="$SITE_ROOT/_posts/"

rsync -av --delete "$BLOG_SRC" "$POSTS_DST"

cd "$SITE_ROOT"
git add -A
git diff --cached --quiet && exit 0   # nothing changed, skip commit
git commit -m "blog: sync $(date +%Y-%m-%d\ %H:%M)"
git push
