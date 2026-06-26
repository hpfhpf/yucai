"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdDatetimePickerView + wdPopup)();
}
const wdPopup = () => "../wd-popup/wd-popup.js";
const wdDatetimePickerView = () => "../wd-datetime-picker-view/wd-datetime-picker-view.js";
const __default__ = {
  name: "wd-datetime-picker",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.datetimePickerProps,
  emits: ["change", "open", "toggle", "cancel", "confirm", "update:modelValue", "update:visible"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("datetime-picker");
    const popupShow = common_vendor.ref(false);
    const showStart = common_vendor.ref(true);
    const region = common_vendor.ref(false);
    const innerValue = common_vendor.ref("");
    const endInnerValue = common_vendor.ref("");
    const showTabLabel = common_vendor.computed(() => {
      if (region.value) {
        const items = innerValue.value && getPickerSelectedItems("before") || [];
        const endItems = endInnerValue.value && getPickerSelectedItems("after") || [];
        return [defaultDisplayFormat(items, true), defaultDisplayFormat(endItems, true)];
      }
      return [];
    });
    const isPicking = common_vendor.ref(false);
    const hasConfirmed = common_vendor.ref(false);
    const { proxy } = common_vendor.getCurrentInstance();
    common_vendor.watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (common_vendor.isEqual(val, oldVal))
          return;
        resetInnerValue();
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
    function resetInnerValue() {
      const { modelValue } = props;
      if (common_vendor.isArray(modelValue)) {
        region.value = true;
        innerValue.value = common_vendor.deepClone(getDefaultInnerValue(true));
        endInnerValue.value = common_vendor.deepClone(getDefaultInnerValue(true, true));
      } else {
        innerValue.value = common_vendor.deepClone(getDefaultInnerValue());
      }
    }
    function isOutOfBoundary(isStart, columnType, value, currentArray, boundary) {
      const { type, useSecond } = props;
      const typeColumns = {
        datetime: useSecond ? ["year", "month", "date", "hour", "minute", "second"] : ["year", "month", "date", "hour", "minute"],
        "year-month": ["year", "month"],
        year: ["year"],
        date: ["year", "month", "date"],
        time: useSecond ? ["hour", "minute", "second"] : ["hour", "minute"]
      };
      const columns = typeColumns[type];
      const columnIndex = columns.indexOf(columnType);
      if (columnIndex === -1)
        return false;
      const isPreColumnsBoundary = columns.slice(0, columnIndex).every((col, index) => {
        return currentArray[index] === boundary[index];
      });
      if (isPreColumnsBoundary) {
        const boundaryValue = boundary[columnIndex];
        return isStart ? value > boundaryValue : value < boundaryValue;
      }
      return false;
    }
    function startColumnFormatter(columns) {
      return customColumnFormatter(columns, "start");
    }
    function endColumnFormatter(columns) {
      return customColumnFormatter(columns, "end");
    }
    const customColumnFormatter = (columns, pickerType) => {
      const { type } = props;
      const startSymbol = pickerType === "start";
      const start = innerValue.value;
      const end = endInnerValue.value;
      const currentValue = startSymbol ? common_vendor.getPickerValue(start, type, props.useSecond) : common_vendor.getPickerValue(end, type, props.useSecond);
      const boundary = startSymbol ? common_vendor.getPickerValue(end, type, props.useSecond) : common_vendor.getPickerValue(start, type, props.useSecond);
      const typeColumns = {
        datetime: props.useSecond ? ["year", "month", "date", "hour", "minute", "second"] : ["year", "month", "date", "hour", "minute"],
        "year-month": ["year", "month"],
        year: ["year"],
        date: ["year", "month", "date"],
        time: props.useSecond ? ["hour", "minute", "second"] : ["hour", "minute"]
      };
      const currentColumnTypes = typeColumns[type];
      return columns.map((column, index) => {
        const columnType = currentColumnTypes[index];
        return column.map((option) => {
          const disabled = isOutOfBoundary(startSymbol, columnType, option.value, currentValue, boundary);
          return {
            ...option,
            disabled
          };
        });
      });
    };
    common_vendor.onMounted(() => {
      if (props.visible) {
        showPopup();
      }
    });
    function getPickerSelectedItems(picker) {
      let value = picker === "before" ? innerValue.value : endInnerValue.value;
      let selected = [];
      if (value) {
        selected = common_vendor.getPickerValue(value, props.type, props.useSecond);
      }
      const typeColumns = {
        datetime: props.useSecond ? ["year", "month", "date", "hour", "minute", "second"] : ["year", "month", "date", "hour", "minute"],
        "year-month": ["year", "month"],
        year: ["year"],
        date: ["year", "month", "date"],
        time: props.useSecond ? ["hour", "minute", "second"] : ["hour", "minute"]
      };
      const currentColumnTypes = typeColumns[props.type];
      let selects = selected.map((value2, index) => {
        const type = currentColumnTypes[index];
        return {
          [props.labelKey]: props.formatter ? props.formatter(type, common_vendor.padZero(value2)) : common_vendor.padZero(value2),
          [props.valueKey]: value2
        };
      });
      return selects;
    }
    function noop() {
    }
    function getDefaultInnerValue(isRegion, isEnd) {
      const { modelValue: value, maxDate, minDate, type } = props;
      if (isRegion) {
        const index = isEnd ? 1 : 0;
        const targetValue = common_vendor.isArray(value) ? value[index] : "";
        const maxValue = type === "time" ? common_vendor.formatDate(maxDate, "HH:mm") : maxDate;
        const minValue = type === "time" ? common_vendor.formatDate(minDate, "HH:mm") : minDate;
        return targetValue || (isEnd ? maxValue : minValue);
      } else {
        return common_vendor.isDef(value) ? value : "";
      }
    }
    function open() {
      showPopup();
    }
    function close() {
      onCancel();
    }
    function showPopup() {
      if (popupShow.value)
        return;
      emit("open");
      resetInnerValue();
      popupShow.value = true;
      showStart.value = true;
    }
    function onTabChange(tab) {
      const isStart = tab === "start";
      if (showStart.value === isStart)
        return;
      showStart.value = isStart;
      emit("toggle", showStart.value ? innerValue.value : endInnerValue.value);
    }
    function onChangeStart({ value, columns }) {
      if (region.value) {
        const currentArray = common_vendor.getPickerValue(value, props.type, props.useSecond);
        const boundaryArray = common_vendor.getPickerValue(endInnerValue.value, props.type, props.useSecond);
        const needsAdjust = columns.some((column, index) => {
          return isOutOfBoundary(true, column.type, currentArray[index], currentArray, boundaryArray);
        });
        innerValue.value = common_vendor.deepClone(needsAdjust ? endInnerValue.value : value);
        common_vendor.nextTick$1(() => {
          emit("change", {
            value: [innerValue.value, endInnerValue.value]
          });
        });
      } else {
        innerValue.value = common_vendor.deepClone(value);
        emit("change", {
          value: innerValue.value
        });
      }
    }
    function onChangeEnd({ value, columns }) {
      const currentArray = common_vendor.getPickerValue(value, props.type, props.useSecond);
      const boundaryArray = common_vendor.getPickerValue(innerValue.value, props.type, props.useSecond);
      const needsAdjust = columns.some((column, index) => {
        return isOutOfBoundary(false, column.type, currentArray[index], currentArray, boundaryArray);
      });
      endInnerValue.value = common_vendor.deepClone(needsAdjust ? innerValue.value : value);
      common_vendor.nextTick$1(() => {
        emit("change", {
          value: [innerValue.value, endInnerValue.value]
        });
      });
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
        args: [region.value ? [innerValue.value, endInnerValue.value] : innerValue.value],
        done: () => {
          handleConfirm();
        }
      });
    }
    function onPickStart() {
      isPicking.value = true;
    }
    function onPickEnd() {
      isPicking.value = false;
      setTimeout(() => {
        if (hasConfirmed.value) {
          hasConfirmed.value = false;
          onConfirm();
        }
      }, 50);
    }
    function handleConfirm() {
      const value = region.value ? [innerValue.value, endInnerValue.value] : innerValue.value;
      popupShow.value = false;
      emit("update:modelValue", value);
      emit("confirm", {
        value
      });
    }
    function defaultDisplayFormat(items, tabLabel = false) {
      if (items.length === 0)
        return "";
      if (tabLabel && props.displayFormatTabLabel) {
        return props.displayFormatTabLabel(items);
      }
      switch (props.type) {
        case "year":
          return items[0].label;
        case "date":
          return `${items[0].label}-${items[1].label}-${items[2].label}`;
        case "year-month":
          return `${items[0].label}-${items[1].label}`;
        case "time":
          return props.useSecond ? `${items[0].label}:${items[1].label}:${items[2].label}` : `${items[0].label}:${items[1].label}`;
        case "datetime":
          return props.useSecond ? `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}:${items[5].label}` : `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}`;
      }
    }
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.cancelButtonText || common_vendor.unref(translate)("cancel")),
        b: common_vendor.o(onCancel, "49"),
        c: _ctx.title
      }, _ctx.title ? {
        d: common_vendor.t(_ctx.title)
      } : {}, {
        e: common_vendor.t(_ctx.confirmButtonText || common_vendor.unref(translate)("confirm")),
        f: common_vendor.o(onConfirm, "b3"),
        g: common_vendor.o(noop, "c5"),
        h: region.value
      }, region.value ? {
        i: common_vendor.t(showTabLabel.value[0] || common_vendor.unref(translate)("start")),
        j: common_vendor.n(`wd-datetime-picker__range-item ${showStart.value ? "is-active" : ""}`),
        k: common_vendor.o(($event) => onTabChange("start"), "cb"),
        l: common_vendor.t(showTabLabel.value[1] || common_vendor.unref(translate)("end")),
        m: common_vendor.n(`wd-datetime-picker__range-item ${!showStart.value ? "is-active" : ""}`),
        n: common_vendor.o(($event) => onTabChange("end"), "35")
      } : {}, {
        o: common_vendor.o(onChangeStart, "ae"),
        p: common_vendor.o(onPickStart, "89"),
        q: common_vendor.o(onPickEnd, "64"),
        r: common_vendor.o(($event) => innerValue.value = $event, "81"),
        s: common_vendor.p({
          ["custom-class"]: _ctx.customViewClass,
          type: _ctx.type,
          ["item-height"]: _ctx.itemHeight,
          ["visible-item-count"]: _ctx.visibleItemCount,
          ["value-key"]: _ctx.valueKey,
          ["label-key"]: _ctx.labelKey,
          formatter: _ctx.formatter,
          filter: _ctx.filter,
          ["column-formatter"]: common_vendor.unref(common_vendor.isArray)(_ctx.modelValue) ? startColumnFormatter : void 0,
          ["max-hour"]: _ctx.maxHour,
          ["min-hour"]: _ctx.minHour,
          ["max-date"]: _ctx.maxDate,
          ["min-date"]: _ctx.minDate,
          ["max-minute"]: _ctx.maxMinute,
          ["min-minute"]: _ctx.minMinute,
          ["use-second"]: _ctx.useSecond,
          ["min-second"]: _ctx.minSecond,
          ["max-second"]: _ctx.maxSecond,
          ["immediate-change"]: _ctx.immediateChange,
          modelValue: innerValue.value
        }),
        t: common_vendor.n(showStart.value ? "wd-datetime-picker__show" : "wd-datetime-picker__hidden"),
        v: common_vendor.o(onChangeEnd, "53"),
        w: common_vendor.o(onPickStart, "64"),
        x: common_vendor.o(onPickEnd, "2e"),
        y: common_vendor.o(($event) => endInnerValue.value = $event, "94"),
        z: common_vendor.p({
          ["custom-class"]: _ctx.customViewClass,
          type: _ctx.type,
          ["item-height"]: _ctx.itemHeight,
          ["visible-item-count"]: _ctx.visibleItemCount,
          ["value-key"]: _ctx.valueKey,
          ["label-key"]: _ctx.labelKey,
          formatter: _ctx.formatter,
          filter: _ctx.filter,
          ["column-formatter"]: common_vendor.unref(common_vendor.isArray)(_ctx.modelValue) ? endColumnFormatter : void 0,
          ["max-hour"]: _ctx.maxHour,
          ["min-hour"]: _ctx.minHour,
          ["max-date"]: _ctx.maxDate,
          ["min-date"]: _ctx.minDate,
          ["max-minute"]: _ctx.maxMinute,
          ["min-minute"]: _ctx.minMinute,
          ["use-second"]: _ctx.useSecond,
          ["min-second"]: _ctx.minSecond,
          ["max-second"]: _ctx.maxSecond,
          ["immediate-change"]: _ctx.immediateChange,
          modelValue: endInnerValue.value
        }),
        A: common_vendor.n(showStart.value ? "wd-datetime-picker__hidden" : "wd-datetime-picker__show"),
        B: common_vendor.o(onCancel, "40"),
        C: common_vendor.o(($event) => popupShow.value = $event, "f3"),
        D: common_vendor.p({
          position: "bottom",
          ["hide-when-close"]: false,
          ["close-on-click-modal"]: _ctx.closeOnClickModal,
          ["safe-area-inset-bottom"]: _ctx.safeAreaInsetBottom,
          ["z-index"]: _ctx.zIndex,
          ["root-portal"]: _ctx.rootPortal,
          ["custom-class"]: "wd-datetime-picker__popup",
          modelValue: popupShow.value
        }),
        E: common_vendor.n(`wd-datetime-picker ${_ctx.customClass}`),
        F: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
