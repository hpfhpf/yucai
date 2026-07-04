<template>
    <view class="page">
        <HeaderNav title="动态详情" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 60}px` }">
                <template v-if="news">
                    <view class="article__title">{{ news.title }}</view>
                    <view class="article__meta">
                        <view class="article__source">{{ news.source }}</view>
                        <view class="article__date">{{ news.date }}</view>
                    </view>

                    <view v-if="news.cover" class="article__cover">
                        <image class="article__coverImg" :src="news.cover" mode="aspectFill" />
                    </view>

                    <view class="article__lead">{{ news.desc }}</view>

                    <view class="article__body">
                        <view v-for="(p, i) in news.content" :key="i" class="article__para">{{ p }}</view>
                    </view>
                </template>

                <view v-else class="empty">
                    <view class="empty__text">动态不存在或已下线</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import HeaderNav from '@/components/HeaderNav.vue'
import { getNewsById, type NewsItem } from '@/data/recruiterNews'

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)
const news = ref<NewsItem | undefined>(undefined)

onLoad((options) => {
    const id = options?.id || ''
    if (id) news.value = getNewsById(id)
})
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: var(--app-surface, #f5f7fb);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 24rpx 30rpx 44rpx;
    box-sizing: border-box;
}

.article__title {
    font-size: 40rpx;
    font-weight: 900;
    line-height: 1.4;
    color: var(--app-text-primary);
}

.article__meta {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    gap: 18rpx;
}

.article__source {
    font-size: 24rpx;
    font-weight: 700;
    color: var(--app-primary);
}

.article__date {
    font-size: 24rpx;
    color: var(--app-text-muted);
}

.article__cover {
    margin-top: 24rpx;
    width: 100%;
    height: 320rpx;
    border-radius: var(--app-radius-md);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
}

.article__coverImg {
    width: 100%;
    height: 100%;
}

.article__lead {
    margin-top: 24rpx;
    padding: 20rpx 22rpx;
    border-radius: var(--app-radius-md);
    background: rgba(30, 91, 255, 0.06);
    border-left: 6rpx solid var(--app-primary);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.6;
    color: var(--app-text-secondary);
}

.article__body {
    margin-top: 28rpx;
}

.article__para {
    font-size: 30rpx;
    line-height: 1.8;
    color: var(--app-text-primary);
    text-align: justify;
}

.article__para+.article__para {
    margin-top: 24rpx;
}

.empty {
    padding-top: 200rpx;
    display: flex;
    justify-content: center;
}

.empty__text {
    font-size: 28rpx;
    color: var(--app-text-muted);
}
</style>
