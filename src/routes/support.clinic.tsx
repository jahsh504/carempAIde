import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Hospital, Star, MapPin, Navigation, Check, ArrowLeft, Route as RouteIcon } from "lucide-react";
import { clinics, accentClass } from "@/data/health-circle";
import { Card, SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support/clinic")({
  head: () => ({ meta: [
    { title: "Clinic Appointment — Health Circle" },
    { name: "description", content: "Find and book a clinic near you." },
  ]}),
  component: ClinicFlow,
});

const slotsByClinic = ["10:30 AM", "11:15 AM", "12:00 PM", "3:00 PM", "4:30 PM", "6:00 PM"];

function ClinicFlow() {
  const [selected, setSelected] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const a = accentClass.teal;
  const clinic = clinics.find((c) => c.id === selected);

  if (confirmed && clinic) {
    return (
      <div className="px-4 pb-6 space-y-4">
        <div className={cn("rounded-3xl p-5 text-white bg-gradient-to-br", a.grad)}>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/25 backdrop-blur">
            <Hospital className="h-6 w-6" />
          </div>
          <p className="mt-3 text-center text-[11px] uppercase tracking-wider opacity-90">Appointment held</p>
          <h1 className="mt-1 text-center text-xl font-semibold">{clinic.name}</h1>
          <p className="mt-1 text-center text-[13px] opacity-90">{slot} · Today · {clinic.specialty}</p>
        </div>

        {/* Map placeholder */}
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <div className="h-44 bg-[linear-gradient(135deg,oklch(0.94_0.02_200),oklch(0.96_0.01_220))] relative">
            <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 400 200">
              <path d="M0 120 Q100 90 200 110 T400 100" stroke="var(--teal)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <circle cx="60" cy="130" r="6" fill="var(--coral)" />
              <circle cx="340" cy="95" r="8" fill="var(--teal)" />
            </svg>
            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium">
              <MapPin className="mr-1 inline h-3 w-3 text-coral" /> You → {clinic.distance}
            </div>
          </div>
        </div>

        <Card>
          <div className="flex items-start gap-3">
            <RouteIcon className="mt-0.5 h-5 w-5 text-teal" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Turn-by-turn ready</p>
              <p className="text-[12px] text-muted-foreground">{clinic.address} · ~{clinic.distance} · 12 min by car</p>
            </div>
          </div>
          <button className={cn("mt-3 w-full rounded-full py-2.5 text-sm font-semibold text-white", a.bg)}>
            <Navigation className="mr-2 inline h-4 w-4" /> Open in Maps
          </button>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bring with you</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald" /> Government ID</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald" /> Previous reports (auto-shared from records)</li>
            <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald" /> Arrive 10 min early for paperwork</li>
          </ul>
        </Card>

        <div className="flex flex-col gap-2">
          <Link to="/support" className="rounded-full border border-border bg-card py-3 text-center text-sm font-medium">Back to Health Circle</Link>
        </div>
      </div>
    );
  }

  if (clinic) {
    return (
      <div className="px-4 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold">{clinic.name}</h1>
            <p className="text-[11px] text-muted-foreground">{clinic.specialty} · {clinic.distance}</p>
          </div>
        </div>
        <Card>
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-teal" /> {clinic.address}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[12px]">
            <Star className="h-3.5 w-3.5 fill-amber text-amber" /> {clinic.rating} · Consultation ₹{clinic.fee}
          </div>
        </Card>
        <SectionHeader title="Today's open slots" />
        <div className="grid grid-cols-3 gap-2">
          {slotsByClinic.map((s) => (
            <button key={s} onClick={() => setSlot(s)}
              className={cn("rounded-2xl border py-2.5 text-sm font-medium",
                slot === s ? cn("border-transparent text-white", a.bg) : "border-border bg-card")}>
              {s}
            </button>
          ))}
        </div>
        <button
          disabled={!slot}
          onClick={() => setConfirmed(true)}
          className={cn("w-full rounded-full py-3 text-sm font-semibold text-white", a.bg, !slot && "opacity-40")}
        >
          Confirm appointment
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 space-y-4">
      <div className={cn("rounded-3xl p-4 text-white bg-gradient-to-br", a.grad)}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-90"><Hospital className="h-3.5 w-3.5" /> Clinics near you</div>
        <h1 className="mt-1 text-lg font-semibold">Book a clinic visit</h1>
        <p className="mt-1 text-[12px] opacity-90">Live slot availability · 4 clinics within 5 km</p>
      </div>
      <div className="space-y-2.5">
        {clinics.map((c) => (
          <button key={c.id} onClick={() => setSelected(c.id)} className="w-full card-surface flex items-center gap-3 p-3 text-left">
            <div className={cn("grid h-14 w-14 place-items-center rounded-2xl text-white bg-gradient-to-br", a.grad)}>
              <Hospital className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{c.specialty} · {c.distance}</p>
              <p className="text-[11px] text-muted-foreground"><Star className="mr-0.5 inline h-3 w-3 fill-amber text-amber" /> {c.rating} · ₹{c.fee}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-emerald">{c.nextSlot}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
