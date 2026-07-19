<template>
    <view class="page">
        <HeaderNav :title="pageTitle" type="show-back" theme="000" />

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card">
                    <wd-form :model="form" border title-width="100px">
                        <wd-form-item title="学校名称" prop="school">
                            <wd-input v-model="form.school" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="学历" prop="degree">
                            <wd-cell custom-class="calendarCell" :value="form.degree || '请选择'" is-link
                                @click="showDegreePicker = true" />
                            <wd-picker v-model:visible="showDegreePicker" :columns="[degreeOptions]"
                                @confirm="handleDegreeConfirm" />
                        </wd-form-item>

                        <wd-form-item title="专业" prop="major">
                            <wd-input v-model="form.major" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="入学时间" prop="startMonth">
                            <wd-cell custom-class="calendarCell" :value="startMonthText" is-link
                                @click="showStartMonthPicker = true" />
                            <wd-calendar v-model="form.startMonth" v-model:visible="showStartMonthPicker" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleStartMonthConfirm" />
                        </wd-form-item>

                        <wd-form-item title="毕业时间" prop="endMonth">
                            <wd-cell custom-class="calendarCell" :value="endMonthText" is-link
                                @click="showEndMonthPicker = true" />
                            <wd-calendar v-model="form.endMonth" v-model:visible="showEndMonthPicker" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleEndMonthConfirm" />
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
import { apiCreateEducation, apiUpdateEducation, apiGetEducations } from '@/api/index'

interface EducationForm {
    school: string
    degree: string
    major: string
    startMonth: string | Date
    endMonth: string | Date
}

const degreeOptions = ['博士', '硕士', '本科', '大专', '高中', '中专/中技', '初中及以下']

const degreeEnumMap: Record<string, string> = {
    '博士': 'DOCTOR',
    '硕士': 'MASTER',
    '本科': 'BACHELOR',
    '大专': 'ASSOCIATE',
    '高中': 'HIGH_SCHOOL',
    '中专/中技': 'HIGH_SCHOOL',
    '初中及以下': 'JUNIOR_HIGH',
}

// 枚举 -> 中文标签，用于编辑回填（HIGH_SCHOOL 归一显示为「高中」）
const degreeLabelMap: Record<string, string> = {
    DOCTOR: '博士',
    MASTER: '硕士',
    BACHELOR: '本科',
    ASSOCIATE: '大专',
    HIGH_SCHOOL: '高中',
    JUNIOR_HIGH: '初中及以下',
}

const editId = ref('')
const isEdit = computed(() => !!editId.value)
const pageTitle = computed(() => isEdit.value ? '编辑教育经历' : '添加教育经历')

const form = ref<EducationForm>({
    school: '',
    degree: '',
    major: '',
    startMonth: '',
    endMonth: '',
})

onMounted(async () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    const page = pages[pages.length - 1] as any
    const id = page?.options?.id || ''
    if (!id) return
    editId.value = id
    try {
        const list: any = await apiGetEducations()
        const item = (list as any[]).find((e: any) => e.id === id)
        if (item) {
            form.value.school = item.school || ''
            form.value.major = item.major || ''
            form.value.degree = degreeLabelMap[item.degree] || ''
            form.value.startMonth = item.startDate ? new Date(item.startDate) : ''
            form.value.endMonth = item.endDate ? new Date(item.endDate) : ''
        }
    } catch { }
})

const showDegreePicker = ref(false)
const showStartMonthPicker = ref(false)
const showEndMonthPicker = ref(false)

const maxDate = new Date()
const minDate = new Date('1960-01-01').getTime()

const startMonthText = computed((): string => {
    if (!form.value.startMonth) return '请选择'
    const d = new Date(form.value.startMonth)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
})

const endMonthText = computed((): string => {
    if (!form.value.endMonth) return '请选择'
    const d = new Date(form.value.endMonth)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
})

const handleDegreeConfirm = ({ value }: { value: string[] }): void => {
    form.value.degree = value[0]
}

const handleStartMonthConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    form.value.startMonth = value
    showStartMonthPicker.value = false
}

const handleEndMonthConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.startMonth && value < new Date(form.value.startMonth)) {
        uni.showToast({ title: '毕业时间不能早于入学时间', icon: 'none' })
        return
    }
    form.value.endMonth = value
    showEndMonthPicker.value = false
}

const saving = ref(false)

const handleSave = async (): Promise<void> => {
    if (!form.value.school.trim()) {
        uni.showToast({ title: '请输入学校名称', icon: 'none' })
        return
    }
    if (!form.value.degree) {
        uni.showToast({ title: '请选择学历', icon: 'none' })
        return
    }
    if (!form.value.startMonth) {
        uni.showToast({ title: '请选择入学时间', icon: 'none' })
        return
    }
    if (form.value.endMonth && new Date(form.value.endMonth) < new Date(form.value.startMonth)) {
        uni.showToast({ title: '毕业时间不能早于入学时间', icon: 'none' })
        return
    }

    saving.value = true
    try {
        const payload = {
            school: form.value.school.trim(),
            major: form.value.major.trim() || undefined,
            degree: degreeEnumMap[form.value.degree],
            startDate: form.value.startMonth ? new Date(form.value.startMonth).toISOString() : undefined,
            endDate: form.value.endMonth ? new Date(form.value.endMonth).toISOString() : undefined,
        }
        if (isEdit.value) {
            await apiUpdateEducation(editId.value, payload)
        } else {
            await apiCreateEducation(payload)
        }
        uni.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1200)
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
