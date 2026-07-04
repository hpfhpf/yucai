<template>
    <view class="page" :style="navCssVars">
        <view class="nav" :style="{ paddingTop: `${statusBarHeight}px` }">
            <view class="nav__bar">
                <view class="nav__back" hover-class="nav__back--pressed" @click="handleBack">
                    <view class="nav__backIcon" />
                </view>
                <view class="nav__title">消息中心</view>
                <view class="nav__capsule" />
            </view>
        </view>

        <view class="tabs">
            <view class="tabs__inner">
                <view class="tab" :class="{ 'tab--active': activeTab === 'invite' }" @click="activeTab = 'invite'">
                    面试邀请
                    <view v-if="activeTab === 'invite'" class="tab__bar" />
                </view>
                <view class="tabs__divider" />
                <view class="tab" :class="{ 'tab--active': activeTab === 'chat' }" @click="activeTab = 'chat'">
                    聊天
                    <view v-if="activeTab === 'chat'" class="tab__bar" />
                </view>
            </view>
        </view>

        <scroll-view class="list" scroll-y>
            <wd-empty
                v-if="currentList.length === 0"
                :tip="activeTab === 'invite' ? '暂无面试邀请' : '暂无聊天消息'"
            />
            <view v-for="item in currentList" :key="item.id" class="card" hover-class="card--pressed"
                @click="handleItemTap(item)">
                <view class="card__avatar">
                    <image v-if="item.avatar" class="card__avatarImg" :src="item.avatar" mode="aspectFill" />
                    <view v-else class="card__avatarPh" />
                </view>

                <view class="card__main">
                    <view class="card__title">{{ item.title }}</view>
                    <view class="card__sub">{{ item.sub }}</view>
                    <view v-if="item.meta" class="card__meta">{{ item.meta }}</view>
                </view>

                <view class="card__right">
                    <view v-if="item.hint" class="card__hint">{{ item.hint }}</view>
                    <view class="card__time">{{ item.time }}</view>
                </view>
            </view>

            <view class="list__pad" />
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type MessageItem = {
    id: string
    avatar?: string
    title: string
    sub: string
    meta: string
    hint: string
    time: string
}

const activeTab = ref<'invite' | 'chat'>('chat')

const inviteList: MessageItem[] = [
    {
        id: 'i1',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '',
        hint: '我的投递',
        time: '01-07'
    },
    {
        id: 'i2',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '',
        hint: '我的投递',
        time: '01-07'
    },
    {
        id: 'i3',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '',
        hint: '我的投递',
        time: '01-07'
    },
    {
        id: 'i4',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '',
        hint: '我的投递',
        time: '01-07'
    },
    {
        id: 'i5',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '',
        hint: '我的投递',
        time: '01-07'
    }
]

const chatList: MessageItem[] = [
    {
        id: 'c1',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    },
    {
        id: 'c2',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    },
    {
        id: 'c3',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    },
    {
        id: 'c4',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    },
    {
        id: 'c5',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    },
    {
        id: 'c6',
        title: '连锁餐厅',
        sub: '我觉得你非常合适我司的行政前台...',
        meta: '',
        hint: '',
        time: '09:41'
    }
]

const currentList = computed(() => (activeTab.value === 'invite' ? inviteList : chatList))

const systemInfo = uni.getWindowInfo()
const statusBarHeight = ref(systemInfo.statusBarHeight || 0)
const navBarHeight = ref(44)
const capsuleWidth = ref(88)
const capsuleHeight = ref(32)
const capsuleRight = ref(12)

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
        '--nav-total': `${total}px`,
        '--nav-bar': `${navBarHeight.value}px`,
        '--capsule-width': `${capsuleWidth.value}px`,
        '--capsule-height': `${capsuleHeight.value}px`,
        '--capsule-right': `${capsuleRight.value}px`
    }
})

const handleBack = () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    if (pages.length > 1) {
        uni.navigateBack()
        return
    }
    uni.navigateTo({ url: '/pages/seeker/index' })
}

const handleItemTap = (item: MessageItem) => {
    uni.showToast({ title: item.title, icon: 'none' })
}
</script>

<style scoped lang="scss">
:root {
    --bg: #eaf0ff;
    --card: rgba(255, 255, 255, 0.9);
    --shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.08);
    --text: rgba(0, 0, 0, 0.86);
    --sub: rgba(0, 0, 0, 0.46);
    --muted: rgba(0, 0, 0, 0.3);
    --primary: #1e5bff;
}

.page {
    min-height: 100vh;
    background: var(--bg);
}

.nav {
    height: var(--nav-total);
    background: #fff;
}

.nav__bar {
    height: var(--nav-bar);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav__title {
    font-size: 34rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.88);
    letter-spacing: 2rpx;
}

.nav__capsule {
    position: absolute;
    right: var(--capsule-right);
    width: var(--capsule-width);
    height: var(--capsule-height);
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
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

.tabs {
    background: #fff;
    padding: 0 24rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.tabs__inner {
    height: 92rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    position: relative;
}

.tabs__divider {
    width: 1px;
    height: 24rpx;
    background: rgba(0, 0, 0, 0.12);
}

.tab {
    position: relative;
    font-size: 30rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.5);
    padding: 18rpx 8rpx 10rpx;
    min-width: 160rpx;
    text-align: center;
}

.tab--active {
    color: rgba(0, 0, 0, 0.82);
}

.tab__bar {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 56rpx;
    height: 6rpx;
    background: var(--primary);
    border-radius: 999rpx;
    transform: translateX(-50%);
}

.list {
    height: calc(100vh - var(--nav-total) - 92rpx);
    padding: 18rpx 22rpx 0;
    box-sizing: border-box;
}

.card {
    background: var(--card);
    border-radius: 18rpx;
    padding: 18rpx 20rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-shadow: var(--shadow);
    margin-bottom: 18rpx;
}

.card--pressed {
    transform: scale(0.99);
    opacity: 0.96;
}

.card__avatar {
    width: 82rpx;
    height: 82rpx;
    border-radius: 999rpx;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.04);
    flex: 0 0 auto;
}

.card__avatarImg {
    width: 100%;
    height: 100%;
}

.card__avatarPh {
    width: 100%;
    height: 100%;
    background:
        radial-gradient(70rpx 70rpx at 30% 30%, rgba(255, 165, 0, 0.26), rgba(255, 165, 0, 0) 60%),
        radial-gradient(70rpx 70rpx at 70% 70%, rgba(30, 91, 255, 0.22), rgba(30, 91, 255, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.card__main {
    flex: 1;
    min-width: 0;
}

.card__title {
    font-size: 32rpx;
    font-weight: 800;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__sub {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.44);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__meta {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.32);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__right {
    width: 140rpx;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10rpx;
}

.card__hint {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.card__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.32);
}

.list__pad {
    height: 30rpx;
}
</style>
