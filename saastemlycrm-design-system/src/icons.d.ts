/** `~icons/<collection>/<name>` (see plugins/icons.ts): one Iconify icon as a static Lit SVG template. */
declare module "~icons/*" {
  import type { SVGTemplateResult } from "lit";
  /** `body(uid)`: the icon's markup; its internal ids are prefixed with `uid` (unique per copy). */
  /** `animated`: it has SMIL animations, which `iconSvg` holds and paces (src/components/base/icon-motion.ts). */
  const icon: { viewBox: string; animated: boolean; body: (uid: string) => SVGTemplateResult };
  export default icon;
}
