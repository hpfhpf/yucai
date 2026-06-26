<template>
    <view class="page">
        <HeaderNav title="职位收藏" type="show-back" theme="000" />

        <wd-skeleton :loading="loading" animation="gradient" :row-col="skeletonRowCol">
            <view class="count">共{{ jobs.length }}条</view>

            <scroll-view class="list" scroll-y>
                <view class="list__inner">
                    <template v-if="jobs.length">
                        <view v-for="job in jobs" :key="job.id" class="card" hover-class="card--pressed"
                            @click="handleJobTap(job)">
                            <view class="card__top">
                                <view class="card__title">{{ job.title }}</view>
                                <view class="card__salary">{{ job.salary }}</view>
                            </view>
                            <view class="card__tags">
                                <wd-tag v-for="tag in job.tags" :key="tag" size="small">{{ tag }}</wd-tag>
                            </view>
                            <view class="card__bottom">
                                <view class="card__company">{{ job.company }}</view>
                                <view class="card__time">{{ job.time }}发布</view>
                            </view>
                        </view>
                    </template>
                    <wd-empty v-else tip="暂无收藏职位" />
                </view>
            </scroll-view>
        </wd-skeleton>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetMyFavorites } from '@/api/index'

type JobItem = {
    id: string
    jobId: string
    title: string
    salary: string
    tags: string[]
    company: string
    time: string
}

const loading = ref(true)
const jobs = ref<JobItem[]>([])

const skeletonRowCol = [
    { width: '40%', height: '32rpx', borderRadius: '8rpx', margin: '0 auto 24rpx' },
    { width: '100%', height: '180rpx', borderRadius: '22rpx', margin: '0 0 22rpx' },
    { width: '100%', height: '180rpx', borderRadius: '22rpx', margin: '0 0 22rpx' },
    { width: '100%', height: '180rpx', borderRadius: '22rpx', margin: '0 0 22rpx' },
]

const degreeMap: Record<string, string> = {
    ANY: '学历不限', ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}

const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return '今天'
    if (days < 7) return `${days}天前`
    const d = new Date(iso)
    return `${d.getMonth() + 1}月${d.getDate()}日`
}

onMounted(async () => {
    try {
        const res: any = await apiGetMyFavorites({ page: 1, limit: 50 })
        jobs.value = (res.items || []).map((f: any) => ({
            id: f.id,
            jobId: f.jobId,
            title: f.job?.title || '',
            salary: f.job?.salaryRange || '薪资面议',
            tags: [f.job?.city, degreeMap[f.job?.minDegree]].filter(Boolean),
            company: f.job?.company?.name || '',
            time: formatTime(f.job?.createdAt || f.createdAt),
        }))
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }
})

const handleJobTap = (job: JobItem) => {
    uni.navigateTo({ url: `/pages/recommendation/detail/index?id=${job.jobId}` as any })
}
</script>

<style scoped lang="scss">
:root {
    --bg: #eaf0ff;
    --card: rgba(255, 255, 255, 0.92);
    --text: rgba(0, 0, 0, 0.92);
    --salary: #1e5bff;
    --shadow: 0 14rpx 40rpx rgba(30, 60, 140, 0.08);
    --radius: 22rpx;
}

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 240rpx, var(--bg) 520rpx, var(--bg) 100%);
    display: flex;
    flex-direction: column;
}

.count {
    position: relative;
    z-index: 1;
    margin-top: 10rpx;
    text-align: center;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.32);
}

.list {
    flex: 1 1 auto;
}

.list__inner {
    padding: 0 24rpx 40rpx;
}

.card {
    background: var(--card);
    border-radius: var(--radius);
    padding: 34rpx 34rpx 28rpx;
    box-shadow: var(--shadow);
    margin-top: 22rpx;
}

.card--pressed {
    transform: scale(0.99);
    opacity: 0.96;
}

.card__top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 18rpx;
}

.card__title {
    color: var(--text);
    font-size: 40rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__salary {
    color: var(--salary);
    font-size: 40rpx;
    font-weight: 800;
    letter-spacing: 1rpx;
}

.card__tags {
    margin-top: 18rpx;
    display: flex;
    gap: 16rpx;
    flex-wrap: wrap;
}

.card__bottom {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card__company {
    font-size: 30rpx;
    color: rgba(0, 0, 0, 0.36);
}

.card__time {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.28);
}
</style>
