import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info, ChevronDown, Dumbbell, TrendingDown, Heart, Leaf, Pill, CircleCheck, Activity, ShieldCheck, RefreshCw, Stethoscope, Sparkles } from "lucide-react";
import { scores, twinChanges, dataSources, user } from "@/data/mock";
import { RingProgress, TrendBadge, Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "My Health Twin — careMP AIDE" },
      { name: "description", content: "A living Digital Twin of your body — evolving with every vital, meal, and night of sleep." },
    ],
  }),
  component: TwinPage,
});

const memIcon = { dumbbell: Dumbbell, "trending-down": TrendingDown, heart: Heart, leaf: Leaf, pill: Pill, "check-circle": CircleCheck, activity: Activity, shield: ShieldCheck, stethoscope: Stethoscope } as const;

type Mode = "everyday" | "recovery";

const everydayData = {
  statusBadge: "Balanced",
  confidence: "Confidence 86%",
  heroValueLabel: "Twin health",
  heroValue: "84",
  secondaryLabel: "Health age",
  secondaryValue: `${user.biologicalAge}/${user.age}`,
  trendLabel: "Trend",
  trendValue: "Improving",
  trendTone: "text-emerald",
  summaryTitle: "AI Twin summary",
  summaryText: "Your body state is well-balanced today with steady HRV and optimal sleep recovery. Vital signs remain within ideal targets.",
  gridTitle: "Body systems",
  gridHint: "Tap a system for details",
  systems: [
    { key: "cardio", label: "Cardiovascular", score: 88, note: "HRV & Resting HR optimal", status: "good", trend: 3 },
    { key: "metabolic", label: "Metabolic", score: 82, note: "Fasting glucose stable", status: "good", trend: 2 },
    { key: "nervous", label: "Sleep & Nervous", score: 79, note: "7.5 hrs sleep · Deep recovery", status: "good", trend: 1 },
    { key: "musculo", label: "Musculoskeletal", score: 85, note: "Good daily movement", status: "good", trend: 4 },
  ],
  timelineTitle: "Your Wellness Story",
  timelineHint: "Recent milestones",
  timeline: [
    { icon: "check-circle" as const, title: "Doses completed on time", date: "Today · 8:00 AM" },
    { icon: "dumbbell" as const, title: "Morning walk 2.4 km", date: "Today · 10:30 AM" },
    { icon: "heart" as const, title: "Sleep score 85/100 · 7.5 hrs", date: "Today · 7:30 AM" },
    { icon: "leaf" as const, title: "Baseline vitals recorded", date: "Yesterday" },
  ],
};

const recoveryData = {
  statusBadge: "Recovery Journey",
  confidence: "Phase 2 · Active Care",
  heroValueLabel: "Readiness",
  heroValue: "78%",
  secondaryLabel: "Recovery day",
  secondaryValue: "Day 5/10",
  trendLabel: "State",
  trendValue: "Recovering",
  trendTone: "text-teal",
  summaryTitle: "Recovery Twin summary",
  summaryText: "Post-procedure recovery is progressing steadily. Inflammatory response is decreasing as expected. Gentle mobility and medication routine are aligned.",
  gridTitle: "Recovery indicators",
  gridHint: "Live recovery metrics",
  systems: [
    { key: "cardio", label: "Inflammation Response", score: 82, note: "Inflammatory markers lowering", status: "good", trend: 5 },
    { key: "metabolic", label: "Cardiac Stress Load", score: 90, note: "Low resting cardiac strain", status: "good", trend: 3 },
    { key: "nervous", label: "Mobility & Rest", score: 68, note: "Gentle rest & mobility target", status: "caution", trend: 2 },
    { key: "musculo", label: "Medication Alignment", score: 95, note: "100% dose compliance", status: "good", trend: 4 },
  ],
  timelineTitle: "Recovery Timeline",
  timelineHint: "Care & healing timeline",
  timeline: [
    { icon: "pill" as const, title: "Morning dose taken: Metformin 500mg", date: "Today · 8:00 AM" },
    { icon: "shield" as const, title: "Caregiver check-in verified", date: "Today · 10:02 AM" },
    { icon: "stethoscope" as const, title: "Vitals check: BP 120/78, Temp 98.4°F", date: "Today · 11:15 AM" },
    { icon: "activity" as const, title: "Wound & dressing check confirmed", date: "Today · 1:30 PM" },
  ],
};

function TwinPage() {
  const [mode, setMode] = useState<Mode>("everyday");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [confOpen, setConfOpen] = useState(false);

  const toggleMode = (targetMode: Mode) => {
    if (mode === targetMode || isTransitioning) return;
    setIsTransitioning(true);
    setTransitionLabel(targetMode === "recovery" ? "Entering Recovery Mode..." : "Returning to Everyday Mode...");

    setTimeout(() => {
      setMode(targetMode);
    }, 350);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  };

  const data = mode === "everyday" ? everydayData : recoveryData;

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Mode Segment Switcher */}
      <div className="flex rounded-full border border-border bg-card p-1">
        <button
          onClick={() => toggleMode("everyday")}
          disabled={isTransitioning}
          className={cn(
            "flex-1 rounded-full py-2 text-[12.5px] font-semibold transition-all duration-300",
            mode === "everyday" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Everyday Twin
        </button>
        <button
          onClick={() => toggleMode("recovery")}
          disabled={isTransitioning}
          className={cn(
            "flex-1 rounded-full py-2 text-[12.5px] font-semibold transition-all duration-300",
            mode === "recovery" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Recovery Twin
        </button>
      </div>

      {/* Transition Banner Pill */}
      {isTransitioning && (
        <div className="flex items-center justify-center gap-2 rounded-full bg-teal/15 border border-teal/30 px-4 py-2 text-[12px] font-medium text-teal rise-in">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>{transitionLabel}</span>
        </div>
      )}

      {/* Twin Hero — Dark Panel with Dynamic Figure */}
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in transition-all duration-700">
        {/* Background glow dynamics */}
        <div className="pointer-events-none absolute inset-0 transition-opacity duration-700">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-700",
              mode === "recovery" ? "bg-amber/30 animate-pulse" : "bg-teal/30 breathing"
            )}
          />
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-all duration-700",
              mode === "recovery" ? "bg-coral/20" : "bg-emerald/20 breathing [animation-delay:800ms]"
            )}
          />
        </div>

        <div className="relative flex flex-col items-center pt-2">
          {/* Status Badges */}
          <div className="mb-3 flex items-center gap-2 transition-all duration-500">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-500",
                mode === "recovery"
                  ? "bg-amber/20 text-amber border border-amber/30"
                  : "bg-emerald/20 text-emerald"
              )}
            >
              {data.statusBadge}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">
              {data.confidence}
            </span>
          </div>

          {/* Morphing Digital Twin Figure */}
          <div className="relative h-56 w-40 flex items-center justify-center">
            {/* Energy Aura Pulse Rings */}
            <div
              className={cn(
                "absolute inset-0 rounded-full border transition-all duration-700",
                mode === "recovery"
                  ? "border-amber/40 scale-105 animate-pulse"
                  : "border-teal/30 scale-95"
              )}
            />
            <div
              className={cn(
                "absolute inset-2 rounded-full border transition-all duration-700",
                mode === "recovery"
                  ? "border-emerald/40 scale-110"
                  : "border-blue/20 scale-100"
              )}
            />

            {/* Single SVG Twin Figure (Morphs parameters smoothly) */}
            <svg
              viewBox="0 0 100 200"
              className={cn(
                "relative z-10 h-full w-full transition-all duration-700 ease-in-out",
                isTransitioning ? "scale-105 opacity-90 blur-[0.5px]" : "scale-100 opacity-100"
              )}
            >
              <defs>
                <linearGradient id="tw-body" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={mode === "recovery" ? "#F59E0B" : "#5CE1D3"}
                    stopOpacity="0.95"
                    className="transition-all duration-700"
                  />
                  <stop
                    offset="50%"
                    stopColor={mode === "recovery" ? "#10B981" : "#4B8CFF"}
                    stopOpacity="0.85"
                    className="transition-all duration-700"
                  />
                  <stop
                    offset="100%"
                    stopColor={mode === "recovery" ? "#0EA5E9" : "#3B82F6"}
                    stopOpacity="0.75"
                    className="transition-all duration-700"
                  />
                </linearGradient>
                <radialGradient id="tw-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop
                    offset="0%"
                    stopColor={mode === "recovery" ? "#F59E0B" : "#5CE1D3"}
                    stopOpacity={mode === "recovery" ? "0.9" : "0.75"}
                  />
                  <stop
                    offset="100%"
                    stopColor={mode === "recovery" ? "#10B981" : "#5CE1D3"}
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>

              {/* Glow Aura */}
              <circle cx="50" cy="100" r={mode === "recovery" ? "62" : "55"} fill="url(#tw-glow)" className="transition-all duration-700" />
              
              {/* Head */}
              <circle cx="50" cy="26" r="14" fill="url(#tw-body)" className="transition-all duration-700" />
              
              {/* Body silhouette */}
              <path
                d="M28 60 Q50 44 72 60 L74 118 Q74 128 68 130 L60 132 L58 178 Q58 186 52 186 L48 186 Q42 186 42 178 L40 132 L32 130 Q26 128 26 118 Z"
                fill="url(#tw-body)"
                className="transition-all duration-700"
              />

              {/* Dynamic Cardiac / Recovery Pulse Mark */}
              <circle
                cx="44"
                cy="80"
                r={mode === "recovery" ? "4.5" : "3"}
                fill={mode === "recovery" ? "#F59E0B" : "#FFFFFF"}
                opacity="0.95"
                className={cn("transition-all duration-500", mode === "recovery" ? "animate-ping" : "breathing")}
              />
              <circle
                cx="44"
                cy="80"
                r="2.5"
                fill="#FFFFFF"
                opacity="1"
              />

              {/* Recovery indicator wave line */}
              {mode === "recovery" && (
                <path
                  d="M32 80 L39 80 L42 74 L46 86 L49 80 L68 80"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                  className="rise-in"
                />
              )}
            </svg>
          </div>

          {/* Hero Statistics Grid */}
          <div className="mt-4 grid w-full grid-cols-3 gap-3 text-center transition-all duration-500">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">{data.heroValueLabel}</p>
              <p className="num text-2xl font-semibold">{data.heroValue}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">{data.secondaryLabel}</p>
              <p className="num text-2xl font-semibold">{data.secondaryValue}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">{data.trendLabel}</p>
              <p className={cn("text-lg font-semibold", data.trendTone)}>{data.trendValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Twin Summary */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5 transition-all duration-500">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal">
          <Sparkles className="h-3.5 w-3.5" /> {data.summaryTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{data.summaryText}</p>
      </Card>

      {/* Body Systems / Recovery Indicators */}
      <div className="transition-all duration-500">
        <SectionHeader title={data.gridTitle} hint={data.gridHint} />
        <div className="grid grid-cols-2 gap-3">
          {data.systems.map((s) => (
            <Link
              key={s.key}
              to="/twin/$system"
              params={{ system: s.key }}
              className="card-surface flex flex-col items-center p-3 text-center transition-all duration-300 active:scale-[0.98]"
            >
              <RingProgress
                value={s.score}
                size={72}
                stroke={7}
                color={s.status === "good" ? "var(--emerald)" : s.status === "caution" ? "var(--amber)" : "var(--coral)"}
              />
              <p className="mt-2 text-[13px] font-semibold">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.note}</p>
              <div className="mt-1"><TrendBadge value={s.trend} /></div>
            </Link>
          ))}
        </div>
      </div>

      {/* What Has Changed */}
      <div>
        <SectionHeader title="What has changed" hint="Recent window" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {twinChanges.map((c) => (
            <div
              key={c.label}
              className={cn(
                "shrink-0 rounded-2xl border px-3 py-2",
                c.tone === "good" ? "border-emerald/30 bg-emerald/5" : "border-amber/30 bg-amber/5"
              )}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className={cn("num text-base font-semibold", c.tone === "good" ? "text-emerald" : "text-amber")}>{c.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline: Wellness Story vs Recovery Timeline */}
      <div className="transition-all duration-500">
        <SectionHeader title={data.timelineTitle} hint={data.timelineHint} />
        <Card className="p-0">
          <div className="relative py-2">
            <span className="absolute left-[26px] top-4 bottom-4 w-px bg-border" />
            {data.timeline.map((m, i) => {
              const Icon = memIcon[m.icon as keyof typeof memIcon];
              return (
                <div key={i} className="relative flex items-center gap-3 px-3 py-2.5">
                  <div className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-white">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{m.title}</p>
                    <p className="text-[11px] text-muted-foreground">{m.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Twin Confidence */}
      <Card>
        <button className="flex w-full items-center gap-3" onClick={() => setConfOpen((v) => !v)}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue/10 text-blue"><Info className="h-4 w-4" /></div>
          <div className="flex-1 text-left">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Twin confidence</p>
            <p className="text-sm font-medium">86% · Growing with continuous data</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", confOpen && "rotate-180")} />
        </button>
        {confOpen && (
          <div className="mt-4 space-y-2 rise-in">
            {dataSources.map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span>{d.label}</span>
                  <span className="text-muted-foreground">{d.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal to-blue" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
            <p className="pt-2 text-[11px] text-muted-foreground">
              Continuous sync with vitals, care activity, and dose logging keeps confidence high.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
