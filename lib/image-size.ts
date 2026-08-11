import fs from 'fs';
import path from 'path';

/**
 * Reads intrinsic pixel dimensions straight out of a PNG or JPEG header.
 *
 * `next/image` needs width and height for anything it can't statically import,
 * and a post's cover comes from frontmatter — a path, not an import. Hardcoding
 * one post's numbers reserves the wrong box for every other post, so the real
 * ones are read off disk at build time. Only the handful of header bytes are
 * parsed; no image library and no decode.
 */
export function getImageSize(
  publicPath: string
): { width: number; height: number } | null {
  const file = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''));

  let buffer: Buffer;
  try {
    // 64 KB covers a JPEG's segments up to the frame header in practice.
    const handle = fs.openSync(file, 'r');
    buffer = Buffer.alloc(65536);
    const read = fs.readSync(handle, buffer, 0, buffer.length, 0);
    fs.closeSync(handle);
    buffer = buffer.subarray(0, read);
  } catch {
    return null;
  }

  // PNG: an 8-byte signature, then the IHDR chunk carrying the dimensions.
  if (buffer.length >= 24 && buffer.toString('ascii', 12, 16) === 'IHDR') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // JPEG: walk the segment chain to the start-of-frame marker.
  if (buffer.length >= 4 && buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF0–SOF15, minus the DHT/JPG/DAC markers interleaved in that range.
      const isStartOfFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  return null;
}
