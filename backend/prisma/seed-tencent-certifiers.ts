/**
 * seed-tencent-certifiers.ts
 * 修复 mock-seeker-001 的腾讯科技工作经历（设置 companyId + endDate），
 * 并创建 2 名腾讯已认证同事，用于测试「推荐认证人」功能。
 *
 * 问题根因：
 *   1. seeker-001 的腾讯工作经历 companyId=null → getRecommendedCertifiers 第 418 行直接 return []
 *   2. 同一经历 endDate=null（在职）→ 隐私熔断过滤掉所有腾讯认证人
 *
 * 运行：npx ts-node prisma/seed-tencent-certifiers.ts
 *
 * 前置条件：已运行 seed-jobs.ts（腾讯科技公司已存在）
 *
 * 测试数据：
 *   - 王浩 (13800000022) LEAD  腾讯科技 2021-03 ~ 2024-06
 *   - 陈静 (13800000023) MGR_DIR 腾讯科技 2020-06 ~ 2024-12
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  // ─── 1. 找到腾讯科技公司 ───
  const tencent = await prisma.company.findUnique({ where: { name: '腾讯科技（深圳）有限公司' } });
  if (!tencent) throw new Error('腾讯科技公司不存在，请先运行 seed-jobs.ts');

  // ─── 2. 修复 seeker-001 的腾讯工作经历 ───
  // 找到 companyId=null、company='腾讯科技' 的那条记录（cmqqgxugk0003nprybvxpf6kx）
  // 更新：设置 companyId + endDate（2024-12-31 表示已离职，避免隐私熔断）
  const seeker001Profile = await prisma.seekerProfile.findUnique({ where: { userId: 'mock-seeker-001' } });
  if (!seeker001Profile) throw new Error('mock-seeker-001 的 SeekerProfile 不存在，请先运行 seed-certifiers.ts');

  const updated = await prisma.workExperience.updateMany({
    where: {
      profileId: seeker001Profile.id,
      company: '腾讯科技',
      companyId: null,
    },
    data: {
      companyId: tencent.id,
      company: '腾讯科技（深圳）有限公司',
      endDate: new Date('2024-12-31'),
    },
  });
  console.log(`✅ 更新了 ${updated.count} 条 seeker-001 腾讯工作经历（companyId + endDate 已设置）`);

  // ─── 3. 创建腾讯认证人 ───
  const certifiers = [
    {
      id: 'mock-certifier-003',
      phone: '13800000022',
      nickname: '王浩',
      realName: '王浩',
      level: 'LEAD' as const,
      roleTitle: '前端技术 Leader',
      workStart: '2021-03-01',
      workEnd: '2024-06-30',
    },
    {
      id: 'mock-certifier-004',
      phone: '13800000023',
      nickname: '陈静',
      realName: '陈静',
      level: 'MGR_DIR' as const,
      roleTitle: '产品总监',
      workStart: '2020-06-01',
      workEnd: '2024-12-31',
    },
  ];

  for (const c of certifiers) {
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

    const profile = await prisma.seekerProfile.upsert({
      where: { userId: c.id },
      update: { realName: c.realName, currentLevel: c.level, roleTitle: c.roleTitle },
      create: {
        userId: c.id,
        realName: c.realName,
        gender: 'MALE',
        city: '深圳',
        roleTitle: c.roleTitle,
        currentLevel: c.level,
      },
    });

    // 删除旧腾讯工作经历后重建
    await prisma.workExperience.deleteMany({ where: { profileId: profile.id, companyId: tencent.id } });
    const workExp = await prisma.workExperience.create({
      data: {
        profileId: profile.id,
        companyId: tencent.id,
        company: '腾讯科技（深圳）有限公司',
        title: c.roleTitle,
        city: '深圳',
        content: `在腾讯科技担任 ${c.roleTitle}，参与微信及企业级产品建设。`,
        startDate: new Date(c.workStart),
        endDate: new Date(c.workEnd),
        sortOrder: 0,
      },
    });

    await prisma.workCertification.upsert({
      where: { workExpId: workExp.id },
      update: { status: 'APPROVED' },
      create: {
        userId: c.id,
        workExpId: workExp.id,
        certifierId: 'mock-super-001',
        certifierType: 'ADMIN',
        status: 'APPROVED',
        relationship: 'COLLEAGUE',
        recommendation: `${c.realName} 在腾讯科技期间表现优异，工作经历属实。`,
        anonymous: false,
        shareExpireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    console.log(`✅ 认证人 ${c.realName} (${c.phone}) seeded，level=${c.level}`);
  }

  console.log('\n✅ 腾讯认证人种子数据完成！');
  console.log('测试步骤：');
  console.log('  1. 用 13800000001 / Test1234 登录（求职者）');
  console.log('  2. 简历中心 → 腾讯科技工作经历 → 申请认证 → 推荐列表应出现王浩、陈静');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
