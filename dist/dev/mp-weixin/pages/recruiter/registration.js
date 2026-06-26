"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-textarea/wd-textarea.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_input = __unplugin_components_1;
  const _component_wd_textarea = __unplugin_components_2;
  const _component_wd_button = __unplugin_components_3;
  const _component_wd_toast = __unplugin_components_4;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_input + _component_wd_textarea + _component_wd_button + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "registration",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("registrationToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const tipVisible = common_vendor.ref(true);
    const form = common_vendor.ref({
      idFront: "",
      idBack: "",
      realName: "",
      idNo: "",
      license: "",
      intro: "",
      photos: []
    });
    const mockSvg = (seed) => `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#dfe7ff"/>
      <stop offset="0.6" stop-color="#f3f7ff"/>
      <stop offset="1" stop-color="#e9eefc"/>
    </linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6aa2ff"/>
      <stop offset="1" stop-color="#1e5bff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="600" height="420" rx="24" fill="url(#g)"/>
  <rect x="34" y="52" width="532" height="316" rx="22" fill="#ffffff" opacity="0.9"/>
  <rect x="60" y="82" width="480" height="28" rx="14" fill="#1e5bff" opacity="0.12"/>
  <rect x="60" y="128" width="320" height="18" rx="9" fill="#000" opacity="0.12"/>
  <rect x="60" y="160" width="400" height="18" rx="9" fill="#000" opacity="0.10"/>
  <rect x="60" y="192" width="360" height="18" rx="9" fill="#000" opacity="0.08"/>
  <circle cx="492" cy="298" r="44" fill="url(#b)" opacity="0.18"/>
  <circle cx="492" cy="298" r="28" fill="url(#b)" opacity="0.35"/>
  <text x="70" y="312" font-family="Arial" font-size="28" fill="#1e5bff" opacity="0.7">${seed}</text>
</svg>`
    )}`;
    const pickImage = (key) => {
      if (key === "idFront")
        form.value.idFront = mockSvg("ID-FRONT");
      if (key === "idBack")
        form.value.idBack = mockSvg("ID-BACK");
      if (key === "license")
        form.value.license = mockSvg("LICENSE");
      toast.info("已选择图片（示例）");
    };
    const addPhoto = () => {
      const next = { id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, url: mockSvg("PHOTO") };
      form.value.photos = [...form.value.photos, next];
    };
    const removePhoto = (idx) => {
      const next = [...form.value.photos];
      next.splice(idx, 1);
      form.value.photos = next;
    };
    const isValidIdNo = (v) => /^\d{17}[\dXx]$/.test(v);
    const validate = () => {
      if (!form.value.idFront)
        return "请上传手持身份证头像面";
      if (!form.value.idBack)
        return "请上传手持身份证国徽面";
      if (!form.value.realName.trim())
        return "请填写真实姓名";
      if (!form.value.idNo.trim() || !isValidIdNo(form.value.idNo.trim()))
        return "请填写正确身份证号";
      if (!form.value.license)
        return "请上传企业营业执照";
      if (!form.value.intro.trim())
        return "请填写企业简介";
      if (form.value.photos.length <= 0)
        return "请上传企业照片";
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
    common_vendor.onMounted(() => {
      form.value.photos = [{ id: "p0", url: mockSvg("BUILDING") }];
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "实名认证",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          name: "check",
          size: "14rpx",
          color: "rgba(255, 255, 255, 0.98)"
        }),
        c: tipVisible.value
      }, tipVisible.value ? {
        d: common_vendor.p({
          name: "warning",
          size: "28rpx",
          color: "rgba(255, 140, 0, 0.92)"
        }),
        e: common_vendor.p({
          name: "close",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.28)"
        }),
        f: common_vendor.o(($event) => tipVisible.value = false, "3b")
      } : {}, {
        g: form.value.idFront
      }, form.value.idFront ? {
        h: form.value.idFront
      } : {
        i: common_vendor.p({
          name: "camera",
          size: "36rpx",
          color: "rgba(30, 91, 255, 0.92)"
        })
      }, {
        j: common_vendor.o(($event) => pickImage("idFront"), "8e"),
        k: form.value.idBack
      }, form.value.idBack ? {
        l: form.value.idBack
      } : {
        m: common_vendor.p({
          name: "camera",
          size: "36rpx",
          color: "rgba(30, 91, 255, 0.92)"
        })
      }, {
        n: common_vendor.o(($event) => pickImage("idBack"), "37"),
        o: common_vendor.o(($event) => form.value.realName = $event, "36"),
        p: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写真实姓名",
          modelValue: form.value.realName
        }),
        q: common_vendor.o(($event) => form.value.idNo = $event, "85"),
        r: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          maxlength: "18",
          placeholder: "请填写身份证号码",
          modelValue: form.value.idNo
        }),
        s: form.value.license
      }, form.value.license ? {
        t: form.value.license
      } : {
        v: common_vendor.p({
          name: "camera",
          size: "40rpx",
          color: "rgba(30, 91, 255, 0.92)"
        })
      }, {
        w: common_vendor.o(($event) => pickImage("license"), "0a"),
        x: common_vendor.o(($event) => form.value.intro = $event, "f3"),
        y: common_vendor.p({
          compact: true,
          ["custom-class"]: "introInput",
          placeholder: "请输入企业简介",
          ["auto-height"]: true,
          modelValue: form.value.intro
        }),
        z: common_vendor.f(form.value.photos, (p, idx, i0) => {
          return {
            a: p.url,
            b: "3d4972bc-11-" + i0 + ",3d4972bc-0",
            c: common_vendor.o(($event) => removePhoto(idx), p.id),
            d: p.id
          };
        }),
        A: common_vendor.p({
          name: "close",
          size: "16rpx",
          color: "rgba(255, 255, 255, 0.92)"
        }),
        B: common_vendor.p({
          name: "add",
          size: "32rpx",
          color: "rgba(0, 0, 0, 0.22)"
        }),
        C: common_vendor.o(addPhoto, "06"),
        D: `${safeBottom.value + 200}px`,
        E: common_vendor.o(handleNext, "f4"),
        F: common_vendor.p({
          type: "primary",
          block: true,
          ["custom-class"]: "nextBtn"
        }),
        G: `${safeBottom.value}px`,
        H: common_vendor.p({
          selector: "registrationToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d4972bc"]]);
wx.createPage(MiniProgramPage);
