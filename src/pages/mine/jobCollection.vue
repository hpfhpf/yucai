<template>
    <view class="page">
        <view class="header">
            <HeaderNav title="职位收藏" type="show-back" theme="000" />
        </view>

        <wd-skeleton :loading="loading" animation="gradient" :row-col="skeletonRowCol" custom-class="skeleton">
            <view class="body">
                <view class="count">共 {{ jobs.length }} 个收藏</view>

                <scroll-view class="list" scroll-y>
                    <view class="list__inner">
                        <wd-empty v-if="!jobs.length" tip="暂无收藏职位" />
                        <view
                            v-for="job in jobs"
                            :key="job.id"
                            class="card"
                            hover-class="card--pressed"
                            @click="handleJobTap(job)"
                        >
                            <view class="card__top">
                                <view class="card__title">{{ job.title }}</view>
                                <view class="card__salary">{{ job.salary }}</view>
                            </view>
                            <view class="card__tags">
                                <wd-tag v-for="tag in job.tags" :key="tag" size="small" plain>{{ tag }}</wd-tag>
                            </view>
                            <view class="card__bottom">
                                <view class="card__company">{{ job.company }}</view>
                                <view class="card__time">{{ job.time }} 发布</view>
                            </view>
                        </view>
                        <view class="list__footer" />
                    </view>
                </scroll-view>
            </view>
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
    { width: '30%', height: '28rpx', borderRadius: '8rpx', margin: '0 0 24rpx' },
    { width: '100%', height: '176rpx', borderRadius: '22rpx', margin: '0 0 18rpx' },
    { width: '100%', height: '176rpx', borderRadius: '22rpx', margin: '0 0 18rpx' },
    { width: '100%', height: '176rpx', borderRadius: '22rpx', margin: '0 0 18rpx' },
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
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
}

.header {
    background: #fff;
    flex-shrink: 0;
}

.skeleton {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.body {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.count {
    text-align: center;
    font-size: 26rpx;
    color: var(--app-text-muted);
    margin-top: 12rpx;
    margin-bottom: 8rpx;
}

.list {
    flex: 1 1 auto;
}

.list__inner {
    padding: 16rpx 22rpx 0;
}

.list__footer {
    height: 40rpx;
}

.card {
    @include app-card-base;
    @include app-pressable-base;
    padding: 22rpx 22rpx 20rpx;
}

.card + .card {
    margin-top: 18rpx;
}

.card--pressed {
    @include app-pressable-active;
}

.card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
}

.card__title {
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__salary {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-accent);
    flex-shrink: 0;
}

.card__tags {
    margin-top: 14rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.card__bottom {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
}

.card__company {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.38);
}

.card__time {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.34);
}
</style>
