"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-steps/wd-steps.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-step/wd-step.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_step = __unplugin_components_1;
  const _component_wd_steps = __unplugin_components_2;
  const _component_wd_button = __unplugin_components_3;
  const _component_wd_toast = __unplugin_components_4;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_step + _component_wd_steps + _component_wd_button + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "resumeCenter",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("resumeCenterToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const profile = common_vendor.ref({
      name: "张文凯",
      role: "职场人士",
      phone: "18080814854",
      avatar: "",
      summary: "忠实诚信,讲原则, 说到做到, 决不推卸责任; 有自制力, 做事情始终坚持有始有终, 从不半途而废; 肯学习,有问题不..."
    });
    const education = common_vendor.ref({
      school: "中国科技大学",
      range: "2007年9月~2009年7月"
    });
    const work = common_vendor.ref([
      { company: "北京网聘咨询有限公司", range: "2010年10月-至今", title: "高级软件工程师" },
      { company: "北京网聘咨询有限公司", range: "2010年10月-至今", title: "高级软件工程师" }
    ]);
    const projects = common_vendor.ref([
      { name: "C端APP优化", role: "高级软件工程师" },
      { name: "B端APP优化", role: "高级软件工程师" }
    ]);
    const handleEdit = () => toast.info("编辑简历");
    const handleShare = () => toast.info("分享");
    const handleReject = () => toast.info("不合适");
    const handleAskResume = () => toast.info("索要简历");
    const handleInvite = () => toast.info("通知面试");
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "简历详情",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.t(profile.value.name),
        c: common_vendor.p({
          name: "edit",
          size: "24rpx",
          color: "rgba(30, 91, 255, 0.92)"
        }),
        d: common_vendor.o(handleEdit, "dc"),
        e: common_vendor.t(profile.value.role),
        f: common_vendor.p({
          name: "phone",
          size: "20rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        g: common_vendor.t(profile.value.phone),
        h: profile.value.avatar
      }, profile.value.avatar ? {
        i: profile.value.avatar
      } : {}, {
        j: common_vendor.t(profile.value.summary),
        k: common_vendor.t(education.value.school),
        l: common_vendor.t(education.value.range),
        m: common_vendor.f(work.value, (w, k0, i0) => {
          return {
            a: common_vendor.t(w.company),
            b: common_vendor.t(w.range),
            c: common_vendor.t(w.title),
            d: w.company + w.range,
            e: "c5b3bf2e-5-" + i0 + ",c5b3bf2e-4"
          };
        }),
        n: common_vendor.p({
          status: "finished"
        }),
        o: common_vendor.p({
          vertical: true,
          active: work.value.length,
          ["custom-class"]: "timelineSteps"
        }),
        p: common_vendor.f(projects.value, (p, k0, i0) => {
          return {
            a: common_vendor.t(p.name),
            b: common_vendor.t(p.role),
            c: p.name + p.role,
            d: "c5b3bf2e-7-" + i0 + ",c5b3bf2e-6"
          };
        }),
        q: common_vendor.p({
          status: "finished"
        }),
        r: common_vendor.p({
          vertical: true,
          active: projects.value.length,
          ["custom-class"]: "timelineSteps"
        }),
        s: `${safeBottom.value + 140}px`,
        t: common_vendor.p({
          name: "share",
          size: "28rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        v: common_vendor.o(handleShare, "6c"),
        w: common_vendor.p({
          name: "close",
          size: "28rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        x: common_vendor.o(handleReject, "a8"),
        y: common_vendor.o(handleAskResume, "37"),
        z: common_vendor.p({
          plain: true,
          ["custom-class"]: "actionBtn actionBtn--ghost"
        }),
        A: common_vendor.o(handleInvite, "01"),
        B: common_vendor.p({
          type: "primary",
          ["custom-class"]: "actionBtn actionBtn--primary"
        }),
        C: `${safeBottom.value}px`,
        D: common_vendor.p({
          selector: "resumeCenterToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c5b3bf2e"]]);
wx.createPage(MiniProgramPage);
