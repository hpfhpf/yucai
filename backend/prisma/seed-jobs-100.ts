import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 确保公司存在
  const companies = await Promise.all([
    prisma.company.upsert({ where: { name: '腾讯科技（深圳）有限公司' }, update: {}, create: { name: '腾讯科技（深圳）有限公司', industry: '互联网', scale: '10000人以上', city: '深圳', province: '广东', isVerified: true, creditScore: 95 } }),
    prisma.company.upsert({ where: { name: '字节跳动有限公司' }, update: {}, create: { name: '字节跳动有限公司', industry: '互联网', scale: '10000人以上', city: '北京', province: '北京', isVerified: true, creditScore: 92 } }),
    prisma.company.upsert({ where: { name: '阿里巴巴集团' }, update: {}, create: { name: '阿里巴巴集团', industry: '互联网', scale: '10000人以上', city: '杭州', province: '浙江', isVerified: true, creditScore: 94 } }),
    prisma.company.upsert({ where: { name: '美团科技有限公司' }, update: {}, create: { name: '美团科技有限公司', industry: '互联网', scale: '10000人以上', city: '北京', province: '北京', isVerified: true, creditScore: 88 } }),
    prisma.company.upsert({ where: { name: '华为技术有限公司' }, update: {}, create: { name: '华为技术有限公司', industry: '通信/硬件', scale: '10000人以上', city: '深圳', province: '广东', isVerified: true, creditScore: 97 } }),
    prisma.company.upsert({ where: { name: '京东集团' }, update: {}, create: { name: '京东集团', industry: '电商', scale: '10000人以上', city: '北京', province: '北京', isVerified: true, creditScore: 89 } }),
    prisma.company.upsert({ where: { name: '网易（杭州）网络有限公司' }, update: {}, create: { name: '网易（杭州）网络有限公司', industry: '游戏/互联网', scale: '5000-10000人', city: '杭州', province: '浙江', isVerified: true, creditScore: 86 } }),
    prisma.company.upsert({ where: { name: '中国平安保险集团' }, update: {}, create: { name: '中国平安保险集团', industry: '金融/保险', scale: '10000人以上', city: '深圳', province: '广东', isVerified: true, creditScore: 91 } }),
    prisma.company.upsert({ where: { name: '新东方教育科技集团' }, update: {}, create: { name: '新东方教育科技集团', industry: '教育', scale: '10000人以上', city: '北京', province: '北京', isVerified: true, creditScore: 82 } }),
    prisma.company.upsert({ where: { name: '招商银行股份有限公司' }, update: {}, create: { name: '招商银行股份有限公司', industry: '金融/银行', scale: '10000人以上', city: '深圳', province: '广东', isVerified: true, creditScore: 93 } }),
  ]);

  const recruiter = await prisma.recruiter.upsert({
    where: { userId: 'mock-recruiter-001' },
    update: {},
    create: { userId: 'mock-recruiter-001', companyId: companies[0].id, realName: '王HR', department: '技术部', isVerified: true },
  });

  const [tencent, bytedance, alibaba, meituan, huawei, jd, netease, ping_an, xdf, cmbbank] = companies;

  type NatureType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP';
  type DegreeType = 'ANY' | 'JUNIOR_HIGH' | 'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTOR';

  const jobs: Array<{
    title: string; nature: NatureType; city: string; province: string;
    salaryRange: string; minDegree: DegreeType; minExpYears: number;
    description: string; perks: string[]; companyId: string; recruiterId: string;
  }> = [
    // ===== 互联网/技术 全职 =====
    { title: '高级 React 前端工程师', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '25k-40k', minDegree: 'BACHELOR', minExpYears: 4, description: '负责公司核心业务的前端架构设计与开发，技术栈 React 18 + TypeScript。', perks: ['股票期权', '弹性工作', '五险一金', '免费三餐'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: 'Go 后端开发工程师', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '22k-38k', minDegree: 'BACHELOR', minExpYears: 3, description: '参与搜索/推荐系统后端开发，掌握分布式系统原理。', perks: ['年终奖', '五险一金', '健康保险', '带薪年假'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '大数据开发工程师', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '20k-35k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责数据仓库建设与 ETL 开发，熟悉 Flink/Spark/Hive。', perks: ['股票期权', '弹性工作', '五险一金', '交通补贴'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: 'Java 架构师', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '35k-60k', minDegree: 'BACHELOR', minExpYears: 6, description: '主导电商平台核心系统架构设计，熟悉高并发分布式系统。', perks: ['股票期权', '年终奖', '五险一金', '住房补贴'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: 'iOS 开发工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '18k-30k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责微信相关 App 的 iOS 功能开发与优化。', perks: ['股票期权', '弹性工作', '五险一金', '班车'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: 'Android 开发工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '18k-30k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责 Android 端产品研发，熟悉 Kotlin/Java 开发。', perks: ['股票期权', '弹性工作', '五险一金', '免费体检'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: '算法工程师（推荐系统）', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '30k-55k', minDegree: 'MASTER', minExpYears: 2, description: '负责短视频推荐算法研究与落地，有 CTR/排序模型经验优先。', perks: ['股票期权', '年终奖', '弹性工作', '五险一金'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '机器学习工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '28k-50k', minDegree: 'MASTER', minExpYears: 2, description: '负责 NLP/CV 模型工程化落地，熟悉 PyTorch/TensorFlow。', perks: ['股票期权', '五险一金', '技术培训', '年终奖'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '嵌入式软件工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责智能硬件固件开发，熟悉 C/C++，有 RTOS 经验优先。', perks: ['年终奖', '五险一金', '带薪年假'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '网络安全工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '20k-35k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责企业网络安全防护与渗透测试，有 CISP/CISSP 证书优先。', perks: ['年终奖', '五险一金', '专项培训'], companyId: huawei.id, recruiterId: recruiter.id },

    // ===== 产品/运营 全职 =====
    { title: '产品经理（用户增长）', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '18k-30k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责用户增长策略制定，有 A/B 测试和数据分析经验。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '高级运营专员', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '10k-18k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责平台商家运营，熟悉电商运营数据分析工具。', perks: ['五险一金', '年终奖', '餐补'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '内容运营经理', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责平台内容生态建设，熟悉 MCN 运营及创作者激励机制。', perks: ['股票期权', '五险一金', '弹性工作', '远程办公'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '市场品牌经理', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '15k-22k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责品牌市场策略规划与执行，有 4A 广告或快消品经验优先。', perks: ['五险一金', '年终奖', '出差补贴'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '电商运营专员', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '8k-14k', minDegree: 'ASSOCIATE', minExpYears: 1, description: '负责淘宝/天猫店铺日常运营，有电商平台操作经验。', perks: ['五险一金', '年终奖'], companyId: alibaba.id, recruiterId: recruiter.id },

    // ===== 设计 全职 =====
    { title: 'UI/UX 高级设计师', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '18k-28k', minDegree: 'BACHELOR', minExpYears: 4, description: '负责核心产品视觉与交互设计，精通 Figma，有系统化设计经验。', perks: ['弹性工作', '五险一金', '年终奖'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '游戏美术原画师', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '12k-22k', minDegree: 'ANY', minExpYears: 2, description: '负责游戏角色/场景原画设计，精通 PS/SAI，有东方风格作品集优先。', perks: ['弹性工作', '五险一金', '作品版权保留'], companyId: netease.id, recruiterId: recruiter.id },
    { title: '3D 动画设计师', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '12k-20k', minDegree: 'ANY', minExpYears: 2, description: '负责游戏内 3D 角色动作绑定与动画制作，熟悉 Maya/Blender。', perks: ['弹性工作', '五险一金', '技术沙龙'], companyId: netease.id, recruiterId: recruiter.id },

    // ===== 数据/分析 全职 =====
    { title: '数据分析师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责业务数据分析，支持产品迭代决策，熟悉 SQL/Python/Tableau。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '风险量化分析师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '20k-40k', minDegree: 'MASTER', minExpYears: 2, description: '负责信用风险建模，熟悉 SAS/Python，有金融工程背景优先。', perks: ['股票期权', '五险一金', '专业培训'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '商业智能（BI）工程师', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '18k-28k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责 BI 报表开发及数据可视化平台建设，熟悉 Power BI/Tableau。', perks: ['五险一金', '年终奖', '带薪学习'], companyId: jd.id, recruiterId: recruiter.id },

    // ===== 销售/客服 全职 =====
    { title: '企业销售经理（华东）', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责华东地区企业客户开拓与维护，有 SaaS/云服务销售经验优先。', perks: ['提成无上限', '五险一金', '出差补贴'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '客户成功经理', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '10k-18k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责企业客户 SaaS 产品使用培训与续约，降低客户流失率。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '高级客服专员', nature: 'FULL_TIME', city: '武汉', province: '湖北', salaryRange: '6k-10k', minDegree: 'ASSOCIATE', minExpYears: 1, description: '负责处理电商平台客户投诉及售后，熟悉 CRM 系统。', perks: ['五险一金', '年终奖', '餐补'], companyId: jd.id, recruiterId: recruiter.id },

    // ===== 金融/银行 全职 =====
    { title: '理财顾问', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '8k-18k', minDegree: 'BACHELOR', minExpYears: 1, description: '为高净值客户提供个人理财规划，有基金/保险从业资格证优先。', perks: ['提成', '五险一金', '节日福利'], companyId: cmbbank.id, recruiterId: recruiter.id },
    { title: '零售信贷客户经理', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '8k-15k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责个人住房/消费贷款业务开展，完成月度信贷指标。', perks: ['提成', '五险一金', '年终奖'], companyId: cmbbank.id, recruiterId: recruiter.id },
    { title: '金融风控分析师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责贷款审批风险评估，有征信数据分析经验。', perks: ['五险一金', '年终奖', '专业培训'], companyId: ping_an.id, recruiterId: recruiter.id },

    // ===== 教育 全职 =====
    { title: '英语课程顾问', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '8k-16k', minDegree: 'BACHELOR', minExpYears: 0, description: '负责向家长介绍英语培训课程，完成招生任务，有教育行业销售经验优先。', perks: ['提成无上限', '五险一金', '内部培训'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '在线教育产品经理', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责在线直播课 App 产品规划，有 K12 教育产品经验优先。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '教研内容设计师', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '10k-16k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责 K12 数学课程内容研发与质量管控，师范类专业优先。', perks: ['五险一金', '年终奖', '带薪培训'], companyId: xdf.id, recruiterId: recruiter.id },

    // ===== 人力/行政 全职 =====
    { title: 'HR 招聘专员', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '7k-12k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责研发岗位简历筛选与面试安排，有互联网招聘经验优先。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: 'HRBP（人力资源业务伙伴）', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 4, description: '支持业务部门 HR 策略落地，熟悉绩效管理与组织发展。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '行政助理', nature: 'FULL_TIME', city: '西安', province: '陕西', salaryRange: '5k-8k', minDegree: 'ASSOCIATE', minExpYears: 0, description: '协助部门日常行政事务，会议安排、差旅报销、物资管理等。', perks: ['五险一金', '年终奖', '节日福利'], companyId: huawei.id, recruiterId: recruiter.id },

    // ===== 法务/财务 全职 =====
    { title: '法务专员', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '10k-18k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责公司合同审核及法律合规工作，法律专业背景，有律师资格证优先。', perks: ['五险一金', '年终奖', '带薪年假'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '财务分析经理', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '18k-30k', minDegree: 'BACHELOR', minExpYears: 5, description: '负责集团财务规划与经营分析，有 CPA/CFA 证书优先。', perks: ['五险一金', '年终奖', '绩效奖金'], companyId: ping_an.id, recruiterId: recruiter.id },

    // ===== 其他全职 =====
    { title: '供应链管理专员', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '10k-16k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责采购计划制定与供应商管理，有 ERP 系统使用经验。', perks: ['五险一金', '年终奖', '员工优惠'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '仓储物流主管', nature: 'FULL_TIME', city: '武汉', province: '湖北', salaryRange: '8k-14k', minDegree: 'ASSOCIATE', minExpYears: 3, description: '负责仓库日常管理与物流配送协调，有大型仓储管理经验。', perks: ['五险一金', '年终奖', '班车'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '游戏策划师（数值）', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '12k-22k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责游戏经济系统数值设计与平衡性调整，有 MMORPG 项目经验优先。', perks: ['弹性工作', '五险一金', '游戏内部测试福利'], companyId: netease.id, recruiterId: recruiter.id },
    { title: '游戏服务器工程师', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '20k-35k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责游戏后端服务开发，C++ 为主，熟悉 Redis/MySQL 等。', perks: ['弹性工作', '五险一金', '年终奖'], companyId: netease.id, recruiterId: recruiter.id },
    { title: '测试工程师（自动化）', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '14k-22k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责功能测试与自动化框架建设，熟悉 Selenium/Appium/JMeter。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: jd.id, recruiterId: recruiter.id },
    { title: 'DevOps 工程师', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '18k-32k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责 CI/CD 流程建设与云基础设施运维，熟悉 Kubernetes/Docker/Terraform。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '技术支持工程师', nature: 'FULL_TIME', city: '南京', province: '江苏', salaryRange: '8k-14k', minDegree: 'ASSOCIATE', minExpYears: 1, description: '负责为客户提供产品使用及故障排查技术支持，有一线技术支持经验。', perks: ['五险一金', '年终奖'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '售前解决方案工程师', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 3, description: '支持企业级客户投标方案制作与技术演示，熟悉云计算/AI 方向。', perks: ['五险一金', '差旅补贴', '年终奖'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '项目经理（PMP）', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '18k-30k', minDegree: 'BACHELOR', minExpYears: 4, description: '负责互联网产品研发项目管理，有 PMP/PMI-ACP 证书优先。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: '云计算架构师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '35k-60k', minDegree: 'BACHELOR', minExpYears: 6, description: '负责企业级云方案设计，熟悉腾讯云/AWS/阿里云产品体系。', perks: ['股票期权', '年终奖', '五险一金'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: '微信小程序开发工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '16k-28k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责微信生态小程序/公众号开发，熟悉 UniApp/Taro 优先。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: tencent.id, recruiterId: recruiter.id },

    // ===== 更多城市全职 =====
    { title: '软件研发工程师', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 1, description: '参与公司 SaaS 产品后端开发，Java/Spring Boot 技术栈。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '数据工程师', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '14k-22k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责数据管道建设与数仓开发，熟悉 Spark/Airflow/Kafka。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '前端开发工程师', nature: 'FULL_TIME', city: '西安', province: '陕西', salaryRange: '10k-18k', minDegree: 'BACHELOR', minExpYears: 1, description: 'Vue3 + TypeScript 开发企业管理后台，参与组件库建设。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: 'Python 后端工程师', nature: 'FULL_TIME', city: '南京', province: '江苏', salaryRange: '15k-25k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责 AI 平台后端 API 开发，Django/FastAPI 技术栈。', perks: ['五险一金', '年终奖', '技术培训'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '区块链开发工程师', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '25k-45k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责金融科技区块链平台开发，熟悉 Solidity/Go。', perks: ['股票期权', '五险一金', '年终奖'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '保险精算师（助理）', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '15k-30k', minDegree: 'MASTER', minExpYears: 0, description: '负责寿险/健康险产品定价，有精算师考试通过经历优先。', perks: ['五险一金', '年终奖', '考试费用报销'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '直播运营专员', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '8k-15k', minDegree: 'ANY', minExpYears: 1, description: '负责直播间选品、主播管理及实时运营互动，有电商直播经验优先。', perks: ['五险一金', '提成', '免费试用产品'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '新媒体运营经理', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责抖音/微博/微信公众号账号矩阵运营，有 10W+ 爆文经验优先。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: 'SEO 优化专员', nature: 'FULL_TIME', city: '杭州', province: '浙江', salaryRange: '7k-12k', minDegree: 'ANY', minExpYears: 1, description: '负责电商平台商品搜索排名优化，有跨境电商 SEO 经验优先。', perks: ['五险一金', '年终奖'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '国际贸易专员', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '8k-14k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责跨境电商平台海外商家招募与支持，英语流利。', perks: ['五险一金', '年终奖', '出国机会'], companyId: alibaba.id, recruiterId: recruiter.id },

    // ===== 兼职 =====
    { title: '在线英语家教（兼职）', nature: 'PART_TIME', city: '北京', province: '北京', salaryRange: '150-300元/小时', minDegree: 'BACHELOR', minExpYears: 0, description: '为 K12 学生提供在线英语辅导，有教学经验或雅思/托福高分者优先。', perks: ['灵活排班', '远程上课'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '兼职摄影师', nature: 'PART_TIME', city: '上海', province: '上海', salaryRange: '500-1500元/天', minDegree: 'ANY', minExpYears: 0, description: '为品牌电商产品拍摄棚拍及外拍图片，有商业摄影作品集。', perks: ['灵活接单', '设备补贴'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '市场调研员（兼职）', nature: 'PART_TIME', city: '深圳', province: '广东', salaryRange: '120-200元/天', minDegree: 'ANY', minExpYears: 0, description: '按计划完成指定地点的市场调研与访谈任务，按单结算。', perks: ['灵活时间', '交通补贴'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '数据标注员（兼职）', nature: 'PART_TIME', city: '成都', province: '四川', salaryRange: '4k-7k', minDegree: 'HIGH_SCHOOL', minExpYears: 0, description: '完成图像/语音/文本标注任务，支持远程居家办公。', perks: ['灵活上班', '远程办公'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '视频剪辑（兼职）', nature: 'PART_TIME', city: '杭州', province: '浙江', salaryRange: '6k-12k', minDegree: 'ANY', minExpYears: 1, description: '负责短视频及直播切片剪辑，熟悉 Premiere/剪映，接项目计酬。', perks: ['远程工作', '弹性排班'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '翻译（兼职/英日韩）', nature: 'PART_TIME', city: '广州', province: '广东', salaryRange: '100-200元/千字', minDegree: 'BACHELOR', minExpYears: 0, description: '承接技术文档/法律合同翻译，英语/日语/韩语方向均有需求。', perks: ['远程工作', '弹性时间'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '社群运营助手（兼职）', nature: 'PART_TIME', city: '北京', province: '北京', salaryRange: '3k-6k', minDegree: 'ANY', minExpYears: 0, description: '协助管理微信社群，每日推送内容及回答用户问题，每天 2-3 小时。', perks: ['远程工作', '灵活时间'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: 'Python 脚本开发（兼职）', nature: 'PART_TIME', city: '武汉', province: '湖北', salaryRange: '5k-10k', minDegree: 'ANY', minExpYears: 1, description: '按需开发数据采集/处理脚本，项目制合作，100% 远程。', perks: ['远程工作', '弹性合作'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '平面设计（兼职）', nature: 'PART_TIME', city: '南京', province: '江苏', salaryRange: '4k-8k', minDegree: 'ANY', minExpYears: 1, description: '协助设计部门完成日常海报/Banner 设计，熟悉 Photoshop/Illustrator。', perks: ['远程工作', '弹性上班'], companyId: netease.id, recruiterId: recruiter.id },
    { title: '英语口语陪练（兼职）', nature: 'PART_TIME', city: '上海', province: '上海', salaryRange: '80-150元/小时', minDegree: 'BACHELOR', minExpYears: 0, description: '为成人学员提供英语口语 1v1 对话练习，母语/海外留学背景优先。', perks: ['远程上课', '弹性时间'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '兼职数学讲师', nature: 'PART_TIME', city: '广州', province: '广东', salaryRange: '150-300元/小时', minDegree: 'BACHELOR', minExpYears: 0, description: '为初高中生提供数学线上辅导，数学/理工科专业在读优先。', perks: ['灵活排班', '远程授课'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '财务记账（兼职）', nature: 'PART_TIME', city: '深圳', province: '广东', salaryRange: '500-2000元/月', minDegree: 'ASSOCIATE', minExpYears: 1, description: '为中小企业提供代账服务，每月工作量约 10-20 小时，远程完成。', perks: ['远程工作', '灵活时间'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '问卷调查员（兼职）', nature: 'PART_TIME', city: '西安', province: '陕西', salaryRange: '80-150元/天', minDegree: 'ANY', minExpYears: 0, description: '按要求完成线上或线下问卷调查任务，按完成数量结算。', perks: ['灵活时间', '交通补贴'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '产品测试体验官（兼职）', nature: 'PART_TIME', city: '成都', province: '四川', salaryRange: '1k-3k', minDegree: 'ANY', minExpYears: 0, description: '体验测试新功能并提交反馈报告，每月约 10 小时，远程参与。', perks: ['远程工作', '免费使用产品'], companyId: meituan.id, recruiterId: recruiter.id },

    // ===== 实习 =====
    { title: '前端开发实习生', nature: 'INTERNSHIP', city: '北京', province: '北京', salaryRange: '200-250元/天', minDegree: 'ASSOCIATE', minExpYears: 0, description: '参与商业化产品前端开发，Vue3 技术栈，每周至少 4 天到岗。', perks: ['五险', '餐补', '转正机会'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '后端开发实习生', nature: 'INTERNSHIP', city: '深圳', province: '广东', salaryRange: '180-240元/天', minDegree: 'ASSOCIATE', minExpYears: 0, description: '参与电商系统后端开发，Java/Go 任一，每周至少 4 天。', perks: ['五险', '餐补', '转正机会'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: '数据分析实习生', nature: 'INTERNSHIP', city: '杭州', province: '浙江', salaryRange: '180-220元/天', minDegree: 'ASSOCIATE', minExpYears: 0, description: '协助业务数据分析工作，熟悉 Python/SQL，在校本科/研究生。', perks: ['五险', '餐补', '实习证明'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '产品经理实习生', nature: 'INTERNSHIP', city: '北京', province: '北京', salaryRange: '160-220元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '参与外卖产品需求分析与原型设计，有互联网实习经历优先。', perks: ['五险', '餐补', '导师制'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: 'UI 设计实习生', nature: 'INTERNSHIP', city: '杭州', province: '浙江', salaryRange: '150-200元/天', minDegree: 'ANY', minExpYears: 0, description: '协助设计师完成界面设计稿输出，熟悉 Figma，有作品集。', perks: ['餐补', '设计资源', '实习证明'], companyId: netease.id, recruiterId: recruiter.id },
    { title: '运营实习生', nature: 'INTERNSHIP', city: '上海', province: '上海', salaryRange: '140-180元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '协助商家运营团队完成日常数据监控与活动执行。', perks: ['餐补', '班车', '转正机会'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '测试实习生', nature: 'INTERNSHIP', city: '深圳', province: '广东', salaryRange: '150-200元/天', minDegree: 'ASSOCIATE', minExpYears: 0, description: '协助功能测试与 Bug 提交，有 Python/Selenium 基础优先。', perks: ['五险', '餐补', '实习证明'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '财务实习生', nature: 'INTERNSHIP', city: '深圳', province: '广东', salaryRange: '120-160元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '协助财务团队完成凭证整理、报表汇总，财会专业在读。', perks: ['餐补', '实习证明', '转正机会'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '法务实习生', nature: 'INTERNSHIP', city: '杭州', province: '浙江', salaryRange: '120-180元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '协助合同审核与法律研究工作，法学专业在读，有司法考试备考经历优先。', perks: ['餐补', '实习证明', '指导律师带教'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '市场营销实习生', nature: 'INTERNSHIP', city: '北京', province: '北京', salaryRange: '130-180元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '协助品牌营销活动策划与执行，市场营销/传播学专业优先。', perks: ['餐补', '班车', '实习证明'], companyId: xdf.id, recruiterId: recruiter.id },

    // ===== 补充到100条 =====
    { title: 'C++ 研发工程师（无人驾驶）', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '28k-50k', minDegree: 'MASTER', minExpYears: 2, description: '参与自动驾驶感知算法工程化，熟悉 ROS/CUDA，有激光雷达数据处理经验优先。', perks: ['股票期权', '五险一金', '弹性工作', '年终奖'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '硬件测试工程师', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '10k-18k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责硬件产品可靠性及兼容性测试，熟悉万用表/示波器等仪器。', perks: ['五险一金', '年终奖'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '物联网软件开发工程师', nature: 'FULL_TIME', city: '武汉', province: '湖北', salaryRange: '14k-22k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责智能家居 IoT 平台开发，熟悉 MQTT/CoAP 协议。', perks: ['五险一金', '年终奖', '弹性工作'], companyId: huawei.id, recruiterId: recruiter.id },
    { title: '人工智能产品经理', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '22k-38k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责 AI 大模型应用产品从 0 到 1，有 NLP/CV 产品落地经验。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '兼职直播助手', nature: 'PART_TIME', city: '广州', province: '广东', salaryRange: '3k-6k', minDegree: 'ANY', minExpYears: 0, description: '协助主播直播过程中的评论回复、商品上架及订单跟进，每晚 3 小时。', perks: ['灵活排班', '提成分成'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '客服实习生（在线）', nature: 'INTERNSHIP', city: '成都', province: '四川', salaryRange: '100-140元/天', minDegree: 'HIGH_SCHOOL', minExpYears: 0, description: '处理电商平台用户在线咨询，支持远程办公，每天 6 小时。', perks: ['餐补', '实习证明'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '品牌设计师', nature: 'FULL_TIME', city: '成都', province: '四川', salaryRange: '12k-20k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责企业 VI/品牌物料设计，精通 AI/PS，有系统化品牌设计经验。', perks: ['五险一金', '弹性工作', '年终奖'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '采购专员', nature: 'FULL_TIME', city: '南京', province: '江苏', salaryRange: '8k-14k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责 IT 设备及耗材采购，有供应链谈判经验，熟悉招投标流程。', perks: ['五险一金', '年终奖'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '全栈工程师', nature: 'FULL_TIME', city: '上海', province: '上海', salaryRange: '18k-32k', minDegree: 'BACHELOR', minExpYears: 3, description: '负责电商平台前后端开发，TypeScript + Node.js + React 技术栈。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: jd.id, recruiterId: recruiter.id },
    { title: '运维工程师（云平台）', nature: 'FULL_TIME', city: '深圳', province: '广东', salaryRange: '12k-22k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责腾讯云基础设施运维，熟悉 Linux/Ansible/监控体系建设。', perks: ['五险一金', '年终奖', '轮班补贴'], companyId: tencent.id, recruiterId: recruiter.id },
    { title: '首席技术官助理（实习）', nature: 'INTERNSHIP', city: '北京', province: '北京', salaryRange: '200-280元/天', minDegree: 'MASTER', minExpYears: 0, description: '协助 CTO 完成技术调研与竞品分析，每周至少 3 天，全程英文沟通。', perks: ['餐补', '导师制', '转正机会'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '销售助理（实习）', nature: 'INTERNSHIP', city: '上海', province: '上海', salaryRange: '120-160元/天', minDegree: 'BACHELOR', minExpYears: 0, description: '协助销售团队完成客户资料整理与 CRM 录入，市场营销专业优先。', perks: ['餐补', '实习证明', '班车'], companyId: alibaba.id, recruiterId: recruiter.id },
    { title: '短视频创作者（兼职）', nature: 'PART_TIME', city: '成都', province: '四川', salaryRange: '3k-8k', minDegree: 'ANY', minExpYears: 0, description: '为品牌账号产出短视频内容，按条结算，支持异地远程合作。', perks: ['远程工作', '弹性时间', '素材支持'], companyId: bytedance.id, recruiterId: recruiter.id },
    { title: '电话销售专员（兼职）', nature: 'PART_TIME', city: '西安', province: '陕西', salaryRange: '3k-6k', minDegree: 'HIGH_SCHOOL', minExpYears: 0, description: '通过电话开拓潜在用户，每天工作 4 小时，底薪加提成。', perks: ['提成无上限', '灵活时间'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '生鲜品控专员', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '8k-13k', minDegree: 'ASSOCIATE', minExpYears: 1, description: '负责生鲜商品进货质量验收与冷链管理，有食品安全相关证书优先。', perks: ['五险一金', '年终奖', '员工优惠'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '骑行配送团队督导', nature: 'FULL_TIME', city: '广州', province: '广东', salaryRange: '7k-12k', minDegree: 'HIGH_SCHOOL', minExpYears: 2, description: '负责城市配送团队日常管理与绩效考核，有基层管理经验优先。', perks: ['五险一金', '年终奖'], companyId: meituan.id, recruiterId: recruiter.id },
    { title: '保险理赔专员', nature: 'FULL_TIME', city: '武汉', province: '湖北', salaryRange: '7k-12k', minDegree: 'BACHELOR', minExpYears: 1, description: '负责个人及企业保险理赔申请受理与审核，有保险从业资格证优先。', perks: ['五险一金', '年终奖', '内部培训'], companyId: ping_an.id, recruiterId: recruiter.id },
    { title: '教育技术研发工程师', nature: 'FULL_TIME', city: '北京', province: '北京', salaryRange: '16k-26k', minDegree: 'BACHELOR', minExpYears: 2, description: '负责在线教育平台技术研发，熟悉直播/点播流媒体技术优先。', perks: ['股票期权', '五险一金', '弹性工作'], companyId: xdf.id, recruiterId: recruiter.id },
    { title: '仓储运营实习生', nature: 'INTERNSHIP', city: '北京', province: '北京', salaryRange: '110-150元/天', minDegree: 'ASSOCIATE', minExpYears: 0, description: '协助仓储团队完成货物盘点与系统录入，物流/供应链专业优先。', perks: ['餐补', '实习证明', '班车'], companyId: jd.id, recruiterId: recruiter.id },
    { title: 'AI 绘画设计师（兼职）', nature: 'PART_TIME', city: '上海', province: '上海', salaryRange: '200-500元/稿', minDegree: 'ANY', minExpYears: 0, description: '使用 Stable Diffusion/MidJourney 为游戏/品牌生成概念图，按稿结算。', perks: ['远程工作', '弹性时间', '素材支持'], companyId: netease.id, recruiterId: recruiter.id },
  ];

  let count = 0;
  for (const job of jobs) {
    await prisma.job.create({ data: { ...job, perks: job.perks } });
    count++;
  }

  console.log(`✅ Seeded ${count} jobs across ${companies.length} companies`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
