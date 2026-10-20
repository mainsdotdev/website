"use client";

import { Fragment, useState } from "react";
import { NavigationRail, type IconComponent } from "@/components/demo/navigation-rail";
import { ScaleToFit } from "@/components/demo/scale-to-fit";
import {
  Archive,
  Bell,
  Bridge,
  Chart,
  ClaudeMark,
  Codex,
  Connect,
  Copilot,
  Cursor,
  DeviceDesktop,
  DeviceLaptop,
  FolderGit,
  Keyboard,
  ProjectFolder,
  Settings,
  SidebarClose,
  Sun,
  View,
} from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Settings › Bridge as the app draws it: `SettingsView` in the sidebar and the
 * Bridge page's `SettingsSection` / `SettingsRow` cards. Sizes follow the
 * site's window mockups, which draw the app at about 0.7 of its real size.
 */

type NavItem = { label: string; icon: IconComponent; active?: boolean };

// `SETTINGS_MAIN_NAV_ITEMS` and `SETTINGS_PROVIDER_NAV_ITEMS` on macOS.
const MAIN_NAV: NavItem[] = [
  { label: "General", icon: Settings },
  { label: "Appearance", icon: Sun },
  { label: "Notifications", icon: Bell },
  { label: "Git", icon: FolderGit },
  { label: "Lens", icon: View },
  { label: "Keyboard Shortcuts", icon: Keyboard },
  { label: "Connections", icon: Connect },
  { label: "Bridge", icon: Bridge, active: true },
  { label: "Dashboard", icon: Chart },
  { label: "Archive", icon: Archive },
];

const PROVIDER_NAV: NavItem[] = [
  { label: "Claude", icon: ClaudeMark },
  { label: "Codex", icon: Codex },
  { label: "Copilot", icon: Copilot },
  { label: "Cursor", icon: Cursor },
];

const DEVICES = [
  { label: "MacBook Pro", icon: DeviceLaptop, current: true, details: "macOS · Approved" },
  { label: "Mac Studio", icon: DeviceDesktop, details: "macOS · Approved · Last seen Oct 16, 2:38 PM" },
  { label: "Office Mac mini", icon: DeviceDesktop, details: "macOS · Approved · Last seen Oct 15, 6:12 PM" },
];

const INITIAL_PROJECTS = [
  { name: "website", workspaces: 3, chats: 18, synced: true },
  { name: "research", workspaces: 1, chats: 9, synced: true },
  { name: "client-portal", workspaces: 2, chats: 12, synced: false },
];

// `UsageTicks`: 24 ticks, filled by storage used, accent while over half is left.
const TICK_COUNT = 24;
const USED_PERCENT = 18;

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

function NavButton({ item: { label, icon: Icon, active } }: { item: NavItem }) {
  return (
    <span
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px]",
        active ? "glass-outline bg-primary-50/5 text-primary-100" : "text-primary-200",
      )}
    >
      <Icon className="size-3 shrink-0" />
      {label}
    </span>
  );
}

/** The app's `SettingsView`, which replaces the sidebar while settings are open. */
function SettingsSidebar({ projects }: { projects: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col pr-2 pb-2 pl-1">
      <p className="px-1.5 pb-2 text-xs font-medium tracking-tight text-primary-100">Settings</p>
      <nav aria-label="Settings" className="flex flex-col gap-px">
        {MAIN_NAV.map((item) => <NavButton key={item.label} item={item} />)}
      </nav>
      <p className="mt-2 mb-1 px-1.5 text-[9px] text-primary-100">Providers</p>
      <div className="flex flex-col gap-px">
        {PROVIDER_NAV.map((item) => <NavButton key={item.label} item={item} />)}
      </div>
      <p className="mt-2 mb-1 px-1.5 text-[9px] text-primary-100">Projects</p>
      <div className="flex flex-col gap-px">
        {projects.map((name) => <NavButton key={name} item={{ label: name, icon: ProjectFolder }} />)}
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="mb-7">
      <h4 className="mb-2 text-[10px] text-primary-100">{title}</h4>
      <div className="rounded-2xl glass-card px-4 py-1">{children}</div>
    </section>
  );
}

function SettingsRow({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[10px] text-primary-100">{title}</p>
        {description && <p className="text-[8.5px] text-primary-300">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/** `Button` variants as the app's glass utilities draw them. */
function DemoButton({ variant, className, children }: { variant: "secondary" | "danger"; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-2 py-1 text-[9.5px] font-medium text-primary",
        variant === "danger" ? "glass-danger" : "glass-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Toggle({ enabled, label, onChange }: { enabled: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-3.5 w-8.5 shrink-0 cursor-pointer items-center rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent,#2563eb)",
        enabled ? "bg-(--color-accent,#2563eb)" : "glass-toggle",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block h-3 w-4.5 rounded-full bg-primary-100 shadow-sm transition-transform motion-reduce:transition-none",
          enabled ? "translate-x-[15px]" : "translate-x-px",
        )}
      />
    </button>
  );
}

/** The Bridge settings page: `PageShell`, `SettingsPageShell` and its sections. */
function BridgeSettingsPage({ projects, onToggle }: { projects: typeof INITIAL_PROJECTS; onToggle: (name: string) => void }) {
  const filled = Math.max(1, Math.round((USED_PERCENT / 100) * TICK_COUNT));

  return (
    <div className="mx-auto h-full max-w-[690px] overflow-y-auto px-1.5 pt-11 pb-12 noscrollbar">
      <h3 className="mb-3 text-[14px] text-primary-100">Bridge</h3>

      <SettingsSection title="Account">
        <SettingsRow title="ada@example.com" description="Last synced Oct 16, 2026, 2:41 PM">
          <DemoButton variant="danger">Disconnect</DemoButton>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Storage">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[10px] font-medium text-primary-100">Storage used</span>
            <span className="text-[8.5px] text-primary-400">Up to 50 MiB per file</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div
              role="meter"
              aria-label="Bridge storage used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={USED_PERCENT}
              aria-valuetext="184 MiB of 1 GiB used"
              className="flex items-center gap-[3.5px]"
            >
              {Array.from({ length: TICK_COUNT }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2.5 w-[2px] rounded-full",
                    index < filled ? "bg-(--color-accent,#2563eb)" : "bg-primary-600/50",
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] whitespace-nowrap text-primary-400 tabular-nums">184 MiB / 1 GiB</span>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Recovery code">
        <div className="flex items-start justify-between gap-4 py-3">
          <p className="min-w-0 flex-1 text-[10px] text-primary-300">
            Save this code in your password manager. You’ll need it if you lose access to every approved device.
          </p>
          <DemoButton variant="secondary" className="w-34 shrink-0">New recovery code</DemoButton>
        </div>
      </SettingsSection>

      <SettingsSection title="Devices">
        <ul aria-label="Bridge devices" className="divide-y divide-primary-800/20">
          {DEVICES.map(({ label, icon: Icon, current, details }) => (
            <li key={label} className="flex items-center gap-2 py-2">
              <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-primary-800/40 text-primary-400">
                <Icon aria-hidden className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-primary-100">{label}</span>
                  {current && (
                    <span className="rounded-md bg-primary-800/40 px-1 py-px text-[8px] text-primary-400">This device</span>
                  )}
                </div>
                <p className="mt-0.5 text-[8.5px] text-primary-400">{details}</p>
              </div>
              {!current && <DemoButton variant="secondary">Revoke access</DemoButton>}
            </li>
          ))}
        </ul>
      </SettingsSection>

      <SettingsSection title="Project sync">
        <p className="max-w-md pt-2 pb-3 text-[8.5px] text-primary-300">
          Sync workspaces and chats from MacBook Pro. When off, new changes stay local; existing copies on other devices are kept.
        </p>
        <div className="border-b border-primary-800/20" />
        {projects.map((project, index) => (
          <Fragment key={project.name}>
            {index > 0 && <div className="border-b border-primary-800/20" />}
            <SettingsRow
              title={project.name}
              description={`${plural(project.workspaces, "workspace")} · ${plural(project.chats, "chat")}`}
            >
              <Toggle
                enabled={project.synced}
                label={`Sync ${project.name}`}
                onChange={() => onToggle(project.name)}
              />
            </SettingsRow>
          </Fragment>
        ))}
      </SettingsSection>
    </div>
  );
}

/** The size the mockup is drawn at; ScaleToFit fits it to the container. */
const DESIGN_WIDTH = 1152;
const DESIGN_HEIGHT = 648;

export function BridgeSettingsDemo() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const toggle = (name: string) =>
    setProjects((current) =>
      current.map((project) => (project.name === name ? { ...project, synced: !project.synced } : project)),
    );

  return (
    <ScaleToFit
      designWidth={DESIGN_WIDTH}
      designHeight={DESIGN_HEIGHT}
    >
      <div className="relative h-full w-full bg-primary-950">
        <div
          role="group"
          aria-label="Settings › Bridge in the Mains desktop app"
          className="absolute inset-0 overflow-hidden text-left text-primary-200 select-none glass-outline"
        >
          <div className="relative flex h-full flex-col bg-(--demo-chrome-translucent) backdrop-blur-2xl">
            <div className="flex w-52 shrink-0 items-center gap-3 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <SidebarClose className="size-3.5 text-primary-200" />
            </div>

            <div className="flex min-h-0 flex-1">
              <aside className="flex w-52 shrink-0">
                <NavigationRail activeLabel="Settings" />
                <SettingsSidebar projects={projects.map((project) => project.name)} />
              </aside>

              <div className="mr-1 mb-1 flex min-w-0 flex-1 overflow-hidden rounded-xl bg-(--demo-content)">
                <BridgeSettingsPage projects={projects} onToggle={toggle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaleToFit>
  );
}
