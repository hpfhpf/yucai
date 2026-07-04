<template>
    <wd-popup v-model="show" position="bottom" :z-index="1000" :close-on-click-modal="true"
        :safe-area-inset-bottom="true" custom-style="border-radius: 24rpx 24rpx 0 0; background: #fff;"
        @close="handleClose">
        <view class="picker">
            <view class="picker__header">
                <text class="picker__title">选择头像</text>
                <text class="picker__hint">挑一个喜欢的内置头像</text>
            </view>
            <scroll-view class="picker__grid" scroll-y>
                <view class="picker__list">
                    <view v-for="item in presets" :key="item.icon" class="picker__cell"
                        :class="{ 'picker__cell--active': item.icon === selected }"
                        @click="selected = item.icon">
                        <view class="picker__avatar" :style="{ backgroundColor: item.bg }">
                            <FaIcon :name="item.icon" :size="48" color="#fff" />
                        </view>
                        <FaIcon v-if="item.icon === selected" name="circle-check" :size="30" color="#1e5bff"
                            class="picker__check" />
                    </view>
                </view>
            </scroll-view>
            <view class="picker__footer">
                <wd-button plain block custom-class="picker__cancel" @click="handleClose">取消</wd-button>
                <wd-button block type="primary" :loading="saving" :disabled="!selected"
                    custom-class="picker__confirm" @click="handleConfirm">确定</wd-button>
            </view>
        </view>
    </wd-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { PRESET_AVATARS } from '@/utils/avatar'

const props = defineProps<{
    modelValue: boolean
    // 当前头像图标名（不含 fa: 前缀）
    current?: string
    saving?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
    (e: 'confirm', icon: string): void
}>()

const presets = PRESET_AVATARS
const show = ref(props.modelValue)
const selected = ref(props.current || '')

watch(() => props.modelValue, (v) => {
    show.value = v
    if (v) selected.value = props.current || ''
})
watch(show, (v) => emit('update:modelValue', v))

const handleClose = () => {
    show.value = false
}

const handleConfirm = () => {
    if (!selected.value) return
    emit('confirm', selected.value)
}
</script>

<style scoped lang="scss">
.picker {
    padding: 32rpx 32rpx 24rpx;
}

.picker__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24rpx;
}

.picker__title {
    font-size: 34rpx;
    font-weight: 600;
    color: var(--app-text-primary);
}

.picker__hint {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: var(--app-text-secondary, #8a94a6);
}

.picker__grid {
    max-height: 620rpx;
}

.picker__list {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx 0;
}

.picker__cell {
    position: relative;
    width: 25%;
    display: flex;
    justify-content: center;
    transition: transform var(--app-timing-fast) var(--app-ease-standard);

    &:active {
        transform: scale(0.92);
    }
}

.picker__avatar {
    width: 108rpx;
    height: 108rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 18rpx rgba(1, 18, 74, 0.14);
    border: 4rpx solid transparent;
}

.picker__cell--active .picker__avatar {
    border-color: #1e5bff;
}

.picker__check {
    position: absolute;
    right: 18rpx;
    bottom: -6rpx;
    background: #fff;
    border-radius: 50%;
}

.picker__footer {
    display: flex;
    gap: 20rpx;
    margin-top: 28rpx;
}

.picker__cancel,
.picker__confirm {
    flex: 1;
}
</style>
