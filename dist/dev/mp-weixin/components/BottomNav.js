"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "BottomNav",
  props: {
    activeIndex: { default: 0 },
    themeColor: { default: "#0f5bff" },
    badges: {}
  },
  emits: ["change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const items = [
      { key: "home", label: "首页", path: "/pages/seeker/index" },
      { key: "message", label: "消息", path: "/pages/message/index" },
      { key: "resume", label: "简历中心", path: "/pages/seeker/resumeCenter/index" },
      { key: "mine", label: "我的", path: "/pages/mine/index" }
    ];
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const navStyle = common_vendor.computed(() => ({ "--bottom-nav-active": props.themeColor }));
    const badgeValue = (idx) => {
      var _a2;
      return (_a2 = props.badges) == null ? void 0 : _a2[idx];
    };
    const showBadge = (idx) => Boolean(badgeValue(idx));
    const iconColor = (idx, key) => idx === props.activeIndex ? `icons ${key} active` : `icons ${key}`;
    const handleTap = (item, idx) => {
      if (idx === props.activeIndex)
        return;
      emit("change", idx);
      common_vendor.index.navigateTo({ url: item.path });
    };
    __expose({});
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(items, (item, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.n(`${iconColor(idx, item.key)}`),
            b: showBadge(idx)
          }, showBadge(idx) ? common_vendor.e({
            c: badgeValue(idx) !== true
          }, badgeValue(idx) !== true ? {
            d: common_vendor.t(badgeValue(idx))
          } : {}, {
            e: badgeValue(idx) === true ? 1 : ""
          }) : {}, {
            f: common_vendor.t(item.label),
            g: item.label,
            h: idx === _ctx.activeIndex ? 1 : "",
            i: common_vendor.o(($event) => handleTap(item, idx), item.label)
          });
        }),
        b: common_vendor.s(navStyle.value),
        c: `${safeBottom.value}px`
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-efa6c68b"]]);
wx.createComponent(Component);
