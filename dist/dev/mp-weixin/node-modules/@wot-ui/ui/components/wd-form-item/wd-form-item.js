"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  WdCell();
}
const WdCell = () => "../wd-cell/wd-cell.js";
const __default__ = {
  name: "wd-form-item",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.formItemProps,
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { parent: form, index } = common_vendor.useParent(common_vendor.FORM_KEY);
    const { linkChildren } = common_vendor.useChildren(common_vendor.FORM_ITEM_VALIDATE_KEY);
    const emit = __emit;
    function normalizeValidateTrigger(trigger) {
      const triggerList = Array.isArray(trigger) ? trigger : trigger ? [trigger] : [];
      return triggerList.filter((item) => {
        return common_vendor.FORM_VALIDATE_EVENTS.includes(item);
      });
    }
    const validateTriggerSet = common_vendor.computed(() => {
      var _a;
      const formTrigger = (_a = form.value) == null ? void 0 : _a.props.validateTrigger;
      const currentTrigger = common_vendor.isDef(props.validateTrigger) ? props.validateTrigger : formTrigger;
      return new Set(normalizeValidateTrigger(currentTrigger));
    });
    function shouldTrigger(event) {
      return validateTriggerSet.value.has(event);
    }
    async function validateByTrigger(event) {
      var _a, _b;
      if (!props.prop || !shouldTrigger(event)) {
        return;
      }
      await ((_b = (_a = form.value) == null ? void 0 : _a.validate) == null ? void 0 : _b.call(_a, props.prop));
    }
    const propValue = common_vendor.computed(() => {
      var _a;
      if (!props.prop) {
        return void 0;
      }
      return common_vendor.getPropByPath((_a = form.value) == null ? void 0 : _a.props.model, props.prop);
    });
    common_vendor.watch(
      () => propValue.value,
      async () => {
        await validateByTrigger("change");
      },
      {
        deep: true
      }
    );
    linkChildren({
      prop: props.prop,
      shouldTrigger,
      validateByTrigger
    });
    const errorMessage = common_vendor.computed(() => {
      if (form.value && props.prop && form.value.errorMessages && form.value.errorMessages[props.prop]) {
        return form.value.errorMessages[props.prop];
      } else {
        return "";
      }
    });
    const formItemBorder = common_vendor.computed(() => {
      if (common_vendor.isDef(props.border)) {
        return props.border;
      }
      if (index.value > 0 && form.value && form.value.props.border) {
        return true;
      }
      return false;
    });
    const formItemCenter = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.center) ? props.center : (_a = form.value) == null ? void 0 : _a.props.center;
    });
    const formItemSize = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.size) ? props.size : (_a = form.value) == null ? void 0 : _a.props.size;
    });
    const formItemTitleWidth = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.titleWidth) ? props.titleWidth : ((_a = form.value) == null ? void 0 : _a.props.titleWidth) || "98px";
    });
    const formItemLayout = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.layout) ? props.layout : ((_a = form.value) == null ? void 0 : _a.props.layout) || "horizontal";
    });
    const formItemValueAlign = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.valueAlign) ? props.valueAlign : ((_a = form.value) == null ? void 0 : _a.props.valueAlign) || "left";
    });
    const formItemEllipsis = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.ellipsis) ? props.ellipsis : (_a = form.value) == null ? void 0 : _a.props.ellipsis;
    });
    const formItemAsteriskPosition = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.asteriskPosition) ? props.asteriskPosition : ((_a = form.value) == null ? void 0 : _a.props.asteriskPosition) || "start";
    });
    const formItemHideAsterisk = common_vendor.computed(() => {
      var _a;
      return common_vendor.isDef(props.hideAsterisk) ? props.hideAsterisk : (_a = form.value) == null ? void 0 : _a.props.hideAsterisk;
    });
    const showPlaceholder = common_vendor.computed(() => {
      return Boolean(props.placeholder && (props.value === "" || props.value === void 0 || props.value === null));
    });
    const isRequired = common_vendor.computed(() => {
      var _a, _b;
      if (props.required === true) {
        return true;
      }
      if (!props.prop || !((_b = (_a = form.value) == null ? void 0 : _a.props.schema) == null ? void 0 : _b.isRequired)) {
        return false;
      }
      return !!form.value.props.schema.isRequired(props.prop);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.title
      }, _ctx.$slots.title ? {} : {}, {
        b: showPlaceholder.value
      }, showPlaceholder.value ? {
        c: common_vendor.t(_ctx.placeholder)
      } : common_vendor.unref(common_vendor.isDef)(_ctx.value) ? {
        e: common_vendor.t(_ctx.value)
      } : {}, {
        d: common_vendor.unref(common_vendor.isDef)(_ctx.value),
        f: errorMessage.value
      }, errorMessage.value ? {
        g: common_vendor.t(errorMessage.value)
      } : {}, {
        h: common_vendor.o(($event) => emit("click"), "75"),
        i: common_vendor.p({
          ["custom-class"]: `wd-form-item ${_ctx.customClass}`,
          ["custom-style"]: _ctx.customStyle,
          ["use-title-slot"]: !!_ctx.$slots.title,
          title: _ctx.title,
          ["title-width"]: formItemTitleWidth.value,
          ["prefix-icon"]: _ctx.prefixIcon,
          ["icon-size"]: _ctx.iconSize,
          ["icon-prefix"]: _ctx.iconPrefix,
          required: isRequired.value,
          size: formItemSize.value,
          ["value-align"]: formItemValueAlign.value,
          center: formItemCenter.value,
          ellipsis: formItemEllipsis.value,
          clickable: _ctx.clickable,
          ["is-link"]: _ctx.isLink,
          ["asterisk-position"]: formItemAsteriskPosition.value,
          border: formItemBorder.value,
          ["hide-asterisk"]: formItemHideAsterisk.value,
          layout: formItemLayout.value,
          ["custom-prefix-class"]: _ctx.customPrefixClass,
          ["custom-label-class"]: _ctx.customLabelClass,
          ["custom-title-class"]: _ctx.customTitleClass,
          ["custom-value-class"]: _ctx.customValueClass
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
