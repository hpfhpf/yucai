<template>
    <view class="page">
        <HeaderNav title="认证记录" type="show-back" theme="FFF" />

        <view class="summary">
            <view class="summary__left">
                <view class="summary__label">信用分</view>
                <view class="summary__score">
                    <text class="summary__num">{{ score }}</text>
                    <text class="summary__unit">分</text>
                </view>
            </view>
            <view class="summary__right">
                <wd-tag round custom-class="summary__tag">更新时间：{{ updatedAt }}</wd-tag>
            </view>
        </view>

        <wd-card title="信用需慢慢积累，请保持哟!" custom-title-class="meter__title" custom-content-class="meter__content">
            <view class="meter__labels">
                <view v-for="(x, index) in levelLabels" :key="x" class="meter__label"
                    :class="levelIndex == index ? 'meter__num--active' : ''">{{ x }}</view>
            </view>

            <view class="meter__trackWrap">
                <view class="meter__track" />
                <view class="meter__dot" v-for="p in points" :key="p" :style="{ left: `${valueToLeft(p)}%` }" />
            </view>

            <view class="meter__nums">
                <view v-for="(p, index) in points" :key="p" class="meter__num" :style="{ left: `${valueToLeft(p)}%` }">
                    {{ p }}
                </view>
            </view>
        </wd-card>

        <view class="list">
            <wd-cell-group>
                <wd-cell v-for="item in records" :key="item.id" clickable custom-class="record-cell"
                    @click="handleRecordTap(item.id)">
                    <template #prefix>
                        <view class="record-icon" :class="item.delta > 0 ? 'record-icon--good' : 'record-icon--bad'">
                            <wd-icon :name="item.delta > 0 ? 'face-smile-fill' : 'face-frown-fill'"
                                :color="item.delta > 0 ? '#1e78ff' : '#ffa600'" size="40rpx" />
                        </view>
                    </template>

                    <template #title>
                        <view class="record__company">{{ item.company }}</view>
                    </template>

                    <template #label>
                        <view class="record__desc">{{ item.desc }}</view>
                    </template>

                    <view class="record__delta" :class="item.delta > 0 ? 'record__delta--pos' : 'record__delta--neg'">
                        {{ item.delta > 0 ? `+${item.delta}` : item.delta }}
                    </view>
                    <view class="record__time">{{ item.month }}</view>
                </wd-cell>
            </wd-cell-group>
        </view>

        <wd-toast selector="recordToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'

const toast = useToast('recordToast')

const score = ref(850)
const updatedAt = ref('2025-01-06')

const points = [220, 350, 500, 650, 800, 1000] as const
const levelLabels = ['较差', '中等', '良好', '优秀', '极好']
const levelIndex = ref(4);

type RecordItem = {
    id: string
    month: string
    company: string
    desc: string
    delta: number
}

const records = ref<RecordItem[]>([
    { id: 'r1', month: '2025-01', company: '四川盛龙宝科技有限公司', desc: '工作积极、沟通能力强、遵守规则', delta: 5 },
    { id: 'r2', month: '2025-01', company: '四川盛龙宝科技有限公司', desc: '工作积极、沟通能力强、遵守规则', delta: -3 },
    { id: 'r3', month: '2025-01', company: '四川盛龙宝科技有限公司', desc: '工作积极、沟通能力强、遵守规则', delta: 5 },
    { id: 'r4', month: '2025-01', company: '四川盛龙宝科技有限公司', desc: '工作积极、沟通能力强、遵守规则', delta: -3 },
    { id: 'r5', month: '2025-01', company: '四川盛龙宝科技有限公司', desc: '工作积极、沟通能力强、遵守规则', delta: 5 }
])

const minValue = points[0]
const maxValue = points[points.length - 1]

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const valueToLeft = (value: number) => {
    const v = clamp(value, minValue, maxValue)
    return ((v - minValue) / (maxValue - minValue)) * 100
}

const handleRecordTap = (id: string) => {
    const hit = records.value.find((x) => x.id === id)
    toast.info(hit?.company || '记录')
}
</script>

<style scoped lang="scss">
$bg: #eaf0ff;
$primary: #1e5bff;
$shadow: 0 18rpx 50rpx rgba(11, 78, 255, 0.12);
$shadow-soft: 0 16rpx 44rpx rgba(30, 60, 140, 0.08);

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #0b56ff 0%, #1a66ff 24%, $bg 64%, $bg 100%);
}

.summary {
    position: relative;
    z-index: 2;
    margin-top: 10rpx;
    padding: 0 28rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.summary__label {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.78);
    margin-bottom: 8rpx;
}

.summary__score {
    display: flex;
    align-items: flex-end;
    gap: 10rpx;
}

.summary__num {
    font-size: 96rpx;
    font-weight: 800;
    line-height: 1;
    color: #fff;
}

.summary__unit {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.82);
    padding-bottom: 10rpx;
}

:deep(.summary__tag) {
    background: rgba(30, 70, 255, 0.35) !important;
    border-color: rgba(255, 255, 255, 0.18) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 24rpx !important;
}

:deep(.meter__title) {
    text-align: center !important;
    font-size: 28rpx !important;
    font-weight: 700 !important;
    color: rgba(0, 0, 0, 0.66) !important;
}

:deep(.meter__content) {
    padding: 28rpx !important;
}

.meter__labels {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.34);
    padding: 0 6rpx 0;
}

.meter__label {
    width: 20%;
    text-align: center;
}

.meter__trackWrap {
    position: relative;
    height: 64rpx;
    padding: 0 12rpx;
}

.meter__track {
    position: absolute;
    left: 12rpx;
    right: 12rpx;
    top: 34rpx;
    height: 10rpx;
    border-radius: 999rpx;
    background: linear-gradient(90deg, #5aa6ff 0%, #2f7dff 40%, #1f5bff 70%, #0b49ff 100%);
}

.meter__dot {
    position: absolute;
    top: 30rpx;
    width: 18rpx;
    height: 18rpx;
    border-radius: 999rpx;
    background: #fff;
    box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.08);
    transform: translateX(-50%);
}

.meter__nums {
    position: relative;
    height: 28rpx;
    margin-top: 8rpx;
}

.meter__num--active {
    color: #FFF;
    background-color: $primary;
    border: 1px solid $primary;
    border-radius: 22rpx;
}

.meter__num {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.28);
}

.list {
    position: relative;
    padding: 22rpx 22rpx 44rpx;
    background: $bg;
}

:deep(.record-cell) {
    border-radius: 22rpx !important;
    margin-bottom: 18rpx !important;
    box-shadow: $shadow-soft;
    overflow: hidden;
}

.record-icon {
    width: 74rpx;
    height: 74rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.record-icon--good {
    background: rgba(30, 120, 255, 0.12);
}

.record-icon--bad {
    background: rgba(255, 166, 0, 0.14);
}

.record__company {
    font-size: 30rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.record__desc {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.record__delta {
    font-size: 30rpx;
    font-weight: 800;
    text-align: right;
}

.record__delta--pos {
    color: $primary;
}

.record__delta--neg {
    color: rgba(0, 0, 0, 0.28);
}

.record__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.28);
    text-align: right;
    margin-top: 4rpx;
}
</style>
