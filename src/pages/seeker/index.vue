<template>
    <view class="page">
        <view class="hero">
            <HeaderNav title="首页" type="seeker-index" theme="FFF" />
            <view class="search" @click="handleSearchTap">
                <view class="search__icon" />
                <wd-input v-model="keyword" class="search__input" auto-complete="off" placeholder="请输入关键词、职位"
                    @confirm="handleSearchConfirm" @input="handleSearchInput" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="banner">
                    <swiper class="banner__swiper" :current="bannerIndex" circular autoplay :interval="3600"
                        :duration="420" @change="handleBannerChange">
                        <swiper-item v-for="b in banners" :key="b.id">
                            <view class="banner__slide">
                                <view class="banner__left">
                                    <view class="banner__big">{{ b.title }}</view>
                                    <view class="banner__sub">{{ b.sub }}</view>
                                    <view class="banner__cta">{{ b.cta }}</view>
                                </view>
                                <view class="banner__right">
                                    <view class="cube cube--a" />
                                    <view class="cube cube--b" />
                                    <view class="cube cube--c" />
                                    <view class="spark spark--1" />
                                    <view class="spark spark--2" />
                                    <view class="spark spark--3" />
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>

                    <view class="banner__dots">
                        <view v-for="(_, i) in banners" :key="i" class="banner__dot"
                            :class="{ 'banner__dot--on': i === bannerIndex }" />
                    </view>
                </view>

                <view class="quick">
                    <view v-for="item in quickItems" :key="item.key"
                        :class="['quick__item', isNatureActive(item.key) && 'quick__item--active']"
                        @click="handleQuickTap(item.key)">
                        <view class="quick__icon" :class="`quick__icon--${item.key}`">
                            <FaIcon :name="quickIcon(item.key)" :size="44"
                                :color="isNatureActive(item.key) ? '#1e5bff' : '#3574e9'" />
                        </view>
                        <view class="quick__label">{{ item.label }}</view>
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">为您推荐最新好职位</view>
                    <wd-button type="primary" plain size="small" class="refresh-btn" @click="handleRefresh">
                        <text>换一批</text>
                    </wd-button>
                </view>

                <view class="jobs">
                    <view v-if="loading" class="empty-tip">加载中...</view>
                    <view v-else-if="!jobs.length" class="empty-tip">暂无职位，请稍后再试</view>
                    <view v-for="job in jobs" :key="job.id" class="jobCard" hover-class="jobCard--pressed"
                        @click="handleJobTap(job.id)">
                        <view class="jobCard__top">
                            <view class="jobCard__name">{{ job.title }}</view>
                            <view class="jobCard__salary">{{ job.salaryRange || '薪资面议' }}</view>
                        </view>
                        <view class="jobCard__tags">
                            <wd-tag size="small">{{ job.city || '地点不限' }}</wd-tag>
                            <wd-tag size="small">{{ degreeMap[job.minDegree] || '学历不限' }}</wd-tag>
                        </view>
                        <view class="jobCard__bottom">
                            <view class="jobCard__company">{{ job.company?.name }}</view>
                            <view class="jobCard__time">{{ formatTime(job.createdAt) }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="empty-space"></view>
        </scroll-view>
        <BottomNav :active-index="0" :theme-color="'#0f5bff'" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { apiGetJobs } from '@/api/index'

// 招聘官不应停留在求职者首页，立即跳走
const _ui = (() => { try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} } })()
if (_ui.role === 'RECRUITER') {
    uni.reLaunch({ url: '/pages/recruiter/index' as any })
}

const keyword = ref('')

const banners = ref([
    { id: 'b1', title: '智聚未来\nAI共生', sub: '2026全球\n互联网招聘峰会', cta: '对话下一代科技革命' },
    { id: 'b2', title: '数字人才\n新机遇', sub: '新质生产力\n岗位精选', cta: '即刻查看热门职位' },
    { id: 'b3', title: '春招冲刺\n好工作', sub: '更多高薪\n上新中', cta: '一键投递更高效' },
])
const bannerIndex = ref(0)

type QuickKey = 'fulltime' | 'parttime' | 'deliveries' | 'credit'
const quickItems = ref<{ key: QuickKey; label: string }[]>([
    { key: 'fulltime', label: '全职职位' },
    { key: 'parttime', label: '兼职职位' },
    { key: 'deliveries', label: '我的投递' },
    { key: 'credit', label: '企业信用' },
])

type Job = { id: string; title: string; salaryRange: string; city: string; minDegree: string; company: { name: string }; createdAt: string }
const jobs = ref<Job[]>([])
const loading = ref(false)
const activeNature = ref<string | null>(null)

const fetchJobs = async (params?: { keyword?: string; nature?: string }) => {
    loading.value = true
    try {
        const res: any = await apiGetJobs({ page: 1, limit: 10, ...params })
        jobs.value = res.items || []
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchJobs())

const handleSearchConfirm = () => {
    const text = keyword.value.trim()
    fetchJobs(text ? { keyword: text } : undefined)
}

const handleSearchInput = () => {
    if (!keyword.value.trim()) {
        activeNature.value = null
        fetchJobs()
    }
}

const handleBannerChange = (e: any) => {
    bannerIndex.value = e?.detail?.current || 0
}

const handleSearchTap = () => { }

const handleQuickTap = (key: QuickKey) => {
    if (key === 'fulltime') {
        if (activeNature.value === 'FULL_TIME') {
            activeNature.value = null
            fetchJobs()
        } else {
            activeNature.value = 'FULL_TIME'
            fetchJobs({ nature: 'FULL_TIME' })
        }
    } else if (key === 'parttime') {
        if (activeNature.value === 'PART_TIME') {
            activeNature.value = null
            fetchJobs()
        } else {
            activeNature.value = 'PART_TIME'
            fetchJobs({ nature: 'PART_TIME' })
        }
    } else if (key === 'deliveries') {
        uni.navigateTo({ url: '/pages/mine/submitted' as any })
    } else {
        uni.showToast({ title: '信用体系开发中', icon: 'none' })
    }
}

const handleRefresh = () => {
    activeNature.value = null
    fetchJobs()
}

const isNatureActive = (key: QuickKey) => {
    if (key === 'fulltime') return activeNature.value === 'FULL_TIME'
    if (key === 'parttime') return activeNature.value === 'PART_TIME'
    return false
}

const quickIconMap: Record<QuickKey, string> = {
    fulltime: 'briefcase',
    parttime: 'clock',
    deliveries: 'paper-plane',
    credit: 'shield-halved',
}
const quickIcon = (key: QuickKey) => quickIconMap[key] || 'circle'

const handleJobTap = (id: string) => {
    uni.navigateTo({ url: `/pages/recommendation/detail/index?id=${id}` as any })
}

// 时间格式化：显示"X天前"或具体日期
const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return '今天发布'
    if (days < 7) return `${days}天前`
    return new Date(iso).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + '发布'
}

const degreeMap: Record<string, string> = {
    ANY: '学历不限', JUNIOR_HIGH: '初中', HIGH_SCHOOL: '高中',
    ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background: url('@/assets/images/bg.png') repeat-x center center / contain;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;
}

.hero {
    position: relative;
}

.search {
    margin: 14rpx 26rpx 24rpx;
    height: 78rpx;
    border-radius: 16rpx;
    background: rgba(255, 255, 255, 0.28);
    border: 1px solid rgba(255, 255, 255, 0.26);
    backdrop-filter: blur(16rpx);
    display: flex;
    align-items: center;
    padding: 0 22rpx;
    box-sizing: border-box;
}

.search__icon {
    width: 30rpx;
    height: 30rpx;
    border-radius: 999rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.92);
    position: relative;
}

.search__icon::after {
    content: '';
    position: absolute;
    right: -8rpx;
    bottom: -8rpx;
    width: 14rpx;
    height: 3rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.92);
    transform: rotate(45deg);
}

.search__input {
    flex: 1;
    height: 78rpx;
    font-size: 28rpx;
    background: transparent;
}

.search__placeholder {
    color: rgba(255, 255, 255, 0.78);
}

.fulltime {
    background: url('@/assets/images/bg.png') repeat-x center center / contain;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 4rpx 26rpx;
    box-sizing: border-box;
}

.banner {
    margin-top: 0;
    border-radius: 18rpx;
    overflow: hidden;
    box-shadow: var(--app-shadow-card-strong);
    border: 1px solid rgba(255, 255, 255, 0.62);
    position: relative;
}

.banner__swiper {
    height: 220rpx;
}

.banner__slide {
    height: 220rpx;
    padding: 22rpx 24rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background:
        radial-gradient(700rpx 340rpx at 12% 24%, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0) 62%),
        linear-gradient(135deg, rgba(115, 221, 255, 0.78), rgba(66, 170, 255, 0.62) 58%, rgba(44, 130, 255, 0.6));
}

.banner__left {
    min-width: 0;
}

.banner__big {
    font-size: 42rpx;
    font-weight: 900;
    color: rgba(10, 42, 140, 0.92);
    line-height: 48rpx;
    letter-spacing: 1rpx;
    white-space: pre-line;
}

.banner__sub {
    margin-top: 10rpx;
    font-size: 20rpx;
    font-weight: 700;
    color: rgba(10, 42, 140, 0.72);
    line-height: 28rpx;
    white-space: pre-line;
}

.banner__cta {
    margin-top: 12rpx;
    display: inline-flex;
    height: 44rpx;
    align-items: center;
    padding: 0 16rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.74);
    color: rgba(10, 42, 140, 0.78);
    font-size: 18rpx;
    font-weight: 800;
}

.banner__right {
    width: 220rpx;
    height: 160rpx;
    position: relative;
    flex: 0 0 auto;
}

.cube {
    position: absolute;
    width: 86rpx;
    height: 86rpx;
    border-radius: 18rpx;
    background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.52)),
        linear-gradient(135deg, rgba(35, 110, 255, 0.85), rgba(35, 110, 255, 0));
    box-shadow: 0 18rpx 34rpx rgba(10, 60, 180, 0.24);
    transform: rotate(12deg);
}

.cube--a {
    right: 12rpx;
    top: 6rpx;
}

.cube--b {
    right: 74rpx;
    top: 40rpx;
    width: 74rpx;
    height: 74rpx;
    border-radius: 16rpx;
    opacity: 0.92;
}

.cube--c {
    right: 18rpx;
    top: 78rpx;
    width: 68rpx;
    height: 68rpx;
    border-radius: 16rpx;
    opacity: 0.88;
}

.spark {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.78);
    box-shadow: 0 0 0 8rpx rgba(255, 255, 255, 0.22);
    opacity: 0.86;
}

.spark--1 {
    left: 18rpx;
    top: 26rpx;
    width: 12rpx;
    height: 12rpx;
}

.spark--2 {
    left: 60rpx;
    bottom: 16rpx;
}

.spark--3 {
    right: 112rpx;
    bottom: 40rpx;
    width: 10rpx;
    height: 10rpx;
}

.banner__dots {
    position: absolute;
    right: 16rpx;
    bottom: 14rpx;
    display: flex;
    gap: 8rpx;
}

.banner__dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.5);
}

.banner__dot--on {
    width: 22rpx;
    background: rgba(255, 255, 255, 0.92);
}

.quick {
    margin-top: 18rpx;
    border-radius: 18rpx;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 16rpx 46rpx rgba(30, 60, 140, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.78);
    padding: 22rpx 16rpx;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8rpx;
}

.quick__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14rpx;
    padding: 10rpx 16rpx;
    border-radius: 16rpx;
    transition: background 0.15s;
}

.quick__item--active {
    background: rgba(30, 91, 255, 0.10);
}

.quick__icon {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quick__label {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.72);
    font-weight: 700;
}

.section {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 6rpx;
}

.section__title {
    font-size: 30rpx;
    font-weight: 900;
    color: #FFF;
}

.refresh-btn {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 12rpx 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 12rpx 30rpx rgba(30, 60, 140, 0.1);

    :deep(.wd-button__content) {
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.62);
        font-weight: 800;
    }
}

.jobs {
    margin-top: 10rpx;
}

.jobCard {
    border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(255, 255, 255, 0.84);
    box-shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.12);
    padding: 24rpx;
}

.jobCard+.jobCard {
    margin-top: 16rpx;
}

.jobCard--pressed {
    transform: scale(0.99);
    opacity: 0.94;
}

.jobCard__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.jobCard__name {
    font-size: 32rpx;
    color: rgba(0, 0, 0, 0.84);
}

.jobCard__salary {
    font-size: 30rpx;
    font-weight: 900;
    color: #ff7a00;
}

.jobCard__tags {
    margin-top: 14rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.jobCard__bottom {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18rpx;
}

.jobCard__company {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.38);
}

.jobCard__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.34);
}
</style>
