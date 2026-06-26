"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __default__ = {
  name: "wd-card",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.cardProps,
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.title || _ctx.$slots.title
      }, _ctx.title || _ctx.$slots.title ? common_vendor.e({
        b: _ctx.title
      }, _ctx.title ? {
        c: common_vendor.t(_ctx.title)
      } : {}, {
        d: common_vendor.n(`wd-card__title ${_ctx.customTitleClass}`)
      }) : {}, {
        e: common_vendor.n(`wd-card__content ${_ctx.customContentClass}`),
        f: _ctx.$slots.footer
      }, _ctx.$slots.footer ? {
        g: common_vendor.n(`wd-card__footer ${_ctx.customFooterClass}`)
      } : {}, {
        h: common_vendor.n(`wd-card ${_ctx.type ? `wd-card--${_ctx.type}` : ""} ${_ctx.customClass}`),
        i: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
