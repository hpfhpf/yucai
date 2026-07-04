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
                        <!-- 认证对象信息 -->
                        <view class="certForm__card">
                            <view class="certForm__row">
                                <view class="certForm__label">姓名</view>
                                <view class="certForm__value">{{ certInfo.certifieeRealName || '未填写' }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">公司</view>
                                <view class="certForm__value certForm__value--grow">{{ certInfo.company }}</view>
                                <view class="certForm__label">在职时间</view>
                                <view class="certForm__value">{{ formatDateRange(certInfo.startDate, certInfo.endDate) }}</view>
                            </view>
                            <view class="certForm__row">
                                <view class="certForm__label">职位</view>
                                <view class="certForm__value">{{ certInfo.jobTitle }}</view>
                            </view>
                        </view>

                        <!-- 共事时间 -->
                        <view class="certForm__section">
                            <view class="certForm__sectionTitle">在职时间</view>
                            <view class="certForm__dateRow">
                                <wd-datetime-picker v-model="knowFrom" type="date" label="" placeholder="开始时" />
                                <view class="certForm__dateSep">至</view>
                                <wd-datetime-picker v-model="knowTo" type="date" label="" placeholder="结束时" />
                            </view>
                        </view>

                        <!-- 推荐信 -->
                        <view class="certForm__section">
                            <textarea class="certForm__textarea" v-model="recommendation" placeholder="推荐信模板" maxlength="500" />
                        </view>

                        <!-- 与认证人的关系 -->
                        <view class="certForm__section">
                            <view class="certForm__radioRow">
                                <view v-for="r in relationships" :key="r.value"
                                    :class="['certForm__radio', relationship === r.value && 'certForm__radio--on']"
                                    @click="relationship = r.value">
                                    <view class="certForm__radioCircle" />
                                    <view class="certForm__radioLabel">{{ r.label }}</view>
                                </view>
                            </view>
                        </view>

                        <!-- 匿名/实名 -->
                        <view class="certForm__section">
                            <view class="certForm__radioRow">
                                <view :class="['certForm__radio', anonymous && 'certForm__radio--on']"
                                    @click="anonymous = true">
                                    <view class="certForm__radioCircle" />
                                    <view class="certForm__radioLabel">匿名提交</view>
                                </view>
                                <view :class="['certForm__radio', !anonymous && 'certForm__radio--on']"
                                    @click="anonymous = false">
                                    <view class="certForm__radioCircle" />
                                    <view class="certForm__radioLabel">实名提交</view>
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
                    <!-- 为同事输入认证码 -->
                    <view class="codeBox">
                        <view class="codeBox__label">输入认证码，为同事认证</view>
                        <view class="codeBox__row">
                            <input class="codeBox__input" v-model="inputCode" placeholder="粘贴或输入认证码" :disabled="codeConfirming" />
                            <wd-button type="primary" size="small" :loading="codeConfirming" :disabled="!inputCode.trim()" @click="handleCodeConfirm">确认</wd-button>
                        </view>
                    </view>

                    <view v-if="loading" class="emptyTip">加载中…</view>
                    <view v-else-if="!items.length" class="emptyTip">暂无认证记录</view>
                    <!-- 对应 Image 3 的 card + 分享图标布局 -->
                    <view v-for="item in items" :key="item.id" class="certRow__wrap">
                        <view class="certCard">
                            <view class="certCard__head">
                                <view class="certCard__bar" />
                                <view class="certCard__title">{{ item.companyName }}</view>
                                <view :class="['certBadge', statusClass(item.status)]">{{ statusLabel(item.status) }}</view>
                            </view>
                            <view class="certCard__body">
                                <view class="certRow">
                                    <view class="certRow__icon certRow__icon--building" />
                                    <view class="certRow__text">{{ item.companyName }}</view>
                                </view>
                                <view class="certRow">
                                    <view class="certRow__icon certRow__icon--clock" />
                                    <view class="certRow__text">{{ item.jobTitle }}</view>
                                </view>
                            </view>
                        </view>
                        <!-- 认证中显示分享图标（对应 Image 3） -->
                        <view v-if="item.status === 'PENDING'" class="shareBtn"
                            hover-class="shareBtn--pressed" @click="handleShare(item)">
                            <view class="shareBtn__icon" />
                        </view>
                    </view>
                </template>

            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiGetCertifications, apiConfirmWorkCert, apiRequestWorkCert, apiGetCertInfo } from '@/api/index'

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

type CertItem = { id: string; workExpId: string; companyName: string; jobTitle: string; status: 'PENDING' | 'APPROVED'; shareToken: string | null; shareExpireAt: string | null; createdAt: string }

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
const knowFrom = ref('')
const knowTo = ref('')
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

const statusLabel = (s: string) => s === 'APPROVED' ? '已认证' : '认证中'
const statusClass = (s: string) => s === 'APPROVED' ? 'badge--approved' : 'badge--pending'

// 输入认证码为同事认证
const inputCode = ref('')
const codeConfirming = ref(false)

const handleCodeConfirm = () => {
    const token = inputCode.value.trim()
    if (!token) return
    // 跳转到认证表单页（复用确认模式，带 shareToken 参数）
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/workCertification?shareToken=${token}` as any })
}

onMounted(async () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    const page = pages[pages.length - 1] as any
    const token = page?.options?.shareToken || ''
    if (token) {
        confirmToken.value = token
        try {
            const info: any = await apiGetCertInfo(token)
            certInfo.value = info
            certInfoLoaded.value = true
        } catch {
            // token无效或过期，错误由 request.ts 统一处理
        }
        return
    }
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
        }))
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }
})

const handleConfirmCert = async () => {
    confirming.value = true
    try {
        await apiConfirmWorkCert(confirmToken.value, {
            relationship: relationship.value,
            recommendation: recommendation.value || undefined,
            knowFrom: knowFrom.value || undefined,
            knowTo: knowTo.value || undefined,
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
    // 重新生成 token（确保未过期）
    let token = item.shareToken || ''
    try {
        const res: any = await apiRequestWorkCert(item.workExpId)
        if (res.shareToken) {
            token = res.shareToken
            const idx = items.value.findIndex(i => i.id === item.id)
            if (idx !== -1) items.value[idx].shareToken = token
        }
    } catch { }

    if (!token) return
    const certPath = `/pages/seeker/resumeCenter/workCertification?shareToken=${token}`
    uni.showActionSheet({
        itemList: ['微信分享', '复制认证码'],
        success: ({ tapIndex }) => {
            if (tapIndex === 0) {
                if (typeof wx !== 'undefined' && (wx as any).shareAppMessage) {
                    ;(wx as any).shareAppMessage({
                        title: `请帮我认证在${item.companyName}的工作经历`,
                        path: certPath,
                    })
                } else {
                    uni.showToast({ title: '当前环境不支持微信分享', icon: 'none' })
                }
            } else {
                uni.setClipboardData({
                    data: token,
                    success: () => uni.showToast({ title: '认证码已复制，发给已认证的同事', icon: 'success', duration: 2000 }),
                })
            }
        },
    })
}

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

.certForm__sectionTitle {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    margin-bottom: 16rpx;
}

.certForm__dateRow {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.certForm__dateSep {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
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

/* 输入认证码区域 */
.codeBox {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22rpx;
    padding: 24rpx 22rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 8rpx 24rpx rgba(30, 60, 140, 0.07);
}

.codeBox__label {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    margin-bottom: 16rpx;
}

.codeBox__row {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.codeBox__input {
    flex: 1;
    height: 72rpx;
    border-radius: 14rpx;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0 20rpx;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.84);
    box-sizing: border-box;
}

/* Image 3 布局：card + 右侧分享图标 */
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
</style>
