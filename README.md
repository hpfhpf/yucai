## 开发环境
- node>=18
- pnpm>=7.30
- TypeScript<=5.5.4
https://github.com/HuangXinMingRuss/uniapp-WXMiniProgram-develop-template

<!-- 建议使用pnpm管理依赖包 -->
## 快速开始
执行 `pnpm i` 安装依赖

执行 `pnpm run dev` 或 `pnpm run dev:mp-weixin` 运行 `微信小程序`

## 打包运行（支持热更新）
- weixin平台：`pnpm run dev` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。

##  代码发布
- weixin平台：`pnpm build:mp-weixin`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。

## 样式
- 自定义样式/主题颜色 `src/style/theme.scss`
- 混合样式 `src/style/mixin.scss`

## 组件使用
1. 暂无组件
```
import Empty from '@/components/Empty/index.vue'
<Empty tip="暂无收藏">
        <template #image>
            <AppIcon name="user/user" size="48px" />
        </template>
    </Empty>
```
1. SVG组件
```
<AppIcon class="avatar-img" name="user/doctor" size="100px" />
```

 
 


