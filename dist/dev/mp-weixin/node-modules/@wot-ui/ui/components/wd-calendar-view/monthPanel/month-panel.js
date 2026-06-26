"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const __unplugin_components_0 = () => "../../wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  _component_wd_icon();
}
if (!Math) {
  (Month + wdDatetimePickerView)();
}
const wdDatetimePickerView = () => "../../wd-datetime-picker-view/wd-datetime-picker-view.js";
const Month = () => "../month/month.js";
const __default__ = {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "month-panel",
  props: common_vendor.monthPanelProps,
  emits: ["change", "pickstart", "pickend"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("calendar-view");
    const scrollTop = common_vendor.ref(0);
    const scrollIndex = common_vendor.ref(0);
    const timeValue = common_vendor.ref("");
    const currentDisplayMonth = common_vendor.ref({
      year: (/* @__PURE__ */ new Date()).getFullYear(),
      month: (/* @__PURE__ */ new Date()).getMonth()
    });
    const timeType = common_vendor.ref("");
    const innerValue = common_vendor.ref("");
    const handleChange = common_vendor.debounce((value) => {
      emit("change", {
        value
      });
    }, 50);
    const currentMonthDate = common_vendor.computed(() => {
      return new Date(currentDisplayMonth.value.year, currentDisplayMonth.value.month, 1).getTime();
    });
    const controlsTitle = common_vendor.computed(() => {
      return common_vendor.formatMonthTitle(currentMonthDate.value);
    });
    const title = common_vendor.computed(() => {
      return common_vendor.formatMonthTitle(months.value[scrollIndex.value].date);
    });
    function getMonthStart(year, month) {
      return new Date(year, month, 1).getTime();
    }
    const isPrevMonthDisabled = common_vendor.computed(() => {
      const { year, month } = currentDisplayMonth.value;
      const prevMonthStart = getMonthStart(year, month - 1);
      const minMonthStart = getMonthStart(new Date(props.minDate).getFullYear(), new Date(props.minDate).getMonth());
      return prevMonthStart < minMonthStart;
    });
    const isNextMonthDisabled = common_vendor.computed(() => {
      const { year, month } = currentDisplayMonth.value;
      const nextMonthStart = getMonthStart(year, month + 1);
      const maxMonthStart = getMonthStart(new Date(props.maxDate).getFullYear(), new Date(props.maxDate).getMonth());
      return nextMonthStart > maxMonthStart;
    });
    const isPrevYearDisabled = common_vendor.computed(() => {
      const { year, month } = currentDisplayMonth.value;
      const prevYear = year - 1;
      const minYear = new Date(props.minDate).getFullYear();
      const minMonth = new Date(props.minDate).getMonth();
      if (prevYear < minYear) {
        return true;
      }
      if (prevYear === minYear && month < minMonth) {
        return true;
      }
      return false;
    });
    const isNextYearDisabled = common_vendor.computed(() => {
      const { year, month } = currentDisplayMonth.value;
      const nextYear = year + 1;
      const maxYear = new Date(props.maxDate).getFullYear();
      const maxMonth = new Date(props.maxDate).getMonth();
      if (nextYear > maxYear) {
        return true;
      }
      if (nextYear === maxYear && month > maxMonth) {
        return true;
      }
      return false;
    });
    function changeMonth(delta) {
      const { year, month } = currentDisplayMonth.value;
      const newDate = new Date(year, month + delta, 1);
      currentDisplayMonth.value = {
        year: newDate.getFullYear(),
        month: newDate.getMonth()
      };
    }
    function changeYear(delta) {
      const { year, month } = currentDisplayMonth.value;
      const newDate = new Date(year + delta, month, 1);
      currentDisplayMonth.value = {
        year: newDate.getFullYear(),
        month: newDate.getMonth()
      };
    }
    const weekLabel = common_vendor.computed(() => {
      return (index) => {
        return common_vendor.getWeekLabel(index - 1);
      };
    });
    const containerStyle = common_vendor.computed(() => {
      const style = {
        height: timeType.value ? common_vendor.addUnit(props.panelHeight - 120) : common_vendor.addUnit(props.panelHeight)
      };
      return common_vendor.objToStyle(style);
    });
    const months = common_vendor.computed(() => {
      return common_vendor.getMonths(props.minDate, props.maxDate).map((month, index) => {
        const offset = (7 + new Date(month).getDay() - props.firstDayOfWeek) % 7;
        const totalDay = common_vendor.getMonthEndDay(new Date(month).getFullYear(), new Date(month).getMonth() + 1);
        const rows = Math.ceil((offset + totalDay) / 7);
        return {
          height: rows * 60 + (rows - 1) * 4 + (index === 0 ? 0 : 40),
          // 每行60px高度,除最后一行外每行加4px margin,加上标题40px
          date: month
        };
      });
    });
    const displayMonths = common_vendor.computed(() => {
      if (props.switchMode === "none") {
        return months.value;
      }
      const offset = (7 + new Date(currentMonthDate.value).getDay() - props.firstDayOfWeek) % 7;
      const totalDay = common_vendor.getMonthEndDay(currentDisplayMonth.value.year, currentDisplayMonth.value.month + 1);
      const rows = Math.ceil((offset + totalDay) / 7);
      return [
        {
          height: rows * 60 + (rows - 1) * 4,
          date: currentMonthDate.value
        }
      ];
    });
    common_vendor.watch(
      () => props.type,
      (val) => {
        if (val === "datetime" && props.value || val === "datetimerange" && common_vendor.isArray(props.value) && props.value && props.value.length > 0 && props.value[0]) {
          setTime(props.value, "start");
        }
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => props.value,
      (val) => {
        if (common_vendor.isEqual(val, innerValue.value))
          return;
        if (props.type === "datetime" && val || props.type === "datetimerange" && val && common_vendor.isArray(val) && val.length > 0 && val[0]) {
          setTime(val, "start");
        }
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.onMounted(() => {
      if (props.switchMode !== "none") {
        initCurrentDisplayMonth();
      }
      scrollIntoView();
    });
    function initCurrentDisplayMonth() {
      let activeDate = null;
      if (common_vendor.isArray(props.value)) {
        const sortedValue = [...props.value].sort((a, b) => (a || 0) - (b || 0));
        activeDate = sortedValue[0];
      } else if (common_vendor.isNumber(props.value)) {
        activeDate = props.value;
      }
      if (!activeDate) {
        activeDate = Date.now();
      }
      if (activeDate < props.minDate) {
        activeDate = props.minDate;
      } else if (activeDate > props.maxDate) {
        activeDate = props.maxDate;
      }
      const date = new Date(activeDate);
      currentDisplayMonth.value = {
        year: date.getFullYear(),
        month: date.getMonth()
      };
    }
    async function scrollIntoView() {
      await common_vendor.pause();
      let activeDate = 0;
      if (common_vendor.isArray(props.value)) {
        const sortedValue = [...props.value].sort((a, b) => (a || 0) - (b || 0));
        activeDate = sortedValue[0];
      } else if (common_vendor.isNumber(props.value)) {
        activeDate = props.value;
      }
      if (!activeDate) {
        activeDate = Date.now();
      }
      let top = 0;
      let activeMonthIndex = -1;
      for (let index = 0; index < months.value.length; index++) {
        if (common_vendor.compareMonth(months.value[index].date, activeDate) === 0) {
          activeMonthIndex = index;
          const date = new Date(activeDate);
          const day = date.getDate();
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const offset = (7 + firstDay.getDay() - props.firstDayOfWeek) % 7;
          const row = Math.floor((offset + day - 1) / 7);
          top += row * 60 + row * 4;
          break;
        }
        top += months.value[index] ? Number(months.value[index].height) : 0;
      }
      scrollTop.value = 0;
      if (top > 0) {
        await common_vendor.pause();
        scrollTop.value = top + (activeMonthIndex > 0 ? 40 : 0);
      }
    }
    const internalTimeFormatter = (type, value) => {
      if (props.timeFormatter) {
        return props.timeFormatter(type, value);
      }
      return translate(type, value);
    };
    function getTimeValue(date, type) {
      let dateValue = /* @__PURE__ */ new Date();
      if (props.type === "datetime") {
        dateValue = new Date(date);
      } else if (common_vendor.isArray(date)) {
        if (type === "start") {
          dateValue = new Date(date[0] || "");
        } else {
          dateValue = new Date(date[1] || "");
        }
      }
      const hour = common_vendor.padZero(dateValue.getHours());
      const minute = common_vendor.padZero(dateValue.getMinutes());
      const second = common_vendor.padZero(dateValue.getSeconds());
      return props.hideSecond ? `${hour}:${minute}` : `${hour}:${minute}:${second}`;
    }
    function setTime(value, type) {
      if (common_vendor.isArray(value) && value[0] && value[1] && type === "start" && timeType.value === "start") {
        type = "end";
      }
      timeType.value = type || "";
      timeValue.value = getTimeValue(value, type || "");
    }
    function handleDateChange({ value, type }) {
      if (!common_vendor.isEqual(value, props.value)) {
        innerValue.value = value;
        handleChange(value);
      }
      if (props.type.indexOf("time") > -1) {
        setTime(value, type);
      }
    }
    function handleTimeChange({ value }) {
      if (!props.value) {
        return;
      }
      const [hour, minute, second] = value.split(":").map(Number);
      if (props.type === "datetime" && common_vendor.isNumber(props.value)) {
        const date = new Date(props.value);
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(props.hideSecond ? 0 : second || 0);
        const dateTime = date.getTime();
        handleChange(dateTime);
      } else if (common_vendor.isArray(props.value) && props.type === "datetimerange") {
        const [start, end] = props.value;
        const dataValue = timeType.value === "start" ? start : end;
        const date = new Date(dataValue || "");
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(props.hideSecond ? 0 : second || 0);
        const dateTime = date.getTime();
        if (dateTime === dataValue)
          return;
        const finalValue = [start, end];
        if (timeType.value === "start") {
          finalValue[0] = dateTime;
        } else {
          finalValue[1] = dateTime;
        }
        innerValue.value = finalValue;
        handleChange(finalValue);
      }
    }
    function handlePickStart() {
      emit("pickstart");
    }
    function handlePickEnd() {
      emit("pickend");
    }
    const monthScroll = (event) => {
      if (months.value.length <= 1) {
        return;
      }
      const scrollTop2 = Math.max(0, event.detail.scrollTop);
      doSetSubtitle(scrollTop2);
    };
    function doSetSubtitle(scrollTop2) {
      let height = 0;
      for (let index = 0; index < months.value.length; index++) {
        height = height + months.value[index].height;
        if (scrollTop2 < height) {
          scrollIndex.value = index;
          return;
        }
      }
    }
    __expose({
      scrollIntoView
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.switchMode !== "none"
      }, _ctx.switchMode !== "none" ? common_vendor.e({
        b: _ctx.switchMode === "year-month"
      }, _ctx.switchMode === "year-month" ? {
        c: common_vendor.o(($event) => !isPrevYearDisabled.value && changeYear(-1), "7d"),
        d: common_vendor.p({
          name: "double-left",
          ["custom-class"]: `wd-month-panel__control-icon ${isPrevYearDisabled.value ? "is-disabled" : ""}`
        })
      } : {}, {
        e: common_vendor.o(($event) => !isPrevMonthDisabled.value && changeMonth(-1), "1d"),
        f: common_vendor.p({
          name: "left",
          ["custom-class"]: `wd-month-panel__control-icon ${isPrevMonthDisabled.value ? "is-disabled" : ""}`
        }),
        g: common_vendor.t(controlsTitle.value),
        h: common_vendor.o(($event) => !isNextMonthDisabled.value && changeMonth(1), "ca"),
        i: common_vendor.p({
          name: "right",
          ["custom-class"]: `wd-month-panel__control-icon ${isNextMonthDisabled.value ? "is-disabled" : ""}`
        }),
        j: _ctx.switchMode === "year-month"
      }, _ctx.switchMode === "year-month" ? {
        k: common_vendor.o(($event) => !isNextYearDisabled.value && changeYear(1), "10"),
        l: common_vendor.p({
          name: "double-right",
          ["custom-class"]: `wd-month-panel__control-icon ${isNextYearDisabled.value ? "is-disabled" : ""}`
        })
      } : {}) : {}, {
        m: common_vendor.f(7, (item, k0, i0) => {
          return {
            a: common_vendor.t(weekLabel.value(item + _ctx.firstDayOfWeek)),
            b: item
          };
        }),
        n: _ctx.showPanelTitle && _ctx.switchMode === "none"
      }, _ctx.showPanelTitle && _ctx.switchMode === "none" ? {
        o: common_vendor.t(title.value)
      } : {}, {
        p: common_vendor.f(displayMonths.value, (item, index, i0) => {
          return {
            a: common_vendor.o(handleDateChange, index),
            b: "108e315a-4-" + i0,
            c: common_vendor.p({
              type: _ctx.type,
              date: item.date,
              value: _ctx.value,
              ["min-date"]: _ctx.minDate,
              ["max-date"]: _ctx.maxDate,
              ["first-day-of-week"]: _ctx.firstDayOfWeek,
              formatter: _ctx.formatter,
              ["max-range"]: _ctx.maxRange,
              ["range-prompt"]: _ctx.rangePrompt,
              ["allow-same-day"]: _ctx.allowSameDay,
              ["default-time"]: _ctx.defaultTime,
              showTitle: _ctx.switchMode === "none" && index !== 0
            }),
            d: index,
            e: `month${index}`
          };
        }),
        q: common_vendor.n(`wd-month-panel__container ${!!timeType.value ? "wd-month-panel__container--time" : ""}`),
        r: common_vendor.s(containerStyle.value),
        s: scrollTop.value,
        t: common_vendor.o(($event) => _ctx.switchMode === "none" ? monthScroll($event) : void 0, "8a"),
        v: timeType.value
      }, timeType.value ? common_vendor.e({
        w: _ctx.type === "datetimerange"
      }, _ctx.type === "datetimerange" ? {
        x: common_vendor.t(timeType.value === "start" ? common_vendor.unref(translate)("startTime") : common_vendor.unref(translate)("endTime"))
      } : {}, {
        y: common_vendor.o(handleTimeChange, "0a"),
        z: common_vendor.o(handlePickStart, "43"),
        A: common_vendor.o(handlePickEnd, "46"),
        B: common_vendor.o(($event) => timeValue.value = $event, "7c"),
        C: common_vendor.p({
          type: "time",
          ["item-height"]: _ctx.itemHeight,
          ["visible-item-count"]: _ctx.visibleItemCount,
          ["immediate-change"]: _ctx.immediateChange,
          filter: _ctx.timeFilter,
          formatter: internalTimeFormatter,
          ["use-second"]: !_ctx.hideSecond,
          modelValue: timeValue.value
        })
      }) : {});
    };
  }
});
wx.createComponent(_sfc_main);
