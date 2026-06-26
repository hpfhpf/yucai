"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdOverlay + wdLoading + wdIcon + wdTransition)();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const wdLoading = () => "../wd-loading/wd-loading.js";
const wdOverlay = () => "../wd-overlay/wd-overlay.js";
const wdTransition = () => "../wd-transition/wd-transition.js";
const __default__ = {
  name: "wd-toast",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.toastProps,
  setup(__props) {
    const props = __props;
    const iconName = common_vendor.ref("");
    const msg = common_vendor.ref("");
    const position = common_vendor.ref("middle");
    const show = common_vendor.ref(false);
    const zIndex = common_vendor.ref(100);
    const loadingType = common_vendor.ref("circular");
    const loadingColor = common_vendor.ref("#fff");
    const iconSize = common_vendor.ref();
    const loadingSize = common_vendor.ref();
    const cover = common_vendor.ref(false);
    const classPrefix = common_vendor.ref("wd-icon");
    const iconClass = common_vendor.ref("");
    const cssIcon = common_vendor.ref(false);
    const direction = common_vendor.ref("horizontal");
    let opened = null;
    let closed = null;
    const toastOptionKey = common_vendor.getToastOptionKey(props.selector);
    const toastOption = common_vendor.inject(toastOptionKey, common_vendor.ref(common_vendor.defaultOptions));
    common_vendor.watch(
      () => toastOption.value,
      (newVal) => {
        reset(newVal);
      },
      {
        deep: true,
        immediate: true
      }
    );
    const transitionStyle = common_vendor.computed(() => {
      const style = {
        "z-index": zIndex.value,
        position: "fixed",
        top: "50%",
        left: 0,
        width: "100%",
        // transform: 'translate(0, -50%)',
        "text-align": "center",
        "pointer-events": "none"
      };
      return common_vendor.objToStyle(style);
    });
    const rootClass = common_vendor.computed(() => {
      return `wd-toast ${props.customClass} wd-toast--${position.value} ${(iconName.value !== "loading" || msg.value) && (iconName.value || iconClass.value || cssIcon.value) ? "wd-toast--with-icon" : ""} ${iconName.value === "loading" && !msg.value ? "wd-toast--loading" : ""} ${direction.value === "vertical" ? "is-vertical" : ""}`;
    });
    function handleAfterEnter() {
      if (common_vendor.isFunction(opened)) {
        opened();
      }
    }
    function handleAfterLeave() {
      if (common_vendor.isFunction(closed)) {
        closed();
      }
    }
    function reset(option) {
      show.value = common_vendor.isDef(option.show) ? option.show : false;
      if (show.value) {
        mergeOptionsWithProps(option, props);
      }
    }
    function mergeOptionsWithProps(option, props2) {
      iconName.value = common_vendor.isDef(option.iconName) ? option.iconName : props2.iconName;
      iconClass.value = common_vendor.isDef(option.iconClass) ? option.iconClass : props2.iconClass;
      cssIcon.value = common_vendor.isDef(option.cssIcon) ? option.cssIcon : props2.cssIcon;
      msg.value = common_vendor.isDef(option.msg) ? option.msg : props2.msg;
      position.value = common_vendor.isDef(option.position) ? option.position : props2.position;
      zIndex.value = common_vendor.isDef(option.zIndex) ? option.zIndex : props2.zIndex;
      loadingType.value = common_vendor.isDef(option.loadingType) ? option.loadingType : props2.loadingType;
      loadingColor.value = common_vendor.isDef(option.loadingColor) ? option.loadingColor : props2.loadingColor;
      iconSize.value = common_vendor.isDef(option.iconSize) ? common_vendor.addUnit(option.iconSize) : common_vendor.isDef(props2.iconSize) ? common_vendor.addUnit(props2.iconSize) : void 0;
      loadingSize.value = common_vendor.isDef(option.loadingSize) ? common_vendor.addUnit(option.loadingSize) : common_vendor.isDef(props2.loadingSize) ? common_vendor.addUnit(props2.loadingSize) : void 0;
      cover.value = common_vendor.isDef(option.cover) ? option.cover : props2.cover;
      classPrefix.value = common_vendor.isDef(option.classPrefix) ? option.classPrefix : props2.classPrefix;
      direction.value = common_vendor.isDef(option.direction) ? option.direction : props2.direction;
      closed = common_vendor.isFunction(option.closed) ? option.closed : common_vendor.isFunction(props2.closed) ? props2.closed : null;
      opened = common_vendor.isFunction(option.opened) ? option.opened : common_vendor.isFunction(props2.opened) ? props2.opened : null;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: cover.value
      }, cover.value ? {
        b: common_vendor.p({
          ["z-index"]: zIndex.value,
          ["lock-scroll"]: true,
          show: show.value,
          ["custom-style"]: "background-color: transparent;pointer-events: auto;"
        })
      } : {}, {
        c: iconName.value === "loading"
      }, iconName.value === "loading" ? {
        d: common_vendor.p({
          type: loadingType.value,
          color: loadingColor.value,
          size: loadingSize.value,
          ["custom-class"]: `wd-toast__icon ${direction.value === "vertical" ? "is-vertical" : ""}`
        })
      } : iconName.value === "success" || iconName.value === "warning" || iconName.value === "info" || iconName.value === "error" ? {
        f: common_vendor.p({
          ["custom-class"]: `wd-toast__icon ${direction.value === "vertical" ? "is-vertical" : ""}`,
          size: iconSize.value,
          ["class-prefix"]: classPrefix.value,
          name: common_vendor.unref(common_vendor.toastIcon)[iconName.value]
        })
      } : iconClass.value || cssIcon.value ? {
        h: common_vendor.p({
          ["custom-class"]: `wd-toast__icon ${direction.value === "vertical" ? "is-vertical" : ""}`,
          size: iconSize.value,
          ["class-prefix"]: classPrefix.value,
          name: iconClass.value,
          ["css-icon"]: cssIcon.value
        })
      } : {}, {
        e: iconName.value === "success" || iconName.value === "warning" || iconName.value === "info" || iconName.value === "error",
        g: iconClass.value || cssIcon.value,
        i: msg.value
      }, msg.value ? {
        j: common_vendor.t(msg.value),
        k: common_vendor.n(`wd-toast__msg ${direction.value === "vertical" ? "is-vertical" : ""}`)
      } : {}, {
        l: common_vendor.n(rootClass.value),
        m: common_vendor.o(handleAfterEnter, "10"),
        n: common_vendor.o(handleAfterLeave, "09"),
        o: common_vendor.p({
          name: "fade",
          show: show.value,
          ["custom-style"]: transitionStyle.value
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
