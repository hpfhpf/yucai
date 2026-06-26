"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_input = __unplugin_components_1;
  const _component_wd_button = __unplugin_components_2;
  const _component_wd_toast = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_input + _component_wd_button + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "changePhone",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("phoneToast");
    const countryCode = common_vendor.ref("86+");
    const phone = common_vendor.ref("");
    const captcha = common_vendor.ref("");
    const smsCode = common_vendor.ref("");
    const saving = common_vendor.ref(false);
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const safeBottom = common_vendor.ref(((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const captchaImageText = common_vendor.ref("aE S U Q");
    const phoneOk = common_vendor.computed(() => /^1\d{10}$/.test(phone.value.trim()));
    const captchaOk = common_vendor.computed(() => captcha.value.trim().length >= 4);
    const smsOk = common_vendor.computed(() => /^\d{4,6}$/.test(smsCode.value.trim()));
    const countdown = common_vendor.ref(0);
    let timer = null;
    const smsButtonText = common_vendor.computed(() => countdown.value > 0 ? `${countdown.value}s` : "获取验证码");
    const canSendSms = common_vendor.computed(() => countdown.value === 0 && phoneOk.value && captchaOk.value);
    const canSave = common_vendor.computed(() => phoneOk.value && captchaOk.value && smsOk.value);
    const refreshCaptcha = () => {
      const pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      const pick = () => pool[Math.floor(Math.random() * pool.length)];
      captchaImageText.value = `${pick()}${pick()} ${pick()} ${pick()} ${pick()}`;
    };
    const startCountdown = (seconds) => {
      countdown.value = seconds;
      if (timer)
        clearInterval(timer);
      timer = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value <= 0) {
          countdown.value = 0;
          if (timer)
            clearInterval(timer);
          timer = null;
        }
      }, 1e3);
    };
    const handleSendSms = () => {
      if (!canSendSms.value) {
        if (!phoneOk.value) {
          toast.info("请输入正确手机号");
          return;
        }
        if (!captchaOk.value) {
          toast.info("请输入图形验证码");
          return;
        }
        return;
      }
      startCountdown(60);
      toast.success("验证码已发送");
    };
    const handleSave = () => {
      if (!canSave.value) {
        toast.info("请完善信息后保存");
        return;
      }
      saving.value = true;
      setTimeout(() => {
        saving.value = false;
        toast.success("保存成功");
      }, 800);
    };
    common_vendor.onBeforeUnmount(() => {
      if (timer)
        clearInterval(timer);
      timer = null;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "修改手机号",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          name: "phone",
          color: "#1e5bff",
          size: "36rpx"
        }),
        c: common_vendor.t(countryCode.value),
        d: common_vendor.p({
          name: "caret-down",
          size: "20rpx",
          color: "rgba(0,0,0,0.22)"
        }),
        e: common_vendor.o(($event) => phone.value = $event, "94"),
        f: common_vendor.p({
          type: "number",
          maxlength: "11",
          placeholder: "请输入手机号",
          modelValue: phone.value
        }),
        g: common_vendor.p({
          name: "safe",
          color: "#1e5bff",
          size: "36rpx"
        }),
        h: common_vendor.o(($event) => captcha.value = $event, "e4"),
        i: common_vendor.p({
          maxlength: "6",
          placeholder: "请输入图形验证码",
          modelValue: captcha.value
        }),
        j: common_vendor.t(captchaImageText.value),
        k: common_vendor.o(refreshCaptcha, "28"),
        l: common_vendor.p({
          name: "email",
          color: "#1e5bff",
          size: "36rpx"
        }),
        m: common_vendor.o(($event) => smsCode.value = $event, "0d"),
        n: common_vendor.p({
          type: "number",
          maxlength: "6",
          placeholder: "短信验证码",
          modelValue: smsCode.value
        }),
        o: common_vendor.t(smsButtonText.value),
        p: common_vendor.o(handleSendSms, "63"),
        q: common_vendor.p({
          type: "primary",
          size: "small",
          disabled: !canSendSms.value,
          ["custom-class"]: "sms-btn"
        }),
        r: common_vendor.o(handleSave, "64"),
        s: common_vendor.p({
          type: "primary",
          block: true,
          disabled: !canSave.value,
          loading: saving.value,
          ["custom-class"]: "save-btn"
        }),
        t: `${safeBottom.value}px`,
        v: common_vendor.p({
          selector: "phoneToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e94e42ee"]]);
wx.createPage(MiniProgramPage);
