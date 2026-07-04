<template>
    <view class="bottomNav" :style="{ paddingBottom: `${safeBottom}px` }">
        <view class="bottomNav__inner" :style="navStyle">
            <view v-for="(item, idx) in items" :key="item.label" class="bottomNav__item"
                :class="{ 'bottomNav__item--active': idx === activeIndex }" @click="handleTap(item, idx)">
                <view class="bottomNav__iconWrap">
                    <FaIcon :name="iconName(item.key)" :size="46"
                        :color="idx === activeIndex ? props.themeColor : 'rgba(0,0,0,0.4)'" />
                    <view v-if="showBadge(idx)" class="bottomNav__badge"
                        :class="{ 'bottomNav__badge--dot': badgeValue(idx) === true }">
                        <text v-if="badgeValue(idx) !== true">{{ badgeValue(idx) }}</text>
                    </view>
                </view>
                <view class="bottomNav__label">{{ item.label }}</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'

type BadgeMap = Record<number, string | number | boolean>
type NavItem = {
    key: 'home' | 'resume' | 'message' | 'mine' | 'talents'
    label: string
    path: string
}

const props = withDefaults(defineProps<{
    activeIndex: number
    themeColor?: string
    badges?: BadgeMap
}>(), {
    activeIndex: 0,
    themeColor: '#0f5bff',
})

const emit = defineEmits<{
    (e: 'change', index: number): void
}>()

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)
const navStyle = computed(() => ({ '--bottom-nav-active': props.themeColor } as Record<string, string>))

const userInfo = (() => {
    try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} }
})()
const isRecruiter = userInfo?.role === 'RECRUITER'

const seekerItems: NavItem[] = [
    { key: 'home', label: '首页', path: '/pages/seeker/index' },
    { key: 'message', label: '消息', path: '/pages/message/index' },
    { key: 'resume', label: '简历中心', path: '/pages/seeker/resumeCenter/index' },
    { key: 'mine', label: '我的', path: '/pages/mine/index' },
]

const recruiterItems: NavItem[] = [
    { key: 'home', label: '首页', path: '/pages/recruiter/index' },
    { key: 'talents', label: '找人才', path: '/pages/recruiter/talents' },
    { key: 'resume', label: '简历中心', path: '/pages/recruiter/resumeCenter' },
    { key: 'mine', label: '我的', path: '/pages/mine/index' },
]

const items = isRecruiter ? recruiterItems : seekerItems

const badgeValue = (idx: number) => props.badges?.[idx]
const showBadge = (idx: number) => Boolean(badgeValue(idx))

const iconMap: Record<string, string> = {
    home: 'house',
    message: 'comment-dots',
    resume: 'file-lines',
    mine: 'circle-user',
    talents: 'user-group',
}
const iconName = (key: string) => iconMap[key] || 'circle'

const handleTap = (item: NavItem, idx: number) => {
    if (idx === props.activeIndex) return
    emit('change', idx)
    uni.navigateTo({ url: item.path as any })
}

defineExpose({})
</script>

<style scoped lang="scss">
.bottomNav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(18rpx);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.bottomNav__inner {
    height: 116rpx;
    padding: 12rpx 18rpx 0;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.bottomNav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    color: rgba(0, 0, 0, 0.4);
}

.bottomNav__item--active {
    color: var(--bottom-nav-active);
}

.bottomNav__iconWrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.bottomNav__label {
    font-size: 28rpx;
    line-height: 1;
    margin-top: 4rpx;
}

.bottomNav__badge {
    position: absolute;
    top: -6rpx;
    right: -10rpx;
    min-width: 28rpx;
    height: 28rpx;
    border-radius: 14rpx;
    padding: 0 8rpx;
    background: #ff4d4f;
    color: #fff;
    font-size: 18rpx;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 14rpx rgba(255, 77, 79, 0.36);
    box-sizing: border-box;
}

.bottomNav__badge--dot {
    width: 16rpx;
    min-width: 16rpx;
    height: 16rpx;
    padding: 0;
    border-radius: 999rpx;
    right: -4rpx;
    top: -2rpx;
}
</style>
