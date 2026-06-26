"use strict";
const pages = [
  {
    path: "pages/login/index",
    type: "home",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    }
  },
  {
    path: "pages/message/chatList",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/message/chatRoom",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/message/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/certificate",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/changePhone",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/jobCollection",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/setting",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/submitted",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/mine/verification",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recommendation/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recommendation/insert",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/jobPosting",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/registration",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/reset",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/resumeCenter",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/talents",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recruiter/verificationPhone",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recommendation/detail/company",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recommendation/detail/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/recommendation/position/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/Information",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/education",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/index",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/job",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/project",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  },
  {
    path: "pages/seeker/resumeCenter/selfDesc",
    type: "page",
    style: {}
  },
  {
    path: "pages/seeker/resumeCenter/workCertification",
    type: "page",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: ""
    },
    needLogin: true
  }
];
const subPackages = [];
const getAllPages = () => {
  const main = pages.map((p) => ({
    ...p,
    path: `/${p.path}`
  }));
  let sub = [];
  if (subPackages.length > 0) {
    subPackages.forEach((subPage) => {
      sub = [
        ...sub,
        ...subPage.pages.map((p) => ({
          ...p,
          path: `/${subPage.root}/${p.path}`
        }))
      ];
    });
  }
  return [...main, ...sub];
};
const getNeedLoginPages = () => {
  return getAllPages().filter((p) => p && p.needLogin === true);
};
exports.getNeedLoginPages = getNeedLoginPages;
