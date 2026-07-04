<template>
    <view class="app-icon" :class="{ 'is-spin': spin }" :style="wrapperStyle" v-html="svg" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { loadIconSvg } from '@/icons/registry'
import type { IconName } from '@/icons/names'

type IconSize = number | `${number}px` | `${number}rpx` | `${number}em` | `${number}rem` | `${number}%`

const props = withDefaults(
    defineProps<{
        name: IconName
        size?: IconSize
        color?: string
        spin?: boolean
    }>(),
    {
        size: 24,
        spin: false
    }
)

const svg = ref('')

const sizeValue = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const wrapperStyle = computed(() => ({
    width: sizeValue.value,
    height: sizeValue.value,
    color: props.color
}))

watch(
    () => [props.name, props.color] as const,
    async ([name, color]) => {
        try {
            svg.value = await loadIconSvg(name, { color })
        } catch {
            svg.value = ''
        }
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
.app-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
}

.app-icon :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
}

.is-spin {
    animation: app-icon-spin 1s linear infinite;
}

@keyframes app-icon-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
