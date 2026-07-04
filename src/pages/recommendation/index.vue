<template>
    <view class="page">
        <HeaderNav title="推荐记录" type="show-back" theme="000" />
        <view class="content">
            <wd-card v-for="rec in records" :key="rec.id" :custom-class="`recordCard recordCard--${rec.status}`"
                @click="handleRecordTap(rec.id)">
                <template #title>
                    <view class="recordCard__head">
                        <view class="recordCard__icon" :class="`recordCard__icon--${rec.status}`">
                            <FaIcon :name="rec.status === 'done' ? 'check' : 'eye'" :size="22" color="#fff" />
                        </view>
                        <wd-tag :type="rec.status === 'done' ? 'success' : 'primary'" variant="light" round>
                            {{ rec.title }}
                        </wd-tag>
                    </view>
                </template>

                <wd-grid :column="3" custom-class="recordGrid">
                    <wd-grid-item v-for="cell in rec.cells" :key="cell.label">
                        <view class="recordCell" :class="`recordCell--${rec.status}`">
                            <view class="recordCell__value">{{ cell.value }}</view>
                            <view class="recordCell__label">{{ cell.label }}</view>
                        </view>
                    </wd-grid-item>
                </wd-grid>
            </wd-card>
        </view>

        <wd-toast selector="recToast" />
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'

type RecordCell = { value: string; label: string }
type RecordStatus = 'done' | 'review'
type RecommendationRecord = {
    id: string
    title: string
    status: RecordStatus
    cells: RecordCell[]
}

const toast = useToast('recToast')

const records = ref<RecommendationRecord[]>([
    {
        id: 'r1',
        title: '已推荐',
        status: 'done',
        cells: [
            { value: '2024–11', label: '推荐时间' },
            { value: '美团', label: '在职时间' },
            { value: '产品总监', label: '推荐内容' },
        ],
    },
    {
        id: 'r2',
        title: '已推荐审核中',
        status: 'review',
        cells: [
            { value: '2024–11', label: '推荐时间' },
            { value: '美团', label: '在职时间' },
            { value: '产品总监', label: '推荐内容' },
        ],
    },
])

const handleRecordTap = (id: string) => {
    toast.info(`已点击：${id}`)
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell(var(--app-bg));
}

.content {
    padding: 18rpx 0 44rpx;
}

.recordCard {
    border: 1px solid rgba(255, 255, 255, 0.7);
    overflow: hidden;
    padding: 20rpx 22rpx 22rpx;
    border-radius: var(--app-radius-lg);
    box-shadow: var(--app-shadow-card);
    background: rgba(255, 255, 255, 0.86);

    &+.recordCard {
        margin-top: 18rpx;
    }
}

.recordCard--done {
    background:
        radial-gradient(820rpx 420rpx at 24% 10%, rgba(156, 255, 184, 0.14), rgba(156, 255, 184, 0) 60%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86));
}

.recordCard--review {
    background:
        radial-gradient(820rpx 420rpx at 24% 10%, rgba(122, 182, 255, 0.16), rgba(122, 182, 255, 0) 60%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86));
}

.recordCard__head {
    display: flex;
    align-items: center;
    gap: 14rpx;
    padding: 2rpx 0 16rpx;
}

.recordCard__icon {
    width: 44rpx;
    height: 44rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    box-shadow: 0 12rpx 26rpx rgba(0, 0, 0, 0.12);
}

.recordCard__icon--done {
    background: linear-gradient(180deg, #37d067 0%, #17b54a 100%);
}

.recordCard__icon--review {
    background: linear-gradient(180deg, #3b86ff 0%, #2563ff 100%);
}

:deep(.recordGrid) {
    :deep(.wd-grid) {
        padding-left: 0;

        :deep(.wd-grid-item__content) {
            padding: 0;
        }
    }
}

:deep(.wd-card__content) {
    padding: 0;
}

:deep(.wd-card__title) {
    padding-bottom: 0;
}

.recordCell {
    border-radius: 16rpx;
    padding: 18rpx 10rpx 16rpx;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &--done {
        background: rgba(52, 211, 153, 0.08);
        border: 1px solid rgba(52, 211, 153, 0.14);
    }

    &--review {
        background: rgba(59, 130, 246, 0.08);
        border: 1px solid rgba(59, 130, 246, 0.14);
    }
}

.recordCell__value {
    font-size: 28rpx;
    font-weight: 800;
    color: var(--app-text-primary);
}

.recordCell__label {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: var(--app-text-muted);
}
</style>
