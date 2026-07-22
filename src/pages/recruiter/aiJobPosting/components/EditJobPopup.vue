<template>
    <wd-popup v-model="show" position="bottom" :safe-area-inset-bottom="true"
        custom-style="border-radius: 22rpx 22rpx 0 0; max-height: 85vh;">
        <view class="editPopup">
            <view class="header">
                <view class="title">编辑职位信息</view>
                <view class="closeBtn" @click="close">
                    <FaIcon name="xmark" :size="28" color="#666" />
                </view>
            </view>
            <scroll-view class="formArea" scroll-y>
                <view class="formRow">
                    <view class="label">职位名称</view>
                    <wd-input v-model="form.title" placeholder="请填写" compact />
                </view>
                <view class="formRow">
                    <view class="label">薪资范围</view>
                    <wd-input v-model="form.salary" placeholder="例如：8k-12k" compact />
                </view>
                <view class="formRow">
                    <view class="label">工作地点</view>
                    <wd-input v-model="form.city" placeholder="城市" compact />
                </view>
                <view class="formRow">
                    <view class="label">学历要求</view>
                    <wd-input v-model="form.education" placeholder="例如：本科" compact />
                </view>
                <view class="formRow">
                    <view class="label">经验要求</view>
                    <wd-input v-model="form.experience" placeholder="例如：3-5年" compact />
                </view>
                <view class="formRow formRow--block">
                    <view class="label">职位描述</view>
                    <wd-textarea v-model="form.description" placeholder="请输入职位描述"
                        auto-height :maxlength="1000" />
                </view>
            </scroll-view>
            <view class="footer">
                <wd-button plain custom-class="footerBtn" @click="close">取消</wd-button>
                <wd-button type="primary" custom-class="footerBtn" @click="save">保存</wd-button>
            </view>
        </view>
    </wd-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'

const props = defineProps<{
    modelValue: boolean
    jobData: Record<string, any> | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    save: [data: Record<string, any>]
}>()

const show = ref(props.modelValue)
const form = ref({
    title: '',
    salary: '',
    city: '',
    education: '',
    experience: '',
    description: '',
})

watch(() => props.modelValue, (val) => {
    show.value = val
    if (val && props.jobData) {
        form.value = {
            title: props.jobData['title'] || '',
            salary: props.jobData['salary'] || '',
            city: props.jobData['city'] || '',
            education: props.jobData['education'] || '',
            experience: props.jobData['experience'] || '',
            description: props.jobData['description'] || '',
        }
    }
})

watch(show, (val) => {
    emit('update:modelValue', val)
})

const close = () => {
    show.value = false
}

const save = () => {
    emit('save', { ...form.value })
    close()
}
</script>

<style scoped lang="scss">
.editPopup {
    display: flex;
    flex-direction: column;
    max-height: 85vh;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1px solid var(--app-line);
}

.title {
    font-size: 32rpx;
    font-weight: 700;
    color: var(--app-text-primary);
}

.closeBtn {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.formArea {
    flex: 1;
    padding: 24rpx 32rpx;
    overflow-y: auto;
}

.formRow {
    margin-bottom: 32rpx;
}

.formRow--block {
    margin-bottom: 0;
}

.label {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--app-text-secondary);
    margin-bottom: 12rpx;
}

.footer {
    display: flex;
    gap: 20rpx;
    padding: 24rpx 32rpx;
    border-top: 1px solid var(--app-line);
}

:deep(.footerBtn) {
    flex: 1;
    height: 88rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 28rpx !important;
    font-weight: 700 !important;
}
</style>
