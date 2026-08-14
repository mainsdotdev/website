import fs from 'fs';
import path from 'path';

export type ImageSize = { width: number; height: number };

const publicDir = path.join(process.cwd(), 'public');

/**
 * Reads the pixel dimensions out of an image header, for a file under
 * `public/`.
 *
 * Social scrapers want `og:image:width` / `og:image:height` in the markup:
 * Facebook and LinkedIn lay the card out from those numbers on the first
 * scrape and only learn the real ones after they've fetched the file, so a
 * freshly shared link renders without its image when they're missing.
 *
 * Frontmatter names the cover as a path, which rules out `next/image`'s static
 * import (that needs a literal). Parsing the header instead keeps the post's
 * `image:` the single source of truth — no second file to maintain, no numbers
 * to copy by hand and later contradict.
 *
 * Only the headers we actually ship are decoded. Anything else — an unknown
 * format, a missing file, a truncated read — returns undefined, and the
 * metadata simply omits the dimensions rather than asserting a wrong one.
 */
export function getImageSize(publicPath: string): ImageSize | undefined {
  const filePath = path.join(publicDir, publicPath.replace(/^\//, ''));

  // Frontmatter is authored, not user input, but a `../` in a path would still
  // read outside public/ — so refuse anything that escapes it.
  if (!filePath.startsWith(publicDir)) return undefined;

  let buffer: Buffer;
  try {
    buffer = fs.readFileSync(filePath);
  } catch {
    return undefined;
  }

  return readPng(buffer) ?? readJpeg(buffer) ?? readWebp(buffer);
}

/** IHDR is always the first chunk, so the dimensions sit at a fixed offset. */
function readPng(b: Buffer): ImageSize | undefined {
  if (b.length < 24) return undefined;
  if (b.readUInt32BE(0) !== 0x89504e47) return undefined;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

/**
 * Walks the marker segments to the start-of-frame, which is the only one
 * carrying the size. Everything before it — EXIF, ICC profiles, thumbnails —
 * is length-prefixed and skipped wholesale.
 */
function readJpeg(b: Buffer): ImageSize | undefined {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return undefined;

  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return undefined;

    const marker = b[offset + 1];

    // Padding between segments, and the standalone markers that carry no
    // payload to skip past.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }

    // SOF0–SOF15, minus the three markers in that range that mean something
    // else (DHT, JPG, DAC).
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      return {
        height: b.readUInt16BE(offset + 5),
        width: b.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + b.readUInt16BE(offset + 2);
  }

  return undefined;
}

/** The three WebP flavours keep their size in three different places. */
function readWebp(b: Buffer): ImageSize | undefined {
  if (b.length < 30) return undefined;
  if (b.toString('ascii', 0, 4) !== 'RIFF') return undefined;
  if (b.toString('ascii', 8, 12) !== 'WEBP') return undefined;

  const format = b.toString('ascii', 12, 16);

  // Extended: canvas size, stored as 24-bit little-endian minus one.
  if (format === 'VP8X') {
    return {
      width: b.readUIntLE(24, 3) + 1,
      height: b.readUIntLE(27, 3) + 1,
    };
  }

  // Lossy: 14-bit dimensions following the keyframe sync code.
  if (format === 'VP8 ') {
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return undefined;
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    };
  }

  // Lossless: 14-bit dimensions packed across the four bytes after the
  // signature byte, width first.
  if (format === 'VP8L') {
    if (b[20] !== 0x2f) return undefined;
    const bits = b.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return undefined;
}
