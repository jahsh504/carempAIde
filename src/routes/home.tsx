import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart, Moon, Activity, Droplets, Droplet, Gauge, Pill, Calendar, Bell,
  ChevronDown, ChevronRight, Plus, Sparkles, UploadCloud, MessageCircle, Stethoscope, Check,
} from "lucide-react";
import {
  scores, insight, mission, medication, appointment, vitalsList, weeklyTrend, alerts, user,
} from "@/data/mock";
import {
  RadialScore, Sparkline, StatusChip, TrendBadge, BarChart, Card, SectionHeader, IconTile,
} from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — careMP" },
      { name: "description", content: "Your personalized health dashboard with vitals, insights, and today's wellness mission." },
    ],
  }),
  component: HomePage,
});

const iconMap = { "heart-rate": Heart, "blood-pressure": Gauge, sleep: Moon, activity: Activity, spo2: Droplets, glucose: Droplet } as const;

function HomePage() {
  const [insightOpen, setInsightOpen] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [medTaken, setMedTaken] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Hero score */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-teal/5 p-5 soft-shadow rise-in">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <RadialScore value={scores.overall} label="Health" size={148} />
          <div className="flex-1 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">How you're doing today</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Balanced & recovering</span>
              <TrendBadge value={scores.overallTrend} />
            </div>
            <div className="rounded-2xl bg-muted/60 px-3 py-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Recovery</span>
                <TrendBadge value={scores.recoveryTrend} />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="num text-2xl font-semibold">{scores.recovery}</span>
                <span className="text-[11px] text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI insight */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 via-card to-blue/5">
        <div className="flex gap-3">
          <IconTile tone="teal"><Sparkles className="h-4.5 w-4.5" /></IconTile>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-teal">Today's AI insight</p>
            <p className="mt-1 text-sm leading-relaxed">{insight.headline}</p>
            <button onClick={() => setInsightOpen((v) => !v)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
              {insightOpen ? "Hide" : "Why"} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", insightOpen && "rotate-180")} />
            </button>
            {insightOpen && (
              <p className="mt-2 rounded-xl bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground rise-in">
                {insight.why}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Mission */}
      <Card>
        <div className="flex items-center gap-3">
          <IconTile tone="emerald"><Activity className="h-4.5 w-4.5" /></IconTile>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Daily wellness mission</p>
            <p className={cn("text-sm font-medium", missionDone && "line-through text-muted-foreground")}>{mission.title}</p>
          </div>
          <button
            onClick={() => setMissionDone((v) => !v)}
            aria-label="Complete mission"
            className={cn("grid h-9 w-9 place-items-center rounded-full border-2 transition-all",
              missionDone ? "border-emerald bg-emerald text-white" : "border-border")}
          >
            {missionDone && <Check className="h-4 w-4" />}
          </button>
        </div>
      </Card>

      {/* Vitals grid */}
      <div>
        <SectionHeader title="Vitals" hint="Live from careMP Band · 8m ago" />
        <div className="grid grid-cols-2 gap-3">
          {vitalsList.map((v) => {
            const Icon = iconMap[v.key];
            return (
              <Link
                key={v.key}
                to="/vitals/$metric"
                params={{ metric: v.key }}
                className="card-surface block p-3 transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <IconTile tone={v.status === "good" ? "teal" : v.status === "caution" ? "amber" : "coral"}>
                    <Icon className="h-4 w-4" />
                  </IconTile>
                  <StatusChip status={v.status}>{v.status === "good" ? "Good" : v.status === "caution" ? "Watch" : "Alert"}</StatusChip>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{v.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="num text-xl font-semibold">{v.value}</span>
                  {v.unit && <span className="text-[11px] text-muted-foreground">{v.unit}</span>}
                </div>
                <div className="mt-1">
                  <Sparkline data={v.series} width={140} height={28} color={v.status === "caution" ? "var(--amber)" : "var(--teal)"} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Medication + Appointment */}
      <div className="grid grid-cols-1 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <IconTile tone="blue"><Pill className="h-4.5 w-4.5" /></IconTile>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Next medication</p>
              <p className="truncate text-sm font-medium">{medication.name} · {medication.dose}</p>
              <p className="text-xs text-muted-foreground">Today at {medication.time} · {medication.streak}-day streak</p>
            </div>
            <button
              onClick={() => setMedTaken(true)}
              disabled={medTaken}
              className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                medTaken ? "bg-emerald/15 text-emerald" : "bg-primary text-primary-foreground")}
            >
              {medTaken ? "Taken" : "Mark taken"}
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <IconTile tone="teal"><Calendar className="h-4.5 w-4.5" /></IconTile>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Upcoming appointment</p>
              <p className="truncate text-sm font-medium">{appointment.doctor} · {appointment.specialty}</p>
              <p className="text-xs text-muted-foreground">{appointment.when} · {appointment.location}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Alerts (collapsible, empty) */}
      <Card>
        <button className="flex w-full items-center gap-3" onClick={() => setAlertsOpen((v) => !v)}>
          <IconTile tone="amber"><Bell className="h-4.5 w-4.5" /></IconTile>
          <div className="flex-1 text-left">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Recent health alerts</p>
            <p className="text-sm font-medium">{alerts.length === 0 ? "No new alerts — nice." : `${alerts.length} to review`}</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", alertsOpen && "rotate-180")} />
        </button>
        {alertsOpen && (
          <p className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground rise-in">
            We'll notify you here if a vital drifts outside your personal range.
          </p>
        )}
      </Card>

      {/* Weekly trend */}
      <Card>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Weekly health trend</p>
            <p className="num text-xl font-semibold">+11 points</p>
          </div>
          <TrendBadge value={11} unit="%" />
        </div>
        <BarChart data={weeklyTrend} labels={["M", "T", "W", "T", "F", "S", "S"]} height={110} />
      </Card>

      {/* Quick actions */}
      <div>
        <SectionHeader title="Quick actions" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Plus, label: "Log symptom", to: "/companion" },
            { icon: Stethoscope, label: "Book care", to: "/support" },
            { icon: MessageCircle, label: "Ask AI", to: "/companion" },
            { icon: UploadCloud, label: "Upload report", to: "/reports" },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="card-surface flex flex-col items-center gap-1.5 p-3 text-center">
              <IconTile tone="teal"><Icon className="h-4 w-4" /></IconTile>
              <span className="text-[10px] font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="pt-2 text-center text-[10px] text-muted-foreground">Signed in as {user.firstName} {user.lastName}</p>
    </div>
  );
}
