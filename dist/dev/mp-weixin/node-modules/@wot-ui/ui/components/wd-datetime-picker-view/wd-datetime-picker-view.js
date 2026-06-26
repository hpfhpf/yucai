"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdPickerView();
}
const wdPickerView = () => "../wd-picker-view/wd-picker-view.js";
const __default__ = {
  name: "wd-datetime-picker-view",
  virtualHost: true,
  addGlobalClass: true,
  styleIsolation: "shared"
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.datetimePickerViewProps,
  emits: ["change", "pickstart", "pickend", "update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const isValidDate = (date) => common_vendor.isDef(date) && !Number.isNaN(date);
    const times = (n, iteratee) => {
      let index = -1;
      const length = n < 0 ? 0 : n;
      const result = Array(length);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    };
    const getMonthEndDay = (year, month) => {
      return 32 - new Date(year, month - 1, 32).getDate();
    };
    const props = __props;
    const emit = __emit;
    const datePickerview = common_vendor.ref();
    const innerValue = common_vendor.ref(null);
    const pickerValue = common_vendor.ref([]);
    const created = common_vendor.ref(false);
    const { proxy } = common_vendor.getCurrentInstance();
    const columns = common_vendor.computed(() => {
      const { formatter, columnFormatter } = props;
      const originColumns = getOriginColumns().map((column) => {
        return column.values.map((value) => {
          return {
            label: formatter ? formatter(column.type, common_vendor.padZero(value)) : common_vendor.padZero(value),
            value
          };
        });
      });
      if (columnFormatter) {
        return columnFormatter(originColumns);
      }
      return originColumns;
    });
    common_vendor.watch(
      () => props.modelValue,
      (val) => {
        const value = correctValue(val);
        if (value === innerValue.value)
          return;
        updateColumnValue(value);
      },
      { deep: true, immediate: true }
    );
    common_vendor.watch(
      () => props.type,
      (target) => {
        const type = ["date", "year-month", "time", "datetime", "year"];
        if (type.indexOf(target) === -1) {
          console.error(`type must be one of ${type}`);
        }
      },
      { deep: true, immediate: true }
    );
    common_vendor.onBeforeMount(() => {
      created.value = true;
      const innerValue2 = correctValue(props.modelValue);
      updateColumnValue(innerValue2);
    });
    function onChange({ selectedValues }) {
      pickerValue.value = selectedValues;
      const result = updateInnerValue(selectedValues);
      updateColumnValue(result);
    }
    function getOriginColumns() {
      const { filter } = props;
      return getRanges().map(({ type, range: range2 }) => {
        let values = times(range2[1] - range2[0] + 1, (index) => {
          return range2[0] + index;
        });
        if (filter) {
          values = filter({ type, values });
        }
        return {
          type,
          values
        };
      });
    }
    function getRanges() {
      if (props.type === "time") {
        const result2 = [
          {
            type: "hour",
            range: [props.minHour, props.maxHour]
          },
          {
            type: "minute",
            range: [props.minMinute, props.maxMinute]
          }
        ];
        if (props.useSecond) {
          result2.push({
            type: "second",
            range: [props.minSecond, props.maxSecond]
          });
        }
        return result2;
      }
      const { maxYear, maxDate, maxMonth, maxHour, maxMinute, maxSecond } = getBoundary("max", innerValue.value);
      const { minYear, minDate, minMonth, minHour, minMinute, minSecond } = getBoundary("min", innerValue.value);
      const result = [
        {
          type: "year",
          range: [minYear, maxYear]
        },
        {
          type: "month",
          range: [minMonth, maxMonth]
        },
        {
          type: "date",
          range: [minDate, maxDate]
        },
        {
          type: "hour",
          range: [minHour, maxHour]
        },
        {
          type: "minute",
          range: [minMinute, maxMinute]
        }
      ];
      if (props.type === "datetime" && props.useSecond) {
        result.push({
          type: "second",
          range: [minSecond, maxSecond]
        });
      }
      if (props.type === "date")
        result.splice(3, 2);
      if (props.type === "year-month")
        result.splice(2, 3);
      if (props.type === "year")
        result.splice(1, 4);
      return result;
    }
    function correctValue(value) {
      const isDateType = props.type !== "time";
      if (isDateType && !isValidDate(value)) {
        value = props.minDate;
      } else if (!isDateType && !value) {
        value = props.useSecond ? `${common_vendor.padZero(props.minHour)}:00:00` : `${common_vendor.padZero(props.minHour)}:00`;
      }
      if (!isDateType) {
        let [hour, minute, second = "00"] = (common_vendor.isString(value) ? value : value.toString()).split(":");
        hour = common_vendor.padZero(common_vendor.range(Number(hour), props.minHour, props.maxHour));
        minute = common_vendor.padZero(common_vendor.range(Number(minute), props.minMinute, props.maxMinute));
        if (props.useSecond) {
          second = common_vendor.padZero(common_vendor.range(Number(second), props.minSecond, props.maxSecond));
          return `${hour}:${minute}:${second}`;
        }
        return `${hour}:${minute}`;
      }
      value = Math.min(Math.max(Number(value), props.minDate), props.maxDate);
      return value;
    }
    function getBoundary(type, innerValue2) {
      const value = new Date(innerValue2);
      const boundary = new Date(props[`${type}Date`]);
      const year = boundary.getFullYear();
      let month = 1;
      let date = 1;
      let hour = 0;
      let minute = 0;
      let second = 0;
      if (type === "max") {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
        second = 59;
      }
      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();
          if (value.getDate() === date) {
            hour = boundary.getHours();
            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
              if (value.getMinutes() === minute) {
                second = boundary.getSeconds();
              }
            }
          }
        }
      }
      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
        [`${type}Second`]: second
      };
    }
    function updateColumnValue(value) {
      const values = common_vendor.getPickerValue(value, props.type, props.useSecond);
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
        emit("change", {
          value,
          columns: getOriginColumns()
        });
      }
      innerValue.value = value;
      pickerValue.value = values;
    }
    function updateInnerValue(indexes) {
      const { type, useSecond } = props;
      let innerValue2 = "";
      const values = indexes;
      if (type === "time") {
        if (useSecond) {
          innerValue2 = `${common_vendor.padZero(values[0])}:${common_vendor.padZero(values[1])}:${common_vendor.padZero(values[2])}`;
        } else {
          innerValue2 = `${common_vendor.padZero(values[0])}:${common_vendor.padZero(values[1])}`;
        }
        return innerValue2;
      }
      const year = values[0] && parseInt(String(values[0]));
      const month = type === "year" ? 1 : values[1] && parseInt(String(values[1]));
      const maxDate = getMonthEndDay(Number(year), Number(month));
      let date = 1;
      if (type !== "year-month" && type !== "year") {
        date = (Number(values[2]) && parseInt(String(values[2]))) > maxDate ? maxDate : values[2] && parseInt(String(values[2]));
      }
      let hour = 0;
      let minute = 0;
      let second = 0;
      if (type === "datetime") {
        hour = Number(values[3]) && parseInt(String(values[3]));
        minute = Number(values[4]) && parseInt(String(values[4]));
        if (useSecond) {
          second = Number(values[5]) && parseInt(String(values[5]));
        }
      }
      const value = new Date(Number(year), Number(month) - 1, Number(date), hour, minute, second).getTime();
      innerValue2 = correctValue(value);
      return innerValue2;
    }
    function onPickStart() {
      emit("pickstart");
    }
    function onPickEnd() {
      emit("pickend");
    }
    function getSelectedOptions() {
      var _a;
      const pickerVal = (_a = datePickerview.value) == null ? void 0 : _a.getSelectedOptions();
      if (pickerVal == null)
        return void 0;
      if (common_vendor.isArray(pickerVal))
        return pickerVal;
      return [pickerVal];
    }
    __expose({
      getSelectedOptions,
      correctValue,
      getOriginColumns
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(datePickerview, "ac8f1270-0", {
          "k": "datePickerview"
        }),
        b: common_vendor.o(onChange, "e6"),
        c: common_vendor.o(onPickStart, "76"),
        d: common_vendor.o(onPickEnd, "9c"),
        e: common_vendor.o(($event) => pickerValue.value = $event, "eb"),
        f: common_vendor.p({
          ["custom-class"]: _ctx.customClass,
          ["custom-style"]: _ctx.customStyle,
          ["immediate-change"]: _ctx.immediateChange,
          columns: columns.value,
          ["item-height"]: _ctx.itemHeight,
          ["visible-item-count"]: _ctx.visibleItemCount,
          modelValue: pickerValue.value
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
