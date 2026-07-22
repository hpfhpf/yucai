// AI 简历诊断 / 定制 相关类型

// 单条诊断问题
export interface DiagnosisIssue {
  field: string;       // 涉及的简历部分，如「工作经历」「技能」
  severity: 'high' | 'medium' | 'low'; // 重要程度
  mismatch: string;    // 具体不匹配点
  suggestion: string;  // 改进建议
}

// 诊断结果
export interface DiagnosisResult {
  matchScore: number;        // 0-100 整体匹配度
  issues: DiagnosisIssue[];
}

// 流式诊断下发的事件
export interface DiagnoseStreamEvent {
  stage: 'analyzing' | 'done' | 'error';
  percent: number;                 // 0-100
  result?: DiagnosisResult;        // stage=done 时携带
  diagnosisId?: string;            // stage=done 时携带（落库后回填）
  message?: string;                // stage=error 时的错误信息
}

// 聚合后的简历快照（诊断/定制的输入与输出结构）
export interface ResumeSnapshot {
  realName?: string;
  roleTitle?: string;
  city?: string;
  selfDesc?: string;
  educations?: Array<Record<string, any>>;
  workExps?: Array<Record<string, any>>;
  projectExps?: Array<Record<string, any>>;
}

// 职位摘要（诊断/定制的输入）
export interface JobSummary {
  title: string;
  salaryRange?: string;
  minDegree?: string;
  minExpYears?: number;
  description: string;
  perks?: string[];
}

// AI 生成的职位草稿。字段与前端职位发布表单的取值约定保持一致，
// 前端可直接回填表单（education/experience/nature 使用展示用中文，salary 为 "8k-12k" 形式）。
export interface JobDraft {
  title: string;                       // 职位名称
  nature: 'full' | 'part' | 'intern';  // 工作性质
  province: string;                    // 省
  city: string;                        // 市
  district: string;                    // 区
  addressDetail: string;               // 详细地址
  salary: string;                      // 薪资范围，如 "8k-12k" / "面议"
  annualSalaryMinStr: string;          // 综合年薪下限（万/年），字符串
  annualSalaryMaxStr: string;          // 综合年薪上限（万/年），字符串
  education: string;                   // 最低学历：不限/大专/本科/硕士/博士
  experience: string;                  // 工作年限：不限/1年以内/1-3年/3-5年/5-10年/10年以上
  description: string;                 // 职位描述（含职责与任职要求）
  tags: string[];                      // 职位诱惑标签
}

// 生成职位的对话历史消息
export interface GenerateJobMessage {
  role: string;       // 'user' | 'ai'
  content?: string;
}

// 生成职位接口的返回结构
export interface GenerateJobResult {
  reply: string;      // AI 的对话回复（面向招聘者的自然语言说明）
  job?: JobDraft;     // 结构化职位草稿（信息不足时可能缺省）
}
