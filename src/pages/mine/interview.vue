<template>
    <view class="page">
        <HeaderNav title="面试须知" type="show-back" theme="000" />

        <view class="content">
            <view v-for="(group, gi) in guideGroups" :key="gi" class="guide-card">
                <view class="guide-header">
                    <view class="guide-icon" :style="{ background: group.color }">
                        <wd-icon :name="group.icon" size="32rpx" color="#fff" />
                    </view>
                    <text class="guide-title">{{ group.title }}</text>
                </view>
                <view class="guide-list">
                    <view v-for="(item, ii) in group.items" :key="ii" class="guide-item">
                        <view class="item-dot" :style="{ background: group.color }" />
                        <view class="item-text">
                            <text class="item-main">{{ item.main }}</text>
                            <text v-if="item.sub" class="item-sub">{{ item.sub }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="tip-banner">
                <wd-icon name="warning-circle-filled" size="30rpx" color="#f59e0b" />
                <text>请警惕任何以入职为名收取费用、押金、培训费的行为，正规企业招聘不会收取任何费用。</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'

const guideGroups = [
    {
        title: '面试前准备',
        icon: 'file-paper',
        color: '#1e5bff',
        items: [
            { main: '了解公司背景', sub: '提前查询企业信息、主营业务及岗位要求' },
            { main: '准备自我介绍', sub: '梳理个人经历，突出与岗位匹配的能力' },
            { main: '确认面试信息', sub: '核对面试时间、地点或线上会议链接' },
            { main: '准备相关材料', sub: '简历、证书、作品集等纸质或电子版本' }
        ]
    },
    {
        title: '面试中表现',
        icon: 'user',
        color: '#10b981',
        items: [
            { main: '着装得体', sub: '根据岗位性质选择合适的商务或休闲装扮' },
            { main: '守时守信', sub: '提前10-15分钟到达，避免迟到' },
            { main: '真诚沟通', sub: '如实回答问题，展现真实的自己' },
            { main: '主动提问', sub: '就岗位职责、发展空间等提出有价值的问题' }
        ]
    },
    {
        title: '面试后跟进',
        icon: 'chat',
        color: '#f59e0b',
        items: [
            { main: '及时反馈', sub: '面试后可发送感谢信，表达诚意' },
            { main: '耐心等待', sub: '一般1-2周内会收到结果通知' },
            { main: '理性看待', sub: '未通过也是积累经验，继续寻找合适机会' }
        ]
    }
]
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content {
    flex: 1;
    padding: 32rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.guide-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.guide-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 28rpx;
}

.guide-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.guide-title {
    font-size: 32rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
}

.guide-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.guide-item {
    display: flex;
    gap: 16rpx;
}

.item-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    margin-top: 12rpx;
    flex-shrink: 0;
}

.item-text {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
}

.item-main {
    font-size: 28rpx;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
}

.item-sub {
    font-size: 25rpx;
    color: rgba(0, 0, 0, 0.5);
    line-height: 1.6;
}

.tip-banner {
    display: flex;
    gap: 12rpx;
    align-items: flex-start;
    background: rgba(245, 158, 11, 0.08);
    border-radius: 20rpx;
    padding: 24rpx;
    font-size: 25rpx;
    color: #b45309;
    line-height: 1.7;
    margin-bottom: 48rpx;
}
</style>
