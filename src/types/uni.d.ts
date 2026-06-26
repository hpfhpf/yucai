declare module "@/utils/uni" {
  export const getSystemInfoSync: () => UniApp.GetSystemInfoResult;
  export const createSelectorQuery: () => UniApp.SelectorQuery;
  export const showToast: (options: UniApp.ShowToastOptions) => void;
  export const navigateBack: (options?: UniApp.NavigateBackOptions) => void;
  export const navigateTo: (options: UniApp.NavigateToOptions) => void;
}
