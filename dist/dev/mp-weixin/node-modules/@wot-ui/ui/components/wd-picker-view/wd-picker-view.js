"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __default__ = {
  name: "wd-picker-view",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.pickerViewProps,
  emits: ["change", "pickstart", "pickend", "update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      formatColumns,
      selectedIndex,
      selectedOptions,
      selectedValues,
      selectedLabels,
      selectWithValue,
      correctSelected,
      getChangeColumnIndex,
      getColumnIndex,
      getColumnData,
      getColumnsData,
      resetColumns,
      buildCascadeColumns,
      updateCascadeColumns
    } = common_vendor.useSelection(props.valueKey, props.labelKey, props.childrenKey, props.cascade);
    common_vendor.watch(
      [() => props.modelValue, () => props.columns, () => props.cascade],
      (newValue, oldValue) => {
        const [newModelValue, newColumns, newCascade] = newValue;
        const [, oldColumns] = oldValue;
        if (!common_vendor.isEqual(oldColumns, newColumns)) {
          resetColumns(newColumns);
          if (newCascade && common_vendor.isDef(newModelValue) && newModelValue.length > 0 && newColumns.length > 0) {
            const cascadeColumns = buildCascadeColumns(newColumns, newModelValue);
            formatColumns.value = cascadeColumns;
          }
        }
        if (common_vendor.isDef(newModelValue)) {
          selectWithValue(newModelValue);
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
    const pickerViewStyle = common_vendor.computed(() => {
      return `height: ${common_vendor.addUnit(props.itemHeight * props.visibleItemCount)};`;
    });
    function getItemClass(disabled, colIndex, rowIndex) {
      const classes = ["wd-picker-view__column-item"];
      if (disabled) {
        classes.push("wd-picker-view__column-item--disabled");
      }
      if (selectedIndex.value[colIndex] === rowIndex) {
        classes.push("wd-picker-view__column-item--active");
      }
      return classes.join(" ");
    }
    function onChange({ detail: { value } }) {
      const normalizedValue = value.map((v) => Number(v || 0));
      const origin = [...selectedIndex.value];
      selectedIndex.value = [...normalizedValue];
      common_vendor.nextTick$1(() => {
        selectedIndex.value = correctSelected(normalizedValue);
        const columnIndex = getChangeColumnIndex(selectedIndex.value, origin);
        if (props.cascade && columnIndex !== -1 && props.columns.length > 0) {
          const firstColumn = props.columns[0];
          if (!common_vendor.isArray(firstColumn) && common_vendor.isObj(firstColumn)) {
            updateCascadeColumns(props.columns, columnIndex, selectedIndex.value);
          }
        }
        handleChange(columnIndex);
      });
    }
    function handleChange(columnIndex) {
      if (common_vendor.isEqual(selectedValues.value, props.modelValue))
        return;
      emit("update:modelValue", selectedValues.value);
      common_vendor.nextTick$1(() => {
        emit("change", {
          selectedValues: selectedValues.value,
          selectedOptions: selectedOptions.value,
          selectedLabels: selectedLabels.value,
          selectedIndexes: selectedIndex.value,
          columnIndex
        });
      });
    }
    function getSelectedIndex() {
      return selectedIndex.value;
    }
    function onPickStart() {
      emit("pickstart");
    }
    function onPickEnd() {
      emit("pickend");
    }
    function getSelectedOptions() {
      return selectedOptions.value;
    }
    function getSelectedValues() {
      return selectedValues.value;
    }
    function getSelectedLabels() {
      return selectedLabels.value;
    }
    __expose({
      getSelectedOptions,
      getSelectedValues,
      getColumnsData,
      getColumnData,
      getColumnIndex,
      getSelectedLabels,
      getSelectedIndex,
      resetColumns
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(formatColumns), (col, colIndex, i0) => {
          return {
            a: common_vendor.f(col, (row, rowIndex, i1) => {
              return {
                a: common_vendor.t(row[_ctx.labelKey]),
                b: common_vendor.n(getItemClass(row["disabled"], colIndex, rowIndex)),
                c: rowIndex
              };
            }),
            b: colIndex
          };
        }),
        b: common_vendor.s(pickerViewStyle.value),
        c: common_vendor.unref(selectedIndex),
        d: _ctx.immediateChange,
        e: common_vendor.o(onChange, "1e"),
        f: common_vendor.o(onPickStart, "98"),
        g: common_vendor.o(onPickEnd, "57"),
        h: common_vendor.n(`wd-picker-view ${_ctx.customClass}`),
        i: common_vendor.s(_ctx.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
