import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock, MessageSquare, ChevronRight, Check, Sparkles, ShieldCheck,
  Siren, HandHeart, Clock,
} from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import {
  primaryCaregiver, journeyCopy, journeyOrder, todaysCare, recentActivity,
  careTeamSummary, caregiverNote, type JourneyState,
} from "@/data/care-team";
import { useCareRequest, type RequestStatus } from "@/data/find-caregiver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care-team/")({
  head: () => ({
    meta: [
      { title: "Care Team — Who is caring for you today | careMP AIDE" },
      { name: "description", content: "See your assigned caregiver, their journey to your home, today's planned care, and a live activity timeline." },
      { property: "og:title", content: "Care Team — Who is caring for you today | careMP AIDE" },
      { property: "og:description", content: "Your caregiver, their journey, today's care checklist and activity — in one calm view." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareTeamPage,
});

const toneRing: Record<string, string> = {
  muted: "text-muted-foreground bg-muted",
  blue: "text-blue bg-blue/10",
  amber: "text-amber bg-amber/15",
  emerald: "text-emerald bg-emerald/10",
};

function elapsedFrom(startMinutes: number) {
  const h = Math.floor(startMinutes / 60);
  const m = startMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const requestStatusLabel: Record<RequestStatus, string> = {
  "Request Sent": "Waiting for confirmation",
  Accepted: "Accepted",
  "Started Journey": "On the Way",
  Arriving: "Arriving",
  "Checked In": "Checked In",
  "Visit In Progress": "Visit in Progress",
  "Visit Completed": "Completed",
};

const requestToJourney: Record<RequestStatus, JourneyState> = {
  "Request Sent": "assigned",
  Accepted: "assigned",
  "Started Journey": "traveling",
  Arriving: "arrived",
  "Checked In": "checked-in",
  "Visit In Progress": "in-visit",
  "Visit Completed": "completed",
};

function CareTeamPage() {
  const activeRequest = useCareRequest();
  const [state, setState] = useState<JourneyState>("in-visit");
  const [items, setItems] = useState(todaysCare);
  const [elapsed, setElapsed] = useState(83);

  useEffect(() => {
    if (state !== "in-visit") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 60000);
    return () => clearInterval(t);
  }, [state]);

  const journeyState = activeRequest ? requestToJourney[activeRequest.status] : state;
  const copy = journeyCopy[journeyState];
  const idx = journeyOrder.indexOf(journeyState);
  const nextState = journeyOrder[(idx + 1) % journeyOrder.length];
  const done = items.filter((i) => i.done).length;

  const grouped = useMemo(() => {
    const days = ["Today", "Yesterday"] as const;
    return days.map((d) => ({ day: d, entries: recentActivity.filter((e) => e.day === d) }));
  }, []);

  return (
    <div className="space-y-5 px-4 pb-6">
      {/* Hero — assigned caregiver */}
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-teal/30 blur-3xl breathing" />
          <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-blue/20 blur-3xl breathing [animation-delay:900ms]" />
        </div>
        <div className="relative">
          <p className="text-[10px] uppercase tracking-wider text-white/60">Caring for you today</p>
          <div className="mt-3 flex items-center gap-3.5">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-teal to-blue text-lg font-semibold text-white">
                {primaryCaregiver.initials}
              </div>
              {primaryCaregiver.online && (
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[color:var(--twin)] bg-emerald" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold">{primaryCaregiver.name}</h1>
              <p className="text-[12px] text-white/70">{primaryCaregiver.role}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> {primaryCaregiver.shift}
              </p>
            </div>
          </div>
          <p className="mt-2.5 text-[11px] text-white/60">{primaryCaregiver.availableUntil}</p>
          <div className="mt-4 flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-twin active:scale-[0.98]">
              <MessageSquare className="h-4 w-4" /> Message
            </button>
          </div>
        </div>
      </div>

      {/* Caregiver journey */}
      <div>
        <SectionHeader
          title="Caregiver journey"
          action={
            <button
              onClick={() => setState(nextState)}
              className="text-[11px] font-medium text-muted-foreground active:scale-95"
            >
              Next state ›
            </button>
          }
        />
        <Card>
          <div className="flex items-center justify-between">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", toneRing[copy.tone])}>
              <span className={cn("h-1.5 w-1.5 rounded-full bg-current", journeyState === "traveling" && "idle-pulse")} />
              {copy.badge}
            </span>
            {copy.detailValue && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{copy.detailLabel}</p>
                <p className="num text-sm font-semibold">{copy.detailValue}</p>
              </div>
            )}
          </div>
          <p key={copy.title} className="rise-in mt-3 text-[15px] font-semibold">{copy.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{copy.line}</p>

          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-blue transition-all duration-700"
              style={{ width: `${copy.progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Assigned</span><span>On the way</span><span>Arrived</span><span>Check-in</span><span>Done</span>
          </div>

          {(journeyState === "checked-in" || journeyState === "in-visit") && (
            <p className="mt-3 inline-flex items-start gap-1.5 rounded-2xl bg-emerald/5 px-3 py-2 text-[11px] leading-relaxed text-emerald">
              <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" />
              Check-in confirmed with secure verification.
            </p>
          )}

          {journeyState === "in-visit" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-muted/60 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Started at</p>
                <p className="num text-sm font-semibold">10:02 AM</p>
              </div>
              <div className="rounded-2xl bg-muted/60 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Elapsed</p>
                <p className="num text-sm font-semibold">{elapsedFrom(elapsed)}</p>
              </div>
            </div>
          )}

          {journeyState === "completed" && (
            <div className="mt-3 rounded-2xl bg-emerald/5 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-emerald">Caregiver note</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{caregiverNote}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Current care request / Quick actions */}
      <div>
        <SectionHeader title="Quick actions" />
        {activeRequest ? (
          <Link to="/care-team/request-sent" className="card-surface mb-2.5 flex items-center gap-3 p-3.5 active:scale-[0.99]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald">
              <HandHeart className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">Current Care Request</span>
              <span className="block text-[11px] text-muted-foreground">
                {activeRequest.caregiverName} · {requestStatusLabel[activeRequest.status]}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald idle-pulse" /> Live
            </span>
          </Link>
        ) : null}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Schedule Caregiver", icon: CalendarClock, tone: "bg-teal/10 text-teal", to: "/care-team/find" as const },
            { label: "Message", icon: MessageSquare, tone: "bg-blue/10 text-blue", to: null },
          ].map((a) => {
            const inner = (
              <>
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", a.tone)}>
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="text-[12px] font-medium leading-tight">{a.label}</span>
              </>
            );
            const cls = "card-surface flex items-center gap-2.5 p-3 text-left active:scale-[0.98]";
            return a.to ? (
              <Link key={a.label} to={a.to} className={cls}>{inner}</Link>
            ) : (
              <button key={a.label} className={cls}>{inner}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
