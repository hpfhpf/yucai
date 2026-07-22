import { ResumeSnapshot, JobSummary, GenerateJobMessage } from './ai.types';

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

// 将对话历史渲染为文本，供多轮上下文使用
function renderHistory(history?: GenerateJobMessage[]): string {
  if (!history?.length) return '';
  const lines = history
    .filter((m) => m.content)
    .map((m) => `${m.role === 'ai' ? 'AI' : '招聘者'}：${m.content}`);
  return lines.length ? `\n【历史对话】\n${lines.join('\n')}\n` : '';
}

// 生成职位 prompt：根据招聘者的自然语言需求，产出符合行业规范的结构化职位信息。
// 输出字段与前端职位发布表单取值约定保持一致，前端可直接回填。
export function buildGenerateJobPrompt(prompt: string, history?: GenerateJobMessage[]): string {
  return `你是资深招聘官与 HR 专家。请根据招聘者用自然语言描述的招聘需求，生成一份符合行业规范、专业完整的职位信息。
${renderHistory(history)}
【招聘者本次需求】
${prompt}

生成要求：
1. 职位名称要规范、贴合行业惯例；职位描述需包含「岗位职责」与「任职要求」两部分，条理清晰、专业务实，可用换行与序号组织，篇幅约 200-400 字。
2. 招聘者未明确的字段，请结合职位与行业常识给出合理的默认值，不要留空。
3. 字段取值必须严格遵守以下枚举，不得自造：
   - nature（工作性质）：full | part | intern
   - education（最低学历）：不限 | 大专 | 本科 | 硕士 | 博士
   - experience（工作年限）：不限 | 1年以内 | 1-3年 | 3-5年 | 5-10年 | 10年以上
   - salary（薪资范围）：形如 "8k-12k"、"12k-20k"、"20k以上" 或 "面议"
   - tags（职位诱惑）：从 [周末双休, 五险一金, 弹性工作, 出国旅游, 免费体检] 中选取若干，至少 1 个
4. province/city/district 使用规范中文行政区名称（如 四川省 / 成都市 / 高新区）；招聘者未提及地点时，默认 四川省 / 成都市 / 高新区。
5. annualSalaryMinStr / annualSalaryMaxStr 为综合年薪（万/年）的数字字符串，需与 salary 大致匹配；无法估算时给出合理区间。
6. reply 字段用一句话面向招聘者说明已生成的职位要点，语气专业友好。

请严格只输出如下 JSON（不要任何解释、不要 markdown 代码块）：
{"reply": "面向招聘者的一句话说明", "job": {"title": "", "nature": "full", "province": "", "city": "", "district": "", "addressDetail": "", "salary": "", "annualSalaryMinStr": "", "annualSalaryMaxStr": "", "education": "", "experience": "", "description": "", "tags": []}}`;
}
