"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  wdToast();
}
const wdToast = () => "../wd-toast/wd-toast.js";
const __default__ = {
  name: "wd-form",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.formProps,
  setup(__props, { expose: __expose }) {
    const { show: showToast } = common_vendor.useToast("wd-form-toast");
    const props = __props;
    const { children, linkChildren } = common_vendor.useChildren(common_vendor.FORM_KEY);
    let errorMessages = common_vendor.reactive({});
    linkChildren({ props, errorMessages, validate });
    common_vendor.watch(
      () => props.model,
      () => {
        if (props.resetOnChange) {
          clearMessage();
        }
      },
      { immediate: true, deep: true }
    );
    async function validate(prop) {
      const propsToValidate = common_vendor.isArray(prop) ? prop : common_vendor.isDef(prop) ? [prop] : [];
      const rawIssues = props.schema ? await Promise.resolve(props.schema.validate(props.model)) : [];
      const errors = rawIssues.filter((issue) => issue.path && issue.path.length > 0 && issue.message).map((issue) => ({
        prop: issue.path.map((item) => String(item)).join("."),
        message: issue.message
      }));
      const filteredErrors = propsToValidate.length > 0 ? errors.filter(
        (error) => propsToValidate.some((target) => error.prop === target || error.prop.startsWith(`${target}.`) || target.startsWith(`${error.prop}.`))
      ) : errors;
      const valid = filteredErrors.length === 0;
      showMessage(filteredErrors);
      if (valid) {
        if (propsToValidate.length) {
          propsToValidate.forEach(clearMessage);
        } else {
          clearMessage();
        }
      }
      return {
        valid,
        errors: filteredErrors
      };
    }
    function showMessage(errors) {
      const childrenProps = children.map((e) => e.prop).filter(Boolean);
      const messages = errors.filter((error) => error.message && childrenProps.includes(error.prop));
      if (messages.length) {
        messages.sort((a, b) => {
          return childrenProps.indexOf(a.prop) - childrenProps.indexOf(b.prop);
        });
        if (props.errorType === "toast") {
          showToast(messages[0].message);
        } else if (props.errorType === "message") {
          messages.forEach((error) => {
            errorMessages[error.prop] = error.message;
          });
        }
      }
    }
    function clearMessage(prop) {
      if (prop) {
        errorMessages[prop] = "";
      } else {
        Object.keys(errorMessages).forEach((key) => {
          errorMessages[key] = "";
        });
      }
    }
    function reset() {
      clearMessage();
    }
    __expose({ validate, reset });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.errorType === "toast"
      }, props.errorType === "toast" ? {
        b: common_vendor.p({
          selector: "wd-form-toast"
        })
      } : {}, {
        c: common_vendor.n(`wd-form ${_ctx.customClass}`),
        d: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
