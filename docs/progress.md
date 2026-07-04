# 育才 HR 项目进度

> 每次对话开始前必读，结束前必更新。

---

## 当前阶段

**阶段**：第二阶段 — Bug 修复 + 文档归档完成  
**最近更新**：2026-06-26  
**下一步**：走完招聘端 golden path 验收（浏览器实际点击每个按钮）；推进第三阶段信用体系

---

## 已完成

### 文档
- [x] `docs/product-spec.md` — 产品说明书 v0.2（含运营端第7节、问题清单#1-#24）
- [x] `docs/design.md` — 技术设计文档 v0.3（MySQL 8.0、认证粒度(user,company)、分享认证流程、开发顺序调整）
- [x] `CLAUDE.md` — 项目开发指南（含多角色方法论）
- [x] `docs/progress.md` — 进度追踪文件（本文件）
- [x] `docs/test-cases.md` — 接口测试用例（Auth/Resume/Jobs，含 BUG 跟踪表）

### 决策记录
- **后端框架**：Node.js + NestJS + Prisma + MySQL 8.0（详见 design.md 第1.2节）
- **平台范围**：全国（非仅成都）
- **工作认证逻辑**：超级管理员初期认证 → 认证用户可为同公司他人认证（详见 design.md 第6节）

---

## 进行中

无（当前无进行中的编码任务）

---

## 待完成（按优先级）

### 第一阶段：MVP 基础功能

#### 后端初始化
- [x] 创建 `backend/` 目录，初始化 NestJS 项目
- [x] 配置 Prisma + MySQL 8.0（本地用 Homebrew MySQL 9.2）
- [x] 创建 docker-compose.yml（MySQL + Redis，供生产/CI 使用）
- [x] 配置 `.env.example`

#### 数据库
- [x] 编写 Prisma schema（14张表，含枚举）
- [x] `prisma db push` 建表（本地开发用，migrate dev 需额外影子库权限）

#### 认证模块（auth）
- [x] Mock 登录（4个测试账号，每角色一个）
- [x] JWT 签发与验证（JwtAuthGuard + CurrentUser 装饰器）
- [ ] 真实手机号+密码注册/登录（TODO：替换 Mock）
- [ ] 短信验证码（接腾讯云短信，TODO）

#### 用户模块（users）
- [x] GET /v1/users/me（从 DB 读取用户信息）
- [x] PUT /v1/users/me（更新 nickname，含长度校验）
- [x] POST /v1/users/me/avatar（stub，返回 501，待接入腾讯云 COS）
- [ ] 修改手机号（待接入腾讯云短信）
- [ ] 头像真实上传（待配置腾讯云 COS）

#### 简历模块（resume）
- [x] 求职者基础信息 GET/PUT
- [x] 教育经历 CRUD
- [x] 工作经历 CRUD（skillTags 用 MySQL JSON 列）
- [x] 项目经历 CRUD（techTags 用 MySQL JSON 列）
- [x] 自我描述 GET/PUT
- [x] Mock 用户 seed（prisma/seed.ts）

#### 职位模块（jobs）
- [x] 职位列表（筛选/分页）
- [x] 职位详情（含浏览量+1）
- [x] 投递简历（含信用授权标记、防重投）
- [x] 职位收藏/取消
- [x] 我的投递记录
- [x] 我的收藏列表
- [x] 招聘官发布/编辑/下架职位（RECRUITER 角色鉴权）
- [x] 招聘官已发布职位列表
- [x] 测试数据 seed（2家公司、1个招聘官、5个职位）

#### 前端对接
- [x] `request.ts` — Bearer token 从 storage 读取，响应按 HTTP 状态码处理，401 自动跳转登录
- [x] `api/index.ts` — 补全全部业务 API（auth/users/jobs/resume/companies/recruiter，共约 40 个函数）
- [x] 登录页 — 接 `POST /v1/auth/login`，成功后写 token + userInfo 到 storage
- [x] 求职者首页 — 职位列表接 `GET /v1/jobs`，快捷入口接筛选参数，换一批调真实接口
- [x] 我的页面 — 从 storage 读取登录状态和用户名，未登录跳转登录页
- [x] 简历中心（resumeCenter）— 接 resume 模块各接口
- [x] 职位详情页 — 接 `GET /v1/jobs/:id`，投递/收藏按钮联通（路径 pages/recommendation/detail/index）
- [x] 我的投递/收藏页 — 接 `GET /v1/jobs/my-deliveries` / `my-favorites`
- [x] 消息中心 — 面试邀请 tab 接 `GET /v1/messages/invites`（新增 MessagesModule）
- [x] 工作经历删除（前端删除按钮 + 确认弹窗，调 `DELETE /v1/resume/work-exp/:id`）
- [x] 工作认证流程（`POST /v1/resume/work-exp/:id/request-cert` 生成 shareToken，`POST /v1/resume/certify/:shareToken` 同事确认，`GET /v1/resume/certifications` 列表；简历中心加认证按钮/状态徽章；workCertification.vue 接真实数据）

### 第二阶段：招聘官 + 消息

- [x] 企业搜索/创建（`/v1/companies`）
- [x] 招聘官档案注册/获取/更新（`/v1/recruiter/profile`）
- [x] 简历库浏览 + 查看完整简历（`/v1/recruiter/seekers`）
- [x] 投递管理：查看 + 更新状态（VIEWED/INTERVIEW/REJECTED/ACCEPTED）
- [x] 面试邀请发送 + 已发邀请列表（`/v1/recruiter/invite`）
- [x] 招聘端前端完整对接：
  - [x] `recruiter/registration.vue` 重构为 3步文本注册流程（联系人 → 企业搜索/创建 → 完成）
  - [x] `recruiter/index.vue` 替换 mock → 真实 apiGetSeekers 数据，点击跳转 resumeDetail
  - [x] `recruiter/talents.vue` 接 apiGetSeekers，搜索防抖，点击跳转 resumeDetail
  - [x] `recruiter/resumeCenter.vue` 重构为投递管理列表（Tab 全部/待处理/已邀请/通过/不合适）+ 面试邀请 Modal
  - [x] `recruiter/resumeDetail.vue` 新建简历详情页（接 apiGetSeekerResume，职位选择 + 面试邀请发送）
  - [x] `pages.json` 注册 resumeDetail，修复 linter 引入的空 style 配置
  - [x] `docs/recruiter-spec.md` 创建招聘端功能模块与测试用例文档
  - [x] `recruiter/myJobs.vue` 新建"我的职位"列表页（接 apiGetMyPostedJobs，含下线功能）
  - [x] `recruiter/jobPosting.vue` 编辑模式（读 editId URL 参数，预填表单，调 apiUpdateJob）
  - [x] `recruiter/resumeDetail.vue` 面试邀请修复（auto-select 第一个职位，移除阻断性校验）
  - [x] `prisma/seed-seekers.ts` 新增 6 个测试求职者（13800000011~16，各含教育+工作经历）
  - [x] `prisma/seed-deliveries.ts` 新增 8 条投递记录（不同状态，用于测试简历中心各 Tab）
  - [x] `prisma/normalize-salary.ts` 薪资归一化脚本（177 条非标数据统一为 K 制选项）
  - [x] `recruiter/resumeCenter.vue` 投递卡片增加状态徽章（颜色区分五种状态）
  - [x] `recruiter/jobPosting.vue` 非标薪资动态注入 picker 顶部（历史数据兼容展示）
  - [x] `seeker/index.vue` 顶部加招聘官角色检测，自动 reLaunch 到招聘官首页
  - [x] `mine/index.vue` 未认证/已认证徽章改为互斥显示（v-if/v-else）
  - [x] `mine/index.vue` "我的资料"按角色分流（招聘官 → registration，求职者 → changePhone）
  - [x] `recruiter/registration.vue` 增加编辑模式（onMounted 预填数据，PUT 更新档案）
  - [x] `docs/prd.md` 产品需求文档 v1.0（全量产品逻辑归档，12个章节）
- [ ] 求职者收到的邀请列表（消息中心）
- [ ] 实时聊天（WebSocket）

### 第三阶段：信用体系

- [ ] 实名认证提交 + 运营端审核
- [ ] 职业信用评分计算
- [ ] 工作认证流程（超管认证 → 链式认证）
- [ ] 企业信用展示
- [ ] 信用异议流程

### 第四阶段：增长

- [ ] 职位推荐算法
- [ ] 视频面试（声网 Agora）
- [ ] 运营端完整功能
- [ ] 数据统计

---

## 问题清单

| 编号 | 优先级 | 说明 | 状态 |
|------|--------|------|------|
| #1 | P1 | BottomNav 招聘官端路径与求职者端相同，双端切换机制未实现 | 待前端处理 |
| #2 | P0 | 登录完全是Mock，无真实API | 第一阶段修复 |
| #3 | P1 | 求职者首页搜索、职位点击未跳转 | 第一阶段修复 |
| #4 | P1 | 快捷入口全职/兼职职位点击未实现 | 第一阶段修复 |
| #9 | P1 | mine/index.vue 未认证/已认证标签同时显示 | 待前端处理 |
| #16 | P2 | pages.json 应用名仍为 "russ-uniapp" | 待前端处理 |
| #17 | P2 | route.ts 中 goPageMeeting 指向不存在页面 | 待前端处理 |
| #18 | P0 | api/index.ts 缺少所有HR业务API定义 | 第一阶段修复 |
| #21 | P1 | selfDesc.vue 缺少 needLogin: true | 待前端处理 |
| #22 | P1 | job.vue 工作经历表单缺少薪资和技能标签字段 | 需前端补充 |
| #23 | P1 | project.vue 项目经历表单缺少技术标签字段 | 需前端补充 |

---

## 关键决策记录

### 2026-06-22

**数据库切换为 MySQL 8.0**：
- 招聘平台是典型关系型产品，MySQL 更符合行业惯例
- 腾讯云 CDB for MySQL 成熟，运维成本低
- MySQL 8.0 原生 JSON 类型可满足 skillTags/techTags 需求
- `String[]` → `Json?`，Prisma 应用层负责序列化

**工作认证粒度调整**：
- 认证以 (userId, companyId) 为单位，同公司所有经历只认证一次
- WorkCertification 表新增 `@@unique([userId, companyId])`
- WorkExperience 移除 `isVerified`/`verifiedAt`，通过联查判断认证状态

**分享认证流程（主要路径）**：
- B 点击工作经历旁的「分享认证」按钮 → 后端生成 shareToken
- 前端调用 wx.shareAppMessage 生成小程序卡片发给 A
- A 点开卡片 → 确认认证 → 系统校验 A 在同公司有认证记录 → 更新状态为 APPROVED
- A 也可主动在简历库中认证 B（次要路径）

**开发顺序调整**：
- 用户端 MVP 先行 → 灌测试数据 → 再开发运营端
- 运营端从第一阶段移至第二阶段

### 2026-06-18

**后端框架选型**：选 NestJS + PostgreSQL + Prisma
- 与 finance-agent-system 技术栈一致（Prisma + PostgreSQL）
- NestJS 提供模块化结构，易于扩展和迁移
- TypeScript 与前端保持一致，降低沟通成本
- 若将来信用评分需要 ML，可单独提取为 Python 微服务

**平台范围**：由"本地成都"扩展为"面向全国"
- 省市区数据需覆盖全国31个省市自治区

**工作认证机制**：链式信任
- 初期：超级管理员在运营端直接认证
- 后期：已认证用户可为同公司他人认证
- 认证条件：认证人的该公司工作经历必须已被认证

**薪资/标签字段缺失**：
- job.vue（工作经历）表单缺少薪资字段 → 后端设计保留字段，但标记为可选（非必填），等前端补充
- project.vue（项目经历）表单缺少技术标签 → 同上处理方式
- 简历中心显示的薪资和标签是 Mock，实际由求职者在编辑时填写
