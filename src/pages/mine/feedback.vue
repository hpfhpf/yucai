<template>
    <view class="page">
        <HeaderNav title="意见反馈" type="show-back" theme="000" />

        <view class="content">
            <!-- 反馈表单 -->
            <view class="form-card">
                <view class="form-section">
                    <view class="section-label">反馈类型 <text class="required">*</text></view>
                    <view class="type-grid">
                        <view
                            v-for="t in typeList"
                            :key="t.value"
                            class="type-chip"
                            :class="{ active: form.type === t.value }"
                            @click="form.type = t.value"
                        >
                            <wd-icon :name="t.icon" size="28rpx" />
                            <text>{{ t.label }}</text>
                        </view>
                    </view>
                </view>

                <view class="form-section">
                    <view class="section-label">反馈内容 <text class="required">*</text></view>
                    <wd-textarea
                        v-model="form.content"
                        placeholder="请描述您遇到的问题或建议，越详细越有助于我们改进..."
                        :maxlength="500"
                        show-word-limit
                        :rows="4"
                        custom-class="feedback-textarea"
                    />
                </view>

                <view class="form-section">
                    <view class="section-label">联系方式</view>
                    <wd-input
                        v-model="form.contact"
                        placeholder="留下手机号或微信，方便我们与您联系（选填）"
                        clearable
                    />
                </view>
            </view>

            <!-- 常见问题 -->
            <view class="faq-section">
                <view class="section-title">常见问题</view>
                <view class="faq-list">
                    <view v-for="faq in faqs" :key="faq.q" class="faq-item" @click="faq.open = !faq.open">
                        <view class="faq-q">
                            <text>{{ faq.q }}</text>
                            <wd-icon :name="faq.open ? 'arrow-up' : 'arrow-down'" size="28rpx" color="rgba(0,0,0,0.4)" />
                        </view>
                        <view v-if="faq.open" class="faq-a">{{ faq.a }}</view>
                    </view>
                </view>
            </view>

            <view class="submit-wrap">
                <wd-button type="primary" size="large" round block :loading="submitting" @click="handleSubmit">
                    提交反馈
                </wd-button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'

const submitting = ref(false)
const form = ref({ type: '', content: '', contact: '' })

const typeList = [
    { value: 'bug', label: '功能异常', icon: 'warning-circle-filled' },
    { value: 'suggest', label: '产品建议', icon: 'chat' },
    { value: 'content', label: '内容问题', icon: 'info-circle-filled' },
    { value: 'other', label: '其他反馈', icon: 'edit' }
]

const faqs = ref([
    { q: '如何修改个人信息？', a: '进入"我的" → 点击头像区域，即可编辑个人基本信息。', open: false },
    { q: '简历如何导出？', a: '目前不支持直接导出，招聘官可在简历中心查看您的完整简历信息。', open: false },
    { q: '投递记录在哪里查看？', a: '点击"我的" → "已投递"，可查看所有投递记录及当前状态。', open: false },
    { q: '如何注销账号？', a: '请在"设置"页面底部找到注销账号选项，或联系客服协助处理。', open: false }
])

const handleSubmit = async () => {
    if (!form.value.type) {
        uni.showToast({ title: '请选择反馈类型', icon: 'none' })
        return
    }
    if (!form.value.content.trim()) {
        uni.showToast({ title: '请填写反馈内容', icon: 'none' })
        return
    }

    submitting.value = true
    try {
        // TODO: 接入真实 API
        await new Promise(r => setTimeout(r, 800))
        uni.showToast({ title: '感谢您的反馈！', icon: 'success' })
        form.value = { type: '', content: '', contact: '' }
    } finally {
        submitting.value = false
    }
}
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
    display: flex;
    flex-direction: column;
    gap: 32rpx;
}

.form-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 32rpx;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.section-label {
    font-size: 28rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
}

.required { color: #ef4444; margin-left: 4rpx; }

.type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
}

.type-chip {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 18rpx 24rpx;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 14rpx;
    border: 2rpx solid transparent;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.64);
    transition: all 0.18s;

    &.active {
        background: rgba(30, 91, 255, 0.06);
        border-color: #1e5bff;
        color: #1e5bff;
        font-weight: 500;
    }
}

.faq-section {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    margin-bottom: 24rpx;
}

.faq-item {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
    padding: 20rpx 0;

    &:last-child { border-bottom: none; }
}

.faq-q {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
}

.faq-a {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.56);
    margin-top: 12rpx;
    line-height: 1.7;
}

.submit-wrap { padding-bottom: 48rpx; }
</style>
