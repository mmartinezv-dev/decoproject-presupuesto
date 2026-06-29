#!/bin/bash
# setup.sh — First-time server setup for DecoProject on Ubuntu 24.04 (AWS Lightsail)
# Run as: bash setup.sh
set -e

APP_DIR="/home/admin/app"
REPO_URL="https://github.com/YOUR_USER/presupuestos-constru.git"  # <-- update this

echo "=== [1/7] Installing system packages ==="
sudo apt-get update -y
sudo apt-get install -y git nginx curl

echo "=== [2/7] Installing Node.js 22 via nvm ==="
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22

echo "=== [3/7] Installing PM2 ==="
npm install -g pm2

echo "=== [4/7] Cloning repository ==="
git clone "$REPO_URL" "$APP_DIR"

echo "=== [5/7] Building backend ==="
cd "$APP_DIR/backend"
npm ci --omit=dev
npm run build

echo "=== [6/7] Building frontend ==="
cd "$APP_DIR/frontend"
npm ci
npm run build

echo "=== [7/7] Configuring nginx ==="
sudo cp "$APP_DIR/aws/nginx.conf" /etc/nginx/sites-available/decoproject
sudo ln -sf /etc/nginx/sites-available/decoproject /etc/nginx/sites-enabled/decoproject
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "=== Starting app with PM2 ==="
cd "$APP_DIR/backend"
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | sudo bash

echo ""
echo "✓ Setup complete. App running at http://54.20.55.97"
