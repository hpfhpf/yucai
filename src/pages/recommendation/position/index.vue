<template>
    <view class="page">
        <HeaderNav title="全职岗位" type="show-back" theme="000" />
        <view class="search">
            <FaIcon name="magnifying-glass" :size="32" color="rgba(0, 0, 0, 0.28)" />
            <wd-input v-model="keyword" compact custom-class="search__input" placeholder="请输入关键词、职位"
                @confirm="handleSearchConfirm" />
        </view>

        <view id="position-filters" class="filters">
            <view class="chip" :class="{ 'chip--active': areaPopupOpen || !!areaSelectedLabel }"
                hover-class="chip--pressed" @click="openAreaFilter">
                <view class="chip__text">{{ areaDisplay }}</view>
                <FaIcon :name="areaPopupOpen ? 'chevron-up' : 'chevron-down'" :size="20" :color="areaPopupOpen || areaSelectedLabel ? 'var(--app-primary)' : 'rgba(0, 0, 0, 0.36)'" />
            </view>
            <view class="chip" :class="{ 'chip--active': industryPopupOpen || !!industrySelected }"
                hover-class="chip--pressed" @click="openIndustryFilter">
                <view class="chip__text">{{ industryDisplay }}</view>
                <FaIcon :name="industryPopupOpen ? 'chevron-up' : 'chevron-down'" :size="20" :color="industryPopupOpen || industrySelected ? 'var(--app-primary)' : 'rgba(0, 0, 0, 0.36)'" />
            </view>
            <view class="chip" :class="{ 'chip--active': salaryPopupOpen || !!salarySelected }"
                hover-class="chip--pressed" @click="openSalaryFilter">
                <view class="chip__text">{{ salaryDisplay }}</view>
                <FaIcon :name="salaryPopupOpen ? 'chevron-up' : 'chevron-down'" :size="20" :color="salaryPopupOpen || salarySelected ? 'var(--app-primary)' : 'rgba(0, 0, 0, 0.36)'" />
            </view>
            <view class="chip" hover-class="chip--pressed" @click="handleFilterTap('more')">
                <view class="chip__text">更多筛选</view>
                <FaIcon name="chevron-down" :size="20" color="rgba(0, 0, 0, 0.36)" />
            </view>
        </view>

        <AreaFilterPopup v-model="areaPopupOpen" :top="areaPopupTop" :options="areaOptions"
            v-model:leftValue="areaLeftValue" v-model:rightValue="areaRightValue" @confirm="handleAreaConfirm" />

        <IndustryFilterPopup v-model="industryPopupOpen" :top="industryPopupTop" :options="industryOptions"
            v-model:selected="industrySelected" @confirm="handleIndustryConfirm" />

        <SalaryFilterPopup v-model="salaryPopupOpen" :top="salaryPopupTop" :options="salaryOptions"
            v-model:selected="salarySelected" @confirm="handleSalaryConfirm" />

        <scroll-view class="list" scroll-y>
            <view class="list__inner">
                <view v-for="job in jobs" :key="job.id" class="jobCard" hover-class="jobCard--pressed">
                    <wd-checkbox :model-value="isSelected(job.id)" shape="circle"
                        checked-color="rgba(30, 91, 255, 0.98)" custom-class="jobCard__check"
                        @change="toggleJob(job.id)" />

                    <view class="jobCard__main">
                        <view class="jobCard__top" @click="goPageJobDetail(job.id)">
                            <view class="jobCard__name">{{ job.name }}</view>
                            <view class="jobCard__salary">{{ job.salary }}</view>
                        </view>
                        <view class="jobCard__tags">
                            <wd-tag size="small" plain custom-class="jobTag">{{ job.district }}</wd-tag>
                            <wd-tag size="small" plain custom-class="jobTag">{{ job.education }}</wd-tag>
                            <wd-tag size="small" plain custom-class="jobTag">{{ job.gender }}</wd-tag>
                        </view>
                        <view class="jobCard__bottom">
                            <view class="jobCard__company">{{ job.company }}</view>
                            <view class="jobCard__time">{{ job.time }}</view>
                        </view>
                    </view>
                </view>

                <view class="list__pad" :style="{ height: `${safeBottom + 128}px` }" />
            </view>
        </scroll-view>

        <view class="bottomBar" :style="{ paddingBottom: `${safeBottom}px` }">
            <view class="opts-box">
                <view class="bottomBar__left" hover-class="bottomBar__left--pressed" @click="toggleAll">
                    <wd-checkbox :model-value="allSelected" shape="circle" checked-color="rgba(30, 91, 255, 0.98)"
                        custom-class="bottomBar__check" @click.stop />
                    <view class="bottomBar__label">全选</view>
                </view>

                <view class="bottomBar__star" hover-class="bottomBar__star--pressed" @click="handleStarTap">
                    <FaIcon name="star" :size="38" color="rgba(0, 0, 0, 0.26)" />
                </view>
            </view>

            <view class="bottomBar__right">
                <wd-button type="primary" block @click="handleDeliverAll">
                    全部投递
                </wd-button>
            </view>
        </view>

        <wd-toast selector="posToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import AreaFilterPopup from './components/AreaFilterPopup.vue'
import IndustryFilterPopup from './components/IndustryFilterPopup.vue'
import SalaryFilterPopup from './components/SalaryFilterPopup.vue'
import { createSelectorQuery } from '@/utils/uni'
import HeaderNav from '@/components/HeaderNav.vue'
import { goPageJobDetail } from '@/utils/route'

const toast = useToast('posToast')

type Job = {
    id: string
    name: string
    salary: string
    district: string
    education: string
    gender: string
    company: string
    time: string
}

type AreaFilterOption = {
    label: string
    value: string
    children?: AreaFilterOption[]
}

type IndustryFilterOption = {
    label: string
    value: string
}

type SalaryFilterOption = {
    label: string
    value: string
}

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)
const keyword = ref('')

const areaPopupOpen = ref(false)
const areaPopupTop = ref(0)
const areaLeftValue = ref('')
const areaRightValue = ref('')
const areaSelectedLabel = ref('')

const areaOptions = ref<AreaFilterOption[]>([
    {
        label: '全成都',
        value: 'cd',
        children: [{ label: '全成都', value: 'cd-all' }],
    },
    {
        label: '高新区',
        value: 'gxq',
        children: [
            { label: '全高新区', value: 'gxq-all' },
            { label: '金融城', value: 'gxq-jrc' },
            { label: '天府软件园', value: 'gxq-tfrjy' },
        ],
    },
    {
        label: '青羊区',
        value: 'qyq',
        children: [
            { label: '全青羊区', value: 'qyq-all' },
            { label: '天府广场', value: 'qyq-tfgc' },
            { label: '光华', value: 'qyq-gh' },
            { label: '太升路', value: 'qyq-tsl' },
        ],
    },
    {
        label: '武侯区',
        value: 'whq',
        children: [
            { label: '全武侯区', value: 'whq-all' },
            { label: '桐梓林', value: 'whq-tzl' },
            { label: '红牌楼', value: 'whq-hpl' },
        ],
    },
    {
        label: '金牛区',
        value: 'jnq',
        children: [
            { label: '全金牛区', value: 'jnq-all' },
            { label: '茶店子', value: 'jnq-cdz' },
        ],
    },
    {
        label: '温江区',
        value: 'wjq',
        children: [{ label: '全温江区', value: 'wjq-all' }],
    },
])

const areaDisplay = computed(() => areaSelectedLabel.value || '工作区域')

const industryPopupOpen = ref(false)
const industryPopupTop = ref(0)
const industrySelected = ref('')
const industryOptions = ref<IndustryFilterOption[]>([
    { label: '中餐', value: 'china' },
    { label: '西餐', value: 'western' },
    { label: '网咖', value: 'netcafe' },
    { label: '酒店', value: 'hotel' },
    { label: '咖啡', value: 'coffee' },
    { label: '奶茶', value: 'tea' },
    { label: '快餐', value: 'fast' },
    { label: '火锅', value: 'hotpot' },
    { label: '烘焙', value: 'bakery' },
    { label: '其它', value: 'other' },
])

const industryDisplay = computed(() => {
    const item = industryOptions.value.find((x) => x.value === industrySelected.value)
    return item?.label || '全部行业'
})

const salaryPopupOpen = ref(false)
const salaryPopupTop = ref(0)
const salarySelected = ref('')
const salaryOptions = ref<SalaryFilterOption[]>([
    { label: '面议', value: 'negotiable' },
    { label: '1k以下', value: 'lt1k' },
    { label: '1k–2k', value: '1-2k' },
    { label: '2k–3k', value: '2-3k' },
    { label: '3k–4k', value: '3-4k' },
    { label: '4k–5k', value: '4-5k' },
    { label: '5k以上', value: 'gt5k' },
])

const salaryDisplay = computed(() => {
    const item = salaryOptions.value.find((x) => x.value === salarySelected.value)
    return item?.label || '薪资范围'
})

const measureFiltersBottom = async () => {
    await nextTick()
    return await new Promise<number>((resolve) => {
        createSelectorQuery()
            .select('#position-filters')
            .boundingClientRect((rect: any) => {
                resolve(rect && typeof rect.bottom === 'number' ? rect.bottom : 88)
            })
            .exec()
    })
}

const openAreaFilter = async () => {
    industryPopupOpen.value = false
    salaryPopupOpen.value = false
    areaPopupTop.value = await measureFiltersBottom()
    areaPopupOpen.value = true
}

const handleAreaConfirm = (payload: { leftValue: string; rightValue: string; leftLabel: string; rightLabel: string }) => {
    const name = (payload.rightLabel || payload.leftLabel || '').trim()
    if (!name) {
        areaSelectedLabel.value = ''
        toast.info('请选择有效区域')
        return
    }
    areaSelectedLabel.value = name
    toast.info(name)
}

const openIndustryFilter = async () => {
    areaPopupOpen.value = false
    salaryPopupOpen.value = false
    industryPopupTop.value = await measureFiltersBottom()
    industryPopupOpen.value = true
}

const handleIndustryConfirm = (payload: { value: string; label: string }) => {
    industrySelected.value = payload.value
    toast.info(payload.label)
}

const openSalaryFilter = async () => {
    areaPopupOpen.value = false
    industryPopupOpen.value = false
    salaryPopupTop.value = await measureFiltersBottom()
    salaryPopupOpen.value = true
}

const handleSalaryConfirm = (payload: { value: string; label: string }) => {
    salarySelected.value = payload.value
    toast.info(payload.label)
}

const jobs = ref<Job[]>([
    { id: 'j1', name: '会计主管', salary: '10K-12K', district: '青羊区', education: '学历不限', gender: '男女不限', company: '连锁餐厅', time: '12:26发布' },
    { id: 'j2', name: '工业设计师', salary: '7K-9K', district: '青羊区', education: '学历不限', gender: '男女不限', company: '连锁餐厅', time: '12:26发布' },
    { id: 'j3', name: '会计主管', salary: '10K-12K', district: '青羊区', education: '学历不限', gender: '男女不限', company: '连锁餐厅', time: '12:26发布' },
    { id: 'j4', name: '会计主管', salary: '10K-12K', district: '青羊区', education: '学历不限', gender: '男女不限', company: '连锁餐厅', time: '12:26发布' },
])

const selectedIds = ref<string[]>(['j1'])

const isSelected = (id: string) => selectedIds.value.includes(id)

const toggleJob = (id: string) => {

    if (isSelected(id)) {
        selectedIds.value = selectedIds.value.filter((x) => x !== id)
        return
    }
    selectedIds.value = [...selectedIds.value, id]
}

const allSelected = computed(() => selectedIds.value.length > 0 && selectedIds.value.length === jobs.value.length)

const toggleAll = () => {
    if (allSelected.value) {
        selectedIds.value = []
        return
    }
    selectedIds.value = jobs.value.map((j) => j.id)
}

const handleDeliverAll = () => {
    if (selectedIds.value.length === 0) {
        toast.info('请选择岗位')
        return
    }
    toast.info(`已投递 ${selectedIds.value.length} 个岗位`)
}

const handleStarTap = () => {
    toast.info('收藏')
}

const handleSearchConfirm = () => {
    const text = keyword.value.trim()
    toast.info(text ? `搜索：${text}` : '请输入关键词')
}

const handleFilterTap = (key: string) => {
    const map: Record<string, string> = { more: '更多筛选' }
    toast.info(map[key] || key)
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell(var(--app-bg));
}

.search {
    margin: 14rpx 22rpx 0;
    height: 78rpx;
    border-radius: var(--app-radius-pill);
    background: var(--app-surface-strong);
    border: 1px solid var(--app-line);
    display: flex;
    align-items: center;
    gap: 14rpx;
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
        color: var(--app-text-primary) !important;
    }

    .uni-input-placeholder {
        color: var(--app-text-secondary) !important;
        font-size: 28rpx;
    }
}

.filters {
    margin: 14rpx 22rpx 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14rpx;
}

.chip {
    height: 62rpx;
    border-radius: var(--app-radius-md);
    background: var(--app-surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: 0 10rpx 26rpx rgba(30, 60, 140, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
}

.chip--pressed {
    @include app-pressable-active(0.99, 0.94);
}

.chip__text {
    font-size: 24rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.chip--active {
    background: var(--app-surface-strong);
    border-color: rgba(30, 91, 255, 0.12);
}

.chip--active .chip__text {
    color: var(--app-primary);
}

.list {
    flex: 1 1 auto;
}

.list__inner {
    padding: 16rpx 22rpx 0;
    box-sizing: border-box;
}

.jobCard {
    @include app-card-base(var(--app-radius-lg), var(--app-surface), var(--app-shadow-card));
    border: 1px solid rgba(255, 255, 255, 0.86);
    padding: 22rpx 22rpx 20rpx;
    display: flex;
    align-items: flex-start;
    gap: 18rpx;
}

.jobCard+.jobCard {
    margin-top: 18rpx;
}

.jobCard--pressed {
    @include app-pressable-active(0.99, 0.94);
}

:deep(.jobCard__check) {
    margin-top: 8rpx;
    flex: 0 0 auto;
}

.jobCard__main {
    flex: 1;
    min-width: 0;
}

.jobCard__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__name {
    font-size: 34rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.jobCard__salary {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-accent);
    flex: 0 0 auto;
}

.jobCard__tags {
    margin-top: 14rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

:deep(.jobTag) {
    height: 44rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    border-color: rgba(0, 0, 0, 0.06) !important;
    font-size: 24rpx !important;
    color: var(--app-text-secondary) !important;
}

.jobCard__bottom {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__company {
    font-size: 26rpx;
    color: var(--app-text-muted);
}

.jobCard__time {
    font-size: 26rpx;
    color: var(--app-text-muted);
}

.list__pad {
    width: 1px;
}

.bottomBar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--app-surface-strong);
    border-top: 1px solid var(--app-line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 22rpx 0;
    box-sizing: border-box;

    .opts-box {
        display: flex;
        justify-content: flex-start;
        gap: 16rpx;
    }
}

.bottomBar__left {
    display: flex;
    align-items: center;
    gap: 14rpx;
    padding: 14rpx 10rpx;
    border-radius: var(--app-radius-md);
}

.bottomBar__left--pressed {
    background: rgba(0, 0, 0, 0.04);
}

:deep(.bottomBar__check) {
    flex: 0 0 auto;
}

.bottomBar__label {
    font-size: 28rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.bottomBar__star {
    width: 88rpx;
    height: 88rpx;
    border-radius: var(--app-radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.bottomBar__star--pressed {
    background: rgba(0, 0, 0, 0.04);
}

.bottomBar__right {
    width: 260rpx;
}
</style>
