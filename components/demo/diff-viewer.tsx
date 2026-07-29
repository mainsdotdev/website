"use client";

import { PatchDiff, type DiffLineAnnotation } from "@pierre/diffs/react";
import { Check, Close, CodeBrackets } from "@/components/icons";

const DUMMY_PATCH = [
  "--- a/services/dispatcher/runDispatcher.ts",
  "+++ b/services/dispatcher/runDispatcher.ts",
  "@@ -6,6 +6,7 @@",
  " import {",
  "   createWorkAdapter,",
  "+  isSupportedWorkProvider,",
  "   type WorkRunRequest,",
  "   type WorkRunResult,",
  "   type WorkRunContextItem,",
  " } from \"../../modules/providers/adapters\";",
  "+import { createRunWriteback } from \"../writeback/runWriteback\";",
  " import type { RunStatus, StartRunContextItem } from \"../../modules/runs\";",
  " ",
  "@@ -18,7 +19,9 @@",
  " export interface DispatchRunRequest {",
  "   accountId: string;",
  "   workspaceId: string;",
  "+  providerId: string;",
  "   goal: string;",
  "+  model?: string;",
  "   systemPrompt?: string;",
  "   initialContext?: StartRunContextItem[];",
  "   spaceId?: string;",
  "@@ -53,10 +56,17 @@",
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
  "-  // Load workspace",
  "+  // 2. Load workspace",
  "   const workspace = await workspacesRepo.findById(request.workspaceId);",
  "   if (!workspace) {",
  "     throw new Error(`Workspace \"${request.workspaceId}\" not found`);",
  "@@ -87,6 +97,13 @@",
  "   const adapter = createWorkAdapter(provider);",
  " ",
  "-  // Execute run",
  "+  // 6. Create writeback handler",
  "+  const writeback = createRunWriteback({",
  "+    accountId: request.accountId,",
  "+    providerId: request.providerId,",
  "+    runId,",
  "+  });",
  "+",
  "+  // 7. Build adapter request",
  "   const adapterRequest: WorkRunRequest = {",
  "     runId,",
  "     accountId: request.accountId,",
  "@@ -98,14 +115,21 @@",
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

const ANNOTATIONS: DiffLineAnnotation<AnnotationData>[] = [
  {
    side: "additions",
    lineNumber: 68,
    metadata: {
      severity: "warning",
      title: "Missing provider.kind check before adapter dispatch",
      body: "`isSupportedWorkProvider` validates the provider ID but doesn't verify `provider.kind === \"agent_runtime\"`. A provider could pass the ID check but have an incompatible kind, causing unexpected behavior in the adapter.",
      suggestion: "Add `if (provider.kind !== \"agent_runtime\") throw new Error(...)` before the `isSupportedWorkProvider` check",
    },
  },
  {
    side: "additions",
    lineNumber: 117,
    metadata: {
      severity: "info",
      title: "Event streaming enables real-time persistence via writeback",
      body: "Passing the async callback to `adapter.startRun` streams each event through `writeback.handleEvent`, persisting tool calls and messages as they arrive instead of batching at the end. This is a solid pattern for long-running agent sessions.",
    },
  },
  {
    side: "additions",
    lineNumber: 125,
    metadata: {
      severity: "warning",
      title: "Canceled status may not propagate from all adapters",
      body: "The ternary maps `result.status === \"canceled\"` to `\"canceled\"`, but `WorkRunResult` may not always emit a canceled status — some adapters resolve with `\"failed\"` and a cancellation message instead, causing user-canceled runs to show as failed.",
      suggestion: "Check `result.canceledByUser` flag or inspect `result.summary` for cancellation signals as a fallback",
    },
  },
];

function AnnotationContent({ annotation }: { annotation: DiffLineAnnotation<AnnotationData> }) {
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
          <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors cursor-pointer">
            <Check />
            Approve
          </button>
          <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer">
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
        <button className="flex items-center justify-center w-8 h-8 text-primary-500 hover:text-primary-300 transition-colors ml-1" />
      </div>

      {/* Scrollable diff area */}
      <div className="overflow-y-auto max-h-125">
        <PatchDiff
        style={{ "--diffs-font-size": "12px", "--diffs-font-family": "'Space Mono', monospace" } as React.CSSProperties}
          patch={DUMMY_PATCH}
          lineAnnotations={ANNOTATIONS}
          renderAnnotation={(annotation) => (
            <AnnotationContent annotation={annotation as DiffLineAnnotation<AnnotationData>} />
          )}
          options={{
            theme: "pierre-dark",
            themeType: "dark",
            diffStyle: "unified",
            overflow: "wrap",
            disableFileHeader: true,
            unsafeCSS: `:host, [data-diffs], [data-diffs-header], [data-error-wrapper], [data-line], [data-column-number], [data-code] { --diffs-bg: #0c0c0c; background-color: #0c0c0c; } [data-line-annotation] { --diffs-annotation-min-height: auto; }`,
          }}
        />
      </div>
    </div>
  );
}
