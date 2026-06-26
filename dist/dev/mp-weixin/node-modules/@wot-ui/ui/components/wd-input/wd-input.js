"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-input",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.inputProps,
  emits: [
    "update:modelValue",
    "clear",
    "blur",
    "focus",
    "input",
    "keyboardheightchange",
    "confirm",
    "clicksuffixicon",
    "clickprefixicon",
    "click"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("input");
    const { parent: formItemValidate } = common_vendor.useParent(common_vendor.FORM_ITEM_VALIDATE_KEY);
    const isPwdVisible = common_vendor.ref(false);
    const clearing = common_vendor.ref(false);
    const focused = common_vendor.ref(false);
    const focusing = common_vendor.ref(false);
    const inputValue = common_vendor.ref(getInitValue());
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
      }
    );
    const placeholderValue = common_vendor.computed(() => {
      return common_vendor.isDef(props.placeholder) ? props.placeholder : translate("placeholder");
    });
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
      return `wd-input ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""}  ${isCompact.value ? "is-compact" : ""} ${props.customClass}`;
    });
    const inputPlaceholderClass = common_vendor.computed(() => {
      return `wd-input__placeholder  ${props.placeholderClass}`;
    });
    const isCompact = common_vendor.computed(() => {
      return common_vendor.isDef(props.compact) ? props.compact : common_vendor.isDef(formItemValidate.value);
    });
    function getInitValue() {
      const formatted = formatValue(props.modelValue);
      if (!isValueEqual(formatted, props.modelValue)) {
        emit("update:modelValue", formatted);
      }
      return formatted;
    }
    function formatValue(value) {
      const { maxlength } = props;
      if (common_vendor.isDef(maxlength) && maxlength !== -1 && String(value).length > maxlength) {
        return value.toString().slice(0, maxlength);
      }
      return value;
    }
    function togglePwdVisible() {
      isPwdVisible.value = !isPwdVisible.value;
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
    async function handleBlur() {
      var _a;
      await common_vendor.pause(150);
      if (clearing.value) {
        clearing.value = false;
        return;
      }
      focusing.value = false;
      emit("blur", {
        value: inputValue.value
      });
      await ((_a = formItemValidate.value) == null ? void 0 : _a.validateByTrigger("blur"));
    }
    function handleFocus({ detail }) {
      focusing.value = true;
      emit("focus", detail);
    }
    function handleInput({ detail }) {
      emit("update:modelValue", inputValue.value);
      emit("input", detail);
    }
    function handleKeyboardheightchange({ detail }) {
      emit("keyboardheightchange", detail);
    }
    function handleConfirm({ detail }) {
      emit("confirm", detail);
    }
    function onClickSuffixIcon() {
      emit("clicksuffixicon");
    }
    function onClickPrefixIcon() {
      emit("clickprefixicon");
    }
    function handleClick(event) {
      emit("click", event);
    }
    function isValueEqual(value1, value2) {
      return common_vendor.isEqual(String(value1), String(value2));
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.prefixIcon || _ctx.$slots.prefix
      }, _ctx.prefixIcon || _ctx.$slots.prefix ? common_vendor.e({
        b: _ctx.prefixIcon && !_ctx.$slots.prefix
      }, _ctx.prefixIcon && !_ctx.$slots.prefix ? {
        c: common_vendor.o(onClickPrefixIcon, "a8"),
        d: common_vendor.p({
          ["custom-class"]: "wd-input__icon",
          name: _ctx.prefixIcon
        })
      } : {}) : {}, {
        e: common_vendor.n(_ctx.prefixIcon ? "wd-input__inner--prefix" : ""),
        f: common_vendor.n(showWordCount.value ? "wd-input__inner--count" : ""),
        g: common_vendor.n(_ctx.alignRight ? "is-align-right" : ""),
        h: common_vendor.n(_ctx.customInputClass),
        i: _ctx.type,
        j: _ctx.showPassword && !isPwdVisible.value,
        k: placeholderValue.value,
        l: _ctx.disabled || _ctx.readonly,
        m: _ctx.maxlength,
        n: focused.value,
        o: _ctx.confirmType,
        p: _ctx.confirmHold,
        q: _ctx.cursor,
        r: _ctx.cursorSpacing,
        s: _ctx.placeholderStyle,
        t: _ctx.selectionStart,
        v: _ctx.selectionEnd,
        w: _ctx.adjustPosition,
        x: _ctx.holdKeyboard,
        y: _ctx.alwaysEmbed,
        z: inputPlaceholderClass.value,
        A: _ctx.ignoreCompositionEvent,
        B: _ctx.inputmode,
        C: _ctx.enableNative,
        D: common_vendor.o([($event) => inputValue.value = $event.detail.value, handleInput], "c4"),
        E: common_vendor.o(handleFocus, "b6"),
        F: common_vendor.o(handleBlur, "0c"),
        G: common_vendor.o(handleConfirm, "a7"),
        H: common_vendor.o(handleKeyboardheightchange, "a7"),
        I: inputValue.value,
        J: props.readonly
      }, props.readonly ? {} : {}, {
        K: showClear.value || _ctx.showPassword || _ctx.suffixIcon || showWordCount.value || _ctx.$slots.suffix
      }, showClear.value || _ctx.showPassword || _ctx.suffixIcon || showWordCount.value || _ctx.$slots.suffix ? common_vendor.e({
        L: showClear.value
      }, showClear.value ? {
        M: common_vendor.o(handleClear, "86"),
        N: common_vendor.p({
          ["custom-class"]: "wd-input__clear",
          name: "close-circle"
        })
      } : {}, {
        O: _ctx.showPassword
      }, _ctx.showPassword ? {
        P: common_vendor.o(togglePwdVisible, "b4"),
        Q: common_vendor.p({
          ["custom-class"]: "wd-input__icon",
          name: isPwdVisible.value ? "eye" : "eye-invisible"
        })
      } : {}, {
        R: showWordCount.value
      }, showWordCount.value ? {
        S: common_vendor.t(currentLength.value),
        T: common_vendor.t(_ctx.maxlength)
      } : {}, {
        U: _ctx.suffixIcon && !_ctx.$slots.suffix
      }, _ctx.suffixIcon && !_ctx.$slots.suffix ? {
        V: common_vendor.o(onClickSuffixIcon, "40"),
        W: common_vendor.p({
          ["custom-class"]: "wd-input__icon",
          name: _ctx.suffixIcon
        })
      } : {}) : {}, {
        X: common_vendor.n(rootClass.value),
        Y: common_vendor.s(_ctx.customStyle),
        Z: common_vendor.o(handleClick, "d8")
      });
    };
  }
});
wx.createComponent(_sfc_main);
