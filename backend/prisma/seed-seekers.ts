import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  const seekers = [
    {
      id: 'mock-seeker-002',
      phone: '13800000011',
      nickname: '张伟',
      realName: '张伟',
      gender: 'MALE' as const,
      city: '上海',
      roleTitle: '后端工程师',
      selfDesc: '5年Java开发经验，熟悉Spring Boot、微服务架构，有大型互联网公司经历。',
      educations: [{ school: '复旦大学', major: '软件工程', degree: 'BACHELOR', start: '2015-09', end: '2019-06' }],
      workExps: [
        { company: '字节跳动', title: '高级Java工程师', city: '上海', content: '负责推荐系统后端开发，日均QPS 50万+', start: '2021-07', end: null },
        { company: '携程旅行', title: 'Java工程师', city: '上海', content: '订单中台服务开发与维护', start: '2019-07', end: '2021-06' },
      ],
    },
    {
      id: 'mock-seeker-003',
      phone: '13800000012',
      nickname: '王芳',
      realName: '王芳',
      gender: 'FEMALE' as const,
      city: '深圳',
      roleTitle: 'UI设计师',
      selfDesc: '专注移动端UI设计3年，熟练使用Figma、Sketch，有独立完成从需求到上线全流程的经验。',
      educations: [{ school: '深圳大学', major: '视觉传达设计', degree: 'BACHELOR', start: '2017-09', end: '2021-06' }],
      workExps: [
        { company: '腾讯', title: 'UI设计师', city: '深圳', content: '负责微信小程序视觉规范制定与交互设计', start: '2022-03', end: null },
        { company: '猿辅导', title: '初级UI设计师', city: '北京', content: '教育产品视觉设计，完成多个版本迭代', start: '2021-07', end: '2022-02' },
      ],
    },
    {
      id: 'mock-seeker-004',
      phone: '13800000013',
      nickname: '刘洋',
      realName: '刘洋',
      gender: 'MALE' as const,
      city: '北京',
      roleTitle: '产品经理',
      selfDesc: '4年C端产品经验，主导过从0到1的产品从立项到百万DAU，擅长数据分析和用户研究。',
      educations: [{ school: '北京大学', major: '信息管理', degree: 'MASTER', start: '2016-09', end: '2019-06' }],
      workExps: [
        { company: '美团', title: '高级产品经理', city: '北京', content: '负责到店业务产品设计，DAU增长150%', start: '2021-06', end: null },
        { company: '滴滴出行', title: '产品经理', city: '北京', content: '出行场景产品设计与迭代', start: '2019-07', end: '2021-05' },
      ],
    },
    {
      id: 'mock-seeker-005',
      phone: '13800000014',
      nickname: '陈静',
      realName: '陈静',
      gender: 'FEMALE' as const,
      city: '广州',
      roleTitle: '运营专员',
      selfDesc: '2年内容运营经验，负责过公众号从1万到20万粉丝的增长，熟悉新媒体矩阵运营。',
      educations: [{ school: '中山大学', major: '新闻传播', degree: 'BACHELOR', start: '2019-09', end: '2023-06' }],
      workExps: [
        { company: '网易云音乐', title: '内容运营专员', city: '广州', content: '负责UGC内容生态运营，策划多个爆款活动', start: '2023-07', end: null },
      ],
    },
    {
      id: 'mock-seeker-006',
      phone: '13800000015',
      nickname: '赵磊',
      realName: '赵磊',
      gender: 'MALE' as const,
      city: '成都',
      roleTitle: '数据分析师',
      selfDesc: '3年数据分析经验，熟练Python、SQL、Tableau，有电商和金融行业数据建模经验。',
      educations: [
        { school: '电子科技大学', major: '统计学', degree: 'MASTER', start: '2018-09', end: '2021-06' },
        { school: '电子科技大学', major: '数学', degree: 'BACHELOR', start: '2014-09', end: '2018-06' },
      ],
      workExps: [
        { company: '京东', title: '数据分析师', city: '成都', content: '负责供应链数据分析，优化库存周转率20%', start: '2022-01', end: null },
        { company: '东方财富', title: '初级数据分析师', city: '成都', content: '股票行情数据清洗与报表开发', start: '2021-07', end: '2021-12' },
      ],
    },
    {
      id: 'mock-seeker-007',
      phone: '13800000016',
      nickname: '孙晓',
      realName: '孙晓',
      gender: 'FEMALE' as const,
      city: '杭州',
      roleTitle: '前端工程师（实习）',
      selfDesc: '在校大学生，熟悉Vue3、TypeScript，参与过开源项目，期待在实际项目中积累经验。',
      educations: [{ school: '浙江大学', major: '计算机科学', degree: 'BACHELOR', start: '2022-09', end: '2026-06' }],
      workExps: [
        { company: '阿里巴巴', title: '前端实习生', city: '杭州', content: '参与淘宝商家后台功能开发，完成3个需求的独立交付', start: '2024-07', end: '2024-10' },
      ],
    },
  ];

  for (const s of seekers) {
    // Upsert user
    await prisma.user.upsert({
      where: { phone: s.phone },
      update: { nickname: s.nickname },
      create: {
        id: s.id,
        phone: s.phone,
        passwordHash: hash,
        role: 'SEEKER',
        nickname: s.nickname,
      },
    });

    // Upsert seeker profile
    const profile = await prisma.seekerProfile.upsert({
      where: { userId: s.id },
      update: { realName: s.realName, city: s.city, roleTitle: s.roleTitle, selfDesc: s.selfDesc },
      create: {
        userId: s.id,
        realName: s.realName,
        gender: s.gender,
        city: s.city,
        roleTitle: s.roleTitle,
        selfDesc: s.selfDesc,
      },
    });

    // Recreate educations
    await prisma.education.deleteMany({ where: { profileId: profile.id } });
    for (let i = 0; i < s.educations.length; i++) {
      const e = s.educations[i];
      await prisma.education.create({
        data: {
          profileId: profile.id,
          school: e.school,
          major: e.major,
          degree: e.degree as any,
          startDate: new Date(e.start + '-01'),
          endDate: e.end ? new Date(e.end + '-01') : null,
          sortOrder: i,
        },
      });
    }

    // Recreate work experiences
    await prisma.workExperience.deleteMany({ where: { profileId: profile.id } });
    for (let i = 0; i < s.workExps.length; i++) {
      const w = s.workExps[i];
      await prisma.workExperience.create({
        data: {
          profileId: profile.id,
          company: w.company,
          title: w.title,
          city: w.city,
          content: w.content,
          startDate: new Date(w.start + '-01'),
          endDate: w.end ? new Date(w.end + '-01') : null,
          sortOrder: i,
        },
      });
    }

    console.log(`✅ ${s.realName} (${s.phone}) seeded`);
  }

  console.log('\n✅ All seekers seeded!');
  console.log('Accounts: 13800000011~16, password: Test1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
