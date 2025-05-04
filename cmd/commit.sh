#!/bin/bash

# Usage: ./bump_version.sh "your commit message here"

if [ -z "$1" ]; then
  echo "Usage: $0 \"commit message\""
  exit 1
fi

COMMIT_MSG="$1"

# 1. Bump patch version
npm version patch --no-git-tag-version

# 2. Stage files
git add package.json package-lock.json
git add .

# 3. Commit with the provided message
git commit -m "$COMMIT_MSG"

# 4. Get current branch
CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 5. Ask where to push
echo "Push to current branch ($CUR_BRANCH)? Press enter to confirm, or type a branch name to push there:"
read TARGET_BRANCH

if [ -z "$TARGET_BRANCH" ]; then
  TARGET_BRANCH="$CUR_BRANCH"
fi

# 6. Push
git push origin "$TARGET_BRANCH"

echo "Version bumped, committed, and pushed to $TARGET_BRANCH."
