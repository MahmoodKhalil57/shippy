import Icons from "unplugin-icons/vite";

/**
 * Icons: `import home from "~icons/line-md/home"` resolves, at build time, to that one icon from
 * its Iconify collection (only icons that are imported reach the bundle).
 *
 * Allowed collections: line-md (animated outline icons, preferred), material-symbols,
 * devicon and logos (technology / brand logos). Anything else fails the build.
 *
 * Each icon compiles to `{ viewBox, body }`: `body(uid)` returns a static Lit `svg` template, its
 * internal ids prefixed with `uid` so several copies can share a page,
 * so primitives render it inside their own `<svg>` (see `iconSvg` in
 * src/components/primitives/media/icon.ts) with no `unsafeSVG`.
 */
export const ICON_COLLECTIONS = ["line-md", "material-symbols", "devicon", "logos"] as const;

const escapeTemplate = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

export default function icons() {
  return Icons({
    compiler: {
      compiler: (svg: string, collection: string, icon: string) => {
        if (!(ICON_COLLECTIONS as readonly string[]).includes(collection))
          throw new Error(`Icon "${collection}/${icon}": only ${ICON_COLLECTIONS.join(", ")} are allowed.`);
        const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? "0 0 24 24";
        let body = escapeTemplate(svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""));
        // Internal ids (masks, gradients) must be unique per copy on the page, or a second copy's
        // url(#id) resolves to the first (possibly hidden) one and the icon breaks. So `body` takes
        // a prefix (`iconSvg` passes a fresh one per render) and the ids are rewritten with it.
        const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]!);
        ids.forEach((id, i) => {
          body = body.replaceAll(`id="${id}"`, `id="\${uid}-${i}"`).replaceAll(`#${id}`, `#\${uid}-${i}`);
        });
        // Animated (SMIL `<animate>`, `<animateTransform>`, `<set>`): `iconSvg` holds and paces these
        // (src/components/base/icon-motion.ts) rather than letting every copy start at once.
        const animated = /<(animate|animateTransform|animateMotion|set)\b/.test(svg);
        return `import { svg } from "lit";\nexport default { viewBox: ${JSON.stringify(viewBox)}, animated: ${animated}, body: (uid) => svg\`${body}\` };\n`;
      },
    },
  });
}
