"use strict";
const common_vendor = require("../../common/vendor.js");
const __unplugin_components_5 = () => "../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_4 = () => "../../node-modules/@wot-ui/ui/components/wd-card/wd-card.js";
const __unplugin_components_3 = () => "../../node-modules/@wot-ui/ui/components/wd-grid/wd-grid.js";
const __unplugin_components_2 = () => "../../node-modules/@wot-ui/ui/components/wd-grid-item/wd-grid-item.js";
const __unplugin_components_1 = () => "../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_0 = () => "../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_tag = __unplugin_components_1;
  const _component_wd_grid_item = __unplugin_components_2;
  const _component_wd_grid = __unplugin_components_3;
  const _component_wd_card = __unplugin_components_4;
  const _component_wd_toast = __unplugin_components_5;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_tag + _component_wd_grid_item + _component_wd_grid + _component_wd_card + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const toast = common_vendor.useToast("recToast");
    const records = common_vendor.ref([
      {
        id: "r1",
        title: "已推荐",
        status: "done",
        cells: [
          { value: "2024–11", label: "推荐时间" },
          { value: "美团", label: "在职时间" },
          { value: "产品总监", label: "推荐内容" }
        ]
      },
      {
        id: "r2",
        title: "已推荐审核中",
        status: "review",
        cells: [
          { value: "2024–11", label: "推荐时间" },
          { value: "美团", label: "在职时间" },
          { value: "产品总监", label: "推荐内容" }
        ]
      }
    ]);
    const handleRecordTap = (id) => {
      toast.info(`已点击：${id}`);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "推荐记录",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.f(records.value, (rec, k0, i0) => {
          return {
            a: "616d4233-3-" + i0 + "," + ("616d4233-2-" + i0),
            b: common_vendor.p({
              name: rec.status === "done" ? "check" : "view",
              size: "22px",
              color: "#fff"
            }),
            c: common_vendor.n(`recordCard__icon--${rec.status}`),
            d: common_vendor.t(rec.title),
            e: "616d4233-4-" + i0 + "," + ("616d4233-2-" + i0),
            f: common_vendor.p({
              type: rec.status === "done" ? "success" : "primary",
              variant: "light",
              round: true
            }),
            g: common_vendor.f(rec.cells, (cell, k1, i1) => {
              return {
                a: common_vendor.t(cell.value),
                b: common_vendor.t(cell.label),
                c: cell.label,
                d: "616d4233-6-" + i0 + "-" + i1 + "," + ("616d4233-5-" + i0)
              };
            }),
            h: common_vendor.n(`recordCell--${rec.status}`),
            i: "616d4233-5-" + i0 + "," + ("616d4233-2-" + i0),
            j: rec.id,
            k: common_vendor.o(($event) => handleRecordTap(rec.id), rec.id),
            l: "616d4233-2-" + i0 + ",616d4233-0",
            m: common_vendor.p({
              ["custom-class"]: `recordCard recordCard--${rec.status}`
            })
          };
        }),
        c: common_vendor.p({
          column: 3,
          ["custom-class"]: "recordGrid"
        }),
        d: common_vendor.p({
          selector: "recToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-616d4233"]]);
wx.createPage(MiniProgramPage);
