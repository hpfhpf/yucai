<template>
    <view class="page">
        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view v-if="loading" class="empty">加载中…</view>
                <template v-else>
                    <view v-if="jobTitle" class="jobbar">
                        投递职位：{{ jobTitle }}<text v-if="companyName"> · {{ companyName }}</text>
                    </view>

                    <view class="card">
                        <view class="card__label">自我描述</view>
                        <view class="card__text">{{ content.selfDesc || '未填写' }}</view>
                    </view>

                    <view v-if="workExps.length" class="card">
                        <view class="card__label">工作经历</view>
                        <view v-for="(w, i) in workExps" :key="'w' + i" class="item">
                            <view class="item__title">{{ w.company || '' }} · {{ w.title || '' }}</view>
                            <view class="card__text">{{ w.content || '' }}</view>
                        </view>
                    </view>

                    <view v-if="projectExps.length" class="card">
                        <view class="card__label">项目经历</view>
                        <view v-for="(p, i) in projectExps" :key="'p' + i" class="item">
                            <view class="item__title">{{ p.name || '' }}<text v-if="p.role"> · {{ p.role }}</text></view>
                            <view class="card__text">{{ p.content || '' }}</view>
                        </view>
                    </view>
                </template>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { apiGetTailoredResume } from '@/api/index'

const loading = ref(true)
const content = ref<Record<string, any>>({})
const jobTitle = ref('')
const companyName = ref('')

const workExps = computed(() => (Array.isArray(content.value.workExps) ? content.value.workExps : []))
const projectExps = computed(() => (Array.isArray(content.value.projectExps) ? content.value.projectExps : []))

onLoad(async (q: any) => {
    const id = q?.id
    if (!id) { loading.value = false; return }
    try {
        const res: any = await apiGetTailoredResume(id)
        content.value = res.content || {}
        jobTitle.value = res.job?.title || ''
        companyName.value = res.job?.company?.name || ''
    } catch {
        // 统一错误处理
    } finally {
        loading.value = false
    }
})
</script>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    background: #f5f6f8;
}

.scroll {
    height: 100vh;
}

.content {
    padding: 24rpx;
}

.empty {
    padding: 120rpx 0;
    text-align: center;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.45);
}

.jobbar {
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.55);
    padding: 8rpx 4rpx 20rpx;
}

.card {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;

    &__label {
        font-size: 28rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16rpx;
    }

    &__text {
        font-size: 27rpx;
        line-height: 1.6;
        color: rgba(0, 0, 0, 0.72);
        white-space: pre-wrap;
    }
}

.item {
    margin-bottom: 20rpx;

    &__title {
        font-size: 26rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.7);
        margin-bottom: 8rpx;
    }
}
</style>
