"use strict";
const common_vendor = require("../common/vendor.js");
const utils_page = require("./page.js");
const LoginPageUrl = "/pages/login/index";
const TokenStorageKey = "token";
const RootPagePaths = /* @__PURE__ */ new Set([
  "/pages/mine/index",
  "/pages/message/index",
  "/pages/seeker/index",
  "/pages/seeker/resumeCenter/index"
]);
const isLoggedIn = () => Boolean(common_vendor.index.getStorageSync(TokenStorageKey));
const getPath = (url) => url.split("?")[0];
const getPageStackLength = () => (typeof getCurrentPages === "function" && getCurrentPages() || []).length;
const checkAuth = (url) => {
  const path = getPath(url);
  if (path === LoginPageUrl) {
    return true;
  }
  const needLoginPage = utils_page.getNeedLoginPages().map((p) => p.path);
  if (!needLoginPage.includes(path)) {
    return true;
  }
  if (isLoggedIn()) {
    return true;
  }
  const redirectRoute = `${LoginPageUrl}?redirect=${encodeURIComponent(url)}`;
  common_vendor.index.navigateTo({ url: redirectRoute });
  return false;
};
const navigateToInterceptor = {
  invoke({ url }) {
    if (!checkAuth(url)) {
      return false;
    }
    const path = getPath(url);
    if (path === LoginPageUrl) {
      return true;
    }
    if (RootPagePaths.has(path)) {
      common_vendor.index.reLaunch({ url });
      return false;
    }
    if (getPageStackLength() >= 9) {
      common_vendor.index.redirectTo({ url });
      return false;
    }
    return true;
  }
};
const reLaunchAndRedirectInterceptor = {
  invoke({ url }) {
    return checkAuth(url);
  }
};
const routeInterceptor = {
  install() {
    common_vendor.index.addInterceptor("navigateTo", navigateToInterceptor);
    common_vendor.index.addInterceptor("reLaunch", reLaunchAndRedirectInterceptor);
    common_vendor.index.addInterceptor("redirectTo", reLaunchAndRedirectInterceptor);
  }
};
const goPageBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    common_vendor.index.navigateBack({
      delta: 1
    });
  } else {
    common_vendor.index.navigateTo({
      url: "/pages/seeker/index"
    });
  }
};
const goPageAddProject = () => {
  common_vendor.index.navigateTo({
    url: `/pages/seeker/resumeCenter/project`
  });
};
const goPageAddJob = () => {
  common_vendor.index.navigateTo({
    url: `/pages/seeker/resumeCenter/job`
  });
};
const goPageAddEducation = () => {
  common_vendor.index.navigateTo({
    url: `/pages/seeker/resumeCenter/education`
  });
};
const goPageAddInformation = () => {
  common_vendor.index.navigateTo({
    url: `/pages/seeker/resumeCenter/Information`
  });
};
const goPageAddSelfDesc = () => {
  common_vendor.index.navigateTo({
    url: `/pages/seeker/resumeCenter/selfDesc`
  });
};
const goPageChatRoom = () => {
  common_vendor.index.navigateTo({
    url: `/pages/message/chatRoom`
  });
};
const goPageSubmitted = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/submitted`
  });
};
const goPageJobCollection = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/jobCollection`
  });
};
const goPageSetting = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/setting`
  });
};
const goPageCertificate = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/certificate`
  });
};
const goPageVerification = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/verification`
  });
};
const goPageChangePhone = () => {
  common_vendor.index.navigateTo({
    url: `/pages/mine/changePhone`
  });
};
const goPageCompanyDetail = () => {
  common_vendor.index.navigateTo({
    url: `/pages/recommendation/detail/company`
  });
};
const goPageJobDetail = (id) => {
  common_vendor.index.navigateTo({
    url: `/pages/recommendation/detail/index?id=${id}`
  });
};
exports.goPageAddEducation = goPageAddEducation;
exports.goPageAddInformation = goPageAddInformation;
exports.goPageAddJob = goPageAddJob;
exports.goPageAddProject = goPageAddProject;
exports.goPageAddSelfDesc = goPageAddSelfDesc;
exports.goPageBack = goPageBack;
exports.goPageCertificate = goPageCertificate;
exports.goPageChangePhone = goPageChangePhone;
exports.goPageChatRoom = goPageChatRoom;
exports.goPageCompanyDetail = goPageCompanyDetail;
exports.goPageJobCollection = goPageJobCollection;
exports.goPageJobDetail = goPageJobDetail;
exports.goPageSetting = goPageSetting;
exports.goPageSubmitted = goPageSubmitted;
exports.goPageVerification = goPageVerification;
exports.routeInterceptor = routeInterceptor;
