<template>
    <view class="page">
        <HeaderNav title="修改手机号" type="show-back" theme="000" />

        <view class="content">
            <view class="headline">
                <view class="headline__title">修改手机号</view>
                <view class="headline__sub">修改成功后请用新手机号登录</view>
            </view>

            <view class="form">
                <view class="row">
                    <view class="row__icon">
                        <FaIcon name="phone" :size="36" color="#1e5bff" />
                    </view>
                    <view class="row__main">
                        <view class="phonePrefix">
                            <text class="phonePrefix__text">{{ countryCode }}</text>
                            <FaIcon name="caret-down" :size="20" color="rgba(0,0,0,0.22)" />
                        </view>
                        <wd-input v-model="phone" class="row__input" type="number" :maxlength="11"
                            placeholder="请输入手机号" />
                    </view>
                </view>

                <view class="row">
                    <view class="row__icon">
                        <FaIcon name="shield-halved" :size="36" color="#1e5bff" />
                    </view>
                    <view class="row__main">
                        <wd-input v-model="captcha" class="row__input" :maxlength="6" placeholder="请输入图形验证码" />
                    </view>
                    <view class="row__right">
                        <view class="captcha" hover-class="captcha--pressed" @click="refreshCaptcha">
                            <text class="captcha__text">{{ captchaImageText }}</text>
                        </view>
                    </view>
                </view>

                <view class="row">
                    <view class="row__icon">
                        <FaIcon name="envelope" :size="36" color="#1e5bff" />
                    </view>
                    <view class="row__main">
                        <wd-input v-model="smsCode" class="row__input" type="number" :maxlength="6"
                            placeholder="短信验证码" />
                    </view>
                    <view class="row__right">
                        <wd-button type="primary" size="small" :disabled="!canSendSms" custom-class="sms-btn"
                            @click="handleSendSms">
                            {{ smsButtonText }}
                        </wd-button>
                    </view>
                </view>
            </view>

            <view class="actions" :style="{ paddingBottom: `${safeBottom}px` }">
                <wd-button type="primary" block :disabled="!canSave" :loading="saving" custom-class="save-btn"
                    @click="handleSave">
                    保存
                </wd-button>
            </view>
        </view>

        <wd-toast selector="phoneToast" />
    </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'

const toast = useToast('phoneToast')

const countryCode = ref('86+')
const phone = ref('')
const captcha = ref('')
const smsCode = ref('')
const saving = ref(false)

const systemInfo = uni.getWindowInfo()
const safeBottom = ref(systemInfo.safeAreaInsets?.bottom || 0)

const captchaImageText = ref('aE S U Q')

const phoneOk = computed(() => /^1\d{10}$/.test(phone.value.trim()))
const captchaOk = computed(() => captcha.value.trim().length >= 4)
const smsOk = computed(() => /^\d{4,6}$/.test(smsCode.value.trim()))

const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const smsButtonText = computed(() => (countdown.value > 0 ? `${countdown.value}s` : '获取验证码'))

const canSendSms = computed(() => countdown.value === 0 && phoneOk.value && captchaOk.value)
const canSave = computed(() => phoneOk.value && captchaOk.value && smsOk.value)

const refreshCaptcha = () => {
    const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    const pick = () => pool[Math.floor(Math.random() * pool.length)]
    captchaImageText.value = `${pick()}${pick()} ${pick()} ${pick()} ${pick()}`
}

const startCountdown = (seconds: number) => {
    countdown.value = seconds
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
        countdown.value -= 1
        if (countdown.value <= 0) {
            countdown.value = 0
            if (timer) clearInterval(timer)
            timer = null
        }
    }, 1000)
}

const handleSendSms = () => {
    if (!canSendSms.value) {
        if (!phoneOk.value) {
            toast.info('请输入正确手机号')
            return
        }
        if (!captchaOk.value) {
            toast.info('请输入图形验证码')
            return
        }
        return
    }

    startCountdown(60)
    toast.success('验证码已发送')
}

const handleSave = () => {
    if (!canSave.value) {
        toast.info('请完善信息后保存')
        return
    }
    saving.value = true
    setTimeout(() => {
        saving.value = false
        toast.success('保存成功')
    }, 800)
}

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
    timer = null
})
</script>

<style scoped lang="scss">
$bg: #eaf0ff;
$panel: rgba(255, 255, 255, 0.92);
$shadow: 0 16rpx 44rpx rgba(30, 60, 140, 0.08);
$primary: #1e5bff;
$text: rgba(0, 0, 0, 0.88);

.page {
    min-height: 100vh;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, $bg 560rpx, $bg 100%);
}

.content {
    position: relative;
    padding: 44rpx 26rpx 44rpx;
}

.headline {
    padding: 10rpx 6rpx 22rpx;
}

.headline__title {
    font-size: 44rpx;
    font-weight: 800;
    color: $text;
}

.headline__sub {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.34);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 22rpx;
}

.row {
    height: 102rpx;
    border-radius: 16rpx;
    background: $panel;
    box-shadow: $shadow;
    display: flex;
    align-items: center;
    padding: 0 18rpx;
    gap: 14rpx;
}

.row__icon {
    width: 46rpx;
    height: 46rpx;
    border-radius: 10rpx;
    background: rgba(30, 91, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.row__main {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 14rpx;
    min-width: 0;
}

.phonePrefix {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding-right: 12rpx;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.phonePrefix__text {
    font-size: 28rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.62);
}

.row__right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.captcha {
    width: 150rpx;
    height: 56rpx;
    border-radius: 12rpx;
    background: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.captcha--pressed {
    opacity: 0.92;
}

.captcha__text {
    font-size: 26rpx;
    letter-spacing: 2rpx;
    color: rgba(0, 0, 0, 0.46);
}

:deep(.sms-btn) {
    width: 190rpx !important;
    height: 70rpx !important;
    border-radius: 16rpx !important;
    font-size: 28rpx !important;
    font-weight: 800 !important;
}

.actions {
    margin-top: 44rpx;
}

:deep(.save-btn) {
    height: 92rpx !important;
    font-size: 34rpx !important;
    font-weight: 800 !important;
    background: linear-gradient(90deg, #1e67ff 0%, #1d54ff 62%, #1a47ff 100%) !important;
    box-shadow: 0 18rpx 42rpx rgba(12, 72, 255, 0.22) !important;
}
</style>
