<template>
    <view class="page">
        <view class="header">
            <HeaderNav title="沟通" type="show-back" theme="000" />
        </view>

        <view class="topBar">
            <view class="topBar__left">
                <FaIcon name="comment-dots" :size="30" color="#1e5bff" />
                <view class="topBar__text">聊得不错，给HR发份简历?</view>
            </view>
            <view class="topBar__cta" hover-class="topBar__cta--pressed" @click="openDeliver">发简历</view>
        </view>

        <scroll-view class="chat" scroll-y :scroll-top="scrollTop" @scroll="handleScroll">
            <view class="status">
                <view class="status__line">您目前正在沟通：{{ jobName }}</view>
                <view class="status__time">{{ statusTime }}</view>
            </view>

            <view v-for="m in messages" :key="m.id" class="msg" :class="m.role === 'me' ? 'msg--me' : 'msg--other'">
                <view v-if="m.role === 'other'" class="avatar avatar--other" />

                <view class="bubbleWrap">
                    <view class="bubble" :class="m.role === 'me' ? 'bubble--me' : 'bubble--other'">
                        <view class="bubble__text">{{ m.text }}</view>
                        <view v-if="m.actionText && m.role === 'other'" class="bubble__action" @click="openDeliver">
                            {{ m.actionText }}
                        </view>
                    </view>
                </view>

                <view v-if="m.role === 'me'" class="avatar avatar--me" />
            </view>

            <view class="chat__pad" />
        </scroll-view>

        <view class="composer" :style="{ paddingBottom: `${safeBottom}px` }">
            <view class="composer__inputWrap">
                <wd-input v-model="draft" custom-class="composerInput" placeholder="请输入" @confirm="handleSend" />
            </view>
            <view class="composer__right">
                <wd-button class="wd-button--primary" @click="handleSend">发送</wd-button>
            </view>
        </view>

        <wd-popup v-model="deliverVisible" position="center" :show-close="true" :close-on-click-modal="true" round>
            <view class="deliverSheet">
                <view class="deliverSheet__header">
                    <view class="deliverSheet__title">确认投递</view>
                </view>

                <view class="deliverSheet__job">
                    <view class="deliverSheet__jobLeft">
                        <view class="deliverSheet__logo" />
                        <view class="deliverSheet__jobMain">
                            <view class="deliverSheet__jobName">{{ jobName }}</view>
                            <view class="deliverSheet__company">{{ title }}</view>
                            <view class="deliverSheet__tags">
                                <wd-tag type="primary" size="small">全职</wd-tag>
                                <wd-tag type="primary" size="small">购买社保</wd-tag>
                            </view>
                        </view>
                    </view>
                    <view class="deliverSheet__arrow" />
                </view>

                <view class="deliverSheet__field">
                    <view class="deliverSheet__fieldLabel">附言</view>
                    <wd-input v-model="deliverNote" placeholder="给HR留言（可选）" />
                </view>

                <view class="deliverSheet__actions">
                    <wd-button type="primary" block @click="handleConfirmDeliver">确认投递</wd-button>
                </view>

                <view class="deliverSheet__hint">确认后将向对方投递你的简历</view>
            </view>
        </wd-popup>
    </view>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import FaIcon from '@/components/FaIcon/index.vue'

type ChatMessage = {
    id: string
    role: 'me' | 'other'
    text: string
    actionText?: string
}

const title = ref('连锁餐厅')
const jobName = ref('前台行政')
const statusTime = ref('12:03')

const messages = ref<ChatMessage[]>([
    {
        id: 'm1',
        role: 'other',
        text: '我觉得您非常适合我司的行政前台岗位，能发份简历吗？',
        actionText: '发简历'
    },
    { id: 'm2', role: 'me', text: '好的！' }
])

const draft = ref('')
const scrollTop = ref(0)
const deliverVisible = ref(false)
const deliverNote = ref('')

const systemInfo = uni.getWindowInfo()
const safeBottom = ref(systemInfo.safeAreaInsets?.bottom || 0)

const pushMeMessage = (text: string) => {
    messages.value.push({ id: `m_${Date.now()}`, role: 'me', text })
}

const scrollToBottom = async () => {
    await nextTick()
    scrollTop.value = scrollTop.value + 99999
}

const handleSend = () => {
    const text = draft.value.trim()
    if (!text) return
    draft.value = ''
    pushMeMessage(text)
    scrollToBottom()
}

const handleScroll = () => { }

const openDeliver = () => {
    deliverVisible.value = true
}

const closeDeliver = () => {
    deliverVisible.value = false
    deliverNote.value = ''
}

const handleConfirmDeliver = () => {
    uni.showToast({ title: '投递成功', icon: 'none' })
    closeDeliver()
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';

.page {
    min-height: 100vh;
    background: var(--app-bg);
    display: flex;
    flex-direction: column;
}

.header {
    background-color: #FFF;
    flex-shrink: 0;
}

.topBar {
    background: #fff;
    padding: 14rpx 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--app-line);
    flex: 0 0 auto;
}

.topBar__left {
    display: flex;
    align-items: center;
    gap: 14rpx;
    min-width: 0;
}

.topBar__text {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.topBar__cta {
    height: 56rpx;
    padding: 0 22rpx;
    border-radius: 999rpx;
    background: var(--app-primary);
    color: #fff;
    font-size: 26rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
}

.topBar__cta--pressed {
    opacity: 0.92;
}

.chat {
    flex: 1 1 auto;
    padding: 18rpx 24rpx 0;
    box-sizing: border-box;
}

.status {
    text-align: center;
    margin-top: 8rpx;
    margin-bottom: 18rpx;
}

.status__line {
    font-size: 26rpx;
    color: var(--app-text-muted);
}

.status__time {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: var(--app-text-muted);
    opacity: 0.8;
}

.msg {
    display: flex;
    align-items: flex-end;
    gap: 24rpx;
    margin-bottom: 32rpx;
}

.msg--me {
    justify-content: flex-end;
}

.avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.04);
    flex: 0 0 auto;
}

.avatar--other {
    background:
        radial-gradient(70rpx 70rpx at 30% 30%, rgba(255, 165, 0, 0.26), rgba(255, 165, 0, 0) 60%),
        radial-gradient(70rpx 70rpx at 70% 70%, rgba(30, 91, 255, 0.22), rgba(30, 91, 255, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.avatar--me {
    background:
        radial-gradient(76rpx 76rpx at 30% 30%, rgba(180, 180, 180, 0.26), rgba(180, 180, 180, 0) 60%),
        radial-gradient(76rpx 76rpx at 70% 70%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.bubbleWrap {
    max-width: 560rpx;
}

.bubble {
    border-radius: var(--app-radius-md);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
}

.bubble--other {
    background: var(--app-surface-muted);
}

.bubble--me {
    background: rgba(197, 226, 255, 0.82);
}

.bubble__text {
    padding: 18rpx 18rpx 12rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    color: var(--app-text-primary);
}

.bubble__action {
    padding: 10rpx 18rpx 16rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 700;
    color: var(--app-primary);
}

.chat__pad {
    height: 18rpx;
}

.composer {
    background: #fff;
    padding: 14rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 14rpx;
    border-top: 1px solid var(--app-line);
    flex: 0 0 auto;
}

.composer__inputWrap {
    flex: 1;
    height: 76rpx;
    border-radius: 14rpx;
    background: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    padding: 0 16rpx;
    border: 1px solid #999;
}

.composer__right {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.deliverSheet {
    width: 640rpx;
    overflow: hidden;
    background: var(--app-surface);
}

.deliverSheet__header {
    padding: 26rpx 26rpx 18rpx;
    background:
        radial-gradient(520rpx 240rpx at 16% 20%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 62%),
        linear-gradient(135deg, rgba(180, 242, 255, 0.95) 0%, rgba(156, 232, 255, 0.9) 60%, rgba(142, 222, 255, 0.86) 100%);
}

.deliverSheet__title {
    text-align: center;
    font-size: 34rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.78);
    letter-spacing: 2rpx;
}

.deliverSheet__job {
    margin: 18rpx 24rpx 0;
    padding: 18rpx 18rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface-muted);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--app-shadow-card);
}

.deliverSheet__jobLeft {
    display: flex;
    align-items: center;
    gap: 14rpx;
    min-width: 0;
}

.deliverSheet__logo {
    width: 64rpx;
    height: 64rpx;
    border-radius: 999rpx;
    background:
        radial-gradient(70rpx 70rpx at 30% 30%, rgba(255, 165, 0, 0.18), rgba(255, 165, 0, 0) 60%),
        radial-gradient(70rpx 70rpx at 70% 70%, rgba(30, 91, 255, 0.16), rgba(30, 91, 255, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
    flex: 0 0 auto;
}

.deliverSheet__jobMain {
    min-width: 0;
}

.deliverSheet__jobName {
    font-size: 30rpx;
    font-weight: 800;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.deliverSheet__company {
    margin-top: 6rpx;
    font-size: 24rpx;
    color: var(--app-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.deliverSheet__tags {
    margin-top: 10rpx;
    display: flex;
    gap: 10rpx;
}

.deliverSheet__arrow {
    width: 14rpx;
    height: 14rpx;
    border-right: 4rpx solid rgba(0, 0, 0, 0.28);
    border-top: 4rpx solid rgba(0, 0, 0, 0.28);
    transform: rotate(45deg);
    margin-left: 12rpx;
    flex: 0 0 auto;
}

.deliverSheet__field {
    margin: 18rpx 24rpx 0;
    padding: 16rpx 18rpx;
    border-radius: var(--app-radius-lg);
    background: rgba(0, 0, 0, 0.035);
}

.deliverSheet__fieldLabel {
    font-size: 28rpx;
    font-weight: 700;
    margin-bottom: 24rpx;
    color: var(--app-text-secondary);
}

.deliverSheet__actions {
    margin: 18rpx 24rpx 0;
}

.deliverSheet__hint {
    margin: 14rpx 24rpx 26rpx;
    text-align: center;
    font-size: 24rpx;
    color: var(--app-text-muted);
}
</style>
