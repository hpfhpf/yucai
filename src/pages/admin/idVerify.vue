<template>
    <view class="page">
        <view class="hero">
            <view class="hero__bar" :style="{ paddingTop: `${statusBar}px` }">
                <view class="hero__back" @click="goBack">
                    <FaIcon name="chevron-left" :size="36" color="#fff" />
                </view>
                <view class="hero__hello">
                    <view class="hero__name">实名审核</view>
                </view>
                <view class="hero__avatar">
                    <FaIcon name="id-card" :size="36" color="#fff" />
                </view>
            </view>
        </view>

        <scroll-view class="scroll" scroll-y @scrolltolower="loadMore">
            <view class="content">
                <view class="ivTabs">
                    <view v-for="t in statusTabs" :key="t.value" class="ivTabs__item"
                        :class="{ 'ivTabs__item--on': status === t.value }" @click="switchStatus(t.value)">
                        {{ t.label }}
                    </view>
                </view>

                <view v-if="list.length === 0 && !loading" class="empty-wrap">
                    <Empty :tip="emptyText" />
                </view>

                <view v-for="it in list" :key="it.id" class="ivCard">
                    <view class="ivCard__head">
                        <view class="ivCard__name">{{ it.realName || '-' }}</view>
                        <view class="ivTag" :class="`ivTag--${statusTone(it.status)}`">
                            {{ statusText(it.status) }}
                        </view>
                    </view>
                    <view class="ivCard__row">
                        <FaIcon name="id-card" :size="26" color="#7c5cff" fixed-width />
                        <text class="ivCard__val">{{ maskId(it.idNumber) }}</text>
                    </view>
                    <view class="ivCard__row">
                        <FaIcon name="user" :size="26" color="#1e5bff" fixed-width />
                        <text class="ivCard__val">{{ it.user?.nickname || '匿名' }} · {{ it.user?.phone || '-' }}</text>
                    </view>
                    <view class="ivCard__row">
                        <FaIcon name="clock" :size="26" color="#f0883a" fixed-width />
                        <text class="ivCard__val">{{ fmtTime(it.createdAt) }}</text>
                    </view>
                    <view v-if="it.status === 'REJECTED' && it.rejectReason" class="ivCard__reason">
                        驳回原因：{{ it.rejectReason }}
                    </view>
                    <view v-if="it.status === 'PENDING'" class="ivCard__actions">
                        <view class="ivBtn ivBtn--reject" @click="onReject(it)">驳回</view>
                        <view class="ivBtn ivBtn--approve" @click="onApprove(it)">通过</view>
                    </view>
                </view>

                <view v-if="loading" class="ivTip">加载中...</view>
                <view v-else-if="noMore && list.length" class="ivTip">没有更多了</view>
                <view class="tailSpace" />
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import Empty from '@/components/Empty/index.vue'
import { apiAdminListIdVerifications, apiAdminReviewIdVerification } from '@/api/admin'

const statusBar = ref(uni.getWindowInfo().statusBarHeight || 0)

type IdVerifyItem = {
    id: string; realName: string; idNumber: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectReason?: string; createdAt?: string
    user?: { phone?: string; nickname?: string }
}

const statusTabs = [
    { label: '待审核', value: 'PENDING' },
    { label: '已通过', value: 'APPROVED' },
    { label: '已驳回', value: 'REJECTED' },
]

const status = ref<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
const list = ref<IdVerifyItem[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const loading = ref(false)
const noMore = ref(false)

const emptyText = computed(() => {
    if (status.value === 'PENDING') return '暂无待审核记录'
    if (status.value === 'APPROVED') return '暂无已通过记录'
    return '暂无已驳回记录'
})

const statusTextMap: Record<string, string> = {
    PENDING: '待审核', APPROVED: '已通过', REJECTED: '已驳回',
}
const statusToneMap: Record<string, string> = {
    PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger',
}
const statusText = (s: string) => statusTextMap[s] || s
const statusTone = (s: string) => statusToneMap[s] || 'warning'

const maskId = (v?: string) => {
    if (!v) return '-'
    if (v.length <= 8) return v
    return `${v.slice(0, 4)}****${v.slice(-4)}`
}

const fmtTime = (v?: string) => {
    if (!v) return '-'
    const d = new Date(v)
    if (isNaN(d.getTime())) return '-'
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

const load = async (reset = false) => {
    if (loading.value) return
    if (reset) { page.value = 1; noMore.value = false; list.value = [] }
    if (noMore.value) return
    loading.value = true
    try {
        const res: any = await apiAdminListIdVerifications({
            page: page.value, limit, status: status.value,
        })
        const items: IdVerifyItem[] = res?.items || []
        total.value = res?.total || 0
        list.value = reset ? items : [...list.value, ...items]
        if (list.value.length >= total.value || items.length < limit) noMore.value = true
        else page.value += 1
    } catch {
        if (!list.value.length) uni.showToast({ title: '数据加载失败，请重试', icon: 'none', duration: 2000 })
    } finally { loading.value = false }
}

const loadMore = () => { if (!noMore.value) load(false) }
const switchStatus = (v: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (status.value === v) return
    status.value = v
    load(true)
}

const goBack = () => {
    const pages = getCurrentPages()
    if (pages.length > 1) uni.navigateBack()
    else uni.reLaunch({ url: '/pages/admin/index' })
}

const onApprove = async (it: IdVerifyItem) => {
    try {
        await apiAdminReviewIdVerification(it.id, { status: 'APPROVED' })
        uni.showToast({ title: '已通过', icon: 'success' })
        load(true)
    } catch { uni.showToast({ title: '操作失败', icon: 'none' }) }
}

const onReject = (it: IdVerifyItem) => {
    uni.showModal({
        title: '驳回原因',
        editable: true,
        placeholderText: '请输入驳回原因',
        success: async (r) => {
            if (!r.confirm) return
            const reason = (r.content || '').trim() || '信息不符'
            try {
                await apiAdminReviewIdVerification(it.id, { status: 'REJECTED', rejectReason: reason })
                uni.showToast({ title: '已驳回', icon: 'none' })
                load(true)
            } catch { uni.showToast({ title: '操作失败', icon: 'none' }) }
        },
    })
}

onMounted(() => load(true))
</script>

<style scoped lang="scss">
@import '@/pages/admin/admin.scss';

/* 实名审核页专属样式 */
.hero__bar {
    align-items: center;
}

.hero__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero__hello {
    flex: 1;
    text-align: center;
}

.ivTabs {
    display: flex;
    gap: 12rpx;
    margin-bottom: 22rpx;
}

.ivTabs__item {
    flex: 1;
    height: 64rpx;
    border-radius: 32rpx;
    background: #fff;
    color: var(--app-text-secondary);
    font-size: 26rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 18rpx rgba(30, 60, 140, 0.06);
}

.ivTabs__item--on {
    background: linear-gradient(135deg, #2a67ff, #1e5bff);
    color: #fff;
}

.empty-wrap { padding: 80rpx 0; }

.ivCard {
    background: #fff;
    border-radius: 22rpx;
    padding: 26rpx 24rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 10rpx 28rpx rgba(30, 60, 140, 0.08);
}

.ivCard__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
}

.ivCard__name {
    font-size: 32rpx;
    font-weight: 800;
    color: var(--app-text-primary);
}

.ivTag {
    padding: 4rpx 18rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 700;
}

.ivTag--warning { background: rgba(240, 136, 58, 0.14); color: #f0883a; }
.ivTag--success { background: rgba(52, 209, 157, 0.16); color: #22b07d; }
.ivTag--danger { background: rgba(250, 67, 80, 0.14); color: #fa4350; }

.ivCard__row {
    display: flex;
    align-items: center;
    gap: 14rpx;
    margin-top: 12rpx;
}

.ivCard__val {
    font-size: 26rpx;
    color: var(--app-text-secondary);
}

.ivCard__reason {
    margin-top: 16rpx;
    padding: 14rpx 18rpx;
    border-radius: 14rpx;
    background: rgba(250, 67, 80, 0.08);
    font-size: 24rpx;
    color: #fa4350;
}

.ivCard__actions {
    display: flex;
    justify-content: flex-end;
    gap: 18rpx;
    margin-top: 22rpx;
}

.ivBtn {
    min-width: 132rpx;
    height: 64rpx;
    border-radius: 32rpx;
    font-size: 26rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ivBtn--approve { background: linear-gradient(135deg, #43d9a3, #22b07d); color: #fff; }
.ivBtn--reject { background: rgba(250, 67, 80, 0.1); color: #fa4350; }

.ivTip {
    text-align: center;
    font-size: 24rpx;
    color: var(--app-text-muted);
    padding: 24rpx 0;
}
</style>
