"use strict";const e=require("../common/vendor.js"),t=e.createPinia();t.use(e.createPersistedState({storage:{getItem:e.index.getStorageSync,setItem:e.index.setStorageSync}})),exports.pinia=t;
