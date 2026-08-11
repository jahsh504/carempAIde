import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Star, MapPin, Clock, Award, ChevronRight, Check } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import {
  caregiverMatches,
  recommendationReasons,
  recommendedCaregiverId,
  availabilityFilters,
  specializationFilters,
  distanceFilters,
  languageFilters,
  getCaregiver,
  avatarTone,
  type Availability,
} from "@/data/find-caregiver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care-team/find")({
  head: () => ({
    meta: [
      { title: "Find a Caregiver — Matched to your needs | careMP AIDE" },
      {
        name: "description",
        content:
          "careMP recommends caregivers based on your health needs, Digital Twin insights, preferences and who is available nearby.",
      },
      { property: "og:title", content: "Find a Caregiver — Matched to your needs | careMP AIDE" },
      {
        property: "og:description",
        content:
          "An intelligent caregiver match based on your health profile, not a marketplace listing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindCaregiverPage,
});

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors active:scale-[0.97]",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {active && <Check className="h-3 w-3" strokeWidth={3} />}
      {children}
    </button>
  );
}

function FindCaregiverPage() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [spec, setSpec] = useState<string | null>(null);
  const [distance, setDistance] = useState<"nearby" | "any">("any");
  const [language, setLanguage] = useState<string | null>(null);

  const recommended = getCaregiver(recommendedCaregiverId)!;

  const nearby = useMemo(() => {
    return caregiverMatches
      .filter((c) => c.id !== recommendedCaregiverId)
      .filter((c) => (availability ? c.availability === availability : true))
      .filter((c) => (spec ? c.specialties.includes(spec) : true))
      .filter((c) => (distance === "nearby" ? c.distanceKm <= 4 : true))
      .filter((c) => (language ? c.languages.includes(language) : true))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [availability, spec, distance, language]);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Find a Caregiver</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          We'll recommend caregivers based on your health needs, preferences and who's available
          nearby.
        </p>
      </div>

      {/* AI recommendation */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal">
          <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
        </p>

        <div className="mt-3 flex items-center gap-3.5">
          <div
            className={cn(
              "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white text-sm font-semibold",
              avatarTone[recommended.tone],
            )}
          >
            {recommended.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold">{recommended.name}</p>
            <p className="text-[11px] text-muted-foreground">{recommended.role}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-amber">
                <Star className="h-3 w-3 fill-current" /> {recommended.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {recommended.distanceKm} km away
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-[11px] font-medium text-emerald">
          <Clock className="h-3 w-3" /> {recommended.availabilityLabel}
        </p>

        <div className="mt-3 border-t border-border pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why recommended
          </p>
          <ul className="mt-2 space-y-1.5">
            {recommendationReasons.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 text-[12px] leading-relaxed text-foreground/85"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" /> {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to="/care-team/caregiver/$caregiverId"
            params={{ caregiverId: recommended.id }}
            search={{ request: true }}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground active:scale-[0.98]"
          >
            Request Care
          </Link>
          <Link
            to="/care-team/caregiver/$caregiverId"
            params={{ caregiverId: recommended.id }}
            search={{ request: false }}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-4 py-2.5 text-[13px] font-medium active:scale-[0.98]"
          >
            View Profile
          </Link>
        </div>
      </Card>

      {/* Filters */}
      <div className="space-y-2.5">
        <SectionHeader title="Refine" hint="Optional — we've already matched for you" />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {availabilityFilters.map((f) => (
            <Chip
              key={f.id}
              active={availability === f.id}
              onClick={() => setAvailability(availability === f.id ? null : f.id)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {specializationFilters.map((s) => (
            <Chip key={s} active={spec === s} onClick={() => setSpec(spec === s ? null : s)}>
              {s}
            </Chip>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {distanceFilters.map((d) => (
            <Chip key={d.id} active={distance === d.id} onClick={() => setDistance(d.id)}>
              {d.label}
            </Chip>
          ))}
          {languageFilters.map((l) => (
            <Chip
              key={l}
              active={language === l}
              onClick={() => setLanguage(language === l ? null : l)}
            >
              {l}
            </Chip>
          ))}
        </div>
      </div>

      {/* Nearby */}
      <div>
        <SectionHeader title="Nearby Caregivers" hint={`${nearby.length} available near you`} />
        <div className="space-y-3">
          {nearby.map((c) => (
            <Card key={c.id}>
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br text-white text-sm font-semibold",
                    avatarTone[c.tone],
                  )}
                >
                  {c.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.role}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-amber">
                      <Star className="h-3 w-3 fill-current" /> {c.rating}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {c.distanceKm} km away
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
                <p className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> {c.availabilityLabel}
                </p>
                <p className="inline-flex items-center gap-1.5">
                  <Award className="h-3 w-3" /> {c.experienceYears} years experience
                </p>
                <p>{c.languages.join(" · ")}</p>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {c.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-muted px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <Link
                to="/care-team/caregiver/$caregiverId"
                params={{ caregiverId: c.id }}
                search={{ request: false }}
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-[12px] font-medium active:scale-[0.98]"
              >
                View Details <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ))}
          {nearby.length === 0 && (
            <Card>
              <p className="text-[12.5px] text-muted-foreground">
                No caregivers match these filters right now. Try widening availability or distance.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
