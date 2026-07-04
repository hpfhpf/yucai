<script lang="ts" setup>
import { useSlots } from 'vue'

// 更精确的 imageSize 类型：支持对象、数字（px）、字符串（带单位）
type ImageSize =
    | { width: number; height: number }
    | number
    | string

interface Props {
    image?: string
    imageSize?: ImageSize
    tip?: string
}

const props = withDefaults(defineProps<Props>(), {
    image: 'content',
    tip: '暂无数据'
})

const slots = useSlots()

// 判断是否提供了 image 插槽（类型安全）
const hasImageSlot = () => !!slots.image
</script>

<template>
    <wd-status-tip :tip="tip" :image-size="imageSize">
        <!-- 使用 v-if 控制插槽注入 -->
        <template v-if="hasImageSlot()" #image>
            <slot name="image" />
        </template>
        <!-- 否则 wd-status-tip 自动使用 :image prop -->
    </wd-status-tip>
</template>