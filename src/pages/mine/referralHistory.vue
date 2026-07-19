<template>
    <view class="page">
        <HeaderNav title="认证记录" type="show-back" theme="000" />

        <scroll-view class="list" scroll-y>
            <view class="list__inner">
                <view v-if="loading" class="emptyTip">加载中…</view>
                <wd-empty v-else-if="!items.length" image="content" tip="暂无认证记录" />
                <view v-for="item in items" :key="item.id" class="recCard"
                    :class="item.status === 'APPROVED' ? 'recCard--approved' : 'recCard--pending'"
                    hover-class="recCard--pressed"
                    @click="handleCardTap(item)">
                    <view class="recCard__head">
                        <view class="recCard__bar" :class="item.status === 'APPROVED' ? 'recCard__bar--approved' : 'recCard__bar--pending'" />
                        <view class="recCard__name">{{ item.certifieeRealName || '匿名' }}</view>
                        <view class="recCard__status" :class="item.status === 'APPROVED' ? 'recCard__status--approved' : 'recCard__status--pending'">
                            {{ item.status === 'APPROVED' ? '已认证' : '待认证' }}
                        </view>
                    </view>
                    <view class="recCard__body">
                        <view class="recCard__row">
                            <view class="recCard__icon recCard__icon--building" />
                            <view class="recCard__text">{{ item.company }}</view>
                        </view>
                        <view class="recCard__row">
                            <view class="recCard__icon recCard__icon--briefcase" />
                            <view class="recCard__text">{{ item.jobTitle }}</view>
                        </view>
                        <view class="recCard__row">
                            <view class="recCard__icon recCard__icon--clock" />
                            <view class="recCard__text">{{ formatDateRange(item.workStartDate, item.workEndDate) }}</view>
                        </view>
                    </view>
                    <view class="recCard__foot">
                        <view v-if="item.status === 'APPROVED'" class="recCard__time">
                            认证于 {{ formatDate(item.certifiedAt) }} · {{ relationLabel(item.relationship) }}
                        </view>
                        <view v-else class="recCard__pendingHint">点击填写认证信息 →</view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 已认证详情弹窗 -->
        <wd-popup v-model="detailShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: #fff;">
            <view v-if="detailItem" class="detailSheet">
                <view class="detailSheet__hd">
                    <view class="detailSheet__title">认证详情</view>
                    <view class="detailSheet__sub">{{ detailItem.company }} · {{ detailItem.jobTitle }}</view>
                </view>
                <view class="detailSheet__body">
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">被认证人</view>
                        <view class="detailSheet__value">{{ detailItem.certifieeRealName || '匿名' }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">工作关系</view>
                        <view class="detailSheet__value">{{ relationLabel(detailItem.relationship) }}</view>
                    </view>
                    <view class="detailSheet__row">
                        <view class="detailSheet__label">在职期间</view>
                        <view class="detailSheet__value">{{ formatDateRange(detailItem.workStartDate, detailItem.workEndDate) }}</view>
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
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetCertificationsGiven } from '@/api/index'

type RecItem = {
    id: string
    status: 'PENDING' | 'APPROVED'
    shareToken: string | null
    certifiedAt: string | null
    certifieeRealName: string | null
    anonymous: boolean
    company: string
    jobTitle: string
    workStartDate: string | null
    workEndDate: string | null
    relationship: string | null
    recommendation: string | null
}

const items = ref<RecItem[]>([])
const loading = ref(false)
const detailShown = ref(false)
const detailItem = ref<RecItem | null>(null)

onMounted(async () => {
    loading.value = true
    try {
        const res: any = await apiGetCertificationsGiven()
        items.value = res as RecItem[]
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }
})

const handleCardTap = (item: RecItem) => {
    if (item.status === 'PENDING') {
        if (!item.shareToken) {
            uni.showToast({ title: '认证链接已失效，请联系对方重新发送', icon: 'none' })
            return
        }
        uni.navigateTo({ url: `/pages/seeker/resumeCenter/workCertification?shareToken=${item.shareToken}` as any })
    } else {
        detailItem.value = item
        detailShown.value = true
    }
}

const relationLabel = (r: string | null) => {
    if (r === 'SUPERVISOR') return '上级/直属领导'
    if (r === 'HR') return 'HR'
    return '同事'
}

const formatDateRange = (start: string | null, end: string | null) => {
    const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }) : '至今'
    if (!start && !end) return '未填写'
    return `${fmt(start)} - ${fmt(end)}`
}

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background: #eef3ff;
    display: flex;
    flex-direction: column;
}

.list {
    flex: 1;
}

.list__inner {
    padding: 20rpx 26rpx 40rpx;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.emptyTip {
    text-align: center;
    padding: 80rpx 0;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.38);
}

.recCard {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 22rpx;
    box-shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.10);
    padding: 22rpx 22rpx 16rpx;
    overflow: hidden;
    border: 1px solid transparent;
}

.recCard--approved {
    border-color: rgba(34, 197, 94, 0.22);
}

.recCard--pending {
    border-color: rgba(245, 158, 11, 0.28);
}

.recCard--pressed {
    opacity: 0.85;
    transform: scale(0.99);
}

.recCard__head {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;
}

.recCard__bar {
    width: 8rpx;
    height: 30rpx;
    border-radius: 999rpx;
    flex: 0 0 auto;
}

.recCard__bar--approved {
    background: #22c55e;
    box-shadow: 0 6rpx 14rpx rgba(34, 197, 94, 0.28);
}

.recCard__bar--pending {
    background: #f59e0b;
    box-shadow: 0 6rpx 14rpx rgba(245, 158, 11, 0.28);
}

.recCard__name {
    flex: 1;
    font-size: 32rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
}

.recCard__status {
    padding: 4rpx 18rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.recCard__status--approved {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.10);
}

.recCard__status--pending {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.10);
}

.recCard__body {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.recCard__row {
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.recCard__icon {
    width: 36rpx;
    height: 36rpx;
    border-radius: 12rpx;
    background: rgba(0, 0, 0, 0.10);
    position: relative;
    flex: 0 0 auto;
}

.recCard__icon--building::after {
    content: '';
    position: absolute;
    left: 50%; top: 50%;
    width: 18rpx; height: 20rpx;
    border-radius: 4rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -58%);
    background:
        linear-gradient(rgba(255, 255, 255, 0.62) 0 0) 50% 40% / 10rpx 3rpx no-repeat,
        linear-gradient(rgba(255, 255, 255, 0.62) 0 0) 50% 62% / 10rpx 3rpx no-repeat;
}

.recCard__icon--briefcase::after {
    content: '';
    position: absolute;
    left: 50%; top: 50%;
    width: 18rpx; height: 14rpx;
    border-radius: 4rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -50%);
}

.recCard__icon--clock::after {
    content: '';
    position: absolute;
    left: 50%; top: 50%;
    width: 18rpx; height: 18rpx;
    border-radius: 999rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -50%);
}

.recCard__text {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.62);
    font-weight: 700;
}

.recCard__foot {
    margin-top: 14rpx;
    padding-top: 14rpx;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.recCard__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.38);
}

.recCard__pendingHint {
    font-size: 24rpx;
    color: #f59e0b;
    font-weight: 600;
}

/* 详情弹窗 */
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

.detailSheet__sub {
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
</style>
