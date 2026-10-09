import { MAINS_MARK_PATH } from "@/components/icons/mains";

/** A linear-time Euclidean distance transform, performed along both axes. */
function distanceTo(mask: Uint8Array, inside: boolean, size: number) {
  const distance = new Float64Array(size * size);
  const scratch = new Float64Array(size);
  const result = new Float64Array(size);
  const vertices = new Int32Array(size);
  const boundaries = new Float64Array(size + 1);

  for (let i = 0; i < mask.length; i++) {
    distance[i] = Boolean(mask[i]) === inside ? 0 : 1e12;
  }

  function transform() {
    let k = 0;
    vertices[0] = 0;
    boundaries[0] = -Infinity;
    boundaries[1] = Infinity;

    for (let q = 1; q < size; q++) {
      let vertex = vertices[k];
      let boundary = ((scratch[q] + q * q) - (scratch[vertex] + vertex * vertex)) / (2 * (q - vertex));
      while (boundary <= boundaries[k]) {
        k--;
        vertex = vertices[k];
        boundary = ((scratch[q] + q * q) - (scratch[vertex] + vertex * vertex)) / (2 * (q - vertex));
      }
      k++;
      vertices[k] = q;
      boundaries[k] = boundary;
      boundaries[k + 1] = Infinity;
    }

    k = 0;
    for (let q = 0; q < size; q++) {
      while (boundaries[k + 1] < q) k++;
      const offset = q - vertices[k];
      result[q] = offset * offset + scratch[vertices[k]];
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) scratch[x] = distance[y * size + x];
    transform();
    for (let x = 0; x < size; x++) distance[y * size + x] = result[x];
  }
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) scratch[y] = distance[y * size + x];
    transform();
    for (let y = 0; y < size; y++) distance[y * size + x] = result[y];
  }
  return distance;
}

let cachedField: { pixels: Uint8Array; size: number } | undefined;

/** Rasterise the original path once, then encode its signed distance in RG. */
export function createMainsMarkField() {
  if (cachedField) return cachedField;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  // Padding allows the shader to sample a halo outside the silhouette.
  const scale = size / 900;
  context.translate(size / 2, size / 2);
  context.scale(scale, scale);
  context.translate(-324, -267);
  context.fillStyle = "#fff";
  context.fill(new Path2D(MAINS_MARK_PATH));
  const image = context.getImageData(0, 0, size, size).data;
  const mask = new Uint8Array(size * size);
  for (let i = 0; i < mask.length; i++) mask[i] = image[i * 4 + 3] >= 128 ? 1 : 0;

  const toInside = distanceTo(mask, true, size);
  const toOutside = distanceTo(mask, false, size);
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const source = y * size + x;
      const signed = (Math.sqrt(toInside[source]) - Math.sqrt(toOutside[source])) * 2 / size;
      const value = Math.max(0, Math.min(1, signed * 0.5 + 0.5)) * 255;
      // Flip the canvas coordinates to WebGL's bottom-left origin.
      const target = ((size - y - 1) * size + x) * 4;
      pixels[target] = Math.floor(value);
      pixels[target + 1] = Math.round((value - Math.floor(value)) * 255);
      pixels[target + 3] = 255;
    }
  }
  cachedField = { pixels, size };
  return cachedField;
}
