import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info, ChevronDown, ChevronRight, Dumbbell, TrendingDown, Heart, Leaf, Pill, CircleCheck } from "lucide-react";
import { scores, bodySystems, twinSummary, twinChanges, healthMemory, dataSources, user } from "@/data/mock";
import { RadialScore, RingProgress, TrendBadge, Card, SectionHeader, statusRing } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "My Health Twin — careMP" },
      { name: "description", content: "A living Digital Twin of your body — evolving with every vital, meal, and night of sleep." },
    ],
  }),
  component: Twin,
});

const memIcon = { dumbbell: Dumbbell, "trending-down": TrendingDown, heart: Heart, leaf: Leaf, pill: Pill, "check-circle": CircleCheck } as const;

function Twin() {
  const [confOpen, setConfOpen] = useState(false);

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Twin hero — dark panel */}
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/30 blur-3xl breathing" />
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/20 blur-2xl breathing [animation-delay:800ms]" />
        </div>
        <div className="relative flex flex-col items-center pt-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald/20 px-3 py-1 text-[11px] font-medium text-emerald">Recovering</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">Confidence 78%</span>
          </div>
          {/* Silhouette avatar */}
          <div className="relative h-56 w-40">
            <svg viewBox="0 0 100 200" className="relative z-10 h-full w-full breathing">
              <defs>
                <linearGradient id="tw-body" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5CE1D3" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4B8CFF" stopOpacity="0.7" />
                </linearGradient>
                <radialGradient id="tw-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#5CE1D3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#5CE1D3" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="100" r="55" fill="url(#tw-glow)" />
              <circle cx="50" cy="26" r="14" fill="url(#tw-body)" />
              <path
                d="M28 60 Q50 44 72 60 L74 118 Q74 128 68 130 L60 132 L58 178 Q58 186 52 186 L48 186 Q42 186 42 178 L40 132 L32 130 Q26 128 26 118 Z"
                fill="url(#tw-body)"
              />
              {/* Cardiac pulse mark */}
              <circle cx="44" cy="80" r="3" fill="#fff" opacity="0.9" className="breathing" />
            </svg>
          </div>
          <div className="mt-4 grid w-full grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Twin health</p>
              <p className="num text-2xl font-semibold">{scores.twinHealth}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Health age</p>
              <p className="num text-2xl font-semibold">{user.biologicalAge}<span className="text-sm text-white/60">/{user.age}</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">Trend</p>
              <p className="text-lg font-semibold text-emerald">Improving</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Twin summary */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">AI Twin summary</p>
        <p className="mt-2 text-sm leading-relaxed">{twinSummary}</p>
      </Card>

      {/* Body systems */}
      <div>
        <SectionHeader title="Body systems" hint="Tap a system for details" />
        <div className="grid grid-cols-2 gap-3">
          {bodySystems.map((s) => (
            <Link
              key={s.key}
              to="/twin/$system"
              params={{ system: s.key }}
              className="card-surface flex flex-col items-center p-3 text-center transition-transform active:scale-[0.98]"
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


      {/* What has changed */}
      <div>
        <SectionHeader title="What has changed" hint="Last 14 days" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {twinChanges.map((c) => (
            <div
              key={c.label}
              className={cn("shrink-0 rounded-2xl border px-3 py-2",
                c.tone === "good" ? "border-emerald/30 bg-emerald/5" : "border-amber/30 bg-amber/5")}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className={cn("num text-base font-semibold", c.tone === "good" ? "text-emerald" : "text-amber")}>{c.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health memory */}
      <div>
        <SectionHeader title="Health memory" hint="Your story" />
        <Card className="p-0">
          <div className="relative py-2">
            <span className="absolute left-[26px] top-4 bottom-4 w-px bg-border" />
            {healthMemory.map((m, i) => {
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

      {/* Twin confidence */}
      <Card>
        <button className="flex w-full items-center gap-3" onClick={() => setConfOpen((v) => !v)}>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue/10 text-blue"><Info className="h-4 w-4" /></div>
          <div className="flex-1 text-left">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Twin confidence</p>
            <p className="text-sm font-medium">78% · Growing every day</p>
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
              Connect more sources (nutrition log, glucose monitor) to push your Twin past 90%.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
