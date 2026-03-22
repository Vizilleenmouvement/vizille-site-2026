#!/bin/zsh
# deploy.sh — push + rafraîchissement automatique Facebook OG
# Usage : ./deploy.sh "message de commit"

set -e
cd "$(dirname "$0")"

MSG="${1:-mise à jour}"

echo "📦 Commit et push..."
git add -A
git commit -m "$MSG" 2>/dev/null || echo "  (rien à committer)"
git pull --rebase --quiet
git push

echo "📘 Ping Facebook Sharing Debugger..."
curl -s -o /dev/null -w "  Facebook : HTTP %{http_code}\n" \
  "https://graph.facebook.com/?id=https%3A%2F%2Fvizilleenmouvement.fr&scrape=true"

echo "✅ Déployé : $MSG"
