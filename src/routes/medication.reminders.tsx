import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Check, Search, Pill } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { smartReminder, useSchedule } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/reminders")({
  head: () => ({
    meta: [
      { title: "AI Smart Reminder — Adaptive dose nudges | careMP AIDE" },
      { name: "description", content: "Reminders that adapt to when you actually take your medication, escalating gently if you forget." },
      { property: "og:title", content: "AI Smart Reminder — Adaptive dose nudges | careMP AIDE" },
      { property: "og:description", content: "Adaptive medication reminders based on your own routine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartReminderPage,
});

function SmartReminderPage() {
  const schedule = useSchedule();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(schedule[0]?.id || "m1");

  const { timeline, forgetRate, forgetLabel, forgetNote, note } = smartReminder;

  const filteredMeds = schedule.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMed = schedule.find((m) => m.id === selectedId) || schedule[0] || {
    name: "Metformin",
    dosage: "500mg",
    food: "After food",
    when: "1 tablet · After food",
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">AI Smart Reminder</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Reminders that learn from how you actually take your doses.
        </p>
      </div>

      {/* Medication search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications..."
            className="w-full rounded-2xl border border-border bg-card pl-9 pr-4 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-teal"
          />
        </div>
        {searchQuery.trim() !== "" && filteredMeds.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card soft-shadow">
            {filteredMeds.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedId(m.id);
                  setSearchQuery("");
                }}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] hover:bg-muted"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-[11px] text-muted-foreground">{m.dosage}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected medication card */}
      <Card className="border-teal/20 bg-card">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Medication</p>
        <div className="mt-2 flex items-center gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal/10 text-teal">
            <Pill className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-tight">{selectedMed.name} {selectedMed.name === "Metformin" ? "500mg" : ""}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{selectedMed.dosage} · {selectedMed.food}</p>
          </div>
        </div>
      </Card>

      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal/10 text-teal">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">AI Smart Reminder</p>
            <p className="mt-1.5 text-[13px] leading-relaxed">{note}</p>
          </div>
        </div>
      </Card>

      <div>
        <SectionHeader title="Reminder timeline" hint="Today" />
        <Card className="p-0">
          {timeline.map((t, i) => (
            <div key={t.time} className={cn("flex items-center gap-3 px-4 py-3.5", i < timeline.length - 1 && "border-b border-border")}>
              <span className="num w-[68px] shrink-0 text-[11.5px] text-muted-foreground">{t.time}</span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{t.label}</span>
              {t.sent ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald">
                  <Check className="h-3 w-3" strokeWidth={4} /> Sent
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">Pending</span>
              )}
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Forget rate</p>
            <p className="num mt-1 text-[26px] font-semibold leading-none">{forgetRate}%</p>
            <p className="mt-2 text-[12px] text-muted-foreground">{forgetNote}</p>
          </div>
          <span className="rounded-full bg-emerald/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald">{forgetLabel}</span>
        </div>
      </Card>
    </div>
  );
}
