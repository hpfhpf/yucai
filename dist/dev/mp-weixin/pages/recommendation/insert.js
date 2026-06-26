"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_6 = () => "../../node-modules/@wot-ui/ui/components/wd-datetime-picker/wd-datetime-picker.js";
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-radio-group/wd-radio-group.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-radio/wd-radio.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-textarea/wd-textarea.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-cell-group/wd-cell-group.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
if (!Array) {
  const _component_wd_cell = __unplugin_components_0;
  const _component_wd_cell_group = __unplugin_components_1;
  const _component_wd_textarea = __unplugin_components_2;
  const _component_wd_radio = __unplugin_components_3;
  const _component_wd_radio_group = __unplugin_components_4;
  const _component_wd_button = __unplugin_components_5;
  const _component_wd_datetime_picker = __unplugin_components_6;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_cell + _component_wd_cell_group + _component_wd_textarea + _component_wd_radio + _component_wd_radio_group + _component_wd_button + _component_wd_datetime_picker + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "insert",
  setup(__props) {
    const relationOptions = [
      { label: "我是上级", value: "leader" },
      { label: "我是同事", value: "colleague" },
      { label: "我是HR", value: "hr" }
    ];
    const submitOptions = [
      { label: "匿名提交", value: "anonymous" },
      { label: "实名提交", value: "realname" }
    ];
    const form = common_vendor.ref({
      name: "张文凯",
      company: "北京网聘咨询有限公司",
      position: "高级软件工程师",
      startDate: "",
      endDate: "",
      letter: "",
      relation: "leader",
      submitType: ""
    });
    const showStartPicker = common_vendor.ref(false);
    const showEndPicker = common_vendor.ref(false);
    const startTimestamp = common_vendor.ref(Date.now());
    const endTimestamp = common_vendor.ref(Date.now());
    const formatYm = (dateStr) => {
      if (!dateStr)
        return "";
      const [y, m] = dateStr.split("-");
      if (!y || !m)
        return "";
      return `${y}年${m}月`;
    };
    const startText = common_vendor.computed(() => form.value.startDate ? formatYm(form.value.startDate) : "开始时间");
    const endText = common_vendor.computed(() => form.value.endDate ? formatYm(form.value.endDate) : "结束时间");
    const openStartPicker = () => {
      if (form.value.startDate) {
        const [y, m] = form.value.startDate.split("-");
        startTimestamp.value = new Date(Number(y), Number(m) - 1).getTime();
      } else {
        startTimestamp.value = Date.now();
      }
      showStartPicker.value = true;
    };
    const openEndPicker = () => {
      if (form.value.endDate) {
        const [y, m] = form.value.endDate.split("-");
        endTimestamp.value = new Date(Number(y), Number(m) - 1).getTime();
      } else {
        endTimestamp.value = Date.now();
      }
      showEndPicker.value = true;
    };
    const handleStartConfirm = ({ value }) => {
      const d = new Date(value);
      form.value.startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    const handleEndConfirm = ({ value }) => {
      const d = new Date(value);
      form.value.endDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "填写推荐信",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          title: "姓名",
          value: form.value.name,
          border: false
        }),
        c: common_vendor.p({
          title: "公司",
          value: form.value.company,
          border: false
        }),
        d: common_vendor.p({
          title: "职位",
          value: form.value.position,
          border: false
        }),
        e: common_vendor.p({
          border: false,
          ["title-width"]: "140rpx"
        }),
        f: common_vendor.t(startText.value),
        g: !!form.value.startDate ? 1 : "",
        h: common_vendor.o(openStartPicker, "c8"),
        i: common_vendor.t(endText.value),
        j: !!form.value.endDate ? 1 : "",
        k: common_vendor.o(openEndPicker, "f8"),
        l: common_vendor.o(($event) => form.value.letter = $event, "38"),
        m: common_vendor.p({
          placeholder: "推荐信模板",
          ["auto-height"]: true,
          maxlength: -1,
          compact: true,
          modelValue: form.value.letter
        }),
        n: common_vendor.f(relationOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: "81f09cec-8-" + i0 + ",81f09cec-7",
            d: common_vendor.p({
              value: item.value,
              ["custom-class"]: "choice"
            })
          };
        }),
        o: common_vendor.o(($event) => form.value.relation = $event, "aa"),
        p: common_vendor.p({
          direction: "horizontal",
          ["checked-color"]: "#2a67ff",
          ["custom-class"]: "choiceGroup",
          modelValue: form.value.relation
        }),
        q: common_vendor.f(submitOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: "81f09cec-10-" + i0 + ",81f09cec-9",
            d: common_vendor.p({
              value: item.value,
              ["custom-class"]: "choice"
            })
          };
        }),
        r: common_vendor.o(($event) => form.value.submitType = $event, "50"),
        s: common_vendor.p({
          direction: "horizontal",
          ["checked-color"]: "#2a67ff",
          ["custom-class"]: "choiceGroup choiceGroup--submit",
          modelValue: form.value.submitType
        }),
        t: common_vendor.p({
          plain: true,
          block: true,
          ["custom-class"]: "submit-btn"
        }),
        v: common_vendor.o(handleStartConfirm, "45"),
        w: common_vendor.o(($event) => startTimestamp.value = $event, "8e"),
        x: common_vendor.o(($event) => showStartPicker.value = $event, "07"),
        y: common_vendor.p({
          type: "year-month",
          title: "选择开始时间",
          modelValue: startTimestamp.value,
          visible: showStartPicker.value
        }),
        z: common_vendor.o(handleEndConfirm, "bf"),
        A: common_vendor.o(($event) => endTimestamp.value = $event, "cf"),
        B: common_vendor.o(($event) => showEndPicker.value = $event, "63"),
        C: common_vendor.p({
          type: "year-month",
          title: "选择结束时间",
          modelValue: endTimestamp.value,
          visible: showEndPicker.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-81f09cec"]]);
wx.createPage(MiniProgramPage);
