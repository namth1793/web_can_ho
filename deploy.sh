#!/bin/bash
# Deploy script cho ChungCuGiaReHN.vn
# Chạy trên server Linux (Ubuntu/Debian)
# Yêu cầu: Node.js >= 18, npm, pm2, nginx

set -e

DEPLOY_DIR="/var/www/chungcugiarehn"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================"
echo "  DEPLOY CHUNGCUGIAREHN.VN"
echo "========================================"

# ── 1. Tạo thư mục deploy ──────────────────
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R $USER:$USER "$DEPLOY_DIR"

# ── 2. Copy source lên server ──────────────
echo "[1/5] Copy source..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' \
  "$REPO_DIR/backend/"  "$DEPLOY_DIR/backend/"
rsync -av --exclude='node_modules' --exclude='dist' \
  "$REPO_DIR/frontend/" "$DEPLOY_DIR/frontend/"
cp "$REPO_DIR/ecosystem.config.js" "$DEPLOY_DIR/"

# ── 3. Tạo .env backend ───────────────────
# Chỉ tạo nếu chưa tồn tại (giữ credentials đã cấu hình)
if [ ! -f "$DEPLOY_DIR/backend/.env" ]; then
  echo "[!] Tạo file .env — hãy điền Cloudinary credentials sau khi deploy!"
  cat > "$DEPLOY_DIR/backend/.env" << 'EOF'
PORT=5021
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF
fi

# ── 4. Cài dependencies & build ───────────
echo "[2/5] Cài backend dependencies..."
cd "$DEPLOY_DIR/backend" && npm install --omit=dev

echo "[3/5] Build frontend..."
cd "$DEPLOY_DIR/frontend" && npm install && npm run build

# ── 5. Khởi động/reload backend với PM2 ──
echo "[4/5] Khởi động backend với PM2..."
cd "$DEPLOY_DIR"
if pm2 list | grep -q "chungcugiarehn-backend"; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
  pm2 save
fi

# ── 6. Cấu hình nginx ─────────────────────
echo "[5/5] Cấu hình nginx..."
sudo cp "$REPO_DIR/nginx.conf" /etc/nginx/sites-available/oanhhome.vn
sudo ln -sf /etc/nginx/sites-available/oanhhome.vn /etc/nginx/sites-enabled/oanhhome.vn
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "========================================"
echo "  DEPLOY HOÀN TẤT!"
echo "========================================"
echo ""
echo "Các bước tiếp theo:"
echo "  1. Điền Cloudinary credentials vào:"
echo "     $DEPLOY_DIR/backend/.env"
echo "  2. Reload backend:  pm2 reload chungcugiarehn-backend"
echo "  3. Cài SSL (HTTPS): certbot --nginx -d oanhhome.vn -d www.oanhhome.vn"
echo ""
echo "Kiểm tra backend: curl http://localhost:5021/api/projects"
echo "Kiểm tra web:     curl http://oanhhome.vn"
echo ""
