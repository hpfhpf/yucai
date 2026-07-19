# 设计：定向简历投递

## Context

岗位详情页投递前无匹配度反馈。本设计引入 AI 诊断 + 定制 + 定向投递闭环，跨前后端。约束：主投递端为微信小程序（`dev:mp-weixin`，走 `uni.request`），H5 为次要端。DeepSeek key 必须只在后端。

## 决策与理由

### 1. AI 调用位置：后端统一代理

DeepSeek key（`sk-...`）存 `backend/.env`，新增 `AiModule` 封装调用。前端只调本站已鉴权接口，key 不下发到客户端。符合敏感信息安全要求，且便于统一限流/审计。

- base url: `https://api.deepseek.com/anthropic`（Anthropic 兼容）
- 模型: `deepSeek-v4-flash`
- 后端用 `fetch`（Node18+ 原生）直连，无需新增 SDK 依赖

### 2. 进度实现：后端流式，前端跨端接流

DeepSeek 单次请求本质是流式 token 输出。后端开一个 `text/event-stream` endpoint，把「阶段进度 + 增量结果」逐块下发，进度为真实值而非模拟。

```
后端 POST /jobs/:id/diagnose/stream  (text/event-stream)
  → data: {"stage":"analyzing","percent":30}
  → data: {"stage":"analyzing","percent":70}
  → data: {"stage":"done","percent":100,"result":{...}}
```

前端跨端差异（关键约束：小程序无 EventSource）：

| 端     | 接流方式                                            |
|--------|-----------------------------------------------------|
| 小程序 | `uni.request({enableChunked:true})` + `onChunkReceived` 手动解析 chunk |
| H5     | `fetch` + `ReadableStream` reader，同一解析逻辑复用   |

封装 `src/utils/streamRequest.ts` 抹平差异，回调 `(event)=>void`。

### 3. 定制简历存储：独立快照

每次定向投递生成一份 `TailoredResume`（完整简历 JSON 快照），与 `SeekerProfile` 主简历解耦。主简历后续改动不影响已投递快照；一份简历投多岗互不覆盖。诊断结果 `ResumeDiagnosis` 也存快照，供回看。

## 数据模型

```prisma
model ResumeDiagnosis {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  jobId      String   @map("job_id")
  matchScore Int?     @map("match_score")   // 0-100 匹配度
  issues     Json                            // [{field, severity, mismatch, suggestion}]
  createdAt  DateTime @default(now()) @map("created_at")
  @@index([userId, jobId])
  @@map("resume_diagnoses")
}

model TailoredResume {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  jobId       String   @map("job_id")
  diagnosisId String?  @map("diagnosis_id")
  content     Json                           // 定制后的完整简历快照
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  @@index([userId, jobId])
  @@map("tailored_resumes")
}

// Delivery 扩展
enum DeliveryType { NORMAL TARGETED }
// 新增字段：
//   type             DeliveryType    @default(NORMAL)
//   tailoredResumeId String?         @map("tailored_resume_id")
```

## 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/jobs/:id/diagnose/stream` | 流式诊断，返回进度+结果，落 ResumeDiagnosis |
| POST | `/jobs/:id/tailor` | 基于诊断生成定制简历，落 TailoredResume（草稿） |
| PUT  | `/tailored-resumes/:id` | 保存用户编辑（自动/手动） |
| GET  | `/tailored-resumes/:id` | 查看定制简历详情 |
| POST | `/jobs/:id/deliver` | 扩展：可带 `{type:'TARGETED', tailoredResumeId}` |
| GET  | `/jobs/my-deliveries` | 扩展：返回 `type`，支持按 type 过滤 |

## 风险与权衡

- **流式跨端**：`enableChunked` 在部分基础库版本行为不一，需在小程序真机验证；降级方案为非流式一次性返回 + 前端模拟进度。
- **DeepSeek 延迟/失败**：诊断/定制需 loading + 超时 + 错误提示；失败时允许「跳过诊断直接投递」兜底。
- **成本**：诊断与定制各一次 LLM 调用，按投递触发，量可控。

## 迁移

新增两表 + Delivery 两字段（`type` 有默认值、`tailoredResumeId` 可空），对存量数据无破坏，`prisma migrate dev` 即可。

