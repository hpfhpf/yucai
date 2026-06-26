"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdIcon + wdLoading + wdPopup)();
}
const wdPopup = () => "../wd-popup/wd-popup.js";
const wdIcon = () => "../wd-icon/wd-icon.js";
const wdLoading = () => "../wd-loading/wd-loading.js";
const __default__ = {
  name: "wd-action-sheet",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.actionSheetProps,
  emits: ["select", "click-modal", "cancel", "leave", "after-leave", "close", "enter", "after-enter", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formatPanels = common_vendor.ref([]);
    const showPopup = common_vendor.ref(false);
    common_vendor.watch(() => props.panels, computedValue, { deep: true, immediate: true });
    common_vendor.watch(
      () => props.modelValue,
      (newValue) => {
        showPopup.value = newValue;
      },
      { deep: true, immediate: true }
    );
    function isPanelArray() {
      return props.panels.length && !common_vendor.isArray(props.panels[0]);
    }
    function computedValue() {
      formatPanels.value = isPanelArray() ? [props.panels] : props.panels;
    }
    function select(rowIndex, type, colIndex) {
      if (type === "action") {
        if (props.actions[rowIndex].disabled || props.actions[rowIndex].loading) {
          return;
        }
        emit("select", {
          item: props.actions[rowIndex],
          index: rowIndex
        });
      } else if (isPanelArray()) {
        emit("select", {
          item: props.panels[Number(colIndex)],
          index: colIndex
        });
      } else {
        emit("select", {
          item: props.panels[rowIndex][Number(colIndex)],
          rowIndex,
          colIndex
        });
      }
      if (props.closeOnClickAction) {
        emit("update:modelValue", false);
      }
    }
    function handleClickModal() {
      emit("click-modal");
    }
    function handleCancel() {
      emit("cancel");
      emit("update:modelValue", false);
    }
    function close() {
      emit("update:modelValue", false);
      emit("close");
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.title
      }, _ctx.title ? {
        b: common_vendor.t(_ctx.title),
        c: common_vendor.o(close, "50"),
        d: common_vendor.p({
          ["custom-class"]: "wd-action-sheet__close",
          name: "close"
        }),
        e: common_vendor.r("close", {
          close
        }),
        f: common_vendor.n(`wd-action-sheet__title ${_ctx.customTitleClass}`)
      } : {}, {
        g: _ctx.actions && _ctx.actions.length
      }, _ctx.actions && _ctx.actions.length ? {
        h: common_vendor.f(_ctx.actions, (action, rowIndex, i0) => {
          return common_vendor.e({
            a: action.loading
          }, action.loading ? {
            b: "0b006d18-2-" + i0 + ",0b006d18-0",
            c: common_vendor.p({
              ["custom-class"]: "`wd-action-sheet__action-loading"
            })
          } : {
            d: common_vendor.t(action.name)
          }, {
            e: !action.loading && action.description
          }, !action.loading && action.description ? {
            f: common_vendor.t(action.description)
          } : {}, {
            g: rowIndex,
            h: common_vendor.n(`wd-action-sheet__action ${_ctx.title ? "" : "is-border"} ${action.disabled ? "wd-action-sheet__action--disabled" : ""}  ${action.loading ? "wd-action-sheet__action--loading" : ""}`),
            i: common_vendor.s(`color: ${action.color}`),
            j: common_vendor.o(($event) => select(rowIndex, "action"), rowIndex)
          });
        })
      } : {}, {
        i: common_vendor.unref(common_vendor.isArray)(formatPanels.value) && formatPanels.value.length
      }, common_vendor.unref(common_vendor.isArray)(formatPanels.value) && formatPanels.value.length ? {
        j: common_vendor.f(formatPanels.value, (panel, rowIndex, i0) => {
          return {
            a: common_vendor.f(panel, (col, colIndex, i1) => {
              return {
                a: "0b006d18-3-" + i0 + "-" + i1 + ",0b006d18-0",
                b: common_vendor.p({
                  ["custom-class"]: "wd-action-sheet__panel-img",
                  name: col.icon
                }),
                c: common_vendor.t(col.title),
                d: colIndex,
                e: common_vendor.o(($event) => select(rowIndex, "panels", colIndex), colIndex)
              };
            }),
            b: rowIndex
          };
        })
      } : {}, {
        k: _ctx.cancelText
      }, _ctx.cancelText ? {} : {}, {
        l: _ctx.cancelText
      }, _ctx.cancelText ? {
        m: common_vendor.t(_ctx.cancelText),
        n: common_vendor.o(handleCancel, "80")
      } : {}, {
        o: common_vendor.n(`wd-action-sheet ${_ctx.customClass}`),
        p: common_vendor.s(`${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? " " : ""} ${_ctx.customStyle}`),
        q: common_vendor.o(close, "14"),
        r: common_vendor.o(($event) => emit("enter"), "0c"),
        s: common_vendor.o(($event) => emit("after-enter"), "9a"),
        t: common_vendor.o(($event) => emit("leave"), "ee"),
        v: common_vendor.o(($event) => emit("after-leave"), "fe"),
        w: common_vendor.o(handleClickModal, "47"),
        x: common_vendor.o(($event) => showPopup.value = $event, "11"),
        y: common_vendor.p({
          ["custom-class"]: "wd-action-sheet-wrapper__popup",
          ["custom-style"]: `${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? "background: transparent;" : ""}`,
          duration: _ctx.duration,
          position: "bottom",
          ["close-on-click-modal"]: _ctx.closeOnClickModal,
          ["safe-area-inset-bottom"]: _ctx.safeAreaInsetBottom,
          ["lazy-render"]: _ctx.lazyRender,
          ["root-portal"]: _ctx.rootPortal,
          round: true,
          ["z-index"]: _ctx.zIndex,
          modelValue: showPopup.value
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
