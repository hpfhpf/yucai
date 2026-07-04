<template>
    <view class="page">
        <HeaderNav title="关于我们" type="show-back" theme="000" />

        <scroll-view scroll-y class="content">
            <!-- 品牌 Hero 区 -->
            <view class="brand-hero">
                <view class="brand-logo">
                    <text class="logo-text">育才</text>
                </view>
                <view class="brand-name">育才 HR</view>
                <view class="brand-slogan">连接人才与机会，成就职业梦想</view>
                <view class="brand-version">版本 v1.0.0</view>
            </view>

            <!-- 平台介绍 -->
            <view class="section-card">
                <view class="card-title">平台介绍</view>
                <view class="card-text">
                    育才 HR 是专注于招聘行业的移动端招聘平台，致力于为求职者提供优质的职位匹配服务，为企业提供高效的人才招募工具。我们以诚信、专业、高效为核心价值，持续优化求职招聘体验。
                </view>
            </view>

            <!-- 核心数据 -->
            <view class="stats-row">
                <view v-for="stat in stats" :key="stat.label" class="stat-item">
                    <text class="stat-value">{{ stat.value }}</text>
                    <text class="stat-label">{{ stat.label }}</text>
                </view>
            </view>

            <!-- 我们的优势 -->
            <view class="section-card">
                <view class="card-title">我们的优势</view>
                <view class="feature-list">
                    <view v-for="f in features" :key="f.title" class="feature-item">
                        <view class="feature-icon" :style="{ background: f.bg }">
                            <wd-icon :name="f.icon" size="32rpx" color="#fff" />
                        </view>
                        <view class="feature-content">
                            <text class="feature-title">{{ f.title }}</text>
                            <text class="feature-desc">{{ f.desc }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 联系我们 -->
            <view class="section-card contact-card">
                <view class="card-title">联系我们</view>
                <view class="contact-list">
                    <view v-for="c in contacts" :key="c.label" class="contact-item">
                        <wd-icon :name="c.icon" size="30rpx" color="#1e5bff" />
                        <text class="contact-label">{{ c.label }}</text>
                        <text class="contact-value">{{ c.value }}</text>
                    </view>
                </view>
            </view>

            <!-- 法律信息 -->
            <view class="legal-row">
                <text @click="navToUrl('privacy')">隐私政策</text>
                <text class="sep">|</text>
                <text @click="navToUrl('terms')">用户协议</text>
            </view>

            <view class="copyright">© 2024 育才 HR 版权所有</view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'

const stats = [
    { value: '10万+', label: '注册用户' },
    { value: '5000+', label: '合作企业' },
    { value: '50万+', label: '职位信息' }
]

const features = [
    { icon: 'shield-check-filled', bg: '#1e5bff', title: '实名认证', desc: '全面的身份认证体系，保障信息真实可信' },
    { icon: 'star-filled', bg: '#10b981', title: '精准匹配', desc: '智能算法精准推荐，高效完成人岗匹配' },
    { icon: 'chat', bg: '#f59e0b', title: '在线沟通', desc: '求职招聘双向沟通，随时随地洽谈机会' },
    { icon: 'lock-on-filled', bg: '#8b5cf6', title: '信息安全', desc: '严格的数据保护机制，您的信息安全无忧' }
]

const contacts = [
    { icon: 'mail', label: '商务合作', value: 'hr@yucai.com' },
    { icon: 'chat', label: '在线客服', value: '工作日 9:00-18:00' },
    { icon: 'mobile', label: '客服热线', value: '400-000-0000' }
]

const navToUrl = (type: string) => {
    uni.showToast({ title: `${type === 'privacy' ? '隐私政策' : '用户协议'}即将上线`, icon: 'none' })
}
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content { flex: 1; padding: 32rpx; }

// 品牌区
.brand-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48rpx 0 56rpx;
    gap: 12rpx;
}
.brand-logo {
    width: 136rpx;
    height: 136rpx;
    border-radius: 36rpx;
    background: linear-gradient(135deg, #4a7fff, #1e5bff);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(30, 91, 255, 0.32);
    margin-bottom: 8rpx;
}
.logo-text {
    font-size: 44rpx;
    font-weight: 700;
    color: #fff;
}
.brand-name { font-size: 40rpx; font-weight: 700; color: rgba(0,0,0,.88); }
.brand-slogan { font-size: 26rpx; color: rgba(0,0,0,.5); }
.brand-version { font-size: 23rpx; color: rgba(0,0,0,.3); margin-top: 8rpx; }

// 卡片
.section-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,.04);
}
.card-title { font-size: 30rpx; font-weight: 600; color: rgba(0,0,0,.88); margin-bottom: 20rpx; }
.card-text { font-size: 26rpx; color: rgba(0,0,0,.56); line-height: 1.8; }

// 统计行
.stats-row {
    display: flex;
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,.04);
}
.stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    &:not(:last-child) { border-right: 1rpx solid rgba(0,0,0,.06); }
}
.stat-value { font-size: 36rpx; font-weight: 700; color: #1e5bff; }
.stat-label { font-size: 24rpx; color: rgba(0,0,0,.5); }

// 优势列表
.feature-list { display: flex; flex-direction: column; gap: 28rpx; }
.feature-item { display: flex; align-items: center; gap: 24rpx; }
.feature-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.feature-content { display: flex; flex-direction: column; gap: 6rpx; }
.feature-title { font-size: 28rpx; font-weight: 600; color: rgba(0,0,0,.8); }
.feature-desc { font-size: 25rpx; color: rgba(0,0,0,.5); line-height: 1.6; }

// 联系我们
.contact-list { display: flex; flex-direction: column; }
.contact-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 20rpx 0;
    border-bottom: 1rpx solid rgba(0,0,0,.04);
    &:last-child { border-bottom: none; }
}
.contact-label { font-size: 28rpx; color: rgba(0,0,0,.7); flex: 1; margin-left: 4rpx; }
.contact-value { font-size: 26rpx; color: rgba(0,0,0,.5); }

// 法律 & 版权
.legal-row {
    display: flex;
    justify-content: center;
    gap: 16rpx;
    font-size: 24rpx;
    color: #1e5bff;
    padding: 24rpx 0 16rpx;
    .sep { color: rgba(0,0,0,.2); }
}
.copyright { text-align: center; font-size: 22rpx; color: rgba(0,0,0,.3); padding-bottom: 64rpx; }
</style>
