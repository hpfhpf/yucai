<template>
    <view v-if="shown" class="popup" :style="{ top: topStyle, zIndex: `${zIndex}` }">
        <view class="popup__mask" :class="{ 'popup__mask--show': visible }" @click="handleMaskClick" />

        <view class="panel" :class="{ 'panel--show': visible }" @click.stop>
            <scroll-view class="panel__scroll" scroll-y>
                <view class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
                    <view v-for="opt in options" :key="opt.value" class="item" hover-class="item--pressed"
                        @click="select(opt)">
                        <view class="item__text" :class="{ 'item__text--active': opt.value === localSelected }">
                            {{ opt.label }}
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

export type IndustryFilterOption = {
    label: string
    value: string
}

type CloseReason = 'mask' | 'api'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        options: IndustryFilterOption[]
        selected?: string
        columns?: number
        top?: number | string
        zIndex?: number
        autoClose?: boolean
    }>(),
    {
        selected: undefined,
        columns: 2,
        top: 0,
        zIndex: 2000,
        autoClose: true,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
    (e: 'update:selected', v: string): void
    (e: 'close', payload: { reason: CloseReason }): void
    (e: 'change', payload: { value: string; label: string }): void
    (e: 'confirm', payload: { value: string; label: string }): void
}>()

const shown = ref(false)
const visible = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const localSelected = ref('')

watch(
    () => props.selected,
    (v) => {
        if (typeof v === 'string') localSelected.value = v
    },
    { immediate: true },
)

watch(
    () => props.modelValue,
    async (open) => {
        if (closeTimer) {
            clearTimeout(closeTimer)
            closeTimer = null
        }
        if (open) {
            shown.value = true
            await nextTick()
            visible.value = true
            return
        }
        visible.value = false
        closeTimer = setTimeout(() => {
            shown.value = false
            closeTimer = null
        }, 180)
    },
    { immediate: true },
)

const topStyle = computed(() => {
    if (typeof props.top === 'number') return `${props.top}px`
    return props.top || '0px'
})

const requestClose = (reason: CloseReason) => {
    emit('update:modelValue', false)
    emit('close', { reason })
}

const handleMaskClick = () => requestClose('mask')

const select = (opt: IndustryFilterOption) => {
    if (opt.value !== localSelected.value) {
        localSelected.value = opt.value
        emit('update:selected', opt.value)
        emit('change', { value: opt.value, label: opt.label })
    }
    emit('confirm', { value: opt.value, label: opt.label })
    if (props.autoClose) requestClose('api')
}
</script>

<style scoped lang="scss">
.popup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}

.popup__mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    transition: background 180ms ease;
}

.popup__mask--show {
    background: rgba(0, 0, 0, 0.32);
}

.panel {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.98);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 18rpx 46rpx rgba(0, 0, 0, 0.10);
    transform: translateY(-10rpx);
    opacity: 0;
    transition: transform 180ms ease, opacity 180ms ease;
}

.panel--show {
    transform: translateY(0);
    opacity: 1;
}

.panel__scroll {
    max-height: 520rpx;
    max-height: 60vh;
}

.grid {
    display: grid;
    gap: 0;
    padding: 18rpx 22rpx 26rpx;
    box-sizing: border-box;
}

.item {
    height: 86rpx;
    display: flex;
    align-items: center;
}

.item--pressed {
    opacity: 0.9;
}

.item__text {
    font-size: 30rpx;
    font-weight: 750;
    color: rgba(0, 0, 0, 0.78);
}

.item__text--active {
    color: rgba(30, 91, 255, 0.98);
}
</style>
