"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-tabs/wd-tabs.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-tab/wd-tab.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
if (!Array) {
  const _component_wd_tag = __unplugin_components_0;
  const _component_wd_tab = __unplugin_components_1;
  const _component_wd_tabs = __unplugin_components_2;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_tag + _component_wd_tab + _component_wd_tabs + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "submitted",
  setup(__props) {
    const activeTab = common_vendor.ref("success");
    const successList = common_vendor.ref([
      { id: "s1", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "s2", name: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "s3", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "s4", name: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "s5", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" }
    ]);
    const viewedList = common_vendor.ref([
      { id: "v1", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "v2", name: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "v3", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "v4", name: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "v5", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" }
    ]);
    const handleTabChange = ({ name }) => {
      activeTab.value = name;
    };
    const handleJobTap = (id) => {
      common_vendor.index.showToast({ title: `投递：${id}`, icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "我的投递",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.f(successList.value, (job, k0, i0) => {
          return {
            a: common_vendor.t(job.name),
            b: common_vendor.t(job.salary),
            c: common_vendor.t(job.district),
            d: "55c148b3-4-" + i0 + ",55c148b3-3",
            e: common_vendor.t(job.education),
            f: "55c148b3-5-" + i0 + ",55c148b3-3",
            g: common_vendor.t(job.gender),
            h: "55c148b3-6-" + i0 + ",55c148b3-3",
            i: common_vendor.t(job.company),
            j: common_vendor.t(job.time),
            k: job.id,
            l: common_vendor.o(($event) => handleJobTap(job.id), job.id)
          };
        }),
        c: common_vendor.p({
          size: "small"
        }),
        d: common_vendor.p({
          size: "small"
        }),
        e: common_vendor.p({
          size: "small"
        }),
        f: common_vendor.p({
          title: "投递成功",
          name: "success"
        }),
        g: common_vendor.f(viewedList.value, (job, k0, i0) => {
          return {
            a: common_vendor.t(job.name),
            b: common_vendor.t(job.salary),
            c: common_vendor.t(job.district),
            d: "55c148b3-8-" + i0 + ",55c148b3-7",
            e: common_vendor.t(job.education),
            f: "55c148b3-9-" + i0 + ",55c148b3-7",
            g: common_vendor.t(job.gender),
            h: "55c148b3-10-" + i0 + ",55c148b3-7",
            i: common_vendor.t(job.company),
            j: common_vendor.t(job.time),
            k: job.id,
            l: common_vendor.o(($event) => handleJobTap(job.id), job.id)
          };
        }),
        h: common_vendor.p({
          size: "small"
        }),
        i: common_vendor.p({
          size: "small"
        }),
        j: common_vendor.p({
          size: "small"
        }),
        k: common_vendor.p({
          title: "已查看",
          name: "viewed"
        }),
        l: common_vendor.o(handleTabChange, "2d"),
        m: common_vendor.o(($event) => activeTab.value = $event, "c6"),
        n: common_vendor.p({
          ["line-theme"]: "normal",
          ["line-width"]: 32,
          ["line-height"]: 5,
          ["custom-class"]: "submitted-tabs",
          modelValue: activeTab.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55c148b3"]]);
wx.createPage(MiniProgramPage);
