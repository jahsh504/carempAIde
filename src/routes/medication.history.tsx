import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { historyByRange, pastMedications } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/history")({
  head: () => ({
    meta: [
      { title: "Medication History — Adherence & Past Medications | careMP AIDE" },
      { name: "description", content: "Review your completed and missed doses by day, week or month, and view past treatment courses." },
      { property: "og:title", content: "Medication History — Adherence & Past Medications | careMP AIDE" },
      { property: "og:description", content: "A clear historical record of active adherence and past medications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MedicationHistoryPage,
});

const ranges = ["day", "week", "month"] as const;

function MedicationHistoryPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("day");
  const groups = historyByRange[range];

  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Medication History</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Historical record of active adherence and past medication courses.
        </p>
      </div>

      {/* Current Medications Adherence */}
      <div className="space-y-4">
        <SectionHeader title="Current medications" hint="Adherence history" />

        <div className="flex rounded-full border border-border bg-card p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "flex-1 rounded-full py-1.5 text-[12.5px] font-medium capitalize transition-colors",
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="mb-2 px-1 text-[12px] font-medium text-muted-foreground">{g.label}</p>
              <Card className="p-0">
                {g.entries.map((e, i) => (
                  <div key={e.time + e.name} className={cn("flex items-center gap-3 px-4 py-3.5", i < g.entries.length - 1 && "border-b border-border")}>
                    <span className="num w-[92px] shrink-0 text-[11.5px] text-muted-foreground">{e.time}</span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px]">{e.name}</span>
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                        e.done ? "bg-gradient-to-br from-emerald to-teal text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {e.done ? <Check className="h-3 w-3" strokeWidth={4} /> : <X className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Past Medications */}
      <div className="space-y-3 pt-2">
        <SectionHeader title="Past medications" hint="Discontinued or completed courses" />
        <Card className="p-0">
          {pastMedications.map((pm, i) => (
            <div
              key={pm.id}
              className={cn("p-4", i < pastMedications.length - 1 && "border-b border-border")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[14.5px] font-semibold text-foreground">{pm.name}</h3>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{pm.dosage}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium shrink-0",
                    pm.status === "Completed course"
                      ? "bg-emerald/10 text-emerald"
                      : "bg-coral/10 text-coral"
                  )}
                >
                  {pm.status === "Completed course" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {pm.status}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {pm.whenTaken}
                </span>
                {pm.courseDuration && <span>{pm.courseDuration}</span>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
