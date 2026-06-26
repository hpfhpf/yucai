import type { ComponentResolver } from "@uni-helper/vite-plugin-uni-components";

export function WotResolver(): ComponentResolver {
  return {
    type: "component",
    resolve: (name: string) => {
      if (name.match(/^Wd[A-Z]/)) {
        const compName = name
          .slice(2)
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .slice(1);
        return {
          name: "default",
          from: `@wot-ui/ui/components/wd-${compName}/wd-${compName}.vue`,
        };
      }
    },
  };
}
