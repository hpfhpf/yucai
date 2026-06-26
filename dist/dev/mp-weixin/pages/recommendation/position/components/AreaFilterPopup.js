"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AreaFilterPopup",
  props: {
    modelValue: { type: Boolean },
    options: {},
    top: { default: 0 },
    zIndex: { default: 2e3 },
    leftValue: { default: void 0 },
    rightValue: { default: void 0 },
    autoClose: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "update:leftValue", "update:rightValue", "close", "change", "confirm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const shown = common_vendor.ref(false);
    const visible = common_vendor.ref(false);
    let closeTimer = null;
    const localLeftValue = common_vendor.ref("");
    const localRightValue = common_vendor.ref("");
    const ensureDefaultSelection = () => {
      var _a, _b, _c;
      const leftFallback = ((_a = props.options[0]) == null ? void 0 : _a.value) || "";
      if (!localLeftValue.value)
        localLeftValue.value = leftFallback;
      if (props.options.length > 0 && !props.options.some((x) => x.value === localLeftValue.value)) {
        localLeftValue.value = leftFallback;
      }
      const children = ((_b = props.options.find((x) => x.value === localLeftValue.value)) == null ? void 0 : _b.children) || [];
      const rightFallback = ((_c = children[0]) == null ? void 0 : _c.value) || "";
      if (!localRightValue.value)
        localRightValue.value = rightFallback;
      if (children.length > 0 && !children.some((x) => x.value === localRightValue.value)) {
        localRightValue.value = rightFallback;
      }
    };
    common_vendor.watch(
      () => props.options,
      () => {
        ensureDefaultSelection();
      },
      { immediate: true, deep: true }
    );
    common_vendor.watch(
      () => props.leftValue,
      (v) => {
        if (typeof v === "string")
          localLeftValue.value = v;
        ensureDefaultSelection();
      },
      { immediate: true }
    );
    common_vendor.watch(
      () => props.rightValue,
      (v) => {
        if (typeof v === "string")
          localRightValue.value = v;
        ensureDefaultSelection();
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
          ensureDefaultSelection();
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
    const rightOptions = common_vendor.computed(() => {
      var _a;
      return ((_a = props.options.find((x) => x.value === localLeftValue.value)) == null ? void 0 : _a.children) || [];
    });
    const getLabel = (list, value) => {
      var _a;
      return ((_a = list.find((x) => x.value === value)) == null ? void 0 : _a.label) || "";
    };
    const requestClose = (reason) => {
      emit("update:modelValue", false);
      emit("close", { reason });
    };
    const handleMaskClick = () => requestClose("mask");
    const selectLeft = (value) => {
      var _a, _b;
      if (value === localLeftValue.value)
        return;
      localLeftValue.value = value;
      emit("update:leftValue", value);
      const children = ((_a = props.options.find((x) => x.value === value)) == null ? void 0 : _a.children) || [];
      const nextRight = ((_b = children[0]) == null ? void 0 : _b.value) || "";
      if (nextRight && nextRight !== localRightValue.value) {
        localRightValue.value = nextRight;
        emit("update:rightValue", nextRight);
      }
      emit("change", { leftValue: localLeftValue.value, rightValue: localRightValue.value });
    };
    const selectRight = (value) => {
      if (value === localRightValue.value) {
        if (props.autoClose)
          requestClose("api");
        return;
      }
      localRightValue.value = value;
      emit("update:rightValue", value);
      emit("change", { leftValue: localLeftValue.value, rightValue: localRightValue.value });
      const leftLabel = getLabel(props.options, localLeftValue.value);
      const rightLabel = getLabel(rightOptions.value, localRightValue.value);
      emit("confirm", { leftValue: localLeftValue.value, rightValue: localRightValue.value, leftLabel, rightLabel });
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
            b: opt.value,
            c: opt.value === localLeftValue.value ? 1 : "",
            d: common_vendor.o(($event) => selectLeft(opt.value), opt.value)
          };
        }),
        e: common_vendor.f(rightOptions.value, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.label),
            b: opt.value === localRightValue.value ? 1 : "",
            c: opt.value,
            d: common_vendor.o(($event) => selectRight(opt.value), opt.value)
          };
        }),
        f: visible.value ? 1 : "",
        g: common_vendor.o(() => {
        }, "e3"),
        h: topStyle.value,
        i: `${_ctx.zIndex}`
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a304d8c9"]]);
wx.createComponent(Component);
