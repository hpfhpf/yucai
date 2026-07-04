<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" @click="goBack">
                    <FaIcon name="chevron-left" :size="36" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__name">职位管理</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="briefcase" :size="36" color="#fff" />
                </view>
            </view>
            <view class="jSearch">
                <wd-input v-model="keyword" placeholder="搜索职位名称" custom-class="jSearch__input"
                    :no-border="true" confirm-type="search" @confirm="onSearch" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y @scrolltolower="loadMore">
            <view class="content">
                <view class="jTabs">
                    <view v-for="t in statusTabs" :key="t.value" class="jTabs__item"
                        :class="{ 'jTabs__item--on': status === t.value }" @click="switchStatus(t.value)">
                        {{ t.label }}
                    </view>
                </view>

                <view v-for="j in list" :key="j.id" class="jCard">
                    <view class="jCard__head">
                        <view class="jCard__title">{{ j.title }}</view>
                        <view class="jCard__salary">{{ j.salaryRange || '面议' }}</view>
                    </view>
                    <view class="jCard__company">
                        <FaIcon name="building" :size="24" color="#8a94a6" fixed-width />
                        <text class="jCard__companyName">{{ j.company?.name || '-' }}</text>
                        <FaIcon v-if="j.company?.isVerified" name="circle-check" :size="24" color="#34d19d" />
                    </view>
                    <view class="jCard__tags">
                        <view class="jTag jTag--plain">{{ natureText(j.nature) }}</view>
                        <view class="jTag jTag--plain">{{ j.city || '不限' }}</view>
                        <view class="jTag" :class="`jTag--${statusTheme(j.status)}`">{{ statusText(j.status) }}</view>
                    </view>
                    <view class="jCard__foot">
                        <view class="jCard__meta">
                            <text class="jCard__metaItem">浏览 {{ j.viewCount ?? 0 }}</text>
                            <text class="jCard__metaItem">投递 {{ j._count?.deliveries ?? 0 }}</text>
                            <text class="jCard__metaItem">{{ fmtDate(j.createdAt) }}</text>
                        </view>
                        <view v-if="j.status === 'ACTIVE'" class="jBtn jBtn--danger" @click="toggle(j)">下架</view>
                        <view v-else-if="j.status === 'CLOSED'" class="jBtn jBtn--success" @click="toggle(j)">上架</view>
                    </view>
                </view>

                <view v-if="loading && !list.length" class="jTip">加载中...</view>
                <view v-else-if="list.length === 0 && !loading" class="empty-wrap">
                    <Empty tip="暂无职位数据" />
                </view>
                <view v-else-if="loading" class="jTip jTip--more">加载中...</view>
                <view v-else-if="noMore && list.length" class="jTip jTip--more">没有更多了</view>
                <view class="tailSpace" />
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import Empty from '@/components/Empty/index.vue'
import { apiAdminListJobs, apiAdminSetJobStatus } from '@/api/admin'

const statusBar = ref(uni.getSystemInfoSync().statusBarHeight || 0)

type JobItem = {
    id: string; title: string; nature?: string; city?: string
    salaryRange?: string; status: string; viewCount?: number; createdAt?: string
    company?: { name?: string; isVerified?: boolean }
    _count?: { deliveries?: number }
}

const statusTabs = [
    { label: '全部', value: '' },
    { label: '在招', value: 'ACTIVE' },
    { label: '已关闭', value: 'CLOSED' },
    { label: '草稿', value: 'DRAFT' },
]

const natureTextMap: Record<string, string> = {
    FULL_TIME: '全职', PART_TIME: '兼职', INTERNSHIP: '实习',
}
const natureText = (n?: string) => (n ? natureTextMap[n] || n : '-')

const statusThemeMap: Record<string, string> = {
    ACTIVE: 'success', CLOSED: 'danger', DRAFT: 'warning',
}
const statusTextMap: Record<string, string> = {
    ACTIVE: '在招', CLOSED: '已关闭', DRAFT: '草稿',
}
const statusText = (s: string) => statusTextMap[s] || s
const statusTheme = (s: string) => statusThemeMap[s] || 'info'

const status = ref('')
const keyword = ref('')
const list = ref<JobItem[]>([])
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
        const res: any = await apiAdminListJobs({
            page: page.value, limit, status: status.value || undefined,
            keyword: keyword.value || undefined,
        })
        const items: JobItem[] = res?.items || []
        total.value = res?.total || 0
        list.value = reset ? items : [...list.value, ...items]
        if (list.value.length >= total.value || items.length < limit) noMore.value = true
        else page.value += 1
    } catch { /* 统一处理 */ } finally { loading.value = false }
}

const loadMore = () => { if (!noMore.value) load(false) }
const onSearch = () => load(true)
const switchStatus = (v: string) => { if (status.value === v) return; status.value = v; load(true) }

const goBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/admin/index' })
}

const toggle = async (j: JobItem) => {
    const next = j.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'
    try {
        await apiAdminSetJobStatus(j.id, next)
        uni.showToast({ title: next === 'ACTIVE' ? '已上架' : '已下架', icon: 'none' })
        load(true)
    } catch { uni.showToast({ title: '操作失败', icon: 'none' }) }
}

onMounted(() => load(true))
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';

/* JOBS_STYLE */
.hero__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.hero__hello { flex: 1; }

.jSearch {
    margin-top: 8rpx;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 20rpx;
    padding: 4rpx 20rpx;
}

:deep(.jSearch__input) { background: transparent; }

.jTabs {
    display: flex;
    gap: 12rpx;
    margin-bottom: 22rpx;
}

.jTabs__item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 26rpx;
    font-weight: 600;
    color: var(--app-text-secondary);
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 6rpx 18rpx rgba(30, 60, 140, 0.06);
}

.jTabs__item--on {
    color: #fff;
    background: linear-gradient(135deg, #2a67ff, #143fd6);
}

.jCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 26rpx 24rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.jCard__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16rpx;
}

.jCard__title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 800;
    color: var(--app-text-primary);
    line-height: 1.3;
}

.jCard__salary {
    font-size: 30rpx;
    font-weight: 800;
    color: #fa5a3d;
    white-space: nowrap;
}

.jCard__company {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: 14rpx;
}

.jCard__companyName {
    font-size: 26rpx;
    color: var(--app-text-secondary);
}

.jCard__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 18rpx;
}

.jTag {
    padding: 6rpx 18rpx;
    border-radius: 12rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.jTag--plain {
    color: var(--app-text-secondary);
    background: var(--app-bg);
}

.jTag--success { color: #22b07d; background: rgba(52, 209, 157, 0.14); }
.jTag--danger { color: #fa4350; background: rgba(250, 67, 80, 0.12); }
.jTag--warning { color: #f0883a; background: rgba(240, 136, 58, 0.14); }
.jTag--info { color: #8a94a6; background: rgba(138, 148, 166, 0.14); }

.jCard__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    margin-top: 20rpx;
    padding-top: 18rpx;
    border-top: 1px solid var(--app-line);
}

.jCard__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.jCard__metaItem {
    font-size: 22rpx;
    color: var(--app-text-muted);
}

.jBtn {
    padding: 12rpx 30rpx;
    border-radius: 14rpx;
    font-size: 26rpx;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
}

.jBtn--danger { background: linear-gradient(135deg, #ff6a6a, #fa4350); }
.jBtn--success { background: linear-gradient(135deg, #43d9a3, #22b07d); }

.jTip {
    text-align: center;
    font-size: 26rpx;
    color: var(--app-text-muted);
    padding: 40rpx 0;
}

.jTip--more { padding: 28rpx 0; }

.empty-wrap { padding: 80rpx 0; }

.tailSpace { height: 60rpx; }

</style>
