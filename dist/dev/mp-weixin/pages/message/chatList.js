"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  _component_global_ku_root();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "chatList",
  setup(__props) {
    const activeTab = common_vendor.ref("chat");
    const inviteList = [
      {
        id: "i1",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i2",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i3",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i4",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i5",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      }
    ];
    const chatList = [
      {
        id: "c1",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      },
      {
        id: "c2",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      },
      {
        id: "c3",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      },
      {
        id: "c4",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      },
      {
        id: "c5",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      },
      {
        id: "c6",
        title: "连锁餐厅",
        sub: "我觉得你非常合适我司的行政前台...",
        meta: "",
        hint: "",
        time: "09:41"
      }
    ];
    const currentList = common_vendor.computed(() => activeTab.value === "invite" ? inviteList : chatList);
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(systemInfo.statusBarHeight || 0);
    const navBarHeight = common_vendor.ref(44);
    const capsuleWidth = common_vendor.ref(88);
    const capsuleHeight = common_vendor.ref(32);
    const capsuleRight = common_vendor.ref(12);
    {
      if (typeof common_vendor.wx$1 !== "undefined" && typeof common_vendor.wx$1.getMenuButtonBoundingClientRect === "function") {
        const rect = common_vendor.wx$1.getMenuButtonBoundingClientRect();
        if (rect) {
          capsuleWidth.value = rect.width;
          capsuleHeight.value = rect.height;
          capsuleRight.value = systemInfo.windowWidth - rect.right;
          const gap = rect.top - statusBarHeight.value;
          navBarHeight.value = rect.height + gap * 2;
        }
      }
    }
    const navCssVars = common_vendor.computed(() => {
      const total = statusBarHeight.value + navBarHeight.value;
      return {
        "--nav-total": `${total}px`,
        "--nav-bar": `${navBarHeight.value}px`,
        "--capsule-width": `${capsuleWidth.value}px`,
        "--capsule-height": `${capsuleHeight.value}px`,
        "--capsule-right": `${capsuleRight.value}px`
      };
    });
    const handleBack = () => {
      const pages = typeof getCurrentPages === "function" && getCurrentPages() || [];
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/seeker/index" });
    };
    const handleItemTap = (item) => {
      common_vendor.index.showToast({ title: item.title, icon: "none" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBack, "44"),
        b: `${statusBarHeight.value}px`,
        c: activeTab.value === "invite"
      }, activeTab.value === "invite" ? {} : {}, {
        d: activeTab.value === "invite" ? 1 : "",
        e: common_vendor.o(($event) => activeTab.value = "invite", "0d"),
        f: activeTab.value === "chat"
      }, activeTab.value === "chat" ? {} : {}, {
        g: activeTab.value === "chat" ? 1 : "",
        h: common_vendor.o(($event) => activeTab.value = "chat", "be"),
        i: common_vendor.f(currentList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar
          }, item.avatar ? {
            b: item.avatar
          } : {}, {
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.sub),
            e: item.meta
          }, item.meta ? {
            f: common_vendor.t(item.meta)
          } : {}, {
            g: item.hint
          }, item.hint ? {
            h: common_vendor.t(item.hint)
          } : {}, {
            i: common_vendor.t(item.time),
            j: item.id,
            k: common_vendor.o(($event) => handleItemTap(item), item.id)
          });
        }),
        j: common_vendor.s(navCssVars.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-75e736f7"]]);
wx.createPage(MiniProgramPage);
