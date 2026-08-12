import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  SectionHeader,
  StatusChip,
  TrendBadge,
} from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vitals/$metric")({
  head: ({ params }) => {
    const titleMap: Record<string, string> = {
      sleep: "Sleep Trend — careMP",
      activity: "Activity Trend — careMP",
      wellness: "Wellness Trend — careMP",
      stress: "Stress Trend — careMP",
      "heart-rate": "Heart Rate Trend — careMP",
      cardio: "Cardiovascular Trend — careMP",
    };
    return {
      meta: [
        { title: titleMap[params.metric] ?? "Vital Trend — careMP" },
        { name: "description", content: "Family Circle rolling trend view." },
      ],
    };
  },
  component: VitalDetail,
});

type WindowRange = "7d" | "1m";

type DataPoint = {
  date: string;
  value: number;
  displayValue: string;
};

type MetricTrendConfig = {
  label: string;
  unit: string;
  currentValue: string;
  status: "good" | "caution" | "critical";
  context: string;
  trend: string;
  series7d: DataPoint[];
  series1m: DataPoint[];
  insight7d: string;
  insight1m: string;
  readings: { time: string; value: string }[];
  recommendations: string[];
};

const metricDataMap: Record<string, MetricTrendConfig> = {
  activity: {
    label: "Activity",
    unit: "steps / day",
    currentValue: "8,400",
    status: "good",
    context: "Improving",
    trend: "+68% vs baseline",
    series7d: [
      { date: "Aug 6", value: 6400, displayValue: "6,400 steps" },
      { date: "Aug 7", value: 6800, displayValue: "6,800 steps" },
      { date: "Aug 8", value: 7200, displayValue: "7,200 steps" },
      { date: "Aug 9", value: 7500, displayValue: "7,500 steps" },
      { date: "Aug 10", value: 7800, displayValue: "7,800 steps" },
      { date: "Aug 11", value: 8200, displayValue: "8,200 steps" },
      { date: "Today (Aug 12)", value: 8400, displayValue: "8,400 steps" },
    ],
    series1m: [
      { date: "Jul 14", value: 3400, displayValue: "3,400 steps" },
      { date: "Jul 21", value: 4800, displayValue: "4,800 steps" },
      { date: "Jul 28", value: 6200, displayValue: "6,200 steps" },
      { date: "Aug 4", value: 7600, displayValue: "7,600 steps" },
      { date: "Today (Aug 12)", value: 8400, displayValue: "8,400 steps" },
    ],
    insight7d: "Activity has increased consistently over the past 7 days, averaging +1,200 steps higher than last week.",
    insight1m: "Daily step count has steadily climbed over the past month since starting a regular exercise routine.",
    readings: [
      { time: "Today 10:30 AM", value: "8,400 steps" },
      { time: "Yesterday 9:15 PM", value: "8,200 steps" },
      { time: "Aug 10 8:45 PM", value: "7,800 steps" },
      { time: "Aug 9 9:00 PM", value: "7,500 steps" },
      { time: "Aug 8 8:30 PM", value: "7,200 steps" },
    ],
    recommendations: [
      "Maintain morning walk routine — 6 of 7 days active",
      "Pace daily targets around peak energy hours",
      "Stay hydrated during afternoon activity sessions",
    ],
  },
  sleep: {
    label: "Sleep",
    unit: "hours / night",
    currentValue: "7.6",
    status: "good",
    context: "Consistent",
    trend: "+23 mins deep sleep",
    series7d: [
      { date: "Aug 6", value: 7.1, displayValue: "7h 06m" },
      { date: "Aug 7", value: 7.4, displayValue: "7h 24m" },
      { date: "Aug 8", value: 6.8, displayValue: "6h 48m" },
      { date: "Aug 9", value: 7.5, displayValue: "7h 30m" },
      { date: "Aug 10", value: 7.8, displayValue: "7h 48m" },
      { date: "Aug 11", value: 7.4, displayValue: "7h 24m" },
      { date: "Today (Aug 12)", value: 7.6, displayValue: "7h 36m" },
    ],
    series1m: [
      { date: "Jul 14", value: 6.5, displayValue: "6h 30m" },
      { date: "Jul 21", value: 6.8, displayValue: "6h 48m" },
      { date: "Jul 28", value: 7.2, displayValue: "7h 12m" },
      { date: "Aug 4", value: 7.5, displayValue: "7h 30m" },
      { date: "Today (Aug 12)", value: 7.6, displayValue: "7h 36m" },
    ],
    insight7d: "Sleep has been consistent this week, maintaining an average of 7.5 hours per night with optimal recovery.",
    insight1m: "Sleep duration and continuity have steadily improved over the past month.",
    readings: [
      { time: "Today 7:30 AM", value: "7h 36m · 85/100 score" },
      { time: "Yesterday 7:15 AM", value: "7h 24m · 82/100 score" },
      { time: "Aug 10 7:20 AM", value: "7h 48m · 88/100 score" },
      { time: "Aug 9 7:00 AM", value: "7h 30m · 84/100 score" },
      { time: "Aug 8 7:10 AM", value: "6h 48m · 78/100 score" },
    ],
    recommendations: [
      "Keep consistent bedtime routine around 10:30 PM",
      "Avoid screens 30 minutes before rest",
      "Keep room temperature cool and comfortable",
    ],
  },
  wellness: {
    label: "Wellness Score",
    unit: "/ 100",
    currentValue: "88",
    status: "good",
    context: "Balanced",
    trend: "+3 pts vs baseline",
    series7d: [
      { date: "Aug 6", value: 82, displayValue: "82 / 100" },
      { date: "Aug 7", value: 83, displayValue: "83 / 100" },
      { date: "Aug 8", value: 84, displayValue: "84 / 100" },
      { date: "Aug 9", value: 85, displayValue: "85 / 100" },
      { date: "Aug 10", value: 86, displayValue: "86 / 100" },
      { date: "Aug 11", value: 87, displayValue: "87 / 100" },
      { date: "Today (Aug 12)", value: 88, displayValue: "88 / 100" },
    ],
    series1m: [
      { date: "Jul 14", value: 76, displayValue: "76 / 100" },
      { date: "Jul 21", value: 80, displayValue: "80 / 100" },
      { date: "Jul 28", value: 83, displayValue: "83 / 100" },
      { date: "Aug 4", value: 86, displayValue: "86 / 100" },
      { date: "Today (Aug 12)", value: 88, displayValue: "88 / 100" },
    ],
    insight7d: "Overall wellness score has been steadily climbing over the past 7 days, supported by stable sleep and active movement.",
    insight1m: "Monthly wellness indicators reflect steady long-term resilience and health alignment.",
    readings: [
      { time: "Today 8:00 AM", value: "88 / 100" },
      { time: "Yesterday 8:00 AM", value: "87 / 100" },
      { time: "Aug 10 8:00 AM", value: "86 / 100" },
      { time: "Aug 9 8:00 AM", value: "85 / 100" },
      { time: "Aug 8 8:00 AM", value: "84 / 100" },
    ],
    recommendations: [
      "Maintain active recovery balance",
      "Continue balanced nutrition and dose routines",
      "Ensure adequate night recovery",
    ],
  },
  stress: {
    label: "Stress Index",
    unit: "/ 100",
    currentValue: "34",
    status: "good",
    context: "Lower",
    trend: "-12 pts vs baseline",
    series7d: [
      { date: "Aug 6", value: 44, displayValue: "44 / 100 (Moderate)" },
      { date: "Aug 7", value: 42, displayValue: "42 / 100" },
      { date: "Aug 8", value: 40, displayValue: "40 / 100" },
      { date: "Aug 9", value: 38, displayValue: "38 / 100" },
      { date: "Aug 10", value: 36, displayValue: "36 / 100" },
      { date: "Aug 11", value: 35, displayValue: "35 / 100" },
      { date: "Today (Aug 12)", value: 34, displayValue: "34 / 100 (Calm)" },
    ],
    series1m: [
      { date: "Jul 14", value: 52, displayValue: "52 / 100" },
      { date: "Jul 21", value: 46, displayValue: "46 / 100" },
      { date: "Jul 28", value: 41, displayValue: "41 / 100" },
      { date: "Aug 4", value: 37, displayValue: "37 / 100" },
      { date: "Today (Aug 12)", value: 34, displayValue: "34 / 100" },
    ],
    insight7d: "Stress levels have been lower recently, decreasing by 10 points over the past week.",
    insight1m: "Autonomic recovery has improved over the past month with lower evening stress scores.",
    readings: [
      { time: "Today 11:00 AM", value: "34 / 100" },
      { time: "Yesterday 11:00 AM", value: "35 / 100" },
      { time: "Aug 10 11:00 AM", value: "36 / 100" },
      { time: "Aug 9 11:00 AM", value: "38 / 100" },
      { time: "Aug 8 11:00 AM", value: "40 / 100" },
    ],
    recommendations: [
      "Keep up regular light exercise",
      "Take 5-minute breathing pauses during busy work hours",
      "Maintain consistent sleep schedule",
    ],
  },
  "heart-rate": {
    label: "Resting Heart Rate",
    unit: "bpm",
    currentValue: "68",
    status: "good",
    context: "Optimal",
    trend: "-4 bpm vs baseline",
    series7d: [
      { date: "Aug 6", value: 72, displayValue: "72 bpm" },
      { date: "Aug 7", value: 71, displayValue: "71 bpm" },
      { date: "Aug 8", value: 70, displayValue: "70 bpm" },
      { date: "Aug 9", value: 69, displayValue: "69 bpm" },
      { date: "Aug 10", value: 69, displayValue: "69 bpm" },
      { date: "Aug 11", value: 68, displayValue: "68 bpm" },
      { date: "Today (Aug 12)", value: 68, displayValue: "68 bpm" },
    ],
    series1m: [
      { date: "Jul 14", value: 74, displayValue: "74 bpm" },
      { date: "Jul 21", value: 72, displayValue: "72 bpm" },
      { date: "Jul 28", value: 70, displayValue: "70 bpm" },
      { date: "Aug 4", value: 69, displayValue: "69 bpm" },
      { date: "Today (Aug 12)", value: 68, displayValue: "68 bpm" },
    ],
    insight7d: "Resting heart rate has settled at an optimal 68 bpm baseline over the past 7 days.",
    insight1m: "Cardiovascular efficiency has improved over the past month with a 6 bpm reduction in resting strain.",
    readings: [
      { time: "Today 7:12 AM", value: "68 bpm" },
      { time: "Yesterday 7:04 AM", value: "68 bpm" },
      { time: "Aug 10 7:15 AM", value: "69 bpm" },
      { time: "Aug 9 7:00 AM", value: "69 bpm" },
      { time: "Aug 8 7:10 AM", value: "70 bpm" },
    ],
    recommendations: [
      "Maintain active walking sessions",
      "Keep nighttime rest consistent",
      "Stay well hydrated throughout the day",
    ],
  },
};

function VitalDetail() {
  const { metric } = Route.useParams();
  const v = metricDataMap[metric] ?? metricDataMap["heart-rate"];
  const [range, setRange] = useState<WindowRange>("7d");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const series = range === "7d" ? v.series7d : v.series1m;
  const currentInsight = range === "7d" ? v.insight7d : v.insight1m;

  // Chart dimensions & point math
  const width = 320;
  const height = 120;
  const padding = 20;

  const values = series.map((s) => s.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  const points = series.map((s, idx) => {
    const x = padding + (idx / (series.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((s.value - minVal) / valRange) * (height - 2 * padding);
    return { x, y, ...s };
  });

  const pathD = points.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  const activePoint = activePointIndex !== null ? points[activePointIndex] : points[points.length - 1];

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Main Trend Card */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{v.label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="num text-4xl font-semibold">{v.currentValue}</span>
              <span className="text-xs text-muted-foreground">{v.unit}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusChip status={v.status}>{v.context}</StatusChip>
              <TrendBadge value={v.trend} />
            </div>
          </div>

          {/* Time Window Switcher (Strictly 7 Days | 1 Month Rolling) */}
          <div className="flex rounded-full border border-border bg-muted/60 p-0.5 text-[10.5px]">
            <button
              onClick={() => {
                setRange("7d");
                setActivePointIndex(null);
              }}
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                range === "7d"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              7 DAYS
            </button>
            <button
              onClick={() => {
                setRange("1m");
                setActivePointIndex(null);
              }}
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                range === "1m"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              1 MONTH
            </button>
          </div>
        </div>

        {/* Interactive SVG Trend Line with Point Tooltip */}
        <div className="mt-4 relative flex flex-col items-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
            {/* Background subtle grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" strokeDasharray="3 3" className="text-border/40" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeDasharray="3 3" className="text-border/40" />

            {/* Connecting trend line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, idx) => {
              const isSelected = activePointIndex === idx || (activePointIndex === null && idx === points.length - 1);
              return (
                <g key={idx} onClick={() => setActivePointIndex(idx)} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? "var(--teal)" : "var(--card)"}
                    stroke="var(--teal)"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 hover:scale-125"
                  />
                </g>
              );
            })}
          </svg>

          {/* Selected Point Floating Tooltip */}
          {activePoint && (
            <div className="mt-2 rounded-xl border border-border/80 bg-muted/50 px-3 py-1.5 text-center text-xs backdrop-blur-xs rise-in">
              <span className="font-semibold text-foreground">{activePoint.date}: </span>
              <span className="font-bold text-teal">{activePoint.displayValue}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Human-Friendly AI Insight */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">How it's changing</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          "{currentInsight}"
        </p>
      </Card>

      {/* Recent Readings List */}
      <SectionHeader title="Recent readings" />
      <Card className="p-0">
        {v.readings.map((r, i, a) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between px-4 py-3",
              i < a.length - 1 && "border-b border-border"
            )}
          >
            <span className="text-xs text-muted-foreground">{r.time}</span>
            <span className="num text-sm font-semibold">{r.value}</span>
          </div>
        ))}
      </Card>

      {/* Family-Friendly Recommendations */}
      <SectionHeader title="Recommendations" />
      <div className="space-y-2">
        {v.recommendations.map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-3 text-sm leading-snug">
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
