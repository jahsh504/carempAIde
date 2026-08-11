import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MapPin,
  Siren,
  Video,
  Apple,
  Salad,
  Brain,
  Sparkles,
  Hospital,
  HeartPulse,
  Activity,
  HandHeart,
  TestTube,
  Pill,
  Sparkle,
  X,
  ChevronRight,
} from "lucide-react";
import {
  onlineServices,
  offlineServices,
  aiRecommendations,
  accentClass,
  type Accent,
} from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Health Circle — careMP AIDE" },
      {
        name: "description",
        content:
          "On-demand online consultations and offline care — booked in seconds, powered by your health data.",
      },
    ],
  }),
  component: Support,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  video: Video,
  apple: Apple,
  salad: Salad,
  brain: Brain,
  sparkles: Sparkles,
  hospital: Hospital,
  "heart-pulse": HeartPulse,
  activity: Activity,
  "hand-heart": HandHeart,
  "test-tube": TestTube,
  pill: Pill,
  siren: Siren,
};

function onlineHref(key: string) {
  return { to: "/support/online/$service" as const, params: { service: key } };
}
function offlineHref(key: string) {
  switch (key) {
    case "clinic":
      return { to: "/support/clinic" as const };
    case "lab":
      return { to: "/support/lab" as const };
    case "pharmacy":
      return { to: "/support/pharmacy" as const };
    case "ambulance":
      return { to: "/support/ambulance" as const };
    default:
      return { to: "/support/home-care/$service" as const, params: { service: key } };
  }
}

function Support() {
  const [tab, setTab] = useState<"online" | "offline">("online");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const recs = aiRecommendations.filter((r) => !dismissed.includes(r.id));

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Search + location */}
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search services, doctors, tests…"
          className="w-full bg-transparent text-sm outline-none"
        />
        <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> Whitefield
        </div>
      </div>

      {/* Ambulance SOS — always visible */}
      <Link to="/support/ambulance" className="block">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-coral to-amber p-4 text-white soft-shadow">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              <Siren className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider opacity-90">Emergency</p>
              <p className="text-sm font-semibold">One-tap Ambulance · GPS-tracked</p>
              <p className="text-[11px] opacity-90">Auto location · ETA 12 min</p>
            </div>
            <div className="rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold">
              Request
            </div>
          </div>
        </div>
      </Link>

      {/* AI recommendations strip */}
      {recs.length > 0 && (
        <div>
          <SectionHeader title="Recommended for you" hint="From your careMP AIDE" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {recs.map((r) => {
              const a = accentClass[r.accent];
              const href = r.section === "online" ? onlineHref(r.service) : offlineHref(r.service);
              return (
                <div
                  key={r.id}
                  className={cn("relative w-[260px] shrink-0 card-surface p-3 rise-in border")}
                >
                  <button
                    aria-label="Dismiss"
                    onClick={() => setDismissed((d) => [...d, r.id])}
                    className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("grid h-8 w-8 place-items-center rounded-xl", a.soft, a.text)}
                    >
                      <Sparkle className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      AI suggestion
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-snug">{r.reason}</p>
                  {r.attached && (
                    <p
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]",
                        a.soft,
                        a.text,
                      )}
                    >
                      📎 {r.attached}
                    </p>
                  )}
                  <Link
                    {...(href as any)}
                    className={cn(
                      "mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white",
                      a.bg,
                    )}
                  >
                    {r.cta} <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Segmented tabs */}
      <div className="rounded-full border border-border bg-card p-1 grid grid-cols-2 text-sm font-medium">
        {(["online", "offline"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full py-2 transition-colors capitalize",
              tab === t
                ? "bg-primary text-primary-foreground soft-shadow"
                : "text-muted-foreground",
            )}
          >
            {t === "online" ? "Online Care" : "Offline Care"}
          </button>
        ))}
      </div>

      {tab === "online" ? (
        <>
          <SectionHeader title="Consult from anywhere" hint="Video, chat & audio" />
          <div className="grid grid-cols-2 gap-3">
            {onlineServices.map((s) => {
              const Icon = iconMap[s.icon];
              const a = accentClass[s.accent];
              return (
                <Link
                  key={s.key}
                  to="/support/online/$service"
                  params={{ service: s.key }}
                  className="card-surface p-4 rise-in"
                >
                  <div
                    className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                    {s.tagline}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald">{s.eta}</span>
                    <span className="text-muted-foreground">from ₹{s.from}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <SectionHeader title="Care at your door" hint="Home, clinic & delivery" />
          <div className="grid grid-cols-2 gap-3">
            {offlineServices.map((s) => {
              const Icon = iconMap[s.icon];
              const a = accentClass[s.accent];
              const href = offlineHref(s.key);
              return (
                <Link key={s.key} {...(href as any)} className="card-surface p-4 rise-in">
                  <div
                    className={cn("grid h-10 w-10 place-items-center rounded-xl", a.soft, a.text)}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                    {s.tagline}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald">{s.eta}</span>
                    <span className="text-muted-foreground">
                      {s.from ? `from ₹${s.from}` : "Free delivery"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
