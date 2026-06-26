"use strict";
const common_vendor = require("../../../common/vendor.js");
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_tag = __unplugin_components_1;
  const _component_wd_toast = __unplugin_components_2;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_tag + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "company",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("companyToast");
    const job = common_vendor.ref({
      title: "前台财务",
      city: "成都",
      district: "高新区",
      education: "学历不限",
      exp: "2年"
    });
    const company = common_vendor.ref({
      name: "连锁餐厅",
      cover: "",
      address: "成都市·高新区·泰达时代中心一号楼14层",
      intro: "公司概况这里可以包括注册时间,注册资本,公司性质,技术力量规模,员工人数,员工素质等;"
    });
    const levelLabels = common_vendor.ref([
      { key: "poor", label: "较差" },
      { key: "mid", label: "中等" },
      { key: "good", label: "良好" },
      { key: "great", label: "优秀" },
      { key: "best", label: "极好" }
    ]);
    const tickValues = common_vendor.ref([220, 350, 500, 650, 800, 1e3]);
    const activeLevelIndex = common_vendor.ref(3);
    const activePercent = common_vendor.computed(() => {
      const count = Math.max(levelLabels.value.length, 1);
      return (activeLevelIndex.value + 0.5) / count * 100;
    });
    const activeTickIndex = common_vendor.computed(() => {
      return Math.min(Math.max(activeLevelIndex.value + 1, 0), tickValues.value.length - 1);
    });
    const setLevel = (idx) => {
      if (!Number.isFinite(idx))
        return;
      const next = Math.min(Math.max(Math.floor(idx), 0), levelLabels.value.length - 1);
      activeLevelIndex.value = next;
    };
    const setLevelFromTick = (tickIndex) => {
      if (!Number.isFinite(tickIndex))
        return;
      setLevel(tickIndex - 1);
    };
    const introExpanded = common_vendor.ref(false);
    const toggleIntro = () => {
      introExpanded.value = !introExpanded.value;
    };
    const openJobs = common_vendor.ref([
      { id: "j1", title: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", time: "12:26发布" },
      { id: "j2", title: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", time: "12:26发布" }
    ]);
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const handlePhotoTap = () => toast.info("查看图片");
    const handleAddressTap = () => toast.info("打开地图");
    const handleJobTap = (id) => toast.info(`职位：${id}`);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "公司详情",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.t(job.value.title),
        c: common_vendor.p({
          name: "location",
          size: "22rpx",
          ["custom-style"]: "margin-right: 4rpx"
        }),
        d: common_vendor.t(job.value.city),
        e: common_vendor.t(job.value.district),
        f: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag metaTag--pin"
        }),
        g: common_vendor.t(job.value.education),
        h: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag"
        }),
        i: common_vendor.t(job.value.exp),
        j: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag"
        }),
        k: common_vendor.f(levelLabels.value, (lv, idx, i0) => {
          return {
            a: common_vendor.t(lv.label),
            b: lv.key,
            c: idx === activeLevelIndex.value ? 1 : "",
            d: common_vendor.o(($event) => setLevel(idx), lv.key)
          };
        }),
        l: `${activePercent.value}%`,
        m: common_vendor.f(tickValues.value, (v, idx, i0) => {
          return {
            a: idx <= activeTickIndex.value ? 1 : "",
            b: v,
            c: `${idx / (tickValues.value.length - 1) * 100}%`,
            d: common_vendor.o(($event) => setLevelFromTick(idx), v)
          };
        }),
        n: `${activePercent.value}%`,
        o: common_vendor.o(($event) => setLevel(activeLevelIndex.value), "78"),
        p: common_vendor.f(tickValues.value, (v, idx, i0) => {
          return {
            a: common_vendor.t(v),
            b: v,
            c: `${idx / (tickValues.value.length - 1) * 100}%`
          };
        }),
        q: company.value.cover
      }, company.value.cover ? {
        r: company.value.cover
      } : {}, {
        s: common_vendor.o(handlePhotoTap, "13"),
        t: common_vendor.t(introExpanded.value ? "收起" : "查看全部"),
        v: common_vendor.o(toggleIntro, "3a"),
        w: common_vendor.t(company.value.intro),
        x: !introExpanded.value ? 1 : "",
        y: common_vendor.t(company.value.address),
        z: common_vendor.p({
          name: "arrow-right",
          size: "28rpx",
          color: "rgba(0, 0, 0, 0.28)"
        }),
        A: common_vendor.o(handleAddressTap, "26"),
        B: common_vendor.f(openJobs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.salary),
            c: common_vendor.t(item.district),
            d: "973c3fbf-7-" + i0 + ",973c3fbf-0",
            e: common_vendor.t(item.education),
            f: "973c3fbf-8-" + i0 + ",973c3fbf-0",
            g: common_vendor.t(item.gender),
            h: "973c3fbf-9-" + i0 + ",973c3fbf-0",
            i: common_vendor.t(item.time),
            j: item.id,
            k: common_vendor.o(($event) => handleJobTap(item.id), item.id)
          };
        }),
        C: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        D: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        E: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        F: common_vendor.t(company.value.name),
        G: `${safeBottom.value + 32}px`,
        H: common_vendor.p({
          selector: "companyToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-973c3fbf"]]);
wx.createPage(MiniProgramPage);
