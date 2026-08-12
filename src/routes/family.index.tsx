import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, Plus, ShieldCheck } from "lucide-react";
import { family } from "@/data/mock";
import { Card, SectionHeader, StatusChip, RingProgress } from "@/components/care/primitives";

export const Route = createFileRoute("/family/")({
  head: () => ({
    meta: [
      { title: "Family Circle — careMP" },
      {
        name: "description",
        content:
          "Care for the people you love — shared vitals, medications, and gentle alerts, with privacy you control.",
      },
    ],
  }),
  component: Family,
});

function Family() {
  return (
    <div className="px-4 pb-6 space-y-4">
      <Card className="border-amber/30 bg-amber/5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber/20 text-amber">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Family alert
            </p>
            <p className="text-sm font-medium">
              Meera's blood pressure is slightly elevated (138/86)
            </p>
          </div>
          <Link
            to="/family/$memberId"
            params={{ memberId: "meera" }}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            View
          </Link>
        </div>
      </Card>

      <SectionHeader
        title="Your family"
        action={
          <button className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium">
            <Plus className="h-3.5 w-3.5" /> Invite
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3">
        {family.map((m) => (
          <Link
            key={m.id}
            to="/family/$memberId"
            params={{ memberId: m.id }}
            className="card-surface flex flex-col items-center p-4 text-center"
          >
            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue to-teal text-white text-sm font-semibold">
                {m.avatar}
              </div>
              <span
                className={`absolute -bottom-0.5 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${m.status === "good" ? "bg-emerald" : m.status === "caution" ? "bg-amber" : "bg-coral"}`}
              />
            </div>
            <p className="mt-2 text-sm font-semibold">{m.name}</p>
            <p className="text-[11px] text-muted-foreground">{m.relation}</p>
            <div className="mt-2">
              <RingProgress
                value={m.score}
                size={50}
                stroke={5}
                color={
                  m.status === "good"
                    ? "var(--emerald)"
                    : m.status === "caution"
                      ? "var(--amber)"
                      : "var(--coral)"
                }
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-1">{m.note}</p>
          </Link>
        ))}
      </div>

      <SectionHeader title="Emergency contacts" />
      <div className="space-y-2">
        {[
          { name: "Nadia Rahman", role: "Family physician", phone: "+91 98800 12345" },
          { name: "John Doe", role: "Local guardian", phone: "1066" },
        ].map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-3"
          >
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {c.role} · {c.phone}
              </p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-emerald/15 text-emerald">
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
