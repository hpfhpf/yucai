<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" hover-class="hero__back--pressed" @click="back">
                    <FaIcon name="chevron-left" :size="34" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__role">超级管理员</view>
                    <view class="hero__name">系统总览</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="chart-pie" :size="36" color="#fff" />
                </view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="section__title">角色分布</view>
                <view class="roleGrid">
                    <view v-for="r in roleList" :key="r.role" class="roleCard">
                        <view class="roleCard__head">
                            <view class="roleCard__icon">
                                <FaIcon :name="roleIcon(r.role)" :size="34" color="#1e5bff" />
                            </view>
                            <view class="roleCard__meta">
                                <view class="roleCard__name">{{ roleName(r.role) }}</view>
                                <view class="roleCard__count">{{ r.count }}</view>
                            </view>
                        </view>
                        <view class="roleCard__bar">
                            <view class="roleCard__barFill" :style="{ width: barWidth(r.count) }" />
                        </view>
                    </view>
                </view>

                <view class="section__title">最近注册用户</view>
                <view class="listCard" v-if="recentUsers.length">
                    <view v-for="u in recentUsers" :key="u.id" class="listRow">
                        <view class="listRow__main">
                            <view class="listRow__title">{{ u.nickname || '未设置昵称' }}</view>
                            <view class="listRow__sub">{{ u.phone }}</view>
                        </view>
                        <view class="listRow__side">
                            <view class="tag" :class="`tag--${toneOf(u.role)}`">{{ roleName(u.role) }}</view>
                            <view class="listRow__time">{{ fmt(u.createdAt) }}</view>
                        </view>
                    </view>
                </view>
                <view class="emptyTip" v-else>暂无数据</view>

                <view class="section__title">最新职位</view>
                <view class="listCard" v-if="recentJobs.length">
                    <view v-for="j in recentJobs" :key="j.id" class="listRow">
                        <view class="listRow__main">
                            <view class="listRow__title">{{ j.title }}</view>
                            <view class="listRow__sub">{{ j.company?.name || '未知企业' }}</view>
                        </view>
                        <view class="listRow__side">
                            <view class="tag" :class="`tag--${jobTone(j.status)}`">{{ jobStatus(j.status) }}</view>
                            <view class="listRow__time">{{ fmt(j.createdAt) }}</view>
                        </view>
                    </view>
                </view>
                <view class="emptyTip" v-else>暂无数据</view>

                <view class="tailSpace" />
            </view>
        </scroll-view>

        <AdminNav :active-index="1" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import AdminNav from '@/components/AdminNav/index.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { apiAdminSystemOverview } from '@/api/admin'

const statusBar = ref(uni.getWindowInfo().statusBarHeight || 0)
const roleList = ref<any[]>([])
const recentUsers = ref<any[]>([])
const recentJobs = ref<any[]>([])

const back = () => uni.navigateBack({ fail: () => uni.reLaunch({ url: '/pages/admin/index' }) })

const ROLE_NAME: Record<string, string> = {
    SEEKER: '求职者', RECRUITER: '招聘官', ADMIN: '运营', SUPER_ADMIN: '超管',
}
const ROLE_ICON: Record<string, string> = {
    SEEKER: 'user', RECRUITER: 'user-tie', ADMIN: 'user-gear', SUPER_ADMIN: 'user-shield',
}
const ROLE_TONE: Record<string, string> = {
    SEEKER: 'blue', RECRUITER: 'green', ADMIN: 'orange', SUPER_ADMIN: 'red',
}
const JOB_STATUS: Record<string, string> = {
    ACTIVE: '在招', PENDING: '待审核', CLOSED: '已下架', REJECTED: '已驳回',
}
const JOB_TONE: Record<string, string> = {
    ACTIVE: 'green', PENDING: 'orange', CLOSED: 'muted', REJECTED: 'red',
}

const roleName = (r: string) => ROLE_NAME[r] || r
const roleIcon = (r: string) => ROLE_ICON[r] || 'user'
const toneOf = (r: string) => ROLE_TONE[r] || 'blue'
const jobStatus = (s: string) => JOB_STATUS[s] || s
const jobTone = (s: string) => JOB_TONE[s] || 'muted'

const maxCount = computed(() => Math.max(1, ...roleList.value.map((r) => r.count || 0)))
const barWidth = (c: number) => `${Math.round(((c || 0) / maxCount.value) * 100)}%`

const fmt = (d: string) => {
    if (!d) return ''
    const t = new Date(d)
    if (isNaN(t.getTime())) return d
    const p = (n: number) => String(n).padStart(2, '0')
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`
}

onMounted(async () => {
    try {
        const d: any = await apiAdminSystemOverview()
        roleList.value = d?.roleDistribution || []
        recentUsers.value = d?.recentUsers || []
        recentJobs.value = d?.recentJobs || []
    } catch { /* 统一处理 */ }
})
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';

.hero__back {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
}

.hero__back--pressed { opacity: 0.7; }
.hero__hello { flex: 1; }

.roleGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18rpx;
}

.roleCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 24rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.roleCard__head { display: flex; align-items: center; gap: 16rpx; }

.roleCard__icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 16rpx;
    background: rgba(30, 91, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
}

.roleCard__name { font-size: 24rpx; color: var(--app-text-secondary); }
.roleCard__count { font-size: 40rpx; font-weight: 800; color: var(--app-text-primary); line-height: 1.15; }

.roleCard__bar {
    margin-top: 16rpx;
    height: 12rpx;
    border-radius: 6rpx;
    background: rgba(30, 91, 255, 0.1);
    overflow: hidden;
}

.roleCard__barFill {
    height: 100%;
    border-radius: 6rpx;
    background: linear-gradient(90deg, #4d80f0, #1e5bff);
    transition: width 0.3s;
}

.listCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 4rpx 24rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.listRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
    padding: 24rpx 0;

    & + & { border-top: 1px solid var(--app-line); }
}

.listRow__main { flex: 1; min-width: 0; }
.listRow__title { font-size: 28rpx; font-weight: 600; color: var(--app-text-primary); }
.listRow__sub { font-size: 24rpx; color: var(--app-text-muted); margin-top: 4rpx; }
.listRow__side { display: flex; flex-direction: column; align-items: flex-end; gap: 8rpx; }
.listRow__time { font-size: 22rpx; color: var(--app-text-muted); }

.tag {
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.tag--blue { background: rgba(30, 91, 255, 0.12); color: #1e5bff; }
.tag--green { background: rgba(52, 209, 157, 0.16); color: #22b07d; }
.tag--orange { background: rgba(240, 136, 58, 0.16); color: #f0883a; }
.tag--red { background: rgba(250, 67, 80, 0.14); color: #fa4350; }
.tag--muted { background: rgba(0, 0, 0, 0.08); color: var(--app-text-muted); }

.emptyTip {
    text-align: center;
    color: var(--app-text-muted);
    font-size: 26rpx;
    padding: 40rpx 0;
}
</style>
