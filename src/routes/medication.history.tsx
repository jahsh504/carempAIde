import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { historyByRange } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/history")({
  head: () => ({
    meta: [
      { title: "Medication History — Adherence timeline | careMP AIDE" },
      { name: "description", content: "Review your completed and missed doses by day, week or month." },
      { property: "og:title", content: "Medication History — Adherence timeline | careMP AIDE" },
      { property: "og:description", content: "A clear timeline of every dose you've taken." },
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
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Medication History</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">Every dose, kept in one place.</p>
      </div>

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
            <SectionHeader title={g.label} />
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
  );
}
