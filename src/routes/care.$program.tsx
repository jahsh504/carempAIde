import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { programs, activePlan } from "@/data/care";

export const Route = createFileRoute("/care/$program")({
  head: ({ params }) => {
    const p = programs.find((x) => x.key === params.program);
    return {
      meta: [
        { title: `${p?.label ?? "Care program"} — Care | careMP AIDE` },
        {
          name: "description",
          content: `${p?.tagline ?? "A personalised care program"} — generated from your Digital Twin over ${p?.weeks ?? 12} weeks.`,
        },
        { property: "og:title", content: `${p?.label ?? "Care program"} — Care | careMP AIDE` },
        {
          property: "og:description",
          content: p?.twinNote ?? "A care plan built from your Digital Twin.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { program } = Route.useParams();
  const p = programs.find((x) => x.key === program) ?? programs[0];
  const [activated, setActivated] = useState(false);

  const pillars = [
    {
      title: "Week 1–2 · Stabilise",
      body: `Your Twin starts light: sleep regularity and hydration before load. ${p.twinNote}`,
    },
    {
      title: "Week 3–6 · Build",
      body: "Daily tasks increase only when your recovery holds above baseline for 5 days.",
    },
    {
      title: `Week 7–${p.weeks} · Sustain`,
      body: "Plan auto-adjusts each morning as careMP Band data arrives — and explains every change.",
    },
  ];

  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-teal/30 blur-3xl breathing" />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-wider text-white/60">Care program</p>
          <h1 className="mt-1 text-2xl font-semibold">{p.label}</h1>
          <p className="mt-1 text-[13px] text-white/70">
            {p.tagline} · {p.weeks} weeks
          </p>
        </div>
      </div>

      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">
          My Twin noticed
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          {p.twinNote} Based on the last 30 days, this program is a strong fit for you.
        </p>
      </Card>

      <div>
        <SectionHeader title="How your plan evolves" />
        <div className="space-y-2">
          {pillars.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-3.5">
              <p className="text-[13px] font-semibold">{s.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Day 1 looks like" />
        <div className="space-y-2">
          {activePlan.tasks.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-border text-transparent">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-[13px]">{t.title}</span>
              <span className="ml-auto text-[11px] text-muted-foreground">{t.minutes} min</span>
            </div>
          ))}
        </div>
      </div>

      {activated ? (
        <Card className="scale-in border-emerald/30 bg-emerald/5 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald to-teal text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald">{p.label} plan is live</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your Twin rebuilt today's tasks around this goal.
          </p>
          <Link
            to="/care"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Open today's plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <button
          onClick={() => setActivated(true)}
          className="w-full rounded-full bg-gradient-to-r from-teal to-blue px-5 py-3.5 text-sm font-semibold text-primary-foreground soft-shadow active:scale-[0.98]"
        >
          Generate my {p.label} plan
        </button>
      )}
    </div>
  );
}
