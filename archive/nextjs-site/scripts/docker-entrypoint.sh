#!/bin/sh
set -e

echo "[docker] Applying Prisma migrations..."
max_attempts=30
attempt=0
until npx prisma migrate deploy; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[docker] Migration failed after ${max_attempts} attempts."
    exit 1
  fi
  echo "[docker] Database not ready or migrate retry (${attempt}/${max_attempts}) in 2s..."
  sleep 2
done

echo "[docker] Starting Next.js..."
exec npm run start
