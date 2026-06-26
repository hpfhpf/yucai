"use strict";
const common_vendor = require("../../common/vendor.js");
const globalNotifyState = common_vendor.ref(false);
const options = common_vendor.ref();
let timer;
function useNotify() {
  function show(o) {
    clearTimeout(timer);
    options.value = o;
    globalNotifyState.value = true;
    if (options.value.duration !== false) {
      timer = setTimeout(() => {
        globalNotifyState.value = false;
      }, options.value.duration || 3e3);
    }
  }
  function hide() {
    globalNotifyState.value = false;
  }
  return {
    globalNotifyState,
    show,
    hide,
    options
  };
}
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-popup/wd-popup.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-loading/wd-loading.js";
if (!Array) {
  const _component_wd_loading = __unplugin_components_0;
  const _component_wd_icon = __unplugin_components_1;
  const _component_wd_popup = __unplugin_components_2;
  (_component_wd_loading + _component_wd_icon + _component_wd_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const {
      globalNotifyState: globalNotifyState2,
      options: options2
    } = useNotify();
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: (_a = common_vendor.unref(options2)) == null ? void 0 : _a.icon
      }, ((_b = common_vendor.unref(options2)) == null ? void 0 : _b.icon) ? common_vendor.e({
        b: common_vendor.unref(options2).icon === "loading"
      }, common_vendor.unref(options2).icon === "loading" ? {
        c: common_vendor.p({
          size: "22px"
        })
      } : {
        d: common_vendor.p({
          color: "#fff",
          name: common_vendor.unref(options2).icon,
          size: "22px"
        })
      }) : {}, {
        e: common_vendor.t((_c = common_vendor.unref(options2)) == null ? void 0 : _c.content),
        f: common_vendor.n(`global_notify_${((_d = common_vendor.unref(options2)) == null ? void 0 : _d.type) ? (_e = common_vendor.unref(options2)) == null ? void 0 : _e.type : "primary"}`),
        g: common_vendor.o(($event) => common_vendor.isRef(globalNotifyState2) ? globalNotifyState2.value = $event : null, "a0"),
        h: common_vendor.p({
          position: "top",
          ["z-index"]: 99,
          duration: 250,
          modal: false,
          modelValue: common_vendor.unref(globalNotifyState2)
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-181f64f1"]]);
wx.createComponent(Component);
