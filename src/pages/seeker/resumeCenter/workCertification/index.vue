<template>
    <view class="page" :style="navCssVars">
        <!-- 自定义导航栏 -->
        <view class="nav" :style="{ paddingTop: `${statusBarHeight}px` }">
            <view class="nav__bar">
                <view class="nav__back" hover-class="nav__back--pressed" @click="handleBack">
                    <FaIcon name="arrow-left" :size="32" color="rgba(0,0,0,0.72)" />
                </view>
                <view class="nav__title">工作经历认证</view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y :show-scrollbar="false">
            <view class="content" :style="{ paddingBottom: `${safeBottom + 44}px` }">

                <!-- 确认模式：他人分享认证链接时 -->
                <template v-if="confirmToken">
                    <!-- 认证成功状态 -->
                    <view v-if="confirmed" class="confirmBox confirmBox--done">
                        <view class="confirmBox__icon">
                            <FaIcon name="check" :size="48" color="#22c55e" />
                        </view>
                        <view class="confirmBox__title">认证成功</view>
                        <view class="confirmBox__sub">已为对方完成工作经历认证</view>
                        <wd-button type="primary" block class="confirmBox__btn" @click="handleBack">
                            返回首页
                        </wd-button>
                    </view>

                    <!-- 认证表单 -->
                    <view v-else-if="certInfoLoaded" class="certForm">
                        <!-- 欢迎语 -->
                        <view class="certForm__welcome">
                            <view class="certForm__welcomeIcon">
                                <FaIcon name="handshake" :size="40" color="#1e5bff" />
                            </view>
                            <view class="certForm__welcomeTitle">您的前同事邀请您见证</view>
                            <view class="certForm__welcomeSub">请核实以下工作经历信息，如实完成职业经历联合认证</view>
                        </view>

                        <!-- 认证对象信息卡片 -->
                        <view class="certForm__card">
                            <view class="certForm__cardHeader">
                                <FaIcon name="user-tie" :size="28" color="#1e5bff" />
                                <text class="certForm__cardTitle">被认证人信息</text>
                            </view>
                            <view class="certForm__divider" />
                            <view class="certForm__row">
                                <view class="certForm__label">
                                    <FaIcon name="id-card" :size="24" color="rgba(0,0,0,0.4)" />
                                    <text>姓名</text>
                                </view>
                                <view class="certForm__value">{{ certInfo.certifieeRealName || '未填写' }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">
                                    <FaIcon name="building" :size="24" color="rgba(0,0,0,0.4)" />
                                    <text>公司</text>
                                </view>
                                <view class="certForm__value certForm__value--grow">{{ certInfo.company }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">
                                    <FaIcon name="briefcase" :size="24" color="rgba(0,0,0,0.4)" />
                                    <text>职位</text>
                                </view>
                                <view class="certForm__value">{{ certInfo.jobTitle }}</view>
                            </view>
                        </view>

                        <!-- 在职期间 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionHeader">
                                <FaIcon name="calendar-days" :size="28" color="#1e5bff" />
                                <text class="certForm__sectionTitle">在职期间</text>
                            </view>
                            <view class="certForm__periodDisplay">
                                <FaIcon name="clock" :size="24" color="rgba(30,91,255,0.7)" />
                                <text>{{ formatDateRange(certInfo.startDate, certInfo.endDate) }}</text>
                            </view>
                        </view>

                        <!-- 工作评价 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionHeader">
                                <FaIcon name="pen-to-square" :size="28" color="#1e5bff" />
                                <text class="certForm__sectionTitle">工作评价</text>
                                <text class="certForm__sectionOptional">（选填）</text>
                            </view>
                            <view class="certForm__textareaWrap">
                                <textarea class="certForm__textarea" v-model="recommendation"
                                    placeholder="请简要描述对方的工作能力和职业经历，例如：我与 XX 在该公司共事期间，他主要负责……工作认真负责，所陈述工作经历属实。"
                                    maxlength="500" :show-count="false" />
                                <view class="certForm__charCount">{{ recommendation.length }}/500</view>
                            </view>
                        </view>

                        <!-- 工作关系 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionHeader">
                                <FaIcon name="people-arrows" :size="28" color="#1e5bff" />
                                <text class="certForm__sectionTitle">您与对方的工作关系</text>
                            </view>
                            <view class="certForm__radioRow">
                                <view v-for="r in relationships" :key="r.value"
                                    :class="['certForm__radio', relationship === r.value && 'certForm__radio--on']"
                                    @click="relationship = r.value">
                                    <view class="certForm__radioCircle">
                                        <view v-if="relationship === r.value" class="certForm__radioInner" />
                                    </view>
                                    <FaIcon :name="r.icon" :size="24" :color="relationship === r.value ? '#1e5bff' : 'rgba(0,0,0,0.5)'" />
                                    <view class="certForm__radioLabel">{{ r.label }}</view>
                                </view>
                            </view>
                        </view>

                        <wd-button type="primary" block :loading="confirming" custom-class="certForm__submitBtn"
                            @click="handleConfirmCert">
                            <FaIcon name="check-circle" :size="28" color="#fff" />
                            <text>确认认证</text>
                        </wd-button>
                    </view>

                    <!-- 加载中 -->
                    <view v-else class="loadingWrap">
                        <view class="loadingWrap__spinner">
                            <FaIcon name="spinner" :size="48" color="#1e5bff" spin />
                        </view>
                        <view class="loadingWrap__text">加载认证信息...</view>
                    </view>
                </template>

                <!-- 列表模式：查看自己的认证状态 -->
                <template v-else>
                    <!-- 页面引导 -->
                    <view class="pageGuide">
                        <view class="pageGuide__icon">
                            <FaIcon name="shield-halved" :size="40" color="#1e5bff" />
                        </view>
                        <view class="pageGuide__title">职业经历联合认证</view>
                        <view class="pageGuide__desc">邀请前同事认证您的工作经历，提升简历可信度</view>
                    </view>

                    <!-- 加载状态 -->
                    <view v-if="loading" class="loadingWrap">
                        <view class="loadingWrap__spinner">
                            <FaIcon name="spinner" :size="48" color="#1e5bff" spin />
                        </view>
                        <view class="loadingWrap__text">加载中...</view>
                    </view>

                    <!-- 空状态 -->
                    <view v-else-if="!items.length" class="emptyWrap">
                        <view class="emptyWrap__icon">
                            <FaIcon name="clipboard-list" :size="80" color="rgba(0,0,0,0.15)" />
                        </view>
                        <view class="emptyWrap__title">暂无认证记录</view>
                        <view class="emptyWrap__desc">您可以在简历中心申请工作经历认证</view>
                        <wd-button type="primary" custom-class="emptyWrap__btn" @click="goToResume">
                            前往简历中心
                        </wd-button>
                    </view>

                    <!-- 认证列表 -->
                    <view v-else class="certList">
                        <view v-for="(item, index) in items" :key="item.id" class="certList__item"
                            :style="{ animationDelay: `${index * 0.05}s` }">
                            <!-- PENDING：分享按钮与邀请放在一行 -->
                            <view v-if="item.status === 'PENDING'" class="certCard certCard--pending"
                                hover-class="certCard--pressed">
                                <view class="certCard__head">
                                    <view class="certCard__badge">
                                        <FaIcon name="hourglass-half" :size="20" color="#f59e0b" />
                                    </view>
                                    <view class="certCard__title">{{ item.companyName }}</view>
                                    <view class="certBadge badge--pending">
                                        <FaIcon name="circle-notch" :size="16" color="#f59e0b" />
                                        <text>认证中</text>
                                    </view>
                                </view>
                                <view class="certCard__body">
                                    <view class="certRow">
                                        <FaIcon name="briefcase" :size="24" color="rgba(0,0,0,0.4)" />
                                        <view class="certRow__text">{{ item.jobTitle }}</view>
                                    </view>
                                    <view v-if="item.createdAt" class="certRow">
                                        <FaIcon name="clock" :size="24" color="rgba(0,0,0,0.4)" />
                                        <view class="certRow__text">申请于 {{ formatDate(item.createdAt) }}</view>
                                    </view>
                                </view>
                                <view class="certCard__footer certCard__footer--pending">
                                    <view class="certCard__actionBtn" @click="handleShare(item)">
                                        <FaIcon name="paper-plane" :size="22" color="#fff" />
                                        <text>发送认证邀请</text>
                                    </view>
                                </view>
                            </view>

                            <!-- APPROVED：已认证卡片 -->
                            <view v-else class="certCard certCard--approved" hover-class="certCard--pressed"
                                @click="showDetail(item)">
                                <view class="certCard__head">
                                    <view class="certCard__badge certCard__badge--approved">
                                        <FaIcon name="shield-halved" :size="20" color="#22c55e" />
                                    </view>
                                    <view class="certCard__title">{{ item.companyName }}</view>
                                    <view class="certBadge badge--approved">
                                        <FaIcon name="check" :size="16" color="#22c55e" />
                                        <text>已认证</text>
                                    </view>
                                </view>
                                <view class="certCard__body">
                                    <view class="certRow">
                                        <FaIcon name="briefcase" :size="24" color="rgba(0,0,0,0.4)" />
                                        <view class="certRow__text">{{ item.jobTitle }}</view>
                                    </view>
                                    <view v-if="item.certifierName" class="certRow">
                                        <FaIcon name="user-check" :size="24" color="rgba(0,0,0,0.4)" />
                                        <view class="certRow__text">
                                            {{ item.certifierName }}{{ item.certifierRole ? ` · ${item.certifierRole}` : '' }} 认证
                                        </view>
                                    </view>
                                </view>
                                <view class="certCard__footer">
                                    <view class="certCard__certAt">
                                        <FaIcon name="calendar-check" :size="20" color="rgba(0,0,0,0.3)" />
                                        <text>认证于 {{ formatDate(item.certifiedAt) }}</text>
                                    </view>
                                    <view class="certCard__viewBtn">
                                        <text>查看详情</text>
                                        <FaIcon name="chevron-right" :size="20" color="#1e5bff" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>

            </view>
        </scroll-view>

        <!-- 推荐认证人选择弹窗 -->
        <wd-popup v-model="recommenderShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 24rpx 24rpx 0 0; background: #fff; max-height: 75vh;">
            <view class="recommenderSheet">
                <view class="recommenderSheet__hd">
                    <view class="recommenderSheet__icon">
                        <FaIcon name="users" :size="36" color="#1e5bff" />
                    </view>
                    <view class="recommenderSheet__title">选择认证人</view>
                    <view class="recommenderSheet__sub">以下是在该公司有重叠经历的已认证同事</view>
                </view>

                <scroll-view scroll-y class="recommenderSheet__list">
                    <view v-if="loadingRecommenders" class="loadingWrap loadingWrap--small">
                        <FaIcon name="spinner" :size="36" color="#1e5bff" spin />
                        <view class="loadingWrap__text">加载推荐人...</view>
                    </view>
                    <view v-else-if="!recommenders.length" class="emptyWrap emptyWrap--small">
                        <FaIcon name="user-slash" :size="56" color="rgba(0,0,0,0.15)" />
                        <view class="emptyWrap__title">暂未找到推荐认证人</view>
                        <view class="emptyWrap__desc">您可以直接发送给微信好友</view>
                    </view>
                    <view v-else v-for="r in recommenders" :key="r.userId"
                        :class="['recommenderItem', selectedRecommender?.userId === r.userId && 'recommenderItem--on']"
                        @click="selectedRecommender = r">
                        <view class="recommenderItem__avatar">
                            <image v-if="r.avatarUrl" :src="r.avatarUrl" class="recommenderItem__img" mode="aspectFill" />
                            <view v-else class="recommenderItem__avatarFallback">
                                <FaIcon name="user" :size="32" color="#1e5bff" />
                            </view>
                        </view>
                        <view class="recommenderItem__info">
                            <view class="recommenderItem__name">{{ r.realName || r.nickname || '未知用户' }}</view>
                            <view class="recommenderItem__role">{{ r.roleTitle || levelLabel(r.currentLevel) || '前同事' }}</view>
                        </view>
                        <view v-if="selectedRecommender?.userId === r.userId" class="recommenderItem__check">
                            <FaIcon name="check-circle" :size="36" color="#1e5bff" />
                        </view>
                        <view v-else class="recommenderItem__uncheck">
                            <view class="recommenderItem__circle" />
                        </view>
                    </view>
                </scroll-view>

                <view class="recommenderSheet__footer">
                    <wd-button plain block custom-class="recommenderBtn recommenderBtn--ghost"
                        @click="doShare(pendingShareItem, null)">
                        <FaIcon name="comment-dots" :size="26" color="rgba(0,0,0,0.56)" />
                        <text>直接发给微信好友</text>
                    </wd-button>
                    <wd-button type="primary" block custom-class="recommenderBtn"
                        :disabled="!selectedRecommender" @click="doShare(pendingShareItem, selectedRecommender?.userId)">
                        <FaIcon name="paper-plane" :size="26" color="#fff" />
                        <text>发给选定认证人</text>
                    </wd-button>
                </view>
            </view>
        </wd-popup>

        <!-- 已认证详情弹窗 -->
        <wd-popup v-model="detailShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 24rpx 24rpx 0 0; background: #fff;">
            <view v-if="detailItem" class="detailSheet">
                <view class="detailSheet__hd">
                    <view class="detailSheet__icon">
                        <FaIcon name="certificate" :size="40" color="#22c55e" />
                    </view>
                    <view class="detailSheet__title">认证详情</view>
                    <view class="detailSheet__company">{{ detailItem.companyName }} · {{ detailItem.jobTitle }}</view>
                </view>
                <view class="detailSheet__body">
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">
                            <FaIcon name="user-check" :size="24" color="rgba(0,0,0,0.4)" />
                            <text>认证人</text>
                        </view>
                        <view class="detailSheet__value">{{ detailItem.certifierName || '匿名' }}{{ detailItem.certifierRole ? ` · ${detailItem.certifierRole}` : '' }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">
                            <FaIcon name="people-arrows" :size="24" color="rgba(0,0,0,0.4)" />
                            <text>工作关系</text>
                        </view>
                        <view class="detailSheet__value">{{ relationLabel(detailItem.relationship) }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">
                            <FaIcon name="calendar-days" :size="24" color="rgba(0,0,0,0.4)" />
                            <text>在职期间</text>
                        </view>
                        <view class="detailSheet__value">{{ formatDateRange(detailItem.knowFrom, detailItem.knowTo) }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">
                            <FaIcon name="clock" :size="24" color="rgba(0,0,0,0.4)" />
                            <text>认证时间</text>
                        </view>
                        <view class="detailSheet__value">{{ formatDate(detailItem.certifiedAt) }}</view>
                    </view>
                    <view v-if="detailItem.recommendation" class="detailSheet__rec">
                        <view class="detailSheet__recLabel">
                            <FaIcon name="pen-to-square" :size="24" color="rgba(0,0,0,0.4)" />
                            <text>工作评价</text>
                        </view>
                        <view class="detailSheet__recText">{{ detailItem.recommendation }}</view>
                    </view>
                </view>
                <view class="detailSheet__footer">
                    <wd-button block custom-class="detailSheet__closeBtn" @click="detailShown = false">
                        关闭
                    </wd-button>
                </view>
            </view>
        </wd-popup>

        <!-- 分享触发浮层 -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="showShareTrigger" class="shareTrigger">
            <view class="shareTrigger__icon">
                <FaIcon name="share-nodes" :size="48" color="#1e5bff" />
            </view>
            <view class="shareTrigger__hint">向前同事发起认证邀请</view>
            <view class="shareTrigger__sub">点击下方按钮，通过微信将认证邀请卡片发送给对方</view>
            <button open-type="share" class="shareTrigger__shareBtn">
                <FaIcon name="paper-plane" :size="28" color="#fff" />
                <text>发送认证邀请</text>
            </button>
            <view class="shareTrigger__skip" @click="showShareTrigger = false">
                <FaIcon name="xmark" :size="24" color="rgba(0,0,0,0.38)" />
                <text>暂不发送</text>
            </view>
        </view>
        <!-- #endif -->

        <!-- 遮罩层 -->
        <view v-if="showShareTrigger" class="shareMask" @click="showShareTrigger = false" />
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import FaIcon from '@/components/FaIcon/index.vue'
import {
    apiGetCertifications,
    apiConfirmWorkCert,
    apiGetCertInfo,
    apiGetRecommendedCertifiers,
    apiRequestWorkCertWithCertifier
} from '@/api/index'

// ==================== 导航栏适配 ====================
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

// ==================== 类型定义 ====================
type CertItem = {
    id: string
    workExpId: string
    companyName: string
    jobTitle: string
    status: 'PENDING' | 'APPROVED'
    shareToken: string | null
    shareExpireAt: string | null
    createdAt: string
    certifierName: string | null
    certifierRole: string | null
    relationship: string | null
    recommendation: string | null
    certifiedAt: string | null
    knowFrom: string | null
    knowTo: string | null
}

type CertInfo = {
    company: string
    jobTitle: string
    startDate: string | null
    endDate: string | null
    certifieeRealName: string | null
}

type Recommender = {
    userId: string
    nickname: string | null
    realName: string | null
    avatarUrl: string | null
    roleTitle: string | null
    currentLevel: string | null
    company: string
    workTitle: string
}

// ==================== 列表模式数据 ====================
const items = ref<CertItem[]>([])
const loading = ref(false)

// ==================== 确认模式数据 ====================
const confirmToken = ref('')
const confirming = ref(false)
const confirmed = ref(false)
const certInfo = ref<CertInfo>({
    company: '',
    jobTitle: '',
    startDate: null,
    endDate: null,
    certifieeRealName: null
})
const certInfoLoaded = ref(false)

// ==================== 表单字段 ====================
const recommendation = ref('')
const relationship = ref('COLLEAGUE')
const anonymous = ref(false)

const relationships = [
    { value: 'SUPERVISOR', label: '我是上级', icon: 'user-tie' },
    { value: 'COLLEAGUE', label: '我是同事', icon: 'users' },
    { value: 'HR', label: '我是HR', icon: 'id-card' },
]

// ==================== 弹窗状态 ====================
const recommenderShown = ref(false)
const loadingRecommenders = ref(false)
const recommenders = ref<Recommender[]>([])
const selectedRecommender = ref<Recommender | null>(null)
const pendingShareItem = ref<CertItem | null>(null)
const detailShown = ref(false)
const detailItem = ref<CertItem | null>(null)
const shareData = ref<{ title: string; path: string } | null>(null)
const showShareTrigger = ref(false)

// ==================== 常量 ====================
const LEVEL_LABELS: Record<string, string> = {
    IC: '骨干员工',
    LEAD: '团队主管',
    MGR_DIR: '中高层管理',
    VP_C: '决策层',
}

// ==================== 工具函数 ====================
const levelLabel = (level: string | null) => level ? LEVEL_LABELS[level] || '' : ''

const formatDateRange = (start: string | null, end: string | null) => {
    const fmt = (d: string | null) => d
        ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' })
        : '至今'
    if (!start && !end) return '未填写'
    return `${fmt(start)} - ${fmt(end)}`
}

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

const relationLabel = (r: string | null) => {
    if (r === 'SUPERVISOR') return '上级/直属领导'
    if (r === 'HR') return 'HR'
    return '同事'
}

// ==================== 页面跳转 ====================
const goToResume = () => {
    uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
}

const handleBack = () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    if (pages.length > 1) {
        uni.navigateBack()
        return
    }
    uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
}

// ==================== 认证详情 ====================
const showDetail = (item: CertItem) => {
    detailItem.value = item
    detailShown.value = true
}

// ==================== 提交认证 ====================
const handleConfirmCert = async () => {
    if (!relationship.value) {
        uni.showToast({ title: '请选择您与对方的工作关系', icon: 'none' })
        return
    }

    confirming.value = true
    uni.showLoading({ title: '提交中...', mask: true })

    try {
        await apiConfirmWorkCert(confirmToken.value, {
            relationship: relationship.value,
            recommendation: recommendation.value || undefined,
            knowFrom: certInfo.value.startDate || undefined,
            knowTo: certInfo.value.endDate || undefined,
            anonymous: anonymous.value,
        })
        confirmed.value = true
        uni.hideLoading()
        uni.showToast({ title: '认证成功', icon: 'success' })
    } catch (err) {
        uni.hideLoading()
    } finally {
        confirming.value = false
    }
}

// ==================== 分享功能 ====================
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

const doShare = async (item: CertItem | null, certifierId: string | null | undefined) => {
    if (!item) return
    recommenderShown.value = false

    uni.showLoading({ title: '准备分享...', mask: true })

    try {
        const res: any = await apiRequestWorkCertWithCertifier(item.workExpId, certifierId ?? undefined)
        const token = res.shareToken
        uni.hideLoading()

        if (!token) {
            uni.showToast({ title: '获取分享链接失败', icon: 'none' })
            return
        }

        // 更新列表里的 shareToken
        const idx = items.value.findIndex(i => i.id === item.id)
        if (idx !== -1) items.value[idx].shareToken = token

        const certPath = `/pages/seeker/resumeCenter/workCertification/index?shareToken=${token}`

        // #ifdef MP-WEIXIN
        shareData.value = {
            title: `邀您见证【职业里程碑与经历联合认证】`,
            path: certPath,
        }
        showShareTrigger.value = true
        // #endif

        // #ifndef MP-WEIXIN
        uni.setClipboardData({
            data: token,
            success: () => uni.showToast({
                title: '认证码已复制，发给对方',
                icon: 'success',
                duration: 2000
            }),
        })
        // #endif
    } catch {
        uni.hideLoading()
    }
}

// 注册页面分享内容
onShareAppMessage(() => ({
    title: shareData.value?.title || '工作经历认证',
    path: shareData.value?.path || '/pages/seeker/resumeCenter/workCertification/index',
}))

// ==================== 页面初始化 ====================
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
        } catch {
            uni.showToast({ title: '加载认证信息失败', icon: 'none' })
        }
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

    // 若从简历中心跳转过来，自动触发对应卡片的分享弹窗
    if (workExpId) {
        const target = items.value.find(i => i.workExpId === workExpId)
        if (target) {
            handleShare(target)
        } else if (resend !== '1') {
            const fakeItem: CertItem = {
                id: '',
                workExpId,
                companyName: '',
                jobTitle: '',
                status: 'PENDING',
                shareToken: null,
                shareExpireAt: null,
                createdAt: '',
                certifierName: null,
                certifierRole: null,
                relationship: null,
                recommendation: null,
                certifiedAt: null,
                knowFrom: null,
                knowTo: null,
            }
            handleShare(fakeItem)
        }
    }
})
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';

// ==================== CSS Variables ====================
:root {
    --cert-primary: #1e5bff;
    --cert-success: #22c55e;
    --cert-warning: #f59e0b;
    --cert-bg: #f5f7fa;
    --cert-card-bg: rgba(255, 255, 255, 0.98);
    --cert-text-primary: rgba(0, 0, 0, 0.86);
    --cert-text-secondary: rgba(0, 0, 0, 0.56);
    --cert-text-muted: rgba(0, 0, 0, 0.36);
    --cert-border: rgba(0, 0, 0, 0.06);
    --cert-shadow: 0 8rpx 32rpx rgba(30, 60, 140, 0.08);
    --cert-shadow-hover: 0 12rpx 40rpx rgba(30, 60, 140, 0.12);
}

// ==================== Page Layout ====================
.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #e8f0ff 0%, #f5f7fa 30%, #f5f7fa 100%);
    display: flex;
    flex-direction: column;
}

// ==================== Navigation ====================
.nav {
    height: var(--nav-total);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20rpx);
    padding: 0 18rpx;
    box-sizing: border-box;
    flex: 0 0 auto;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.nav__bar {
    position: relative;
    height: var(--nav-bar);
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav__title {
    color: var(--cert-text-primary);
    font-size: 34rpx;
    font-weight: 700;
}

.nav__back {
    position: absolute;
    left: 10rpx;
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.nav__back--pressed {
    background: rgba(0, 0, 0, 0.05);
}

.nav__capsule {
    position: absolute;
    right: var(--capsule-right);
    width: var(--capsule-width);
    height: var(--capsule-height);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
}

// ==================== Scroll Content ====================
.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 24rpx 28rpx 32rpx;
    box-sizing: border-box;
}

// ==================== Page Guide ====================
.pageGuide {
    background: var(--cert-card-bg);
    border-radius: 24rpx;
    padding: 40rpx 32rpx;
    margin-bottom: 24rpx;
    box-shadow: var(--cert-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.pageGuide__icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(30, 91, 255, 0.12), rgba(30, 91, 255, 0.04));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}

.pageGuide__title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
    margin-bottom: 12rpx;
}

.pageGuide__desc {
    font-size: 26rpx;
    color: var(--cert-text-secondary);
    line-height: 1.5;
}

// ==================== Loading States ====================
.loadingWrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 40rpx;
}

.loadingWrap--small {
    padding: 60rpx 40rpx;
}

.loadingWrap__spinner {
    margin-bottom: 20rpx;
}

.loadingWrap__text {
    font-size: 28rpx;
    color: var(--cert-text-secondary);
}

// ==================== Empty State ====================
.emptyWrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 40rpx;
}

.emptyWrap--small {
    padding: 60rpx 40rpx;
}

.emptyWrap__icon {
    margin-bottom: 24rpx;
}

.emptyWrap__title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--cert-text-primary);
    margin-bottom: 12rpx;
}

.emptyWrap__desc {
    font-size: 26rpx;
    color: var(--cert-text-muted);
    margin-bottom: 32rpx;
    text-align: center;
}

.emptyWrap__btn {
    width: 280rpx;
}

// ==================== Certificate List ====================
.certList {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.certList__item {
    opacity: 0;
    transform: translateY(20rpx);
    animation: slideUpFade 0.4s ease forwards;
}

@keyframes slideUpFade {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// ==================== Certificate Card ====================
.certCard {
    border-radius: 24rpx;
    background: var(--cert-card-bg);
    box-shadow: var(--cert-shadow);
    overflow: hidden;
    padding: 28rpx;
    transition: all 0.2s ease;
}

.certCard--pressed {
    transform: scale(0.98);
    box-shadow: var(--cert-shadow-hover);
}

.certCard--pending {
    border-left: 6rpx solid var(--cert-warning);
}

.certCard--approved {
    border-left: 6rpx solid var(--cert-success);
}

.certCard__head {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
}

.certCard__badge {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: rgba(245, 158, 11, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.certCard__badge--approved {
    background: rgba(34, 197, 94, 0.12);
}

.certCard__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
}

.certCard__body {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.certRow {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.certRow__text {
    font-size: 28rpx;
    color: var(--cert-text-secondary);
}

.certCard__action {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 26rpx;
    color: var(--cert-warning);
    font-weight: 500;
}

.certCard__footer {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid var(--cert-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.certCard__footer--pending {
    .certCard__actionBtn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12rpx;
        padding: 24rpx 0;
        border-radius: 100rpx;
        background: linear-gradient(135deg, #1e5bff, #2a67ff);
        font-size: 28rpx;
        color: #fff;
        font-weight: 600;
        box-shadow: 0 8rpx 24rpx rgba(30, 91, 255, 0.25);
        transition: all 0.2s;
    }

    .certCard__actionBtn:active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 16rpx rgba(30, 91, 255, 0.2);
    }
}

.certCard__certAt {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: var(--cert-text-muted);
}

.certCard__viewBtn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    color: var(--cert-primary);
    font-weight: 500;
}

// ==================== Status Badge ====================
.certBadge {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 8rpx 18rpx;
    border-radius: 100rpx;
    font-size: 24rpx;
    font-weight: 600;
}

.badge--pending {
    color: var(--cert-warning);
    background: rgba(245, 158, 11, 0.1);
}

.badge--approved {
    color: var(--cert-success);
    background: rgba(34, 197, 94, 0.1);
}

// ==================== Confirmation Box ====================
.confirmBox {
    background: var(--cert-card-bg);
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--cert-shadow);
    margin-top: 40rpx;
}

.confirmBox--done {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.02));
    border: 1px solid rgba(34, 197, 94, 0.2);
}

.confirmBox__icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
}

.confirmBox__title {
    font-size: 40rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
    margin-bottom: 16rpx;
}

.confirmBox__sub {
    font-size: 28rpx;
    color: var(--cert-text-secondary);
    margin-bottom: 40rpx;
}

.confirmBox__btn {
    width: 400rpx;
}

// ==================== Certification Form ====================
.certForm {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.certForm__welcome {
    background: linear-gradient(135deg, rgba(30, 91, 255, 0.08), rgba(30, 91, 255, 0.02));
    border: 1px solid rgba(30, 91, 255, 0.15);
    border-radius: 24rpx;
    padding: 36rpx 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.certForm__welcomeIcon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background: rgba(30, 91, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}

.certForm__welcomeTitle {
    font-size: 32rpx;
    font-weight: 700;
    color: var(--cert-primary);
    margin-bottom: 12rpx;
}

.certForm__welcomeSub {
    font-size: 26rpx;
    color: var(--cert-text-secondary);
    line-height: 1.5;
}

.certForm__card {
    background: var(--cert-card-bg);
    border-radius: 24rpx;
    padding: 28rpx;
    box-shadow: var(--cert-shadow);
}

.certForm__cardHeader {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
}

.certForm__cardTitle {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
}

.certForm__divider {
    height: 1px;
    background: var(--cert-border);
    margin-bottom: 20rpx;
}

.certForm__row {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;

    &:last-child {
        margin-bottom: 0;
    }
}

.certForm__label {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 28rpx;
    color: var(--cert-text-secondary);
    min-width: 140rpx;
}

.certForm__value {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--cert-text-primary);

    &--grow {
        flex: 1;
    }
}

.certForm__section {
    background: var(--cert-card-bg);
    border-radius: 24rpx;
    padding: 28rpx;
    box-shadow: var(--cert-shadow);
}

.certForm__sectionHeader {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
}

.certForm__sectionTitle {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
}

.certForm__sectionOptional {
    font-size: 26rpx;
    color: var(--cert-text-muted);
    margin-left: auto;
}

.certForm__periodDisplay {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 20rpx 24rpx;
    background: rgba(30, 91, 255, 0.04);
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: var(--cert-text-primary);
}

.certForm__textareaWrap {
    position: relative;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 16rpx;
    padding: 20rpx;
}

.certForm__textarea {
    width: 100%;
    min-height: 180rpx;
    font-size: 28rpx;
    color: var(--cert-text-primary);
    line-height: 1.6;
}

.certForm__charCount {
    text-align: right;
    font-size: 24rpx;
    color: var(--cert-text-muted);
    margin-top: 12rpx;
}

.certForm__radioRow {
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
}

.certForm__radio {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 20rpx 28rpx;
    border-radius: 100rpx;
    border: 2rpx solid var(--cert-border);
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.2s;
}

.certForm__radio--on {
    border-color: var(--cert-primary);
    background: rgba(30, 91, 255, 0.06);
}

.certForm__radioCircle {
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.certForm__radio--on .certForm__radioCircle {
    border-color: var(--cert-primary);
}

.certForm__radioInner {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: var(--cert-primary);
}

.certForm__radioLabel {
    font-size: 28rpx;
    color: var(--cert-text-primary);
}

.certForm__submitBtn {
    margin-top: 12rpx;
}

// ==================== Recommender Sheet ====================
.recommenderSheet {
    display: flex;
    flex-direction: column;
    max-height: 75vh;
}

.recommenderSheet__hd {
    padding: 36rpx 32rpx 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid var(--cert-border);
}

.recommenderSheet__icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba(30, 91, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
}

.recommenderSheet__title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
    margin-bottom: 12rpx;
}

.recommenderSheet__sub {
    font-size: 26rpx;
    color: var(--cert-text-secondary);
}

.recommenderSheet__list {
    flex: 1;
    padding: 20rpx 28rpx;
    max-height: 45vh;
}

.recommenderItem {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 24rpx 20rpx;
    border-radius: 20rpx;
    margin-bottom: 12rpx;
    background: rgba(0, 0, 0, 0.02);
    transition: all 0.2s;
}

.recommenderItem--on {
    background: rgba(30, 91, 255, 0.06);
    border: 1px solid rgba(30, 91, 255, 0.2);
}

.recommenderItem__avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(30, 91, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommenderItem__img {
    width: 100%;
    height: 100%;
}

.recommenderItem__avatarFallback {
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommenderItem__info {
    flex: 1;
    min-width: 0;
}

.recommenderItem__name {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
    margin-bottom: 6rpx;
}

.recommenderItem__role {
    font-size: 24rpx;
    color: var(--cert-text-muted);
}

.recommenderItem__check {
    flex-shrink: 0;
}

.recommenderItem__uncheck {
    width: 44rpx;
    height: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommenderItem__circle {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(0, 0, 0, 0.15);
}

.recommenderSheet__footer {
    padding: 24rpx 28rpx 32rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    border-top: 1px solid var(--cert-border);
}

.recommenderBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
}

.recommenderBtn--ghost {
    border-color: var(--cert-border) !important;
    color: var(--cert-text-secondary) !important;
}

// ==================== Detail Sheet ====================
.detailSheet {
    padding: 36rpx 32rpx calc(env(safe-area-inset-bottom) + 28rpx);
}

.detailSheet__hd {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32rpx;
    padding-bottom: 28rpx;
    border-bottom: 1px solid var(--cert-border);
}

.detailSheet__icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: rgba(34, 197, 94, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}

.detailSheet__title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
    margin-bottom: 12rpx;
}

.detailSheet__company {
    font-size: 28rpx;
    color: var(--cert-text-secondary);
}

.detailSheet__body {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    margin-bottom: 32rpx;
}

.detailSheet__row {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
}

.detailSheet__label {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 28rpx;
    color: var(--cert-text-secondary);
    min-width: 140rpx;
}

.detailSheet__value {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--cert-text-primary);
    flex: 1;
}

.detailSheet__rec {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 20rpx;
    padding: 24rpx;
    margin-top: 8rpx;
}

.detailSheet__recLabel {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 26rpx;
    color: var(--cert-text-secondary);
    margin-bottom: 16rpx;
}

.detailSheet__recText {
    font-size: 28rpx;
    color: var(--cert-text-primary);
    line-height: 1.7;
}

.detailSheet__footer {
    padding-top: 8rpx;
}

.detailSheet__closeBtn {
    border-radius: 100rpx !important;
}

// ==================== Share Trigger ====================
.shareTrigger {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    box-shadow: 0 -8rpx 40rpx rgba(0, 0, 0, 0.12);
    padding: 40rpx 32rpx calc(env(safe-area-inset-bottom) + 28rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.shareTrigger__icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: rgba(30, 91, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.shareTrigger__hint {
    font-size: 32rpx;
    font-weight: 700;
    color: var(--cert-text-primary);
}

.shareTrigger__sub {
    font-size: 26rpx;
    color: var(--cert-text-secondary);
    text-align: center;
    line-height: 1.5;
}

.shareTrigger__shareBtn {
    width: 100%;
    background: #07c160;
    color: #fff;
    border-radius: 100rpx;
    font-size: 32rpx;
    font-weight: 600;
    padding: 28rpx 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    margin: 8rpx 0 0;
    line-height: 1;

    &::after {
        border: none;
    }
}

.shareTrigger__skip {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 28rpx;
    color: var(--cert-text-muted);
    padding: 12rpx 32rpx;
}

.shareMask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
}

// ==================== Deep Selectors ====================
:deep(.certForm__submitBtn) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    border-radius: 100rpx !important;
    height: 96rpx !important;
}

:deep(.recommenderBtn) {
    border-radius: 100rpx !important;
    height: 88rpx !important;
}

:deep(.emptyWrap__btn) {
    border-radius: 100rpx !important;
}

:deep(.confirmBox__btn) {
    border-radius: 100rpx !important;
}
</style>
