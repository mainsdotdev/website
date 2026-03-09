"use client";

import { useRef, useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

const TOOL_DATA = [
  { name: "Read", count: 67, color: "#6384e6" },
  { name: "Edit", count: 49, color: "#9b7ee8" },
  { name: "ToolSearch", count: 12, color: "#c4955a" },
  { name: "Glob", count: 7, color: "#5aadad" },
  { name: "Write", count: 6, color: "#6abf6a" },
  { name: "Grep", count: 3, color: "#d4a054" },
  { name: "mcp__jinz...", count: 2, color: "#e8a070" },
  { name: "mcp__jinz...", count: 1, color: "#7a8ae8" },
  { name: "mcp__jinz...", count: 1, color: "#7a8ae8" },
];

const MODEL_DATA = [
  { name: "claude-opus-4-6", cost: 10.08, pct: 82, color: "#c4734a" },
  { name: "claude-sonnet-4-6", cost: 2.14, pct: 18, color: "#6384e6" },
];

const DAILY_RUNS = [
  { day: "Mon", succeeded: 3, failed: 0, cancelled: 0 },
  { day: "Tue", succeeded: 5, failed: 1, cancelled: 0 },
  { day: "Wed", succeeded: 4, failed: 0, cancelled: 1 },
  { day: "Thu", succeeded: 6, failed: 0, cancelled: 0 },
  { day: "Fri", succeeded: 7, failed: 1, cancelled: 0 },
  { day: "Sat", succeeded: 8, failed: 0, cancelled: 1 },
  { day: "Sun", succeeded: 2, failed: 0, cancelled: 0 },
];

const SESSIONS = [
  { title: "Add Visual Status Section", workspace: "true-laurel", model: "Opus 4.6", duration: "12m 27s", cost: "$8.481" },
  { title: "Add new use case item", workspace: "true-laurel", model: "Opus 4.6", duration: "47s", cost: "$0.157" },
  { title: "Create Review Section Component", workspace: "true-laurel", model: "Opus 4.6", duration: "50s", cost: "$0.166" },
  { title: "Review Workspace Code Changes", workspace: "true-laurel", model: "Opus 4.6", duration: "1m 40s", cost: "$0.176" },
  { title: "Refactor Tab Component Variants", workspace: "jinzo-app", model: "Sonnet 4.6", duration: "2m 12s", cost: "$0.342" },
  { title: "Fix Auth Redirect Loop", workspace: "jinzo-app", model: "Opus 4.6", duration: "5m 03s", cost: "$2.891" },
];

const SUMMARY_DATA = [
  { value: 3, label: "Projects" },
  { value: 0, label: "Runs Today" },
  { value: 12, label: "Total Sessions" },
  { value: 12.13, label: "Est. Cost", prefix: "$" },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function CardWrapper({ children, className = "", fill = false }: { children: React.ReactNode; className?: string; fill?: boolean }) {
  return (
    <div className={`bg-primary-950 border border-white/5 rounded-xl p-5 ${fill ? "flex flex-col" : ""} ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon, title, trailing }: { icon: React.ReactNode; title: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-primary-400 text-sm font-medium">
        {icon}
        {title}
      </div>
      {trailing && <span className="text-primary-500 text-xs">{trailing}</span>}
    </div>
  );
}

function CostByModelCard() {
  const { ref, visible } = useInView();
  return (
    <CardWrapper>
      <CardHeader
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5S12.33 11 11.5 11h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5"/></svg>}
        title="Cost by Model"
      />
      <div ref={ref} className="space-y-3">
        {MODEL_DATA.map((m, i) => (
          <div key={m.name} className="flex items-center gap-3">
            <span className="text-primary-300 text-xs w-36 shrink-0 truncate font-mono">{m.name}</span>
            <div className="flex-1 h-5 bg-primary-900/50 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-700 ease-out"
                style={{
                  width: visible ? `${m.pct}%` : "0%",
                  backgroundColor: m.color,
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
            <span className="text-primary-200 text-xs font-mono w-14 text-right">${m.cost.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

function TopToolsCard() {
  const { ref, visible } = useInView();
  const max = TOOL_DATA[0].count;
  return (
    <CardWrapper>
      <CardHeader
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>}
        title="Top Tools"
      />
      <div ref={ref} className="flex items-end gap-1.5 h-44 overflow-x-auto pb-1">
        {TOOL_DATA.map((t, i) => (
          <div key={`${t.name}-${i}`} className="flex flex-col items-center gap-1 min-w-0 flex-1">
            <span className={`text-primary-400 text-[10px] font-mono transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${i * 60 + 400}ms` }}>{t.count}</span>
            <div
              className="w-full min-w-6 rounded-t transition-all duration-700 ease-out"
              style={{
                height: visible ? `${(t.count / max) * 130}px` : "0px",
                backgroundColor: t.color,
                transitionDelay: `${i * 60}ms`,
              }}
            />
            <span className="text-primary-500 text-[10px] truncate w-full text-center">{t.name}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

function SuccessRateCard() {
  const { ref, visible } = useInView();
  const totalSucceeded = DAILY_RUNS.reduce((a, d) => a + d.succeeded, 0);
  const totalFailed = DAILY_RUNS.reduce((a, d) => a + d.failed, 0);
  const totalCancelled = DAILY_RUNS.reduce((a, d) => a + d.cancelled, 0);
  const total = totalSucceeded + totalFailed + totalCancelled;
  const rate = Math.round((totalSucceeded / total) * 100);
  const maxRuns = Math.max(...DAILY_RUNS.map((d) => d.succeeded + d.failed + d.cancelled));

  return (
    <CardWrapper fill>
      <CardHeader
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>}
        title="Success Rate"
        trailing={`${total} runs this week`}
      />
      <p className="text-white text-4xl font-bold mb-4">{rate}%</p>
      <div ref={ref} className="flex items-end gap-2 flex-1 min-h-24 mb-3">
        {DAILY_RUNS.map((d, i) => {
          const totalDay = d.succeeded + d.failed + d.cancelled;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div
                className="w-full flex flex-col-reverse rounded-md overflow-hidden transition-all duration-700 ease-out"
                style={{
                  height: visible ? `${(totalDay / maxRuns) * 100}%` : "0%",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {d.succeeded > 0 && (
                  <div style={{ flex: d.succeeded, backgroundColor: "#6aef6a" }} />
                )}
                {d.failed > 0 && (
                  <div style={{ flex: d.failed, backgroundColor: "#ef4444" }} />
                )}
                {d.cancelled > 0 && (
                  <div style={{ flex: d.cancelled, backgroundColor: "#888" }} />
                )}
              </div>
              <span className="text-primary-600 text-[10px] shrink-0">{d.day}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-primary-400 shrink-0">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6aef6a]" />Succeeded {totalSucceeded}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Failed {totalFailed}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" />Cancelled {totalCancelled}</span>
      </div>
    </CardWrapper>
  );
}

function RecentSessionsCard() {
  return (
    <CardWrapper>
      <CardHeader
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>}
        title="Recent Sessions"
      />
      <div className="space-y-0 -mx-1">
        {SESSIONS.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-primary-900/30 transition-colors">
            <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-primary-200 text-xs font-medium truncate">{s.title}</p>
              <p className="text-primary-500 text-[11px]">{s.workspace}&ensp;{s.model}</p>
            </div>
            <span className="text-primary-400 text-xs font-mono shrink-0">{s.duration}</span>
            <span className="text-primary-300 text-xs font-mono shrink-0 w-14 text-right">{s.cost}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

function SummaryRow() {
  const { ref, visible } = useInView();

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {SUMMARY_DATA.map((s) => (
        <div key={s.label} className="bg-primary-950 border border-white/5 rounded-xl flex flex-col items-center justify-center py-5">
          <p className="text-white text-2xl font-bold font-mono">
            <NumberFlow
              value={visible ? s.value : 0}
              prefix={s.prefix}
              format={s.prefix === "$" ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : undefined}
              transformTiming={{ duration: 800, easing: "ease-out" }}
            />
          </p>
          <p className="text-primary-500 text-xs mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="flex flex-col gap-3">
      <SummaryRow />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CostByModelCard />
        <TopToolsCard />
        <SuccessRateCard />
        <RecentSessionsCard />
      </div>
    </div>
  );
}
