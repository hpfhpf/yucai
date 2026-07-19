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
