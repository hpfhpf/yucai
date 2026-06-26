"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-cell",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.cellProps,
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const cell = common_vendor.useCell();
    const isBorder = common_vendor.computed(() => {
      return Boolean(common_vendor.isDef(props.border) ? props.border : cell.border.value);
    });
    const isCenter = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.center) ? props.center : (_a = cell.center) == null ? void 0 : _a.value;
    });
    const cellSize = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.size) ? props.size : (_a = cell.size) == null ? void 0 : _a.value;
    });
    const cellTitleWidth = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.titleWidth) ? props.titleWidth : (_a = cell.titleWidth) == null ? void 0 : _a.value;
    });
    const cellLayout = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.layout) ? props.layout : ((_a = cell.layout) == null ? void 0 : _a.value) || "horizontal";
    });
    const cellValueAlign = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.valueAlign) ? props.valueAlign : ((_a = cell.valueAlign) == null ? void 0 : _a.value) || "right";
    });
    const showLeft = common_vendor.computed(() => {
      const hasPrefix = slots.prefix || props.prefixIcon;
      const hasTitle = slots.title && props.useTitleSlot || props.title;
      const hasLabel = slots.label || props.label;
      return hasPrefix || hasTitle || hasLabel;
    });
    const showPlaceholder = common_vendor.computed(() => {
      return Boolean(props.placeholder && (props.value === "" || props.value === void 0 || props.value === null) && !slots.default);
    });
    function onClick() {
      const url = props.to;
      if (props.clickable || props.isLink) {
        emit("click");
      }
      if (url && props.isLink) {
        if (props.replace) {
          common_vendor.index.redirectTo({ url });
        } else {
          common_vendor.index.navigateTo({ url });
        }
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showLeft.value
      }, showLeft.value ? common_vendor.e({
        b: _ctx.required && !_ctx.hideAsterisk && _ctx.asteriskPosition === "start"
      }, _ctx.required && !_ctx.hideAsterisk && _ctx.asteriskPosition === "start" ? {} : {}, {
        c: _ctx.prefixIcon
      }, _ctx.prefixIcon ? {
        d: common_vendor.p({
          name: _ctx.prefixIcon,
          size: _ctx.iconSize,
          ["class-prefix"]: _ctx.iconPrefix,
          ["custom-class"]: `wd-cell__prefix ${_ctx.customPrefixClass}`
        })
      } : {}, {
        e: _ctx.useTitleSlot && _ctx.$slots.title
      }, _ctx.useTitleSlot && _ctx.$slots.title ? {} : _ctx.title ? {
        g: common_vendor.t(_ctx.title),
        h: common_vendor.n(_ctx.customTitleClass)
      } : {}, {
        f: _ctx.title,
        i: _ctx.label
      }, _ctx.label ? {
        j: common_vendor.t(_ctx.label),
        k: common_vendor.n(`wd-cell__label ${_ctx.customLabelClass}`)
      } : {}, {
        l: _ctx.required && !_ctx.hideAsterisk && _ctx.asteriskPosition === "end"
      }, _ctx.required && !_ctx.hideAsterisk && _ctx.asteriskPosition === "end" ? {} : {}, {
        m: common_vendor.s(cellTitleWidth.value ? "min-width:" + common_vendor.unref(common_vendor.addUnit)(cellTitleWidth.value) + ";max-width:" + common_vendor.unref(common_vendor.addUnit)(cellTitleWidth.value) + ";" : "")
      }) : {}, {
        n: common_vendor.t(showPlaceholder.value ? _ctx.placeholder : _ctx.value),
        o: common_vendor.n(`wd-cell__value ${_ctx.customValueClass} wd-cell__value--${cellValueAlign.value} ${_ctx.ellipsis ? "wd-cell__value--ellipsis" : ""} ${showPlaceholder.value ? "wd-cell__placeholder" : ""}`),
        p: _ctx.isLink
      }, _ctx.isLink ? {
        q: common_vendor.p({
          ["custom-class"]: "wd-cell__arrow-right",
          name: _ctx.arrowDirection,
          ["class-prefix"]: _ctx.iconPrefix
        })
      } : common_vendor.e({
        r: _ctx.suffixIcon
      }, _ctx.suffixIcon ? {
        s: common_vendor.p({
          name: _ctx.suffixIcon,
          size: _ctx.iconSize,
          ["class-prefix"]: _ctx.iconPrefix,
          ["custom-class"]: `wd-cell__suffix ${_ctx.customSuffixClass}`
        })
      } : {}), {
        t: common_vendor.n(`wd-cell__wrapper wd-cell__wrapper--${cellLayout.value}`),
        v: common_vendor.n(isBorder.value ? "is-border" : ""),
        w: common_vendor.n(cellSize.value ? "is-" + cellSize.value : ""),
        x: common_vendor.n(isCenter.value ? "is-center" : ""),
        y: common_vendor.n(_ctx.customClass),
        z: common_vendor.s(_ctx.customStyle),
        A: _ctx.isLink || _ctx.clickable ? "is-hover" : "none",
        B: common_vendor.o(onClick, "57")
      });
    };
  }
});
wx.createComponent(_sfc_main);
