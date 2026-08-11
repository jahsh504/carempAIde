import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Video,
  Star,
  ChevronRight,
  Paperclip,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowLeft,
  FileText,
} from "lucide-react";
import {
  onlineProviders,
  onlineServices,
  accentClass,
  type OnlineService,
} from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support/online/$service")({
  head: ({ params }) => {
    const s = onlineServices.find((x) => x.key === (params.service as OnlineService));
    return {
      meta: [
        { title: `${s?.label ?? "Online Care"} — Health Circle` },
        {
          name: "description",
          content: `Book ${s?.label ?? "an online consultation"} on careMP AIDE.`,
        },
      ],
    };
  },
  component: OnlineFlow,
});

type Step = "browse" | "slot" | "intake" | "pay" | "confirmed";

const slotsByDay = {
  Today: ["4:30 PM", "5:00 PM", "6:00 PM", "7:30 PM"],
  Tomorrow: ["9:00 AM", "10:30 AM", "12:00 PM", "3:00 PM"],
};

function OnlineFlow() {
  const { service } = Route.useParams();
  const svc = onlineServices.find((s) => s.key === service) ?? onlineServices[0];
  const providers = onlineProviders[svc.key as OnlineService] ?? [];
  const a = accentClass[svc.accent];

  const [step, setStep] = useState<Step>("browse");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [day, setDay] = useState<keyof typeof slotsByDay>("Today");
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [attached, setAttached] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const provider = providers.find((p) => p.id === providerId) ?? providers[0];

  useEffect(() => {
    if (step !== "confirmed") return;
    const id = setInterval(() => setCallTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className="px-4 pb-6">
      {/* Progress rail */}
      {step !== "confirmed" && (
        <div className="mb-4 flex items-center gap-1.5">
          {(["browse", "slot", "intake", "pay"] as Step[]).map((s, i) => {
            const idx = (["browse", "slot", "intake", "pay"] as Step[]).indexOf(step);
            const done = i <= idx;
            return (
              <div key={s} className={cn("h-1 flex-1 rounded-full", done ? a.bg : "bg-muted")} />
            );
          })}
        </div>
      )}

      {step === "browse" && (
        <div className="space-y-4">
          <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
              <Video className="h-3.5 w-3.5" /> Online consultation
            </div>
            <h1 className="mt-1 text-lg font-semibold">{svc.label}</h1>
            <p className="mt-1 text-[12px] opacity-90 max-w-[80%]">{svc.tagline}</p>
          </div>
          <SectionHeader
            title={`${providers.length} available now`}
            hint="Ranked by fit for your history"
          />
          <div className="space-y-2.5">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProviderId(p.id);
                  setStep("slot");
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
                  <p className="truncate text-[11px] text-muted-foreground">{p.credential}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5 text-amber">
                      <Star className="h-3 w-3 fill-amber" /> {p.rating}
                    </span>
                    <span>
                      · {p.reviews} · {p.years}y · {p.languages}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="num text-sm font-semibold">₹{p.price}</p>
                  <p className="text-[10px] text-emerald">{p.nextSlot}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "slot" && provider && (
        <div className="space-y-4">
          <StepHeader
            onBack={() => setStep("browse")}
            title="Pick a time"
            subtitle={`with ${provider.name}`}
          />
          <div className="flex gap-2">
            {(Object.keys(slotsByDay) as (keyof typeof slotsByDay)[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDay(d);
                  setSlot(null);
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium",
                  day === d
                    ? cn(a.bg, "text-white")
                    : "bg-card border border-border text-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {slotsByDay[day].map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={cn(
                  "rounded-2xl border py-2.5 text-sm font-medium",
                  slot === s ? cn("border-transparent text-white", a.bg) : "border-border bg-card",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            disabled={!slot}
            onClick={() => setStep("intake")}
            className={cn(
              "mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition-opacity",
              a.bg,
              !slot && "opacity-40",
            )}
          >
            Continue
          </button>
        </div>
      )}

      {step === "intake" && provider && (
        <div className="space-y-4">
          <StepHeader
            onBack={() => setStep("slot")}
            title="Tell the doctor"
            subtitle="Reason & reports"
          />
          <Card>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Main reason for visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. Reviewing my recent lipid results and medication side effects."
              className="mt-2 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </Card>
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Attach reports
            </p>
            <button
              onClick={() => setAttached((v) => !v)}
              className={cn(
                "mt-2 flex w-full items-center justify-between rounded-2xl border-2 border-dashed p-3 text-left transition-colors",
                attached ? cn(a.ring, a.soft) : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}>
                  {attached ? <FileText className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {attached ? "Lipid Profile · Sep 12" : "Attach a report"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {attached
                      ? "Auto-linked from Medical Records"
                      : "PDF, image, or from your records"}
                  </p>
                </div>
              </div>
              <Check
                className={cn("h-4 w-4", attached ? "text-emerald" : "text-muted-foreground/40")}
              />
            </button>
          </Card>
          <button
            onClick={() => setStep("pay")}
            className={cn("w-full rounded-full py-3 text-sm font-semibold text-white", a.bg)}
          >
            Continue to payment
          </button>
        </div>
      )}

      {step === "pay" && provider && (
        <div className="space-y-4">
          <StepHeader
            onBack={() => setStep("intake")}
            title="Review & pay"
            subtitle="Encrypted checkout"
          />
          <Card>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{svc.label}</span>
              <span className="font-medium">{provider.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slot</span>
              <span className="font-medium">
                {day} · {slot}
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald/15 text-emerald">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">UPI · aarav@okhdfc</p>
                <p className="text-[11px] text-muted-foreground">
                  Encrypted · charged on confirmation
                </p>
              </div>
            </div>
          </Card>
          <div className="card-surface p-4">
            <Row label="Consultation fee" value={`₹${provider.price}`} />
            <Row label="Platform fee" value="₹29" muted />
            <div className="my-3 border-t border-border" />
            <Row label="Total" value={`₹${provider.price + 29}`} bold />
            <button
              onClick={() => setStep("confirmed")}
              className={cn(
                "mt-4 w-full rounded-full py-3 text-sm font-semibold text-white soft-shadow",
                a.bg,
              )}
            >
              Pay & confirm
            </button>
          </div>
        </div>
      )}

      {step === "confirmed" && provider && (
        <div className="space-y-4">
          <div className={cn("rounded-3xl p-5 text-center text-white bg-gradient-to-br", a.grad)}>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/25 backdrop-blur">
              <Video className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider opacity-90">
              Consultation confirmed
            </p>
            <h1 className="mt-1 text-xl font-semibold">{provider.name}</h1>
            <p className="mt-1 text-[13px] opacity-90">
              {day} · {slot} · Video call
            </p>
            <button className="mt-4 w-full rounded-full bg-white py-3 text-sm font-semibold text-foreground idle-pulse">
              <Video className="mr-2 inline h-4 w-4" /> Join session
            </button>
            <p className="mt-2 text-[11px] opacity-80">
              In-call {formatTimer(callTimer)} · Auto-connect at slot time
            </p>
          </div>

          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              You shared
            </p>
            <p className="mt-2 text-sm">{reason || "No note added."}</p>
            {attached && (
              <p className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                📎 Lipid Profile · Sep 12
              </p>
            )}
          </Card>

          <button
            onClick={() => setShowSummary((v) => !v)}
            className="w-full card-surface flex items-center gap-3 p-4 text-left"
          >
            <div className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">AI Session Summary</p>
              <p className="text-[11px] text-muted-foreground">
                {showSummary ? "Preview generated" : "Preview what will be captured"}
              </p>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                showSummary && "rotate-90",
              )}
            />
          </button>
          {showSummary && (
            <Card className={cn("border", a.ring)}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Draft summary
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Concern:</span>{" "}
                  {reason || "Follow-up on lipid results and medication tolerance."}
                </li>
                <li>
                  <span className="font-semibold">Findings:</span> LDL elevated at 138 mg/dL;
                  trending down from 156 in March.
                </li>
                <li>
                  <span className="font-semibold">Plan:</span> Continue Atorvastatin 10 mg; recheck
                  lipid panel in 12 weeks.
                </li>
                <li>
                  <span className="font-semibold">Twin update:</span> Cardiovascular score +2
                  anticipated with adherence.
                </li>
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Auto-saved to Medical Records after your call.
              </p>
            </Card>
          )}

          <div className="flex flex-col gap-2">
            <Link
              to="/companion"
              className={cn("rounded-full py-3 text-center text-sm font-semibold text-white", a.bg)}
            >
              Ask Companion to prep me
            </Link>
            <Link
              to="/support"
              className="rounded-full border border-border bg-card py-3 text-center text-sm font-medium"
            >
              Back to Health Circle
            </Link>
          </div>
        </div>
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
function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        bold ? "text-base font-semibold" : "text-sm",
        muted && "text-muted-foreground text-xs",
      )}
    >
      <span>{label}</span>
      <span className={cn(bold ? "num" : "num")}>{value}</span>
    </div>
  );
}
function formatTimer(s: number) {
  const m = Math.floor(s / 60),
    r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
