"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_route = require("../../utils/route.js");
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-cell-group/wd-cell-group.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
if (!Array) {
  const _component_wd_tag = __unplugin_components_0;
  const _component_wd_cell = __unplugin_components_1;
  const _component_wd_cell_group = __unplugin_components_2;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_tag + _component_wd_cell + _component_wd_cell_group + _component_global_ku_root)();
}
if (!Math) {
  (HeaderNav + BottomNav)();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const BottomNav = () => "../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const isLoggedIn = common_vendor.ref(true);
    const userName = common_vendor.ref("Mr_Leng先生");
    const quickActions = [
      { key: "deliver", label: "投递记录" },
      { key: "favorite", label: "职位收藏" }
    ];
    const menuItems = [
      { key: "interview", label: "面试须知" },
      { key: "credit", label: "信用异议" },
      { key: "setting", label: "设置" },
      { key: "feedback", label: "意见反馈" }
    ];
    const handleLoginTap = () => {
      common_vendor.index.showToast({ title: "请先登录", icon: "none" });
    };
    const handleQuickTap = (key) => {
      if (key === "deliver") {
        utils_route.goPageSubmitted();
      } else if (key === "favorite") {
        utils_route.goPageJobCollection();
      } else {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
      }
    };
    const handleMenuTap = (key) => {
      if (key === "setting") {
        utils_route.goPageSetting();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "个人中心",
          type: "show-back",
          theme: "FFF"
        }),
        b: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        c: common_vendor.o(handleLoginTap, "31")
      } : {
        d: common_vendor.t(userName.value || "用户"),
        e: common_vendor.o(common_vendor.unref(utils_route.goPageVerification), "c8"),
        f: common_vendor.p({
          type: "warning",
          round: true
        }),
        g: common_vendor.o(common_vendor.unref(utils_route.goPageCertificate), "7b"),
        h: common_vendor.p({
          type: "warning",
          round: true
        }),
        i: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(utils_route.goPageChangePhone) && common_vendor.unref(utils_route.goPageChangePhone)(...args),
          "ee"
        )
      }, {
        j: common_vendor.f(quickActions, (item, k0, i0) => {
          return {
            a: common_vendor.n(item.key),
            b: common_vendor.n(`quick__icon--${item.key}`),
            c: common_vendor.t(item.label),
            d: item.key,
            e: common_vendor.o(($event) => handleQuickTap(item.key), item.key)
          };
        }),
        k: common_vendor.f(menuItems, (item, k0, i0) => {
          return {
            a: common_vendor.n(`cell-icon--${item.key}`),
            b: item.key,
            c: common_vendor.o(($event) => handleMenuTap(item.key), item.key),
            d: "9023ef44-5-" + i0 + ",9023ef44-4",
            e: common_vendor.p({
              title: item.label,
              ["is-link"]: true,
              clickable: true
            })
          };
        }),
        l: common_vendor.p({
          border: true,
          ["custom-class"]: "mine-menu-group"
        }),
        m: common_vendor.p({
          ["active-index"]: 3,
          ["theme-color"]: "#0f5bff"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9023ef44"]]);
wx.createPage(MiniProgramPage);
