# 项目备忘

## 小程序开发注意事项

### 避免多开 dev 进程导致产物残缺

`pnpm run dev:mp-weixin` 是常驻的 watch 进程。**不要重复执行**，否则多个进程会同时向 `dist/dev/mp-weixin` 写文件，产生竞态，导致产物残缺（如缺少 `app.json`、页面的 `index.wxml`/`index.json`），表现为页面白屏（例如启动页 `pages/login/index` 打不开）。

排查与修复步骤：

1. 确认是否多开了 dev 进程：
   ```
   ps aux | grep "uni.js -p mp-weixin" | grep -v grep
   ```
   只应保留一个。多余的用 `pkill -f "uni.js -p mp-weixin --mode development"` 清理。

2. 删除损坏的产物目录：
   ```
   rm -rf dist/dev/mp-weixin
   ```

3. 单独重跑一次：
   ```
   pnpm run dev:mp-weixin
   ```

4. 在微信开发者工具中重新编译（或重新导入 `dist/dev/mp-weixin`）。

### Font Awesome CSS 不能引入小程序

`@fortawesome/fontawesome-free/css/all.min.css` 使用了 `:is()`、`@supports`、`content:var(--fa)/""`、`float:inline-start` 等小程序 WXSS 编译器不支持的语法。若无条件 import，会整份打进 `app.wxss` 导致 `[WXSS 文件编译错误] ./app.wxss` 及渲染层报错，页面打不开。

因此在 `src/main.ts` 中该 import 必须用条件编译限定为仅 H5：

```ts
// #ifdef H5
import '@fortawesome/fontawesome-free/css/all.min.css'
// #endif
```

代价：`FaIcon` 组件在小程序端不显示图标（H5 正常）。这是既有设计取舍。
