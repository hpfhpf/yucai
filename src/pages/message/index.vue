<template>
    <view class="page">
        <div class="header">
            <HeaderNav title="消息中心" type="show-back" theme="000" />
        </div>
        <view class="tabs">
            <view class="tabs__inner">
                <view class="tab" :class="{ 'tab--active': activeTab === 'invite' }" @click="activeTab = 'invite'">
                    面试邀请
                    <view v-if="activeTab === 'invite'" class="tab__bar" />
                </view>
                <view class="tabs__divider" />
                <view class="tab" :class="{ 'tab--active': activeTab === 'chat' }" @click="activeTab = 'chat'">
                    聊天
                    <view v-if="activeTab === 'chat'" class="tab__bar" />
                </view>
            </view>
        </view>

        <scroll-view class="list" scroll-y :lower-threshold="120" :scroll-top="scrollTop" @scroll="handleListScroll"
            @scrolltolower="handleScrollToLower">
            <view v-for="item in currentList" :key="item.id" class="card" hover-class="card--pressed"
                @click="handleItemTap(item)">
                <view class="card__avatar">
                    <image v-if="item.avatar" class="card__avatarImg" :src="item.avatar" mode="aspectFill" />
                    <view v-else class="card__avatarPh" />
                </view>

                <view class="card__main">
                    <view class="card__title">{{ item.title }}</view>
                    <view class="card__sub">{{ item.sub }}</view>
                    <view v-if="item.meta" class="card__meta">{{ item.meta }}</view>
                </view>

                <view class="card__right">
                    <view v-if="item.hint" class="card__hint">{{ item.hint }}</view>
                    <view class="card__time">{{ item.time }}</view>
                </view>
            </view>

            <view class="listStatus">
                <view v-if="currentLoading" class="listStatus__loading">
                    <view class="listStatus__spinner" />
                    <text class="listStatus__text">加载中...</text>
                </view>
                <view v-else-if="currentError" class="listStatus__retry" hover-class="listStatus__retry--pressed"
                    @click="handleRetryTap">
                    加载失败，点击重试
                </view>
                <view v-else-if="!currentHasMore" class="listStatus__done">没有更多消息了</view>
                <view v-else class="listStatus__idle">上拉加载更多</view>
            </view>

            <view class="list__pad" />
        </scroll-view>

        <view v-if="modalShown" class="mask" :class="{ 'mask--show': modalVisible }" @click="closeItemModal">
            <view class="sheet" :class="{ 'sheet--show': modalVisible }" @click.stop>
                <view class="sheet__header">
                    <view class="sheet__company">
                        <view class="sheet__avatar">
                            <image v-if="modalItem?.avatar" class="sheet__avatarImg" :src="modalItem?.avatar"
                                mode="aspectFill" />
                            <view v-else class="sheet__avatarPh" />
                        </view>
                        <view class="sheet__companyName">{{ modalItem?.title }}</view>
                    </view>

                    <view class="sheet__horn">
                        <view class="sheet__hornCone" />
                        <view class="sheet__hornBody" />
                    </view>
                </view>

                <view class="sheet__body">
                    <view class="sheet__title">{{ modalTitle }}</view>
                    <view class="sheet__content">
                        <view class="sheet__p">嗨，{{ receiverName }}：</view>
                        <view class="sheet__p">
                            {{ modalIntro }}
                        </view>
                        <view class="sheet__p">时间：{{ interviewTime }}</view>
                        <view class="sheet__p">联系电话：{{ phone }}</view>
                        <view class="sheet__p">地址：{{ address }}</view>
                    </view>

                    <view class="sheet__link" @click="handleLinkTap">《查看面试须知》</view>
                </view>
            </view>

            <view class="mask__close" :class="{ 'mask__close--show': modalVisible }" @click.stop="closeItemModal">
                <view class="mask__x" />
            </view>
        </view>

        <BottomNav :active-index="1" :theme-color="'#0f5bff'" />
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { createPagedLoader } from './pagedLoader'
import { goPageChatRoom } from '@/utils/route'
import { apiGetMyInvites, apiMarkInviteRead } from '@/api/index'

type MessageItem = {
    id: string
    avatar?: string
    title: string
    sub: string
    meta: string
    hint: string
    time: string
    content?: string
    contactPhone?: string
    jobId?: string
}

const activeTab = ref<'invite' | 'chat'>('invite')

const formatMsgTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
    return `${d.getMonth() + 1}-${String(d.getDate()).padStart(2, '0')}`
}

const chatSeed: MessageItem[] = [
    {
        id: 'c1',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '已读：好的，稍后联系你',
        hint: '聊天',
        time: '01-07'
    },
    {
        id: 'c2',
        title: '连锁餐厅',
        sub: '服务员    购买社保    【全职】',
        meta: '未读：面试时间可以调整吗？',
        hint: '聊天',
        time: '01-06'
    }
]

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const buildChatItem = (idx: number): MessageItem => ({
    id: `c_${idx}`,
    title: idx % 2 === 0 ? '连锁餐厅' : '林溪咖啡',
    sub: idx % 2 === 0 ? '服务员    购买社保    【全职】' : '咖啡师    调休双休    【全职】',
    meta: idx % 3 === 0 ? '已读：好的，稍后联系你' : '未读：明天上午方便面试吗？',
    hint: '聊天',
    time: `01-${String((idx % 28) + 1).padStart(2, '0')}`
})

const mockFetchChat = async (params: { page: number; pageSize: number }) => {
    await delay(280)
    const total = 28
    const start = (params.page - 1) * params.pageSize
    const end = Math.min(start + params.pageSize, total)
    if (start >= total) return { items: [] as MessageItem[], total, hasMore: false }
    const items: MessageItem[] = []
    for (let i = start; i < end; i += 1) {
        if (i < chatSeed.length) {
            items.push({ ...chatSeed[i], id: `chat_${params.page}_${chatSeed[i].id}_${i}` })
            continue
        }
        items.push(buildChatItem(i + 1))
    }
    return { items, total, hasMore: end < total }
}

const fetchInvites = async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const res: any = await apiGetMyInvites({ page, limit: pageSize })
    const items: MessageItem[] = (res.items || []).map((m: any) => ({
        id: m.id,
        title: m.companyName || '未知公司',
        sub: m.jobTitle || '职位已下架',
        meta: '',
        hint: m.isRead ? '已读' : '面试邀请',
        time: formatMsgTime(m.createdAt),
        content: m.content,
        contactPhone: m.contactPhone,
        jobId: m.jobId,
    }))
    return { items, total: res.total, hasMore: res.hasMore }
}

const invitePager = createPagedLoader<MessageItem>(
    fetchInvites,
    { pageSize: 10, throttleMs: 320 }
)
const chatPager = createPagedLoader<MessageItem>(
    mockFetchChat,
    { pageSize: 10, throttleMs: 320 }
)

const pagerMap = {
    invite: invitePager,
    chat: chatPager
}

const currentPager = computed(() => pagerMap[activeTab.value])
const currentList = computed(() => currentPager.value.state.list.value)
const currentLoading = computed(() => currentPager.value.state.loading.value)
const currentError = computed(() => currentPager.value.state.error.value)
const currentHasMore = computed(() => currentPager.value.state.hasMore.value)

const scrollTop = ref(0)
const handleListScroll = (event: { detail?: { scrollTop?: number } }) => {
    scrollTop.value = event.detail?.scrollTop || 0
}

const ensureLoaded = async (tab: 'invite' | 'chat') => {
    const pager = pagerMap[tab]
    if (pager.state.list.value.length > 0 || pager.state.loading.value) return
    await pager.loadMore()
}

const loadCurrentMore = async (retry = false) => {
    const keepTop = scrollTop.value
    const loader = retry ? currentPager.value.retry : currentPager.value.loadMore
    const loaded = await loader()
    if (loaded) {
        await nextTick()
        scrollTop.value = keepTop
    }
}

const handleScrollToLower = () => {
    void loadCurrentMore(false)
}

const handleRetryTap = () => {
    void loadCurrentMore(true)
}

const systemInfo = uni.getSystemInfoSync()
const statusBarHeight = ref(systemInfo.statusBarHeight || 0)
const navBarHeight = ref(44)
const capsuleWidth = ref(88)
const capsuleHeight = ref(32)
const capsuleRight = ref(12)
const safeBottom = ref(systemInfo.safeAreaInsets?.bottom || 0)

if (typeof __UNI_PLATFORM__ !== 'undefined' && __UNI_PLATFORM__ === 'mp-weixin') {
    if (typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function') {
        const rect = wx.getMenuButtonBoundingClientRect()
        if (rect) {
            capsuleWidth.value = rect.width
            capsuleHeight.value = rect.height
            capsuleRight.value = systemInfo.windowWidth - rect.right
            const gap = rect.top - statusBarHeight.value
            navBarHeight.value = rect.height + gap * 2
        }
    }
}

const modalShown = ref(false)
const modalVisible = ref(false)
const modalItem = ref<MessageItem | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const openItemModal = async (item: MessageItem) => {
    if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
    }
    modalItem.value = item
    modalShown.value = true
    await nextTick()
    modalVisible.value = true
    if (!item.hint.includes('已读')) {
        apiMarkInviteRead(item.id).catch(() => { })
    }
}

const closeItemModal = () => {
    modalVisible.value = false
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
        modalShown.value = false
        modalItem.value = null
        closeTimer = null
    }, 180)
}

const modalTitle = computed(() => (activeTab.value === 'invite' ? '面试邀请通知' : '聊天操作'))

const receiverName = computed(() => {
    try {
        const raw = uni.getStorageSync('userInfo')
        if (raw) return JSON.parse(raw).nickname || '您'
    } catch { }
    return '您'
})

const interviewTime = computed(() => '(请与招聘官确认时间)')
const phone = computed(() => modalItem.value?.contactPhone || '请查看消息内容')
const address = computed(() => '(请与招聘官确认地址)')

const modalIntro = computed(() => {
    if (!modalItem.value) return ''
    if (activeTab.value === 'invite') {
        return modalItem.value.content || `恭喜您，投递的【${modalItem.value.sub}】岗位已通过简历筛选，现邀请您参加面试`
    }
    return `与「${modalItem.value.title}」的聊天：${modalItem.value.sub}`
})

const handleLinkTap = () => {
    uni.showToast({ title: '查看面试须知', icon: 'none' })
}

const handleItemTap = (item: MessageItem) => {
    if (activeTab.value === 'chat') {
        goPageChatRoom()
        return
    }
    openItemModal(item)
}

watch(activeTab, (tab) => {
    void ensureLoaded(tab)
})

onMounted(() => {
    void ensureLoaded(activeTab.value)
})

onBeforeUnmount(() => {
    if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

:root {
    --bg: var(--app-bg);
    --card: var(--app-surface-muted);
    --shadow: var(--app-shadow-card);
    --text: var(--app-text-primary);
    --sub: rgba(0, 0, 0, 0.46);
    --muted: rgba(0, 0, 0, 0.3);
    --primary: var(--app-primary);
}

.page {
    @include app-page-shell(var(--bg));
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.header {
    background-color: #FFF;
    flex-shrink: 0;
}

.tabs {
    background: #fff;
    padding: 0 24rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
}

.tabs__inner {
    height: 92rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    position: relative;
}

.tabs__divider {
    width: 1px;
    height: 24rpx;
    background: rgba(0, 0, 0, 0.12);
}

.tab {
    position: relative;
    font-size: 30rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.5);
    padding: 18rpx 8rpx 10rpx;
    min-width: 160rpx;
    text-align: center;
}

.tab--active {
    color: rgba(0, 0, 0, 0.82);
}

.tab__bar {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 56rpx;
    height: 6rpx;
    background: var(--primary);
    border-radius: 999rpx;
    transform: translateX(-50%);
}

.list {
    flex: 1;
    padding: 18rpx 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18rpx;
    overflow: hidden;
    padding-bottom: 180rpx;
    /* 确保 scroll-view 容器不溢出 */
}

/* 确保 scroll-view 占满父容器 */
.list :deep(scroll-view) {
    height: 100%;
    width: 100%;
}

.card {
    background: var(--card);
    border-radius: var(--app-radius-md);
    padding: 18rpx 20rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin: 0 24rpx 18rpx;
}

.card--pressed {
    @include app-pressable-active(0.99, 0.96);
}

.card__avatar {
    width: 82rpx;
    height: 82rpx;
    border-radius: 999rpx;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.04);
    flex: 0 0 auto;
}

.card__avatarImg {
    width: 100%;
    height: 100%;
}

.card__avatarPh {
    width: 100%;
    height: 100%;
    background:
        radial-gradient(70rpx 70rpx at 30% 30%, rgba(255, 165, 0, 0.26), rgba(255, 165, 0, 0) 60%),
        radial-gradient(70rpx 70rpx at 70% 70%, rgba(30, 91, 255, 0.22), rgba(30, 91, 255, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.card__main {
    flex: 1;
    min-width: 0;
}

.card__title {
    font-size: 32rpx;
    font-weight: 800;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__sub {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.44);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__meta {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.32);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card__right {
    width: 140rpx;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12rpx;
}

.card__hint {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.card__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.32);
}

.list__pad {
    height: 30rpx;
}

.listStatus {
    min-height: 72rpx;
    padding: 8rpx 0 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.listStatus__loading {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    color: rgba(0, 0, 0, 0.45);
    font-size: 24rpx;
}

.listStatus__spinner {
    width: 26rpx;
    height: 26rpx;
    border-radius: 999rpx;
    border: 3rpx solid rgba(15, 91, 255, 0.2);
    border-top-color: rgba(15, 91, 255, 0.9);
    animation: listSpin 800ms linear infinite;
}

.listStatus__text {
    line-height: 1;
}

.listStatus__retry {
    color: rgba(15, 91, 255, 0.92);
    font-size: 24rpx;
    font-weight: 700;
    padding: 10rpx 16rpx;
    border-radius: 999rpx;
    background: rgba(15, 91, 255, 0.08);
}

.listStatus__retry--pressed {
    opacity: 0.72;
    transform: scale(0.98);
}

.listStatus__done,
.listStatus__idle {
    color: rgba(0, 0, 0, 0.36);
    font-size: 24rpx;
}

@keyframes listSpin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
    z-index: 999;
}

.mask--show {
    opacity: 1;
    pointer-events: auto;
}

.sheet {
    width: 640rpx;
    border-radius: 24rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 22rpx 70rpx rgba(0, 0, 0, 0.18);
    transform: translateY(22rpx) scale(0.98);
    opacity: 0;
    transition: transform 180ms ease, opacity 180ms ease;
}

.sheet--show {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.sheet__header {
    position: relative;
    height: 180rpx;
    padding: 26rpx 26rpx 0;
    background:
        radial-gradient(520rpx 240rpx at 16% 20%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 62%),
        linear-gradient(135deg, rgba(180, 242, 255, 0.95) 0%, rgba(156, 232, 255, 0.9) 60%, rgba(142, 222, 255, 0.86) 100%);
}

.sheet__company {
    display: flex;
    align-items: center;
    gap: 14rpx;
}

.sheet__avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 999rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.66);
    flex: 0 0 auto;
}

.sheet__avatarImg {
    width: 100%;
    height: 100%;
}

.sheet__avatarPh {
    width: 100%;
    height: 100%;
    background:
        radial-gradient(70rpx 70rpx at 30% 30%, rgba(255, 165, 0, 0.18), rgba(255, 165, 0, 0) 60%),
        radial-gradient(70rpx 70rpx at 70% 70%, rgba(30, 91, 255, 0.16), rgba(30, 91, 255, 0) 62%),
        linear-gradient(135deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02));
}

.sheet__companyName {
    font-size: 30rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.72);
    max-width: 420rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sheet__horn {
    position: absolute;
    right: 22rpx;
    top: 30rpx;
    width: 170rpx;
    height: 120rpx;
    opacity: 0.92;
    filter: drop-shadow(0 14rpx 22rpx rgba(0, 98, 150, 0.22));
}

.sheet__hornCone {
    position: absolute;
    right: 0;
    top: 12rpx;
    width: 130rpx;
    height: 90rpx;
    border-radius: 28rpx;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 58%),
        linear-gradient(135deg, rgba(120, 230, 255, 0.9), rgba(80, 200, 255, 0.75));
    transform: rotate(10deg);
}

.sheet__hornBody {
    position: absolute;
    left: 12rpx;
    top: 46rpx;
    width: 60rpx;
    height: 50rpx;
    border-radius: 18rpx;
    background: linear-gradient(135deg, rgba(110, 220, 255, 0.85), rgba(70, 190, 255, 0.7));
    transform: rotate(-8deg);
}

.sheet__body {
    padding: 22rpx 26rpx 26rpx;
}

.sheet__title {
    text-align: center;
    font-size: 34rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.78);
    letter-spacing: 2rpx;
    padding: 8rpx 0 14rpx;
}

.sheet__content {
    background: rgba(255, 255, 255, 0.92);
    border-radius: 20rpx;
    padding: 18rpx 18rpx;
    color: rgba(0, 0, 0, 0.62);
    font-size: 26rpx;
    line-height: 40rpx;
}

.sheet__p+.sheet__p {
    margin-top: 10rpx;
}

.sheet__link {
    margin-top: 16rpx;
    text-align: center;
    font-size: 26rpx;
    color: rgba(30, 91, 255, 0.92);
    font-weight: 800;
}

.mask__close {
    margin-top: 28rpx;
    width: 76rpx;
    height: 76rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.42);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(10rpx);
    opacity: 0;
    transition: opacity 180ms ease, transform 180ms ease;
}

.mask__close--show {
    opacity: 1;
    transform: translateY(0);
}

.mask__x {
    width: 26rpx;
    height: 26rpx;
    position: relative;
}

.mask__x::before,
.mask__x::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30rpx;
    height: 4rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.92);
    transform: translate(-50%, -50%) rotate(45deg);
}

.mask__x::after {
    transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
