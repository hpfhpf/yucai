<!--
 * @Description: 全局挂载
-->
<script setup lang="ts">
// 顶部消息提示
import GlobalNotify from '@/components/GlobalNotify/index.vue';
import { useQueue } from '@wot-ui/ui/composables';
useQueue();
</script>

<template>
  <GlobalNotify />
  <KuRootView />
</template>
