<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__hello">
                    <view class="hero__role">{{ isSuper ? '超级管理员' : '运营工作台' }}</view>
                    <view class="hero__name">{{ userName }}，欢迎回来</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon :name="isSuper ? 'user-shield' : 'user-gear'" :size="40" color="#fff" />
                </view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="statGrid">
                    <view v-for="s in stats" :key="s.key" class="statCard" :class="`statCard--${s.tone}`">
                        <view class="statCard__icon">
                            <FaIcon :name="s.icon" :size="36" :color="s.color" />
                        </view>
                        <view class="statCard__num">{{ s.value }}</view>
                        <view class="statCard__label">{{ s.label }}</view>
                    </view>
                </view>

                <view class="section__title">管理功能</view>
                <view class="entryGrid">
                    <view v-for="e in entries" :key="e.key" class="entryCard" hover-class="entryCard--pressed"
                        @click="go(e.path)">
                        <view class="entryCard__icon" :style="{ background: e.bg }">
                            <FaIcon :name="e.icon" :size="40" color="#fff" />
                        </view>
                        <view class="entryCard__label">{{ e.label }}</view>
                        <view class="entryCard__desc">{{ e.desc }}</view>
                    </view>
                </view>

                <view class="section__title">待处理</view>
                <view class="todoCard">
                    <view class="todoRow" @click="go('/pages/admin/idVerify')">
                        <FaIcon name="id-card" :size="36" color="#1e5bff" fixed-width />
                        <view class="todoRow__text">实名认证待审核</view>
                        <view class="todoRow__badge" :class="{ 'todoRow__badge--zero': !pending.idVerify }">
                            {{ pending.idVerify }}
                        </view>
                        <FaIcon name="chevron-right" :size="24" color="rgba(0,0,0,0.24)" />
                    </view>
                    <view class="todoRow" @click="go('/pages/admin/companies')">
                        <FaIcon name="building-circle-check" :size="36" color="#f0883a" fixed-width />
                        <view class="todoRow__text">待认证企业</view>
                        <view class="todoRow__badge" :class="{ 'todoRow__badge--zero': !companyUnverified }">
                            {{ companyUnverified }}
                        </view>
                        <FaIcon name="chevron-right" :size="24" color="rgba(0,0,0,0.24)" />
                    </view>
                </view>
                <view class="tailSpace" />
            </view>
        </scroll-view>

        <AdminNav :active-index="0" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminNav from '@/components/AdminNav/index.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { apiAdminDashboard } from '@/api/admin'

const statusBar = ref(uni.getSystemInfoSync().statusBarHeight || 0)
const userInfo = (() => { try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} } })()
const isSuper = userInfo?.role === 'SUPER_ADMIN'
const userName = ref(userInfo?.nickname || '管理员')

const dashboardLoading = ref(false)
const companyUnverified = ref(0)
const pending = ref({ cert: 0, idVerify: 0 })
const stats = ref<any[]>([
    { key: 'users', label: '用户总数', value: '-', icon: 'users', tone: 'blue', color: '#1e5bff' },
    { key: 'companies', label: '企业总数', value: '-', icon: 'building', tone: 'orange', color: '#f0883a' },
    { key: 'jobs', label: '在招职位', value: '-', icon: 'briefcase', tone: 'green', color: '#34d19d' },
    { key: 'deliveries', label: '投递总数', value: '-', icon: 'paper-plane', tone: 'purple', color: '#7c5cff' },
])

const baseEntries = [
    { key: 'users', label: '用户管理', desc: '账号与状态', icon: 'users-gear', bg: 'linear-gradient(135deg,#4d80f0,#1e5bff)', path: '/pages/admin/users' },
    { key: 'companies', label: '企业审核', desc: '认证与信用', icon: 'building-shield', bg: 'linear-gradient(135deg,#ffb347,#f0883a)', path: '/pages/admin/companies' },
    { key: 'jobs', label: '职位管理', desc: '上下架审核', icon: 'briefcase', bg: 'linear-gradient(135deg,#43d9a3,#22b07d)', path: '/pages/admin/jobs' },
    { key: 'idVerify', label: '实名审核', desc: '身份核验', icon: 'id-card', bg: 'linear-gradient(135deg,#8f7bff,#6a4bff)', path: '/pages/admin/idVerify' },
]
const superEntries = [
    { key: 'system', label: '系统总览', desc: '角色分布', icon: 'chart-pie', bg: 'linear-gradient(135deg,#ff6a8b,#ff4350)', path: '/pages/admin/system' },
    { key: 'admins', label: '权限管理', desc: '管理员账号', icon: 'user-shield', bg: 'linear-gradient(135deg,#2dd4bf,#0ea5a3)', path: '/pages/admin/admins' },
]
const entries = isSuper ? [...baseEntries, ...superEntries] : baseEntries

const go = (path: string) => uni.navigateTo({ url: path as any })

const fetchDashboard = async () => {
    dashboardLoading.value = true
    try {
        const d: any = await apiAdminDashboard()
        stats.value[0].value = d.users.total
        stats.value[1].value = d.companies.total
        stats.value[2].value = d.jobs.active
        stats.value[3].value = d.deliveries.total
        companyUnverified.value = d.companies.unverified
        pending.value = d.pending
    } catch (e: any) {
        uni.showToast({ title: '数据加载失败，请下拉刷新', icon: 'none', duration: 2000 })
    } finally {
        dashboardLoading.value = false
    }
}

onMounted(() => fetchDashboard())
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';
</style>
