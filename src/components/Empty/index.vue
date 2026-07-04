<script lang="ts" setup>
import { useSlots } from 'vue'

// 更精确的 iconSize 类型：支持数字（px）或字符串（带单位）
type IconSize = number | string

interface Props {
    image?: string
    imageSize?: IconSize
    tip?: string
}

const props = withDefaults(defineProps<Props>(), {
    image: 'empty',
    tip: '暂无数据'
})

const slots = useSlots()

// 判断是否提供了 image 插槽（类型安全）
const hasImageSlot = () => !!slots.image
</script>

<template>
    <wd-empty :tip="tip" :icon="image" :icon-size="imageSize">
        <!-- 使用 v-if 控制插槽注入 -->
        <template v-if="hasImageSlot()" #image>
            <slot name="image" />
        </template>
        <!-- 否则 wd-empty 自动使用 :icon prop -->
    </wd-empty>
</template>
