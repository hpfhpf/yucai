/**
 * 补齐各角色核心功能的自测数据：
 * - 求职者：职位收藏、消息/面试邀请
 * - 招聘官：收到的投递（已有）、发出的邀请
 * - 运营/超管：待审核实名认证、待认证企业、工作认证申请
 *
 * Run: cd backend && npx ts-node -r tsconfig-paths/register prisma/seed-interactions.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const created: Record<string, number> = {}

  await seedFavorites(created)
  await seedMessages(created)
  await seedIdVerifications(created)
  await seedUnverifiedCompanies(created)
  await seedWorkCertifications(created)

  console.log('\n===== 交互测试数据补齐完成 =====')
  console.log(JSON.stringify(created, null, 2))
}

// ===== 求职者：职位收藏 =====
async function seedFavorites(out: Record<string, number>) {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'asc' }, take: 8, select: { id: true },
  })
  // mock-seeker-001 收藏前 5 个职位
  let n = 0
  for (const j of jobs.slice(0, 5)) {
    try {
      await prisma.jobFavorite.create({ data: { userId: 'mock-seeker-001', jobId: j.id } })
      n++
    } catch (e: any) { if (e.code !== 'P2002') throw e }
  }
  out.favorites = n
}

// ===== 消息 / 面试邀请 =====
async function seedMessages(out: Record<string, number>) {
  const recruiter = 'mock-recruiter-001'
  const seeker = 'mock-seeker-001'
  const job = await prisma.job.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } })
  if (!job) { out.messages = 0; return }

  let n = 0
  // 招聘官 → 求职者：面试邀请
  await prisma.message.create({
    data: {
      type: 'INVITE', senderId: recruiter, receiverId: seeker, jobId: job.id,
      content: '您好，我们对您的简历很感兴趣，诚邀您参加面试，方便沟通吗？',
    },
  })
  n++
  // 招聘官 → 求职者：普通沟通
  await prisma.message.create({
    data: { type: 'CHAT', senderId: recruiter, receiverId: seeker, content: '请问您目前的求职状态如何？' },
  })
  n++
  // 求职者 → 招聘官：回复
  await prisma.message.create({
    data: { type: 'CHAT', senderId: seeker, receiverId: recruiter, content: '您好，我正在看新机会，可以详细聊聊这个岗位。' },
  })
  n++
  // 系统消息
  await prisma.message.create({
    data: { type: 'SYSTEM', senderId: seeker, receiverId: seeker, content: '您的简历已被 3 家企业查看，保持在线提升曝光。' },
  })
  n++
  out.messages = n
}

// ===== 待审核实名认证 =====
async function seedIdVerifications(out: Record<string, number>) {
  const targets = [
    { userId: 'mock-seeker-002', realName: '张伟', idNumber: '110101199001011234' },
    { userId: 'mock-seeker-003', realName: '王芳', idNumber: '110101199203052345' },
    { userId: 'mock-seeker-004', realName: '刘洋', idNumber: '310101199505103456' },
  ]
  let n = 0
  for (const t of targets) {
    try {
      await prisma.identityVerification.create({
        data: { userId: t.userId, realName: t.realName, idNumber: t.idNumber, status: 'PENDING' },
      })
      n++
    } catch (e: any) { if (e.code !== 'P2002') throw e }
  }
  out.idVerifications = n
}

// ===== 待认证企业 =====
async function seedUnverifiedCompanies(out: Record<string, number>) {
  const companies = [
    { name: '星辰科技（深圳）有限公司', industry: '互联网', scale: '100-499人', city: '深圳' },
    { name: '云图数据服务有限公司', industry: '大数据', scale: '50-99人', city: '杭州' },
  ]
  let n = 0
  for (const c of companies) {
    try {
      await prisma.company.create({ data: { ...c, isVerified: false } })
      n++
    } catch (e: any) { if (e.code !== 'P2002') throw e }
  }
  out.unverifiedCompanies = n
}

// ===== 工作认证申请（待认证）=====
async function seedWorkCertifications(out: Record<string, number>) {
  // 取 mock-seeker-001 的一条工作经历发起认证
  const profile = await prisma.seekerProfile.findUnique({
    where: { userId: 'mock-seeker-001' }, select: { id: true },
  })
  if (!profile) { out.workCertifications = 0; return }
  const workExp = await prisma.workExperience.findFirst({
    where: { profileId: profile.id }, select: { id: true },
  })
  if (!workExp) { out.workCertifications = 0; return }

  try {
    await prisma.workCertification.create({
      data: {
        userId: 'mock-seeker-001', workExpId: workExp.id,
        certifierType: 'ADMIN', status: 'PENDING', note: '申请官方工作认证',
      },
    })
    out.workCertifications = 1
  } catch (e: any) {
    if (e.code === 'P2002') out.workCertifications = 0
    else throw e
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
