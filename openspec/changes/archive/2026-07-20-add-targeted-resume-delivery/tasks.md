# 实施任务

## 1. 后端 - 数据模型与迁移
- [x] 1.1 schema 新增 `ResumeDiagnosis`、`TailoredResume` 模型
- [x] 1.2 `Delivery` 新增 `type`（DeliveryType 枚举，默认 NORMAL）与 `tailoredResumeId`
- [x] 1.3 同步数据库（项目无 migrations 历史，改用 `prisma db push` + `generate`）

## 2. 后端 - AI 代理模块
- [x] 2.1 `.env` 增加 `DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`
- [x] 2.2 新建 `backend/src/ai/ai.module.ts` + `ai.service.ts`（fetch 调 DeepSeek）
- [x] 2.3 实现 `diagnose()` 流式方法（回调逐块吐进度与结果）
- [x] 2.4 实现 `tailor()` 一次性方法（返回定制简历 JSON）
- [x] 2.5 设计诊断/定制 prompt（`ai.prompt.ts`：主简历聚合 + 职位描述与要求）

## 3. 后端 - 接口
- [x] 3.1 `POST /jobs/:id/diagnose/stream`（text/event-stream），落 ResumeDiagnosis
- [x] 3.2 `POST /jobs/:id/tailor` 生成并落 TailoredResume 草稿
- [x] 3.3 `PUT /tailored-resumes/:id` 保存编辑；`GET /tailored-resumes/:id` 查看（校验归属）
- [x] 3.4 扩展 `jobs.service.deliver`：支持 type=TARGETED + tailoredResumeId，防重复
- [x] 3.5 扩展 `myDeliveries`：返回 type，支持按 type 过滤

## 4. 前端 - 跨端流式请求
- [x] 4.1 新建 `src/utils/streamRequest.ts`：小程序用 `enableChunked`+`onChunkReceived`，H5 用 fetch/ReadableStream
- [x] 4.2 逐块解析 `data:` 行，回调进度事件；含错误/结束处理

## 5. 前端 - 诊断浮层
- [x] 5.1 岗位详情页 `handleDeliver` 改造：有简历 → 打开诊断浮层
- [x] 5.2 诊断进度浮层组件：进度条 + 逐条问题（不匹配项/重要度/建议 + 匹配度）
- [x] 5.3 防重复触发（进度中不可关闭/重开）；失败提示 + 「跳过诊断直接投递」兜底
- [x] 5.4 两个后续入口：「定向修改简历」跳定制页，「直接投递」走原确认流程

## 6. 前端 - 定制页
- [x] 6.1 新建 `pages/seeker/tailorResume/index.vue` 并注册 `pages.json`
- [x] 6.2 进入即调 `tailor` 生成，展示加载/错误重试
- [x] 6.3 可编辑表单 + 自动保存（失焦防抖）+ 手动保存反馈
- [x] 6.4 「投递简历」按钮：投递前保存 → 定向投递，成功反馈 + 防重复

## 7. 前端 - 我的投递专区
- [x] 7.1 `submitted.vue` 新增「定向投递」tab，按 type=TARGETED 独立拉取
- [x] 7.2 卡片展示职位/公司/时间/状态；点击查看关联定制简历详情
- [x] 7.3 新增 `pages/seeker/tailorResume/detail.vue` 只读渲染 TailoredResume 快照

## 8. API 层与联调
- [x] 8.1 `src/api/index.ts` 新增 tailor/保存/查看/定向投递/按type查投递 接口
- [ ] 8.2 H5 + 微信小程序真机验证流式进度；小程序 enableChunked 行为确认（待用户真机联调）
- [ ] 8.3 端到端走通：诊断→定制→编辑→投递→我的投递查看（待用户联调，需 DeepSeek 网络可达）

## 9. 验证
- [x] 9.1 后端构建通过（`nest build` ✓）、单测通过（5/5 ✓）、schema 已 `db push` 同步
- [x] 9.2 前端 `vue-tsc` 类型检查：本次改动文件全部干净（既有历史报错不在本次范围）
- [ ] 9.3 关键路径手测（诊断失败兜底、重复投递拦截）（待用户联调）
