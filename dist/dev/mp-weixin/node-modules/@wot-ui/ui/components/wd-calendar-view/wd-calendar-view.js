"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (yearPanel + MonthPanel)();
}
const yearPanel = () => "./yearPanel/year-panel.js";
const MonthPanel = () => "./monthPanel/month-panel.js";
const __default__ = {
  name: "wd-calendar-view",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.calendarViewProps,
  emits: ["change", "update:modelValue", "pickstart", "pickend"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formatDefauleTime = common_vendor.ref([]);
    const yearPanelRef = common_vendor.ref();
    const monthPanelRef = common_vendor.ref();
    common_vendor.watch(
      () => props.defaultTime,
      (newValue) => {
        formatDefauleTime.value = common_vendor.getDefaultTime(newValue);
      },
      {
        deep: true,
        immediate: true
      }
    );
    function scrollIntoView() {
      const panel = getPanel();
      panel.scrollIntoView && panel.scrollIntoView();
    }
    function getPanel() {
      return props.type.indexOf("month") > -1 ? yearPanelRef.value : monthPanelRef.value;
    }
    function handleChange({ value }) {
      emit("update:modelValue", value);
      emit("change", {
        value
      });
    }
    function handlePickStart() {
      emit("pickstart");
    }
    function handlePickEnd() {
      emit("pickend");
    }
    __expose({
      scrollIntoView
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.type === "month" || _ctx.type === "monthrange"
      }, _ctx.type === "month" || _ctx.type === "monthrange" ? {
        b: common_vendor.sr(yearPanelRef, "699e873c-0", {
          "k": "yearPanelRef"
        }),
        c: common_vendor.o(handleChange, "12"),
        d: common_vendor.p({
          type: _ctx.type,
          value: _ctx.modelValue,
          ["min-date"]: _ctx.minDate,
          ["max-date"]: _ctx.maxDate,
          formatter: _ctx.formatter,
          ["max-range"]: _ctx.maxRange,
          ["range-prompt"]: _ctx.rangePrompt,
          ["allow-same-day"]: _ctx.allowSameDay,
          ["show-panel-title"]: _ctx.showPanelTitle,
          ["default-time"]: formatDefauleTime.value,
          ["panel-height"]: _ctx.panelHeight,
          ["switch-mode"]: _ctx.switchMode
        })
      } : {
        e: common_vendor.sr(monthPanelRef, "699e873c-1", {
          "k": "monthPanelRef"
        }),
        f: common_vendor.o(handleChange, "18"),
        g: common_vendor.o(handlePickStart, "b7"),
        h: common_vendor.o(handlePickEnd, "b3"),
        i: common_vendor.p({
          type: _ctx.type,
          value: _ctx.modelValue,
          ["min-date"]: _ctx.minDate,
          ["max-date"]: _ctx.maxDate,
          ["first-day-of-week"]: _ctx.firstDayOfWeek,
          formatter: _ctx.formatter,
          ["max-range"]: _ctx.maxRange,
          ["range-prompt"]: _ctx.rangePrompt,
          ["allow-same-day"]: _ctx.allowSameDay,
          ["show-panel-title"]: _ctx.showPanelTitle,
          ["default-time"]: formatDefauleTime.value,
          ["panel-height"]: _ctx.panelHeight,
          ["immediate-change"]: _ctx.immediateChange,
          ["time-filter"]: _ctx.timeFilter,
          ["hide-second"]: _ctx.hideSecond,
          ["item-height"]: _ctx.timeItemHeight,
          ["visible-item-count"]: _ctx.timeVisibleItemCount,
          ["switch-mode"]: _ctx.switchMode
        })
      }, {
        j: common_vendor.n(`wd-calendar-view ${_ctx.customClass}`)
      });
    };
  }
});
wx.createComponent(_sfc_main);
