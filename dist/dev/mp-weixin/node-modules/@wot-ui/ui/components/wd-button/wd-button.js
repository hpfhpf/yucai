"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __unplugin_components_0 = () => "../wd-loading/wd-loading.js";
if (!Array) {
  const _component_wd_loading = __unplugin_components_0;
  _component_wd_loading();
}
if (!Math) {
  wdIcon();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const __default__ = {
  name: "wd-button",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.buttonProps,
  emits: ["click", "getuserinfo", "contact", "getphonenumber", "getrealtimephonenumber", "error", "launchapp", "opensetting", "chooseavatar", "agreeprivacyauthorization"],
  setup(__props, { emit: __emit }) {
    const slots = common_vendor.useSlots();
    const props = __props;
    const emit = __emit;
    const customLoadingProps = common_vendor.computed(() => {
      const loadingProps = common_vendor.isDef(props.loadingProps) ? common_vendor.omitBy(props.loadingProps, common_vendor.isUndefined) : {};
      loadingProps.customSpinnerClass = `${common_vendor.isDef(loadingProps.customSpinnerClass) ? loadingProps.customSpinnerClass : ""} wd-button__loading`;
      loadingProps.inheritColor = common_vendor.isDef(loadingProps.inheritColor) ? loadingProps.inheritColor : true;
      return loadingProps;
    });
    const openTypeValue = common_vendor.computed(() => {
      return props.disabled || props.loading ? void 0 : props.openType;
    });
    const isIcon = common_vendor.computed(() => {
      return !slots.default && !props.text && !!(props.icon || props.cssIcon);
    });
    function handleClick(event) {
      if (!props.disabled && !props.loading) {
        emit("click", event);
      }
    }
    function handleGetAuthorize(event) {
      if (props.scope === "phoneNumber") {
        handleGetPhoneNumber(event);
      } else if (props.scope === "userInfo") {
        handleGetUserInfo(event);
      }
    }
    function handleGetUserInfo(event) {
      emit("getuserinfo", event);
    }
    function handleContact(event) {
      emit("contact", event);
    }
    function handleGetPhoneNumber(event) {
      emit("getphonenumber", event);
    }
    function handleGetRealtimePhoneNumber(event) {
      emit("getrealtimephonenumber", event);
    }
    function handleError(event) {
      emit("error", event);
    }
    function handleLaunchApp(event) {
      emit("launchapp", event);
    }
    function handleOpenSetting(event) {
      emit("opensetting", event);
    }
    function handleChooseAvatar(event) {
      emit("chooseavatar", event);
    }
    function handleAgreePrivacyAuthorization(event) {
      emit("agreeprivacyauthorization", event);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.loading
      }, _ctx.loading ? {
        b: common_vendor.p({
          ...customLoadingProps.value
        })
      } : _ctx.icon || _ctx.cssIcon ? {
        d: common_vendor.p({
          ["custom-class"]: "wd-button__icon",
          name: _ctx.icon,
          ["class-prefix"]: _ctx.classPrefix,
          ["css-icon"]: _ctx.cssIcon
        })
      } : {}, {
        c: _ctx.icon || _ctx.cssIcon,
        e: _ctx.$slots.default || _ctx.text
      }, _ctx.$slots.default || _ctx.text ? {
        f: common_vendor.t(_ctx.text)
      } : {}, {
        g: _ctx.buttonId,
        h: `${_ctx.disabled || _ctx.loading ? "" : "wd-button--active"}`,
        i: common_vendor.s(_ctx.customStyle),
        j: common_vendor.n("is-" + _ctx.type),
        k: common_vendor.n("is-" + _ctx.size),
        l: common_vendor.n(isIcon.value ? "is-icon" : ""),
        m: common_vendor.n(_ctx.round ? "is-round" : ""),
        n: common_vendor.n(_ctx.hairline ? "is-hairline" : ""),
        o: common_vendor.n(_ctx.variant !== "base" ? "is-" + _ctx.variant : ""),
        p: common_vendor.n(_ctx.disabled ? "is-disabled" : ""),
        q: common_vendor.n(_ctx.block ? "is-block" : ""),
        r: common_vendor.n(_ctx.loading ? "is-loading" : ""),
        s: common_vendor.n(_ctx.customClass),
        t: _ctx.hoverStartTime,
        v: _ctx.hoverStayTime,
        w: openTypeValue.value,
        x: _ctx.sendMessageTitle,
        y: _ctx.sendMessagePath,
        z: _ctx.sendMessageImg,
        A: _ctx.appParameter,
        B: _ctx.showMessageCard,
        C: _ctx.sessionFrom,
        D: _ctx.lang,
        E: _ctx.hoverStopPropagation,
        F: _ctx.scope,
        G: common_vendor.o(handleClick, "c9"),
        H: common_vendor.o(handleGetAuthorize, "5d"),
        I: common_vendor.o(handleGetUserInfo, "7f"),
        J: common_vendor.o(handleContact, "12"),
        K: common_vendor.o(handleGetPhoneNumber, "26"),
        L: common_vendor.o(handleGetRealtimePhoneNumber, "a8"),
        M: common_vendor.o(handleError, "b7"),
        N: common_vendor.o(handleLaunchApp, "bb"),
        O: common_vendor.o(handleOpenSetting, "3a"),
        P: common_vendor.o(handleChooseAvatar, "b2"),
        Q: common_vendor.o(handleAgreePrivacyAuthorization, "e8")
      });
    };
  }
});
wx.createComponent(_sfc_main);
