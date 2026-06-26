"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SalaryFilterPopup",
  props: {
    modelValue: { type: Boolean },
    options: {},
    selected: { default: void 0 },
    columns: { default: 4 },
    top: { default: 0 },
    zIndex: { default: 2e3 },
    autoClose: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "update:selected", "close", "change", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const shown = common_vendor.ref(false);
    const visible = common_vendor.ref(false);
    let closeTimer = null;
    const localSelected = common_vendor.ref("");
    common_vendor.watch(
      () => props.selected,
      (v) => {
        if (typeof v === "string")
          localSelected.value = v;
      },
      { immediate: true }
    );
    common_vendor.watch(
      () => props.modelValue,
      async (open) => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        if (open) {
          shown.value = true;
          await common_vendor.nextTick$1();
          visible.value = true;
          return;
        }
        visible.value = false;
        closeTimer = setTimeout(() => {
          shown.value = false;
          closeTimer = null;
        }, 180);
      },
      { immediate: true }
    );
    const topStyle = common_vendor.computed(() => {
      if (typeof props.top === "number")
        return `${props.top}px`;
      return props.top || "0px";
    });
    const requestClose = (reason) => {
      emit("update:modelValue", false);
      emit("close", { reason });
    };
    const handleMaskClick = () => requestClose("mask");
    const select = (opt) => {
      if (opt.value !== localSelected.value) {
        localSelected.value = opt.value;
        emit("update:selected", opt.value);
        emit("change", { value: opt.value, label: opt.label });
      }
      emit("confirm", { value: opt.value, label: opt.label });
      if (props.autoClose)
        requestClose("api");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: shown.value
      }, shown.value ? {
        b: visible.value ? 1 : "",
        c: common_vendor.o(handleMaskClick, "d6"),
        d: common_vendor.f(_ctx.options, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.label),
            b: opt.value === localSelected.value ? 1 : "",
            c: opt.value,
            d: common_vendor.o(($event) => select(opt), opt.value)
          };
        }),
        e: `repeat(${_ctx.columns}, 1fr)`,
        f: visible.value ? 1 : "",
        g: common_vendor.o(() => {
        }, "e3"),
        h: topStyle.value,
        i: `${_ctx.zIndex}`
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d220805f"]]);
wx.createComponent(Component);
