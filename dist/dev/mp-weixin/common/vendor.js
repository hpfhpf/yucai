"use strict";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value) || isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_LAST_PAGE_BACK_PRESS = "onLastPageBackPress";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_UPLOAD_DOUYIN_VIDEO = "onUploadDouyinVideo";
const ON_LIVE_MOUNT = "onLiveMount";
const ON_TITLE_CLICK = "onTitleClick";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_COPY_URL = "onCopyUrl";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString$1(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED,
  ON_LAST_PAGE_BACK_PRESS
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2,
    onShareChat: 1 << 3,
    onCopyUrl: 1 << 4,
    onUploadDouyinVideo: 1 << 5,
    onLiveMount: 1 << 6,
    onTitleClick: 1 << 7
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction$1(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages2) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  const lang2 = startsWith(locale, locales);
  if (lang2) {
    return lang2;
  }
}
function getLocaleLanguage$1() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp$1(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString$1(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray$1(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp$1(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage$1(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$2(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType$2(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction$1(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction$1(success);
  const hasFail = isFunction$1(fail);
  const hasComplete = isFunction$1(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction$1(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction$1(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue$1(hooks, data, params) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise$1(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray$1(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue$1(hooks, res, options).then((res2) => {
        return isFunction$1(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray$1(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray$1(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray$1(interceptor.invoke)) {
      const res = queue$1(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction$1(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, extend({}, args), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend({}, args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString$1(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a, _b;
  let windowWidth, pixelRatio, platform;
  {
    const windowInfo = ((_a = wx.getWindowInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction$1(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray$1(hooks) && isFunction$1(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray$1(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray$1(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction$1(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction$1(options.success) || isFunction$1(options.fail) || isFunction$1(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, extend({}, options), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction$1(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction$1(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString$1(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction$1(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction$1(fromArgs)) {
      if (isFunction$1(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction$1(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction$1(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction$1(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction$1(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app = isFunction$1(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || platform;
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "",
    appName: "",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "5.07",
    uniCompilerVersion: "5.07",
    uniRuntimeVersion: "5.07",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo$1 = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo$1;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray$1(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    });
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      appId: "",
      appName: "",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "5.07",
      uniCompilerVersion: "5.07",
      uniRuntimeVersion: "5.07"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    });
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction$1(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction$1(fail) && fail(res);
    }
    isFunction$1(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.getAppBaseInfo || !wx$2.getAppBaseInfo()) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getWindowInfo || !wx$2.getWindowInfo()) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getDeviceInfo || !wx$2.getDeviceInfo()) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo: getSystemInfo$1,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self = toRaw(this);
    if ((!self._cacheable || self.effect.dirty) && hasChanged(self._value, self._value = self.effect.run())) {
      triggerRefValue(self, 4);
    }
    trackRefValue(self);
    if (self.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self, 2);
    }
    return self._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString$1(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise$1(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction$1(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.`;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction$1(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction$1(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context2 = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context2.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context2,
      _instance: null,
      version,
      get config() {
        return context2.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction$1(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction$1(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context2.mixins.includes(mixin)) {
            context2.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context2.config);
        }
        if (!component) {
          return context2.components[name];
        }
        if (context2.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context2.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context2.directives[name];
        }
        if (context2.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context2.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context2.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context2.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction$1(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
function getComponentInternalInstance(i) {
  return i;
}
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    // fixed by xxxxxx
    $: getComponentInternalInstance,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (instance.exposed && hasOwn(instance.exposed, key)) {
      return instance.exposed[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString$1(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function useSlots() {
  return getContext().slots;
}
function getContext() {
  const i = getCurrentInstance();
  if (!i) {
    warn$1(`useContext() called without active instance.`);
  }
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction$1(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise$1(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$1(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && patchFlag > 0 && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = normalizeInheritAttrsValue(instance, key, value);
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = normalizeInheritAttrsValue(instance, key, value);
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          {
            props[camelKey] = value;
          }
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = normalizeInheritAttrsValue(instance, key, value);
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function normalizeInheritAttrsValue(instance, key, value) {
  return value;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const result = _resolvePropValue(
    options,
    props,
    key,
    value,
    instance,
    isAbsent
  );
  return result;
}
function _resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString$1(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$1(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType$1(a) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$1(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode$1(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise$1(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    if (isVNode$1(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
const isRuntimeOnly = () => true;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray$1(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction$1(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray$1(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    if ($mpPlatform !== "mp-alipay") {
      $templateRefs && $templateRefs.forEach(
        (templateRef) => setTemplateRef(templateRef, null, setupState)
      );
    }
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($mpPlatform !== "mp-alipay") {
    if ($scope._$setRef) {
      $scope._$setRef(doSet);
    } else {
      nextTick(instance, doSet);
    }
  }
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray$1(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
}
function toSkip(value) {
  if (isObject$1(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction$1(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString$1(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray$1(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  instance.renderer = options.mpType ? options.mpType : "component";
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function clearTemplateRefs(templateRefs) {
  if (!templateRefs) {
    return [];
  }
  return templateRefs.filter((templateRef) => {
    const v = templateRef.v;
    if (v && typeof v === "object" && ["UNI-LOADING-ELEMENT", "UNI-CLOUD-DB-ELEMENT"].includes(v.nodeName)) {
      return true;
    }
    return false;
  });
}
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = clearTemplateRefs(
    instance.$templateRefs || []
  );
  instance.$templateUniElementRefs = clearTemplateRefs(
    instance.$templateUniElementRefs || []
  );
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString$1(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction$1(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component" || // instance.renderer 标识页面是否作为组件渲染
  mpType === "page" && instance.renderer === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray$1(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set$2(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set$2;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function stringifyStyle(value) {
  if (isString$1(value)) {
    return value;
  }
  return stringify(normalizeStyle(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString$1(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate(key)}:${styles[key]};`;
  }
  return ret;
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString$1(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray$1(res) || isPromise$1(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray$1(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(name, props = {}, key) {
  const instance = getCurrentInstance();
  const { parent, isMounted, ctx: { $scope } } = instance;
  const vueIds = ($scope.properties || $scope.props).uI;
  if (!vueIds) {
    return;
  }
  if (!parent && !isMounted) {
    onMounted(() => {
      renderSlot(name, props, key);
    }, instance);
    return;
  }
  const invoker = findScopedSlotInvoker(vueIds, instance);
  if (invoker) {
    invoker(name, props, key);
  }
}
function findScopedSlotInvoker(vueId, instance) {
  let parent = instance.parent;
  while (parent) {
    const invokers = parent.$ssi;
    if (invokers && invokers[vueId]) {
      return invokers[vueId];
    }
    parent = parent.parent;
  }
}
function withScopedSlot(fn, { name, path, vueId }) {
  const instance = getCurrentInstance();
  fn.path = path;
  const scopedSlots = instance.$ssi || (instance.$ssi = {});
  const invoker = scopedSlots[vueId] || (scopedSlots[vueId] = createScopedSlotInvoker(instance));
  if (!invoker.slots[name]) {
    invoker.slots[name] = {
      fn
    };
  } else {
    invoker.slots[name].fn = fn;
  }
  return getValueByDataPath(instance.ctx.$scope.data, path);
}
function createScopedSlotInvoker(instance) {
  const invoker = (slotName, args, index2) => {
    const slot = invoker.slots[slotName];
    if (!slot) {
      return;
    }
    const hasIndex = typeof index2 !== "undefined";
    index2 = index2 || 0;
    const prevInstance = setCurrentRenderingInstance(instance);
    const data = slot.fn(args, slotName + (hasIndex ? "-" + index2 : ""), index2);
    const path = slot.fn.path;
    setCurrentRenderingInstance(prevInstance);
    (instance.$scopedSlotsData || (instance.$scopedSlotsData = [])).push({
      path,
      index: index2,
      data
    });
    instance.$updateScopedSlots();
  };
  invoker.slots = {};
  return invoker;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o = (value, key) => vOn(value, key);
const f = (source, renderItem) => vFor(source, renderItem);
const r = (name, props, key) => renderSlot(name, props, key);
const w = (fn, options) => withScopedSlot(fn, options);
const s = (value) => stringifyStyle(value);
const e = (target, ...sources) => extend(target, ...sources);
const n = (value) => normalizeClass(value);
const t = (val) => toDisplayString(val);
const p = (props) => renderProps(props);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray$1(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray$1(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray$1(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction$1(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction$1(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction$1(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction$1(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray$1(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray$1(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction$1(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray$1(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray$1(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray$1(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray$1(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$1(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = getCurrentInstance()) => {
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
};
const onShow = /* @__PURE__ */ createLifeCycleHook(
  ON_SHOW,
  1 | 2
  /* HookFlags.PAGE */
);
const onHide = /* @__PURE__ */ createLifeCycleHook(
  ON_HIDE,
  1 | 2
  /* HookFlags.PAGE */
);
const onLaunch = /* @__PURE__ */ createLifeCycleHook(
  ON_LAUNCH,
  1
  /* HookFlags.APP */
);
const onLoad = /* @__PURE__ */ createLifeCycleHook(
  ON_LOAD,
  2
  /* HookFlags.PAGE */
);
/*!
* pinia v2.0.36
* (c) 2023 Eduardo San Martin Morote
* @license MIT
*/
const piniaSymbol = Symbol("pinia");
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = typeof window !== "undefined";
const USE_DEVTOOLS = IS_CLIENT;
const componentStateTypes = [];
const getStoreType = (id) => "🍍 " + id;
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
}
function patchActionForGrouping(store, actionNames) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const trackedStore = new Proxy(store, {
        get(...args) {
          return Reflect.get(...args);
        },
        set(...args) {
          return Reflect.set(...args);
        }
      });
      return actions[actionName].apply(trackedStore, arguments);
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  if (options.state) {
    store._isOptionsAPI = true;
  }
  if (typeof options.state === "function") {
    patchActionForGrouping(
      // @ts-expect-error: can cast the store...
      store,
      Object.keys(options.actions)
    );
    const originalHotUpdate = store._hotUpdate;
    toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions));
    };
  }
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function isObject(v) {
  return typeof v === "object" && v !== null;
}
function normalizeOptions(options, factoryOptions) {
  options = isObject(options) ? options : /* @__PURE__ */ Object.create(null);
  return new Proxy(options, {
    get(target, key, receiver) {
      if (key === "key")
        return Reflect.get(target, key, receiver);
      return Reflect.get(target, key, receiver) || Reflect.get(factoryOptions, key, receiver);
    }
  });
}
function get(state, path) {
  return path.reduce((obj, p2) => {
    return obj == null ? void 0 : obj[p2];
  }, state);
}
function set(state, path, val) {
  return path.slice(0, -1).reduce((obj, p2) => {
    if (/^(__proto__)$/.test(p2))
      return {};
    else
      return obj[p2] = obj[p2] || {};
  }, state)[path[path.length - 1]] = val, state;
}
function pick(baseState, paths) {
  return paths.reduce((substate, path) => {
    const pathArray = path.split(".");
    return set(substate, pathArray, get(baseState, pathArray));
  }, {});
}
function parsePersistence(factoryOptions, store) {
  return (o2) => {
    var _a;
    try {
      const {
        storage = localStorage,
        beforeRestore = void 0,
        afterRestore = void 0,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse
        },
        key = store.$id,
        paths = null,
        debug = false
      } = o2;
      return {
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key: ((_a = factoryOptions.key) != null ? _a : (k) => k)(typeof key == "string" ? key : key(store.$id)),
        paths,
        debug
      };
    } catch (e2) {
      if (o2.debug)
        console.error("[pinia-plugin-persistedstate]", e2);
      return null;
    }
  };
}
function hydrateStore(store, { storage, serializer, key, debug }) {
  try {
    const fromStorage = storage == null ? void 0 : storage.getItem(key);
    if (fromStorage)
      store.$patch(serializer == null ? void 0 : serializer.deserialize(fromStorage));
  } catch (e2) {
    if (debug)
      console.error("[pinia-plugin-persistedstate]", e2);
  }
}
function persistState(state, { storage, serializer, key, paths, debug }) {
  try {
    const toStore = Array.isArray(paths) ? pick(state, paths) : state;
    storage.setItem(key, serializer.serialize(toStore));
  } catch (e2) {
    if (debug)
      console.error("[pinia-plugin-persistedstate]", e2);
  }
}
function createPersistedState(factoryOptions = {}) {
  return (context2) => {
    const { auto = false } = factoryOptions;
    const {
      options: { persist = auto },
      store,
      pinia
    } = context2;
    if (!persist)
      return;
    if (!(store.$id in pinia.state.value)) {
      const original_store = pinia._s.get(store.$id.replace("__hot:", ""));
      if (original_store)
        Promise.resolve().then(() => original_store.$persist());
      return;
    }
    const persistences = (Array.isArray(persist) ? persist.map((p2) => normalizeOptions(p2, factoryOptions)) : [normalizeOptions(persist, factoryOptions)]).map(parsePersistence(factoryOptions, store)).filter(Boolean);
    store.$persist = () => {
      persistences.forEach((persistence) => {
        persistState(store.$state, persistence);
      });
    };
    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((persistence) => {
        const { beforeRestore, afterRestore } = persistence;
        if (runHooks)
          beforeRestore == null ? void 0 : beforeRestore(context2);
        hydrateStore(store, persistence);
        if (runHooks)
          afterRestore == null ? void 0 : afterRestore(context2);
      });
    };
    persistences.forEach((persistence) => {
      const { beforeRestore, afterRestore } = persistence;
      beforeRestore == null ? void 0 : beforeRestore(context2);
      hydrateStore(store, persistence);
      afterRestore == null ? void 0 : afterRestore(context2);
      store.$subscribe(
        (_mutation, state) => {
          persistState(state, persistence);
        },
        {
          detached: true
        }
      );
    });
  };
}
class AbortablePromise {
  constructor(executor) {
    this._reject = null;
    this.promise = new Promise((resolve2, reject) => {
      executor(resolve2, reject);
      this._reject = reject;
    });
  }
  // 提供abort方法来中止Promise
  abort(error) {
    if (this._reject) {
      this._reject(error);
    }
  }
  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.promise.catch(onrejected);
  }
}
function uuid() {
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
function s4() {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
}
function addUnit(num) {
  return Number.isNaN(Number(num)) ? `${num}` : `${num}px`;
}
function isObj(value) {
  return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
}
function getType(target) {
  const typeStr = Object.prototype.toString.call(target);
  const match = typeStr.match(/\[object (\w+)\]/);
  const type = match && match.length ? match[1].toLowerCase() : "";
  return type;
}
const isDef = (value) => value !== void 0 && value !== null;
const checkNumRange = (num, label = "value") => {
  if (num < 0) {
    throw new Error(`${label} shouldn't be less than zero`);
  }
};
const range = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
const isEqual = (value1, value2) => {
  if (value1 === value2) {
    return true;
  }
  if (!Array.isArray(value1) || !Array.isArray(value2)) {
    return false;
  }
  if (value1.length !== value2.length) {
    return false;
  }
  for (let i = 0; i < value1.length; ++i) {
    if (value1[i] !== value2[i]) {
      return false;
    }
  }
  return true;
};
const padZero = (number, length = 2) => {
  let numStr = number.toString();
  while (numStr.length < length) {
    numStr = "0" + numStr;
  }
  return numStr;
};
const context = {
  id: 1e3
};
function getRect(selector, all, scope, useFields) {
  return new Promise((resolve2, reject) => {
    var _a;
    const selectorQuery = (_a = index.createSelectorQuery) == null ? void 0 : _a.call(index);
    if (!selectorQuery) {
      reject(new Error("createSelectorQuery is not available"));
      return;
    }
    const query = scope && isFunction(selectorQuery.in) ? selectorQuery.in(scope) : selectorQuery;
    const method = all ? "selectAll" : "select";
    const callback = (rect) => {
      if (all && isArray(rect) && rect.length > 0) {
        resolve2(rect);
      } else if (!all && rect) {
        resolve2(rect);
      } else {
        reject(new Error("No nodes found"));
      }
    };
    {
      query[method](selector).boundingClientRect(callback).exec();
    }
  });
}
function kebabCase(word) {
  const newWord = word.replace(/[A-Z]/g, function(match) {
    return "-" + match;
  }).toLowerCase();
  return newWord;
}
function camelCase(word) {
  return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === "[object Array]";
}
function isFunction(value) {
  return getType(value) === "function" || getType(value) === "asyncfunction";
}
function isString(value) {
  return getType(value) === "string";
}
function isNumber(value) {
  return getType(value) === "number";
}
function isPromise(value) {
  if (isObj(value) && isDef(value)) {
    return isFunction(value.then) && isFunction(value.catch);
  }
  return false;
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function objToStyle(styles) {
  if (isArray(styles)) {
    const result = styles.filter(function(item) {
      return item != null && item !== "";
    }).map(function(item) {
      return objToStyle(item);
    }).join(";");
    return result ? result.endsWith(";") ? result : result + ";" : "";
  }
  if (isString(styles)) {
    return styles ? styles.endsWith(";") ? styles : styles + ";" : "";
  }
  if (isObj(styles)) {
    const result = Object.keys(styles).filter(function(key) {
      return styles[key] != null && styles[key] !== "";
    }).map(function(key) {
      return [kebabCase(key), styles[key]].join(":");
    }).join(";");
    return result ? result.endsWith(";") ? result : result + ";" : "";
  }
  return "";
}
const pause = (ms = 1e3 / 30) => {
  return new AbortablePromise((resolve2) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve2(true);
    }, ms);
  });
};
function deepClone(obj, cache = /* @__PURE__ */ new Map()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (isDate(obj)) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message);
    errorCopy.stack = obj.stack;
    return errorCopy;
  }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  const copy = Array.isArray(obj) ? [] : {};
  cache.set(obj, copy);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache);
    }
  }
  return copy;
}
function deepMerge(target, source) {
  target = deepClone(target);
  if (typeof target !== "object" || typeof source !== "object") {
    throw new Error("Both target and source must be objects.");
  }
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    target[prop] = source[prop];
  }
  return target;
}
function deepAssign(target, source) {
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const newObjValue = source[key];
    if (isObj(targetValue) && isObj(newObjValue)) {
      deepAssign(targetValue, newObjValue);
    } else {
      target[key] = newObjValue;
    }
  });
  return target;
}
function debounce(func, wait, options = {}) {
  let timeoutId = null;
  let lastArgs;
  let lastThis;
  let result;
  const leading = isDef(options.leading) ? options.leading : false;
  const trailing = isDef(options.trailing) ? options.trailing : true;
  function invokeFunc() {
    if (lastArgs !== void 0) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = void 0;
    }
  }
  function startTimer() {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing) {
        invokeFunc();
      }
    }, wait);
  }
  function cancelTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    if (timeoutId === null) {
      if (leading) {
        invokeFunc();
      }
      startTimer();
    } else if (trailing) {
      cancelTimer();
      startTimer();
    }
    return result;
  }
  return debounced;
}
const getPropByPath = (obj, path) => {
  const keys = path.split(".");
  try {
    return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
  } catch (error) {
    return void 0;
  }
};
const isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
function isVideoUrl(url) {
  const videoRegex = /\.(ogm|webm|ogv|asx|m4v|mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|video)(?=$|[?#])/i;
  return videoRegex.test(url);
}
function isImageUrl(url) {
  const imageRegex = /\.(xbm|tif|pjp|apng|svgz|jpeg|jpg|heif|ico|tiff|heic|pjpeg|avif|gif|png|svg|webp|jfif|bmp|dpg|image)(?=$|[?#])/i;
  return imageRegex.test(url);
}
function omitBy(obj, predicate) {
  const newObj = deepClone(obj);
  Object.keys(newObj).forEach((key) => predicate(newObj[key], key) && delete newObj[key]);
  return newObj;
}
function getSystemInfo() {
  let systemInfo;
  try {
    const deviceInfo = index.getDeviceInfo();
    const windowInfo = index.getWindowInfo();
    const appBaseInfo = index.getAppBaseInfo();
    systemInfo = {
      ...deviceInfo,
      ...windowInfo,
      ...appBaseInfo
    };
  } catch (error) {
    console.warn("获取系统信息失败，降级使用uni.getSystemInfoSync:", error);
    systemInfo = index.getSystemInfoSync();
  }
  return systemInfo;
}
const toastDefaultOptionKey = "__TOAST_OPTION__";
const defaultOptions$2 = {
  duration: 2e3,
  show: false
};
const None$2 = Symbol("None");
const toastTimerMap = /* @__PURE__ */ new Map();
function useToast(selector = "") {
  const toastOptionKey = getToastOptionKey(selector);
  const toastOption = inject(toastOptionKey, ref(None$2));
  if (toastOption.value === None$2) {
    toastOption.value = defaultOptions$2;
    provide(toastOptionKey, toastOption);
  }
  const createMethod = (toastOptions) => {
    return (options) => {
      return show(deepMerge(toastOptions, typeof options === "string" ? { msg: options } : options));
    };
  };
  const show = (option) => {
    const options = deepMerge(defaultOptions$2, typeof option === "string" ? { msg: option } : option);
    toastOption.value = deepMerge(options, {
      show: true
    });
    const prevTimer = toastTimerMap.get(toastOptionKey);
    if (prevTimer) {
      clearTimeout(prevTimer);
      toastTimerMap.delete(toastOptionKey);
    }
    if (options.duration && options.duration > 0) {
      const nextTimer = setTimeout(() => {
        toastTimerMap.delete(toastOptionKey);
        close();
      }, options.duration);
      toastTimerMap.set(toastOptionKey, nextTimer);
    }
  };
  const loading = createMethod({
    iconName: "loading",
    duration: 0,
    cover: true
  });
  const success = createMethod({
    iconName: "success",
    duration: 1500
  });
  const error = createMethod({ iconName: "error" });
  const warning = createMethod({ iconName: "warning" });
  const info = createMethod({ iconName: "info" });
  const close = () => {
    const timer = toastTimerMap.get(toastOptionKey);
    if (timer) {
      clearTimeout(timer);
      toastTimerMap.delete(toastOptionKey);
    }
    toastOption.value = { show: false };
  };
  return {
    show,
    loading,
    success,
    error,
    warning,
    info,
    close
  };
}
const getToastOptionKey = (selector) => {
  return selector ? `${toastDefaultOptionKey}${selector}` : toastDefaultOptionKey;
};
const toastIcon = {
  success: "check-circle",
  warning: "exclamation-circle",
  info: "info-circle",
  error: "close-circle"
};
function useParent(key) {
  const result = {
    parent: shallowRef(null),
    index: ref(-1)
  };
  result.parent.value = inject(key, null);
  if (result.parent.value) {
    const instance = getCurrentInstance();
    const { link, unlink, internalChildren } = result.parent.value;
    link(instance);
    onUnmounted(() => unlink(instance));
    result.index = computed(() => internalChildren.indexOf(instance));
  }
  return result;
}
const numericProp = [Number, String];
const makeRequiredProp = (type) => ({
  type,
  required: true
});
const makeArrayProp = () => ({
  type: Array,
  default: () => []
});
const makeBooleanProp = (defaultVal) => ({
  type: Boolean,
  default: defaultVal
});
const makeNumberProp = (defaultVal) => ({
  type: Number,
  default: defaultVal
});
const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal
});
const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});
const baseProps = {
  /**
   * 自定义根节点样式
   */
  customStyle: makeStringProp(""),
  /**
   * 自定义根节点样式类
   */
  customClass: makeStringProp("")
};
const CELL_GROUP_KEY = Symbol("wd-cell-group");
const cellGroupProps = {
  ...baseProps,
  /**
   * 分组标题
   * 类型: string
   */
  title: String,
  /**
   * 分组右侧内容
   * 类型: string
   */
  value: String,
  /**
   * 是否展示外边框
   * 类型: boolean
   * 默认值: false
   */
  border: makeBooleanProp(false),
  /**
   * 是否展示为圆角卡片风格
   * 类型: boolean
   * 默认值: false
   */
  insert: makeBooleanProp(false),
  /**
   * 是否使内容垂直居中
   * 类型: boolean
   * 默认值: false
   */
  center: makeBooleanProp(false),
  /**
   * 单元格大小
   * 类型: CellSize
   * 可选值: 'large'
   */
  size: String,
  /**
   * 左侧标题宽度
   * 类型: string | number
   */
  titleWidth: numericProp,
  /**
   * 单元格布局方式
   * 类型: CellLayout
   * 可选值: 'horizontal' | 'vertical'
   */
  layout: String,
  /**
   * 右侧内容对齐方式
   * 类型: CellValueAlign
   * 可选值: 'left' | 'right' | 'center'
   */
  valueAlign: String
};
function useCell() {
  const { parent: cellGroup, index: index2 } = useParent(CELL_GROUP_KEY);
  const border = computed(() => {
    return (cellGroup == null ? void 0 : cellGroup.value) && cellGroup.value.props.border && index2.value;
  });
  const center = computed(() => {
    var _a;
    return (_a = cellGroup.value) == null ? void 0 : _a.props.center;
  });
  const size2 = computed(() => {
    var _a;
    return (_a = cellGroup.value) == null ? void 0 : _a.props.size;
  });
  const titleWidth = computed(() => {
    var _a;
    return (_a = cellGroup.value) == null ? void 0 : _a.props.titleWidth;
  });
  const layout = computed(() => {
    var _a;
    return ((_a = cellGroup.value) == null ? void 0 : _a.props.layout) || void 0;
  });
  const valueAlign = computed(() => {
    var _a;
    return ((_a = cellGroup.value) == null ? void 0 : _a.props.valueAlign) || void 0;
  });
  return { border, center, size: size2, titleWidth, layout, valueAlign };
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function flattenVNodes(children) {
  const result = [];
  const traverse2 = (children2) => {
    const vNode = Array.isArray(children2) ? children2 : [children2];
    vNode.forEach((child) => {
      var _a;
      if (Array.isArray(child)) {
        traverse2(child);
      } else if (isVNode(child) && ((_a = child.component) == null ? void 0 : _a.subTree)) {
        result.push(child);
        traverse2(child.component.subTree);
      } else if (isVNode(child) && Array.isArray(child.children)) {
        traverse2(child.children);
      } else if (isVNode(child)) {
        result.push(child);
      }
    });
  };
  traverse2(children);
  return result;
}
const findVNodeIndex = (vnodes, vnode) => {
  const index2 = vnodes.indexOf(vnode);
  if (index2 === -1) {
    return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
  }
  return index2;
};
function sortChildren(parent, publicChildren, internalChildren) {
  const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree) : [];
  internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
  const orderedPublicChildren = internalChildren.map((item) => item.proxy);
  publicChildren.sort((a, b) => {
    const getIndex = (comp) => {
      const uid2 = comp.$.uid;
      return orderedPublicChildren.findIndex((i) => i.$.uid === uid2);
    };
    const indexA = getIndex(a);
    const indexB = getIndex(b);
    return indexA - indexB;
  });
}
function useChildren(key) {
  const publicChildren = reactive([]);
  const internalChildren = reactive([]);
  const parent = getCurrentInstance();
  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        if (internalChildren.indexOf(child) === -1) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      }
    };
    const unlink = (child) => {
      const index2 = internalChildren.indexOf(child);
      publicChildren.splice(index2, 1);
      internalChildren.splice(index2, 1);
    };
    provide(
      key,
      Object.assign(
        {
          link,
          unlink,
          children: publicChildren,
          internalChildren
        },
        value
      )
    );
  };
  return {
    children: publicChildren,
    linkChildren
  };
}
const queueKey = "__QUEUE_KEY__";
function useQueue() {
  const queue2 = ref([]);
  function pushToQueue(comp) {
    queue2.value.push(comp);
  }
  function removeFromQueue(comp) {
    queue2.value = queue2.value.filter((item) => {
      return item.$.uid !== comp.$.uid;
    });
  }
  function closeOther(comp) {
    queue2.value.forEach((item) => {
      if (item.$.uid !== comp.$.uid) {
        item.$.exposed.close();
      }
    });
  }
  function closeOutside() {
    queue2.value.forEach((item) => {
      item.$.exposed.close();
    });
  }
  provide(queueKey, {
    queue: queue2,
    pushToQueue,
    removeFromQueue,
    closeOther,
    closeOutside
  });
  return {
    closeOther,
    closeOutside
  };
}
function useTouch() {
  const direction = ref("");
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const startX = ref(0);
  const startY = ref(0);
  function touchStart(event) {
    const touch = event.touches[0];
    direction.value = "";
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    startX.value = touch.clientX;
    startY.value = touch.clientY;
  }
  function touchMove(event) {
    const touch = event.touches[0];
    deltaX.value = touch.clientX - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    direction.value = offsetX.value > offsetY.value ? "horizontal" : offsetX.value < offsetY.value ? "vertical" : "";
  }
  return {
    touchStart,
    touchMove,
    direction,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    startX,
    startY
  };
}
const zhCN = {
  calendar: {
    placeholder: "请选择",
    title: "选择日期",
    day: "日",
    week: "周",
    month: "月",
    confirm: "确定",
    startTime: "开始时间",
    endTime: "结束时间",
    to: "至",
    timeFormat: "YY年MM月DD日 HH:mm:ss",
    dateFormat: "YYYY年MM月DD日",
    weekFormat: (year, week) => `${year} 第 ${week} 周`,
    startWeek: "开始周",
    endWeek: "结束周",
    startMonth: "开始月",
    endMonth: "结束月",
    monthFormat: "YYYY年MM月"
  },
  calendarView: {
    startTime: "开始",
    endTime: "结束",
    weeks: {
      sun: "日",
      mon: "一",
      tue: "二",
      wed: "三",
      thu: "四",
      fri: "五",
      sat: "六"
    },
    rangePrompt: (maxRange) => `选择天数不能超过${maxRange}天`,
    rangePromptWeek: (maxRange) => `选择周数不能超过${maxRange}周`,
    rangePromptMonth: (maxRange) => `选择月份不能超过${maxRange}个月`,
    monthTitle: "YYYY年M月",
    yearTitle: "YYYY年",
    month: "M月",
    hour: (value) => `${value}时`,
    minute: (value) => `${value}分`,
    second: (value) => `${value}秒`
  },
  collapse: {
    expand: "展开",
    retract: "收起"
  },
  cascader: {
    title: "请选择",
    placeholder: "请选择",
    select: "请选择",
    confirm: "确认"
  },
  datetimePicker: {
    start: "开始时间",
    end: "结束时间",
    to: "至",
    placeholder: "请选择",
    confirm: "完成",
    cancel: "取消"
  },
  loadmore: {
    loading: "正在努力加载中...",
    finished: "已加载完毕",
    error: "加载失败",
    retry: "点击重试"
  },
  messageBox: {
    inputPlaceholder: "请输入",
    confirm: "确定",
    cancel: "取消",
    inputNoValidate: "输入的数据不合法"
  },
  dialog: {
    inputPlaceholder: "请输入",
    confirm: "确定",
    cancel: "取消",
    inputNoValidate: "输入的数据不合法"
  },
  numberKeyboard: {
    confirm: "完成"
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: (value) => `当前页：${value}`,
    total: (total) => `当前数据：${total}条`,
    size: (size2) => `分页大小：${size2}`
  },
  picker: {
    cancel: "取消",
    done: "完成",
    placeholder: "请选择"
  },
  imgCropper: {
    confirm: "完成",
    cancel: "取消"
  },
  search: {
    search: "搜索",
    cancel: "取消"
  },
  steps: {
    wait: "未开始",
    finished: "已完成",
    process: "进行中",
    failed: "失败"
  },
  tabs: {
    all: "全部"
  },
  upload: {
    error: "上传失败"
  },
  input: {
    placeholder: "请输入..."
  },
  selectPicker: {
    title: "请选择",
    placeholder: "请选择",
    select: "请选择",
    confirm: "确认",
    filterPlaceholder: "搜索"
  },
  tag: {
    placeholder: "请输入",
    add: "新增标签"
  },
  textarea: {
    placeholder: "请输入..."
  },
  tableCol: {
    indexLabel: "序号"
  },
  tour: {
    prev: "上一步",
    next: "下一步",
    finish: "完成",
    skip: "跳过"
  },
  signature: {
    confirmText: "确认",
    clearText: "清空",
    revokeText: "撤销",
    restoreText: "恢复"
  },
  slideVerify: {
    text: "向右滑动验证",
    successText: "验证通过"
  }
};
const lang = ref("zh-CN");
const messages = reactive({
  "zh-CN": zhCN
});
const Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessage) {
    lang.value = newLang;
    if (newMessage) {
      this.add({ [newLang]: newMessage });
    }
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  }
};
const useTranslate = (name) => {
  const prefix = name ? camelCase(name) + "." : "";
  const translate2 = (key, ...args) => {
    const currentMessages = Locale.messages();
    const message = getPropByPath(currentMessages, prefix + key);
    return isFunction(message) ? message(...args) : isDef(message) ? message : `${prefix}${key}`;
  };
  return { translate: translate2 };
};
const UPLOAD_STATUS = {
  PENDING: "pending",
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail"
};
function useUpload() {
  let currentTask = null;
  const abort = (task) => {
    if (task) {
      task.abort();
    } else if (currentTask) {
      currentTask.abort();
      currentTask = null;
    }
  };
  const defaultUpload = (file, formData, options) => {
    if (options.abortPrevious) {
      abort();
    }
    const uploadTask = index.uploadFile({
      url: options.action,
      header: options.header,
      name: options.name,
      fileName: options.name,
      fileType: options.fileType,
      formData,
      filePath: file.url,
      success(res) {
        const successStatus = options.statusCode;
        const isSuccess = isArray(successStatus) ? successStatus.includes(res.statusCode) : res.statusCode === successStatus;
        if (isSuccess) {
          options.onSuccess(res, file, formData);
        } else {
          options.onError({ ...res, errMsg: res.errMsg || "" }, file, formData);
        }
      },
      fail(err) {
        options.onError(err, file, formData);
      }
    });
    currentTask = uploadTask;
    uploadTask.onProgressUpdate((res) => {
      options.onProgress(res, file);
    });
    return uploadTask;
  };
  const startUpload = (file, options) => {
    const {
      uploadMethod,
      formData = {},
      action,
      name = "file",
      header = {},
      fileType = "image",
      statusCode = 200,
      statusKey = "status",
      abortPrevious = false
    } = options;
    file[statusKey] = UPLOAD_STATUS.LOADING;
    const uploadOptions = {
      action,
      header,
      name,
      fileName: name,
      fileType,
      statusCode,
      abortPrevious,
      onSuccess: (res, file2, formData2) => {
        var _a;
        file2[statusKey] = UPLOAD_STATUS.SUCCESS;
        currentTask = null;
        (_a = options.onSuccess) == null ? void 0 : _a.call(options, res, file2, formData2);
      },
      onError: (error, file2, formData2) => {
        var _a;
        file2[statusKey] = UPLOAD_STATUS.FAIL;
        file2.error = error.errMsg;
        currentTask = null;
        (_a = options.onError) == null ? void 0 : _a.call(options, error, file2, formData2);
      },
      onProgress: (res, file2) => {
        var _a;
        file2.percent = res.progress;
        (_a = options.onProgress) == null ? void 0 : _a.call(options, res, file2);
      }
    };
    if (isFunction(uploadMethod)) {
      return uploadMethod(file, formData, uploadOptions);
    } else {
      return defaultUpload(file, formData, uploadOptions);
    }
  };
  function formatMedia(res) {
    return res.tempFiles.map((item) => ({
      type: item.fileType,
      path: item.tempFilePath,
      thumb: item.fileType === "video" ? item.thumbTempFilePath : item.tempFilePath,
      size: item.size,
      duration: item.duration
    }));
  }
  function chooseFile({
    multiple,
    sizeType,
    sourceType,
    maxCount,
    accept,
    compressed,
    maxDuration,
    camera,
    extension
  }) {
    return new Promise((resolve2, reject) => {
      switch (accept) {
        case "image":
          index.chooseMedia({
            count: multiple ? maxCount : 1,
            mediaType: ["image"],
            sourceType,
            sizeType,
            camera,
            success: (res) => resolve2(formatMedia(res)),
            fail: reject
          });
          break;
        case "video":
          index.chooseMedia({
            count: multiple ? maxCount : 1,
            mediaType: ["video"],
            sourceType,
            camera,
            maxDuration,
            success: (res) => resolve2(formatMedia(res)),
            fail: reject
          });
          break;
        case "media":
          index.chooseMedia({
            count: multiple ? maxCount : 1,
            sourceType,
            sizeType,
            camera,
            maxDuration,
            success: (res) => resolve2(formatMedia(res)),
            fail: reject
          });
          break;
        case "file":
          index.chooseMessageFile({
            count: multiple ? isDef(maxCount) ? maxCount : 100 : 1,
            type: accept,
            extension,
            success: (res) => resolve2(res.tempFiles),
            fail: reject
          });
          break;
        case "all":
          index.chooseMessageFile({
            count: multiple ? Number(maxCount) : 1,
            type: accept,
            extension,
            success: (res) => resolve2(res.tempFiles),
            fail: reject
          });
          break;
        default:
          index.chooseMedia({
            count: multiple ? maxCount : 1,
            mediaType: ["image"],
            sourceType,
            sizeType,
            camera,
            success: (res) => resolve2(formatMedia(res)),
            fail: reject
          });
          break;
      }
    });
  }
  return {
    startUpload,
    abort,
    UPLOAD_STATUS,
    chooseFile
  };
}
const USE_CONFIG_PROVIDER_KEY = "__CONFIG_PROVIDER__";
const dialogDefaultOptionKey = "__MESSAGE_OPTION__";
const None$1 = Symbol("None");
const defaultOptions$1 = {
  title: "",
  show: false,
  closeOnClickModal: false,
  msg: "",
  type: "alert",
  inputProps: {
    type: "text",
    modelValue: ""
  },
  showErr: false,
  zIndex: 99,
  lazyRender: true,
  inputError: "",
  theme: "button",
  actionLayout: "horizontal",
  confirmButtonProps: {}
};
function useDialog(selector = "") {
  const dialogOptionKey = selector ? dialogDefaultOptionKey + selector : dialogDefaultOptionKey;
  const dialogOption = inject(dialogOptionKey, ref(None$1));
  if (dialogOption.value === None$1) {
    dialogOption.value = defaultOptions$1;
    provide(dialogOptionKey, dialogOption);
  }
  const createMethod = (type) => {
    return (options) => {
      const dialogOptions = deepMerge({ type }, isString(options) ? { title: options } : options);
      if (dialogOptions.cancelButtonProps === void 0 && dialogOptions.showCancelButton === void 0) {
        if (dialogOptions.type === "confirm" || dialogOptions.type === "prompt") {
          dialogOptions.showCancelButton = true;
        } else {
          dialogOptions.showCancelButton = false;
        }
      }
      normalizeButtonProps(dialogOptions);
      normalizeIconProps(dialogOptions);
      if (dialogOptions.actions && dialogOptions.actions.length > 0 && (dialogOptions.confirmButtonProps !== void 0 || dialogOptions.cancelButtonProps !== void 0)) {
        console.warn(
          "[wot-ui] DialogBox: actions 和 confirmButtonProps/cancelButtonProps 同时配置时，将使用 actions 配置，confirmButtonProps/cancelButtonProps 将被忽略"
        );
      }
      return show(dialogOptions);
    };
  };
  function normalizeButtonProps(options) {
    if (options.confirmButtonText) {
      if (isDef(options.confirmButtonProps) && isObj(options.confirmButtonProps)) {
        options.confirmButtonProps = { ...options.confirmButtonProps, text: options.confirmButtonText };
      } else if (!options.confirmButtonProps) {
        options.confirmButtonProps = options.confirmButtonText;
      }
    }
    if (options.cancelButtonText) {
      if (isDef(options.cancelButtonProps) && isObj(options.cancelButtonProps)) {
        options.cancelButtonProps = { ...options.cancelButtonProps, text: options.cancelButtonText };
      } else if (!options.cancelButtonProps) {
        options.cancelButtonProps = options.cancelButtonText;
      }
    }
    if (options.showCancelButton === false && !isDef(options.cancelButtonProps)) {
      options.cancelButtonProps = null;
    } else if (options.showCancelButton === true && !isDef(options.cancelButtonProps)) {
      options.cancelButtonProps = {};
    }
  }
  function normalizeIconProps(options) {
    if (options.icon || options.iconColor) {
      const iconProps2 = {};
      if (options.icon) {
        iconProps2.name = options.icon;
      }
      if (options.iconColor) {
        iconProps2.color = options.iconColor;
      }
      options.iconProps = { ...options.iconProps, ...iconProps2 };
    }
  }
  const show = (option) => {
    return new Promise((resolve2, reject) => {
      const options = deepMerge(defaultOptions$1, isString(option) ? { title: option } : option);
      dialogOption.value = deepMerge(options, {
        show: true,
        success: (res) => {
          close();
          resolve2(res);
        },
        fail: (res) => {
          close();
          reject(res);
        }
      });
    });
  };
  const alert = createMethod("alert");
  const confirm = createMethod("confirm");
  const prompt = createMethod("prompt");
  const close = () => {
    if (dialogOption.value !== None$1) {
      dialogOption.value.show = false;
    }
  };
  return {
    show,
    alert,
    confirm,
    prompt,
    close
  };
}
const getDialogDefaultOptionKey = (selector) => {
  return selector ? `${dialogDefaultOptionKey}${selector}` : dialogDefaultOptionKey;
};
const inputProps = {
  ...baseProps,
  /**
   * 自定义输入框类名
   */
  customInputClass: makeStringProp(""),
  // 原生属性
  /**
   * 占位文本
   */
  placeholder: String,
  /**
   * 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight
   */
  placeholderStyle: String,
  /**
   * 原生属性，指定 placeholder 的样式类
   */
  placeholderClass: makeStringProp(""),
  /**
   * 原生属性，指定光标与键盘的距离。取 input 距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离
   */
  cursorSpacing: makeNumberProp(0),
  /**
   * 原生属性，指定focus时的光标位置
   */
  cursor: makeNumberProp(-1),
  /**
   * 原生属性，光标起始位置，自动聚集时有效，需与selection-end搭配使用
   */
  selectionStart: makeNumberProp(-1),
  /**
   * 原生属性，光标结束位置，自动聚集时有效，需与selection-start搭配使用
   */
  selectionEnd: makeNumberProp(-1),
  /**
   * 原生属性，键盘弹起时，是否自动上推页面
   */
  adjustPosition: makeBooleanProp(true),
  /**
   * focus时，点击页面的时候不收起键盘
   */
  holdKeyboard: makeBooleanProp(false),
  /**
   * 设置键盘右下角按钮的文字，仅在type='text'时生效，可选值：done / go / next / search / send
   */
  confirmType: makeStringProp("done"),
  /**
   * 点击键盘右下角按钮时是否保持键盘不收起
   */
  confirmHold: makeBooleanProp(false),
  /**
   * 原生属性，获取焦点
   */
  focus: makeBooleanProp(false),
  /**
   * 类型，可选值：text / number / digit / idcard / safe-password / nickname / tel
   */
  type: makeStringProp("text"),
  /**
   * 原生属性，最大长度
   */
  maxlength: {
    type: Number,
    default: -1
  },
  /**
   * 原生属性，禁用
   */
  disabled: makeBooleanProp(false),
  /**
   * 微信小程序原生属性，强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)
   */
  alwaysEmbed: makeBooleanProp(false),
  // 原生属性结束
  /**
   * 输入框的值靠右展示
   */
  alignRight: makeBooleanProp(false),
  /**
   * 绑定值
   */
  modelValue: makeNumericProp(""),
  /**
   * 显示为密码框
   */
  showPassword: makeBooleanProp(false),
  /**
   * 显示清空按钮
   */
  clearable: makeBooleanProp(false),
  /**
   * 只读
   */
  readonly: makeBooleanProp(false),
  /**
   * 前置图标，icon组件中的图标类名
   */
  prefixIcon: String,
  /**
   * 后置图标，icon组件中的图标类名
   */
  suffixIcon: String,
  /**
   * 显示字数限制，需要同时设置 maxlength
   */
  showWordLimit: makeBooleanProp(false),
  /**
   * 设置输入框错误状态，错误状态时为红色
   */
  error: makeBooleanProp(false),
  /**
   * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
   * 类型: "focus" | "always"
   * 默认值: "always"
   */
  clearTrigger: makeStringProp("always"),
  /**
   * 是否在点击清除按钮时聚焦输入框
   * 类型: boolean
   * 默认值: true
   */
  focusWhenClear: makeBooleanProp(true),
  /**
   * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
   * 类型: boolean
   * 默认值: true
   */
  ignoreCompositionEvent: makeBooleanProp(true),
  /**
   * 它提供了用户在编辑元素或其内容时可能输入的数据类型的提示。在符合条件的高版本webview里，uni-app的web和app-vue平台中可使用本属性。
   * 类型: InputMode
   * 可选值: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | "password"
   * 默认值: "text"
   */
  inputmode: makeStringProp("text"),
  /**
   * 支付宝小程序，可以在 input / textarea 组件中加上 enableNative="{{false}}"，避免 textarea 弹出键盘后出现内容上移
   * 仅支付宝小程序支持
   * 类型: boolean
   * 默认值: true
   */
  enableNative: makeBooleanProp(true),
  /**
   * 紧凑模式，移除内边距和背景色，在结合 cell 或 form-item 使用时建议开启
   * 类型: boolean
   * 默认值: -
   */
  compact: makeBooleanProp(void 0)
};
const FORM_ITEM_VALIDATE_KEY = Symbol("wd-form-item-validate");
const formItemProps = {
  ...baseProps,
  /**
   * 表单域 model 字段名
   */
  prop: String,
  /**
   * 标题
   */
  title: String,
  /**
   * 右侧展示值，用于配合 placeholder 判断是否显示占位文字
   * 类型: string | number
   */
  value: numericProp,
  /**
   * 值为空时显示的占位文字，需与 value 配合使用
   * 类型: string
   */
  placeholder: String,
  /**
   * 前置图标类名
   */
  prefixIcon: String,
  /**
   * 图标大小
   */
  iconSize: numericProp,
  /**
   * 类名前缀，用于使用自定义图标
   */
  iconPrefix: String,
  /**
   * 描述信息
   */
  label: String,
  /**
   * 是否开启点击反馈
   */
  clickable: makeBooleanProp(false),
  /**
   * 是否展示右侧箭头并开启点击反馈
   */
  isLink: makeBooleanProp(false),
  // ========== 可继承属性（使用 undefined 默认值）==========
  /**
   * 设置单元格大小，可选值：large
   * 类型: CellSize
   */
  size: String,
  /**
   * 是否展示边框线
   * 类型: boolean
   */
  border: makeBooleanProp(void 0),
  /**
   * 设置左侧标题宽度
   * 类型: string | number
   */
  titleWidth: numericProp,
  /**
   * 是否使内容垂直居中
   * 类型: boolean
   */
  center: makeBooleanProp(void 0),
  /**
   * 是否必填
   * 类型: boolean
   */
  required: makeBooleanProp(void 0),
  /**
   * 校验触发时机
   */
  validateTrigger: [String, Array],
  /**
   * 表单布局方式
   * 类型: CellLayout
   * 可选值: 'horizontal' | 'vertical'
   */
  layout: String,
  /**
   * value 文字对齐方式
   * 类型: CellValueAlign
   * 可选值: 'left' | 'right' | 'center'
   */
  valueAlign: String,
  /**
   * 是否超出隐藏，显示省略号
   * 类型: boolean
   */
  ellipsis: makeBooleanProp(void 0),
  /**
   * 必填星号位置
   * 类型: CellAsteriskPosition
   * 可选值: 'start' | 'end'
   */
  asteriskPosition: String,
  /**
   * 是否隐藏必填星号
   * 类型: boolean
   */
  hideAsterisk: makeBooleanProp(void 0),
  /**
   * 前置图标自定义样式类
   */
  customPrefixClass: makeStringProp(""),
  /**
   * label 使用 slot 时的自定义样式
   */
  customLabelClass: makeStringProp(""),
  /**
   * value 使用 slot 时的自定义样式
   */
  customValueClass: makeStringProp(""),
  /**
   * title 使用 slot 时的自定义样式
   */
  customTitleClass: makeStringProp("")
};
const popupProps = {
  ...baseProps,
  /**
   * 动画类型，参见 wd-transition 组件的name
   * 类型: TransitionName
   * 可选值: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in'
   */
  transition: String,
  /**
   * 关闭按钮
   * 类型: boolean
   * 默认值: false
   */
  closable: makeBooleanProp(false),
  /**
   * 弹出框的位置
   * 类型: PopupType
   * 可选值: 'center' | 'top' | 'right' | 'bottom' | 'left'
   * 默认值: 'center'
   */
  position: makeStringProp("center"),
  /**
   * 点击遮罩是否关闭
   * 类型：boolean
   * 默认值：true
   */
  closeOnClickModal: makeBooleanProp(true),
  /**
   * 动画持续时间
   * 类型：number | boolean
   * 默认值：300
   */
  duration: {
    type: [Number, Boolean],
    default: 300
  },
  /**
   * 是否显示遮罩
   * 类型：boolean
   * 默认值：true
   */
  modal: makeBooleanProp(true),
  /**
   * 设置层级
   * 类型：number
   * 默认值：10
   */
  zIndex: makeNumberProp(10),
  /**
   * 是否当关闭时将弹出层隐藏（display: none)
   * 类型：boolean
   * 默认值：true
   */
  hideWhenClose: makeBooleanProp(true),
  /**
   * 遮罩样式
   * 类型：string
   * 默认值：''
   */
  modalStyle: makeStringProp(""),
  /**
   * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
   * 类型：boolean
   * 默认值：false
   */
  safeAreaInsetBottom: makeBooleanProp(false),
  /**
   * 弹出层是否显示
   * 类型: boolean
   * 默认值: false
   */
  modelValue: makeBooleanProp(false),
  /**
   * 弹层内容懒渲染，触发展示时才渲染内容
   * 类型：boolean
   * 默认值：true
   */
  lazyRender: makeBooleanProp(true),
  /**
   * 是否锁定滚动
   * 类型：boolean
   * 默认值：true
   */
  lockScroll: makeBooleanProp(true),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型：boolean
   * 默认值：false
   */
  rootPortal: makeBooleanProp(false),
  /**
   * 是否开启圆角,开启后根据弹出位置自动适配（底部弹出→上圆角，顶部弹出→下圆角，居中→四圆角）
   */
  round: makeBooleanProp(false)
};
const tagProps = {
  ...baseProps,
  /**
   * 标签尺寸
   * 类型: TagSize
   * 可选值: 'small' | 'medium' | 'large' | 'extra-large' | 'default'
   * 默认值: 'default'
   */
  size: makeStringProp("default"),
  /**
   * 标签类型
   * 类型: TagType
   * 可选值: 'default' | 'primary' | 'danger' | 'warning' | 'success' | 'volcano' | 'lightblue' | 'cyan' | 'pink' | 'purple'
   * 默认值: 'default'
   */
  type: makeStringProp("default"),
  /**
   * 左侧图标
   * 类型: string
   * 默认值: ''
   */
  icon: makeStringProp(""),
  /**
   * 是否可关闭（只对圆角类型支持）
   * 类型: boolean
   * 默认值: false
   */
  closable: makeBooleanProp(false),
  /**
   * 是否为新增标签
   * 类型: boolean
   * 默认值: false
   */
  dynamic: makeBooleanProp(false),
  /**
   * 文字颜色
   * 类型: string
   * 默认值: ''
   */
  color: makeStringProp(""),
  /**
   * 背景色和边框色
   * 类型: string
   * 默认值: ''
   */
  bgColor: makeStringProp(""),
  /**
   * 圆角类型
   * 类型: boolean
   * 默认值: false
   */
  round: makeBooleanProp(false),
  /**
   * 标记类型
   * 类型: boolean
   * 默认值: false
   */
  mark: makeBooleanProp(false),
  /**
   * 标签变体
   * 类型: TagVariant
   * 可选值: 'light' | 'dark' | 'plain' | 'dashed' | 'text'
   * 默认值: 'dark'
   */
  variant: makeStringProp("dark")
};
const buttonProps = {
  ...baseProps,
  /**
   * 圆角按钮
   * 默认值: false
   */
  round: makeBooleanProp(false),
  /**
   * 禁用按钮
   * 默认值: false
   */
  disabled: makeBooleanProp(false),
  /**
   * 是否细边框
   * 默认值: false
   */
  hairline: makeBooleanProp(false),
  /**
   * 块状按钮
   * 默认值: false
   */
  block: makeBooleanProp(false),
  /**
   * 按钮类型
   * 类型: ButtonType
   * 可选值: 'primary' | 'success' | 'info' | 'warning' | 'danger'
   * 默认值: 'primary'
   */
  type: makeStringProp("primary"),
  /**
   * 按钮尺寸
   * 类型: ButtonSize
   * 可选值: 'mini' | 'small' | 'medium' | 'large'
   * 默认值: 'medium'
   */
  size: makeStringProp("medium"),
  /**
   * 图标类名
   */
  icon: String,
  /**
   * 类名前缀，用于使用自定义图标，用法参考 Icon 组件
   * 默认值: 'wd-icon'
   */
  classPrefix: makeStringProp("wd-icon"),
  /**
   * CSS 图标，用法参考 Icon 组件
   * 类型: boolean | string
   * 默认值: false
   */
  cssIcon: {
    type: [Boolean, String],
    default: false
  },
  /**
   * 加载中按钮
   * 默认值: false
   */
  loading: makeBooleanProp(false),
  /**
   * 加载图标颜色
   */
  loadingColor: String,
  /**
   * 开放能力
   * 类型: ButtonOpenType
   */
  openType: String,
  /**
   * 指定是否阻止本节点的祖先节点出现点击态
   * 默认值: false
   */
  hoverStopPropagation: Boolean,
  /**
   * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
   * 类型: ButtonLang
   * 可选值: 'zh_CN' | 'zh_TW' | 'en'
   */
  lang: String,
  /**
   * 会话来源，open-type="contact"时有效
   */
  sessionFrom: String,
  /**
   * 会话内消息卡片标题，open-type="contact"时有效
   */
  sendMessageTitle: String,
  /**
   * 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
   */
  sendMessagePath: String,
  /**
   * 会话内消息卡片图片，open-type="contact"时有效
   */
  sendMessageImg: String,
  /**
   * 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
   */
  appParameter: String,
  /**
   * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效
   * 默认值: false
   */
  showMessageCard: Boolean,
  /**
   * 按钮的唯一标识，可用于设置隐私同意授权按钮的id
   */
  buttonId: String,
  /**
   * 支付宝小程序，当 open-type 为 getAuthorize 时有效
   * 类型: ButtonScope
   * 可选值: 'phoneNumber' | 'userInfo'
   */
  scope: String,
  /**
   * 加载配置项
   * 类型: Partial<LoadingProps>
   */
  loadingProps: Object,
  /**
   * 点击按钮后，等待多少毫秒后出现点击态，单位毫秒
   * 默认值: 20
   */
  hoverStartTime: makeNumberProp(20),
  /**
   * 手指松开后，等待多少毫秒后移除点击态，单位毫秒
   * 默认值: 70
   */
  hoverStayTime: makeNumberProp(70),
  /**
   * 按钮文本
   */
  text: String,
  /**
   * 按钮变体
   * 类型: ButtonVariant
   * 可选值: 'base' | 'plain' | 'dashed' | 'soft' | 'text'
   * 默认值: 'base'
   */
  variant: makeStringProp("base")
};
const toastProps = {
  ...baseProps,
  /**
   * 选择器
   * @type {string}
   * @default ''
   */
  selector: makeStringProp(""),
  /**
   * 提示信息
   * @type {string}
   * @default ''
   */
  msg: {
    type: String,
    default: ""
  },
  /**
   * 排列方向
   * @type {'vertical' | 'horizontal'}
   * @default 'horizontal'
   */
  direction: makeStringProp("horizontal"),
  /**
   * 图标名称
   * @type {'success' | 'error' | 'warning' | 'loading' | 'info'}
   * @default ''
   */
  iconName: {
    type: String,
    default: ""
  },
  /**
   * 图标大小
   * @type {number}
   */
  iconSize: Number,
  /**
   * 加载类型
   * @type {'circular' | 'spinner' | 'dots'}
   * @default 'circular'
   */
  loadingType: makeStringProp("circular"),
  /**
   * 加载颜色
   * @type {string}
   * @default '#ffffff'
   */
  loadingColor: {
    type: String,
    default: "#ffffff"
  },
  /**
   * 加载大小
   * @type {number}
   */
  loadingSize: Number,
  /**
   * 图标颜色
   * @type {string}
   */
  iconColor: String,
  /**
   * 位置
   * @type {'top' | 'middle-top' | 'middle' | 'bottom'}
   * @default 'middle'
   */
  position: makeStringProp("middle"),
  /**
   * 层级
   * @type {number}
   * @default 100
   */
  zIndex: {
    type: Number,
    default: 100
  },
  /**
   * 是否存在遮罩层
   * @type {boolean}
   * @default false
   */
  cover: {
    type: Boolean,
    default: false
  },
  /**
   * 图标类名
   * @type {string}
   * @default ''
   */
  iconClass: {
    type: String,
    default: ""
  },
  /**
   * 类名前缀，用于使用自定义图标，用法参考 Icon 组件
   * @type {string}
   * @default 'wd-icon'
   */
  classPrefix: makeStringProp("wd-icon"),
  /**
   * CSS 图标，用法参考 Icon 组件
   * @type {boolean | string}
   * @default false
   */
  cssIcon: {
    type: [Boolean, String],
    default: false
  },
  /**
   * 完全展示后的回调函数
   * @type {Function}
   */
  opened: Function,
  /**
   * 完全关闭时的回调函数
   * @type {Function}
   */
  closed: Function
};
const cellProps = {
  ...baseProps,
  /**
   * 左侧标题
   * 类型: string
   */
  title: String,
  /**
   * 右侧内容
   * 类型: string | number
   * 默认值: ''
   */
  value: makeNumericProp(""),
  /**
   * 占位符，仅在 value 为空时显示
   * 类型: string
   */
  placeholder: String,
  /**
   * 前置图标类名
   * 类型: string
   */
  prefixIcon: String,
  /**
   * 后置图标类名
   * 类型: string
   */
  suffixIcon: String,
  /**
   * 图标大小
   * 类型: string | number
   */
  iconSize: numericProp,
  /**
   * 图标类名前缀，用于使用自定义图标
   * 类型: string
   */
  iconPrefix: String,
  /**
   * 标题下方的描述信息
   * 类型: string
   */
  label: String,
  /**
   * 点击后跳转的链接地址
   * 类型: string
   */
  to: String,
  /**
   * 跳转时是否替换当前页面历史
   * 类型: boolean
   * 默认值: false
   */
  replace: makeBooleanProp(false),
  /**
   * 是否开启点击反馈
   * 类型: boolean
   * 默认值: false
   */
  clickable: makeBooleanProp(false),
  /**
   * 是否展示右侧箭头并开启点击反馈
   * 类型: boolean
   * 默认值: false
   */
  isLink: makeBooleanProp(false),
  /**
   * 单元格大小
   * 类型: CellSize
   * 可选值: 'large'
   */
  size: String,
  /**
   * 是否显示内边框
   * 类型: boolean
   * 默认值: 继承自 CellGroup
   */
  border: makeBooleanProp(void 0),
  /**
   * 左侧标题宽度
   * 类型: string | number
   */
  titleWidth: numericProp,
  /**
   * 是否垂直居中
   * 类型: boolean
   * 默认值: 继承自 CellGroup
   */
  center: makeBooleanProp(void 0),
  /**
   * 是否显示表单必填星号
   * 类型: boolean
   * 默认值: false
   */
  required: makeBooleanProp(false),
  /**
   * 单元格布局方式
   * 类型: CellLayout
   * 可选值: 'horizontal' | 'vertical'
   */
  layout: String,
  /**
   * 右侧内容对齐方式
   * 类型: CellValueAlign
   * 可选值: 'left' | 'right' | 'center'
   */
  valueAlign: String,
  /**
   * 是否超出隐藏显示省略号
   * 类型: boolean
   * 默认值: false
   */
  ellipsis: makeBooleanProp(false),
  /**
   * 是否启用 title 插槽
   * 类型: boolean
   * 默认值: true
   */
  useTitleSlot: makeBooleanProp(true),
  /**
   * 必填星号位置
   * 类型: CellAsteriskPosition
   * 可选值: 'start' | 'end'
   * 默认值: 'start'
   */
  asteriskPosition: makeStringProp("start"),
  /**
   * 是否隐藏必填星号
   * 类型: boolean
   * 默认值: false
   */
  hideAsterisk: makeBooleanProp(false),
  /**
   * 箭头方向，仅在 isLink 为 true 时生效
   * 类型: CellArrowDirection
   * 可选值: 'left' | 'up' | 'down' | 'right'
   * 默认值: 'right'
   */
  arrowDirection: makeStringProp("right"),
  /**
   * 前置图标自定义样式类
   * 类型: string
   * 默认值: ''
   */
  customPrefixClass: makeStringProp(""),
  /**
   * 后置图标自定义样式类
   * 类型: string
   * 默认值: ''
   */
  customSuffixClass: makeStringProp(""),
  /**
   * label 插槽的自定义样式类
   * 类型: string
   * 默认值: ''
   */
  customLabelClass: makeStringProp(""),
  /**
   * value 插槽的自定义样式类
   * 类型: string
   * 默认值: ''
   */
  customValueClass: makeStringProp(""),
  /**
   * title 插槽的自定义样式类
   * 类型: string
   * 默认值: ''
   */
  customTitleClass: makeStringProp("")
};
const iconProps = {
  ...baseProps,
  /**
   * 图标名称，支持使用图片链接
   * 类型: string
   */
  name: makeStringProp(""),
  /**
   * 图标颜色
   * 类型: string
   */
  color: String,
  /**
   * 图标字体大小
   * 类型: string | number
   */
  size: numericProp,
  /**
   * 类名前缀，用于使用自定义图标
   * 类型: string
   * 默认值: wd-icon
   */
  classPrefix: makeStringProp("wd-icon"),
  /**
   * CSS 图标，为 true 时 name 直接作为 CSS class 而不会拼接 class-prefix 前缀，也可以直接传图标类名
   * 类型: boolean | string
   * 默认值: false
   */
  cssIcon: {
    type: [Boolean, String],
    default: false
  }
};
const cardProps = {
  ...baseProps,
  /**
   * 卡片标题
   * 类型: string
   * 默认值: -
   */
  title: String,
  /**
   * 卡片类型
   */
  type: String,
  /**
   * 标题自定义样式
   * 类型: string
   * 默认值: ''
   */
  customTitleClass: makeStringProp(""),
  /**
   * 内容自定义样式
   * 类型: string
   * 默认值: ''
   */
  customContentClass: makeStringProp(""),
  /**
   * 底部自定义样式
   * 类型: string
   * 默认值: ''
   */
  customFooterClass: makeStringProp("")
};
const skeletonProps = {
  /**
   * 骨架图风格
   * 可选值: 'text' | 'avatar' | 'paragraph' | 'image'
   * 默认值: 'text'
   */
  theme: makeStringProp("text"),
  /**
   * 行列配置，用于自定义骨架图的行列数量及各项样式
   * 类型: Array<number | SkeletonRowColObj | Array<SkeletonRowColObj>>
   * 默认值: []
   * @example
   * ```
   * // 三行，分别显示为一列、一列、两列的占位符
   * [1, 1, 2]
   *
   * // 三行，第三行自定义宽度
   * [1, 1, { width: '100px' }]
   *
   * // 第三行包含两列，分别设置宽度和右外边距
   * [1, 1, [{ width: '50%' }, { width: '50%', marginRight: '10px' }]]
   * ```
   */
  rowCol: makeArrayProp(),
  /**
   * 是否显示骨架图（加载中）
   * 默认值: true
   */
  loading: makeBooleanProp(true),
  /**
   * 加载动画类型
   * 可选值: 'gradient' | 'flashed' | ''
   * 默认值: ''（无动画）
   */
  animation: {
    type: String,
    default: ""
  },
  /**
   * 自定义样式类名
   * 类型: string | string[] | Record<string, boolean>
   * 默认值: ''
   */
  customClass: {
    type: [String, Array, Object],
    default: ""
  },
  /**
   * 自定义内联样式
   * 类型: CSSProperties
   * 默认值: {}
   */
  customStyle: {
    type: Object,
    default() {
      return {};
    }
  }
};
const emptyProps = {
  ...baseProps,
  /**
   * 缺省图片类型，支持传入图片 URL。
   * 类型: string
   * 可选值: 图标名或URL
   * 默认值: empty
   */
  icon: makeStringProp("empty"),
  /**
   * 图片大小，默认单位为 `px`。
   * 类型: string 或 number
   * 默认值: 空字符串
   */
  iconSize: [String, Number],
  /**
   * 提示文案。
   * 类型: string
   * 默认值: 空字符串
   */
  tip: makeStringProp("")
};
const DIALOG_BUILTIN_ICON_MAP = {
  success: "check-circle-fill",
  info: "info-circle-fill",
  warning: "exclamation-circle-fill",
  danger: "close-circle-fill"
};
const OPEN_TYPE_EVENT_KEYS = [
  "onGetuserinfo",
  "onContact",
  "onGetphonenumber",
  "onGetrealtimephonenumber",
  "onError",
  "onLaunchapp",
  "onOpensetting",
  "onChooseavatar",
  "onAgreeprivacyauthorization"
];
const dialogProps = {
  ...baseProps,
  /**
   * 指定唯一标识
   * 类型: string
   * 默认值: ''
   */
  selector: makeStringProp(""),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型: boolean
   * 默认值: false
   */
  rootPortal: makeBooleanProp(false),
  /**
   * 标题
   * 类型: string
   * 默认值: ''
   */
  title: makeStringProp(""),
  /**
   * 消息内容
   * 类型: string
   * 默认值: ''
   */
  msg: makeStringProp(""),
  /**
   * 弹窗类型
   * 类型: DialogType
   * 可选值: 'alert' | 'confirm' | 'prompt'
   * 默认值: 'alert'
   */
  type: makeStringProp("alert"),
  /**
   * 弹窗风格
   * 类型: DialogTheme
   * 可选值: 'button' | 'text'
   * 默认值: 'button'
   */
  theme: makeStringProp("button"),
  /**
   * 弹窗层级
   * 类型: number
   * 默认值: 99
   */
  zIndex: makeNumberProp(99),
  /**
   * 弹层内容懒渲染，触发展示时才渲染内容
   * 类型: boolean
   * 默认值: true
   */
  lazyRender: makeBooleanProp(true),
  /**
   * 顶部通栏图片地址
   * 类型: string
   */
  headerImage: String,
  /**
   * 状态图标
   * 类型: string
   * 支持内置类型: 'success' | 'info' | 'warning' | 'danger'
   * 也支持任意图标名称（默认 primary 颜色）
   */
  icon: String,
  /**
   * 自定义图标颜色
   * 类型: string
   */
  iconColor: String,
  /**
   * 透传Icon组件属性
   * 类型: object
   */
  iconProps: Object,
  /**
   * 当type为prompt时，内嵌 input 组件的属性
   * 类型: object
   */
  inputProps: Object,
  /**
   * 当type为prompt时，内嵌 textarea 组件的属性
   * 类型: object
   */
  textareaProps: Object,
  /**
   * 当type为prompt时，输入框正则校验，点击确定按钮时进行校验
   * 类型: RegExp
   */
  inputPattern: RegExp,
  /**
   * 当type为prompt时，输入框校验函数，点击确定按钮时进行校验
   * 类型: (inputValue: string | number) => boolean | string
   */
  inputValidate: Function,
  /**
   * 当type为prompt时，输入框检验不通过时的错误提示文案
   * 类型: string
   */
  inputError: String,
  /**
   * 是否显示错误信息
   * 类型: boolean
   */
  showErr: {
    type: Boolean
  },
  /**
   * 按钮排列方式
   * 类型: DialogActionLayout
   * 可选值: 'horizontal' | 'vertical'
   * 默认值: 'horizontal'
   */
  actionLayout: makeStringProp("horizontal"),
  /**
   * 确认按钮配置
   * 类型: DialogBoxButtonOption
   */
  confirmButtonProps: {
    type: [String, Object, null]
  },
  /**
   * 取消按钮配置
   * 类型: DialogBoxButtonOption
   */
  cancelButtonProps: {
    type: [String, Object, null]
  },
  /**
   * 是否显示取消按钮
   * 类型: boolean
   */
  showCancelButton: {
    type: Boolean
  },
  /**
   * 确定按钮文案
   * 类型: string
   */
  confirmButtonText: String,
  /**
   * 取消按钮文案
   * 类型: string
   */
  cancelButtonText: String,
  /**
   * 自定义操作按钮列表 (用于三按钮等复杂场景)
   * 类型: DialogAction[]
   */
  actions: Array,
  /**
   * 是否支持点击蒙层进行关闭，点击蒙层回调传入的action为'modal'
   * 类型: boolean
   * 默认值: false
   */
  closeOnClickModal: makeBooleanProp(false),
  /**
   * 是否展示关闭按钮
   * 类型: boolean
   */
  showClose: Boolean,
  /**
   * 确认前钩子，支持返回 Promise 阻断关闭
   * 类型: (options: DialogBeforeConfirmOption) => Promise<boolean> | boolean | void
   */
  beforeConfirm: Function
};
function noop() {
}
function callInterceptor(interceptor, {
  args = [],
  done,
  canceled,
  error
}) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);
    if (isPromise(returnVal)) {
      returnVal.then((value) => {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(error || noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
const TABS_KEY = Symbol("wd-tabs");
const tabsProps = {
  ...baseProps,
  /**
   * 绑定值，选中选项卡的 name
   * 类型: number | string
   * 默认值: 0
   */
  modelValue: makeNumericProp(0),
  /**
   * 标签数超过阈值可滑动
   * 类型: number
   * 默认值: 6
   */
  slidableNum: makeNumberProp(6),
  /**
   * 标签数超过阈值显示导航地图
   * 类型: number
   * 默认值: 10
   */
  mapNum: makeNumberProp(10),
  /**
   * 导航地图的标题
   * 类型: string
   */
  mapTitle: String,
  /**
   * 粘性布局
   * 类型: boolean
   * 默认值: false
   */
  sticky: makeBooleanProp(false),
  /**
   * 粘性布局吸顶位置
   * 类型: number
   * 默认值: 0
   */
  offsetTop: makeNumberProp(0),
  /**
   * 开启手势滑动
   * 类型: boolean
   * 默认值: false
   */
  swipeable: makeBooleanProp(false),
  /**
   * 底部条位置样式
   * 类型: string
   * 可选值: 'normal' | 'text' | 'underline' | 'dot'
   * 默认值: 'normal'
   */
  lineTheme: makeStringProp("normal"),
  /**
   * 底部条宽度，单位像素
   * 类型: number | string
   */
  lineWidth: numericProp,
  /**
   * 底部条高度，单位像素
   * 类型: number | string
   */
  lineHeight: numericProp,
  /**
   * 颜色
   * 类型: string
   * 默认值: ''
   */
  color: makeStringProp(""),
  /**
   * 非活动状态颜色
   * 类型: string
   * 默认值: ''
   */
  inactiveColor: makeStringProp(""),
  /**
   * 是否开启切换标签内容时的过渡动画
   * 类型: boolean
   * 默认值: false
   */
  animated: makeBooleanProp(false),
  /**
   * 切换动画过渡时间，单位毫秒
   * 类型: number
   * 默认值: 300
   */
  duration: makeNumberProp(300),
  /**
   * 是否开启滚动导航
   * 类型: string
   * 可选值：'auto' | 'always'
   * 默认值: 'auto'
   */
  slidable: makeStringProp("auto"),
  /**
   * 标签可滑动时是否显示滚动条
   * 类型: boolean
   * 默认值: false
   */
  showScrollbar: makeBooleanProp(false)
};
const tabProps = {
  ...baseProps,
  /**
   * 唯一标识符，默认为索引
   * 类型: number | string
   */
  name: numericProp,
  /**
   * tab 的标题
   * 类型: string
   */
  title: String,
  /**
   * 是否禁用，无法点击
   * 类型: boolean
   * 默认值: false
   */
  disabled: makeBooleanProp(false),
  /**
   * 是否懒加载，切换到该tab时才加载内容
   * 类型: boolean
   * 默认值: true
   */
  lazy: makeBooleanProp(true),
  /**
   * 徽标属性，透传给 Badge 组件
   * 类型: object
   */
  badgeProps: Object
};
const CHECKBOX_GROUP_KEY = Symbol("wd-checkbox-group");
({
  ...baseProps
});
const checkboxProps = {
  ...baseProps,
  /**
   * 单选框选中时的值
   * 默认值: false
   */
  modelValue: {
    type: [String, Number, Boolean],
    default: false
  },
  name: {
    type: [String, Number, Boolean],
    default: ""
  },
  /**
   * 单选框形状
   * 可选值: circle | square | button | dot
   * 默认值: 继承自 wd-checkbox-group
   */
  type: {
    type: String
  },
  /**
   * 选中的颜色
   * 默认值: 继承自 wd-checkbox-group
   */
  checkedColor: String,
  /**
   * 未选中时的颜色
   * 默认值: 继承自 wd-checkbox-group
   */
  uncheckedColor: String,
  /**
   * 禁用
   * 默认值: 继承自 wd-checkbox-group
   */
  disabled: {
    type: [Boolean, null],
    default: null
  },
  /**
   * 是否为不确定状态（样式优先级最高）
   * 默认值: false
   */
  indeterminate: {
    type: Boolean,
    default: false
  },
  /**
   * 只读
   * 默认值: 继承自 wd-checkbox-group
   */
  readonly: {
    type: [Boolean, null],
    default: null
  },
  /**
   * 选中值，在 checkbox-group 中使用无效，需同 false-value 一块使用
   * 默认值: true
   */
  trueValue: {
    type: [String, Number, Boolean],
    default: true
  },
  /**
   * 非选中时的值，在 checkbox-group 中使用无效，需同 true-value 一块使用
   * 默认值: false
   */
  falseValue: {
    type: [String, Number, Boolean],
    default: false
  },
  /**
   * 设置大小
   * 可选值: large
   * 默认值: 继承自 wd-checkbox-group
   */
  size: String,
  /**
   * 文字位置最大宽度
   */
  maxWidth: String,
  /**
   * 文本位置
   * 可选值: left | right
   * 默认值: 继承自 wd-checkbox-group
   */
  placement: String,
  /**
   * 布局方向
   * 可选值: horizontal | vertical
   * 默认值: 继承自 wd-checkbox-group
   */
  direction: String,
  /**
   * 自定义label文本类名
   */
  customLabelClass: String
};
const now$3 = /* @__PURE__ */ new Date();
const defaultMinDate$3 = new Date(now$3.getFullYear() - 10, 0, 1).getTime();
const defaultMaxDate$3 = new Date(now$3.getFullYear() + 10, 11, 31, 23, 59, 59).getTime();
const datetimePickerProps = {
  ...baseProps,
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  itemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 6
   */
  visibleItemCount: makeNumberProp(6),
  /**
   * 弹出层标题
   * 类型: string
   */
  title: String,
  /**
   * 取消按钮文案
   * 类型: string
   */
  cancelButtonText: String,
  /**
   * 确认按钮文案
   * 类型: string
   */
  confirmButtonText: String,
  /**
   * 点击遮罩是否关闭
   * 类型: boolean
   * 默认值: true
   */
  closeOnClickModal: makeBooleanProp(true),
  /**
   * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
   * 类型: boolean
   * 默认值: true
   */
  safeAreaInsetBottom: makeBooleanProp(true),
  /**
   * 选项的key
   * 类型: string
   * 默认值: 'value'
   */
  valueKey: makeStringProp("value"),
  /**
   * 选项的label
   * 类型: string
   * 默认值: 'label'
   */
  labelKey: makeStringProp("label"),
  /**
   * 选中项，当 type 为 time 时，类型为字符串；当 type 为 Array 时，类型为范围选择；否则为 时间戳
   * 类型: string | number | Array<string | number>
   * 必填
   */
  modelValue: makeRequiredProp([String, Number, Array]),
  /**
   * 选择器类型
   * 类型: string
   * 可选值: 'date' | 'year-month' | 'time' | 'datetime' | 'year'
   * 默认值: 'datetime'
   */
  type: makeStringProp("datetime"),
  /**
   * 最小日期
   * 类型: number
   * 默认值: 十年前的1月1日
   */
  minDate: makeNumberProp(defaultMinDate$3),
  /**
   * 最大日期
   * 类型: number
   * 默认值: 十年后的12月31日
   */
  maxDate: makeNumberProp(defaultMaxDate$3),
  /**
   * 最小小时，time类型时生效
   * 类型: number
   * 默认值: 0
   */
  minHour: makeNumberProp(0),
  /**
   * 最大小时，time类型时生效
   * 类型: number
   * 默认值: 23
   */
  maxHour: makeNumberProp(23),
  /**
   * 最小分钟，time类型时生效
   * 类型: number
   * 默认值: 0
   */
  minMinute: makeNumberProp(0),
  /**
   * 最大分钟，time类型时生效
   * 类型: number
   * 默认值: 59
   */
  maxMinute: makeNumberProp(59),
  /**
   * 是否启用秒选择，仅在 time 和 datetime 类型下生效
   * 类型: boolean
   * 默认值: false
   */
  useSecond: makeBooleanProp(false),
  /**
   * 最小秒数，仅在 time 和 datetime 类型下生效
   * 类型: number
   * 默认值: 0
   */
  minSecond: makeNumberProp(0),
  /**
   * 最大秒数，仅在 time 和 datetime 类型下生效
   * 类型: number
   * 默认值: 59
   */
  maxSecond: makeNumberProp(59),
  /**
   * 自定义过滤选项的函数，返回列的选项数组
   * 类型: function
   */
  filter: Function,
  /**
   * 自定义弹出层选项文案的格式化函数，返回一个字符串
   * 类型: function
   */
  formatter: Function,
  /**
   * 确定前校验函数，接收 (value) 参数，返回 boolean 或 Promise<boolean>
   * 类型: function
   */
  beforeConfirm: Function,
  /**
   * 在区域选择模式下，自定义展示tab标签文案的格式化函数，返回一个字符串
   * 类型: function
   */
  displayFormatTabLabel: Function,
  /**
   * 弹窗层级
   * 类型: number
   * 默认值: 15
   */
  zIndex: makeNumberProp(15),
  /**
   * pickerView 外部自定义样式
   * 类型: string
   */
  customViewClass: makeStringProp(""),
  /**
   * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型: boolean
   * 默认值: false
   */
  rootPortal: makeBooleanProp(false),
  /**
   * 控制弹窗显示
   * 类型: boolean
   * 默认值: false
   */
  visible: makeBooleanProp(false)
};
function formatDate(date, format) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const tokens = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MM: String(month).padStart(2, "0"),
    M: String(month),
    DD: String(day).padStart(2, "0"),
    D: String(day),
    HH: String(hours).padStart(2, "0"),
    H: String(hours),
    mm: String(minutes).padStart(2, "0"),
    m: String(minutes),
    ss: String(seconds).padStart(2, "0"),
    s: String(seconds)
  };
  const pattern = Object.keys(tokens).sort((a, b) => b.length - a.length).join("|");
  return format.replace(new RegExp(pattern, "g"), (match) => tokens[match] || match);
}
function getPickerValue(value, type, useSecond = false) {
  const values = [];
  const date = new Date(value);
  if (type === "time") {
    const pair = String(value).split(":");
    values.push(parseInt(pair[0]), parseInt(pair[1]));
    if (useSecond && pair[2]) {
      values.push(parseInt(pair[2]));
    }
  } else {
    values.push(date.getFullYear(), date.getMonth() + 1);
    if (type === "date") {
      values.push(date.getDate());
    } else if (type === "datetime") {
      values.push(date.getDate(), date.getHours(), date.getMinutes());
      if (useSecond) {
        values.push(date.getSeconds());
      }
    }
  }
  return values;
}
const uploadProps = {
  ...baseProps,
  /**
   * 上传的文件列表,例如:[{name:'food.jpg',url:'https://xxx.cdn.com/xxx.jpg'}]
   * 类型：array
   * 默认值：[]
   */
  fileList: makeArrayProp(),
  /**
   * 必选参数，上传的地址
   * 类型：string
   * 默认值：''
   */
  action: makeStringProp(""),
  /**
   * 设置上传的请求头部
   * 类型：object
   * 默认值：{}
   */
  header: { type: Object, default: () => ({}) },
  /**
   * 是否支持多选文件
   * 类型：boolean
   * 默认值：false
   */
  multiple: makeBooleanProp(false),
  /**
   * 是否禁用
   * 类型：boolean
   * 默认值：false
   */
  disabled: makeBooleanProp(false),
  /**
   * 最大允许上传个数
   * 类型：number
   * 默认值：无
   */
  limit: Number,
  /**
   * 限制上传个数的情况下，是否展示当前上传的个数
   * 类型：boolean
   * 默认值：true
   */
  showLimitNum: makeBooleanProp(true),
  /**
   * 文件大小限制，单位为byte
   * 类型：number
   * 默认值：Number.MAX_VALUE
   */
  maxSize: makeNumberProp(Number.MAX_VALUE),
  /**
   * 选择图片的来源，chooseImage接口详细参数，查看官方手册
   * 类型：array
   * 默认值：['album','camera']
   */
  sourceType: {
    type: Array,
    default: () => ["album", "camera"]
  },
  /**
   * 所选的图片的尺寸，chooseImage接口详细参数，查看官方手册
   * 类型：array
   * 默认值：['original','compressed']
   */
  sizeType: {
    type: Array,
    default: () => ["original", "compressed"]
  },
  /**
   * 文件对应的key，开发者在服务端可以通过这个key获取文件的二进制内容，uploadFile接口详细参数，查看官方手册
   * 类型：string
   * 默认值：'file'
   */
  name: makeStringProp("file"),
  /**
   * HTTP请求中其他额外的formdata，uploadFile接口详细参数，查看官方手册
   * 类型：object
   * 默认值：{}
   */
  formData: { type: Object, default: () => ({}) },
  /**
   * 预览失败执行操作
   * 类型：function({index,imgList})
   * 默认值：-
   */
  onPreviewFail: Function,
  /**
   * 上传文件之前的钩子，参数为上传的文件和文件列表，若返回false或者返回Promise且被reject，则停止上传。
   * 类型：function({files,fileList})
   * 默认值：-
   */
  beforeUpload: Function,
  /**
   * 选择图片之前的钩子，参数为文件列表，若返回false或者返回Promise且被reject，则停止上传。
   * 类型：function({fileList})
   * 默认值：-
   */
  beforeChoose: Function,
  /**
   * 删除文件之前的钩子，参数为要删除的文件和文件列表，若返回false或者返回Promise且被reject，则停止删除。
   * 类型：function({file,index,fileList})
   * 默认值：-
   */
  beforeRemove: Function,
  /**
   * 图片预览前的钩子，参数为预览的文件和图片列表，若返回false或者返回Promise且被reject，则停止预览。
   * 类型：function({file,index,imgList,fileList})
   * 默认值：-
   */
  beforePreview: Function,
  /**
   * 构建上传formData的钩子，参数为上传的文件、待处理的formData，返回值为处理后的formData，若返回Promise且被reject，则停止上传。
   * 类型：function({file,formData})
   * 默认值：-
   * 最低版本：0.1.61
   */
  buildFormData: Function,
  /**
   * 加载中图标类型
   * 类型：string
   * 默认值：'ring'
   */
  loadingType: makeStringProp("circular"),
  /**
   * 加载中图标颜色
   * 类型：string
   * 默认值：'#ffffff'
   */
  loadingColor: makeStringProp("#ffffff"),
  /**
   * 文件类型，可选值：'image' | 'video' | 'media' | 'all' | 'file'
   * 默认值：image
   * 描述：'media'表示同时支持'image'和'video'，'file'表示支持除'image'和'video'外的所有文件类型，'all'标识支持全部类型文件
   * 'media'和'file'仅微信支持，'all'仅微信和H5支持
   */
  accept: makeStringProp("image"),
  /**
   * file 数据结构中，status 对应的 key
   * 类型：string
   * 默认值：'status'
   */
  statusKey: makeStringProp("status"),
  /**
   * 加载中图标尺寸
   * 类型：string
   * 默认值：'24px'
   */
  loadingSize: makeStringProp("24px"),
  /**
   * 是否压缩视频，当 accept 为 video 时生效。
   * 类型：boolean
   * 默认值：true
   */
  compressed: makeBooleanProp(true),
  /**
   * 拍摄视频最长拍摄时间，当 accept 为 video | media 时生效，单位秒。
   * 类型：number
   * 默认值：60
   */
  maxDuration: makeNumberProp(60),
  /**
   * 使用前置或者后置相机，当 accept 为 video | media 时生效，可选值为：back｜front。
   * 类型：UploadCameraType
   * 默认值：'back'
   */
  camera: makeStringProp("back"),
  /**
   * 预览图片的mode属性
   */
  imageMode: makeStringProp("aspectFit"),
  /**
   * 接口响应的成功状态（statusCode）值
   */
  successStatus: {
    type: [Number, Array],
    default: 200
  },
  /**
   * 自定义上传按钮样式
   * 类型：string
   */
  customEvokeClass: makeStringProp(""),
  /**
   * 自定义预览图片列表样式
   * 类型：string
   */
  customPreviewClass: makeStringProp(""),
  /**
   * 是否选择文件后自动上传
   * 类型：boolean
   */
  autoUpload: makeBooleanProp(true),
  /**
   * 点击已上传时是否可以重新上传
   * 类型：boolean
   * 默认值：false
   */
  reupload: makeBooleanProp(false),
  /**
   * 自定义上传文件的请求方法
   * 类型：UploadMethod
   * 默认值：-
   */
  uploadMethod: Function,
  /**
   * 根据文件拓展名过滤,每一项都不能是空字符串。默认不过滤。
   * H5支持全部类型过滤。
   * 微信小程序支持all和file时过滤,其余平台不支持。
   */
  extension: Array
};
const videoPreviewDefaultOptionKey = "__VIDEO_PREVIEW_OPTION__";
const defaultOptions = {
  url: "",
  poster: "",
  title: "",
  show: false,
  zIndex: 1e3
};
const None = Symbol("None");
function useVideoPreview(selector = "") {
  const videoPreviewOptionKey = getVideoPreviewOptionKey(selector);
  const videoPreviewOption = inject(videoPreviewOptionKey, ref(None));
  if (videoPreviewOption.value === None) {
    videoPreviewOption.value = defaultOptions;
    provide(videoPreviewOptionKey, videoPreviewOption);
  }
  const open = (options) => {
    const mergedOptions = deepMerge(defaultOptions, options);
    videoPreviewOption.value = deepMerge(mergedOptions, { show: true });
  };
  const close = () => {
    videoPreviewOption.value = { show: false };
  };
  return {
    previewVideo: open,
    closeVideoPreview: close
  };
}
const getVideoPreviewOptionKey = (selector) => {
  return selector ? `${videoPreviewDefaultOptionKey}${selector}` : videoPreviewDefaultOptionKey;
};
const gridProps = {
  ...baseProps,
  /**
   * 是否开启格子点击反馈
   * 类型: boolean
   * 默认值: false
   */
  clickable: makeBooleanProp(false),
  /**
   * 是否将格子固定为正方形
   * 类型: boolean
   * 默认值: false
   */
  square: makeBooleanProp(false),
  /**
   * 列数
   * 类型: number
   * 默认值: 0（自动根据子元素数量计算）
   */
  column: Number,
  /**
   * 是否显示边框
   * 类型: boolean
   * 默认值: false
   */
  border: makeBooleanProp(false),
  /**
   * 背景颜色
   * 类型: string
   * 默认值: ''
   */
  bgColor: makeStringProp(""),
  /**
   * 格子之间的间距，默认单位为px
   * 类型: number
   * 默认值: 0
   */
  gutter: Number,
  /**
   * 自定义内容区域hover-class
   * 类型: string
   * 默认值: ''
   */
  hoverClass: String,
  /**
   * 是否将格子内容居中显示
   * 类型: boolean
   * 默认值: true
   */
  center: makeBooleanProp(true),
  /**
   * 格子内容排列的方向
   * 可选值: 'horizontal' | 'vertical'
   * 默认值: 'vertical'
   */
  direction: makeStringProp("vertical"),
  /**
   * 是否调换图标和文本的位置
   * 类型: boolean
   * 默认值: false
   */
  reverse: makeBooleanProp(false),
  /**
   * 图标大小，默认单位为px
   * 类型: string
   * 默认值: '28px'
   */
  iconSize: String
};
const GRID_KEY = Symbol("wd-grid");
const gridItemProps = {
  ...baseProps,
  /**
   * GridItem 下方文字样式
   * 类型: string
   * 默认值: ''
   */
  customText: makeStringProp(""),
  /**
   * GridItem 上方 icon 样式
   * 类型: string
   * 默认值: ''
   */
  customIcon: makeStringProp(""),
  /**
   * 文字
   * 类型: string
   * 默认值: ''
   */
  text: String,
  /**
   * 点击后跳转的链接地址
   * 类型: string
   * 默认值: ''
   */
  url: String,
  /**
   * 页面跳转方式
   * 可选值: 'navigateTo' | 'switchTab' | 'reLaunch' | 'redirectTo'
   * 默认值: 'navigateTo'
   */
  linkType: makeStringProp("navigateTo"),
  /**
   * 图标名称，可选值见 wd-icon 组件
   * 类型: string
   * 默认值: ''
   */
  icon: makeStringProp(""),
  /**
   * 图标颜色
   * 类型: string
   * 默认值: ''
   */
  iconColor: String,
  /**
   * 图标类名前缀
   * 类型: string
   * 默认值: ''
   */
  iconPrefix: String,
  /**
   * 徽标显示值
   * 类型: string | number
   * 默认值: ''
   */
  value: numericProp,
  /**
   * 是否点状徽标
   * 类型: boolean
   * 默认值: false
   */
  isDot: Boolean,
  /**
   * 徽标最大值
   * 类型: number
   * 默认值: 99
   */
  max: Number,
  /**
   * 徽标属性，透传给 Badge 组件
   * 类型: Partial<BadgeProps>
   * 默认值: {}
   */
  badgeProps: Object,
  /**
   * 是否超出隐藏，显示省略号
   * 类型: boolean
   * 默认值: false
   */
  ellipsis: makeBooleanProp(false)
};
const radioGroupProps = {
  ...baseProps,
  /**
   * 会自动选中value对应的单选框
   */
  modelValue: [String, Number, Boolean],
  /**
   * 单选框类型
   * 可选值: dot | circle | square | button
   * 默认值: circle
   */
  type: makeStringProp("circle"),
  /**
   * 选中的颜色
   */
  checkedColor: String,
  /**
   * 未选中状态的颜色
   */
  uncheckedColor: String,
  /**
   * 是否禁用
   * 默认值: false
   */
  disabled: makeBooleanProp(false),
  /**
   * 是否只读
   * 默认值: false
   */
  readonly: makeBooleanProp(false),
  /**
   * 图标位置
   * 可选值: 'left' | 'right'
   * 默认值: left
   */
  placement: makeStringProp("left"),
  /**
   * 布局方向
   * 可选值: 'horizontal' | 'vertical'
   * 默认值: vertical
   */
  direction: makeStringProp("vertical"),
  /**
   * 是否允许取消选中
   * 默认值: false
   */
  allowUncheck: makeBooleanProp(false)
};
const RADIO_GROUP_KEY = Symbol("wd-radio-group");
const radioProps = {
  ...baseProps,
  /**
   * 选中时的值
   */
  value: makeRequiredProp([String, Number, Boolean]),
  /**
   * 单选框类型
   * 可选值: dot | circle | square | button
   * 默认值: 继承自 radio-group
   */
  type: String,
  /**
   * 选中的颜色
   * 默认值: 继承自 radio-group
   */
  checkedColor: String,
  /**
   * 未选中状态的颜色
   * 默认值: 继承自 radio-group
   */
  uncheckedColor: String,
  /**
   * 是否禁用
   * 默认值: 继承自 radio-group
   */
  disabled: {
    type: Boolean,
    default: void 0
  },
  /**
   * 是否只读
   * 默认值: 继承自 radio-group
   */
  readonly: {
    type: Boolean,
    default: void 0
  },
  /**
   * 布局方向
   * 可选值: 'horizontal' | 'vertical'
   * 默认值: 继承自 radio-group
   */
  direction: String,
  /**
   * 图标位置
   * 可选值: 'left' | 'right'
   * 默认值: 继承自 radio-group
   */
  placement: String,
  /**
   * 自定义label文本类名
   */
  customLabelClass: String
};
const textareaProps = {
  ...baseProps,
  /**
   * 自定义文本域容器class名称
   */
  customTextareaContainerClass: makeStringProp(""),
  /**
   * 自定义文本域class名称
   */
  customTextareaClass: makeStringProp(""),
  // 原生属性
  /**
   * 绑定值
   */
  modelValue: makeNumericProp(""),
  /**
   * 占位文本
   */
  placeholder: String,
  /**
   * 指定placeholder的样式
   */
  placeholderStyle: String,
  /**
   * 指定placeholder的样式类
   */
  placeholderClass: makeStringProp(""),
  /**
   * 禁用输入框
   */
  disabled: makeBooleanProp(false),
  /**
   * 最大输入长度，设置为-1表示不限制最大长度
   */
  maxlength: makeNumberProp(-1),
  /**
   * 自动聚焦并拉起键盘
   */
  autoFocus: makeBooleanProp(false),
  /**
   * 获取焦点
   */
  focus: makeBooleanProp(false),
  /**
   * 是否自动增高输入框高度
   */
  autoHeight: makeBooleanProp(false),
  /**
   * 如果textarea处于position:fixed区域，需要设置此属性为true
   */
  fixed: makeBooleanProp(false),
  /**
   * 指定光标与键盘的距离
   */
  cursorSpacing: makeNumberProp(0),
  /**
   * 指定focus时的光标位置
   */
  cursor: makeNumberProp(-1),
  /**
   * 设置键盘右下角按钮的文字
   */
  confirmType: String,
  /**
   * 点击键盘右下角按钮时是否保持键盘不收起
   */
  confirmHold: makeBooleanProp(false),
  /**
   * 是否显示键盘上方带有"完成"按钮那一栏
   */
  showConfirmBar: makeBooleanProp(true),
  /**
   * 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   */
  selectionStart: makeNumberProp(-1),
  /**
   * 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   */
  selectionEnd: makeNumberProp(-1),
  /**
   * 键盘弹起时是否自动上推页面
   */
  adjustPosition: makeBooleanProp(true),
  /**
   * 是否去掉iOS下的默认内边距
   */
  disableDefaultPadding: makeBooleanProp(false),
  /**
   * focus状态下点击页面时是否不收起键盘
   */
  holdKeyboard: makeBooleanProp(false),
  // 非原生属性
  /**
   * 显示为密码框
   */
  showPassword: makeBooleanProp(false),
  /**
   * 是否显示清空按钮
   */
  clearable: makeBooleanProp(false),
  /**
   * 输入框只读状态
   */
  readonly: makeBooleanProp(false),
  /**
   * 前置图标，icon组件中的图标类名
   */
  prefixIcon: String,
  /**
   * 是否显示字数限制，需要同时设置maxlength
   */
  showWordLimit: makeBooleanProp(false),
  /**
   * 设置输入框错误状态（红色）
   */
  error: makeBooleanProp(false),
  /**
   * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
   */
  clearTrigger: makeStringProp("always"),
  /**
   * 是否在点击清除按钮时聚焦输入框
   */
  focusWhenClear: makeBooleanProp(true),
  /**
   * 是否忽略组件内对文本合成系统事件的处理
   */
  ignoreCompositionEvent: makeBooleanProp(true),
  /**
   * 提供数据类型提示
   */
  inputmode: makeStringProp("text"),
  /**
   * 支付宝小程序，避免 textarea 弹出键盘后出现内容上移
   */
  enableNative: makeBooleanProp(true),
  /**
   * 紧凑模式，移除内边距和背景色，在结合 cell 或 form-item 使用时建议开启
   * 类型: boolean
   * 默认值: -
   */
  compact: makeBooleanProp(void 0)
};
const stepsProps = {
  ...baseProps,
  /**
   * 当前激活的步骤进度，以数字表示。
   * 类型: number
   * 默认值: 0
   */
  active: makeNumberProp(0),
  /**
   * 是否为垂直方向的步骤条。
   * 类型: boolean
   * 默认值: false
   */
  vertical: makeBooleanProp(false),
  /**
   * 是否为点状步骤条样式。
   * 类型: boolean
   * 默认值: false
   */
  dot: makeBooleanProp(false),
  /**
   * 步骤条之间的间距，默认为自动计算。
   * 如果指定，则使用此值作为间距。
   * 类型: string
   * 默认值: ''
   */
  space: makeStringProp(""),
  /**
   * 是否将步骤条水平居中显示，只对横向步骤条有效。
   * 类型: boolean
   * 默认值: false
   */
  alignCenter: makeBooleanProp(false)
};
const STEPS_KEY = Symbol("wd-steps");
const stepProps = {
  ...baseProps,
  /**
   * 步骤标题，如果没有则使用默认文案。
   * 当只有标题而没有描述时，标题的字号会小2号。
   * 类型: string
   * 默认值: ''
   */
  title: String,
  /**
   * 步骤描述。
   * 类型: string
   * 默认值: ''
   */
  description: String,
  /**
   * 步骤图标。
   * 类型: string
   * 默认值: ''
   */
  icon: String,
  /**
   * 步骤状态
   * 类型: StepStatus
   * 可选值: 'finished' | 'process' | 'error' | 'wait'
   * 默认值: 'wait'
   */
  status: String
};
const TABBAR_KEY = Symbol("wd-tabbar");
const tabbarProps = {
  ...baseProps,
  /**
   * 选中标签的索引值或者名称
   */
  modelValue: makeNumericProp(0),
  /**
   * 是否固定在底部
   */
  fixed: makeBooleanProp(false),
  /**
   * 是否显示顶部边框
   */
  bordered: makeBooleanProp(false),
  /**
   * 是否设置底部安全距离（iPhone X 类型的机型）
   */
  safeAreaInsetBottom: makeBooleanProp(false),
  /**
   * 标签栏的形状。可选项：default/round
   */
  shape: makeStringProp("default"),
  /**
   * 激活标签的颜色
   */
  activeColor: String,
  /**
   * 未激活标签的颜色
   */
  inactiveColor: String,
  /**
   * 固定在底部时，是否在标签位置生成一个等高的占位元素
   */
  placeholder: makeBooleanProp(false),
  /**
   * 自定义组件的层级
   */
  zIndex: makeNumberProp(10),
  /**
   * 切换前的回调函数，返回 false 可阻止切换，支持返回 Promise
   */
  beforeChange: Function
};
const tabbarItemProps = {
  ...baseProps,
  /**
   * 标签页的标题
   */
  title: String,
  /**
   * 唯一标识符
   */
  name: numericProp,
  /**
   * 图标
   */
  icon: String,
  /**
   * 徽标显示值
   */
  value: [Number, String],
  /**
   * 是否点状徽标
   */
  isDot: Boolean,
  /**
   * 徽标最大值
   */
  max: Number,
  /**
   * 徽标属性，透传给 Badge 组件
   */
  badgeProps: Object
};
const FORM_VALIDATE_EVENTS = ["change", "blur", "submit"];
const formProps = {
  ...baseProps,
  /**
   * 表单数据对象
   */
  model: makeRequiredProp(Object),
  /**
   * 表单验证规则
   */
  schema: Object,
  /**
   * 校验触发时机
   */
  validateTrigger: {
    type: [String, Array],
    default: "submit"
  },
  /**
   * 是否在输入时重置表单校验信息
   */
  resetOnChange: makeBooleanProp(true),
  /**
   * 错误提示类型
   */
  errorType: {
    type: String,
    default: "message"
  },
  // ========== 公共配置属性（可被 form-item 继承）==========
  /**
   * 是否展示边框线
   * 类型: boolean
   * 默认值: false
   */
  border: makeBooleanProp(false),
  /**
   * 是否使内容垂直居中
   * 类型: boolean
   * 默认值: false
   */
  center: makeBooleanProp(false),
  /**
   * 单元格大小，可选值: 'large'
   * 类型: CellSize
   */
  size: String,
  /**
   * 左侧标题宽度
   * 类型: string | number
   */
  titleWidth: numericProp,
  /**
   * 单元格布局方式
   * 类型: CellLayout
   * 可选值: 'horizontal' | 'vertical'
   */
  layout: String,
  /**
   * 右侧内容对齐方式
   * 类型: CellValueAlign
   * 可选值: 'left' | 'right' | 'center'
   */
  valueAlign: String,
  /**
   * 必填星号位置
   * 类型: CellAsteriskPosition
   * 可选值: 'start' | 'end'
   */
  asteriskPosition: String,
  /**
   * 是否隐藏必填星号
   * 类型: boolean
   * 默认值: false
   */
  hideAsterisk: makeBooleanProp(false),
  /**
   * 是否超出隐藏显示省略号
   * 类型: boolean
   * 默认值: false
   */
  ellipsis: makeBooleanProp(false)
};
const FORM_KEY = Symbol("wd-form");
const { translate } = useTranslate("calendar-view");
const weeks = computed(() => {
  return [
    translate("weeks.sun"),
    translate("weeks.mon"),
    translate("weeks.tue"),
    translate("weeks.wed"),
    translate("weeks.thu"),
    translate("weeks.fri"),
    translate("weeks.sat")
  ];
});
function compareDate(date1, date2) {
  const dateValue1 = new Date(date1);
  const dateValue2 = new Date(date2 || "");
  const year1 = dateValue1.getFullYear();
  const year2 = dateValue2.getFullYear();
  const month1 = dateValue1.getMonth();
  const month2 = dateValue2.getMonth();
  const day1 = dateValue1.getDate();
  const day2 = dateValue2.getDate();
  if (year1 === year2) {
    if (month1 === month2) {
      return day1 === day2 ? 0 : day1 > day2 ? 1 : -1;
    }
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
  }
  return year1 > year2 ? 1 : -1;
}
function isRange(type) {
  return type.indexOf("range") > -1;
}
function compareMonth(date1, date2) {
  const dateValue1 = new Date(date1);
  const dateValue2 = new Date(date2);
  const year1 = dateValue1.getFullYear();
  const year2 = dateValue2.getFullYear();
  const month1 = dateValue1.getMonth();
  const month2 = dateValue2.getMonth();
  if (year1 === year2) {
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
  }
  return year1 > year2 ? 1 : -1;
}
function compareYear(date1, date2) {
  const dateValue1 = new Date(date1);
  const dateValue2 = new Date(date2);
  const year1 = dateValue1.getFullYear();
  const year2 = dateValue2.getFullYear();
  return year1 === year2 ? 0 : year1 > year2 ? 1 : -1;
}
function getMonthEndDay(year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
function formatMonthTitle(date) {
  return formatDate(date, translate("monthTitle"));
}
function getWeekLabel(index2) {
  if (index2 >= 7) {
    index2 = index2 % 7;
  }
  return weeks.value[index2];
}
function formatYearTitle(date) {
  return formatDate(date, translate("yearTitle"));
}
function getMonths(minDate, maxDate) {
  const months = [];
  const month = new Date(minDate);
  month.setDate(1);
  while (compareMonth(month.getTime(), maxDate) < 1) {
    months.push(month.getTime());
    month.setMonth(month.getMonth() + 1);
  }
  return months;
}
function getYears(minDate, maxDate) {
  const years = [];
  const year = new Date(minDate);
  year.setMonth(0);
  year.setDate(1);
  while (compareYear(year.getTime(), maxDate) < 1) {
    years.push(year.getTime());
    year.setFullYear(year.getFullYear() + 1);
  }
  return years;
}
function getWeekRange(date, firstDayOfWeek) {
  if (firstDayOfWeek >= 7) {
    firstDayOfWeek = firstDayOfWeek % 7;
  }
  const dateValue = new Date(date);
  dateValue.setHours(0, 0, 0, 0);
  const year = dateValue.getFullYear();
  const month = dateValue.getMonth();
  const day = dateValue.getDate();
  const week = dateValue.getDay();
  const weekStart = new Date(year, month, day - (7 + week - firstDayOfWeek) % 7);
  const weekEnd = new Date(year, month, day + 6 - (7 + week - firstDayOfWeek) % 7);
  return [weekStart.getTime(), weekEnd.getTime()];
}
function getDayOffset(date1, date2) {
  return (date1 - date2) / (24 * 60 * 60 * 1e3) + 1;
}
function getDayByOffset(date, offset) {
  const dateValue = new Date(date);
  dateValue.setDate(dateValue.getDate() + offset);
  return dateValue.getTime();
}
const getPrevDay = (date) => getDayByOffset(date, -1);
const getNextDay = (date) => getDayByOffset(date, 1);
function getMonthOffset(date1, date2) {
  const dateValue1 = new Date(date1);
  const dateValue2 = new Date(date2);
  const year1 = dateValue1.getFullYear();
  const year2 = dateValue2.getFullYear();
  let month1 = dateValue1.getMonth();
  const month2 = dateValue2.getMonth();
  month1 = (year1 - year2) * 12 + month1;
  return month1 - month2 + 1;
}
function getMonthByOffset(date, offset) {
  const dateValue = new Date(date);
  dateValue.setMonth(dateValue.getMonth() + offset);
  return dateValue.getTime();
}
function getDefaultTime(defaultTime) {
  if (isArray(defaultTime)) {
    const startTime = (defaultTime[0] || "00:00:00").split(":").map((item) => {
      return parseInt(item);
    });
    const endTime = (defaultTime[1] || "00:00:00").split(":").map((item) => {
      return parseInt(item);
    });
    return [startTime, endTime];
  } else {
    const time = (defaultTime || "00:00:00").split(":").map((item) => {
      return parseInt(item);
    });
    return [time, time];
  }
}
function getDateByDefaultTime(date, defaultTime) {
  const dateValue = new Date(date);
  dateValue.setHours(defaultTime[0]);
  dateValue.setMinutes(defaultTime[1]);
  dateValue.setSeconds(defaultTime[2]);
  return dateValue.getTime();
}
function getWeekNumber(date) {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week.getTime()) / 864e5 - 3 + (week.getDay() + 6) % 7) / 7);
}
function getItemClass(monthType, value, type) {
  const classList = ["is-" + monthType];
  if (type.indexOf("range") > -1 && isArray(value)) {
    if (!value || !value[1]) {
      classList.push("is-without-end");
    }
  }
  return classList.join(" ");
}
const now$2 = /* @__PURE__ */ new Date();
const defaultMinDate$2 = new Date(now$2.getFullYear(), now$2.getMonth() - 6, now$2.getDate()).getTime();
const defaultMaxDate$2 = new Date(now$2.getFullYear(), now$2.getMonth() + 6, now$2.getDate(), 23, 59, 59).getTime();
const calendarProps = {
  ...baseProps,
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | number[] | null
   * 默认值: null
   */
  modelValue: makeRequiredProp([Number, Array, null]),
  /**
   * 日期类型
   * 类型: CalendarType
   * 可选值: 'date' | 'dates' | 'datetime' | 'week' | 'month' | 'daterange' | 'datetimerange' | 'weekrange' | 'monthrange'
   * 默认值: 'date'
   */
  type: makeStringProp("date"),
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 - 6个月
   */
  minDate: makeNumberProp(defaultMinDate$2),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 + 6个月
   */
  maxDate: makeNumberProp(defaultMaxDate$2),
  /**
   * 周起始天
   * 类型: number
   * 默认值: 0
   */
  firstDayOfWeek: makeNumberProp(0),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: string | string[]
   */
  defaultTime: {
    type: [String, Array]
  },
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，用于过滤时间选择器的数据
   * 类型: CalendarTimeFilter
   */
  timeFilter: Function,
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，是否不展示秒修改
   * 类型: boolean
   * 默认值: false
   */
  hideSecond: makeBooleanProp(false),
  /**
   * 弹出层标题
   * 类型: string
   */
  title: String,
  /**
   * 点击遮罩是否关闭
   * 类型: boolean
   * 默认值: true
   */
  closeOnClickModal: makeBooleanProp(true),
  /**
   * 弹框层级
   * 类型: number
   * 默认值: 15
   */
  zIndex: makeNumberProp(15),
  /**
   * 是否显示确定按钮
   * 类型: boolean
   * 默认值: true
   */
  showConfirm: makeBooleanProp(true),
  /**
   * 确定按钮文字
   * 类型: string
   */
  confirmText: String,
  /**
   * 自定义范围选择类型的面板内部回显，返回一个字符串
   * 类型: CalendarInnerDisplayFormat
   */
  innerDisplayFormat: Function,
  /**
   * 是否超出隐藏
   * 类型: boolean
   * 默认值: false
   */
  ellipsis: makeBooleanProp(false),
  /**
   * 是否显示类型切换功能
   * 类型: boolean
   * 默认值: false
   */
  showTypeSwitch: makeBooleanProp(false),
  /**
   * 快捷选项，为对象数组，其中对象的 text 必传
   * 类型: Record<string, any>[]
   */
  shortcuts: makeArrayProp(),
  /**
   * 快捷操作点击回调
   * 类型: CalendarOnShortcutsClick
   */
  onShortcutsClick: Function,
  /**
   * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
   * 类型: boolean
   * 默认值: true
   */
  safeAreaInsetBottom: makeBooleanProp(true),
  /**
   * 确定前校验函数，接收目标 value，返回 false 可阻止确认，支持返回 Promise<boolean>
   * 类型: CalendarBeforeConfirm
   */
  beforeConfirm: Function,
  /**
   * 自定义视图类名
   * 类型: string
   */
  customViewClass: makeStringProp(""),
  /**
   * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型: boolean
   * 默认值: false
   */
  rootPortal: makeBooleanProp(false),
  /**
   * 控制弹窗显示
   * 类型: boolean
   * 默认值: false
   */
  visible: makeBooleanProp(false),
  /**
   * 可滚动面板的高度
   * 类型: number
   * 默认值: 316
   */
  panelHeight: makeNumberProp(316),
  /**
   * 是否展示面板标题，自动计算当前滚动的日期月份
   * 类型: boolean
   * 默认值: true
   */
  showPanelTitle: makeBooleanProp(true),
  /**
   * 切换模式
   * 类型: 'none' | 'month' | 'year-month'
   * 可选值: none 平铺展示所有月份/年份，不展示切换按钮 | month 支持按月切换，展示上个月/下个月按钮 | year-month 支持按年切换，也支持按月切换，展示上一年/下一年，上个月/下个月按钮
   * 默认值: 'none'
   */
  switchMode: makeStringProp("none"),
  /**
   * 弹框动画持续时间
   * 类型: number
   * 默认值: 200
   */
  duration: makeNumberProp(200)
};
const pickerProps = {
  ...baseProps,
  /**
   * pickerView 外部自定义样式
   * 类型: string
   * 默认值: ''
   */
  customViewClass: makeStringProp(""),
  /* popup */
  /**
   * 弹出层标题
   * 类型: string
   * 默认值: -
   */
  title: String,
  /**
   * 取消按钮文案
   * 类型: string
   * 默认值: -
   */
  cancelButtonText: String,
  /**
   * 确认按钮文案
   * 类型: string
   * 默认值: -
   */
  confirmButtonText: String,
  /**
   * 确定前校验函数，接收 (value) 参数，返回 boolean 或 Promise<boolean>
   * 类型: PickerBeforeConfirm
   * 默认值: -
   */
  beforeConfirm: Function,
  /**
   * 点击蒙层关闭
   * 类型: boolean
   * 默认值: true
   */
  closeOnClickModal: makeBooleanProp(true),
  /**
   * 底部安全区域内
   * 类型: boolean
   * 默认值: true
   */
  safeAreaInsetBottom: makeBooleanProp(true),
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  itemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 6
   */
  visibleItemCount: makeNumberProp(6),
  /**
   * 选项值对应的键名
   * 类型: string
   * 默认值: 'value'
   */
  valueKey: makeStringProp("value"),
  /**
   * 选项文本对应的键名
   * 类型: string
   * 默认值: 'label'
   */
  labelKey: makeStringProp("label"),
  /**
   * 是否开启级联模式
   * 类型: boolean
   * 默认值: false
   */
  cascade: makeBooleanProp(false),
  /**
   * 选项对象中，children 对应的 key
   * 类型: string
   * 默认值: 'children'
   */
  childrenKey: makeStringProp("children"),
  /**
   * 选中项
   * 类型: (string | number)[]
   * 默认值: []
   */
  modelValue: makeArrayProp(),
  /**
   * 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器
   * 类型: Array<string | number | PickerOption | Array<string | number | PickerOption>>
   * 默认值: []
   */
  columns: makeArrayProp(),
  /**
   * 自定义层级
   * 类型: number
   * 默认值: 15
   */
  zIndex: makeNumberProp(15),
  /**
   * 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型: boolean
   * 默认值: false
   */
  rootPortal: makeBooleanProp(false),
  /**
   * 控制弹窗显示
   * 类型: boolean
   * 默认值: false
   */
  visible: makeBooleanProp(false)
};
const overlayProps = {
  ...baseProps,
  /**
   * 是否展示遮罩层
   * 类型: boolean
   * 默认值: false
   */
  show: makeBooleanProp(false),
  /**
   * 动画时长，单位毫秒
   * 类型: Record<string, number> | number | boolean
   * 默认值: 300
   */
  duration: {
    type: [Object, Number, Boolean],
    default: 300
  },
  /**
   * 是否锁定滚动
   * 类型: boolean
   * 默认值: true
   */
  lockScroll: makeBooleanProp(true),
  /**
   * 层级
   * 类型: number
   * 默认值: 10
   */
  zIndex: makeNumberProp(10)
};
const transitionProps = {
  ...baseProps,
  /**
   * 是否展示组件
   * 类型: boolean
   * 默认值: false
   */
  show: makeBooleanProp(false),
  /**
   * 动画执行时间，单位毫秒
   * 类型: Record<string, number> | number | boolean
   * 默认值: 300
   */
  duration: {
    type: [Object, Number, Boolean],
    default: 300
  },
  /**
   * 弹层内容懒渲染，触发展示时才渲染内容
   * 类型: boolean
   * 默认值: false
   */
  lazyRender: makeBooleanProp(false),
  /**
   * 动画类型
   * 类型: TransitionName | TransitionName[]
   * 可选值: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out'
   * 默认值: 'fade'
   */
  name: [String, Array],
  /**
   * 是否在动画结束时销毁子节点（display: none）
   * 类型: boolean
   * 默认值: true
   */
  destroy: makeBooleanProp(true),
  /**
   * 进入过渡的开始状态
   * 类型: string
   * 默认值: ''
   */
  enterClass: makeStringProp(""),
  /**
   * 进入过渡的激活状态
   * 类型: string
   * 默认值: ''
   */
  enterActiveClass: makeStringProp(""),
  /**
   * 进入过渡的结束状态
   * 类型: string
   * 默认值: ''
   */
  enterToClass: makeStringProp(""),
  /**
   * 离开过渡的开始状态
   * 类型: string
   * 默认值: ''
   */
  leaveClass: makeStringProp(""),
  /**
   * 离开过渡的激活状态
   * 类型: string
   * 默认值: ''
   */
  leaveActiveClass: makeStringProp(""),
  /**
   * 离开过渡的结束状态
   * 类型: string
   * 默认值: ''
   */
  leaveToClass: makeStringProp(""),
  /**
   * 是否阻止触摸滚动
   * 类型: boolean
   * 默认值: false
   */
  disableTouchMove: makeBooleanProp(false)
};
({
  ...baseProps
});
const CONFIG_PROVIDER_KEY = Symbol("wd-config-provider");
const loadingProps = {
  ...baseProps,
  /**
   * 自定义加载指示器样式类
   * 类型: string
   */
  customSpinnerClass: makeStringProp(""),
  /**
   * 加载指示器类型
   * 类型: LoadingType
   * 可选值: 'circular' | 'spinner' | 'dots' | 'wave'
   * 默认值: 'circular'
   */
  type: makeStringProp("circular"),
  /**
   * 设置加载指示器颜色
   * 类型: string
   */
  color: String,
  /**
   * 设置加载指示器大小
   * 类型: string | number
   */
  size: numericProp,
  /**
   * 加载指示器方向
   * 类型: LoadingDirection
   * 可选值: 'horizontal' | 'vertical'
   * 默认值: 'vertical'
   */
  direction: makeStringProp("vertical"),
  /**
   * 加载指示器文字
   * 类型: string
   */
  text: String,
  /**
   * 是否继承父元素颜色
   * 类型: boolean
   * 默认值: false
   */
  inheritColor: Boolean
};
const badgeProps = {
  ...baseProps,
  /**
   * 徽标形状
   * 类型: BadgeShape
   * 可选值: 'circle' | 'square' | 'bubble'
   * 默认值: 'circle'
   */
  shape: makeStringProp("circle"),
  /**
   * 显示值
   * 类型: string | number
   * 默认值: undefined
   */
  value: numericProp,
  /**
   * 当数值为 0 时，是否展示徽标
   * 类型: boolean
   * 默认值: false
   */
  showZero: makeBooleanProp(false),
  /**
   * 背景颜色
   * 类型: string
   * 默认值: undefined
   */
  bgColor: String,
  /**
   * 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型
   * 类型: number
   * 默认值: undefined
   */
  max: Number,
  /**
   * 是否为红色点状标注
   * 类型: boolean
   * 默认值: false
   */
  isDot: Boolean,
  /**
   * 是否隐藏 badge
   * 类型: boolean
   * 默认值: false
   */
  hidden: Boolean,
  /**
   * 徽标类型
   * 类型: BadgeType
   * 可选值: 'primary' | 'success' | 'warning' | 'danger' | 'info'
   * 默认值: undefined
   */
  type: String,
  /**
   * 为正时，角标向下偏移对应的像素
   * 类型: string | number
   * 默认值: undefined
   */
  top: numericProp,
  /**
   * 为正时，角标向左偏移对应的像素
   * 类型: string | number
   * 默认值: undefined
   */
  right: numericProp,
  /**
   * 是否显示白色描边
   * 类型: boolean
   * 默认值: false
   */
  border: makeBooleanProp(false)
};
const stickyProps = {
  ...baseProps,
  /**
   * 层级
   */
  zIndex: makeNumberProp(1),
  /**
   * 吸顶距离
   */
  offsetTop: makeNumberProp(0)
};
const STICKY_BOX_KEY = Symbol("wd-sticky-box");
const datetimePickerViewProps = {
  ...baseProps,
  /**
   * 选中项，当 type 为 time 时，类型为字符串，否则为 时间戳
   * 类型: string | number
   * 必填
   */
  modelValue: makeRequiredProp([String, Number]),
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  itemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 6
   */
  visibleItemCount: makeNumberProp(6),
  /**
   * 选项对象中，value对应的 key
   * 类型: string
   * 默认值: 'value'
   */
  valueKey: makeStringProp("value"),
  /**
   * 选项对象中，展示的文本对应的 key
   * 类型: string
   * 默认值: 'label'
   */
  labelKey: makeStringProp("label"),
  /**
   * 选择器类型
   * 类型: string
   * 可选值: 'date' | 'year-month' | 'time' | 'datetime' | 'year'
   * 默认值: 'datetime'
   */
  type: makeStringProp("datetime"),
  /**
   * 自定义过滤选项的函数，返回列的选项数组
   * 类型: function
   */
  filter: Function,
  /**
   * 自定义弹出层选项文案的格式化函数，返回一个字符串
   * 类型: function
   */
  formatter: Function,
  /**
   * 自定义列的格式化函数
   * 类型: function
   */
  columnFormatter: Function,
  /**
   * 最小日期
   * 类型: number
   * 默认值: 十年前的1月1日
   */
  minDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1).getTime()),
  /**
   * 最大日期
   * 类型: number
   * 默认值: 十年后的12月31日
   */
  maxDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 11, 31).getTime()),
  /**
   * 最小小时，time类型时生效
   * 类型: number
   * 默认值: 0
   */
  minHour: makeNumberProp(0),
  /**
   * 最大小时，time类型时生效
   * 类型: number
   * 默认值: 23
   */
  maxHour: makeNumberProp(23),
  /**
   * 最小分钟，time类型时生效
   * 类型: number
   * 默认值: 0
   */
  minMinute: makeNumberProp(0),
  /**
   * 最大分钟，time类型时生效
   * 类型: number
   * 默认值: 59
   */
  maxMinute: makeNumberProp(59),
  /**
   * 是否显示秒选择，仅在 time 和 datetime 类型下生效
   * 类型: boolean
   * 默认值: false
   */
  useSecond: makeBooleanProp(false),
  /**
   * 最小秒数，仅在 time 和 datetime 类型下生效
   * 类型: number
   * 默认值: 0
   */
  minSecond: makeNumberProp(0),
  /**
   * 最大秒数，仅在 time 和 datetime 类型下生效
   * 类型: number
   * 默认值: 59
   */
  maxSecond: makeNumberProp(59),
  /**
   * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 范围选择时，开始时间的最小值，用于处理开始时间和结束时间的联动
   * 类型: number
   */
  boundaryMinDate: Number,
  /**
   * 范围选择时，结束时间的最大值，用于处理开始时间和结束时间的联动
   * 类型: number
   */
  boundaryMaxDate: Number
};
const now$1 = /* @__PURE__ */ new Date();
const defaultMinDate$1 = new Date(now$1.getFullYear(), now$1.getMonth() - 6, now$1.getDate()).getTime();
const defaultMaxDate$1 = new Date(now$1.getFullYear(), now$1.getMonth() + 6, now$1.getDate(), 23, 59, 59).getTime();
const calendarViewProps = {
  ...baseProps,
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | number[] | null
   * 默认值: null
   */
  modelValue: makeRequiredProp([Number, Array, null]),
  /**
   * 日期类型
   * 类型: CalendarType
   * 可选值: 'date' | 'dates' | 'datetime' | 'week' | 'month' | 'daterange' | 'datetimerange' | 'weekrange' | 'monthrange'
   * 默认值: 'date'
   */
  type: makeStringProp("date"),
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 - 6个月
   */
  minDate: makeNumberProp(defaultMinDate$1),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 + 6个月
   */
  maxDate: makeNumberProp(defaultMaxDate$1),
  /**
   * 周起始天
   * 类型: number
   * 默认值: 0
   */
  firstDayOfWeek: makeNumberProp(0),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 是否展示面板标题，自动计算当前滚动的日期月份
   * 类型: boolean
   * 默认值: true
   */
  showPanelTitle: makeBooleanProp(true),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: string | string[]
   * 默认值: '00:00:00'
   */
  defaultTime: {
    type: [String, Array],
    default: "00:00:00"
  },
  /**
   * 可滚动面板的高度
   * 类型: number
   * 默认值: 316
   */
  panelHeight: makeNumberProp(316),
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，用于过滤时间选择器的数据
   * 类型: CalendarTimeFilter
   */
  timeFilter: Function,
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  timeItemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 3
   */
  timeVisibleItemCount: makeNumberProp(3),
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，是否不展示秒修改
   * 类型: boolean
   * 默认值: false
   */
  hideSecond: makeBooleanProp(false),
  /**
   * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 切换模式
   * 类型: 'none' | 'month' | 'year-month'
   * 可选值: none 平铺展示所有月份/年份，不展示切换按钮 | month 支持按月切换，展示上个月/下个月按钮 | year-month 支持按年切换，也支持按月切换，展示上一年/下一年，上个月/下个月按钮
   * 默认值: 'none'
   */
  switchMode: makeStringProp("none")
};
const actionSheetProps = {
  ...baseProps,
  /**
   * title 头部样式类
   * 类型: string
   * 默认值: ''
   */
  customTitleClass: makeStringProp(""),
  /**
   * 设置菜单显示隐藏
   * 类型: boolean
   * 默认值: false
   */
  modelValue: makeBooleanProp(false),
  /**
   * 菜单选项
   * 类型: Action[]
   * 默认值: []
   */
  actions: makeArrayProp(),
  /**
   * 自定义宫格面板项。
   * - 可传入单行数组: `Panel[]`（会渲染为一行宫格）
   * - 可传入二维数组: `Panel[][]`（会按行渲染多行宫格）
   * 类型: Array<Panel | Panel[]>
   * 默认值: []
   */
  panels: makeArrayProp(),
  /**
   * 标题
   * 类型: string
   * 默认值: ''
   */
  title: String,
  /**
   * 取消按钮文案
   * 类型: string
   * 默认值: ''
   */
  cancelText: String,
  /**
   * 点击选项后是否关闭菜单
   * 类型: boolean
   * 默认值: true
   */
  closeOnClickAction: makeBooleanProp(true),
  /**
   * 点击遮罩是否关闭
   * 类型: boolean
   * 默认值: true
   */
  closeOnClickModal: makeBooleanProp(true),
  /**
   * 弹框动画持续时间
   * 类型: number
   * 默认值: 200
   */
  duration: makeNumberProp(200),
  /**
   * 菜单层级
   * 类型: number
   * 默认值: 10
   */
  zIndex: makeNumberProp(10),
  /**
   * 弹层内容懒渲染，触发展示时才渲染内容
   * 类型: boolean
   * 默认值: true
   */
  lazyRender: makeBooleanProp(true),
  /**
   * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
   * 类型: boolean
   * 默认值: true
   */
  safeAreaInsetBottom: makeBooleanProp(true),
  /**
   * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
   * 类型: boolean
   * 默认值: false
   */
  rootPortal: makeBooleanProp(false)
};
const pickerViewProps = {
  ...baseProps,
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  itemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 6
   */
  visibleItemCount: makeNumberProp(6),
  /**
   * 选项对象中，value对应的 key
   * 类型: string
   * 默认值: 'value'
   */
  valueKey: makeStringProp("value"),
  /**
   * 选项对象中，展示的文本对应的 key
   * 类型: string
   * 默认值: 'label'
   */
  labelKey: makeStringProp("label"),
  /**
   * 是否在手指松开时立即触发 picker-view 的 change 事件。若不开启则会在滚动动画结束后触发 change 事件
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 是否开启级联模式
   * 类型: boolean
   * 默认值: false
   */
  cascade: makeBooleanProp(false),
  /**
   * 选项对象中，children 对应的 key
   * 类型: string
   * 默认值: 'children'
   */
  childrenKey: makeStringProp("children"),
  /**
   * 选中项
   * 类型: (string | number)[]
   * 默认值: []
   */
  modelValue: makeArrayProp(),
  /**
   * 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器
   * 类型: Array<string | number | PickerOption | Array<string | number | PickerOption>>
   * 默认值: []
   */
  columns: makeArrayProp()
};
function formatArray(array, valueKey, labelKey) {
  let tempArray = isArray(array) ? array : [array];
  const firstLevelTypeList = new Set(array.map(getType));
  if (firstLevelTypeList.size !== 1 && firstLevelTypeList.has("object")) {
    throw Error("The columns are correct");
  }
  if (!isArray(array[0])) {
    tempArray = [tempArray];
  }
  const result = tempArray.map((col) => {
    return col.map((row) => {
      if (!isObj(row)) {
        return {
          [valueKey]: row,
          [labelKey]: row
        };
      }
      if (!row.hasOwnProperty(valueKey) && !row.hasOwnProperty(labelKey)) {
        throw Error("Can't find valueKey and labelKey in columns");
      }
      if (!row.hasOwnProperty(labelKey)) {
        row[labelKey] = row[valueKey];
      }
      if (!row.hasOwnProperty(valueKey)) {
        row[valueKey] = row[labelKey];
      }
      return row;
    });
  });
  return result;
}
function useSelection(valueKey, labelKey, childrenKey = "children", cascade = false) {
  const formatColumns = ref([]);
  const selectedIndex = ref([]);
  const selectedOptions = computed(() => {
    return selectedIndex.value.map((row, col) => formatColumns.value[col][row]);
  });
  const selectedValues = computed(() => {
    const values = selectedIndex.value.map((row, col) => {
      return formatColumns.value[col][row][valueKey];
    });
    return values;
  });
  const selectedLabels = computed(() => {
    return selectedIndex.value.map((row, col) => String(formatColumns.value[col][row][labelKey] ?? ""));
  });
  function selectWithValue(value) {
    if (formatColumns.value.length === 0) {
      selectedIndex.value = [];
      return;
    }
    let normalizedValue;
    if (!isDef(value) || isArray(value) && value.length === 0) {
      normalizedValue = formatColumns.value.map((col) => {
        return col[0][valueKey];
      });
    } else {
      normalizedValue = isArray(value) ? value : [value];
    }
    const slicedValue = normalizedValue.slice(0, formatColumns.value.length);
    let selected = [...selectedIndex.value];
    slicedValue.forEach((target, col) => {
      let row = formatColumns.value[col].findIndex((row2) => {
        var _a;
        return ((_a = row2[valueKey]) == null ? void 0 : _a.toString()) === target.toString();
      });
      row = row === -1 ? 0 : row;
      selected = correctSelectedIndex(col, row, selected);
    });
    selectedIndex.value = selected.slice(0, slicedValue.length);
  }
  function correctSelected(value) {
    let selected = [...value];
    value.forEach((row, col) => {
      row = range(row, 0, formatColumns.value[col].length - 1);
      selected = correctSelectedIndex(col, row, selected);
    });
    return selected;
  }
  function correctSelectedIndex(columnIndex, rowIndex, selected) {
    const col = formatColumns.value[columnIndex];
    if (!col || !col[rowIndex]) {
      console.error(`[wd-picker-view] The value to select with Col:${columnIndex} Row:${rowIndex} is incorrect`);
      return selected;
    }
    const select = [...selected];
    select[columnIndex] = rowIndex;
    if (col[rowIndex].disabled) {
      const prev = col.slice(0, rowIndex).reverse().findIndex((s2) => !s2.disabled);
      const next = col.slice(rowIndex + 1).findIndex((s2) => !s2.disabled);
      if (prev !== -1) {
        select[columnIndex] = rowIndex - 1 - prev;
      } else if (next !== -1) {
        select[columnIndex] = rowIndex + 1 + next;
      } else {
        console.warn(`[wd-picker-view] All options in column ${columnIndex} are disabled, selecting disabled item at index ${rowIndex}`);
        select[columnIndex] = rowIndex;
      }
    }
    return select;
  }
  function getChangeColumnIndex(now2, origin) {
    if (!now2 || !origin)
      return -1;
    const index2 = now2.findIndex((row, index22) => row !== origin[index22]);
    return index2;
  }
  function getColumnIndex(columnIndex) {
    return selectedIndex.value[columnIndex];
  }
  function getColumnData(columnIndex) {
    return formatColumns.value[columnIndex];
  }
  function getColumnsData() {
    return deepClone(formatColumns.value);
  }
  function buildCascadeColumns(data, selectedValues2) {
    const result = [];
    let currentLevel = data;
    if (currentLevel.length > 0) {
      result.push(currentLevel);
    }
    for (let i = 0; i < selectedValues2.length; i++) {
      const value = selectedValues2[i];
      const selected = currentLevel.find((item) => {
        var _a;
        return ((_a = item[valueKey]) == null ? void 0 : _a.toString()) === value.toString();
      });
      if (selected && selected[childrenKey] && selected[childrenKey].length > 0) {
        currentLevel = selected[childrenKey];
        result.push(currentLevel);
      } else {
        break;
      }
    }
    return result;
  }
  function updateCascadeColumns(rootData, changedColumnIndex, currentSelectedIndex) {
    const newColumns = [rootData];
    let currentLevel = rootData;
    const newSelectedIndex = [];
    for (let i = 0; i <= changedColumnIndex && i < currentSelectedIndex.length; i++) {
      const selectedIndex2 = currentSelectedIndex[i];
      const selected = currentLevel[selectedIndex2];
      newSelectedIndex.push(selectedIndex2);
      if (selected && selected[childrenKey] && selected[childrenKey].length > 0) {
        currentLevel = selected[childrenKey];
        newColumns.push(currentLevel);
      } else {
        break;
      }
    }
    while (currentLevel.length > 0) {
      const firstEnabledIndex = currentLevel.findIndex((item) => !item.disabled);
      const nextIndex = firstEnabledIndex !== -1 ? firstEnabledIndex : 0;
      const selected = currentLevel[nextIndex];
      if (selected && selected[childrenKey] && selected[childrenKey].length > 0) {
        newSelectedIndex.push(nextIndex);
        currentLevel = selected[childrenKey];
        newColumns.push(currentLevel);
      } else {
        if (newColumns.length > newSelectedIndex.length) {
          newSelectedIndex.push(nextIndex);
        }
        break;
      }
    }
    formatColumns.value = newColumns;
    selectedIndex.value = newSelectedIndex;
  }
  function resetColumns(columns) {
    if (isArray(columns) && columns.length > 0) {
      if (cascade && isArray(columns) && columns.length > 0 && !isArray(columns[0])) {
        const firstItem = columns[0];
        if (isObj(firstItem) && childrenKey in firstItem) {
          const cascadeData = columns;
          formatColumns.value = [formatArray([cascadeData], valueKey, labelKey)[0]];
          return;
        }
      }
      formatColumns.value = formatArray(columns, valueKey, labelKey);
    } else {
      formatColumns.value = [];
      selectedIndex.value = [];
    }
  }
  return {
    formatColumns,
    selectedIndex,
    selectedOptions,
    selectedValues,
    selectedLabels,
    selectWithValue,
    correctSelected,
    correctSelectedIndex,
    getChangeColumnIndex,
    getColumnIndex,
    getColumnData,
    getColumnsData,
    resetColumns,
    buildCascadeColumns,
    updateCascadeColumns
  };
}
const resizeProps = {
  ...baseProps,
  /**
   * 自定义容器类名
   * 类型: string
   * 默认值: ''
   */
  customContainerClass: makeStringProp("")
};
const yearPanelProps = {
  /**
   * 日期类型
   * 类型: CalendarType
   */
  type: makeRequiredProp(String),
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | (number | null)[] | null
   */
  value: makeRequiredProp([Number, Array]),
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   */
  minDate: makeRequiredProp(Number),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   */
  maxDate: makeRequiredProp(Number),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 是否展示面板标题，自动计算当前滚动的日期月份
   * 类型: boolean
   * 默认值: true
   */
  showPanelTitle: makeBooleanProp(true),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: number[][]
   */
  defaultTime: {
    type: [Array]
  },
  /**
   * 可滚动面板的高度
   * 类型: number
   */
  panelHeight: makeRequiredProp(Number),
  /**
   * 切换模式
   * 类型: 'none' | 'month' | 'year-month'
   * 可选值: none 平铺展示所有月份/年份，不展示切换按钮 | month 支持按月切换，展示上个月/下个月按钮 | year-month 支持按年切换，也支持按月切换，展示上一年/下一年，上个月/下个月按钮
   * 默认值: 'none'
   */
  switchMode: makeStringProp("none")
};
const now = /* @__PURE__ */ new Date();
const defaultMinDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).getTime();
const defaultMaxDate = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate(), 23, 59, 59).getTime();
const monthPanelProps = {
  /**
   * 日期类型
   * 类型: CalendarType
   * 可选值: 'date' | 'dates' | 'datetime' | 'week' | 'month' | 'daterange' | 'datetimerange' | 'weekrange' | 'monthrange'
   * 默认值: 'date'
   */
  type: makeStringProp("date"),
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | (number | null)[] | null
   * 默认值: null
   */
  value: {
    type: [Number, Array, null],
    default: null
  },
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 - 6个月
   */
  minDate: makeNumberProp(defaultMinDate),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   * 默认值: 当前日期 + 6个月
   */
  maxDate: makeNumberProp(defaultMaxDate),
  /**
   * 周起始天
   * 类型: number
   * 默认值: 0
   */
  firstDayOfWeek: makeNumberProp(0),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 是否展示面板标题，自动计算当前滚动的日期月份
   * 类型: boolean
   * 默认值: false
   */
  showPanelTitle: makeBooleanProp(false),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: number[][]
   */
  defaultTime: {
    type: [Array]
  },
  /**
   * 可滚动面板的高度
   * 类型: number
   * 默认值: 378
   */
  panelHeight: makeNumberProp(378),
  /**
   * 选项高度
   * 类型: number
   * 默认值: 44
   */
  itemHeight: makeNumberProp(44),
  /**
   * 可见选项数量
   * 类型: number
   * 默认值: 6
   */
  visibleItemCount: makeNumberProp(6),
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，用于过滤时间选择器的数据
   * 类型: CalendarTimeFilter
   */
  timeFilter: Function,
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，用于格式化时间选择器的数据
   * 类型: CalendarTimeFormatter
   */
  timeFormatter: Function,
  /**
   * type 为 'datetime' 或 'datetimerange' 时有效，是否不展示秒修改
   * 类型: boolean
   * 默认值: false
   */
  hideSecond: makeBooleanProp(false),
  /**
   * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
   * 类型: boolean
   * 默认值: false
   */
  immediateChange: makeBooleanProp(false),
  /**
   * 切换模式
   * 类型: 'none' | 'month' | 'year-month'
   * 可选值: none 平铺展示所有月份/年份，不展示切换按钮 | month 支持按月切换，展示上个月/下个月按钮 | year-month 支持按年切换，也支持按月切换，展示上一年/下一年，上个月/下个月按钮
   * 默认值: 'none'
   */
  switchMode: makeStringProp("none")
};
const yearProps = {
  /**
   * 日期类型
   * 类型: CalendarType
   */
  type: makeRequiredProp(String),
  /**
   * 日期时间戳
   * 类型: number
   */
  date: makeRequiredProp(Number),
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | (number | null)[] | null
   */
  value: makeRequiredProp([Number, Array]),
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   */
  minDate: makeRequiredProp(Number),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   */
  maxDate: makeRequiredProp(Number),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: number[][]
   */
  defaultTime: {
    type: [Array]
  },
  /**
   * 是否展示标题
   * 类型: boolean
   * 默认值: true
   */
  showTitle: makeBooleanProp(true)
};
const monthProps = {
  /**
   * 日期类型
   * 类型: CalendarType
   */
  type: makeRequiredProp(String),
  /**
   * 日期时间戳
   * 类型: number
   */
  date: makeRequiredProp(Number),
  /**
   * 选中值，为 13 位时间戳或时间戳数组
   * 类型: number | (number | null)[] | null
   */
  value: makeRequiredProp([Number, Array, null]),
  /**
   * 最小日期，为 13 位时间戳
   * 类型: number
   */
  minDate: makeRequiredProp(Number),
  /**
   * 最大日期，为 13 位时间戳
   * 类型: number
   */
  maxDate: makeRequiredProp(Number),
  /**
   * 周起始天
   * 类型: number
   */
  firstDayOfWeek: makeRequiredProp(Number),
  /**
   * 日期格式化函数
   * 类型: CalendarFormatter
   */
  formatter: Function,
  /**
   * type 为范围选择时有效，最大日期范围
   * 类型: number
   */
  maxRange: Number,
  /**
   * type 为范围选择时有效，选择超出最大日期范围时的错误提示文案
   * 类型: string
   */
  rangePrompt: String,
  /**
   * type 为范围选择时有效，是否允许选择同一天
   * 类型: boolean
   * 默认值: false
   */
  allowSameDay: makeBooleanProp(false),
  /**
   * 选中日期所使用的当日内具体时刻
   * 类型: number[][]
   */
  defaultTime: {
    type: [Array]
  },
  /**
   * 是否展示标题
   * 类型: boolean
   * 默认值: true
   */
  showTitle: makeBooleanProp(true)
};
exports.AbortablePromise = AbortablePromise;
exports.CELL_GROUP_KEY = CELL_GROUP_KEY;
exports.CHECKBOX_GROUP_KEY = CHECKBOX_GROUP_KEY;
exports.CONFIG_PROVIDER_KEY = CONFIG_PROVIDER_KEY;
exports.DIALOG_BUILTIN_ICON_MAP = DIALOG_BUILTIN_ICON_MAP;
exports.FORM_ITEM_VALIDATE_KEY = FORM_ITEM_VALIDATE_KEY;
exports.FORM_KEY = FORM_KEY;
exports.FORM_VALIDATE_EVENTS = FORM_VALIDATE_EVENTS;
exports.GRID_KEY = GRID_KEY;
exports.OPEN_TYPE_EVENT_KEYS = OPEN_TYPE_EVENT_KEYS;
exports.RADIO_GROUP_KEY = RADIO_GROUP_KEY;
exports.STEPS_KEY = STEPS_KEY;
exports.STICKY_BOX_KEY = STICKY_BOX_KEY;
exports.TABBAR_KEY = TABBAR_KEY;
exports.TABS_KEY = TABS_KEY;
exports.USE_CONFIG_PROVIDER_KEY = USE_CONFIG_PROVIDER_KEY;
exports._export_sfc = _export_sfc;
exports.actionSheetProps = actionSheetProps;
exports.addUnit = addUnit;
exports.badgeProps = badgeProps;
exports.baseProps = baseProps;
exports.buttonProps = buttonProps;
exports.calendarProps = calendarProps;
exports.calendarViewProps = calendarViewProps;
exports.callInterceptor = callInterceptor;
exports.cardProps = cardProps;
exports.cellGroupProps = cellGroupProps;
exports.cellProps = cellProps;
exports.checkNumRange = checkNumRange;
exports.checkboxProps = checkboxProps;
exports.compareDate = compareDate;
exports.compareMonth = compareMonth;
exports.compareYear = compareYear;
exports.computed = computed;
exports.context = context;
exports.createPersistedState = createPersistedState;
exports.createPinia = createPinia;
exports.createSSRApp = createSSRApp;
exports.datetimePickerProps = datetimePickerProps;
exports.datetimePickerViewProps = datetimePickerViewProps;
exports.debounce = debounce;
exports.deepAssign = deepAssign;
exports.deepClone = deepClone;
exports.defaultOptions = defaultOptions$2;
exports.defaultOptions$1 = defaultOptions$1;
exports.defineComponent = defineComponent;
exports.dialogProps = dialogProps;
exports.e = e;
exports.emptyProps = emptyProps;
exports.f = f;
exports.formItemProps = formItemProps;
exports.formProps = formProps;
exports.formatDate = formatDate;
exports.formatMonthTitle = formatMonthTitle;
exports.formatYearTitle = formatYearTitle;
exports.getCurrentInstance = getCurrentInstance;
exports.getDateByDefaultTime = getDateByDefaultTime;
exports.getDayByOffset = getDayByOffset;
exports.getDayOffset = getDayOffset;
exports.getDefaultTime = getDefaultTime;
exports.getDialogDefaultOptionKey = getDialogDefaultOptionKey;
exports.getItemClass = getItemClass;
exports.getMonthByOffset = getMonthByOffset;
exports.getMonthEndDay = getMonthEndDay;
exports.getMonthOffset = getMonthOffset;
exports.getMonths = getMonths;
exports.getNextDay = getNextDay;
exports.getPickerValue = getPickerValue;
exports.getPrevDay = getPrevDay;
exports.getPropByPath = getPropByPath;
exports.getRect = getRect;
exports.getSystemInfo = getSystemInfo;
exports.getToastOptionKey = getToastOptionKey;
exports.getWeekLabel = getWeekLabel;
exports.getWeekNumber = getWeekNumber;
exports.getWeekRange = getWeekRange;
exports.getYears = getYears;
exports.gridItemProps = gridItemProps;
exports.gridProps = gridProps;
exports.iconProps = iconProps;
exports.index = index;
exports.inject = inject;
exports.inputProps = inputProps;
exports.isArray = isArray;
exports.isDef = isDef;
exports.isEqual = isEqual;
exports.isFunction = isFunction;
exports.isImageUrl = isImageUrl;
exports.isNumber = isNumber;
exports.isObj = isObj;
exports.isPromise = isPromise;
exports.isRange = isRange;
exports.isRef = isRef;
exports.isString = isString;
exports.isUndefined = isUndefined;
exports.isVideoUrl = isVideoUrl;
exports.loadingProps = loadingProps;
exports.monthPanelProps = monthPanelProps;
exports.monthProps = monthProps;
exports.n = n;
exports.nextTick$1 = nextTick$1;
exports.normalizeClass = normalizeClass;
exports.o = o;
exports.objToStyle = objToStyle;
exports.omitBy = omitBy;
exports.onBeforeMount = onBeforeMount;
exports.onBeforeUnmount = onBeforeUnmount;
exports.onHide = onHide;
exports.onLaunch = onLaunch;
exports.onLoad = onLoad;
exports.onMounted = onMounted;
exports.onShow = onShow;
exports.overlayProps = overlayProps;
exports.p = p;
exports.padZero = padZero;
exports.pause = pause;
exports.pickerProps = pickerProps;
exports.pickerViewProps = pickerViewProps;
exports.popupProps = popupProps;
exports.r = r;
exports.radioGroupProps = radioGroupProps;
exports.radioProps = radioProps;
exports.range = range;
exports.reactive = reactive;
exports.ref = ref;
exports.resizeProps = resizeProps;
exports.resolveComponent = resolveComponent;
exports.s = s;
exports.shallowRef = shallowRef;
exports.skeletonProps = skeletonProps;
exports.sr = sr;
exports.stepProps = stepProps;
exports.stepsProps = stepsProps;
exports.stickyProps = stickyProps;
exports.t = t;
exports.tabProps = tabProps;
exports.tabbarItemProps = tabbarItemProps;
exports.tabbarProps = tabbarProps;
exports.tabsProps = tabsProps;
exports.tagProps = tagProps;
exports.textareaProps = textareaProps;
exports.toastIcon = toastIcon;
exports.toastProps = toastProps;
exports.transitionProps = transitionProps;
exports.unref = unref;
exports.uploadProps = uploadProps;
exports.useCell = useCell;
exports.useChildren = useChildren;
exports.useDialog = useDialog;
exports.useParent = useParent;
exports.useQueue = useQueue;
exports.useSelection = useSelection;
exports.useSlots = useSlots;
exports.useToast = useToast;
exports.useTouch = useTouch;
exports.useTranslate = useTranslate;
exports.useUpload = useUpload;
exports.useVideoPreview = useVideoPreview;
exports.uuid = uuid;
exports.w = w;
exports.watch = watch;
exports.wx$1 = wx$1;
exports.yearPanelProps = yearPanelProps;
exports.yearProps = yearProps;
