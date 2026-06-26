"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-popup/wd-popup.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_button = __unplugin_components_1;
  const _component_wd_tag = __unplugin_components_2;
  const _component_wd_popup = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_button + _component_wd_tag + _component_wd_popup + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "chatRoom",
  setup(__props) {
    var _a;
    const title = common_vendor.ref("连锁餐厅");
    const jobName = common_vendor.ref("前台行政");
    const statusTime = common_vendor.ref("12:03");
    const messages = common_vendor.ref([
      {
        id: "m1",
        role: "other",
        text: "我觉得您非常适合我司的行政前台岗位，能发份简历吗？",
        actionText: "发简历"
      },
      { id: "m2", role: "me", text: "好的！" }
    ]);
    const draft = common_vendor.ref("");
    const scrollTop = common_vendor.ref(0);
    const deliverVisible = common_vendor.ref(false);
    const deliverNote = common_vendor.ref("");
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const safeBottom = common_vendor.ref(((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const pushMeMessage = (text) => {
      messages.value.push({ id: `m_${Date.now()}`, role: "me", text });
    };
    const scrollToBottom = async () => {
      await common_vendor.nextTick$1();
      scrollTop.value = scrollTop.value + 99999;
    };
    const handleSend = () => {
      const text = draft.value.trim();
      if (!text)
        return;
      draft.value = "";
      pushMeMessage(text);
      scrollToBottom();
    };
    const handleScroll = () => {
    };
    const openDeliver = () => {
      deliverVisible.value = true;
    };
    const closeDeliver = () => {
      deliverVisible.value = false;
      deliverNote.value = "";
    };
    const handleConfirmDeliver = () => {
      common_vendor.index.showToast({ title: "投递成功", icon: "none" });
      closeDeliver();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "沟通",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(openDeliver, "0e"),
        c: common_vendor.t(jobName.value),
        d: common_vendor.t(statusTime.value),
        e: common_vendor.f(messages.value, (m, k0, i0) => {
          return common_vendor.e({
            a: m.role === "other"
          }, m.role === "other" ? {} : {}, {
            b: common_vendor.t(m.text),
            c: m.actionText && m.role === "other"
          }, m.actionText && m.role === "other" ? {
            d: common_vendor.t(m.actionText),
            e: common_vendor.o(openDeliver, m.id)
          } : {}, {
            f: common_vendor.n(m.role === "me" ? "bubble--me" : "bubble--other"),
            g: m.role === "me"
          }, m.role === "me" ? {} : {}, {
            h: m.id,
            i: common_vendor.n(m.role === "me" ? "msg--me" : "msg--other")
          });
        }),
        f: scrollTop.value,
        g: common_vendor.o(handleScroll, "f6"),
        h: common_vendor.o(handleSend, "55"),
        i: common_vendor.o(($event) => draft.value = $event, "8d"),
        j: common_vendor.p({
          ["custom-class"]: "composerInput",
          placeholder: "请输入",
          modelValue: draft.value
        }),
        k: common_vendor.o(handleSend, "14"),
        l: `${safeBottom.value}px`,
        m: common_vendor.t(jobName.value),
        n: common_vendor.t(title.value),
        o: common_vendor.p({
          type: "primary",
          size: "small"
        }),
        p: common_vendor.p({
          type: "primary",
          size: "small"
        }),
        q: common_vendor.o(($event) => deliverNote.value = $event, "47"),
        r: common_vendor.p({
          placeholder: "给HR留言（可选）",
          modelValue: deliverNote.value
        }),
        s: common_vendor.o(handleConfirmDeliver, "57"),
        t: common_vendor.p({
          type: "primary",
          block: true
        }),
        v: common_vendor.o(($event) => deliverVisible.value = $event, "92"),
        w: common_vendor.p({
          position: "center",
          ["show-close"]: true,
          ["close-on-click-modal"]: true,
          round: true,
          modelValue: deliverVisible.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-da3c8f3c"]]);
wx.createPage(MiniProgramPage);
