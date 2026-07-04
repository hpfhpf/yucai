# 小程序图标展示方案

## 背景与现状

小程序端两套图标组件当前都不可用：

| 组件 | 方式 | 使用量 | 小程序端问题 |
|------|------|--------|-------------|
| `FaIcon` | font-awesome 字体类名 | 33 个文件 | FA 官方 CSS 用了 `:is()`/`@supports` 等 WXSS 不支持的语法（已被禁用为 H5-only） |
| `AppIcon` | SVG + `v-html` | 极少 | 小程序不支持 `v-html` |

已验证的关键事实：
- `node_modules/@fortawesome/fontawesome-free` 完整存在：woff2 字体 + `icon-families.json`（含每个图标 unicode）
- 代码用到的静态图标名 44/49 可直接在 FA 元数据命中 unicode
- 已验证 `subset-font` 可用：116KB 字体子集化 3 个图标后仅 **1.1KB**
- 只用到 solid + regular 两种字重，未用 brands

## 方案选型（已与你确认）

- **主方案**：复用已装的 font-awesome 资源，本地生成小程序兼容的 iconfont
- **体积**：subset-font 子集化裁剪，只保留项目实际用到的字形，base64 内联进 CSS
- **备选**：SVG 转 base64 背景图组件

### 各方案优缺点

| 方案 | 性能 | 兼容性 | 维护成本 |
|------|------|--------|---------|
| 子集化 iconfont（主） | 极佳，字体<10KB base64 内联，0 网络请求 | 全平台字体图标通用 | 加图标需跑一次生成脚本 |
| SVG base64 背景图（备选） | 好，单图标独立，无字体依赖 | 全平台 | 每个图标一份 SVG |
| image 标签图片 | 一般，换色需多份图 | 全平台 | 高 |

## 实现步骤

### 1. 图标名扫描脚本 `scripts/scan-icons.mjs`
自动扫描 `src/**/*.vue`，提取所有 `<FaIcon>` 用到的图标名：
- 静态 `name="xxx"` / `:name="'xxx'"`
- 映射对象里的图标值（`iconMap`、`quickIconMap`、`roleIcon` 等）
- 内置兜底白名单（覆盖动态兜底值 `circle` 及无法静态分析的名）
输出去重后的图标名清单，供生成脚本消费。

### 2. 字体生成脚本 `scripts/generate-icons.mjs`
- 读 `icon-families.json` 拿到每个图标名 → unicode 映射
- 用 `subset-font` 对 `fa-solid-900.woff2` 和 `fa-regular-400.woff2` 按用到的字形子集化
- 生成 `src/style/iconfont.scss`：
  - `@font-face` 内联 base64（solid + regular 两套 font-family）
  - 每个图标一个类 `.fa-<name>::before { content: "\fXXX" }`
  - `.fa-spin` 旋转动画、`.fa-fw` 固定宽度
- 处理别名与缺失：`scan-line` 等 FA 无对应的映射到近义图标（如 `expand`），记录到脚本的 alias 表
- 加 `pnpm run gen:icons` 脚本（package.json 已有该 script 名，指向本文件）

### 3. 改造 `FaIcon` 组件
- 模板不变（仍是 `<text class="fa-...">`），保证 33 处调用零改动
- 引入 `src/style/iconfont.scss` 替代原 FA 官方 CSS
- 保留 `name/type/size/color/spin/fixedWidth` 全部 props 语义

### 4. 改造 `main.ts`
- 保留 H5 条件编译引入官方 FA CSS（H5 图标更全）
- 小程序端改为引入生成的 `iconfont.scss`

### 5. 备选方案：改造 `AppIcon` 组件
- 去掉 `v-html`，改用 SVG → base64 `background-image`
- 复用现有 `src/icons/registry.ts` 的 SVG 加载与 currentColor 归一化逻辑
- 换色通过给 SVG 注入 fill 后再转 base64 实现

### 6. 类型与缺失图标
- 补充图标名类型定义
- `scan-line` → 映射到 FA 的 `expand` 或改用 SVG 备选组件

### 7. 文档 `docs/icons.md`
- 三种方案的使用方法、参数说明、最佳实践
- 新增图标的操作流程（改代码 → 跑 gen:icons）

### 8. 单元测试
- 安装 `vitest` + `@vue/test-utils`（前端当前未装）
- 测 FaIcon 的 class 计算、size 单位换算、AppIcon 的 base64 生成
- 加 `pnpm run test` 脚本

## 验证
- `pnpm run gen:icons` 生成字体，检查 iconfont.scss 体积
- `pnpm run build:mp-weixin` 构建，确认无 WXSS 报错、app.wxss 体积合理
- `pnpm run test` 跑通单测

## 新增依赖
- `subset-font`（已装，devDep）
- `vitest`、`@vue/test-utils`、`@vitejs/plugin-vue`（部分已装，devDep）
