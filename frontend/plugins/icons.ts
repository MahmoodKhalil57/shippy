import Icons from "unplugin-icons/vite";

/**
 * Icons: `import home from "~icons/line-md/home"` resolves, at build time, to that one icon from
 * its Iconify collection (only icons that are imported reach the bundle).
 *
 * Allowed collections: line-md (animated outline icons, preferred), material-symbols-light,
 * devicon and logos (technology / brand logos). Anything else fails the build.
 *
 * Each icon compiles to a static Lit template, `{ viewBox, body }` (`body` is an `svg` template),
 * so primitives render it inside their own `<svg>` (see `iconSvg` in
 * src/components/primitives/media/icon.ts) with no `unsafeSVG`.
 */
export const ICON_COLLECTIONS = ["line-md", "material-symbols-light", "devicon", "logos"] as const;

const escapeTemplate = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

export default function icons() {
  return Icons({
    compiler: {
      compiler: (svg: string, collection: string, icon: string) => {
        if (!(ICON_COLLECTIONS as readonly string[]).includes(collection))
          throw new Error(`Icon "${collection}/${icon}": only ${ICON_COLLECTIONS.join(", ")} are allowed.`);
        const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? "0 0 24 24";
        const body = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
        return `import { svg } from "lit";\nexport default { viewBox: ${JSON.stringify(viewBox)}, body: svg\`${escapeTemplate(body)}\` };\n`;
      },
    },
  });
}
