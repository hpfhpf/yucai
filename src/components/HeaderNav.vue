<template>
    <view class="nav" :style="{ paddingTop: `${statusBarHeight}px` }">
        <view class="nav__bar" :class="theme == 'FFF' ? 'white__nav' : 'black__nav'">
            <view class="nav__left" v-if="type == 'seeker-index'" @click="handleCityTap">
                <FaIcon name="location-dot" :size="28" color="rgba(255,255,255,0.92)" />
                <view class="nav__city">{{ city }}</view>
                <view class="nav__caret" />
            </view>
            <view class="nav__back" v-if="type == 'show-back'" @click="goPageBack">
                <view class="nav__backIcon" />
            </view>
            <view class="nav__title">{{ title }}</view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { goPageBack } from '@/utils/route'

const props = withDefaults(defineProps<{
    title: string,
    type: string,
    theme: string
}>(), {
    title: '',
    type: 'default',
    theme: 'FFF'
})
const city = ref('北京')
const systemInfo = uni.getWindowInfo()
const statusBarHeight = ref(systemInfo.statusBarHeight || 0)

const handleCityTap = () => {
    uni.showToast({ title: '切换城市', icon: 'none' })
}
</script>

<style scoped lang="scss">
.nav {
    position: relative;

    .nav__left {
        position: absolute;
        left: 26rpx;
        height: 76rpx;
        display: flex;
        align-items: center;
    }

    .nav__city {
        max-width: 160rpx;
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.94);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8rpx;
    }

    .nav__caret {
        width: 0;
        height: 0;
        border-left: 8rpx solid transparent;
        border-right: 8rpx solid transparent;
        border-top: 10rpx solid rgba(255, 255, 255, 0.88);
        transform: translateY(2rpx);
    }
}

.nav__bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    line-height: 44px;
}

.nav__title {
    font-size: 34rpx;
    font-weight: 600;
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

.nav__backIcon {
    width: 18rpx;
    height: 18rpx;
    border-left: 4rpx solid rgba(0, 0, 0, 0.72);
    border-bottom: 4rpx solid rgba(0, 0, 0, 0.72);
    transform: rotate(45deg);
    margin-left: 6rpx;
}

.white__nav {
    .nav__title {
        color: rgba(255, 255, 255, 0.92);
    }

    .nav__backIcon {
        border-left: 4rpx solid rgba(255, 255, 255, 0.72);
        border-bottom: 4rpx solid rgba(255, 255, 255, 0.72);
    }
}

.black__nav {
    .nav__title {
        color: rgba(0, 0, 0, 0.92);
    }

    .nav__backIcon {
        border-left: 4rpx solid rgba(0, 0, 0, 0.72);
        border-bottom: 4rpx solid rgba(0, 0, 0, 0.72);
    }
}
</style>
