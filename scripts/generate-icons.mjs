/**
 * 生成小程序兼容的 iconfont 样式。
 *
 * 流程：
 *   1. scan-icons 收集项目用到的图标名
 *   2. 读 FA icon-families.json 拿 name -> unicode / 可用字重
 *   3. subset-font 对 solid / regular woff2 按用到的字形子集化
 *   4. 输出 src/style/iconfont.scss（@font-face base64 内联 + .fa-<name> 类）
 *
 * 用法：pnpm run gen:icons
 */
import { readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";
import { collectIconNames } from "./scan-icons.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const FA = `${ROOT}node_modules/@fortawesome/fontawesome-free`;
const META_PATH = `${FA}/metadata/icon-families.json`;
const FONT_SOLID = `${FA}/webfonts/fa-solid-900.woff2`;
const FONT_REGULAR = `${FA}/webfonts/fa-regular-400.woff2`;
const OUT_SCSS = `${ROOT}src/style/iconfont.scss`;

// FA 中无对应名时的近义映射（项目名 -> FA 名）
const ALIAS = {
  "scan-line": "expand",
  "info-circle-filled": "circle-info",
  "warning-circle-filled": "circle-exclamation",
  "shield-check-filled": "shield-halved",
  "lock-on-filled": "lock",
  "star-filled": "star",
  viewed: "eye",
  success: "circle-check",
  edit: "pen",
  mail: "envelope",
  chat: "comment-dots",
  "file-paper": "file-lines",
};

/** 解析元数据：项目图标名 -> { unicode, styles:Set } */
async function resolveIcons(names, meta) {
  const solid = new Map(); // faName -> unicode
  const regular = new Map();
  const missing = [];

  for (const name of names) {
    const faName = ALIAS[name] || name;
    const entry = meta[faName];
    if (!entry || !entry.unicode) {
      missing.push(name);
      continue;
    }
    const styles = new Set(
      (entry.familyStylesByLicense?.free || []).map((s) => s.style),
    );
    // 该图标在项目里对外仍用原始 name 建类，unicode 取 FA 的
    if (styles.has("solid")) solid.set(name, { unicode: entry.unicode, faName });
    if (styles.has("regular"))
      regular.set(name, { unicode: entry.unicode, faName });
  }
  return { solid, regular, missing };
}

/** 把 unicode 十六进制串转成实际字符，用于 subset 保留字形 */
function unicodeToChar(hex) {
  return String.fromCodePoint(parseInt(hex, 16));
}

/** 对单个字重字体做子集化，返回 base64 */
async function subsetToBase64(fontPath, unicodeList) {
  const buf = await readFile(fontPath);
  const chars = unicodeList.map(unicodeToChar).join("");
  const out = await subsetFont(buf, chars, { targetFormat: "woff2" });
  return { base64: out.toString("base64"), size: out.length };
}

/** 生成 @font-face + 图标类的 scss 文本 */
function buildScss({ solidB64, regularB64, solid, regular }) {
  const faceBlock = (family, b64) =>
    `@font-face {\n` +
    `  font-family: "${family}";\n` +
    `  font-style: normal;\n` +
    `  font-weight: normal;\n` +
    `  font-display: block;\n` +
    `  src: url("data:font/woff2;base64,${b64}") format("woff2");\n` +
    `}`;

  const iconClass = (name, unicode) =>
    `.fa-${name}::before { content: "\\${unicode}"; }`;

  const solidClasses = [...solid.entries()]
    .map(([name, { unicode }]) => iconClass(name, unicode))
    .join("\n");
  // regular 用独立 family，通过 .fa-regular 切换
  const regularClasses = [...regular.entries()]
    .map(([name, { unicode }]) => `.fa-regular.fa-${name}::before { content: "\\${unicode}"; }`)
    .join("\n");

  return `/**
 * 本文件由 scripts/generate-icons.mjs 自动生成，请勿手改。
 * 重新生成：pnpm run gen:icons
 * 已内联子集化字体，小程序端可直接使用，无外部字体请求。
 */
${faceBlock("fa-mp-solid", solidB64)}
${faceBlock("fa-mp-regular", regularB64)}

.fa-solid,
[class*="fa-"] {
  font-family: "fa-mp-solid";
  font-style: normal;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}

.fa-regular {
  font-family: "fa-mp-regular";
}

.fa-fw {
  width: 1.25em;
  text-align: center;
}

.fa-spin {
  animation: fa-mp-spin 1s linear infinite;
}

@keyframes fa-mp-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* solid 字重图标 */
${solidClasses}

/* regular 字重图标（需配合 fa-regular 类） */
${regularClasses}
`;
}

async function main() {
  const names = await collectIconNames();
  const meta = JSON.parse(await readFile(META_PATH, "utf8"));
  const { solid, regular, missing } = await resolveIcons(names, meta);

  // 用各字重实际 faName 的 unicode 做子集
  const solidUnicodes = [...solid.values()].map((v) => v.unicode);
  const regularUnicodes = [...regular.values()].map((v) => v.unicode);

  const solidRes = await subsetToBase64(FONT_SOLID, solidUnicodes);
  const regularRes = await subsetToBase64(FONT_REGULAR, regularUnicodes);

  const scss = buildScss({
    solidB64: solidRes.base64,
    regularB64: regularRes.base64,
    solid,
    regular,
  });
  await writeFile(OUT_SCSS, scss, "utf8");

  console.log(`扫描图标名 ${names.length} 个`);
  console.log(`solid 命中 ${solid.size} 个，子集 ${(solidRes.size / 1024).toFixed(2)} KB`);
  console.log(`regular 命中 ${regular.size} 个，子集 ${(regularRes.size / 1024).toFixed(2)} KB`);
  if (missing.length) {
    console.log(`未命中（已忽略，非图标或需补 ALIAS）：${missing.join(", ")}`);
  }
  console.log(`已写入 ${OUT_SCSS}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { resolveIcons, ALIAS, buildScss };
