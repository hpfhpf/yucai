"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("./request.js");
const OPENID_STORAGE_KEY = "wx_openid";
const getCachedOpenId = () => {
  return common_vendor.index.getStorageSync(OPENID_STORAGE_KEY) || "";
};
const getWxLoginCode = () => {
  return new Promise((resolve, reject) => {
    if (typeof common_vendor.wx$1 === "undefined" || typeof common_vendor.wx$1.login !== "function") {
      reject(new Error("wx.login is not available"));
      return;
    }
    common_vendor.wx$1.login({
      success(res) {
        if (!(res == null ? void 0 : res.code)) {
          reject(new Error("wx.login: empty code"));
          return;
        }
        resolve(res.code);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};
const fetchOpenIdByCode = async (code) => {
  var _a;
  const res = await utils_request.request({
    url: "/wx/openid",
    method: "POST",
    data: { code }
  });
  const openid = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.openid) || (res == null ? void 0 : res.openid);
  if (!openid)
    throw new Error("Backend did not return openid");
  return openid;
};
const loginAndGetOpenId = async () => {
  const cached = getCachedOpenId();
  if (cached)
    return cached;
  const code = await getWxLoginCode();
  const openid = await fetchOpenIdByCode(code);
  common_vendor.index.setStorageSync(OPENID_STORAGE_KEY, openid);
  return openid;
};
const getWxUserProfile = () => {
  return new Promise((resolve, reject) => {
    if (typeof common_vendor.wx$1 === "undefined" || typeof common_vendor.wx$1.getUserProfile !== "function") {
      reject(new Error("wx.getUserProfile is not available"));
      return;
    }
    common_vendor.wx$1.getUserProfile({
      desc: "用于完善会员资料",
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};
exports.getWxUserProfile = getWxUserProfile;
exports.loginAndGetOpenId = loginAndGetOpenId;
