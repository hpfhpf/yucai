"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_button = __unplugin_components_1;
  const _component_wd_tag = __unplugin_components_2;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_button + _component_wd_tag + _component_global_ku_root)();
}
if (!Math) {
  (HeaderNav + BottomNav)();
}
const BottomNav = () => "../../components/BottomNav.js";
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const banners = common_vendor.ref([
      { id: "b1", title: "智聚未来\nAI共生", sub: "2026全球\n互联网招聘峰会", cta: "对话下一代科技革命" },
      { id: "b2", title: "数字人才\n新机遇", sub: "新质生产力\n岗位精选", cta: "即刻查看热门职位" },
      { id: "b3", title: "春招冲刺\n好工作", sub: "更多高薪\n上新中", cta: "一键投递更高效" }
    ]);
    const bannerIndex = common_vendor.ref(0);
    const quickItems = common_vendor.ref([
      { key: "fulltime", label: "全职职位" },
      { key: "parttime", label: "兼职职位" },
      { key: "deliveries", label: "我的投递" },
      { key: "credit", label: "企业信用" }
    ]);
    const jobs = common_vendor.ref([
      {
        id: "j1",
        name: "会计主管",
        salary: "10K-12K",
        district: "青羊区",
        education: "学历不限",
        gender: "男女不限",
        company: "连锁餐厅",
        time: "12:26发布"
      },
      {
        id: "j2",
        name: "工业设计师",
        salary: "7K-9K",
        district: "青羊区",
        education: "学历不限",
        gender: "男女不限",
        company: "连锁餐厅",
        time: "12:26发布"
      },
      {
        id: "j3",
        name: "会计主管",
        salary: "10K-12K",
        district: "青羊区",
        education: "学历不限",
        gender: "男女不限",
        company: "连锁餐厅",
        time: "12:26发布"
      },
      {
        id: "j4",
        name: "行政前台",
        salary: "6K-8K",
        district: "武侯区",
        education: "大专",
        gender: "女",
        company: "连锁餐厅",
        time: "11:40发布"
      },
      {
        id: "j5",
        name: "人事专员",
        salary: "5K-7K",
        district: "锦江区",
        education: "学历不限",
        gender: "男女不限",
        company: "连锁餐厅",
        time: "10:18发布"
      }
    ]);
    const seed = common_vendor.ref(0);
    const visibleJobs = common_vendor.computed(() => {
      const start = seed.value % jobs.value.length;
      const list = [...jobs.value.slice(start), ...jobs.value.slice(0, start)];
      return list.slice(0, 5);
    });
    const handleSearchTap = () => {
    };
    const handleSearchConfirm = () => {
      const text = keyword.value.trim();
      common_vendor.index.showToast({ title: text ? `搜索：${text}` : "请输入关键词", icon: "none" });
    };
    const handleBannerChange = (e) => {
      var _a;
      bannerIndex.value = ((_a = e == null ? void 0 : e.detail) == null ? void 0 : _a.current) || 0;
    };
    const handleQuickTap = (key) => {
      var _a;
      const label = ((_a = quickItems.value.find((x) => x.key === key)) == null ? void 0 : _a.label) || "已点击";
      common_vendor.index.showToast({ title: label, icon: "none" });
    };
    const handleRefresh = () => {
      seed.value += 1;
    };
    const handleJobTap = (id) => {
      common_vendor.index.showToast({ title: `职位：${id}`, icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "首页",
          type: "seeker-index",
          theme: "FFF"
        }),
        b: common_vendor.o(handleSearchConfirm, "c9"),
        c: common_vendor.o(($event) => keyword.value = $event, "4c"),
        d: common_vendor.p({
          ["auto-complete"]: "off",
          placeholder: "请输入关键词、职位",
          modelValue: keyword.value
        }),
        e: common_vendor.o(handleSearchTap, "67"),
        f: common_vendor.f(banners.value, (b, k0, i0) => {
          return {
            a: common_vendor.t(b.title),
            b: common_vendor.t(b.sub),
            c: common_vendor.t(b.cta),
            d: b.id
          };
        }),
        g: bannerIndex.value,
        h: common_vendor.o(handleBannerChange, "de"),
        i: common_vendor.f(banners.value, (_, i, i0) => {
          return {
            a: i,
            b: i === bannerIndex.value ? 1 : ""
          };
        }),
        j: common_vendor.f(quickItems.value, (item, k0, i0) => {
          return {
            a: common_vendor.n(`${item.key} quick__icon`),
            b: common_vendor.t(item.label),
            c: item.key,
            d: common_vendor.o(($event) => handleQuickTap(item.key), item.key)
          };
        }),
        k: common_vendor.o(handleRefresh, "14"),
        l: common_vendor.p({
          type: "primary",
          plain: true,
          size: "small"
        }),
        m: common_vendor.f(visibleJobs.value, (job, k0, i0) => {
          return {
            a: common_vendor.t(job.name),
            b: common_vendor.t(job.salary),
            c: common_vendor.t(job.district),
            d: "e36b26c6-4-" + i0 + ",e36b26c6-0",
            e: common_vendor.t(job.education),
            f: "e36b26c6-5-" + i0 + ",e36b26c6-0",
            g: common_vendor.t(job.gender),
            h: "e36b26c6-6-" + i0 + ",e36b26c6-0",
            i: common_vendor.t(job.company),
            j: common_vendor.t(job.time),
            k: job.id,
            l: common_vendor.o(($event) => handleJobTap(job.id), job.id)
          };
        }),
        n: common_vendor.p({
          size: "small"
        }),
        o: common_vendor.p({
          size: "small"
        }),
        p: common_vendor.p({
          size: "small"
        }),
        q: common_vendor.p({
          ["active-index"]: 0,
          ["theme-color"]: "#0f5bff"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e36b26c6"]]);
wx.createPage(MiniProgramPage);
