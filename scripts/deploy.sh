#!/usr/bin/env bash
#
# Deploy this demo to Cloudflare Pages: https://ff-search.pages.dev
#
#   npm run deploy            # production
#   npm run deploy:preview    # preview branch, production untouched
#
# Same pattern as the other FF portfolio demos (ff-meridian, ff-sunlight, ...):
# a DIRECT UPLOAD Pages project on Fakhrul's personal Cloudflare account, no git
# connection (wrangler ≥4.13x delegates "pages" to Workers unless --force), so pushing to GitHub deploys nothing — push and deploy are two acts.
# Credentials come from the FF brand repo's .env (CLOUDFLARE_API_TOKEN,
# CLOUDFLARE_ACCOUNT_ID). Every past deployment stays live at its own
# <id>.ff-search.pages.dev and can be promoted back from the dashboard.
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="ff-search"
BRANCH="${FF_BRANCH:-main}"
ENV_FILE="${FF_ENV:-$HOME/Desktop/dev/ffdevstudio/.env}"

[ -f "$ENV_FILE" ] || { echo "✗ no credentials at $ENV_FILE"; exit 1; }
set -a; . "$ENV_FILE"; set +a
: "${CLOUDFLARE_API_TOKEN:?missing in $ENV_FILE}"
: "${CLOUDFLARE_ACCOUNT_ID:?missing in $ENV_FILE}"

npm run build
# SPA routes (/privacy-policy, the 404 page) are handled client-side.
printf '/*\t/index.html\t200\n' > dist/_redirects

npx --yes wrangler@latest pages project list 2>/dev/null | grep -q "│ $PROJECT " \
  || npx --yes wrangler@latest pages project create "$PROJECT" --production-branch main --force

npx --yes wrangler@latest pages deploy dist --project-name "$PROJECT" --branch "$BRANCH" --commit-dirty=true --force
