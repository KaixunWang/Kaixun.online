#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-root@47.92.78.150}"
REMOTE_DIR="${DEPLOY_DIR:-/var/www/kaixun-site/dist}"

echo "==> 构建静态站点..."
npm run build

echo "==> 上传到 ${HOST}:${REMOTE_DIR} ..."
ssh "$HOST" "mkdir -p ${REMOTE_DIR}"
rsync -avz --delete dist/ "${HOST}:${REMOTE_DIR}/"

echo "==> 重载 Nginx..."
ssh "$HOST" 'if command -v nginx >/dev/null 2>&1; then
  nginx -t && nginx -s reload
elif [ -x /usr/sbin/nginx ]; then
  /usr/sbin/nginx -t && /usr/sbin/nginx -s reload
elif command -v systemctl >/dev/null 2>&1 && systemctl is-active nginx >/dev/null 2>&1; then
  nginx -t 2>/dev/null || /usr/sbin/nginx -t
  systemctl reload nginx
else
  echo "⚠ 未找到 Nginx（文件已上传）。请在服务器安装 Nginx 或重载 Docker 中的 Nginx，见 README。"
  exit 0
fi'

echo "==> 部署完成"
