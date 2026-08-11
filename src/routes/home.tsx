import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Heart,
  Moon,
  Activity,
  Droplets,
  Droplet,
  Gauge,
  Pill,
  ChevronDown,
  Plus,
  Sparkles,
  UploadCloud,
  MessageCircle,
  Stethoscope,
  Check,
} from "lucide-react";
import {
  scores,
  insight,
  mission,
  medication,
  vitalsList,
  user,
} from "@/data/mock";
import {
  changeDetectionMetrics,
  type TimeRange,
  type MetricDataPoint,
} from "@/data/change-detection";
import {
  RadialScore,
  Sparkline,
  StatusChip,
  TrendBadge,
  Card,
  SectionHeader,
  IconTile,
} from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — careMP AIDE" },
      {
        name: "description",
        content:
          "Your personalized health dashboard with vitals, insights, and today's wellness mission.",
      },
    ],
  }),
  component: HomePage,
});

const mockFunFacts = [
  {
    headline: "Your heart has a surprisingly consistent nighttime rhythm.",
    detail: "Your resting heart rate usually reaches its lowest point around 3:10 AM.",
    context: "Based on your vital + sleep data.",
  },
  {
    headline: "You're more active than you probably realize.",
    detail: "Your most active hour is usually around 6:00 PM.",
    context: "Based on your activity + movement logs.",
  },
  {
    headline: "Your body settles into sleep at a surprisingly consistent time.",
    detail: "Your sleep onset has stayed within a narrow window recently.",
    context: "Based on your sleep baseline.",
  },
  {
    headline: "Your resting heart rate has been remarkably steady lately.",
    detail: "Your recent readings have stayed close to your personal baseline.",
    context: "Based on your heart rate trends.",
  },
  {
    headline: "Your sleep and activity have a rhythm of their own.",
    detail: "Your more active days often line up with your more consistent nights.",
    context: "Based on your lifestyle intelligence.",
  },
  {
    headline: "Your body has a pretty consistent overnight rhythm.",
    detail: "Your heart rate follows a similar pattern across most nights.",
    context: "Based on your nocturnal vitals.",
  },
];

const iconMap = {
  "heart-rate": Heart,
  "blood-pressure": Gauge,
  sleep: Moon,
  activity: Activity,
  spo2: Droplets,
  glucose: Droplet,
} as const;

function ChangeDetectionTrendGraph() {
  const [selectedMetric, setSelectedMetric] = useState<string>("sleep");
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7D");
  const [hoveredPoint, setHoveredPoint] = useState<MetricDataPoint | null>(null);

  const output = changeDetectionMetrics[selectedMetric] || changeDetectionMetrics.sleep;
  const series = output.series[selectedRange];

  const width = 360;
  const height = 150;
  const padding = { top: 20, right: 15, bottom: 25, left: 35 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const actuals = series.map((s) => s.actual);
  const baselines = series.map((s) => s.baseline);
  const allValues = [...actuals, ...baselines];
  const minVal = Math.min(...allValues) * 0.95;
  const maxVal = Math.max(...allValues) * 1.05;
  const valRange = maxVal - minVal || 1;

  const getX = (i: number) => padding.left + (i / Math.max(1, series.length - 1)) * chartW;
  const getY = (v: number) => padding.top + chartH - ((v - minVal) / valRange) * chartH;

  const actualPath = series
    .map((s, i) => `${i === 0 ? "M" : "L"}${getX(i).toFixed(1)},${getY(s.actual).toFixed(1)}`)
    .join(" ");

  const baselinePath = series
    .map((s, i) => `${i === 0 ? "M" : "L"}${getX(i).toFixed(1)},${getY(s.baseline).toFixed(1)}`)
    .join(" ");

  const changeIndices = series
    .map((s, i) => (s.isChangeDetected ? i : -1))
    .filter((i) => i !== -1);

  const activePoint = hoveredPoint || series[series.length - 1];

  return (
    <Card className="space-y-3.5">
      {/* Metric Selector & Range Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Change Detection Engine
          </p>
          <div className="flex rounded-full border border-border bg-muted/60 p-0.5 text-[10.5px]">
            {(["7D", "14D", "30D", "90D"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRange(r);
                  setHoveredPoint(null);
                }}
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium transition-colors",
                  selectedRange === r ? "bg-card font-semibold text-foreground shadow-xs" : "text-muted-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Metric Selector */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
          {Object.values(changeDetectionMetrics).map((m) => (
            <button
              key={m.metricKey}
              onClick={() => {
                setSelectedMetric(m.metricKey);
                setHoveredPoint(null);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
                selectedMetric === m.metricKey
                  ? "border-teal/40 bg-teal/10 text-teal font-semibold"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              )}
            >
              {m.metricName}
            </button>
          ))}
        </div>
      </div>

      {/* Live Change Summary */}
      <div className="rounded-2xl bg-muted/40 p-3.5 border border-border space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold uppercase tracking-wider text-foreground">{output.metricName}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10.5px] font-medium",
                output.trendState === "Improving" ? "bg-emerald/10 text-emerald" :
                output.trendState === "Declining" ? "bg-amber/15 text-amber" :
                "bg-blue/10 text-blue"
              )}
            >
              {output.trendState}
            </span>
          </div>
          <span className="num text-[13px] font-semibold text-teal">{output.magnitude}</span>
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">"{output.interpretation}"</p>
        
        {output.changeEvent && (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-teal">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Change detected: {output.changeEvent.title}</span>
          </div>
        )}
      </div>

      {/* Graph Area */}
      <div className="relative pt-1">
        {/* Tooltip Details */}
        <div className="mb-2 flex items-center justify-between rounded-xl bg-card border border-border px-3 py-2 text-[11.5px]">
          <div>
            <span className="text-muted-foreground">{activePoint.date}: </span>
            <span className="font-semibold text-foreground">{activePoint.formattedActual}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Baseline: <span className="font-medium text-foreground">{activePoint.formattedBaseline}</span></span>
            <span className="num font-semibold text-teal">{activePoint.differenceFormatted}</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
            <defs>
              <linearGradient id="actual-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Change Highlight Shading Band */}
            {changeIndices.length > 1 && (
              <rect
                x={getX(changeIndices[0])}
                y={padding.top}
                width={getX(changeIndices[changeIndices.length - 1]) - getX(changeIndices[0])}
                height={chartH}
                fill="var(--teal)"
                opacity="0.08"
                rx={4}
              />
            )}

            {/* Baseline path */}
            <path
              d={baselinePath}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Actual fill */}
            <path
              d={`${actualPath} L${getX(series.length - 1)},${padding.top + chartH} L${padding.left},${padding.top + chartH} Z`}
              fill="url(#actual-glow)"
            />

            {/* Actual line */}
            <path
              d={actualPath}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {series.map((s, i) => {
              const cx = getX(i);
              const cy = getY(s.actual);
              const isSelected = activePoint.date === s.date;
              return (
                <g key={s.date} className="cursor-pointer" onClick={() => setHoveredPoint(s)} onMouseEnter={() => setHoveredPoint(s)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : s.isChangeDetected ? 4.5 : 3}
                    fill={isSelected ? "var(--teal)" : "var(--card)"}
                    stroke="var(--teal)"
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={cx}
                    y={height - 5}
                    textAnchor="middle"
                    className="text-[9.5px] fill-muted-foreground font-medium"
                  >
                    {s.date.split(" ")[1] || s.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10.5px] text-muted-foreground border-t border-border pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-b-2 border-dashed border-muted-foreground" />
            <span>Personal baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal" />
            <span>Actual trend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-teal/20" />
            <span>Detected change</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function HomePage() {
  const [insightOpen, setInsightOpen] = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [medTaken, setMedTaken] = useState(false);

  const [factOpen, setFactOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const index = Math.floor(Math.random() * mockFunFacts.length);
    setFactIndex(index);
  }, []);

  const currentFact = mockFunFacts[factIndex];

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Hero score */}
      <div className="relative overflow-visible rounded-3xl border border-border bg-gradient-to-br from-card via-card to-teal/5 p-5 soft-shadow rise-in">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/15 blur-3xl overflow-hidden" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue/15 blur-3xl overflow-hidden" />
        <div className="relative flex items-center gap-4">
          <RadialScore value={scores.overall} label="Health" size={148} />
          <div className="flex-1 space-y-2.5 min-w-0">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                How you're doing today
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Balanced & recovering</span>
                <TrendBadge value={scores.overallTrend} />
              </div>
            </div>

            {/* Compact Fun Fact Trigger Button */}
            <div className="relative inline-block">
              <button
                onMouseEnter={() => setFactOpen(true)}
                onMouseLeave={() => setFactOpen(false)}
                onClick={() => setFactOpen((v) => !v)}
                className="group flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1.5 text-[11.5px] font-medium text-teal transition-all hover:bg-teal/20 active:scale-95 cursor-pointer"
              >
                <span>✨ Fun Fact About You</span>
                <span className="text-[10px] opacity-70 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              {/* Floating Popover Overlay */}
              {factOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden"
                    onClick={() => setFactOpen(false)}
                  />
                  <div
                    onMouseEnter={() => setFactOpen(true)}
                    onMouseLeave={() => setFactOpen(false)}
                    className="absolute left-0 bottom-full mb-2 z-50 w-72 rounded-2xl border border-border bg-popover/95 p-3.5 text-popover-foreground shadow-xl backdrop-blur-md rise-in"
                  >
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-teal">
                      FUN FACT ABOUT YOU ✨
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-snug text-foreground">
                      "{currentFact.headline}"
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {currentFact.detail}
                    </p>
                    <p className="mt-2 pt-1.5 border-t border-border/60 text-[10px] text-muted-foreground/80">
                      {currentFact.context}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI insight */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 via-card to-blue/5">
        <div className="flex gap-3">
          <IconTile tone="teal">
            <Sparkles className="h-4.5 w-4.5" />
          </IconTile>
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-teal">
              Today's AI insight
            </p>
            <p className="mt-1 text-sm leading-relaxed">{insight.headline}</p>
            <button
              onClick={() => setInsightOpen((v) => !v)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              {insightOpen ? "Hide" : "Why"}{" "}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", insightOpen && "rotate-180")}
              />
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
          <IconTile tone="emerald">
            <Activity className="h-4.5 w-4.5" />
          </IconTile>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Daily wellness mission
            </p>
            <p
              className={cn(
                "text-sm font-medium",
                missionDone && "line-through text-muted-foreground",
              )}
            >
              {mission.title}
            </p>
          </div>
          <button
            onClick={() => setMissionDone((v) => !v)}
            aria-label="Complete mission"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full border-2 transition-all",
              missionDone ? "border-emerald bg-emerald text-white" : "border-border",
            )}
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
                  <IconTile
                    tone={v.status === "good" ? "teal" : v.status === "caution" ? "amber" : "coral"}
                  >
                    <Icon className="h-4 w-4" />
                  </IconTile>
                  <StatusChip status={v.status}>
                    {v.status === "good" ? "Good" : v.status === "caution" ? "Watch" : "Alert"}
                  </StatusChip>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{v.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="num text-xl font-semibold">{v.value}</span>
                  {v.unit && <span className="text-[11px] text-muted-foreground">{v.unit}</span>}
                </div>
                <div className="mt-1">
                  <Sparkline
                    data={v.series}
                    width={140}
                    height={28}
                    color={v.status === "caution" ? "var(--amber)" : "var(--teal)"}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Next Medication (Clean Single Card - Appointments removed) */}
      <Card>
        <div className="flex items-center gap-3">
          <IconTile tone="blue">
            <Pill className="h-4.5 w-4.5" />
          </IconTile>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Next medication
            </p>
            <p className="truncate text-sm font-medium">
              {medication.name} · {medication.dose}
            </p>
            <p className="text-xs text-muted-foreground">
              Today at {medication.time} · {medication.streak}-day streak
            </p>
          </div>
          <button
            onClick={() => setMedTaken(true)}
            disabled={medTaken}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              medTaken ? "bg-emerald/15 text-emerald" : "bg-primary text-primary-foreground",
            )}
          >
            {medTaken ? "Taken" : "Mark taken"}
          </button>
        </div>
      </Card>

      {/* Change Detection Trend Graph (Alerts removed & Trend updated) */}
      <ChangeDetectionTrendGraph />

      <p className="pt-2 text-center text-[10px] text-muted-foreground">
        Signed in as {user.firstName} {user.lastName}
      </p>
    </div>
  );
}
