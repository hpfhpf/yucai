"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-steps/wd-steps.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-step/wd-step.js";
if (!Array) {
  const _component_wd_step = __unplugin_components_0;
  const _component_wd_steps = __unplugin_components_1;
  const _component_wd_icon = __unplugin_components_2;
  const _component_wd_input = __unplugin_components_3;
  const _component_wd_button = __unplugin_components_4;
  const _component_wd_toast = __unplugin_components_5;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_step + _component_wd_steps + _component_wd_icon + _component_wd_input + _component_wd_button + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "verificationPhone",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("verifyToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const form = common_vendor.ref({
      phone: "",
      captcha: "",
      password: "",
      password2: "",
      smsCode: ""
    });
    const agree = common_vendor.ref(false);
    const captchaText = common_vendor.ref("A7B9");
    const refreshCaptcha = () => {
      const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      let out = "";
      for (let i = 0; i < 4; i += 1)
        out += chars[Math.floor(Math.random() * chars.length)];
      captchaText.value = out;
    };
    const smsCountdown = common_vendor.ref(0);
    let smsTimer = null;
    const stopSmsTimer = () => {
      if (smsTimer)
        clearInterval(smsTimer);
      smsTimer = null;
    };
    const startSmsCountdown = (sec) => {
      stopSmsTimer();
      smsCountdown.value = sec;
      smsTimer = setInterval(() => {
        smsCountdown.value -= 1;
        if (smsCountdown.value <= 0) {
          smsCountdown.value = 0;
          stopSmsTimer();
        }
      }, 1e3);
    };
    const isValidPhone = (v) => /^1\d{10}$/.test(v);
    const handleGetSms = () => {
      if (smsCountdown.value > 0)
        return;
      const phone = form.value.phone.trim();
      if (!isValidPhone(phone)) {
        toast.info("请输入正确手机号");
        return;
      }
      if (!form.value.captcha.trim()) {
        toast.info("请输入图形验证码");
        return;
      }
      toast.info("验证码已发送");
      startSmsCountdown(60);
    };
    const validateSubmit = () => {
      const phone = form.value.phone.trim();
      if (!isValidPhone(phone))
        return "请输入正确手机号";
      if (!form.value.captcha.trim())
        return "请输入图形验证码";
      if (!form.value.password.trim())
        return "请输入密码";
      if (form.value.password.trim().length < 6)
        return "密码至少6位";
      if (form.value.password2.trim() !== form.value.password.trim())
        return "两次密码不一致";
      if (!form.value.smsCode.trim())
        return "请输入短信验证码";
      if (!agree.value)
        return "请阅读并同意协议";
      return "";
    };
    const handleSubmit = () => {
      const err = validateSubmit();
      if (err) {
        toast.info(err);
        return;
      }
      toast.info("注册成功");
    };
    const toggleAgree = () => {
      agree.value = !agree.value;
    };
    common_vendor.onMounted(() => refreshCaptcha());
    common_vendor.onBeforeUnmount(() => stopSmsTimer());
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "手机验证",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          status: "finished",
          title: "基本信息"
        }),
        c: common_vendor.p({
          status: "finished",
          title: "企业认证"
        }),
        d: common_vendor.p({
          status: "process",
          title: "手机验证"
        }),
        e: common_vendor.p({
          active: 2,
          ["custom-class"]: "stepperSteps",
          ["align-center"]: true
        }),
        f: common_vendor.p({
          name: "phone",
          size: "36rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        g: common_vendor.o(($event) => form.value.phone = $event, "64"),
        h: common_vendor.p({
          compact: true,
          ["custom-class"]: "fieldInput",
          type: "number",
          maxlength: "11",
          placeholder: "请输入手机号",
          modelValue: form.value.phone
        }),
        i: common_vendor.p({
          name: "check-circle",
          size: "36rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        j: common_vendor.o(($event) => form.value.captcha = $event, "be"),
        k: common_vendor.p({
          compact: true,
          ["custom-class"]: "fieldInput",
          maxlength: "6",
          placeholder: "请输入图形验证码",
          modelValue: form.value.captcha
        }),
        l: common_vendor.t(captchaText.value),
        m: common_vendor.o(refreshCaptcha, "b9"),
        n: common_vendor.p({
          name: "lock",
          size: "36rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        o: common_vendor.o(($event) => form.value.password = $event, "fb"),
        p: common_vendor.p({
          compact: true,
          ["custom-class"]: "fieldInput",
          type: "password",
          placeholder: "请输入密码",
          modelValue: form.value.password
        }),
        q: common_vendor.p({
          name: "lock",
          size: "36rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        r: common_vendor.o(($event) => form.value.password2 = $event, "dc"),
        s: common_vendor.p({
          compact: true,
          ["custom-class"]: "fieldInput",
          type: "password",
          placeholder: "请再次输入密码",
          modelValue: form.value.password2
        }),
        t: common_vendor.p({
          name: "email",
          size: "36rpx",
          color: "rgba(0, 0, 0, 0.46)"
        }),
        v: common_vendor.o(($event) => form.value.smsCode = $event, "95"),
        w: common_vendor.p({
          compact: true,
          ["custom-class"]: "fieldInput",
          maxlength: "6",
          placeholder: "短信验证码",
          modelValue: form.value.smsCode
        }),
        x: common_vendor.t(smsCountdown.value > 0 ? `${smsCountdown.value}s` : "获取验证码"),
        y: common_vendor.o(handleGetSms, "1b"),
        z: common_vendor.p({
          size: "small",
          disabled: smsCountdown.value > 0,
          ["custom-class"]: "smsBtn"
        }),
        A: `${safeBottom.value + 240}px`,
        B: common_vendor.o(handleSubmit, "6c"),
        C: common_vendor.p({
          type: "primary",
          block: true,
          ["custom-class"]: "submitBtn"
        }),
        D: agree.value
      }, agree.value ? {
        E: common_vendor.p({
          name: "check",
          size: "16rpx",
          color: "rgba(255, 255, 255, 0.98)"
        })
      } : {}, {
        F: agree.value ? 1 : "",
        G: common_vendor.o(toggleAgree, "3f"),
        H: `${safeBottom.value}px`,
        I: common_vendor.p({
          selector: "verifyToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47ee9a27"]]);
wx.createPage(MiniProgramPage);
