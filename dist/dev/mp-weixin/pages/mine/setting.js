"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-dialog/wd-dialog.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-cell-group/wd-cell-group.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
if (!Array) {
  const _component_wd_cell = __unplugin_components_0;
  const _component_wd_cell_group = __unplugin_components_1;
  const _component_wd_button = __unplugin_components_2;
  const _component_wd_dialog = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_cell + _component_wd_cell_group + _component_wd_button + _component_wd_dialog + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "setting",
  setup(__props) {
    const { confirm } = common_vendor.useDialog("logoutDialog");
    const userName = common_vendor.ref("Mr_Leng");
    const phone = common_vendor.ref("13319197788");
    const items = common_vendor.computed(() => [
      { key: "username", label: "用户名", value: userName.value },
      { key: "phone", label: "手机号", value: phone.value },
      { key: "password", label: "修改密码" },
      { key: "about", label: "关于我们" }
    ]);
    const handleRowTap = (key) => {
      if (key === "phone") {
        common_vendor.index.setClipboardData({
          data: phone.value,
          success: () => common_vendor.index.showToast({ title: "手机号已复制", icon: "none" }),
          fail: () => common_vendor.index.showToast({ title: "复制失败", icon: "none" })
        });
        return;
      }
      const titleMap = {
        username: "用户名",
        phone: "手机号",
        password: "修改密码",
        about: "关于我们"
      };
      common_vendor.index.showToast({ title: titleMap[key], icon: "none" });
    };
    const handleLogout = async () => {
      try {
        await confirm({
          title: "提示",
          msg: "确认退出登录？",
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        });
        try {
          common_vendor.index.removeStorageSync("token");
        } catch (_) {
        }
        common_vendor.index.showToast({ title: "已退出登录", icon: "none" });
        common_vendor.index.navigateTo({ url: "/pages/mine/index" });
      } catch (_) {
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "设置",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.f(items.value, (item, k0, i0) => {
          return {
            a: item.key,
            b: common_vendor.o(($event) => handleRowTap(item.key), item.key),
            c: "70a35df5-3-" + i0 + ",70a35df5-2",
            d: common_vendor.p({
              title: item.label,
              value: item.value || "",
              ["is-link"]: true,
              clickable: true
            })
          };
        }),
        c: common_vendor.p({
          border: true,
          ["custom-class"]: "mine-menu-group"
        }),
        d: common_vendor.o(handleLogout, "aa"),
        e: common_vendor.p({
          type: "danger",
          plain: true,
          block: true,
          ["custom-class"]: "logout-btn"
        }),
        f: common_vendor.p({
          selector: "logoutDialog"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-70a35df5"]]);
wx.createPage(MiniProgramPage);
