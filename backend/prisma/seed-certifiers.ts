/**
 * seed-certifiers.ts
 * 创建可用于「推荐认证人」功能测试的数据：
 *
 * 1. 给 mock-seeker-001（13800000001）创建 SeekerProfile + WorkExperience，
 *    并将该工作经历关联到「字节跳动有限公司」（需已运行 seed-jobs.ts）
 *
 * 2. 创建 2 名已认证的同事（认证人），均在字节跳动有时间重叠的工作经历 + APPROVED WorkCertification
 *    - 李强  (13800000020)  LEAD  团队主管  2019-01 ~ 2023-06
 *    - 周梅  (13800000021)  MGR_DIR 总监  2018-06 ~ 2022-12
 *
 * 运行：npx ts-node prisma/seed-certifiers.ts
 *
 * 注意：mock-seeker-001 的字节跳动工作经历 startDate=2020-01-01，endDate=null（在职），
 * 两名认证人的经历均与之重叠，可正常出现在推荐列表。
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  // ─── 1. 获取字节跳动公司（seed-jobs.ts 已建）───
  const bytedance = await prisma.company.findUnique({ where: { name: '字节跳动有限公司' } });
  if (!bytedance) {
    throw new Error('字节跳动公司不存在，请先运行 seed-jobs.ts');
  }

  // ─── 2. 给 mock-seeker-001 建立 SeekerProfile + 字节跳动工作经历 ───
  const seeker001Profile = await prisma.seekerProfile.upsert({
    where: { userId: 'mock-seeker-001' },
    update: { realName: '测试求职者', city: '北京', roleTitle: '高级前端工程师', currentAnnualSalary: 40, currentLevel: 'IC' },
    create: {
      userId: 'mock-seeker-001',
      realName: '测试求职者',
      gender: 'MALE',
      city: '北京',
      roleTitle: '高级前端工程师',
      selfDesc: '测试账号，用于验证认证推荐功能。',
      currentAnnualSalary: 40,
      currentLevel: 'IC',
    },
  });

  // 删除已有字节跳动工作经历后重建（避免重复）
  await prisma.workExperience.deleteMany({
    where: { profileId: seeker001Profile.id, companyId: bytedance.id },
  });

  const seeker001WorkExp = await prisma.workExperience.create({
    data: {
      profileId: seeker001Profile.id,
      companyId: bytedance.id,
      company: '字节跳动有限公司',
      title: '高级前端工程师',
      city: '北京',
      content: '负责推荐系统前端架构，主导 UniApp + Vue3 技术升级。',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2023-12-31'),  // 已离职（若 null 则触发隐私熔断，认证人被过滤掉）
      sortOrder: 0,
    },
  });

  console.log(`✅ mock-seeker-001 WorkExperience at 字节跳动 created: ${seeker001WorkExp.id}`);

  // ─── 3. 创建认证人 ───
  const certifiers = [
    {
      id: 'mock-certifier-001',
      phone: '13800000020',
      nickname: '李强',
      realName: '李强',
      level: 'LEAD' as const,
      roleTitle: '前端技术 Leader',
      workStart: '2019-01-01',
      workEnd: '2023-06-30',
    },
    {
      id: 'mock-certifier-002',
      phone: '13800000021',
      nickname: '周梅',
      realName: '周梅',
      level: 'MGR_DIR' as const,
      roleTitle: '技术总监',
      workStart: '2018-06-01',
      workEnd: '2022-12-31',
    },
  ];

  for (const c of certifiers) {
    // 3a. 用户表
    await prisma.user.upsert({
      where: { phone: c.phone },
      update: { nickname: c.nickname },
      create: {
        id: c.id,
        phone: c.phone,
        passwordHash: hash,
        role: 'SEEKER',
        nickname: c.nickname,
      },
    });

    // 3b. SeekerProfile（含 currentLevel，用于推荐排序）
    const profile = await prisma.seekerProfile.upsert({
      where: { userId: c.id },
      update: { realName: c.realName, currentLevel: c.level, roleTitle: c.roleTitle },
      create: {
        userId: c.id,
        realName: c.realName,
        gender: 'MALE',
        city: '北京',
        roleTitle: c.roleTitle,
        currentLevel: c.level,
      },
    });

    // 3c. 字节跳动工作经历（带 companyId，时间与 seeker001 重叠）
    await prisma.workExperience.deleteMany({
      where: { profileId: profile.id, companyId: bytedance.id },
    });
    const workExp = await prisma.workExperience.create({
      data: {
        profileId: profile.id,
        companyId: bytedance.id,
        company: '字节跳动有限公司',
        title: c.roleTitle,
        city: '北京',
        content: `在字节跳动担任 ${c.roleTitle}，参与大型前端基础设施建设。`,
        startDate: new Date(c.workStart),
        endDate: new Date(c.workEnd),   // 已离职，不触发隐私熔断
        sortOrder: 0,
      },
    });

    // 3d. APPROVED WorkCertification（由 super admin 认证，certifierId=super admin）
    //     使用 upsert 以 workExpId 为唯一键，避免重复
    await prisma.workCertification.upsert({
      where: { workExpId: workExp.id },
      update: { status: 'APPROVED' },
      create: {
        userId: c.id,
        workExpId: workExp.id,
        certifierId: 'mock-super-001',   // 超级管理员认证
        certifierType: 'ADMIN',
        status: 'APPROVED',
        relationship: 'COLLEAGUE',
        recommendation: `${c.realName} 在字节跳动期间表现优秀，工作经历属实。`,
        anonymous: false,
        shareExpireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 不过期
      },
    });

    console.log(`✅ 认证人 ${c.realName} (${c.phone}) seeded, level=${c.level}`);
  }

  console.log('\n✅ 认证人种子数据完成！');
  console.log('测试步骤：');
  console.log('  1. 用 13800000001 / Test1234 登录（求职者）');
  console.log('  2. 进入简历中心 → 工作经历 → 字节跳动「申请认证」');
  console.log(`  3. workExpId = ${seeker001WorkExp.id}`);
  console.log('  4. GET /v1/resume/work-exp/<workExpId>/recommend-certifiers 应返回李强、周梅');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
