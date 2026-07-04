/**
 * 第二批投递数据：与原始 seed-deliveries.ts 结构一致，7 条 PENDING 投递
 * 动态取第二批招聘官（mock-recruiter-b2-001）名下前 5 个职位，避免硬编码失效
 * Run: npx ts-node -r tsconfig-paths/register prisma/seed-batch2-deliveries.ts
 */
import { PrismaClient, DeliveryStatus } from '@prisma/client'

const prisma = new PrismaClient()

let JOBS: string[] = []

// seeker id → 投递的职位 index（与角色匹配，更真实）
const DELIVERIES: { userId: string; jobIdx: number; status: DeliveryStatus }[] = [
    { userId: 'mock-seeker-b2-002', jobIdx: 0, status: 'PENDING' }, // 李强 → 前端
    { userId: 'mock-seeker-b2-002', jobIdx: 1, status: 'PENDING' }, // 李强 → 后端（额外投）
    { userId: 'mock-seeker-b2-003', jobIdx: 3, status: 'PENDING' }, // 周敏 → 架构/产品
    { userId: 'mock-seeker-b2-004', jobIdx: 4, status: 'PENDING' }, // 吴涛 → Android/嵌入式
    { userId: 'mock-seeker-b2-005', jobIdx: 2, status: 'PENDING' }, // 郑雪 → 大数据
    { userId: 'mock-seeker-b2-006', jobIdx: 1, status: 'PENDING' }, // 孙浩 → 后端
    { userId: 'mock-seeker-b2-007', jobIdx: 0, status: 'PENDING' }, // 林悦 → 前端
]

async function main() {
    // 取第二批招聘官名下前 5 个职位（按创建时间正序）
    const recruiter = await prisma.recruiter.findUnique({
        where: { userId: 'mock-recruiter-b2-001' },
        select: { id: true },
    })
    if (!recruiter) {
        console.error('未找到第二批招聘官，请先运行 seed-batch2-jobs.ts')
        return
    }

    const jobs = await prisma.job.findMany({
        where: { recruiterId: recruiter.id },
        orderBy: { createdAt: 'asc' },
        take: 5,
        select: { id: true },
    })
    JOBS = jobs.map((j) => j.id)
    if (JOBS.length < 5) {
        console.error(`职位数量不足 5 个（当前 ${JOBS.length}），请先运行 seed-batch2-jobs.ts`)
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

    console.log(`\nDone: created=${created} skipped=${skipped}`)
    const total = await prisma.delivery.count()
    console.log(`Total deliveries in DB: ${total}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
