<template>
    <view class="page">
        <HeaderNav :title="pageTitle" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card">

                    <wd-form :model="form" border title-width="100px">
                        <wd-form-item title="项目名称" prop="projectName">
                            <wd-input v-model="form.projectName" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="你的职位" prop="role">
                            <wd-input v-model="form.role" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="开始时间" prop="startTime">
                            <wd-cell custom-class="calendarCell" :value="formatDate(form.startTime)" is-link
                                @click="showStartCalendar = true" />
                            <wd-calendar v-model="form.startTime" v-model:visible="showStartCalendar" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleStartConfirm" />
                        </wd-form-item>

                        <wd-form-item title="结束时间" prop="endTime">
                            <wd-cell custom-class="calendarCell" :value="formatDate(form.endTime)" is-link
                                @click="showEndCalendar = true" />
                            <wd-calendar v-model="form.endTime" v-model:visible="showEndCalendar" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleEndConfirm" />
                        </wd-form-item>

                        <wd-form-item prop="content">
                            <view class="textBlock__label">项目内容</view>
                            <wd-textarea custom-class="globTextArea" v-model="form.content" :maxlength="300" clearable
                                show-word-limit />
                        </wd-form-item>
                    </wd-form>
                </view>

                <view class="btnWrap">
                    <wd-button block @click="handleSave">保存</wd-button>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiCreateProjectExp, apiUpdateProjectExp, apiGetProjectExps } from '@/api/index'

const editId = ref('')
const isEdit = computed(() => !!editId.value)
const pageTitle = computed(() => isEdit.value ? '编辑项目经历' : '添加项目经历')

type DateValue = number | Date | null

const form = ref<{
    projectName: string
    role: string
    startTime: DateValue
    endTime: DateValue
    content: string
}>({
    projectName: '',
    role: '',
    startTime: null,
    endTime: null,
    content: '',
})

const showStartCalendar = ref(false)
const showEndCalendar = ref(false)

const maxDate = Date.now()
const minDate = new Date('1960-01-01').getTime()

const formatDate = (date: string | Date | null) => {
    if (!date) return '请选择'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
}

const handleStartConfirm = ({ value }: any) => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.endTime && value > new Date(form.value.endTime).getTime()) {
        uni.showToast({ title: '开始时间不得晚于结束时间', icon: 'none' })
        return
    }
    form.value.startTime = value
    showStartCalendar.value = false
}

const handleEndConfirm = ({ value }: any) => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.startTime && value < new Date(form.value.startTime).getTime()) {
        uni.showToast({ title: '结束时间不得早于开始时间', icon: 'none' })
        return
    }
    form.value.endTime = value
    showEndCalendar.value = false
}

onMounted(async () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    const page = pages[pages.length - 1] as any
    const id = page?.options?.id || ''
    if (!id) return
    editId.value = id
    try {
        const list: any = await apiGetProjectExps()
        const item = (list as any[]).find((p: any) => p.id === id)
        if (item) {
            form.value.projectName = item.name || ''
            form.value.role = item.role || ''
            form.value.content = item.content || ''
            form.value.startTime = item.startDate ? new Date(item.startDate).getTime() : null
            form.value.endTime = item.endDate ? new Date(item.endDate).getTime() : null
        }
    } catch { }
})

const saving = ref(false)

const handleSave = async () => {
    if (!form.value.projectName) {
        uni.showToast({ title: '请输入项目名称', icon: 'none' })
        return
    }
    if (!form.value.startTime) {
        uni.showToast({ title: '请选择开始时间', icon: 'none' })
        return
    }

    saving.value = true
    try {
        const payload = {
            name: form.value.projectName.trim(),
            role: form.value.role.trim() || undefined,
            content: form.value.content.trim() || undefined,
            startDate: new Date(form.value.startTime).toISOString(),
            endDate: form.value.endTime ? new Date(form.value.endTime).toISOString() : undefined,
        }
        if (isEdit.value) {
            await apiUpdateProjectExp(editId.value, payload)
        } else {
            await apiCreateProjectExp(payload)
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
    @include app-page-shell(var(--app-bg));
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

.textBlock__label {
    margin-bottom: 12rpx;
}
</style>
