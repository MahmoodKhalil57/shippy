import { LABEL_SPACE, SCHEMES, type CheckpointManifest, type CheckpointShot } from "../src/explode/pages.ts";

const PAD = 48;
const RADIUS = 28;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `
.bg { fill: #eef0f3; }
.ink { fill: #5b6673; }
.dark { display: none; }
@media (prefers-color-scheme: dark) {
  .bg { fill: #14181d; }
  .ink { fill: #9aa5b1; }
  .light { display: none; }
  .dark { display: inline; }
}
`;

export function explodeSvg(manifest: CheckpointManifest, href: (shot: CheckpointShot) => string): string {
  const width = manifest.width + PAD * 2;
  const height = manifest.height + LABEL_SPACE + PAD * 2;
  const sizes = new Map<string, { width: number; height: number }>();
  for (const f of manifest.frames) sizes.set(`${f.width}x${f.height}`, { width: f.width, height: f.height });
  const clips = [...sizes]
    .map(([id, s]) => `<clipPath id="c${id}"><rect width="${s.width}" height="${s.height}" rx="${RADIUS}"/></clipPath>`)
    .join("");
  const frames = manifest.frames.map((f) => {
    const images = f.shots
      ? SCHEMES.map(
          (scheme) =>
            `<image class="${scheme}"${scheme === "dark" ? ` display="none"` : ""} width="${f.width}" height="${f.height}" preserveAspectRatio="none" xlink:href="${escape(href(f.shots![scheme]["2x"]))}"/>`,
        ).join("")
      : "";
    return (
      `<g id="${escape(f.id)}" transform="translate(${f.x} ${f.y})">` +
      `<text class="ink" x="0" y="-16" fill="#5b6673">${escape(f.label)}</text>` +
      `<rect x="-8.5" y="-8.5" width="${f.width + 17}" height="${f.height + 17}" rx="${RADIUS + 8.5}" fill="none" stroke="#3a4048" stroke-width="1"/>` +
      `<rect x="-4" y="-4" width="${f.width + 8}" height="${f.height + 8}" rx="${RADIUS + 4}" fill="none" stroke="#1b1f24" stroke-width="8"/>` +
      `<g clip-path="url(#c${f.width}x${f.height})"><rect width="${f.width}" height="${f.height}" fill="#000"/>${images}</g>` +
      `</g>`
    );
  });
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" font-weight="500">\n` +
    `<title>Explode</title>\n<style>${STYLE}</style>\n<defs>${clips}</defs>\n` +
    `<rect class="bg" width="${width}" height="${height}" fill="#eef0f3"/>\n` +
    `<g transform="translate(${PAD} ${PAD + LABEL_SPACE})">\n${frames.join("\n")}\n</g>\n</svg>\n`
  );
}
