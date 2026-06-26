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
  __name: "year",
  props: common_vendor.yearProps,
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toast = common_vendor.useToast("wd-year");
    const { translate } = common_vendor.useTranslate("calendar-view");
    const months = common_vendor.ref([]);
    const monthTypeClass = common_vendor.computed(() => {
      return (monthType) => {
        return common_vendor.getItemClass(monthType, props.value, props.type);
      };
    });
    const yearTitle = common_vendor.computed(() => {
      return (date) => {
        return common_vendor.formatYearTitle(date);
      };
    });
    common_vendor.watch(
      [() => props.type, () => props.date, () => props.value, () => props.minDate, () => props.maxDate, () => props.formatter],
      () => {
        setMonths();
      },
      {
        deep: true,
        immediate: true
      }
    );
    function getMonthLabel(date) {
      return common_vendor.formatDate(date, translate("month", date));
    }
    function setMonths() {
      const monthList = [];
      const date = new Date(props.date);
      const year = date.getFullYear();
      const value = props.value;
      if (props.type.indexOf("range") > -1 && value && !common_vendor.isArray(value)) {
        console.error("[wot-design] value should be array when type is range");
        return;
      }
      for (let month = 0; month < 12; month++) {
        const date2 = new Date(year, month, 1).getTime();
        let type = getMonthType(date2);
        if (!type && common_vendor.compareMonth(date2, Date.now()) === 0) {
          type = "current";
        }
        const monthObj = getFormatterDate(date2, month, type);
        monthList.push(monthObj);
      }
      months.value = common_vendor.deepClone(monthList);
    }
    function getMonthType(date) {
      if (props.type === "monthrange" && common_vendor.isArray(props.value)) {
        const [startDate, endDate] = props.value || [];
        if (startDate && common_vendor.compareMonth(date, startDate) === 0) {
          if (endDate && common_vendor.compareMonth(startDate, endDate) === 0) {
            return "same";
          }
          return "start";
        } else if (endDate && common_vendor.compareMonth(date, endDate) === 0) {
          return "end";
        } else if (startDate && endDate && common_vendor.compareMonth(date, startDate) === 1 && common_vendor.compareMonth(date, endDate) === -1) {
          return "middle";
        } else {
          return "";
        }
      } else {
        if (props.value && common_vendor.compareMonth(date, props.value) === 0) {
          return "selected";
        } else {
          return "";
        }
      }
    }
    function handleDateClick(index) {
      const date = months.value[index];
      if (date.disabled)
        return;
      switch (props.type) {
        case "month":
          handleMonthChange(date);
          break;
        case "monthrange":
          handleMonthRangeChange(date);
          break;
        default:
          handleMonthChange(date);
      }
    }
    function getDate(date) {
      return props.defaultTime && props.defaultTime.length > 0 ? common_vendor.getDateByDefaultTime(date, props.defaultTime[0]) : date;
    }
    function handleMonthChange(date) {
      if (date.type !== "selected") {
        emit("change", {
          value: getDate(date.date)
        });
      }
    }
    function handleMonthRangeChange(date) {
      let value = [];
      const [startDate, endDate] = common_vendor.isArray(props.value) ? props.value || [] : [];
      const compare = common_vendor.compareMonth(date.date, startDate);
      if (!props.allowSameDay && !endDate && compare === 0)
        return;
      if (startDate && !endDate && compare > -1) {
        if (props.maxRange && common_vendor.getMonthOffset(date.date, startDate) > props.maxRange) {
          const maxEndDate = common_vendor.getMonthByOffset(startDate, props.maxRange - 1);
          value = [startDate, getDate(maxEndDate)];
          toast.show({
            msg: props.rangePrompt || translate("rangePromptMonth", props.maxRange)
          });
        } else {
          value = [startDate, getDate(date.date)];
        }
      } else {
        value = [getDate(date.date), null];
      }
      emit("change", {
        value
      });
    }
    function getFormatterDate(date, month, type) {
      let monthObj = {
        date,
        text: month + 1,
        topInfo: "",
        bottomInfo: "",
        type,
        disabled: common_vendor.compareMonth(date, props.minDate) === -1 || common_vendor.compareMonth(date, props.maxDate) === 1,
        isLastRow: month >= 8
      };
      if (props.formatter) {
        if (common_vendor.isFunction(props.formatter)) {
          monthObj = props.formatter(monthObj);
        } else {
          console.error("[wot-design] error(wd-calendar-view): the formatter prop of wd-calendar-view should be a function");
        }
      }
      return monthObj;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          selector: "wd-year"
        }),
        b: _ctx.showTitle
      }, _ctx.showTitle ? {
        c: common_vendor.t(yearTitle.value(_ctx.date))
      } : {}, {
        d: common_vendor.f(months.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.topInfo),
            b: common_vendor.t(getMonthLabel(item.date)),
            c: common_vendor.t(item.bottomInfo),
            d: index,
            e: common_vendor.n(`wd-year__month ${item.disabled ? "is-disabled" : ""} ${item.isLastRow ? "is-last-row" : ""} ${item.type ? monthTypeClass.value(item.type) : ""} ${item.customClass || ""}`),
            f: common_vendor.o(($event) => handleDateClick(index), index)
          };
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
