"use strict";
const common_vendor = require("../common/vendor.js");
const pinia = common_vendor.createPinia();
pinia.use(
  common_vendor.createPersistedState({
    storage: {
      getItem: common_vendor.index.getStorageSync,
      setItem: common_vendor.index.setStorageSync
    }
  })
);
exports.pinia = pinia;
