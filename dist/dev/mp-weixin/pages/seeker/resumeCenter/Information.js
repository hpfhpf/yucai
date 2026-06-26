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
  __name: "Information",
  setup(__props) {
    const genderOptions = ["男", "女"];
    const cityOptions = ["北京", "上海", "广州", "深圳", "成都"];
    const form = common_vendor.ref({
      realName: "",
      gender: "",
      birthMonth: "",
      workMonth: "",
      phone: "13319197788",
      email: "",
      city: "北京"
    });
    const showGenderPicker = common_vendor.ref(false);
    const showBirthMonthPicker = common_vendor.ref(false);
    const showWorkMonthPicker = common_vendor.ref(false);
    const showCityPicker = common_vendor.ref(false);
    const maxDate = /* @__PURE__ */ new Date();
    const minDate = (/* @__PURE__ */ new Date("1960-01-01")).getTime();
    const birthMonthText = common_vendor.computed(() => {
      if (!form.value.birthMonth)
        return "请选择";
      const d = new Date(form.value.birthMonth);
      if (isNaN(d.getTime()))
        return "请选择";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${year}年${month}月`;
    });
    const workMonthText = common_vendor.computed(() => {
      if (!form.value.workMonth)
        return "请选择";
      const d = new Date(form.value.workMonth);
      if (isNaN(d.getTime()))
        return "请选择";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${year}年${month}月`;
    });
    const handleGenderConfirm = ({ value }) => {
      form.value.gender = value[0];
    };
    const handleBirthMonthConfirm = ({ value }) => {
      if (value > maxDate) {
        common_vendor.index.showToast({ title: "不能选择未来日期", icon: "none" });
        return;
      }
      form.value.birthMonth = value;
      showBirthMonthPicker.value = false;
    };
    const handleWorkMonthConfirm = ({ value }) => {
      if (value > maxDate) {
        common_vendor.index.showToast({ title: "不能选择未来日期", icon: "none" });
        return;
      }
      if (form.value.birthMonth && value < new Date(form.value.birthMonth)) {
        common_vendor.index.showToast({ title: "参加工作时间不能早于出生年月", icon: "none" });
        return;
      }
      form.value.workMonth = value;
      showWorkMonthPicker.value = false;
    };
    const handleCityConfirm = ({ value }) => {
      form.value.city = value[0];
    };
    const handleSave = () => {
      if (!form.value.realName.trim()) {
        common_vendor.index.showToast({ title: "请填写真实姓名", icon: "none" });
        return;
      }
      if (!form.value.gender) {
        common_vendor.index.showToast({ title: "请选择性别", icon: "none" });
        return;
      }
      if (!form.value.birthMonth) {
        common_vendor.index.showToast({ title: "请选择出生年月", icon: "none" });
        return;
      }
      if (!form.value.city) {
        common_vendor.index.showToast({ title: "请选择所在城市", icon: "none" });
        return;
      }
      common_vendor.index.showToast({ title: "已保存", icon: "success" });
      setTimeout(() => {
        const pages = typeof getCurrentPages === "function" && getCurrentPages() || [];
        if (pages.length > 1) {
          common_vendor.index.navigateBack();
          return;
        }
        common_vendor.index.navigateTo({ url: "/pages/recruiter/resumeCenter/index" });
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "个人信息",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.realName = $event, "63"),
        c: common_vendor.p({
          placeholder: "请填写姓名",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.realName
        }),
        d: common_vendor.p({
          title: "真实姓名",
          prop: "realName"
        }),
        e: common_vendor.o(($event) => showGenderPicker.value = true, "78"),
        f: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: form.value.gender || "请选择",
          ["is-link"]: true
        }),
        g: common_vendor.o(handleGenderConfirm, "a0"),
        h: common_vendor.o(($event) => showGenderPicker.value = $event, "75"),
        i: common_vendor.p({
          columns: [genderOptions],
          visible: showGenderPicker.value
        }),
        j: common_vendor.p({
          title: "性别",
          prop: "gender"
        }),
        k: common_vendor.o(($event) => showBirthMonthPicker.value = true, "c2"),
        l: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: birthMonthText.value,
          ["is-link"]: true
        }),
        m: common_vendor.o(handleBirthMonthConfirm, "7a"),
        n: common_vendor.o(($event) => form.value.birthMonth = $event, "12"),
        o: common_vendor.o(($event) => showBirthMonthPicker.value = $event, "d5"),
        p: common_vendor.p({
          type: "month",
          ["min-date"]: common_vendor.unref(minDate),
          ["max-date"]: common_vendor.unref(maxDate),
          modelValue: form.value.birthMonth,
          visible: showBirthMonthPicker.value
        }),
        q: common_vendor.p({
          title: "出生年月",
          prop: "birthMonth"
        }),
        r: common_vendor.o(($event) => showWorkMonthPicker.value = true, "39"),
        s: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: workMonthText.value,
          ["is-link"]: true
        }),
        t: common_vendor.o(handleWorkMonthConfirm, "49"),
        v: common_vendor.o(($event) => form.value.workMonth = $event, "49"),
        w: common_vendor.o(($event) => showWorkMonthPicker.value = $event, "41"),
        x: common_vendor.p({
          type: "month",
          ["min-date"]: common_vendor.unref(minDate),
          ["max-date"]: common_vendor.unref(maxDate),
          modelValue: form.value.workMonth,
          visible: showWorkMonthPicker.value
        }),
        y: common_vendor.p({
          title: "参加工作时间",
          prop: "workMonth"
        }),
        z: common_vendor.o(($event) => form.value.phone = $event, "f5"),
        A: common_vendor.p({
          disabled: true,
          placeholder: "手机号码",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.phone
        }),
        B: common_vendor.p({
          title: "手机号码",
          prop: "phone"
        }),
        C: common_vendor.o(($event) => form.value.email = $event, "02"),
        D: common_vendor.p({
          placeholder: "请输入邮箱地址",
          ["align-right"]: true,
          compact: true,
          modelValue: form.value.email
        }),
        E: common_vendor.p({
          title: "邮箱地址",
          prop: "email"
        }),
        F: common_vendor.o(($event) => showCityPicker.value = true, "a5"),
        G: common_vendor.p({
          ["custom-class"]: "calendarCell",
          value: form.value.city || "请选择",
          ["is-link"]: true
        }),
        H: common_vendor.o(handleCityConfirm, "ee"),
        I: common_vendor.o(($event) => showCityPicker.value = $event, "35"),
        J: common_vendor.p({
          columns: [cityOptions],
          visible: showCityPicker.value
        }),
        K: common_vendor.p({
          title: "所在城市",
          prop: "city"
        }),
        L: common_vendor.p({
          model: form.value,
          border: true,
          ["title-width"]: "100px"
        }),
        M: common_vendor.o(handleSave, "d6"),
        N: common_vendor.p({
          block: true,
          type: "primary"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-596dda72"]]);
wx.createPage(MiniProgramPage);
