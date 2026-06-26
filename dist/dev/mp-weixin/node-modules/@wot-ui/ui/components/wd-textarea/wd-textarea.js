"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-textarea",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.textareaProps,
  emits: ["update:modelValue", "clear", "blur", "focus", "input", "keyboardheightchange", "confirm", "linechange", "click"],
  setup(__props, { emit: __emit }) {
    const { translate } = common_vendor.useTranslate("textarea");
    const props = __props;
    const emit = __emit;
    const { parent: formItemValidate } = common_vendor.useParent(common_vendor.FORM_ITEM_VALIDATE_KEY);
    const placeholderValue = common_vendor.computed(() => {
      return common_vendor.isDef(props.placeholder) ? props.placeholder : translate("placeholder");
    });
    const clearing = common_vendor.ref(false);
    const focused = common_vendor.ref(false);
    const focusing = common_vendor.ref(false);
    const inputValue = common_vendor.ref("");
    common_vendor.watch(
      () => props.focus,
      (newValue) => {
        focused.value = newValue;
      },
      { immediate: true, deep: true }
    );
    common_vendor.watch(
      () => props.modelValue,
      (newValue) => {
        inputValue.value = common_vendor.isDef(newValue) ? String(newValue) : "";
      },
      { immediate: true, deep: true }
    );
    const showClear = common_vendor.computed(() => {
      const { disabled, readonly, clearable, clearTrigger } = props;
      if (clearable && !readonly && !disabled && inputValue.value && (clearTrigger === "always" || props.clearTrigger === "focus" && focusing.value)) {
        return true;
      } else {
        return false;
      }
    });
    const showWordCount = common_vendor.computed(() => {
      const { disabled, readonly, maxlength, showWordLimit } = props;
      return Boolean(!disabled && !readonly && common_vendor.isDef(maxlength) && maxlength > -1 && showWordLimit);
    });
    const currentLength = common_vendor.computed(() => {
      return Array.from(String(formatValue(props.modelValue))).length;
    });
    const rootClass = common_vendor.computed(() => {
      return `wd-textarea ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""} ${props.autoHeight ? "is-auto-height" : ""} ${isCompact.value ? "is-compact" : ""} ${props.customClass}`;
    });
    const isCompact = common_vendor.computed(() => {
      return common_vendor.isDef(props.compact) ? props.compact : common_vendor.isDef(formItemValidate.value);
    });
    const inputPlaceholderClass = common_vendor.computed(() => {
      return `wd-textarea__placeholder  ${props.placeholderClass}`;
    });
    common_vendor.onBeforeMount(() => {
      initState();
    });
    function initState() {
      inputValue.value = formatValue(inputValue.value);
      emit("update:modelValue", inputValue.value);
    }
    function formatValue(value) {
      if (value === null || value === void 0)
        return "";
      const { maxlength, showWordLimit } = props;
      if (showWordLimit && maxlength !== -1 && String(value).length > maxlength) {
        return value.toString().substring(0, maxlength);
      }
      return `${value}`;
    }
    async function handleClear() {
      focusing.value = false;
      inputValue.value = "";
      if (props.focusWhenClear) {
        clearing.value = true;
        focused.value = false;
      }
      await common_vendor.pause();
      if (props.focusWhenClear) {
        focused.value = true;
        focusing.value = true;
      }
      emit("update:modelValue", inputValue.value);
      emit("clear");
    }
    async function handleBlur({ detail }) {
      var _a;
      await common_vendor.pause(150);
      if (clearing.value) {
        clearing.value = false;
        return;
      }
      focusing.value = false;
      emit("blur", {
        value: inputValue.value,
        cursor: detail.cursor ? detail.cursor : null
      });
      await ((_a = formItemValidate.value) == null ? void 0 : _a.validateByTrigger("blur"));
    }
    function handleFocus({ detail }) {
      focusing.value = true;
      emit("focus", detail);
    }
    function handleInput({ detail }) {
      inputValue.value = formatValue(inputValue.value);
      emit("update:modelValue", inputValue.value);
      emit("input", detail);
    }
    function handleKeyboardheightchange({ detail }) {
      emit("keyboardheightchange", detail);
    }
    function handleConfirm({ detail }) {
      emit("confirm", detail);
    }
    function handleLineChange({ detail }) {
      emit("linechange", detail);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(`wd-textarea__inner ${_ctx.customTextareaClass}`),
        b: placeholderValue.value,
        c: _ctx.disabled || _ctx.readonly,
        d: _ctx.enableNative,
        e: _ctx.maxlength,
        f: focused.value,
        g: _ctx.autoFocus,
        h: _ctx.placeholderStyle,
        i: inputPlaceholderClass.value,
        j: _ctx.autoHeight,
        k: _ctx.cursorSpacing,
        l: _ctx.fixed,
        m: _ctx.cursor,
        n: _ctx.showConfirmBar,
        o: _ctx.selectionStart,
        p: _ctx.selectionEnd,
        q: _ctx.adjustPosition,
        r: _ctx.holdKeyboard,
        s: _ctx.confirmType,
        t: _ctx.confirmHold,
        v: _ctx.disableDefaultPadding,
        w: _ctx.ignoreCompositionEvent,
        x: _ctx.inputmode,
        y: common_vendor.o([($event) => inputValue.value = $event.detail.value, handleInput], "c4"),
        z: common_vendor.o(handleFocus, "9a"),
        A: common_vendor.o(handleBlur, "df"),
        B: common_vendor.o(handleConfirm, "ff"),
        C: common_vendor.o(handleLineChange, "73"),
        D: common_vendor.o(handleKeyboardheightchange, "5d"),
        E: inputValue.value,
        F: props.readonly
      }, props.readonly ? {} : {}, {
        G: showClear.value
      }, showClear.value ? {
        H: common_vendor.o(handleClear, "27"),
        I: common_vendor.p({
          ["custom-class"]: "wd-textarea__clear",
          name: "close-circle"
        })
      } : {}, {
        J: showWordCount.value
      }, showWordCount.value ? {
        K: common_vendor.t(currentLength.value),
        L: common_vendor.t(_ctx.maxlength)
      } : {}, {
        M: common_vendor.n(rootClass.value),
        N: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
