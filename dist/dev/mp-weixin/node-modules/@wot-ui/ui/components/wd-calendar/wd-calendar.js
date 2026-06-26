"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdTab + wdTabs + wdTag + wdCalendarView + wdButton + wdActionSheet)();
}
const wdCalendarView = () => "../wd-calendar-view/wd-calendar-view.js";
const wdActionSheet = () => "../wd-action-sheet/wd-action-sheet.js";
const wdButton = () => "../wd-button/wd-button.js";
const wdTabs = () => "../wd-tabs/wd-tabs.js";
const wdTab = () => "../wd-tab/wd-tab.js";
const wdTag = () => "../wd-tag/wd-tag.js";
const __default__ = {
  name: "wd-calendar",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.calendarProps,
  emits: ["cancel", "change", "update:modelValue", "confirm", "open", "update:visible"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("calendar");
    const pickerShow = common_vendor.ref(false);
    const calendarValue = common_vendor.ref(null);
    const lastCalendarValue = common_vendor.ref(null);
    const confirmBtnDisabled = common_vendor.ref(true);
    const currentTab = common_vendor.ref(0);
    const lastTab = common_vendor.ref(0);
    const currentType = common_vendor.ref("date");
    const lastCurrentType = common_vendor.ref();
    const inited = common_vendor.ref(false);
    const calendarViewRef = common_vendor.ref();
    const calendarTabs = common_vendor.ref();
    const isConfirming = common_vendor.ref(false);
    const activeShortcutIndex = common_vendor.ref(-1);
    const formatRange = (value, rangeType, type) => {
      switch (type) {
        case "daterange":
          if (!value) {
            return rangeType === "end" ? translate("endTime") : translate("startTime");
          }
          return common_vendor.formatDate(value, translate("dateFormat"));
        case "datetimerange":
          if (!value) {
            return rangeType === "end" ? translate("endTime") : translate("startTime");
          }
          return common_vendor.formatDate(value, translate("timeFormat"));
        case "weekrange": {
          if (!value) {
            return rangeType === "end" ? translate("endWeek") : translate("startWeek");
          }
          const date = new Date(value);
          const year = date.getFullYear();
          const week = common_vendor.getWeekNumber(value);
          return translate("weekFormat", year, common_vendor.padZero(week));
        }
        case "monthrange":
          if (!value) {
            return rangeType === "end" ? translate("endMonth") : translate("startMonth");
          }
          return common_vendor.formatDate(value, translate("monthFormat"));
      }
    };
    const rangeLabel = common_vendor.computed(() => {
      const [start, end] = common_vendor.deepClone(common_vendor.isArray(calendarValue.value) ? calendarValue.value : []);
      return [start, end].map((item, index) => {
        return (props.innerDisplayFormat || formatRange)(item, index === 0 ? "start" : "end", currentType.value);
      });
    });
    common_vendor.watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (common_vendor.isEqual(val, oldVal))
          return;
        calendarValue.value = common_vendor.deepClone(val);
        confirmBtnDisabled.value = getConfirmBtnStatus(val);
      },
      {
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.type,
      (newValue) => {
        if (props.showTypeSwitch) {
          const tabs = ["date", "week", "month"];
          const rangeTabs = ["daterange", "weekrange", "monthrange"];
          const index = newValue.indexOf("range") > -1 ? rangeTabs.indexOf(newValue) || 0 : tabs.indexOf(newValue);
          currentTab.value = index;
        }
        currentType.value = common_vendor.deepClone(newValue);
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.visible,
      (val) => {
        pickerShow.value = val;
      },
      {
        immediate: true
      }
    );
    function handleOpened() {
      if (props.showTypeSwitch) {
        calendarTabs.value && calendarTabs.value.scrollIntoView();
        calendarTabs.value && calendarTabs.value.updateLineStyle(false);
      }
    }
    function handleClosed() {
      if (isConfirming.value) {
        isConfirming.value = false;
      } else {
        calendarValue.value = common_vendor.deepClone(lastCalendarValue.value);
        currentTab.value = lastTab.value;
        currentType.value = lastCurrentType.value || "date";
        confirmBtnDisabled.value = getConfirmBtnStatus(lastCalendarValue.value);
      }
    }
    common_vendor.watch(pickerShow, async (val) => {
      emit("update:visible", val);
      if (val) {
        inited.value = true;
        lastCalendarValue.value = common_vendor.deepClone(calendarValue.value);
        lastTab.value = currentTab.value;
        lastCurrentType.value = currentType.value;
        await common_vendor.pause();
        scrollIntoView();
        emit("open");
      } else {
        if (!isConfirming.value) {
          emit("cancel");
        }
      }
    });
    function scrollIntoView() {
      calendarViewRef.value && calendarViewRef.value.scrollIntoView();
    }
    function open() {
      pickerShow.value = true;
    }
    function close() {
      pickerShow.value = false;
    }
    function handleTypeChange({ index }) {
      const tabs = ["date", "week", "month"];
      const rangeTabs = ["daterange", "weekrange", "monthrange"];
      const type = props.type.indexOf("range") > -1 ? rangeTabs[index] : tabs[index];
      currentTab.value = index;
      currentType.value = type;
    }
    function getConfirmBtnStatus(value) {
      let confirmBtnDisabled2 = false;
      if (props.type.indexOf("range") > -1 && (!common_vendor.isArray(value) || !value[0] || !value[1] || !value) || props.type === "dates" && (!common_vendor.isArray(value) || value.length === 0 || !value) || !value) {
        confirmBtnDisabled2 = true;
      }
      return confirmBtnDisabled2;
    }
    function handleChange({ value }) {
      calendarValue.value = common_vendor.deepClone(value);
      confirmBtnDisabled.value = getConfirmBtnStatus(value);
      activeShortcutIndex.value = -1;
      emit("change", {
        value
      });
      if (!props.showConfirm && !confirmBtnDisabled.value) {
        handleConfirm();
      }
    }
    function handleConfirm() {
      common_vendor.callInterceptor(props.beforeConfirm, {
        args: [calendarValue.value],
        done: onConfirm
      });
    }
    function onConfirm() {
      isConfirming.value = true;
      pickerShow.value = false;
      lastCurrentType.value = currentType.value;
      emit("update:modelValue", calendarValue.value);
      emit("confirm", {
        value: calendarValue.value,
        type: currentType.value
      });
    }
    function handleShortcutClick(index) {
      activeShortcutIndex.value = index;
      if (props.onShortcutsClick && typeof props.onShortcutsClick === "function") {
        calendarValue.value = common_vendor.deepClone(
          props.onShortcutsClick({
            item: props.shortcuts[index],
            index
          })
        );
        confirmBtnDisabled.value = getConfirmBtnStatus(calendarValue.value);
      }
      if (!props.showConfirm) {
        handleConfirm();
      }
    }
    __expose({
      close,
      open
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.showTypeSwitch
      }, _ctx.showTypeSwitch ? {
        b: common_vendor.p({
          title: common_vendor.unref(translate)("day"),
          name: common_vendor.unref(translate)("day")
        }),
        c: common_vendor.p({
          title: common_vendor.unref(translate)("week"),
          name: common_vendor.unref(translate)("week")
        }),
        d: common_vendor.p({
          title: common_vendor.unref(translate)("month"),
          name: common_vendor.unref(translate)("month")
        }),
        e: common_vendor.sr(calendarTabs, "2ada4b40-1,2ada4b40-0", {
          "k": "calendarTabs"
        }),
        f: common_vendor.o(handleTypeChange, "b6"),
        g: common_vendor.o(($event) => currentTab.value = $event, "1c"),
        h: common_vendor.p({
          modelValue: currentTab.value
        })
      } : {}, {
        i: _ctx.shortcuts.length > 0
      }, _ctx.shortcuts.length > 0 ? {
        j: common_vendor.f(_ctx.shortcuts, (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: index,
            c: common_vendor.o(($event) => handleShortcutClick(index), index),
            d: "2ada4b40-5-" + i0 + ",2ada4b40-0",
            e: common_vendor.p({
              ["custom-class"]: `wd-calendar__tag ${index === _ctx.shortcuts.length - 1 ? "is-last-tag" : ""}`,
              type: activeShortcutIndex.value === index ? "primary" : "default",
              variant: activeShortcutIndex.value === index ? "dark" : "light"
            })
          };
        })
      } : {}, {
        k: inited.value
      }, inited.value ? common_vendor.e({
        l: common_vendor.unref(common_vendor.isRange)(currentType.value)
      }, common_vendor.unref(common_vendor.isRange)(currentType.value) ? {
        m: common_vendor.t(rangeLabel.value[0]),
        n: common_vendor.n(`wd-calendar__range-item ${!calendarValue.value || !common_vendor.unref(common_vendor.isArray)(calendarValue.value) || !calendarValue.value[0] ? "is-placeholder" : ""}`),
        o: common_vendor.t(rangeLabel.value[1]),
        p: common_vendor.n(`wd-calendar__range-item ${!calendarValue.value || !common_vendor.unref(common_vendor.isArray)(calendarValue.value) || !calendarValue.value[1] ? "is-placeholder" : ""}`)
      } : {}, {
        q: common_vendor.sr(calendarViewRef, "2ada4b40-6,2ada4b40-0", {
          "k": "calendarViewRef"
        }),
        r: common_vendor.o(handleChange, "22"),
        s: common_vendor.o(($event) => calendarValue.value = $event, "5f"),
        t: common_vendor.p({
          type: currentType.value,
          ["min-date"]: _ctx.minDate,
          ["max-date"]: _ctx.maxDate,
          ["first-day-of-week"]: _ctx.firstDayOfWeek,
          formatter: _ctx.formatter,
          ["panel-height"]: _ctx.panelHeight,
          ["max-range"]: _ctx.maxRange,
          ["range-prompt"]: _ctx.rangePrompt,
          ["allow-same-day"]: _ctx.allowSameDay,
          ["default-time"]: _ctx.defaultTime,
          ["time-filter"]: _ctx.timeFilter,
          ["hide-second"]: _ctx.hideSecond,
          ["show-panel-title"]: _ctx.showPanelTitle,
          ["immediate-change"]: _ctx.immediateChange,
          ["switch-mode"]: _ctx.switchMode,
          modelValue: calendarValue.value
        }),
        v: common_vendor.n(`wd-calendar__view  ${currentType.value.indexOf("range") > -1 ? "is-range" : ""} ${_ctx.showConfirm ? "is-show-confirm" : ""}`)
      }) : {}, {
        w: _ctx.showConfirm
      }, _ctx.showConfirm ? {
        x: common_vendor.t(_ctx.confirmText || common_vendor.unref(translate)("confirm")),
        y: common_vendor.o(handleConfirm, "65"),
        z: common_vendor.p({
          size: "large",
          block: true,
          disabled: confirmBtnDisabled.value
        })
      } : {}, {
        A: common_vendor.o(close, "53"),
        B: common_vendor.o(handleOpened, "31"),
        C: common_vendor.o(handleClosed, "20"),
        D: common_vendor.o(($event) => pickerShow.value = $event, "d9"),
        E: common_vendor.p({
          duration: _ctx.duration,
          ["close-on-click-modal"]: _ctx.closeOnClickModal,
          ["safe-area-inset-bottom"]: _ctx.safeAreaInsetBottom,
          ["z-index"]: _ctx.zIndex,
          ["root-portal"]: _ctx.rootPortal,
          title: _ctx.title || common_vendor.unref(translate)("title"),
          ["custom-class"]: "wd-calendar__popup",
          modelValue: pickerShow.value
        }),
        F: common_vendor.n(`wd-calendar ${_ctx.customClass}`),
        G: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
