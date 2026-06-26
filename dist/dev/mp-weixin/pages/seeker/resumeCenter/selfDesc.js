"use strict";
const common_vendor = require("../../../common/vendor.js");
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-form/wd-form.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-form-item/wd-form-item.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-textarea/wd-textarea.js";
if (!Array) {
  const _component_wd_textarea = __unplugin_components_0;
  const _component_wd_form_item = __unplugin_components_1;
  const _component_wd_form = __unplugin_components_2;
  const _component_wd_button = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_textarea + _component_wd_form_item + _component_wd_form + _component_wd_button + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "selfDesc",
  setup(__props) {
    const form = common_vendor.ref({
      content: ""
    });
    const handleSave = () => {
      if (!form.value.content.trim()) {
        common_vendor.index.showToast({ title: "请输入自我描述", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "已保存", icon: "success" });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "自我描述",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.content = $event, "cc"),
        c: common_vendor.p({
          ["custom-class"]: "globTextArea",
          maxlength: 300,
          clearable: true,
          ["show-word-limit"]: true,
          modelValue: form.value.content
        }),
        d: common_vendor.p({
          prop: "content"
        }),
        e: common_vendor.p({
          model: form.value,
          border: true,
          ["title-width"]: "100px"
        }),
        f: common_vendor.o(handleSave, "f7"),
        g: common_vendor.p({
          block: true,
          type: "primary"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-73087df4"]]);
wx.createPage(MiniProgramPage);
