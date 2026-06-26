"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __default__ = {
  name: "wd-grid",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.gridProps,
  setup(__props) {
    const props = __props;
    const { linkChildren } = common_vendor.useChildren(common_vendor.GRID_KEY);
    linkChildren({ props });
    const rootStyle = common_vendor.computed(() => {
      const style = {};
      if (common_vendor.isDef(props.gutter)) {
        style.paddingLeft = common_vendor.addUnit(props.gutter);
        console.log(props.square);
        if (props.square) {
          style.marginBottom = common_vendor.addUnit(-props.gutter);
        }
      }
      return `${common_vendor.objToStyle(style)}${props.customStyle || ""}`;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(`wd-grid ${_ctx.customClass}`),
        b: common_vendor.s(rootStyle.value)
      };
    };
  }
});
wx.createComponent(_sfc_main);
