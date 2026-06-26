"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_route = require("../../../utils/route.js");
const __unplugin_components_3 = () => "../../../node-modules/@wot-ui/ui/components/wd-steps/wd-steps.js";
const __unplugin_components_2 = () => "../../../node-modules/@wot-ui/ui/components/wd-step/wd-step.js";
const __unplugin_components_1 = () => "../../../node-modules/@wot-ui/ui/components/wd-tag/wd-tag.js";
const __unplugin_components_0 = () => "../../../components/HeaderNav.js";
if (!Array) {
  const _component_HeaderNav = __unplugin_components_0;
  const _component_wd_tag = __unplugin_components_1;
  const _component_wd_step = __unplugin_components_2;
  const _component_wd_steps = __unplugin_components_3;
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_HeaderNav + _component_wd_tag + _component_wd_step + _component_wd_steps + _component_global_ku_root)();
}
if (!Math) {
  BottomNav();
}
const BottomNav = () => "../../../components/BottomNav.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const user = common_vendor.ref({
      name: "张文凯",
      role: "职场人士",
      phone: "18080814854",
      summary: "忠实诚信,讲原则，说到做到，决不推卸责任；有自制力，做事情始终坚持有始有终终，从不半途而废；肯学习,有问题不…"
    });
    const education = common_vendor.ref([
      { id: "e1", school: "中国科技大学", range: "2007年9月~2009年7月" }
    ]);
    const activeStep = common_vendor.ref(1);
    const workSteps = common_vendor.ref([
      {
        id: "w1",
        company: "北京网聘咨询有限公司",
        title: "高级软件工程师",
        range: "2010.10 - 至今",
        city: "北京",
        salary: "30k-45k",
        tags: ["Vue", "uni-app", "性能优化"],
        status: "process"
      },
      {
        id: "w2",
        company: "某科技公司",
        title: "前端工程师",
        range: "2008.06 - 2010.09",
        city: "上海",
        salary: "15k-25k",
        tags: ["React", "工程化"],
        status: "finished"
      }
    ]);
    const projectStep = common_vendor.ref(1);
    const projectSteps = common_vendor.ref([
      {
        id: "p1",
        company: "C端APP优化",
        title: "高级软件工程师",
        range: "2010.10 - 至今",
        city: "北京",
        salary: "30k-45k",
        tags: ["Vue", "uni-app", "性能优化"],
        status: "process"
      },
      {
        id: "p2",
        company: "B端APP优化",
        title: "前端工程师",
        range: "2008.06 - 2010.09",
        city: "上海",
        salary: "15k-25k",
        tags: ["React", "工程化"],
        status: "finished"
      }
    ]);
    const handleEdit = (key) => {
      const map = { name: "编辑姓名", summary: "编辑自我描述" };
      common_vendor.index.showToast({ title: map[key], icon: "none" });
      if (key == "name") {
        utils_route.goPageAddInformation();
      } else if (key == "summary") {
        utils_route.goPageAddSelfDesc();
      }
    };
    const handleAdd = (key) => {
      const map = { education: "添加教育经历", work: "添加工作经历", project: "添加项目经历" };
      common_vendor.index.showToast({ title: map[key], icon: "none" });
      if (key == "project") {
        utils_route.goPageAddProject();
      } else if (key == "work") {
        utils_route.goPageAddJob();
      } else if (key == "education") {
        utils_route.goPageAddEducation();
      }
    };
    const handleRowTap = (kind, id) => {
      common_vendor.index.showToast({ title: `${kind}:${id}`, icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "个人中心",
          type: "show-back",
          theme: "000"
        }),
        b: common_vendor.t(user.value.name),
        c: common_vendor.o(($event) => handleEdit("name"), "2d"),
        d: common_vendor.t(user.value.role),
        e: common_vendor.t(user.value.phone),
        f: common_vendor.o(($event) => handleEdit("summary"), "ff"),
        g: common_vendor.t(user.value.summary),
        h: common_vendor.o(($event) => handleAdd("education"), "80"),
        i: common_vendor.t(education.value[0].school),
        j: common_vendor.t(education.value[0].range),
        k: common_vendor.o(($event) => handleRowTap("education", education.value[0].id), "6e"),
        l: common_vendor.o(($event) => handleAdd("work"), "6c"),
        m: common_vendor.f(workSteps.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.company),
            b: common_vendor.t(item.range),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.city),
            e: common_vendor.t(item.salary),
            f: common_vendor.f(item.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag,
                c: "7c5eae31-4-" + i0 + "-" + i1 + "," + ("7c5eae31-3-" + i0)
              };
            }),
            g: item.id,
            h: "7c5eae31-3-" + i0 + ",7c5eae31-2",
            i: common_vendor.p({
              status: item.status
            })
          };
        }),
        n: common_vendor.p({
          variant: "light"
        }),
        o: common_vendor.p({
          active: activeStep.value,
          vertical: true,
          dot: true
        }),
        p: common_vendor.o(($event) => handleAdd("project"), "56"),
        q: common_vendor.f(projectSteps.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.company),
            b: common_vendor.t(item.range),
            c: common_vendor.t(item.title),
            d: common_vendor.f(item.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag,
                c: "7c5eae31-7-" + i0 + "-" + i1 + "," + ("7c5eae31-6-" + i0)
              };
            }),
            e: item.id,
            f: "7c5eae31-6-" + i0 + ",7c5eae31-5",
            g: common_vendor.p({
              status: item.status
            })
          };
        }),
        r: common_vendor.p({
          variant: "light"
        }),
        s: common_vendor.p({
          active: projectStep.value,
          vertical: true,
          dot: true
        }),
        t: common_vendor.p({
          ["active-index"]: 2,
          ["theme-color"]: "#0f5bff"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7c5eae31"]]);
wx.createPage(MiniProgramPage);
