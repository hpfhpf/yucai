"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_8 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_7 = () => "../../node-modules/@wot-ui/ui/components/wd-popup/wd-popup.js";
const __unplugin_components_6 = () => "../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-textarea/wd-textarea.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-radio-group/wd-radio-group.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-radio/wd-radio.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
if (!Array) {
  const _component_wd_input = __unplugin_components_0;
  const _component_wd_radio = __unplugin_components_1;
  const _component_wd_radio_group = __unplugin_components_2;
  const _component_wd_icon = __unplugin_components_3;
  const _component_wd_textarea = __unplugin_components_4;
  const _component_wd_tag = __unplugin_components_5;
  const _component_wd_button = __unplugin_components_6;
  const _component_wd_popup = __unplugin_components_7;
  const _component_wd_toast = __unplugin_components_8;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_input + _component_wd_radio + _component_wd_radio_group + _component_wd_icon + _component_wd_textarea + _component_wd_tag + _component_wd_button + _component_wd_popup + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "jobPosting",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("jobPostingToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const form = common_vendor.ref({
      title: "",
      nature: "part",
      province: "",
      city: "",
      district: "",
      addressDetail: "",
      salary: "",
      education: "",
      experience: "",
      description: "",
      tags: ["五险一金"]
    });
    const natureOptions = [
      { label: "全职", value: "full" },
      { label: "兼职", value: "part" },
      { label: "实习", value: "intern" }
    ];
    const provinceOptions = ["四川省", "北京市", "上海市", "广东省"];
    const cityMap = {
      四川省: ["成都市", "绵阳市", "德阳市"],
      北京市: ["北京市"],
      上海市: ["上海市"],
      广东省: ["广州市", "深圳市", "佛山市"]
    };
    const districtMap = {
      成都市: ["高新区", "锦江区", "武侯区", "青羊区"],
      北京市: ["朝阳区", "海淀区", "东城区", "西城区"],
      上海市: ["浦东新区", "徐汇区", "静安区"],
      广州市: ["天河区", "越秀区", "海珠区"],
      深圳市: ["南山区", "福田区", "罗湖区"],
      佛山市: ["禅城区", "南海区"],
      绵阳市: ["涪城区", "游仙区"],
      德阳市: ["旌阳区"]
    };
    const salaryOptions = ["3k-5k", "5k-8k", "8k-12k", "12k-20k", "20k以上", "面议"];
    const educationOptions = ["不限", "大专", "本科", "硕士", "博士"];
    const experienceOptions = ["不限", "1年以内", "1-3年", "3-5年", "5-10年", "10年以上"];
    const tagOptions = ["周末双休", "五险一金", "弹性工作", "出国旅游", "免费体检"];
    const selectedTagsSet = common_vendor.computed(() => new Set(form.value.tags));
    const toggleTag = (tag) => {
      const next = new Set(form.value.tags);
      if (next.has(tag))
        next.delete(tag);
      else
        next.add(tag);
      form.value.tags = Array.from(next);
    };
    const sheetKey = common_vendor.ref("salary");
    const sheetTitle = common_vendor.ref("");
    const sheetOptions = common_vendor.ref([]);
    const sheetValue = common_vendor.ref("");
    const sheetShown = common_vendor.ref(false);
    const openSheet = (key) => {
      sheetKey.value = key;
      if (key === "province") {
        sheetTitle.value = "选择省";
        sheetOptions.value = Array.from(provinceOptions);
        sheetValue.value = form.value.province;
      } else if (key === "city") {
        sheetTitle.value = "选择市";
        sheetOptions.value = cityMap[form.value.province] || [];
        sheetValue.value = form.value.city;
        if (!form.value.province) {
          toast.info("请先选择省");
          return;
        }
      } else if (key === "district") {
        sheetTitle.value = "选择区";
        sheetOptions.value = districtMap[form.value.city] || [];
        sheetValue.value = form.value.district;
        if (!form.value.city) {
          toast.info("请先选择市");
          return;
        }
      } else if (key === "salary") {
        sheetTitle.value = "薪资范围";
        sheetOptions.value = salaryOptions;
        sheetValue.value = form.value.salary;
      } else if (key === "education") {
        sheetTitle.value = "最低学历";
        sheetOptions.value = educationOptions;
        sheetValue.value = form.value.education;
      } else if (key === "experience") {
        sheetTitle.value = "工作年限";
        sheetOptions.value = experienceOptions;
        sheetValue.value = form.value.experience;
      }
      sheetShown.value = true;
    };
    const closeSheet = () => {
      sheetShown.value = false;
    };
    const selectSheetValue = (v) => {
      sheetValue.value = v;
      const key = sheetKey.value;
      if (key === "province") {
        if (form.value.province !== v) {
          form.value.province = v;
          form.value.city = "";
          form.value.district = "";
        }
      } else if (key === "city") {
        if (form.value.city !== v) {
          form.value.city = v;
          form.value.district = "";
        }
      } else if (key === "district") {
        form.value.district = v;
      } else if (key === "salary") {
        form.value.salary = v;
      } else if (key === "education") {
        form.value.education = v;
      } else if (key === "experience") {
        form.value.experience = v;
      }
      closeSheet();
    };
    const validateForm = () => {
      const title = form.value.title.trim();
      if (!title)
        return "请填写职位名称";
      if (!form.value.province)
        return "请选择省";
      if (!form.value.city)
        return "请选择市";
      if (!form.value.district)
        return "请选择区";
      if (!form.value.salary)
        return "请选择薪资范围";
      if (!form.value.education)
        return "请选择最低学历";
      if (!form.value.experience)
        return "请选择工作年限";
      if (!form.value.description.trim())
        return "请填写职位描述";
      return "";
    };
    const handlePreview = () => {
      const err = validateForm();
      if (err) {
        toast.info(err);
        return;
      }
      toast.info("预览职位");
    };
    const handlePublish = () => {
      const err = validateForm();
      if (err) {
        toast.info(err);
        return;
      }
      toast.info("发布成功");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "职位发布",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.o(($event) => form.value.title = $event, "74"),
        c: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请填写",
          modelValue: form.value.title
        }),
        d: common_vendor.f(natureOptions, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.label),
            b: opt.value,
            c: "c0cf55e8-4-" + i0 + ",c0cf55e8-3",
            d: common_vendor.p({
              value: opt.value
            })
          };
        }),
        e: common_vendor.o(($event) => form.value.nature = $event, "aa"),
        f: common_vendor.p({
          shape: "button",
          ["custom-class"]: "segGroup",
          modelValue: form.value.nature
        }),
        g: common_vendor.t(form.value.province || "选择省"),
        h: !form.value.province ? 1 : "",
        i: common_vendor.p({
          name: "arrow-down",
          size: "20rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        j: common_vendor.o(($event) => openSheet("province"), "05"),
        k: common_vendor.t(form.value.city || "选择市"),
        l: !form.value.city ? 1 : "",
        m: common_vendor.p({
          name: "arrow-down",
          size: "20rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        n: common_vendor.o(($event) => openSheet("city"), "ee"),
        o: common_vendor.t(form.value.district || "选择区"),
        p: !form.value.district ? 1 : "",
        q: common_vendor.p({
          name: "arrow-down",
          size: "20rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        r: common_vendor.o(($event) => openSheet("district"), "cd"),
        s: common_vendor.o(($event) => form.value.addressDetail = $event, "98"),
        t: common_vendor.p({
          compact: true,
          ["custom-class"]: "formInput",
          placeholder: "请输入",
          modelValue: form.value.addressDetail
        }),
        v: common_vendor.t(form.value.salary || "请选择"),
        w: !form.value.salary ? 1 : "",
        x: common_vendor.p({
          name: "arrow-down",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        y: common_vendor.o(($event) => openSheet("salary"), "d0"),
        z: common_vendor.t(form.value.education || "请选择"),
        A: !form.value.education ? 1 : "",
        B: common_vendor.p({
          name: "arrow-down",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        C: common_vendor.o(($event) => openSheet("education"), "84"),
        D: common_vendor.t(form.value.experience || "请选择"),
        E: !form.value.experience ? 1 : "",
        F: common_vendor.p({
          name: "arrow-down",
          size: "22rpx",
          color: "rgba(0, 0, 0, 0.20)"
        }),
        G: common_vendor.o(($event) => openSheet("experience"), "8b"),
        H: common_vendor.o(($event) => form.value.description = $event, "62"),
        I: common_vendor.p({
          compact: true,
          ["custom-class"]: "descInput",
          placeholder: "请输入",
          ["auto-height"]: true,
          modelValue: form.value.description
        }),
        J: common_vendor.f(tagOptions, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag,
            c: common_vendor.o(($event) => toggleTag(tag), tag),
            d: "c0cf55e8-13-" + i0 + ",c0cf55e8-0",
            e: common_vendor.p({
              plain: true,
              ["custom-class"]: selectedTagsSet.value.has(tag) ? "perkTag perkTag--on" : "perkTag"
            })
          };
        }),
        K: `${safeBottom.value + 160}px`,
        L: common_vendor.o(handlePreview, "2a"),
        M: common_vendor.p({
          plain: true,
          ["custom-class"]: "barBtn barBtn--ghost"
        }),
        N: common_vendor.o(handlePublish, "55"),
        O: common_vendor.p({
          type: "primary",
          ["custom-class"]: "barBtn barBtn--primary"
        }),
        P: `${safeBottom.value}px`,
        Q: common_vendor.t(sheetTitle.value),
        R: common_vendor.f(sheetOptions.value, (opt, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(opt),
            b: sheetValue.value === opt
          }, sheetValue.value === opt ? {
            c: "c0cf55e8-17-" + i0 + ",c0cf55e8-16",
            d: common_vendor.p({
              name: "check",
              size: "28rpx",
              color: "rgba(30, 91, 255, 0.92)"
            })
          } : {}, {
            e: opt,
            f: common_vendor.o(($event) => selectSheetValue(opt), opt)
          });
        }),
        S: common_vendor.o(closeSheet, "be"),
        T: common_vendor.p({
          plain: true,
          block: true,
          ["custom-class"]: "sheetCancelBtn"
        }),
        U: common_vendor.o(($event) => sheetShown.value = $event, "48"),
        V: common_vendor.p({
          position: "bottom",
          ["close-on-click-modal"]: true,
          ["custom-style"]: "border-radius: 22rpx 22rpx 0 0; background: rgba(255, 255, 255, 0.98);",
          modelValue: sheetShown.value
        }),
        W: common_vendor.p({
          selector: "jobPostingToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c0cf55e8"]]);
wx.createPage(MiniProgramPage);
