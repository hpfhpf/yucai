<template>
    <view v-if="shown" class="popup" :style="{ top: topStyle, zIndex: `${zIndex}` }">
        <view class="popup__mask" :class="{ 'popup__mask--show': visible }" @click="handleMaskClick" />

        <view class="panel" :class="{ 'panel--show': visible }" @click.stop>
            <view class="cols">
                <scroll-view class="col col--left" scroll-y>
                    <view v-for="opt in options" :key="opt.value" class="leftItem"
                        :class="{ 'leftItem--active': opt.value === localLeftValue }" hover-class="leftItem--pressed"
                        @click="selectLeft(opt.value)">
                        <view class="leftItem__text">{{ opt.label }}</view>
                        <view class="leftItem__bar" />
                    </view>
                </scroll-view>

                <scroll-view class="col col--right" scroll-y>
                    <view v-for="opt in rightOptions" :key="opt.value" class="rightItem"
                        hover-class="rightItem--pressed" @click="selectRight(opt.value)">
                        <view class="rightItem__text"
                            :class="{ 'rightItem__text--active': opt.value === localRightValue }">
                            {{ opt.label }}
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

export type AreaFilterOption = {
    label: string
    value: string
    children?: AreaFilterOption[]
}

type CloseReason = 'mask' | 'api'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        options: AreaFilterOption[]
        top?: number | string
        zIndex?: number
        leftValue?: string
        rightValue?: string
        autoClose?: boolean
    }>(),
    {
        top: 0,
        zIndex: 2000,
        leftValue: undefined,
        rightValue: undefined,
        autoClose: true,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void
    (e: 'update:leftValue', v: string): void
    (e: 'update:rightValue', v: string): void
    (e: 'close', payload: { reason: CloseReason }): void
    (e: 'change', payload: { leftValue: string; rightValue: string }): void
    (e: 'confirm', payload: { leftValue: string; rightValue: string; leftLabel: string; rightLabel: string }): void
}>()

const shown = ref(false)
const visible = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const localLeftValue = ref('')
const localRightValue = ref('')

const ensureDefaultSelection = () => {
    const leftFallback = props.options[0]?.value || ''
    if (!localLeftValue.value) localLeftValue.value = leftFallback
    if (props.options.length > 0 && !props.options.some((x) => x.value === localLeftValue.value)) {
        localLeftValue.value = leftFallback
    }

    const children = props.options.find((x) => x.value === localLeftValue.value)?.children || []
    const rightFallback = children[0]?.value || ''
    if (!localRightValue.value) localRightValue.value = rightFallback
    if (children.length > 0 && !children.some((x) => x.value === localRightValue.value)) {
        localRightValue.value = rightFallback
    }
}

watch(
    () => props.options,
    () => {
        ensureDefaultSelection()
    },
    { immediate: true, deep: true },
)

watch(
    () => props.leftValue,
    (v) => {
        if (typeof v === 'string') localLeftValue.value = v
        ensureDefaultSelection()
    },
    { immediate: true },
)

watch(
    () => props.rightValue,
    (v) => {
        if (typeof v === 'string') localRightValue.value = v
        ensureDefaultSelection()
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
            ensureDefaultSelection()
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

const rightOptions = computed(() => {
    return props.options.find((x) => x.value === localLeftValue.value)?.children || []
})

const getLabel = (list: AreaFilterOption[], value: string) => list.find((x) => x.value === value)?.label || ''

const requestClose = (reason: CloseReason) => {
    emit('update:modelValue', false)
    emit('close', { reason })
}

const handleMaskClick = () => requestClose('mask')

const selectLeft = (value: string) => {
    if (value === localLeftValue.value) return
    localLeftValue.value = value
    emit('update:leftValue', value)

    const children = props.options.find((x) => x.value === value)?.children || []
    const nextRight = children[0]?.value || ''
    if (nextRight && nextRight !== localRightValue.value) {
        localRightValue.value = nextRight
        emit('update:rightValue', nextRight)
    }

    emit('change', { leftValue: localLeftValue.value, rightValue: localRightValue.value })
}

const selectRight = (value: string) => {
    if (value === localRightValue.value) {
        if (props.autoClose) requestClose('api')
        return
    }
    localRightValue.value = value
    emit('update:rightValue', value)
    emit('change', { leftValue: localLeftValue.value, rightValue: localRightValue.value })

    const leftLabel = getLabel(props.options, localLeftValue.value)
    const rightLabel = getLabel(rightOptions.value, localRightValue.value)
    emit('confirm', { leftValue: localLeftValue.value, rightValue: localRightValue.value, leftLabel, rightLabel })
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

.cols {
    display: grid;
    grid-template-columns: 280rpx 1fr;
    max-height: 620rpx;
    max-height: 70vh;
}

.col {
    height: 620rpx;
    max-height: 70vh;
}

.col--left {
    background: rgba(0, 0, 0, 0.035);
}

.col--right {
    background: rgba(255, 255, 255, 1);
}

.leftItem {
    position: relative;
    height: 94rpx;
    padding: 0 22rpx 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.70);
    font-size: 28rpx;
    font-weight: 700;
}

.leftItem--pressed {
    opacity: 0.9;
}

.leftItem__bar {
    position: absolute;
    left: 0;
    top: 18rpx;
    bottom: 18rpx;
    width: 8rpx;
    background: rgba(30, 91, 255, 0.98);
    border-radius: 999rpx;
    opacity: 0;
    transition: opacity 180ms ease;
}

.leftItem--active {
    background: rgba(255, 255, 255, 1);
    color: rgba(30, 91, 255, 0.98);
}

.leftItem--active .leftItem__bar {
    opacity: 1;
}

.rightItem {
    height: 94rpx;
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.rightItem--pressed {
    opacity: 0.9;
}

.rightItem__text {
    font-size: 28rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.74);
}

.rightItem__text--active {
    color: rgba(30, 91, 255, 0.98);
}
</style>
