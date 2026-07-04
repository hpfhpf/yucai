<template>
    <view class="page">
        <view class="hero">
            <HeaderNav title="首页" type="seeker-index" theme="FFF" />
            <view class="search" @click="handleSearchTap">
                <FaIcon name="magnifying-glass" :size="32" color="rgba(255, 255, 255, 0.92)" />
                <wd-input v-model="keyword" compact custom-class="search__input" auto-complete="off"
                    placeholder="请输入关键词、职位" @confirm="handleSearchConfirm" />
            </view>
        </view>

        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 120}px` }">
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

                <view class="section">
                    <view class="section__title">最新简历</view>
                    <view class="section__right" hover-class="section__right--pressed" @click="handleRefresh">
                        <FaIcon name="arrows-rotate" :size="26" color="rgba(0, 0, 0, 0.34)" :spin="refreshing" />
                        <view class="section__text">换一批</view>
                    </view>
                </view>

                <scroll-view class="peopleScroll" scroll-x show-scrollbar="false">
                    <view class="peopleRow">
                        <view v-for="p in people" :key="p.id" class="personCard" hover-class="personCard--pressed"
                            @click="handlePersonTap(p.id)">
                            <view class="personCard__head">
                                <view class="personCard__avatar">
                                    <image v-if="p.avatar" class="personCard__avatarImg" :src="p.avatar"
                                        mode="aspectFill" />
                                    <view v-else class="personCard__avatarPh" />
                                </view>
                                <view class="personCard__meta">
                                    <view class="personCard__name">{{ p.name }}</view>
                                    <view class="personCard__role">{{ p.role }}</view>
                                </view>
                                <view class="personCard__time">{{ p.time }}</view>
                            </view>

                            <view class="personCard__facts">
                                <wd-tag size="small" plain custom-class="factTag factTag--exp">
                                    <FaIcon name="clock" :size="20" style="margin-right: 4rpx" />
                                    {{ p.exp }}
                                </wd-tag>
                                <wd-tag size="small" plain custom-class="factTag factTag--edu">
                                    <FaIcon name="book-open" :size="20" style="margin-right: 4rpx" />
                                    {{ p.edu }}
                                </wd-tag>
                                <wd-tag size="small" plain custom-class="factTag factTag--loc">
                                    <FaIcon name="location-dot" :size="20" style="margin-right: 4rpx" />
                                    {{ p.loc }}
                                </wd-tag>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="section">
                    <view class="section__title">最新动态</view>
                    <view class="section__right" hover-class="section__right--pressed" @click="handleRefresh">
                        <FaIcon name="arrows-rotate" :size="26" color="rgba(0, 0, 0, 0.34)" :spin="refreshing" />
                        <view class="section__text">换一批</view>
                    </view>
                </view>
                <view class="newsList">
                    <view v-for="n in news" :key="n.id" class="newsCard" hover-class="newsCard--pressed"
                        @click="handleNewsTap(n.id)">
                        <view class="newsCard__thumb">
                            <image v-if="n.cover" class="newsCard__img" :src="n.cover" mode="aspectFill" />
                            <view v-else class="newsCard__ph" />
                        </view>
                        <view class="newsCard__main">
                            <view class="newsCard__title">{{ n.title }}</view>
                            <view class="newsCard__desc">{{ n.desc }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <BottomNav :active-index="0" :theme-color="'#0f5bff'" />
        <wd-toast selector="recruiterToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetSeekers } from '@/api/index'

type Person = {
    id: string
    time: string
    avatar?: string
    name: string
    role: string
    edu: string
    loc: string
}

const safeBottom = ref(uni.getSystemInfoSync().safeAreaInsets?.bottom || 0)
const keyword = ref('')

const banners = ref([
    { id: 'b1', title: '智聚未来\nAI共生', sub: '2026全球\n互联网招聘峰会', cta: '对话下一代科技革命' },
    { id: 'b2', title: '数字人才\n新机遇', sub: '新质生产力\n岗位精选', cta: '即刻查看热门职位' },
    { id: 'b3', title: '春招冲刺\n好工作', sub: '更多高薪\n上新中', cta: '一键投递更高效' },
])
const bannerIndex = ref(0)

const people = ref<Person[]>([])
const refreshing = ref(false)

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

const loadSeekers = async () => {
    try {
        const res: any = await apiGetSeekers({ page: 1, limit: 10 })
        people.value = (res?.items || []).map((s: any) => ({
            id: s.userId,
            name: s.realName || s.user?.nickname || '求职者',
            role: s.roleTitle || s.workExps?.[0]?.title || '暂无职位',
            edu: degreeMap[s.educations?.[0]?.degree] || '学历不限',
            loc: s.city || '地点不限',
            time: formatRelative(s.updatedAt),
            avatar: s.user?.avatarUrl || '',
        }))
    } catch { /* 错误由 request.ts 统一处理 */ }
}

onMounted(loadSeekers)

const handleSearchTap = () => { }

const handleSearchConfirm = () => {
    const text = keyword.value.trim()
    if (text) {
        uni.navigateTo({ url: `/pages/recruiter/talents?keyword=${encodeURIComponent(text)}` as any })
    }
}

const handleBannerChange = (e: any) => {
    bannerIndex.value = e?.detail?.current || 0
}

const handleRefresh = async () => {
    refreshing.value = true
    await loadSeekers()
    refreshing.value = false
}

const handlePersonTap = (userId: string) => {
    uni.navigateTo({ url: `/pages/recruiter/resumeDetail?userId=${userId}` as any })
}

const handleNewsTap = (_id: string) => { }
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

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
    padding-top: var(--nav-total);
    padding-bottom: 18rpx;
}

.search {
    margin-top: 10rpx;
    height: 78rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.26);
    backdrop-filter: blur(16rpx);
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
        color: rgba(255, 255, 255, 0.94) !important;
    }

    .uni-input-placeholder {
        color: rgba(255, 255, 255, 0.78) !important;
        font-size: 28rpx;
    }
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 0 26rpx 44rpx;
    box-sizing: border-box;
}

.banner {
    margin-top: -6rpx;
    border-radius: var(--app-radius-md);
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
    border-radius: var(--app-radius-pill);
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
    border-radius: var(--app-radius-md);
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
    border-radius: var(--app-radius-pill);
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
    border-radius: var(--app-radius-pill);
    background: rgba(255, 255, 255, 0.5);
}

.banner__dot--on {
    width: 22rpx;
    background: rgba(255, 255, 255, 0.92);
}

.section {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 6rpx;
}

.section__title {
    font-size: 32rpx;
    font-weight: 700;
    color: #FFF;
}

.section__right {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 12rpx 14rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: var(--app-shadow-card);
}

.section__right--pressed {
    opacity: 0.92;
    transform: scale(0.99);
}

.section__text {
    font-size: 24rpx;
    color: var(--app-text-secondary);
    font-weight: 800;
}

.section__refresh--spin {
    animation: recruiterSpin 420ms linear infinite;
}

@keyframes recruiterSpin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.peopleScroll {
    margin-top: 12rpx;
    width: 100%;
}

.peopleRow {
    display: flex;
    gap: 16rpx;
    padding: 0 6rpx;
}

.personCard {
    flex-shrink: 0;
    width: 520rpx;
    border-radius: var(--app-radius-md);
    background: var(--app-surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    padding: 18rpx 18rpx 16rpx;
    box-sizing: border-box;
}

.personCard--pressed {
    transform: scale(0.99);
    opacity: 0.94;
}

.personCard__head {
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.personCard__avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: var(--app-radius-pill);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
    flex: 0 0 auto;
}

.personCard__avatarImg {
    width: 100%;
    height: 100%;
}

.personCard__avatarPh {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.18), rgba(30, 91, 255, 0.06));
}

.personCard__meta {
    min-width: 0;
    flex: 1 1 auto;
}

.personCard__name {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    line-height: 1.1;
}

.personCard__role {
    margin-top: 10rpx;
    font-size: 24rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.personCard__time {
    flex: 0 0 auto;
    font-size: 22rpx;
    color: var(--app-text-muted);
    font-weight: 800;
    margin-top: -18rpx;
}

.personCard__facts {
    margin-top: 16rpx;
    display: flex;
    gap: 12rpx;
    align-items: center;
}

:deep(.factTag) {
    height: 40rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 22rpx !important;
    color: var(--app-text-muted) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    border-color: rgba(0, 0, 0, 0.06) !important;
}

:deep(.factTag--exp) {
    background: rgba(0, 0, 0, 0.06) !important;
    border-color: rgba(0, 0, 0, 0.08) !important;
}

:deep(.factTag--edu) {
    background: rgba(30, 91, 255, 0.06) !important;
    border-color: rgba(30, 91, 255, 0.12) !important;
    color: var(--app-primary) !important;
}

:deep(.factTag--loc) {
    background: rgba(255, 170, 60, 0.08) !important;
    border-color: rgba(255, 140, 40, 0.14) !important;
    color: var(--app-accent) !important;
}

.newsList {
    margin-top: 10rpx;
    border-radius: var(--app-radius-md);
    background: var(--app-surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
}

.newsCard {
    display: flex;
    gap: 16rpx;
    padding: 18rpx 18rpx;
}

.newsCard+.newsCard {
    border-top: 1px solid var(--app-line);
}

.newsCard--pressed {
    background: rgba(0, 0, 0, 0.02);
}

.newsCard__thumb {
    width: 184rpx;
    height: 116rpx;
    border-radius: var(--app-radius-md);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
    flex: 0 0 auto;
}

.newsCard__img {
    width: 100%;
    height: 100%;
}

.newsCard__ph {
    width: 100%;
    height: 100%;
    background:
        linear-gradient(180deg, rgba(9, 30, 66, 0.16), rgba(9, 30, 66, 0.06)),
        linear-gradient(90deg, rgba(30, 91, 255, 0.24), rgba(30, 91, 255, 0));
}

.newsCard__main {
    flex: 1 1 auto;
    min-width: 0;
    padding-top: 2rpx;
}

.newsCard__title {
    font-size: 28rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.newsCard__desc {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: var(--app-text-muted);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
