declare module "~icons/*" {
  import type { SVGTemplateResult } from "lit";
  const icon: { viewBox: string; animated: boolean; body: (uid: string) => SVGTemplateResult };
  export default icon;
}
