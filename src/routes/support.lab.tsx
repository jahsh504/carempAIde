import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  TestTube,
  Home,
  Building2,
  ArrowLeft,
  Paperclip,
  Check,
  Sunrise,
  Info,
} from "lucide-react";
import { labTests, accentClass } from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support/lab")({
  head: () => ({
    meta: [
      { title: "Lab Sample Collection — Health Circle" },
      {
        name: "description",
        content: "Pick tests, upload a prescription, and book a home or centre collection.",
      },
    ],
  }),
  component: LabFlow,
});

type Step = "tests" | "where" | "when" | "confirmed";

const homeSlots = ["6:30 AM", "7:15 AM", "8:00 AM", "9:00 AM", "6:00 PM", "7:00 PM"];

function LabFlow() {
  const a = accentClass.emerald;
  const [step, setStep] = useState<Step>("tests");
  const [selected, setSelected] = useState<string[]>(["lt2", "lt3"]);
  const [rxAttached, setRxAttached] = useState(false);
  const [mode, setMode] = useState<"home" | "center">("home");
  const [slot, setSlot] = useState("7:15 AM");

  const chosen = labTests.filter((t) => selected.includes(t.id));
  const total = chosen.reduce((s, t) => s + t.price, 0);
  const fasting = chosen.some((t) => t.fasting);

  return (
    <div className="px-4 pb-6 space-y-4">
      {step !== "confirmed" && (
        <div className="mb-1 flex items-center gap-1.5">
          {(["tests", "where", "when"] as Step[]).map((s, i) => {
            const idx = (["tests", "where", "when"] as Step[]).indexOf(step);
            return (
              <div
                key={s}
                className={cn("h-1 flex-1 rounded-full", i <= idx ? a.bg : "bg-muted")}
              />
            );
          })}
        </div>
      )}

      {step === "tests" && (
        <>
          <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90">
              <TestTube className="h-3.5 w-3.5" /> Lab collection
            </div>
            <h1 className="mt-1 text-lg font-semibold">Pick tests</h1>
            <p className="mt-1 text-[12px] opacity-90">
              NABL-accredited labs · reports in your Medical Records
            </p>
          </div>

          <button
            onClick={() => setRxAttached((v) => !v)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border-2 border-dashed p-3 text-left",
              rxAttached ? cn(a.ring, a.soft) : "border-border",
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}>
                <Paperclip className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {rxAttached ? "Prescription attached" : "Upload a prescription (optional)"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {rxAttached ? "We'll match tests automatically" : "We'll extract tests for you"}
                </p>
              </div>
            </div>
            <Check
              className={cn("h-4 w-4", rxAttached ? "text-emerald" : "text-muted-foreground/40")}
            />
          </button>

          <SectionHeader title="Popular tests" hint={`${selected.length} selected`} />
          <div className="space-y-2">
            {labTests.map((t) => {
              const on = selected.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    setSelected((s) => (on ? s.filter((x) => x !== t.id) : [...s, t.id]))
                  }
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
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {t.code} · TAT {t.tat}
                      {t.fasting ? " · Fasting" : ""}
                    </p>
                  </div>
                  <p className="num text-sm font-semibold">₹{t.price}</p>
                </button>
              );
            })}
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{selected.length} tests</span>
              <span className="num text-base font-semibold">₹{total}</span>
            </div>
            <button
              disabled={selected.length === 0}
              onClick={() => setStep("where")}
              className={cn(
                "mt-3 w-full rounded-full py-3 text-sm font-semibold text-white",
                a.bg,
                selected.length === 0 && "opacity-40",
              )}
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === "where" && (
        <>
          <StepHeader onBack={() => setStep("tests")} title="Home or centre?" />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("home")}
              className={cn(
                "card-surface p-4 text-left",
                mode === "home" && cn(a.ring, "border-transparent"),
              )}
            >
              <Home className={cn("h-6 w-6", mode === "home" ? a.text : "text-muted-foreground")} />
              <p className="mt-2 text-sm font-semibold">Home collection</p>
              <p className="text-[11px] text-muted-foreground">Phlebotomist visits · +₹99</p>
            </button>
            <button
              onClick={() => setMode("center")}
              className={cn(
                "card-surface p-4 text-left",
                mode === "center" && cn(a.ring, "border-transparent"),
              )}
            >
              <Building2
                className={cn("h-6 w-6", mode === "center" ? a.text : "text-muted-foreground")}
              />
              <p className="mt-2 text-sm font-semibold">Walk-in centre</p>
              <p className="text-[11px] text-muted-foreground">3 centres within 4 km</p>
            </button>
          </div>
          <button
            onClick={() => setStep("when")}
            className={cn("w-full rounded-full py-3 text-sm font-semibold text-white", a.bg)}
          >
            Continue
          </button>
        </>
      )}

      {step === "when" && (
        <>
          <StepHeader
            onBack={() => setStep("where")}
            title="Pick a slot"
            subtitle={mode === "home" ? "Home visit" : "Centre visit"}
          />
          <div className="grid grid-cols-3 gap-2">
            {homeSlots.map((s) => (
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

          {fasting && (
            <Card className="border border-amber/30 bg-amber/5">
              <div className="flex items-start gap-3">
                <Sunrise className="mt-0.5 h-5 w-5 text-amber" />
                <div>
                  <p className="text-sm font-semibold">Fasting required</p>
                  <p className="text-[12px] text-muted-foreground">
                    No food 10–12 hrs before your slot. Water is fine. We'll remind you the night
                    before.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prep instructions
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-teal" /> Wear a loose short-sleeve top
              </li>
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-teal" /> Stay hydrated the night before
              </li>
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 text-teal" /> Skip caffeine & alcohol 24 hrs prior
              </li>
            </ul>
          </Card>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Tests ({selected.length})</span>
              <span className="num">₹{total}</span>
            </div>
            {mode === "home" && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Home visit</span>
                <span>₹99</span>
              </div>
            )}
            <div className="my-3 border-t border-border" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span className="num">₹{total + (mode === "home" ? 99 : 0)}</span>
            </div>
            <button
              onClick={() => setStep("confirmed")}
              className={cn("mt-3 w-full rounded-full py-3 text-sm font-semibold text-white", a.bg)}
            >
              Confirm collection
            </button>
          </div>
        </>
      )}

      {step === "confirmed" && (
        <>
          <div className={cn("rounded-3xl p-5 text-center text-white bg-gradient-to-br", a.grad)}>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/25 backdrop-blur">
              <TestTube className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider opacity-90">
              Collection scheduled
            </p>
            <h1 className="mt-1 text-xl font-semibold">
              {mode === "home" ? "Home visit" : "Centre visit"} · {slot}
            </h1>
            <p className="mt-1 text-[13px] opacity-90">{selected.length} tests · PathLabs (NABL)</p>
          </div>
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              You'll receive
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald" /> Reminder 12 hrs before (fasting
                alert)
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald" /> Phlebotomist arrival notification
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald" /> Reports auto-added to Medical
                Records with AI summary
              </li>
            </ul>
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
