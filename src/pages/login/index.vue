<template>
    <view class="page">
        <view class="logo"></view>
        <view class="panel input-box">
            <view class="title">登录</view>
            <wd-input v-model="phone" custom-class="globInput margin-16-a" type="number" :maxlength="11"
                placeholder="请输入手机号" />
            <wd-input v-model="password" custom-class="globInput margin-16-a" show-password
                placeholder="请输入密码" />
            <button class="btn" @click="handleLogin">立即登录</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { apiLogin } from '@/api/index'

const phone = ref('')
const password = ref('')
const redirectUrl = ref('/pages/seeker/index')
const loading = ref(false)

const tabPages = new Set(['/pages/seeker/index', '/pages/mine/index'])

onLoad((options) => {
    const redirect = decodeURIComponent(options?.redirect || '')
    if (redirect) {
        redirectUrl.value = redirect
    }
})

const handleLogin = async () => {
    const p = phone.value.trim()
    const pwd = password.value.trim()
    if (!/^1\d{10}$/.test(p)) {
        uni.showToast({ title: '请输入正确手机号', icon: 'none' })
        return
    }
    if (!pwd) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
    }
    if (loading.value) return
    loading.value = true
    try {
        const res: any = await apiLogin({ phone: p, password: pwd })
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('userInfo', JSON.stringify(res.user))
        const role: string = res.user?.role || 'SEEKER'
        const roleHome: Record<string, string> = {
            RECRUITER: '/pages/recruiter/index',
            ADMIN: '/pages/admin/index',
            SUPER_ADMIN: '/pages/admin/index',
            SEEKER: '/pages/seeker/index',
        }
        const defaultTarget = roleHome[role] || '/pages/seeker/index'
        // 管理端角色始终进入管理首页，忽略求职相关的 redirect
        const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
        const target = isAdmin ? defaultTarget : (redirectUrl.value || defaultTarget)
        const path = target.split('?')[0]
        if (tabPages.has(path)) {
            uni.navigateTo({ url: path as '/pages/seeker/index' | '/pages/mine/index' })
        } else {
            uni.reLaunch({ url: target as any })
        }
    } catch {
        // 错误已由 request.ts 统一弹出
    } finally {
        loading.value = false
    }
}
</script>
<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    align-items: center;
    justify-content: center;
    padding: 0 36rpx;
    background: url('@/assets/images/bg.png') repeat-x center center / contain;
}

.logo {
    margin: 0 auto 24rpx;
    text-align: center;
    background: url('@/assets/images/pins.png') no-repeat center center / contain;
    width: 200rpx;
    height: 200rpx;
}

.panel {
    width: 100%;
    padding: 44rpx 34rpx 64rpx;
    background: var(--app-surface);
    border-radius: var(--app-radius-lg);
    box-shadow: var(--app-shadow-card);
}

.title {
    font-size: 40rpx;
    font-weight: 800;
    color: var(--app-text-primary);
    margin-bottom: 28rpx;
}

.btn {
    margin-top: 30rpx;
    height: 92rpx;
    line-height: 92rpx;
    border-radius: var(--app-radius-pill);
    background: var(--app-primary);
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
}

.btn::after {
    border: 0;
}
</style>
