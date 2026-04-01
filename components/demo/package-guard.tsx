"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, Close } from "@/components/icons";

type PackageEntry = {
  name: string;
  version: string;
  ecosystem: string;
  score: number;
  status: "pending" | "checking" | "allowed" | "blocked";
  risk: "none" | "low" | "medium" | "high" | "critical";
  alerts: string[];
};

const PACKAGES: PackageEntry[] = [
  {
    name: "express",
    version: "4.21.2",
    ecosystem: "npm",
    score: 91,
    status: "pending",
    risk: "none",
    alerts: [],
  },
  {
    name: "lodash",
    version: "4.17.21",
    ecosystem: "npm",
    score: 87,
    status: "pending",
    risk: "none",
    alerts: [],
  },
  {
    name: "ev1l-logger",
    version: "1.0.3",
    ecosystem: "npm",
    score: 12,
    status: "pending",
    risk: "critical",
    alerts: ["Known malware", "Typosquatting"],
  },
  {
    name: "node-fetch",
    version: "3.3.2",
    ecosystem: "npm",
    score: 78,
    status: "pending",
    risk: "low",
    alerts: [],
  },
];

const riskColors: Record<string, string> = {
  none: "text-green-400",
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

const riskBg: Record<string, string> = {
  none: "bg-green-900/40 text-green-300",
  low: "bg-green-900/40 text-green-300",
  medium: "bg-yellow-900/40 text-yellow-300",
  high: "bg-orange-900/40 text-orange-300",
  critical: "bg-red-900/40 text-red-300",
};

function ScoreBar({ score, status }: { score: number; status: string }) {
  const isPending = status === "pending" || status === "checking";
  const color =
    score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-primary-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isPending ? "bg-primary-700" : color}`}
          style={{ width: isPending ? "0%" : `${score}%` }}
        />
      </div>
      <span
        className={`text-[11px] font-mono tabular-nums ${isPending ? "text-primary-600" : riskColors[PACKAGES.find((p) => p.score === score)?.risk ?? "none"]}`}
      >
        {isPending ? "—" : score}
      </span>
    </div>
  );
}

export function PackageGuard() {
  const [packages, setPackages] = useState<PackageEntry[]>(PACKAGES);
  const [hasRun, setHasRun] = useState(false);

  const runCheck = () => {
    if (hasRun) {
      setPackages(PACKAGES);
      setHasRun(false);
      return;
    }

    setHasRun(true);

    // Set all to checking
    setPackages((prev) =>
      prev.map((p) => ({ ...p, status: "checking" as const }))
    );

    // Resolve each package with a staggered delay
    PACKAGES.forEach((pkg, i) => {
      setTimeout(() => {
        setPackages((prev) =>
          prev.map((p) =>
            p.name === pkg.name
              ? {
                  ...p,
                  status:
                    pkg.risk === "critical" || pkg.risk === "high"
                      ? ("blocked" as const)
                      : ("allowed" as const),
                }
              : p
          )
        );
      }, 600 + i * 400);
    });
  };

  // Auto-run on mount
  useEffect(() => {
    const timer = setTimeout(runCheck, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blocked = packages.filter((p) => p.status === "blocked").length;
  const allowed = packages.filter((p) => p.status === "allowed").length;
  const checking = packages.some(
    (p) => p.status === "checking" || p.status === "pending"
  );

  return (
    <div className="bg-primary-950 border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-primary-400" />
          <span className="text-xs text-white font-medium">
            Dependency Guard
          </span>
          <span className="text-primary-600 text-xs">·</span>
          <span className="text-primary-500 text-xs">Socket.dev</span>
        </div>
        <button
          onClick={runCheck}
          className="text-[11px] text-primary-400 bg-primary-900/60 rounded-full px-2.5 py-1 hover:bg-primary-800/60 transition-colors cursor-pointer"
        >
          {hasRun ? "Reset" : "Check"}
        </button>
      </div>

      {/* Command line */}
      <div className="px-3 sm:px-5 py-3 border-b border-white/5 bg-primary-900/20">
        <div className="flex items-center gap-2">
          <span className="text-primary-600 text-xs font-mono">$</span>
          <span className="text-xs font-mono text-primary-300">
            npm install express lodash ev1l-logger node-fetch
          </span>
        </div>
      </div>

      {/* Package list */}
      <div className="flex flex-col">
        {packages.map((pkg, i) => (
          <div
            key={pkg.name}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 transition-all duration-300 ${
              i < packages.length - 1 ? "border-b border-white/3" : ""
            } ${pkg.status === "blocked" ? "bg-red-950/20" : ""}`}
          >
            {/* Status icon */}
            <div className="shrink-0 w-4 h-4 flex items-center justify-center">
              {pkg.status === "checking" ? (
                <div className="w-3 h-3 border border-primary-500 border-t-white rounded-full animate-spin" />
              ) : pkg.status === "allowed" ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : pkg.status === "blocked" ? (
                <Close className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-primary-700" />
              )}
            </div>

            {/* Package info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${pkg.status === "blocked" ? "text-red-300" : "text-white"}`}
                >
                  {pkg.name}
                </span>
                <span className="text-[11px] text-primary-600 font-mono">
                  {pkg.version}
                </span>
              </div>
              {pkg.status === "blocked" && pkg.alerts.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  {pkg.alerts.map((alert) => (
                    <span
                      key={alert}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${riskBg[pkg.risk]}`}
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Score */}
            <div className="shrink-0 hidden sm:block">
              <ScoreBar score={pkg.score} status={pkg.status} />
            </div>

            {/* Status badge */}
            <div className="shrink-0">
              {pkg.status === "allowed" && (
                <span className="text-[11px] text-green-300 bg-green-900/40 rounded-full px-2 py-0.5">
                  Allowed
                </span>
              )}
              {pkg.status === "blocked" && (
                <span className="text-[11px] text-red-300 bg-red-900/40 rounded-full px-2 py-0.5">
                  Blocked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer summary */}
      {!checking && hasRun && (
        <div className="px-3 sm:px-5 py-3 border-t border-white/5 bg-primary-900/20">
          <div className="flex items-center gap-3 text-[11px]">
            {blocked > 0 && (
              <span className="text-red-400">
                {blocked} blocked
              </span>
            )}
            {allowed > 0 && (
              <span className="text-green-400">
                {allowed} allowed
              </span>
            )}
            {blocked > 0 && (
              <>
                <span className="text-primary-600">·</span>
                <span className="text-primary-500">
                  Install command denied
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
