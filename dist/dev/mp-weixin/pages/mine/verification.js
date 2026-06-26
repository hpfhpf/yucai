"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_7 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_6 = () => "../../node-modules/@wot-ui/ui/components/wd-checkbox/wd-checkbox.js";
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-datetime-picker/wd-datetime-picker.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-cell-group/wd-cell-group.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-card/wd-card.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-upload/wd-upload.js";
if (!Array) {
  const _component_wd_upload = __unplugin_components_0;
  const _component_wd_card = __unplugin_components_1;
  const _component_wd_input = __unplugin_components_2;
  const _component_wd_cell = __unplugin_components_3;
  const _component_wd_cell_group = __unplugin_components_4;
  const _component_wd_datetime_picker = __unplugin_components_5;
  const _component_wd_checkbox = __unplugin_components_6;
  const _component_wd_button = __unplugin_components_7;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_upload + _component_wd_card + _component_wd_input + _component_wd_cell + _component_wd_cell_group + _component_wd_datetime_picker + _component_wd_checkbox + _component_wd_button + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "verification",
  setup(__props) {
    var _a;
    const frontFiles = common_vendor.ref([]);
    const backFiles = common_vendor.ref([]);
    const realName = common_vendor.ref("");
    const idNumber = common_vendor.ref("");
    const validDate = common_vendor.ref([]);
    const showValidDatePicker = common_vendor.ref(false);
    const agree = common_vendor.ref(false);
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const safeBottom = common_vendor.ref(((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const frontImage = common_vendor.computed(() => {
      var _a2;
      return ((_a2 = frontFiles.value[0]) == null ? void 0 : _a2.url) || "";
    });
    const backImage = common_vendor.computed(() => {
      var _a2;
      return ((_a2 = backFiles.value[0]) == null ? void 0 : _a2.url) || "";
    });
    const isIdNumberValid = common_vendor.computed(() => /(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(idNumber.value.trim()));
    const canSubmit = common_vendor.computed(() => {
      return !!frontImage.value && !!backImage.value && realName.value.trim().length > 0 && isIdNumberValid.value && validDate.value.length === 2 && agree.value;
    });
    const onFrontChange = ({ fileList }) => {
      frontFiles.value = fileList;
    };
    const onBackChange = ({ fileList }) => {
      backFiles.value = fileList;
    };
    const formatYearMonth = (timestamp) => {
      const d = new Date(Number(timestamp));
      if (isNaN(d.getTime()))
        return "";
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    };
    const validDateText = common_vendor.computed(() => {
      if (!validDate.value.length)
        return "";
      const start = formatYearMonth(validDate.value[0]);
      const end = formatYearMonth(validDate.value[1]);
      if (!start || !end)
        return "";
      return `${start} - ${end}`;
    });
    const handleConfirm = ({ value }) => {
      validDate.value = value;
    };
    const handleSubmit = () => {
      if (!canSubmit.value) {
        common_vendor.index.showToast({ title: "请完善信息后提交", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中" });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "提交成功", icon: "none" });
      }, 800);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "实名认证",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(onFrontChange, "f1"),
        c: common_vendor.o(($event) => frontFiles.value = $event, "1f"),
        d: common_vendor.p({
          action: "",
          limit: 1,
          ["auto-upload"]: false,
          accept: "image",
          ["size-type"]: "['compressed']",
          ["source-type"]: "['album', 'camera']",
          ["custom-evoke-class"]: "upload__trigger",
          ["custom-preview-class"]: "upload__preview",
          ["file-list"]: frontFiles.value
        }),
        e: common_vendor.o(onBackChange, "64"),
        f: common_vendor.o(($event) => backFiles.value = $event, "bb"),
        g: common_vendor.p({
          action: "",
          limit: 1,
          ["auto-upload"]: false,
          accept: "image",
          ["size-type"]: "['compressed']",
          ["source-type"]: "['album', 'camera']",
          ["custom-evoke-class"]: "upload__trigger",
          ["custom-preview-class"]: "upload__preview",
          ["file-list"]: backFiles.value
        }),
        h: common_vendor.p({
          title: "上传证件"
        }),
        i: common_vendor.o(($event) => realName.value = $event, "86"),
        j: common_vendor.p({
          placeholder: "请填写真实姓名",
          ["align-right"]: true,
          compact: true,
          modelValue: realName.value
        }),
        k: common_vendor.p({
          title: "姓名",
          center: true
        }),
        l: common_vendor.o(($event) => idNumber.value = $event, "a3"),
        m: common_vendor.p({
          placeholder: "请填写身份证号码",
          ["align-right"]: true,
          compact: true,
          modelValue: idNumber.value
        }),
        n: common_vendor.p({
          title: "身份证号",
          center: true
        }),
        o: common_vendor.o(($event) => showValidDatePicker.value = true, "fb"),
        p: common_vendor.p({
          title: "有效期",
          value: validDateText.value || "请选择有效期",
          center: true,
          ["is-link"]: true
        }),
        q: common_vendor.p({
          border: true,
          ["custom-class"]: "form-group"
        }),
        r: common_vendor.o(handleConfirm, "c5"),
        s: common_vendor.o(($event) => validDate.value = $event, "be"),
        t: common_vendor.o(($event) => showValidDatePicker.value = $event, "1e"),
        v: common_vendor.p({
          type: "year-month",
          title: "选择有效期",
          modelValue: validDate.value,
          visible: showValidDatePicker.value
        }),
        w: common_vendor.o(($event) => agree.value = $event, "71"),
        x: common_vendor.p({
          shape: "circle",
          ["checked-color"]: "rgba(30, 91, 255, 0.9)",
          modelValue: agree.value
        }),
        y: common_vendor.o(($event) => agree.value = !agree.value, "6f"),
        z: common_vendor.o(handleSubmit, "29"),
        A: common_vendor.p({
          type: "primary",
          block: true,
          disabled: !canSubmit.value,
          ["custom-class"]: "submit-btn"
        }),
        B: `${safeBottom.value}px`,
        C: common_vendor.p({
          title: "证件信息"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4558e0a7"]]);
wx.createPage(MiniProgramPage);
