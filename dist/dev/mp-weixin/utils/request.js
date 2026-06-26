"use strict";
const common_vendor = require("../common/vendor.js");
const globalNotifyState = common_vendor.ref(false);
const options = common_vendor.ref();
let timer;
function useNotify() {
  function show(o) {
    clearTimeout(timer);
    options.value = o;
    globalNotifyState.value = true;
    if (options.value.duration !== false) {
      timer = setTimeout(() => {
        globalNotifyState.value = false;
      }, options.value.duration || 3e3);
    }
  }
  function hide() {
    globalNotifyState.value = false;
  }
  return {
    globalNotifyState,
    show,
    hide,
    options
  };
}
const Notify = useNotify();
const requestInterceptor = (options2) => {
  options2.timeout = "10000";
  options2.url = "http://10.1.1.114:18001" + options2.url;
  options2.header = {
    Authorization: `Bearer `,
    // token
    "Content-Type": "application/json;charset=utf-8",
    ...options2.header
  };
  return options2;
};
const request = (options2) => {
  Notify.show({
    content: "加载中...",
    duration: false,
    icon: "loading"
  });
  options2 = requestInterceptor(options2);
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      ...options2,
      success(res) {
        if (typeof res.data === "object" && "code" in res.data) {
          if (res.data.code === 200) {
            resolve(res.data);
            Notify.show({
              content: res.data.message,
              duration: 500,
              type: "success",
              icon: "check-outline"
            });
          } else {
            reject(res.data);
            Notify.show({
              content: `Error ${res.data.code}:${res.data.message}`,
              duration: 2e3,
              type: "danger",
              icon: "close-outline"
            });
          }
        } else {
          resolve(res.data);
          Notify.show({
            content: "请求成功",
            duration: 500,
            type: "success",
            icon: "check-outline"
          });
        }
      },
      fail(error) {
        reject(error);
        Notify.show({
          content: `Error: ${error.errMsg}`,
          duration: 2e3,
          type: "danger",
          icon: "close-outline"
        });
      },
      complete() {
      }
    });
  });
};
exports.request = request;
exports.useNotify = useNotify;
