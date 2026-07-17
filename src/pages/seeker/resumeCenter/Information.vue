<template>
    <view class="page">
        <HeaderNav title="个人信息" type="show-back" theme="000" />

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card">
                    <wd-form :model="form" border title-width="100px">
                        <wd-form-item title="真实姓名" prop="realName">
                            <wd-input v-model="form.realName" placeholder="请填写姓名" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="性别" prop="gender">
                            <wd-cell custom-class="calendarCell" :value="form.gender || '请选择'" is-link
                                @click="showGenderPicker = true" />
                            <wd-picker v-model:visible="showGenderPicker" :columns="[genderOptions]"
                                @confirm="handleGenderConfirm" />
                        </wd-form-item>

                        <wd-form-item title="出生年月" prop="birthMonth">
                            <wd-cell custom-class="calendarCell" :value="birthMonthText" is-link
                                @click="showBirthMonthPicker = true" />
                            <wd-calendar v-model="form.birthMonth" v-model:visible="showBirthMonthPicker" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleBirthMonthConfirm" />
                        </wd-form-item>

                        <wd-form-item title="参加工作时间" prop="workMonth">
                            <wd-cell custom-class="calendarCell" :value="workMonthText" is-link
                                @click="showWorkMonthPicker = true" />
                            <wd-calendar v-model="form.workMonth" v-model:visible="showWorkMonthPicker" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleWorkMonthConfirm" />
                        </wd-form-item>

                        <wd-form-item title="手机号码" prop="phone">
                            <wd-input v-model="form.phone" disabled placeholder="手机号码" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="邮箱地址" prop="email">
                            <wd-input v-model="form.email" placeholder="请输入邮箱地址" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="所在城市" prop="city">
                            <wd-cell custom-class="calendarCell" :value="form.city || '请选择'" is-link
                                @click="showCityPicker = true" />
                            <wd-picker v-model:visible="showCityPicker" :columns="[cityOptions]"
                                @confirm="handleCityConfirm" />
                        </wd-form-item>

                        <wd-form-item title="当前综合年薪" prop="currentAnnualSalary">
                            <wd-input v-model="form.currentAnnualSalaryStr" type="number" placeholder="如：50（万元/年，含年终奖）"
                                align-right compact>
                                <template #suffix>
                                    <text style="color: var(--app-text-secondary); font-size: 24rpx;">万/年</text>
                                </template>
                            </wd-input>
                        </wd-form-item>

                        <wd-form-item title="当前职级" prop="currentLevel">
                            <wd-cell custom-class="calendarCell" :value="currentLevelText || '请选择'" is-link
                                @click="showLevelPicker = true" />
                            <wd-picker v-model:visible="showLevelPicker" :columns="[levelOptions]"
                                @confirm="handleLevelConfirm" />
                        </wd-form-item>
                    </wd-form>
                </view>

                <view class="btnWrap">
                    <wd-button block type="primary" @click="handleSave">保存</wd-button>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiUpdateResumeProfile, apiGetResumeProfile } from '@/api/index'

interface InformationForm {
    realName: string
    gender: string
    birthMonth: string | Date
    workMonth: string | Date
    phone: string
    email: string
    city: string
    currentAnnualSalaryStr: string // 年薪输入字符串，保存时转 number
    currentLevel: string            // CareerLevel 枚举值
}

const genderOptions = ['男', '女']
const cityOptions = ['北京', '上海', '广州', '深圳', '成都']
const levelOptions = ['骨干员工（高级专员/资深架构师）', '团队主管（组长/技术Leader）', '中高层管理（经理/总监）', '决策层（VP/C-Level/合伙人）']
const levelEnumMap: Record<string, string> = {
    '骨干员工（高级专员/资深架构师）': 'IC',
    '团队主管（组长/技术Leader）': 'LEAD',
    '中高层管理（经理/总监）': 'MGR_DIR',
    '决策层（VP/C-Level/合伙人）': 'VP_C',
}
const levelReverseMap: Record<string, string> = Object.fromEntries(
    Object.entries(levelEnumMap).map(([k, v]) => [v, k])
)

const genderEnumMap: Record<string, string> = { '男': 'MALE', '女': 'FEMALE' }
const genderReverseMap: Record<string, string> = { 'MALE': '男', 'FEMALE': '女' }

const form = ref<InformationForm>({
    realName: '',
    gender: '',
    birthMonth: '',
    workMonth: '',
    phone: '13319197788',
    email: '',
    city: '北京',
    currentAnnualSalaryStr: '',
    currentLevel: '',
})

const showGenderPicker = ref(false)
const showBirthMonthPicker = ref(false)
const showWorkMonthPicker = ref(false)
const showCityPicker = ref(false)
const showLevelPicker = ref(false)

const currentLevelText = computed(() => form.value.currentLevel ? levelReverseMap[form.value.currentLevel] || '' : '')

const maxDate = new Date()
const minDate = new Date('1960-01-01').getTime()

const birthMonthText = computed((): string => {
    if (!form.value.birthMonth) return '请选择'
    const d = new Date(form.value.birthMonth)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
})

const workMonthText = computed((): string => {
    if (!form.value.workMonth) return '请选择'
    const d = new Date(form.value.workMonth)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
})

const handleGenderConfirm = ({ value }: { value: string[] }): void => {
    form.value.gender = value[0]
}

const handleBirthMonthConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    form.value.birthMonth = value
    showBirthMonthPicker.value = false
}

const handleWorkMonthConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.birthMonth && value < new Date(form.value.birthMonth)) {
        uni.showToast({ title: '参加工作时间不能早于出生年月', icon: 'none' })
        return
    }
    form.value.workMonth = value
    showWorkMonthPicker.value = false
}

const handleCityConfirm = ({ value }: { value: string[] }): void => {
    form.value.city = value[0]
}

const handleLevelConfirm = ({ value }: { value: string[] }): void => {
    form.value.currentLevel = levelEnumMap[value[0]] || ''
    showLevelPicker.value = false
}

onMounted(async (): Promise<void> => {
    try {
        const res: any = await apiGetResumeProfile()
        if (!res) return
        if (res.realName) form.value.realName = res.realName
        if (res.gender) form.value.gender = genderReverseMap[res.gender] || ''
        if (res.birthDate) form.value.birthMonth = new Date(res.birthDate)
        if (res.workStartDate) form.value.workMonth = new Date(res.workStartDate)
        if (res.phone) form.value.phone = res.phone
        if (res.email) form.value.email = res.email
        if (res.city) form.value.city = res.city
        if (res.currentAnnualSalary != null) form.value.currentAnnualSalaryStr = String(res.currentAnnualSalary)
        if (res.currentLevel) form.value.currentLevel = res.currentLevel
    } catch {
        // 错误由 request.ts 统一处理
    }
})

const saving = ref(false)

const handleSave = async (): Promise<void> => {
    if (!form.value.realName.trim()) {
        uni.showToast({ title: '请填写真实姓名', icon: 'none' })
        return
    }
    if (!form.value.gender) {
        uni.showToast({ title: '请选择性别', icon: 'none' })
        return
    }
    if (!form.value.birthMonth) {
        uni.showToast({ title: '请选择出生年月', icon: 'none' })
        return
    }
    if (!form.value.city) {
        uni.showToast({ title: '请选择所在城市', icon: 'none' })
        return
    }

    saving.value = true
    try {
        await apiUpdateResumeProfile({
            realName: form.value.realName.trim(),
            gender: genderEnumMap[form.value.gender] as any,
            birthDate: new Date(form.value.birthMonth).toISOString(),
            city: form.value.city,
            ...(form.value.email.trim() ? { email: form.value.email.trim() } : {}),
            ...(form.value.workMonth ? { workStartDate: new Date(form.value.workMonth).toISOString() } : {}),
            ...(form.value.currentAnnualSalaryStr ? { currentAnnualSalary: Number(form.value.currentAnnualSalaryStr) } : {}),
            ...(form.value.currentLevel ? { currentLevel: form.value.currentLevel } : {}),
        })
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => {
            const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
            if (pages.length > 1) {
                uni.navigateBack()
                return
            }
            uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
        }, 1200)
    } catch {
        // 错误由 request.ts 统一处理
    } finally {
        saving.value = false
    }
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: var(--app-bg-soft);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 22rpx 26rpx 0;
    box-sizing: border-box;
}

.card {
    @include app-card-base(var(--app-radius-lg), var(--app-surface), var(--app-shadow-card));
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.btnWrap {
    margin-top: 26rpx;
    padding: 0 6rpx;
}
</style>
