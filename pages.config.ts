import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";

export default defineUniPages({
  // 你也可以定义 pages 字段，它具有最高的优先级。
  pages: [
    {
      path: "pages/admin/index",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/users",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/companies",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/jobs",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/idVerify",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/system",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/admin/admins",
      needLogin: true,
      style: { navigationStyle: "custom", navigationBarTitleText: "" },
    },
    {
      path: "pages/login/index",
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/message/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/message/chatList",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/message/chatRoom",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/referralHistory",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/interview",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/credit",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/feedback",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/about",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/jobCollection",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/setting",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/changePhone",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/verification",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/certificate",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recommendation/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recommendation/insert",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recommendation/detail/company",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recommendation/detail/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recommendation/position/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/jobPosting",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/aiJobPosting/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/newsDetail",
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/registration",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/reset",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/resumeCenter",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/talents",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/resumeDetail",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/recruiter/verificationPhone",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/mine/submitted",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/Information",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/education",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/job",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/project",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
    {
      path: "pages/seeker/resumeCenter/workCertification/index",
      needLogin: true,
      style: {
        navigationStyle: "custom",
        navigationBarTitleText: "",
      },
    },
  ],
  globalStyle: {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8",
  },
});
