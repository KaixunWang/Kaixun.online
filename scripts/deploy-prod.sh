#!/bin/sh
set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "缺少 .env，请先: cp .env.production.example .env 并填写配置"
  exit 1
fi

echo "==> 构建并启动生产环境..."
docker compose -f docker-compose.prod.yml --env-file .env up -d --build

echo "==> 完成。查看日志: docker compose -f docker-compose.prod.yml logs -f web"
