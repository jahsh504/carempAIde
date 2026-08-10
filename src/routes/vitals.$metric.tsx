import { createFileRoute } from "@tanstack/react-router";
import { vitals, type VitalKey } from "@/data/mock";
import { Card, SectionHeader, Sparkline, TrendBadge, StatusChip } from "@/components/care/primitives";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vitals/$metric")({
  head: ({ params }) => {
    const v = vitals[params.metric as VitalKey];
    return { meta: [{ title: `${v?.label ?? "Vital"} — careMP` }, { name: "description", content: `${v?.label ?? "Vital"} trend and insights.` }] };
  },
  component: VitalDetail,
});

const readings = [
  { time: "Today 7:12 AM", value: "68 bpm" },
  { time: "Yesterday 7:04 AM", value: "70 bpm" },
  { time: "2 days ago", value: "69 bpm" },
  { time: "3 days ago", value: "71 bpm" },
  { time: "4 days ago", value: "70 bpm" },
];

function VitalDetail() {
  const { metric } = Route.useParams();
  const v = vitals[metric as VitalKey] ?? vitals["heart-rate"];
  const [range, setRange] = useState(1);
  return (
    <div className="px-4 pb-6 space-y-4">
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{v.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="num text-4xl font-semibold">{v.value}</span>
              <span className="text-xs text-muted-foreground">{v.unit}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusChip status={v.status}>{v.context}</StatusChip>
              <TrendBadge value={v.trend} />
            </div>
          </div>
        </div>
        <div className="mt-4"><Sparkline data={v.series} width={360} height={100} color="var(--teal)" /></div>
        <div className="mt-3 flex gap-1.5">
          {["Day", "Week", "Month", "Year"].map((t, i) => (
            <button key={t} onClick={() => setRange(i)} className={cn("flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium",
              range === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{t}</button>
          ))}
        </div>
      </Card>

      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">AI insight</p>
        <p className="mt-2 text-sm">Your {v.label.toLowerCase()} shows a healthy downward trend after 3 weeks of consistent sleep. Keep your evening routine — it's the single biggest driver right now.</p>
      </Card>

      <SectionHeader title="Recent readings" />
      <Card className="p-0">
        {readings.map((r, i, a) => (
          <div key={i} className={cn("flex items-center justify-between px-4 py-3", i < a.length - 1 && "border-b border-border")}>
            <span className="text-xs text-muted-foreground">{r.time}</span>
            <span className="num text-sm font-semibold">{r.value}</span>
          </div>
        ))}
      </Card>

      <SectionHeader title="Recommendations" />
      <div className="space-y-2">
        {["Continue evening walks — 6 of 7 days completed", "Cut caffeine after 3 PM", "Hydrate before bed (300 ml)"].map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-3 text-sm">{r}</div>
        ))}
      </div>
    </div>
  );
}
