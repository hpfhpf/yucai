<template>
    <view class="page">
        <HeaderNav title="手机验证" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 240}px` }">
                <view class="stepper">
                    <wd-steps :active="2" custom-class="stepperSteps" align-center>
                        <wd-step status="finished" title="基本信息" />
                        <wd-step status="finished" title="企业认证" />
                        <wd-step status="process" title="手机验证" />
                    </wd-steps>
                </view>

                <view class="card">
                    <view class="field">
                        <wd-icon name="phone" size="36rpx" color="rgba(0, 0, 0, 0.46)" />
                        <view class="field__prefix">86+</view>
                        <wd-input v-model="form.phone" compact custom-class="fieldInput" type="number" maxlength="11"
                            placeholder="请输入手机号" />
                    </view>

                    <view class="field field--gap">
                        <wd-icon name="check-circle" size="36rpx" color="rgba(0, 0, 0, 0.46)" />
                        <wd-input v-model="form.captcha" compact custom-class="fieldInput" maxlength="6"
                            placeholder="请输入图形验证码" />
                        <view class="captcha" hover-class="captcha--pressed" @click="refreshCaptcha">
                            <view class="captcha__txt">{{ captchaText }}</view>
                        </view>
                    </view>

                    <view class="field field--gap">
                        <wd-icon name="lock" size="36rpx" color="rgba(0, 0, 0, 0.46)" />
                        <wd-input v-model="form.password" compact custom-class="fieldInput" type="password"
                            placeholder="请输入密码" />
                    </view>

                    <view class="field field--gap">
                        <wd-icon name="lock" size="36rpx" color="rgba(0, 0, 0, 0.46)" />
                        <wd-input v-model="form.password2" compact custom-class="fieldInput" type="password"
                            placeholder="请再次输入密码" />
                    </view>

                    <view class="field field--gap">
                        <wd-icon name="email" size="36rpx" color="rgba(0, 0, 0, 0.46)" />
                        <wd-input v-model="form.smsCode" compact custom-class="fieldInput" maxlength="6"
                            placeholder="短信验证码" />
                        <wd-button size="small" :disabled="smsCountdown > 0" custom-class="smsBtn"
                            @click="handleGetSms">
                            {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                        </wd-button>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="bottom" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button type="primary" block custom-class="submitBtn" @click="handleSubmit">完成注册</wd-button>
            <view class="agree" hover-class="agree--pressed" @click="toggleAgree">
                <view class="check" :class="{ 'check--on': agree }">
                    <wd-icon v-if="agree" name="check" size="16rpx" color="rgba(255, 255, 255, 0.98)" />
                </view>
                <view class="agree__text">
                    我已阅读并同意
                    <text class="agree__link">《金职信企业会员协议》</text>
                </view>
            </view>
        </view>

        <wd-toast selector="verifyToast" />
    </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'

const toast = useToast('verifyToast')

const safeBottom = ref(uni.getSystemInfoSync().safeAreaInsets?.bottom || 0)

const form = ref({
    phone: '',
    captcha: '',
    password: '',
    password2: '',
    smsCode: '',
})

const agree = ref(false)

const captchaText = ref('A7B9')
const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
    let out = ''
    for (let i = 0; i < 4; i += 1) out += chars[Math.floor(Math.random() * chars.length)]
    captchaText.value = out
}

const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

const stopSmsTimer = () => {
    if (smsTimer) clearInterval(smsTimer)
    smsTimer = null
}

const startSmsCountdown = (sec: number) => {
    stopSmsTimer()
    smsCountdown.value = sec
    smsTimer = setInterval(() => {
        smsCountdown.value -= 1
        if (smsCountdown.value <= 0) {
            smsCountdown.value = 0
            stopSmsTimer()
        }
    }, 1000)
}

const isValidPhone = (v: string) => /^1\d{10}$/.test(v)

const handleGetSms = () => {
    if (smsCountdown.value > 0) return
    const phone = form.value.phone.trim()
    if (!isValidPhone(phone)) {
        toast.info('请输入正确手机号')
        return
    }
    if (!form.value.captcha.trim()) {
        toast.info('请输入图形验证码')
        return
    }
    toast.info('验证码已发送')
    startSmsCountdown(60)
}

const validateSubmit = () => {
    const phone = form.value.phone.trim()
    if (!isValidPhone(phone)) return '请输入正确手机号'
    if (!form.value.captcha.trim()) return '请输入图形验证码'
    if (!form.value.password.trim()) return '请输入密码'
    if (form.value.password.trim().length < 6) return '密码至少6位'
    if (form.value.password2.trim() !== form.value.password.trim()) return '两次密码不一致'
    if (!form.value.smsCode.trim()) return '请输入短信验证码'
    if (!agree.value) return '请阅读并同意协议'
    return ''
}

const handleSubmit = () => {
    const err = validateSubmit()
    if (err) {
        toast.info(err)
        return
    }
    toast.info('注册成功')
}

const toggleAgree = () => {
    agree.value = !agree.value
}

onMounted(() => refreshCaptcha())

onBeforeUnmount(() => stopSmsTimer())
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
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.78);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx 22rpx 18rpx;
}

:deep(.stepperSteps) {
    width: 100%;
}

:deep(.stepperSteps .wd-step__title) {
    font-size: 24rpx !important;
    font-weight: 800 !important;
}

:deep(.stepperSteps .wd-step--finished .wd-step__title) {
    color: rgba(0, 0, 0, 0.52) !important;
}

:deep(.stepperSteps .wd-step--process .wd-step__title) {
    color: rgba(0, 0, 0, 0.72) !important;
    font-weight: 900 !important;
}

:deep(.stepperSteps .wd-step__line) {
    background: rgba(30, 91, 255, 0.98) !important;
}

.card {
    margin-top: 22rpx;
    border-radius: var(--app-radius-lg);
    background: var(--app-surface);
    border: 1px solid rgba(255, 255, 255, 0.86);
    box-shadow: var(--app-shadow-card);
    padding: 22rpx 22rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
}

.field {
    height: 96rpx;
    border-radius: var(--app-radius-md);
    background: rgba(239, 244, 255, 0.92);
    border: 1px solid rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    padding: 0 18rpx;
    box-sizing: border-box;
    gap: 14rpx;
}

.field--gap {
    margin-top: 2rpx;
}

.field__prefix {
    font-size: 28rpx;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.74);
    flex: 0 0 auto;
}

:deep(.fieldInput) {
    flex: 1;
    min-width: 0;
    height: 96rpx;
    background: transparent !important;

    .wd-input__inner {
        height: 96rpx;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.78) !important;
    }

    .uni-input-placeholder {
        color: rgba(0, 0, 0, 0.26) !important;
        font-size: 28rpx;
    }
}

.captcha {
    width: 210rpx;
    height: 72rpx;
    border-radius: var(--app-radius-md);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(230, 236, 255, 0.92));
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex: 0 0 auto;
}

.captcha--pressed {
    opacity: 0.9;
}

.captcha__txt {
    font-size: 34rpx;
    font-weight: 950;
    letter-spacing: 6rpx;
    color: rgba(0, 0, 0, 0.56);
    transform: rotate(-6deg);
}

:deep(.smsBtn) {
    width: 220rpx !important;
    height: 84rpx !important;
    border-radius: var(--app-radius-md) !important;
    font-size: 28rpx !important;
    font-weight: 900 !important;
    flex: 0 0 auto;
}

:deep(.smsBtn.is-disabled) {
    background: rgba(0, 0, 0, 0.10) !important;
    color: rgba(0, 0, 0, 0.40) !important;
    box-shadow: none !important;
}

.bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18rpx 22rpx 18rpx;
    box-sizing: border-box;
    background: rgba(238, 244, 255, 0.92);
    backdrop-filter: blur(12rpx);
}

:deep(.submitBtn) {
    height: 96rpx !important;
    font-size: 32rpx !important;
    font-weight: 950 !important;
    letter-spacing: 2rpx !important;
    box-shadow: 0 18rpx 50rpx rgba(30, 91, 255, 0.26) !important;
}

.agree {
    margin-top: 14rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    color: rgba(0, 0, 0, 0.34);
}

.agree--pressed {
    opacity: 0.88;
}

.check {
    width: 30rpx;
    height: 30rpx;
    border-radius: var(--app-radius-pill);
    border: 2rpx solid rgba(0, 0, 0, 0.16);
    background: rgba(255, 255, 255, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.check--on {
    background: rgba(30, 91, 255, 0.98);
    border-color: rgba(30, 91, 255, 0.12);
}

.agree__text {
    font-size: 24rpx;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.32);
}

.agree__link {
    color: rgba(0, 0, 0, 0.32);
}
</style>
