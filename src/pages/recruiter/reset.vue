<template>
    <view class="page">
        <HeaderNav title="添加项目经验" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 160}px` }">
                <view class="stepper">
                    <view class="stepper__rail" />
                    <view class="stepper__nodes">
                        <view class="step">
                            <view class="step__dot step__dot--on">
                                <view class="step__inner" />
                            </view>
                            <view class="step__label step__label--on">基本信息</view>
                        </view>
                        <view class="step">
                            <view class="step__dot" />
                            <view class="step__label">企业认证</view>
                        </view>
                        <view class="step">
                            <view class="step__dot" />
                            <view class="step__label">手机验证</view>
                        </view>
                    </view>
                </view>

                <view class="card">
                    <view class="card__title">创建基本信息</view>

                    <view class="avatar" hover-class="avatar--pressed" @click="handleAvatarTap">
                        <image v-if="form.avatar" class="avatar__img" :src="form.avatar" mode="aspectFill" />
                        <view v-else class="avatar__ph" />
                    </view>

                    <view class="form">
                        <view class="row">
                            <view class="row__label">姓名</view>
                            <view class="row__field">
                                <wd-input v-model="form.name" compact custom-class="formInput" placeholder="请填写姓名" />
                            </view>
                        </view>
                        <view class="divider" />

                        <view class="row">
                            <view class="row__label">企业名称</view>
                            <view class="row__field">
                                <wd-input v-model="form.company" compact custom-class="formInput"
                                    placeholder="请填写公司名称" />
                            </view>
                        </view>
                        <view class="divider" />

                        <view class="row row--tap" hover-class="row--pressed" @click="openNatureSheet">
                            <view class="row__label">企业性质</view>
                            <view class="row__field">
                                <view class="row__value" :class="{ 'row__value--placeholder': !form.nature }">
                                    {{ form.nature || '请选择企业性质' }}
                                </view>
                            </view>
                            <FaIcon name="chevron-down" :size="22" color="rgba(0, 0, 0, 0.20)" />
                        </view>
                        <view class="divider" />

                        <view class="row">
                            <view class="row__label">我的职务</view>
                            <view class="row__field">
                                <wd-input v-model="form.role" compact custom-class="formInput" placeholder="请填写职务" />
                            </view>
                        </view>
                        <view class="divider" />

                        <view class="row">
                            <view class="row__label">我的邮箱</view>
                            <view class="row__field">
                                <wd-input v-model="form.email" compact custom-class="formInput"
                                    placeholder="请填写接收简历邮箱" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="bottom" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button type="primary" block custom-class="nextBtn" @click="handleNext">下一步</wd-button>
        </view>

        <wd-popup v-model="natureShown" position="bottom" :close-on-click-modal="true"
            custom-style="border-radius: 22rpx 22rpx 0 0; background: rgba(255, 255, 255, 0.98);">
            <view class="sheetContent">
                <view class="sheetContent__title">请选择企业性质</view>
                <scroll-view class="sheetContent__list" scroll-y>
                    <view v-for="opt in natureOptions" :key="opt" class="sheetContent__item"
                        hover-class="sheetContent__item--pressed" @click="selectNature(opt)">
                        <view class="sheetContent__text">{{ opt }}</view>
                        <FaIcon name="check" :size="28" color="rgba(30, 91, 255, 0.92)" />
                    </view>
                </scroll-view>
                <view class="sheetContent__footer">
                    <wd-button plain block custom-class="sheetCancelBtn" @click="closeNatureSheet">取消</wd-button>
                </view>
            </view>
        </wd-popup>

        <wd-toast selector="resetToast" />
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'

const toast = useToast('resetToast')

const safeBottom = ref(uni.getSystemInfoSync().safeAreaInsets?.bottom || 0)

const form = ref({
    avatar: '',
    name: '',
    company: '',
    nature: '',
    role: '',
    email: '',
})

const natureOptions = ['民营企业', '国企', '外企', '合资', '事业单位', '上市公司', '创业公司', '其他']

const natureShown = ref(false)

const openNatureSheet = () => {
    natureShown.value = true
}

const closeNatureSheet = () => {
    natureShown.value = false
}

const selectNature = (v: string) => {
    form.value.nature = v
    closeNatureSheet()
}

const handleAvatarTap = () => toast.info('选择头像')

const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v)

const validate = () => {
    if (!form.value.name.trim()) return '请填写姓名'
    if (!form.value.company.trim()) return '请填写公司名称'
    if (!form.value.nature.trim()) return '请选择企业性质'
    if (!form.value.role.trim()) return '请填写职务'
    const email = form.value.email.trim()
    if (!email || !isValidEmail(email)) return '请填写有效邮箱'
    return ''
}

const handleNext = () => {
    const err = validate()
    if (err) {
        toast.info(err)
        return
    }
    // 校验通过，进入下一步：手机验证
    uni.navigateTo({ url: '/pages/recruiter/verificationPhone' })
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #dfe7ff 0%, var(--app-bg) 42%, var(--app-bg) 100%);
    display: flex;
    flex-direction: column;
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 24rpx;
    box-sizing: border-box;
}

.stepper {
    border-radius: var(--app-radius-md);
    background: var(--app-surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.78);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx 22rpx 16rpx;
    position: relative;
}

.stepper__rail {
    position: absolute;
    left: 36rpx;
    right: 36rpx;
    top: 30rpx;
    height: 8rpx;
    background: rgba(0, 0, 0, 0.10);
    border-radius: var(--app-radius-pill);
}

.stepper__nodes {
    display: flex;
    justify-content: space-between;
}

.step {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    position: relative;
    z-index: 1;
}

.step__dot {
    width: 22rpx;
    height: 22rpx;
    border-radius: var(--app-radius-pill);
    border: 4rpx solid rgba(0, 0, 0, 0.22);
    background: var(--app-surface-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.step__dot--on {
    border-color: rgba(30, 91, 255, 0.92);
}

.step__inner {
    width: 10rpx;
    height: 10rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(30, 91, 255, 0.92);
}

.step__label {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.52);
    font-weight: 800;
}

.step__label--on {
    color: rgba(0, 0, 0, 0.66);
}

.card {
    margin-top: 18rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    overflow: hidden;
}

.card__title {
    padding: 22rpx 22rpx 18rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.avatar {
    width: 116rpx;
    height: 116rpx;
    border-radius: var(--app-radius-pill);
    background: rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin: 0 auto 14rpx;
}

.avatar--pressed {
    transform: scale(0.99);
    opacity: 0.92;
}

.avatar__img {
    width: 100%;
    height: 100%;
}

.avatar__ph {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.20), rgba(30, 91, 255, 0.06));
}

.form {
    padding: 6rpx 0 8rpx;
}

.row {
    height: 96rpx;
    padding: 0 22rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;
    box-sizing: border-box;
}

.row--pressed {
    background: rgba(0, 0, 0, 0.02);
}

.row__label {
    width: 148rpx;
    flex: 0 0 auto;
    font-size: 28rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.74);
}

.row__field {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

:deep(.formInput) {
    flex: 1;
    min-width: 0;
    height: 96rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 96rpx;
        font-size: 28rpx;
        color: var(--app-text-primary) !important;
    }

    .uni-input-placeholder {
        color: var(--app-text-muted) !important;
        font-size: 28rpx;
    }
}

.row__value {
    width: 100%;
    font-size: 28rpx;
    font-weight: 750;
    color: var(--app-text-primary);
}

.row__value--placeholder {
    color: var(--app-text-muted);
    font-weight: 700;
}

.divider {
    height: 1px;
    background: var(--app-line);
    margin-left: 22rpx;
}

.bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16rpx 22rpx 18rpx;
    box-sizing: border-box;
    background: rgba(238, 244, 255, 0.92);
    backdrop-filter: blur(12rpx);
}

:deep(.nextBtn) {
    height: 92rpx !important;
    border-radius: var(--app-radius-pill) !important;
    font-size: 30rpx !important;
    font-weight: 900 !important;
    letter-spacing: 2rpx !important;
    box-shadow: 0 18rpx 50rpx rgba(30, 91, 255, 0.26) !important;
}

.sheetContent {
    padding-bottom: env(safe-area-inset-bottom);
}

.sheetContent__title {
    padding: 18rpx 22rpx 12rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 900;
    color: var(--app-text-primary);
}

.sheetContent__list {
    max-height: 520rpx;
    max-height: 60vh;
}

.sheetContent__item {
    height: 92rpx;
    padding: 0 22rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.sheetContent__item+.sheetContent__item {
    border-top: 1px solid var(--app-line);
}

.sheetContent__item--pressed {
    background: rgba(0, 0, 0, 0.02);
}

.sheetContent__text {
    font-size: 28rpx;
    font-weight: 800;
    color: var(--app-text-secondary);
}

.sheetContent__footer {
    padding: 14rpx 22rpx 18rpx;
    box-sizing: border-box;
}

:deep(.sheetCancelBtn) {
    height: 84rpx !important;
    border-radius: var(--app-radius-pill) !important;
    background: rgba(0, 0, 0, 0.04) !important;
    color: var(--app-text-secondary) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
}
</style>
