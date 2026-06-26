"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-tabbar/wd-tabbar.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-tabbar-item/wd-tabbar-item.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_input = __unplugin_components_1;
  const _component_wd_tabbar_item = __unplugin_components_2;
  const _component_wd_tabbar = __unplugin_components_3;
  const _component_wd_toast = __unplugin_components_4;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_input + _component_wd_tabbar_item + _component_wd_tabbar + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "talents",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("talentsToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const filterTabs = [
      { key: "all", label: "不限" },
      { key: "latest", label: "最新" },
      { key: "recommend", label: "推荐" },
      { key: "filter", label: "筛选" }
    ];
    const activeFilter = common_vendor.ref("all");
    const keyword = common_vendor.ref("");
    const activeTab = common_vendor.ref("talents");
    const candidates = common_vendor.ref([
      { id: "c1", name: "张文凯", gender: "男", age: 20, job: "服务员", district: "青羊区", education: "大专", exp: "三年", time: "5分钟前" },
      { id: "c2", name: "张文凯", gender: "男", age: 20, job: "服务员", district: "青羊区", education: "大专", exp: "三年", time: "5分钟前" },
      { id: "c3", name: "张文凯", gender: "男", age: 20, job: "服务员", district: "青羊区", education: "大专", exp: "三年", time: "5分钟前" },
      { id: "c4", name: "张文凯", gender: "男", age: 20, job: "服务员", district: "青羊区", education: "大专", exp: "三年", time: "5分钟前" }
    ]);
    const setFilter = (key) => {
      activeFilter.value = key;
      if (key === "filter")
        toast.info("打开筛选");
    };
    const handleSearchConfirm = () => {
      const text = keyword.value.trim();
      toast.info(text ? `搜索：${text}` : "请输入关键词");
    };
    const handleCandidateTap = (id) => toast.info(`候选人：${id}`);
    const handleTabChange = ({ value }) => {
      const map = {
        recommend: "推荐",
        message: "消息",
        talents: "找人",
        resume: "简历",
        mine: "个人"
      };
      toast.info(map[String(value)] || String(value));
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "找人才",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          name: "search-line",
          size: "32rpx",
          color: "rgba(0, 0, 0, 0.32)"
        }),
        c: common_vendor.o(handleSearchConfirm, "4b"),
        d: common_vendor.o(($event) => keyword.value = $event, "79"),
        e: common_vendor.p({
          compact: true,
          ["custom-class"]: "search__input",
          ["auto-complete"]: "off",
          placeholder: "请输入关键词、职位",
          modelValue: keyword.value
        }),
        f: common_vendor.f(filterTabs, (f, k0, i0) => {
          return {
            a: common_vendor.t(f.label),
            b: f.key,
            c: f.key === activeFilter.value ? 1 : "",
            d: common_vendor.o(($event) => setFilter(f.key), f.key)
          };
        }),
        g: common_vendor.f(candidates.value, (c, k0, i0) => {
          return common_vendor.e({
            a: c.avatar
          }, c.avatar ? {
            b: c.avatar
          } : {}, {
            c: common_vendor.t(c.name),
            d: common_vendor.t(c.gender),
            e: common_vendor.t(c.age),
            f: common_vendor.t(c.job),
            g: "30673314-4-" + i0 + ",30673314-0",
            h: common_vendor.t(c.district),
            i: "30673314-5-" + i0 + ",30673314-0",
            j: common_vendor.t(c.education),
            k: "30673314-6-" + i0 + ",30673314-0",
            l: common_vendor.t(c.exp),
            m: common_vendor.t(c.time),
            n: c.id,
            o: common_vendor.o(($event) => handleCandidateTap(c.id), c.id)
          });
        }),
        h: common_vendor.p({
          name: "location",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.18)"
        }),
        i: common_vendor.p({
          name: "file",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.16)"
        }),
        j: common_vendor.p({
          name: "clock-circle",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.12)"
        }),
        k: `${safeBottom.value + 140}px`,
        l: common_vendor.p({
          name: "recommend",
          title: "推荐",
          icon: "home"
        }),
        m: common_vendor.p({
          name: "message",
          title: "消息",
          icon: "message"
        }),
        n: common_vendor.w(({
          active
        }, s0, i0) => {
          return {
            a: "30673314-11-" + i0 + ",30673314-10",
            b: active ? 1 : "",
            c: i0,
            d: s0
          };
        }, {
          name: "icon",
          path: "n",
          vueId: "30673314-10,30673314-7"
        }),
        o: common_vendor.p({
          name: "user-group",
          size: "32rpx",
          color: "#fff"
        }),
        p: common_vendor.p({
          name: "talents",
          title: "找人"
        }),
        q: common_vendor.p({
          name: "resume",
          title: "简历",
          icon: "file"
        }),
        r: common_vendor.p({
          name: "mine",
          title: "个人",
          icon: "user"
        }),
        s: common_vendor.o(handleTabChange, "3a"),
        t: common_vendor.o(($event) => activeTab.value = $event, "2b"),
        v: common_vendor.p({
          fixed: true,
          bordered: true,
          ["safe-area-inset-bottom"]: true,
          ["active-color"]: "rgba(30, 91, 255, 0.98)",
          ["inactive-color"]: "rgba(0, 0, 0, 0.44)",
          ["custom-class"]: "talentsTabbar",
          modelValue: activeTab.value
        }),
        w: common_vendor.p({
          selector: "talentsToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-30673314"]]);
wx.createPage(MiniProgramPage);
