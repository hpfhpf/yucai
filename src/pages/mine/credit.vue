<template>
    <view class="page">
        <HeaderNav title="信用异议" type="show-back" theme="000" />

        <view class="content">
            <!-- 异议说明卡片 -->
            <view class="info-card">
                <view class="info-title">
                    <wd-icon name="info-circle-filled" size="32rpx" color="#1e5bff" />
                    <text>什么是信用异议？</text>
                </view>
                <view class="info-desc">
                    如您发现企业信用信息存在错误、遗漏或与实际情况不符，可提交异议申请。我们将在3个工作日内核实处理。
                </view>
            </view>

            <!-- 异议列表 -->
            <view class="section-title">我的异议申请</view>

            <view v-if="loading" class="loading-state">
                <wd-loading size="40rpx" />
                <text>加载中...</text>
            </view>

            <view v-else-if="list.length === 0" class="empty-state">
                <wd-empty image="content" tip="暂无异议申请">
                    <template #description>
                        <view class="empty-desc">您还没有提交过信用异议</view>
                    </template>
                </wd-empty>
                <wd-button type="primary" size="medium" round @click="showForm = true" custom-class="action-btn">
                    提交新异议
                </wd-button>
            </view>

            <view v-else class="list-container">
                <view v-for="item in list" :key="item.id" class="dispute-card">
                    <view class="dispute-header">
                        <text class="dispute-type">{{ item.type }}</text>
                        <wd-tag :type="getStatusType(item.status)" round>{{ item.statusText }}</wd-tag>
                    </view>
                    <view class="dispute-content">{{ item.content }}</view>
                    <view class="dispute-footer">
                        <text class="time">{{ item.createTime }}</text>
                        <text v-if="item.reply" class="reply-hint">已回复</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 提交异议弹窗 -->
        <wd-popup v-model="showForm" position="bottom" :safe-area-inset-bottom="true" custom-class="form-popup">
            <view class="form-header">
                <text class="form-title">提交信用异议</text>
                <wd-icon name="close" size="36rpx" @click="showForm = false" />
            </view>
            <view class="form-body">
                <wd-cell-group border>
                    <wd-picker
                        v-model="form.type"
                        label="异议类型"
                        placeholder="请选择异议类型"
                        :columns="typeColumns"
                        required
                    />
                    <wd-textarea
                        v-model="form.content"
                        label="异议描述"
                        placeholder="请详细描述您认为有误的信息内容，并说明正确的信息..."
                        :maxlength="500"
                        show-word-limit
                        required
                    />
                    <wd-input
                        v-model="form.contact"
                        label="联系电话"
                        placeholder="请留下您的联系方式"
                        type="phone"
                        required
                    />
                </wd-cell-group>
            </view>
            <view class="form-footer">
                <wd-button type="primary" size="large" round block :loading="submitting" @click="handleSubmit">
                    提交申请
                </wd-button>
            </view>
        </wd-popup>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'

interface DisputeItem {
    id: string
    type: string
    content: string
    status: 'pending' | 'processing' | 'resolved' | 'rejected'
    statusText: string
    createTime: string
    reply?: string
}

const loading = ref(false)
const list = ref<DisputeItem[]>([])
const showForm = ref(false)
const submitting = ref(false)

const form = ref({
    type: '',
    content: '',
    contact: ''
})

const typeColumns = [
    { value: 'info_error', label: '信息错误' },
    { value: 'info_missing', label: '信息遗漏' },
    { value: 'info_outdated', label: '信息过期' },
    { value: 'other', label: '其他问题' }
]

const getStatusType = (status: string) => {
    const map: Record<string, string> = {
        pending: 'warning',
        processing: 'primary',
        resolved: 'success',
        rejected: 'danger'
    }
    return map[status] || 'info'
}

// 加载异议列表
const loadList = async () => {
    loading.value = true
    try {
        // TODO: 接入真实 API
        // const res = await apiGetCreditDisputes()
        // list.value = res.data

        // 模拟空数据
        await new Promise(r => setTimeout(r, 500))
        list.value = []
    } finally {
        loading.value = false
    }
}

// 提交异议
const handleSubmit = async () => {
    if (!form.value.type) {
        uni.showToast({ title: '请选择异议类型', icon: 'none' })
        return
    }
    if (!form.value.content.trim()) {
        uni.showToast({ title: '请填写异议描述', icon: 'none' })
        return
    }
    if (!form.value.contact) {
        uni.showToast({ title: '请填写联系电话', icon: 'none' })
        return
    }

    submitting.value = true
    try {
        // TODO: 接入真实 API
        // await apiCreateCreditDispute(form.value)
        await new Promise(r => setTimeout(r, 800))

        uni.showToast({ title: '提交成功', icon: 'success' })
        showForm.value = false
        // 重置表单
        form.value = { type: '', content: '', contact: '' }
        // 刷新列表
        loadList()
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    loadList()
})
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content {
    flex: 1;
    padding: 32rpx;
}

// 信息卡片
.info-card {
    background: rgba(30, 91, 255, 0.06);
    border-radius: 24rpx;
    padding: 28rpx;
    margin-bottom: 32rpx;
    border: 1rpx solid rgba(30, 91, 255, 0.1);
}

.info-title {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    margin-bottom: 16rpx;
}

.info-desc {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    line-height: 1.7;
}

// 区块标题
.section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    margin-bottom: 24rpx;
}

// 加载状态
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    padding: 120rpx 0;
    color: rgba(0, 0, 0, 0.4);
    font-size: 28rpx;
}

// 空状态
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;
}

.empty-desc {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.4);
    margin-top: 16rpx;
}

.action-btn {
    margin-top: 48rpx;
    width: 280rpx;
}

// 列表容器
.list-container {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

// 异议卡片
.dispute-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 28rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.dispute-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.dispute-type {
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
}

.dispute-content {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.64);
    line-height: 1.6;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.dispute-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.04);
}

.time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.reply-hint {
    font-size: 24rpx;
    color: #1e5bff;
}

// 表单弹窗
.form-popup {
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.form-title {
    font-size: 32rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
}

.form-body {
    padding: 24rpx 0;
    max-height: 60vh;
    overflow-y: auto;
}

.form-footer {
    padding: 24rpx 32rpx 48rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}
</style>
