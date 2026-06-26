"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-popup/wd-popup.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_icon = __unplugin_components_1;
  const _component_wd_button = __unplugin_components_2;
  const _component_wd_popup = __unplugin_components_3;
  const _component_wd_toast = __unplugin_components_4;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_icon + _component_wd_button + _component_wd_popup + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "reset",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("resetToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const form = common_vendor.ref({
      avatar: "",
      name: "",
      company: "",
      nature: "",
      role: "",
      email: ""
    });
    const natureOptions = ["民营企业", "国企", "外企", "合资", "事业单位", "上市公司", "创业公司", "其他"];
    const natureShown = common_vendor.ref(false);
    const openNatureSheet = () => {
      natureShown.value = true;
    };
    const closeNatureSheet = () => {
      natureShown.value = false;
    };
    const selectNature = (v) => {
      form.value.nature = v;
      closeNatureSheet();
    };
    const handleAvatarTap = () => toast.info("选择头像");
    const isValidEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
    const validate = () => {
      if (!form.value.name.trim())
        return "请填写姓名";
      if (!form.value.company.trim())
        return "请填写公司名称";
      if (!form.value.nature.trim())
        return "请选择企业性质";
      if (!form.value.role.trim())
        return "请填写职务";
      const email = form.value.email.trim();
      if (!email || !isValidEmail(email))
        return "请填写有效邮箱";
      return "";
    };
    const handleNext = () => {
      const err = validate();
      if (err) {
        toast.info(err);
        return;
      }
      toast.info("下一步");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "添加项目经验",
          type: "show-back",
          theme: "000"
        }),
        b: form.value.avatar
      }, form.value.avatar ? {
        c: form.value.avatar
      } : {}, {
        d: common_vendor.o(handleAvatarTap, "3d"),
        e: common_vendor.o(($event) => form.value.name = $event, "e4"),
        f: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写姓名",
          modelValue: form.value.name
        }),
        g: common_vendor.o(($event) => form.value.company = $event, "fb"),
        h: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写公司名称",
          modelValue: form.value.company
        }),
        i: common_vendor.t(form.value.nature || "请选择企业性质"),
        j: !form.value.nature ? 1 : "",
        k: common_vendor.p({
          name: "arrow-down",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        l: common_vendor.o(openNatureSheet, "9e"),
        m: common_vendor.o(($event) => form.value.role = $event, "ce"),
        n: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写职务",
          modelValue: form.value.role
        }),
        o: common_vendor.o(($event) => form.value.email = $event, "c9"),
        p: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写接收简历邮箱",
          modelValue: form.value.email
        }),
        q: `${safeBottom.value + 160}px`,
        r: common_vendor.o(handleNext, "07"),
        s: common_vendor.p({
          type: "primary",
          block: true,
          ["custom-class"]: "nextBtn"
        }),
        t: `${safeBottom.value}px`,
        v: common_vendor.f(natureOptions, (opt, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(opt),
            b: form.value.nature === opt
          }, form.value.nature === opt ? {
            c: "e5fffb77-9-" + i0 + ",e5fffb77-8",
            d: common_vendor.p({
              name: "check",
              size: "28rpx",
              color: "rgba(30, 91, 255, 0.92)"
            })
          } : {}, {
            e: opt,
            f: common_vendor.o(($event) => selectNature(opt), opt)
          });
        }),
        w: common_vendor.o(closeNatureSheet, "ee"),
        x: common_vendor.p({
          plain: true,
          block: true,
          ["custom-class"]: "sheetCancelBtn"
        }),
        y: common_vendor.o(($event) => natureShown.value = $event, "51"),
        z: common_vendor.p({
          position: "bottom",
          ["close-on-click-modal"]: true,
          ["custom-style"]: "border-radius: 22rpx 22rpx 0 0; background: rgba(255, 255, 255, 0.98);",
          modelValue: natureShown.value
        }),
        A: common_vendor.p({
          selector: "resetToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e5fffb77"]]);
wx.createPage(MiniProgramPage);
