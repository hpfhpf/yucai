<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" hover-class="hero__back--pressed" @click="goBack">
                    <FaIcon name="chevron-left" :size="34" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__role">运营工作台</view>
                    <view class="hero__name">企业审核</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="building-shield" :size="38" color="#fff" />
                </view>
            </view>
        </view>

        <view class="toolbar">
            <view class="tabs">
                <view v-for="t in tabs" :key="t.key" class="tab" :class="{ 'tab--on': t.key === activeTab }"
                    hover-class="tab--pressed" @click="setTab(t.key)">
                    {{ t.label }}
                </view>
            </view>
            <view class="search">
                <FaIcon name="magnifying-glass" :size="30" color="rgba(0,0,0,0.32)" />
                <wd-input v-model="keyword" compact custom-class="search__input" auto-complete="off"
                    placeholder="搜索企业名称" @confirm="onSearch" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y @scrolltolower="loadMore">
            <view class="content">
                <view v-if="list.length" class="cardList">
                    <view v-for="c in list" :key="c.id" class="coCard">
                        <view class="coCard__head">
                            <view class="coCard__name">{{ c.name }}</view>
                            <view class="tag" :class="c.isVerified ? 'tag--on' : 'tag--off'">
                                {{ c.isVerified ? '已认证' : '未认证' }}
                            </view>
                        </view>
                        <view class="coCard__meta">
                            {{ [c.industry, c.scale, c.city].filter(Boolean).join(' · ') || '资料待完善' }}
                        </view>
                        <view class="coCard__stats">
                            <view class="stat">
                                <FaIcon name="star" :size="26" color="#f0883a" fixed-width />
                                <text class="stat__txt">信用分 {{ c.creditScore ?? '-' }}</text>
                            </view>
                            <view class="stat">
                                <FaIcon name="briefcase" :size="26" color="#22b07d" fixed-width />
                                <text class="stat__txt">在招 {{ c._count?.jobs ?? 0 }}</text>
                            </view>
                            <view class="stat">
                                <FaIcon name="user-tie" :size="26" color="#1e5bff" fixed-width />
                                <text class="stat__txt">招聘官 {{ c._count?.recruiters ?? 0 }}</text>
                            </view>
                        </view>
                        <view class="coCard__foot">
                            <view v-if="!c.isVerified" class="btn btn--pass" hover-class="btn--pressed"
                                @click="toggleVerify(c, true)">通过认证</view>
                            <view v-else class="btn btn--cancel" hover-class="btn--pressed"
                                @click="toggleVerify(c, false)">取消认证</view>
                        </view>
                    </view>
                </view>

                <view v-if="list.length === 0 && !loading" class="empty-wrap">
                    <Empty tip="暂无企业数据" />
                </view>

                <view v-if="loading" class="loading">
                    <FaIcon name="spinner" :size="40" color="#1e5bff" spin />
                    <text class="loading__txt">加载中...</text>
                </view>
                <view v-else-if="list.length && noMore" class="noMore">没有更多了</view>
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
import { apiAdminListCompanies, apiAdminVerifyCompany } from '@/api/admin'

interface Company {
    id: string
    name: string
    industry?: string
    scale?: string
    city?: string
    creditScore?: number
    isVerified: boolean
    createdAt?: string
    _count?: { jobs: number; recruiters: number }
}

const statusBar = ref(uni.getWindowInfo().statusBarHeight || 0)

const tabs = [
    { key: '', label: '全部' },
    { key: 'true', label: '已认证' },
    { key: 'false', label: '未认证' },
]
const activeTab = ref('')
const keyword = ref('')

const list = ref<Company[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const loading = ref(false)
const noMore = ref(false)

const goBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/admin/index' })
}

const fetchList = async (reset = false) => {
    if (loading.value) return
    if (reset) {
        page.value = 1
        noMore.value = false
        list.value = []
    }
    if (noMore.value) return
    loading.value = true
    try {
        const res: any = await apiAdminListCompanies({
            page: page.value,
            limit,
            verified: activeTab.value || undefined,
            keyword: keyword.value || undefined,
        })
        const items: Company[] = res?.items || []
        total.value = res?.total || 0
        list.value = reset ? items : [...list.value, ...items]
        if (list.value.length >= total.value || items.length < limit) noMore.value = true
        else page.value += 1
    } catch {
        if (!list.value.length) uni.showToast({ title: '数据加载失败，请重试', icon: 'none', duration: 2000 })
    } finally {
        loading.value = false
    }
}

const setTab = (key: string) => {
    if (activeTab.value === key) return
    activeTab.value = key
    fetchList(true)
}

const onSearch = () => fetchList(true)

const loadMore = () => {
    if (!noMore.value && !loading.value) fetchList()
}

const toggleVerify = async (c: Company, isVerified: boolean) => {
    uni.showLoading({ title: isVerified ? '认证中' : '取消中', mask: true })
    try {
        await apiAdminVerifyCompany(c.id, { isVerified })
        uni.hideLoading()
        uni.showToast({ title: isVerified ? '已通过认证' : '已取消认证', icon: 'none' })
        fetchList(true)
    } catch {
        uni.hideLoading()
        uni.showToast({ title: '操作失败', icon: 'none' })
    }
}

onMounted(() => fetchList(true))
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';

.hero__back {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
}

.hero__back--pressed { background: rgba(255, 255, 255, 0.3); }
.hero__hello { flex: 1; }

.toolbar {
    padding: 24rpx 26rpx 8rpx;
}

.tabs {
    display: flex;
    gap: 16rpx;
    margin-bottom: 20rpx;
}

.tab {
    padding: 12rpx 30rpx;
    border-radius: 30rpx;
    background: #fff;
    font-size: 26rpx;
    color: var(--app-text-secondary);
    box-shadow: 0 6rpx 18rpx rgba(30, 60, 140, 0.06);
}

.tab--on {
    background: #1e5bff;
    color: #fff;
    font-weight: 700;
}

.tab--pressed { opacity: 0.7; }

.search {
    display: flex;
    align-items: center;
    gap: 12rpx;
    background: #fff;
    border-radius: 18rpx;
    padding: 8rpx 24rpx;
    box-shadow: 0 6rpx 18rpx rgba(30, 60, 140, 0.06);

    :deep(.search__input) { flex: 1; background: transparent; }
}

.cardList {
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.coCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 26rpx 24rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.coCard__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.coCard__name {
    flex: 1;
    font-size: 32rpx;
    font-weight: 800;
    color: var(--app-text-primary);
}

.tag {
    padding: 6rpx 18rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 700;
}

.tag--on { background: rgba(52, 209, 157, 0.16); color: #22b07d; }
.tag--off { background: rgba(0, 0, 0, 0.08); color: var(--app-text-muted); }

.coCard__meta {
    font-size: 24rpx;
    color: var(--app-text-secondary);
    margin-top: 12rpx;
}

.coCard__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 28rpx;
    margin-top: 18rpx;
}

.stat {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.stat__txt {
    font-size: 24rpx;
    color: var(--app-text-primary);
}

.coCard__foot {
    display: flex;
    justify-content: flex-end;
    margin-top: 22rpx;
}

.btn {
    padding: 14rpx 36rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    font-weight: 700;
    color: #fff;
}

.btn--pass { background: linear-gradient(135deg, #43d9a3, #22b07d); }
.btn--cancel { background: rgba(0, 0, 0, 0.28); }
.btn--pressed { opacity: 0.8; }

.empty-wrap { padding: 80rpx 0; }

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    padding: 40rpx 0;
}

.loading__txt {
    font-size: 26rpx;
    color: var(--app-text-secondary);
}

.noMore {
    text-align: center;
    font-size: 24rpx;
    color: var(--app-text-muted);
    padding: 30rpx 0;
}
</style>
