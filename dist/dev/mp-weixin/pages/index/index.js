"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_wechat = require("../../utils/wechat.js");
if (!Array) {
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  _component_global_ku_root();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const count = common_vendor.ref(0);
    const doubleCount = common_vendor.computed(() => count.value * 2);
    const nickName = common_vendor.ref("");
    const openId = common_vendor.ref("");
    const toView = common_vendor.ref("demo1");
    const scrollTop = common_vendor.ref(0);
    const addRandom = () => {
      const delta = Math.floor(Math.random() * 10) + 1;
      count.value += delta;
      console.log("count add", delta, "=>", count.value);
    };
    const handleGetProfile = async () => {
      var _a;
      try {
        const res = await utils_wechat.getWxUserProfile();
        nickName.value = ((_a = res == null ? void 0 : res.userInfo) == null ? void 0 : _a.nickName) || "";
        console.log("userProfile", res);
      } catch (e) {
        console.log("getUserProfile fail", e);
      }
    };
    const handleGetOpenId = async () => {
      try {
        openId.value = await utils_wechat.loginAndGetOpenId();
        console.log("openid", openId.value);
      } catch (e) {
        console.log("getOpenId fail", e);
      }
    };
    const upper = (e) => {
      console.log(e);
    };
    const lower = (e) => {
      console.log(e);
    };
    const scroll = (e) => {
      console.log(e);
    };
    common_vendor.onLoad((options) => {
      console.log("index onLoad", options);
    });
    common_vendor.onShow(() => {
      console.log("index onShow");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(count.value),
        b: common_vendor.t(doubleCount.value),
        c: common_vendor.o(addRandom, "16"),
        d: common_vendor.o(handleGetProfile, "88"),
        e: common_vendor.o(handleGetOpenId, "27"),
        f: nickName.value
      }, nickName.value ? {
        g: common_vendor.t(nickName.value)
      } : {}, {
        h: openId.value
      }, openId.value ? {
        i: common_vendor.t(openId.value)
      } : {}, {
        j: toView.value,
        k: scrollTop.value,
        l: common_vendor.o(upper, "a7"),
        m: common_vendor.o(lower, "8e"),
        n: common_vendor.o(scroll, "9b")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
