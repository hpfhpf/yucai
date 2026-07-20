<template>
    <view class="page">
        <HeaderNav title="岗位详情" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 146}px` }">
                <view class="card hero">
                    <view class="hero__top">
                        <view class="hero__title">
                            <view class="hero__name">{{ job.title }}</view>
                            <view class="hero__type">【全职】</view>
                        </view>
                        <view class="hero__salary">{{ job.salary }}</view>
                    </view>

                    <view class="hero__meta">
                        <wd-tag size="small" plain custom-class="metaTag metaTag--pin">
                            <FaIcon name="location-dot" :size="22" style="margin-right: 4rpx" />
                            {{ job.city }}·{{ job.district }}
                        </wd-tag>
                        <wd-tag size="small" plain custom-class="metaTag">{{ job.education }}</wd-tag>
                        <wd-tag size="small" plain custom-class="metaTag">{{ job.exp }}</wd-tag>
                    </view>

                    <view class="company" hover-class="company--pressed" @click="handleCompanyTap">
                        <view class="company__left">
                            <view class="company__avatar">
                                <image v-if="job.companyAvatar" class="company__avatarImg" :src="job.companyAvatar"
                                    mode="aspectFill" />
                                <view v-else class="company__avatarPh" />
                            </view>
                            <view class="company__main">
                                <view class="company__name">{{ job.company }}</view>
                                <view class="company__sub">
                                    <wd-tag size="small" plain custom-class="activeTag">今日活跃</wd-tag>
                                </view>
                            </view>
                        </view>

                        <view class="company__right">
                            <FaIcon name="eye" :size="28" color="rgba(0, 0, 0, 0.38)" />
                            <view class="company__views">{{ job.views }}</view>
                        </view>
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">职位描述</view>
                    <view class="section__text">岗位职责：</view>
                    <view class="ol">
                        <view v-for="(line, idx) in job.desc" :key="idx" class="ol__item">
                            <view class="ol__idx">{{ idx + 1 }}、</view>
                            <view class="ol__text">{{ line }}</view>
                        </view>
                    </view>

                    <view class="section__text section__text--sp">任职要求：</view>
                    <view class="ol">
                        <view v-for="(line, idx) in job.requirements" :key="idx" class="ol__item">
                            <view class="ol__idx">{{ idx + 1 }}、</view>
                            <view class="ol__text">{{ line }}</view>
                        </view>
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">职位诱惑</view>
                    <view class="chips">
                        <wd-tag v-for="tag in job.perks" :key="tag" plain custom-class="perkTag">{{ tag }}</wd-tag>
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">工作地址</view>
                    <view class="address" hover-class="address--pressed" @click="handleAddressTap">
                        <view class="address__text">{{ job.address }}</view>
                        <FaIcon name="chevron-right" :size="28" color="rgba(0, 0, 0, 0.30)" />
                    </view>
                </view>

                <view class="section">
                    <view class="section__title">相似职位</view>
                    <view class="jobs">
                        <view v-for="item in similarJobs" :key="item.id" class="jobCard" hover-class="jobCard--pressed"
                            @click="handleSimilarTap(item.id)">
                            <view class="jobCard__top">
                                <view class="jobCard__name">{{ item.title }}</view>
                                <view class="jobCard__salary">{{ item.salary }}</view>
                            </view>
                            <view class="jobCard__tags">
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.district }}</wd-tag>
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.education }}</wd-tag>
                                <wd-tag size="small" plain custom-class="jobTag">{{ item.gender }}</wd-tag>
                            </view>
                            <view class="jobCard__bottom">
                                <view class="jobCard__company">{{ item.company }}</view>
                                <view class="jobCard__time">{{ item.time }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 求职者操作栏 -->
        <view v-if="!isRecruiter" class="bottomBar" :style="{ paddingBottom: `${safeBottom}px` }">
            <view class="bottomBar__left">
                <view class="iconBtn" hover-class="iconBtn--pressed" @click="handleShare">
                    <view class="iconBtn__circle">
                        <FaIcon name="share-nodes" :size="34" color="rgba(0, 0, 0, 0.40)" />
                    </view>
                    <view class="iconBtn__text">分享</view>
                </view>
                <view class="iconBtn" hover-class="iconBtn--pressed" @click="toggleCollect">
                    <view class="iconBtn__circle" :class="{ 'iconBtn__circle--on': isCollected }">
                        <FaIcon :name="isCollected ? 'star' : 'star'" :type="isCollected ? 'solid' : 'regular'" :size="34" :color="isCollected ? 'rgba(30, 91, 255, 0.86)' : 'rgba(0, 0, 0, 0.42)'" />
                    </view>
                    <view class="iconBtn__text">收藏</view>
                </view>
                <view class="iconBtn" hover-class="iconBtn--pressed" @click="handleReport">
                    <view class="iconBtn__circle">
                        <FaIcon name="circle-exclamation" :size="34" color="rgba(0, 0, 0, 0.44)" />
                    </view>
                    <view class="iconBtn__text">投诉</view>
                </view>
            </view>

            <view class="bottomBar__right">
                <wd-button size="small" @click="handleChat">立即沟通</wd-button>
                <wd-button type="primary" size="small" @click="handleDeliver">投递简历</wd-button>
            </view>
        </view>

        <!-- 招聘官操作栏 -->
        <view v-else class="bottomBar bottomBar--recruiter" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button type="primary" block custom-class="editJobBtn" @click="handleEditJob">编辑职位</wd-button>
        </view>

        <wd-popup v-model="deliverShown" position="center" :close-on-click-modal="true" custom-class="deliverPopup"
            @close="handlePopupClose">
            <view class="deliverDialog">
                <view class="deliverDialog__header">
                    <view class="deliverDialog__title">提示</view>
                    <view class="deliverDialog__close" hover-class="deliverDialog__close--pressed"
                        @click="closeDeliver">
                        <FaIcon name="xmark" :size="32" color="rgba(0, 0, 0, 0.42)" />
                    </view>
                </view>

                <view class="deliverDialog__msg">
                    确定要投递所选的岗位
                    <text class="deliverDialog__msgSub">并同意所选的用人单位查询我的个人职业信用评价</text>
                </view>

                <view v-if="deliverError" class="deliverDialog__error">{{ deliverError }}</view>

                <view class="deliverDialog__agree" hover-class="deliverDialog__agree--pressed"
                    @click="deliverAgree = !deliverAgree">
                    <wd-checkbox :model-value="deliverAgree" shape="circle" checked-color="rgba(30, 91, 255, 0.92)"
                        custom-class="deliverCheck" @click.stop />
                    <view class="deliverDialog__agreeText">我已查看承诺书</view>
                    <view class="deliverDialog__link" hover-class="deliverDialog__link--pressed"
                        @click.stop="handlePledgeTap">
                        《承诺书协议》
                    </view>
                </view>

                <view class="deliverDialog__actions">
                    <wd-button plain custom-class="dialogBtn dialogBtn--ghost" :disabled="deliverLoading"
                        @click="closeDeliver">
                        取消
                    </wd-button>
                    <wd-button type="primary" custom-class="dialogBtn dialogBtn--primary" :disabled="deliverLoading"
                        :loading="deliverLoading" @click="confirmDeliver">
                        确定
                    </wd-button>
                </view>
            </view>
        </wd-popup>

        <DiagnosisPopup ref="diagRef" :job-id="jobId" @direct="handleDiagDirect" @tailor="handleDiagTailor" />

        <wd-toast selector="detailToast" />
    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import DiagnosisPopup from '@/components/DiagnosisPopup/index.vue'
import { goPageCompanyDetail, goPageChatRoom } from '@/utils/route'
import { apiGetJobDetail, apiDeliverJob, apiFavoriteJob, apiUnfavoriteJob, apiGetJobs, apiGetResumeProfile } from '@/api/index'

const toast = useToast('detailToast')

const _userInfo = (() => { try { return JSON.parse(uni.getStorageSync('userInfo') || '{}') } catch { return {} } })()
const isRecruiter = _userInfo?.role === 'RECRUITER'

const degreeMap: Record<string, string> = {
    ANY: '学历不限', JUNIOR_HIGH: '初中', HIGH_SCHOOL: '高中',
    ASSOCIATE: '大专', BACHELOR: '本科', MASTER: '硕士', DOCTOR: '博士',
}

type SimilarJob = {
    id: string
    title: string
    salary: string
    district: string
    education: string
    gender: string
    company: string
    time: string
}

const jobId = ref('')
const job = ref({
    title: '',
    salary: '',
    city: '',
    district: '',
    education: '',
    exp: '',
    company: '',
    companyId: '',
    companyAvatar: '',
    views: '',
    desc: [] as string[],
    requirements: [] as string[],
    perks: [] as string[],
    address: '',
})

const similarJobs = ref<SimilarJob[]>([])
const isCollected = ref(false)
const safeBottom = ref(uni.getWindowInfo().safeAreaInsets?.bottom || 0)

onMounted(async () => {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1] as any
    const id = page?.options?.id || ''
    jobId.value = id
    if (!id) return

    try {
        const res: any = await apiGetJobDetail(id)
        const perks = Array.isArray(res.perks) ? res.perks : []
        const desc = res.description ? res.description.split('\n').filter(Boolean) : []
        const requirements = res.requirements ? res.requirements.split('\n').filter(Boolean) : []
        // 地址优先取 address 字段，降级拼接 province+city+district
        const addressParts = [res.province, res.city, res.district, res.address].filter(Boolean)
        const displayAddress = addressParts.length ? addressParts.join(' ') : '暂无地址信息'
        job.value = {
            title: res.title || '',
            salary: res.salaryRange || '薪资面议',
            city: res.city || '',
            district: res.district || '',
            education: degreeMap[res.minDegree] || '学历不限',
            exp: res.minExpYears != null ? (res.minExpYears === 0 ? '经验不限' : `${res.minExpYears}年`) : '经验不限',
            company: res.company?.name || '',
            companyId: res.company?.id || '',
            companyAvatar: '',
            views: `${res.viewCount || 0}次`,
            desc,
            requirements,
            perks,
            address: displayAddress,
        }
        // 加载相似职位（同城市、同类型，排除当前职位）
        try {
            const similar: any = await apiGetJobs({ city: res.city, nature: res.nature, page: 1, limit: 5 })
            similarJobs.value = (similar.items || [])
                .filter((j: any) => j.id !== id)
                .slice(0, 4)
                .map((j: any) => ({
                    id: j.id,
                    title: j.title,
                    salary: j.salaryRange || '薪资面议',
                    district: j.city || '',
                    education: degreeMap[j.minDegree] || '学历不限',
                    gender: j.nature === 'PART_TIME' ? '兼职' : j.nature === 'INTERNSHIP' ? '实习' : '全职',
                    company: j.company?.name || '',
                    time: formatRelativeTime(j.createdAt),
                }))
        } catch { }
    } catch { }
})

const formatRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return '今天'
    if (days < 7) return `${days}天前`
    return new Date(iso).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + '发布'
}

const handleCompanyTap = () => goPageCompanyDetail(job.value.companyId)
const handleAddressTap = () => toast.info('打开地图')
const handleSimilarTap = (id: string) => {
    uni.navigateTo({ url: `/pages/recommendation/detail/index?id=${id}` as any })
}
const handleShare = () => toast.info('分享')

const toggleCollect = async () => {
    if (!jobId.value) return
    try {
        if (isCollected.value) {
            await apiUnfavoriteJob(jobId.value)
            isCollected.value = false
            toast.info('已取消收藏')
        } else {
            await apiFavoriteJob(jobId.value)
            isCollected.value = true
            toast.info('已收藏')
        }
    } catch { }
}

const handleReport = () => toast.info('投诉')
const handleChat = () => goPageChatRoom()

const diagRef = ref<InstanceType<typeof DiagnosisPopup> | null>(null)
const deliverShown = ref(false)
const deliverAgree = ref(false)
const deliverError = ref('')
const deliverLoading = ref(false)

const openDeliver = () => {
    deliverAgree.value = false
    deliverError.value = ''
    deliverLoading.value = false
    deliverShown.value = true
}

const closeDeliver = () => {
    deliverShown.value = false
    deliverError.value = ''
}

const handlePopupClose = () => {
    deliverLoading.value = false
}

const normalizeError = (e: unknown) => {
    if (e instanceof Error) return e.message || '操作失败，请稍后重试'
    if (typeof e === 'string') return e || '操作失败，请稍后重试'
    const msg = (e as any)?.message
    if (msg) return msg
    return '操作失败，请稍后重试'
}

const handlePledgeTap = () => toast.info('承诺书协议')

const confirmDeliver = async () => {
    deliverError.value = ''
    if (!jobId.value) {
        deliverError.value = '岗位信息无效，请刷新后重试'
        return
    }
    if (!deliverAgree.value) {
        deliverError.value = '请先阅读并勾选承诺书协议'
        return
    }

    deliverLoading.value = true
    try {
        await apiDeliverJob(jobId.value, { creditAuthorized: true })
        deliverLoading.value = false
        closeDeliver()
        toast.info('投递成功')
    } catch (e) {
        deliverLoading.value = false
        deliverError.value = normalizeError(e)
    }
}

const handleDeliver = async () => {
    // 投递前校验：未填写简历则引导去简历中心
    try {
        const profile: any = await apiGetResumeProfile()
        if (!profile || !profile.realName) {
            toast.info('请先完善简历')
            setTimeout(() => {
                uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
            }, 800)
            return
        }
    } catch {
        // 拉取简历失败（如未登录/无资料）同样引导去填写
        toast.info('请先完善简历')
        setTimeout(() => {
            uni.navigateTo({ url: '/pages/seeker/resumeCenter/index' as any })
        }, 800)
        return
    }
    // 已有简历：启动 AI 诊断浮层
    diagRef.value?.open()
}

// 诊断浮层「直接投递」：走原有确认承诺书流程
const handleDiagDirect = () => {
    openDeliver()
}

// 诊断浮层「定向修改简历」：跳转定制页
const handleDiagTailor = (diagnosisId?: string) => {
    const q = diagnosisId ? `&diagnosisId=${diagnosisId}` : ''
    uni.navigateTo({ url: `/pages/seeker/tailorResume/index?jobId=${jobId.value}${q}` as any })
}

const handleEditJob = () => {
    if (!jobId.value) return
    uni.navigateTo({ url: `/pages/recruiter/jobPosting?editId=${jobId.value}` as any })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell(var(--app-bg));
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 22rpx 44rpx;
    box-sizing: border-box;
}

.card {
    @include app-card-base(var(--app-radius-lg), var(--app-surface-muted), var(--app-shadow-card));
    border: 1px solid rgba(255, 255, 255, 0.7);
    padding: 20rpx 20rpx 18rpx;
}

.section {
    margin-top: 18rpx;
    @include app-card-base(var(--app-radius-lg), var(--app-surface), var(--app-shadow-card));
    border: 1px solid rgba(255, 255, 255, 0.7);
    padding: 18rpx 20rpx 20rpx;
}

.hero__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16rpx;
}

.hero__title {
    display: flex;
    align-items: baseline;
    gap: 14rpx;
    min-width: 0;
}

.hero__name {
    font-size: 40rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    letter-spacing: 1rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hero__type {
    font-size: 30rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
    flex: 0 0 auto;
}

.hero__salary {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-muted);
    flex: 0 0 auto;
}

.hero__meta {
    margin-top: 12rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

:deep(.metaTag) {
    height: 44rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    border-color: rgba(0, 0, 0, 0.05) !important;
    font-size: 24rpx !important;
    color: var(--app-text-secondary) !important;
}

:deep(.metaTag--pin) {
    background: rgba(30, 91, 255, 0.08) !important;
    border-color: rgba(30, 91, 255, 0.14) !important;
    color: rgba(30, 91, 255, 0.92) !important;
}

.company {
    margin-top: 16rpx;
    height: 108rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.company--pressed {
    opacity: 0.92;
    transform: scale(0.995);
}

.company__left {
    display: flex;
    align-items: center;
    gap: 14rpx;
    min-width: 0;
    flex: 1 1 auto;
}

.company__avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.06);
    overflow: hidden;
    flex: 0 0 auto;
}

.company__avatarImg {
    width: 100%;
    height: 100%;
}

.company__avatarPh {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.14), rgba(30, 91, 255, 0.06));
}

.company__main {
    min-width: 0;
}

.company__name {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.company__sub {
    margin-top: 8rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

:deep(.activeTag) {
    height: 32rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(30, 91, 255, 0.10) !important;
    border-color: rgba(30, 91, 255, 0.16) !important;
    font-size: 22rpx !important;
    color: rgba(30, 91, 255, 0.92) !important;
}

.company__right {
    display: flex;
    align-items: center;
    gap: 8rpx;
    flex: 0 0 auto;
    color: var(--app-text-muted);
    font-size: 24rpx;
    font-weight: 700;
}

.company__views {
    color: var(--app-text-muted);
}

.section__title {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    padding-bottom: 14rpx;
}

.section__text {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    font-weight: 800;
    margin-top: 8rpx;
}

.section__text--sp {
    margin-top: 18rpx;
}

.ol {
    margin-top: 10rpx;
}

.ol__item {
    display: flex;
    gap: 8rpx;
    font-size: 26rpx;
    color: var(--app-text-secondary);
    line-height: 1.65;
}

.ol__idx {
    width: 34rpx;
    flex: 0 0 auto;
    color: var(--app-text-muted);
    font-weight: 800;
}

.ol__text {
    flex: 1;
    min-width: 0;
}

.chips {
    margin-top: 10rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

:deep(.perkTag) {
    height: 56rpx !important;
    border-radius: var(--app-radius-md) !important;
    background: var(--app-surface) !important;
    border-color: rgba(0, 0, 0, 0.06) !important;
    font-size: 24rpx !important;
    color: var(--app-text-secondary) !important;
    font-weight: 800 !important;
}

.address {
    margin-top: 10rpx;
    height: 84rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 0 16rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
    box-sizing: border-box;
}

.address--pressed {
    opacity: 0.92;
    transform: scale(0.995);
}

.address__text {
    font-size: 26rpx;
    color: var(--app-text-secondary);
    font-weight: 750;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.jobs {
    margin-top: 12rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.jobCard {
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 18rpx 18rpx 16rpx;
}

.jobCard--pressed {
    opacity: 0.92;
    transform: scale(0.995);
}

.jobCard__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__name {
    font-size: 32rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.jobCard__salary {
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-accent);
    flex: 0 0 auto;
}

.jobCard__tags {
    margin-top: 12rpx;
    display: flex;
    gap: 10rpx;
    flex-wrap: wrap;
}

:deep(.jobTag) {
    height: 40rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.035) !important;
    border-color: rgba(0, 0, 0, 0.05) !important;
    font-size: 22rpx !important;
    color: var(--app-text-muted) !important;
}

.jobCard__bottom {
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.jobCard__company {
    font-size: 24rpx;
    color: var(--app-text-muted);
}

.jobCard__time {
    font-size: 24rpx;
    color: var(--app-text-muted);
}

.bottomBar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--app-surface-strong);
    border-top: 1px solid var(--app-line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 22rpx;
    box-sizing: border-box;
}

.bottomBar--recruiter {
    padding: 18rpx 22rpx;
}

:deep(.editJobBtn) {
    height: 88rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 30rpx !important;
    font-weight: 900 !important;
    box-shadow: 0 18rpx 44rpx rgba(30, 91, 255, 0.24) !important;
}

.bottomBar__left {
    display: flex;
    align-items: center;
    gap: 18rpx;
}

.iconBtn {
    width: 66rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
}

.iconBtn--pressed {
    opacity: 0.88;
}

.iconBtn__circle {
    width: 42rpx;
    height: 42rpx;
    border-radius: 999rpx;
    background: rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
}

.iconBtn__circle--on {
    background: rgba(30, 91, 255, 0.10);
}

.iconBtn__text {
    font-size: 20rpx;
    color: var(--app-text-muted);
    font-weight: 700;
}

.bottomBar__right {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

:deep(.chatBtn) {
    height: 84rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
    min-width: 220rpx !important;
    border-color: rgba(30, 91, 255, 0.28) !important;
    color: rgba(30, 91, 255, 0.92) !important;
}

:deep(.deliverBtn) {
    height: 84rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
    min-width: 220rpx !important;
    box-shadow: 0 18rpx 44rpx rgba(30, 91, 255, 0.26) !important;
}

:deep(.deliverPopup) {
    border-radius: var(--app-radius-lg) !important;
}

.deliverDialog {
    width: 640rpx;
    max-width: 92vw;
    padding: 22rpx 22rpx 18rpx;
    box-sizing: border-box;
}

.deliverDialog__header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.deliverDialog__title {
    text-align: center;
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
    letter-spacing: 2rpx;
}

.deliverDialog__close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 60rpx;
    height: 60rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.deliverDialog__close--pressed {
    background: rgba(0, 0, 0, 0.04);
}

.deliverDialog__msg {
    margin-top: 18rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 750;
    color: var(--app-text-secondary);
    line-height: 1.55;
    padding: 0 16rpx;
}

.deliverDialog__msgSub {
    display: block;
    margin-top: 6rpx;
    color: var(--app-text-muted);
    font-weight: 700;
}

.deliverDialog__error {
    margin-top: 14rpx;
    font-size: 24rpx;
    color: rgba(220, 38, 38, 0.92);
    text-align: center;
    font-weight: 800;
}

.deliverDialog__agree {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    padding: 10rpx;
    border-radius: var(--app-radius-lg);
}

.deliverDialog__agree--pressed {
    background: rgba(0, 0, 0, 0.03);
}

:deep(.deliverCheck) {
    flex: 0 0 auto;
}

.deliverDialog__agreeText {
    font-size: 24rpx;
    color: var(--app-text-muted);
    font-weight: 800;
}

.deliverDialog__link {
    font-size: 24rpx;
    color: rgba(30, 91, 255, 0.92);
    font-weight: 900;
    padding: 6rpx 10rpx;
    border-radius: var(--app-radius-md);
}

.deliverDialog__link--pressed {
    background: rgba(30, 91, 255, 0.08);
}

.deliverDialog__actions {
    margin-top: 16rpx;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
}

:deep(.dialogBtn) {
    height: 84rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
}

:deep(.dialogBtn--ghost) {
    background: rgba(0, 0, 0, 0.04) !important;
    color: var(--app-text-secondary) !important;
}

:deep(.dialogBtn--primary) {
    box-shadow: 0 18rpx 44rpx rgba(30, 91, 255, 0.22) !important;
}
</style>
