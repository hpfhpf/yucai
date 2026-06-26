import type { IconName } from "./names";

type RawSvgLoader = () => Promise<string>;

const svgLoaders = import.meta.glob("../assets/icons/**/*.svg", {
  as: "raw",
}) as Record<string, RawSvgLoader>;

const fullNameToPath = new Map<string, string>();
const shortNameToFullName = new Map<string, string | null>();

Object.keys(svgLoaders).forEach((path) => {
  const normalizedPath = path.replaceAll("\\", "/");
  const fullName = normalizedPath
    .replace("../assets/icons/", "")
    .replace(/\.svg$/i, "");

  fullNameToPath.set(fullName, path);

  const shortName = fullName.split("/").at(-1) || fullName;
  const existed = shortNameToFullName.get(shortName);
  if (existed === undefined) {
    shortNameToFullName.set(shortName, fullName);
  } else if (existed !== fullName) {
    shortNameToFullName.set(shortName, null);
  }
});

const rawCache = new Map<string, Promise<string>>();
const normalizedCache = new Map<string, Promise<string>>();

const coerceName = (name: IconName | string) => {
  if (fullNameToPath.has(name)) return name;
  const mapped = shortNameToFullName.get(name);
  if (mapped) return mapped;
  return null;
};

const normalizeSvg = (svg: string, enableCurrentColor: boolean) => {
  let out = svg.trim();
  if (!out) return "";

  out = out.replace(/<\?xml[\s\S]*?\?>/gi, "").trim();
  out = out.replace(/<!DOCTYPE[\s\S]*?>/gi, "").trim();
  out = out.replace(/<svg\b([^>]*)>/i, (full, attrs) => {
    const cleaned = attrs
      .replace(/\s(width|height)\s*=\s*(['"])[\s\S]*?\2/gi, "")
      .replace(/\s(class)\s*=\s*(['"])[\s\S]*?\2/gi, "")
      .replace(/\s(style)\s*=\s*(['"])[\s\S]*?\2/gi, "");
    return `<svg${cleaned} width="1em" height="1em" focusable="false" aria-hidden="true">`;
  });

  if (enableCurrentColor) {
    out = out
      .replace(
        /\sfill\s*=\s*(['"])(?!none\b)[\s\S]*?\1/gi,
        ' fill="currentColor"',
      )
      .replace(
        /\sstroke\s*=\s*(['"])(?!none\b)[\s\S]*?\1/gi,
        ' stroke="currentColor"',
      );
  }

  return out;
};

export const listIconNames = () => Array.from(fullNameToPath.keys()).sort();

export const hasIcon = (name: IconName | string) => !!coerceName(name);

export const loadIconSvg = async (
  name: IconName | string,
  options?: { color?: string },
) => {
  const coerced = coerceName(name);
  if (!coerced) return "";

  const path = fullNameToPath.get(coerced);
  if (!path) return "";

  const rawKey = coerced;
  const rawPromise =
    rawCache.get(rawKey) || Promise.resolve(svgLoaders[path]()).then((v) => v);
  rawCache.set(rawKey, rawPromise);

  const enableCurrentColor = typeof options?.color === "string";
  const normalizedKey = `${coerced}|${enableCurrentColor ? "c" : "o"}`;
  const normalizedPromise =
    normalizedCache.get(normalizedKey) ||
    rawPromise.then((svg) => normalizeSvg(svg, enableCurrentColor));
  normalizedCache.set(normalizedKey, normalizedPromise);

  return normalizedPromise;
};
