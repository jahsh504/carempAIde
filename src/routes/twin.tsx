import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Info,
  ChevronDown,
  Dumbbell,
  TrendingDown,
  Heart,
  Leaf,
  Pill,
  CircleCheck,
  Activity,
  ShieldCheck,
  RefreshCw,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Zap,
  Moon,
  Brain,
  Flame,
  X,
} from "lucide-react";
import { scores, twinChanges, dataSources, user } from "@/data/mock";
import {
  getDailyTimeline,
  getEventTimeline,
  subscribeTimeline,
} from "@/data/wellness-timeline";
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
  heroValue: "88",
  secondaryLabel: "Recovery index",
  secondaryValue: "84/100",
  trendLabel: "Trend",
  trendValue: "+3 pts vs baseline",
  trendTone: "text-emerald",
  summaryTitle: "Digital Twin summary",
  summaryText: "Cardiovascular and metabolic systems are well balanced. Resting heart rate is at optimal baseline (68 bpm) and deep sleep recovered +23 mins.",
  gridTitle: "Body systems status",
  gridHint: "Tap card for details",
  systems: [
    {
      key: "cardio",
      label: "CARDIOVASCULAR",
      icon: HeartPulse,
      statusText: "Stable",
      statusTone: "emerald",
      signalLabel: "Heart & HRV",
      explanation: "Your heart-related readings are close to your usual pattern.",
      signals: "Resting Heart Rate • HRV • Blood Pressure",
    },
    {
      key: "metabolic",
      label: "GLUCOSE",
      icon: Zap,
      statusText: "Good",
      statusTone: "emerald",
      signalLabel: "Glucose",
      explanation: "Your energy and blood-sugar patterns look steady.",
      signals: "Glucose",
    },
    {
      key: "nervous",
      label: "SLEEP & RECOVERY",
      icon: Moon,
      statusText: "Improving",
      statusTone: "teal",
      signalLabel: "Sleep",
      explanation: "Your sleep and recovery duration are getting better.",
      signals: "Deep Sleep • REM • Sleep Continuity",
    },
    {
      key: "musculo",
      label: "MOVEMENT & MOBILITY",
      icon: Activity,
      statusText: "Good",
      statusTone: "emerald",
      signalLabel: "Activity",
      explanation: "Your movement pattern is looking consistent.",
      signals: "Steps",
    },
    {
      key: "mind",
      label: "STRESS & MIND",
      icon: Brain,
      statusText: "Attention",
      statusTone: "amber",
      signalLabel: "Stress",
      explanation: "Your stress levels have been higher than usual recently.",
      signals: "Stress Index",
    },
    {
      key: "wellness",
      label: "OVERALL WELLNESS",
      icon: ShieldCheck,
      statusText: "Stable",
      statusTone: "teal",
      signalLabel: "Resilience",
      explanation: "Your overall wellness is currently balanced.",
      signals: "Resilience",
    },
  ],
};

const recoveryData = {
  statusBadge: "Active Recovery",
  confidence: "Confidence 86%",
  heroValueLabel: "Health Score",
  heroValue: "88",
  secondaryLabel: "Recovery phase",
  secondaryValue: "Phase 3",
  trendLabel: "State",
  trendValue: "On Track",
  trendTone: "text-emerald",
  summaryTitle: "Recovery Twin summary",
  summaryText: "Informational AI-generated insight based on Recovery Plan & Baseline and Recovery Progress & Insight engine outputs. Your recovery is progressing as expected.",
  gridTitle: "Recovery indicators",
  gridHint: "Engine outputs & derived risk",
  systems: [
    {
      key: "progress",
      label: "RECOVERY PROGRESS",
      icon: Activity,
      statusText: "On Track",
      statusTone: "emerald",
      signalLabel: "Expected path",
      explanation: "Your recovery is progressing as expected compared with your clinical path.",
      signals: "Discharge Plan • Clinical Guidance • Milestones",
    },
    {
      key: "baseline",
      label: "BACK TO BASELINE",
      icon: TrendingDown,
      statusText: "72%",
      statusTone: "teal",
      signalLabel: "Pre-recovery state",
      explanation: "You're moving closer to your usual normal pre-recovery state.",
      signals: "Pre-recovery Baseline • Vitals • Movement Signals",
    },
    {
      key: "risk",
      label: "READMISSION RISK",
      icon: ShieldCheck,
      statusText: "Low",
      statusTone: "emerald",
      signalLabel: "86% Confidence",
      explanation: "Derived risk output indicates low readmission likelihood based on current vitals and medication adherence.",
      signals: "Vitals Stability • Medication Compliance",
    },
  ],
  timelineTitle: "Recovery Timeline",
  timelineHint: "Expected recovery phases",
  timeline: [
    { icon: "check-circle" as const, title: "Stabilization", date: "Phase 1 · Completed", completed: true, active: false },
    { icon: "check-circle" as const, title: "Early Recovery", date: "Phase 2 · Completed", completed: true, active: false },
    { icon: "activity" as const, title: "Active Recovery", date: "Phase 3 · Current Phase", completed: false, active: true },
  ],
};

function TwinPage() {
  const [mode, setMode] = useState<Mode>("everyday");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [confOpen, setConfOpen] = useState(false);

  const [activeTimelineTab, setActiveTimelineTab] = useState<"daily" | "events">("daily");
  const [dailyTimelineItems, setDailyTimelineItems] = useState(getDailyTimeline());
  const [eventTimelineItems, setEventTimelineItems] = useState(getEventTimeline());
  const [selectedSystem, setSelectedSystem] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeTimeline(() => {
      setDailyTimelineItems([...getDailyTimeline()]);
      setEventTimelineItems([...getEventTimeline()]);
    });
    return unsubscribe;
  }, []);

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

          {/* Hero Statistics (Single Centered Health Score for all modes) */}
          <div className="mt-4 flex flex-col items-center text-center transition-all duration-500">
            <p className="text-[10px] uppercase tracking-wider text-white/60">{data.heroValueLabel}</p>
            <p className="num text-3xl font-bold tracking-tight text-white">{data.heroValue}</p>
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

      {/* Body Systems / Recovery Indicators (Apple-style Cards with Dynamic Status Rings) */}
      <div className="transition-all duration-500">
        <SectionHeader title={data.gridTitle} hint={data.gridHint} />
        <div className="grid grid-cols-2 gap-3">
          {data.systems.map((s, i) => {
            const Icon = s.icon;
            const isLastOdd = data.systems.length % 2 !== 0 && i === data.systems.length - 1;
            return (
              <div
                key={s.key}
                onClick={() => setSelectedSystem(s)}
                className={cn(
                  "card-surface flex flex-col items-center justify-between p-3.5 text-center cursor-pointer transition-all duration-300 active:scale-[0.98] hover:border-teal/40 group min-h-[160px] space-y-1.5",
                  isLastOdd && "col-span-2 justify-self-center w-full max-w-[calc(50%-0.375rem)]"
                )}
              >
                {/* Dynamic Status Ring & Centered Visual */}
                <div className="relative grid h-16 w-16 place-items-center my-0.5">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64">
                    {/* Subtle background track ring */}
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="text-border/50"
                    />
                    {/* Dynamic gradient status ring */}
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      fill="none"
                      stroke={
                        s.statusTone === "emerald" ? "var(--emerald)" :
                        s.statusTone === "amber" ? "var(--amber)" :
                        s.statusTone === "coral" ? "var(--coral)" :
                        "var(--teal)"
                      }
                      strokeWidth="3.5"
                      strokeDasharray="170"
                      strokeDashoffset="35"
                      strokeLinecap="round"
                      className="transition-all duration-700 drop-shadow-xs"
                    />
                  </svg>

                  <div
                    className={cn(
                      "relative z-10 grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:scale-105",
                      s.statusTone === "emerald" ? "bg-emerald/10 text-emerald" :
                      s.statusTone === "amber" ? "bg-amber/10 text-amber" :
                      s.statusTone === "coral" ? "bg-coral/10 text-coral" :
                      "bg-teal/10 text-teal"
                    )}
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                </div>

                {/* ONE-WORD Status */}
                <p
                  className={cn(
                    "text-[11px] font-bold tracking-wider uppercase",
                    s.statusTone === "emerald" ? "text-emerald" :
                    s.statusTone === "amber" ? "text-amber" :
                    s.statusTone === "coral" ? "text-coral" :
                    "text-teal"
                  )}
                >
                  {s.statusText}
                </p>

                {/* System Name */}
                <p className="text-[12px] font-semibold text-foreground leading-tight uppercase tracking-tight">
                  {s.label}
                </p>

                {/* Small relevant signal label */}
                <p className="text-[10.5px] font-medium text-muted-foreground">
                  {s.signalLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tap Detail Popover Overlay */}
      {selectedSystem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 rise-in"
          onClick={() => setSelectedSystem(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "grid h-8.5 w-8.5 place-items-center rounded-xl",
                    selectedSystem.statusTone === "emerald" ? "bg-emerald/15 text-emerald" :
                    selectedSystem.statusTone === "amber" ? "bg-amber/15 text-amber" :
                    selectedSystem.statusTone === "coral" ? "bg-coral/15 text-coral" :
                    "bg-teal/15 text-teal"
                  )}
                >
                  <selectedSystem.icon className="h-4.5 w-4.5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {selectedSystem.label}
                  </h4>
                  <span
                    className={cn(
                      "inline-block text-xs font-bold uppercase tracking-wider",
                      selectedSystem.statusTone === "emerald" ? "text-emerald" :
                      selectedSystem.statusTone === "amber" ? "text-amber" :
                      selectedSystem.statusTone === "coral" ? "text-coral" :
                      "text-teal"
                    )}
                  >
                    {selectedSystem.statusText}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSystem(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-foreground font-medium pt-1.5 border-t border-border/60">
              "{selectedSystem.explanation}"
            </p>

            <div className="pt-2 border-t border-border/60 space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-teal">Signals Monitored</p>
              <p className="text-[11px] text-muted-foreground font-medium">
                {selectedSystem.signals}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Section: 2 Timelines (Everyday Mode) vs Recovery Timeline */}
      <div className="transition-all duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {mode === "recovery" ? data.timelineTitle : "Digital Twin Story"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {mode === "recovery" ? data.timelineHint : activeTimelineTab === "daily" ? "Daily health activity" : "Personal health & lifestyle events"}
            </p>
          </div>

          {/* Everyday Twin 2-Timelines Tab Toggle */}
          {mode === "everyday" && (
            <div className="flex rounded-full border border-border bg-muted/60 p-0.5 text-[10.5px]">
              <button
                onClick={() => setActiveTimelineTab("daily")}
                className={cn(
                  "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                  activeTimelineTab === "daily"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                DAILY
              </button>
              <button
                onClick={() => setActiveTimelineTab("events")}
                className={cn(
                  "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                  activeTimelineTab === "events"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EVENTS
              </button>
            </div>
          )}
        </div>

        <Card className="p-0">
          <div className="relative py-2">
            <span className="absolute left-[26px] top-4 bottom-4 w-px bg-border" />

            {/* Recovery Mode Timeline (Only completed phases + active current phase) */}
            {mode === "recovery" ? (
              data.timeline.map((m, i) => {
                const isCompleted = m.completed;
                const isActive = m.active;
                return (
                  <div key={i} className="relative flex items-center gap-3 px-3 py-2.5">
                    <div
                      className={cn(
                        "relative z-10 grid h-8 w-8 place-items-center rounded-full transition-all",
                        isCompleted
                          ? "bg-emerald text-white"
                          : isActive
                          ? "bg-gradient-to-br from-teal to-blue text-white ring-2 ring-teal/50"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CircleCheck className="h-4 w-4" />
                      ) : (
                        <Activity className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-[13px] font-medium truncate", isActive && "text-teal font-semibold")}>
                          {m.title}
                        </p>
                        {isActive && (
                          <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[9.5px] font-semibold text-teal">
                            Current Phase
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{m.date}</p>
                    </div>
                  </div>
                );
              })
            ) : activeTimelineTab === "daily" ? (
              /* Everyday Mode - Daily Timeline */
              dailyTimelineItems.map((item) => {
                const Icon = memIcon[item.icon as keyof typeof memIcon] || Activity;
                return (
                  <div key={item.id} className="relative flex items-center gap-3 px-3 py-2.5">
                    <div className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Everyday Mode - Event Timeline */
              eventTimelineItems.map((item) => {
                const Icon = memIcon[item.icon as keyof typeof memIcon] || Dumbbell;
                return (
                  <div key={item.id} className="relative flex items-center gap-3 px-3 py-2.5">
                    <div className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[13px] font-medium truncate">{item.title}</p>
                        <span className="shrink-0 rounded-full bg-teal/10 px-2 py-0.5 text-[9.5px] font-semibold text-teal">
                          {item.source}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
