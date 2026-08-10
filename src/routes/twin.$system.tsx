import { createFileRoute } from "@tanstack/react-router";
import { bodySystems } from "@/data/mock";
import { Card, SectionHeader, Sparkline, TrendBadge } from "@/components/care/primitives";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/twin/$system")({
  head: ({ params }) => {
    const s = bodySystems.find((b) => b.key === params.system);
    return { meta: [{ title: `${s?.label ?? "System"} — Twin` }, { name: "description", content: `${s?.label ?? "Body system"} details in your Digital Twin.` }] };
  },
  component: SystemDetail,
});

function SystemDetail() {
  const { system } = Route.useParams();
  const s = bodySystems.find((b) => b.key === system) ?? bodySystems[0];
  const trend = [64, 68, 72, 70, 75, 78, s.score];
  const factors = [
    { good: true, text: "Consistent sleep midpoint (last 7 nights)" },
    { good: true, text: "Zone-2 cardio 3× this week" },
    { good: false, text: "Weekday evening stress spikes" },
    { good: false, text: "Fiber intake below 25g/day" },
  ];

  return (
    <div className="px-4 pb-6 space-y-4">
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <div className="flex items-end gap-2">
              <span className="num text-4xl font-semibold">{s.score}</span>
              <TrendBadge value={s.trend} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        </div>
        <div className="mt-4">
          <Sparkline data={trend} width={360} height={80} />
        </div>
        <div className="mt-3 flex gap-1.5">
          {["Day", "Week", "Month", "Year"].map((t, i) => (
            <button key={t} className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium ${i === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
      </Card>

      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">AI insight</p>
        <p className="mt-2 text-sm">Your {s.label.toLowerCase()} score has climbed steadily since starting a consistent morning routine. Protect your recovery this weekend to lock in the gains.</p>
      </Card>

      <div>
        <SectionHeader title="Contributing factors" />
        <div className="space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
              {f.good ? <CheckCircle2 className="h-4 w-4 text-emerald" /> : <AlertCircle className="h-4 w-4 text-amber" />}
              <span className="text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Recommendations" />
        <div className="space-y-2">
          {["Add a 10-minute breathwork session before bed", "Increase soluble fiber (oats, lentils, apples)", "Keep your Sunday recovery ritual — it's working"].map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-3 text-sm">{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
