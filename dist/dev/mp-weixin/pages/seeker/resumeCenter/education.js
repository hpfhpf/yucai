"use strict";
const common_vendor = require("../../../common/vendor.js");
const __unplugin_components_6 = () => "../../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_5 = () => "../../../node-modules/@wot-ui/ui/components/wd-form/wd-form.js";
const __unplugin_components_4 = () => "../../../node-modules/@wot-ui/ui/components/wd-calendar/wd-calendar.js";
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-picker/wd-picker.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-form-item/wd-form-item.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_form_item = __unplugin_components_1;
  const _component_wd_cell = __unplugin_components_2;
  const _component_wd_picker = __unplugin_components_3;
  const _component_wd_calendar = __unplugin_components_4;
  const _component_wd_form = __unplugin_components_5;
  const _component_wd_button = __unplugin_components_6;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_form_item + _component_wd_cell + _component_wd_picker + _component_wd_calendar + _component_wd_form + _component_wd_button + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "education",
  setup(__props) {
    const degreeOptions = ["博士", "硕士", "本科", "大专", "高中", "中专/中技", "初中及以下"];
    const form = common_vendor.ref({
      school: "",
      degree: "",
      major: "",
      startMonth: "",
      endMonth: ""
    });
    const showDegreePicker = common_vendor.ref(false);
    const showStartMonthPicker = common_vendor.ref(false);
    const showEndMonthPicker = common_vendor.ref(false);
    const maxDate = /* @__PURE__ */ new Date();
    const minDate = (/* @__PURE__ */ new Date("1960-01-01")).getTime();
    const startMonthText = common_vendor.computed(() => {
      if (!form.value.startMonth)
        return "请选择";
      const d = new Date(form.value.startMonth);
      if (isNaN(d.getTime()))
        return "请选择";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${year}年${month}月`;
    });
    const endMonthText = common_vendor.computed(() => {
      if (!form.value.endMonth)
        return "请选择";
      const d = new Date(form.value.endMonth);
      if (isNaN(d.getTime()))
        return "请选择";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${year}年${month}月`;
    });
    const handleDegreeConfirm = ({ value }) => {
      form.value.degree = value[0];
    };
    const handleStartMonthConfirm = ({ value }) => {
      if (value > maxDate) {
        common_vendor.index.showToast({ title: "不能选择未来日期", icon: "none" });
        return;
      }
      form.value.startMonth = value;
      showStartMonthPicker.value = false;
    };
    const handleEndMonthConfirm = ({ value }) => {
      if (value > maxDate) {
        common_vendor.index.showToast({ title: "不能选择未来日期", icon: "none" });
        return;
      }
      if (form.value.startMonth && value < new Date(form.value.startMonth)) {
        common_vendor.index.showToast({ title: "毕业时间不能早于入学时间", icon: "none" });
        return;
      }
      form.value.endMonth = value;
      showEndMonthPicker.value = false;
    };
    const handleSave = () => {
      if (!form.value.school.trim()) {
        common_vendor.index.showToast({ title: "请输入学校名称", icon: "none" });
        return;
      }
      if (!form.value.degree) {
        common_vendor.index.showToast({ title: "请选择学历", icon: "none" });
        return;
      }
      if (!form.value.startMonth) {
        common_vendor.index.showToast({ title: "请选择入学时间", icon: "none" });
        return;
      }
      if (form.value.endMonth && new Date(form.value.endMonth) < new Date(form.value.startMonth)) {
        common_vendor.index.showToast({ title: "毕业时间不能早于入学时间", icon: "none" });
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
          title: "添加教育经历",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.school = $event, "bd"),
        c: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.school
        }),
        d: common_vendor.p({
          title: "学校名称",
          prop: "school"
        }),
        e: common_vendor.o(($event) => showDegreePicker.value = true, "ed"),
        f: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: form.value.degree || "请选择",
          ["is-link"]: true
        }),
        g: common_vendor.o(handleDegreeConfirm, "ed"),
        h: common_vendor.o(($event) => showDegreePicker.value = $event, "1b"),
        i: common_vendor.p({
          columns: [degreeOptions],
          visible: showDegreePicker.value
        }),
        j: common_vendor.p({
          title: "学历",
          prop: "degree"
        }),
        k: common_vendor.o(($event) => form.value.major = $event, "cc"),
        l: common_vendor.p({
          placeholder: "请输入",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.major
        }),
        m: common_vendor.p({
          title: "专业",
          prop: "major"
        }),
        n: common_vendor.o(($event) => showStartMonthPicker.value = true, "11"),
        o: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: startMonthText.value,
          ["is-link"]: true
        }),
        p: common_vendor.o(handleStartMonthConfirm, "00"),
        q: common_vendor.o(($event) => form.value.startMonth = $event, "b6"),
        r: common_vendor.o(($event) => showStartMonthPicker.value = $event, "20"),
        s: common_vendor.p({
          type: "month",
          ["min-date"]: common_vendor.unref(minDate),
          ["max-date"]: common_vendor.unref(maxDate),
          modelValue: form.value.startMonth,
          visible: showStartMonthPicker.value
        }),
        t: common_vendor.p({
          title: "入学时间",
          prop: "startMonth"
        }),
        v: common_vendor.o(($event) => showEndMonthPicker.value = true, "79"),
        w: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: endMonthText.value,
          ["is-link"]: true
        }),
        x: common_vendor.o(handleEndMonthConfirm, "25"),
        y: common_vendor.o(($event) => form.value.endMonth = $event, "97"),
        z: common_vendor.o(($event) => showEndMonthPicker.value = $event, "eb"),
        A: common_vendor.p({
          type: "month",
          ["min-date"]: common_vendor.unref(minDate),
          ["max-date"]: common_vendor.unref(maxDate),
          modelValue: form.value.endMonth,
          visible: showEndMonthPicker.value
        }),
        B: common_vendor.p({
          title: "毕业时间",
          prop: "endMonth"
        }),
        C: common_vendor.p({
          model: form.value,
          border: true,
          ["title-width"]: "100px"
        }),
        D: common_vendor.o(handleSave, "16"),
        E: common_vendor.p({
          block: true,
          type: "primary"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a6364d3a"]]);
wx.createPage(MiniProgramPage);
