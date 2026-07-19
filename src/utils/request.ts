import type { requestOptions } from "@/types/request";
import { useNotify } from "@/components/GlobalNotify/index";

const Notify = useNotify();

// 请求拦截
const requestInterceptor = (options: requestOptions) => {
  // 允许调用方通过 options.timeout 覆盖全局默认；AI 类慢接口需要更长超时。
  options.timeout = options.timeout || Number(__VITE_SERVER_TIMEOUT__) || 10000;
  options.url = __VITE_SERVER_BASEURL__ + options.url;
  // 剔除 data 中值为 undefined/null 的字段：GET 请求下 uni.request 会把
  // 这类字段序列化成 role=undefined 等字面量传给后端，导致 400/500。
  if (options.data && typeof options.data === "object") {
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(options.data as Record<string, any>)) {
      if (v !== undefined && v !== null) cleaned[k] = v;
    }
    options.data = cleaned;
  }
  const token = uni.getStorageSync('token') || '';
  options.header = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json;charset=utf-8",
    ...options.header,
  };
  return options;
};

export default (options: requestOptions): Promise<any> => {
  Notify.show({
    content: "加载中...",
    duration: false,
    icon: "loading",
  });
  options = requestInterceptor(options);
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res: UniApp.RequestSuccessCallbackResult) {
        Notify.hide();
        const status = res.statusCode;
        if (status >= 200 && status < 300) {
          resolve(res.data);
        } else if (status === 401) {
          uni.removeStorageSync('token');
          uni.removeStorageSync('userInfo');
          Notify.show({ content: '请先登录', duration: 2000, type: 'danger', icon: 'close-outline' });
          uni.reLaunch({ url: '/pages/login/index' as any });
          reject(res.data);
        } else {
          const msg = (res.data as any)?.message || `请求失败 (${status})`;
          Notify.show({ content: msg, duration: 2000, type: 'danger', icon: 'close-outline' });
          reject(res.data);
        }
      },
      fail(error) {
        Notify.hide();
        Notify.show({ content: `网络错误: ${error.errMsg}`, duration: 2000, type: 'danger', icon: 'close-outline' });
        reject(error);
      },
      complete() {},
    });
  });
};
