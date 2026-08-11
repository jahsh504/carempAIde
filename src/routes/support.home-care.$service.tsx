import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  Activity,
  HandHeart,
  Star,
  Check,
  ArrowLeft,
  Sparkles,
  Clock,
} from "lucide-react";
import { homeProfessionals, accentClass } from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

type Svc = "nurse" | "physio" | "caregiver";

const meta: Record<
  Svc,
  {
    label: string;
    accent: keyof typeof accentClass;
    icon: React.ComponentType<{ className?: string }>;
    prompts: string[];
    needLabel: string;
  }
> = {
  nurse: {
    label: "Home Nurse",
    accent: "rose",
    icon: HeartPulse,
    needLabel: "What do you need care for?",
    prompts: [
      "Post-surgery dressing",
      "IV therapy at home",
      "Elderly parent care",
      "Injection administration",
    ],
  },
  physio: {
    label: "Physiotherapist",
    accent: "blue",
    icon: Activity,
    needLabel: "What are we working on?",
    prompts: [
      "Lower back pain",
      "Post-op knee rehab",
      "Sports injury",
      "Neck & shoulder stiffness",
    ],
  },
  caregiver: {
    label: "Caregiver",
    accent: "violet",
    icon: HandHeart,
    needLabel: "Who needs support & how often?",
    prompts: [
      "Full-time elder care",
      "Overnight companion",
      "Post-hospital recovery",
      "Weekend support",
    ],
  },
};

export const Route = createFileRoute("/support/home-care/$service")({
  head: ({ params }) => {
    const m = meta[params.service as Svc];
    return {
      meta: [
        { title: `${m?.label ?? "Home Care"} — Health Circle` },
        {
          name: "description",
          content: `Book a ${m?.label ?? "home care professional"} matched to your need.`,
        },
      ],
    };
  },
  component: HomeCareFlow,
});

type Step = "describe" | "matching" | "select" | "schedule" | "confirmed";

function HomeCareFlow() {
  const { service } = Route.useParams();
  const svc = (service as Svc) in meta ? (service as Svc) : "nurse";
  const m = meta[svc];
  const Icon = m.icon;
  const a = accentClass[m.accent];
  const pool = homeProfessionals[svc];

  const [step, setStep] = useState<Step>("describe");
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState<"now" | "today" | "later">("today");
  const [proId, setProId] = useState<string | null>(null);
  const [when, setWhen] = useState("Today 6:00 PM");
  const [etaMin, setEtaMin] = useState(38);

  useEffect(() => {
    if (step !== "matching") return;
    const t = setTimeout(() => setStep("select"), 1600);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "confirmed") return;
    const id = setInterval(() => setEtaMin((v) => Math.max(1, v - 1)), 4000);
    return () => clearInterval(id);
  }, [step]);

  const professional = pool.find((p) => p.id === proId) ?? pool[0];

  return (
    <div className="px-4 pb-6 space-y-4">
      {step !== "confirmed" && (
        <div className="mb-1 flex items-center gap-1.5">
          {(["describe", "matching", "select", "schedule"] as Step[]).map((s, i) => {
            const idx = (["describe", "matching", "select", "schedule"] as Step[]).indexOf(step);
            return (
              <div
                key={s}
                className={cn("h-1 flex-1 rounded-full", i <= idx ? a.bg : "bg-muted")}
              />
            );
          })}
        </div>
      )}

      {step === "describe" && (
        <>
          <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
              <Icon className="h-3.5 w-3.5" /> {m.label}
            </div>
            <h1 className="mt-1 text-lg font-semibold">{m.needLabel}</h1>
            <p className="mt-1 text-[12px] opacity-90">
              We'll match you to a professional based on your need & schedule.
            </p>
          </div>
          <Card>
            <textarea
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              rows={4}
              placeholder="Describe in a sentence or two…"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {m.prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setNeed(p)}
                  className={cn("rounded-full px-2.5 py-1 text-[11px]", a.soft, a.text)}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>
          <div>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Urgency
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["now", "ASAP"],
                  ["today", "Today"],
                  ["later", "This week"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setUrgency(k)}
                  className={cn(
                    "rounded-2xl border py-2.5 text-sm font-medium",
                    urgency === k
                      ? cn("border-transparent text-white", a.bg)
                      : "border-border bg-card",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button
            disabled={!need.trim()}
            onClick={() => setStep("matching")}
            className={cn(
              "w-full rounded-full py-3 text-sm font-semibold text-white",
              a.bg,
              !need.trim() && "opacity-40",
            )}
          >
            Find a match
          </button>
        </>
      )}

      {step === "matching" && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className={cn("relative grid h-24 w-24 place-items-center rounded-full", a.soft)}>
            <div
              className={cn("absolute inset-0 rounded-full idle-pulse", a.bg, "opacity-0")}
            ></div>
            <Icon className={cn("h-10 w-10 breathing", a.text)} />
          </div>
          <p className="mt-6 text-sm font-semibold">Matching you now…</p>
          <p className="mt-1 text-[12px] text-muted-foreground max-w-[260px]">
            Reviewing {pool.length * 6} verified {m.label.toLowerCase()}s within 5 km.
          </p>
        </div>
      )}

      {step === "select" && (
        <>
          <StepHeader
            onBack={() => setStep("describe")}
            title="Best matches for you"
            subtitle="Ranked by fit & availability"
          />
          <Card className={cn("border", a.ring)}>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className={cn("h-3.5 w-3.5", a.text)} /> AI match reasoning
            </div>
            <p className="mt-1.5 text-sm">
              Matched on: “{need}” · {urgency === "now" ? "immediate" : urgency} availability ·
              within 5 km · specialisation & rating.
            </p>
          </Card>
          <div className="space-y-2.5">
            {pool.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProId(p.id);
                  setStep("schedule");
                }}
                className="w-full card-surface flex items-center gap-3 p-3 text-left"
              >
                <div
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-2xl text-white font-semibold bg-gradient-to-br",
                    a.grad,
                  )}
                >
                  {p.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {p.credential} · {p.years} yrs
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    <Star className="mr-0.5 inline h-3 w-3 fill-amber text-amber" /> {p.rating} ·{" "}
                    {p.reviews}
                  </p>
                </div>
                <div className="text-right">
                  <p className="num text-sm font-semibold">₹{p.price}</p>
                  <p className="text-[10px] text-emerald">ETA {p.eta}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "schedule" && professional && (
        <>
          <StepHeader
            onBack={() => setStep("select")}
            title="Schedule visit"
            subtitle={`with ${professional.name}`}
          />
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              When should they arrive?
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Now (ASAP)", "Today 6:00 PM", "Today 8:30 PM", "Tomorrow 10:00 AM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setWhen(t)}
                  className={cn(
                    "rounded-2xl border py-2.5 text-sm font-medium",
                    when === t
                      ? cn("border-transparent text-white", a.bg)
                      : "border-border bg-card",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Address
            </p>
            <p className="mt-1 text-sm">Prestige Shantiniketan, Whitefield, Bengaluru 560048</p>
          </Card>
          <div className="card-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Visit fee</span>
              <span className="num font-semibold">₹{professional.price}</span>
            </div>
            <button
              onClick={() => setStep("confirmed")}
              className={cn("mt-3 w-full rounded-full py-3 text-sm font-semibold text-white", a.bg)}
            >
              Confirm & dispatch
            </button>
          </div>
        </>
      )}

      {step === "confirmed" && professional && (
        <>
          <div className={cn("rounded-3xl p-5 text-center text-white bg-gradient-to-br", a.grad)}>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/25 backdrop-blur">
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider opacity-90">
              {m.label} on the way
            </p>
            <h1 className="mt-1 text-xl font-semibold">{professional.name}</h1>
            <p className="mt-1 text-[13px] opacity-90">
              {when} · ₹{professional.price}
            </p>
          </div>
          <Card>
            <div className="flex items-center gap-3">
              <Clock className={cn("h-8 w-8", a.text)} />
              <div className="flex-1">
                <p className="text-sm font-semibold">Arriving in ~{etaMin} min</p>
                <p className="text-[11px] text-muted-foreground">
                  Live location updates every 30 seconds
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", a.bg)}
                style={{ width: `${Math.min(100, ((45 - etaMin) / 45) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Dispatched</span>
              <span>En route</span>
              <span>Arrived</span>
            </div>
          </Card>
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your brief
            </p>
            <p className="mt-2 text-sm">{need}</p>
          </Card>
          <Link
            to="/support"
            className="block rounded-full border border-border bg-card py-3 text-center text-sm font-medium"
          >
            Back to Health Circle
          </Link>
        </>
      )}
    </div>
  );
}

function StepHeader({
  onBack,
  title,
  subtitle,
}: {
  onBack: () => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div>
        <h1 className="text-base font-semibold">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
