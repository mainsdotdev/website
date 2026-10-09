import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Run with `node scripts/generate-social-image.mjs` from the website directory.
// Matches the home footer's blueprint wordmark, without additional copy.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const width = 1200;
const height = 630;
const ink = "#f2f0e5";

const markSource = await readFile(path.join(root, "components/icons/mains.tsx"), "utf8");
const mark = markSource.match(/MAINS_MARK_PATH\s*=\s*"([^"]+)"/)?.[1];
if (!mark) throw new Error("Could not find the Mains logo path.");

// These contours and guides are the ones used by FooterWordmark in footer.tsx.
const circles = [
  [56, 104, 56], [56, 104, 24], [136, 104, 56], [136, 104, 24],
  [296, 128, 80], [296, 128, 48], [512, 104, 56], [512, 104, 24],
  [648, 96, 48], [648, 96, 16], [680, 160, 48], [680, 160, 16],
];
const guideX = [
  -244, -147, -50, 0, 32, 80, 112, 160, 192, 216, 296, 344, 376,
  400, 432, 456, 488, 536, 568, 600, 648, 680, 728,
];
const guideY = [16, 48, 64, 80, 104, 128, 160, 192, 208];
const centers = [
  [-147, 128], [56, 104], [136, 104], [296, 128],
  [416, 32], [512, 104], [648, 96], [680, 160],
];

// Keep the footer's wide panel centered on the standard social-card canvas.
const panel = { x: 48, y: 195, width: 1104, height: 240, radius: 24 };
const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="horizontal" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M0 .5H12" stroke="${ink}" stroke-opacity=".15"/>
    </pattern>
    <pattern id="diagonal" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M.5 0V7" stroke="${ink}" stroke-opacity=".15"/>
    </pattern>
    <clipPath id="panel"><rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" rx="${panel.radius}"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="#0c0c0c"/>
  <g clip-path="url(#panel)">
    <rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" fill="url(#horizontal)"/>
    <rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" fill="url(#diagonal)"/>
    <g transform="translate(102 195) translate(260 8)" fill="none" stroke="${ink}" stroke-width="1">
      <g opacity=".08">
        ${guideX.map((x) => `<path d="M${x} -8V232"/>`).join("")}
        ${guideY.map((y) => `<path d="M-260 ${y}H736"/>`).join("")}
        <rect x="-244" y="48" width="${(648 * 160) / 534}" height="160"/>
        ${circles.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join("")}
      </g>
      <g opacity=".25">
        <path d="${mark}" transform="translate(-244 48) scale(${160 / 534})" vector-effect="non-scaling-stroke"/>
        <path d="M0 208V104A56 56 0 0 1 96 64.808A56 56 0 0 1 192 104V208H160V104a24 24 0 0 0-48 0v104H80V104a24 24 0 0 0-48 0v104Z"/>
        <path d="M344 48H376V208H344V192A80 80 0 1 1 344 64ZM344 128a48 48 0 1 0-96 0a48 48 0 1 0 96 0Z"/>
        <circle cx="416" cy="32" r="16"/>
        <rect x="400" y="64" width="32" height="144"/>
        <path d="M456 208V104a56 56 0 0 1 112 0v104H536V104a24 24 0 0 0-48 0v104Z"/>
        <path d="M712 48H648a48 48 0 0 0 0 96H680a16 16 0 0 1 0 32H608V208H680a48 48 0 0 0 0-96H648a16 16 0 0 1 0-32H712Z"/>
      </g>
      <g opacity=".15">
        ${centers.map(([x, y]) => `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8"/>`).join("")}
      </g>
    </g>
  </g>
  <rect x="${panel.x + 0.5}" y="${panel.y + 0.5}" width="${panel.width - 1}" height="${panel.height - 1}" rx="${panel.radius}" fill="none" stroke="${ink}" stroke-opacity=".05"/>
</svg>`;

const output = path.join(root, "public/og-blueprint.png");
await sharp(Buffer.from(artwork))
  .png({ compressionLevel: 9, palette: true, colours: 64, dither: 0 })
  .toFile(output);
console.log(`Saved ${output} (${width} × ${height})`);
