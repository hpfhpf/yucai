<template>
    <wd-popup v-model="visible" position="bottom" :safe-area-inset-bottom="true"
        custom-class="chatPopup" custom-style="z-index: 2200 !important;" @close="handleClose">
        <view class="chat">
            <!-- 头部 -->
            <view class="chat__hd">
                <view class="chat__hdLeft">
                    <view class="chat__hdTitle">与 {{ targetName }} 沟通中</view>
                    <view v-if="unreadCount > 0" class="chat__badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
                </view>
                <view class="chat__hdClose" hover-class="chat__hdClose--pressed" @click="handleClose">
                    <FaIcon name="xmark" :size="26" color="rgba(0,0,0,0.34)" />
                </view>
            </view>

            <!-- 消息列表 -->
            <scroll-view class="chat__body" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
                <view class="chat__status">
                    <view class="chat__statusLine">以下是与 {{ targetName }} 的沟通记录</view>
                </view>

                <view v-for="m in messages" :key="m.id" class="msg" :class="m.role === 'me' ? 'msg--me' : 'msg--other'">
                    <!-- 对方头像 -->
                    <view v-if="m.role === 'other'" class="msg__avatar msg__avatar--other" />

                    <view class="msg__wrap">
                        <view class="msg__bubble" :class="m.role === 'me' ? 'msg__bubble--me' : 'msg__bubble--other'">
                            <view class="msg__text">{{ m.text }}</view>
                        </view>
                        <!-- 发送状态：仅我方消息显示 -->
                        <view v-if="m.role === 'me'" class="msg__status">
                            <template v-if="m.sending">
                                <view class="msg__statusIcon msg__statusIcon--sending" />
                                <text class="msg__statusText">发送中</text>
                            </template>
                            <template v-else-if="m.status === 'sent'">
                                <FaIcon name="check" :size="22" color="rgba(0,0,0,0.32)" />
                                <text class="msg__statusText">已发送</text>
                            </template>
                            <template v-else-if="m.status === 'read'">
                                <FaIcon name="check-double" :size="22" color="rgba(30,91,255,0.8)" />
                                <text class="msg__statusText msg__statusText--read">已读</text>
                            </template>
                        </view>
                    </view>

                    <!-- 我方头像 -->
                    <view v-if="m.role === 'me'" class="msg__avatar msg__avatar--me" />
                </view>

                <view class="chat__bodyPad" />
            </scroll-view>

            <!-- 输入区域 -->
            <view class="chat__composer" :style="{ paddingBottom: `${safeBottom}px` }">
                <view class="chat__inputWrap">
                    <wd-input v-model="draft" custom-class="chatInput" placeholder="输入消息..."
                        confirm-type="send" @confirm="handleSend" />
                </view>
                <view class="chat__sendBtn" hover-class="chat__sendBtn--pressed" @click="handleSend">
                    发送
                </view>
            </view>
        </view>
    </wd-popup>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'

type MessageStatus = 'sending' | 'sent' | 'read'

type ChatMessage = {
    id: string
    role: 'me' | 'other'
    text: string
    sending?: boolean
    status?: MessageStatus
}

const props = defineProps<{
    modelValue: boolean
    targetName: string
    targetUserId: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'unread-count': [count: number]
}>()

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)
const scrollTop = ref(0)

// 模拟初始历史消息
const initialOtherMessages: ChatMessage[] = [
    { id: 'h1', role: 'other', text: '您好，我对您的简历很感兴趣，想和您聊聊关于我们公司的职位机会。' },
    { id: 'h2', role: 'me', text: '好的，请问是什么职位？', status: 'read' },
    { id: 'h3', role: 'other', text: '我们目前在招聘前端开发工程师，看您的背景非常匹配。' },
    { id: 'h4', role: 'me', text: '能介绍一下具体的岗位职责吗？', status: 'read' },
    { id: 'h5', role: 'other', text: '主要负责公司核心产品的 Web 前端开发，使用 Vue3 + TypeScript 技术栈。' },
    { id: 'h6', role: 'other', text: '团队氛围很好，福利待遇也不错，您有兴趣进一步了解吗？' },
]

const messages = ref<ChatMessage[]>([])
const draft = ref('')
const unreadCount = ref(0)
let autoReplyTimer: any = null

// 初始化消息
watch(visible, (val) => {
    if (val) {
        messages.value = [...initialOtherMessages]
        scrollToBottom()
        unreadCount.value = 0
        emit('unread-count', 0)
    }
})

const handleClose = () => {
    visible.value = false
    if (autoReplyTimer) {
        clearTimeout(autoReplyTimer)
        autoReplyTimer = null
    }
}

const addMessage = (msg: ChatMessage) => {
    messages.value.push(msg)
    scrollToBottom()
}

const pushMeMessage = (text: string) => {
    const msgId = `m_${Date.now()}`
    const msg: ChatMessage = { id: msgId, role: 'me', text, sending: true, status: undefined }
    addMessage(msg)

    // 模拟发送过程：发送中 → 已发送 → 已读
    setTimeout(() => {
        const idx = messages.value.findIndex(m => m.id === msgId)
        if (idx > -1) {
            messages.value[idx].sending = false
            messages.value[idx].status = 'sent'
        }
    }, 800)

    setTimeout(() => {
        const idx = messages.value.findIndex(m => m.id === msgId)
        if (idx > -1) {
            messages.value[idx].status = 'read'
        }

        // 对方自动回复
        autoReply(text)
    }, 2000)
}

const autoReply = (receivedText: string) => {
    const replies: Record<string, string[]> = {
        default: [
            '好的，我了解了。',
            '谢谢您的回复！',
            '能再详细说说吗？',
            '听起来不错，我考虑一下。',
            '好的，我们保持联系。',
        ],
        '面试': ['好的，什么时间方便？', '请问面试大概多长时间？', '好的，我准时参加。'],
        '薪资': ['具体是什么范围呢？', '和我预期差不多。'],
        '时间': ['好的，我确认一下时间安排。', '这个时间我可以。'],
    }

    let pool = replies.default
    for (const [keyword, list] of Object.entries(replies)) {
        if (keyword !== 'default' && receivedText.includes(keyword)) {
            pool = list
            break
        }
    }

    const reply = pool[Math.floor(Math.random() * pool.length)]

    autoReplyTimer = setTimeout(() => {
        // 模拟"对方正在输入"效果（不做打字动画）
        addMessage({ id: `o_${Date.now()}`, role: 'other', text: reply })
        // 未读计数（如果弹窗开着但用户可能没在看）
        // 这里只在模拟对面发消息时更新
    }, 1500 + Math.random() * 2000)
}

const handleSend = () => {
    const text = draft.value.trim()
    if (!text) return
    draft.value = ''
    pushMeMessage(text)
}

const scrollToBottom = async () => {
    await nextTick()
    scrollTop.value = scrollTop.value + 99999
}

const onScroll = () => { }
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';

:deep(.chatPopup) {
    border-radius: 28rpx 28rpx 0 0 !important;
}

.chat {
    height: 80vh;
    display: flex;
    flex-direction: column;
    background: var(--app-bg);
}

// 头部
.chat__hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22rpx 26rpx;
    background: var(--app-surface-strong);
    border-bottom: 1px solid var(--app-line);
    flex: 0 0 auto;
}

.chat__hdLeft {
    display: flex;
    align-items: center;
    gap: 14rpx;
    min-width: 0;
}

.chat__hdTitle {
    font-size: 30rpx;
    font-weight: 950;
    color: var(--app-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat__badge {
    min-width: 40rpx;
    height: 40rpx;
    padding: 0 10rpx;
    border-radius: var(--app-radius-pill);
    background: #ff3b30;
    color: #fff;
    font-size: 22rpx;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
}

.chat__hdClose {
    width: 60rpx;
    height: 60rpx;
    border-radius: var(--app-radius-pill);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
}

.chat__hdClose--pressed {
    background: rgba(0, 0, 0, 0.05);
}

// 消息列表
.chat__body {
    flex: 1 1 auto;
    padding: 18rpx 22rpx 0;
    box-sizing: border-box;
}

.chat__status {
    text-align: center;
    margin-bottom: 22rpx;
}

.chat__statusLine {
    display: inline-block;
    padding: 10rpx 24rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.045);
    font-size: 24rpx;
    font-weight: 700;
    color: var(--app-text-muted);
}

.chat__bodyPad {
    height: 22rpx;
}

// 消息行
.msg {
    display: flex;
    align-items: flex-end;
    gap: 20rpx;
    margin-bottom: 28rpx;
}

.msg--me {
    justify-content: flex-end;
}

// 头像
.msg__avatar {
    width: 68rpx;
    height: 68rpx;
    border-radius: var(--app-radius-pill);
    flex: 0 0 auto;
}

.msg__avatar--other {
    background:
        radial-gradient(60rpx 60rpx at 30% 30%, rgba(255, 122, 0, 0.24), rgba(255, 122, 0, 0) 58%),
        radial-gradient(60rpx 60rpx at 70% 70%, rgba(30, 91, 255, 0.20), rgba(30, 91, 255, 0) 60%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.msg__avatar--me {
    background:
        radial-gradient(64rpx 64rpx at 30% 30%, rgba(180, 180, 180, 0.24), rgba(180, 180, 180, 0) 58%),
        radial-gradient(64rpx 64rpx at 70% 70%, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0) 60%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

// 消息气泡
.msg__wrap {
    max-width: 480rpx;
    display: flex;
    flex-direction: column;
}

.msg--me .msg__wrap {
    align-items: flex-end;
}

.msg__bubble {
    border-radius: var(--app-radius-md);
    box-shadow: 0 6rpx 22rpx rgba(30, 60, 140, 0.06);
    overflow: hidden;
}

.msg__bubble--other {
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.9);
}

.msg__bubble--me {
    background: linear-gradient(135deg, rgba(30, 91, 255, 0.88), rgba(78, 133, 255, 0.84));
}

.msg__text {
    padding: 18rpx 22rpx;
    font-size: 28rpx;
    line-height: 1.55;
    font-weight: 700;
}

.msg__bubble--other .msg__text {
    color: var(--app-text-primary);
}

.msg__bubble--me .msg__text {
    color: #fff;
}

// 发送状态
.msg__status {
    margin-top: 8rpx;
    display: flex;
    align-items: center;
    gap: 6rpx;
}

.msg__statusIcon {
    width: 22rpx;
    height: 22rpx;
}

.msg__statusIcon--sending {
    border: 3rpx solid rgba(0, 0, 0, 0.18);
    border-top-color: rgba(0, 0, 0, 0.06);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.msg__statusText {
    font-size: 20rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.32);
}

.msg__statusText--read {
    color: rgba(30, 91, 255, 0.8);
}

// 输入区域
.chat__composer {
    display: flex;
    align-items: center;
    gap: 14rpx;
    padding: 14rpx 22rpx;
    background: var(--app-surface-strong);
    border-top: 1px solid var(--app-line);
    flex: 0 0 auto;
}

.chat__inputWrap {
    flex: 1 1 auto;
    min-width: 0;
    height: 76rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
}

:deep(.chatInput) {
    flex: 1 1 auto;
    width: 100%;
    background: transparent !important;

    // 去掉 wd-input 默认的边框、内边距、背景与 cell 高度
    &.wd-input,
    .wd-input__body {
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
    }

    // 去掉底部分隔线
    &::after,
    .wd-input__body::after {
        display: none !important;
        border: none !important;
    }

    .wd-input__value,
    .wd-input__inner {
        height: 76rpx;
        line-height: 76rpx;
        padding: 0 !important;
        font-size: 27rpx;
        font-weight: 700;
        color: var(--app-text-primary) !important;
        background: transparent !important;
    }

    .wd-input__placeholder,
    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 27rpx;
        font-weight: 700;
        line-height: 76rpx;
    }
}

.chat__sendBtn {
    height: 76rpx;
    padding: 0 30rpx;
    border-radius: var(--app-radius-pill);
    background: linear-gradient(135deg, rgba(30, 91, 255, 1), rgba(78, 133, 255, 1));
    color: #fff;
    font-size: 26rpx;
    font-weight: 950;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 32rpx rgba(30, 91, 255, 0.24);
    flex: 0 0 auto;
    transition: opacity 0.18s ease;
}

.chat__sendBtn--pressed {
    opacity: 0.88;
}
</style>
