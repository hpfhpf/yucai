import { getNeedLoginPages } from "./page";
const LoginPageUrl = "/pages/login/index";
const TokenStorageKey = "token";
const RootPagePaths = new Set([
  "/pages/mine/index",
  "/pages/message/index",
  "/pages/seeker/index",
  "/pages/seeker/resumeCenter/index",
]);

const isLoggedIn = () => Boolean(uni.getStorageSync(TokenStorageKey));
const getPath = (url: string) => url.split("?")[0];
const getPageStackLength = () =>
  ((typeof getCurrentPages === "function" && getCurrentPages()) || []).length;

const checkAuth = (url: string) => {
  const path = getPath(url);
  if (path === LoginPageUrl) {
    return true;
  }

  const needLoginPage = getNeedLoginPages().map((p) => p.path);
  if (!needLoginPage.includes(path)) {
    return true;
  }

  if (isLoggedIn()) {
    return true;
  }

  const redirectRoute = `${LoginPageUrl}?redirect=${encodeURIComponent(url)}`;
  uni.navigateTo({ url: redirectRoute });
  return false;
};

/**
 * @Description: 路由拦截
 */
const navigateToInterceptor = {
  invoke({ url }: { url: string }) {
    if (!checkAuth(url)) {
      return false;
    }

    const path = getPath(url);
    if (path === LoginPageUrl) {
      return true;
    }

    if (RootPagePaths.has(path)) {
      uni.reLaunch({ url });
      return false;
    }

    if (getPageStackLength() >= 9) {
      uni.redirectTo({ url });
      return false;
    }

    return true;
  },
};

const reLaunchAndRedirectInterceptor = {
  invoke({ url }: { url: string }) {
    return checkAuth(url);
  },
};

export const routeInterceptor = {
  install() {
    uni.addInterceptor("navigateTo", navigateToInterceptor);
    uni.addInterceptor("reLaunch", reLaunchAndRedirectInterceptor);
    uni.addInterceptor("redirectTo", reLaunchAndRedirectInterceptor);
  },
};

export const goPageBack = () => {
  // 获取当前页面栈
  const pages = getCurrentPages();

  // 如果页面栈大于1，说明有上一页，正常返回
  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1,
    });
  } else {
    uni.navigateTo({
      url: "/pages/seeker/index",
    });
  }
};

export const goPageIndex = (user_id: string = "") => {
  const url = user_id
    ? `/pages/seeker/index?user_id=${encodeURIComponent(user_id)}`
    : "/pages/seeker/index";

  uni.reLaunch({
    url,
  });
};

export const goPageMeeting = () => {
  uni.navigateTo({
    url: `/pages/meeting/index`,
  });
};
// 添加项目经历
export const goPageAddProject = () => {
  uni.navigateTo({
    url: `/pages/seeker/resumeCenter/project`,
  });
};
// 添加工作经历
export const goPageAddJob = () => {
  uni.navigateTo({
    url: `/pages/seeker/resumeCenter/job`,
  });
};
// 添加教育经历
export const goPageAddEducation = () => {
  uni.navigateTo({
    url: `/pages/seeker/resumeCenter/education`,
  });
};
// 编辑个人信息
export const goPageAddInformation = () => {
  uni.navigateTo({
    url: `/pages/seeker/resumeCenter/Information`,
  });
};
// 编辑自我描述
export const goPageAddSelfDesc = () => {
  uni.navigateTo({
    url: `/pages/seeker/resumeCenter/selfDesc`,
  });
};
// 聊天室
export const goPageChatRoom = () => {
  uni.navigateTo({
    url: `/pages/message/chatRoom`,
  });
};
// 我的投递
export const goPageSubmitted = () => {
  uni.navigateTo({
    url: `/pages/mine/submitted`,
  });
};
// 著位收藏
export const goPageJobCollection = () => {
  uni.navigateTo({
    url: `/pages/mine/jobCollection`,
  });
};
// 设置
export const goPageSetting = () => {
  uni.navigateTo({
    url: `/pages/mine/setting`,
  });
};
// 认证记录
export const goPageCertificate = () => {
  uni.navigateTo({
    url: `/pages/mine/certificate`,
  });
};
// 实名认证
export const goPageVerification = () => {
  uni.navigateTo({
    url: `/pages/mine/verification`,
  });
};
//修改手机号
export const goPageChangePhone = () => {
  uni.navigateTo({
    url: `/pages/mine/changePhone`,
  });
};
// 公司详情
export const goPageCompanyDetail = () => {
  uni.navigateTo({
    url: `/pages/recommendation/detail/company`,
  });
};
// 岗位详情
export const goPageJobDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/recommendation/detail/index?id=${id}`,
  });
};
