/**
 * seed-filter-jobs.ts
 * 创建一批带 annualSalaryMin / annualSalaryMax / levelTag 的测试职位，
 * 用于验证首页「向上跳槽」精准过滤功能。
 *
 * 运行：npx ts-node prisma/seed-filter-jobs.ts
 *
 * 职级 & 年薪组合说明（对照前端过滤逻辑）：
 *   IC     骨干员工  →  年薪  30-50 万
 *   LEAD   团队主管  →  年薪  50-80 万
 *   MGR_DIR 中高层  →  年薪  80-150 万
 *   VP_C   决策层   →  年薪 150-300 万
 *   null   未打标   →  总是展示（前端不过滤）
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 使用 seed-jobs.ts 已建的公司 & 招聘官
  const tencent = await prisma.company.findUnique({ where: { name: '腾讯科技（深圳）有限公司' } });
  const bytedance = await prisma.company.findUnique({ where: { name: '字节跳动有限公司' } });
  const recruiter = await prisma.recruiter.findUnique({ where: { userId: 'mock-recruiter-001' } });

  if (!tencent || !bytedance || !recruiter) {
    throw new Error('依赖数据不存在，请先运行 seed-jobs.ts');
  }

  type CareerLevelType = 'IC' | 'LEAD' | 'MGR_DIR' | 'VP_C';
  type DegreeType = 'ANY' | 'BACHELOR' | 'MASTER';

  const filterJobs: Array<{
    title: string;
    city: string;
    province: string;
    annualSalaryMin: number;
    annualSalaryMax: number;
    levelTag: CareerLevelType;
    salaryRange: string;
    minDegree: DegreeType;
    minExpYears: number;
    description: string;
    perks: string[];
    companyId: string;
    recruiterId: string;
  }> = [
    // ===== IC 骨干员工（年薪 30-50 万）=====
    {
      title: '高级前端工程师（IC 测试）',
      city: '深圳', province: '广东',
      annualSalaryMin: 30, annualSalaryMax: 50,
      levelTag: 'IC',
      salaryRange: '30-50万/年',
      minDegree: 'BACHELOR', minExpYears: 3,
      description: 'IC 级别骨干工程师，负责核心前端产品开发。',
      perks: ['股票期权', '五险一金', '弹性工作'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
    {
      title: '资深 Java 工程师（IC 测试）',
      city: '北京', province: '北京',
      annualSalaryMin: 35, annualSalaryMax: 50,
      levelTag: 'IC',
      salaryRange: '35-50万/年',
      minDegree: 'BACHELOR', minExpYears: 3,
      description: 'IC 级别 Java 后端工程师，参与分布式系统建设。',
      perks: ['年终奖', '五险一金', '远程办公'],
      companyId: bytedance.id, recruiterId: recruiter.id,
    },

    // ===== LEAD 团队主管（年薪 50-80 万）=====
    {
      title: '前端技术 Leader（LEAD 测试）',
      city: '深圳', province: '广东',
      annualSalaryMin: 55, annualSalaryMax: 80,
      levelTag: 'LEAD',
      salaryRange: '55-80万/年',
      minDegree: 'BACHELOR', minExpYears: 5,
      description: 'LEAD 级别，带领 5-8 人前端团队，技术方向把控与人才培养。',
      perks: ['股票期权', '五险一金', '弹性工作', '年终奖'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
    {
      title: '后端研发 Leader（LEAD 测试）',
      city: '北京', province: '北京',
      annualSalaryMin: 60, annualSalaryMax: 80,
      levelTag: 'LEAD',
      salaryRange: '60-80万/年',
      minDegree: 'BACHELOR', minExpYears: 5,
      description: 'LEAD 级别后端 Leader，主导微服务拆分与技术规范建设。',
      perks: ['股票期权', '年终奖', '五险一金', '免费三餐'],
      companyId: bytedance.id, recruiterId: recruiter.id,
    },

    // ===== MGR_DIR 中高层管理（年薪 80-150 万）=====
    {
      title: '技术总监（MGR_DIR 测试）',
      city: '深圳', province: '广东',
      annualSalaryMin: 90, annualSalaryMax: 150,
      levelTag: 'MGR_DIR',
      salaryRange: '90-150万/年',
      minDegree: 'BACHELOR', minExpYears: 8,
      description: 'MGR_DIR 级别技术总监，统筹平台技术战略，管理 30+ 人研发团队。',
      perks: ['期权', '年终奖', '高管保险', '私家车位'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
    {
      title: '产品总监（MGR_DIR 测试）',
      city: '北京', province: '北京',
      annualSalaryMin: 80, annualSalaryMax: 120,
      levelTag: 'MGR_DIR',
      salaryRange: '80-120万/年',
      minDegree: 'MASTER', minExpYears: 7,
      description: 'MGR_DIR 级别产品总监，主导多条产品线的战略规划与落地。',
      perks: ['期权', '年终奖', '高管福利'],
      companyId: bytedance.id, recruiterId: recruiter.id,
    },

    // ===== VP_C 决策层（年薪 150-300 万）=====
    {
      title: 'CTO（VP_C 测试）',
      city: '深圳', province: '广东',
      annualSalaryMin: 180, annualSalaryMax: 300,
      levelTag: 'VP_C',
      salaryRange: '180-300万/年',
      minDegree: 'MASTER', minExpYears: 12,
      description: 'VP_C 级别首席技术官，主导公司技术战略与组织架构设计。',
      perks: ['大量期权', '高管保险', '专车', '弹性工作'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
    {
      title: '技术 VP（VP_C 测试）',
      city: '北京', province: '北京',
      annualSalaryMin: 150, annualSalaryMax: 250,
      levelTag: 'VP_C',
      salaryRange: '150-250万/年',
      minDegree: 'BACHELOR', minExpYears: 10,
      description: 'VP_C 级别技术 VP，负责公司整体技术体系与跨部门协作。',
      perks: ['大量期权', '高管保险', '年终奖'],
      companyId: bytedance.id, recruiterId: recruiter.id,
    },

    // ===== 无年薪/无职级（兜底：filter 开启时仍展示）=====
    {
      title: '全栈工程师（无标签兜底）',
      city: '上海', province: '上海',
      annualSalaryMin: 0, annualSalaryMax: 0,
      levelTag: 'IC', // 给个默认值，但 salaryRange 为旧格式
      salaryRange: '20k-35k',
      minDegree: 'BACHELOR', minExpYears: 2,
      description: '无年薪结构化字段的旧格式职位，过滤时应包含（annualSalaryMin=null）。',
      perks: ['五险一金', '弹性工作'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
  ];

  // null salary jobs（annualSalaryMin / Max 为空，过滤时总是展示）
  const nullSalaryJobs = [
    {
      title: '架构师（仅旧薪资格式）',
      city: '成都', province: '四川',
      salaryRange: '30k-50k',
      minDegree: 'BACHELOR' as DegreeType, minExpYears: 5,
      description: 'annualSalaryMin=null 的职位，任意年薪设置下均应出现在过滤列表中。',
      perks: ['五险一金', '年终奖'],
      companyId: tencent.id, recruiterId: recruiter.id,
    },
    {
      title: '数据科学家（仅旧薪资格式）',
      city: '武汉', province: '湖北',
      salaryRange: '面议',
      minDegree: 'MASTER' as DegreeType, minExpYears: 3,
      description: 'annualSalaryMin=null / levelTag=null 的职位，过滤时总展示。',
      perks: ['五险一金', '年终奖', '远程办公'],
      companyId: bytedance.id, recruiterId: recruiter.id,
    },
  ];

  let count = 0;
  for (const j of filterJobs) {
    const { annualSalaryMin, annualSalaryMax, levelTag, ...rest } = j;
    await prisma.job.create({
      data: {
        ...rest,
        perks: rest.perks,
        nature: 'FULL_TIME',
        annualSalaryMin: annualSalaryMin > 0 ? annualSalaryMin : undefined,
        annualSalaryMax: annualSalaryMax > 0 ? annualSalaryMax : undefined,
        levelTag,
      },
    });
    count++;
  }

  for (const j of nullSalaryJobs) {
    await prisma.job.create({
      data: { ...j, perks: j.perks, nature: 'FULL_TIME' },
    });
    count++;
  }

  console.log(`✅ Seeded ${count} filter-test jobs (salary+level structured)`);
  console.log('职级分布: IC×2, LEAD×2, MGR_DIR×2, VP_C×2, null×2');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
