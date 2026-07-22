<template>
    <view class="aiContainer">
        <scroll-view class="chatArea" scroll-y :scroll-into-view="scrollIntoView"
            :style="{ paddingBottom: inputBottom + 'px' }">
            <!-- 欢迎提示 -->
            <view v-if="messages.length === 0" class="welcome">
                <view class="welcomeIcon">
                    <FaIcon name="wand-magic-sparkles" :size="48" color="#fff" />
                </view>
                <view class="welcomeTitle">AI 智能生成职位</view>
                <view class="welcomeDesc">
                    描述您的招聘需求，AI 将为您生成一份专业的职位信息
                </view>
                <view class="quickPrompts">
                    <view v-for="(prompt, idx) in quickPrompts" :key="idx" class="quickPrompt"
                        @click="usePrompt(prompt)">
                        {{ prompt }}
                    </view>
                </view>
            </view>

            <!-- 聊天消息 -->
            <view v-else class="messages">
                <view v-for="(msg, idx) in messages" :key="idx" class="message"
                    :class="`message--${msg.role}`" :id="`msg-${idx}`">
                    <view class="messageAvatar">
                        <view v-if="msg.role === 'ai'" class="aiAvatar">
                            <FaIcon name="robot" :size="32" color="#fff" />
                        </view>
                        <view v-else class="userAvatar">
                            <FaIcon name="user" :size="32" color="#fff" />
                        </view>
                    </view>
                    <view class="messageContent">
                        <view v-if="msg.role === 'ai' && msg.type === 'thinking'" class="thinking">
                            <view class="thinkingDots">
                                <view class="dot" />
                                <view class="dot" />
                                <view class="dot" />
                            </view>
                            <text class="thinkingText">AI 思考中…</text>
                        </view>
                        <view v-else-if="msg.type === 'jobCard' && msg.data" class="jobCard" @click="editJobResult">
                            <view class="jobCardTitle">{{ msg.data['title'] || '未命名职位' }}</view>
                            <view class="jobCardInfo">
                                <text class="jobCardSalary">{{ msg.data['salary'] || '薪资面议' }}</text>
                                <text class="jobCardTags">
                                    {{ [msg.data['city'], msg.data['education'], msg.data['experience']].filter(Boolean).join(' · ') }}
                                </text>
                            </view>
                            <view class="jobCardDesc">{{ (msg.data['description'] || '').slice(0, 80) }}…</view>
                            <view class="jobCardEdit">
                                <FaIcon name="pen" :size="20" color="#1e5bff" />
                                <text class="jobCardEditText">点击编辑完善职位信息</text>
                            </view>
                        </view>
                        <text v-else class="messageText">{{ msg.content }}</text>
                    </view>
                </view>

            </view>

            <view id="chatBottom" class="chatBottom" />
        </scroll-view>

        <!-- 底部操作区：生成结果后展示操作栏，否则展示输入框 -->
        <view v-if="generatedJob" class="resultActions" :style="{ paddingBottom: safeBottom + 'px' }">
            <wd-button type="primary" custom-class="resultBtn resultBtn--primary"
                :loading="publishing" @click="publishJob">
                确认发布
            </wd-button>
            <view class="resultSecondary">
                <wd-button plain custom-class="resultBtn" @click="continueEdit">继续编辑</wd-button>
                <wd-button plain custom-class="resultBtn" @click="regenerate">重新生成</wd-button>
            </view>
        </view>

        <!-- 输入区域 -->
        <view v-else class="inputArea" :style="{ paddingBottom: safeBottom + 'px' }">
            <view class="inputWrapper">
                <textarea v-model="inputText" class="input" :disabled="isGenerating"
                    :placeholder="isGenerating ? 'AI 正在生成中…' : '输入职位需求，例如：招聘一名3年以上经验的前端开发工程师…'"
                    :maxlength="500" auto-height @focus="onInputFocus" @blur="onInputBlur" />
                <view v-if="inputText.length > 0" class="inputCount">{{ inputText.length }}/500</view>
            </view>
            <view class="sendBtn" :class="{ 'sendBtn--disabled': !canSend }" @click="sendMessage">
                <FaIcon name="paper-plane" :size="32" color="#fff" />
            </view>
        </view>

        <!-- 编辑弹窗 -->
        <EditJobPopup v-model="editPopupShown" :job-data="generatedJob" @save="onJobEdited" />

        <wd-toast selector="aiJobToast" />
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import FaIcon from '@/components/FaIcon/index.vue'
import EditJobPopup from './EditJobPopup.vue'
import { apiAiGenerateJob } from '@/api/ai'

const toast = useToast('aiJobToast')
const emit = defineEmits<{
    generated: [data: Record<string, any>]
    publish: [data: Record<string, any>]
}>()

// 状态
const messages = ref<Array<{
    role: 'user' | 'ai'
    content?: string
    type?: 'text' | 'thinking' | 'jobCard'
    data?: Record<string, any>
}>>([])
const inputText = ref('')
const isGenerating = ref(false)
const generatedJob = ref<Record<string, any> | null>(null)
const editPopupShown = ref(false)
const scrollIntoView = ref('')
const inputBottom = ref(0)
const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)
const publishing = ref(false)

// 快捷提示词
const quickPrompts = [
    '招聘一名3年经验的前端工程师，要求熟悉 Vue 和 React',
    '招一位产品经理，需要有 B端 SaaS 产品经验',
    '招聘 UI 设计师，要求精通 Figma，有移动端设计经验',
    '招销售经理，负责成都地区企业客户拓展',
]

const canSend = computed(() => inputText.value.trim().length > 0 && !isGenerating.value)

// 使用快捷提示词
const usePrompt = (prompt: string) => {
    if (isGenerating.value) return
    inputText.value = prompt
}

// 发送消息
const sendMessage = async () => {
    const text = inputText.value.trim()
    if (!text || isGenerating.value) return

    // 添加用户消息
    messages.value.push({ role: 'user', content: text, type: 'text' })
    inputText.value = ''
    scrollToBottom()

    // 添加 AI 思考中消息
    isGenerating.value = true
    const thinkingIdx = messages.value.length
    messages.value.push({ role: 'ai', type: 'thinking' })
    scrollToBottom()

    try {
        // 调用 AI 生成接口
        const result = await apiAiGenerateJob({ prompt: text, history: getHistory() })

        // 移除思考中消息
        messages.value.splice(thinkingIdx, 1)

        // 添加 AI 回复
        messages.value.push({
            role: 'ai',
            content: result.reply,
            type: 'text',
        })

        // 如果有生成结果，展示职位卡片
        if (result.job) {
            generatedJob.value = result.job
            messages.value.push({
                role: 'ai',
                type: 'jobCard',
                data: result.job,
            })
        }
        scrollToBottom()
    } catch (e: any) {
        messages.value.splice(thinkingIdx, 1)
        messages.value.push({
            role: 'ai',
            content: e?.message || '生成失败，请重试',
            type: 'text',
        })
        toast.error(e?.message || '生成失败')
        scrollToBottom()
    } finally {
        isGenerating.value = false
    }
}

// 获取历史记录（用于上下文）
const getHistory = () => {
    return messages.value
        .filter(m => m.type === 'text' && m.content)
        .slice(-6) // 保留最近6条作为上下文
        .map(m => ({ role: m.role, content: m.content }))
}

// 滚动到底部
const scrollToBottom = () => {
    setTimeout(() => {
        scrollIntoView.value = 'chatBottom'
    }, 100)
}

// 编辑职位结果
const editJobResult = () => {
    if (!generatedJob.value) return
    editPopupShown.value = true
}

// 职位编辑完成
const onJobEdited = (data: Record<string, any>) => {
    generatedJob.value = data
    // 更新最后一条消息的数据
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg?.type === 'jobCard') {
        lastMsg.data = data
    }
    toast.success('已保存')
}

// 继续编辑（切换到手工发布 Tab）
const continueEdit = () => {
    if (!generatedJob.value) return
    emit('generated', generatedJob.value)
}

// 重新生成
const regenerate = () => {
    generatedJob.value = null
    messages.value = []
    inputText.value = ''
}

// 发布职位
const publishJob = async () => {
    if (!generatedJob.value || publishing.value) return
    publishing.value = true
    try {
        emit('publish', generatedJob.value)
    } finally {
        publishing.value = false
    }
}

// 输入框焦点
const onInputFocus = () => {
    inputBottom.value = 200 // 键盘高度估算
    scrollToBottom()
}

const onInputBlur = () => {
    inputBottom.value = 0
}
</script>

<style scoped lang="scss">
.aiContainer {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
}

.chatArea {
    flex: 1 1 0;
    min-height: 0;
    padding: 24rpx;
    box-sizing: border-box;
}

.chatBottom {
    height: 1rpx;
    width: 100%;
}

.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 40rpx;
    text-align: center;
}

.welcomeIcon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e5bff 0%, #4d8aff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
    box-shadow: 0 12rpx 40rpx rgba(30, 91, 255, 0.3);
}

.welcomeTitle {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--app-text-primary);
    margin-bottom: 16rpx;
}

.welcomeDesc {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    line-height: 1.6;
    margin-bottom: 48rpx;
}

.quickPrompts {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.quickPrompt {
    padding: 24rpx 32rpx;
    background: var(--app-surface);
    border-radius: var(--app-radius-lg);
    border: 1px solid rgba(30, 91, 255, 0.15);
    font-size: 28rpx;
    color: var(--app-text-secondary);
    text-align: left;
    transition: all 0.2s ease;

    &:active {
        background: rgba(30, 91, 255, 0.08);
        transform: scale(0.98);
    }
}

.messages {
    display: flex;
    flex-direction: column;
    gap: 32rpx;
}

.message {
    display: flex;
    gap: 20rpx;
    align-items: flex-start;
}

.message--user {
    flex-direction: row-reverse;
}

.messageAvatar {
    flex-shrink: 0;
}

.aiAvatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e5bff 0%, #4d8aff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.userAvatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.messageContent {
    max-width: 70%;
    padding: 24rpx 28rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
}

.message--user .messageContent {
    background: #1e5bff;
}

.messageText {
    font-size: 28rpx;
    color: var(--app-text-primary);
    line-height: 1.6;
    word-break: break-word;
}

.message--user .messageText {
    color: #fff;
}

.thinking {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.thinkingDots {
    display: flex;
    gap: 8rpx;
}

.dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #1e5bff;
    animation: bounce 1.4s ease-in-out infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
}

.thinkingText {
    font-size: 26rpx;
    color: var(--app-text-secondary);
}

.jobCard {
    background: var(--app-surface);
    border-radius: var(--app-radius-lg);
    padding: 28rpx;
    border: 2rpx solid rgba(30, 91, 255, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(30, 91, 255, 0.1);
}

.jobCardTitle {
    font-size: 34rpx;
    font-weight: 700;
    color: var(--app-text-primary);
    margin-bottom: 12rpx;
}

.jobCardInfo {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
}

.jobCardSalary {
    font-size: 30rpx;
    font-weight: 700;
    color: #1e5bff;
}

.jobCardTags {
    font-size: 24rpx;
    color: var(--app-text-secondary);
}

.jobCardDesc {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    line-height: 1.6;
    margin-bottom: 20rpx;
}

.jobCardEdit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 16rpx;
    background: rgba(30, 91, 255, 0.08);
    border-radius: var(--app-radius-md);
}

.jobCardEditText {
    font-size: 26rpx;
    color: #1e5bff;
    font-weight: 600;
}

.resultActions {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding: 20rpx 24rpx;
    background: var(--app-surface);
    border-top: 1px solid var(--app-line);
}

.resultSecondary {
    display: flex;
    gap: 20rpx;
}

:deep(.resultBtn) {
    flex: 1;
    height: 88rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 28rpx !important;
    font-weight: 700 !important;
}

:deep(.resultBtn--primary) {
    background: #1e5bff !important;
    box-shadow: 0 16rpx 40rpx rgba(30, 91, 255, 0.25) !important;
}

.inputArea {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 20rpx;
    padding: 20rpx 24rpx;
    background: var(--app-surface);
    border-top: 1px solid var(--app-line);
}

.inputWrapper {
    flex: 1;
    background: rgba(0, 0, 0, 0.04);
    border-radius: var(--app-radius-lg);
    padding: 20rpx 24rpx;
    position: relative;
}

.input {
    width: 100%;
    min-height: 80rpx;
    max-height: 200rpx;
    font-size: 28rpx;
    color: var(--app-text-primary);
    line-height: 1.5;
}

.inputCount {
    position: absolute;
    right: 16rpx;
    bottom: 8rpx;
    font-size: 22rpx;
    color: var(--app-text-muted);
}

.sendBtn {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background: #1e5bff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: 0 8rpx 24rpx rgba(30, 91, 255, 0.3);

    &:active {
        transform: scale(0.92);
    }
}

.sendBtn--disabled {
    background: #ccc;
    box-shadow: none;
}
</style>
