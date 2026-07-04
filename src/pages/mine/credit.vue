<template>
    <view class="page">
        <HeaderNav title="信用异议" type="show-back" theme="000" />

        <view class="content">
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
    align-items: center;
    justify-content: center;
    padding: 120rpx 26rpx;
}
</style>
