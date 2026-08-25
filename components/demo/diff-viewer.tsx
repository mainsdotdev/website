import { Fragment } from "react";
import { Check, Close, CodeBrackets } from "@/components/icons";

const DUMMY_PATCH = [
  "--- a/services/dispatcher/runDispatcher.ts",
  "+++ b/services/dispatcher/runDispatcher.ts",
  "@@ -53,9 +53,15 @@",
  " export async function dispatchRun(request: DispatchRunRequest): Promise<DispatchRunResult> {",
  "   const runId = generateRunId();",
  " ",
  "-  // Load provider",
  "-  const provider = await providersRepo.findById(request.accountId);",
  "+  // 1. Load and validate provider",
  "+  const provider = await providersRepo.findById(request.providerId);",
  "   if (!provider) {",
  "-    throw new Error(`Provider not found`);",
  "+    throw new Error(`Provider \"${request.providerId}\" not found`);",
  "+  }",
  "+  if (!provider.isEnabled) {",
  "+    throw new Error(`Provider \"${provider.displayName}\" is not enabled`);",
  "+  }",
  "+  if (!isSupportedWorkProvider(provider.id)) {",
  "+    throw new Error(`Provider \"${provider.id}\" is not a supported work provider`);",
  "   }",
  " ",
  "@@ -98,10 +104,18 @@",
  "   let result: WorkRunResult;",
  "   try {",
  "-    result = await adapter.startRun(adapterRequest);",
  "+    result = await adapter.startRun(adapterRequest, async (event) => {",
  "+      await writeback.handleEvent(event);",
  "+    });",
  " ",
  "-    const finalStatus = result.status === \"succeeded\" ? \"succeeded\" : \"failed\";",
  "+    const finalStatus: RunStatus =",
  "+      result.status === \"succeeded\"",
  "+        ? \"succeeded\"",
  "+        : result.status === \"canceled\"",
  "+          ? \"canceled\"",
  "+          : \"failed\";",
  " ",
  "     await runsService.updateRun(runId, {",
  "       status: finalStatus,",
  "       endedAt: new Date(),",
  "+      lastError: result.status === \"failed\" ? result.summary : undefined,",
  "     });",
].join("\n");

type AnnotationData = {
  severity: "warning" | "info";
  title: string;
  body: string;
  suggestion?: string;
};

type DiffAnnotation = {
  side: "additions";
  lineNumber: number;
  metadata: AnnotationData;
};

const ANNOTATIONS: DiffAnnotation[] = [
  {
    side: "additions",
    lineNumber: 65,
    metadata: {
      severity: "warning",
      title: "Missing provider.kind check before adapter dispatch",
      body: "`isSupportedWorkProvider` validates the provider ID but doesn't verify `provider.kind === \"agent_runtime\"`. A provider could pass the ID check but have an incompatible kind, causing unexpected behavior in the adapter.",
      suggestion: "Add `if (provider.kind !== \"agent_runtime\") throw new Error(...)` before the `isSupportedWorkProvider` check",
    },
  },
  {
    side: "additions",
    lineNumber: 107,
    metadata: {
      severity: "info",
      title: "Event streaming enables real-time persistence via writeback",
      body: "Passing the async callback to `adapter.startRun` streams each event through `writeback.handleEvent`, persisting tool calls and messages as they arrive instead of batching at the end. This is a solid pattern for long-running agent sessions.",
    },
  },
  {
    side: "additions",
    lineNumber: 114,
    metadata: {
      severity: "warning",
      title: "Canceled status may not propagate from all adapters",
      body: "The ternary maps `result.status === \"canceled\"` to `\"canceled\"`, but `WorkRunResult` may not always emit a canceled status — some adapters resolve with `\"failed\"` and a cancellation message instead, causing user-canceled runs to show as failed.",
      suggestion: "Check `result.canceledByUser` flag or inspect `result.summary` for cancellation signals as a fallback",
    },
  },
];

type DiffLine = {
  kind: "addition" | "context" | "deletion" | "hunk";
  content: string;
  oldLine?: number;
  newLine?: number;
  annotation?: DiffAnnotation;
};

const HUNK_HEADER = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

function parsePatch(patch: string): DiffLine[] {
  let oldLine = 0;
  let newLine = 0;

  return patch.split("\n").flatMap((line): DiffLine[] => {
    if (line.startsWith("---") || line.startsWith("+++")) return [];

    const hunk = line.match(HUNK_HEADER);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[2]);
      return [{ kind: "hunk", content: line }];
    }

    if (line.startsWith("+")) {
      const currentLine = newLine++;
      return [
        {
          kind: "addition",
          content: line.slice(1),
          newLine: currentLine,
          annotation: ANNOTATIONS.find(
            (annotation) => annotation.lineNumber === currentLine
          ),
        },
      ];
    }

    if (line.startsWith("-")) {
      return [
        {
          kind: "deletion",
          content: line.slice(1),
          oldLine: oldLine++,
        },
      ];
    }

    return [
      {
        kind: "context",
        content: line.slice(1),
        oldLine: oldLine++,
        newLine: newLine++,
      },
    ];
  });
}

const DIFF_LINES = parsePatch(DUMMY_PATCH);

function AnnotationContent({ annotation }: { annotation: DiffAnnotation }) {
  const { severity, title, body, suggestion } = annotation.metadata;

  return (
    <div className="px-3 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-[13px] leading-relaxed font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1.5">
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              severity === "warning"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {severity === "warning" ? "Warning" : "Info"}
          </span>
          <span className="text-primary-200 font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors cursor-pointer"
          >
            <Check />
            Approve
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
          >
            <Close />
            Discard
          </button>
        </div>
      </div>
      <p className="text-primary-400 ml-0 mt-1">{body}</p>
      {suggestion && (
        <p className="text-green-400/80 mt-2">
          Suggestion: <code className="text-green-300/90 bg-green-500/10 px-1 py-0.5 rounded text-xs">{suggestion}</code>
        </p>
      )}
    </div>
  );
}

export function DiffViewer() {
  return (
    <div className="glass-outline rounded-2xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center bg-primary-950 border-b border-white/5 px-2 pt-2">
        <div
          style={{
            backgroundColor: "#0c0c0c",
            boxShadow: "inset 0 1px 0 #ffffff34",
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-primary-200 bg-primary-950 border-x border-t border-white/5 rounded-t-xl -mb-px relative"
        >
          <CodeBrackets className="text-primary-400" />
          <span className="truncate text-[13px] max-w-48">runDispatcher.ts</span>
        </div>
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="flex items-center justify-center w-8 h-8 text-primary-500 hover:text-primary-300 transition-colors ml-1"
        />
      </div>

      {/* Scrollable diff area */}
      <div className="max-h-125 overflow-y-auto bg-[#0c0c0c] font-mono text-xs">
        {DIFF_LINES.map((line, index) => (
          <Fragment key={`${line.kind}-${line.oldLine}-${line.newLine}-${index}`}>
            {line.kind === "hunk" ? (
              <div
                data-diff-line
                className="border-y border-blue-400/10 bg-blue-400/5 px-3 py-1.5 text-blue-300/70"
              >
                {line.content}
              </div>
            ) : (
              <div
                data-diff-line
                data-kind={line.kind}
                className={`grid min-h-6 grid-cols-[2.75rem_2.75rem_minmax(0,1fr)] ${
                  line.kind === "addition"
                    ? "bg-emerald-500/8"
                    : line.kind === "deletion"
                      ? "bg-red-500/8"
                      : "bg-[#0c0c0c]"
                }`}
              >
                <span className="select-none border-r border-white/5 px-2 py-1 text-right text-primary-600">
                  {line.oldLine}
                </span>
                <span className="select-none border-r border-white/5 px-2 py-1 text-right text-primary-600">
                  {line.newLine}
                </span>
                <code className="min-w-0 whitespace-pre-wrap break-words px-3 py-1 text-primary-300">
                  <span
                    className={
                      line.kind === "addition"
                        ? "text-emerald-400"
                        : line.kind === "deletion"
                          ? "text-red-400"
                          : "text-primary-600"
                    }
                  >
                    {line.kind === "addition"
                      ? "+"
                      : line.kind === "deletion"
                        ? "-"
                        : " "}
                  </span>
                  {line.content}
                </code>
              </div>
            )}

            {line.annotation && (
              <div
                data-diff-annotation
                className="border-y border-white/5 bg-primary-950"
              >
                <AnnotationContent annotation={line.annotation} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
