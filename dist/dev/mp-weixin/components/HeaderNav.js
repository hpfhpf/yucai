"use strict";
const common_vendor = require("../common/vendor.js");
const utils_route = require("../utils/route.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "HeaderNav",
  props: {
    title: { default: "" },
    type: { default: "default" },
    theme: { default: "FFF" }
  },
  setup(__props) {
    const city = common_vendor.ref("北京");
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(systemInfo.statusBarHeight || 0);
    const handleCityTap = () => {
      common_vendor.index.showToast({ title: "切换城市", icon: "none" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.type == "seeker-index"
      }, _ctx.type == "seeker-index" ? {
        b: common_vendor.t(city.value),
        c: common_vendor.o(handleCityTap, "85")
      } : {}, {
        d: _ctx.type == "show-back"
      }, _ctx.type == "show-back" ? {
        e: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_route.goPageBack) && common_vendor.unref(utils_route.goPageBack)(...args),
          "74"
        )
      } : {}, {
        f: common_vendor.t(_ctx.title),
        g: common_vendor.n(_ctx.theme == "FFF" ? "white__nav" : "black__nav"),
        h: `${statusBarHeight.value}px`
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-60d117ec"]]);
wx.createComponent(Component);
