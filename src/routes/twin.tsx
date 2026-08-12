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
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronRight,
  HeartHandshake,
  PersonStanding,
  Shield,
  Smile,
  Soup,
} from "lucide-react";
import { scores, twinChanges, dataSources, user } from "@/data/mock";
import {
  getDailyTimeline,
  getEventTimeline,
  subscribeTimeline,
} from "@/data/wellness-timeline";
import { RingProgress, TrendBadge, Card, SectionHeader } from "@/components/care/primitives";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

const energyTimelinePoints = [
  { x: 24, y: 112, value: 32, label: "Low Energy", time: "2:00 AM", location: "Bedroom", tone: "text-coral", stroke: "var(--coral)" },
  { x: 82, y: 72, value: 76, label: "Morning Boost", time: "8:00 AM", location: "Kitchen", tone: "text-emerald", stroke: "var(--emerald)" },
  { x: 142, y: 40, value: 92, label: "Peak Energy", time: "12:30 PM", location: "Gym", tone: "text-emerald", stroke: "var(--emerald)" },
  { x: 202, y: 82, value: 48, label: "Energy Dip", time: "4:30 PM", location: "Office", tone: "text-amber", stroke: "var(--amber)" },
  { x: 262, y: 112, value: 35, label: "Rest Time", time: "9:30 PM", location: "Living Room", tone: "text-coral", stroke: "var(--coral)" },
] as const;

function BiologicalAgeCard() {
  const yearsYounger = Math.max(0, user.age - user.biologicalAge);

  return (
    <Card className="overflow-hidden border-teal/20">
      <div className="flex items-center gap-1.5">
        <h3 className="text-[17px] font-bold">Biological Age</h3>
        <Info className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-[128px_1fr] items-center gap-4">
        <RingProgress value={86} size={128} stroke={11} color="var(--teal)">
          <div className="text-center">
            <p className="text-[11px] font-semibold text-muted-foreground">Your age</p>
            <p className="num text-5xl font-bold leading-none">{user.biologicalAge}</p>
            <p className="text-xs font-semibold text-muted-foreground">years</p>
          </div>
        </RingProgress>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Actual age: {user.age} years</p>
          <span className="inline-flex rounded-full bg-emerald/10 px-3 py-1.5 text-sm font-bold text-emerald">
            {yearsYounger} years younger
          </span>
          <p className="text-sm leading-relaxed text-foreground/85">
            Healthy habits are helping your twin stay younger, stronger, and more resilient.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-teal/10 bg-gradient-to-r from-teal/10 to-emerald/5 p-4">
        <p className="text-[15px] font-bold text-teal">You are building a healthier you every day.</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Small steps today, better life tomorrow.</p>
      </div>
    </Card>
  );
}

function EnergyTimelineCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[17px] font-bold">Energy Timeline</h3>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Your energy levels throughout the day</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold">
          Today <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <svg viewBox="0 0 300 190" className="min-w-[360px] w-full">
          <defs>
            <linearGradient id="energy-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d="M8 122 C28 132 42 128 54 118 C72 104 70 84 88 68 C106 52 121 70 136 50 C150 30 170 33 182 49 C196 68 194 86 212 88 C232 92 232 114 252 122 C268 128 282 130 294 120" fill="none" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" />
          <path d="M61 108 C72 96 75 80 88 68 C106 52 121 70 136 50 C150 30 170 33 182 49 C195 66 195 80 206 87" fill="none" stroke="var(--emerald)" strokeWidth="3" strokeLinecap="round" />
          <path d="M204 87 C214 90 220 98 226 102 C238 110 242 118 252 122" fill="none" stroke="var(--amber)" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 122 C28 132 42 128 54 118 C72 104 70 84 88 68 C106 52 121 70 136 50 C150 30 170 33 182 49 C196 68 194 86 212 88 C232 92 232 114 252 122 C268 128 282 130 294 120 L294 152 L8 152 Z" fill="url(#energy-area)" />
          <line x1="8" y1="152" x2="294" y2="152" stroke="var(--border)" />
          {[0, 50, 100].map((tick, index) => (
            <g key={tick}>
              <line x1="8" y1={152 - index * 50} x2="294" y2={152 - index * 50} stroke="var(--border)" strokeOpacity="0.35" />
              <text x="2" y={156 - index * 50} className="fill-muted-foreground text-[8px]">{tick}</text>
            </g>
          ))}
          <TooltipProvider delayDuration={0}>
            {energyTimelinePoints.map((point) => (
              <Tooltip key={point.time}>
                <TooltipTrigger asChild>
                  <g>
                    <line x1={point.x} y1={point.y + 8} x2={point.x} y2="151" stroke="var(--border)" strokeDasharray="3 3" />
                    <circle cx={point.x} cy={point.y} r="5" fill="white" stroke={point.stroke} strokeWidth="3" />
                    <text x={point.x} y={point.y - 44} textAnchor="middle" className={cn("text-[8px] font-bold", point.tone)}>{point.label}</text>
                    <text x={point.x} y={point.y - 28} textAnchor="middle" className="fill-muted-foreground text-[8px]">{point.time}</text>
                    {/* <text x={point.x} y={point.y - 14} textAnchor="middle" className="fill-muted-foreground text-[7px]">{point.location}</text> */}
                    <text x={point.x} y={point.y - 14} textAnchor="middle" className="fill-foreground text-[12px] font-bold">{point.value}</text>
                  </g>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border bg-card px-2.5 py-2 text-left shadow-lg">
                  {/* <div className="text-[11px] font-bold text-foreground">{point.label}</div> */}
                  {/* <div className="mt-0.5 text-[10px] text-muted-foreground">{point.time}</div> */}
                  <div className="mt-1 text-[10px] text-muted-foreground">{point.location}</div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          {["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "12 AM"].map((label, index) => (
            <text key={label + index} x={12 + index * 46} y="176" textAnchor="middle" className="fill-muted-foreground text-[8px]">{label}</text>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border text-center">
        <div className="p-3">
          <Zap className="mx-auto h-5 w-5 text-teal" />
          <p className="mt-1 text-[11px] font-bold">Best focus</p>
          <p className="mt-1 text-[11px] text-muted-foreground">9:00 AM - 1:00 PM</p>
        </div>
        <div className="p-3">
          <Flame className="mx-auto h-5 w-5 text-amber" />
          <p className="mt-1 text-[11px] font-bold">Peak energy</p>
          <p className="mt-1 text-[11px] text-muted-foreground">12:30 PM</p>
        </div>
        <div className="p-3">
          <Moon className="mx-auto h-5 w-5 text-blue" />
          <p className="mt-1 text-[11px] font-bold">Low energy</p>
          <p className="mt-1 text-[11px] text-muted-foreground">9:30 PM</p>
        </div>
      </div>
    </Card>
  );
}

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

  return mode === "recovery" ? <div className="px-4 pb-6 space-y-4"><div className="flex rounded-full border border-border bg-card p-1"><button onClick={() => setMode("everyday")} className="flex-1 rounded-full py-2 text-[12.5px] font-semibold text-muted-foreground">Everyday Twin</button><button className="flex-1 rounded-full bg-primary py-2 text-[12.5px] font-semibold text-primary-foreground">Recovery Twin</button></div><RecoveryDashboard /></div> : (
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

      <BiologicalAgeCard />

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

      <EnergyTimelineCard />

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

/*
function RecoveryDashboard() {
  const [items, setItems] = useState([true, true, true, true, false]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const plans = ["Walk for 15 minutes", "Breathing exercise", "Take all medications", "High protein meal", "Sleep before 10:00 PM"];
  const summary = ["Recovery is progressing normally.", "Your activity increased 18%.", "Pain reduced. Great job!", "No signs of infection detected.", "Continue breathing exercises."];
  return <div className="space-y-3.5 rise-in">
    <Card><div className="flex justify-between"><h3 className="text-[15px] font-bold">Milestones Completed</h3><span className="text-xl font-bold">4 / 8 <ChevronRight className="inline h-5 w-5 text-muted-foreground" /></span></div><div className="mt-4 h-2.5 rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald to-teal" /></div><p className="mt-3 text-sm text-muted-foreground">You are <b className="text-emerald">6 days</b> ahead of expected timeline</p></Card>
    <Card><div className="flex justify-between"><h3 className="text-[17px] font-bold">Recovery Score</h3><Info className="h-5 w-5 text-muted-foreground" /></div><div className="mt-2 flex items-center gap-3"><RingProgress value={81} size={160} stroke={14} color="var(--emerald)"><div className="text-center"><p className="num text-5xl font-bold">81</p><p className="text-sm text-muted-foreground">/100</p></div></RingProgress><div className="space-y-2"><p className="text-emerald"><ArrowUp className="inline h-5 w-5 text-amber" /> <b className="num text-2xl">4</b></p><p className="text-sm text-muted-foreground">from yesterday</p><p className="text-sm font-semibold text-emerald">● On Track</p><p className="text-xs leading-relaxed text-muted-foreground">You are recovering well.<br/>Keep following your plan.</p></div></div></Card>
    <div className="grid grid-cols-2 gap-3"><Card><p className="text-sm font-semibold text-muted-foreground">Readmission Risk</p><p className="mt-2 text-lg font-bold text-emerald">Low</p><p className="num text-4xl font-bold text-emerald">12%</p><p className="text-xs text-muted-foreground"><ArrowDown className="inline h-4 w-4 text-emerald" /> <b>3%</b> from yesterday</p></Card><Card><p className="text-sm font-semibold text-muted-foreground">Recovery Day</p><p className="mt-3 text-3xl font-bold">Day 12</p><p className="text-sm text-muted-foreground">Since Discharge</p></Card></div>`r`n    <div className="flex flex-col space-y-3"><Card className="order-last"><h3 className="text-[15px] font-bold">Recovery Score Trend</h3><svg viewBox="0 0 280 150" className="mt-3 w-full"><path d="M25 108 L83 96 L141 75 L199 44 L257 30" fill="none" stroke="var(--emerald)" strokeWidth="2.5" />{[[25,108,58,"May 10"],[83,96,62,"May 17"],[141,75,68,"May 24"],[199,44,77,"May 31"],[257,30,81,"Today"]].map(([x,y,v,l])=><g key={String(l)} onClick={() => setSelectedDay(String(l))} className="cursor-pointer"><circle cx={x} cy={y} r="4" fill="white" stroke="var(--emerald)" strokeWidth="3"/><text x={x} y={Number(y)-10} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{v}</text><text x={x} y="140" textAnchor="middle" className="fill-muted-foreground text-[8px]">{l}</text></g>)}</svg>{selectedDay && <div className="mt-2 rounded-xl bg-emerald/10 p-3 text-xs"><b>{selectedDay}</b><p className="mt-1 text-muted-foreground">Your recovery score was recorded and your plan remained on track that day.</p><button onClick={() => setSelectedDay(null)} className="mt-1 text-emerald">Close</button></div>}</Card><Card className="order-first"><h3 className="text-[15px] font-bold">Today's Twin Summary</h3><div className="mt-3 space-y-3">{summary.map(s => <p key={s} className="text-xs leading-snug text-muted-foreground">💚 {s}</p>)}</div></Card></div>
    <Card><h3 className="text-[17px] font-bold">Your Recovery Twin</h3>    <Card><h3 className="text-[17px] font-bold">Your Recovery Twin</h3><div className="relative mx-auto mt-2 h-[300px] max-w-[360px]"><div className="absolute inset-x-8 top-5 bottom-4 rounded-[50%] border border-dashed border-teal/20"/><svg viewBox="0 0 100 220" className="absolute left-1/2 top-2 h-[290px] w-[125px] -translate-x-1/2"><defs><linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5eead4"/><stop offset="1" stopColor="#0891b2"/></linearGradient></defs><circle cx="50" cy="22" r="13" fill="url(#body)"/><path d="M29 56 Q50 40 71 56 L78 112 L65 119 L61 201 L52 201 L50 135 L48 201 L39 201 L35 119 L22 112 Z" fill="url(#body)" opacity=".8"/><path d="M50 43 L50 199 M30 64 L70 64 M34 83 L66 83 M36 102 L64 102 M39 122 L61 122 M41 145 L59 145" stroke="white" strokeOpacity=".5"/><circle cx="44" cy="78" r="4" fill="white"/></svg><span className="absolute left-0 top-8 text-xs font-semibold">Vitals ❤️</span><span className="absolute right-0 top-8 text-xs font-semibold">Activity 🏃</span><span className="absolute left-0 top-28 text-xs font-semibold">Mind & Mood ☺</span><span className="absolute right-0 top-28 text-xs font-semibold">Sleep 🌙</span><span className="absolute left-0 top-48 text-xs font-semibold">Medications 💊</span><span className="absolute right-0 top-48 text-xs font-semibold">Nutrition 🍲</span></div></Card>
  </div>;
}
*/

function RecoveryDashboard() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTwin, setSelectedTwin] = useState<string | null>(null);
  const summary = ["Recovery is progressing normally.", "Your activity increased 18%.", "Pain reduced. Great job!", "No signs of infection detected.", "Continue breathing exercises."];
  const points = [[25, 108, 58, "May 10"], [83, 96, 62, "May 17"], [141, 75, 68, "May 24"], [199, 44, 77, "May 31"], [257, 30, 81, "Today"]] as const;

  const twinFindings: Record<string, { title: string; status: string; summary: string; detail: string }> = {
    Vitals: {
      title: "Current Vitals",
      status: "Stable",
      summary: "Your heart rate, blood pressure, and oxygen levels are all in a healthy range for recovery.",
      detail: "Your current vital signs are stable and within your expected recovery range. No concerning changes were detected today.",
    },
    Activity: {
      title: "Current Activity",
      status: "Improving",
      summary: "You are moving more than last week and your recovery activity is increasing steadily.",
      detail: "Your movement is trending up, and your recovery plan is supporting healthy progress without overloading your system.",
    },
    "Mind & Mood": {
      title: "Mind & Mood",
      status: "Calm",
      summary: "Your mood is stable and stress is low to moderate, which supports a better recovery rhythm.",
      detail: "Your emotional state looks steady, and there are no signs of elevated stress that would slow healing.",
    },
    Sleep: {
      title: "Sleep",
      status: "Recovered",
      summary: "Your rest is improving and you are getting enough deep sleep for healing and recovery.",
      detail: "Sleep quality is better than earlier in the week. Recovery is being supported by stronger rest and deeper sleep cycles.",
    },
    Medications: {
      title: "Medications",
      status: "On track",
      summary: "You are staying consistent with your medication plan, which is helping keep recovery stable.",
      detail: "Medication adherence is strong, and the schedule is supporting the expected recovery pattern without missed doses.",
    },
    Glucose: {
      title: "Glucose",
      status: "Healthy",
      summary: "Your blood sugar pattern is mostly steady, with no major spikes or dips noted.",
      detail: "Your glucose trends remain within a healthy band. Energy and recovery remain balanced across the day.",
    },
  };

  const twinLabels = [
    { key: "Vitals", label: "Vitals ❤️", className: "left-0 top-8" },
    { key: "Activity", label: "Activity 🏃", className: "right-0 top-8" },
    { key: "Mind & Mood", label: "Mind & Mood ☺", className: "left-0 top-28" },
    { key: "Sleep", label: "Sleep 🌙", className: "right-0 top-28" },
    { key: "Medications", label: "Medications 💊", className: "left-0 top-48" },
    { key: "Glucose", label: "Glucose 🍲", className: "right-0 top-48" },
  ] as const;

  const selectedFinding = selectedTwin ? twinFindings[selectedTwin] : null;

  return <div className="flex flex-col space-y-3.5 rise-in [&>*:nth-child(1)]:order-1 [&>*:nth-child(2)]:order-2 [&>*:nth-child(3)]:order-4 [&>*:nth-child(4)]:order-5 [&>*:nth-child(5)]:order-3 [&>*:nth-child(6)]:order-6 [&>*:nth-child(7)]:order-7">
    {selectedFinding && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedTwin(null)}>
        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">{selectedFinding.title}</h3>
            <button type="button" onClick={() => setSelectedTwin(null)} className="text-xs text-muted-foreground">Close</button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selectedFinding.summary}</p>
          <p className="mt-3 text-xs font-semibold text-emerald">Status: {selectedFinding.status}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{selectedFinding.detail}</p>
        </div>
      </div>
    )}
    <Card><div className="flex justify-between"><h3 className="text-[15px] font-bold">Milestones Completed</h3><span className="text-xl font-bold">4 / 8 <ChevronRight className="inline h-5 w-5 text-muted-foreground" /></span></div><div className="mt-4 h-2.5 rounded-full bg-muted"><div className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald to-teal" /></div><p className="mt-3 text-sm text-muted-foreground">You are <b className="text-emerald">6 days</b> ahead of expected timeline</p></Card>
    <Card><div className="flex justify-between"><h3 className="text-[17px] font-bold">Recovery Score</h3><Info className="h-5 w-5 text-muted-foreground" /></div><div className="mt-2 flex items-center gap-3"><RingProgress value={81} size={160} stroke={14} color="var(--emerald)"><div className="text-center"><p className="num text-5xl font-bold">81</p><p className="text-sm text-muted-foreground">/100</p></div></RingProgress><div className="space-y-2"><p className="text-emerald"><ArrowUp className="inline h-5 w-5 text-amber" /> <b className="num text-2xl">4</b></p><p className="text-sm text-muted-foreground">from yesterday</p><p className="text-sm font-semibold text-emerald">On Track</p><p className="text-xs leading-relaxed text-muted-foreground">You are recovering well.<br/>Keep following your plan.</p></div></div></Card>
    <div className="grid grid-cols-2 gap-3"><Card><p className="text-sm font-semibold text-muted-foreground">Readmission Risk</p><p className="mt-2 text-lg font-bold text-emerald">Low</p><p className="num text-4xl font-bold text-emerald">12%</p><p className="text-xs text-muted-foreground"><ArrowDown className="inline h-4 w-4 text-emerald" /> <b>3%</b> from yesterday</p></Card><Card><p className="text-sm font-semibold text-muted-foreground">Recovery Day</p><p className="mt-3 text-3xl font-bold">Day 12</p><p className="text-sm text-muted-foreground">Since Discharge</p></Card></div>
    <Card><h3 className="text-[15px] font-bold">Today's Twin Summary</h3><div className="mt-3 space-y-3">{summary.map(s => <p key={s} className="text-xs leading-snug text-muted-foreground">💚 {s}</p>)}</div></Card>
    <Card><h3 className="text-[17px] font-bold">Your Recovery Twin</h3><div className="relative mx-auto mt-2 h-[300px] max-w-[360px]"><div className="absolute inset-x-8 top-5 bottom-4 rounded-[50%] border border-dashed border-teal/20"/><svg viewBox="0 0 100 220" className="absolute left-1/2 top-2 h-[290px] w-[125px] -translate-x-1/2"><defs><linearGradient id="body-clean" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5eead4"/><stop offset="1" stopColor="#0891b2"/></linearGradient></defs><circle cx="50" cy="22" r="13" fill="url(#body-clean)"/><path d="M29 56 Q50 40 71 56 L78 112 L65 119 L61 201 L52 201 L50 135 L48 201 L39 201 L35 119 L22 112 Z" fill="url(#body-clean)" opacity=".8"/><path d="M50 43 L50 199 M30 64 L70 64 M34 83 L66 83 M36 102 L64 102 M39 122 L61 122 M41 145 L59 145" stroke="white" strokeOpacity=".5"/><circle cx="44" cy="78" r="4" fill="white"/></svg>{twinLabels.map(({ key, label, className }) => <button key={key} type="button" onClick={() => setSelectedTwin(key)} className={cn("absolute cursor-pointer rounded-full bg-background/70 px-2 py-1 text-xs font-semibold text-foreground shadow-sm ring-1 ring-border transition hover:bg-card", className)}>{label}</button>)}</div></Card>
    <Card><h3 className="text-[17px] font-bold">Recovery Timeline</h3><div className="relative mt-5 space-y-5"><div className="absolute left-[86px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-violet-400 via-blue to-emerald" />{[{ date: "Apr 28", title: "Hospital Admission", tone: "border-violet-500" }, { date: "Apr 30", title: "Surgery Performed", tone: "border-violet-500" }, { date: "May 02", title: "Discharged", tone: "border-blue-500" }, { date: "May 03", title: "Home Recovery Started", tone: "border-teal" }].map(event => <div key={event.date} className="relative flex items-start gap-4"><span className="w-14 pt-1 text-right text-xs font-semibold text-muted-foreground">{event.date}</span><span className={cn("z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-4 bg-card", event.tone)} /><div className="flex-1"><p className="text-sm font-bold">{event.title}</p><p className="mt-1 text-xs text-muted-foreground">{event.date}</p></div><ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" /></div>)}<div className="relative flex items-start gap-4"><span className="w-14 pt-2 text-right text-xs font-bold text-emerald">May 12</span><span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald text-white">★</span><div className="flex-1 rounded-2xl border border-emerald/25 bg-emerald/5 p-3"><p className="text-sm font-bold text-emerald">You are here</p><p className="mt-1 text-xl font-bold text-emerald">Improving</p><p className="mt-1 text-sm text-muted-foreground">Day 12</p></div></div><div className="relative flex items-start gap-4"><span className="w-14 pt-1 text-right text-xs font-semibold text-muted-foreground">Jul 20</span><span className="z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-amber bg-card text-amber">☆</span><div className="flex-1"><p className="text-sm font-bold">Expected Full Recovery</p><p className="mt-1 text-xs text-muted-foreground">Jul 20</p></div><ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" /></div></div><div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald/5 p-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-emerald/10 text-emerald">✓</span><div><p className="font-bold text-emerald">Stay on track!</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Your recovery is progressing well.<br/>Keep following your plan.</p></div></div></Card>
    <Card><h3 className="text-[15px] font-bold">Recovery Score Trend</h3><p className="mt-1 text-xs text-muted-foreground">Tap a score to view that day’s summary</p><svg viewBox="0 0 280 150" className="mt-3 w-full"><path d="M25 108 L83 96 L141 75 L199 44 L257 30" fill="none" stroke="var(--emerald)" strokeWidth="2.5" />{points.map(([x, y, value, label]) => <g key={label} onClick={() => setSelectedDay(label)} className="cursor-pointer"><circle cx={x} cy={y} r="7" fill="transparent"/><circle cx={x} cy={y} r="4" fill="white" stroke="var(--emerald)" strokeWidth="3"/><text x={x} y={y - 10} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{value}</text><text x={x} y="140" textAnchor="middle" className="fill-muted-foreground text-[8px]">{label}</text></g>)}</svg>{selectedDay && <div className="mt-2 rounded-xl bg-emerald/10 p-3 text-xs"><b>{selectedDay}</b><p className="mt-1 text-muted-foreground">Your recovery score was recorded and your plan remained on track that day.</p><button onClick={() => setSelectedDay(null)} className="mt-1 text-emerald">Close</button></div>}</Card>
  </div>;
}





