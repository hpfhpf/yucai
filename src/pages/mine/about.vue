<template>
    <view class="page">
        <HeaderNav title="关于我们" type="show-back" theme="000" />

        <view class="content">
            <view class="brand">
                <view class="brand__logo" />
                <view class="brand__name">育才</view>
                <view class="brand__version">版本 v1.0.0</view>
            </view>
            <wd-empty image="content" tip="暂无内容" />
        </view>
    </view>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 26rpx;
    gap: 40rpx;
}

.brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.brand__logo {
    width: 128rpx;
    height: 128rpx;
    border-radius: var(--app-radius-lg);
    background: #FFF url('@/assets/images/avatar.png') no-repeat center center / contain;
    box-shadow: var(--app-shadow-card);
}

.brand__name {
    font-size: 36rpx;
    font-weight: 600;
    color: var(--app-text-primary);
}

.brand__version {
    font-size: 24rpx;
    color: var(--app-text-muted);
}
</style>
