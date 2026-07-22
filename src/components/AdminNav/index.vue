<template>
    <view class="adminNav" :style="{ paddingBottom: `${safeBottom}px` }">
        <view class="adminNav__inner">
            <view v-for="(item, idx) in items" :key="item.key" class="adminNav__item"
                :class="{ 'adminNav__item--active': idx === activeIndex }" @click="handleTap(item, idx)">
                <FaIcon :name="item.icon" :size="44" :color="idx === activeIndex ? '#1e5bff' : 'rgba(0,0,0,0.36)'" />
                <view class="adminNav__label">{{ item.label }}</view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'

type NavItem = { key: string; label: string; icon: string; path: string }

const props = withDefaults(
    defineProps<{ activeIndex?: number; activeKey?: string }>(),
    { activeIndex: -1, activeKey: '' }
)

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

const userInfo = (() => {
    try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} }
})()
const isSuper = userInfo?.role === 'SUPER_ADMIN'

const baseItems: NavItem[] = [
    { key: 'workbench', label: '工作台', icon: 'gauge-high', path: '/pages/admin/index' },
    { key: 'users', label: '用户', icon: 'users', path: '/pages/admin/users' },
    { key: 'companies', label: '企业', icon: 'building', path: '/pages/admin/companies' },
    { key: 'mine', label: '我的', icon: 'circle-user', path: '/pages/mine/index' },
]

const superItems: NavItem[] = [
    { key: 'workbench', label: '工作台', icon: 'gauge-high', path: '/pages/admin/index' },
    { key: 'system', label: '系统', icon: 'chart-pie', path: '/pages/admin/system' },
    { key: 'users', label: '用户', icon: 'users', path: '/pages/admin/users' },
    { key: 'mine', label: '我的', icon: 'circle-user', path: '/pages/mine/index' },
]

const items = isSuper ? superItems : baseItems

const activeIndex = computed(() => {
    if (props.activeKey) {
        const i = items.findIndex(it => it.key === props.activeKey)
        if (i >= 0) return i
    }
    return props.activeIndex
})

const handleTap = (item: NavItem, idx: number) => {
    if (idx === activeIndex.value) return
    uni.reLaunch({ url: item.path as any })
}
</script>

<style scoped lang="scss">
.adminNav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(18rpx);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 -6rpx 24rpx rgba(30, 60, 140, 0.06);
}

.adminNav__inner {
    height: 116rpx;
    padding: 8rpx 18rpx 0;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.adminNav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    color: rgba(0, 0, 0, 0.4);
}

.adminNav__item--active {
    color: #1e5bff;
}

.adminNav__label {
    font-size: 22rpx;
    line-height: 1;
    font-weight: 600;
}
</style>
