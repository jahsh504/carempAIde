import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Siren, MapPin, MessageSquare, Navigation, ChevronRight } from "lucide-react";
import { ambulanceTypes, accentClass } from "@/data/health-circle";
import { Card } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support/ambulance")({
  head: () => ({ meta: [
    { title: "Ambulance — Health Circle" },
    { name: "description", content: "One-tap ambulance dispatch with live GPS tracking." },
  ]}),
  component: AmbulanceFlow,
});

type Step = "sos" | "type" | "dispatch";

function AmbulanceFlow() {
  const a = accentClass.coral;
  const [step, setStep] = useState<Step>("sos");
  const [type, setType] = useState<string>("bls");
  const [eta, setEta] = useState(12);
  const [stage, setStage] = useState(0); // 0 dispatched, 1 en route, 2 nearby, 3 arrived
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (step !== "dispatch") return;
    const id = setInterval(() => {
      setEta((e) => Math.max(1, e - 1));
      setStage((s) => (s < 3 ? s + (Math.random() > 0.5 ? 1 : 0) : s));
    }, 2500);
    return () => clearInterval(id);
  }, [step]);

  if (step === "sos") {
    return (
      <div className="px-4 pb-6">
        <div className={cn("mt-2 rounded-3xl p-5 text-white bg-gradient-to-br", a.grad)}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90"><Siren className="h-3.5 w-3.5" /> Emergency dispatch</div>
          <h1 className="mt-1 text-lg font-semibold">One-tap ambulance</h1>
          <p className="mt-1 text-[12px] opacity-90">We'll auto-share your location, medical profile & emergency contact.</p>
        </div>

        <div className="my-8 flex flex-col items-center">
          <button
            onMouseDown={() => setHeld(true)}
            onMouseUp={() => { setHeld(false); setStep("type"); }}
            onTouchStart={() => setHeld(true)}
            onTouchEnd={() => { setHeld(false); setStep("type"); }}
            className="relative grid h-56 w-56 place-items-center"
          >
            <span className={cn("absolute inset-0 rounded-full opacity-40", a.bg, held ? "breathing" : "idle-pulse")} />
            <span className={cn("absolute inset-4 rounded-full", a.bg)} />
            <span className="relative flex flex-col items-center text-white">
              <Siren className="h-14 w-14" />
              <span className="mt-2 text-lg font-bold uppercase tracking-wider">Request</span>
              <span className="text-[11px] opacity-90">Tap to dispatch</span>
            </span>
          </button>
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-coral" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Auto-shared location</p>
              <p className="text-[11px] text-muted-foreground">Prestige Shantiniketan, Whitefield · GPS ±5m</p>
            </div>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <a href="tel:108" className="rounded-full border border-border bg-card py-3 text-center text-sm font-medium">
            <Siren className="mr-2 inline h-4 w-4" /> Request emergency ambulance
          </a>
          <Link to="/family" className="rounded-full border border-border bg-card py-3 text-center text-sm font-medium">
            Notify family
          </Link>
        </div>
      </div>
    );
  }

  if (step === "type") {
    return (
      <div className="px-4 pb-6 space-y-3">
        <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
          <p className="text-[11px] uppercase tracking-wider opacity-90">Dispatch pending</p>
          <h1 className="mt-1 text-lg font-semibold">Select ambulance type</h1>
          <p className="mt-1 text-[12px] opacity-90">The nearest matching unit is being reserved.</p>
        </div>
        <div className="space-y-2">
          {ambulanceTypes.map((t) => (
            <button key={t.key} onClick={() => setType(t.key)}
              className={cn("w-full flex items-center gap-3 rounded-2xl border p-3 text-left",
                type === t.key ? cn(a.ring, a.soft, "border-transparent") : "border-border bg-card")}>
              <div className={cn("grid h-12 w-12 place-items-center rounded-2xl text-white bg-gradient-to-br", a.grad)}>
                <Siren className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald">ETA {t.eta}</p>
                <p className="num text-sm font-semibold">₹{t.price}</p>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => setStep("dispatch")} className={cn("mt-2 w-full rounded-full py-3 text-sm font-semibold text-white", a.bg)}>
          Dispatch now <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    );
  }

  const t = ambulanceTypes.find((x) => x.key === type)!;
  const stageLabels = ["Dispatched", "En route", "Nearby", "Arrived"];

  return (
    <div className="px-4 pb-6 space-y-4">
      <div className={cn("rounded-3xl p-5 text-white bg-gradient-to-br", a.grad)}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90"><Siren className="h-3.5 w-3.5" /> {t.label} · KA-05-AB-1247</div>
        <h1 className="mt-2 text-3xl font-semibold">Arriving in {eta} min</h1>
        <p className="mt-1 text-[13px] opacity-90">{stageLabels[stage]} · Driver: Suresh K.</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border">
        <div className="h-56 bg-[linear-gradient(135deg,oklch(0.94_0.02_20),oklch(0.96_0.02_40))] relative">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 240">
            <path d="M60 200 Q160 80 280 140 T360 60" stroke="var(--coral)" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            <circle cx="360" cy="60" r="9" fill="var(--foreground)" />
            <g style={{ transform: `translate(${stage * 80}px, ${-stage * 30}px)`, transition: "transform 2s ease" }}>
              <circle cx="60" cy="200" r="12" fill="var(--coral)" className="idle-pulse" />
              <circle cx="60" cy="200" r="20" fill="var(--coral)" opacity="0.25" />
            </g>
          </svg>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium">
            <span><MapPin className="mr-1 inline h-3 w-3 text-coral" /> Live GPS</span>
            <span className="text-emerald">Priority signal active</span>
          </div>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-4 gap-1">
          {stageLabels.map((l, i) => (
            <div key={l} className="text-center">
              <div className={cn("mx-auto h-2 w-2 rounded-full", i <= stage ? a.bg : "bg-muted")} />
              <p className={cn("mt-1 text-[10px]", i <= stage ? "text-foreground" : "text-muted-foreground")}>{l}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <a href="tel:+911800100200" className={cn("rounded-full py-3 text-center text-sm font-semibold text-white", a.bg)}>
          <MessageSquare className="mr-2 inline h-4 w-4" /> Message driver
        </a>
        <button className="rounded-full border border-border bg-card py-3 text-center text-sm font-medium">
          <Navigation className="mr-2 inline h-4 w-4" /> Share live location
        </button>
      </div>

      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Auto-shared with hospital</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>• Age 38 · Blood group B+</li>
          <li>• Meds: Atorvastatin 10 mg</li>
          <li>• Allergies: None</li>
          <li>• Emergency contact: Priya Mehta</li>
        </ul>
      </Card>

      <Link to="/support" className="block rounded-full border border-border bg-card py-3 text-center text-sm font-medium">Back to Health Circle</Link>
    </div>
  );
}
