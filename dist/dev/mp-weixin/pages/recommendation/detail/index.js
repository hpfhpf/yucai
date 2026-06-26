"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_route = require("../../../utils/route.js");
const __unplugin_components_5 = () => "../../../node-modules/@wot-ui/ui/components/wd-toast/wd-toast.js";
const __unplugin_components_4 = () => "../../../node-modules/@wot-ui/ui/components/wd-popup/wd-popup.js";
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-checkbox/wd-checkbox.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-button/wd-button.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_0 = () => "../../../node-modules/@wot-ui/ui/components/wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  const _component_wd_tag = __unplugin_components_1;
  const _component_wd_button = __unplugin_components_2;
  const _component_wd_checkbox = __unplugin_components_3;
  const _component_wd_popup = __unplugin_components_4;
  const _component_wd_toast = __unplugin_components_5;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_wd_icon + _component_wd_tag + _component_wd_button + _component_wd_checkbox + _component_wd_popup + _component_wd_toast + _component_global_ku_root)();
}
if (!Math) {
  HeaderNav();
}
const HeaderNav = () => "../../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    var _a;
    const toast = common_vendor.useToast("detailToast");
    const job = common_vendor.ref({
      title: "前台财务",
      salary: "面议",
      city: "成都",
      district: "高新区",
      education: "学历不限",
      exp: "2年",
      company: "连锁餐厅",
      companyAvatar: "",
      views: "89次",
      desc: [
        "免换好当天所需要零钱，备用金必须天天核对，不得以白条抵现；",
        "下班必须按企业规定交接班清楚，交接要及时、准确；",
        "对于简单票据结算时，必须由当事人签字；",
        "做好当天交接工作，认真清点备用金。"
      ],
      requirements: [
        "限女生，年龄18–28岁；形象气质佳；",
        "品行端正，能吃苦耐劳，有收银员经验优先录取；",
        "有收银经验，能准确无误的收银找零，会简单的电脑操作。"
      ],
      perks: ["周末双休", "五险一金", "弹性工作"],
      address: "成都市·高新区·泰达时代中心一号楼14层"
    });
    const similarJobs = common_vendor.ref([
      { id: "sj1", title: "会计主管", salary: "10K-12K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" },
      { id: "sj2", title: "工业设计师", salary: "7K-9K", district: "青羊区", education: "学历不限", gender: "男女不限", company: "连锁餐厅", time: "12:26发布" }
    ]);
    const isCollected = common_vendor.ref(false);
    const safeBottom = common_vendor.ref(((_a = common_vendor.index.getSystemInfoSync().safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    const handleCompanyTap = () => utils_route.goPageCompanyDetail();
    const handleAddressTap = () => toast.info("打开地图");
    const handleSimilarTap = (id) => toast.info(`相似职位：${id}`);
    const handleShare = () => toast.info("分享");
    const toggleCollect = () => {
      isCollected.value = !isCollected.value;
      toast.info(isCollected.value ? "已收藏" : "已取消收藏");
    };
    const handleReport = () => toast.info("投诉");
    const handleChat = () => utils_route.goPageChatRoom();
    const deliverShown = common_vendor.ref(false);
    const deliverAgree = common_vendor.ref(false);
    const deliverError = common_vendor.ref("");
    const deliverLoading = common_vendor.ref(false);
    const openDeliver = () => {
      deliverAgree.value = false;
      deliverError.value = "";
      deliverLoading.value = false;
      deliverShown.value = true;
    };
    const closeDeliver = () => {
      deliverShown.value = false;
      deliverError.value = "";
    };
    const handlePopupClose = () => {
      deliverLoading.value = false;
    };
    const normalizeError = (e) => {
      if (e instanceof Error)
        return e.message || "操作失败，请稍后重试";
      if (typeof e === "string")
        return e || "操作失败，请稍后重试";
      return "操作失败，请稍后重试";
    };
    const handlePledgeTap = () => toast.info("承诺书协议");
    const submitDeliver = async (payload) => {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!payload.jobTitle) {
            reject(new Error("岗位信息无效，请刷新后重试"));
            return;
          }
          if (Math.random() < 0.25) {
            reject(new Error("网络请求失败，请稍后重试"));
            return;
          }
          resolve();
        }, 520);
      });
    };
    const confirmDeliver = async () => {
      var _a2, _b;
      deliverError.value = "";
      const jobTitle = (((_a2 = job.value) == null ? void 0 : _a2.title) || "").trim();
      const company = (((_b = job.value) == null ? void 0 : _b.company) || "").trim();
      if (!jobTitle) {
        deliverError.value = "岗位信息无效，请刷新后重试";
        return;
      }
      if (!deliverAgree.value) {
        deliverError.value = "请先阅读并勾选承诺书协议";
        return;
      }
      deliverLoading.value = true;
      try {
        await submitDeliver({ jobTitle, company });
        deliverLoading.value = false;
        closeDeliver();
        toast.info("投递成功");
      } catch (e) {
        deliverLoading.value = false;
        deliverError.value = normalizeError(e);
      }
    };
    const handleDeliver = () => {
      openDeliver();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          title: "岗位详情",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.t(job.value.title),
        c: common_vendor.t(job.value.salary),
        d: common_vendor.p({
          name: "location",
          size: "22rpx",
          ["custom-style"]: "margin-right: 4rpx"
        }),
        e: common_vendor.t(job.value.city),
        f: common_vendor.t(job.value.district),
        g: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag metaTag--pin"
        }),
        h: common_vendor.t(job.value.education),
        i: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag"
        }),
        j: common_vendor.t(job.value.exp),
        k: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "metaTag"
        }),
        l: job.value.companyAvatar
      }, job.value.companyAvatar ? {
        m: job.value.companyAvatar
      } : {}, {
        n: common_vendor.t(job.value.company),
        o: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "activeTag"
        }),
        p: common_vendor.p({
          name: "eye",
          size: "28rpx",
          color: "rgba(0, 0, 0, 0.38)"
        }),
        q: common_vendor.t(job.value.views),
        r: common_vendor.o(handleCompanyTap, "ec"),
        s: common_vendor.f(job.value.desc, (line, idx, i0) => {
          return {
            a: common_vendor.t(idx + 1),
            b: common_vendor.t(line),
            c: idx
          };
        }),
        t: common_vendor.f(job.value.requirements, (line, idx, i0) => {
          return {
            a: common_vendor.t(idx + 1),
            b: common_vendor.t(line),
            c: idx
          };
        }),
        v: common_vendor.f(job.value.perks, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag),
            b: tag,
            c: "d46d8acb-8-" + i0 + ",d46d8acb-0"
          };
        }),
        w: common_vendor.p({
          plain: true,
          ["custom-class"]: "perkTag"
        }),
        x: common_vendor.t(job.value.address),
        y: common_vendor.p({
          name: "arrow-right",
          size: "28rpx",
          color: "rgba(0, 0, 0, 0.30)"
        }),
        z: common_vendor.o(handleAddressTap, "ab"),
        A: common_vendor.f(similarJobs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.salary),
            c: common_vendor.t(item.district),
            d: "d46d8acb-10-" + i0 + ",d46d8acb-0",
            e: common_vendor.t(item.education),
            f: "d46d8acb-11-" + i0 + ",d46d8acb-0",
            g: common_vendor.t(item.gender),
            h: "d46d8acb-12-" + i0 + ",d46d8acb-0",
            i: common_vendor.t(item.company),
            j: common_vendor.t(item.time),
            k: item.id,
            l: common_vendor.o(($event) => handleSimilarTap(item.id), item.id)
          };
        }),
        B: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        C: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        D: common_vendor.p({
          size: "small",
          plain: true,
          ["custom-class"]: "jobTag"
        }),
        E: `${safeBottom.value + 146}px`,
        F: common_vendor.p({
          name: "share-external",
          size: "34rpx",
          color: "rgba(0, 0, 0, 0.40)"
        }),
        G: common_vendor.o(handleShare, "ec"),
        H: common_vendor.p({
          name: isCollected.value ? "star-fill" : "star",
          size: "34rpx",
          color: isCollected.value ? "rgba(30, 91, 255, 0.86)" : "rgba(0, 0, 0, 0.42)"
        }),
        I: isCollected.value ? 1 : "",
        J: common_vendor.o(toggleCollect, "28"),
        K: common_vendor.p({
          name: "exclamation-circle",
          size: "34rpx",
          color: "rgba(0, 0, 0, 0.44)"
        }),
        L: common_vendor.o(handleReport, "02"),
        M: common_vendor.o(handleChat, "6d"),
        N: common_vendor.p({
          size: "small"
        }),
        O: common_vendor.o(handleDeliver, "43"),
        P: common_vendor.p({
          type: "primary",
          size: "small"
        }),
        Q: `${safeBottom.value}px`,
        R: common_vendor.p({
          name: "close",
          size: "32rpx",
          color: "rgba(0, 0, 0, 0.42)"
        }),
        S: common_vendor.o(closeDeliver, "2f"),
        T: deliverError.value
      }, deliverError.value ? {
        U: common_vendor.t(deliverError.value)
      } : {}, {
        V: common_vendor.o(() => {
        }, "a3"),
        W: common_vendor.p({
          ["model-value"]: deliverAgree.value,
          shape: "circle",
          ["checked-color"]: "rgba(30, 91, 255, 0.92)",
          ["custom-class"]: "deliverCheck"
        }),
        X: common_vendor.o(handlePledgeTap, "0f"),
        Y: common_vendor.o(($event) => deliverAgree.value = !deliverAgree.value, "2e"),
        Z: common_vendor.o(closeDeliver, "1d"),
        aa: common_vendor.p({
          plain: true,
          ["custom-class"]: "dialogBtn dialogBtn--ghost",
          disabled: deliverLoading.value
        }),
        ab: common_vendor.o(confirmDeliver, "20"),
        ac: common_vendor.p({
          type: "primary",
          ["custom-class"]: "dialogBtn dialogBtn--primary",
          disabled: deliverLoading.value,
          loading: deliverLoading.value
        }),
        ad: common_vendor.o(handlePopupClose, "2c"),
        ae: common_vendor.o(($event) => deliverShown.value = $event, "e7"),
        af: common_vendor.p({
          position: "center",
          ["close-on-click-modal"]: true,
          ["custom-class"]: "deliverPopup",
          modelValue: deliverShown.value
        }),
        ag: common_vendor.p({
          selector: "detailToast"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d46d8acb"]]);
wx.createPage(MiniProgramPage);
