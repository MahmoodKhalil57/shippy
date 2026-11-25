import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import Icons from "unplugin-icons/vite";

export const ICON_COLLECTIONS = ["line-md", "material-symbols", "devicon", "logos"] as const;

const HERE = fileURLToPath(new URL("..", import.meta.url));
const LIT = JSON.stringify(
  createRequire(import.meta.url)
    .resolve("lit")
    .replaceAll("\\", "/"),
);

const escapeTemplate = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

export default function icons() {
  return Icons({
    collectionsNodeResolvePath: HERE,
    compiler: {
      compiler: (svg: string, collection: string, icon: string) => {
        if (!(ICON_COLLECTIONS as readonly string[]).includes(collection))
          throw new Error(`Icon "${collection}/${icon}": only ${ICON_COLLECTIONS.join(", ")} are allowed.`);
        const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? "0 0 24 24";
        let body = escapeTemplate(svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""));
        const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]!);
        ids.forEach((id, i) => {
          body = body.replaceAll(`id="${id}"`, `id="\${uid}-${i}"`).replaceAll(`#${id}`, `#\${uid}-${i}`);
        });
        const animated = /<(animate|animateTransform|animateMotion|set)\b/.test(svg);
        return `import { svg } from ${LIT};\nexport default { viewBox: ${JSON.stringify(viewBox)}, animated: ${animated}, body: (uid) => svg\`${body}\` };\n`;
      },
    },
  });
}
