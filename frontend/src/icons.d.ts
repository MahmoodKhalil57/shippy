/** `~icons/<collection>/<name>` (see plugins/icons.ts): one Iconify icon as a static Lit SVG template. */
declare module "~icons/*" {
  import type { SVGTemplateResult } from "lit";
  const icon: { viewBox: string; body: SVGTemplateResult };
  export default icon;
}
