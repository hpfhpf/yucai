<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" hover-class="hero__back--pressed" @click="back">
                    <FaIcon name="chevron-left" :size="34" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__role">超级管理员</view>
                    <view class="hero__name">权限管理</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="user-shield" :size="36" color="#fff" />
                </view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="noteCard">
                    <FaIcon name="circle-info" :size="32" color="#1e5bff" />
                    <view class="noteCard__text">此页用于管理运营与超管账号权限。超管账号受保护不可操作；运营账号可降级为求职者。</view>
                </view>

                <view class="section__title">管理员账号</view>
                <view class="listCard" v-if="admins.length">
                    <view v-for="a in admins" :key="a.id" class="adminRow">
                        <view class="adminRow__top">
                            <view class="adminRow__main">
                                <view class="adminRow__title">{{ a.nickname || '未设置昵称' }}</view>
                                <view class="adminRow__sub">{{ a.phone }}</view>
                            </view>
                            <view class="tag" :class="a.role === 'SUPER_ADMIN' ? 'tag--red' : 'tag--orange'">
                                {{ roleName(a.role) }}
                            </view>
                        </view>
                        <view class="adminRow__bottom">
                            <view class="adminRow__meta">
                                <view class="dot" :class="a.status === 1 ? 'dot--on' : 'dot--off'" />
                                <text>{{ a.status === 1 ? '正常' : '已禁用' }}</text>
                                <text class="adminRow__time">{{ fmt(a.createdAt) }}</text>
                            </view>
                            <view v-if="a.role === 'ADMIN'" class="btn btn--danger"
                                hover-class="btn--pressed" @click="demote(a)">
                                降为求职者
                            </view>
                        </view>
                    </view>
                </view>
                <view class="emptyTip" v-else>暂无管理员账号</view>

                <view class="tailSpace" />
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { apiAdminListAdmins, apiAdminSetUserRole } from '@/api/admin'

const statusBar = ref(uni.getSystemInfoSync().statusBarHeight || 0)
const admins = ref<any[]>([])

const back = () => uni.navigateBack({ fail: () => uni.reLaunch({ url: '/pages/admin/index' }) })

const ROLE_NAME: Record<string, string> = {
    SEEKER: '求职者', RECRUITER: '招聘官', ADMIN: '运营', SUPER_ADMIN: '超管',
}
const roleName = (r: string) => ROLE_NAME[r] || r

const fmt = (d: string) => {
    if (!d) return ''
    const t = new Date(d)
    if (isNaN(t.getTime())) return d
    const p = (n: number) => String(n).padStart(2, '0')
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`
}

const load = async () => {
    try {
        const d: any = await apiAdminListAdmins()
        admins.value = Array.isArray(d) ? d : (d?.list || [])
    } catch { /* 统一处理 */ }
}

const demote = (a: any) => {
    uni.showModal({
        title: '确认操作',
        content: `确定将「${a.nickname || a.phone}」降为求职者？`,
        confirmColor: '#fa4350',
        success: async (res) => {
            if (!res.confirm) return
            try {
                await apiAdminSetUserRole(a.id, 'SEEKER')
                uni.showToast({ title: '操作成功', icon: 'success' })
                await load()
            } catch {
                uni.showToast({ title: '操作失败', icon: 'none' })
            }
        },
    })
}

onMounted(load)
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

.noteCard {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    background: rgba(30, 91, 255, 0.08);
    border: 1px solid rgba(30, 91, 255, 0.18);
    border-radius: 20rpx;
    padding: 24rpx;
    margin-top: 8rpx;
}

.noteCard__text {
    flex: 1;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-text-secondary);
}

.listCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 4rpx 24rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.adminRow {
    padding: 26rpx 0;

    & + & { border-top: 1px solid var(--app-line); }
}

.adminRow__top { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.adminRow__main { flex: 1; min-width: 0; }
.adminRow__title { font-size: 30rpx; font-weight: 700; color: var(--app-text-primary); }
.adminRow__sub { font-size: 24rpx; color: var(--app-text-muted); margin-top: 4rpx; }

.adminRow__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16rpx;
}

.adminRow__meta {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 24rpx;
    color: var(--app-text-secondary);
}

.adminRow__time { color: var(--app-text-muted); margin-left: 8rpx; }

.dot { width: 14rpx; height: 14rpx; border-radius: 50%; }
.dot--on { background: #34d19d; }
.dot--off { background: rgba(0, 0, 0, 0.24); }

.tag {
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.tag--orange { background: rgba(240, 136, 58, 0.16); color: #f0883a; }
.tag--red { background: rgba(250, 67, 80, 0.14); color: #fa4350; }

.btn {
    padding: 10rpx 24rpx;
    border-radius: 16rpx;
    font-size: 24rpx;
    font-weight: 600;
}

.btn--danger { background: rgba(250, 67, 80, 0.12); color: #fa4350; }
.btn--pressed { opacity: 0.7; }

.emptyTip {
    text-align: center;
    color: var(--app-text-muted);
    font-size: 26rpx;
    padding: 40rpx 0;
}
</style>
