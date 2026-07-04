# 数据库归档与迁移说明

## 概述

- 数据库：MySQL 8.0，库名 `yucai_hr`
- 运行环境：Docker 容器 `yucai-mysql`（端口 `3306`）
- 连接配置：`backend/.env` 中的 `DATABASE_URL`
- 归档位置：`backend/backups/`（已在 `backend/.gitignore` 中忽略，**不入库**，因含用户手机号、bcrypt 密码等敏感数据）

数据表共 14 张，与 `backend/prisma/schema.prisma` 中的 14 个 model 一一对应：
`companies` `deliveries` `educations` `identity_verifications` `job_favorites`
`jobs` `messages` `project_experiences` `recommendations` `recruiters`
`seeker_profiles` `users` `work_certifications` `work_experiences`

## 归档文件命名规范

```
<数据库名>_<导出日期YYYYMMDD>_<版本号>.tar.gz
例：yucai_hr_20260705_v0.1.0.tar.gz
```

每次归档产出两个文件：

- `*.tar.gz`：压缩后的 SQL 全量转储
- `*.tar.gz.sha256`：SHA-256 校验值，用于验证文件完整性

## 导出（归档）

推荐使用脚本一键导出：

```bash
bash scripts/db-archive.sh v0.1.0   # 版本号可选，默认 v0.1.0
```

脚本从 `backend/.env` 解析连接信息，通过 `docker exec` 调用容器内 `mysqldump`
导出，导出参数保证完整性与一致性：

- `--databases`：包含 `CREATE DATABASE` / `USE` 语句
- `--single-transaction --quick`：InnoDB 一致性快照，导出期间不锁表
- `--routines --triggers --events`：包含存储过程、触发器、事件
- `--add-drop-database`：恢复时先重建库
- `--default-character-set=utf8mb4`：保证中文数据不乱码

## 校验

```bash
cd backend/backups
gzip -t yucai_hr_20260705_v0.1.0.tar.gz          # 压缩完整性
shasum -a 256 -c yucai_hr_20260705_v0.1.0.tar.gz.sha256   # 内容一致性
```

## 恢复（迁移场景）

在目标环境准备好 MySQL 8.0 后：

```bash
# 1. 解压
tar -xzf yucai_hr_20260705_v0.1.0.tar.gz      # 得到 yucai_hr_*.sql

# 2. 导入（转储已含建库语句，需具备建库权限的账号，如 root）
#    - Docker 容器内：
docker cp yucai_hr_20260705_v0.1.0.sql yucai-mysql:/tmp/restore.sql
docker exec yucai-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" < /tmp/restore.sql'

#    - 或直接连接：
mysql -uroot -p < yucai_hr_20260705_v0.1.0.sql

# 3. 确认业务账号权限（应用使用的 yucai 用户对 yucai_hr 有读写权限）
```

> 注意：应用账号 `yucai` 无建库权限，恢复到**新库名**时需用 `root` 或具备
> `CREATE`/`GRANT` 权限的账号。恢复到原库名 `yucai_hr` 时，`yucai` 账号可直接导入。

## 恢复验证记录

`yucai_hr_20260705_v0.1.0.tar.gz` 已通过恢复验证：

- gzip 完整性检查：通过
- SHA-256 校验：通过
- 恢复到临时库 `yucai_hr_verify`：14 张表全部恢复
- 抽样行数与源库一致：`users`=20、`jobs`=201、`companies`=22、`deliveries`=17
- 验证后临时库已清理
