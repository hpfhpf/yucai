<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
    console.log("App Launch");

    if (typeof __UNI_PLATFORM__ !== 'undefined' && __UNI_PLATFORM__ === 'mp-weixin') {
        const canIUseUpdateManager = typeof wx !== 'undefined' && typeof wx.getUpdateManager === 'function'
        if (!canIUseUpdateManager) return

        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate((res: { hasUpdate: boolean }) => {
            console.log('checkForUpdate', res)
        })

        updateManager.onUpdateReady(() => {
            uni.showModal({
                title: '更新提示',
                content: '新版本已准备好，将重启应用以完成更新。',
                showCancel: false,
                success: () => updateManager.applyUpdate()
            })
        })

        updateManager.onUpdateFailed(() => {
            uni.showModal({
                title: '更新失败',
                content: '新版本下载失败，请稍后重试或删除小程序后重新打开。',
                showCancel: false
            })
        })
    }
});
onShow(() => {
    console.log("App Show");
});
onHide(() => {
    console.log("App Hide");
});
</script>
<style></style>
