# 育才 HR — 接口测试用例

> **更新规则**：每次验证后更新状态列。新发现的 Bug 追加到底部问题跟踪表。
>
> **状态说明**：✅ PASS | ❌ FAIL | ⏳ PENDING | 🔧 FIXED

---

## 目录

- [Auth 认证模块](#auth-认证模块)
- [Resume 简历模块](#resume-简历模块)
- [Jobs 职位模块](#jobs-职位模块)
- [问题跟踪](#问题跟踪)

---

## Auth 认证模块

**Base URL**: `POST /v1/auth/login` | `GET /v1/auth/me`

**测试账号**：

| 账号 | 手机号 | 密码 | 角色 |
|------|--------|------|------|
| 测试求职者 | 13800000001 | Test1234 | SEEKER |
| 测试招聘官 | 13800000002 | Test1234 | RECRUITER |
| 测试运营 | 13800000003 | Test1234 | ADMIN |
| 超级管理员 | 13800000004 | Test1234 | SUPER_ADMIN |

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-AUTH-001 | 正常登录 SEEKER | `POST /v1/auth/login` `{"phone":"13800000001","password":"Test1234"}` | 200，返回 `token` + `user.role=SEEKER` | ✅ | 2026-06-22 |
| TC-AUTH-002 | 正常登录 RECRUITER | `POST /v1/auth/login` `{"phone":"13800000002","password":"Test1234"}` | 200，返回 `token` + `user.role=RECRUITER` | ✅ | 2026-06-22 |
| TC-AUTH-003 | 错误密码 | `POST /v1/auth/login` `{"phone":"13800000001","password":"wrong"}` | 401 Unauthorized | ✅ | 2026-06-22 |
| TC-AUTH-004 | 获取当前用户（有效 token） | `GET /v1/auth/me` Bearer token | 200，返回用户信息含 `role` | ✅ | 2026-06-22 |
| TC-AUTH-005 | 获取当前用户（无 token） | `GET /v1/auth/me` 无 header | 401 Unauthorized | ✅ | 2026-06-22 |
| TC-AUTH-006 | 登录后 token 过期验证 | 等待 token 过期后请求 `/auth/me` | 401 Unauthorized | ⏳ | — |
| TC-AUTH-007 | 不存在的手机号 | `POST /v1/auth/login` `{"phone":"19999999999","password":"Test1234"}` | 401 Unauthorized | ⏳ | — |

**curl 示例**：
```bash
# 获取 token
TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","password":"Test1234"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
```

---

## Resume 简历模块

**Base URL**: `/v1/resume/*`  
**鉴权**：所有接口需 Bearer token（`JwtAuthGuard`，不限角色）

### DTO 字段参考

| DTO | 字段名（注意与直觉不同） |
|-----|--------------------------|
| UpdateProfileDto | `realName`, `gender`(MALE/FEMALE/UNKNOWN), `birthDate`, `city`, `roleTitle` |
| UpdateSelfDescDto | `selfDesc`（不是 `content`） |
| CreateWorkExpDto | `company`(必填), `title`(必填，非 `position`), `city`, `salaryMin`, `salaryMax`, `skillTags[]`, `content`(非 `description`), `startDate`, `endDate` |
| CreateProjectExpDto | `name`(必填), `role`, `techTags[]`, `content`(非 `description`), `startDate`, `endDate` |

> ⚠️ `ValidationPipe` 开启了 `forbidNonWhitelisted: true`，未声明的字段会返回 400 Bad Request。

### Profile

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-001 | 首次获取 profile（自动创建） | `GET /v1/resume/profile` | 200，返回含 `id` 的 profile 对象 | ✅ | 2026-06-22 |
| TC-RESUME-002 | 更新 profile | `PUT /v1/resume/profile` `{"realName":"李明","gender":"MALE","city":"北京","roleTitle":"前端工程师"}` | 200，返回更新后对象 | ✅ | 2026-06-22 |

### 自我描述

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-003 | 获取自我描述 | `GET /v1/resume/self-desc` | 200，返回含 `selfDesc` 字段的对象 | ✅ | 2026-06-22 |
| TC-RESUME-004 | 更新自我描述 | `PUT /v1/resume/self-desc` `{"selfDesc":"..."}` | 200，返回更新后对象 | ✅ | 2026-06-22 |

### 教育经历

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-005 | 新增教育经历 | `POST /v1/resume/education` `{"school":"北京大学","major":"计算机科学","degree":"BACHELOR","startDate":"2016-09-01","endDate":"2020-06-30"}` | 201，返回含 `id` 的记录 | ✅ | 2026-06-22 |
| TC-RESUME-006 | 更新教育经历 | `PUT /v1/resume/education/:id` `{"major":"软件工程"}` | 200，返回更新后记录 | ✅ | 2026-06-22 |
| TC-RESUME-007 | 删除教育经历 | `DELETE /v1/resume/education/:id` | 200，`{"success": true}` | ✅ | 2026-06-22 |
| TC-RESUME-008 | 获取教育经历列表 | `GET /v1/resume/education` | 200，数组 | ⏳ | — |

### 工作经历

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-009 | 新增工作经历（含 skillTags） | `POST /v1/resume/work-exp` `{"company":"腾讯科技","title":"前端工程师","startDate":"2020-07-01","content":"...","skillTags":["Vue3","TypeScript"]}` | 201，skillTags 正确存储并返回 | ✅ | 2026-06-22 |
| TC-RESUME-010 | 更新工作经历 | `PUT /v1/resume/work-exp/:id` `{"title":"高级前端工程师"}` | 200，返回更新后记录 | ⏳ | — |
| TC-RESUME-011 | 删除工作经历 | `DELETE /v1/resume/work-exp/:id` | 200，`{"success": true}` | ⏳ | — |
| TC-RESUME-012 | 越权删除他人工作经历 | 用 RECRUITER token 删除 SEEKER 的工作经历 | 403 Forbidden | ✅ | 2026-06-22 |

### 项目经历

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-013 | 新增项目经历（含 techTags） | `POST /v1/resume/project-exp` `{"name":"招聘平台","role":"前端负责人","startDate":"2023-01-01","content":"...","techTags":["NestJS","Prisma","MySQL"]}` | 201，techTags 正确存储并返回 | ✅ | 2026-06-22 |
| TC-RESUME-014 | 更新项目经历 | `PUT /v1/resume/project-exp/:id` `{"role":"技术负责人"}` | 200，返回更新后记录 | ⏳ | — |
| TC-RESUME-015 | 删除项目经历 | `DELETE /v1/resume/project-exp/:id` | 200，`{"success": true}` | ⏳ | — |

### 鉴权边界

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-RESUME-016 | 未登录访问简历接口 | `GET /v1/resume/profile`（无 token） | 401 Unauthorized | ✅ | 2026-06-22 |

---

## Jobs 职位模块

**Base URL**: `/v1/jobs/*`  
**鉴权**：所有接口需 Bearer token；RECRUITER/SEEKER 角色各有限制

### 公开浏览（登录即可）

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-JOBS-001 | 获取职位列表（无筛选） | `GET /v1/jobs` | 200，`{total:5, page:1, limit:10, items:[...]}` 含 company 信息 | ✅ | 2026-06-22 |
| TC-JOBS-002 | 按城市筛选 | `GET /v1/jobs?city=深圳` | 200，items 均为深圳职位 | ⏳ | — |
| TC-JOBS-003 | 按 nature 筛选 | `GET /v1/jobs?nature=INTERNSHIP` | 200，仅返回实习职位 | ⏳ | — |
| TC-JOBS-004 | 关键词搜索 | `GET /v1/jobs?keyword=前端` | 200，title/description 含"前端" | ⏳ | — |
| TC-JOBS-005 | 分页参数 | `GET /v1/jobs?page=2&limit=2` | 200，items 最多 2 条，page=2 | ⏳ | — |
| TC-JOBS-006 | 获取职位详情 | `GET /v1/jobs/:id` | 200，含 company + recruiter 信息 | ✅ | 2026-06-22 |
| TC-JOBS-007 | 获取不存在的职位 | `GET /v1/jobs/nonexistent-id` | 404 Not Found | ⏳ | — |

### 求职者操作（SEEKER）

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-JOBS-008 | 投递简历 | `POST /v1/jobs/:id/deliver` `{"creditAuthorized":true}` | 201，返回投递记录含 `status=PENDING` | ✅ | 2026-06-22 |
| TC-JOBS-009 | 重复投递同一职位 | 再次 POST 相同接口 | 400 `已投递过该职位` | ✅ | 2026-06-22 |
| TC-JOBS-010 | 投递已关闭的职位 | 先关闭职位，再投递 | 404 `职位不存在或已关闭` | ⏳ | — |
| TC-JOBS-011 | 收藏职位 | `POST /v1/jobs/:id/favorite` | 200，`{"success":true}` | ✅ | 2026-06-22 |
| TC-JOBS-012 | 重复收藏（幂等） | 再次 POST `/favorite` | 200，`{"success":true}`（upsert，不报错） | ⏳ | — |
| TC-JOBS-013 | 取消收藏 | `DELETE /v1/jobs/:id/favorite` | 200，`{"success":true}` | ⏳ | — |
| TC-JOBS-014 | 获取我的投递记录 | `GET /v1/jobs/my-deliveries` | 200，`{total:1, items:[...]}` 含 job+company 信息 | ✅ | 2026-06-22 |
| TC-JOBS-015 | 获取我的收藏列表 | `GET /v1/jobs/my-favorites` | 200，`{total:1, items:[...]}` 含 job+company 信息 | ✅ | 2026-06-22 |

### 招聘官操作（RECRUITER）

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-JOBS-016 | 发布职位 | `POST /v1/jobs` `{"title":"测试职位","nature":"FULL_TIME","city":"北京","province":"北京","salaryRange":"10k-20k","description":"...","perks":["五险一金"]}` | 201，返回新职位记录 | ✅ | 2026-06-22 |
| TC-JOBS-017 | 更新职位 | `PUT /v1/jobs/:id` `{"title":"更新后的职位名"}` | 200，返回更新后记录 | ⏳ | — |
| TC-JOBS-018 | 下架职位 | `DELETE /v1/jobs/:id` | 200，`{"success":true}` | ✅ | 2026-06-22 |
| TC-JOBS-019 | 获取我发布的职位 | `GET /v1/jobs/my-posted` | 200，`{total:N, items:[...]}` | ✅ | 2026-06-22 |
| TC-JOBS-020 | 操作他人职位（越权） | 用招聘官 A 的 token 删除招聘官 B 的职位 | 403 Forbidden | ⏳ | — |

### 角色鉴权边界

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-JOBS-021 | SEEKER 尝试发布职位 | `POST /v1/jobs`（SEEKER token） | 403 Forbidden | ✅ | 2026-06-22 |
| TC-JOBS-022 | RECRUITER 尝试投递简历 | `POST /v1/jobs/:id/deliver`（RECRUITER token） | 403 Forbidden | ⏳ | — |
| TC-JOBS-023 | 未登录访问职位列表 | `GET /v1/jobs`（无 token） | 401 Unauthorized | ⏳ | — |

---

## 问题跟踪

> 测试过程中发现的 Bug 和设计缺陷，与 `product-spec.md` 问题清单互补（此处记录接口层问题）。

| ID | 模块 | 严重级别 | 发现时间 | 描述 | 复现步骤 | 状态 | 解决方案 |
|----|------|----------|----------|------|----------|------|----------|
| BUG-001 | 基础设施 | P0 | 2026-06-22 | 旧 Nest 进程未释放端口，导致新启动进程绑定失败，请求路由到旧编译产物 | 重启服务时不 kill 旧进程 → GET /v1/jobs 返回 404 | 🔧 FIXED | 每次重启前执行 `lsof -ti:3000 \| xargs kill -9`；清空 `dist/` 目录 |
| BUG-002 | Resume | P1 | 2026-06-22 | `UpdateProfileDto` 缺少 `nickname`、`province`、`jobTitle`、`expectedSalary` 字段，前端可能需要这些字段 | `PUT /v1/resume/profile {"nickname":"..."}` → 400 Bad Request | ⏳ 待评估 | 对照前端 `mine/edit.vue` 确认需要哪些字段，补充到 DTO |
| BUG-003 | Resume | P2 | 2026-06-22 | `UpdateSelfDescDto` 字段名为 `selfDesc`，`UpdateProfileDto` 的工作标题字段名为 `roleTitle`，命名与前端 Mock 数据中的 key 可能不一致 | — | ⏳ 待对接 | 前端对接时统一确认字段名映射 |
| BUG-004 | Jobs | P1 | 2026-06-22 | `GET /v1/jobs` 列表接口不支持按薪资区间筛选（`salaryRange`），前端"快捷筛选"可能需要 | `GET /v1/jobs?salaryRange=20k-35k` 无效 | ⏳ 待开发 | 在 `ListJobsQuery` 和 `jobs.service.ts` 中补充薪资模糊匹配或枚举筛选 |
| BUG-005 | Jobs | P2 | 2026-06-22 | 职位详情接口会异步 `viewCount+1`，但 `catch(()=>{})` 会吞掉错误，无法感知计数失败 | 数据库不可用时浏览量静默失败 | ⏳ 待优化 | 接入日志系统后改为 `catch(err => logger.warn(...))` |

---

---

## Users 用户模块

**Base URL**: `/v1/users/*`  
**鉴权**：所有接口需 Bearer token

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-USERS-001 | 获取当前用户信息 | `GET /v1/users/me` | 200，返回 id/phone/role/nickname/avatarUrl/status/idVerifiedAt | ✅ | 2026-06-23 |
| TC-USERS-002 | 更新昵称 | `PUT /v1/users/me` `{"nickname":"小明同学"}` | 200，返回更新后用户对象 | ✅ | 2026-06-23 |
| TC-USERS-003 | 昵称持久化验证 | 更新后再次 GET | nickname 确为新值 | ✅ | 2026-06-23 |
| TC-USERS-004 | 头像上传 stub | `POST /v1/users/me/avatar` | 501，提示 COS 待接入 | ✅ | 2026-06-23 |
| TC-USERS-005 | 未登录访问 | `GET /v1/users/me`（无 token） | 401 Unauthorized | ✅ | 2026-06-23 |
| TC-USERS-006 | nickname 超长（>20字） | `PUT /v1/users/me` `{"nickname":"超过二十字的昵称..."}` | 400 Bad Request | ✅ | 2026-06-23 |
| TC-USERS-007 | 修改手机号 | `PUT /v1/users/me/phone`（含短信验证码） | 200 | ⏳ 待开发（依赖腾讯云短信） | — |
| TC-USERS-008 | 头像上传（真实） | `POST /v1/users/me/avatar`（multipart） | 200，返回 avatarUrl | ⏳ 待开发（依赖腾讯云 COS） | — |

---

## Recruiter 招聘官模块

**Base URL**: `/v1/recruiter/*` | `/v1/companies/*`

### Companies 企业模块（配套）

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-CO-001 | 搜索企业（无筛选，返回全部） | `GET /v1/companies` | 200，数组含 seed 的 2 家企业 | ✅ | 2026-06-23 |
| TC-CO-002 | 关键词搜索企业 | `GET /v1/companies?keyword=腾讯` | 200，仅返回腾讯科技 | ✅ | 2026-06-23 |
| TC-CO-003 | 创建新企业 | `POST /v1/companies` `{"name":"测试科技有限公司","industry":"互联网","city":"成都","province":"四川"}` | 201，返回含 id 的企业对象 | ✅ | 2026-06-23 |
| TC-CO-004 | 重复创建同名企业 | `POST /v1/companies` 相同 name | 409 Conflict | ✅ | 2026-06-23 |

### 招聘官档案

> 注：mock-recruiter-001 已通过 seed 预创建，`POST /recruiter/profile` 会返回 400

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-REC-001 | 获取招聘官档案（已 seed） | `GET /v1/recruiter/profile` | 200，含 company 信息 | ✅ | 2026-06-23 |
| TC-REC-002 | 更新招聘官档案 | `PUT /v1/recruiter/profile` `{"department":"技术部","contactPhone":"13900000002"}` | 200，返回更新后档案 | ✅ | 2026-06-23 |
| TC-REC-003 | 重复注册（应报错） | `POST /v1/recruiter/profile` 已存在时 | 400 Bad Request | ⏳ | — |
| TC-REC-004 | 注册时绑定不存在的企业 | `POST /v1/recruiter/profile` `{"companyId":"nonexistent"}` | 404 Not Found | ⏳ | — |

### 简历库

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-REC-005 | 浏览简历库（全部） | `GET /v1/recruiter/seekers` | 200，`{total, items}` 含 education/workExp 最新一条 | ✅ | 2026-06-23 |
| TC-REC-006 | 查看指定求职者完整简历 | `GET /v1/recruiter/seekers/mock-seeker-001` | 200，含 workExps + projectExps + educations | ✅ | 2026-06-23 |
| TC-REC-007 | 查看不存在的求职者简历 | `GET /v1/recruiter/seekers/nonexistent` | 404 `该用户未完善简历` | ⏳ | — |
| TC-REC-008 | 按城市筛选简历库 | `GET /v1/recruiter/seekers?city=北京` | 200，仅返回北京求职者 | ⏳ | — |

### 投递管理

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-REC-009 | 查看收到的投递 | `GET /v1/recruiter/deliveries` | 200，含求职者基础信息和职位名称 | ✅ | 2026-06-23 |
| TC-REC-010 | 更新投递状态为 VIEWED | `PUT /v1/recruiter/deliveries/:id/status` `{"status":"VIEWED"}` | 200，返回更新后投递记录 | ✅ | 2026-06-23 |
| TC-REC-011 | 按职位筛选投递 | `GET /v1/recruiter/deliveries?jobId=:id` | 200，仅该职位的投递 | ⏳ | — |
| TC-REC-012 | 操作他人职位的投递（越权） | 用招聘官 A 更新招聘官 B 职位的投递 | 403 Forbidden | ⏳ | — |

### 面试邀请

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-REC-013 | 发送面试邀请 | `POST /v1/recruiter/invite` `{"seekerUserId":"mock-seeker-001","jobId":"...","content":"诚邀面试"}` | 201，type=INVITE，receiverId=求职者 | ✅ | 2026-06-23 |
| TC-REC-014 | 查看已发出的邀请列表 | `GET /v1/recruiter/invites` | 200，total=1 | ✅ | 2026-06-23 |
| TC-REC-015 | 向不存在的用户发邀请 | `POST /v1/recruiter/invite` `{"seekerUserId":"nonexistent"}` | 404 Not Found | ✅ | 2026-06-23 |
| TC-REC-016 | 用他人的职位发邀请（越权） | 使用非自己的 jobId | 403 Forbidden | ⏳ | — |

### 鉴权边界

| ID | 描述 | 请求 | 期望结果 | 状态 | 最后验证 |
|----|------|------|----------|------|----------|
| TC-REC-017 | SEEKER 访问简历库（应被拦截） | `GET /v1/recruiter/seekers`（SEEKER token） | 403 Forbidden | ✅ | 2026-06-23 |

---

## 待补充测试

以下功能模块尚未开始开发，测试用例占位：

| 模块 | 计划测试点 |
|------|-----------|
| Credit | 信用分查询、实名认证提交、工作认证流程（分享 token → 确认） |
| Admin | 运营端登录、用户审核、职位管理、数据统计 |
