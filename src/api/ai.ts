import request from '@/utils/request';

// AI 生成职位信息
// 后端根据招聘者的自然语言描述，生成结构化的职位信息
// 返回：{ reply: string; job?: JobDraft }
export interface AiJobDraft {
    title: string;
    nature: 'full' | 'part' | 'intern';
    province: string;
    city: string;
    district: string;
    addressDetail: string;
    salary: string;
    annualSalaryMinStr: string;
    annualSalaryMaxStr: string;
    education: string;
    experience: string;
    description: string;
    tags: string[];
}

export interface AiGenerateJobResult {
    reply: string;
    job?: AiJobDraft;
}

export const apiAiGenerateJob = (data: {
    prompt: string;
    history?: Array<{ role: string; content?: string }>;
}): Promise<AiGenerateJobResult> =>
    request({
        url: '/ai/generate-job',
        method: 'POST',
        data,
        timeout: 60000,
    } as any);
