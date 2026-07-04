<template>
    <view class="page">
        <HeaderNav title="自我描述" type="show-back" theme="000" />

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card">
                    <wd-form :model="form" border title-width="100px">
                        <wd-form-item prop="content">
                            <view class="textBlock__label">自我描述</view>
                            <wd-textarea custom-class="globTextArea" v-model="form.content" :maxlength="300" clearable
                                show-word-limit />
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
import { onMounted, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiGetSelfDesc, apiUpdateSelfDesc } from '@/api/index'

interface SelfDescForm {
    content: string
}

const form = ref<SelfDescForm>({
    content: ''
})

const saving = ref(false)

const handleSave = async (): Promise<void> => {
    if (!form.value.content.trim()) {
        uni.showToast({ title: '请输入自我描述', icon: 'none' })
        return
    }

    saving.value = true
    try {
        await apiUpdateSelfDesc({ selfDesc: form.value.content.trim() })
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
}
</style>
