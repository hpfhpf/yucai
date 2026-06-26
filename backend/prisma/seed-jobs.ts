import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建测试企业
  const company = await prisma.company.upsert({
    where: { name: '腾讯科技（深圳）有限公司' },
    update: {},
    create: {
      name: '腾讯科技（深圳）有限公司',
      industry: '互联网',
      scale: '10000人以上',
      city: '深圳',
      province: '广东',
      isVerified: true,
      creditScore: 95,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { name: '字节跳动有限公司' },
    update: {},
    create: {
      name: '字节跳动有限公司',
      industry: '互联网',
      scale: '10000人以上',
      city: '北京',
      province: '北京',
      isVerified: true,
      creditScore: 92,
    },
  });

  // 创建测试招聘官（绑定到 mock-recruiter-001）
  const recruiter = await prisma.recruiter.upsert({
    where: { userId: 'mock-recruiter-001' },
    update: {},
    create: {
      userId: 'mock-recruiter-001',
      companyId: company.id,
      realName: '王HR',
      department: '技术部',
      isVerified: true,
    },
  });

  // 创建测试职位
  const jobs = [
    {
      title: '高级前端工程师',
      nature: 'FULL_TIME' as const,
      city: '深圳',
      province: '广东',
      salaryRange: '20k-35k',
      minDegree: 'BACHELOR' as const,
      minExpYears: 3,
      description: '负责公司核心产品的前端开发，要求熟悉 Vue3/React，有小程序开发经验优先。\n\n岗位职责：\n1. 负责前端页面开发与维护\n2. 参与技术方案设计\n3. 协同后端完成接口联调',
      perks: ['周末双休', '五险一金', '弹性工作', '免费体检'],
      companyId: company.id,
      recruiterId: recruiter.id,
    },
    {
      title: 'Node.js 后端工程师',
      nature: 'FULL_TIME' as const,
      city: '深圳',
      province: '广东',
      salaryRange: '18k-30k',
      minDegree: 'BACHELOR' as const,
      minExpYears: 2,
      description: '负责服务端 API 开发，熟悉 NestJS/Express，有 PostgreSQL/MySQL 经验。',
      perks: ['周末双休', '五险一金', '年终奖'],
      companyId: company.id,
      recruiterId: recruiter.id,
    },
    {
      title: 'UI/UX 设计师',
      nature: 'FULL_TIME' as const,
      city: '北京',
      province: '北京',
      salaryRange: '15k-25k',
      minDegree: 'BACHELOR' as const,
      minExpYears: 2,
      description: '负责产品界面设计，熟悉 Figma，有移动端设计经验优先。',
      perks: ['弹性工作', '五险一金', '出国旅游'],
      companyId: company2.id,
      recruiterId: recruiter.id,
    },
    {
      title: '产品经理（兼职）',
      nature: 'PART_TIME' as const,
      city: '成都',
      province: '四川',
      salaryRange: '5k-10k',
      minDegree: 'ANY' as const,
      minExpYears: 0,
      description: '负责产品需求分析，每周工作3天，适合在校学生或副业人士。',
      perks: ['弹性工作'],
      companyId: company.id,
      recruiterId: recruiter.id,
    },
    {
      title: 'Java 实习生',
      nature: 'INTERNSHIP' as const,
      city: '上海',
      province: '上海',
      salaryRange: '3k-5k',
      minDegree: 'ASSOCIATE' as const,
      minExpYears: 0,
      description: '参与后端系统开发，在校学生优先，每周至少4天。',
      perks: ['五险一金', '转正机会'],
      companyId: company2.id,
      recruiterId: recruiter.id,
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: { ...job, perks: job.perks } });
  }

  console.log(`✅ Seeded ${jobs.length} jobs, 2 companies, 1 recruiter`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
