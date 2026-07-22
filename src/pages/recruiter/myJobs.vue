<template>
    <view class="page">
        <scroll-view class="scroll" scroll-y>
            <view class="list" :style="{ paddingBottom: `${safeBottom + 40}px` }">
                <wd-empty v-if="!loading && !jobs.length" tip="暂无已发布职位" />
                <view v-for="job in jobs" :key="job.id" class="card">
                    <view class="card__main">
                        <view class="card__topRow">
                            <view class="card__title">{{ job.title }}</view>
                            <view class="card__statusBadge" :class="[`card__statusBadge--${job.status}`]">
                                {{ statusLabel(job.status) }}
                            </view>
                        </view>
                        <view class="card__meta">
                            <view class="metaItem">{{ job.nature }}</view>
                            <view class="metaDot" />
                            <view class="metaItem">{{ job.city }}</view>
                            <view class="metaDot" />
                            <view class="metaItem">{{ job.salary }}</view>
                        </view>
                        <view class="card__time">发布于 {{ job.time }}</view>
                    </view>
                    <view class="card__actions">
                        <view class="actionBtn" hover-class="actionBtn--pressed"
                            @click="handleEdit(job.id)">编辑</view>
                        <view class="actionBtn actionBtn--danger" hover-class="actionBtn--pressed"
                            @click="handleClose(job.id)">下线</view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <wd-toast selector="myJobsToast" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import { apiGetMyPostedJobs, apiCloseJob } from '@/api/index'

const toast = useToast('myJobsToast')
const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

type Job = {
    id: string
    title: string
    nature: string
    city: string
    salary: string
    status: string
    time: string
}

const jobs = ref<Job[]>([])
const loading = ref(false)

const natureMap: Record<string, string> = {
    FULL_TIME: '全职', PART_TIME: '兼职', INTERNSHIP: '实习',
}

const statusLabel = (s: string) => {
    if (s === 'ACTIVE' || s === 'OPEN') return '招聘中'
    if (s === 'CLOSED' || s === 'INACTIVE') return '已关闭'
    if (s === 'PAUSED') return '已暂停'
    return s
}

const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const fetchJobs = async () => {
    loading.value = true
    try {
        const res: any = await apiGetMyPostedJobs({ page: 1, limit: 50 })
        jobs.value = (res?.items || []).map((j: any) => ({
            id: j.id,
            title: j.title,
            nature: natureMap[j.nature] || j.nature || '全职',
            city: j.city || '不限',
            salary: j.salaryRange || '面议',
            status: j.status || 'OPEN',
            time: formatDate(j.createdAt),
        }))
    } catch { /* ignore */ } finally {
        loading.value = false
    }
}

onMounted(fetchJobs)

const handleEdit = (id: string) => {
    uni.navigateTo({ url: `/pages/recruiter/jobPosting?editId=${id}` as any })
}

const handleClose = (id: string) => {
    uni.showModal({
        title: '确认下线',
        content: '下线后该职位将停止接受简历，确认继续？',
        confirmColor: '#ff4d4f',
        success: async ({ confirm }) => {
            if (!confirm) return
            try {
                await apiCloseJob(id)
                toast.success('已下线')
                jobs.value = jobs.value.filter(j => j.id !== id)
            } catch { /* handled by request.ts */ }
        },
    })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: var(--app-bg);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.list {
    padding: 18rpx 26rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.card {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.88);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx;
    box-sizing: border-box;
}

.card__topRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
    margin-bottom: 10rpx;
}

.card__title {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    flex: 1 1 auto;
    min-width: 0;
}

.card__statusBadge {
    flex: 0 0 auto;
    font-size: 22rpx;
    font-weight: 900;
    padding: 4rpx 16rpx;
    border-radius: 999rpx;
    background: rgba(0, 200, 83, 0.12);
    color: #00b050;
}

.card__statusBadge--ACTIVE {
    background: rgba(0, 200, 83, 0.12);
    color: #00b050;
}

.card__statusBadge--CLOSED,
.card__statusBadge--INACTIVE {
    background: rgba(0, 0, 0, 0.06);
    color: rgba(0, 0, 0, 0.38);
}

.card__statusBadge--PAUSED {
    background: rgba(255, 153, 0, 0.12);
    color: #e67700;
}

.card__meta {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 8rpx;
}

.metaItem {
    font-size: 24rpx;
    font-weight: 800;
    color: var(--app-text-muted);
}

.metaDot {
    width: 6rpx;
    height: 6rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.18);
    flex: 0 0 auto;
}

.card__time {
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.30);
    font-weight: 800;
}

.card__actions {
    display: flex;
    gap: 16rpx;
    margin-top: 18rpx;
    padding-top: 16rpx;
    border-top: 1px solid var(--app-line);
}

.actionBtn {
    flex: 1 1 0;
    height: 68rpx;
    border-radius: var(--app-radius-md);
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.06);
    font-size: 26rpx;
    font-weight: 900;
    color: var(--app-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.actionBtn--pressed {
    opacity: 0.8;
}

.actionBtn--danger {
    background: rgba(255, 77, 79, 0.06);
    border-color: rgba(255, 77, 79, 0.18);
    color: #ff4d4f;
}
</style>
