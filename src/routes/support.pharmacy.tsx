import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Pill,
  Paperclip,
  Check,
  Package,
  Truck,
  Home,
  ArrowLeft,
  Repeat,
  MapPin,
} from "lucide-react";
import { savedMeds, accentClass } from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support/pharmacy")({
  head: () => ({
    meta: [
      { title: "Medicine Delivery — Health Circle" },
      {
        name: "description",
        content: "Refill saved medicines or upload a prescription. Live-tracked delivery.",
      },
    ],
  }),
  component: PharmacyFlow,
});

type Step = "select" | "confirming" | "tracking";
const stages = [
  { key: "placed", label: "Order placed", icon: Check },
  { key: "confirmed", label: "Pharmacy confirmed", icon: Package },
  { key: "picked", label: "Picked up", icon: Truck },
  { key: "delivered", label: "At your door", icon: Home },
];

function PharmacyFlow() {
  const a = accentClass.amber;
  const [step, setStep] = useState<Step>("select");
  const [picked, setPicked] = useState<string[]>(["m1"]);
  const [rx, setRx] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (step === "confirming") {
      const t = setTimeout(() => {
        setStep("tracking");
        setStage(1);
      }, 1600);
      return () => clearTimeout(t);
    }
    if (step === "tracking") {
      const id = setInterval(() => setStage((s) => Math.min(3, s + 1)), 3500);
      return () => clearInterval(id);
    }
  }, [step]);

  const chosen = savedMeds.filter((m) => picked.includes(m.id));
  const total = chosen.reduce((s, m) => s + m.price, 0);

  if (step === "tracking") {
    return (
      <div className="px-4 pb-6 space-y-4">
        <div className={cn("rounded-3xl p-5 text-white bg-gradient-to-br", a.grad)}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
            <Truck className="h-3.5 w-3.5" /> Live order
          </div>
          <h1 className="mt-1 text-lg font-semibold">
            Arriving in ~{Math.max(10, 55 - stage * 15)} min
          </h1>
          <p className="mt-1 text-[12px] opacity-90">
            Apollo Pharmacy · Whitefield · Order #MP-8241
          </p>
        </div>

        {/* Live map */}
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <div className="h-44 bg-[linear-gradient(135deg,oklch(0.96_0.02_80),oklch(0.94_0.02_60))] relative">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200">
              <path
                d="M40 160 Q140 60 260 100 T360 60"
                stroke="var(--amber)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="40" cy="160" r="7" fill="var(--foreground)" opacity="0.7" />
              <g
                style={{
                  transform: `translateX(${stage * 90}px)`,
                  transition: "transform 3s ease",
                }}
              >
                <circle cx="60" cy="150" r="10" fill="var(--amber)" />
                <circle cx="60" cy="150" r="16" fill="var(--amber)" opacity="0.25" />
              </g>
              <circle cx="360" cy="60" r="8" fill="var(--emerald)" />
            </svg>
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium">
              <MapPin className="mr-1 inline h-3 w-3 text-coral" /> Prestige Shantiniketan
            </div>
          </div>
        </div>

        <Card>
          <div className="space-y-3">
            {stages.map((s, i) => {
              const done = i <= stage;
              const active = i === stage;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full border-2",
                      done
                        ? cn("border-transparent text-white", a.bg)
                        : "border-border bg-card text-muted-foreground",
                      active && "idle-pulse",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        done ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </p>
                    {active && <p className="text-[11px] text-amber">Live · ETA updating</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            In your order
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {chosen.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <span>{m.name}</span>
                <span className="text-muted-foreground">{m.pack}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Link
          to="/support"
          className="block rounded-full border border-border bg-card py-3 text-center text-sm font-medium"
        >
          Back to Health Circle
        </Link>
      </div>
    );
  }

  if (step === "confirming") {
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <div className={cn("grid h-24 w-24 place-items-center rounded-full", a.soft)}>
          <Pill className={cn("h-10 w-10 breathing", a.text)} />
        </div>
        <p className="mt-6 text-sm font-semibold">Pharmacy is confirming stock…</p>
        <p className="mt-1 text-[12px] text-muted-foreground max-w-[260px]">
          Apollo Whitefield · usually confirms within seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 space-y-4">
      <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
          <Pill className="h-3.5 w-3.5" /> Medicine delivery
        </div>
        <h1 className="mt-1 text-lg font-semibold">Refill your meds</h1>
        <p className="mt-1 text-[12px] opacity-90">From your saved list or upload a prescription</p>
      </div>

      <button
        onClick={() => setRx((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border-2 border-dashed p-3 text-left",
          rx ? cn(a.ring, a.soft) : "border-border",
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}>
            <Paperclip className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {rx ? "Prescription attached" : "Upload a new prescription"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {rx ? "Pharmacist will verify before dispatch" : "PDF or photo"}
            </p>
          </div>
        </div>
        <Check className={cn("h-4 w-4", rx ? "text-emerald" : "text-muted-foreground/40")} />
      </button>

      <SectionHeader title="Your saved medicines" hint={`${picked.length} selected`} />
      <div className="space-y-2">
        {savedMeds.map((m) => {
          const on = picked.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setPicked((s) => (on ? s.filter((x) => x !== m.id) : [...s, m.id]))}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3 text-left",
                on ? cn(a.ring, a.soft, "border-transparent") : "border-border bg-card",
              )}
            >
              <div
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-md border",
                  on ? cn(a.bg, "border-transparent text-white") : "border-border",
                )}
              >
                {on && <Check className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {m.pack} · Refill in {m.refillsIn}
                </p>
              </div>
              {m.auto && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-medium text-emerald">
                  <Repeat className="h-3 w-3" /> Auto
                </span>
              )}
              <p className="num text-sm font-semibold">₹{m.price}</p>
            </button>
          );
        })}
      </div>

      <div className="card-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span className="num">₹{total}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Delivery</span>
          <span>Free · 60 min</span>
        </div>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span className="num">₹{total}</span>
        </div>
        <button
          disabled={picked.length === 0}
          onClick={() => setStep("confirming")}
          className={cn(
            "mt-3 w-full rounded-full py-3 text-sm font-semibold text-white",
            a.bg,
            picked.length === 0 && "opacity-40",
          )}
        >
          Send to pharmacy
        </button>
      </div>
    </div>
  );
}
