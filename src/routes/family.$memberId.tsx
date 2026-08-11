import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { family, familyDetails } from "@/data/mock";
import {
  Card,
  SectionHeader,
  RingProgress,
  StatusChip,
  TrendBadge,
} from "@/components/care/primitives";
import { MessageSquare, Share2, Siren, ChevronRight, Sparkles, Loader2 } from "lucide-react";

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

function MemberDetail() {
  const { memberId } = Route.useParams();
  const m = family.find((f) => f.id === memberId) ?? family[0];
  const d = familyDetails[m.id] ?? familyDetails.priya;
  const { pull, refreshing, containerRef } = usePullToRefresh();

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
        <Link
          to="/twin"
          className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          View Full Twin Analysis
        </Link>
      </Card>

      {/* 3 — Trends */}
      <SectionHeader title="Trends" hint="Last 7 days" />
      <Card className="p-0">
        {d.trends.map((t, i, a) => (
          <Link
            key={t.key}
            to="/vitals/$metric"
            params={{ metric: t.metric }}
            className={`flex items-center justify-between px-4 py-3.5 ${i < a.length - 1 ? "border-b border-border" : ""}`}
          >
            <span className="text-sm">{t.label}</span>
            <span className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">{t.caption}</span>
              <TrendBadge value={t.delta} />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
        ))}
      </Card>

      {/* 4 — Recent events */}
      <SectionHeader title="Recent events" />
      <Card className="p-0">
        {d.events.slice(0, 5).map((e, i, a) => (
          <div
            key={i}
            className={`flex items-start justify-between gap-3 px-4 py-3 ${i < a.length - 1 ? "border-b border-border" : ""}`}
          >
            <span className="text-sm">{e.text}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{e.when}</span>
          </div>
        ))}
      </Card>
      <Link
        to="/notifications"
        className="flex items-center justify-center gap-1 text-xs font-medium text-primary"
      >
        See all activity <ChevronRight className="h-3.5 w-3.5" />
      </Link>

      {/* 5 — Insight */}
      <SectionHeader title="Insight" />
      <Card>
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <p className="text-sm leading-relaxed">{d.insight}</p>
        </div>
      </Card>

      {/* 6 — Quick actions */}
      <SectionHeader title="Quick actions" />
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Message", icon: MessageSquare },
          { label: "Share", icon: Share2 },
          { label: "Emergency", icon: Siren },
        ].map((a) => (
          <button
            key={a.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card px-2 py-3 text-[11px] font-medium"
          >
            <a.icon
              className={`h-4 w-4 ${a.label === "Emergency" ? "text-coral" : "text-muted-foreground"}`}
            />
            {a.label}
          </button>
        ))}
      </div>
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
