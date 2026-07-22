import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiagnoseStreamEvent,
  DiagnosisResult,
  GenerateJobMessage,
  GenerateJobResult,
  JobSummary,
  ResumeSnapshot,
} from './ai.types';
import {
  buildDiagnosePrompt,
  buildGenerateJobPrompt,
  buildTailorPrompt,
} from './ai.prompt';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('DEEPSEEK_API_KEY', '');
    this.baseUrl = this.config.get<string>('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/anthropic');
    this.model = this.config.get<string>('DEEPSEEK_MODEL', 'deepSeek-v4-flash');
  }

  private ensureConfigured() {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('AI 服务未配置');
    }
  }

  // 从可能包含 markdown / 前后缀的文本中提取首个 JSON 对象
  private extractJson<T>(text: string): T {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('模型未返回有效 JSON');
    }
    return JSON.parse(text.slice(start, end + 1)) as T;
  }

  // 调用 Anthropic 兼容的 /v1/messages，非流式，返回完整文本
  private async callMessages(prompt: string, maxTokens = 2048): Promise<string> {
    this.ensureConfigured();
    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      this.logger.error(`DeepSeek 调用失败 ${res.status}: ${detail}`);
      throw new ServiceUnavailableException('AI 服务暂时不可用');
    }
    const data: any = await res.json();
    const text = Array.isArray(data?.content)
      ? data.content.map((c: any) => c?.text || '').join('')
      : '';
    return text;
  }

  // 定制：一次性返回优化后的简历 JSON
  async tailor(resume: ResumeSnapshot, job: JobSummary, issues?: unknown): Promise<ResumeSnapshot> {
    const text = await this.callMessages(buildTailorPrompt(resume, job, issues), 3072);
    return this.extractJson<ResumeSnapshot>(text);
  }

  // 生成职位：根据招聘者的自然语言需求生成结构化职位草稿，一次性返回 JSON
  async generateJob(prompt: string, history?: GenerateJobMessage[]): Promise<GenerateJobResult> {
    const text = await this.callMessages(buildGenerateJobPrompt(prompt, history), 3072);
    return this.extractJson<GenerateJobResult>(text);
  }

  // 诊断：流式。通过 onEvent 回调逐步下发进度，最终返回结果。
  // DeepSeek 单次请求本质是流式 token 输出，这里把 token 累积进度映射为 percent。
  async diagnose(
    resume: ResumeSnapshot,
    job: JobSummary,
    onEvent: (e: DiagnoseStreamEvent) => void,
  ): Promise<DiagnosisResult> {
    this.ensureConfigured();
    onEvent({ stage: 'analyzing', percent: 5 });

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        stream: true,
        messages: [{ role: 'user', content: buildDiagnosePrompt(resume, job) }],
      }),
    });
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => '');
      this.logger.error(`DeepSeek 流式诊断失败 ${res.status}: ${detail}`);
      throw new ServiceUnavailableException('AI 服务暂时不可用');
    }

    return this.consumeDiagnoseStream(res.body, onEvent);
  }

  // 逐块消费 SSE 流，累积文本并按增量推进进度，结束时解析 JSON
  private async consumeDiagnoseStream(
    body: ReadableStream<Uint8Array>,
    onEvent: (e: DiagnoseStreamEvent) => void,
  ): Promise<DiagnosisResult> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let raw = '';   // 累积的模型输出文本
    let percent = 5;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const evt = JSON.parse(payload);
          const delta = evt?.delta?.text || evt?.content_block?.text || '';
          if (delta) {
            raw += delta;
            percent = Math.min(95, percent + 4);
            onEvent({ stage: 'analyzing', percent });
          }
        } catch {
          // 忽略非 JSON 的心跳/事件行
        }
      }
    }
    const result = this.extractJson<DiagnosisResult>(raw);
    onEvent({ stage: 'done', percent: 100, result });
    return result;
  }
}
