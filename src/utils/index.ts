/**
 * @description: 本地存储封装 (基于 uni.setStorageSync)
 */
export const localStorageData = {
  /**
   * 设置存储
   * @param k key
   * @param v value
   * @param callBack 回调函数
   */
  set: <T = any>(k: string, v: T, callBack?: () => void) => {
    if (!k) {
      console.warn('localStorageData set: key is required');
      return;
    }
    try {
      uni.setStorageSync(k, JSON.stringify(v));
      if (callBack && typeof callBack === 'function') {
        callBack();
      }
    } catch (e) {
      console.error('localStorageData set error:', e);
    }
  },

  /**
   * 获取存储
   * @param k key
   * @returns parsed value or null
   */
  get: <T = any>(k: string): T | null => {
    if (!k) {
      return null;
    }
    try {
      const value = uni.getStorageSync(k);
      // uni.getStorageSync 在键不存在时可能返回 "" 或 undefined
      if (value === undefined || value === null || value === '') {
        return null;
      }
      return JSON.parse(value as string) as T;
    } catch (e) {
      console.error(`localStorageData get error for key "${k}":`, e);
      return null;
    }
  },

  /**
   * 移除指定 key
   * @param k key
   */
  remove: (k: string) => {
    if (!k) return;
    try {
      uni.removeStorageSync(k);
    } catch (e) {
      console.error('localStorageData remove error:', e);
    }
  },

  /**
   * 清空所有存储
   */
  clear: () => {
    try {
      uni.clearStorageSync();
    } catch (e) {
      console.error('localStorageData clear error:', e);
    }
  }
};

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))