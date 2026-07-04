# 育才 HR 项目设计文档

> 版本：v0.3  
> 日期：2026-06-22  
> 依赖文档：[产品说明书](./product-spec.md) | [项目进度](./progress.md)

---

## 1. 整体架构

### 1.1 系统结构图

```
┌──────────────────────────────────────────────────────────────┐
│                 客户端（微信小程序 / H5）                       │
│   求职者端   /   招聘官端   /   运营端（H5管理后台）             │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS / WSS
┌──────────────────────▼───────────────────────────────────────┐
│               API 网关 / Nginx 反向代理                        │
│               (腾讯云 CLB 或 API Gateway)                     │
└──────────────────────┬───────────────────────────────────────┘
          ┌────────────┼────────────┐
          │            │            │
┌─────────▼──────┐  ┌──▼──────────┐  ┌▼────────────┐
│  业务 API 服务   │  │ WebSocket   │  │ 定时任务服务  │
│  NestJS        │  │  服务        │  │ (信用计算等)  │
└─────────┬──────┘  └──┬──────────┘  └─────────────┘
          │            │
┌─────────▼────────────▼─────────────────────────────┐
│                    数据存储层                         │
│  PostgreSQL 16（业务数据）  Redis 7（缓存/会话/实时）  │
│  腾讯云 COS（图片/文件/身份证照片）                    │
└─────────────────────────────────────────────────────┘
          │
┌─────────▼──────────┐
│   第三方服务         │
│  微信登录 / 腾讯云短信 /   │
│  声网 Agora RTC / 实名认证三方 │
└────────────────────┘
```

### 1.2 框架选型与理由

**后端框架：Node.js + NestJS + TypeScript**

| 候选 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| **NestJS（选定）** | TypeScript一致性；模块化结构；WebSocket原生支持；与finance-agent-system经验一致；Prisma生态完整 | CPU密集任务性能不如Go/Java | ✅ 适合当前团队和规模 |
| Python FastAPI | 适合ML/AI集成 | 与前端技术栈不同；团队需学习曲线 | 后期信用评分可提取为单独微服务 |
| Java Spring Boot | 企业级；易扩展团队 | 开发效率低；启动时间长；重量级 | 若未来规模极大可迁移核心服务 |
| Go | 高并发；低内存 | 团队学习成本；生态不如Node | 若未来有性能瓶颈可提取网关层 |

**迁移路径设计：**
- NestJS 采用模块化设计（每个功能一个 Module），服务边界清晰
- 每个 Module 之间通过 Service 接口通信，不直接依赖
- 信用评分如需 ML → 抽取为独立 Python 微服务，通过 HTTP 调用
- 高并发网关如需优化 → 在 Nginx 前加 Go 代理层
- 数据库使用 MySQL 8.0，ORM 使用 Prisma（切换数据库只需改 datasource，业务代码无需变动）

**数据库：MySQL 8.0**（回应问题#1）

对于招聘平台这类关系型产品，MySQL 是更合适的选择：

| 对比点 | MySQL 8.0 | PostgreSQL 16 |
|--------|-----------|--------------|
| 中国云生态 | ✅ 腾讯云 CDB/TDSQL 成熟，文档齐全 | 一般 |
| 关系型业务 | ✅ 标准关系型，覆盖本项目全部需求 | ✅ 同等能力 |
| JSON 支持 | ✅ MySQL 8.0 原生 JSON 类型（标签数组用 JSON 列存储） | JSONB 索引更强（但本项目用不到） |
| 团队熟悉度 | ✅ 行业标准，生态更广泛 | 需额外学习成本 |
| 运维复杂度 | 低 | 中 |

> `skillTags`/`techTags` 等数组字段改用 MySQL JSON 类型，Prisma 中声明为 `Json?`，应用层读写时序列化/反序列化为字符串数组。

---

## 2. 数据库设计（Prisma Schema）

### 2.1 用户表（users）

```prisma
model User {
  id              String    @id @default(cuid())
  phone           String    @unique
  passwordHash    String
  role            UserRole  @default(SEEKER)
  nickname        String?
  avatarUrl       String?
  status          Int       @default(1)    // 1:正常 0:禁用
  idVerifiedAt    DateTime?              // 实名认证通过时间，非空即代表已认证
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  seekerProfile   SeekerProfile?
  recruiter       Recruiter?
  sentMessages    Message[]  @relation("sender")
  receivedMessages Message[] @relation("receiver")
  deliveries      Delivery[]
  favorites       JobFavorite[]
  idVerification  IdentityVerification?
  certifications  WorkCertification[] @relation("certifier")

  @@index([phone])
  @@index([role])
  @@map("users")
}

enum UserRole {
  SEEKER     // 求职者
  RECRUITER  // 招聘官
  ADMIN      // 运营管理员
  SUPER_ADMIN // 超级管理员
}
```

**说明：`idVerifiedAt` 的设计理由**
- 加在 users 表上是为了快速判断认证状态（不需要 JOIN）
- 详细认证材料在 `identity_verifications` 表
- 微信小程序每次接口调用都需判断认证状态，直接查 users 效率更高

### 2.2 求职者详细信息表（seeker_profiles）

```prisma
model SeekerProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  realName     String?                // 真实姓名（实名认证后）
  gender       Gender   @default(UNKNOWN)
  birthDate    DateTime?
  city         String?                // 期望工作城市
  roleTitle    String?                // 求职意向职位
  selfDesc     String?  @db.Text
  creditScore  Int      @default(0)   // 职业信用分（0-100）
  user         User     @relation(fields: [userId], references: [id])
  educations   Education[]
  works        WorkExperience[]
  projects     ProjectExperience[]

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("seeker_profiles")
}

enum Gender {
  MALE
  FEMALE
  UNKNOWN
}
```

### 2.3 教育经历表（educations）

```prisma
model Education {
  id          String   @id @default(cuid())
  profileId   String
  school      String
  major       String?
  degree      Degree?
  startDate   DateTime?
  endDate     DateTime?
  sortOrder   Int      @default(0)
  profile     SeekerProfile @relation(fields: [profileId], references: [id])
  createdAt   DateTime @default(now())

  @@index([profileId])
  @@map("educations")
}

enum Degree {
  JUNIOR      // 初中
  SENIOR      // 高中
  ASSOCIATE   // 大专
  BACHELOR    // 本科
  MASTER      // 硕士
  DOCTOR      // 博士
}
```

### 2.4 工作经历表（work_experiences）

```prisma
model WorkExperience {
  id             String   @id @default(cuid())
  profileId      String
  company        String
  title          String             // 职位名称
  city           String?
  salaryMin      Int?               // 薪资下限（元/月），求职者填写，选填
  salaryMax      Int?               // 薪资上限（元/月），求职者填写，选填
  skillTags      Json?              // 技能标签，如 ["Vue","TypeScript"]，MySQL JSON 列，求职者填写，选填
  content        String?  @db.Text  // 工作内容描述
  startDate      DateTime?
  endDate        DateTime?          // null 表示至今
  sortOrder      Int      @default(0)
  profile        SeekerProfile @relation(fields: [profileId], references: [id])
  // 认证状态通过联查 work_certifications(userId, companyId) 获得，不在此冗余存储

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([profileId])
  @@map("work_experiences")
}
```

**薪资字段说明（回应问题#3）：**
- `salaryMin`/`salaryMax` 由求职者在编辑工作经历时填写
- 显示位置：简历中心（seeker/resumeCenter/index.vue）、招聘官查看简历（recruiter/resumeCenter.vue）
- **前端问题 #22**：job.vue 当前表单缺少薪资字段，后端字段设为选填，等前端补充

**skillTags 说明（回应问题#3）：**
- 由求职者在编辑工作经历时填写（如：Vue、TypeScript、性能优化）
- 显示位置：同上
- **前端问题 #22**：job.vue 当前表单缺少技能标签字段

### 2.5 项目经历表（project_experiences）

```prisma
model ProjectExperience {
  id          String   @id @default(cuid())
  profileId   String
  name        String             // 项目名称
  role        String?            // 担任角色
  techTags    Json?              // 技术标签，如 ["Vue","uni-app"]，MySQL JSON 列，选填
  content     String?  @db.Text  // 项目内容描述
  startDate   DateTime?
  endDate     DateTime?
  sortOrder   Int      @default(0)
  profile     SeekerProfile @relation(fields: [profileId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([profileId])
  @@map("project_experiences")
}
```

**techTags 说明（回应问题#4）：**
- 由求职者在编辑项目经历时填写
- 显示位置：简历中心、招聘官查看简历
- **前端问题 #23**：project.vue 当前表单缺少技术标签字段

### 2.6 企业表（companies）

```prisma
model Company {
  id           String   @id @default(cuid())
  name         String
  logoUrl      String?
  industry     String?
  scale        String?            // 企业规模（如 20-99人）
  description  String?  @db.Text
  province     String?
  city         String?
  district     String?
  address      String?
  creditScore  Int      @default(0)
  status       Int      @default(1)
  recruiters   Recruiter[]
  jobs         Job[]
  createdAt    DateTime @default(now())

  @@index([name])
  @@map("companies")
}
```

### 2.7 招聘官表（recruiters）

**回应问题#5：** 招聘官来自 users 表，通过 role 字段区分。

```prisma
model Recruiter {
  id         String  @id @default(cuid())
  userId     String  @unique
  companyId  String
  jobTitle   String?            // 招聘官在公司的职位（如 HR经理）
  verifyStatus Int @default(0)  // 0:待审核 1:通过 2:拒绝
  user       User    @relation(fields: [userId], references: [id])
  company    Company @relation(fields: [companyId], references: [id])
  jobs       Job[]
  createdAt  DateTime @default(now())

  @@map("recruiters")
}
```

**角色权限设计（回应问题#5）：**

```
用户角色层级：
  SUPER_ADMIN（超级管理员）
    └── 可以：所有操作 + 工作认证 + 用户管理
  ADMIN（运营管理员）
    └── 可以：审核认证、管理职位、内容管理
  RECRUITER（招聘官）
    └── 可以：发布职位、查看简历、发面试邀请
  SEEKER（求职者，默认）
    └── 可以：填简历、投递、接收消息
```

**前端区分逻辑（登录后）：**
- JWT payload 中包含 `role` 字段
- 前端根据 `role` 决定进入求职者首页还是招聘官首页
- 同一用户不可同时是 SEEKER 和 RECRUITER（需明确区分）
- 如需切换角色，提供角色申请功能

### 2.8 职位表（jobs）

```prisma
model Job {
  id          String    @id @default(cuid())
  companyId   String
  recruiterId String
  title       String
  nature      JobNature @default(FULL)
  province    String?
  city        String?
  district    String?
  address     String?
  salaryMin   Int?
  salaryMax   Int?
  salaryText  String?            // "面议" 等特殊文本
  education   EducationLevel @default(NONE)
  experience  Int        @default(0)  // 0:不限 1:1年内 2:1-3年 3:3-5年 4:5-10年 5:10年以上
  gender      GenderReq  @default(ALL)
  description String?  @db.Text
  perks       String[]           // 职位诱惑标签
  viewCount   Int        @default(0)
  status      Int        @default(1)  // 1:发布 0:下架 2:审核中
  publishedAt DateTime?
  company     Company    @relation(fields: [companyId], references: [id])
  recruiter   Recruiter  @relation(fields: [recruiterId], references: [id])
  deliveries  Delivery[]
  favorites   JobFavorite[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([city, district])
  @@index([status, publishedAt])
  @@map("jobs")
}

enum JobNature { FULL PART INTERN }
enum EducationLevel { NONE ASSOCIATE BACHELOR MASTER DOCTOR }
enum GenderReq { ALL MALE FEMALE }
```

### 2.9 投递记录表（deliveries）

```prisma
model Delivery {
  id         String         @id @default(cuid())
  seekerId   String
  jobId      String
  status     DeliveryStatus @default(PENDING)
  creditAuthorized Boolean  @default(false)  // 是否授权查询信用分
  seeker     User           @relation(fields: [seekerId], references: [id])
  job        Job            @relation(fields: [jobId], references: [id])
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt

  @@unique([seekerId, jobId])
  @@index([seekerId])
  @@index([jobId])
  @@map("deliveries")
}

enum DeliveryStatus {
  PENDING      // 待查看
  VIEWED       // 已查看
  INTERVIEWING // 面试中
  REJECTED     // 不合适
  HIRED        // 已录用
}
```

### 2.10 消息表（messages）

```prisma
model Message {
  id          String      @id @default(cuid())
  type        MessageType
  senderId    String
  receiverId  String
  jobId       String?
  content     String      @db.Text
  extra       Json?               // 扩展字段（面试时间/地址等）
  isRead      Boolean     @default(false)
  sender      User        @relation("sender", fields: [senderId], references: [id])
  receiver    User        @relation("receiver", fields: [receiverId], references: [id])
  createdAt   DateTime    @default(now())

  @@index([receiverId, isRead])
  @@index([senderId, receiverId])
  @@map("messages")
}

enum MessageType { INVITE CHAT SYSTEM }
```

### 2.11 实名认证表（identity_verifications）

```prisma
model IdentityVerification {
  id           String   @id @default(cuid())
  userId       String   @unique
  realName     String
  idNumber     String               // AES-256 加密后存储
  idFrontUrl   String?              // 手持证件头像面（COS）
  idBackUrl    String?              // 手持证件国徽面（COS）
  idValidDate  DateTime?
  status       VerifyStatus @default(PENDING)
  rejectReason String?
  reviewedAt   DateTime?
  reviewerId   String?              // 审核的运营人员 user_id
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())

  @@map("identity_verifications")
}

enum VerifyStatus { PENDING APPROVED REJECTED }
```

### 2.12 工作认证表（work_certifications）

**认证粒度：(userId, companyId) 级别**  
同一用户同一公司的所有工作经历只需认证一次，认证通过后该用户在该公司的全部工作经历均视为已认证。

```prisma
model WorkCertification {
  id            String        @id @default(cuid())
  userId        String                         // 被认证的用户
  companyId     String                         // 被认证的公司
  certifierId   String?                        // 认证人 user_id（超管认证时可为 null）
  certifierType CertifierType
  status        CertStatus    @default(PENDING)
  note          String?
  // 分享认证相关：B 分享给 A，生成一次性 token 供 A 打开小程序使用
  shareToken    String?       @unique          // 一次性分享 token
  shareExpireAt DateTime?                      // token 过期时间（24h）
  user          User          @relation("certTarget", fields: [userId], references: [id])
  certifier     User?         @relation("certifier", fields: [certifierId], references: [id])
  company       Company       @relation(fields: [companyId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@unique([userId, companyId])               // 同用户同公司只有一条认证记录
  @@index([userId])
  @@index([companyId])
  @@index([certifierId])
  @@map("work_certifications")
}

enum CertifierType {
  ADMIN   // 超管直接认证
  PEER    // 同公司已认证用户认证（主动认证或分享认证均属此类）
}

enum CertStatus { PENDING APPROVED REVOKED }
```

**`work_experiences` 中的 `isVerified` 字段移除**，改为查询时联表判断：

```
work_experience 已认证 ⟺ work_certifications 存在 (userId=该用户, companyId=该公司, status=APPROVED)
```

### 2.13 职位收藏表（job_favorites）

```prisma
model JobFavorite {
  id        String   @id @default(cuid())
  userId    String
  jobId     String
  user      User     @relation(fields: [userId], references: [id])
  job       Job      @relation(fields: [jobId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, jobId])
  @@index([userId])
  @@map("job_favorites")
}
```

### 2.14 推荐记录表（recommendations）

```prisma
model Recommendation {
  id            String   @id @default(cuid())
  recommenderId String
  jobId         String
  company       String
  content       String?
  status        RecStatus @default(REVIEW)
  recommender   User     @relation(fields: [recommenderId], references: [id])
  createdAt     DateTime @default(now())

  @@index([recommenderId])
  @@map("recommendations")
}

enum RecStatus { DONE REVIEW }
```

---

## 3. 工作认证体系（详细设计）

### 3.1 认证粒度

**以 (用户, 公司) 为单位**，而非以单条工作经历为单位。  
同一用户在同一公司有多段工作经历，认证一次即视为全部认证。

```
认证链：
  超级管理员（SUPER_ADMIN）
    └── 运营后台直接认证用户在某公司的工作 → 写入 work_certifications (ADMIN)
         └── 被认证用户（在公司X有 APPROVED 记录）
              └── 可为其他声称在公司X工作的用户认证
                   └── 链式传播...
```

### 3.2 认证触发方式

认证支持两种触发路径（均属 PEER 类型）：

#### 路径一：B 主动分享给 A（主要路径）

用户 B 想让曾经同事 A 为自己认证时：

```
1. B 打开简历中心 → 工作经历列表 → 点击某公司旁的「分享认证」按钮
2. 后端生成一次性 shareToken（24h 有效），并在 work_certifications 写入 PENDING 记录
3. 前端调用 wx.shareAppMessage，生成小程序卡片（页面：/pages/certification/verify?token=xxx）
4. B 通过微信将卡片发送给 A
5. A 点击卡片 → 进入「认证确认页」，显示：
     "B 声称曾在 [公司名] 工作（[开始]-[结束]），请确认"
6. A 点击「确认」：
     系统校验 A 在该公司是否有 APPROVED 认证记录
     ✅ 通过 → work_certifications 状态更新为 APPROVED，shareToken 失效
     ❌ 不通过 → 提示"您没有在该公司的认证记录，无法为其认证"
```

#### 路径二：A 主动认证 B

```
1. A 在小程序内找到 B 的简历（通过招聘官简历库或搜索）
2. A 看到 B 有在公司X的工作经历（未认证状态）
3. A 点击「认证此段经历」
4. 系统校验 A 在公司X有 APPROVED 认证记录
5. ✅ 通过 → 直接写入/更新 work_certifications 为 APPROVED
```

### 3.3 冷启动（超管认证）

运营后台超管直接认证，解决"第一批已认证用户"问题：

1. 超管在运营后台搜索用户
2. 找到目标用户的工作经历
3. 点击「认证（某公司）」
4. 系统写入 work_certifications `{ certifierType: ADMIN, status: APPROVED }`
5. 该用户随即可作为认证链起点，为同公司他人认证

### 3.4 防作弊规则

- PEER 认证人必须在同公司有 APPROVED 的 work_certifications 记录
- 同一用户在同一公司只有一条认证记录（`@@unique([userId, companyId])`），防止重复计分
- shareToken 一次性使用，24h 过期
- 可疑认证链（同一用户短时间内大量认证同公司他人）触发人工复核标记

---

## 4. API 设计

### 4.1 规范

- **协议**：HTTPS  
- **Base URL**：`https://api.yucai-hr.com/v1`
- **认证**：`Authorization: Bearer <JWT>`
- **统一响应格式**：
```json
{ "code": 0, "message": "ok", "data": {} }
```
- **错误码**：`0`成功，`4001`未登录，`4003`无权限，`4221`参数错误，`5000`服务器错误

### 4.2 认证接口（auth）

```
POST /auth/register              注册（手机号+密码）
POST /auth/login                 登录，返回 JWT { token, expires_in, user }
POST /auth/sms/send              发送短信验证码（需传 phone + scene）
POST /auth/sms/verify            验证验证码
POST /auth/token/refresh         刷新 token（refresh_token）
DELETE /auth/logout              退出（服务端加入黑名单）
```

**JWT Payload 示例：**
```json
{
  "sub": "user_id_xxx",
  "phone": "138****8000",
  "role": "SEEKER",
  "idVerified": true,
  "iat": 1718688000,
  "exp": 1718695200
}
```

前端拿到 `role` 后决定进入求职者首页还是招聘官首页。

### 4.3 用户接口（users）

```
GET    /users/me                 获取当前用户信息
PUT    /users/me                 更新基础信息（昵称/头像）
PUT    /users/me/phone           修改手机号（需旧手机验证码）
GET    /users/me/profile         求职者详细资料
PUT    /users/me/profile         更新求职者详细资料
```

### 4.4 简历接口（resume）

```
GET    /resume                   获取我的完整简历
PUT    /resume/info              更新个人基础信息
PUT    /resume/self-desc         更新自我描述

POST   /resume/educations        新增教育经历
PUT    /resume/educations/:id    更新
DELETE /resume/educations/:id    删除

POST   /resume/works             新增工作经历（含可选字段：salaryMin, salaryMax, skillTags）
PUT    /resume/works/:id         更新
DELETE /resume/works/:id         删除

POST   /resume/projects          新增项目经历（含可选字段：techTags）
PUT    /resume/projects/:id      更新
DELETE /resume/projects/:id      删除
```

**工作经历新增请求（完整字段）：**
```json
{
  "company": "北京网聘咨询有限公司",
  "title": "高级软件工程师",
  "city": "北京",
  "salaryMin": 30000,
  "salaryMax": 45000,
  "skillTags": ["Vue", "uni-app", "性能优化"],
  "content": "负责前端架构设计...",
  "startDate": "2010-10-01",
  "endDate": null
}
```

> 注：`salaryMin`、`salaryMax`、`skillTags` 为选填字段，等待前端补充表单后再填写（问题 #22）

### 4.5 职位接口（jobs）

```
GET    /jobs                     职位列表（支持筛选+分页）
GET    /jobs/:id                 职位详情
GET    /jobs/:id/similar         相似职位（3条）
POST   /jobs/:id/view            记录浏览（防刷：IP+userId限制）
POST   /jobs/:id/deliver         投递简历（含授权查信用分）
GET    /deliveries               我的投递记录（分页）
GET    /favorites/jobs           我的收藏（分页）
POST   /favorites/jobs/:id       收藏
DELETE /favorites/jobs/:id       取消收藏
```

**职位列表查询参数（全国范围）：**
```
?province=四川省&city=成都市&district=青羊区
&nature=full&salaryMin=5000&salaryMax=12000
&education=bachelor&experience=2
&keyword=前台&industry=餐饮&gender=female
&page=1&pageSize=10
```

### 4.6 招聘官接口（recruiter）

```
POST   /recruiter/jobs           发布职位（status=2审核中）
PUT    /recruiter/jobs/:id       编辑职位
DELETE /recruiter/jobs/:id       下架职位（status=0）
GET    /recruiter/jobs           我发布的职位（分页）

GET    /recruiter/resumes        简历库（筛选+分页）
GET    /recruiter/resumes/:uid   查看某求职者简历（需该求职者投递过本公司职位）
POST   /recruiter/invites        发送面试邀请（创建 Message type=INVITE）

GET    /recruiter/talents        人才收藏库
POST   /recruiter/talents/:uid   加入人才库
DELETE /recruiter/talents/:uid   移出
```

### 4.7 消息接口（messages）

```
GET    /messages/invites         面试邀请列表（分页）
GET    /messages/chats           聊天会话列表
GET    /messages/chats/:uid      与某用户聊天记录（分页）
POST   /messages/chats/:uid      发送消息
PUT    /messages/read            批量标记已读（传 ids[]）
GET    /messages/unread-count    未读消息总数
```

### 4.8 WebSocket 事件

```
连接：WSS /ws?token=<jwt>

服务端推送事件：
  message:new   { type, senderId, content, jobId? }
  invite:new    { companyName, jobTitle, interviewTime, address, phone }
  credit:update { newScore, reason }
```

### 4.9 认证接口（verifications）

```
POST   /verifications/identity              提交实名认证（上传照片+信息）
GET    /verifications/identity              查询我的实名认证状态

// 工作认证 - 分享路径（B 生成分享 token）
POST   /verifications/work/share            B 发起分享认证请求
                                            body: { companyId }
                                            返回: { shareToken, shareExpireAt }
                                            （前端用 shareToken 拼接小程序卡片跳转参数）

// 工作认证 - A 确认
POST   /verifications/work/confirm          A 扫码/点卡片后确认认证
                                            body: { shareToken }
                                            返回: 认证结果

// 工作认证 - A 主动认证 B
POST   /verifications/work/certify          A 主动认证 B 在某公司的工作
                                            body: { targetUserId, companyId }

GET    /verifications/work/me               我的工作认证记录
```

### 4.10 运营管理接口（admin）

```
GET    /admin/users              用户列表（搜索/筛选）
GET    /admin/users/:id          用户详情
PATCH  /admin/users/:id/status   禁用/启用用户

GET    /admin/verifications      实名认证待审核列表
PATCH  /admin/verifications/:id/approve  通过认证（同时更新 users.idVerifiedAt）
PATCH  /admin/verifications/:id/reject   拒绝认证（附原因）

POST   /admin/work-certify       超管直接认证用户在某公司的工作
                                 body: { userId, companyId }

GET    /admin/jobs               职位列表（含待审核）
PATCH  /admin/jobs/:id/status    下架/恢复职位

GET    /admin/companies          企业列表
POST   /admin/companies          新增企业（运营端录入）
PUT    /admin/companies/:id      修改企业信息

GET    /admin/stats              数据统计（用户数/职位数/投递量等）
```

### 4.11 文件上传接口

```
POST   /upload/avatar            上传头像（返回 COS URL）
POST   /upload/id-photo          上传身份证照片（限 identity_verifications 使用）
```

---

## 5. 前端 Mock 替换映射（回应问题#9）

所有 Mock 数据对应的真实 API 如下：

| 页面 | Mock 内容 | 对应真实 API |
|------|-----------|------------|
| login/index | `mock-token-${Date.now()}` | `POST /auth/login` |
| seeker/index | `jobs` 职位列表 | `GET /jobs` |
| seeker/index | `banners` 轮播 | `GET /admin/banners`（运营端配置） |
| seeker/resumeCenter | `user`, `education`, `workSteps`, `projectSteps` | `GET /resume` |
| recruiter/index | `people` 最新简历 | `GET /recruiter/resumes?sort=latest` |
| recruiter/index | `newsAll` 最新动态 | `GET /admin/news`（运营端配置） |
| message/index | 面试邀请列表 | `GET /messages/invites` |
| message/index | 聊天列表 | `GET /messages/chats` |
| recommendation/index | 推荐记录 | `GET /recommendations` |
| mine/index | `isLoggedIn`, `userName` | 从 JWT + `GET /users/me` |
| mine/submitted | 投递记录 | `GET /deliveries` |
| mine/jobCollection | 收藏职位 | `GET /favorites/jobs` |
| recommendation/detail/index | 职位详情 | `GET /jobs/:id` |

---

## 6. 职业信用体系设计

### 6.1 求职者信用评分维度（初版，满分 100）

| 维度 | 分值 | 触发条件 |
|------|------|---------|
| 实名认证 | +20 | `identity_verifications.status = APPROVED` |
| 工作经历认证 | +20（每条，最多3条共60） | `work_experience.isVerified = true` |
| 简历完整度 | +10 | 教育/工作/项目/自我描述均有内容 |
| 按时赴约 | +5/次 | 面试邀请接受后，企业确认出席 |
| 爽约记录 | -10/次 | 已接受但未出席且无提前告知 |
| 企业差评 | -5/次 | 经运营审核的有效差评 |

### 6.2 企业信用评分维度（初版）

| 维度 | 说明 |
|------|------|
| 营业执照认证 | 运营端上传并审核 |
| 薪资兑现率 | 员工填写实际工资与发布薪资的对比 |
| 面试爽约率 | 发出邀请后未如约的比例 |
| 用户投诉次数 | 经审核的有效投诉 |

---

## 7. 运营端设计（回应问题#8）

### 7.1 定位

运营端是独立的 H5 管理后台，URL：`https://admin.yucai-hr.com`，不在微信小程序内。

### 7.2 MVP 功能（最简）

| 模块 | 功能 |
|------|------|
| **用户管理** | 列表/搜索/查看详情/禁用启用 |
| **实名认证审核** | 查看提交的证件照片、姓名、证件号，点击通过/拒绝 |
| **工作经历认证** | 超管直接搜索用户工作经历并认证 |
| **职位管理** | 查看待审核职位，通过/拒绝（若开启职位审核） |
| **企业管理** | 录入/修改企业信息、认证状态 |
| **数据概览** | 注册用户数、今日投递量、待审核数量等基础数字 |

### 7.3 运营端技术方案（MVP）

- **方案**：独立 Vue3 + Vite + Element Plus H5 应用
- **认证**：独立登录页，管理员账号由超管创建，不走用户端登录
- **API**：复用后端 `/admin/*` 路由，管理员 JWT 中 `role = ADMIN` 或 `SUPER_ADMIN`

---

## 8. 安全设计

| 安全点 | 方案 |
|--------|------|
| 密码存储 | bcrypt 哈希，salt rounds = 12 |
| 身份证号 | AES-256 加密后存储，密钥单独管理 |
| JWT | access_token 2小时，refresh_token 7天，服务端黑名单 |
| 验证码 | Redis 存储，5分钟有效，同号码1分钟限1次 |
| 身份证照片 | COS 私有桶，URL 签名访问（15分钟有效），审核通过后删除 |
| API 限流 | Redis 令牌桶，登录接口 5次/分钟/IP |
| HTTPS | 腾讯云 CLB 证书，强制 HTTPS |
| SQL注入 | Prisma 参数化查询，禁止原生 SQL 拼接 |
| XSS | 所有用户输入在存储前清洗（xss 库） |

---

## 9. 全国化支持（回应问题#10）

**平台范围**：面向全国，不限于成都

省市区数据方案：
- 使用标准行政区划数据（国家统计局2024年版）
- 数据库存全国 `provinces`、`cities`、`districts` 三张表
- 前端职位筛选时通过 API 动态加载，不在前端硬编码
- 现有前端 `jobPosting.vue` 中硬编码的省市数据（仅4省）需替换（问题 #24）

---

## 10. 部署规划

```
生产环境（腾讯云）：
  CLB（负载均衡）
    ├── API 服务 × 2（CVM 2核4G）
    └── WebSocket 服务 × 1（CVM 2核4G）
  MySQL 8.0（腾讯云 CDB for MySQL 高可用版，2核4G）
  Redis 7（腾讯云 Redis 标准版）
  COS（私有桶：id-photos；公有桶：avatars, logos）
  管理后台（运营端 H5，同 CLB，第二阶段上线）

本地开发：
  docker-compose（MySQL 8.0 + Redis）
  NestJS 热重载
  前端：微信开发者工具（dev:mp-weixin）
```

---

## 11. 开发阶段规划（v0.3 更新）

> **原则：用户端 MVP 先行，验证通过后再开发运营端。**

### 第一阶段：用户端 MVP（预计 4-6 周）

1. 后端项目初始化（NestJS + Prisma + MySQL 8.0）
2. 认证模块（注册/登录/JWT/短信验证码）
3. 求职者简历 CRUD（含工作/教育/项目经历）
4. 职位模块（发布/列表/详情/投递/收藏）
5. 招聘官基础功能（简历浏览、面试邀请）
6. 前端对接替换 Mock（登录、简历、职位）
7. **灌入测试数据**（用户、职位、公司、简历）

### 第二阶段：运营端 MVP（用户端验证通过后开始）

1. 独立 H5 管理后台（Vue3 + Element Plus）
2. 用户管理（列表/禁用/启用）
3. 实名认证审核
4. 超管工作经历认证（冷启动）
5. 职位管理（强制下架）
6. 企业管理（录入/修改）

### 第三阶段：消息 + 信用体系

1. 消息中心 WebSocket（聊天/面试邀请通知）
2. 工作认证链（分享认证 + 主动认证）
3. 实名认证完整流程（含用户端页面）
4. 信用评分计算
5. 信用异议流程

### 第四阶段：增长（按需）

1. 智能职位推荐
2. 视频面试（声网 Agora）
3. 运营端完整功能
4. 数据分析与统计
