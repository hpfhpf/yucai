<template>
    <view class="page">
        <HeaderNav :title="isEditMode ? '编辑招聘者档案' : '招聘者档案'" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 200}px` }">

                <!-- 步骤指示器 -->
                <view class="stepper">
                    <view class="stepper__rail" />
                    <view class="stepper__progress" :style="{ width: stepProgress }" />
                    <view class="stepper__nodes">
                        <view v-for="(s, i) in steps" :key="s" class="step">
                            <view class="dot" :class="dotClass(i)">
                                <FaIcon v-if="i < currentStep" name="check" :size="14" color="rgba(255, 255, 255, 0.98)" />
                                <view v-else-if="i === currentStep" class="dot__inner dot__inner--on" />
                            </view>
                            <view class="step__label"
                                :class="{ 'step__label--on': i === currentStep, 'step__label--off': i > currentStep }">
                                {{ s }}
                            </view>
                        </view>
                    </view>
                </view>

                <!-- Step 0：联系人信息 -->
                <template v-if="currentStep === 0">
                    <view class="card">
                        <view class="sectionTitle">联系人信息</view>
                        <view class="formRow">
                            <view class="formRow__label">真实姓名</view>
                            <wd-input v-model="form.realName" compact custom-class="formInput" placeholder="请填写真实姓名" />
                        </view>
                        <view class="divider" />
                        <view class="formRow">
                            <view class="formRow__label">所在部门</view>
                            <wd-input v-model="form.department" compact custom-class="formInput" placeholder="如：人力资源部" />
                        </view>
                        <view class="divider" />
                        <view class="formRow">
                            <view class="formRow__label">联系电话</view>
                            <wd-input v-model="form.contactPhone" compact custom-class="formInput" type="number"
                                :maxlength="11" placeholder="工作联系电话（选填）" />
                        </view>
                    </view>
                </template>

                <!-- Step 1：企业信息 -->
                <template v-if="currentStep === 1">
                    <view class="card">
                        <view class="sectionTitle">搜索或创建企业</view>
                        <view class="searchRow">
                            <FaIcon name="magnifying-glass" :size="28" color="rgba(0,0,0,0.28)" />
                            <wd-input v-model="companyKeyword" compact custom-class="searchInput"
                                placeholder="输入企业名称搜索" @input="handleCompanySearch" />
                        </view>
                        <!-- 搜索结果 -->
                        <view v-if="companyResults.length" class="companyList">
                            <view v-for="c in companyResults" :key="c.id" class="companyItem"
                                :class="{ 'companyItem--on': form.companyId === c.id }"
                                hover-class="companyItem--pressed" @click="selectCompany(c)">
                                <view class="companyItem__name">{{ c.name }}</view>
                                <view v-if="c.isVerified" class="companyItem__badge">已认证</view>
                                <view v-if="form.companyId === c.id" class="companyItem__check">
                                    <FaIcon name="check" :size="20" color="rgba(30, 91, 255, 0.98)" />
                                </view>
                            </view>
                        </view>
                        <!-- 未找到企业 -->
                        <view v-if="companyKeyword && !companyResults.length && !searching"
                            class="notFound">
                            <view class="notFound__text">未找到"{{ companyKeyword }}"</view>
                            <view class="notFound__btn" hover-class="notFound__btn--pressed"
                                @click="showCreatePanel = true">
                                + 创建该企业
                            </view>
                        </view>
                        <!-- 已选择企业 -->
                        <view v-if="selectedCompany" class="selectedCard">
                            <FaIcon name="building" :size="28" color="rgba(30, 91, 255, 0.92)" />
                            <view class="selectedCard__name">{{ selectedCompany.name }}</view>
                            <view class="selectedCard__clear" hover-class="selectedCard__clear--pressed"
                                @click="clearCompany">
                                <FaIcon name="xmark" :size="20" color="rgba(0,0,0,0.38)" />
                            </view>
                        </view>
                    </view>

                    <!-- 创建新企业面板 -->
                    <view v-if="showCreatePanel" class="card" style="margin-top: 18rpx">
                        <view class="sectionTitle">创建新企业</view>
                        <view class="formRow">
                            <view class="formRow__label">企业名称</view>
                            <wd-input v-model="newCompany.name" compact custom-class="formInput" placeholder="请输入全称" />
                        </view>
                        <view class="divider" />
                        <view class="formRow">
                            <view class="formRow__label">所在城市</view>
                            <wd-input v-model="newCompany.city" compact custom-class="formInput" placeholder="如：成都" />
                        </view>
                        <view class="divider" />
                        <view class="formRow">
                            <view class="formRow__label">行业</view>
                            <wd-input v-model="newCompany.industry" compact custom-class="formInput"
                                placeholder="如：互联网" />
                        </view>
                    </view>
                </template>

                <!-- Step 2：完成 -->
                <template v-if="currentStep === 2">
                    <view class="doneCard">
                        <view class="doneCard__icon">
                            <FaIcon name="circle-check" :size="80" color="rgba(30, 91, 255, 0.92)" />
                        </view>
                        <view class="doneCard__title">档案已创建</view>
                        <view class="doneCard__sub">您现在可以开始发布职位、浏览简历了</view>
                        <wd-button type="primary" custom-class="doneBtn" @click="goHome">进入招聘者首页</wd-button>
                    </view>
                </template>

            </view>
        </scroll-view>

        <view v-if="currentStep < 2" class="bottom" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button v-if="currentStep > 0" plain custom-class="prevBtn" @click="currentStep--">上一步</wd-button>
            <wd-button type="primary" :loading="submitting" custom-class="nextBtn" @click="handleNext">
                {{ currentStep === 1 ? '提交' : '下一步' }}
            </wd-button>
        </view>

        <wd-toast selector="registrationToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiSearchCompanies, apiCreateCompany, apiRegisterRecruiter, apiGetRecruiterProfile, apiUpdateRecruiterProfile } from '@/api/index'

const toast = useToast('registrationToast')
const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

const steps = ['联系人信息', '企业信息', '完成']
const currentStep = ref(0)
const submitting = ref(false)
const isEditMode = ref(false)

onMounted(async () => {
    try {
        const profile: any = await apiGetRecruiterProfile()
        if (!profile?.id) return
        isEditMode.value = true
        form.value.realName = profile.realName || ''
        form.value.department = profile.department || ''
        form.value.contactPhone = profile.contactPhone || ''
        if (profile.company) {
            selectedCompany.value = profile.company
            ;(form.value as any).companyId = profile.company.id
        }
    } catch {
        // 未注册，保持创建模式
    }
})

const stepProgress = computed(() => {
    const map = ['0%', '50%', '100%']
    return map[currentStep.value]
})

const dotClass = (i: number) => ({
    'dot--done': i < currentStep.value,
    'dot--on': i === currentStep.value,
    'dot--off': i > currentStep.value,
})

const form = ref({ realName: '', department: '', contactPhone: '' })

// 企业搜索
const companyKeyword = ref('')
const companyResults = ref<any[]>([])
const selectedCompany = ref<any>(null)
const searching = ref(false)
const showCreatePanel = ref(false)
const newCompany = ref({ name: '', city: '', industry: '' })

let searchTimer: ReturnType<typeof setTimeout> | null = null
const handleCompanySearch = () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(async () => {
        const kw = companyKeyword.value.trim()
        if (!kw) { companyResults.value = []; return }
        searching.value = true
        try {
            const res: any = await apiSearchCompanies({ keyword: kw, limit: 8 })
            companyResults.value = res || []
        } catch {
            companyResults.value = []
        } finally {
            searching.value = false
        }
    }, 400)
}

const selectCompany = (c: any) => {
    selectedCompany.value = c
    form.value.companyId = c.id
    companyResults.value = []
    showCreatePanel.value = false
}

const clearCompany = () => {
    selectedCompany.value = null
    delete (form.value as any).companyId
}

// 步骤校验
const validateStep0 = () => {
    if (!form.value.realName.trim()) return '请填写真实姓名'
    if (!form.value.department.trim()) return '请填写所在部门'
    return ''
}

const validateStep1 = () => {
    if (showCreatePanel.value) {
        if (!newCompany.value.name.trim()) return '请填写企业名称'
        if (!newCompany.value.city.trim()) return '请填写所在城市'
    } else if (!(form.value as any).companyId) {
        return '请搜索并选择企业'
    }
    return ''
}

const handleNext = async () => {
    if (currentStep.value === 0) {
        const err = validateStep0()
        if (err) { toast.info(err); return }
        currentStep.value = 1
        return
    }

    if (currentStep.value === 1) {
        const err = validateStep1()
        if (err) { toast.info(err); return }
        submitting.value = true
        try {
            if (isEditMode.value) {
                // 编辑模式：仅更新联系人信息，不修改企业
                await apiUpdateRecruiterProfile({
                    realName: form.value.realName.trim(),
                    department: form.value.department.trim(),
                    contactPhone: form.value.contactPhone.trim() || undefined,
                })
            } else {
                let companyId = (form.value as any).companyId
                if (showCreatePanel.value) {
                    const res: any = await apiCreateCompany({
                        name: newCompany.value.name.trim(),
                        city: newCompany.value.city.trim(),
                        industry: newCompany.value.industry.trim() || undefined,
                    })
                    companyId = res?.id
                }
                await apiRegisterRecruiter({
                    realName: form.value.realName.trim(),
                    companyId,
                    department: form.value.department.trim(),
                    contactPhone: form.value.contactPhone.trim() || undefined,
                })
            }
            currentStep.value = 2
        } catch (e: any) {
            const msg = Array.isArray(e?.message) ? e.message.join('；') : (e?.message || '提交失败，请重试')
            toast.info(msg)
        } finally {
            submitting.value = false
        }
    }
}

const goHome = () => {
    uni.reLaunch({ url: '/pages/recruiter/index' as any })
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

.stepper {
    border-radius: var(--app-radius-md);
    background: var(--app-surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.78);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx 22rpx 18rpx;
    position: relative;
}

.stepper__rail {
    position: absolute;
    left: 36rpx;
    right: 36rpx;
    top: 34rpx;
    height: 6rpx;
    background: rgba(0, 0, 0, 0.10);
    border-radius: var(--app-radius-pill);
}

.stepper__progress {
    position: absolute;
    left: 36rpx;
    top: 34rpx;
    height: 6rpx;
    background: rgba(30, 91, 255, 0.98);
    border-radius: var(--app-radius-pill);
    transition: width 0.3s ease;
}

.stepper__nodes {
    display: flex;
    justify-content: space-between;
}

.step {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    position: relative;
    z-index: 1;
}

.dot {
    width: 26rpx;
    height: 26rpx;
    border-radius: var(--app-radius-pill);
    border: 4rpx solid rgba(30, 91, 255, 0.92);
    background: var(--app-surface-strong);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dot--done {
    background: rgba(30, 91, 255, 0.92);
    border-color: rgba(30, 91, 255, 0.92);
}

.dot--on {
    background: var(--app-surface-strong);
    border-color: rgba(30, 91, 255, 0.92);
}

.dot--off {
    border-color: rgba(0, 0, 0, 0.14);
    background: var(--app-surface-strong);
}

.dot__inner {
    width: 10rpx;
    height: 10rpx;
    border-radius: var(--app-radius-pill);
}

.dot__inner--on {
    background: rgba(30, 91, 255, 0.92);
}

.step__label {
    font-size: 24rpx;
    color: var(--app-text-secondary);
    font-weight: 800;
}

.step__label--on {
    color: rgba(0, 0, 0, 0.72);
}

.step__label--off {
    color: var(--app-text-muted);
}

.card {
    margin-top: 18rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
    padding: 18rpx 0 0;
}

.sectionTitle {
    padding: 0 22rpx 14rpx;
    font-size: 28rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.72);
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.sectionTitle::before {
    content: '';
    width: 6rpx;
    height: 26rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(30, 91, 255, 0.98);
}

.formRow {
    min-height: 96rpx;
    padding: 0 22rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-sizing: border-box;
}

.formRow__label {
    width: 148rpx;
    flex: 0 0 auto;
    font-size: 28rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.74);
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

.divider {
    height: 1px;
    background: var(--app-line);
    margin-left: 22rpx;
}

// 搜索区
.searchRow {
    margin: 0 22rpx 12rpx;
    height: 76rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 0 18rpx;
    box-sizing: border-box;
}

:deep(.searchInput) {
    flex: 1;
    min-width: 0;
    height: 76rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 76rpx;
        font-size: 28rpx;
        color: var(--app-text-primary) !important;
    }

    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 28rpx;
    }
}

.companyList {
    margin: 0 22rpx;
    border-radius: var(--app-radius-md);
    border: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-bottom: 12rpx;
}

.companyItem {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 20rpx 18rpx;
    background: rgba(255, 255, 255, 0.96);
}

.companyItem+.companyItem {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.companyItem--on {
    background: rgba(30, 91, 255, 0.05);
}

.companyItem--pressed {
    background: rgba(0, 0, 0, 0.03);
}

.companyItem__name {
    flex: 1 1 auto;
    font-size: 28rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.74);
}

.companyItem__badge {
    font-size: 22rpx;
    font-weight: 800;
    color: rgba(30, 91, 255, 0.92);
    background: rgba(30, 91, 255, 0.08);
    border-radius: var(--app-radius-pill);
    padding: 4rpx 14rpx;
    border: 1px solid rgba(30, 91, 255, 0.14);
}

.companyItem__check {
    flex: 0 0 auto;
}

.notFound {
    margin: 0 22rpx 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14rpx;
    padding: 16rpx 18rpx;
    border-radius: var(--app-radius-md);
    background: rgba(0, 0, 0, 0.025);
    border: 1px dashed rgba(0, 0, 0, 0.10);
}

.notFound__text {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.46);
    font-weight: 800;
}

.notFound__btn {
    font-size: 26rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.92);
    padding: 8rpx 14rpx;
    border-radius: var(--app-radius-sm);
}

.notFound__btn--pressed {
    background: rgba(30, 91, 255, 0.08);
}

.selectedCard {
    margin: 0 22rpx 18rpx;
    display: flex;
    align-items: center;
    gap: 14rpx;
    padding: 18rpx 18rpx;
    border-radius: var(--app-radius-md);
    background: rgba(30, 91, 255, 0.05);
    border: 1px solid rgba(30, 91, 255, 0.14);
}

.selectedCard__name {
    flex: 1 1 auto;
    font-size: 28rpx;
    font-weight: 900;
    color: rgba(30, 91, 255, 0.98);
}

.selectedCard__clear {
    width: 52rpx;
    height: 52rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--app-radius-pill);
}

.selectedCard__clear--pressed {
    background: rgba(0, 0, 0, 0.06);
}

// 完成
.doneCard {
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18rpx;
    padding: 48rpx 36rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
}

.doneCard__icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(30, 91, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.doneCard__title {
    font-size: 40rpx;
    font-weight: 950;
    color: rgba(0, 0, 0, 0.84);
}

.doneCard__sub {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    font-weight: 800;
    text-align: center;
    line-height: 1.6;
}

:deep(.doneBtn) {
    margin-top: 12rpx;
    height: 88rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 30rpx !important;
    font-weight: 950 !important;
    padding: 0 48rpx !important;
    box-shadow: 0 16rpx 44rpx rgba(30, 91, 255, 0.26) !important;
}

// 底部按钮
.bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18rpx 22rpx 18rpx;
    box-sizing: border-box;
    background: rgba(238, 244, 255, 0.92);
    backdrop-filter: blur(12rpx);
    display: flex;
    gap: 14rpx;
}

:deep(.prevBtn) {
    flex: 0 0 140rpx;
    height: 96rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 30rpx !important;
    font-weight: 950 !important;
}

:deep(.nextBtn) {
    flex: 1 1 auto;
    height: 96rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 32rpx !important;
    font-weight: 950 !important;
    letter-spacing: 2rpx !important;
    box-shadow: 0 18rpx 50rpx rgba(30, 91, 255, 0.26) !important;
}
</style>
