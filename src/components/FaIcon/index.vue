<template>
    <text class="fa-icon" :class="iconClass" :style="iconStyle" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

type FaStyle = 'solid' | 'regular' | 'brands'

const props = withDefaults(
    defineProps<{
        // 图标名，不含 fa- 前缀，如 'house' 'user' 'gear'
        name: string
        // 样式类型
        type?: FaStyle
        // 尺寸：数字按 rpx 处理，或直接传 '32rpx' '20px'
        size?: number | string
        // 颜色
        color?: string
        // 是否旋转（loading）
        spin?: boolean
        // 是否固定宽度（列表对齐）
        fixedWidth?: boolean
    }>(),
    {
        type: 'solid',
        size: 32,
        spin: false,
        fixedWidth: false
    }
)

const stylePrefix: Record<FaStyle, string> = {
    solid: 'fa-solid',
    regular: 'fa-regular',
    brands: 'fa-brands'
}

const iconClass = computed(() => [
    stylePrefix[props.type],
    `fa-${props.name}`,
    { 'fa-spin': props.spin, 'fa-fw': props.fixedWidth }
])

const sizeValue = computed(() => {
    if (typeof props.size === 'number') return `${props.size}rpx`
    return props.size
})

const iconStyle = computed(() => ({
    fontSize: sizeValue.value,
    color: props.color
}))
</script>

<style scoped lang="scss">
.fa-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-style: normal;
}
</style>
