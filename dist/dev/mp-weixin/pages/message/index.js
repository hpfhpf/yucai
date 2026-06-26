"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_message_pagedLoader = require("./pagedLoader.js");
const utils_route = require("../../utils/route.js");
if (!Array) {
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  _component_global_ku_root();
}
if (!Math) {
  (HeaderNav + BottomNav)();
}
const BottomNav = () => "../../components/BottomNav.js";
const HeaderNav = () => "../../components/HeaderNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    var _a;
    const activeTab = common_vendor.ref("invite");
    const inviteSeed = [
      {
        id: "i1",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i2",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i3",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i4",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      },
      {
        id: "i5",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "",
        hint: "我的投递",
        time: "01-07"
      }
    ];
    const chatSeed = [
      {
        id: "c1",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "已读：好的，稍后联系你",
        hint: "聊天",
        time: "01-07"
      },
      {
        id: "c2",
        title: "连锁餐厅",
        sub: "服务员    购买社保    【全职】",
        meta: "未读：面试时间可以调整吗？",
        hint: "聊天",
        time: "01-06"
      }
    ];
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const buildInviteItem = (idx) => ({
      id: `i_${idx}`,
      title: idx % 3 === 0 ? "星辉餐饮" : idx % 2 === 0 ? "连锁餐厅" : "云海餐厅",
      sub: idx % 2 === 0 ? "服务员    购买社保    【全职】" : "前厅接待    包吃住    【全职】",
      meta: "",
      hint: "我的投递",
      time: `01-${String(idx % 28 + 1).padStart(2, "0")}`
    });
    const buildChatItem = (idx) => ({
      id: `c_${idx}`,
      title: idx % 2 === 0 ? "连锁餐厅" : "林溪咖啡",
      sub: idx % 2 === 0 ? "服务员    购买社保    【全职】" : "咖啡师    调休双休    【全职】",
      meta: idx % 3 === 0 ? "已读：好的，稍后联系你" : "未读：明天上午方便面试吗？",
      hint: "聊天",
      time: `01-${String(idx % 28 + 1).padStart(2, "0")}`
    });
    const mockFetchMessages = async (tab, params) => {
      await delay(280);
      const total = tab === "invite" ? 36 : 28;
      const seed = tab === "invite" ? inviteSeed : chatSeed;
      const start = (params.page - 1) * params.pageSize;
      const end = Math.min(start + params.pageSize, total);
      if (start >= total) {
        return { items: [], total, hasMore: false };
      }
      const items = [];
      for (let i = start; i < end; i += 1) {
        if (i < seed.length) {
          items.push({ ...seed[i], id: `${tab}_${params.page}_${seed[i].id}_${i}` });
          continue;
        }
        items.push(tab === "invite" ? buildInviteItem(i + 1) : buildChatItem(i + 1));
      }
      return {
        items,
        total,
        hasMore: end < total
      };
    };
    const invitePager = pages_message_pagedLoader.createPagedLoader(
      (params) => mockFetchMessages("invite", params),
      { pageSize: 10, throttleMs: 320 }
    );
    const chatPager = pages_message_pagedLoader.createPagedLoader(
      (params) => mockFetchMessages("chat", params),
      { pageSize: 10, throttleMs: 320 }
    );
    const pagerMap = {
      invite: invitePager,
      chat: chatPager
    };
    const currentPager = common_vendor.computed(() => pagerMap[activeTab.value]);
    const currentList = common_vendor.computed(() => currentPager.value.state.list.value);
    const currentLoading = common_vendor.computed(() => currentPager.value.state.loading.value);
    const currentError = common_vendor.computed(() => currentPager.value.state.error.value);
    const currentHasMore = common_vendor.computed(() => currentPager.value.state.hasMore.value);
    const scrollTop = common_vendor.ref(0);
    const handleListScroll = (event) => {
      var _a2;
      scrollTop.value = ((_a2 = event.detail) == null ? void 0 : _a2.scrollTop) || 0;
    };
    const ensureLoaded = async (tab) => {
      const pager = pagerMap[tab];
      if (pager.state.list.value.length > 0 || pager.state.loading.value)
        return;
      await pager.loadMore();
    };
    const loadCurrentMore = async (retry = false) => {
      const keepTop = scrollTop.value;
      const loader = retry ? currentPager.value.retry : currentPager.value.loadMore;
      const loaded = await loader();
      if (loaded) {
        await common_vendor.nextTick$1();
        scrollTop.value = keepTop;
      }
    };
    const handleScrollToLower = () => {
      void loadCurrentMore(false);
    };
    const handleRetryTap = () => {
      void loadCurrentMore(true);
    };
    const systemInfo = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(systemInfo.statusBarHeight || 0);
    const navBarHeight = common_vendor.ref(44);
    const capsuleWidth = common_vendor.ref(88);
    const capsuleHeight = common_vendor.ref(32);
    const capsuleRight = common_vendor.ref(12);
    common_vendor.ref(((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0);
    {
      if (typeof common_vendor.wx$1 !== "undefined" && typeof common_vendor.wx$1.getMenuButtonBoundingClientRect === "function") {
        const rect = common_vendor.wx$1.getMenuButtonBoundingClientRect();
        if (rect) {
          capsuleWidth.value = rect.width;
          capsuleHeight.value = rect.height;
          capsuleRight.value = systemInfo.windowWidth - rect.right;
          const gap = rect.top - statusBarHeight.value;
          navBarHeight.value = rect.height + gap * 2;
        }
      }
    }
    const modalShown = common_vendor.ref(false);
    const modalVisible = common_vendor.ref(false);
    const modalItem = common_vendor.ref(null);
    let closeTimer = null;
    const openItemModal = async (item) => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      modalItem.value = item;
      modalShown.value = true;
      await common_vendor.nextTick$1();
      modalVisible.value = true;
    };
    const closeItemModal = () => {
      modalVisible.value = false;
      if (closeTimer)
        clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        modalShown.value = false;
        modalItem.value = null;
        closeTimer = null;
      }, 180);
    };
    const modalTitle = common_vendor.computed(() => activeTab.value === "invite" ? "面试邀请通知" : "聊天操作");
    const receiverName = common_vendor.computed(() => "张三先生");
    const interviewTime = common_vendor.computed(() => "2019-01-07 14:30");
    const phone = common_vendor.computed(() => "028-123456");
    const address = common_vendor.computed(() => "成都市武侯区泰达时代中心");
    const modalIntro = common_vendor.computed(() => {
      if (!modalItem.value)
        return "";
      if (activeTab.value === "invite") {
        return `恭喜你，投递的【${modalItem.value.sub}】岗位已通过简历筛选，现邀请你参加面试`;
      }
      return `与「${modalItem.value.title}」的聊天：${modalItem.value.sub}`;
    });
    const handleLinkTap = () => {
      common_vendor.index.showToast({ title: "查看面试须知", icon: "none" });
    };
    const handleItemTap = (item) => {
      if (activeTab.value === "chat") {
        utils_route.goPageChatRoom();
        return;
      }
      openItemModal(item);
    };
    common_vendor.watch(activeTab, (tab) => {
      void ensureLoaded(tab);
    });
    common_vendor.onMounted(() => {
      void ensureLoaded(activeTab.value);
    });
    common_vendor.onBeforeUnmount(() => {
      if (closeTimer)
        clearTimeout(closeTimer);
    });
    return (_ctx, _cache) => {
      var _a2, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.p({
          title: "消息中心",
          type: "show-back",
          theme: "000"
        }),
        b: activeTab.value === "invite"
      }, activeTab.value === "invite" ? {} : {}, {
        c: activeTab.value === "invite" ? 1 : "",
        d: common_vendor.o(($event) => activeTab.value = "invite", "8d"),
        e: activeTab.value === "chat"
      }, activeTab.value === "chat" ? {} : {}, {
        f: activeTab.value === "chat" ? 1 : "",
        g: common_vendor.o(($event) => activeTab.value = "chat", "b6"),
        h: common_vendor.f(currentList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar
          }, item.avatar ? {
            b: item.avatar
          } : {}, {
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.sub),
            e: item.meta
          }, item.meta ? {
            f: common_vendor.t(item.meta)
          } : {}, {
            g: item.hint
          }, item.hint ? {
            h: common_vendor.t(item.hint)
          } : {}, {
            i: common_vendor.t(item.time),
            j: item.id,
            k: common_vendor.o(($event) => handleItemTap(item), item.id)
          });
        }),
        i: currentLoading.value
      }, currentLoading.value ? {} : currentError.value ? {
        k: common_vendor.o(handleRetryTap, "7e")
      } : !currentHasMore.value ? {} : {}, {
        j: currentError.value,
        l: !currentHasMore.value,
        m: scrollTop.value,
        n: common_vendor.o(handleListScroll, "63"),
        o: common_vendor.o(handleScrollToLower, "7e"),
        p: modalShown.value
      }, modalShown.value ? common_vendor.e({
        q: (_a2 = modalItem.value) == null ? void 0 : _a2.avatar
      }, ((_b = modalItem.value) == null ? void 0 : _b.avatar) ? {
        r: (_c = modalItem.value) == null ? void 0 : _c.avatar
      } : {}, {
        s: common_vendor.t((_d = modalItem.value) == null ? void 0 : _d.title),
        t: common_vendor.t(modalTitle.value),
        v: common_vendor.t(receiverName.value),
        w: common_vendor.t(modalIntro.value),
        x: common_vendor.t(interviewTime.value),
        y: common_vendor.t(phone.value),
        z: common_vendor.t(address.value),
        A: common_vendor.o(handleLinkTap, "14"),
        B: modalVisible.value ? 1 : "",
        C: common_vendor.o(() => {
        }, "c5"),
        D: modalVisible.value ? 1 : "",
        E: common_vendor.o(closeItemModal, "0f"),
        F: modalVisible.value ? 1 : "",
        G: common_vendor.o(closeItemModal, "fb")
      }) : {}, {
        H: common_vendor.p({
          ["active-index"]: 1,
          ["theme-color"]: "#0f5bff"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bdafde18"]]);
wx.createPage(MiniProgramPage);
