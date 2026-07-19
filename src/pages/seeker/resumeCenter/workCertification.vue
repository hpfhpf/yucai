<template>
    <view class="page" :style="navCssVars">
        <view class="nav" :style="{ paddingTop: `${statusBarHeight}px` }">
            <view class="nav__bar">
                <view class="nav__back" hover-class="nav__back--pressed" @click="handleBack">
                    <view class="nav__backIcon" />
                </view>
                <view class="nav__title">工作经历认证</view>
                <view class="nav__capsule" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 44}px` }">

                <!-- 确认模式：他人分享认证链接时 -->
                <template v-if="confirmToken">
                    <!-- 认证成功 -->
                    <view v-if="confirmed" class="confirmBox confirmBox--done">
                        <view class="confirmBox__icon confirmBox__icon--ok" />
                        <view class="confirmBox__title">认证成功</view>
                        <view class="confirmBox__sub">已为对方完成工作经历认证</view>
                    </view>

                    <!-- 认证表单 -->
                    <view v-else-if="certInfoLoaded" class="certForm">

                        <!-- ① 认证人视角：顶部欢迎语（认证人打开链接时看到） -->
                        <view class="certForm__welcome">
                            <view class="certForm__welcomeTitle">您的前同事邀请您见证</view>
                            <view class="certForm__welcomeSub">请核实以下工作经历信息，如实完成职业经历联合认证</view>
                        </view>

                        <!-- 认证对象信息 -->
                        <view class="certForm__card">
                            <view class="certForm__row">
                                <view class="certForm__label">姓名</view>
                                <view class="certForm__value">{{ certInfo.certifieeRealName || '未填写' }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">公司</view>
                                <view class="certForm__value certForm__value--grow">{{ certInfo.company }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">职位</view>
                                <view class="certForm__value">{{ certInfo.jobTitle }}</view>
                            </view>
                        </view>

                        <!-- 在职期间：直接取求职者在该公司的在职时间，不让认证人手动选 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionTitle">在职期间</view>
                            <view class="certForm__periodDisplay">
                                {{ formatDateRange(certInfo.startDate, certInfo.endDate) }}
                            </view>
                        </view>

                        <!-- 工作评价 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionTitle">工作评价（选填）</view>
                            <textarea class="certForm__textarea" v-model="recommendation"
                                placeholder="请简要描述对方的工作能力和职业经历，例如：我与 XX 在该公司共事期间，他主要负责……工作认真负责，所陈述工作经历属实。"
                                maxlength="500" />
                        </view>

                        <!-- 您与对方的关系 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionTitle">您与对方的工作关系</view>
                            <view class="certForm__radioRow">
                                <view v-for="r in relationships" :key="r.value"
                                    :class="['certForm__radio', relationship === r.value && 'certForm__radio--on']"
                                    @click="relationship = r.value">
                                    <view class="certForm__radioCircle" />
                                    <view class="certForm__radioLabel">{{ r.label }}</view>
                                </view>
                            </view>
                        </view>

                        <wd-button type="primary" block :loading="confirming" @click="handleConfirmCert">确认认证</wd-button>
                    </view>

                    <!-- 加载中 -->
                    <view v-else class="emptyTip">加载中…</view>
                </template>

                <!-- 列表模式：查看自己的认证状态 -->
                <template v-else>
                    <view v-if="loading" class="emptyTip">加载中…</view>
                    <view v-else-if="!items.length" class="emptyTip">暂无认证记录</view>
                    <view v-for="item in items" :key="item.id" class="certList__item">
                        <!-- PENDING：右侧附带分享按钮，点击卡片或按钮均触发邀请流程 -->
                        <view v-if="item.status === 'PENDING'" class="certRow__wrap">
                            <view class="certCard certCard--pending" hover-class="certCard--pressed" @click="handleShare(item)">
                                <view class="certCard__head">
                                    <view class="certCard__bar certCard__bar--pending" />
                                    <view class="certCard__title">{{ item.companyName }}</view>
                                    <view class="certBadge badge--pending">认证中</view>
                                </view>
                                <view class="certCard__body">
                                    <view class="certRow">
                                        <view class="certRow__icon certRow__icon--clock" />
                                        <view class="certRow__text">{{ item.jobTitle }}</view>
                                    </view>
                                </view>
                                <view class="certCard__action">点击发送认证邀请</view>
                            </view>
                            <view class="shareBtn" hover-class="shareBtn--pressed" @click="handleShare(item)">
                                <view class="shareBtn__icon" />
                            </view>
                        </view>
                        <!-- APPROVED：全宽卡片，点击查看认证详情 -->
                        <view v-else class="certCard certCard--approved" hover-class="certCard--pressed"
                            @click="showDetail(item)">
                            <view class="certCard__head">
                                <view class="certCard__bar certCard__bar--approved" />
                                <view class="certCard__title">{{ item.companyName }}</view>
                                <view class="certBadge badge--approved">已认证</view>
                            </view>
                            <view class="certCard__body">
                                <view class="certRow">
                                    <view class="certRow__icon certRow__icon--clock" />
                                    <view class="certRow__text">{{ item.jobTitle }}</view>
                                </view>
                                <view v-if="item.certifierName" class="certRow">
                                    <view class="certRow__icon certRow__icon--building" />
                                    <view class="certRow__text">{{ item.certifierName }}{{ item.certifierRole ? ` · ${item.certifierRole}` : '' }} 认证</view>
                                </view>
                            </view>
                            <view class="certCard__footer">
                                <view class="certCard__certAt">认证于 {{ formatDate(item.certifiedAt) }}</view>
                                <view class="certCard__viewBtn">查看详情 ›</view>
                            </view>
                        </view>
                    </view>
                </template>

            </view>
        </scroll-view>

        <!-- 推荐认证人选择弹窗 -->
        <wd-popup v-model="recommenderShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: #fff; max-height: 70vh;">
            <view class="recommenderSheet">
                <view class="recommenderSheet__hd">
                    <view class="recommenderSheet__title">选择认证人</view>
                    <view class="recommenderSheet__sub">以下是在该公司有重叠经历的已认证同事</view>
                </view>

                <scroll-view scroll-y class="recommenderSheet__list">
                    <view v-if="loadingRecommenders" class="emptyTip">加载中…</view>
                    <view v-else-if="!recommenders.length" class="emptyTip">暂未找到推荐认证人</view>
                    <view v-else v-for="r in recommenders" :key="r.userId"
                        :class="['recommenderItem', selectedRecommender?.userId === r.userId && 'recommenderItem--on']"
                        @click="selectedRecommender = r">
                        <view class="recommenderItem__avatar">
                            <image v-if="r.avatarUrl" :src="r.avatarUrl" class="recommenderItem__img" mode="aspectFill" />
                            <view v-else class="recommenderItem__avatarFallback">{{ (r.realName || r.nickname || '?')[0] }}</view>
                        </view>
                        <view class="recommenderItem__info">
                            <view class="recommenderItem__name">{{ r.realName || r.nickname || '未知用户' }}</view>
                            <view class="recommenderItem__role">{{ r.roleTitle || levelLabel(r.currentLevel) || '前同事' }}</view>
                        </view>
                        <view v-if="selectedRecommender?.userId === r.userId" class="recommenderItem__check">✓</view>
                    </view>
                </scroll-view>

                <view class="recommenderSheet__footer">
                    <wd-button plain block custom-class="recommenderBtn recommenderBtn--ghost"
                        @click="doShare(pendingShareItem, null)">直接发给微信好友</wd-button>
                    <wd-button type="primary" block custom-class="recommenderBtn"
                        :disabled="!selectedRecommender" @click="doShare(pendingShareItem, selectedRecommender?.userId)">
                        发给选定认证人
                    </wd-button>
                </view>
            </view>
        </wd-popup>

        <!-- 已认证详情弹窗 -->
        <wd-popup v-model="detailShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: #fff;">
            <view v-if="detailItem" class="detailSheet">
                <view class="detailSheet__hd">
                    <view class="detailSheet__title">认证详情</view>
                    <view class="detailSheet__company">{{ detailItem.companyName }} · {{ detailItem.jobTitle }}</view>
                </view>
                <view class="detailSheet__body">
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">认证人</view>
                        <view class="detailSheet__value">{{ detailItem.certifierName || '匿名' }}{{ detailItem.certifierRole ? ` · ${detailItem.certifierRole}` : '' }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">工作关系</view>
                        <view class="detailSheet__value">{{ relationLabel(detailItem.relationship) }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">在职期间</view>
                        <view class="detailSheet__value">{{ formatDateRange(detailItem.knowFrom, detailItem.knowTo) }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">认证时间</view>
                        <view class="detailSheet__value">{{ formatDate(detailItem.certifiedAt) }}</view>
                    </view>
                    <view v-if="detailItem.recommendation" class="detailSheet__rec">
                        <view class="detailSheet__recLabel">工作评价</view>
                        <view class="detailSheet__recText">{{ detailItem.recommendation }}</view>
                    </view>
                </view>
            </view>
        </wd-popup>

        <!-- 分享触发浮层：shareToken 就绪后出现，引导用户点击发送微信小程序卡片 -->
        <!-- 此处是求职者（发起人）视角 -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="showShareTrigger" class="shareTrigger">
            <view class="shareTrigger__hint">向前同事发起【职业里程碑见证与经历联合认证】邀请</view>
            <view class="shareTrigger__sub">点击下方按钮，通过微信将认证邀请卡片发送给对方</view>
            <button open-type="share" class="shareTrigger__shareBtn">发送认证邀请</button>
            <view class="shareTrigger__skip" @click="showShareTrigger = false">暂不发送</view>
        </view>
        <!-- #endif -->
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { apiGetCertifications, apiConfirmWorkCert, apiGetCertInfo, apiGetRecommendedCertifiers, apiRequestWorkCertWithCertifier } from '@/api/index'

// 顶部导航栏适配：状态栏高度、胶囊按钮尺寸（仅 mp-weixin 可读到真实 rect）
const systemInfo = uni.getWindowInfo()
const statusBarHeight = ref(systemInfo.statusBarHeight || 0)
const navBarHeight = ref(44)
const capsuleWidth = ref(88)
const capsuleHeight = ref(32)
const capsuleRight = ref(12)
const safeBottom = ref(systemInfo.safeAreaInsets?.bottom || 0)

if (typeof __UNI_PLATFORM__ !== 'undefined' && __UNI_PLATFORM__ === 'mp-weixin') {
    if (typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function') {
        const rect = wx.getMenuButtonBoundingClientRect()
        if (rect) {
            capsuleWidth.value = rect.width
            capsuleHeight.value = rect.height
            capsuleRight.value = systemInfo.windowWidth - rect.right
            const gap = rect.top - statusBarHeight.value
            navBarHeight.value = rect.height + gap * 2
        }
    }
}

const navCssVars = computed<Record<string, string>>(() => {
    const total = statusBarHeight.value + navBarHeight.value
    return {
        '--status-bar': `${statusBarHeight.value}px`,
        '--nav-bar': `${navBarHeight.value}px`,
        '--nav-total': `${total}px`,
        '--capsule-width': `${capsuleWidth.value}px`,
        '--capsule-height': `${capsuleHeight.value}px`,
        '--capsule-right': `${capsuleRight.value}px`,
    }
})

type CertItem = {
    id: string; workExpId: string; companyName: string; jobTitle: string
    status: 'PENDING' | 'APPROVED'; shareToken: string | null; shareExpireAt: string | null; createdAt: string
    certifierName: string | null; certifierRole: string | null
    relationship: string | null; recommendation: string | null
    certifiedAt: string | null; knowFrom: string | null; knowTo: string | null
}

const items = ref<CertItem[]>([])
const loading = ref(false)

// 确认模式：URL 带 shareToken 时进入
const confirmToken = ref('')
const confirming = ref(false)
const confirmed = ref(false)

type CertInfo = { company: string; jobTitle: string; startDate: string | null; endDate: string | null; certifieeRealName: string | null }
const certInfo = ref<CertInfo>({ company: '', jobTitle: '', startDate: null, endDate: null, certifieeRealName: null })
const certInfoLoaded = ref(false)

// 认证表单字段
const recommendation = ref('')
const relationship = ref('COLLEAGUE')
const anonymous = ref(false)

const relationships = [
    { value: 'SUPERVISOR', label: '我是上级' },
    { value: 'COLLEAGUE', label: '我是同事' },
    { value: 'HR', label: '我是HR' },
]

const formatDateRange = (start: string | null, end: string | null) => {
    const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }) : '至今'
    if (!start && !end) return '未填写'
    return `${fmt(start)} - ${fmt(end)}`
}

// 推荐认证人弹窗
type Recommender = { userId: string; nickname: string | null; realName: string | null; avatarUrl: string | null; roleTitle: string | null; currentLevel: string | null; company: string; workTitle: string }
const recommenderShown = ref(false)
const loadingRecommenders = ref(false)
const recommenders = ref<Recommender[]>([])
const selectedRecommender = ref<Recommender | null>(null)
const pendingShareItem = ref<CertItem | null>(null)
const detailShown = ref(false)
const detailItem = ref<CertItem | null>(null)
const showDetail = (item: CertItem) => { detailItem.value = item; detailShown.value = true }
const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
const relationLabel = (r: string | null) => {
    if (r === 'SUPERVISOR') return '上级/直属领导'
    if (r === 'HR') return 'HR'
    return '同事'
}
// 分享触发状态（微信卡片分享需要 onShareAppMessage + <button open-type="share">，不能用 wx.shareAppMessage 直调）
const shareData = ref<{ title: string; path: string } | null>(null)
const showShareTrigger = ref(false)

const LEVEL_LABELS: Record<string, string> = {
    IC: '骨干员工',
    LEAD: '团队主管',
    MGR_DIR: '中高层管理',
    VP_C: '决策层',
}
const levelLabel = (level: string | null) => level ? LEVEL_LABELS[level] || '' : ''


onMounted(async () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    const page = pages[pages.length - 1] as any
    const token = page?.options?.shareToken || ''
    const workExpId = page?.options?.workExpId || ''
    const resend = page?.options?.resend || ''

    if (token) {
        // 确认模式：他人通过微信卡片进入
        confirmToken.value = token
        try {
            const info: any = await apiGetCertInfo(token)
            certInfo.value = info
            certInfoLoaded.value = true
        } catch { }
        return
    }

    // 列表模式
    loading.value = true
    try {
        const res: any = await apiGetCertifications()
        items.value = (res as any[]).map((c: any) => ({
            id: c.id,
            workExpId: c.workExpId,
            companyName: c.company,
            jobTitle: c.jobTitle || '',
            status: c.status,
            shareToken: c.shareToken,
            shareExpireAt: c.shareExpireAt,
            createdAt: c.createdAt,
            certifierName: c.certifierName ?? null,
            certifierRole: c.certifierRole ?? null,
            relationship: c.relationship ?? null,
            recommendation: c.recommendation ?? null,
            certifiedAt: c.certifiedAt ?? null,
            knowFrom: c.knowFrom ?? null,
            knowTo: c.knowTo ?? null,
        }))
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }

    // 若从简历中心跳转过来（申请认证 / 重新发送），自动触发对应卡片的分享弹窗
    if (workExpId) {
        // 等列表数据加载完毕后找到对应卡片并触发
        const target = items.value.find(i => i.workExpId === workExpId)
        if (target) {
            handleShare(target)
        } else if (resend !== '1') {
            // 还没有认证记录（首次申请）：构造一个虚拟 item 触发推荐人弹窗
            const fakeItem: CertItem = {
                id: '', workExpId,
                companyName: '', jobTitle: '',
                status: 'PENDING', shareToken: null, shareExpireAt: null, createdAt: '',
                certifierName: null, certifierRole: null,
                relationship: null, recommendation: null,
                certifiedAt: null, knowFrom: null, knowTo: null,
            }
            handleShare(fakeItem)
        }
    }
})

const handleConfirmCert = async () => {
    confirming.value = true
    try {
        await apiConfirmWorkCert(confirmToken.value, {
            relationship: relationship.value,
            recommendation: recommendation.value || undefined,
            knowFrom: certInfo.value.startDate || undefined,
            knowTo: certInfo.value.endDate || undefined,
            anonymous: anonymous.value,
        })
        confirmed.value = true
        uni.showToast({ title: '认证成功', icon: 'success' })
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        confirming.value = false
    }
}

const handleShare = async (item: CertItem) => {
    pendingShareItem.value = item
    selectedRecommender.value = null
    recommenderShown.value = true
    loadingRecommenders.value = true
    try {
        const res: any = await apiGetRecommendedCertifiers(item.workExpId)
        recommenders.value = res as Recommender[]
    } catch {
        recommenders.value = []
    } finally {
        loadingRecommenders.value = false
    }
}

// 实际执行微信分享（certifierId 为 null 表示不绑定指定认证人）
const doShare = async (item: CertItem | null, certifierId: string | null | undefined) => {
    if (!item) return
    recommenderShown.value = false

    try {
        const res: any = await apiRequestWorkCertWithCertifier(item.workExpId, certifierId ?? undefined)
        const token = res.shareToken
        if (!token) return

        // 更新列表里的 shareToken
        const idx = items.value.findIndex(i => i.id === item.id)
        if (idx !== -1) items.value[idx].shareToken = token

        const certPath = `/pages/seeker/resumeCenter/workCertification?shareToken=${token}`
        // #ifdef MP-WEIXIN
        // 微信小程序：必须通过 onShareAppMessage + <button open-type="share"> 触发分享卡片，
        // 直接调 wx.shareAppMessage() 无效（用户侧只看到认证码而非小程序卡片）
        shareData.value = {
            title: `邀您见证【职业里程碑与经历联合认证】`,
            path: certPath,
        }
        showShareTrigger.value = true
        uni.showToast({ title: '请点击下方按钮，发送认证卡片', icon: 'none', duration: 2500 })
        // #endif
        // #ifndef MP-WEIXIN
        // H5/其他环境：复制认证码到剪贴板
        uni.setClipboardData({
            data: token,
            success: () => uni.showToast({ title: '认证码已复制，发给对方', icon: 'success', duration: 2000 }),
        })
        // #endif
    } catch {
        // 错误由 request.ts 统一处理
    }
}

// 注册页面分享内容，配合 <button open-type="share"> 触发（小程序专属）
onShareAppMessage(() => ({
    title: shareData.value?.title || '工作经历认证',
    path: shareData.value?.path || '/pages/seeker/resumeCenter/workCertification',
}))

const handleBack = () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    if (pages.length > 1) {
        uni.navigateBack()
        return
    }
    uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
}
</script>

<style scoped lang="scss">
:root {
    --bg: #eef3ff;
    --card: rgba(255, 255, 255, 0.96);
    --text: rgba(0, 0, 0, 0.86);
    --sub: rgba(0, 0, 0, 0.56);
    --muted: rgba(0, 0, 0, 0.38);
    --line: rgba(0, 0, 0, 0.06);
    --blue: #1e5bff;
}

.page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
}

.nav {
    height: var(--nav-total);
    background: rgba(255, 255, 255, 0.98);
    padding: 0 18rpx;
    box-sizing: border-box;
    flex: 0 0 auto;
}

.nav__bar {
    position: relative;
    height: var(--nav-bar);
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav__title {
    color: rgba(0, 0, 0, 0.86);
    font-size: 34rpx;
    font-weight: 900;
    letter-spacing: 2rpx;
}

.nav__back {
    position: absolute;
    left: 10rpx;
    width: 76rpx;
    height: 76rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav__back--pressed {
    background: rgba(0, 0, 0, 0.05);
}

.nav__backIcon {
    width: 18rpx;
    height: 18rpx;
    border-left: 4rpx solid rgba(0, 0, 0, 0.72);
    border-bottom: 4rpx solid rgba(0, 0, 0, 0.72);
    transform: rotate(45deg);
    margin-left: 6rpx;
}

.nav__capsule {
    position: absolute;
    right: var(--capsule-right);
    width: var(--capsule-width);
    height: var(--capsule-height);
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12rpx);
}

.nav__capsule::before {
    content: '';
    position: absolute;
    left: 18rpx;
    top: 50%;
    width: 28rpx;
    height: 8rpx;
    border-radius: 999rpx;
    transform: translateY(-50%);
    background:
        radial-gradient(circle, rgba(0, 0, 0, 0.48) 3rpx, transparent 4rpx) 0 50% / 10rpx 10rpx no-repeat,
        radial-gradient(circle, rgba(0, 0, 0, 0.48) 3rpx, transparent 4rpx) 50% 50% / 10rpx 10rpx no-repeat,
        radial-gradient(circle, rgba(0, 0, 0, 0.48) 3rpx, transparent 4rpx) 100% 50% / 10rpx 10rpx no-repeat;
}

.nav__capsule::after {
    content: '';
    position: absolute;
    right: 18rpx;
    top: 50%;
    width: 16rpx;
    height: 16rpx;
    border-radius: 999rpx;
    border: 2rpx solid rgba(0, 0, 0, 0.38);
    transform: translateY(-50%);
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 22rpx;
    box-sizing: border-box;
}

.certCard {
    border-radius: 22rpx;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.78);
    box-shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.10);
    overflow: hidden;
    padding: 22rpx 22rpx 20rpx;
}

.certCard+.certCard {
    margin-top: 18rpx;
}

.certCard--pressed {
    transform: scale(0.99);
    opacity: 0.94;
}

.certCard__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.certCard__bar {
    width: 8rpx;
    height: 30rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.92);
    box-shadow: 0 10rpx 18rpx rgba(30, 91, 255, 0.22);
}

.certCard__title {
    flex: 1;
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
}

.certCard__edit {
    width: 56rpx;
    height: 56rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.certCard__edit--pressed {
    background: rgba(0, 0, 0, 0.05);
}

.certCard__editIcon {
    width: 22rpx;
    height: 22rpx;
    border-radius: 6rpx;
    border: 3rpx solid rgba(0, 0, 0, 0.28);
    transform: rotate(-10deg);
    position: relative;
}

.certCard__editIcon::after {
    content: '';
    position: absolute;
    right: -6rpx;
    bottom: -6rpx;
    width: 10rpx;
    height: 3rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.28);
    transform: rotate(45deg);
}

.certCard__body {
    margin-top: 18rpx;
    display: flex;
    flex-direction: column;
    gap: 14rpx;
}

.certRow {
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.certRow__icon {
    width: 36rpx;
    height: 36rpx;
    border-radius: 12rpx;
    background: rgba(0, 0, 0, 0.10);
    position: relative;
    flex: 0 0 auto;
}

.certRow__icon--building::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18rpx;
    height: 20rpx;
    border-radius: 4rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -58%);
    background:
        linear-gradient(rgba(255, 255, 255, 0.62) 0 0) 50% 40% / 10rpx 3rpx no-repeat,
        linear-gradient(rgba(255, 255, 255, 0.62) 0 0) 50% 62% / 10rpx 3rpx no-repeat;
}

.certRow__icon--clock::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18rpx;
    height: 18rpx;
    border-radius: 999rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -50%);
}

.certRow__icon--clock::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10rpx;
    height: 3rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.92);
    transform: translate(-10%, -50%) rotate(10deg);
}

.certRow__text {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.62);
    font-weight: 700;
}

.certCard--letter .certCard__title {
    font-size: 32rpx;
}

.certCard__letter {
    margin-top: 14rpx;
    font-size: 26rpx;
    line-height: 40rpx;
    color: rgba(0, 0, 0, 0.56);
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
}

.certBadge {
    padding: 4rpx 18rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.badge--approved {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.10);
}

.badge--pending {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.10);
}

.emptyTip {
    text-align: center;
    padding: 60rpx 0;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.38);
}

.confirmBox {
    margin: 40rpx 0;
    padding: 40rpx 30rpx;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
    box-shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.10);
}

.confirmBox--done {
    background: rgba(34, 197, 94, 0.06);
}

.confirmBox__icon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background: rgba(30, 91, 255, 0.12);
}

.confirmBox__icon--ok {
    background: rgba(34, 197, 94, 0.16);
}

.confirmBox__title {
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
}

.confirmBox__sub {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.56);
    text-align: center;
    line-height: 1.6;
    margin-bottom: 8rpx;
}

/* 认证人视角：顶部欢迎语 */
.certForm__welcome {
    background: rgba(30, 91, 255, 0.05);
    border: 1px solid rgba(30, 91, 255, 0.12);
    border-radius: 18rpx;
    padding: 24rpx 26rpx;
}

.certForm__welcomeTitle {
    font-size: 30rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.9);
}

.certForm__welcomeSub {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.46);
    line-height: 1.6;
}

/* 认证表单（Image #5 样式） */
.certForm {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.certForm__card {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22rpx;
    padding: 28rpx 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(30, 60, 140, 0.07);
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.certForm__row {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
}

.certForm__label {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    white-space: nowrap;
}

.certForm__label::after {
    content: '：';
}

.certForm__value {
    font-size: 26rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.84);
}

.certForm__value--grow {
    flex: 1;
}

.certForm__section {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22rpx;
    padding: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(30, 60, 140, 0.07);
}

.certForm__periodDisplay {
    font-size: 28rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.84);
    padding: 8rpx 0 2rpx;
}

.certForm__sectionTitle {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    margin-bottom: 16rpx;
}

.certForm__textarea {
    width: 100%;
    min-height: 160rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.84);
    box-sizing: border-box;
    line-height: 1.6;
}

.certForm__radioRow {
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
}

.certForm__radio {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 14rpx 24rpx;
    border-radius: 999rpx;
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: rgba(255, 255, 255, 0.5);
}

.certForm__radio--on {
    border-color: rgba(30, 91, 255, 0.6);
    background: rgba(30, 91, 255, 0.06);
}

.certForm__radioCircle {
    width: 28rpx;
    height: 28rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(0, 0, 0, 0.26);
}

.certForm__radio--on .certForm__radioCircle {
    border-color: rgba(30, 91, 255, 0.8);
    background: rgba(30, 91, 255, 0.8);
    box-shadow: inset 0 0 0 5rpx white;
}

.certForm__radioLabel {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.72);
}

.certForm__radio--on .certForm__radioLabel {
    color: rgba(30, 91, 255, 0.9);
}

/* Image 3 布局：card + 右侧分享图标 */
.certList__item+.certList__item {
    margin-top: 18rpx;
}

.certCard__bar--pending {
    background: #f59e0b;
    box-shadow: 0 10rpx 18rpx rgba(245, 158, 11, 0.22);
}

.certCard__bar--approved {
    background: #22c55e;
    box-shadow: 0 10rpx 18rpx rgba(34, 197, 94, 0.22);
}

.certCard--pending {
    border-color: rgba(245, 158, 11, 0.28);
}

.certCard--approved {
    border-color: rgba(34, 197, 94, 0.28);
}

.certCard__action {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #f59e0b;
}

.certCard__footer {
    margin-top: 14rpx;
    padding-top: 14rpx;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.certCard__certAt {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.38);
}

.certCard__viewBtn {
    font-size: 24rpx;
    color: rgba(30, 91, 255, 0.8);
    font-weight: 600;
}

/* 认证详情弹窗 */
.detailSheet {
    padding: 32rpx 28rpx calc(env(safe-area-inset-bottom) + 24rpx);
}

.detailSheet__hd {
    margin-bottom: 28rpx;
}

.detailSheet__title {
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.86);
}

.detailSheet__company {
    margin-top: 8rpx;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.46);
}

.detailSheet__body {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.detailSheet__row {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
}

.detailSheet__label {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.46);
    white-space: nowrap;
    min-width: 80rpx;
    padding-top: 2rpx;
}

.detailSheet__label::after {
    content: '：';
}

.detailSheet__value {
    font-size: 28rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.84);
    flex: 1;
}

.detailSheet__rec {
    background: rgba(0, 0, 0, 0.025);
    border-radius: 16rpx;
    padding: 18rpx 20rpx;
}

.detailSheet__recLabel {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.46);
    margin-bottom: 10rpx;
}

.detailSheet__recText {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.72);
    line-height: 1.7;
}
.certRow__wrap {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 18rpx;
}

.certRow__wrap .certCard {
    flex: 1;
    margin-bottom: 0;
}

.shareBtn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    background: rgba(7, 193, 96, 0.08);
    border: 1px solid rgba(7, 193, 96, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
}

.shareBtn--pressed {
    opacity: 0.7;
}

.shareBtn__icon {
    width: 40rpx;
    height: 40rpx;
    position: relative;
    border: 3rpx solid rgba(7, 193, 96, 0.8);
    border-radius: 8rpx;
}

.shareBtn__icon::after {
    content: '';
    position: absolute;
    right: -8rpx;
    top: 50%;
    width: 16rpx;
    height: 16rpx;
    border-top: 3rpx solid rgba(7, 193, 96, 0.8);
    border-right: 3rpx solid rgba(7, 193, 96, 0.8);
    transform: translateY(-50%) rotate(45deg);
}

/* 推荐认证人弹窗 */
.recommenderSheet {
    display: flex;
    flex-direction: column;
    max-height: 70vh;
}

.recommenderSheet__hd {
    padding: 32rpx 28rpx 16rpx;
    flex: 0 0 auto;
}

.recommenderSheet__title {
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.86);
}

.recommenderSheet__sub {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.46);
}

.recommenderSheet__list {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 0 28rpx;
    max-height: 40vh;
}

.recommenderItem {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 22rpx 18rpx;
    border-radius: 18rpx;
    margin-bottom: 12rpx;
    background: rgba(0, 0, 0, 0.025);
    transition: all 0.15s;
}

.recommenderItem--on {
    background: rgba(30, 91, 255, 0.07);
    border: 1px solid rgba(30, 91, 255, 0.22);
}

.recommenderItem__avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    overflow: hidden;
    flex: 0 0 auto;
    background: rgba(30, 91, 255, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommenderItem__img {
    width: 100%;
    height: 100%;
}

.recommenderItem__avatarFallback {
    font-size: 32rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.8);
}

.recommenderItem__info {
    flex: 1;
    min-width: 0;
}

.recommenderItem__name {
    font-size: 30rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.84);
}

.recommenderItem__role {
    margin-top: 4rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.46);
}

.recommenderItem__check {
    color: rgba(30, 91, 255, 0.9);
    font-size: 36rpx;
    font-weight: 900;
    flex: 0 0 auto;
}

.recommenderSheet__footer {
    padding: 20rpx 28rpx 28rpx;
    display: flex;
    flex-direction: column;
    gap: 14rpx;
    flex: 0 0 auto;
}

:deep(.recommenderBtn) {
    border-radius: 18rpx !important;
}

:deep(.recommenderBtn--ghost) {
    border-color: rgba(0, 0, 0, 0.14) !important;
    color: rgba(0, 0, 0, 0.56) !important;
}

/* 分享触发浮层 */
.shareTrigger {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    background: #fff;
    border-radius: 22rpx 22rpx 0 0;
    box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.12);
    padding: 28rpx 28rpx calc(env(safe-area-inset-bottom) + 20rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18rpx;
}

.shareTrigger__hint {
    font-size: 30rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
    text-align: center;
}

.shareTrigger__sub {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.46);
    text-align: center;
    line-height: 1.6;
}

.shareTrigger__shareBtn {
    width: 100%;
    background: #07c160;
    color: #fff;
    border-radius: 18rpx;
    font-size: 32rpx;
    font-weight: 700;
    padding: 26rpx 0;
    border: none;
    text-align: center;
    line-height: 1;
    margin: 0;
    box-sizing: border-box;
}

.shareTrigger__shareBtn::after {
    border: none;
}

.shareTrigger__skip {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.38);
    padding: 8rpx 24rpx;
}
</style>
