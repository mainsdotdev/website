import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Run with `node scripts/generate-social-image.mjs` from the website directory.
// The home footer's letterforms with the changelog's mixed drawing textures.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const width = 1200;
const height = 630;
const ink = "#f2f0e5";

const markSource = await readFile(path.join(root, "components/icons/mains.tsx"), "utf8");
const mark = markSource.match(/MAINS_MARK_PATH\s*=\s*"([^"]+)"/)?.[1];
if (!mark) throw new Error("Could not find the Mains logo path.");

// Contours and guides follow FooterWordmark in footer.tsx. Each letter gets a
// different texture, using the same strokes and opacities as ChangelogWordmark.
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

const letters = [
  {
    character: "m", texture: "hatch", outline: "solid",
    path: "M0 208V104A56 56 0 0 1 96 64.808A56 56 0 0 1 192 104V208H160V104a24 24 0 0 0-48 0v104H80V104a24 24 0 0 0-48 0v104Z",
  },
  {
    character: "a", texture: "dots", outline: "dots",
    path: "M344 48H376V208H344V192A80 80 0 1 1 344 64ZM344 128a48 48 0 1 0-96 0a48 48 0 1 0 96 0Z",
  },
  {
    character: "i", texture: "lines", outline: "solid",
    path: "M432 32a16 16 0 1 0-32 0a16 16 0 1 0 32 0ZM400 64H432V208H400Z",
  },
  {
    character: "n", texture: "meridians", outline: "solid",
    path: "M456 208V104a56 56 0 0 1 112 0v104H536V104a24 24 0 0 0-48 0v104Z",
  },
  {
    character: "s", texture: "flow", outline: "dashes",
    path: "M712 48H648a48 48 0 0 0 0 96H680a16 16 0 0 1 0 32H608V208H680a48 48 0 0 0 0-96H648a16 16 0 0 1 0-32H712Z",
  },
];

function letterTexture(texture) {
  if (texture === "meridians") {
    return `<g stroke="${ink}" stroke-width=".75">
      ${[12, 24, 36, 50].map((rx) => `<ellipse cx="512" cy="128" rx="${rx}" ry="80"/>`).join("")}
      <path d="M456 128H568M460 88Q512 118 564 88M460 168Q512 138 564 168M472 60Q512 90 552 60M472 196Q512 166 552 196"/>
    </g>`;
  }
  if (texture === "flow") {
    return `<g stroke="${ink}" stroke-width=".75">
      ${Array.from({ length: 10 }, (_, index) => {
        const edgeY = 40 + index * 24;
        const centerY = 80 + index * 12;
        return `<path d="M584 ${edgeY}C616 ${edgeY} 640 ${centerY} 664 ${centerY}S712 ${edgeY} 744 ${edgeY}"/>`;
      }).join("")}
    </g>`;
  }
  return `<rect x="0" y="8" width="736" height="224" fill="url(#mixed-${texture})" stroke="none"/>`;
}

// Keep the footer's wide panel centered on the standard social-card canvas.
const panel = { x: 48, y: 195, width: 1104, height: 240, radius: 24 };
const artwork = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="mixed-lines" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M0 4H8" stroke="${ink}" stroke-width=".75"/>
    </pattern>
    <pattern id="mixed-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="${ink}" stroke-width=".75"/>
    </pattern>
    <pattern id="mixed-dots" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1" fill="${ink}"/>
    </pattern>
    ${letters.map((letter) => `<clipPath id="mixed-${letter.character}"><path d="${letter.path}" clip-rule="evenodd"/></clipPath>`).join("")}
    <clipPath id="panel"><rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" rx="${panel.radius}"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="#0c0c0c"/>
  <g clip-path="url(#panel)">
    <g transform="translate(102 195) translate(260 8)" fill="none" stroke="${ink}" stroke-width="1">
      <g opacity=".08">
        ${guideX.map((x) => `<path d="M${x} -8V232" stroke-dasharray="2 6"/>`).join("")}
        ${guideY.map((y) => `<path d="M-260 ${y}H736"/>`).join("")}
        <rect x="-244" y="48" width="${(648 * 160) / 534}" height="160"/>
        ${circles.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join("")}
      </g>
      <g opacity=".65">
        <path d="${mark}" transform="translate(-244 48) scale(${160 / 534})" vector-effect="non-scaling-stroke"/>
      </g>
      ${letters.map((letter) => {
        const outline = letter.outline === "dots"
          ? 'stroke-width="1.5" stroke-dasharray="0 3" stroke-linecap="round"'
          : letter.outline === "dashes"
            ? 'stroke-dasharray="5 3" stroke-linecap="round"'
            : "";
        return `<g clip-path="url(#mixed-${letter.character})" opacity=".22">${letterTexture(letter.texture)}</g>
          <path d="${letter.path}" ${outline} opacity=".65"/>`;
      }).join("")}
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
