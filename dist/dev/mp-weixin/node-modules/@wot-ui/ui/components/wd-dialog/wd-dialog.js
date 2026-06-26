"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const __unplugin_components_0 = () => "../wd-icon/wd-icon.js";
if (!Array) {
  const _component_wd_icon = __unplugin_components_0;
  _component_wd_icon();
}
if (!Math) {
  (wdTextarea + wdInput + wdButton + wdPopup)();
}
const wdPopup = () => "../wd-popup/wd-popup.js";
const wdButton = () => "../wd-button/wd-button.js";
const wdInput = () => "../wd-input/wd-input.js";
const wdTextarea = () => "../wd-textarea/wd-textarea.js";
const __default__ = {
  name: "wd-dialog",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.dialogProps,
  setup(__props) {
    const props = __props;
    const { translate } = common_vendor.useTranslate("dialog");
    const iconType = common_vendor.ref("");
    const iconTypeClass = common_vendor.computed(() => {
      return iconType.value ? `is-${iconType.value}` : "";
    });
    const rootClass = common_vendor.computed(() => {
      return `wd-dialog__container ${props.customClass}`;
    });
    const bodyClass = common_vendor.computed(() => {
      return `wd-dialog__body  ${dialogState.type === "prompt" ? "is-prompt" : ""}`;
    });
    const messageOptionKey = common_vendor.getDialogDefaultOptionKey(props.selector);
    const messageOption = common_vendor.inject(messageOptionKey, common_vendor.ref(common_vendor.defaultOptions$1));
    const inputVal = common_vendor.ref("");
    const dialogState = common_vendor.reactive({
      msg: "",
      // 消息内容
      show: false,
      // 是否显示弹框
      title: "",
      // 标题
      closeOnClickModal: false,
      // 是否支持点击蒙层关闭
      type: "alert",
      // 弹框类型
      inputProps: {
        type: "text",
        modelValue: ""
      },
      // 输入框属性
      inputError: "",
      // 输入框错误提示文案
      showErr: false,
      // 是否显示错误提示
      zIndex: 99,
      // 弹窗层级
      lazyRender: true,
      // 弹层内容懒渲染
      headerImage: "",
      // 顶部图片
      showClose: false,
      // 是否显示关闭按钮
      actionLayout: "horizontal",
      // 按钮排列方式
      theme: "button"
      // 弹窗按钮风格
    });
    function getConfirmText() {
      const { confirmButtonProps } = dialogState;
      if (common_vendor.isString(confirmButtonProps)) {
        return confirmButtonProps;
      }
      if (common_vendor.isDef(confirmButtonProps) && common_vendor.isObj(confirmButtonProps) && confirmButtonProps.text) {
        return confirmButtonProps.text;
      }
      return translate("confirm");
    }
    function getCancelText() {
      const { cancelButtonProps } = dialogState;
      if (common_vendor.isString(cancelButtonProps)) {
        return cancelButtonProps;
      }
      if (common_vendor.isDef(cancelButtonProps) && common_vendor.isObj(cancelButtonProps) && cancelButtonProps.text) {
        return cancelButtonProps.text;
      }
      return translate("cancel");
    }
    const showCancelButton = common_vendor.computed(() => {
      return common_vendor.isDef(dialogState.cancelButtonProps);
    });
    const showConfirmButton = common_vendor.computed(() => {
      return common_vendor.isDef(dialogState.confirmButtonProps);
    });
    const inputPropsWithoutModelValue = common_vendor.computed(() => {
      if (!dialogState.inputProps)
        return {};
      const { modelValue, ...rest } = dialogState.inputProps;
      return rest;
    });
    const textareaPropsWithoutModelValue = common_vendor.computed(() => {
      if (!dialogState.textareaProps)
        return {};
      const { modelValue, ...rest } = dialogState.textareaProps;
      return rest;
    });
    const customActions = common_vendor.computed(() => {
      if (!dialogState.actions || !dialogState.actions.length)
        return [];
      return dialogState.actions.map((action) => {
        if (dialogState.theme === "text") {
          return { ...action, variant: "text" };
        }
        return action;
      });
    });
    function getActionButtonProps(btn) {
      const result = {};
      for (const key in btn) {
        if (!common_vendor.OPEN_TYPE_EVENT_KEYS.includes(key) && key !== "click" && key !== "text") {
          result[key] = btn[key];
        }
      }
      return result;
    }
    function handleOpenTypeEvent(btn, eventName, event) {
      const handler = btn[eventName];
      if (common_vendor.isFunction(handler)) {
        handler(event);
      }
    }
    function handleButtonOpenTypeEvent(type, eventName, event) {
      const buttonProps = type === "confirm" ? dialogState.confirmButtonProps : dialogState.cancelButtonProps;
      if (common_vendor.isDef(buttonProps) && common_vendor.isObj(buttonProps)) {
        const handler = buttonProps[eventName];
        if (common_vendor.isFunction(handler)) {
          handler(event);
        }
      }
    }
    const customConfirmProps = common_vendor.computed(() => {
      const defaultProps = {
        block: true
      };
      let buttonProps = { ...defaultProps };
      const { confirmButtonProps } = dialogState;
      if (common_vendor.isDef(confirmButtonProps) && common_vendor.isObj(confirmButtonProps)) {
        const { text, ...restProps } = confirmButtonProps;
        buttonProps = common_vendor.deepAssign(buttonProps, common_vendor.omitBy(restProps, common_vendor.isUndefined));
      }
      if (dialogState.theme === "text") {
        buttonProps.variant = "text";
      }
      buttonProps.customClass = `${buttonProps.customClass || ""} wd-dialog__actions-btn wd-dialog__actions-btn--confirm`;
      return buttonProps;
    });
    const customCancelProps = common_vendor.computed(() => {
      const defaultProps = {
        block: true,
        type: "info",
        variant: "plain"
      };
      let buttonProps = { ...defaultProps };
      const { cancelButtonProps } = dialogState;
      if (common_vendor.isDef(cancelButtonProps) && common_vendor.isObj(cancelButtonProps)) {
        const { text, ...restProps } = cancelButtonProps;
        buttonProps = common_vendor.deepAssign(buttonProps, common_vendor.omitBy(restProps, common_vendor.isUndefined));
      }
      if (dialogState.theme === "text") {
        buttonProps.variant = "text";
      }
      buttonProps.customClass = `${buttonProps.customClass || ""} wd-dialog__actions-btn`;
      return buttonProps;
    });
    common_vendor.watch(
      () => messageOption.value,
      (newVal) => {
        reset(newVal);
      },
      {
        deep: true,
        immediate: true
      }
    );
    common_vendor.watch(
      () => dialogState.show,
      (newValue) => {
        resetErr(!!newValue);
      },
      {
        deep: true,
        immediate: true
      }
    );
    function toggleModal(action) {
      if (action === "modal" && !dialogState.closeOnClickModal) {
        return;
      }
      if (dialogState.type === "prompt" && action === "confirm" && !validate()) {
        return;
      }
      switch (action) {
        case "confirm":
          if (dialogState.beforeConfirm) {
            common_vendor.callInterceptor(dialogState.beforeConfirm, {
              args: [inputVal.value],
              done: () => handleConfirm({
                action,
                value: inputVal.value
              })
            });
          } else {
            handleConfirm({
              action,
              value: inputVal.value
            });
          }
          break;
        case "cancel":
          handleCancel({
            action
          });
          break;
        default:
          handleCancel({
            action: "modal"
          });
          break;
      }
    }
    function handleAction(action, index) {
      if (action.disabled || action.loading)
        return;
      if (common_vendor.isFunction(action.click)) {
        action.click();
      }
      handleConfirm({
        action: "confirm",
        // 或者新增 'action' 类型？但 Types 里 action 是必须的且枚举。
        // 为了兼容，这里仍返回 confirm 或者是 context？
        // 稍微 hack 一下，actions 场景下通常用户自己在 click 里处理了业务，这里主要是利用 confirm 回调来关闭
        value: inputVal.value
      });
    }
    function handleConfirm(result) {
      dialogState.show = false;
      if (common_vendor.isFunction(dialogState.success)) {
        dialogState.success(result);
      }
    }
    function handleCancel(result) {
      dialogState.show = false;
      if (common_vendor.isFunction(dialogState.fail)) {
        dialogState.fail(result);
      }
    }
    function validate() {
      if (dialogState.inputPattern && !dialogState.inputPattern.test(String(inputVal.value))) {
        dialogState.showErr = true;
        return false;
      }
      if (common_vendor.isFunction(dialogState.inputValidate)) {
        const validateResult = dialogState.inputValidate(inputVal.value);
        if (!validateResult) {
          dialogState.showErr = true;
          return false;
        }
      }
      dialogState.showErr = false;
      return true;
    }
    function resetErr(val) {
      if (val === false) {
        dialogState.showErr = false;
      }
    }
    common_vendor.watch(
      () => inputVal.value,
      (val) => {
        if (val === "") {
          dialogState.showErr = false;
        }
      }
    );
    function reset(option) {
      var _a;
      if (option) {
        dialogState.title = common_vendor.isDef(option.title) ? option.title : "";
        dialogState.show = option.show;
        dialogState.closeOnClickModal = option.closeOnClickModal;
        dialogState.msg = option.msg;
        dialogState.type = option.type;
        dialogState.inputProps = option.inputProps;
        dialogState.textareaProps = option.textareaProps;
        if (common_vendor.isDef(option.inputValue)) {
          inputVal.value = option.inputValue;
        } else if (option.textareaProps && common_vendor.isDef(option.textareaProps.modelValue)) {
          inputVal.value = option.textareaProps.modelValue;
        } else if (option.inputProps && common_vendor.isDef(option.inputProps.modelValue)) {
          inputVal.value = option.inputProps.modelValue;
        } else {
          inputVal.value = "";
        }
        dialogState.inputPattern = option.inputPattern;
        dialogState.inputValidate = option.inputValidate;
        dialogState.success = option.success;
        dialogState.fail = option.fail;
        dialogState.beforeConfirm = option.beforeConfirm;
        dialogState.inputError = option.inputError;
        dialogState.showErr = option.showErr;
        dialogState.zIndex = option.zIndex;
        dialogState.lazyRender = option.lazyRender;
        dialogState.confirmButtonProps = option.confirmButtonProps;
        dialogState.cancelButtonProps = option.cancelButtonProps;
        dialogState.headerImage = option.headerImage;
        const iconName = ((_a = option.iconProps) == null ? void 0 : _a.name) || option.icon;
        if (iconName && iconName in common_vendor.DIALOG_BUILTIN_ICON_MAP) {
          const builtinIcon = common_vendor.DIALOG_BUILTIN_ICON_MAP[iconName];
          dialogState.iconProps = { ...option.iconProps, name: builtinIcon };
          iconType.value = iconName;
        } else {
          dialogState.iconProps = option.iconProps;
          iconType.value = "";
        }
        dialogState.showClose = option.showClose;
        dialogState.actionLayout = option.actionLayout;
        dialogState.theme = option.theme;
        dialogState.actions = option.actions;
      }
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: dialogState.showClose
      }, dialogState.showClose ? {
        b: common_vendor.o(($event) => toggleModal("modal"), "92"),
        c: common_vendor.p({
          ["custom-class"]: "wd-dialog__close",
          name: "close"
        })
      } : {}, {
        d: dialogState.headerImage
      }, dialogState.headerImage ? {
        e: dialogState.headerImage
      } : {}, {
        f: ((_a = dialogState.iconProps) == null ? void 0 : _a.name) || dialogState.title
      }, ((_b = dialogState.iconProps) == null ? void 0 : _b.name) || dialogState.title ? common_vendor.e({
        g: (_c = dialogState.iconProps) == null ? void 0 : _c.name
      }, ((_d = dialogState.iconProps) == null ? void 0 : _d.name) ? {
        h: common_vendor.p({
          ["custom-class"]: `wd-dialog__icon ${iconTypeClass.value}`,
          name: dialogState.iconProps.name,
          color: dialogState.iconProps.color,
          size: dialogState.iconProps.size
        })
      } : {}, {
        i: common_vendor.t(dialogState.title)
      }) : {}, {
        j: common_vendor.r("title", {
          icon: dialogState.icon,
          title: dialogState.title,
          iconProps: dialogState.iconProps
        }),
        k: dialogState.type === "prompt" || !!dialogState.msg || _ctx.$slots.default
      }, dialogState.type === "prompt" || !!dialogState.msg || _ctx.$slots.default ? common_vendor.e({
        l: dialogState.type === "prompt"
      }, dialogState.type === "prompt" ? common_vendor.e({
        m: dialogState.textareaProps
      }, dialogState.textareaProps ? {
        n: common_vendor.o(($event) => inputVal.value = $event, "a3"),
        o: common_vendor.p({
          ["custom-class"]: "wd-dialog__input",
          ...textareaPropsWithoutModelValue.value,
          modelValue: inputVal.value
        })
      } : {
        p: common_vendor.o(($event) => inputVal.value = $event, "75"),
        q: common_vendor.p({
          ["custom-class"]: "wd-dialog__input",
          ...inputPropsWithoutModelValue.value,
          modelValue: inputVal.value
        })
      }, {
        r: dialogState.showErr
      }, dialogState.showErr ? {
        s: common_vendor.t(dialogState.inputError || common_vendor.unref(translate)("inputNoValidate"))
      } : {}) : {
        t: common_vendor.t(dialogState.msg)
      }, {
        v: common_vendor.r("d", {
          msg: dialogState.msg,
          type: dialogState.type,
          inputValue: inputVal.value,
          showErr: dialogState.showErr,
          inputError: dialogState.inputError
        })
      }) : {}, {
        w: common_vendor.n(bodyClass.value),
        x: customActions.value && customActions.value.length
      }, customActions.value && customActions.value.length ? {
        y: common_vendor.f(customActions.value, (btn, index, i0) => {
          return {
            a: common_vendor.t(btn.text),
            b: index,
            c: common_vendor.o(($event) => handleAction(btn), index),
            d: common_vendor.o((e) => handleOpenTypeEvent(btn, "onGetuserinfo", e), index),
            e: common_vendor.o((e) => handleOpenTypeEvent(btn, "onContact", e), index),
            f: common_vendor.o((e) => handleOpenTypeEvent(btn, "onGetphonenumber", e), index),
            g: common_vendor.o((e) => handleOpenTypeEvent(btn, "onGetrealtimephonenumber", e), index),
            h: common_vendor.o((e) => handleOpenTypeEvent(btn, "onError", e), index),
            i: common_vendor.o((e) => handleOpenTypeEvent(btn, "onLaunchapp", e), index),
            j: common_vendor.o((e) => handleOpenTypeEvent(btn, "onOpensetting", e), index),
            k: common_vendor.o((e) => handleOpenTypeEvent(btn, "onChooseavatar", e), index),
            l: common_vendor.o((e) => handleOpenTypeEvent(btn, "onAgreeprivacyauthorization", e), index),
            m: "0677d598-5-" + i0 + ",0677d598-0",
            n: common_vendor.p({
              ...getActionButtonProps(btn),
              ["custom-class"]: "wd-dialog__actions-btn"
            })
          };
        })
      } : common_vendor.e({
        z: showCancelButton.value
      }, showCancelButton.value ? {
        A: common_vendor.t(getCancelText()),
        B: common_vendor.o(($event) => toggleModal("cancel"), "21"),
        C: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onGetuserinfo", e), "e4"),
        D: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onContact", e), "2c"),
        E: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onGetphonenumber", e), "6b"),
        F: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onGetrealtimephonenumber", e), "98"),
        G: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onError", e), "57"),
        H: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onLaunchapp", e), "45"),
        I: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onOpensetting", e), "e4"),
        J: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onChooseavatar", e), "e0"),
        K: common_vendor.o((e) => handleButtonOpenTypeEvent("cancel", "onAgreeprivacyauthorization", e), "82"),
        L: common_vendor.p({
          ...customCancelProps.value
        })
      } : {}, {
        M: showConfirmButton.value
      }, showConfirmButton.value ? {
        N: common_vendor.t(getConfirmText()),
        O: common_vendor.o(($event) => toggleModal("confirm"), "30"),
        P: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onGetuserinfo", e), "7f"),
        Q: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onContact", e), "31"),
        R: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onGetphonenumber", e), "88"),
        S: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onGetrealtimephonenumber", e), "f0"),
        T: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onError", e), "ed"),
        U: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onLaunchapp", e), "99"),
        V: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onOpensetting", e), "3c"),
        W: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onChooseavatar", e), "e2"),
        X: common_vendor.o((e) => handleButtonOpenTypeEvent("confirm", "onAgreeprivacyauthorization", e), "52"),
        Y: common_vendor.p({
          ...customConfirmProps.value
        })
      } : {}), {
        Z: common_vendor.n(`wd-dialog__actions ${dialogState.actionLayout === "vertical" ? "wd-dialog__actions--vertical" : ""} ${dialogState.actionLayout === "vertical" || showCancelButton.value || dialogState.actions && dialogState.actions.length > 1 ? "wd-dialog__flex" : "wd-dialog__block"} ${dialogState.theme === "text" ? "is-text" : ""}`),
        aa: common_vendor.r("actions", {
          confirm: () => toggleModal("confirm"),
          cancel: () => toggleModal("cancel"),
          close: () => toggleModal("modal")
        }),
        ab: common_vendor.n(rootClass.value),
        ac: common_vendor.o(($event) => toggleModal("modal"), "98"),
        ad: common_vendor.o(($event) => dialogState.show = $event, "ec"),
        ae: common_vendor.p({
          transition: "zoom-in",
          ["close-on-click-modal"]: dialogState.closeOnClickModal,
          ["lazy-render"]: dialogState.lazyRender,
          ["custom-class"]: "wd-dialog",
          ["z-index"]: dialogState.zIndex,
          duration: 200,
          ["root-portal"]: _ctx.rootPortal,
          modelValue: dialogState.show
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
