<template>
    <wd-popup v-model="visible" position="center" :close-on-click-modal="false" custom-class="diagPopup"
        @close="handleClose">
        <view class="diag">
            <view class="diag__header">
                <view class="diag__title">简历诊断</view>
                <view v-if="phase !== 'running'" class="diag__close" @click="handleClose">
                    <FaIcon name="xmark" :size="32" color="rgba(0,0,0,0.42)" />
                </view>
            </view>

            <!-- 进度中 -->
            <view v-if="phase === 'running'" class="diag__progress">
                <view class="diag__percent">{{ percent }}%</view>
                <view class="diag__bar">
                    <view class="diag__barFill" :style="{ width: percent + '%' }" />
                </view>
                <view class="diag__hint">AI 正在分析简历与该职位的匹配度…</view>
            </view>

            <!-- 失败 -->
            <view v-else-if="phase === 'error'" class="diag__error">
                <view class="diag__errorText">{{ errorMsg || '诊断失败，请重试' }}</view>
                <view class="diag__actions">
                    <wd-button plain size="small" @click="start">重试</wd-button>
                    <wd-button type="primary" size="small" @click="emitDirect">跳过诊断直接投递</wd-button>
                </view>
            </view>

            <!-- 结果 -->
            <view v-else-if="phase === 'done'" class="diag__result">
                <view class="diag__score">
                    匹配度 <text class="diag__scoreNum">{{ result.matchScore }}</text> 分
                </view>
                <scroll-view class="diag__issues" scroll-y>
                    <view v-for="(iss, idx) in result.issues" :key="idx" class="issue">
                        <view class="issue__top">
                            <view class="issue__field">{{ iss.field }}</view>
                            <view class="issue__sev" :class="'issue__sev--' + iss.severity">
                                {{ sevText(iss.severity) }}
                            </view>
                        </view>
                        <view class="issue__mismatch">{{ iss.mismatch }}</view>
                        <view class="issue__sug">建议：{{ iss.suggestion }}</view>
                    </view>
                </scroll-view>
                <view class="diag__actions">
                    <wd-button plain size="small" @click="emitDirect">直接投递</wd-button>
                    <wd-button type="primary" size="small" @click="emitTailor">定向修改简历</wd-button>
                </view>
            </view>
        </view>
    </wd-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FaIcon from '@/components/FaIcon/index.vue'
import { streamRequest } from '@/utils/streamRequest'

const props = defineProps<{ jobId: string }>()
const emit = defineEmits<{
    (e: 'direct'): void
    (e: 'tailor', diagnosisId: string | undefined): void
}>()

type Issue = { field: string; severity: 'high' | 'medium' | 'low'; mismatch: string; suggestion: string }
const visible = ref(false)
const phase = ref<'running' | 'done' | 'error'>('running')
const percent = ref(0)
const errorMsg = ref('')
const result = ref<{ matchScore: number; issues: Issue[] }>({ matchScore: 0, issues: [] })
const diagnosisId = ref<string | undefined>(undefined)
let handle: { abort: () => void } | null = null

const sevText = (s: string) => (s === 'high' ? '重要' : s === 'medium' ? '中等' : '轻微')

const start = () => {
    phase.value = 'running'
    percent.value = 0
    errorMsg.value = ''
    handle = streamRequest<any>(`/jobs/${props.jobId}/diagnose/stream`, {
        onData(evt) {
            if (evt.stage === 'analyzing') {
                percent.value = evt.percent ?? percent.value
            } else if (evt.stage === 'done') {
                percent.value = 100
                result.value = evt.result || { matchScore: 0, issues: [] }
                diagnosisId.value = evt.diagnosisId
                phase.value = 'done'
            } else if (evt.stage === 'error') {
                errorMsg.value = evt.message || '诊断失败'
                phase.value = 'error'
            }
        },
        onError(err) {
            errorMsg.value = err?.errMsg || err?.message || '网络错误'
            phase.value = 'error'
        },
        onEnd() {
            if (phase.value === 'running') {
                errorMsg.value = '诊断未完成，请重试'
                phase.value = 'error'
            }
        },
    })
}

const open = () => { visible.value = true; start() }
const close = () => { handle?.abort(); visible.value = false }
const handleClose = () => { if (phase.value !== 'running') close() }
const emitDirect = () => { close(); emit('direct') }
const emitTailor = () => { close(); emit('tailor', diagnosisId.value) }

defineExpose({ open, close })
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
