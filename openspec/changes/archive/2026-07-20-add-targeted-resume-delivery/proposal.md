# 定向简历投递（AI 诊断 + 定制 + 投递）

## Why

当前岗位详情页的「投递简历」只做了「简历是否完善」的校验（见 `src/pages/recommendation/detail/index.vue` `handleDeliver`），投递即完成，缺少匹配度反馈。求职者无法在投递前得知自己与该职位的差距，投递命中率低。

本变更引入 AI 驱动的「诊断 → 定向定制 → 投递」闭环：点击投递后，AI 诊断简历与职位的匹配度并给出问题列表；用户可选择让 AI 定向定制一份简历（可编辑），再投递；投递记录在「我的投递」中单列「定向投递」专区，可回看当时定制的简历快照。

## What Changes

- **AI 代理模块（后端新增）**：统一代理 DeepSeek（`deepSeek-v4-flash`，Anthropic 兼容端点），API key 存后端环境变量，前端不接触密钥。提供两个能力：诊断（流式）、定制（一次性）。
- **流式诊断进度**：诊断经后端流式 endpoint 逐块下发进度与结果；H5 用 fetch/EventSource，小程序用 `uni.request` 的 `enableChunked` + `onChunkReceived`。诊断期间禁止重复触发。
- **数据模型新增**：`ResumeDiagnosis`（诊断快照 / 问题列表）、`TailoredResume`（定制简历 JSON 快照，与主简历解耦），`Delivery` 增加投递类型（NORMAL/TARGETED）与定制简历关联。
- **前端新增**：诊断进度浮层（进度条 + 逐条问题）、`pages/seeker/tailorResume` 定制页（AI 生成 + 手动编辑 + 自动/手动保存）、`submitted.vue` 新增「定向投递」tab 及定制简历详情查看。
- **投递扩展**：定向投递携带 `tailoredResumeId`，普通投递保持现状；防重复提交。

## Impact

- Affected specs: `resume-diagnosis`（新增）、`tailored-resume`（新增）、`job-delivery`（新增/扩展现有投递能力）
- Affected backend code: `backend/prisma/schema.prisma`、新增 `backend/src/ai/*`、`backend/src/jobs/jobs.service.ts` 与 controller、`backend/.env`
- Affected frontend code: `src/pages/recommendation/detail/index.vue`、`src/pages/mine/submitted.vue`、新增 `src/pages/seeker/tailorResume/*`、`src/api/index.ts`、新增跨端流式请求工具、`src/pages.json`
- 需运行 Prisma 迁移（新增表 + Delivery 字段）
- 安全：DeepSeek key 仅后端持有；简历为敏感数据，流式与快照均走已鉴权接口

## Non-goals

- 不改造招聘官端的简历查看逻辑
- 不做多份定制简历版本管理（每次定向投递生成一份独立快照即可）
- 不引入向量检索 / RAG，诊断与定制均基于单次 prompt
