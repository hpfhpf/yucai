<template>
    <view class="page">
        <HeaderNav title="AI 定制简历" type="show-back" theme="000" />
        <scroll-view class="scroll" scroll-y>
            <view class="content" :style="{ paddingBottom: `${safeBottom + 140}px` }">
                <!-- 生成中 -->
                <view v-if="phase === 'loading'" class="state">
                    <view class="state__spinner" />
                    <view class="state__text">AI 正在为该职位定制你的简历…</view>
                </view>

                <!-- 失败 -->
                <view v-else-if="phase === 'error'" class="state">
                    <view class="state__text">{{ errorMsg || '生成失败' }}</view>
                    <wd-button type="primary" size="small" @click="generate">重试</wd-button>
                </view>

                <!-- 可编辑表单 -->
                <template v-else>
                    <view class="card">
                        <view class="card__label">
                            自我描述
                            <text class="card__ai">AI 优化</text>
                        </view>
                        <textarea v-model="form.selfDesc" class="ta" :maxlength="-1"
                            placeholder="自我描述" @blur="scheduleSave" />
                    </view>

                    <view v-for="(w, i) in form.workExps" :key="'w' + i" class="card">
                        <view class="card__label">
                            工作经历 · {{ w.company || '' }} {{ w.title || '' }}
                            <text class="card__ai">AI 优化</text>
                        </view>
                        <textarea v-model="w.content" class="ta" :maxlength="-1"
                            placeholder="工作内容描述" @blur="scheduleSave" />
                    </view>

                    <view v-for="(p, i) in form.projectExps" :key="'p' + i" class="card">
                        <view class="card__label">
                            项目经历 · {{ p.name || '' }}
                            <text class="card__ai">AI 优化</text>
                        </view>
                        <textarea v-model="p.content" class="ta" :maxlength="-1"
                            placeholder="项目描述" @blur="scheduleSave" />
                    </view>

                    <view class="saveHint">{{ saveHint }}</view>
                </template>
            </view>
        </scroll-view>

        <view v-if="phase === 'ready'" class="bar" :style="{ paddingBottom: `${safeBottom}px` }">
            <wd-button plain custom-class="barBtn" :disabled="saving" @click="saveNow">保存</wd-button>
            <wd-button type="primary" custom-class="barBtn" :loading="delivering" :disabled="delivering"
                @click="deliver">投递简历</wd-button>
        </view>

        <wd-toast selector="tailorToast" />
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { useToast } from '@wot-ui/ui/components/wd-toast'
import HeaderNav from '@/components/HeaderNav.vue'
import { apiTailorResume, apiSaveTailoredResume, apiDeliverJob } from '@/api/index'

const toast = useToast('tailorToast')
const safeBottom = ref(0)

const jobId = ref('')
const diagnosisId = ref<string | undefined>(undefined)
const tailoredId = ref('')
const phase = ref<'loading' | 'ready' | 'error'>('loading')
const errorMsg = ref('')
const saving = ref(false)
const delivering = ref(false)
const saveHint = ref('')
const delivered = ref(false)

const form = reactive<{ selfDesc: string; workExps: any[]; projectExps: any[]; [k: string]: any }>({
    selfDesc: '',
    workExps: [],
    projectExps: [],
})

let raw: Record<string, any> = {}

onLoad((q: any) => {
    jobId.value = q?.jobId || ''
    diagnosisId.value = q?.diagnosisId || undefined
    try {
        const info = uni.getSystemInfoSync()
        safeBottom.value = info.safeAreaInsets?.bottom ?? 0
    } catch { }
    generate()
})

const generate = async () => {
    phase.value = 'loading'
    errorMsg.value = ''
    try {
        const res: any = await apiTailorResume(jobId.value, { diagnosisId: diagnosisId.value })
        tailoredId.value = res.id
        raw = res.content || {}
        form.selfDesc = raw.selfDesc || ''
        form.workExps = Array.isArray(raw.workExps) ? raw.workExps.map((w: any) => ({ ...w })) : []
        form.projectExps = Array.isArray(raw.projectExps) ? raw.projectExps.map((p: any) => ({ ...p })) : []
        phase.value = 'ready'
    } catch (e: any) {
        errorMsg.value = e?.message || '生成失败，请重试'
        phase.value = 'error'
    }
}

const buildContent = () => ({
    ...raw,
    selfDesc: form.selfDesc,
    workExps: form.workExps,
    projectExps: form.projectExps,
})

let saveTimer: any = null
const scheduleSave = () => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => { void doSave(false) }, 1200)
}

const doSave = async (manual: boolean) => {
    if (!tailoredId.value || saving.value) return
    saving.value = true
    saveHint.value = '保存中…'
    try {
        await apiSaveTailoredResume(tailoredId.value, buildContent())
        saveHint.value = '已保存'
        if (manual) toast.success('已保存')
    } catch (e: any) {
        saveHint.value = ''
        if (manual) toast.error(e?.message || '保存失败')
    } finally {
        saving.value = false
    }
}

const saveNow = () => { void doSave(true) }

const deliver = async () => {
    if (delivering.value || delivered.value) return
    delivering.value = true
    try {
        await doSave(false) // 投递前确保最新内容已保存
        await apiDeliverJob(jobId.value, {
            creditAuthorized: true,
            type: 'TARGETED',
            tailoredResumeId: tailoredId.value,
        })
        delivered.value = true
        toast.success('投递成功')
        setTimeout(() => uni.navigateBack(), 1000)
    } catch (e: any) {
        toast.error(e?.message || '投递失败')
    } finally {
        delivering.value = false
    }
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
