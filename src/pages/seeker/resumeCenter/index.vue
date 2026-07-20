<template>
    <view class="page">
        <HeaderNav title="个人简历" type="show-back" theme="000" />

        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="profile">
                    <view class="profile__left">
                        <view class="profile__nameRow">
                            <view class="profile__name">{{ user.name }}</view>
                            <view class="iconBtn" @click="handleEdit('name')">
                                <FaIcon name="pen" :size="30" color="#1e5bff" />
                            </view>
                        </view>
                        <view class="profile__role">{{ user.role }}</view>
                        <!-- 年薪 / 职级标签（已填写时显示，入口提示填写） -->
                        <view class="profile__tagRow">
                            <view v-if="userLevelText" class="profile__tag profile__tag--level">{{ userLevelText }}</view>
                            <view v-if="user.annualSalary" class="profile__tag profile__tag--salary">{{ user.annualSalary }}万/年</view>
                            <view v-if="!userLevelText && !user.annualSalary" class="profile__tag profile__tag--hint"
                                @click="handleEdit('name')">填写年薪/职级，开启精准匹配 ›</view>
                        </view>
                        <view class="profile__phoneRow">
                            <view class="profile__phoneIcon" />
                            <view class="profile__phone">{{ user.phone }}</view>
                        </view>
                    </view>

                    <view class="profile__right">
                        <view class="avatar" :class="{ 'avatar--fa': avatarParsed.type === 'fa' }"
                            :style="avatarStyle">
                            <FaIcon v-if="avatarParsed.type === 'fa'" :name="avatarParsed.icon" :size="60"
                                color="#fff" />
                            <image v-else-if="avatarParsed.type === 'image'" class="avatar__img"
                                :src="avatarParsed.url" mode="aspectFill" />
                        </view>
                    </view>
                </view>

                <view class="divider" />

                <view class="section">
                    <view class="section__head">
                        <view class="section__title">自我描述</view>
                        <view class="iconBtn" @click="handleEdit('summary')">
                            <FaIcon name="pen" :size="30" color="#1e5bff" />
                        </view>
                    </view>
                    <view class="section__text">{{ selfDesc || '暂无自我描述，点击编辑添加' }}</view>
                </view>

                <view class="divider divider--tight" />

                <view class="section">
                    <view class="section__head">
                        <view class="section__title">教育经历</view>
                        <view class="iconBtn iconBtn--square" @click="handleAdd('education')">
                            <FaIcon name="plus" :size="30" color="#1e5bff" />
                        </view>
                    </view>

                    <template v-if="education.length">
                        <view v-for="edu in education" :key="edu.id" class="eduRow">
                            <view class="eduRow__top eduRow__top--column">
                                <view class="row__primary">{{ edu.school }}</view>
                                <view class="row__meta">{{ edu.range }}</view>
                            </view>
                            <view class="step-actions">
                                <view class="step-btn step-btn--delete"
                                    @click.stop="handleDeleteEducation(edu.id)">删除</view>
                                <view class="step-btn step-btn--edit"
                                    @click.stop="handleEditEducation(edu.id)">编辑</view>
                            </view>
                        </view>
                    </template>
                    <view v-else class="section__text">暂无教育经历，点击 + 添加</view>
                </view>

                <view class="divider divider--tight" />

                <view class="section">
                    <view class="section__head">
                        <view class="section__title">工作经历</view>
                        <view class="iconBtn iconBtn--square" @click="handleAdd('work')">
                            <FaIcon name="plus" :size="30" color="#1e5bff" />
                        </view>
                    </view>

                    <wd-steps :active="activeStep" vertical dot>
                        <wd-step v-for="item in workSteps" :key="item.id" :status="item.status">
                            <template #title>
                                <view class="step-title step-title--column">
                                    <text class="step-title__name">{{ item.company }}</text>
                                    <text class="step-title__time">{{ item.range }}</text>
                                </view>
                            </template>

                            <template #description>
                                <view class="step-desc">
                                    <view>职位：{{ item.title }}</view>
                                    <view>薪资：{{ item.salary }}</view>
                                    <view class="step-tags">
                                        <wd-tag v-for="tag in item.tags" :key="tag" variant="light">{{
                                            tag
                                        }}</wd-tag>
                                    </view>
                                    <view class="step-actions">
                                        <view class="step-btn step-btn--delete"
                                            @click.stop="handleDeleteWork(item.id)">删除</view>
                                        <!-- 认证中：锁定编辑，显示重发+取消 -->
                                        <template v-if="item.certStatus === 'PENDING'">
                                            <view class="step-badge step-badge--pending">认证中</view>
                                            <view class="step-btn step-btn--share"
                                                @click.stop="handleResendCert(item)">重新发送</view>
                                            <view class="step-btn step-btn--cancel"
                                                @click.stop="handleCancelCert(item.id)">取消认证</view>
                                        </template>
                                        <!-- 已认证：显示金标徽章，保留编辑 -->
                                        <template v-else-if="item.certStatus === 'APPROVED'">
                                            <view class="step-badge step-badge--gold">🏅 联合认证</view>
                                            <view class="step-btn step-btn--edit"
                                                @click.stop="handleEditWork(item.id)">编辑</view>
                                        </template>
                                        <!-- 未认证：显示申请，保留编辑 -->
                                        <template v-else>
                                            <view class="step-btn step-btn--edit"
                                                @click.stop="handleEditWork(item.id)">编辑</view>
                                            <view class="step-btn step-btn--cert"
                                                @click.stop="handleRequestCert(item)">申请认证</view>
                                        </template>
                                    </view>
                                </view>
                            </template>
                        </wd-step>
                    </wd-steps>
                </view>

                <view class="divider divider--tight" />

                <view class="section">
                    <view class="section__head">
                        <view class="section__title">项目经历</view>
                        <view class="iconBtn iconBtn--square" @click="handleAdd('project')">
                            <FaIcon name="plus" :size="30" color="#1e5bff" />
                        </view>
                    </view>

                    <wd-steps :active="projectStep" vertical dot>
                        <wd-step v-for="item in projectSteps" :key="item.id" :status="item.status">
                            <template #title>
                                <view class="step-title step-title--column">
                                    <text class="step-title__name">{{ item.company }}</text>
                                    <text class="step-title__time">{{ item.range }}</text>
                                </view>
                            </template>

                            <template #description>
                                <view class="step-desc">
                                    <view>角色：{{ item.title }}</view>
                                    <view class="step-tags">
                                        <wd-tag v-for="tag in item.tags" :key="tag" variant="light">{{
                                            tag
                                            }}</wd-tag>
                                    </view>
                                    <view class="step-actions">
                                        <view class="step-btn step-btn--delete"
                                            @click.stop="handleDeleteProject(item.id)">删除</view>
                                        <view class="step-btn step-btn--edit"
                                            @click.stop="handleEditProject(item.id)">编辑</view>
                                    </view>
                                </view>
                            </template>
                        </wd-step>
                    </wd-steps>
                </view>
            </view>
        </scroll-view>

        <BottomNav :active-index="2" :theme-color="'#0f5bff'" />
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BottomNav from '@/components/BottomNav.vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { parseAvatar } from '@/utils/avatar'
import { goPageAddProject, goPageAddJob, goPageAddEducation, goPageAddInformation, goPageAddSelfDesc } from '@/utils/route'
import { apiGetResumeProfile, apiGetSelfDesc, apiGetEducations, apiGetWorkExps, apiGetProjectExps, apiGetUserMe, apiDeleteWorkExp, apiDeleteProjectExp, apiDeleteEducation, apiGetCertifications, apiCancelWorkCert } from '@/api/index'

const user = ref({ name: '', role: '', phone: '', annualSalary: null as number | null, level: '' })
const selfDesc = ref('')

const LEVEL_LABELS: Record<string, string> = {
    IC: '骨干员工', LEAD: '团队主管', MGR_DIR: '中高层管理', VP_C: '决策层',
}
const userLevelText = computed(() => user.value.level ? LEVEL_LABELS[user.value.level] || '' : '')

// 头像状态：与「我的」页共用 avatarUrl 存储格式
const avatarUrl = ref('')
const avatarParsed = computed(() => parseAvatar(avatarUrl.value))
const avatarStyle = computed(() =>
    avatarParsed.value.type === 'fa'
        ? { background: avatarParsed.value.bg }
        : {}
)

type EduItem = { id: string; school: string; range: string }
const education = ref<EduItem[]>([])

type WorkStep = { id: string; company: string; companyId: string | null; title: string; range: string; city: string; salary: string; tags: string[]; status: 'process' | 'finished'; certStatus: 'PENDING' | 'APPROVED' | null }
const workSteps = ref<WorkStep[]>([])
const activeStep = ref(0)

type ProjectStep = { id: string; company: string; title: string; range: string; tags: string[]; status: 'process' | 'finished' }
const projectSteps = ref<ProjectStep[]>([])
const projectStep = ref(0)

const formatRange = (start?: string, end?: string) => {
    const fmt = (d: string) => d ? new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' }).replace('/', '年').replace('/', '月') : ''
    return `${fmt(start || '')} ~ ${end ? fmt(end) : '至今'}`
}

// 格式为 MMMM年YY月（如 2024年06月），用于工作经历与项目经历
const formatMonthRange = (start?: string, end?: string) => {
    const fmt = (d: string) => {
        if (!d) return ''
        const date = new Date(d)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${year}年${month}月`
    }
    return `${fmt(start || '')} ~ ${end ? fmt(end) : '至今'}`
}

const loadResumeData = async () => {
    try {
        const [meRes, profileRes, descRes, eduRes, workRes, projRes] = await Promise.all([
            apiGetUserMe(),
            apiGetResumeProfile(),
            apiGetSelfDesc(),
            apiGetEducations(),
            apiGetWorkExps(),
            apiGetProjectExps(),
        ])
        user.value = {
            name: (profileRes as any).realName || (meRes as any).nickname || '未填写',
            role: (profileRes as any).roleTitle || '求职者',
            phone: (meRes as any).phone || '',
            annualSalary: (profileRes as any).currentAnnualSalary ?? null,
            level: (profileRes as any).currentLevel || '',
        }
        avatarUrl.value = (meRes as any).avatarUrl || ''
        selfDesc.value = (descRes as any).selfDesc || ''
        education.value = ((eduRes as any) as any[]).map((e: any) => ({
            id: e.id,
            school: e.school,
            range: formatMonthRange(e.startDate, e.endDate),
        }))
        workSteps.value = ((workRes as any) as any[]).map((w: any, i: number) => ({
            id: w.id,
            company: w.company,
            companyId: w.companyId || null,
            title: w.title,
            range: formatMonthRange(w.startDate, w.endDate),
            city: w.city || '',
            salary: w.salaryMin ? `${w.salaryMin / 1000}k-${w.salaryMax / 1000}k` : '面议',
            tags: Array.isArray(w.skillTags) ? w.skillTags : [],
            status: i === 0 ? 'process' : 'finished',
            certStatus: null,
        }))
        activeStep.value = workSteps.value.length > 0 ? 1 : 0
        projectSteps.value = ((projRes as any) as any[]).map((p: any, i: number) => ({
            id: p.id,
            company: p.name,
            title: p.role || '',
            range: formatMonthRange(p.startDate, p.endDate),
            tags: Array.isArray(p.techTags) ? p.techTags : [],
            status: i === 0 ? 'process' : 'finished',
        }))
        projectStep.value = projectSteps.value.length > 0 ? 1 : 0
    } catch {
        // 错误由 request.ts 统一处理
    }

    // 认证状态单独加载，失败不影响主数据
    try {
        const certRes: any = await apiGetCertifications()
        const certMap: Record<string, 'PENDING' | 'APPROVED'> = {}
        ;(certRes as any[]).forEach((c: any) => { certMap[c.workExpId] = c.status })
        workSteps.value = workSteps.value.map(w => ({
            ...w,
            certStatus: certMap[w.id] || null,
        }))
    } catch {
        // 认证状态加载失败不影响页面，静默处理
    }
}

// 使用 onShow 而非 onMounted：navigateTo 不会销毁本页，
// 从子页面 navigateBack 返回时 onShow 会再次触发，从而拉取最新数据实现自动回填
onShow(() => {
    loadResumeData()
})

type EditKey = 'name' | 'summary'
type AddKey = 'education' | 'work' | 'project'

const handleEdit = (key: EditKey) => {
    if (key === 'name') goPageAddInformation()
    else if (key === 'summary') goPageAddSelfDesc()
}

const handleAdd = (key: AddKey) => {
    if (key === 'project') goPageAddProject()
    else if (key === 'work') goPageAddJob()
    else if (key === 'education') goPageAddEducation()
}

const handleEditEducation = (id: string) => {
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/education?id=${id}` as any })
}

const handleDeleteEducation = (id: string) => {
    uni.showModal({
        title: '确认删除',
        content: '删除后不可恢复，确认删除该教育经历？',
        confirmColor: '#ff4444',
        success: async ({ confirm }) => {
            if (!confirm) return
            try {
                await apiDeleteEducation(id)
                education.value = education.value.filter(e => e.id !== id)
                uni.showToast({ title: '已删除', icon: 'success' })
            } catch { }
        },
    })
}

const handleDeleteWork = (id: string) => {
    uni.showModal({
        title: '确认删除',
        content: '删除后不可恢复，确认删除该工作经历？',
        confirmColor: '#ff4444',
        success: async ({ confirm }) => {
            if (!confirm) return
            try {
                await apiDeleteWorkExp(id)
                workSteps.value = workSteps.value.filter(w => w.id !== id)
                uni.showToast({ title: '已删除', icon: 'success' })
            } catch { }
        },
    })
}

const handleEditWork = (id: string) => {
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/job?id=${id}` as any })
}

const handleDeleteProject = (id: string) => {
    uni.showModal({
        title: '确认删除',
        content: '删除后不可恢复，确认删除该项目经历？',
        confirmColor: '#ff4444',
        success: async ({ confirm }) => {
            if (!confirm) return
            try {
                await apiDeleteProjectExp(id)
                projectSteps.value = projectSteps.value.filter(p => p.id !== id)
                uni.showToast({ title: '已删除', icon: 'success' })
            } catch { }
        },
    })
}

const handleEditProject = (id: string) => {
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/project?id=${id}` as any })
}

// 申请认证：跳转到认证页（内含推荐人弹窗和微信分享流程）
const handleRequestCert = (item: WorkStep) => {
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/workCertification/index?workExpId=${item.id}` as any })
}

// 重新发送：同申请入口，认证页内会重新拉取推荐人
const handleResendCert = (item: WorkStep) => {
    uni.navigateTo({ url: `/pages/seeker/resumeCenter/workCertification/index?workExpId=${item.id}&resend=1` as any })
}

const handleCancelCert = (id: string) => {
    uni.showModal({
        title: '取消认证',
        content: '取消后认证码立即失效，可重新申请。确认取消？',
        confirmColor: '#ff4444',
        success: async ({ confirm }) => {
            if (!confirm) return
            try {
                await apiCancelWorkCert(id)
                const idx = workSteps.value.findIndex(w => w.id === id)
                if (idx !== -1) workSteps.value[idx].certStatus = null
                uni.showToast({ title: '已取消认证', icon: 'success' })
            } catch { }
        },
    })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #dfe8ff 0%, #eef3ff 44%, #eef3ff 100%);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 10rpx 26rpx 200rpx;
    box-sizing: border-box;
}

.profile {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10rpx 2rpx 8rpx;
}

.profile__left {
    flex: 1;
    min-width: 0;
}

.profile__nameRow {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.profile__name {
    font-size: 40rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.86);
}

.profile__role {
    margin-top: 8rpx;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.5);
}

.profile__tagRow {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    flex-wrap: wrap;
}

.profile__tag {
    padding: 4rpx 16rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.profile__tag--level {
    color: #1e5bff;
    background: rgba(30, 91, 255, 0.08);
    border: 1px solid rgba(30, 91, 255, 0.16);
}

.profile__tag--salary {
    color: #d97706;
    background: rgba(217, 119, 6, 0.08);
    border: 1px solid rgba(217, 119, 6, 0.18);
}

.profile__tag--hint {
    color: rgba(0, 0, 0, 0.36);
    background: rgba(0, 0, 0, 0.04);
    border: 1px dashed rgba(0, 0, 0, 0.14);
    font-weight: 400;
}

.profile__phoneRow {
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.profile__phoneIcon {
    width: 22rpx;
    height: 22rpx;
    border-radius: 6rpx;
    background: rgba(0, 0, 0, 0.12);
    position: relative;
}

.profile__phoneIcon::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10rpx;
    height: 10rpx;
    border-radius: 3rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -50%);
}

.profile__phone {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.46);
}

.profile__right {
    width: 140rpx;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}

.avatar {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    background: #FFF url('@/assets/images/avatar.png') no-repeat center center / contain;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar--fa {
    background-image: none;
}

.avatar__img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.divider {
    height: 1px;
    background: rgba(0, 0, 0, 0.06);
    margin: 18rpx 0;
}

.step-time {
    margin-left: 12rpx;
}

.step-title--column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4rpx;
}

.step-title__name {
    font-size: 28rpx;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.82);
}

.step-title__time {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);
}

.divider--tight {
    margin: 14rpx 0;
}

.section {
    padding: 10rpx 2rpx 6rpx;
}

.section__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
}

.section__title {
    font-size: 32rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.82);
}

.section__text {
    margin-top: 10rpx;
    font-size: 28rpx;
    line-height: 1.8;
    color: rgba(0, 0, 0, 0.62);
}

.row {
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.row--pressed {
    opacity: 0.92;
}

.eduRow {
    margin-top: 10rpx;
    padding-bottom: 14rpx;
}

.eduRow__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.eduRow__top--column {
    flex-direction: column;
    align-items: flex-start;
    gap: 4rpx;
}

.eduRow__top--column .row__meta {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);
}

.row__primary {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.76);
    font-weight: 700;
}

.row__right {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.row__meta {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.row__chev {
    width: 14rpx;
    height: 14rpx;
    border-top: 3rpx solid rgba(0, 0, 0, 0.22);
    border-right: 3rpx solid rgba(0, 0, 0, 0.22);
    transform: rotate(45deg);
}

.timelineRow {
    display: flex;
    gap: 14rpx;
    padding: 12rpx 0;
}

.timelineRow--pressed {
    opacity: 0.92;
}

.timelineRow__dot {
    width: 22rpx;
    height: 22rpx;
    border-radius: 999rpx;
    border: 4rpx solid rgba(42, 103, 255, 0.92);
    box-sizing: border-box;
    margin-top: 6rpx;
    flex: 0 0 auto;
}

.timelineRow__dot--solid {
    background: rgba(42, 103, 255, 0.92);
    border-color: rgba(42, 103, 255, 0.92);
}

.timelineRow__main {
    flex: 1;
    min-width: 0;
}

.timelineRow__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
}

.timelineRow__primary {
    font-size: 28rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.78);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.timelineRow__right {
    display: flex;
    align-items: center;
    gap: 10rpx;
    flex: 0 0 auto;
}

.timelineRow__meta {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.timelineRow__chev {
    width: 14rpx;
    height: 14rpx;
    border-top: 3rpx solid rgba(0, 0, 0, 0.18);
    border-right: 3rpx solid rgba(0, 0, 0, 0.18);
    transform: rotate(45deg);
}

.timelineRow__sub {
    margin-top: 6rpx;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.42);
}

.iconBtn {
    width: 46rpx;
    height: 46rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.iconBtn--square {
    border-radius: 14rpx;
}

.icon {
    width: 36rpx;
    height: 36rpx;
    position: relative;
}

.icon--plus { display:flex; align-items:center; justify-content:center; }

.icon--edit { display:flex; align-items:center; justify-content:center; }


.tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.98);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
}

.tabbar__item {
    width: 25%;
    height: 120rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
}

.tabbar__item--pressed {
    opacity: 0.92;
}

.tabbar__icon {
    width: 42rpx;
    height: 42rpx;
    border-radius: 999rpx;
    position: relative;
    background: rgba(0, 0, 0, 0.12);
}

.tabbar__icon--home {
    background: rgba(0, 0, 0, 0.14);
}

.tabbar__icon--home::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 52%;
    width: 18rpx;
    height: 18rpx;
    border-radius: 6rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.86);
    transform: translate(-50%, -50%);
}

.tabbar__icon--msg {
    background: rgba(0, 0, 0, 0.14);
}

.tabbar__icon--msg::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 22rpx;
    height: 16rpx;
    border-radius: 6rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.86);
    transform: translate(-50%, -55%);
}

.tabbar__icon--resume {
    background: rgba(42, 103, 255, 0.22);
}

.tabbar__icon--resume::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18rpx;
    height: 22rpx;
    border-radius: 6rpx;
    border: 3rpx solid rgba(42, 103, 255, 0.92);
    transform: translate(-50%, -55%);
    background:
        linear-gradient(rgba(42, 103, 255, 0.28) 0 0) 50% 46% / 12rpx 3rpx no-repeat,
        linear-gradient(rgba(42, 103, 255, 0.28) 0 0) 50% 64% / 12rpx 3rpx no-repeat;
}

.tabbar__icon--active {
    background: rgba(42, 103, 255, 0.16);
}

.tabbar__icon--me {
    background: rgba(0, 0, 0, 0.14);
}

.tabbar__icon--me::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 44%;
    width: 14rpx;
    height: 14rpx;
    border-radius: 999rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.86);
    transform: translate(-50%, -50%);
}

.tabbar__label {
    font-size: 22rpx;
    color: rgba(0, 0, 0, 0.46);
}

.tabbar__label--active {
    color: rgba(42, 103, 255, 0.92);
    font-weight: 800;
}

.step-tags {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12rpx;
    margin-top: 8rpx;
}

.step-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 16rpx;
}

.step-btn {
    padding: 6rpx 20rpx;
    border-radius: 999rpx;
    font-size: 24rpx;
    font-weight: 600;
}

.step-btn--delete {
    color: #ff4444;
    border: 1px solid rgba(255, 68, 68, 0.4);
    background: rgba(255, 68, 68, 0.06);
}

.step-btn--cert {
    color: #1e5bff;
    border: 1px solid rgba(30, 91, 255, 0.35);
    background: rgba(30, 91, 255, 0.06);
}

.step-btn--edit {
    color: rgba(0, 0, 0, 0.56);
    border: 1px solid rgba(0, 0, 0, 0.18);
    background: rgba(0, 0, 0, 0.04);
}

.step-btn--share {
    color: #07c160;
    border: 1px solid rgba(7, 193, 96, 0.35);
    background: rgba(7, 193, 96, 0.06);
}

.step-btn--cancel {
    color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: rgba(0, 0, 0, 0.03);
}

.step-badge {
    padding: 6rpx 20rpx;
    border-radius: 999rpx;
    font-size: 24rpx;
    font-weight: 600;
}

.step-badge--approved {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.10);
}

.step-badge--gold {
    color: #b45309;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(245, 158, 11, 0.12));
    border: 1px solid rgba(245, 158, 11, 0.30);
    font-weight: 700;
}

.step-badge--pending {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.10);
}
</style>
