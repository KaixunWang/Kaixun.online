#!/bin/sh
set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "缺少 .env，请先: cp .env.production.example .env 并填写配置"
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "未找到 docker compose，请先安装:"
  echo "  apt-get update && apt-get install -y docker-compose"
  exit 1
fi

echo "==> 使用: $COMPOSE"
echo "==> 构建并启动生产环境..."
$COMPOSE -f docker-compose.prod.yml --env-file .env up -d --build

echo "==> 完成。查看日志: $COMPOSE -f docker-compose.prod.yml logs -f web"
