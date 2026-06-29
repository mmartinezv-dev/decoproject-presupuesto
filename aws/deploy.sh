#!/bin/bash
# deploy.sh — Redeploy latest changes on the server
# Run from server as: bash ~/app/aws/deploy.sh
set -e

APP_DIR="/home/admin/app"

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"

echo "=== [1/4] Pulling latest changes ==="
cd "$APP_DIR"
git pull origin main

echo "=== [2/4] Rebuilding backend ==="
cd "$APP_DIR/backend"
npm ci --omit=dev
npm run build

echo "=== [3/4] Rebuilding frontend ==="
cd "$APP_DIR/frontend"
npm ci
npm run build

echo "=== [4/4] Restarting app ==="
pm2 restart decoproject

echo ""
echo "✓ Deploy complete."
