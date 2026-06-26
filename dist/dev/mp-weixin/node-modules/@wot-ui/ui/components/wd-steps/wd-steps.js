"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __default__ = {
  name: "wd-steps",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.stepsProps,
  setup(__props) {
    const props = __props;
    const { linkChildren } = common_vendor.useChildren(common_vendor.STEPS_KEY);
    linkChildren({ props });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(`wd-steps ${_ctx.customClass} ${_ctx.vertical ? "is-vertical" : ""}`),
        b: common_vendor.s(_ctx.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
