import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MapPin, Clock, Award, Sparkles, BadgeCheck, Languages, Timer } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { assistanceReasons, getCaregiver, setCareRequest, avatarTone } from "@/data/find-caregiver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care-team/caregiver/$caregiverId")({
  validateSearch: (search: Record<string, unknown>) => ({
    request: search.request === true || search.request === "true",
  }),
  head: () => ({
    meta: [
      { title: "Caregiver Profile — AI compatibility match | careMP AIDE" },
      {
        name: "description",
        content:
          "Experience, certifications, reviews, availability and your Digital Twin compatibility match for this caregiver.",
      },
      { property: "og:title", content: "Caregiver Profile — AI compatibility match | careMP AIDE" },
      {
        property: "og:description",
        content: "See why your Digital Twin suggests this caregiver, then send a care request.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaregiverProfilePage,
});

function CaregiverProfilePage() {
  const { caregiverId } = Route.useParams();
  const navigate = useNavigate();
  const caregiver = getCaregiver(caregiverId);
  const [reason, setReason] = useState(assistanceReasons[0]);
  const [notes, setNotes] = useState("");

  if (!caregiver) {
    return (
      <div className="px-4 pb-6">
        <Card>
          <p className="text-[13px] text-muted-foreground">This caregiver is no longer listed.</p>
        </Card>
      </div>
    );
  }

  const submit = () => {
    setCareRequest({
      caregiverId: caregiver.id,
      caregiverName: caregiver.name,
      reason,
      notes,
      etaMinutes: caregiver.etaMinutes,
      status: "Request Sent",
    });
    navigate({ to: "/care-team/request-sent" });
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-twin p-5 text-twin-foreground soft-shadow rise-in">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-teal/30 blur-3xl breathing" />
        </div>
        <div className="relative flex items-center gap-4">
          <div
            className={cn(
              "grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br text-xl font-semibold text-white",
              avatarTone[caregiver.tone],
            )}
          >
            {caregiver.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold">{caregiver.name}</h1>
            <p className="text-[12px] text-white/70">{caregiver.role}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/85">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-amber" /> {caregiver.rating} ·{" "}
                {caregiver.reviews} reviews
              </span>
              <span className="inline-flex items-center gap-1">
                <Award className="h-3 w-3" /> {caregiver.experienceYears} yrs
              </span>
            </div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Availability</p>
            <p className="text-[12.5px] font-semibold">{caregiver.availabilityLabel}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Response time</p>
            <p className="text-[12.5px] font-semibold">{caregiver.responseTime}</p>
          </div>
        </div>
      </div>

      {/* AI compatibility */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <div className="flex items-start justify-between">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal">
            <Sparkles className="h-3.5 w-3.5" /> AI Compatibility
          </p>
          <p className="num text-[20px] font-semibold text-teal">{caregiver.matchScore}%</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-blue transition-all duration-700"
            style={{ width: `${caregiver.matchScore}%` }}
          />
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed">
          Your Digital Twin suggests {caregiver.name.split(" ")[0]} is a strong match because:
        </p>
        <ul className="mt-2 space-y-1.5">
          {caregiver.matchReasons.map((r) => (
            <li
              key={r}
              className="flex items-start gap-2 text-[12px] leading-relaxed text-foreground/85"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal" /> {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10.5px] leading-relaxed text-muted-foreground">
          A suggestion from your Twin — not a medical decision. You can choose any caregiver.
        </p>
      </Card>

      {/* About */}
      <div>
        <SectionHeader title="About" />
        <Card>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">{caregiver.bio}</p>
          <div className="mt-3 space-y-2 border-t border-border pt-3 text-[11.5px] text-muted-foreground">
            <p className="flex items-start gap-2">
              <Languages className="mt-px h-3.5 w-3.5 shrink-0" /> {caregiver.languages.join(" · ")}
            </p>
            <p className="flex items-start gap-2">
              <BadgeCheck className="mt-px h-3.5 w-3.5 shrink-0" />{" "}
              {caregiver.certifications.join(" · ")}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-px h-3.5 w-3.5 shrink-0" /> {caregiver.distanceKm} km away
            </p>
            <p className="flex items-start gap-2">
              <Timer className="mt-px h-3.5 w-3.5 shrink-0" /> Can arrive in about{" "}
              {caregiver.etaMinutes} min
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {caregiver.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full bg-muted px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Reviews */}
      <div>
        <SectionHeader title="Recent reviews" />
        <div className="space-y-2.5">
          {caregiver.patientReviews.map((r, i) => (
            <Card key={i} className="p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold">{r.by}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-amber">
                  <Star className="h-3 w-3 fill-current" /> {r.stars}.0
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{r.text}</p>
              <p className="mt-1.5 text-[10.5px] text-muted-foreground">{r.when}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Request summary */}
      <div>
        <SectionHeader title="Request summary" />
        <Card>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Reason for assistance
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-card px-3.5 py-2.5 text-[13px] outline-none focus:border-teal"
          >
            {assistanceReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="I'll need help after my hospital discharge tomorrow."
            className="mt-2 w-full resize-none rounded-2xl border border-border bg-card px-3.5 py-2.5 text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/70 focus:border-teal"
          />

          <button
            onClick={submit}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Clock className="h-4 w-4" /> Request Caregiver
          </button>
        </Card>
      </div>
    </div>
  );
}
