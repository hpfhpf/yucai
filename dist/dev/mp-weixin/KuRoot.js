"use strict";
const common_vendor = require("./common/vendor.js");
if (!Math) {
  GlobalNotify();
}
const GlobalNotify = () => "./components/GlobalNotify/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "KuRoot",
  setup(__props) {
    common_vendor.useQueue();
    return (_ctx, _cache) => {
      return {};
    };
  }
});
wx.createComponent(_sfc_main);
