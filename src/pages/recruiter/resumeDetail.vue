<template>
    <view class="page">
        <HeaderNav title="简历详情" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 160}px` }">

                <view v-if="loading" class="loadingArea">
                    <wd-loading color="rgba(30, 91, 255, 0.8)" />
                </view>

                <template v-else-if="profile">
                    <!-- 基本信息 -->
                    <view class="hero">
                        <view class="hero__left">
                            <view class="hero__nameRow">
                                <view class="hero__name">{{ profile.realName || profile.nickname || '求职者' }}</view>
                            </view>
                            <view class="hero__role">{{ profile.roleTitle || '暂无职位意向' }}</view>
                            <view class="hero__cityRow" v-if="profile.city">
                                <wd-icon name="location" size="20rpx" color="rgba(0, 0, 0, 0.46)" />
                                <view class="hero__cityText">{{ profile.city }}</view>
                            </view>
                        </view>
                        <view class="hero__right">
                            <view class="hero__avatar">
                                <image v-if="profile.avatarUrl" class="hero__avatarImg" :src="profile.avatarUrl"
                                    mode="aspectFill" />
                                <view v-else class="hero__avatarPh" />
                            </view>
                        </view>
                    </view>

                    <!-- 自我描述 -->
                    <view v-if="profile.selfDesc" class="section">
                        <view class="section__title">自我描述</view>
                        <view class="section__text">{{ profile.selfDesc }}</view>
                    </view>

                    <!-- 教育经历 -->
                    <view v-if="profile.educations?.length" class="section">
                        <view class="section__title">教育经历</view>
                        <view v-for="edu in profile.educations" :key="edu.id" class="eduRow">
                            <view class="eduRow__left">
                                <view class="eduRow__school">{{ edu.school }}</view>
                                <view class="eduRow__major" v-if="edu.major || edu.degree">
                                    {{ [edu.major, degreeMap[edu.degree]].filter(Boolean).join(' · ') }}
                                </view>
                            </view>
                            <view class="eduRow__right">{{ formatDateRange(edu.startDate, edu.endDate) }}</view>
                        </view>
                    </view>

                    <!-- 工作经历 -->
                    <view v-if="profile.workExps?.length" class="section">
                        <view class="section__title">工作经历</view>
                        <wd-steps vertical :active="profile.workExps.length" custom-class="timelineSteps">
                            <wd-step v-for="w in profile.workExps" :key="w.id" status="finished">
                                <template #title>
                                    <view class="stepRow">
                                        <view class="stepRow__main">{{ w.company }}</view>
                                        <view class="stepRow__sub">{{ formatDateRange(w.startDate, w.endDate) }}</view>
                                    </view>
                                </template>
                                <template #description>
                                    <view class="stepDesc">{{ w.title }}</view>
                                    <view v-if="w.content" class="stepContent">{{ w.content }}</view>
                                </template>
                            </wd-step>
                        </wd-steps>
                    </view>

                    <!-- 项目经历 -->
                    <view v-if="profile.projectExps?.length" class="section">
                        <view class="section__title">项目经历</view>
                        <wd-steps vertical :active="profile.projectExps.length" custom-class="timelineSteps">
                            <wd-step v-for="p in profile.projectExps" :key="p.id" status="finished">
                                <template #title>
                                    <view class="stepRow">
                                        <view class="stepRow__main">{{ p.name }}</view>
                                        <view class="stepRow__sub">{{ formatDateRange(p.startDate, p.endDate) }}</view>
                                    </view>
                                </template>
                                <template #description>
                                    <view v-if="p.role" class="stepDesc">{{ p.role }}</view>
                                    <view v-if="p.content" class="stepContent">{{ p.content }}</view>
                                </template>
                            </wd-step>
                        </wd-steps>
                    </view>
                </template>

            </view>
        </scroll-view>

        <view v-show="!showInvite" class="bottomBar" :style="{ paddingBottom: `${safeBottom}px` }">
            <view class="bottomBar__left">
                <view class="miniBtn" hover-class="miniBtn--pressed" @click="handleReject">
                    <wd-icon name="close" size="28rpx" color="rgba(0, 0, 0, 0.46)" />
                    <view class="miniBtn__text">不合适</view>
                </view>
            </view>
            <view class="bottomBar__right">
                <wd-button type="primary" custom-class="actionBtn actionBtn--primary"
                    @click="showInvite = true">通知面试</wd-button>
            </view>
        </view>

        <!-- 面试邀请 Modal -->
        <wd-popup v-model="showInvite" position="bottom" :safe-area-inset-bottom="true"
            custom-class="invitePopup" custom-style="z-index: 2100 !important;">
            <view class="invitePanel">
                <view class="invitePanel__hd">
                    <view class="invitePanel__title">发送面试邀请</view>
                    <view class="invitePanel__close" hover-class="invitePanel__close--pressed"
                        @click="showInvite = false">
                        <wd-icon name="close" size="26rpx" color="rgba(0,0,0,0.34)" />
                    </view>
                </view>

                <view class="inviteForm">
                    <view class="inviteRow">
                        <view class="inviteRow__label">应聘职位</view>
                        <view class="inviteRow__field">
                            <wd-input v-model="inviteForm.position" compact custom-class="inviteInput"
                                placeholder="请输入职位名称" />
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

                <!-- 职位选择 -->
                <view v-if="myJobs.length" class="jobPicker">
                    <view class="jobPicker__label">选择职位（可选）</view>
                    <scroll-view scroll-x class="jobPicker__scroll">
                        <view class="jobPicker__row">
                            <view v-for="j in myJobs" :key="j.id" class="jobChip"
                                :class="{ 'jobChip--on': selectedJobId === j.id }"
                                hover-class="jobChip--pressed" @click="selectJob(j)">
                                {{ j.title }}
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <view class="invitePanel__ft">
                    <wd-button type="primary" block :loading="inviting" custom-class="sendBtn"
                        @click="sendInvite">发送邀请</wd-button>
                </view>
            </view>
        </wd-popup>

        <wd-toast selector="resumeDetailToast" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetSeekerResume, apiSendInvite, apiGetMyPostedJobs } from '@/api/index'

const toast = useToast('resumeDetailToast')
const safeBottom = ref(uni.getSystemInfoSync().safeAreaInsets?.bottom || 0)

const loading = ref(false)
const profile = ref<any>(null)
const userId = ref('')

const degreeMap: Record<string, string> = {
    ANY: '学历不限', ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}

const formatDateRange = (start?: string, end?: string) => {
    const fmt = (d?: string) => {
        if (!d) return ''
        const dt = new Date(d)
        return `${dt.getFullYear()}年${dt.getMonth() + 1}月`
    }
    return [fmt(start), end ? fmt(end) : '至今'].filter(Boolean).join(' ~ ')
}

onMounted(async () => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    userId.value = currentPage?.options?.userId || ''
    if (!userId.value) return

    loading.value = true
    try {
        const res: any = await apiGetSeekerResume(userId.value)
        profile.value = {
            ...res,
            realName: res.realName,
            nickname: res.user?.nickname,
            avatarUrl: res.user?.avatarUrl,
            selfDesc: res.selfDesc,
        }
    } catch { /* ignore */ } finally {
        loading.value = false
    }

    // 预加载我的职位列表
    try {
        const res: any = await apiGetMyPostedJobs({ page: 1, limit: 20 })
        myJobs.value = res?.items || []
        if (myJobs.value.length) {
            selectedJobId.value = myJobs.value[0].id
            inviteForm.value.position = myJobs.value[0].title
        }
    } catch { /* ignore */ }
})

const handleReject = () => {
    uni.showModal({
        title: '确认',
        content: '将该候选人标记为不合适？',
        success: (res) => {
            if (res.confirm) {
                toast.info('已标记（请在简历中心更新状态）')
            }
        },
    })
}

// 面试邀请
const showInvite = ref(false)
const inviting = ref(false)
const myJobs = ref<any[]>([])
const selectedJobId = ref('')
const inviteForm = ref({ position: '', time: '', location: '', note: '' })

const selectJob = (j: any) => {
    selectedJobId.value = j.id
    inviteForm.value.position = j.title
}

const sendInvite = async () => {
    if (!inviteForm.value.time.trim()) { toast.info('请填写面试时间'); return }
    const jobId = selectedJobId.value || myJobs.value[0]?.id || ''
    if (!jobId) { toast.info('请先在「我的职位」发布职位'); return }

    inviting.value = true
    try {
        const positionLabel = inviteForm.value.position.trim() || myJobs.value.find(j => j.id === jobId)?.title || ''
        const content = [
            positionLabel ? `应聘职位：${positionLabel}` : '',
            `面试时间：${inviteForm.value.time}`,
            inviteForm.value.location ? `地点/方式：${inviteForm.value.location}` : '',
            inviteForm.value.note ? `备注：${inviteForm.value.note}` : '',
        ].filter(Boolean).join('\n')

        await apiSendInvite({
            seekerUserId: userId.value,
            jobId,
            content,
        })
        showInvite.value = false
        toast.success('面试邀请已发送')
    } catch (e: any) {
        toast.info(e?.message || '发送失败，请重试')
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
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 0;
    box-sizing: border-box;
}

.loadingArea {
    display: flex;
    justify-content: center;
    padding: 80rpx 0;
}

.hero {
    display: flex;
    justify-content: space-between;
    gap: 16rpx;
    padding: 22rpx 22rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.92);
    box-shadow: var(--app-shadow-card);
}

.hero__left {
    flex: 1 1 auto;
    min-width: 0;
}

.hero__nameRow {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.hero__name {
    font-size: 40rpx;
    font-weight: 950;
    color: var(--app-text-primary);
    line-height: 1.1;
}

.hero__role {
    margin-top: 10rpx;
    font-size: 26rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.48);
}

.hero__cityRow {
    margin-top: 14rpx;
    display: inline-flex;
    align-items: center;
    gap: 10rpx;
    padding: 10rpx 14rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.035);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.hero__cityText {
    font-size: 26rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.66);
}

.hero__right {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
}

.hero__avatar {
    width: 104rpx;
    height: 104rpx;
    border-radius: var(--app-radius-pill);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
    border: 2rpx solid rgba(255, 255, 255, 0.88);
    box-shadow: 0 10rpx 26rpx rgba(30, 60, 140, 0.10);
}

.hero__avatarImg {
    width: 100%;
    height: 100%;
}

.hero__avatarPh {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 46%),
        linear-gradient(180deg, rgba(30, 91, 255, 0.20), rgba(0, 0, 0, 0.06));
}

.section {
    margin-top: 18rpx;
    padding: 22rpx 22rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.92);
    box-shadow: 0 14rpx 38rpx rgba(30, 60, 140, 0.10);
}

.section__title {
    font-size: 30rpx;
    font-weight: 950;
    color: var(--app-text-primary);
    letter-spacing: 1rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.section__title::before {
    content: '';
    width: 8rpx;
    height: 26rpx;
    border-radius: var(--app-radius-pill);
    background: linear-gradient(180deg, rgba(30, 91, 255, 1), rgba(30, 91, 255, 0.55));
}

.section__text {
    margin-top: 16rpx;
    font-size: 26rpx;
    line-height: 1.7;
    color: rgba(0, 0, 0, 0.62);
    font-weight: 700;
}

.eduRow {
    margin-top: 16rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14rpx;
}

.eduRow+.eduRow {
    margin-top: 14rpx;
    padding-top: 14rpx;
    border-top: 1px solid var(--app-line);
}

.eduRow__left {
    flex: 1 1 auto;
    min-width: 0;
}

.eduRow__school {
    font-size: 28rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.72);
}

.eduRow__major {
    margin-top: 6rpx;
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.46);
}

.eduRow__right {
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.42);
    flex: 0 0 auto;
}

:deep(.timelineSteps) {
    margin-top: 16rpx;
}

:deep(.timelineSteps .wd-step) {
    display: block;
}

:deep(.timelineSteps .wd-step__header) {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
}

:deep(.timelineSteps .wd-step__content) {
    margin-left: 32rpx;
    margin-top: 0;
    padding-bottom: 20rpx;
}

:deep(.timelineSteps .wd-step__circle) {
    width: 26rpx;
    height: 26rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.10);
    border: 2rpx solid rgba(30, 91, 255, 0.22);
}

:deep(.timelineSteps .wd-step--finished .wd-step__circle) {
    background: rgba(30, 91, 255, 0.10);
    border-color: rgba(30, 91, 255, 0.22);
}

:deep(.timelineSteps .wd-step__finished-icon) {
    display: none;
}

:deep(.timelineSteps .wd-step__line) {
    top: 34rpx;
    bottom: 0;
    left: 50%;
    width: 2rpx;
    height: auto;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.25), rgba(0, 0, 0, 0.08));
    transform: none;
}

:deep(.timelineSteps .wd-step:last-child .wd-step__line) {
    display: none;
}

:deep(.timelineSteps .wd-step__title) {
    font-size: 28rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.74);
    line-height: normal;
}

:deep(.timelineSteps .wd-step__description) {
    margin-top: 10rpx;
    font-size: 26rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
    line-height: 1.45;
    padding: 0;
}

.stepRow {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12rpx;
}

.stepRow__main {
    font-size: 28rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.74);
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.stepRow__sub {
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.40);
    flex: 0 0 auto;
}

.stepDesc {
    font-size: 26rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
    line-height: 1.45;
}

.stepContent {
    margin-top: 8rpx;
    font-size: 24rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.54);
    line-height: 1.6;
}

// 底部操作栏
.bottomBar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--app-surface-strong);
    border-top: 1px solid var(--app-line);
    padding: 14rpx 22rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    z-index: 2000;
}

.bottomBar__left {
    display: flex;
    align-items: center;
    gap: 18rpx;
    flex: 0 0 auto;
}

.miniBtn {
    width: 92rpx;
    height: 92rpx;
    border-radius: var(--app-radius-lg);
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
}

.miniBtn--pressed {
    opacity: 0.86;
}

.miniBtn__text {
    font-size: 22rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.58);
}

.bottomBar__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14rpx;
    flex: 1 1 auto;
    min-width: 0;
}

:deep(.actionBtn) {
    height: 76rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 28rpx !important;
    font-weight: 950 !important;
    letter-spacing: 1rpx !important;
    padding: 0 26rpx !important;
}

:deep(.actionBtn--primary) {
    background: linear-gradient(135deg, rgba(30, 91, 255, 1), rgba(78, 133, 255, 1)) !important;
    box-shadow: 0 18rpx 44rpx rgba(30, 91, 255, 0.26) !important;
}

// 面试邀请面板
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

.inviteForm {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
    margin-bottom: 16rpx;
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

.jobPicker {
    margin-bottom: 16rpx;
}

.jobPicker__label {
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.46);
    margin-bottom: 10rpx;
}

.jobPicker__scroll {
    width: 100%;
}

.jobPicker__row {
    display: flex;
    gap: 12rpx;
    padding-bottom: 4rpx;
}

.jobChip {
    flex-shrink: 0;
    height: 56rpx;
    padding: 0 22rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.07);
    display: flex;
    align-items: center;
    font-size: 24rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.62);
}

.jobChip--on {
    background: rgba(30, 91, 255, 0.08);
    border-color: rgba(30, 91, 255, 0.20);
    color: rgba(30, 91, 255, 0.98);
}

.jobChip--pressed {
    opacity: 0.88;
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
