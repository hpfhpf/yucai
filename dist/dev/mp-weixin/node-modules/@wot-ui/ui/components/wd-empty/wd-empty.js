"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-empty",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.emptyProps,
  setup(__props) {
    const props = __props;
    const iconStyle = common_vendor.computed(() => {
      let style = {};
      if (props.iconSize) {
        style["font-size"] = common_vendor.addUnit(props.iconSize);
        style["width"] = common_vendor.addUnit(props.iconSize);
        style["height"] = common_vendor.addUnit(props.iconSize);
      }
      return `${common_vendor.objToStyle(style)}`;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: _ctx.icon,
          ["custom-class"]: "wd-empty__icon",
          ["custom-style"]: iconStyle.value
        }),
        b: _ctx.tip
      }, _ctx.tip ? {
        c: common_vendor.t(_ctx.tip)
      } : {}, {
        d: common_vendor.n(`wd-empty  ${_ctx.customClass}`),
        e: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
