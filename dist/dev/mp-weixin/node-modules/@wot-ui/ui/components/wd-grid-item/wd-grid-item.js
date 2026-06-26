"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (wdIcon + wdBadge)();
}
const wdIcon = () => "../wd-icon/wd-icon.js";
const wdBadge = () => "../wd-badge/wd-badge.js";
const __default__ = {
  name: "wd-grid-item",
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.gridItemProps,
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { parent: grid, index } = common_vendor.useParent(common_vendor.GRID_KEY);
    const gutter = common_vendor.computed(() => {
      var _a;
      return Number(((_a = grid.value) == null ? void 0 : _a.props.gutter) || 0);
    });
    const square = common_vendor.computed(() => {
      var _a;
      return Boolean((_a = grid.value) == null ? void 0 : _a.props.square);
    });
    const border = common_vendor.computed(() => {
      var _a;
      return Boolean((_a = grid.value) == null ? void 0 : _a.props.border);
    });
    const bgColor = common_vendor.computed(() => {
      var _a;
      return ((_a = grid.value) == null ? void 0 : _a.props.bgColor) || "";
    });
    const column = common_vendor.computed(() => {
      var _a;
      return ((_a = grid.value) == null ? void 0 : _a.props.column) || 0;
    });
    const childCount = common_vendor.computed(() => {
      var _a, _b;
      return ((_b = (_a = grid.value) == null ? void 0 : _a.children) == null ? void 0 : _b.length) || 0;
    });
    const iconSize = common_vendor.computed(() => {
      var _a;
      return (_a = grid.value) == null ? void 0 : _a.props.iconSize;
    });
    const borderClass = common_vendor.computed(() => {
      if (!border.value || gutter.value)
        return "";
      const classes = [];
      const col = column.value;
      const idx = index.value;
      const total = childCount.value;
      if (col) {
        const isRightItem = total - 1 === idx || (idx + 1) % col === 0;
        const isFirstLine = idx + 1 <= col;
        if (isFirstLine)
          classes.push("is-first");
        if (isRightItem)
          classes.push("is-right");
        if (!isFirstLine)
          classes.push("is-border");
      } else {
        classes.push("is-first");
      }
      if (total - 1 === idx)
        classes.push("is-last");
      return classes.join(" ");
    });
    const rootStyle = common_vendor.computed(() => {
      if (!grid)
        return props.customStyle || "";
      const columnNum = column.value || childCount.value;
      const percent = `${100 / columnNum}%`;
      const style = {
        flexBasis: percent,
        width: percent
      };
      if (square.value) {
        style.paddingTop = percent;
        style.paddingBottom = "0";
        if (gutter.value) {
          style.paddingRight = common_vendor.addUnit(gutter.value);
        }
      } else if (gutter.value) {
        const gutterValue = common_vendor.addUnit(gutter.value);
        style.paddingRight = gutterValue;
        if (index.value >= columnNum) {
          style.marginTop = gutterValue;
        }
      }
      if (props.customStyle) {
        return `${objToStyle(style)} ${props.customStyle}`;
      }
      return style;
    });
    const contentStyle = common_vendor.computed(() => {
      if (!grid)
        return "";
      const style = {};
      if (bgColor.value) {
        style.background = bgColor.value;
      }
      if (square.value && gutter.value) {
        const gutterValue = common_vendor.addUnit(gutter.value);
        style.right = gutterValue;
        style.bottom = gutterValue;
        style.height = "auto";
      }
      return style;
    });
    function objToStyle(obj) {
      return Object.entries(obj).map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${value};`;
      }).join("");
    }
    const rootClass = common_vendor.computed(() => {
      const classes = ["wd-grid-item"];
      if (borderClass.value) {
        classes.push(borderClass.value);
      }
      if (square.value) {
        classes.push("is-square");
      }
      if (props.customClass) {
        classes.push(props.customClass);
      }
      return classes.join(" ");
    });
    const contentClass = common_vendor.computed(() => {
      const classes = ["wd-grid-item__content"];
      if (square.value) {
        classes.push("is-square");
      }
      if (border.value && gutter.value > 0) {
        classes.push("is-around");
      }
      if (grid.value) {
        const { center, direction, reverse } = grid.value.props;
        if (center) {
          classes.push("is-center");
        }
        if (direction === "horizontal") {
          classes.push("is-horizontal");
        }
        if (reverse) {
          classes.push("is-reverse");
        }
      }
      return classes.join(" ");
    });
    const customBadgeProps = common_vendor.computed(() => {
      const badgeProps = common_vendor.deepAssign(
        common_vendor.isDef(props.badgeProps) ? common_vendor.omitBy(props.badgeProps, common_vendor.isUndefined) : {},
        common_vendor.omitBy(
          {
            max: props.max,
            isDot: props.isDot,
            value: props.value
          },
          common_vendor.isUndefined
        )
      );
      if (!common_vendor.isDef(badgeProps.max)) {
        badgeProps.max = 99;
      }
      return badgeProps;
    });
    const hoverClass = common_vendor.computed(() => {
      var _a;
      if ((_a = grid.value) == null ? void 0 : _a.props.clickable) {
        return grid.value.props.hoverClass ? grid.value.props.hoverClass : "wd-grid-item__content--hover";
      }
      return "";
    });
    function click() {
      if (grid.value && !grid.value.props.clickable)
        return;
      const { url, linkType } = props;
      emit("click");
      if (url) {
        switch (linkType) {
          case "navigateTo":
            common_vendor.index.navigateTo({ url });
            break;
          case "reLaunch":
            common_vendor.index.reLaunch({ url });
            break;
          case "redirectTo":
            common_vendor.index.redirectTo({ url });
            break;
          case "switchTab":
            common_vendor.index.switchTab({ url });
            break;
          default:
            console.error(`[wot-design] warning(wd-grid-item): linkType can not be ${linkType}`);
            break;
        }
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.icon || _ctx.$slots.icon
      }, _ctx.icon || _ctx.$slots.icon ? {
        b: common_vendor.p({
          name: _ctx.icon,
          size: iconSize.value,
          color: _ctx.iconColor,
          ["class-prefix"]: _ctx.iconPrefix,
          ["custom-class"]: `wd-grid-item__icon ${_ctx.customIcon}`
        }),
        c: common_vendor.p({
          ...customBadgeProps.value,
          ["custom-class"]: "wd-grid-item__badge"
        })
      } : {}, {
        d: _ctx.text
      }, _ctx.text ? {
        e: common_vendor.t(_ctx.text),
        f: common_vendor.n(`wd-grid-item__text ${_ctx.ellipsis ? "is-ellipsis" : ""} ${_ctx.customText}`)
      } : {}, {
        g: common_vendor.n(contentClass.value),
        h: common_vendor.s(contentStyle.value),
        i: hoverClass.value,
        j: common_vendor.n(rootClass.value),
        k: common_vendor.o(click, "6c"),
        l: common_vendor.s(rootStyle.value)
      });
    };
  }
});
wx.createComponent(_sfc_main);
