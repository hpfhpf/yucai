#!/usr/bin/env bash
#
# 数据库归档脚本
# 用途：导出 yucai_hr (MySQL, 运行于 docker 容器 yucai-mysql) 的完整数据文件，
#       打包为 tar.gz 并生成 sha256 校验，存入 backend/backups/。
#
# 用法：
#   bash scripts/db-archive.sh [版本号]
#   示例：bash scripts/db-archive.sh v0.1.0
#
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
BACKUP_DIR="$BACKEND_DIR/backups"
CONTAINER="yucai-mysql"
VER="${1:-v0.1.0}"

# 从 backend/.env 解析连接信息
DBURL=$(grep -oE 'DATABASE_URL="[^"]+"' "$BACKEND_DIR/.env" | sed 's/DATABASE_URL=//; s/"//g')
DBUSER=$(echo "$DBURL" | sed -E 's#mysql://([^:]+):.*#\1#')
DBPASS=$(echo "$DBURL" | sed -E 's#mysql://[^:]+:([^@]+)@.*#\1#')
DBNAME=$(echo "$DBURL" | sed -E 's#.*/([^/?]+)(\?.*)?$#\1#')

DATE=$(date +%Y%m%d)
BASE="${DBNAME}_${DATE}_${VER}"
SQLFILE="$BACKUP_DIR/${BASE}.sql"

mkdir -p "$BACKUP_DIR"

echo ">> 导出 $DBNAME ..."
docker exec "$CONTAINER" sh -c "mysqldump -u'$DBUSER' -p'$DBPASS' \
  --databases '$DBNAME' \
  --single-transaction --quick \
  --routines --triggers --events \
  --default-character-set=utf8mb4 \
  --add-drop-database --set-gtid-purged=OFF \
  --column-statistics=0" 2>/dev/null > "$SQLFILE"

echo ">> 压缩与校验 ..."
( cd "$BACKUP_DIR" && tar -czf "${BASE}.tar.gz" "${BASE}.sql" \
  && shasum -a 256 "${BASE}.tar.gz" > "${BASE}.tar.gz.sha256" \
  && rm -f "${BASE}.sql" )

echo ">> 完成：$BACKUP_DIR/${BASE}.tar.gz"
ls -lh "$BACKUP_DIR/${BASE}.tar.gz"
