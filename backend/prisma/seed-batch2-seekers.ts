import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 第二批求职者：与原始 seed-seekers.ts 结构完全一致，6 份完整简历
// 使用新 id（mock-seeker-b2-*）与新手机号（13800000111~116）避免唯一约束冲突
type SeekerSeed = {
  id: string;
  phone: string;
  nickname: string;
  realName: string;
  gender: 'MALE' | 'FEMALE';
  city: string;
  roleTitle: string;
  selfDesc: string;
  educations: { school: string; major: string; degree: string; start: string; end: string | null }[];
  workExps: { company: string; title: string; city: string; content: string; start: string; end: string | null }[];
};

const seekers: SeekerSeed[] = [
  {
    id: 'mock-seeker-b2-002',
    phone: '13800000111',
    nickname: '李强',
    realName: '李强',
    gender: 'MALE',
    city: '北京',
    roleTitle: '前端工程师',
    selfDesc: '6年前端开发经验，精通React、Vue生态，主导过大型中后台系统架构，有团队管理经验。',
    educations: [{ school: '北京航空航天大学', major: '计算机科学与技术', degree: 'BACHELOR', start: '2013-09', end: '2017-06' }],
    workExps: [
      { company: '百度', title: '高级前端工程师', city: '北京', content: '负责搜索前端平台建设，主导组件库从0到1', start: '2020-08', end: null },
      { company: '滴滴出行', title: '前端工程师', city: '北京', content: '出行业务H5与小程序开发', start: '2017-07', end: '2020-07' },
    ],
  },
  {
    id: 'mock-seeker-b2-003',
    phone: '13800000112',
    nickname: '周敏',
    realName: '周敏',
    gender: 'FEMALE',
    city: '上海',
    roleTitle: '产品经理',
    selfDesc: '5年B端产品经验，擅长供应链与SaaS系统设计，有从需求到落地的完整闭环经验。',
    educations: [{ school: '上海交通大学', major: '工业工程', degree: 'MASTER', start: '2015-09', end: '2018-06' }],
    workExps: [
      { company: '拼多多', title: '高级产品经理', city: '上海', content: '负责商家后台交易系统产品设计，服务百万级商家', start: '2021-03', end: null },
      { company: '携程', title: '产品经理', city: '上海', content: '供应商管理平台产品迭代', start: '2018-07', end: '2021-02' },
    ],
  },
  {
    id: 'mock-seeker-b2-004',
    phone: '13800000113',
    nickname: '吴涛',
    realName: '吴涛',
    gender: 'MALE',
    city: '深圳',
    roleTitle: '嵌入式工程师',
    selfDesc: '4年嵌入式开发经验，熟悉C/C++、RTOS，有无人机与智能硬件项目落地经验。',
    educations: [{ school: '哈尔滨工业大学', major: '电子信息工程', degree: 'BACHELOR', start: '2015-09', end: '2019-06' }],
    workExps: [
      { company: '大疆创新', title: '嵌入式工程师', city: '深圳', content: '负责飞控固件开发与传感器驱动适配', start: '2021-05', end: null },
      { company: '中兴通讯', title: '初级嵌入式工程师', city: '深圳', content: '通信模组底层软件开发', start: '2019-07', end: '2021-04' },
    ],
  },
  {
    id: 'mock-seeker-b2-005',
    phone: '13800000114',
    nickname: '郑雪',
    realName: '郑雪',
    gender: 'FEMALE',
    city: '北京',
    roleTitle: '数据分析师',
    selfDesc: '3年数据分析经验，精通SQL、Python、Tableau，有互联网广告与用户增长分析经验。',
    educations: [{ school: '中国人民大学', major: '统计学', degree: 'MASTER', start: '2018-09', end: '2021-06' }],
    workExps: [
      { company: '快手', title: '数据分析师', city: '北京', content: '负责商业化广告数据分析，支持投放策略优化', start: '2021-07', end: null },
    ],
  },
  {
    id: 'mock-seeker-b2-006',
    phone: '13800000115',
    nickname: '孙浩',
    realName: '孙浩',
    gender: 'MALE',
    city: '上海',
    roleTitle: '后端工程师',
    selfDesc: '5年后端开发经验，熟悉Java、Go微服务架构，有高并发交易系统设计经验。',
    educations: [
      { school: '同济大学', major: '软件工程', degree: 'MASTER', start: '2016-09', end: '2019-06' },
      { school: '同济大学', major: '计算机科学', degree: 'BACHELOR', start: '2012-09', end: '2016-06' },
    ],
    workExps: [
      { company: '哔哩哔哩', title: '高级后端工程师', city: '上海', content: '负责会员与支付系统后端开发，日均订单百万级', start: '2021-09', end: null },
      { company: '拼多多', title: '后端工程师', city: '上海', content: '交易链路服务开发与性能优化', start: '2019-07', end: '2021-08' },
    ],
  },
  {
    id: 'mock-seeker-b2-007',
    phone: '13800000116',
    nickname: '林悦',
    realName: '林悦',
    gender: 'FEMALE',
    city: '杭州',
    roleTitle: 'UI设计师（实习）',
    selfDesc: '在校研究生，熟悉Figma、C4D，参与过多个校园品牌设计项目，期待在实践中成长。',
    educations: [{ school: '中国美术学院', major: '视觉传达设计', degree: 'MASTER', start: '2023-09', end: '2026-06' }],
    workExps: [
      { company: '网易', title: 'UI设计实习生', city: '杭州', content: '参与游戏官网与活动页视觉设计，完成2个专题上线', start: '2024-06', end: '2024-09' },
    ],
  },
];

async function main() {
  const hash = await bcrypt.hash('Test1234', 12);

  for (const s of seekers) {
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

  console.log('\n✅ All batch2 seekers seeded!');
  console.log('Accounts: 13800000111~116, password: Test1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
