"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-step",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.stepProps,
  setup(__props) {
    const props = __props;
    const { parent: steps, index } = common_vendor.useParent(common_vendor.STEPS_KEY);
    const { translate } = common_vendor.useTranslate("steps");
    const currentStatus = common_vendor.computed(() => {
      return getCurrentStatus(index.value);
    });
    const currentTitle = common_vendor.computed(() => {
      return getCurrentTitle(currentStatus.value);
    });
    const rootStyle = common_vendor.computed(() => {
      const style = {};
      if (steps.value) {
        const { vertical: vertical2, space } = steps.value.props;
        if (vertical2) {
          if (space && space !== "") {
            style["height"] = space;
          }
        } else {
          style["width"] = space && space !== "" ? space : 100 / steps.value.children.length + "%";
        }
      }
      return `${common_vendor.objToStyle(style)}${props.customStyle}`;
    });
    const canAlignCenter = common_vendor.computed(() => {
      if (common_vendor.isDef(steps.value)) {
        const { vertical: vertical2, alignCenter } = steps.value.props;
        return Boolean(!vertical2 && alignCenter);
      } else {
        return false;
      }
    });
    const vertical = common_vendor.computed(() => {
      if (common_vendor.isDef(steps.value)) {
        return Boolean(steps.value.props.vertical);
      } else {
        return false;
      }
    });
    const dot = common_vendor.computed(() => {
      if (common_vendor.isDef(steps.value)) {
        return Boolean(steps.value.props.dot);
      } else {
        return false;
      }
    });
    const childrenLength = common_vendor.computed(() => {
      if (common_vendor.isDef(steps.value)) {
        return Number(steps.value.children.length);
      } else {
        return 0;
      }
    });
    function getCurrentStatus(index2) {
      if (props.status) {
        return props.status;
      }
      if (steps.value) {
        const { active } = steps.value.props;
        if (Number(active) > index2) {
          return "finished";
        } else if (Number(active) === index2) {
          return "process";
        } else {
          return "wait";
        }
      } else {
        return "wait";
      }
    }
    function getCurrentTitle(currentStatus2) {
      if (props.title)
        return props.title;
      switch (currentStatus2) {
        case "finished":
          return translate("finished");
        case "error":
          return translate("failed");
        case "process":
          return translate("process");
        case "wait":
        default:
          return translate("wait");
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentStatus.value
      }, currentStatus.value ? common_vendor.e({
        b: dot.value
      }, dot.value ? {} : _ctx.$slots.icon || _ctx.icon ? common_vendor.e({
        d: _ctx.icon
      }, _ctx.icon ? {
        e: common_vendor.p({
          ["custom-class"]: "wd-step__icon",
          name: _ctx.icon
        })
      } : {}) : common_vendor.e({
        f: currentStatus.value === "finished"
      }, currentStatus.value === "finished" ? {
        g: common_vendor.p({
          ["custom-class"]: "wd-step__finished-icon",
          name: "check"
        })
      } : currentStatus.value === "error" ? {
        i: common_vendor.p({
          ["custom-class"]: "wd-step__error-icon",
          name: "close"
        })
      } : {
        j: common_vendor.t(common_vendor.unref(index) + 1)
      }, {
        h: currentStatus.value === "error"
      }), {
        c: _ctx.$slots.icon || _ctx.icon,
        k: common_vendor.n(`wd-step__indicator  ${dot.value ? "is-dot" : !!_ctx.icon || _ctx.$slots.icon ? "is-icon" : "is-text"}`),
        l: common_vendor.unref(index) < childrenLength.value - 1
      }, common_vendor.unref(index) < childrenLength.value - 1 ? {} : {}, {
        m: common_vendor.n(`wd-step__header ${dot.value ? "is-dot" : ""}`),
        n: _ctx.$slots.title || currentTitle.value || _ctx.$slots.description || _ctx.description
      }, _ctx.$slots.title || currentTitle.value || _ctx.$slots.description || _ctx.description ? common_vendor.e({
        o: _ctx.$slots.title || currentTitle.value
      }, _ctx.$slots.title || currentTitle.value ? {
        p: common_vendor.t(currentTitle.value)
      } : {}, {
        q: _ctx.$slots.description || _ctx.description
      }, _ctx.$slots.description || _ctx.description ? {
        r: common_vendor.t(_ctx.description)
      } : {}) : {}, {
        s: common_vendor.n(`wd-step wd-step--${currentStatus.value} ${_ctx.customClass} ${canAlignCenter.value ? "is-center" : ""}  ${vertical.value ? "is-vertical" : ""}`),
        t: common_vendor.s(rootStyle.value)
      }) : {});
    };
  }
});
wx.createComponent(_sfc_main);
