"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
if (!Math) {
  wdToast();
}
const wdToast = () => "../../wd-toast/wd-toast.js";
const __default__ = {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "month",
  props: common_vendor.monthProps,
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { translate } = common_vendor.useTranslate("calendar-view");
    const days = common_vendor.ref([]);
    const toast = common_vendor.useToast("wd-month");
    const offset = common_vendor.computed(() => {
      const firstDayOfWeek = props.firstDayOfWeek >= 7 ? props.firstDayOfWeek % 7 : props.firstDayOfWeek;
      const offset2 = (7 + new Date(props.date).getDay() - firstDayOfWeek) % 7;
      return offset2;
    });
    const dayTypeClass = common_vendor.computed(() => {
      return (monthType) => {
        return common_vendor.getItemClass(monthType, props.value, props.type);
      };
    });
    const monthTitle = common_vendor.computed(() => {
      return (date) => {
        return common_vendor.formatMonthTitle(date);
      };
    });
    const firstDayStyle = common_vendor.computed(() => {
      const dayStyle = {};
      dayStyle.marginLeft = `${100 / 7 * offset.value}%`;
      return common_vendor.objToStyle(dayStyle);
    });
    const isLastRow = (date) => {
      const currentDate = new Date(date);
      const currentDay = currentDate.getDate();
      const daysInMonth = common_vendor.getMonthEndDay(currentDate.getFullYear(), currentDate.getMonth() + 1);
      const totalDaysShown = offset.value + daysInMonth;
      const totalRows = Math.ceil(totalDaysShown / 7);
      return Math.ceil((offset.value + currentDay) / 7) === totalRows;
    };
    common_vendor.watch(
      [() => props.type, () => props.date, () => props.value, () => props.minDate, () => props.maxDate, () => props.formatter],
      () => {
        setDays();
      },
      {
        deep: true,
        immediate: true
      }
    );
    function setDays() {
      const dayList = [];
      const date = new Date(props.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const totalDay = common_vendor.getMonthEndDay(year, month + 1);
      let value = props.value;
      if ((props.type === "week" || props.type === "weekrange") && value) {
        value = getWeekValue();
      }
      for (let day = 1; day <= totalDay; day++) {
        const date2 = new Date(year, month, day).getTime();
        let type = getDayType(date2, value);
        if (!type && common_vendor.compareDate(date2, Date.now()) === 0) {
          type = "current";
        }
        const dayObj = getFormatterDate(date2, day, type);
        dayList.push(dayObj);
      }
      days.value = dayList;
    }
    function getDayType(date, value) {
      switch (props.type) {
        case "date":
        case "datetime":
          return getDateType(date);
        case "dates":
          return getDatesType(date);
        case "daterange":
        case "datetimerange":
          return getDatetimeType(date, value);
        case "week":
          return getWeektimeType(date, value);
        case "weekrange":
          return getWeektimeType(date, value);
        default:
          return getDateType(date);
      }
    }
    function getDateType(date) {
      if (props.value && common_vendor.compareDate(date, props.value) === 0) {
        return "selected";
      }
      return "";
    }
    function getDatesType(date) {
      const { value } = props;
      let type = "";
      if (!common_vendor.isArray(value))
        return type;
      const isSelected = (day) => {
        return value.some((item) => common_vendor.compareDate(day, item) === 0);
      };
      if (isSelected(date)) {
        const prevDay = common_vendor.getPrevDay(date);
        const nextDay = common_vendor.getNextDay(date);
        const prevSelected = isSelected(prevDay);
        const nextSelected = isSelected(nextDay);
        if (prevSelected && nextSelected) {
          type = "multiple-middle";
        } else if (prevSelected) {
          type = "end";
        } else if (nextSelected) {
          type = "start";
        } else {
          type = "multiple-selected";
        }
      }
      return type;
    }
    function getDatetimeType(date, value) {
      const [startDate, endDate] = common_vendor.isArray(value) ? value : [];
      if (startDate && common_vendor.compareDate(date, startDate) === 0) {
        if (props.allowSameDay && endDate && common_vendor.compareDate(startDate, endDate) === 0) {
          return "same";
        }
        return "start";
      } else if (endDate && common_vendor.compareDate(date, endDate) === 0) {
        return "end";
      } else if (startDate && endDate && common_vendor.compareDate(date, startDate) === 1 && common_vendor.compareDate(date, endDate) === -1) {
        return "middle";
      } else {
        return "";
      }
    }
    function getWeektimeType(date, value) {
      const [startDate, endDate] = common_vendor.isArray(value) ? value : [];
      if (startDate && common_vendor.compareDate(date, startDate) === 0) {
        return "start";
      } else if (endDate && common_vendor.compareDate(date, endDate) === 0) {
        return "end";
      } else if (startDate && endDate && common_vendor.compareDate(date, startDate) === 1 && common_vendor.compareDate(date, endDate) === -1) {
        return "middle";
      } else {
        return "";
      }
    }
    function getWeekValue() {
      if (props.type === "week") {
        return common_vendor.getWeekRange(props.value, props.firstDayOfWeek);
      } else {
        const [startDate, endDate] = props.value || [];
        if (startDate) {
          const firstWeekRange = common_vendor.getWeekRange(startDate, props.firstDayOfWeek);
          if (endDate) {
            const endWeekRange = common_vendor.getWeekRange(endDate, props.firstDayOfWeek);
            return [firstWeekRange[0], endWeekRange[1]];
          } else {
            return firstWeekRange;
          }
        }
        return [];
      }
    }
    function handleDateClick(index) {
      const date = days.value[index];
      switch (props.type) {
        case "date":
        case "datetime":
          handleDateChange(date);
          break;
        case "dates":
          handleDatesChange(date);
          break;
        case "daterange":
        case "datetimerange":
          handleDateRangeChange(date);
          break;
        case "week":
          handleWeekChange(date);
          break;
        case "weekrange":
          handleWeekRangeChange(date);
          break;
        default:
          handleDateChange(date);
      }
    }
    function getDate(date, isEnd = false) {
      date = props.defaultTime && props.defaultTime.length > 0 ? common_vendor.getDateByDefaultTime(date, isEnd ? props.defaultTime[1] : props.defaultTime[0]) : date;
      if (date < props.minDate)
        return props.minDate;
      if (date > props.maxDate)
        return props.maxDate;
      return date;
    }
    function handleDateChange(date) {
      if (date.disabled)
        return;
      if (date.type !== "selected") {
        emit("change", {
          value: getDate(date.date),
          type: "start"
        });
      }
    }
    function handleDatesChange(date) {
      if (date.disabled)
        return;
      const currentValue = common_vendor.deepClone(common_vendor.isArray(props.value) ? props.value : []);
      const dateIndex = currentValue.findIndex((item) => item && common_vendor.compareDate(item, date.date) === 0);
      const value = dateIndex === -1 ? [...currentValue, getDate(date.date)] : currentValue.filter((_, index) => index !== dateIndex);
      emit("change", { value });
    }
    function handleDateRangeChange(date) {
      if (date.disabled)
        return;
      let value = [];
      let type = "";
      const [startDate, endDate] = common_vendor.deepClone(common_vendor.isArray(props.value) ? props.value : []);
      const compare = common_vendor.compareDate(date.date, startDate);
      if (!props.allowSameDay && compare === 0 && (props.type === "daterange" || props.type === "datetimerange") && !endDate) {
        return;
      }
      if (startDate && !endDate && compare > -1) {
        if (props.maxRange && common_vendor.getDayOffset(date.date, startDate) > props.maxRange) {
          const maxEndDate = common_vendor.getDayByOffset(startDate, props.maxRange - 1);
          value = [startDate, getDate(maxEndDate, true)];
          toast.show({
            msg: props.rangePrompt || translate("rangePrompt", props.maxRange)
          });
        } else {
          value = [startDate, getDate(date.date, true)];
        }
      } else if (props.type === "datetimerange" && startDate && endDate) {
        if (compare === 0) {
          type = "start";
          value = props.value;
        } else if (common_vendor.compareDate(date.date, endDate) === 0) {
          type = "end";
          value = props.value;
        } else {
          value = [getDate(date.date), null];
        }
      } else {
        value = [getDate(date.date), null];
      }
      emit("change", {
        value,
        type: type || (value[1] ? "end" : "start")
      });
    }
    function handleWeekChange(date) {
      const [weekStart] = common_vendor.getWeekRange(date.date, props.firstDayOfWeek);
      if (getFormatterDate(weekStart, new Date(weekStart).getDate()).disabled)
        return;
      emit("change", {
        value: getDate(weekStart) + 24 * 60 * 60 * 1e3
      });
    }
    function handleWeekRangeChange(date) {
      const [weekStartDate] = common_vendor.getWeekRange(date.date, props.firstDayOfWeek);
      if (getFormatterDate(weekStartDate, new Date(weekStartDate).getDate()).disabled)
        return;
      let value = [];
      const [startDate, endDate] = common_vendor.deepClone(common_vendor.isArray(props.value) ? props.value : []);
      const [startWeekStartDate] = startDate ? common_vendor.getWeekRange(startDate, props.firstDayOfWeek) : [];
      const compare = common_vendor.compareDate(weekStartDate, startWeekStartDate);
      if (startDate && !endDate && compare > -1) {
        if (!props.allowSameDay && compare === 0)
          return;
        value = [getDate(startWeekStartDate) + 24 * 60 * 60 * 1e3, getDate(weekStartDate) + 24 * 60 * 60 * 1e3];
      } else {
        value = [getDate(weekStartDate) + 24 * 60 * 60 * 1e3, null];
      }
      emit("change", {
        value
      });
    }
    function getFormatterDate(date, day, type) {
      let dayObj = {
        date,
        text: day,
        topInfo: "",
        bottomInfo: "",
        type,
        disabled: common_vendor.compareDate(date, props.minDate) === -1 || common_vendor.compareDate(date, props.maxDate) === 1,
        isLastRow: isLastRow(date)
      };
      if (props.formatter) {
        if (common_vendor.isFunction(props.formatter)) {
          dayObj = props.formatter(dayObj);
        } else {
          console.error("[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function");
        }
      }
      return dayObj;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          selector: "wd-month"
        }),
        b: _ctx.showTitle
      }, _ctx.showTitle ? {
        c: common_vendor.t(monthTitle.value(_ctx.date))
      } : {}, {
        d: common_vendor.f(days.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.topInfo),
            b: common_vendor.t(item.text),
            c: common_vendor.t(item.bottomInfo),
            d: index,
            e: common_vendor.n(`wd-month__day ${item.disabled ? "is-disabled" : ""} ${item.isLastRow ? "is-last-row" : ""} ${item.type ? dayTypeClass.value(item.type) : ""} ${item.customClass || ""}`),
            f: common_vendor.s(index === 0 ? firstDayStyle.value : ""),
            g: common_vendor.o(($event) => handleDateClick(index), index)
          };
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
