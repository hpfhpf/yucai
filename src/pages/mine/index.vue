<template>
    <view class="page">
        <HeaderNav title="个人中心" type="show-back" theme="FFF" />

        <view v-if="!isLoggedIn" class="profile" @click="handleLoginTap">
            <view class="avatar" />
            <view class="profile__meta">
                <view class="profile__name">未登录/注册</view>
                <view class="profile__hint">点击登录获取更多服务</view>
            </view>
        </view>
        <view v-else class="profile profile__user">
            <view class="info">
                <view class="avatar" />
                <view class="profile__meta_user">
                    <view class="profile__name">{{ userName || '用户' }}</view>
                    <wd-tag v-if="!idVerified" type="warning" round @click="goPageVerification">未认证</wd-tag>
                    <wd-tag v-else type="success" round @click="goPageCertificate">已认证</wd-tag>
                </view>
            </view>
            <view class="document" @click="isRecruiter ? uni.navigateTo({ url: '/pages/recruiter/registration' as any }) : goPageChangePhone()">我的资料</view>
        </view>

        <view class="content">
            <view class="quick">
                <view v-for="item in quickActions" :key="item.key" class="quick__card"
                    @click="handleQuickTap(item.key)">
                    <view class="quick__icon" :class="[`quick__icon--${item.key}`]">
                        <view :class="item.key" />
                    </view>
                    <view class="quick__label">{{ item.label }}</view>
                </view>
            </view>

            <wd-cell-group border custom-class="mine-menu-group">
                <wd-cell v-for="item in menuItems" :key="item.key" :title="item.label" is-link clickable
                    @click="handleMenuTap(item.key)">
                    <template #prefix>
                        <view class="cell-icon" :class="[`cell-icon--${item.key}`]" />
                    </template>
                </wd-cell>
            </wd-cell-group>
        </view>

        <BottomNav :active-index="3" :theme-color="'#0f5bff'" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import BottomNav from '@/components/BottomNav.vue'
import { goPageSubmitted, goPageJobCollection, goPageSetting, goPageCertificate, goPageVerification, goPageChangePhone } from '@/utils/route'

// 同步读取角色，确保在模板渲染前已确定
const _storedInfo = (() => {
    try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} }
})()
const isLoggedIn = ref(Boolean(uni.getStorageSync('token') && _storedInfo.role))
const userName = ref(_storedInfo.nickname || _storedInfo.phone || '')
const isRecruiter = ref(_storedInfo.role === 'RECRUITER')
const idVerified = ref(_storedInfo.idVerified === true)

onMounted(() => {
    // 页面激活时刷新（处理登录状态变化）
    const token = uni.getStorageSync('token')
    const raw = uni.getStorageSync('userInfo')
    if (token && raw) {
        isLoggedIn.value = true
        try {
            const info = JSON.parse(raw)
            userName.value = info.nickname || info.phone || '用户'
            isRecruiter.value = info.role === 'RECRUITER'
        } catch {
            userName.value = '用户'
        }
    }
})

const seekerQuickActions = [
    { key: 'deliver', label: '投递记录' },
    { key: 'favorite', label: '职位收藏' },
    { key: 'referral', label: '推荐记录' },
] as const

const recruiterQuickActions = [
    { key: 'postJob', label: '发布职位' },
    { key: 'resumeCenter', label: '简历中心' },
    { key: 'myJobs', label: '我的职位' },
] as const

const seekerMenuItems = [
    { key: 'interview', label: '面试须知' },
    { key: 'credit', label: '信用异议' },
    { key: 'setting', label: '设置' },
    { key: 'feedback', label: '意见反馈' },
] as const

const recruiterMenuItems = [
    { key: 'setting', label: '设置' },
    { key: 'feedback', label: '意见反馈' },
] as const

// 直接用同步读到的角色决定，不依赖响应式延迟
const quickActions = isRecruiter.value ? recruiterQuickActions : seekerQuickActions
const menuItems = isRecruiter.value ? recruiterMenuItems : seekerMenuItems

type QuickKey = string
type MenuKey = string

const handleLoginTap = () => {
    uni.navigateTo({ url: '/pages/login/index' as any })
}

const handleQuickTap = (key: QuickKey) => {
    if (isRecruiter.value) {
        if (key === 'postJob') uni.navigateTo({ url: '/pages/recruiter/jobPosting' as any })
        else if (key === 'resumeCenter') uni.navigateTo({ url: '/pages/recruiter/resumeCenter' as any })
        else if (key === 'myJobs') uni.navigateTo({ url: '/pages/recruiter/myJobs' as any })
        else uni.showToast({ title: '功能开发中', icon: 'none' })
    } else {
        if (key === 'deliver') goPageSubmitted()
        else if (key === 'favorite') goPageJobCollection()
        else if (key === 'referral') uni.navigateTo({ url: '/pages/mine/referralHistory' as any })
        else uni.showToast({ title: '功能开发中', icon: 'none' })
    }
}

const handleMenuTap = (key: MenuKey) => {
    if (key === 'setting') goPageSetting()
}
</script>

<style scoped lang="scss">
:root {
    --mine-bg: #eef3ff;
    --mine-card: rgba(255, 255, 255, 0.92);
    --mine-text: #0f172a;
    --mine-sub: rgba(15, 23, 42, 0.6);
    --mine-line: rgba(15, 23, 42, 0.08);
    --mine-shadow: 0 14rpx 42rpx rgba(13, 39, 112, 0.16);
    --mine-shadow-soft: 0 10rpx 30rpx rgba(13, 39, 112, 0.12);
}

.page {
    min-height: 100vh;
    background: url('@/assets/images/bg.png') repeat-x center center / contain;
}

.profile {
    margin-top: 44rpx;
    padding: 0 44rpx;
    display: flex;
    align-items: center;
    gap: 22rpx;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: #FFF url('@/assets/images/avatar.png') no-repeat center center / contain;
    border: 4rpx solid rgba(255, 255, 255, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10rpx 28rpx rgba(1, 18, 74, 0.18);
}

.profile__meta {
    display: flex;
    flex-direction: column;
}

.profile__meta_user {
    margin-left: 24rpx;
}

.profile__name {
    color: rgba(255, 255, 255, 0.94);
    font-size: 36rpx;
    font-weight: 400;
    margin-bottom: 8rpx;
}

.profile__hint {
    color: rgba(255, 255, 255, 0.74);
    font-size: 24rpx;
}

.profile__user {
    justify-content: space-between;

    .info {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .profile__meta {
            margin-left: 16rpx;
        }
    }

    .document {
        background-color: rgba(255, 255, 255, 0.1);
        font-size: 28rpx;
        color: #FFF;
        padding: 16rpx 52rpx 16rpx 24rpx;
        border-radius: 32rpx;
        text-align: center;
        position: relative;

        &::after {
            content: '';
            background: url('@/assets/images/arrow-write.png') no-repeat center center / contain;
            width: 42rpx;
            height: 42rpx;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 12rpx;
        }
    }
}

.content {
    position: relative;
    margin-top: 36rpx;
    padding: 0 26rpx 40rpx;
}

.quick {
    display: flex;
    gap: 22rpx;
}

.quick__card {
    flex: 1;
    height: 132rpx;
    border-radius: 22rpx;
    background: #FFF;
    box-shadow: var(--mine-shadow);
    display: flex;
    align-items: center;
    gap: 18rpx;
    padding: 0 26rpx;
    backdrop-filter: blur(14rpx);
}

.quick__icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(53, 116, 233, 0.16), rgba(19, 131, 229, 0.1));

    .deliver {
        background: url('@/assets/images/deliver.png') no-repeat center center / contain;
        width: 50rpx;
        height: 50rpx;
    }

    .favorite {
        background: url('@/assets/images/favorite.png') no-repeat center center / contain;
        width: 50rpx;
        height: 50rpx;
    }
}

.quick__icon--favorite {
    background: linear-gradient(180deg, rgba(255, 196, 0, 0.16), rgba(255, 153, 0, 0.1));
}

.quick__label {
    color: var(--mine-text);
    font-size: 28rpx;
    font-weight: 600;
}

.cell-icon {
    width: 40rpx;
    height: 40rpx;
    border-radius: 8rpx;
    margin-right: 12rpx;
    background: url('@/assets/images/interview.png') no-repeat center center / contain;
}

.cell-icon--setting {
    background: url('@/assets/images/setting.png') no-repeat center center / contain;
}

.cell-icon--credit {
    background: url('@/assets/images/credit.png') no-repeat center center / contain;
}

.cell-icon--feedback {
    background: url('@/assets/images/feedback.png') no-repeat center center / contain;
}
</style>
