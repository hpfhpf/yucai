"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __default__ = {
  name: "wd-cell-group",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.cellGroupProps,
  setup(__props) {
    const props = __props;
    const { linkChildren } = common_vendor.useChildren(common_vendor.CELL_GROUP_KEY);
    linkChildren({ props });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.title || _ctx.value || _ctx.$slots.title || _ctx.$slots.value
      }, _ctx.title || _ctx.value || _ctx.$slots.title || _ctx.$slots.value ? common_vendor.e({
        b: !_ctx.$slots.title
      }, !_ctx.$slots.title ? {
        c: common_vendor.t(_ctx.title)
      } : {}, {
        d: !_ctx.$slots.value
      }, !_ctx.$slots.value ? {
        e: common_vendor.t(_ctx.value)
      } : {}) : {}, {
        f: common_vendor.n(_ctx.border ? "is-border" : ""),
        g: common_vendor.n(_ctx.customClass),
        h: common_vendor.n(_ctx.insert ? "wd-cell-group--insert" : ""),
        i: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
