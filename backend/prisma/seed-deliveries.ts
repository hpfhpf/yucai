/**
 * 创建测试投递数据
 * 让 6 个新求职者各投递 1-2 个职位，状态 PENDING，供招聘端「简历中心」测试
 * Run: npx ts-node -r tsconfig-paths/register prisma/seed-deliveries.ts
 */
import { PrismaClient, DeliveryStatus } from '@prisma/client'

const prisma = new PrismaClient()

// 运行时从数据库动态取前 5 个真实职位 id，避免硬编码失效
let JOBS: string[] = []

// seeker id → 投递的职位 indices（与角色匹配，更真实）
const DELIVERIES: { userId: string; jobIdx: number; status: DeliveryStatus }[] = [
    { userId: 'mock-seeker-002', jobIdx: 1, status: 'PENDING' }, // 张伟 → Node.js后端
    { userId: 'mock-seeker-002', jobIdx: 0, status: 'PENDING' }, // 张伟 → 前端（额外投）
    { userId: 'mock-seeker-003', jobIdx: 2, status: 'PENDING' }, // 王芳 → UI/UX
    { userId: 'mock-seeker-004', jobIdx: 3, status: 'PENDING' }, // 刘洋 → 产品经理
    { userId: 'mock-seeker-005', jobIdx: 3, status: 'PENDING' }, // 陈静 → 产品经理
    { userId: 'mock-seeker-006', jobIdx: 1, status: 'PENDING' }, // 赵磊 → Node.js后端
    { userId: 'mock-seeker-007', jobIdx: 0, status: 'PENDING' }, // 孙晓 → 前端实习→前端
]

async function main() {
    // 动态取前 5 个职位 id（按创建时间正序，保证稳定）
    const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'asc' },
        take: 5,
        select: { id: true },
    })
    JOBS = jobs.map((j) => j.id)
    if (JOBS.length < 5) {
        console.error(`职位数量不足 5 个（当前 ${JOBS.length}），请先运行 seed-jobs-100.ts`)
        return
    }

    let created = 0
    let skipped = 0

    for (const d of DELIVERIES) {
        const jobId = JOBS[d.jobIdx]
        try {
            await prisma.delivery.create({
                data: {
                    userId: d.userId,
                    jobId,
                    status: d.status,
                    creditAuthorized: true,
                },
            })
            created++
            console.log(`✓ ${d.userId} → job[${d.jobIdx}] (${d.status})`)
        } catch (e: any) {
            if (e.code === 'P2002') {
                skipped++
                console.log(`- skip ${d.userId} → job[${d.jobIdx}] (already exists)`)
            } else {
                throw e
            }
        }
    }

    // 把现有那条 VIEWED 重置为 PENDING，让招聘官可以在待处理里看到李明
    const updated = await prisma.delivery.updateMany({
        where: { userId: 'mock-seeker-001', status: 'VIEWED' },
        data: { status: 'PENDING' },
    })
    if (updated.count > 0) console.log(`✓ reset mock-seeker-001 delivery → PENDING`)

    console.log(`\nDone: created=${created} skipped=${skipped}`)
    const total = await prisma.delivery.count()
    console.log(`Total deliveries in DB: ${total}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
