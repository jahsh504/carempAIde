import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, Sparkles, Flame, X, Bookmark, Plus,
  TrendingDown, Dumbbell, Leaf, Heart, Droplet, Gauge, Brain, Moon, Flower, HandHeart,
} from "lucide-react";
import { Card, SectionHeader, RingProgress } from "@/components/care/primitives";
import { TaskRow } from "@/components/care/care-module";
import { activePlan, recommendations, programs, streakMilestones } from "@/data/care";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care/")({
  head: () => ({
    meta: [
      { title: "Care Plan — Your daily health plan | careMP AIDE" },
      { name: "description", content: "Care Plan turns your Digital Twin's insights into one clear daily plan — today's focus, tasks, reasoning and personalised care programs." },
      { property: "og:title", content: "Care Plan — Your daily health plan | careMP AIDE" },
      { property: "og:description", content: "One question, answered every morning: what is the best thing for me to do today?" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarePage,
});

const programIcon: Record<string, typeof Heart> = {
  "trending-down": TrendingDown, dumbbell: Dumbbell, leaf: Leaf, heart: Heart,
  droplet: Droplet, gauge: Gauge, brain: Brain, moon: Moon, flower: Flower, "hand-heart": HandHeart,
};

const recTone: Record<string, string> = {
  teal: "bg-teal/10 text-teal",
  blue: "bg-blue/10 text-blue",
  emerald: "bg-emerald/10 text-emerald",
  amber: "bg-amber/15 text-amber",
  coral: "bg-coral/10 text-coral",
};

function CarePage() {
  const [hasPlan, setHasPlan] = useState(true);
  const [tasks, setTasks] = useState(activePlan.tasks);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  const toggle = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      if (next.every((t) => t.done)) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 2600);
      }
      return next;
    });
  };

  const applyRec = (id: string, title: string) => {
    setApplied((p) => [...p, id]);
    setTasks((prev) => [...prev, { id: `rec-${id}`, title, minutes: 5, category: "recovery", done: false, why: "Added from a Twin recommendation." }]);
    setTimeout(() => setDismissed((p) => [...p, id]), 700);
  };

  if (!hasPlan) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 grid h-40 w-40 place-items-center">
          <div className="absolute inset-0 rounded-full bg-teal/15 blur-2xl breathing" />
          <div className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-white soft-shadow">
            <Sparkles className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-xl font-semibold">Let's build your Care Plan</h1>
        <p className="mt-2 max-w-[280px] text-sm text-muted-foreground">
          Your Digital Twin will turn 30 days of your vitals into one simple plan — a handful of things to do each day, and the reason behind each one.
        </p>
        <button
          onClick={() => setHasPlan(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-blue px-6 py-3 text-sm font-semibold text-primary-foreground soft-shadow active:scale-[0.98]"
        >
          Create My Plan <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 pb-6">
      {/* 1. Daily Focus */}
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-teal/30 blur-3xl breathing" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-blue/20 blur-3xl breathing [animation-delay:900ms]" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Today's focus</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">
              <Flame className="h-3 w-3 text-amber" /> {activePlan.streak} day streak
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <RingProgress value={pct} size={78} stroke={7} color="var(--teal)">
              <span className="num text-base font-semibold text-white">{pct}%</span>
            </RingProgress>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold">{activePlan.focusTitle}</h1>
              <p className="mt-1 text-[11px] text-white/60">
                Day {activePlan.day} of {activePlan.totalDays} · Twin score {activePlan.score}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-white/85">{activePlan.focusLine}</p>
        </div>
      </div>

      {celebrate && (
        <Card className="scale-in border-emerald/30 bg-emerald/5 text-center">
          <p className="text-sm font-semibold text-emerald">Every task done today</p>
          <p className="mt-1 text-xs text-muted-foreground">{streakMilestones[0]} · {streakMilestones[1]}</p>
        </Card>
      )}

      {/* 2. Today's Plan */}
      <div id="todays-plan">
        <SectionHeader title="Today's plan" hint={`${doneCount} of ${tasks.length} complete`} />
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-teal to-blue transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="space-y-2">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* 5. Smart recommendations */}
      <div>
        <SectionHeader title="From your Twin" hint="Recommendations, not ads" />
        <div className="space-y-2">
          {recommendations.filter((r) => !dismissed.includes(r.id)).map((r) => (
            <Card key={r.id} className="p-3.5">
              <div className="flex items-start gap-3">
                <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", recTone[r.tone])}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{r.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{r.reason}</p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      onClick={() => applyRec(r.id, r.title)}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground active:scale-95"
                    >
                      <Plus className="h-3 w-3" /> {applied.includes(r.id) ? "Added" : "Apply to plan"}
                    </button>
                    <button
                      onClick={() => setSaved((p) => (p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id]))}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium",
                        saved.includes(r.id) && "border-teal/30 bg-teal/10 text-teal"
                      )}
                    >
                      <Bookmark className="h-3 w-3" /> {saved.includes(r.id) ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={() => setDismissed((p) => [...p, r.id])}
                      aria-label="Dismiss recommendation"
                      className="ml-auto grid h-7 w-7 place-items-center rounded-full text-muted-foreground active:scale-90"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {recommendations.every((r) => dismissed.includes(r.id)) && (
            <Card className="text-center text-xs text-muted-foreground">
              All caught up — your Twin will surface more tomorrow.
            </Card>
          )}
        </div>
      </div>

      {/* 6. Care programs */}
      <div>
        <SectionHeader title="Care programs" hint="Generates a plan from your Twin" />
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
          {programs.map((p) => {
            const Icon = programIcon[p.icon] ?? Heart;
            return (
              <Link
                key={p.key}
                to="/care/$program"
                params={{ program: p.key }}
                className="card-surface w-[150px] shrink-0 p-3.5 transition-transform active:scale-[0.98]"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-blue text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2.5 text-[13px] font-semibold">{p.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{p.tagline}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{p.weeks} weeks</p>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
