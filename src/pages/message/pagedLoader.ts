import { ref, shallowRef, type Ref, type ShallowRef } from "vue";

export type PagedResult<T> = {
  items: T[];
  total?: number;
  hasMore?: boolean;
};

export type PagedFetcher<T> = (params: {
  page: number;
  pageSize: number;
}) => Promise<PagedResult<T>>;

export type PagedState<T> = {
  list: ShallowRef<T[]>;
  page: Ref<number>;
  pageSize: number;
  loading: Ref<boolean>;
  error: Ref<string>;
  hasMore: Ref<boolean>;
};

export type PagedLoader<T> = {
  state: PagedState<T>;
  loadMore: () => Promise<boolean>;
  retry: () => Promise<boolean>;
  reset: () => Promise<boolean>;
};

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    return err.message || "加载失败，请稍后重试";
  }
  if (typeof err === "string") {
    return err || "加载失败，请稍后重试";
  }
  return "加载失败，请稍后重试";
};

export const createPagedLoader = <T>(
  fetcher: PagedFetcher<T>,
  options?: { pageSize?: number; throttleMs?: number },
): PagedLoader<T> => {
  const pageSize = options?.pageSize ?? 10;
  const throttleMs = options?.throttleMs ?? 300;
  const state: PagedState<T> = {
    list: shallowRef<T[]>([]),
    page: ref(0),
    pageSize,
    loading: ref(false),
    error: ref(""),
    hasMore: ref(true),
  };

  let failedPage = 0;
  let lastTriggerAt = 0;

  const load = async (retryMode: boolean) => {
    if (state.loading.value) return false;
    if (!retryMode && !state.hasMore.value) return false;

    const now = Date.now();
    if (!retryMode && now - lastTriggerAt < throttleMs) {
      return false;
    }
    lastTriggerAt = now;

    const targetPage =
      retryMode && failedPage > 0 ? failedPage : state.page.value + 1;

    state.loading.value = true;
    state.error.value = "";

    try {
      const result = await fetcher({
        page: targetPage,
        pageSize: state.pageSize,
      });
      const mergedList =
        targetPage === 1
          ? result.items
          : [...state.list.value, ...result.items];
      state.list.value = mergedList;
      state.page.value = targetPage;
      failedPage = 0;

      let nextHasMore =
        typeof result.hasMore === "boolean"
          ? result.hasMore
          : result.items.length >= state.pageSize;
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
    reset,
  };
};
