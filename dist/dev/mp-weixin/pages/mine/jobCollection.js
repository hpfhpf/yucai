"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-skeleton/wd-skeleton.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-empty/wd-empty.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
if (!Array) {
  const _component_wd_tag = __unplugin_components_0;
  const _component_wd_empty = __unplugin_components_1;
  const _component_wd_skeleton = __unplugin_components_2;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_tag + _component_wd_empty + _component_wd_skeleton + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "jobCollection",
  setup(__props) {
    const loading = common_vendor.ref(true);
    const jobs = common_vendor.ref([]);
    const skeletonRowCol = [
      { width: "40%", height: "32rpx", borderRadius: "8rpx", margin: "0 auto 24rpx" },
      { width: "100%", height: "180rpx", borderRadius: "22rpx", margin: "0 0 22rpx" },
      { width: "100%", height: "180rpx", borderRadius: "22rpx", margin: "0 0 22rpx" },
      { width: "100%", height: "180rpx", borderRadius: "22rpx", margin: "0 0 22rpx" }
    ];
    const mockJobs = [
      { id: "1", title: "会计主管", salary: "10K-12K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" },
      { id: "2", title: "工业设计师", salary: "7K-9K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" },
      { id: "3", title: "会计主管", salary: "10K-12K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" },
      { id: "4", title: "工业设计师", salary: "7K-9K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" },
      { id: "5", title: "会计主管", salary: "10K-12K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" },
      { id: "6", title: "工业设计师", salary: "7K-9K", tags: ["青羊区", "学历不限", "男女不限"], company: "连锁餐厅", time: "12:26" }
    ];
    common_vendor.onMounted(() => {
      setTimeout(() => {
        jobs.value = mockJobs;
        loading.value = false;
      }, 600);
    });
    const handleJobTap = (job) => {
      common_vendor.index.showToast({ title: job.title, icon: "none" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "职位收藏",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.t(jobs.value.length),
        c: jobs.value.length
      }, jobs.value.length ? {
        d: common_vendor.f(jobs.value, (job, k0, i0) => {
          return {
            a: common_vendor.t(job.title),
            b: common_vendor.t(job.salary),
            c: common_vendor.f(job.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag,
                c: "55d4b7cc-3-" + i0 + "-" + i1 + ",55d4b7cc-2"
              };
            }),
            d: common_vendor.t(job.company),
            e: common_vendor.t(job.time),
            f: job.id,
            g: common_vendor.o(($event) => handleJobTap(job), job.id)
          };
        }),
        e: common_vendor.p({
          size: "small"
        })
      } : {
        f: common_vendor.p({
          tip: "暂无收藏职位"
        })
      }, {
        g: common_vendor.p({
          loading: loading.value,
          animation: "gradient",
          ["row-col"]: skeletonRowCol
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-55d4b7cc"]]);
wx.createPage(MiniProgramPage);
