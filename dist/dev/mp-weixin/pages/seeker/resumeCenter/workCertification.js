"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Array) {
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  _component_global_ku_root();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "workCertification",
  setup(__props) {
    var _a;
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(systemInfo.statusBarHeight || 0);
    const navBarHeight = common_vendor.ref(44);
    const capsuleWidth = common_vendor.ref(88);
    const capsuleHeight = common_vendor.ref(32);
    const capsuleRight = common_vendor.ref(12);
    const safeBottom = common_vendor.ref(((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
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
        "--status-bar": `${statusBarHeight.value}px`,
        "--nav-bar": `${navBarHeight.value}px`,
        "--nav-total": `${total}px`,
        "--capsule-width": `${capsuleWidth.value}px`,
        "--capsule-height": `${capsuleHeight.value}px`,
        "--capsule-right": `${capsuleRight.value}px`
      };
    });
    const items = common_vendor.ref([
      { id: "w1", title: "工作经历1", company: "北京网聘咨询有限公司", range: "2010年10月–2022年11月" },
      { id: "w2", title: "工作经历2", company: "北京网聘咨询有限公司", range: "2010年10月–2022年11月" }
    ]);
    const letterPreview = common_vendor.ref("我非常荣幸推荐王芳女士应聘贵公司后端开发工程师职位。作为她在 XX 科技的技术主管，我与她共事两年…");
    const handleItemTap = (id) => {
      common_vendor.index.showToast({ title: `查看：${id}`, icon: "none" });
    };
    const handleEdit = (id) => {
      common_vendor.index.showToast({ title: `编辑：${id}`, icon: "none" });
    };
    const handleLetterTap = () => {
      common_vendor.index.showToast({ title: "查看推荐信", icon: "none" });
    };
    const handleLetterEdit = () => {
      common_vendor.index.showToast({ title: "编辑推荐信", icon: "none" });
    };
    const handleBack = () => {
      const pages = typeof getCurrentPages === "function" && getCurrentPages() || [];
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/recruiter/resumeCenter/index" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleBack, "44"),
        b: `${statusBarHeight.value}px`,
        c: common_vendor.f(items.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.o(($event) => handleEdit(item.id), item.id),
            c: common_vendor.t(item.company),
            d: common_vendor.t(item.range),
            e: item.id,
            f: common_vendor.o(($event) => handleItemTap(item.id), item.id)
          };
        }),
        d: common_vendor.o(handleLetterEdit, "9d"),
        e: common_vendor.t(letterPreview.value),
        f: common_vendor.o(handleLetterTap, "55"),
        g: `${safeBottom.value + 44}px`,
        h: common_vendor.s(navCssVars.value)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b640cd86"]]);
wx.createPage(MiniProgramPage);
