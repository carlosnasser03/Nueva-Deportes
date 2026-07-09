#!/usr/bin/env bash
MSG="$1"
BRANCH="${2:-main}"

if [ -z "$MSG" ]; then
  echo "Usage: ./scripts/commit-and-push.sh \"commit message\" [branch]"
  exit 1
fi

echo "Staging changes..."
git add .

echo "Committing: $MSG"
git commit -m "$MSG"

echo "Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

if [ $? -ne 0 ]; then
  echo "Push failed. Check remote and authentication." >&2
  exit 1
fi

echo "Done."