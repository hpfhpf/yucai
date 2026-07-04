export const getSystemInfoSync = () => {
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

