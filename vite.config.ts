import path from "node:path";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import uni from "@dcloudio/vite-plugin-uni";
// https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from "@uni-helper/vite-plugin-uni-pages";
// https://github.com/uni-ku/root 全局挂载组件
import UniKuRoot from "@uni-ku/root";
// 更新vite.config自动重载
import ViteRestart from "vite-plugin-restart";
// https://-design-uni.cn/ UI组件库
import Components from "@uni-helper/vite-plugin-uni-components";
import { WotResolver } from "./src/resolvers/wot-ui-resolver";
//
import AutoImport from "unplugin-auto-import/vite";

export default ({ command, mode }: ConfigEnv) => {
  // mode: 区分环境 development || production
  const { UNI_PLATFORM } = process.env;
  console.log("UNI_PLATFORM -> ", UNI_PLATFORM); // 得到 mp-weixin, h5, app 等
  // console.log("command, mode -> ", command, mode);
  const env = loadEnv(mode, process.cwd(), "");
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
    VITE_SERVER_TIMEOUT,
  } = env;

  const isVitest = process.env.VITEST === "true" || process.env.VITEST === "1";

  return defineConfig({
    plugins: isVitest
      ? [vue()]
      : [
          UniPages({
            dts: "src/types/uni-pages.d.ts",
            exclude: ["**/components/**/**.*"],
          }),
          Components({
            resolvers: [WotResolver()],
          }),
          UniKuRoot({
            rootFileName: "KuRoot",
          }),
          uni(),
          AutoImport({
            imports: ["vue", "uni-app"],
            dts: "src/types/auto-import.d.ts",
            dirs: ["src/hooks"],
            eslintrc: { enabled: true },
            vueTemplate: true,
          }),
          ViteRestart({
            restart: ["vite.config.js"],
          }),
        ],
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
      __VITE_SERVER_BASEURL__: JSON.stringify(VITE_SERVER_BASEURL),
      __VITE_SERVER_TIMEOUT__: JSON.stringify(VITE_SERVER_TIMEOUT),
    },
    resolve: {
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
      alias: {
        "@": path.join(process.cwd(), "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(VITE_APP_PORT, 10), // 服务端口
    },
  });
};
