import { createSSRApp } from "vue";
import App from "./App.vue";
// pinia
import store from '@/store/index'
// 路由拦截
import { routeInterceptor } from "@/utils/route"

// Font Awesome 图标库（仅 H5 通过 CSS 引入；小程序 WXSS 不支持该 CSS 的 :is()/@supports 等语法）
// #ifdef H5
import '@fortawesome/fontawesome-free/css/all.min.css'
// #endif
// 小程序端使用子集化内联字体（由 scripts/generate-icons.mjs 生成），语法兼容 WXSS
// #ifndef H5
import '@/style/iconfont.scss'
// #endif
// 全局样式
import '@/style/index.scss'
// 修改wot-ui样式
import '@/style/wot-ui.scss'

export function createApp() {
  const app = createSSRApp(App);
  app.use(store)
  app.use(routeInterceptor)
  return {
    app,
  };
}
