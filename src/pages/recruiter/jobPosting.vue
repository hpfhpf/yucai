<template>
    <view class="page">
        <HeaderNav :title="editId ? '编辑职位' : '职位发布'" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 160}px` }">
                <view class="card">
                    <view class="formRow">
                        <view class="formRow__label">职位名称</view>
                        <view class="formRow__field">
                            <wd-input v-model="form.title" compact custom-class="formInput" placeholder="请填写" />
                        </view>
                    </view>
                    <view class="divider" />

                    <view class="formRow">
                        <view class="formRow__label">工作性质</view>
                        <view class="formRow__field">
                            <view class="natureGroup">
                                <view v-for="opt in natureOptions" :key="opt.value"
                                    class="natureBtn"
                                    :class="{ 'natureBtn--on': form.nature === opt.value }"
                                    @click="form.nature = opt.value">
                                    {{ opt.label }}
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="divider" />

                    <view class="formRow">
                        <view class="formRow__label">工作地址</view>
                        <view class="formRow__field">
                            <view class="addr">
                                <view class="addr__item" hover-class="addr__item--pressed"
                                    @click="openSheet('province')">
                                    <view class="addr__text" :class="{ 'addr__text--ph': !form.province }">
                                        {{ form.province || '选择省' }}
                                    </view>
                                    <FaIcon name="chevron-down" :size="20" color="rgba(0, 0, 0, 0.20)" />
                                </view>
                                <view class="addr__item" hover-class="addr__item--pressed" @click="openSheet('city')">
                                    <view class="addr__text" :class="{ 'addr__text--ph': !form.city }">
                                        {{ form.city || '选择市' }}
                                    </view>
                                    <FaIcon name="chevron-down" :size="20" color="rgba(0, 0, 0, 0.20)" />
                                </view>
                                <view class="addr__item" hover-class="addr__item--pressed"
                                    @click="openSheet('district')">
                                    <view class="addr__text" :class="{ 'addr__text--ph': !form.district }">
                                        {{ form.district || '选择区' }}
                                    </view>
                                    <FaIcon name="chevron-down" :size="20" color="rgba(0, 0, 0, 0.20)" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="divider" />

                    <view class="formRow">
                        <view class="formRow__label">详细地址</view>
                        <view class="formRow__field">
                            <wd-input v-model="form.addressDetail" compact custom-class="formInput" placeholder="请输入" />
                        </view>
                    </view>
                    <view class="divider" />

                    <view class="formRow formRow--tap" hover-class="formRow--pressed" @click="openSheet('salary')">
                        <view class="formRow__label">薪资范围</view>
                        <view class="formRow__field">
                            <view class="formRow__value" :class="{ 'formRow__value--ph': !form.salary }">
                                {{ form.salary || '请选择' }}
                            </view>
                        </view>
                        <FaIcon name="chevron-down" :size="22" color="rgba(0, 0, 0, 0.20)" />
                    </view>
                    <view class="divider" />

                    <view class="formRow formRow--tap" hover-class="formRow--pressed" @click="openSheet('education')">
                        <view class="formRow__label">最低学历</view>
                        <view class="formRow__field">
                            <view class="formRow__value" :class="{ 'formRow__value--ph': !form.education }">
                                {{ form.education || '请选择' }}
                            </view>
                        </view>
                        <FaIcon name="chevron-down" :size="22" color="rgba(0, 0, 0, 0.20)" />
                    </view>
                    <view class="divider" />

                    <view class="formRow formRow--tap" hover-class="formRow--pressed" @click="openSheet('experience')">
                        <view class="formRow__label">工作年限</view>
                        <view class="formRow__field">
                            <view class="formRow__value" :class="{ 'formRow__value--ph': !form.experience }">
                                {{ form.experience || '请选择' }}
                            </view>
                        </view>
                        <FaIcon name="chevron-down" :size="22" color="rgba(0, 0, 0, 0.20)" />
                    </view>
                </view>

                <view class="card card--block">
                    <view class="blockTitle">职位描述</view>
                    <wd-textarea v-model="form.description" compact custom-class="descInput" placeholder="请输入"
                        auto-height />
                </view>

                <view class="card card--block">
                    <view class="blockTitle">职位诱惑</view>
                    <view class="tags">
                        <wd-tag v-for="tag in tagOptions" :key="tag" plain
                            :custom-class="selectedTagsSet.has(tag) ? 'perkTag perkTag--on' : 'perkTag'"
                            @click="toggleTag(tag)">
                            {{ tag }}
                        </wd-tag>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="bottomBar" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button plain custom-class="barBtn barBtn--ghost" @click="handlePreview">预览职位</wd-button>
            <wd-button type="primary" custom-class="barBtn barBtn--primary" :loading="publishing" @click="handlePublish">{{ editId ? '保存职位' : '发布职位' }}</wd-button>
        </view>

        <wd-popup v-model="sheetShown" position="bottom" :close-on-click-modal="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: rgba(255, 255, 255, 0.98);">
            <view class="sheetContent">
                <view class="sheetContent__title">{{ sheetTitle }}</view>
                <scroll-view class="sheetContent__list" scroll-y>
                    <view v-for="opt in sheetOptions" :key="opt" class="sheetContent__item"
                        hover-class="sheetContent__item--pressed" @click="selectSheetValue(opt)">
                        <view class="sheetContent__text">{{ opt }}</view>
                        <FaIcon name="check" :size="28" color="rgba(30, 91, 255, 0.92)" />
                    </view>
                </scroll-view>
                <view class="sheetContent__footer">
                    <wd-button plain block custom-class="sheetCancelBtn" @click="closeSheet">取消</wd-button>
                </view>
            </view>
        </wd-popup>

        <!-- 预览弹窗 -->
        <wd-popup v-model="previewShown" position="bottom" :safe-area-inset-bottom="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: #eef3ff; max-height: 80vh; overflow-y: auto;">
            <view class="previewPanel">
                <view class="previewPanel__hd">
                    <view class="previewPanel__title">职位预览</view>
                    <view class="previewPanel__close" @click="previewShown = false">
                        <FaIcon name="xmark" :size="26" color="rgba(0,0,0,0.34)" />
                    </view>
                </view>
                <view class="previewCard">
                    <view class="previewCard__top">
                        <view class="previewCard__name">{{ form.title || '职位名称' }}</view>
                        <view class="previewCard__salary">{{ form.salary || '薪资面议' }}</view>
                    </view>
                    <view class="previewCard__tags">
                        <wd-tag size="small">{{ natureOptions.find(o => o.value === form.nature)?.label }}</wd-tag>
                        <wd-tag size="small" v-if="form.city">{{ form.city }}</wd-tag>
                        <wd-tag size="small" v-if="form.education">{{ form.education }}</wd-tag>
                        <wd-tag size="small" v-if="form.experience">{{ form.experience }}</wd-tag>
                    </view>
                    <view class="previewCard__divider" />
                    <view class="previewCard__section">
                        <view class="previewCard__label">工作地址</view>
                        <view class="previewCard__text">{{ [form.province, form.city, form.district, form.addressDetail].filter(Boolean).join(' ') || '未填写' }}</view>
                    </view>
                    <view class="previewCard__divider" />
                    <view class="previewCard__section">
                        <view class="previewCard__label">职位描述</view>
                        <view class="previewCard__text">{{ form.description || '未填写' }}</view>
                    </view>
                    <view v-if="form.tags.length" class="previewCard__perks">
                        <wd-tag v-for="t in form.tags" :key="t" type="success" size="small">{{ t }}</wd-tag>
                    </view>
                </view>
            </view>
        </wd-popup>

        <wd-toast selector="jobPostingToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiCreateJob, apiUpdateJob, apiGetJobDetail } from '@/api/index'

const toast = useToast('jobPostingToast')

type JobNature = 'full' | 'part' | 'intern'
type SheetKey = 'province' | 'city' | 'district' | 'salary' | 'education' | 'experience'

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

const form = ref({
    title: '',
    nature: 'part' as JobNature,
    province: '',
    city: '',
    district: '',
    addressDetail: '',
    salary: '',
    education: '',
    experience: '',
    description: '',
    tags: ['五险一金'] as string[],
})

const natureOptions = [
    { label: '全职', value: 'full' as const },
    { label: '兼职', value: 'part' as const },
    { label: '实习', value: 'intern' as const },
]

const provinceOptions = ['四川省', '北京市', '上海市', '广东省'] as const
const cityMap: Record<string, string[]> = {
    四川省: ['成都市', '绵阳市', '德阳市'],
    北京市: ['北京市'],
    上海市: ['上海市'],
    广东省: ['广州市', '深圳市', '佛山市'],
}
const districtMap: Record<string, string[]> = {
    成都市: ['高新区', '锦江区', '武侯区', '青羊区'],
    北京市: ['朝阳区', '海淀区', '东城区', '西城区'],
    上海市: ['浦东新区', '徐汇区', '静安区'],
    广州市: ['天河区', '越秀区', '海珠区'],
    深圳市: ['南山区', '福田区', '罗湖区'],
    佛山市: ['禅城区', '南海区'],
    绵阳市: ['涪城区', '游仙区'],
    德阳市: ['旌阳区'],
}

const salaryOptions = ['3k-5k', '5k-8k', '8k-12k', '12k-20k', '20k以上', '面议']
const educationOptions = ['不限', '大专', '本科', '硕士', '博士']
const experienceOptions = ['不限', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上']

const tagOptions = ['周末双休', '五险一金', '弹性工作', '出国旅游', '免费体检']
const selectedTagsSet = computed(() => new Set(form.value.tags))

const toggleTag = (tag: string) => {
    const next = new Set(form.value.tags)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    form.value.tags = Array.from(next)
}

const sheetKey = ref<SheetKey>('salary')
const sheetTitle = ref('')
const sheetOptions = ref<string[]>([])
const sheetValue = ref('')
const sheetShown = ref(false)

const openSheet = (key: SheetKey) => {
    sheetKey.value = key
    if (key === 'province') {
        sheetTitle.value = '选择省'
        sheetOptions.value = Array.from(provinceOptions)
        sheetValue.value = form.value.province
    } else if (key === 'city') {
        sheetTitle.value = '选择市'
        sheetOptions.value = cityMap[form.value.province] || []
        sheetValue.value = form.value.city
        if (!form.value.province) {
            toast.info('请先选择省')
            return
        }
    } else if (key === 'district') {
        sheetTitle.value = '选择区'
        sheetOptions.value = districtMap[form.value.city] || []
        sheetValue.value = form.value.district
        if (!form.value.city) {
            toast.info('请先选择市')
            return
        }
    } else if (key === 'salary') {
        sheetTitle.value = '薪资范围'
        const opts = [...salaryOptions]
        if (form.value.salary && !opts.includes(form.value.salary)) {
            opts.unshift(form.value.salary)
        }
        sheetOptions.value = opts
        sheetValue.value = form.value.salary
    } else if (key === 'education') {
        sheetTitle.value = '最低学历'
        sheetOptions.value = educationOptions
        sheetValue.value = form.value.education
    } else if (key === 'experience') {
        sheetTitle.value = '工作年限'
        sheetOptions.value = experienceOptions
        sheetValue.value = form.value.experience
    }
    sheetShown.value = true
}

const closeSheet = () => {
    sheetShown.value = false
}

const selectSheetValue = (v: string) => {
    sheetValue.value = v
    const key = sheetKey.value
    if (key === 'province') {
        if (form.value.province !== v) {
            form.value.province = v
            form.value.city = ''
            form.value.district = ''
        }
    } else if (key === 'city') {
        if (form.value.city !== v) {
            form.value.city = v
            form.value.district = ''
        }
    } else if (key === 'district') {
        form.value.district = v
    } else if (key === 'salary') {
        form.value.salary = v
    } else if (key === 'education') {
        form.value.education = v
    } else if (key === 'experience') {
        form.value.experience = v
    }
    closeSheet()
}

const validateForm = () => {
    const title = form.value.title.trim()
    if (!title) return '请填写职位名称'
    if (!form.value.province) return '请选择省'
    if (!form.value.city) return '请选择市'
    if (!form.value.district) return '请选择区'
    if (!form.value.salary) return '请选择薪资范围'
    if (!form.value.education) return '请选择最低学历'
    if (!form.value.experience) return '请选择工作年限'
    if (!form.value.description.trim()) return '请填写职位描述'
    return ''
}

const natureEnumMap: Record<string, string> = {
    full: 'FULL_TIME',
    part: 'PART_TIME',
    intern: 'INTERNSHIP',
}

const educationEnumMap: Record<string, string> = {
    '不限': 'ANY',
    '大专': 'ASSOCIATE',
    '本科': 'BACHELOR',
    '硕士': 'MASTER',
    '博士': 'DOCTOR',
}

const experienceYearsMap: Record<string, number> = {
    '不限': 0,
    '1年以内': 0,
    '1-3年': 1,
    '3-5年': 3,
    '5-10年': 5,
    '10年以上': 10,
}

const previewShown = ref(false)

const handlePreview = () => {
    const err = validateForm()
    if (err) {
        toast.info(err)
        return
    }
    previewShown.value = true
}

const publishing = ref(false)
const editId = ref('')

const natureEnumReverseMap: Record<string, JobNature> = {
    FULL_TIME: 'full', PART_TIME: 'part', INTERNSHIP: 'intern',
}
const educationReverseMap: Record<string, string> = {
    ANY: '不限', ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}
const experienceReverseMap: Record<number, string> = {
    0: '不限', 1: '1-3年', 3: '3-5年', 5: '5-10年', 10: '10年以上',
}

onMounted(async () => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    const eid = currentPage?.options?.editId || ''
    if (!eid) return
    editId.value = eid
    try {
        const job: any = await apiGetJobDetail(eid)
        form.value.title = job.title || ''
        form.value.nature = natureEnumReverseMap[job.nature] || 'full'
        form.value.province = job.province || ''
        form.value.city = job.city || ''
        form.value.district = job.district || ''
        form.value.addressDetail = job.address || ''
        form.value.salary = job.salaryRange || ''
        form.value.education = educationReverseMap[job.minDegree] || ''
        form.value.experience = experienceReverseMap[job.minExpYears] || '不限'
        form.value.description = job.description || ''
        form.value.tags = job.perks || []
    } catch { /* ignore */ }
})

const handlePublish = async () => {
    const err = validateForm()
    if (err) {
        toast.info(err)
        return
    }

    publishing.value = true
    try {
        const payload = {
            title: form.value.title.trim(),
            nature: natureEnumMap[form.value.nature],
            province: form.value.province,
            city: form.value.city,
            district: form.value.district,
            address: form.value.addressDetail.trim() || undefined,
            salaryRange: form.value.salary,
            minDegree: educationEnumMap[form.value.education],
            minExpYears: experienceYearsMap[form.value.experience] ?? 0,
            description: form.value.description.trim(),
            perks: form.value.tags,
        }
        if (editId.value) {
            await apiUpdateJob(editId.value, payload)
            toast.success('保存成功')
        } else {
            await apiCreateJob(payload)
            toast.success('发布成功')
        }
        setTimeout(() => uni.navigateBack(), 1200)
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        publishing.value = false
    }
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #dfe7ff 0%, var(--app-bg) 42%, var(--app-bg) 100%);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 24rpx;
    box-sizing: border-box;
}

.card {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.88);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
}

.card+.card {
    margin-top: 18rpx;
}

.card--block {
    padding: 18rpx 22rpx 18rpx;
    box-sizing: border-box;
}

.formRow {
    height: 96rpx;
    padding: 0 22rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-sizing: border-box;
}

.formRow--pressed {
    background: rgba(0, 0, 0, 0.02);
}

.formRow__label {
    width: 148rpx;
    flex: 0 0 auto;
    font-size: 28rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.formRow__field {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

:deep(.formInput) {
    flex: 1;
    min-width: 0;
    height: 96rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 96rpx;
        font-size: 28rpx;
        color: var(--app-text-primary) !important;
    }

    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 28rpx;
    }
}

.formRow__value {
    width: 100%;
    font-size: 28rpx;
    font-weight: 750;
    color: var(--app-text-primary);
}

.formRow__value--ph {
    color: var(--app-text-muted);
    font-weight: 700;
}

.divider {
    height: 1px;
    background: var(--app-line);
    margin-left: 22rpx;
}

:deep(.segGroup) {
    display: flex !important;
    gap: 16rpx;

    .wd-radio {
        margin-right: 0 !important;
    }

    .wd-radio__label {
        min-width: 96rpx;
        height: 54rpx;
        border-radius: var(--app-radius-sm) !important;
        background: rgba(0, 0, 0, 0.03) !important;
        border: 1px solid rgba(0, 0, 0, 0.04) !important;
        font-size: 26rpx !important;
        font-weight: 900 !important;
        color: var(--app-text-muted) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 18rpx !important;
        box-sizing: border-box;
    }

    .wd-radio--button.is-checked .wd-radio__label {
        background: rgba(30, 91, 255, 0.98) !important;
        border-color: rgba(30, 91, 255, 0.30) !important;
        color: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 12rpx 28rpx rgba(30, 91, 255, 0.22) !important;
    }

    .wd-radio__shape {
        display: none !important;
    }
}

.addr {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.addr__item {
    flex: 1 1 0;
    height: 54rpx;
    border-radius: var(--app-radius-sm);
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14rpx;
    box-sizing: border-box;
}

.addr__item--pressed {
    opacity: 0.9;
}

.addr__text {
    font-size: 24rpx;
    font-weight: 850;
    color: var(--app-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1 1 auto;
}

.addr__text--ph {
    color: var(--app-text-muted);
    font-weight: 700;
}

.blockTitle {
    font-size: 28rpx;
    font-weight: 900;
    color: var(--app-text-secondary);
    margin-bottom: 14rpx;
}

:deep(.descInput) {
    width: 100%;
    min-height: 160rpx;
    background: transparent !important;

    .wd-textarea__inner {
        min-height: 160rpx;
        font-size: 28rpx;
        color: var(--app-text-primary) !important;
        line-height: 1.65;
    }

    .uni-textarea-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 28rpx;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding-bottom: 2rpx;
}

:deep(.perkTag) {
    height: 60rpx !important;
    border-radius: var(--app-radius-sm) !important;
    background: rgba(0, 0, 0, 0.03) !important;
    border-color: rgba(0, 0, 0, 0.04) !important;
    font-size: 26rpx !important;
    font-weight: 900 !important;
    color: var(--app-text-muted) !important;
}

:deep(.perkTag--on) {
    background: rgba(30, 91, 255, 0.98) !important;
    border-color: rgba(30, 91, 255, 0.32) !important;
    color: rgba(255, 255, 255, 0.98) !important;
    box-shadow: 0 12rpx 28rpx rgba(30, 91, 255, 0.18) !important;
}

.bottomBar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18rpx 22rpx 20rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 18rpx;
    background: rgba(238, 244, 255, 0.92);
    backdrop-filter: blur(12rpx);
}

:deep(.barBtn) {
    flex: 1 1 0;
    height: 96rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 30rpx !important;
    font-weight: 900 !important;
    letter-spacing: 2rpx !important;
}

:deep(.barBtn--ghost) {
    background: rgba(255, 255, 255, 0.92) !important;
    color: rgba(30, 91, 255, 0.98) !important;
    border-color: rgba(30, 91, 255, 0.44) !important;
    box-shadow: 0 16rpx 46rpx rgba(30, 91, 255, 0.10) !important;
}

:deep(.barBtn--primary) {
    box-shadow: 0 18rpx 50rpx rgba(30, 91, 255, 0.26) !important;
}

.sheetContent {
    padding-bottom: env(safe-area-inset-bottom);
}

.sheetContent__title {
    padding: 18rpx 22rpx 12rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.sheetContent__list {
    max-height: 520rpx;
    max-height: 60vh;
}

.sheetContent__item {
    height: 92rpx;
    padding: 0 22rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.sheetContent__item+.sheetContent__item {
    border-top: 1px solid var(--app-line);
}

.sheetContent__item--pressed {
    background: rgba(0, 0, 0, 0.02);
}

.sheetContent__text {
    font-size: 28rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.sheetContent__footer {
    padding: 14rpx 22rpx 18rpx;
    box-sizing: border-box;
}

:deep(.sheetCancelBtn) {
    height: 84rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    color: var(--app-text-secondary) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
}

.natureGroup {
    display: flex;
    gap: 16rpx;
}

.natureBtn {
    min-width: 96rpx;
    height: 54rpx;
    border-radius: var(--app-radius-sm);
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.04);
    font-size: 26rpx;
    font-weight: 900;
    color: var(--app-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 18rpx;
    box-sizing: border-box;
}

.natureBtn--on {
    background: rgba(30, 91, 255, 0.98);
    border-color: rgba(30, 91, 255, 0.30);
    color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 12rpx 28rpx rgba(30, 91, 255, 0.22);
}

.previewPanel {
    padding: 22rpx 26rpx 30rpx;
    box-sizing: border-box;
}

.previewPanel__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18rpx;
}

.previewPanel__title {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.previewPanel__close {
    width: 52rpx;
    height: 52rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.previewCard {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.88);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx;
    box-sizing: border-box;
}

.previewCard__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12rpx;
    margin-bottom: 14rpx;
}

.previewCard__name {
    font-size: 34rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.previewCard__salary {
    font-size: 30rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.98);
    flex: 0 0 auto;
}

.previewCard__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 18rpx;
}

.previewCard__divider {
    height: 1px;
    background: var(--app-line);
    margin: 14rpx 0;
}

.previewCard__section {
    margin-bottom: 4rpx;
}

.previewCard__label {
    font-size: 24rpx;
    font-weight: 900;
    color: var(--app-text-muted);
    margin-bottom: 8rpx;
}

.previewCard__text {
    font-size: 28rpx;
    color: var(--app-text-secondary);
    line-height: 1.6;
}

.previewCard__perks {
    margin-top: 14rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}
</style>
