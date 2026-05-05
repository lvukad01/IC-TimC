#!/bin/sh
set -eu

cd /app/services/api

npx prisma generate --schema=./prisma/schema.prisma
echo "=== Running database migrations ==="
npx prisma migrate deploy

echo "=== Seeding database ==="
node ./dist/prisma/seed.js

echo "=== Starting backend ==="
node ./dist/src/main.js