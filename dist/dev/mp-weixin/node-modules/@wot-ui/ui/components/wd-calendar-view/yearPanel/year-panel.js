"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const __unplugin_components_0 = () => "../../wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  _component_wd_icon();
}
if (!Math) {
  Year();
}
const Year = () => "../year/year.js";
const __default__ = {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  __name: "year-panel",
  props: common_vendor.yearPanelProps,
  emits: ["change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const scrollTop = common_vendor.ref(0);
    const scrollIndex = common_vendor.ref(0);
    const currentDisplayYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const scrollHeight = common_vendor.computed(() => {
      const scrollHeight2 = props.panelHeight + (props.showPanelTitle ? 26 : 16);
      return scrollHeight2;
    });
    const years = common_vendor.computed(() => {
      return common_vendor.getYears(props.minDate, props.maxDate).map((year, index) => {
        return {
          date: year,
          height: index === 0 ? 188 : 228
        };
      });
    });
    const currentYearDate = common_vendor.computed(() => {
      return new Date(currentDisplayYear.value, 0, 1).getTime();
    });
    const displayYears = common_vendor.computed(() => {
      if (props.switchMode === "none") {
        return years.value;
      }
      return [
        {
          date: currentYearDate.value,
          height: 188
        }
      ];
    });
    const controlsTitle = common_vendor.computed(() => {
      return common_vendor.formatYearTitle(currentYearDate.value);
    });
    const title = common_vendor.computed(() => {
      return common_vendor.formatYearTitle(years.value[scrollIndex.value].date);
    });
    const isPrevYearDisabled = common_vendor.computed(() => {
      const minYear = new Date(props.minDate).getFullYear();
      return currentDisplayYear.value <= minYear;
    });
    const isNextYearDisabled = common_vendor.computed(() => {
      const maxYear = new Date(props.maxDate).getFullYear();
      return currentDisplayYear.value >= maxYear;
    });
    function changeYear(delta) {
      currentDisplayYear.value += delta;
    }
    common_vendor.onMounted(() => {
      if (props.switchMode !== "none") {
        initCurrentDisplayYear();
      }
      scrollIntoView();
    });
    function initCurrentDisplayYear() {
      let activeDate = null;
      if (common_vendor.isArray(props.value)) {
        activeDate = props.value[0];
      } else if (common_vendor.isNumber(props.value)) {
        activeDate = props.value;
      }
      if (!activeDate) {
        activeDate = Date.now();
      }
      currentDisplayYear.value = new Date(activeDate).getFullYear();
    }
    async function scrollIntoView() {
      await common_vendor.pause();
      let activeDate = null;
      if (common_vendor.isArray(props.value)) {
        activeDate = props.value[0];
      } else if (common_vendor.isNumber(props.value)) {
        activeDate = props.value;
      }
      if (!activeDate) {
        activeDate = Date.now();
      }
      let top = 0;
      for (let index = 0; index < years.value.length; index++) {
        if (common_vendor.compareYear(years.value[index].date, activeDate) === 0) {
          break;
        }
        top += years.value[index] ? Number(years.value[index].height) : 0;
      }
      scrollTop.value = 0;
      if (top > 0) {
        await common_vendor.pause();
        scrollTop.value = top + 40;
      }
    }
    const yearScroll = (event) => {
      if (years.value.length <= 1) {
        return;
      }
      const scrollTop2 = Math.max(0, event.detail.scrollTop);
      doSetSubtitle(scrollTop2);
    };
    function doSetSubtitle(scrollTop2) {
      let height = 0;
      for (let index = 0; index < years.value.length; index++) {
        height = height + years.value[index].height;
        if (scrollTop2 < height) {
          scrollIndex.value = index;
          return;
        }
      }
    }
    function handleDateChange({ value }) {
      emit("change", {
        value
      });
    }
    __expose({
      scrollIntoView
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.switchMode !== "none"
      }, _ctx.switchMode !== "none" ? {
        b: common_vendor.o(($event) => !isPrevYearDisabled.value && changeYear(-1), "b3"),
        c: common_vendor.p({
          name: "left",
          ["custom-class"]: `wd-year-panel__control-icon ${isPrevYearDisabled.value ? "is-disabled" : ""}`
        }),
        d: common_vendor.t(controlsTitle.value),
        e: common_vendor.o(($event) => !isNextYearDisabled.value && changeYear(1), "4f"),
        f: common_vendor.p({
          name: "right",
          ["custom-class"]: `wd-year-panel__control-icon ${isNextYearDisabled.value ? "is-disabled" : ""}`
        })
      } : {}, {
        g: _ctx.showPanelTitle && _ctx.switchMode === "none"
      }, _ctx.showPanelTitle && _ctx.switchMode === "none" ? {
        h: common_vendor.t(title.value)
      } : {}, {
        i: common_vendor.f(displayYears.value, (item, index, i0) => {
          return {
            a: common_vendor.o(handleDateChange, index),
            b: "250f644a-2-" + i0,
            c: common_vendor.p({
              type: _ctx.type,
              date: item.date,
              value: _ctx.value,
              ["min-date"]: _ctx.minDate,
              ["max-date"]: _ctx.maxDate,
              ["max-range"]: _ctx.maxRange,
              formatter: _ctx.formatter,
              ["range-prompt"]: _ctx.rangePrompt,
              ["allow-same-day"]: _ctx.allowSameDay,
              ["default-time"]: _ctx.defaultTime,
              showTitle: _ctx.switchMode === "none" && index !== 0
            }),
            d: index,
            e: `year${index}`
          };
        }),
        j: common_vendor.s(`height: ${scrollHeight.value}px`),
        k: scrollTop.value,
        l: common_vendor.o(($event) => _ctx.switchMode === "none" ? yearScroll($event) : void 0, "f2")
      });
    };
  }
});
wx.createComponent(_sfc_main);
