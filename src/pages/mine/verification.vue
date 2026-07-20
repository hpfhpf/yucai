<template>
    <view class="page">
        <HeaderNav title="实名认证" type="show-back" theme="000" />

        <view class="content">
            <wd-card title="上传证件">
                <view class="uploads">
                    <view class="upload">
                        <wd-upload v-model:file-list="frontFiles" action="" :limit="1" :auto-upload="false"
                            accept="image" :size-type="['compressed']" :source-type="['album', 'camera']"
                            custom-evoke-class="upload__trigger" custom-preview-class="upload__preview"
                            @change="onFrontChange">
                            <view class="upload__empty">
                                <view class="upload__camera"><FaIcon name="camera" :size="40" color="#fff" /></view>
                            </view>
                        </wd-upload>
                        <view class="upload__label">手持身份证头像面</view>
                    </view>

                    <view class="upload">
                        <wd-upload v-model:file-list="backFiles" action="" :limit="1" :auto-upload="false"
                            accept="image" :size-type="['compressed']" :source-type="['album', 'camera']"
                            custom-evoke-class="upload__trigger" custom-preview-class="upload__preview"
                            @change="onBackChange">
                            <view class="upload__empty">
                                <view class="upload__camera"><FaIcon name="camera" :size="40" color="#fff" /></view>
                            </view>
                        </wd-upload>
                        <view class="upload__label">手持身份证国徽面</view>
                    </view>
                </view>
            </wd-card>


            <wd-card title="证件信息">
                <wd-cell-group border custom-class="form-group">
                    <wd-cell title="姓名" center>
                        <wd-input v-model="realName" placeholder="请填写真实姓名" align-right compact />
                    </wd-cell>
                    <wd-cell title="身份证号" center>
                        <wd-input v-model="idNumber" placeholder="请填写身份证号码" align-right compact />
                    </wd-cell>
                    <wd-cell title="有效期" :value="validDateText || '请选择有效期'" center is-link
                        @click="showValidDatePicker = true" />
                </wd-cell-group>
                <wd-calendar type="monthrange" v-model="validDate" v-model:visible="showValidDatePicker"
                    :min-date="minDate" :max-date="maxDate" title="选择有效期" @confirm="handleConfirm" />


                <view class="bottom" :style="{ paddingBottom: `${safeBottom}px` }">
                    <view class="agree" @click="agree = !agree">
                        <wd-checkbox v-model="agree" shape="circle" checked-color="rgba(30, 91, 255, 0.9)" />
                        <view class="agree__text">同意对个人信用评估</view>
                    </view>

                    <wd-button type="primary" block custom-class="submit-btn" @click="handleSubmit">
                        提交
                    </wd-button>
                </view>
            </wd-card>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'
import FaIcon from '@/components/FaIcon/index.vue'

type UploadFileItem = {
    uid: number
    url: string
    status?: string
    [key: string]: any
}

const frontFiles = ref<UploadFileItem[]>([])
const backFiles = ref<UploadFileItem[]>([])
const realName = ref('')
const idNumber = ref('')
const validDate = ref<(number | string)[]>([])
const showValidDatePicker = ref(false)
const minDate = new Date('1960-01-01').getTime()
const maxDate = new Date('2060-12-31').getTime()
const agree = ref(false)

const systemInfo = uni.getWindowInfo()
const safeBottom = ref(systemInfo.safeAreaInsets?.bottom || 0)

const frontImage = computed(() => frontFiles.value[0]?.url || '')
const backImage = computed(() => backFiles.value[0]?.url || '')

const isIdNumberValid = computed(() => /(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(idNumber.value.trim()))

const onFrontChange = ({ fileList }: { fileList: UploadFileItem[] }) => {
    frontFiles.value = fileList
}

const onBackChange = ({ fileList }: { fileList: UploadFileItem[] }) => {
    backFiles.value = fileList
}

const formatYearMonth = (timestamp: number | string): string => {
    const d = new Date(Number(timestamp))
    if (isNaN(d.getTime())) return ''
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

const validDateText = computed(() => {
    if (!validDate.value.length) return ''
    const start = formatYearMonth(validDate.value[0])
    const end = formatYearMonth(validDate.value[1])
    if (!start || !end) return ''
    return `${start} - ${end}`
})

const handleConfirm = ({ value }: { value: (number | string)[] }) => {
    validDate.value = value
}

const handleSubmit = () => {
    if (!frontImage.value) {
        uni.showToast({ title: '请上传身份证头像面', icon: 'none' })
        return
    }
    if (!backImage.value) {
        uni.showToast({ title: '请上传身份证国徽面', icon: 'none' })
        return
    }
    if (!realName.value.trim()) {
        uni.showToast({ title: '请填写真实姓名', icon: 'none' })
        return
    }
    if (!isIdNumberValid.value) {
        uni.showToast({ title: '请填写正确的身份证号码', icon: 'none' })
        return
    }
    if (!validDateText.value) {
        uni.showToast({ title: '请选择有效期', icon: 'none' })
        return
    }
    if (!agree.value) {
        uni.showToast({ title: '请勾选同意个人信用评估', icon: 'none' })
        return
    }
    uni.showLoading({ title: '提交中' })
    setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '提交成功', icon: 'none' })
    }, 800)
}
</script>

<style lang="scss">
.form-group {
    border-radius: 22rpx;
    overflow: hidden;
    box-shadow: var(--app-shadow-card);

    .wd-cell__left {
        width: 140rpx;
        flex: none;
    }
}
</style>
<style scoped lang="scss">
@import '@/style/mixin.scss';

.page {
    @include app-page-shell;
    background: linear-gradient(180deg, #dfe7ff 0%, #edf2ff 260rpx, var(--app-bg) 560rpx, var(--app-bg) 100%);
}

.content {
    position: relative;
    padding: 36rpx 0 44rpx;
}

.uploads {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22rpx;
}

.upload {
    display: flex;
    flex-direction: column;
    border: 1px solid #DDD;
    box-sizing: border-box;
    box-shadow: var(--app-shadow-card);
    border-radius: 16rpx;
    justify-content: center;
    min-height: 200rpx;
    align-items: center;
}

.upload__trigger {
    height: 170rpx;
    border-radius: 18rpx;
    background: rgba(248, 250, 255, 0.9);
    border: 2rpx dashed rgba(30, 91, 255, 0.25);
}

.upload__preview {
    height: 170rpx;
    border-radius: 18rpx;
    overflow: hidden;
}

.upload__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload__camera {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background: linear-gradient(180deg, rgba(30, 91, 255, 0.2), rgba(30, 91, 255, 0.4));
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload__label {
    margin-top: 12rpx;
    text-align: center;
    font-size: 26rpx;
    color: rgba(0, 0, 0, 0.36);
}

.section {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin: 22rpx 0 16rpx;
}

.section__bar {
    width: 6rpx;
    height: 26rpx;
    border-radius: 999rpx;
    background: #1e5bff;
}

.section__title {
    font-size: 30rpx;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.74);
}

.bottom {
    margin-top: 30rpx;
}

.agree {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 6rpx 4rpx 18rpx;
}

.agree__text {
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.36);
}

.submit-btn {
    height: 92rpx;
    border-radius: 999rpx;
    font-weight: 700;
    box-shadow: 0 18rpx 42rpx rgba(12, 72, 255, 0.22);
}
</style>
