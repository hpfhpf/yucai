"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-tag",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.tagProps,
  emits: ["click", "close", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("tag");
    const dynamicValue = common_vendor.ref("");
    const dynamicInput = common_vendor.ref(false);
    const rootClass = common_vendor.computed(() => {
      const { type, variant, size, round, mark, customClass } = props;
      const classList = [];
      type && classList.push(`is-${type}`);
      variant && classList.push(`is-${variant}`);
      size && classList.push(`is-${size}`);
      round && classList.push("is-round");
      mark && classList.push("is-mark");
      return `wd-tag ${customClass} ${classList.join(" ")}`;
    });
    const rootStyle = common_vendor.computed(() => {
      const rootStyle2 = {};
      if (props.variant !== "plain" && props.variant !== "dashed" && props.variant !== "text" && props.bgColor) {
        rootStyle2["background"] = props.bgColor;
      }
      if (props.bgColor) {
        rootStyle2["border-color"] = props.bgColor;
      }
      return `${common_vendor.objToStyle(rootStyle2)}${props.customStyle}`;
    });
    const textStyle = common_vendor.computed(() => {
      const textStyle2 = {};
      if (props.color) {
        textStyle2["color"] = props.color;
      }
      return common_vendor.objToStyle(textStyle2);
    });
    function handleClick(event) {
      emit("click", event);
    }
    function handleClose(event) {
      emit("close", event);
    }
    function handleAdd() {
      dynamicInput.value = true;
      dynamicValue.value = "";
    }
    function handleBlur() {
      setDynamicInput();
    }
    function handleConfirm(event) {
      setDynamicInput();
      emit("confirm", {
        value: event.detail.value
      });
    }
    function setDynamicInput() {
      dynamicInput.value = false;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: dynamicInput.value && _ctx.dynamic
      }, dynamicInput.value && _ctx.dynamic ? {
        b: common_vendor.unref(translate)("placeholder"),
        c: common_vendor.o(handleBlur, "f0"),
        d: common_vendor.o(handleConfirm, "a2"),
        e: dynamicValue.value,
        f: common_vendor.o(($event) => dynamicValue.value = $event.detail.value, "d8")
      } : _ctx.dynamic ? {
        h: common_vendor.p({
          name: "plus",
          ["custom-class"]: "wd-tag__add"
        }),
        i: common_vendor.t(common_vendor.unref(translate)("add")),
        j: common_vendor.s(textStyle.value),
        k: common_vendor.o(handleAdd, "cf")
      } : common_vendor.e({
        l: _ctx.$slots.icon || _ctx.icon
      }, _ctx.$slots.icon || _ctx.icon ? {
        m: common_vendor.p({
          name: _ctx.icon,
          ["custom-class"]: "wd-tag__icon"
        })
      } : {}, {
        n: _ctx.$slots.default
      }, _ctx.$slots.default ? {
        o: common_vendor.s(textStyle.value)
      } : {}, {
        p: _ctx.closable
      }, _ctx.closable ? {
        q: common_vendor.p({
          name: "close",
          ["custom-class"]: "wd-tag__close-icon"
        }),
        r: common_vendor.o(handleClose, "a5")
      } : {}), {
        g: _ctx.dynamic,
        s: common_vendor.n(rootClass.value),
        t: common_vendor.s(rootStyle.value),
        v: common_vendor.o(handleClick, "6d")
      });
    };
  }
});
wx.createComponent(_sfc_main);
