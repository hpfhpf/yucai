"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_uni = require("../../../utils/uni.js");
const utils_route = require("../../../utils/route.js");
const __unplugin_components_5 = () => "../../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_4 = () => "../../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-checkbox/wd-checkbox.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-input/wd-input.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_input = __unplugin_components_1;
  const _component_wd_checkbox = __unplugin_components_2;
  const _component_wd_tag = __unplugin_components_3;
  const _component_wd_button = __unplugin_components_4;
  const _component_wd_toast = __unplugin_components_5;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_input + _component_wd_checkbox + _component_wd_tag + _component_wd_button + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  (HeaderNav + AreaFilterPopup + IndustryFilterPopup + SalaryFilterPopup)();
}
const AreaFilterPopup = () => "./components/AreaFilterPopup.js";
const IndustryFilterPopup = () => "./components/IndustryFilterPopup.js";
const SalaryFilterPopup = () => "./components/SalaryFilterPopup.js";
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("posToast");
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const keyword = common_vendor.ref("");
    const areaPopupOpen = common_vendor.ref(false);
    const areaPopupTop = common_vendor.ref(0);
    const areaLeftValue = common_vendor.ref("");
    const areaRightValue = common_vendor.ref("");
    const areaSelectedLabel = common_vendor.ref("");
    const areaOptions = common_vendor.ref([
      {
        label: "全成都",
        value: "cd",
        children: [{ label: "全成都", value: "cd-all" }]
      },
      {
        label: "高新区",
        value: "gxq",
        children: [
          { label: "全高新区", value: "gxq-all" },
          { label: "金融城", value: "gxq-jrc" },
          { label: "天府软件园", value: "gxq-tfrjy" }
        ]
      },
      {
        label: "青羊区",
        value: "qyq",
        children: [
          { label: "全青羊区", value: "qyq-all" },
          { label: "天府广场", value: "qyq-tfgc" },
          { label: "光华", value: "qyq-gh" },
          { label: "太升路", value: "qyq-tsl" }
        ]
      },
      {
        label: "武侯区",
        value: "whq",
        children: [
          { label: "全武侯区", value: "whq-all" },
          { label: "桐梓林", value: "whq-tzl" },
          { label: "红牌楼", value: "whq-hpl" }
        ]
      },
      {
        label: "金牛区",
        value: "jnq",
        children: [
          { label: "全金牛区", value: "jnq-all" },
          { label: "茶店子", value: "jnq-cdz" }
        ]
      },
      {
        label: "温江区",
        value: "wjq",
        children: [{ label: "全温江区", value: "wjq-all" }]
      }
    ]);
    const areaDisplay = common_vendor.computed(() => areaSelectedLabel.value || "工作区域");
    const industryPopupOpen = common_vendor.ref(false);
    const industryPopupTop = common_vendor.ref(0);
    const industrySelected = common_vendor.ref("");
    const industryOptions = common_vendor.ref([
      { label: "中餐", value: "china" },
      { label: "西餐", value: "western" },
      { label: "网咖", value: "netcafe" },
      { label: "酒店", value: "hotel" },
      { label: "咖啡", value: "coffee" },
      { label: "奶茶", value: "tea" },
      { label: "快餐", value: "fast" },
      { label: "火锅", value: "hotpot" },
      { label: "烘焙", value: "bakery" },
      { label: "其它", value: "other" }
    ]);
    const industryDisplay = common_vendor.computed(() => {
      const item = industryOptions.value.find((x) => x.value === industrySelected.value);
      return (item == null ? void 0 : item.label) || "全部行业";
    });
    const salaryPopupOpen = common_vendor.ref(false);
    const salaryPopupTop = common_vendor.ref(0);
    const salarySelected = common_vendor.ref("");
    const salaryOptions = common_vendor.ref([
      { label: "面议", value: "negotiable" },
      { label: "1k以下", value: "lt1k" },
      { label: "1k–2k", value: "1-2k" },
      { label: "2k–3k", value: "2-3k" },
      { label: "3k–4k", value: "3-4k" },
      { label: "4k–5k", value: "4-5k" },
      { label: "5k以上", value: "gt5k" }
    ]);
    const salaryDisplay = common_vendor.computed(() => {
      const item = salaryOptions.value.find((x) => x.value === salarySelected.value);
      return (item == null ? void 0 : item.label) || "薪资范围";
    });
    const measureFiltersBottom = async () => {
      await common_vendor.nextTick$1();
      return await new Promise((resolve) => {
        utils_uni.createSelectorQuery().select("#position-filters").boundingClientRect((rect) => {
          resolve(rect && typeof rect.bottom === "number" ? rect.bottom : 88);
        }).exec();
      });
    };
    const openAreaFilter = async () => {
      industryPopupOpen.value = false;
      salaryPopupOpen.value = false;
      areaPopupTop.value = await measureFiltersBottom();
      areaPopupOpen.value = true;
    };
    const handleAreaConfirm = (payload) => {
      const name = (payload.rightLabel || payload.leftLabel || "").trim();
      if (!name) {
        areaSelectedLabel.value = "";
        toast.info("请选择有效区域");
        return;
      }
      areaSelectedLabel.value = name;
      toast.info(name);
    };
    const openIndustryFilter = async () => {
      areaPopupOpen.value = false;
      salaryPopupOpen.value = false;
      industryPopupTop.value = await measureFiltersBottom();
      industryPopupOpen.value = true;
    };
    const handleIndustryConfirm = (payload) => {
      industrySelected.value = payload.value;
      toast.info(payload.label);
    };
    const openSalaryFilter = async () => {
      areaPopupOpen.value = false;
      industryPopupOpen.value = false;
      salaryPopupTop.value = await measureFiltersBottom();
      salaryPopupOpen.value = true;
    };
    const handleSalaryConfirm = (payload) => {
      salarySelected.value = payload.value;
      toast.info(payload.label);
    };
    const jobs = common_vendor.ref([
      { id: "j1", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "j2", name: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "j3", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "j4", name: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" }
    ]);
    const selectedIds = common_vendor.ref(["j1"]);
    const isSelected = (id) => selectedIds.value.includes(id);
    const toggleJob = (id) => {
      if (isSelected(id)) {
        selectedIds.value = selectedIds.value.filter((x) => x !== id);
        return;
      }
      selectedIds.value = [...selectedIds.value, id];
    };
    const allSelected = common_vendor.computed(() => selectedIds.value.length > 0 && selectedIds.value.length === jobs.value.length);
    const toggleAll = () => {
      if (allSelected.value) {
        selectedIds.value = [];
        return;
      }
      selectedIds.value = jobs.value.map((j) => j.id);
    };
    const handleDeliverAll = () => {
      if (selectedIds.value.length === 0) {
        toast.info("请选择岗位");
        return;
      }
      toast.info(`已投递 ${selectedIds.value.length} 个岗位`);
    };
    const handleStarTap = () => {
      toast.info("收藏");
    };
    const handleSearchConfirm = () => {
      const text = keyword.value.trim();
      toast.info(text ? `搜索：${text}` : "请输入关键词");
    };
    const handleFilterTap = (key) => {
      const map = { more: "更多筛选" };
      toast.info(map[key]);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "全职岗位",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.p({
          name: "search",
          size: "32rpx",
          color: "rgba(0, 0, 0, 0.28)"
        }),
        c: common_vendor.o(handleSearchConfirm, "7c"),
        d: common_vendor.o(($event) => keyword.value = $event, "5b"),
        e: common_vendor.p({
          compact: true,
          ["custom-class"]: "search__input",
          placeholder: "请输入关键词、职位",
          modelValue: keyword.value
        }),
        f: common_vendor.t(areaDisplay.value),
        g: common_vendor.p({
          name: areaPopupOpen.value ? "arrow-up" : "arrow-down",
          size: "20rpx",
          color: areaPopupOpen.value || areaSelectedLabel.value ? "var(--app-primary)" : "rgba(0, 0, 0, 0.36)"
        }),
        h: areaPopupOpen.value || !!areaSelectedLabel.value ? 1 : "",
        i: common_vendor.o(openAreaFilter, "de"),
        j: common_vendor.t(industryDisplay.value),
        k: common_vendor.p({
          name: industryPopupOpen.value ? "arrow-up" : "arrow-down",
          size: "20rpx",
          color: industryPopupOpen.value || industrySelected.value ? "var(--app-primary)" : "rgba(0, 0, 0, 0.36)"
        }),
        l: industryPopupOpen.value || !!industrySelected.value ? 1 : "",
        m: common_vendor.o(openIndustryFilter, "7e"),
        n: common_vendor.t(salaryDisplay.value),
        o: common_vendor.p({
          name: salaryPopupOpen.value ? "arrow-up" : "arrow-down",
          size: "20rpx",
          color: salaryPopupOpen.value || salarySelected.value ? "var(--app-primary)" : "rgba(0, 0, 0, 0.36)"
        }),
        p: salaryPopupOpen.value || !!salarySelected.value ? 1 : "",
        q: common_vendor.o(openSalaryFilter, "39"),
        r: common_vendor.p({
          name: "arrow-down",
          size: "20rpx",
          color: "rgba(0, 0, 0, 0.36)"
        }),
        s: common_vendor.o(($event) => handleFilterTap("more"), "7a"),
        t: common_vendor.o(handleAreaConfirm, "90"),
        v: common_vendor.o(($event) => areaPopupOpen.value = $event, "cf"),
        w: common_vendor.o(($event) => areaLeftValue.value = $event, "b9"),
        x: common_vendor.o(($event) => areaRightValue.value = $event, "a0"),
        y: common_vendor.p({
          top: areaPopupTop.value,
          options: areaOptions.value,
          modelValue: areaPopupOpen.value,
          leftValue: areaLeftValue.value,
          rightValue: areaRightValue.value
        }),
        z: common_vendor.o(handleIndustryConfirm, "da"),
        A: common_vendor.o(($event) => industryPopupOpen.value = $event, "2a"),
        B: common_vendor.o(($event) => industrySelected.value = $event, "39"),
        C: common_vendor.p({
          top: industryPopupTop.value,
          options: industryOptions.value,
          modelValue: industryPopupOpen.value,
          selected: industrySelected.value
        }),
        D: common_vendor.o(handleSalaryConfirm, "86"),
        E: common_vendor.o(($event) => salaryPopupOpen.value = $event, "eb"),
        F: common_vendor.o(($event) => salarySelected.value = $event, "7d"),
        G: common_vendor.p({
          top: salaryPopupTop.value,
          options: salaryOptions.value,
          modelValue: salaryPopupOpen.value,
          selected: salarySelected.value
        }),
        H: common_vendor.f(jobs.value, (job, k0, i0) => {
          return {
            a: common_vendor.o(($event) => toggleJob(job.id), job.id),
            b: "45047417-11-" + i0 + ",45047417-0",
            c: common_vendor.p({
              ["model-value"]: isSelected(job.id),
              shape: "circle",
              ["checked-color"]: "rgba(30, 91, 255, 0.98)",
              ["custom-class"]: "jobCard__check"
            }),
            d: common_vendor.t(job.name),
            e: common_vendor.t(job.salary),
            f: common_vendor.o(($event) => common_vendor.unref(utils_route.goPageJobDetail)(job.id), job.id),
            g: common_vendor.t(job.district),
            h: "45047417-12-" + i0 + ",45047417-0",
            i: common_vendor.t(job.education),
            j: "45047417-13-" + i0 + ",45047417-0",
            k: common_vendor.t(job.gender),
            l: "45047417-14-" + i0 + ",45047417-0",
            m: common_vendor.t(job.company),
            n: common_vendor.t(job.time),
            o: job.id
          };
        }),
        I: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        J: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        K: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        L: `${safeBottom.value + 128}px`,
        M: common_vendor.o(() => {
        }, "0b"),
        N: common_vendor.p({
          ["model-value"]: allSelected.value,
          shape: "circle",
          ["checked-color"]: "rgba(30, 91, 255, 0.98)",
          ["custom-class"]: "bottomBar__check"
        }),
        O: common_vendor.o(toggleAll, "31"),
        P: common_vendor.p({
          name: "star",
          size: "38rpx",
          color: "rgba(0, 0, 0, 0.26)"
        }),
        Q: common_vendor.o(handleStarTap, "e3"),
        R: common_vendor.o(handleDeliverAll, "62"),
        S: common_vendor.p({
          type: "primary",
          block: true
        }),
        T: `${safeBottom.value}px`,
        U: common_vendor.p({
          selector: "posToast"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45047417"]]);
wx.createPage(MiniProgramPage);
