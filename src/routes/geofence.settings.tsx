import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geofence/settings")({
  head: () => ({
    meta: [
      { title: "Geofence Settings — careMP AIDE" },
      {
        name: "description",
        content:
          "Control indoor tracking, exit alerts, caregiver notifications, scan frequency and safe radius.",
      },
      { property: "og:title", content: "Geofence Settings — careMP AIDE" },
      {
        property: "og:description",
        content: "Tune indoor tracking and alerting to suit your household.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeofenceSettingsPage,
});

const toggles = [
  { id: "tracking", label: "Enable Indoor Tracking", hint: "Beacon-based room detection" },
  { id: "exit", label: "Enable Exit Alerts", hint: "Notify when a safe zone is left" },
  {
    id: "caregiver",
    label: "Enable Caregiver Notifications",
    hint: "Share alerts with the care team",
  },
];

const scanOptions = ["Every 5s", "Every 15s", "Every 30s"];
const radiusOptions = ["10 m", "25 m", "50 m"];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "h-4 w-4 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-full border border-border bg-card p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-full py-1.5 text-[12px] font-medium transition-colors",
            value === o ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function GeofenceSettingsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({
    tracking: true,
    exit: true,
    caregiver: true,
  });
  const [scan, setScan] = useState(scanOptions[1]);
  const [radius, setRadius] = useState(radiusOptions[1]);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Geofence Settings</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Tune how closely careMP watches, and who hears about it.
        </p>
      </div>

      <Card className="p-0">
        {toggles.map((t, i) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5",
              i < toggles.length - 1 && "border-b border-border",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium">{t.label}</span>
              <span className="block text-[11px] text-muted-foreground">{t.hint}</span>
            </span>
            <Toggle on={on[t.id]} onClick={() => setOn((s) => ({ ...s, [t.id]: !s[t.id] }))} />
          </div>
        ))}
      </Card>

      <div>
        <SectionHeader title="Beacon scan frequency" />
        <Segmented options={scanOptions} value={scan} onChange={setScan} />
      </div>

      <div>
        <SectionHeader title="Safe radius" />
        <Segmented options={radiusOptions} value={radius} onChange={setRadius} />
      </div>
    </div>
  );
}
