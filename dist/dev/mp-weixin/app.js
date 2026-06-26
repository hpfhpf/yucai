"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
const utils_route = require("./utils/route.js");
if (!Math) {
  "./pages/login/index.js";
  "./pages/message/chatList.js";
  "./pages/message/chatRoom.js";
  "./pages/message/index.js";
  "./pages/mine/certificate.js";
  "./pages/mine/changePhone.js";
  "./pages/mine/index.js";
  "./pages/mine/jobCollection.js";
  "./pages/mine/setting.js";
  "./pages/mine/submitted.js";
  "./pages/mine/verification.js";
  "./pages/recommendation/index.js";
  "./pages/recommendation/insert.js";
  "./pages/recruiter/index.js";
  "./pages/recruiter/jobPosting.js";
  "./pages/recruiter/registration.js";
  "./pages/recruiter/reset.js";
  "./pages/recruiter/resumeCenter.js";
  "./pages/recruiter/talents.js";
  "./pages/recruiter/verificationPhone.js";
  "./pages/seeker/index.js";
  "./pages/recommendation/detail/company.js";
  "./pages/recommendation/detail/index.js";
  "./pages/recommendation/position/index.js";
  "./pages/seeker/resumeCenter/Information.js";
  "./pages/seeker/resumeCenter/education.js";
  "./pages/seeker/resumeCenter/index.js";
  "./pages/seeker/resumeCenter/job.js";
  "./pages/seeker/resumeCenter/project.js";
  "./pages/seeker/resumeCenter/selfDesc.js";
  "./pages/seeker/resumeCenter/workCertification.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("App Launch");
      {
        const canIUseUpdateManager = typeof common_vendor.wx$1 !== "undefined" && typeof common_vendor.wx$1.getUpdateManager === "function";
        if (!canIUseUpdateManager)
          return;
        const updateManager = common_vendor.wx$1.getUpdateManager();
        updateManager.onCheckForUpdate((res) => {
          console.log("checkForUpdate", res);
        });
        updateManager.onUpdateReady(() => {
          common_vendor.index.showModal({
            title: "更新提示",
            content: "新版本已准备好，将重启应用以完成更新。",
            showCancel: false,
            success: () => updateManager.applyUpdate()
          });
        });
        updateManager.onUpdateFailed(() => {
          common_vendor.index.showModal({
            title: "更新失败",
            content: "新版本下载失败，请稍后重试或删除小程序后重新打开。",
            showCancel: false
          });
        });
      }
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
});
const GlobalKuRoot = () => "./KuRoot.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.pinia);
  app.use(utils_route.routeInterceptor);
  app.component("global-ku-root", GlobalKuRoot);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
