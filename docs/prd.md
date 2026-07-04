# 育才 HR — 产品需求文档（PRD）

> 版本：v1.0  
> 日期：2026-06-25  
> 范围：以现有代码实现为基准，完整记录产品逻辑

---

## 目录

1. [用户与角色](#1-用户与角色)
2. [整体导航结构](#2-整体导航结构)
3. [认证与会话](#3-认证与会话)
4. [求职者端](#4-求职者端)
5. [招聘官端](#5-招聘官端)
6. [消息中心](#6-消息中心)
7. [个人中心（通用）](#7-个人中心通用)
8. [工作认证体系](#8-工作认证体系)
9. [职业信用体系](#9-职业信用体系)
10. [运营端](#10-运营端)
11. [数据模型速查](#11-数据模型速查)
12. [API 接口清单](#12-api-接口清单)

---

## 1. 用户与角色

系统共有四种角色，写入 JWT payload，前端据此决定导航路径。

| 角色 | 说明 | 进入首页 |
|------|------|---------|
| `SEEKER` | 求职者（注册默认角色） | `pages/seeker/index` |
| `RECRUITER` | 招聘官（需额外注册档案） | `pages/recruiter/index` |
| `ADMIN` | 运营管理员 | 运营端 H5 |
| `SUPER_ADMIN` | 超级管理员 | 运营端 H5 + 额外认证权限 |

**约束：**
- 同一账号不可同时是 SEEKER 和 RECRUITER
- RECRUITER 需完成"招聘者档案"注册（填写姓名、部门、关联企业）后才能使用招聘功能
- ADMIN / SUPER_ADMIN 账号由超管在运营端创建，不走小程序注册流程

---

## 2. 整体导航结构

### 2.1 求职者端 BottomNav（4 Tab）

```
首页          (/pages/seeker/index)
消息          (/pages/message/index)
简历中心      (/pages/seeker/resumeCenter/index)
我的          (/pages/mine/index)
```

### 2.2 招聘官端 BottomNav（4 Tab）

```
首页          (/pages/recruiter/index)
找人才        (/pages/recruiter/talents)
简历中心      (/pages/recruiter/resumeCenter)
我的          (/pages/mine/index)
```

**角色隔离规则：**
- `seeker/index` 顶层同步检测角色，RECRUITER 立即 `reLaunch` 到 `recruiter/index`
- `BottomNav` 组件在模块初始化时同步读取 storage 中的角色，渲染对应 Tab 列表
- `mine/index` 中的快捷操作和菜单也按角色区分

### 2.3 页面鉴权

所有业务页面设置 `needLogin: true`，未携带 token 时自动跳转登录页，并携带 `redirect` 参数，登录后返回原目标页。

---

## 3. 认证与会话

### 3.1 登录

**页面：** `pages/login/index`

- 手机号（1 开头 11 位）+ 密码登录
- 登录成功：
  - `token` 写入 `uni.storage`
  - `userInfo`（id / phone / role / nickname / idVerified）写入 `uni.storage`
  - 根据 `role` 跳转对应首页（RECRUITER → `recruiter/index`，其余 → `seeker/index`）
- 登录失败：展示后端返回的错误信息
- 支持 `redirect` 参数：登录后跳回原页面

**接口：**
```
POST /v1/auth/login
body: { phone, password }
返回: { token, user: { id, phone, role, nickname, idVerified } }
```

### 3.2 会话管理

- token 存 `uni.storage`，每次请求放入 `Authorization: Bearer <token>` Header
- 后端返回 401 时，`request.ts` 自动清除 storage 并跳转登录页
- 当前版本：token 无过期刷新机制（TODO）

---

## 4. 求职者端

### 4.1 首页

**页面：** `pages/seeker/index`

| 模块 | 内容 | 数据来源 |
|------|------|---------|
| 搜索栏 | 关键词输入，回车触发搜索 | 本地过滤 / `GET /v1/jobs?keyword=` |
| Banner 轮播 | 3 张轮播图，自动播放 | 前端硬编码（TODO：接运营端 API） |
| 快捷入口 | 全职职位 / 兼职职位 / 我的投递 / 企业信用 | 点击附带 `nature` 参数跳转职位列表 |
| 职位推荐列表 | 职位卡片：名称、薪资、标签（城市/学历）、公司、时间 | `GET /v1/jobs` |
| 换一批 | 重新请求职位列表 | `GET /v1/jobs`（随机偏移） |

**职位卡片字段：** 职位名、薪资范围、城市标签、学历标签、公司名、发布时间相对显示（x天前）

### 4.2 职位搜索与筛选

**页面：** `pages/recommendation/position/index`

筛选维度（均为可选组合）：

| 筛选项 | 说明 |
|--------|------|
| 地区 | 省/市/区三级联动 |
| 行业 | 下拉单选 |
| 薪资 | 范围选择 |
| 工作性质 | 全职 / 兼职 / 实习 |
| 学历要求 | 不限/大专/本科/硕士/博士 |
| 工作年限 | 不限/1年以内/1-3年/3-5年/5-10年/10年以上 |

**接口：**
```
GET /v1/jobs
params: { page, limit, city, keyword, nature, minDegree, minExpYears, ... }
```

### 4.3 职位详情

**页面：** `pages/recommendation/detail/index`

**展示信息：**
- 职位名称、薪资范围、工作性质标签
- 工作城市·区、最低学历、最低工作年限
- 所属公司名（点击跳公司详情）、浏览量
- 职位描述（岗位职责 + 任职要求）
- 职位诱惑（标签，如「五险一金」）
- 工作地址

**底部操作栏（求职者视角）：**
- 分享 / 收藏（切换状态）/ 投诉（占位）
- 立即沟通（跳转聊天，TODO）
- 投递简历（弹出确认弹窗）

**底部操作栏（招聘官视角）：**
- 编辑职位（跳 `jobPosting?editId=xxx`）

**投递确认弹窗：**
1. 提示"投递 [职位名]"
2. 勾选"同意用人单位查询个人职业信用评价"（必选）
3. 确认投递 → 防重投（同一职位只能投一次，提示"已投递"）

**接口：**
```
GET  /v1/jobs/:id                 职位详情（含 isFavorited 字段）
POST /v1/jobs/:id/deliver         投递，body: { creditAuthorized: true }
POST /v1/jobs/:id/favorite        收藏
DELETE /v1/jobs/:id/favorite      取消收藏
```

### 4.4 简历中心（求职者）

**页面：** `pages/seeker/resumeCenter/index`

**展示模块：**

| 模块 | 可编辑 | 跳转页 |
|------|--------|-------|
| 个人基础信息（姓名/职业定位/手机号/头像） | 是 | `resumeCenter/Information` |
| 自我描述 | 是 | `resumeCenter/selfDesc` |
| 教育经历（时间线） | 增/改/删 | `resumeCenter/education?id=` |
| 工作经历（时间线） | 增/改/删/申请认证 | `resumeCenter/job?id=` |
| 项目经历（时间线） | 增/改/删 | `resumeCenter/project?id=` |

**工作经历操作细节：**
- 每条旁有「编辑」「删除」「申请认证」三个按钮
- 删除需二次确认弹窗
- 认证状态徽章：无认证 / 认证中 / 已认证
- 已认证状态点击「查看」跳 `workCertification`

**编辑模式（工作/项目经历）：**
- URL 带 `?id=xxx` 时页面标题变为"编辑 XXX 经历"
- `onMounted` 加载已有数据预填表单
- 保存调 `PUT` 接口，新增调 `POST` 接口

**接口（简历模块）：**
```
GET  /v1/resume/profile              个人信息
PUT  /v1/resume/profile              更新个人信息
GET  /v1/resume/self-desc            自我描述
PUT  /v1/resume/self-desc            更新自我描述
GET  /v1/resume/education            教育经历列表
POST /v1/resume/education            新增
PUT  /v1/resume/education/:id        编辑
DELETE /v1/resume/education/:id      删除
GET  /v1/resume/work-exp             工作经历列表
POST /v1/resume/work-exp             新增
PUT  /v1/resume/work-exp/:id         编辑
DELETE /v1/resume/work-exp/:id       删除
GET  /v1/resume/project-exp          项目经历列表
POST /v1/resume/project-exp          新增
PUT  /v1/resume/project-exp/:id      编辑
DELETE /v1/resume/project-exp/:id    删除
GET  /v1/resume/certifications       工作认证记录
```

### 4.5 我的投递

**页面：** `pages/mine/submitted`

- 分页列表，显示已投递的职位（职位名/公司/投递时间/状态）
- 投递状态：待处理 / 已查看 / 已邀请 / 通过 / 不合适

**接口：**
```
GET /v1/jobs/my-deliveries
```

### 4.6 职位收藏

**页面：** `pages/mine/jobCollection`

- 分页列表，显示已收藏的职位卡片
- 可点击进入职位详情，可取消收藏

**接口：**
```
GET /v1/jobs/my-favorites
```

---

## 5. 招聘官端

### 5.1 招聘者档案注册 / 编辑

**页面：** `pages/recruiter/registration`

**注册流程（3步）：**

```
Step 0 — 联系人信息
  ├── 真实姓名（必填）
  ├── 所在部门（必填）
  └── 联系电话（选填）

Step 1 — 企业信息
  ├── 搜索已有企业（按名称，防抖 400ms）
  ├── 选择企业后显示选中状态
  └── 未找到时 → 填写新企业（名称+城市+行业）并创建

Step 2 — 完成页
  └── 返回首页按钮
```

**编辑模式：**
- 从「我的」→「我的资料」跳转此页
- `onMounted` 调 `GET /v1/recruiter/profile` 预填现有数据
- 提交时调 `PUT /v1/recruiter/profile`

**接口：**
```
GET  /v1/recruiter/profile           获取档案（未注册返回 404）
POST /v1/recruiter/profile           首次注册，body: { realName, companyId, department, contactPhone? }
PUT  /v1/recruiter/profile           编辑档案
GET  /v1/companies?keyword=          搜索企业
POST /v1/companies                   创建企业，body: { name, city, industry? }
```

### 5.2 招聘官首页

**页面：** `pages/recruiter/index`

| 模块 | 内容 | 数据来源 |
|------|------|---------|
| 搜索栏 | 关键词搜索求职者 | 跳转 `talents` 页带参 |
| Banner 轮播 | 同求职者端 | 前端硬编码 |
| 最新简历 | 横向滚动卡片：头像/姓名/职位/经验/学历/城市 | `GET /v1/recruiter/seekers` |
| 换一批 | 重新拉取求职者列表 | 同上，随机偏移 |
| 点击卡片 | 跳转简历详情 | 带 `userId` 参数 |

### 5.3 找人才

**页面：** `pages/recruiter/talents`

- 全量求职者列表，分页加载
- 支持关键词搜索（防抖 400ms）
- 卡片：头像/姓名/职位/城市/最近活跃
- 点击跳转 `resumeDetail?userId=xxx`

**接口：**
```
GET /v1/recruiter/seekers
params: { page, limit, keyword, city }
```

### 5.4 简历详情（招聘官）

**页面：** `pages/recruiter/resumeDetail`

**展示内容：**
- 求职者头像/姓名/职位/城市
- 完整简历：教育经历、工作经历（含认证状态）、项目经历、自我描述

**底部操作栏（始终可见）：**
- 通知面试（弹出面试邀请弹窗）

**面试邀请弹窗：**
- 自动选中第一个可用职位
- 下拉选择面试职位（来自 `GET /v1/jobs/my-posted`）
- 填写面试时间（文本，如"2026-07-01 14:00"）
- 填写地点/方式（文本）
- 备注（可选）
- 弹窗打开时底部栏隐藏（z-index 控制，防遮挡）
- 发送后记录 INTERVIEW 类型的 Message，并更新投递状态为 INTERVIEW

**接口：**
```
GET  /v1/recruiter/seekers/:userId   求职者完整简历
GET  /v1/jobs/my-posted             我的已发布职位列表（用于选择面试职位）
POST /v1/recruiter/invite           发送面试邀请
     body: { seekerUserId, jobId, content }
```

### 5.5 简历中心（招聘官投递管理）

**页面：** `pages/recruiter/resumeCenter`

**Tab 结构（5 个 Tab）：**

| Tab | 筛选条件 |
|-----|---------|
| 全部 | 无筛选 |
| 待处理 | status = PENDING |
| 已邀请 | status = INTERVIEW |
| 通过 | status = ACCEPTED |
| 不合适 | status = REJECTED |

**投递卡片字段：** 头像/姓名/职位/投递职位/城市/时间/状态徽章

**状态徽章颜色规则：**
- 待处理 → 橙色
- 已查看 → 灰色
- 已邀请 → 蓝色
- 通过 → 绿色
- 不合适 → 浅灰

**卡片操作（待处理 Tab）：**
- 不合适：二次确认 → `PUT /v1/recruiter/deliveries/:id/status { status: 'REJECTED' }`
- 通知面试：弹出面试邀请弹窗（同 5.4 节）

**点击卡片主体：** 跳转 `resumeDetail?userId=xxx`

**接口：**
```
GET /v1/recruiter/deliveries
params: { page, limit, status? }
PUT /v1/recruiter/deliveries/:id/status
body: { status: 'VIEWED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' }
```

### 5.6 职位发布

**页面：** `pages/recruiter/jobPosting`

**表单字段：**

| 字段 | 类型 | 验证 |
|------|------|------|
| 职位名称 | 文本输入 | 必填 |
| 工作性质 | 按钮组单选（全职/兼职/实习） | 必填 |
| 工作省/市/区 | 三级联动 picker | 必填 |
| 详细地址 | 文本输入 | 选填 |
| 薪资范围 | picker 选择 | 必填 |
| 最低学历 | picker 选择 | 必填 |
| 工作年限 | picker 选择 | 必填 |
| 职位描述 | 多行文本 | 必填 |
| 职位诱惑 | 多选标签 | 选填 |

**薪资范围选项（标准化）：** `3k-5k / 5k-8k / 8k-12k / 12k-20k / 20k以上 / 面议`

**最低学历选项：** `不限 / 大专 / 本科 / 硕士 / 博士`

**工作年限选项：** `不限 / 1年以内 / 1-3年 / 3-5年 / 5-10年 / 10年以上`

**职位诱惑标签：** `周末双休 / 五险一金 / 弹性工作 / 出国旅游 / 免费体检`

**底部操作：**
- 预览职位（表单通过验证后弹出预览弹窗）
- 发布职位 / 保存职位（编辑模式）

**创建/编辑逻辑：**
- URL 无 `editId` 参数 → 创建模式：标题"职位发布"，按钮"发布职位"
- URL 带 `editId=xxx` → 编辑模式：标题"编辑职位"，按钮"保存职位"
- 编辑模式 `onMounted` 调 `GET /v1/jobs/:id` 预填表单
- 非标薪资（DB 历史数据）加载时注入到 picker 顶部显示，允许更换为标准选项

**接口：**
```
POST /v1/jobs              发布新职位
PUT  /v1/jobs/:id          编辑职位
GET  /v1/jobs/:id          加载职位数据（编辑模式预填）
```

### 5.7 我的职位

**页面：** `pages/recruiter/myJobs`

- 显示当前招聘官发布的全部职位
- 卡片字段：职位名/工作性质/城市/薪资/状态徽章/发布时间
- 状态徽章：招聘中（绿）/ 已关闭（灰）/ 已暂停（橙）
- 「编辑」按钮 → `jobPosting?editId=xxx`
- 「下线」按钮 → 二次确认弹窗 → `DELETE /v1/jobs/:id` → 从列表移除

**接口：**
```
GET    /v1/jobs/my-posted
DELETE /v1/jobs/:id
```

---

## 6. 消息中心

**页面：** `pages/message/index`

### 6.1 求职者：面试邀请 Tab

- 列表显示招聘官发来的面试邀请
- 卡片：公司名/职位/发送时间/已读状态
- 点击展开详情：面试职位、面试时间、地点/方式、备注
- 点击后标记已读

**接口：**
```
GET   /v1/messages/invites
params: { page, limit }
PATCH /v1/messages/:id/read
```

### 6.2 聊天 Tab

- 聊天会话列表（TODO：WebSocket 实时通信未实现）

---

## 7. 个人中心（通用）

**页面：** `pages/mine/index`

### 7.1 未登录状态

- 显示"未登录/注册"占位
- 点击跳转登录页

### 7.2 已登录状态

**头部信息区：**
- 头像（默认图）
- 昵称
- 认证状态徽章（互斥显示）：
  - 未实名认证 → 橙色「未认证」，点击跳 `mine/verification`
  - 已实名认证 → 绿色「已认证」，点击跳 `mine/certificate`
- 「我的资料」按钮：
  - 求职者 → 跳 `mine/changePhone`（修改手机号/昵称）
  - 招聘官 → 跳 `recruiter/registration`（编辑档案）

### 7.3 求职者快捷操作

| 按钮 | 跳转 |
|------|------|
| 投递记录 | `pages/mine/submitted` |
| 职位收藏 | `pages/mine/jobCollection` |
| 推荐记录 | `pages/mine/referralHistory` |

### 7.4 招聘官快捷操作

| 按钮 | 跳转 |
|------|------|
| 发布职位 | `pages/recruiter/jobPosting` |
| 简历中心 | `pages/recruiter/resumeCenter` |
| 我的职位 | `pages/recruiter/myJobs` |

### 7.5 菜单列表

**求职者菜单：** 面试须知 / 信用异议 / 设置 / 意见反馈

**招聘官菜单：** 设置 / 意见反馈

### 7.6 实名认证

**页面：** `pages/mine/verification`

流程：
1. 上传手持身份证头像面照片
2. 上传手持身份证国徽面照片
3. 填写真实姓名
4. 填写身份证号
5. 选择证件有效期
6. 勾选"同意对个人信用评估"
7. 提交 → 运营端人工审核 → 通过后 `idVerified = true`

---

## 8. 工作认证体系

### 8.1 认证粒度

以 **(用户, 公司)** 为单位。同一用户在同一公司有多段工作经历，认证一次即覆盖全部。

认证状态查询方式：联查 `work_certifications` 表，存在 `(userId, companyId, status=APPROVED)` 记录即为已认证。

### 8.2 认证链与角色

```
SUPER_ADMIN
  └── 运营后台直接认证 → 写入 ADMIN 类型记录（冷启动）
        └── 被认证用户（在公司 X 有 APPROVED 记录）
              └── 可为同公司他人认证（PEER 类型）
                    └── 链式传播...
```

### 8.3 分享认证流程（主路径）

```
用户 B（被认证方）:
  1. 简历中心 → 工作经历 → 点击「申请认证」
  2. 后端生成 shareToken（7天有效），写入 PENDING 记录
  3. 返回分享链接，用户 B 发送给同事 A

用户 A（认证方，需在该公司有 APPROVED 记录）:
  4. 打开分享链接 → pages/seeker/resumeCenter/workCertification?shareToken=xxx
  5. 展示"B 声称曾在 [公司名] 工作，请确认"
  6. 点击「确认认证」→ POST /v1/resume/certify/:shareToken
  7. 系统校验 A 在该公司是否有 APPROVED 记录：
     ✅ 通过 → 更新状态为 APPROVED，shareToken 失效
     ❌ 不通过 → 提示"您没有该公司的认证记录"
```

### 8.4 接口

```
POST /v1/resume/work-exp/:id/request-cert   B 申请认证，返回 shareToken
GET  /v1/resume/certify/:shareToken          获取认证详情（A 查看被认证方信息）
POST /v1/resume/certify/:shareToken          A 确认认证
GET  /v1/resume/certifications              查看我的认证记录列表
```

### 8.5 防作弊规则

- PEER 认证人必须在同公司有 `APPROVED` 记录
- 同一 (userId, companyId) 只有一条认证记录，重复认证为更新操作
- shareToken 一次性，过期后失效
- 工作经历需关联 `companyId`（即已与平台企业库中的企业匹配）才能发起认证

---

## 9. 职业信用体系

### 9.1 求职者信用分（满分 100，当前为规划阶段）

| 维度 | 分值 | 触发条件 |
|------|------|---------|
| 实名认证 | +20 | 运营端审核通过 |
| 工作认证（每家公司） | +20，上限 60 | `work_certifications.status = APPROVED` |
| 简历完整度 | +10 | 教育/工作/项目/自我描述均有内容 |
| 按时赴约 | +5/次 | 面试邀请后企业确认出席 |
| 爽约记录 | -10/次 | 已接受但未出席且无提前告知 |
| 企业差评 | -5/次 | 经运营审核的有效差评 |

### 9.2 信用分展示

- 求职者投递职位时可授权招聘官查询信用分（`creditAuthorized` 字段）
- 首页快捷入口「企业信用」（查看企业信用信息，TODO）
- 个人中心菜单「信用异议」（对异常扣分申诉，TODO）

### 9.3 企业信用评分维度（规划）

| 维度 | 说明 |
|------|------|
| 营业执照认证 | 运营端上传并审核 |
| 薪资兑现率 | 员工填写实际工资与发布薪资对比 |
| 面试爽约率 | 发出邀请后未如约比例 |
| 用户投诉次数 | 经审核的有效投诉 |

---

## 10. 运营端

运营端为**独立 H5 管理后台**，URL `https://admin.yucai-hr.com`，不在微信小程序内运行。

### 10.1 登录

- 管理员账号由超管创建，不走小程序注册流程
- 手机号或邮箱 + 密码登录
- JWT role 为 `ADMIN` 或 `SUPER_ADMIN`

### 10.2 菜单结构

```
运营端
├── 首页（Dashboard 数据概览）
├── 用户管理
│   ├── 用户列表（搜索/筛选/禁用/启用）
│   └── 实名认证审核（查看证件照 → 通过/拒绝）
├── 认证管理
│   └── 工作经历认证（SUPER_ADMIN 专属，直接认证用户在某公司的经历）
├── 招聘管理
│   ├── 职位列表（查看/强制下架）
│   └── 企业管理（录入/修改/认证标志）
└── 内容管理
    ├── Banner 管理（上传/排序/启用停用）
    └── 动态管理（新增/编辑文章，招聘官首页展示）
```

### 10.3 核心功能说明

**实名认证审核流程：**
```
求职者提交（照片 + 姓名 + 证件号）
  → 待审核列表（PENDING）
  → 运营人员查看大图核实信息
  → 通过：users.idVerifiedAt 打时间戳
  → 拒绝：填写原因，用户端显示"审核未通过"
```

**超管工作认证（冷启动）：**
```
搜索用户 → 找到目标用户工作经历 → 点击「认证（某公司）」
→ 写入 work_certifications { certifierType: ADMIN, status: APPROVED }
→ 该用户可作为链式认证起点
```

**数据概览指标：** 注册用户数（求职者/招聘官分开）、今日新增、待审核认证数、今日投递量、职位在线数

### 10.4 权限边界

| 功能 | ADMIN | SUPER_ADMIN |
|------|-------|-------------|
| 用户管理 | 查看/禁用 | 全部 |
| 实名认证审核 | 全部 | 全部 |
| 工作经历认证 | 只读 | 可认证 |
| 职位管理 | 全部 | 全部 |
| 企业管理 | 全部 | 全部 |
| 创建管理员账号 | 不可 | 可 |

---

## 11. 数据模型速查

### 核心表结构

| 表 | 主要字段 | 说明 |
|----|---------|------|
| `users` | id / phone / passwordHash / role / nickname / idVerifiedAt | 所有角色共用 |
| `seeker_profiles` | userId / realName / city / roleTitle / selfDesc / creditScore | 求职者扩展信息 |
| `educations` | profileId / school / major / degree / startDate / endDate | |
| `work_experiences` | profileId / company / title / city / skillTags(JSON) / content / startDate / endDate | skillTags 为 JSON 数组 |
| `project_experiences` | profileId / name / role / techTags(JSON) / content | techTags 为 JSON 数组 |
| `recruiters` | userId / companyId / realName / department / contactPhone | |
| `companies` | name / industry / city / isVerified / creditScore | |
| `jobs` | recruiterId / companyId / title / nature / province / city / salaryRange / minDegree / minExpYears / status / perks(JSON) | status: ACTIVE/CLOSED/PAUSED |
| `deliveries` | userId / jobId / status / creditAuthorized | status: PENDING/VIEWED/INTERVIEW/ACCEPTED/REJECTED |
| `job_favorites` | userId / jobId | @@unique([userId, jobId]) |
| `messages` | type / senderId / receiverId / jobId / content / isRead | type: INVITE/CHAT/SYSTEM |
| `identity_verifications` | userId / realName / idNumber(加密) / idFrontUrl / idBackUrl / status | status: PENDING/APPROVED/REJECTED |
| `work_certifications` | userId / companyId / certifierId / certifierType / status / shareToken | @@unique([userId, companyId]) |

### 关键枚举

```
DeliveryStatus:  PENDING / VIEWED / INTERVIEW / ACCEPTED / REJECTED
JobNature:       FULL_TIME / PART_TIME / INTERNSHIP
DegreeLevel:     ANY / ASSOCIATE / BACHELOR / MASTER / DOCTOR
CertStatus:      PENDING / APPROVED / REVOKED
CertifierType:   ADMIN / PEER
MessageType:     INVITE / CHAT / SYSTEM
VerifyStatus:    PENDING / APPROVED / REJECTED
```

---

## 12. API 接口清单

所有接口 Base URL：`http://localhost:3000/v1`（开发）/ `https://api.yucai-hr.com/v1`（生产）

鉴权：`Authorization: Bearer <JWT>`（标注 🔓 的为公开接口）

### 认证

| Method | Path | 说明 |
|--------|------|------|
| POST 🔓 | `/auth/login` | 登录，返回 token + userInfo |

### 用户

| Method | Path | 说明 |
|--------|------|------|
| GET | `/users/me` | 当前用户信息 |
| PUT | `/users/me` | 更新昵称 |
| POST | `/users/me/avatar` | 上传头像（stub，待接 COS） |

### 简历（求职者）

| Method | Path | 说明 |
|--------|------|------|
| GET/PUT | `/resume/profile` | 基础信息 |
| GET/PUT | `/resume/self-desc` | 自我描述 |
| GET/POST | `/resume/education` | 教育经历列表/新增 |
| PUT/DELETE | `/resume/education/:id` | 编辑/删除 |
| GET/POST | `/resume/work-exp` | 工作经历列表/新增 |
| PUT/DELETE | `/resume/work-exp/:id` | 编辑/删除 |
| POST | `/resume/work-exp/:id/request-cert` | 申请工作认证 |
| GET/POST | `/resume/project-exp` | 项目经历列表/新增 |
| PUT/DELETE | `/resume/project-exp/:id` | 编辑/删除 |
| GET | `/resume/certifications` | 我的工作认证记录 |
| GET | `/resume/certify/:shareToken` | 获取认证详情 |
| POST | `/resume/certify/:shareToken` | 确认认证 |

### 职位

| Method | Path | 说明 |
|--------|------|------|
| GET 🔓 | `/jobs` | 职位列表（筛选+分页） |
| GET 🔓 | `/jobs/:id` | 职位详情 |
| POST | `/jobs` | 发布职位（RECRUITER） |
| PUT | `/jobs/:id` | 编辑职位（RECRUITER） |
| DELETE | `/jobs/:id` | 下架职位（RECRUITER） |
| GET | `/jobs/my-posted` | 我发布的职位 |
| POST | `/jobs/:id/deliver` | 投递简历 |
| GET | `/jobs/my-deliveries` | 我的投递记录 |
| POST/DELETE | `/jobs/:id/favorite` | 收藏/取消收藏 |
| GET | `/jobs/my-favorites` | 我的收藏 |

### 企业

| Method | Path | 说明 |
|--------|------|------|
| GET 🔓 | `/companies` | 搜索企业（keyword） |
| POST | `/companies` | 创建企业 |

### 招聘官

| Method | Path | 说明 |
|--------|------|------|
| GET/POST/PUT | `/recruiter/profile` | 档案获取/注册/更新 |
| GET | `/recruiter/seekers` | 求职者列表 |
| GET | `/recruiter/seekers/:userId` | 求职者完整简历 |
| GET | `/recruiter/deliveries` | 投递管理列表 |
| PUT | `/recruiter/deliveries/:id/status` | 更新投递状态 |
| POST | `/recruiter/invite` | 发送面试邀请 |
| GET | `/recruiter/invites` | 已发邀请列表 |

### 消息

| Method | Path | 说明 |
|--------|------|------|
| GET | `/messages/invites` | 求职者收到的面试邀请 |
| PATCH | `/messages/:id/read` | 标记已读 |
