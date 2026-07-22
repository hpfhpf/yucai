<template>
    <view class="page">
        <HeaderNav title="发布职位" type="show-back" theme="000" />

        <!-- Tab 切换 -->
        <view class="tabBar">
            <view v-for="tab in tabs" :key="tab.key" class="tabItem"
                :class="{ 'tabItem--active': activeTab === tab.key }"
                @click="switchTab(tab.key)">
                <FaIcon :name="tab.icon" :size="28" :color="activeTab === tab.key ? '#1e5bff' : '#666'" />
                <text class="tabText">{{ tab.label }}</text>
            </view>
        </view>

        <!-- 内容区（占据剩余高度，内部滚动） -->
        <view class="tabContent">
            <!-- AI生成 Tab -->
            <AIJobGenerator v-if="activeTab === 'ai'" class="tabPane" @generated="onAiGenerated" @publish="onAiPublish" />

            <!-- 手工发布 Tab -->
            <ManualJobPosting v-else ref="manualRef" class="tabPane" :initial-data="manualFormData" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import AIJobGenerator from './components/AIJobGenerator.vue'
import ManualJobPosting from './components/ManualJobPosting.vue'

const tabs: Array<{ key: 'ai' | 'manual'; label: string; icon: string }> = [
    { key: 'ai', label: 'AI生成', icon: 'wand-magic-sparkles' },
    { key: 'manual', label: '手工发布', icon: 'pen-to-square' },
]

const activeTab = ref<'ai' | 'manual'>('ai')
const manualRef = ref<InstanceType<typeof ManualJobPosting>>()
const manualFormData = ref<Record<string, any> | null>(null)

const switchTab = (key: 'ai' | 'manual') => {
    if (activeTab.value === key) return
    activeTab.value = key
}

// AI 生成完成后，切换到手工发布 Tab 继续编辑
const onAiGenerated = (data: Record<string, any>) => {
    manualFormData.value = data
    activeTab.value = 'manual'
}

const onAiPublish = (data: Record<string, any>) => {
    // AI 直接发布：先切到手工发布 Tab 挂载组件，再复用其发布逻辑
    manualFormData.value = data
    activeTab.value = 'manual'
    nextTick(() => {
        manualRef.value?.directPublish?.()
    })
}
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    height: 100vh;
    background: linear-gradient(180deg, #dfe7ff 0%, var(--app-bg) 42%, var(--app-bg) 100%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
}

.tabBar {
    flex: 0 0 auto;
    display: flex;
    background: var(--app-surface);
    border-bottom: 1px solid var(--app-line);
    padding: 0 40rpx;
}

/* 内容区：吃掉 header + tabBar 之后的剩余高度，min-height:0 让内部 scroll-view 可正确滚动 */
.tabContent {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/*
 * 小程序端：子组件会生成一层「宿主节点」，该节点默认不继承父级的 flex 参与。
 * 需要显式让宿主节点成为 flex item 且自身为 flex column 容器，
 * 否则内部 .aiContainer / .manualContainer 的 flex:1 无法拿到高度，导致布局塌陷。
 */
.tabPane {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
}

.tabItem {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    height: 88rpx;
    position: relative;
    transition: all 0.2s ease;

    &:active {
        opacity: 0.7;
    }
}

.tabItem--active {
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 20%;
        right: 20%;
        height: 4rpx;
        background: #1e5bff;
        border-radius: 2rpx;
    }
}

.tabText {
    font-size: 28rpx;
    color: #666;
    font-weight: 600;
}

.tabItem--active .tabText {
    color: #1e5bff;
    font-weight: 700;
}
</style>
