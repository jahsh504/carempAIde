import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Award, Languages, Stethoscope, CalendarClock } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { caregivers } from "@/data/care-team";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care-team/caregivers")({
  head: () => ({
    meta: [
      { title: "Assigned Caregivers — Your care team | careMP AIDE" },
      { name: "description", content: "Everyone assigned to your care — role, experience, languages, specialties and current shift." },
      { property: "og:title", content: "Assigned Caregivers — Your care team | careMP AIDE" },
      { property: "og:description", content: "Meet the caregivers looking after you, with shifts and specialties." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaregiversPage,
});

const avatarTone: Record<string, string> = {
  teal: "from-teal to-blue",
  blue: "from-blue to-teal",
  emerald: "from-emerald to-teal",
  amber: "from-amber to-coral",
};

function CaregiversPage() {
  return (
    <div className="space-y-3 px-4 pb-6">
      <SectionHeader title="Assigned caregivers" hint={`${caregivers.length} people on your care team`} />
      {caregivers.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className={cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white text-sm font-semibold", avatarTone[c.tone])}>
                {c.initials}
              </div>
              {c.online && <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.role}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <CalendarClock className="h-3 w-3" /> {c.shift}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <p className="inline-flex items-center gap-1.5"><Award className="h-3 w-3" /> {c.experience} experience</p>
            <p className="inline-flex items-center gap-1.5"><Languages className="h-3 w-3" /> {c.languages.join(" · ")}</p>
            <p className="flex items-start gap-1.5"><Stethoscope className="mt-px h-3 w-3 shrink-0" /> <span>{c.specialties.join(" · ")}</span></p>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground active:scale-[0.98]">
              <MessageSquare className="h-3.5 w-3.5" /> Message
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
