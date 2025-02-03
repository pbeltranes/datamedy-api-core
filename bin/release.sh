#!/bin/bash

# Variables
DEVELOP_BRANCH="develop"
MASTER_BRANCH="master"
RELEASE_BRANCH="$1"

if [ -z "$RELEASE_BRANCH" ]; then
  echo "Uso: $0 <nombre-release-branch>"
  exit 1
fi

# Crear la branch de release basada en develop
git checkout $DEVELOP_BRANCH
git pull origin $DEVELOP_BRANCH
git checkout -b $RELEASE_BRANCH

# Subir la branch de release
git push origin $RELEASE_BRANCH

# Obtener los commits presentes en develop pero no en master
COMMITS_NOT_IN_MASTER=$(git log $MASTER_BRANCH..$DEVELOP_BRANCH --pretty=format:"%H")

# Obtener los PRs cerrados en develop
PR_LIST=$(gh pr list --state closed --base $DEVELOP_BRANCH --json number,title,author,mergeCommit,url --jq '.[] | select(.mergeCommit != null)' | jq -c '.')

# Crear el mensaje para el PR
PR_MESSAGE="Release $RELEASE_BRANCH

Este PR incluye los siguientes cambios mergeados en develop pero no presentes en master:

"

PR_COUNT=0

while IFS= read -r pr; do
  PR_NUMBER=$(echo "$pr" | jq -r '.number')
  PR_TITLE=$(echo "$pr" | jq -r '.title')
  PR_AUTHOR=$(echo "$pr" | jq -r '.author.login')
  PR_URL=$(echo "$pr" | jq -r '.url')
  PR_MERGE_COMMIT=$(echo "$pr" | jq -r '.mergeCommit.oid')

  # Verificar si el commit de merge del PR está en develop pero NO en master
  if echo "$COMMITS_NOT_IN_MASTER" | grep -q "$PR_MERGE_COMMIT"; then
    PR_MESSAGE+=" - #$PR_NUMBER: $PR_TITLE autor @$PR_AUTHOR ($PR_URL)
    "
    PR_COUNT=$((PR_COUNT + 1))
  fi
done <<< "$PR_LIST"

# Verificar si hay PRs para incluir
if [ "$PR_COUNT" -eq 0 ]; then
  echo "✅ No hay PRs pendientes para release. Todo está sincronizado."
  exit 0
fi

# Crear el PR hacia master
gh pr create --base $MASTER_BRANCH --head $RELEASE_BRANCH --title "Release $RELEASE_BRANCH" --body "$PR_MESSAGE"

echo "✅ Pull Request creado hacia $MASTER_BRANCH con los PRs correctos."