"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const phone = common_vendor.ref("");
    const password = common_vendor.ref("");
    const redirectUrl = common_vendor.ref("/pages/seeker/index");
    const tabPages = /* @__PURE__ */ new Set(["/pages/seeker/index", "/pages/mine/index"]);
    common_vendor.onLoad((options) => {
      const redirect = decodeURIComponent((options == null ? void 0 : options.redirect) || "");
      if (redirect) {
        redirectUrl.value = redirect;
      }
    });
    const handleLogin = () => {
      const p = phone.value.trim();
      const pwd = password.value.trim();
      if (!/^1\d{10}$/.test(p)) {
        common_vendor.index.showToast({ title: "请输入正确手机号", icon: "none" });
        return;
      }
      if (!pwd) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      common_vendor.index.setStorageSync("token", `mock-token-${Date.now()}`);
      const target = redirectUrl.value || "/pages/seeker/index";
      const path = target.split("?")[0];
      if (tabPages.has(path)) {
        common_vendor.index.navigateTo({ url: path });
        return;
      }
      common_vendor.index.reLaunch({ url: target });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => phone.value = $event, "0d"),
        b: common_vendor.p({
          ["custom-class"]: "globInput margin-16-a",
          type: "number",
          maxlength: "11",
          placeholder: "请输入手机号",
          modelValue: phone.value
        }),
        c: common_vendor.o(($event) => password.value = $event, "41"),
        d: common_vendor.p({
          ["custom-class"]: "globInput margin-16-a",
          type: "password",
          ["show-password"]: true,
          placeholder: "请输入密码",
          modelValue: password.value
        }),
        e: common_vendor.o(handleLogin, "91")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45258083"]]);
wx.createPage(MiniProgramPage);
