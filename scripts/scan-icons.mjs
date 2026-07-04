/**
 * 扫描 src/**\/*.vue，提取所有 <FaIcon> 用到的图标名。
 * 覆盖：静态 name、映射对象里的图标值、内置兜底白名单。
 * 导出 collectIconNames() 供生成脚本消费。
 */
import { readFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";

const SRC_DIR = new URL("../src/", import.meta.url).pathname;

// 动态兜底值 / 无法静态分析但确实用到的图标，手动补进白名单
const FALLBACK_NAMES = [
  "circle", // 各映射函数的 || 'circle' 兜底
  "house",
  "user-group",
  "circle-plus",
  "folder-open",
  "gauge-high",
  "users-gear",
  "building-shield",
  "scale-balanced",
  "gear",
  "heart",
  "paper-plane",
  "user-tie",
  "user-gear",
  "user-shield",
  "shield-halved",
];

/** 递归收集 .vue 文件路径 */
async function collectVueFiles(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await collectVueFiles(full)));
    else if (extname(e.name) === ".vue") out.push(full);
  }
  return out;
}

/** 从单个文件文本中抽取图标名候选 */
function extractFromText(text) {
  const names = new Set();

  // 1) FaIcon 静态 name="xxx" 或 :name="'xxx'"
  const nameRe = /<FaIcon\b[^>]*?\bname="([a-z][a-z0-9-]*)"/g;
  const nameBindRe = /<FaIcon\b[^>]*?:name="'([a-z][a-z0-9-]*)'"/g;
  for (const m of text.matchAll(nameRe)) names.add(m[1]);
  for (const m of text.matchAll(nameBindRe)) names.add(m[1]);

  // 2) 三元绑定 :name="cond ? 'a' : 'b'"
  const ternRe = /:name="[^"]*?\?\s*'([a-z][a-z0-9-]*)'\s*:\s*'([a-z][a-z0-9-]*)'/g;
  for (const m of text.matchAll(ternRe)) {
    names.add(m[1]);
    names.add(m[2]);
  }

  // 3) 映射对象里的图标字面量：key: 'icon-name'（限定在含 Icon 的对象上下文过宽，
  //    改为宽松收集所有形如 'xxx-yyy' 的短横线标识符，交由生成脚本按 FA 元数据过滤）
  const literalRe = /['"]([a-z][a-z0-9]*(?:-[a-z0-9]+)+)['"]/g;
  for (const m of text.matchAll(literalRe)) names.add(m[1]);

  return names;
}

/** 收集全部图标名（去重、排序） */
export async function collectIconNames() {
  const files = await collectVueFiles(SRC_DIR);
  const all = new Set(FALLBACK_NAMES);
  for (const f of files) {
    const text = await readFile(f, "utf8");
    for (const n of extractFromText(text)) all.add(n);
  }
  return [...all].sort();
}

// 直接运行时打印结果
if (import.meta.url === `file://${process.argv[1]}`) {
  const names = await collectIconNames();
  console.log(`扫描到候选图标名 ${names.length} 个：`);
  console.log(names.join(", "));
}
