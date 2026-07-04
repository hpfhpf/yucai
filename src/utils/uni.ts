// uni.getSystemInfoSync 已被微信标记为 deprecated，官方拆分为
// getWindowInfo / getDeviceInfo / getAppBaseInfo。项目仅用到
// safeAreaInsets / statusBarHeight / windowWidth，均属 getWindowInfo。
// 这里做兼容封装：优先新 API，运行环境不支持时回退旧 API。
export const getSystemInfoSync = () => {
    if (typeof uni.getWindowInfo === 'function') {
        return uni.getWindowInfo()
    }
    return uni.getSystemInfoSync()
}

export const createSelectorQuery = () => {
    return uni.createSelectorQuery()
}

export const showToast = (options: UniApp.ShowToastOptions) => {
    return uni.showToast(options)
}

export const navigateBack = (options: UniApp.NavigateBackOptions & { delta?: number }) => {
    return uni.navigateBack(options)
}

export const navigateTo = (options: UniApp.NavigateToOptions) => {
    return uni.navigateTo(options)
}

