<script setup lang="ts">
import { computed } from 'vue'
import { useNotify } from './index'
import FaIcon from '@/components/FaIcon/index.vue'
const {
    globalNotifyState,
    options
} = useNotify()

// wot-ui 图标名 -> font-awesome
const faMap: Record<string, string> = {
    'close-outline': 'circle-xmark',
    'close': 'circle-xmark',
    'check': 'circle-check',
    'warning': 'triangle-exclamation',
    'info': 'circle-info',
}
const faName = computed(() => faMap[options.value?.icon || ''] || 'circle-info')
</script>

<template>
    <wd-popup
        v-model="globalNotifyState"
        :position="'top'"
        :z-index="99"
        :duration="250"
        :modal="false"
    >
        <view class="global_notify" :class="[`global_notify_${options?.type ? options?.type : 'primary'}`]">
            <template v-if="options?.icon">
                <wd-loading v-if="options.icon === 'loading'" size="22px" />
                <FaIcon v-else color="#fff" :name="faName" size="22px" />
            </template>
            {{ options?.content }}
        </view>
    </wd-popup>
</template>


<style lang="scss" scoped>
@import './index.scss';
</style>