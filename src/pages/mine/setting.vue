<template>
    <view class="page">
        <HeaderNav title="设置" type="show-back" theme="000" />

        <view class="content">
            <wd-cell-group border custom-class="mine-menu-group">
                <wd-cell v-for="item in items" :key="item.key" :title="item.label" :value="item.value || ''" is-link
                    clickable @click="handleRowTap(item.key)" />
            </wd-cell-group>

            <wd-button type="danger" plain block custom-class="logout-btn" @click="handleLogout">
                退出登录
            </wd-button>
        </view>

        <wd-dialog selector="logoutDialog" />
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { useDialog } from '@wot-ui/ui/composables'

const { confirm } = useDialog('logoutDialog')

const userName = ref('Mr_Leng')
const phone = ref('13319197788')

type SettingItem = {
    key: 'username' | 'phone' | 'password' | 'about'
    label: string
    value?: string
}

const items = computed<SettingItem[]>(() => [
    { key: 'username', label: '用户名', value: userName.value },
    { key: 'phone', label: '手机号', value: phone.value },
    { key: 'password', label: '修改密码' },
    { key: 'about', label: '关于我们' },
])

type ItemKey = SettingItem['key']

const handleRowTap = (key: ItemKey) => {
    if (key === 'about') {
        uni.navigateTo({ url: '/pages/mine/about' as any })
        return
    }
    if (key === 'phone') {
        uni.setClipboardData({
            data: phone.value,
            success: () => uni.showToast({ title: '手机号已复制', icon: 'none' }),
            fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
        })
        return
    }
    const titleMap: Record<ItemKey, string> = {
        username: '用户名',
        phone: '手机号',
        password: '修改密码',
        about: '关于我们',
    }
    uni.showToast({ title: titleMap[key], icon: 'none' })
}

const handleLogout = async () => {
    try {
        await confirm({
            title: '提示',
            msg: '确认退出登录？',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
        })
        try {
            uni.removeStorageSync('token')
        } catch (_) { }
        uni.showToast({ title: '已退出登录', icon: 'none' })
        uni.navigateTo({ url: '/pages/mine/index' })
    } catch (_) { }
}
</script>

<style lang="scss">
.logout-btn {
    margin-top: 24rpx;
    height: 112rpx;
    font-weight: 600;
}
</style>
<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content {
    position: relative;
    padding: 0 26rpx 44rpx;
}

.setting-group {
    border-radius: var(--app-radius-lg);
    overflow: hidden;
    box-shadow: var(--app-shadow-card);
}
</style>
