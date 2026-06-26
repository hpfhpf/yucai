<template>
    <view class="page">
        <HeaderNav title="填写推荐信" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content">
                <view class="card card--info">
                    <wd-cell-group :border="false" title-width="140rpx">
                        <wd-cell title="姓名" :value="form.name" :border="false" />
                        <wd-cell title="公司" :value="form.company" :border="false" />
                        <wd-cell title="职位" :value="form.position" :border="false" />
                    </wd-cell-group>

                    <view class="dateRow">
                        <view class="dateRow__label">在职时间</view>
                        <view class="dateBox" :class="{ 'dateBox--filled': !!form.startDate }" @click="openStartPicker">
                            {{ startText }}
                        </view>
                        <view class="dateRow__sep">至</view>
                        <view class="dateBox" :class="{ 'dateBox--filled': !!form.endDate }" @click="openEndPicker">
                            {{ endText }}
                        </view>
                    </view>
                </view>

                <view class="card card--textarea">
                    <wd-textarea v-model="form.letter" placeholder="推荐信模板" auto-height :maxlength="-1" compact />
                </view>

                <view class="choices">
                    <wd-radio-group v-model="form.relation" direction="horizontal" checked-color="#2a67ff"
                        custom-class="choiceGroup">
                        <wd-radio v-for="item in relationOptions" :key="item.value" :value="item.value"
                            custom-class="choice">
                            {{ item.label }}
                        </wd-radio>
                    </wd-radio-group>

                    <wd-radio-group v-model="form.submitType" direction="horizontal" checked-color="#2a67ff"
                        custom-class="choiceGroup choiceGroup--submit">
                        <wd-radio v-for="item in submitOptions" :key="item.value" :value="item.value"
                            custom-class="choice">
                            {{ item.label }}
                        </wd-radio>
                    </wd-radio-group>
                </view>
                <wd-button plain block custom-class="submit-btn">提交</wd-button>
            </view>
        </scroll-view>

        <wd-datetime-picker v-model="startTimestamp" type="year-month" title="选择开始时间" v-model:visible="showStartPicker"
            @confirm="handleStartConfirm" />
        <wd-datetime-picker v-model="endTimestamp" type="year-month" title="选择结束时间" v-model:visible="showEndPicker"
            @confirm="handleEndConfirm" />
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import HeaderNav from '@/components/HeaderNav.vue'

type RelationType = 'leader' | 'colleague' | 'hr'
type SubmitType = 'anonymous' | 'realname' | ''

const relationOptions: { label: string; value: RelationType }[] = [
    { label: '我是上级', value: 'leader' },
    { label: '我是同事', value: 'colleague' },
    { label: '我是HR', value: 'hr' },
]

const submitOptions: { label: string; value: SubmitType }[] = [
    { label: '匿名提交', value: 'anonymous' },
    { label: '实名提交', value: 'realname' },
]

const form = ref({
    name: '张文凯',
    company: '北京网聘咨询有限公司',
    position: '高级软件工程师',
    startDate: '',
    endDate: '',
    letter: '',
    relation: 'leader' as RelationType,
    submitType: '' as SubmitType,
})

const showStartPicker = ref(false)
const showEndPicker = ref(false)
const startTimestamp = ref(Date.now())
const endTimestamp = ref(Date.now())

const formatYm = (dateStr: string) => {
    if (!dateStr) return ''
    const [y, m] = dateStr.split('-')
    if (!y || !m) return ''
    return `${y}年${m}月`
}

const startText = computed(() => (form.value.startDate ? formatYm(form.value.startDate) : '开始时间'))
const endText = computed(() => (form.value.endDate ? formatYm(form.value.endDate) : '结束时间'))

const openStartPicker = () => {
    if (form.value.startDate) {
        const [y, m] = form.value.startDate.split('-')
        startTimestamp.value = new Date(Number(y), Number(m) - 1).getTime()
    } else {
        startTimestamp.value = Date.now()
    }
    showStartPicker.value = true
}

const openEndPicker = () => {
    if (form.value.endDate) {
        const [y, m] = form.value.endDate.split('-')
        endTimestamp.value = new Date(Number(y), Number(m) - 1).getTime()
    } else {
        endTimestamp.value = Date.now()
    }
    showEndPicker.value = true
}

const handleStartConfirm = ({ value }: { value: number }) => {
    const d = new Date(value)
    form.value.startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const handleEndConfirm = ({ value }: { value: number }) => {
    const d = new Date(value)
    form.value.endDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
@import '@/style/variables.scss';
@import '@/style/mixin.scss';

.page {
    @include app-page-shell(linear-gradient(180deg, #dfe8ff 0%, #eef3ff 38%, #edf2ff 100%));
}

.scroll {
    flex: 1 1 auto;
}

.content {
    padding: 18rpx 26rpx 60rpx;
    box-sizing: border-box;
}

.card {
    @include app-card-base(var(--app-radius-lg), var(--app-surface), var(--app-shadow-card-strong));
    border: 1px solid rgba(255, 255, 255, 0.8);
    overflow: hidden;
}

.card--info {
    padding: 10rpx 0 26rpx;

    :deep(.wd-cell) {
        padding: 8rpx 28rpx;

        &::after {
            display: none;
        }
    }

    :deep(.wd-cell__title) {
        font-size: 28rpx;
        color: var(--app-text-secondary);
    }

    :deep(.wd-cell__value) {
        font-size: 30rpx;
        color: var(--app-text-primary);
    }
}

.dateRow {
    margin: 8rpx 28rpx 0;
    display: flex;
    align-items: center;
    gap: 18rpx;
}

.dateRow__label {
    width: 140rpx;
    font-size: 28rpx;
    color: var(--app-text-secondary);
}

.dateRow__sep {
    font-size: 28rpx;
    color: var(--app-text-secondary);
}

.dateBox {
    width: 210rpx;
    height: 92rpx;
    border-radius: var(--app-radius-md);
    background: rgba(36, 96, 255, 0.06);
    border: 1px solid rgba(36, 96, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    color: var(--app-text-muted);
}

.dateBox--filled {
    color: var(--app-text-primary);
}

.card--textarea {
    margin-top: 22rpx;
    padding: 16rpx 18rpx;

    :deep(.wd-textarea) {
        background: transparent;
    }

    :deep(.wd-textarea__inner) {
        min-height: 240rpx;
        font-size: 30rpx;
        color: var(--app-text-primary);
        line-height: 44rpx;
    }
}

.choices {
    margin-top: 24rpx;
}

.choiceGroup {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    gap: 18rpx;

    &--submit {
        margin-top: 24rpx;
        grid-template-columns: repeat(2, 1fr);
    }
}

.choice {
    height: 92rpx !important;
    border-radius: var(--app-radius-lg) !important;
    background: var(--app-surface-muted) !important;
    border: 1px solid var(--app-line-strong) !important;
    box-shadow: var(--app-shadow-card);
    padding: 0 22rpx !important;
    margin: 0 !important;

    :deep(.wd-radio__label) {
        font-size: 30rpx;
        color: var(--app-text-primary);
    }

    &.is-checked {
        border-color: rgba(42, 103, 255, 0.18) !important;
        box-shadow: 0 14rpx 34rpx rgba(20, 88, 255, 0.16);
    }
}

:deep(.submit-btn) {
    margin-top: 36rpx;
}

:deep(.choiceGroup--submit) {
    margin-top: 24rpx;
}
</style>
