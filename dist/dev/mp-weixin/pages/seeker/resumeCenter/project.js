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
  __name: "project",
  setup(__props) {
    const form = common_vendor.ref({
      projectName: "",
      role: "",
      startTime: "",
      // 对应 wd-calendar 绑定的值
      endTime: "",
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
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const handleStartConfirm = ({ value }) => {
      form.value.startTime = value;
    };
    const handleEndConfirm = ({ value }) => {
      form.value.endTime = value;
    };
    const handleSave = () => {
      if (!form.value.projectName) {
        common_vendor.index.showToast({ title: "请输入项目名称", icon: "none" });
        return;
      }
      if (!form.value.startTime) {
        common_vendor.index.showToast({ title: "请选择开始时间", icon: "none" });
        return;
      }
      console.log("保存数据:", form.value);
      common_vendor.index.showToast({ title: "已保存", icon: "success" });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "添加项目经历",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.projectName = $event, "97"),
        c: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.projectName
        }),
        d: common_vendor.p({
          title: "项目名称",
          prop: "projectName"
        }),
        e: common_vendor.o(($event) => form.value.role = $event, "b6"),
        f: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.role
        }),
        g: common_vendor.p({
          title: "你的职位",
          prop: "role"
        }),
        h: common_vendor.o(($event) => showStartCalendar.value = true, "3d"),
        i: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: formatDate(form.value.startTime),
          ["is-link"]: true
        }),
        j: common_vendor.o(handleStartConfirm, "5c"),
        k: common_vendor.o(($event) => form.value.startTime = $event, "53"),
        l: common_vendor.o(($event) => showStartCalendar.value = $event, "d0"),
        m: common_vendor.p({
          type: "date",
          modelValue: form.value.startTime,
          visible: showStartCalendar.value
        }),
        n: common_vendor.p({
          title: "开始时间",
          prop: "startTime"
        }),
        o: common_vendor.o(($event) => showEndCalendar.value = true, "97"),
        p: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: formatDate(form.value.endTime),
          ["is-link"]: true
        }),
        q: common_vendor.o(handleEndConfirm, "67"),
        r: common_vendor.o(($event) => form.value.endTime = $event, "de"),
        s: common_vendor.o(($event) => showEndCalendar.value = $event, "7e"),
        t: common_vendor.p({
          type: "date",
          modelValue: form.value.endTime,
          visible: showEndCalendar.value
        }),
        v: common_vendor.p({
          title: "结束时间",
          prop: "endTime"
        }),
        w: common_vendor.o(($event) => form.value.content = $event, "fd"),
        x: common_vendor.p({
          ["custom-class"]: "globTextArea",
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
        A: common_vendor.o(handleSave, "4d"),
        B: common_vendor.p({
          block: true
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2e8eab58"]]);
wx.createPage(MiniProgramPage);
