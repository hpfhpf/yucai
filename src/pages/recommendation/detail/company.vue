<template>
    <view class="page">
        <HeaderNav title="公司详情" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 32}px` }">
                <view class="hero">
                    <view class="hero__titleRow">
                        <view class="hero__name">{{ job.title }}</view>
                        <view class="hero__type">【全职】</view>
                    </view>
                    <view class="hero__metaRow">
                        <wd-tag size="small" plain custom-class="metaTag metaTag--pin">
                            <FaIcon name="location-dot" :size="22" style="margin-right: 4rpx" />
                            {{ job.city }}·{{ job.district }}
                        </wd-tag>
                        <wd-tag size="small" plain custom-class="metaTag">{{ job.education }}</wd-tag>
                        <wd-tag size="small" plain custom-class="metaTag">{{ job.exp }}</wd-tag>
                    </view>
                </view>

                <view class="score">
                    <view class="score__labels">
                        <view v-for="(lv, idx) in levelLabels" :key="lv.key" class="scoreLabel"
                            :class="{ 'scoreLabel--active': idx === activeLevelIndex }" @click="setLevel(idx)">
                            {{ lv.label }}
                        </view>
                    </view>

                    <view class="score__track">
                        <view class="score__line" />
                        <view class="score__fill" :style="{ width: `${activePercent}%` }" />
                        <view v-for="(v, idx) in tickValues" :key="v" class="scoreDot"
                            :style="{ left: `${(idx / (tickValues.length - 1)) * 100}%` }"
                            @click="setLevelFromTick(idx)">
                            <view class="scoreDot__inner"
                                :class="{ 'scoreDot__inner--active': idx <= activeTickIndex }" />
                        </view>
                        <!-- <view class="scorePill" :style="{ left: `${activePercent}%` }">
                            <view class="scorePill__inner">{{ levelLabels[activeLevelIndex]?.label }}</view>
                        </view> -->
                        <view class="scoreThumb" :style="{ left: `${activePercent}%` }"
                            @click="setLevel(activeLevelIndex)">
                            <view class="scoreThumb__inner" />
                        </view>
                    </view>

                    <view class="score__nums">
                        <view v-for="(v, idx) in tickValues" :key="v" class="scoreNum"
                            :style="{ left: `${(idx / (tickValues.length - 1)) * 100}%` }">
                            {{ v }}
                        </view>
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">工作地址</view>
                    <view class="photoCard" hover-class="photoCard--pressed" @click="handlePhotoTap">
                        <image v-if="company.cover" class="photoCard__img" :src="company.cover" mode="aspectFill" />
                        <view v-else class="photoCard__ph" />
                    </view>

                    <view class="subhead">
                        <view class="subhead__title">公司简介</view>
                        <view class="subhead__more" hover-class="subhead__more--pressed" @click="toggleIntro">
                            {{ introExpanded ? '收起' : '查看全部' }}
                        </view>
                    </view>
                    <view class="intro" :class="{ 'intro--clamp': !introExpanded }">
                        {{ company.intro }}
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">公司地址</view>
                    <view class="addressRow" hover-class="addressRow--pressed" @click="handleAddressTap">
                        <view class="addressRow__text">{{ company.address }}</view>
                        <FaIcon name="chevron-right" :size="28" color="rgba(0, 0, 0, 0.28)" />
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">在招职位</view>
                    <view class="jobList">
                        <view v-for="item in openJobs" :key="item.id" class="jobCard" hover-class="jobCard--pressed"
                            @click="handleJobTap(item.id)">
                            <view class="jobCard__top">
                                <view class="jobCard__name">{{ item.title }}</view>
                                <view class="jobCard__salary">{{ item.salary }}</view>
                            </view>
                            <view class="jobCard__tags">
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.district }}</wd-tag>
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.education }}</wd-tag>
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.gender }}</wd-tag>
                            </view>
                            <view class="jobCard__bottom">
                                <view class="jobCard__company">{{ company.name }}</view>
                                <view class="jobCard__time">{{ item.time }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <wd-toast selector="companyToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'

const toast = useToast('companyToast')

type ScoreLevel = {
    key: string
    label: string
}

type JobCard = {
    id: string
    title: string
    salary: string
    district: string
    education: string
    gender: string
    time: string
}

const job = ref({
    title: '前台财务',
    city: '成都',
    district: '高新区',
    education: '学历不限',
    exp: '2年',
})

const company = ref({
    name: '连锁餐厅',
    cover: '',
    address: '成都市·高新区·泰达时代中心一号楼14层',
    intro: '公司概况这里可以包括注册时间,注册资本,公司性质,技术力量规模,员工人数,员工素质等;',
})

const levelLabels = ref<ScoreLevel[]>([
    { key: 'poor', label: '较差' },
    { key: 'mid', label: '中等' },
    { key: 'good', label: '良好' },
    { key: 'great', label: '优秀' },
    { key: 'best', label: '极好' },
])

const tickValues = ref<number[]>([220, 350, 500, 650, 800, 1000])

const activeLevelIndex = ref(3)
const activePercent = computed(() => {
    const count = Math.max(levelLabels.value.length, 1)
    return ((activeLevelIndex.value + 0.5) / count) * 100
})

const activeTickIndex = computed(() => {
    return Math.min(Math.max(activeLevelIndex.value + 1, 0), tickValues.value.length - 1)
})

const setLevel = (idx: number) => {
    if (!Number.isFinite(idx)) return
    const next = Math.min(Math.max(Math.floor(idx), 0), levelLabels.value.length - 1)
    activeLevelIndex.value = next
}

const setLevelFromTick = (tickIndex: number) => {
    if (!Number.isFinite(tickIndex)) return
    setLevel(tickIndex - 1)
}

const introExpanded = ref(false)
const toggleIntro = () => {
    introExpanded.value = !introExpanded.value
}

const openJobs = ref<JobCard[]>([
    { id: 'j1', title: '会计主管', salary: '10K-12K', district: '青羊区', education: '学历不限', gender: '男女不限', time: '12:26发布' },
    { id: 'j2', title: '工业设计师', salary: '7K-9K', district: '青羊区', education: '学历不限', gender: '男女不限', time: '12:26发布' },
])

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

const handlePhotoTap = () => toast.info('查看图片')
const handleAddressTap = () => toast.info('打开地图')
const handleJobTap = (id: string) => toast.info(`职位：${id}`)
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, var(--app-bg) 36%, var(--app-bg) 100%);
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 30rpx;
    box-sizing: border-box;
}

.hero {
    padding: 10rpx 6rpx 16rpx;
}

.hero__titleRow {
    display: flex;
    align-items: baseline;
    gap: 14rpx;
}

.hero__name {
    font-size: 42rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    letter-spacing: 1rpx;
}

.hero__type {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-secondary);
}

.hero__metaRow {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    gap: 18rpx;
}

:deep(.metaTag) {
    height: 44rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    border-color: rgba(0, 0, 0, 0.05) !important;
    font-size: 24rpx !important;
    color: var(--app-text-secondary) !important;
}

:deep(.metaTag--pin) {
    background: rgba(30, 91, 255, 0.08) !important;
    border-color: rgba(30, 91, 255, 0.14) !important;
    color: rgba(30, 91, 255, 0.92) !important;
}

.score {
    margin-top: 8rpx;
    padding: 10rpx 6rpx 12rpx;
}

.score__labels {
    display: flex;
    justify-content: space-between;
    padding: 0 8rpx;
}

.scoreLabel {
    font-size: 24rpx;
    font-weight: 900;
    color: var(--app-text-muted);
}

.scoreLabel--active {
    color: rgba(30, 91, 255, 0.98);
}

.score__track {
    position: relative;
    margin-top: 18rpx;
    height: 54rpx;
}

.score__line {
    position: absolute;
    left: 6rpx;
    right: 6rpx;
    top: 22rpx;
    height: 10rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.18);
}

.score__fill {
    position: absolute;
    left: 6rpx;
    top: 22rpx;
    height: 10rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.90);
}

.scoreDot {
    position: absolute;
    top: 26rpx;
    transform: translate(-50%, -50%);
    width: 32rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.scoreDot__inner {
    width: 20rpx;
    height: 20rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.96);
    border: 4rpx solid rgba(30, 91, 255, 0.20);
    box-sizing: border-box;
}

.scoreDot__inner--active {
    border-color: rgba(30, 91, 255, 0.92);
    background: rgba(255, 255, 255, 0.98);
}

.scorePill {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
}

.scorePill__inner {
    height: 44rpx;
    padding: 0 18rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.98);
    color: #fff;
    font-size: 24rpx;
    font-weight: 900;
    display: flex;
    align-items: center;
    box-shadow: 0 12rpx 28rpx rgba(30, 91, 255, 0.22);
}

.scoreThumb {
    position: absolute;
    top: 26rpx;
    transform: translate(-50%, -50%);
    width: 38rpx;
    height: 38rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 10rpx 24rpx rgba(30, 60, 140, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
}

.scoreThumb__inner {
    width: 14rpx;
    height: 14rpx;
    border-radius: 999rpx;
    background: rgba(30, 91, 255, 0.98);
}

.score__nums {
    position: relative;
    margin-top: 12rpx;
    height: 26rpx;
}

.scoreNum {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    font-size: 22rpx;
    color: var(--app-text-muted);
    font-weight: 800;
}

.section {
    margin-top: 18rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    box-shadow: var(--app-shadow-card);
    border: 1px solid rgba(255, 255, 255, 0.72);
    padding: 18rpx 18rpx 18rpx;
}

.section__title {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    letter-spacing: 1rpx;
}

.photoCard {
    margin-top: 14rpx;
    border-radius: var(--app-radius-lg);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.photoCard--pressed {
    opacity: 0.94;
}

.photoCard__img {
    width: 100%;
    height: 240rpx;
}

.photoCard__ph {
    width: 100%;
    height: 240rpx;
    background:
        linear-gradient(180deg, rgba(9, 30, 66, 0.18), rgba(9, 30, 66, 0.06)),
        linear-gradient(90deg, rgba(30, 91, 255, 0.26), rgba(30, 91, 255, 0));
}

.subhead {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.subhead__title {
    font-size: 26rpx;
    font-weight: 900;
    color: var(--app-text-secondary);
}

.subhead__more {
    font-size: 24rpx;
    font-weight: 800;
    color: var(--app-text-muted);
    padding: 6rpx 10rpx;
    border-radius: var(--app-radius-md);
}

.subhead__more--pressed {
    background: rgba(0, 0, 0, 0.04);
}

.intro {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: var(--app-text-muted);
    line-height: 1.65;
}

.intro--clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.addressRow {
    margin-top: 14rpx;
    height: 92rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface-strong);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 0 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14rpx;
    box-sizing: border-box;
}

.addressRow--pressed {
    opacity: 0.94;
    transform: scale(0.995);
}

.addressRow__text {
    min-width: 0;
    font-size: 26rpx;
    color: var(--app-text-secondary);
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.jobList {
    margin-top: 14rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.jobCard {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 18rpx 18rpx 16rpx;
}

.jobCard--pressed {
    opacity: 0.94;
    transform: scale(0.995);
}

.jobCard__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__name {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.jobCard__salary {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-accent);
    flex: 0 0 auto;
}

.jobCard__tags {
    margin-top: 12rpx;
    display: flex;
    gap: 10rpx;
    flex-wrap: wrap;
}

:deep(.jobTag) {
    height: 40rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.035) !important;
    border-color: rgba(0, 0, 0, 0.05) !important;
    font-size: 22rpx !important;
    color: var(--app-text-muted) !important;
}

.jobCard__bottom {
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__company {
    font-size: 24rpx;
    color: var(--app-text-muted);
}

.jobCard__time {
    font-size: 24rpx;
    color: var(--app-text-muted);
}
</style>
