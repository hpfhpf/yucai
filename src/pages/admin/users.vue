<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" @click="goBack">
                    <FaIcon name="chevron-left" :size="36" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__name">用户管理</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="users" :size="36" color="#fff" />
                </view>
            </view>
            <view class="uSearch">
                <wd-input v-model="keyword" placeholder="搜索手机号 / 昵称" custom-class="uSearch__input"
                    :no-border="true" confirm-type="search" @confirm="onSearch" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y @scrolltolower="loadMore">
            <view class="content">
                <view class="uTabs">
                    <view v-for="t in roleTabs" :key="t.value" class="uTabs__item"
                        :class="{ 'uTabs__item--on': role === t.value }" @click="switchRole(t.value)">
                        {{ t.label }}
                    </view>
                </view>

                <view v-for="u in list" :key="u.id" class="uCard">
                    <view class="uCard__avatar">
                        <image v-if="u.avatarUrl" class="uCard__img" :src="u.avatarUrl" mode="aspectFill" />
                        <FaIcon v-else name="circle-user" :size="72" color="#c4ccda" />
                    </view>
                    <view class="uCard__main">
                        <view class="uCard__top">
                            <text class="uCard__name">{{ u.nickname || '未设置昵称' }}</text>
                            <wd-tag :type="roleTheme(u.role)" custom-class="uCard__tag">{{ roleText(u.role) }}</wd-tag>
                        </view>
                        <view class="uCard__phone">{{ u.phone || '-' }}</view>
                        <view class="uCard__meta">
                            <text class="uCard__id" :class="{ 'uCard__id--on': u.idVerifiedAt }">
                                {{ u.idVerifiedAt ? '已实名' : '未实名' }}
                            </text>
                            <text class="uCard__time">注册 {{ fmtDate(u.createdAt) }}</text>
                        </view>
                    </view>
                    <view v-if="u.role !== 'SUPER_ADMIN'" class="uCard__btn"
                        :class="u.status === 1 ? 'uCard__btn--off' : 'uCard__btn--on'" @click="toggleStatus(u)">
                        {{ u.status === 1 ? '禁用' : '启用' }}
                    </view>
                </view>

                <view v-if="loading && !list.length" class="uTip">加载中...</view>
                <view v-else-if="list.length === 0 && !loading" class="empty-wrap">
                    <Empty tip="暂无用户数据" />
                </view>
                <view v-else-if="loading" class="uTip uTip--more">加载中...</view>
                <view v-else-if="noMore && list.length" class="uTip uTip--more">没有更多了</view>
                <view class="tailSpace" />
            </view>
        </scroll-view>

        <AdminNav :active-index="2" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminNav from '@/components/AdminNav/index.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import Empty from '@/components/Empty/index.vue'
import { apiAdminListUsers, apiAdminSetUserStatus } from '@/api/admin'

const statusBar = ref(uni.getSystemInfoSync().statusBarHeight || 0)

type UserItem = {
    id: string; phone: string; role: string; nickname?: string
    avatarUrl?: string; status: number; idVerifiedAt?: string; createdAt?: string
}

const roleTabs = [
    { label: '全部', value: '' },
    { label: '求职者', value: 'SEEKER' },
    { label: '招聘官', value: 'RECRUITER' },
    { label: '运营', value: 'ADMIN' },
    { label: '超管', value: 'SUPER_ADMIN' },
]

const roleTextMap: Record<string, string> = {
    SEEKER: '求职者', RECRUITER: '招聘官', ADMIN: '运营', SUPER_ADMIN: '超管',
}
const roleThemeMap: Record<string, string> = {
    SEEKER: 'primary', RECRUITER: 'success', ADMIN: 'warning', SUPER_ADMIN: 'danger',
}
const roleText = (r: string) => roleTextMap[r] || r
const roleTheme = (r: string) => roleThemeMap[r] || 'primary'

const role = ref('')
const keyword = ref('')
const list = ref<UserItem[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const loading = ref(false)
const noMore = ref(false)

const fmtDate = (v?: string) => {
    if (!v) return '-'
    const d = new Date(v)
    if (isNaN(d.getTime())) return '-'
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const load = async (reset = false) => {
    if (loading.value) return
    if (reset) { page.value = 1; noMore.value = false; list.value = [] }
    if (noMore.value) return
    loading.value = true
    try {
        const res: any = await apiAdminListUsers({
            page: page.value, limit, role: role.value || undefined,
            keyword: keyword.value || undefined,
        })
        const items: UserItem[] = res?.items || []
        total.value = res?.total || 0
        list.value = reset ? items : [...list.value, ...items]
        if (list.value.length >= total.value || items.length < limit) noMore.value = true
        else page.value += 1
    } catch { /* 统一处理 */ } finally { loading.value = false }
}

const loadMore = () => { if (!noMore.value) load(false) }
const onSearch = () => load(true)
const switchRole = (v: string) => { if (role.value === v) return; role.value = v; load(true) }

const goBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/admin/index' })
}

const toggleStatus = async (u: UserItem) => {
    const next = u.status === 1 ? 0 : 1
    try {
        await apiAdminSetUserStatus(u.id, next)
        u.status = next
        uni.showToast({ title: next === 1 ? '已启用' : '已禁用', icon: 'none' })
    } catch { uni.showToast({ title: '操作失败', icon: 'none' }) }
}

onMounted(() => load(true))
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';

/* USERS_STYLE */
.hero__bar { align-items: center; }
.hero__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -12rpx;
}
.hero__hello { flex: 1; text-align: center; }

.uSearch { margin-top: 18rpx; }
:deep(.uSearch__input) {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 40rpx;
    padding: 0 26rpx;
    height: 72rpx;
}

.uTabs {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 22rpx;
}
.uTabs__item {
    padding: 10rpx 26rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: var(--app-text-secondary);
    background: #fff;
    box-shadow: 0 6rpx 16rpx rgba(30, 60, 140, 0.06);
}
.uTabs__item--on {
    color: #fff;
    background: linear-gradient(135deg, #4d80f0, #1e5bff);
}

.uCard {
    display: flex;
    align-items: center;
    gap: 20rpx;
    background: #fff;
    border-radius: 22rpx;
    padding: 24rpx 22rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}
.uCard__avatar {
    width: 84rpx;
    height: 84rpx;
    border-radius: 50%;
    overflow: hidden;
    background: #f2f5fb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.uCard__img { width: 100%; height: 100%; }
.uCard__main { flex: 1; min-width: 0; }
.uCard__top {
    display: flex;
    align-items: center;
    gap: 12rpx;
}
.uCard__name {
    font-size: 30rpx;
    font-weight: 700;
    color: var(--app-text-primary);
    max-width: 260rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
:deep(.uCard__tag) { transform: scale(0.92); }
.uCard__phone {
    font-size: 24rpx;
    color: var(--app-text-secondary);
    margin-top: 6rpx;
}
.uCard__meta {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 8rpx;
}
.uCard__id {
    font-size: 22rpx;
    color: var(--app-text-muted);
}
.uCard__id--on { color: #22b07d; }
.uCard__time {
    font-size: 22rpx;
    color: var(--app-text-muted);
}
.uCard__btn {
    flex-shrink: 0;
    padding: 12rpx 26rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    font-weight: 700;
}
.uCard__btn--off {
    color: #fa4350;
    background: rgba(250, 67, 80, 0.1);
}
.uCard__btn--on {
    color: #22b07d;
    background: rgba(34, 176, 125, 0.12);
}

.uTip {
    text-align: center;
    font-size: 26rpx;
    color: var(--app-text-muted);
    padding: 60rpx 0;
}
.uTip--more { padding: 30rpx 0; }

.empty-wrap { padding: 80rpx 0; }
</style>
