<template>
    <view class="page">
        <view class="header">
            <HeaderNav title="简历中心" type="show-back" theme="000" />
        </view>

        <wd-tabs v-model="activeTab" line-theme="normal" :line-width="32" :line-height="5"
            custom-class="resumeTabs" @change="handleTabChange">
            <wd-tab v-for="tab in tabs" :key="tab.key" :title="tab.label" :name="tab.key">
                <scroll-view class="list" scroll-y>
                    <view class="list__inner">
                        <wd-empty v-if="!loading && !listFor(tab.key).length" tip="暂无记录" />
                        <view v-for="d in listFor(tab.key)" :key="d.id" class="card"
                            hover-class="card--pressed">
                            <view class="card__main" @click="viewResume(d)">
                                <view class="card__top">
                                    <view class="card__avatar">
                                        <image v-if="d.avatar" class="card__avatarImg" :src="d.avatar"
                                            mode="aspectFill" />
                                        <view v-else class="card__avatarPh" />
                                    </view>
                                    <view class="card__info">
                                        <view class="card__name">{{ d.name }}</view>
                                        <view class="card__role">{{ d.role }}</view>
                                    </view>
                                    <view class="card__right">
                                        <view class="card__time">{{ d.time }}</view>
                                        <view class="card__statusBadge" :class="`card__statusBadge--${d.status}`">
                                            {{ statusLabel(d.status) }}
                                        </view>
                                    </view>
                                </view>
                                <view class="card__job">投递职位：{{ d.jobTitle }}</view>
                                <view class="card__city" v-if="d.city">
                                    <wd-icon name="location" size="20rpx" color="rgba(0,0,0,0.28)" />
                                    {{ d.city }}
                                </view>
                            </view>

                            <view v-if="tab.key === 'PENDING'" class="card__actions">
                                <view class="actionBtn actionBtn--ghost" hover-class="actionBtn--pressed"
                                    @click="rejectDelivery(d)">不合适</view>
                                <view class="actionBtn actionBtn--primary" hover-class="actionBtn--pressed"
                                    @click="openInviteModal(d)">通知面试</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </wd-tab>
        </wd-tabs>

        <!-- 面试邀请 Modal -->
        <wd-popup v-model="showInvite" position="bottom" :safe-area-inset-bottom="true"
            custom-class="invitePopup">
            <view class="invitePanel">
                <view class="invitePanel__hd">
                    <view class="invitePanel__title">通知面试</view>
                    <view class="invitePanel__close" hover-class="invitePanel__close--pressed"
                        @click="showInvite = false">
                        <wd-icon name="close" size="26rpx" color="rgba(0,0,0,0.34)" />
                    </view>
                </view>

                <view v-if="inviteTarget" class="inviteTarget">
                    <view class="inviteTarget__name">{{ inviteTarget.name }}</view>
                    <view class="inviteTarget__job">投递：{{ inviteTarget.jobTitle }}</view>
                </view>

                <view class="inviteForm">
                    <view class="inviteRow">
                        <view class="inviteRow__label">面试职位</view>
                        <view class="inviteRow__field">
                            <wd-input v-model="inviteForm.position" compact custom-class="inviteInput"
                                placeholder="请输入面试职位" />
                        </view>
                    </view>
                    <view class="inviteDivider" />
                    <view class="inviteRow">
                        <view class="inviteRow__label">面试时间</view>
                        <view class="inviteRow__field">
                            <wd-input v-model="inviteForm.time" compact custom-class="inviteInput"
                                placeholder="如：2026-07-01 14:00" />
                        </view>
                    </view>
                    <view class="inviteDivider" />
                    <view class="inviteRow">
                        <view class="inviteRow__label">地点/方式</view>
                        <view class="inviteRow__field">
                            <wd-input v-model="inviteForm.location" compact custom-class="inviteInput"
                                placeholder="线下地址或线上会议链接" />
                        </view>
                    </view>
                    <view class="inviteDivider" />
                    <view class="inviteRow inviteRow--textarea">
                        <view class="inviteRow__label">备注</view>
                        <wd-textarea v-model="inviteForm.note" compact custom-class="inviteTextarea"
                            placeholder="其他说明（选填）" auto-height />
                    </view>
                </view>

                <view class="invitePanel__ft">
                    <wd-button type="primary" block :loading="inviting" custom-class="sendBtn"
                        @click="sendInvite">发送面试邀请</wd-button>
                </view>
            </view>
        </wd-popup>

        <wd-toast selector="resumeCenterToast" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetRecruiterDeliveries, apiUpdateDeliveryStatus, apiSendInvite, apiGetMyPostedJobs } from '@/api/index'

const toast = useToast('resumeCenterToast')

type TabKey = 'ALL' | 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED'

const tabs: { key: TabKey; label: string }[] = [
    { key: 'ALL', label: '全部' },
    { key: 'PENDING', label: '待处理' },
    { key: 'INTERVIEW', label: '已邀请' },
    { key: 'ACCEPTED', label: '通过' },
    { key: 'REJECTED', label: '不合适' },
]

const activeTab = ref<TabKey>('ALL')
const loading = ref(false)
const allDeliveries = ref<any[]>([])

type DeliveryCard = {
    id: string
    seekerUserId: string
    jobId: string
    jobTitle: string
    name: string
    role: string
    city: string
    avatar: string
    status: string
    time: string
}

const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return '刚刚'
    if (m < 60) return `${m}分钟前`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}小时前`
    return `${Math.floor(h / 24)}天前`
}

const mapDelivery = (d: any): DeliveryCard => ({
    id: d.id,
    seekerUserId: d.user?.id || d.userId,
    jobId: d.jobId,
    jobTitle: d.job?.title || '未知职位',
    name: d.user?.seekerProfile?.realName || d.user?.nickname || '求职者',
    role: d.user?.seekerProfile?.roleTitle || '',
    city: d.user?.seekerProfile?.city || '',
    avatar: d.user?.avatarUrl || '',
    status: d.status,
    time: formatRelative(d.createdAt),
})

const listFor = (tab: TabKey) => {
    if (tab === 'ALL') return allDeliveries.value
    return allDeliveries.value.filter(d => d.status === tab)
}

onMounted(async () => {
    loading.value = true
    try {
        const res: any = await apiGetRecruiterDeliveries({ page: 1, limit: 50 })
        allDeliveries.value = (res?.items || []).map(mapDelivery)
    } catch { /* ignore */ } finally {
        loading.value = false
    }
})

const statusLabel = (s: string) => {
    const map: Record<string, string> = {
        PENDING: '待处理', VIEWED: '已查看', INTERVIEW: '已邀请', ACCEPTED: '通过', REJECTED: '不合适',
    }
    return map[s] || s
}

const handleTabChange = ({ name }: { name: TabKey }) => { activeTab.value = name }

const viewResume = (d: DeliveryCard) => {
    uni.navigateTo({ url: `/pages/recruiter/resumeDetail?userId=${d.seekerUserId}` as any })
}

const rejectDelivery = async (d: DeliveryCard) => {
    try {
        await apiUpdateDeliveryStatus(d.id, { status: 'REJECTED' })
        d.status = 'REJECTED'
        toast.success('已标记为不合适')
    } catch { /* ignore */ }
}

// 面试邀请
const showInvite = ref(false)
const inviting = ref(false)
const inviteTarget = ref<DeliveryCard | null>(null)
const inviteForm = ref({ position: '', time: '', location: '', note: '' })
const myJobs = ref<any[]>([])

const openInviteModal = async (d: DeliveryCard) => {
    inviteTarget.value = d
    inviteForm.value = { position: d.jobTitle, time: '', location: '', note: '' }
    showInvite.value = true
    if (!myJobs.value.length) {
        try {
            const res: any = await apiGetMyPostedJobs({ page: 1, limit: 20 })
            myJobs.value = res?.items || []
        } catch { /* ignore */ }
    }
}

const sendInvite = async () => {
    if (!inviteTarget.value) return
    if (!inviteForm.value.time.trim()) { toast.info('请填写面试时间'); return }
    inviting.value = true
    try {
        const content = [
            `面试职位：${inviteForm.value.position}`,
            `面试时间：${inviteForm.value.time}`,
            inviteForm.value.location ? `地点/方式：${inviteForm.value.location}` : '',
            inviteForm.value.note ? `备注：${inviteForm.value.note}` : '',
        ].filter(Boolean).join('\n')

        await apiSendInvite({
            seekerUserId: inviteTarget.value.seekerUserId,
            jobId: inviteTarget.value.jobId,
            content,
        })
        await apiUpdateDeliveryStatus(inviteTarget.value.id, { status: 'INTERVIEW' })
        inviteTarget.value.status = 'INTERVIEW'
        showInvite.value = false
        toast.success('面试邀请已发送')
    } catch (e: any) {
        toast.info(e?.message || '发送失败')
    } finally {
        inviting.value = false
    }
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

.header {
    background: #FFF;
    flex-shrink: 0;
}

.list {
    flex: 1 1 auto;
}

.list__inner {
    padding: 18rpx 22rpx 0;
    box-sizing: border-box;
}

.card {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.92);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
}

.card+.card {
    margin-top: 18rpx;
}

.card--pressed {
    opacity: 0.94;
}

.card__main {
    padding: 18rpx 18rpx 14rpx;
}

.card__top {
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.card__avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: var(--app-radius-pill);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
    flex: 0 0 auto;
}

.card__avatarImg {
    width: 100%;
    height: 100%;
}

.card__avatarPh {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.18), rgba(30, 91, 255, 0.06));
}

.card__info {
    flex: 1 1 auto;
    min-width: 0;
}

.card__name {
    font-size: 30rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.84);
}

.card__role {
    margin-top: 6rpx;
    font-size: 24rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.card__right {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8rpx;
}

.card__time {
    font-size: 22rpx;
    color: var(--app-text-muted);
    font-weight: 800;
}

.card__statusBadge {
    font-size: 20rpx;
    font-weight: 900;
    padding: 4rpx 14rpx;
    border-radius: var(--app-radius-pill);
}

.card__statusBadge--PENDING {
    background: rgba(255, 152, 0, 0.10);
    color: rgba(230, 120, 0, 0.88);
}

.card__statusBadge--VIEWED {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.38);
}

.card__statusBadge--INTERVIEW {
    background: rgba(30, 91, 255, 0.08);
    color: rgba(30, 91, 255, 0.88);
}

.card__statusBadge--ACCEPTED {
    background: rgba(76, 175, 80, 0.10);
    color: rgba(56, 142, 60, 0.88);
}

.card__statusBadge--REJECTED {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.32);
}

.card__job {
    margin-top: 12rpx;
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.54);
}

.card__city {
    margin-top: 6rpx;
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    font-size: 22rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.38);
}

.card__actions {
    display: flex;
    gap: 12rpx;
    padding: 0 18rpx 18rpx;
    justify-content: flex-end;
}

.actionBtn {
    height: 64rpx;
    border-radius: var(--app-radius-pill);
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    font-weight: 900;
}

.actionBtn--ghost {
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.54);
}

.actionBtn--primary {
    background: rgba(30, 91, 255, 0.98);
    color: #FFF;
}

.actionBtn--pressed {
    opacity: 0.88;
}

// 邀请面板
:deep(.invitePopup) {
    border-radius: 28rpx 28rpx 0 0 !important;
}

.invitePanel {
    padding: 28rpx 26rpx 0;
}

.invitePanel__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18rpx;
}

.invitePanel__title {
    font-size: 34rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.84);
}

.invitePanel__close {
    width: 64rpx;
    height: 64rpx;
    border-radius: var(--app-radius-pill);
    display: flex;
    align-items: center;
    justify-content: center;
}

.invitePanel__close--pressed {
    background: rgba(0, 0, 0, 0.05);
}

.inviteTarget {
    padding: 14rpx 18rpx;
    border-radius: var(--app-radius-md);
    background: rgba(30, 91, 255, 0.05);
    border: 1px solid rgba(30, 91, 255, 0.10);
    margin-bottom: 18rpx;
}

.inviteTarget__name {
    font-size: 28rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.92);
}

.inviteTarget__job {
    margin-top: 4rpx;
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.46);
}

.inviteForm {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
    margin-bottom: 18rpx;
}

.inviteRow {
    min-height: 88rpx;
    padding: 0 18rpx;
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.inviteRow--textarea {
    align-items: flex-start;
    padding-top: 16rpx;
    padding-bottom: 16rpx;
}

.inviteRow__label {
    width: 120rpx;
    flex: 0 0 auto;
    font-size: 26rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.62);
}

.inviteRow__field {
    flex: 1 1 auto;
    min-width: 0;
}

:deep(.inviteInput) {
    flex: 1;
    min-width: 0;
    height: 88rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 88rpx;
        font-size: 26rpx;
        color: var(--app-text-primary) !important;
    }

    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 26rpx;
    }
}

:deep(.inviteTextarea) {
    flex: 1;
    background: transparent !important;

    .wd-textarea__inner {
        min-height: 80rpx;
        font-size: 26rpx;
        color: rgba(0, 0, 0, 0.72) !important;
    }

    .uni-textarea-placeholder {
        color: rgba(0, 0, 0, 0.26) !important;
        font-size: 26rpx;
    }
}

.inviteDivider {
    height: 1px;
    background: var(--app-line);
    margin-left: 18rpx;
}

.invitePanel__ft {
    padding-bottom: 12rpx;
}

:deep(.sendBtn) {
    height: 96rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 30rpx !important;
    font-weight: 950 !important;
    box-shadow: 0 16rpx 44rpx rgba(30, 91, 255, 0.26) !important;
}
</style>
