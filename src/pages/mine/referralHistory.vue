<template>
    <view class="page">
        <HeaderNav title="推荐记录" type="show-back" theme="000" />

        <scroll-view class="list" scroll-y>
            <view class="list__inner">
                <view v-if="loading" class="emptyTip">加载中…</view>
                <view v-else-if="!items.length" class="emptyTip">暂无推荐记录</view>
                <view v-for="item in items" :key="item.id" class="recCard">
                    <view class="recCard__head">
                        <view class="recCard__bar" />
                        <view class="recCard__name">{{ item.certifieeRealName || '匿名认证' }}</view>
                        <view class="recCard__badge">{{ relationLabel(item.relationship) }}</view>
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
                        <view class="recCard__time">认证于 {{ formatTime(item.certifiedAt) }}</view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetCertificationsGiven } from '@/api/index'

type RecItem = {
    id: string
    certifiedAt: string
    certifieeRealName: string | null
    anonymous: boolean
    company: string
    jobTitle: string
    workStartDate: string | null
    workEndDate: string | null
    relationship: string | null
}

const items = ref<RecItem[]>([])
const loading = ref(false)

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

const relationLabel = (r: string | null) => {
    if (r === 'SUPERVISOR') return '上级'
    if (r === 'HR') return 'HR'
    return '同事'
}

const formatDateRange = (start: string | null, end: string | null) => {
    const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }) : '至今'
    if (!start && !end) return '未填写'
    return `${fmt(start)} - ${fmt(end)}`
}

const formatTime = (iso: string) => {
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
    background: rgba(30, 91, 255, 0.92);
    flex: 0 0 auto;
}

.recCard__name {
    flex: 1;
    font-size: 32rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.84);
}

.recCard__badge {
    padding: 4rpx 18rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: #1e5bff;
    background: rgba(30, 91, 255, 0.10);
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
</style>
