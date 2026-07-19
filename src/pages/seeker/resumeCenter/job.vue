<template>
    <view class="page">
        <HeaderNav :title="pageTitle" type="show-back" theme="000" />

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card">
                    <wd-form :model="form" border title-width="100px">
                        <wd-form-item title="公司名称" prop="company">
                            <wd-input v-model="form.company" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="职位" prop="position">
                            <wd-input v-model="form.position" placeholder="请输入" align-right compact />
                        </wd-form-item>

                        <wd-form-item title="入职时间" prop="startMonth">
                            <wd-cell custom-class="calendarCell" :value="formatDate(form.startMonth)" is-link
                                @click="showStartCalendar = true" />
                            <wd-calendar v-model="form.startMonth" v-model:visible="showStartCalendar" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleStartConfirm" />
                        </wd-form-item>

                        <wd-form-item title="离职时间" prop="endMonth">
                            <wd-cell custom-class="calendarCell" :value="formatDate(form.endMonth)" is-link
                                @click="showEndCalendar = true" />
                            <wd-calendar v-model="form.endMonth" v-model:visible="showEndCalendar" type="month"
                                :min-date="minDate" :max-date="maxDate" @confirm="handleEndConfirm" />
                        </wd-form-item>

                        <wd-form-item prop="content">
                            <view class="textBlock__label">工作内容</view>
                            <wd-textarea custom-class="globTextArea" v-model="form.content" placeholder="请输入工作内容"
                                :maxlength="300" clearable show-word-limit />
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
import { onMounted, ref, computed } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiCreateWorkExp, apiUpdateWorkExp, apiGetWorkExps } from '@/api/index'

interface WorkForm {
    company: string
    position: string
    startMonth: number | Date | null
    endMonth: number | Date | null
    content: string
}

const editId = ref('')
const isEdit = computed(() => !!editId.value)
const pageTitle = computed(() => isEdit.value ? '编辑工作经历' : '添加工作经历')

const form = ref<WorkForm>({
    company: '',
    position: '',
    startMonth: null,
    endMonth: null,
    content: '',
})

const showStartCalendar = ref(false)
const showEndCalendar = ref(false)

const maxDate = Date.now()
const minDate = new Date('1960-01-01').getTime()

const formatDate = (date: string | Date | null): string => {
    if (!date) return '请选择'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '请选择'
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}年${month}月`
}

const handleStartConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.endMonth && value > new Date(form.value.endMonth)) {
        uni.showToast({ title: '入职时间不得晚于离职时间', icon: 'none' })
        return
    }
    form.value.startMonth = value
    showStartCalendar.value = false
}

const handleEndConfirm = ({ value }: { value: Date }): void => {
    if (value > maxDate) {
        uni.showToast({ title: '不能选择未来日期', icon: 'none' })
        return
    }
    if (form.value.startMonth && value < new Date(form.value.startMonth)) {
        uni.showToast({ title: '离职时间不得早于入职时间', icon: 'none' })
        return
    }
    form.value.endMonth = value
    showEndCalendar.value = false
}

onMounted(async () => {
    const pages = (typeof getCurrentPages === 'function' && getCurrentPages()) || []
    const page = pages[pages.length - 1] as any
    const id = page?.options?.id || ''
    if (!id) return
    editId.value = id
    try {
        const list: any = await apiGetWorkExps()
        const item = (list as any[]).find((w: any) => w.id === id)
        if (item) {
            form.value.company = item.company || ''
            form.value.position = item.title || ''
            form.value.content = item.content || ''
            form.value.startMonth = item.startDate ? new Date(item.startDate).getTime() : null
            form.value.endMonth = item.endDate ? new Date(item.endDate).getTime() : null
        }
    } catch { }
})

const saving = ref(false)

const handleSave = async (): Promise<void> => {
    if (!form.value.company.trim()) {
        uni.showToast({ title: '请输入公司名称', icon: 'none' })
        return
    }
    if (!form.value.position.trim()) {
        uni.showToast({ title: '请输入职位', icon: 'none' })
        return
    }
    if (!form.value.startMonth) {
        uni.showToast({ title: '请选择入职时间', icon: 'none' })
        return
    }
    if (!form.value.endMonth) {
        uni.showToast({ title: '请选择离职时间', icon: 'none' })
        return
    }
    if (new Date(form.value.startMonth) > new Date(form.value.endMonth)) {
        uni.showToast({ title: '入职时间不得晚于离职时间', icon: 'none' })
        return
    }

    saving.value = true
    try {
        const payload = {
            company: form.value.company.trim(),
            title: form.value.position.trim(),
            content: form.value.content.trim() || undefined,
            startDate: new Date(form.value.startMonth).toISOString(),
            endDate: form.value.endMonth ? new Date(form.value.endMonth).toISOString() : undefined,
        }
        if (isEdit.value) {
            await apiUpdateWorkExp(editId.value, payload)
        } else {
            await apiCreateWorkExp(payload)
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

.textBlock__label {
    margin-bottom: 12rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.78);
    font-weight: 700;
}
</style>
