import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const synth = await readFile(join(process.cwd(), "field-synth.html"), "utf8");
  const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FIELD/01 playable synthesizer</title>
    <style>html, body { margin: 0; min-height: 100%; background: transparent; }</style>
  </head>
  <body>${synth}</body>
</html>`;

  return new Response(document, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
