import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { family, familyDetails } from "@/data/mock";
import {
  Card,
  SectionHeader,
  RingProgress,
  StatusChip,
} from "@/components/care/primitives";
import { ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/family/$memberId")({
  head: ({ params }) => {
    const m = family.find((f) => f.id === params.memberId);
    return {
      meta: [
        { title: `${m?.name ?? "Family"} — careMP AIDE` },
        {
          name: "description",
          content: `Check in on ${m?.name ?? "your family member"} — today's snapshot, health twin summary and trends.`,
        },
        { property: "og:title", content: `${m?.name ?? "Family"} — careMP AIDE` },
        {
          property: "og:description",
          content: `Check in on ${m?.name ?? "your family member"} — today's snapshot, health twin summary and trends.`,
        },
      ],
    };
  },
  component: MemberDetail,
});

type WindowRange = "7d" | "1m";

type TrendSummary = {
  metricName: string;
  metricRoute: string;
  status: "Stable" | "Improving" | "Higher" | "Lower";
  statusTone: "emerald" | "teal" | "amber" | "coral";
  insight: string;
};

const memberTrendSummaries: Record<string, Record<WindowRange, TrendSummary>> = {
  priya: {
    "7d": {
      metricName: "Activity",
      metricRoute: "activity",
      status: "Improving",
      statusTone: "emerald",
      insight: "Activity has increased recently.",
    },
    "1m": {
      metricName: "Sleep",
      metricRoute: "sleep",
      status: "Stable",
      statusTone: "teal",
      insight: "Sleep has been consistent over the past month.",
    },
  },
  rohan: {
    "7d": {
      metricName: "Sleep",
      metricRoute: "sleep",
      status: "Stable",
      statusTone: "teal",
      insight: "Sleep has been consistent this week.",
    },
    "1m": {
      metricName: "Wellness",
      metricRoute: "wellness",
      status: "Improving",
      statusTone: "emerald",
      insight: "Overall wellness score has improved over the past month.",
    },
  },
  aarav: {
    "7d": {
      metricName: "Stress",
      metricRoute: "stress",
      status: "Lower",
      statusTone: "emerald",
      insight: "Stress levels have been lower recently.",
    },
    "1m": {
      metricName: "Activity",
      metricRoute: "activity",
      status: "Higher",
      statusTone: "teal",
      insight: "Step counts are higher than last month.",
    },
  },
};

function MemberDetail() {
  const { memberId } = Route.useParams();
  const m = family.find((f) => f.id === memberId) ?? family[0];
  const d = familyDetails[m.id] ?? familyDetails.priya;
  const { pull, refreshing, containerRef } = usePullToRefresh();
  const [windowRange, setWindowRange] = useState<WindowRange>("7d");

  const memberTrends = memberTrendSummaries[m.id] ?? memberTrendSummaries.priya;
  const currentSummary = memberTrends[windowRange];

  return (
    <div ref={containerRef} className="px-4 pb-6 space-y-4">
      <div
        className="flex items-center justify-center overflow-hidden text-muted-foreground transition-[height]"
        style={{ height: refreshing ? 28 : Math.min(pull, 48) }}
      >
        {(refreshing || pull > 8) && (
          <span className="inline-flex items-center gap-1.5 text-[11px]">
            <Loader2 className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            {refreshing ? "Updating…" : "Pull to refresh"}
          </span>
        )}
      </div>

      {/* Header */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue to-teal text-white text-sm font-semibold">
            {m.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold">{m.name}</p>
            <p className="text-xs text-muted-foreground">
              {m.relation} · Age {m.age}
            </p>
          </div>
          <StatusChip status={m.status}>{d.statusLabel}</StatusChip>
        </div>
      </Card>

      {/* 1 — Today's snapshot */}
      <SectionHeader title="Today's snapshot" />
      <Card>
        <div className="flex items-center gap-4">
          <RingProgress
            value={d.recovery}
            size={72}
            stroke={7}
            color={
              m.status === "good"
                ? "var(--emerald)"
                : m.status === "caution"
                  ? "var(--amber)"
                  : "var(--coral)"
            }
          />
          <div className="grid flex-1 grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Sleep</p>
              <p className="num text-sm font-semibold">{d.sleep}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Steps</p>
              <p className="num text-sm font-semibold">{d.steps}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
          {d.todayStatus}
        </p>
      </Card>

      {/* 2 — Digital Twin */}
      <SectionHeader title="My Health Twin" />
      <Card>
        <p className="text-sm leading-relaxed">{d.twinSummary}</p>
      </Card>

      {/* 3 — How They've Been */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            How they've been
          </h3>
          <div className="flex rounded-full border border-border bg-muted/60 p-0.5 text-[10.5px]">
            <button
              onClick={() => setWindowRange("7d")}
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                windowRange === "7d"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              7 DAYS
            </button>
            <button
              onClick={() => setWindowRange("1m")}
              className={cn(
                "rounded-full px-2.5 py-1 font-semibold transition-colors cursor-pointer",
                windowRange === "1m"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              1 MONTH
            </button>
          </div>
        </div>

        <Card className="p-0">
          <Link
            to="/vitals/$metric"
            params={{ metric: currentSummary.metricRoute }}
            className="flex items-center justify-between p-4 transition-all hover:bg-muted/30 group cursor-pointer"
          >
            <div className="space-y-1.5 min-w-0 flex-1 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {currentSummary.metricName}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    currentSummary.statusTone === "emerald"
                      ? "bg-emerald/10 text-emerald"
                      : currentSummary.statusTone === "amber"
                      ? "bg-amber/15 text-amber"
                      : "bg-teal/10 text-teal"
                  )}
                >
                  {currentSummary.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                "{currentSummary.insight}"
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Card>
      </div>

      {/* 4 — Insight */}
      <SectionHeader title="Insight" />
      <Card>
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <p className="text-sm leading-relaxed">{d.insight}</p>
        </div>
      </Card>
    </div>
  );
}

/** Lightweight pull-to-refresh for the member's health data. */
function usePullToRefresh() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) startY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current == null) return;
      setPull(Math.max(0, Math.min(64, e.touches[0].clientY - startY.current)));
    };
    const onEnd = () => {
      if (pull > 40) {
        setRefreshing(true);
        window.setTimeout(() => setRefreshing(false), 1000);
      }
      startY.current = null;
      setPull(0);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [pull, refreshing]);

  return { pull, refreshing, containerRef };
}
