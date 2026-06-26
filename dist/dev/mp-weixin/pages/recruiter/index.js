"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_input = __unplugin_components_1;
  const _component_wd_tag = __unplugin_components_2;
  const _component_wd_toast = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_input + _component_wd_tag + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  (HeaderNav + BottomNav)();
}
const BottomNav = () => "../../components/BottomNav.js";
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("recruiterToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const keyword = common_vendor.ref("");
    const banners = common_vendor.ref([
      { id: "b1", title: "智聚未来\nAI共生", sub: "2026全球\n互联网招聘峰会", cta: "对话下一代科技革命" },
      { id: "b2", title: "数字人才\n新机遇", sub: "新质生产力\n岗位精选", cta: "即刻查看热门职位" },
      { id: "b3", title: "春招冲刺\n好工作", sub: "更多高薪\n上新中", cta: "一键投递更高效" }
    ]);
    const bannerIndex = common_vendor.ref(0);
    const people = common_vendor.ref([
      { id: "p1", name: "张文凯", role: "前台行政", time: "10分钟前", exp: "三年", edu: "大专", loc: "成都·青羊区" },
      { id: "p2", name: "张文凯", role: "前台行政", time: "10分钟前", exp: "三年", edu: "大专", loc: "成都·青羊区" },
      { id: "p3", name: "张文凯", role: "前台行政", time: "10分钟前", exp: "三年", edu: "大专", loc: "成都·青羊区" }
    ]);
    const newsSeed = common_vendor.ref(0);
    const refreshing = common_vendor.ref(false);
    const newsAll = common_vendor.ref([
      { id: "n1", title: "职业信用分对企业的好处", desc: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状。" },
      { id: "n2", title: "职业信用分对企业的好处", desc: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状。" },
      { id: "n3", title: "职业信用分对企业的好处", desc: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状。" },
      { id: "n4", title: "职业信用分对企业的好处", desc: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状。" }
    ]);
    const news = common_vendor.computed(() => {
      const list = newsAll.value;
      if (list.length === 0)
        return [];
      const start = newsSeed.value % list.length;
      const rotated = [...list.slice(start), ...list.slice(0, start)];
      return rotated.slice(0, 3);
    });
    const handleSearchTap = () => {
    };
    const handleSearchConfirm = () => {
      const text = keyword.value.trim();
      toast.info(text ? `搜索：${text}` : "请输入关键词");
    };
    const handleBannerChange = (e) => {
      var _a2;
      bannerIndex.value = ((_a2 = e == null ? void 0 : e.detail) == null ? void 0 : _a2.current) || 0;
    };
    const handleRefresh = () => {
      newsSeed.value += 1;
      refreshing.value = true;
      setTimeout(() => {
        refreshing.value = false;
      }, 420);
    };
    const handlePersonTap = (id) => toast.info(`查看：${id}`);
    const handleNewsTap = (id) => toast.info(`资讯：${id}`);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "首页",
          type: "seeker-index",
          theme: "FFF"
        }),
        b: common_vendor.p({
          name: "search",
          size: "32rpx",
          color: "rgba(255, 255, 255, 0.92)"
        }),
        c: common_vendor.o(handleSearchConfirm, "e4"),
        d: common_vendor.o(($event) => keyword.value = $event, "39"),
        e: common_vendor.p({
          compact: true,
          ["custom-class"]: "search__input",
          ["auto-complete"]: "off",
          placeholder: "请输入关键词、职位",
          modelValue: keyword.value
        }),
        f: common_vendor.o(handleSearchTap, "67"),
        g: common_vendor.f(banners.value, (b, k0, i0) => {
          return {
            a: common_vendor.t(b.title),
            b: common_vendor.t(b.sub),
            c: common_vendor.t(b.cta),
            d: b.id
          };
        }),
        h: bannerIndex.value,
        i: common_vendor.o(handleBannerChange, "45"),
        j: common_vendor.f(banners.value, (_, i, i0) => {
          return {
            a: i,
            b: i === bannerIndex.value ? 1 : ""
          };
        }),
        k: refreshing.value ? 1 : "",
        l: common_vendor.p({
          name: "refresh",
          size: "26rpx",
          color: "rgba(0, 0, 0, 0.34)"
        }),
        m: common_vendor.o(handleRefresh, "b8"),
        n: common_vendor.f(people.value, (p, k0, i0) => {
          return common_vendor.e({
            a: p.avatar
          }, p.avatar ? {
            b: p.avatar
          } : {}, {
            c: common_vendor.t(p.name),
            d: common_vendor.t(p.role),
            e: common_vendor.t(p.time),
            f: "575389e2-6-" + i0 + "," + ("575389e2-5-" + i0),
            g: common_vendor.t(p.exp),
            h: "575389e2-5-" + i0 + ",575389e2-0",
            i: "575389e2-8-" + i0 + "," + ("575389e2-7-" + i0),
            j: common_vendor.t(p.edu),
            k: "575389e2-7-" + i0 + ",575389e2-0",
            l: "575389e2-10-" + i0 + "," + ("575389e2-9-" + i0),
            m: common_vendor.t(p.loc),
            n: "575389e2-9-" + i0 + ",575389e2-0",
            o: p.id,
            p: common_vendor.o(($event) => handlePersonTap(p.id), p.id)
          });
        }),
        o: common_vendor.p({
          name: "clock",
          size: "20rpx",
          ["custom-style"]: "margin-right: 4rpx"
        }),
        p: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "factTag factTag--exp"
        }),
        q: common_vendor.p({
          name: "read",
          size: "20rpx",
          ["custom-style"]: "margin-right: 4rpx"
        }),
        r: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "factTag factTag--edu"
        }),
        s: common_vendor.p({
          name: "location",
          size: "20rpx",
          ["custom-style"]: "margin-right: 4rpx"
        }),
        t: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "factTag factTag--loc"
        }),
        v: refreshing.value ? 1 : "",
        w: common_vendor.p({
          name: "refresh",
          size: "26rpx",
          color: "rgba(0, 0, 0, 0.34)"
        }),
        x: common_vendor.o(handleRefresh, "64"),
        y: common_vendor.f(news.value, (n, k0, i0) => {
          return common_vendor.e({
            a: n.cover
          }, n.cover ? {
            b: n.cover
          } : {}, {
            c: common_vendor.t(n.title),
            d: common_vendor.t(n.desc),
            e: n.id,
            f: common_vendor.o(($event) => handleNewsTap(n.id), n.id)
          });
        }),
        z: `${safeBottom.value + 120}px`,
        A: common_vendor.p({
          ["active-index"]: 0,
          ["theme-color"]: "#0f5bff"
        }),
        B: common_vendor.p({
          selector: "recruiterToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-575389e2"]]);
wx.createPage(MiniProgramPage);
