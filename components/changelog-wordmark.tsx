type Texture = "hatch" | "lines" | "dots" | "meridians" | "flow";
type Guide = "round" | "arch" | "stem";
type Outline = "solid" | "dots" | "dashes";

const G_PATH =
  "M104 64H128V200a56 56 0 0 1-112 0H40a32 32 0 0 0 64 0V177.96A64 64 0 1 1 104 78.04ZM104 128a40 40 0 1 0-80 0a40 40 0 1 0 80 0Z";

const LETTERS = [
  {
    character: "c", x: 0, width: 128,
    path: "M109.255 82.745A64 64 0 1 0 109.255 173.255L92.284 156.284A40 40 0 1 1 92.284 99.716Z",
    texture: "hatch", guide: "round", outline: "solid",
  },
  {
    character: "h", x: 152, width: 112,
    path: "M0 192V24H24V74.043A56 56 0 0 1 112 120V192H88V120a32 32 0 0 0-64 0v72Z",
    texture: "lines", guide: "arch", outline: "solid",
  },
  {
    character: "a", x: 288, width: 128,
    path: "M104 64H128V192H104V177.96A64 64 0 1 1 104 78.04ZM104 128a40 40 0 1 0-80 0a40 40 0 1 0 80 0Z",
    texture: "dots", guide: "round", outline: "dots",
  },
  {
    character: "n", x: 440, width: 112,
    path: "M0 192V120a56 56 0 0 1 112 0v72H88V120a32 32 0 0 0-64 0v72Z",
    texture: "hatch", guide: "arch", outline: "solid",
  },
  {
    character: "g", x: 576, width: 128, path: G_PATH,
    texture: "meridians", guide: "round", outline: "solid",
  },
  {
    character: "e", x: 728, width: 128,
    path: "M128 128A64 64 0 1 0 109.255 173.255L92.284 156.284A40 40 0 0 1 25.842 140H128ZM25.842 116H102.158A40 40 0 0 0 25.842 116Z",
    texture: "lines", guide: "round", outline: "solid",
  },
  {
    character: "l", x: 880, width: 24, path: "M0 24H24V192H0Z",
    texture: "dots", guide: "stem", outline: "solid",
  },
  {
    character: "o", x: 928, width: 128,
    path: "M128 128a64 64 0 1 0-128 0a64 64 0 1 0 128 0ZM104 128a40 40 0 1 0-80 0a40 40 0 1 0 80 0Z",
    texture: "meridians", guide: "round", outline: "solid",
  },
  {
    character: "g", x: 1080, width: 128, path: G_PATH,
    texture: "flow", guide: "round", outline: "dashes",
  },
] as const satisfies readonly {
  character: string;
  x: number;
  width: number;
  path: string;
  texture: Texture;
  guide: Guide;
  outline: Outline;
}[];

function LetterTexture({ texture }: { texture: Texture }) {
  if (texture === "meridians") {
    return (
      <g fill="none" stroke="currentColor" strokeWidth={0.75}>
        {[12, 28, 44, 56].map((rx) => (
          <ellipse key={rx} cx={64} cy={128} rx={rx} ry={64} vectorEffect="non-scaling-stroke" />
        ))}
        <path
          d="M0 128H128M8 96Q64 120 120 96M8 160Q64 136 120 160M24 76Q64 96 104 76M24 180Q64 160 104 180"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
  }

  if (texture === "flow") {
    return (
      <g fill="none" stroke="currentColor" strokeWidth={0.75}>
        {Array.from({ length: 10 }, (_, index) => {
          const edgeY = 48 + index * 24;
          const centerY = 88 + index * 12;

          return (
            <path
              key={index}
              d={`M-16 ${edgeY}C16 ${edgeY} 40 ${centerY} 64 ${centerY}S112 ${edgeY} 144 ${edgeY}`}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    );
  }

  return <rect y={16} width={128} height={248} fill={`url(#changelog-${texture})`} />;
}

function LetterGuides({ guide }: { guide: Guide }) {
  const cx = guide === "arch" ? 56 : 64;
  const cy = guide === "arch" ? 120 : 128;

  if (guide === "stem") {
    return (
      <path
        d="M-8 24H32M-8 192H32M-4 20V28M28 20V28M-4 188V196M28 188V196"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <>
      {(guide === "arch" ? [32, 56] : [40, 64]).map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} vectorEffect="non-scaling-stroke" />
      ))}
      <path
        d={`M${cx} 16V264M-8 ${cy}H136`}
        strokeDasharray="3 5"
        vectorEffect="non-scaling-stroke"
      />
      <path d={`M${cx - 4} ${cy}h8M${cx} ${cy - 4}v8`} vectorEffect="non-scaling-stroke" />
    </>
  );
}

/** A static drawing study mixing the site's hatching, dots, meridians and lanes. */
export function ChangelogWordmark() {
  return (
    <h1 className="w-max max-w-full text-[clamp(3.5rem,9vw,8rem)] leading-none text-primary-50 select-none">
      <span className="sr-only">changelog</span>
      <svg
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        width={1240}
        height={256}
        viewBox="-16 8 1240 256"
        fill="none"
        className="block h-[1em] w-auto max-w-full"
      >
        <defs>
          <pattern id="changelog-hatch" width={8} height={8} patternUnits="userSpaceOnUse">
            <path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="currentColor" strokeWidth={0.75} />
          </pattern>
          <pattern id="changelog-lines" width={8} height={8} patternUnits="userSpaceOnUse">
            <path d="M0 4H8" stroke="currentColor" strokeWidth={0.75} />
          </pattern>
          <pattern id="changelog-dots" width={8} height={8} patternUnits="userSpaceOnUse">
            <circle cx={4} cy={4} r={1} fill="currentColor" />
          </pattern>
          {LETTERS.map((letter, index) => (
            <clipPath key={index} id={`changelog-letter-${index}`}>
              <path d={letter.path} clipRule="evenodd" />
            </clipPath>
          ))}
        </defs>

        <g stroke="currentColor" opacity={0.08}>
          {[24, 64, 192, 256].map((y) => (
            <path key={y} d={`M-16 ${y}H1224`} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {LETTERS.map((letter, index) => (
          <g key={`${letter.character}-${index}`} transform={`translate(${letter.x} 0)`}>
            <g clipPath={`url(#changelog-letter-${index})`} opacity={0.22}>
              <LetterTexture texture={letter.texture} />
            </g>

            <g stroke="currentColor" strokeWidth={0.75} opacity={0.12}>
              <path
                d={`M0 16V264M${letter.width} 16V264`}
                strokeDasharray="2 6"
                vectorEffect="non-scaling-stroke"
              />
              <LetterGuides guide={letter.guide} />
              {letter.character === "g" && (
                <path d="M16 200H128M72 192V264" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
              )}
            </g>

            <path
              d={letter.path}
              stroke="currentColor"
              strokeWidth={letter.outline === "dots" ? 1.5 : 1}
              strokeDasharray={letter.outline === "dots" ? "0 3" : letter.outline === "dashes" ? "5 3" : undefined}
              strokeLinecap={letter.outline === "solid" ? undefined : "round"}
              opacity={0.65}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </h1>
  );
}
