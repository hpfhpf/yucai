"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-cell-group/wd-cell-group.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-cell/wd-cell.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-card/wd-card.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
if (!Array) {
  const _component_wd_tag = __unplugin_components_0;
  const _component_wd_card = __unplugin_components_1;
  const _component_wd_icon = __unplugin_components_2;
  const _component_wd_cell = __unplugin_components_3;
  const _component_wd_cell_group = __unplugin_components_4;
  const _component_wd_toast = __unplugin_components_5;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_tag + _component_wd_card + _component_wd_icon + _component_wd_cell + _component_wd_cell_group + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "certificate",
  setup(__props) {
    const toast = common_vendor.useToast("recordToast");
    const score = common_vendor.ref(850);
    const updatedAt = common_vendor.ref("2025-01-06");
    const points = [220, 350, 500, 650, 800, 1e3];
    const levelLabels = ["较差", "中等", "良好", "优秀", "极好"];
    const levelIndex = common_vendor.ref(4);
    const records = common_vendor.ref([
      { id: "r1", month: "2025-01", company: "四川盛龙宝科技有限公司", desc: "工作积极、沟通能力强、遵守规则", delta: 5 },
      { id: "r2", month: "2025-01", company: "四川盛龙宝科技有限公司", desc: "工作积极、沟通能力强、遵守规则", delta: -3 },
      { id: "r3", month: "2025-01", company: "四川盛龙宝科技有限公司", desc: "工作积极、沟通能力强、遵守规则", delta: 5 },
      { id: "r4", month: "2025-01", company: "四川盛龙宝科技有限公司", desc: "工作积极、沟通能力强、遵守规则", delta: -3 },
      { id: "r5", month: "2025-01", company: "四川盛龙宝科技有限公司", desc: "工作积极、沟通能力强、遵守规则", delta: 5 }
    ]);
    const minValue = points[0];
    const maxValue = points[points.length - 1];
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const valueToLeft = (value) => {
      const v = clamp(value, minValue, maxValue);
      return (v - minValue) / (maxValue - minValue) * 100;
    };
    const handleRecordTap = (id) => {
      const hit = records.value.find((x) => x.id === id);
      toast.info((hit == null ? void 0 : hit.company) || "记录");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "认证记录",
          type: "show-back",
          theme: "FFF"
        }),
        b: common_vendor.t(score.value),
        c: common_vendor.t(updatedAt.value),
        d: common_vendor.p({
          round: true,
          ["custom-class"]: "summary__tag"
        }),
        e: common_vendor.f(levelLabels, (x, index, i0) => {
          return {
            a: common_vendor.t(x),
            b: x,
            c: common_vendor.n(levelIndex.value == index ? "meter__num--active" : "")
          };
        }),
        f: common_vendor.f(points, (p, k0, i0) => {
          return {
            a: p,
            b: `${valueToLeft(p)}%`
          };
        }),
        g: common_vendor.f(points, (p, index, i0) => {
          return {
            a: common_vendor.t(p),
            b: p,
            c: `${valueToLeft(p)}%`
          };
        }),
        h: common_vendor.p({
          title: "信用需慢慢积累，请保持哟!",
          ["custom-title-class"]: "meter__title",
          ["custom-content-class"]: "meter__content"
        }),
        i: common_vendor.f(records.value, (item, k0, i0) => {
          return {
            a: "93e8f249-6-" + i0 + "," + ("93e8f249-5-" + i0),
            b: common_vendor.p({
              name: item.delta > 0 ? "face-smile-fill" : "face-frown-fill",
              color: item.delta > 0 ? "#1e78ff" : "#ffa600",
              size: "40rpx"
            }),
            c: common_vendor.n(item.delta > 0 ? "record-icon--good" : "record-icon--bad"),
            d: common_vendor.t(item.company),
            e: common_vendor.t(item.desc),
            f: common_vendor.t(item.delta > 0 ? `+${item.delta}` : item.delta),
            g: common_vendor.n(item.delta > 0 ? "record__delta--pos" : "record__delta--neg"),
            h: common_vendor.t(item.month),
            i: item.id,
            j: common_vendor.o(($event) => handleRecordTap(item.id), item.id),
            k: "93e8f249-5-" + i0 + ",93e8f249-4"
          };
        }),
        j: common_vendor.p({
          clickable: true,
          ["custom-class"]: "record-cell"
        }),
        k: common_vendor.p({
          selector: "recordToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93e8f249"]]);
wx.createPage(MiniProgramPage);
