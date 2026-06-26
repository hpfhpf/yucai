# CLAUDE.md — 育才 HR 项目开发指南

## 项目概览

育才 HR 是一个面向**全国**劳动力市场的招聘平台微信小程序，核心差异点为**职业信用体系**。
分为三端：**用户端（求职者/招聘官）**、**运营端**。

前端已由其他成员使用 UniApp + Vue3 + TypeScript + Wot-UI 完成，我们负责后端和API对接。

## 必读文档

- `docs/product-spec.md` — 产品说明书（功能、页面、问题清单）
- `docs/design.md` — 技术设计文档（架构、数据库、API）
- `docs/progress.md` — **项目进度**（每次开始前必读，每次结束前必更新）

## 基本命令

```bash
# 前端（微信小程序预览）
pnpm dev:mp-weixin

# 后端（待创建）
pnpm --filter backend dev        # 后端开发服务
pnpm --filter backend db:migrate # 数据库迁移
pnpm --filter backend test       # 运行测试

# Docker（本地开发依赖）
docker-compose up -d   # 启动 PostgreSQL + Redis
docker-compose down    # 停止服务
```

## 核心约束

1. **不修改前端代码** — 前端由其他成员维护，遇到问题记录到 `docs/product-spec.md` 问题清单
2. **所有 Mock 数据** 最终都要通过后端 API 替换，参见产品说明书第9条
3. **部署目标**：腾讯云（CVM/容器 + RDS PostgreSQL + Redis + COS）
4. **面向全国** — 省市区数据要覆盖全国，不仅限于成都

---

## 多角色开发方法论（来自 finance-agent-system）

每个功能按以下6个阶段完成：

### [PLAN] 规划设计
- 梳理业务逻辑，确认输入输出，识别边界情况
- 产出：逻辑流程说明 + 接口定义
- 检查点：业务闭环是否完整？边界情况是否考虑？

### [ARCH] 架构设计
- 确认模块拆分，定义服务边界，确保可扩展
- 禁止硬编码，所有外部依赖通过接口抽象
- 检查点：模块职责单一？接口可替换？

### [CODE] 代码实现
- TypeScript 严格模式，Prisma ORM，Pino 日志
- 防御性编程，完善错误处理，关键步骤有日志
- 检查点：类型完整？错误处理覆盖？

### [REVIEW] 代码审查
- **P0（严重）**：功能缺失、安全漏洞、数据丢失
- **P1（重要）**：影响体验、性能、错误处理不足
- **P2（建议）**：可读性、可维护性
- 发现 P0/P1 → [CODE] 立即修复

### [TEST] 测试验证
- 单元测试覆盖率 ≥ 80%
- 集成测试覆盖核心流程
- 边界测试覆盖异常场景
- 工具：Vitest

### [VERIFY] 真实环境验证
- 必须在真实环境中验证，不能仅凭测试通过
- 验证清单：
  - [ ] 服务启动成功
  - [ ] API 返回真实数据（非 null）
  - [ ] 响应时间合理（< 500ms）
  - [ ] 错误场景处理正确

**工作流**：
```
[PLAN] → [ARCH] → [CODE] → [REVIEW] → [CODE修复] → [TEST] → [VERIFY] → 完成
```

> 不额外要求时，所有功能均以此方式完成。

---

## 技术栈

| 层次 | 技术 |
|------|------|
| 前端 | UniApp 3 + Vue 3 + TypeScript + Wot-UI（已完成，不修改） |
| 后端框架 | Node.js + NestJS + TypeScript |
| ORM | Prisma |
| 数据库 | PostgreSQL 16 |
| 缓存 | Redis 7 |
| 文件存储 | 腾讯云 COS |
| 实时通信 | WebSocket + Socket.IO |
| 视频通话 | 声网 Agora RTC（前端SDK已引入，后端待集成） |

## 目录结构（规划）

```
yucai-hr/
├── src/                  # 前端（UniApp，不修改）
├── backend/              # 后端（待创建）
│   ├── src/
│   │   ├── auth/         # 认证模块
│   │   ├── users/        # 用户模块
│   │   ├── jobs/         # 职位模块
│   │   ├── resume/       # 简历模块
│   │   ├── messages/     # 消息模块
│   │   ├── credit/       # 信用体系模块
│   │   ├── admin/        # 运营端模块
│   │   └── common/       # 公共工具
│   ├── prisma/
│   │   └── schema.prisma
│   └── test/
├── docs/
│   ├── product-spec.md   # 产品说明书
│   ├── design.md         # 技术设计文档
│   └── progress.md       # 项目进度（每次必读/必更新）
└── docker-compose.yml    # 本地开发环境
```

## 进度追踪规则

**每次对话开始**：先读取 `docs/progress.md`，了解上次进度。
**每次对话结束**：更新 `docs/progress.md`，记录本次完成的工作、当前状态、下一步计划。

格式参见 `docs/progress.md`。
