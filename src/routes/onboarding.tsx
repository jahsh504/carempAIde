import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Watch, HeartPulse, Bell } from "lucide-react";
import { goals } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to careMP" },
      { name: "description", content: "Personalize your careMP experience in a minute." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>(["Sleep better", "Improve heart health"]);
  const navigate = useNavigate();
  const total = 5;
  const next = () => (step < total - 1 ? setStep(step + 1) : navigate({ to: "/home" }));

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pb-8 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-primary/60" : "w-2 bg-muted",
              )}
            />
          ))}
        </div>
        <button onClick={() => navigate({ to: "/home" })} className="text-xs text-muted-foreground">
          Skip
        </button>
      </div>

      <div className="flex-1 rise-in">
        {step === 0 && (
          <div className="flex h-full flex-col justify-center">
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal to-blue text-white">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold">Welcome to careMP</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A calm, proactive companion that learns your body over time. No dashboards to babysit
              — just clear, personal guidance when it matters.
            </p>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold">What matters most to you?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a few. You can change these later.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {goals.map((g) => {
                const on = selected.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => setSelected((s) => (on ? s.filter((x) => x !== g) : [...s, g]))}
                    className={cn(
                      "rounded-2xl border p-3 text-left text-[13px] font-medium transition-all",
                      on
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-blue/10 text-blue">
              <Watch className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold">Pair your careMP Band</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The careMP Band is our dedicated wearable — it streams continuous vitals so your Twin
              gets sharper by the hour.
            </p>
            <div className="mt-6 space-y-2.5">
              <button className="flex w-full items-center justify-between rounded-2xl border border-primary bg-primary/5 p-4 text-sm font-semibold text-primary">
                Pair careMP Band
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-medium text-muted-foreground">
                I'll do this later
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold">A few basics</h2>
            <p className="mt-2 text-sm text-muted-foreground">Helps calibrate your baselines.</p>
            <div className="mt-6 space-y-3">
              {[
                { label: "Date of birth", value: "12 Aug 1987" },
                { label: "Height", value: "178 cm" },
                { label: "Weight", value: "76 kg" },
                { label: "Biological sex", value: "Male" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald/15 text-emerald">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">You're all set</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Your Digital Twin will start learning today. Turn on notifications to get preventive
              nudges only when they matter.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-card border border-border px-5 py-2.5 text-sm font-medium">
              <Bell className="h-4 w-4" /> Enable notifications
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link to="/auth" className="text-xs text-muted-foreground">
          Have an account?
        </Link>
        <button
          onClick={next}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground soft-shadow"
        >
          {step === total - 1 ? "Enter careMP" : "Continue"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
