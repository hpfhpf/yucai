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
                <view class="avatar" :class="{ 'avatar--fa': avatarParsed.type === 'fa' }"
                    :style="avatarStyle" @click="openAvatarPicker">
                    <FaIcon v-if="avatarParsed.type === 'fa'" :name="avatarParsed.icon" :size="64" color="#fff" />
                    <image v-else-if="avatarParsed.type === 'image'" class="avatar__img" :src="avatarParsed.url"
                        mode="aspectFill" />
                    <view class="avatar__edit">
                        <FaIcon name="camera" :size="20" color="#fff" />
                    </view>
                </view>
                <view class="profile__meta_user">
                    <view class="profile__name">{{ userName || '用户' }}</view>
                    <wd-tag v-if="!idVerified" type="warning" round @click="goPageVerification">未认证</wd-tag>
                    <wd-tag v-else type="success" round @click="goPageCertificate">已认证</wd-tag>
                </view>
            </view>
            <view class="document" @click="isRecruiter ? uni.navigateTo({ url: '/pages/recruiter/registration' as any }) : goPageChangePhone()">
                <text>我的资料</text>
                <FaIcon name="chevron-right" :size="22" color="rgba(255,255,255,0.9)" style="margin-left: 8rpx" />
            </view>
        </view>

        <view class="content">
            <view class="quick">
                <view v-for="item in quickActions" :key="item.key" class="quick__card"
                    @click="handleQuickTap(item.key)">
                    <view class="quick__icon" :class="[`quick__icon--${item.key}`]">
                        <FaIcon :name="quickIcon(item.key)" :size="42" color="#1e5bff" />
                    </view>
                    <view class="quick__label">{{ item.label }}</view>
                </view>
            </view>

            <wd-cell-group border custom-class="mine-menu-group">
                <wd-cell v-for="item in menuItems" :key="item.key" :title="item.label" is-link clickable
                    @click="handleMenuTap(item.key)">
                    <template #prefix>
                        <view class="cell-icon">
                            <FaIcon :name="menuIcon(item.key)" :size="34" color="#1e5bff" fixed-width />
                        </view>
                    </template>
                </wd-cell>
            </wd-cell-group>
        </view>

        <AdminNav v-if="isAdmin" :active-index="3" />
        <BottomNav v-else :active-index="3" :theme-color="'#0f5bff'" />

        <AvatarPicker v-model="avatarPickerShown" :current="avatarParsed.icon" :saving="avatarSaving"
            @confirm="handleAvatarConfirm" />
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import BottomNav from '@/components/BottomNav.vue'
import AdminNav from '@/components/AdminNav/index.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import AvatarPicker from '@/components/AvatarPicker/index.vue'
import { goPageSubmitted, goPageJobCollection, goPageSetting, goPageCertificate, goPageVerification, goPageChangePhone } from '@/utils/route'
import { parseAvatar, toAvatarValue } from '@/utils/avatar'
import { apiUpdateUserMe } from '@/api'

// 同步读取角色，确保在模板渲染前已确定
const _storedInfo = (() => {
    try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} }
})()
const isLoggedIn = ref(Boolean(uni.getStorageSync('token') && _storedInfo.role))
const userName = ref(_storedInfo.nickname || _storedInfo.phone || '')
const isRecruiter = ref(_storedInfo.role === 'RECRUITER')
const role = ref<string>(_storedInfo.role || 'SEEKER')
const isAdmin = ref(role.value === 'ADMIN' || role.value === 'SUPER_ADMIN')
const isSuper = ref(role.value === 'SUPER_ADMIN')
const idVerified = ref(_storedInfo.idVerified === true)

// 头像状态
const avatarUrl = ref<string>(_storedInfo.avatarUrl || '')
const avatarParsed = computed(() => parseAvatar(avatarUrl.value))
const avatarStyle = computed(() =>
    avatarParsed.value.type === 'fa'
        ? { background: avatarParsed.value.bg }
        : {}
)
const avatarPickerShown = ref(false)
const avatarSaving = ref(false)

const openAvatarPicker = () => {
    avatarPickerShown.value = true
}

const handleAvatarConfirm = async (icon: string) => {
    const value = toAvatarValue(icon)
    avatarSaving.value = true
    try {
        await apiUpdateUserMe({ avatarUrl: value })
        avatarUrl.value = value
        // 同步本地缓存
        try {
            const info = JSON.parse(uni.getStorageSync('userInfo') || '{}')
            info.avatarUrl = value
            uni.setStorageSync('userInfo', JSON.stringify(info))
        } catch { /* ignore */ }
        avatarPickerShown.value = false
        uni.showToast({ title: '头像已更新', icon: 'success' })
    } catch (e: any) {
        uni.showToast({ title: e?.message || '更新失败', icon: 'none' })
    } finally {
        avatarSaving.value = false
    }
}

onMounted(() => {
    // 页面激活时刷新（处理登录状态变化）
    const token = uni.getStorageSync('token')
    const raw = uni.getStorageSync('userInfo')
    if (token && raw) {
        isLoggedIn.value = true
        try {
            const info = JSON.parse(raw)
            userName.value = info.nickname || info.phone || '用户'
            avatarUrl.value = info.avatarUrl || ''
            isRecruiter.value = info.role === 'RECRUITER'
            role.value = info.role || 'SEEKER'
            isAdmin.value = role.value === 'ADMIN' || role.value === 'SUPER_ADMIN'
            isSuper.value = role.value === 'SUPER_ADMIN'
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

const adminQuickActions = [
    { key: 'workbench', label: '工作台' },
    { key: 'users', label: '用户管理' },
    { key: 'companies', label: '企业审核' },
] as const

const adminMenuItems = [
    { key: 'setting', label: '设置' },
    { key: 'feedback', label: '意见反馈' },
] as const

// 直接用同步读到的角色决定，不依赖响应式延迟
const quickActions = isAdmin.value ? adminQuickActions : (isRecruiter.value ? recruiterQuickActions : seekerQuickActions)
const menuItems = isAdmin.value ? adminMenuItems : (isRecruiter.value ? recruiterMenuItems : seekerMenuItems)

type QuickKey = string
type MenuKey = string

const handleLoginTap = () => {
    uni.navigateTo({ url: '/pages/login/index' as any })
}

const handleQuickTap = (key: QuickKey) => {
    if (isAdmin.value) {
        if (key === 'workbench') uni.reLaunch({ url: '/pages/admin/index' as any })
        else if (key === 'users') uni.navigateTo({ url: '/pages/admin/users' as any })
        else if (key === 'companies') uni.navigateTo({ url: '/pages/admin/companies' as any })
        else uni.showToast({ title: '功能开发中', icon: 'none' })
    } else if (isRecruiter.value) {
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
    else if (key === 'interview') uni.navigateTo({ url: '/pages/mine/interview' as any })
    else if (key === 'credit') uni.navigateTo({ url: '/pages/mine/credit' as any })
    else if (key === 'feedback') uni.navigateTo({ url: '/pages/mine/feedback' as any })
}

// 图标映射（font-awesome）
const quickIconMap: Record<string, string> = {
    deliver: 'paper-plane', favorite: 'heart', referral: 'share-nodes',
    postJob: 'circle-plus', resumeCenter: 'folder-open', myJobs: 'briefcase',
    workbench: 'gauge-high', users: 'users-gear', companies: 'building-shield',
}
const menuIconMap: Record<string, string> = {
    interview: 'circle-info', credit: 'scale-balanced',
    setting: 'gear', feedback: 'comment-dots',
}
const quickIcon = (key: string) => quickIconMap[key] || 'circle'
const menuIcon = (key: string) => menuIconMap[key] || 'circle'
</script>

<style lang="scss">
.mine-menu-group {
    border-radius: var(--app-radius-lg);
    overflow: hidden;
    box-shadow: var(--app-shadow-card);
}
</style>
<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background:
        url('@/assets/images/bg.png') repeat-x top center / contain,
        linear-gradient(180deg, #1e5bff 0%, #2a67ff 240rpx, var(--app-bg) 520rpx, var(--app-bg) 100%);
}

.profile {
    margin-top: 48rpx;
    padding: 0 44rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    transition: opacity var(--app-timing-fast) var(--app-ease-standard);

    &:active {
        opacity: 0.85;
    }
}

.avatar {
    position: relative;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: #FFF url('@/assets/images/avatar.png') no-repeat center center / contain;
    border: 4rpx solid rgba(255, 255, 255, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10rpx 28rpx rgba(1, 18, 74, 0.18);
    transition: transform var(--app-timing-fast) var(--app-ease-standard);

    &:active {
        transform: scale(0.94);
    }
}

.avatar--fa {
    background-image: none;
}

.avatar__img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.avatar__edit {
    position: absolute;
    right: -2rpx;
    bottom: -2rpx;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #1e5bff;
    border: 3rpx solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.profile__meta {
    display: flex;
    flex-direction: column;
}

.profile__meta_user {
    margin-left: 24rpx;
}

.profile__name {
    color: rgba(255, 255, 255, 0.96);
    font-size: 38rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
    letter-spacing: 0.5rpx;
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
        background-color: rgba(255, 255, 255, 0.16);
        font-size: 28rpx;
        color: #FFF;
        padding: 16rpx 26rpx;
        border-radius: var(--app-radius-pill);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--app-timing-fast) var(--app-ease-standard);

        &:active {
            background-color: rgba(255, 255, 255, 0.28);
        }
    }
}

.content {
    position: relative;
    margin-top: 40rpx;
    padding: 0 26rpx 40rpx;
}

.quick {
    display: flex;
    gap: 20rpx;
    margin-bottom: 26rpx;
}

.quick__card {
    flex: 1;
    height: 148rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    box-shadow: var(--app-shadow-card);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    padding: 0 12rpx;
    transition: transform var(--app-timing-fast) var(--app-ease-standard);

    &:active {
        transform: scale(0.96);
    }
}

.quick__icon {
    width: 76rpx;
    height: 76rpx;
    border-radius: var(--app-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.14), rgba(30, 91, 255, 0.06));
}

.quick__icon--favorite {
    background: linear-gradient(180deg, rgba(255, 122, 0, 0.16), rgba(255, 122, 0, 0.06));
}

.quick__label {
    color: var(--app-text-primary);
    font-size: 26rpx;
    font-weight: 600;
}

.cell-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
