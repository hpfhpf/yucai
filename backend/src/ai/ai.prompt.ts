import { ResumeSnapshot, JobSummary } from './ai.types';

// 将简历快照渲染为可读文本
export function renderResume(r: ResumeSnapshot): string {
  const lines: string[] = [];
  lines.push(`姓名/称呼：${r.realName || '未填写'}`);
  lines.push(`求职意向/头衔：${r.roleTitle || '未填写'}`);
  lines.push(`城市：${r.city || '未填写'}`);
  lines.push(`自我描述：${r.selfDesc || '未填写'}`);
  if (r.educations?.length) {
    lines.push('教育经历：');
    r.educations.forEach((e) => lines.push(`  - ${e.school || ''} ${e.major || ''} ${e.degree || ''}`));
  }
  if (r.workExps?.length) {
    lines.push('工作经历：');
    r.workExps.forEach((w) =>
      lines.push(`  - ${w.company || ''} / ${w.title || ''}：${w.content || ''}`),
    );
  }
  if (r.projectExps?.length) {
    lines.push('项目经历：');
    r.projectExps.forEach((p) =>
      lines.push(`  - ${p.name || ''} / ${p.role || ''}：${p.content || ''}`),
    );
  }
  return lines.join('\n');
}

// 将职位渲染为可读文本
export function renderJob(j: JobSummary): string {
  return [
    `职位名称：${j.title}`,
    `薪资：${j.salaryRange || '面议'}`,
    `学历要求：${j.minDegree || '不限'}`,
    `经验要求：${j.minExpYears ?? 0} 年`,
    `职位描述与要求：\n${j.description}`,
    j.perks?.length ? `职位诱惑：${j.perks.join('、')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

// 诊断 prompt：要求模型只输出 JSON
export function buildDiagnosePrompt(resume: ResumeSnapshot, job: JobSummary): string {
  return `你是资深招聘顾问。请分析求职者简历与目标职位的匹配度，找出不匹配之处并给出改进建议。

【求职者简历】
${renderResume(resume)}

【目标职位】
${renderJob(job)}

请严格只输出如下 JSON（不要任何解释、不要 markdown 代码块）：
{"matchScore": <0-100整数>, "issues": [{"field": "涉及的简历部分", "severity": "high|medium|low", "mismatch": "具体不匹配点", "suggestion": "改进建议"}]}
issues 控制在 3-6 条，按重要程度排序。`;
}

// 定制 prompt：基于诊断优化简历，输出简历 JSON
export function buildTailorPrompt(
  resume: ResumeSnapshot,
  job: JobSummary,
  issues?: unknown,
): string {
  return `你是资深简历顾问。请针对目标职位优化求职者简历，使其更契合职位要求，但不得编造不存在的经历，只做措辞强化、重点突出与结构优化。

【原始简历】
${renderResume(resume)}

【目标职位】
${renderJob(job)}

${issues ? `【已诊断出的问题】\n${JSON.stringify(issues)}` : ''}

请严格只输出如下 JSON（不要任何解释、不要 markdown 代码块），字段与原简历一致：
{"realName": "", "roleTitle": "", "city": "", "selfDesc": "优化后的自我描述", "educations": [...], "workExps": [{"company":"","title":"","content":"优化后的描述"}], "projectExps": [{"name":"","role":"","content":"优化后的描述"}]}`;
}
