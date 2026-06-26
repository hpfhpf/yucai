"use strict";
const common_vendor = require("../../common/vendor.js");
const getErrorMessage = (err) => {
  if (err instanceof Error) {
    return err.message || "加载失败，请稍后重试";
  }
  if (typeof err === "string") {
    return err || "加载失败，请稍后重试";
  }
  return "加载失败，请稍后重试";
};
const createPagedLoader = (fetcher, options) => {
  const pageSize = (options == null ? void 0 : options.pageSize) ?? 10;
  const throttleMs = (options == null ? void 0 : options.throttleMs) ?? 300;
  const state = {
    list: common_vendor.shallowRef([]),
    page: common_vendor.ref(0),
    pageSize,
    loading: common_vendor.ref(false),
    error: common_vendor.ref(""),
    hasMore: common_vendor.ref(true)
  };
  let failedPage = 0;
  let lastTriggerAt = 0;
  const load = async (retryMode) => {
    if (state.loading.value)
      return false;
    if (!retryMode && !state.hasMore.value)
      return false;
    const now = Date.now();
    if (!retryMode && now - lastTriggerAt < throttleMs) {
      return false;
    }
    lastTriggerAt = now;
    const targetPage = retryMode && failedPage > 0 ? failedPage : state.page.value + 1;
    state.loading.value = true;
    state.error.value = "";
    try {
      const result = await fetcher({
        page: targetPage,
        pageSize: state.pageSize
      });
      const mergedList = targetPage === 1 ? result.items : [...state.list.value, ...result.items];
      state.list.value = mergedList;
      state.page.value = targetPage;
      failedPage = 0;
      let nextHasMore = typeof result.hasMore === "boolean" ? result.hasMore : result.items.length >= state.pageSize;
      if (typeof result.total === "number") {
        nextHasMore = targetPage * state.pageSize < result.total;
      }
      state.hasMore.value = nextHasMore;
      return true;
    } catch (err) {
      state.error.value = getErrorMessage(err);
      failedPage = targetPage;
      return false;
    } finally {
      state.loading.value = false;
    }
  };
  const loadMore = () => load(false);
  const retry = () => load(true);
  const reset = async () => {
    state.list.value = [];
    state.page.value = 0;
    state.error.value = "";
    state.hasMore.value = true;
    failedPage = 0;
    return load(true);
  };
  return {
    state,
    loadMore,
    retry,
    reset
  };
};
exports.createPagedLoader = createPagedLoader;
