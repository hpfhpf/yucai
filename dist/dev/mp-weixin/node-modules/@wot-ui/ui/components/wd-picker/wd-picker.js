"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdPickerView + wdPopup)();
}
const wdPopup = () => "../wd-popup/wd-popup.js";
const wdPickerView = () => "../wd-picker-view/wd-picker-view.js";
const __default__ = {
  name: "wd-picker",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.pickerProps,
  emits: ["confirm", "open", "cancel", "update:modelValue", "update:visible"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const { translate } = common_vendor.useTranslate("picker");
    const props = __props;
    const emit = __emit;
    const popupShow = common_vendor.ref(false);
    const pickerValue = common_vendor.ref([]);
    const pickerSelectedOptions = common_vendor.ref([]);
    const pickerViewRef = common_vendor.ref();
    const displayColumns = common_vendor.ref([]);
    const isPicking = common_vendor.ref(false);
    const hasConfirmed = common_vendor.ref(false);
    common_vendor.watch(
      () => props.modelValue,
      (newValue) => {
        pickerValue.value = newValue;
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.columns,
      (newValue) => {
        displayColumns.value = common_vendor.deepClone(newValue);
        if (newValue.length === 0) {
          pickerValue.value = [];
        }
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.visible,
      (val) => {
        if (val) {
          showPopup();
        } else {
          popupShow.value = false;
        }
      }
    );
    common_vendor.watch(popupShow, (val) => {
      emit("update:visible", val);
    });
    const { proxy } = common_vendor.getCurrentInstance();
    common_vendor.onMounted(() => {
      if (props.visible) {
        showPopup();
      }
    });
    common_vendor.onBeforeMount(() => {
      displayColumns.value = common_vendor.deepClone(props.columns);
    });
    function open() {
      showPopup();
    }
    function close() {
      onCancel();
    }
    function showPopup() {
      emit("open");
      popupShow.value = true;
      pickerValue.value = props.modelValue;
      displayColumns.value = common_vendor.deepClone(props.columns);
    }
    function onCancel() {
      popupShow.value = false;
      emit("cancel");
    }
    function onConfirm() {
      if (isPicking.value) {
        hasConfirmed.value = true;
        return;
      }
      const { beforeConfirm } = props;
      common_vendor.callInterceptor(beforeConfirm, {
        args: [pickerValue.value],
        done: () => {
          handleConfirm();
        }
      });
    }
    function handleConfirm() {
      var _a, _b;
      const values = ((_a = pickerViewRef.value) == null ? void 0 : _a.getSelectedValues()) || pickerValue.value;
      const selects = ((_b = pickerViewRef.value) == null ? void 0 : _b.getSelectedOptions()) || pickerSelectedOptions.value;
      popupShow.value = false;
      emit("update:modelValue", values);
      emit("confirm", {
        value: values,
        selectedItems: selects
      });
    }
    function pickerViewChange({ selectedValues, selectedOptions }) {
      pickerValue.value = selectedValues;
      pickerSelectedOptions.value = selectedOptions;
    }
    function noop() {
    }
    function onPickStart() {
      isPicking.value = true;
    }
    function onPickEnd() {
      isPicking.value = false;
      if (hasConfirmed.value) {
        hasConfirmed.value = false;
        onConfirm();
      }
    }
    __expose({
      close,
      open
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.cancelButtonText || common_vendor.unref(translate)("cancel")),
        b: common_vendor.o(onCancel, "3c"),
        c: _ctx.title
      }, _ctx.title ? {
        d: common_vendor.t(_ctx.title)
      } : {}, {
        e: common_vendor.t(_ctx.confirmButtonText || common_vendor.unref(translate)("done")),
        f: common_vendor.o(onConfirm, "dd"),
        g: common_vendor.o(noop, "53"),
        h: common_vendor.sr(pickerViewRef, "1b66e640-1,1b66e640-0", {
          "k": "pickerViewRef"
        }),
        i: common_vendor.o(pickerViewChange, "ed"),
        j: common_vendor.o(onPickStart, "8e"),
        k: common_vendor.o(onPickEnd, "97"),
        l: common_vendor.o(($event) => pickerValue.value = $event, "2a"),
        m: common_vendor.p({
          ["custom-class"]: _ctx.customViewClass,
          columns: displayColumns.value,
          ["item-height"]: _ctx.itemHeight,
          ["visible-item-count"]: _ctx.visibleItemCount,
          ["value-key"]: _ctx.valueKey,
          ["label-key"]: _ctx.labelKey,
          cascade: _ctx.cascade,
          ["children-key"]: _ctx.childrenKey,
          ["immediate-change"]: _ctx.immediateChange,
          modelValue: pickerValue.value
        }),
        n: common_vendor.o(onCancel, "37"),
        o: common_vendor.o(($event) => popupShow.value = $event, "89"),
        p: common_vendor.p({
          position: "bottom",
          ["hide-when-close"]: false,
          ["close-on-click-modal"]: _ctx.closeOnClickModal,
          ["z-index"]: _ctx.zIndex,
          ["safe-area-inset-bottom"]: _ctx.safeAreaInsetBottom,
          ["root-portal"]: _ctx.rootPortal,
          ["custom-class"]: "wd-picker__popup",
          modelValue: popupShow.value
        }),
        q: common_vendor.n(`wd-picker ${_ctx.customClass}`),
        r: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
