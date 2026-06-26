<template>
    <view class="page">
        <view class="nav">
            <HeaderNav title="找人才" type="show-back" theme="000" />
            <view class="search">
                <wd-icon name="search-line" size="32rpx" color="rgba(0, 0, 0, 0.32)" />
                <wd-input v-model="keyword" compact custom-class="search__input" auto-complete="off"
                    placeholder="请输入关键词、职位" @input="handleSearchInput" @confirm="handleSearchConfirm" />
            </view>
        </view>

        <view class="filters">
            <view v-for="f in filterTabs" :key="f.key" class="filter" :class="{ 'filter--on': f.key === activeFilter }"
                hover-class="filter--pressed" @click="setFilter(f.key)">
                <view class="filter__text">{{ f.label }}</view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="list" :style="{ paddingBottom: `${safeBottom + 140}px` }">
                <wd-empty v-if="!loading && !candidates.length" tip="暂无候选人" />
                <view v-for="c in candidates" :key="c.userId" class="card" hover-class="card--pressed"
                    @click="handleCandidateTap(c.userId)">
                    <view class="card__left">
                        <view class="avatar">
                            <image v-if="c.avatar" class="avatar__img" :src="c.avatar" mode="aspectFill" />
                            <view v-else class="avatar__ph" />
                        </view>
                    </view>

                    <view class="card__main">
                        <view class="topRow">
                            <view class="nameLine">
                                <view class="name">{{ c.name }}</view>
                            </view>
                            <view class="job">{{ c.job }}</view>
                        </view>

                        <view class="bottomRow">
                            <view class="facts">
                                <view class="fact">
                                    <wd-icon name="location" size="22rpx" color="rgba(0, 0, 0, 0.18)" />
                                    <view class="fact__text">{{ c.city }}</view>
                                </view>
                                <view class="fact">
                                    <wd-icon name="file" size="22rpx" color="rgba(0, 0, 0, 0.16)" />
                                    <view class="fact__text">{{ c.education }}</view>
                                </view>
                            </view>
                            <view class="time">{{ c.time }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <wd-tabbar v-model="activeTab" fixed bordered safe-area-inset-bottom active-color="rgba(30, 91, 255, 0.98)"
            inactive-color="rgba(0, 0, 0, 0.44)" custom-class="talentsTabbar" @change="handleTabChange">
            <wd-tabbar-item name="recommend" title="推荐" icon="home" />
            <wd-tabbar-item name="message" title="消息" icon="message" />
            <wd-tabbar-item name="talents" title="找人">
                <template #icon="{ active }">
                    <view class="tabBubble" :class="{ 'tabBubble--on': active }">
                        <wd-icon name="user-group" size="32rpx" color="#fff" />
                    </view>
                </template>
            </wd-tabbar-item>
            <wd-tabbar-item name="resume" title="简历" icon="file" />
            <wd-tabbar-item name="mine" title="个人" icon="user" />
        </wd-tabbar>

        <wd-toast selector="talentsToast" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetSeekers } from '@/api/index'

const safeBottom = ref(uni.getSystemInfoSync().safeAreaInsets?.bottom || 0)

type FilterKey = 'all' | 'latest'

const filterTabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'latest', label: '最新更新' },
]

const activeFilter = ref<FilterKey>('all')
const keyword = ref('')
const activeTab = ref('talents')

type Candidate = {
    userId: string
    avatar?: string
    name: string
    job: string
    city: string
    education: string
    time: string
}

const candidates = ref<Candidate[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const noMore = ref(false)

const degreeMap: Record<string, string> = {
    ANY: '学历不限', ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}

const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return '刚刚'
    if (m < 60) return `${m}分钟前`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}小时前`
    return `${Math.floor(h / 24)}天前`
}

const mapItem = (s: any): Candidate => ({
    userId: s.userId,
    name: s.realName || s.user?.nickname || '求职者',
    job: s.roleTitle || s.workExps?.[0]?.title || '暂无职位',
    city: s.city || '地点不限',
    education: degreeMap[s.educations?.[0]?.degree] || '学历不限',
    time: formatRelative(s.updatedAt),
    avatar: s.user?.avatarUrl || '',
})

const fetchCandidates = async (reset = false) => {
    if (loading.value) return
    loading.value = true
    try {
        const p = reset ? 1 : page.value
        const res: any = await apiGetSeekers({ keyword: keyword.value.trim() || undefined, page: p, limit: 15 })
        const items = (res?.items || []).map(mapItem)
        if (reset) {
            candidates.value = items
            page.value = 1
            noMore.value = false
        } else {
            candidates.value = [...candidates.value, ...items]
        }
        total.value = res?.total || 0
        noMore.value = candidates.value.length >= total.value
        page.value = p + 1
    } catch { /* ignore */ } finally {
        loading.value = false
    }
}

onMounted(() => {
    // 接收首页传来的关键词
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const kw = currentPage?.options?.keyword || ''
    if (kw) keyword.value = decodeURIComponent(kw)
    fetchCandidates(true)
})

const setFilter = (key: FilterKey) => {
    activeFilter.value = key
    fetchCandidates(true)
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
const handleSearchInput = () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchCandidates(true), 400)
}

const handleSearchConfirm = () => fetchCandidates(true)

const handleCandidateTap = (userId: string) => {
    uni.navigateTo({ url: `/pages/recruiter/resumeDetail?userId=${userId}` as any })
}

const handleTabChange = ({ value }: { value: string | number }) => {
    const tabNav: Record<string, string> = {
        recommend: '/pages/recruiter/index',
        resume: '/pages/recruiter/resumeCenter',
        mine: '/pages/mine/index',
    }
    const path = tabNav[String(value)]
    if (path) uni.navigateTo({ url: path as any })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: var(--app-bg);
    display: flex;
    flex-direction: column;
}

.nav {
    padding: 0 22rpx 18rpx;
    box-sizing: border-box;
    background: var(--app-surface-strong);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
}

.search {
    margin-top: 6rpx;
    height: 76rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 0 22rpx;
    box-sizing: border-box;
}

:deep(.search__input) {
    flex: 1;
    min-width: 0;
    height: 78rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 78rpx;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.94) !important;
    }

    .uni-input-placeholder {
        color: rgba(0, 0, 0, 0.94) !important;
        font-size: 28rpx;
    }
}

.filters {
    padding: 18rpx 22rpx 8rpx;
    display: flex;
    gap: 16rpx;
    background: var(--app-bg);
}

.filter {
    flex: 1 1 0;
    height: 60rpx;
    border-radius: var(--app-radius-md);
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: 0 12rpx 30rpx rgba(30, 60, 140, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter--pressed {
    opacity: 0.92;
}

.filter__text {
    font-size: 26rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.56);
}

.filter--on .filter__text {
    color: rgba(30, 91, 255, 0.98);
}

.scroll {
    flex: 1 1 auto;
}

.list {
    padding: 10rpx 22rpx 18rpx;
    box-sizing: border-box;
}

.card {
    display: flex;
    gap: 16rpx;
    padding: 18rpx 18rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
}

.card+.card {
    margin-top: 18rpx;
}

.card--pressed {
    transform: scale(0.995);
    opacity: 0.94;
}

.avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: var(--app-radius-pill);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
}

.avatar__img {
    width: 100%;
    height: 100%;
}

.avatar__ph {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.04));
}

.card__main {
    flex: 1 1 auto;
    min-width: 0;
}

.topRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.nameLine {
    display: flex;
    align-items: baseline;
    gap: 12rpx;
    min-width: 0;
}

.name {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.meta {
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.46);
}

.job {
    font-size: 26rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.62);
    flex: 0 0 auto;
}

.bottomRow {
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.facts {
    display: flex;
    gap: 18rpx;
    align-items: center;
    flex-wrap: wrap;
}

.fact {
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.44);
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
}

.fact__text {
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.44);
    font-weight: 800;
}

.time {
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.34);
    font-weight: 800;
    flex: 0 0 auto;
}

.tabBubble {
    width: 66rpx;
    height: 66rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(30, 91, 255, 0.98);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18rpx 44rpx rgba(30, 91, 255, 0.26);
    margin-top: -14rpx;
}

:deep(.talentsTabbar) {
    height: 120rpx !important;
}

:deep(.talentsTabbar .wd-tabbar-item__body-title) {
    font-size: 22rpx !important;
    font-weight: 800 !important;
}

:deep(.talentsTabbar .wd-tabbar-item__body-icon) {
    font-size: 44rpx !important;
}
</style>
