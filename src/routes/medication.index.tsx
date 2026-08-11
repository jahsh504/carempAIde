import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pill, Plus, PackageCheck, Stethoscope, History, ChevronRight, Check, Sparkles, CalendarCheck, X, Calendar } from "lucide-react";
import { Card, SectionHeader, RingProgress } from "@/components/care/primitives";
import { useSchedule, takeMedication, toggleMedication, formatRemaining, todayLabel } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/")({
  head: () => ({
    meta: [
      { title: "Medication — Doses, refills and adherence | careMP AIDE" },
      { name: "description", content: "Track today's medication schedule, take your next dose, manage refills and review adherence history." },
      { property: "og:title", content: "Medication — Doses, refills and adherence | careMP AIDE" },
      { property: "og:description", content: "One calm view of today's doses, refills and medication history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MedicationHome,
});

const quickActions = [
  { to: "/medication/add", label: "Add Medication", icon: Plus },
  { to: "/medication/refills", label: "Refill Reminders", icon: PackageCheck },
  { to: "/medication/reminders", label: "AI Smart Reminder", icon: Sparkles },
  { to: "/medication/course", label: "Course Completion", icon: CalendarCheck },
  { to: "/medication/review", label: "Doctor Review Reminder", icon: Stethoscope },
  { to: "/medication/history", label: "Medication History", icon: History },
] as const;

function MedicationHome() {
  const schedule = useSchedule();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const done = schedule.filter((m) => m.taken).length;
  const pct = Math.round((done / schedule.length) * 100);
  const next = schedule.find((m) => !m.taken);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Medication</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Your doses for today, kept simple and on time.
        </p>
      </div>

      {/* Today's progress */}
      <Card>
        <div className="flex items-center gap-4">
          <RingProgress value={pct} size={72} stroke={7}>
            <span className="num text-[15px] font-semibold">{done}/{schedule.length}</span>
          </RingProgress>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Today's progress</p>
            <p className="mt-0.5 text-[15px] font-semibold">{done} of {schedule.length} medications completed</p>
            
          </div>
        </div>
      </Card>

      {/* Next medication */}
      {next ? (
        <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">Next medication</p>
          <div className="mt-2.5 flex items-center gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal/10 text-teal"><Pill className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold">{next.name}</p>
              <p className="text-[11.5px] text-muted-foreground">{next.dosage} · {next.food}</p>
              <p className="mt-0.5 text-[11.5px] font-medium text-teal">{formatRemaining(next.minutesFromNow)}</p>
            </div>
          </div>
          <button
            onClick={() => takeMedication(next.id)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Check className="h-4 w-4" strokeWidth={3} /> Take Now
          </button>
        </Card>
      ) : (
        <Card className="border-emerald/20 bg-emerald/5">
          <p className="text-[13px] font-medium text-emerald">All medications completed for today.</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Your Twin will factor this into tomorrow's plan.</p>
        </Card>
      )}

      {/* Today's schedule */}
      <div>
        <SectionHeader title="Today's medication schedule" hint={todayLabel} />
        <Card className="p-0">
          {schedule.map((m, i) => (
            <button
              key={m.id}
              onClick={() => toggleMedication(m.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-left",
                i < schedule.length - 1 && "border-b border-border"
              )}
            >
              <span className="num w-[64px] shrink-0 text-[11.5px] text-muted-foreground">{m.time}</span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[13.5px] font-medium", m.taken && "text-muted-foreground line-through")}>{m.name}</span>
                <span className="block text-[11px] text-muted-foreground">{m.dosage} · {m.when}</span>
              </span>
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                  m.taken ? "border-transparent bg-gradient-to-br from-emerald to-teal text-white" : "border-border"
                )}
              >
                {m.taken && <Check className="h-3 w-3" strokeWidth={4} />}
              </span>
            </button>
          ))}
        </Card>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full border border-border px-4 py-2.5 text-[12.5px] font-medium active:scale-[0.98]"
        >
          View Full Schedule <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Today's Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setShowScheduleModal(false)}
          />
          <div className="relative z-10 w-full max-w-[440px] max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-card p-5 soft-shadow rise-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-[17px] font-semibold">Today's medications</h3>
                <p className="text-[11.5px] text-muted-foreground">{todayLabel}</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {schedule.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border bg-muted/30 p-3.5">
                  <span className="num block text-[11.5px] font-semibold text-teal uppercase tracking-wider">{m.time}</span>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">
                        {m.name} {m.name === "Metformin" ? "500mg" : m.name === "Amlodipine" ? "5mg" : m.name === "Atorvastatin" ? "20mg" : ""}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {m.dosage} {m.food && m.food !== "Anytime" ? `· ${m.food}` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[12px] font-semibold",
                        m.taken
                          ? "border-transparent bg-gradient-to-br from-emerald to-teal text-white"
                          : "border-border text-muted-foreground bg-card"
                      )}
                    >
                      {m.taken ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : "○"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowScheduleModal(false)}
              className="mt-5 w-full rounded-full bg-primary py-2.5 text-[13.5px] font-semibold text-primary-foreground active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <SectionHeader title="Quick actions" />
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3.5 active:scale-[0.98]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal/10 text-teal"><a.icon className="h-4 w-4" /></span>
              <span className="text-[12.5px] font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
