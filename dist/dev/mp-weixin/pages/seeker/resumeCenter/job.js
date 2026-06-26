"use strict";
const common_vendor = require("../../../common/vendor.js");
const __unplugin_components_6 = () => "../../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_5 = () => "../../../node-modules/@wot-ui/ui/components/wd-form/wd-form.js";
const __unplugin_components_4 = () => "../../../node-modules/@wot-ui/ui/components/wd-textarea/wd-textarea.js";
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-calendar/wd-calendar.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-form-item/wd-form-item.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_form_item = __unplugin_components_1;
  const _component_wd_cell = __unplugin_components_2;
  const _component_wd_calendar = __unplugin_components_3;
  const _component_wd_textarea = __unplugin_components_4;
  const _component_wd_form = __unplugin_components_5;
  const _component_wd_button = __unplugin_components_6;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_form_item + _component_wd_cell + _component_wd_calendar + _component_wd_textarea + _component_wd_form + _component_wd_button + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "job",
  setup(__props) {
    const form = common_vendor.ref({
      company: "",
      position: "",
      startMonth: "",
      endMonth: "",
      content: ""
    });
    const showStartCalendar = common_vendor.ref(false);
    const showEndCalendar = common_vendor.ref(false);
    const formatDate = (date) => {
      if (!date)
        return "请选择";
      const d = new Date(date);
      if (isNaN(d.getTime()))
        return "请选择";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${year}年${month}月`;
    };
    const handleStartConfirm = ({ value }) => {
      form.value.startMonth = value;
    };
    const handleEndConfirm = ({ value }) => {
      form.value.endMonth = value;
    };
    const handleSave = () => {
      if (!form.value.company.trim()) {
        common_vendor.index.showToast({ title: "请输入公司名称", icon: "none" });
        return;
      }
      if (!form.value.position.trim()) {
        common_vendor.index.showToast({ title: "请输入职位", icon: "none" });
        return;
      }
      if (!form.value.startMonth) {
        common_vendor.index.showToast({ title: "请选择入职时间", icon: "none" });
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
          title: "添加工作经历",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.company = $event, "09"),
        c: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.company
        }),
        d: common_vendor.p({
          title: "公司名称",
          prop: "company"
        }),
        e: common_vendor.o(($event) => form.value.position = $event, "f5"),
        f: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.position
        }),
        g: common_vendor.p({
          title: "职位",
          prop: "position"
        }),
        h: common_vendor.o(($event) => showStartCalendar.value = true, "3d"),
        i: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: formatDate(form.value.startMonth),
          ["is-link"]: true
        }),
        j: common_vendor.o(handleStartConfirm, "63"),
        k: common_vendor.o(($event) => form.value.startMonth = $event, "95"),
        l: common_vendor.o(($event) => showStartCalendar.value = $event, "5a"),
        m: common_vendor.p({
          type: "date",
          modelValue: form.value.startMonth,
          visible: showStartCalendar.value
        }),
        n: common_vendor.p({
          title: "入职时间",
          prop: "startMonth"
        }),
        o: common_vendor.o(($event) => showEndCalendar.value = true, "40"),
        p: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: formatDate(form.value.endMonth),
          ["is-link"]: true
        }),
        q: common_vendor.o(handleEndConfirm, "77"),
        r: common_vendor.o(($event) => form.value.endMonth = $event, "30"),
        s: common_vendor.o(($event) => showEndCalendar.value = $event, "54"),
        t: common_vendor.p({
          type: "date",
          modelValue: form.value.endMonth,
          visible: showEndCalendar.value
        }),
        v: common_vendor.p({
          title: "离职时间",
          prop: "endMonth"
        }),
        w: common_vendor.o(($event) => form.value.content = $event, "e3"),
        x: common_vendor.p({
          ["custom-class"]: "globTextArea",
          placeholder: "请输入工作内容",
          maxlength: 300,
          clearable: true,
          ["show-word-limit"]: true,
          modelValue: form.value.content
        }),
        y: common_vendor.p({
          prop: "content"
        }),
        z: common_vendor.p({
          model: form.value,
          border: true,
          ["title-width"]: "100px"
        }),
        A: common_vendor.o(handleSave, "a7"),
        B: common_vendor.p({
          block: true,
          type: "primary"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-445aa658"]]);
wx.createPage(MiniProgramPage);
