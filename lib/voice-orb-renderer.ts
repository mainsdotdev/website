/**
 * The desktop app's voice orb, Sphere style only.
 *
 * Ported from the app's `features/workspace/lib/voice-orb-renderer.ts`: the
 * same fragment shader with the Cloud and Aurora branches removed, so the
 * site draws exactly what a Mains voice chat draws. One small shader, no
 * textures, simulation buffers or dependencies.
 */

export interface VoiceOrbLevels {
  readonly input: number;
  readonly output: number;
}

type OrbColor = readonly [number, number, number];
export type VoiceOrbPalette = readonly [OrbColor, OrbColor, OrbColor, OrbColor, OrbColor];

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_position;
  void main() {
    v_position = a_position;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  varying vec2 v_position;
  uniform float u_flow;
  uniform float u_edge;
  uniform vec2 u_voice;
  uniform vec3 u_deep;
  uniform vec3 u_soft;
  uniform vec3 u_light;
  uniform vec3 u_secondary;
  uniform vec3 u_tertiary;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float volumeNoise(vec3 p) {
    vec3 cell = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    vec2 layer = cell.xy + vec2(37.0, 17.0) * cell.z;
    float near = mix(mix(hash(layer), hash(layer + vec2(1.0, 0.0)), f.x),
                     mix(hash(layer + vec2(0.0, 1.0)), hash(layer + vec2(1.0)), f.x), f.y);
    layer += vec2(37.0, 17.0);
    float far = mix(mix(hash(layer), hash(layer + vec2(1.0, 0.0)), f.x),
                    mix(hash(layer + vec2(0.0, 1.0)), hash(layer + vec2(1.0)), f.x), f.y);
    return mix(near, far, f.z);
  }

  float volumeCloud(vec3 p) {
    // Broad banks plus a softer detail layer; no high-frequency ripples.
    return volumeNoise(p) * 0.65 + volumeNoise(p.yzx * 1.85 + vec3(3.7, 7.3, 5.1)) * 0.35;
  }

  vec3 sphereColor(vec2 p, float energy) {
    // Keep spherical depth while advecting clouds through its interior.
    float depth = sqrt(max(0.0, 1.0 - dot(p, p)));
    vec3 normal = vec3(p, depth);
    vec3 medium = vec3(p * 1.1, depth * 0.65);
    float angle = u_flow * 0.14;
    medium.xy = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * medium.xy;
    vec3 drift = vec3(u_flow * 0.21, -u_flow * 0.16, u_flow * 0.13);
    vec3 wind = vec3(
      volumeCloud(medium * 1.15 + drift),
      volumeCloud(medium.yzx * 1.1 - drift * 0.75 + 8.7),
      volumeCloud(medium.zxy * 1.2 + drift * 0.6 + 17.9)
    ) - 0.5;
    vec3 curl = medium + wind * (1.25 + energy * 0.15);
    curl += sin(curl.yzx * 2.0 + drift * 0.65) * 0.18;

    float bank = volumeCloud(curl * 1.55 + drift * 0.45);
    float wisp = volumeCloud(curl * 1.3 - drift * 0.6 + 5.6);
    float ribbon = curl.x * 0.32 + curl.y * 0.18 + (bank - 0.5) * 1.45 + (wisp - 0.5) * 0.65;
    vec3 color = mix(u_deep, u_soft, smoothstep(-0.55, 0.65, ribbon));
    float secondary = volumeCloud(curl * 1.1 + drift * 0.3 + 11.3);
    float tertiary = volumeCloud(curl * 1.35 - drift * 0.5 + 21.7);
    color = mix(color, u_secondary, smoothstep(0.36, 0.67, secondary) * 0.86);
    color = mix(color, u_tertiary, smoothstep(0.35, 0.69, tertiary) * 0.82);
    float light = smoothstep(0.48, 0.73, bank + (wisp - 0.5) * 0.35);
    color = mix(color, u_light, light * 0.62);

    float diffuse = max(0.0, dot(normal, normalize(vec3(-0.72, 0.58, 0.67))));
    color *= 0.55 + 0.49 * pow(diffuse, 0.9);
    float highlight = pow(max(0.0, dot(normal, normalize(vec3(-0.47, 0.51, 1.0)))), 20.0) * 0.24;
    float rim = pow(1.0 - depth, 3.0) * diffuse * 0.18;
    color = mix(color, u_light, highlight + rim);
    // Film grain stays fixed in screen space: the clouds move without flicker.
    float grain = (hash(floor(gl_FragCoord.xy)) - 0.5) * 0.07;
    return clamp(color + grain, 0.0, 1.0);
  }

  void main() {
    vec2 p = v_position;
    vec3 color = sphereColor(p, max(u_voice.x, u_voice.y));
    float alpha = 1.0 - smoothstep(1.0 - u_edge, 1.0, length(p));
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Resolve the orb's CSS colour tokens to RGB, including color-mix values. */
export function readVoiceOrbPalette(element: HTMLElement): VoiceOrbPalette | undefined {
  const canvas = element.ownerDocument.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;
  const style = getComputedStyle(element);
  function color(token: string): OrbColor {
    context!.fillStyle = style.getPropertyValue(token).trim();
    context!.fillRect(0, 0, 1, 1);
    const pixel = context!.getImageData(0, 0, 1, 1).data;
    return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255];
  }
  return [
    color("--color-voice-orb-deep"),
    color("--color-voice-orb-soft"),
    color("--color-voice-orb-light"),
    color("--color-voice-orb-secondary"),
    color("--color-voice-orb-tertiary"),
  ];
}

export function createVoiceOrbRenderer(canvas: HTMLCanvasElement, palette: VoiceOrbPalette) {
  const gl = canvas.getContext("webgl", {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: false, powerPreference: "low-power",
  });
  if (!gl || gl.isContextLost()) return;

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) return null;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) return shader;
    gl!.deleteShader(shader);
    return null;
  }

  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!vertex || !fragment || !program || !buffer) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    return;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    return;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const flow = gl.getUniformLocation(program, "u_flow");
  const edge = gl.getUniformLocation(program, "u_edge");
  const voice = gl.getUniformLocation(program, "u_voice");
  const colors = ["u_deep", "u_soft", "u_light", "u_secondary", "u_tertiary"].map((name) =>
    gl.getUniformLocation(program, name),
  );
  let disposed = false;

  function setPalette(next: VoiceOrbPalette) {
    if (disposed) return;
    gl!.useProgram(program);
    next.forEach((color, index) => gl!.uniform3f(colors[index], ...color));
  }
  setPalette(palette);

  return {
    setPalette,
    draw(time: number, levels: VoiceOrbLevels) {
      if (disposed || gl.isContextLost()) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(flow, time);
      gl.uniform1f(edge, 2 / Math.max(1, canvas.width));
      gl.uniform2f(voice, levels.input, levels.output);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      gl.disableVertexAttribArray(position);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
