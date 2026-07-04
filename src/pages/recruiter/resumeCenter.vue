<template>
    <view class="page">
        <view class="header">
            <HeaderNav title="简历中心" type="show-back" theme="000" />
        </view>

        <wd-tabs v-model="activeTab" line-theme="normal" :line-width="32" :line-height="5"
            custom-class="resumeTabs" slidable="always" @change="handleTabChange">
            <wd-tab v-for="tab in tabs" :key="tab.key" :title="tab.label" :name="tab.key">
                <scroll-view class="list" scroll-y :style="{ paddingBottom: `${safeBottom + 140}px` }">
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
                                    <FaIcon name="location-dot" :size="20" color="rgba(0,0,0,0.28)" />
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
                        <FaIcon name="xmark" :size="26" color="rgba(0,0,0,0.34)" />
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
                            <wd-cell title="" value="" center is-link custom-class="datePickerCell"
                                @click="showTimePicker = true">
                                <template #right-icon>
                                    <FaIcon name="calendar" :size="22" color="rgba(0,0,0,0.28)" />
                                </template>
                                <view class="datePickerCell__value">
                                    {{ inviteForm.time || '请选择面试时间' }}
                                </view>
                            </wd-cell>
                        </view>
                    </view>
                    <view class="inviteDivider" />
                    <view class="inviteRow inviteRow--upload">
                        <view class="inviteRow__label">图片识别</view>
                        <view class="inviteRow__field">
                            <view class="ocrUpload">
                                <wd-upload v-model:file-list="ocrFiles" action="" :limit="1" :auto-upload="false"
                                    accept="image" :size-type="['compressed']" :source-type="['album', 'camera']"
                                    custom-evoke-class="ocrUpload__trigger" custom-preview-class="ocrUpload__preview"
                                    @change="onOcrUploadChange">
                                    <view class="ocrUpload__empty">
                                        <view class="ocrUpload__camera">
                                            <FaIcon name="camera" :size="32" color="#fff" />
                                        </view>
                                        <view class="ocrUpload__text">上传面试通知截图</view>
                                    </view>
                                </wd-upload>
                                <view v-if="ocrFiles.length" class="ocrUpload__btn"
                                    :class="{ 'ocrUpload__btn--loading': ocrLoading }"
                                    @click="handleOcrRecognize">
                                    <FaIcon v-if="!ocrLoading" name="scan-line" :size="20" />
                                    <wd-loading v-else size="18px" />
                                    {{ ocrLoading ? '识别中' : '提取时间' }}
                                </view>
                            </view>
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

        <wd-datetime-picker type="datetime" v-model="timePickerValue" v-model:visible="showTimePicker"
            title="选择面试时间" custom-style="z-index: 2200 !important;" @confirm="handleTimeConfirm" />

        <wd-toast selector="resumeCenterToast" />

        <BottomNav :active-index="2" :theme-color="'#0f5bff'" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import BottomNav from '@/components/BottomNav.vue'
import { apiGetRecruiterDeliveries, apiUpdateDeliveryStatus, apiSendInvite, apiGetMyPostedJobs, apiOcrRecognize } from '@/api/index'
import { parseTimeText } from '@/utils/timeParser'

const toast = useToast('resumeCenterToast')
const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

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
    const userInfo = (() => { try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} } })()
    // 仅招聘官可访问此页面
    if (userInfo?.role !== 'RECRUITER') {
        uni.showToast({ title: '非招聘官不可访问', icon: 'none' })
        setTimeout(() => {
            const roleHome: Record<string, string> = {
                ADMIN: '/pages/admin/index',
                SUPER_ADMIN: '/pages/admin/index',
                SEEKER: '/pages/seeker/index',
            }
            uni.reLaunch({ url: (roleHome[userInfo?.role] || '/pages/seeker/index') as any })
        }, 1500)
        return
    }
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

// 时间选择器
const showTimePicker = ref(false)
const timePickerValue = ref<number>(0)

// OCR
type UploadFileItem = { uid: number; url: string; status?: string; [key: string]: any }
const ocrFiles = ref<UploadFileItem[]>([])
const ocrLoading = ref(false)

const openInviteModal = async (d: DeliveryCard) => {
    inviteTarget.value = d
    inviteForm.value = { position: d.jobTitle, time: '', location: '', note: '' }
    showInvite.value = true
    ocrFiles.value = []
    if (!myJobs.value.length) {
        try {
            const res: any = await apiGetMyPostedJobs({ page: 1, limit: 20 })
            myJobs.value = res?.items || []
        } catch { /* ignore */ }
    }
}

const handleTimeConfirm = ({ value }: { value: number }) => {
    timePickerValue.value = value
    const date = new Date(value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    inviteForm.value.time = `${year}-${month}-${day} ${hour}:${minute}`
}

const onOcrUploadChange = ({ fileList }: { fileList: UploadFileItem[] }) => {
    ocrFiles.value = fileList
}

const handleOcrRecognize = async () => {
    if (!ocrFiles.value.length || ocrLoading.value) return
    const file = ocrFiles.value[0]
    if (!file.url) {
        toast.info('图片上传未完成')
        return
    }

    ocrLoading.value = true
    try {
        const res: any = await apiOcrRecognize(file.url)
        if (res.text) {
            const parseResult = parseTimeText(res.text)
            if (parseResult.success) {
                inviteForm.value.time = parseResult.formatted
                toast.success('时间识别成功')
            } else {
                toast.info('未能识别到时间，请手动输入')
            }
        } else {
            toast.info('图片识别失败，请手动输入')
        }
    } catch {
        toast.info('图片识别失败，请检查网络或手动输入')
    } finally {
        ocrLoading.value = false
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

.inviteRow--upload {
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
        text-align: right;
    }

    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 26rpx;
        text-align: right;
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

:deep(.datePickerCell) {
    height: 88rpx;
    background: transparent !important;
    border: none !important;

    .wd-cell__body {
        flex: 1;
    }

    .wd-cell__right-icon {
        margin-left: 8rpx;
    }
}

.datePickerCell__value {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.72);
    text-align: right;
}

.ocrUpload {
    width: 100%;
}

.ocrUpload__trigger {
    width: 100%;
    height: 160rpx;
    border-radius: var(--app-radius-md);
    background: rgba(248, 250, 255, 0.9);
    border: 2rpx dashed rgba(30, 91, 255, 0.25);
}

.ocrUpload__preview {
    width: 100%;
    height: 160rpx;
    border-radius: var(--app-radius-md);
    overflow: hidden;
}

.ocrUpload__empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
}

.ocrUpload__camera {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.2), rgba(30, 91, 255, 0.4));
    display: flex;
    align-items: center;
    justify-content: center;
}

.ocrUpload__text {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.ocrUpload__btn {
    margin-top: 14rpx;
    height: 64rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(30, 91, 255, 0.06);
    border: 1px solid rgba(30, 91, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    font-size: 26rpx;
    font-weight: 800;
    color: rgba(30, 91, 255, 0.88);
}

.ocrUpload__btn--loading {
    opacity: 0.7;
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

// 分类横向滚动样式
:deep(.resumeTabs) {
    .wd-tabs__nav--wrap {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
    }

    .wd-tabs__nav-container {
        display: flex;
        flex-wrap: nowrap;
    }

    .wd-tabs__nav-item {
        flex: 0 0 auto;
    }

    .wd-tabs__nav-item-text {
        white-space: nowrap;
        overflow: visible;
        text-overflow: clip;
    }
}
</style>
