#!/usr/bin/env bash
# 育才 HR 一键启动脚本：Docker -> 容器(MySQL/Redis) -> 后端(NestJS) -> 前端(H5)
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"

echo "==> [1/4] 检查 Docker daemon"
if ! docker info >/dev/null 2>&1; then
  echo "    Docker 未运行，正在启动 Docker Desktop..."
  open -a Docker
  for i in $(seq 1 60); do
    if docker info >/dev/null 2>&1; then echo "    Docker 就绪"; break; fi
    sleep 2
  done
fi
docker info >/dev/null 2>&1 || { echo "    Docker 启动失败，请手动打开 Docker Desktop"; exit 1; }

echo "==> [2/4] 启动 MySQL / Redis 容器"
( cd "$ROOT" && docker compose up -d >/dev/null 2>&1 )
echo "    等待 MySQL 就绪..."
for i in $(seq 1 40); do
  if docker exec yucai-mysql mysqladmin ping -uroot -pyucai_root_2024 --silent >/dev/null 2>&1; then
    echo "    MySQL 就绪"; break
  fi
  sleep 2
done

echo "==> [3/4] 启动后端 NestJS (端口 3000)"
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
( cd "$BACKEND" && nohup npm run start:dev > /tmp/yucai-backend.log 2>&1 & )
echo "    后端日志: /tmp/yucai-backend.log"

echo "==> [4/4] 启动前端 H5 (端口 5274)"
lsof -ti:5274 2>/dev/null | xargs kill -9 2>/dev/null || true
( cd "$ROOT" && CI=true nohup node_modules/.bin/uni -p h5 --mode development > /tmp/yucai-frontend.log 2>&1 & )
echo "    前端日志: /tmp/yucai-frontend.log"

echo ""
echo "==> 等待服务就绪并验证..."
for i in $(seq 1 30); do
  b=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/docs 2>/dev/null)
  f=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5274/ 2>/dev/null)
  if [ "$b" = "200" ] && [ "$f" = "200" ]; then break; fi
  sleep 2
done
echo "    后端  http://localhost:3000/docs -> ${b:-000}"
echo "    前端  http://localhost:5274/      -> ${f:-000}"
echo ""
echo "✅ 启动完成。浏览器打开 http://localhost:5274/"
echo "   测试账号密码均为 Test1234：13800000001~4"
