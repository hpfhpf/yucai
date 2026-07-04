/**
 * 将所有非标准薪资格式归一化为 K 制选项
 * Standard options: 3k-5k | 5k-8k | 8k-12k | 12k-20k | 20k以上 | 面议
 * Run: npx ts-node -r tsconfig-paths/register prisma/normalize-salary.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const STANDARD = new Set(['3k-5k', '5k-8k', '8k-12k', '12k-20k', '20k以上', '面议'])

function normalize(raw: string | null): string {
    if (!raw) return '面议'
    const s = raw.trim()
    if (STANDARD.has(s)) return s

    // 元/xxx 格式（按稿/按小时/按天/按月等）→ 面议
    if (s.includes('元/')) return '面议'

    // 解析 K 值范围，取下界决定桶
    const m = s.match(/^(\d+(?:\.\d+)?)\s*k/i)
    if (!m) return '面议'
    const lo = parseFloat(m[1])
    if (lo < 5) return '3k-5k'
    if (lo < 8) return '5k-8k'
    if (lo < 12) return '8k-12k'
    if (lo < 20) return '12k-20k'
    return '20k以上'
}

async function main() {
    const jobs = await prisma.job.findMany({ select: { id: true, salaryRange: true } })
    let updated = 0
    let skipped = 0

    for (const job of jobs) {
        const normalized = normalize(job.salaryRange)
        if (normalized === job.salaryRange) { skipped++; continue }
        await prisma.job.update({ where: { id: job.id }, data: { salaryRange: normalized } })
        console.log(`  ${job.id.slice(-6)}  "${job.salaryRange}" → "${normalized}"`)
        updated++
    }

    console.log(`\nDone: updated=${updated} skipped=${skipped} total=${jobs.length}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
