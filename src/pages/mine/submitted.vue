<template>
    <view class="page">
        <view class="header">
            <HeaderNav title="我的投递" type="show-back" theme="000" />
        </view>

        <wd-tabs v-model="activeTab" line-theme="normal" :line-width="32" :line-height="5" custom-class="submitted-tabs"
            @change="handleTabChange">
            <wd-tab title="全部投递" name="success">
                <scroll-view class="list" scroll-y>
                    <view class="list__inner">
                        <wd-empty v-if="!loading && !listFor('success').length" tip="暂无投递记录" />
                        <view v-for="job in listFor('success')" :key="job.id" class="jobCard" hover-class="jobCard--pressed"
                            @click="handleJobTap(job.jobId)">
                            <view class="jobCard__top">
                                <view class="jobCard__name">{{ job.title }}</view>
                                <view class="jobCard__salary">{{ job.salary }}</view>
                            </view>
                            <view class="jobCard__tags">
                                <wd-tag size="small">{{ job.city || '地点不限' }}</wd-tag>
                                <wd-tag size="small">{{ job.degree }}</wd-tag>
                            </view>
                            <view class="jobCard__bottom">
                                <view class="jobCard__company">{{ job.company }}</view>
                                <view class="jobCard__time">{{ formatTime(job.createdAt) }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </wd-tab>
            <wd-tab title="进入流程" name="viewed">
                <scroll-view class="list" scroll-y>
                    <view class="list__inner">
                        <wd-empty v-if="!loading && !listFor('viewed').length" tip="暂无已查看记录" />
                        <view v-for="job in listFor('viewed')" :key="job.id" class="jobCard" hover-class="jobCard--pressed"
                            @click="handleJobTap(job.jobId)">
                            <view class="jobCard__top">
                                <view class="jobCard__name">{{ job.title }}</view>
                                <view class="jobCard__salary">{{ job.salary }}</view>
                            </view>
                            <view class="jobCard__tags">
                                <wd-tag size="small">{{ job.city || '地点不限' }}</wd-tag>
                                <wd-tag size="small">{{ job.degree }}</wd-tag>
                            </view>
                            <view class="jobCard__bottom">
                                <view class="jobCard__company">{{ job.company }}</view>
                                <view class="jobCard__time">{{ formatTime(job.createdAt) }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </wd-tab>
            <wd-tab title="定向投递" name="targeted">
                <scroll-view class="list" scroll-y>
                    <view class="list__inner">
                        <wd-empty v-if="!loading && !listFor('targeted').length" tip="暂无定向投递" />
                        <view v-for="job in listFor('targeted')" :key="job.id" class="jobCard" hover-class="jobCard--pressed"
                            @click="handleTailoredTap(job)">
                            <view class="jobCard__top">
                                <view class="jobCard__name">{{ job.title }}</view>
                                <view class="jobCard__salary">{{ job.salary }}</view>
                            </view>
                            <view class="jobCard__tags">
                                <wd-tag size="small" type="primary">定向</wd-tag>
                                <wd-tag size="small">{{ statusLabel(job.status) }}</wd-tag>
                                <wd-tag size="small">{{ job.city || '地点不限' }}</wd-tag>
                            </view>
                            <view class="jobCard__bottom">
                                <view class="jobCard__company">{{ job.company }}</view>
                                <view class="jobCard__time">{{ formatTime(job.createdAt) }} · 查看定制简历 ›</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </wd-tab>
        </wd-tabs>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetMyDeliveries } from '@/api/index'

type Job = { id: string; jobId: string; title: string; salary: string; city: string; degree: string; company: string; createdAt: string; status: string; tailoredResumeId?: string | null }

type TabKey = 'success' | 'viewed' | 'targeted'
const activeTab = ref<TabKey>('success')
const allDeliveries = ref<Job[]>([])
const targetedList = ref<Job[]>([])
const loading = ref(false)

const statusText: Record<string, string> = {
    PENDING: '待查看', VIEWED: '已查看', INTERVIEW: '面试中', ACCEPTED: '已录用', REJECTED: '未通过',
}

const degreeMap: Record<string, string> = {
    ANY: '学历不限', ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}

const statusGroups: Record<string, string[]> = {
    success: ['PENDING', 'VIEWED'],
    viewed: ['INTERVIEW', 'ACCEPTED', 'REJECTED'],
}

const listFor = (tab: TabKey) => {
    if (tab === 'targeted') return targetedList.value
    return allDeliveries.value.filter(d => statusGroups[tab]?.includes(d.status))
}

const mapDelivery = (d: any): Job => ({
    id: d.id,
    jobId: d.jobId,
    title: d.job?.title || '',
    salary: d.job?.salaryRange || '薪资面议',
    city: d.job?.city || '',
    degree: degreeMap[d.job?.minDegree] || '学历不限',
    company: d.job?.company?.name || '',
    createdAt: d.createdAt,
    status: d.status,
    tailoredResumeId: d.tailoredResumeId,
})

const formatTime = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}月${d.getDate()}日`
}

onMounted(async () => {
    loading.value = true
    try {
        const [all, targeted]: any[] = await Promise.all([
            apiGetMyDeliveries({ page: 1, limit: 50 }),
            apiGetMyDeliveries({ page: 1, limit: 50, type: 'TARGETED' }),
        ])
        allDeliveries.value = (all.items || []).map(mapDelivery)
        targetedList.value = (targeted.items || []).map(mapDelivery)
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }
})

const handleTabChange = ({ name }: { name: TabKey }) => { activeTab.value = name }
const handleJobTap = (jobId: string) => {
    uni.navigateTo({ url: `/pages/recommendation/detail/index?id=${jobId}` as any })
}

// 定向投递卡片：查看当次投递关联的定制简历详情
const handleTailoredTap = (job: Job) => {
    if (!job.tailoredResumeId) return
    uni.navigateTo({ url: `/pages/seeker/tailorResume/detail?id=${job.tailoredResumeId}` as any })
}

const statusLabel = (s: string) => statusText[s] || s
</script>

<style scoped lang="scss">
:root {
    --bg: #eef3ff;
    --card: rgba(255, 255, 255, 0.96);
    --text: rgba(0, 0, 0, 0.86);
    --sub: rgba(0, 0, 0, 0.56);
    --muted: rgba(0, 0, 0, 0.38);
    --line: rgba(0, 0, 0, 0.06);
    --shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.10);
    --blue: #1e5bff;
    --orange: #ff7a00;
}

.page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
}

.header {
    background-color: #FFF;
    flex-shrink: 0;
}

.list {
    flex: 1 1 auto;
}

.list__inner {
    padding: 22rpx 22rpx 0;
    box-sizing: border-box;
}

.jobCard {
    border-radius: 20rpx;
    background: var(--card);
    border: 1px solid rgba(255, 255, 255, 0.84);
    box-shadow: var(--shadow);
    padding: 22rpx 22rpx 20rpx;
}

.jobCard+.jobCard {
    margin-top: 18rpx;
}

.jobCard--pressed {
    transform: scale(0.99);
    opacity: 0.94;
}

.jobCard__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
}

.jobCard__name {
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
}

.jobCard__salary {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--orange);
}

.jobCard__tags {
    margin-top: 14rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.jobCard__bottom {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
}

.jobCard__company {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.38);
}

.jobCard__time {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.34);
}
</style>
