import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/care/primitives";
import { rooms } from "@/data/geofence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geofence/zones")({
  head: () => ({
    meta: [
      { title: "Restricted Zones — Geofence | careMP AIDE" },
      { name: "description", content: "Choose which rooms are restricted and which are safe to move through freely." },
      { property: "og:title", content: "Restricted Zones — Geofence | careMP AIDE" },
      { property: "og:description", content: "Mark rooms as restricted or allowed in a single tap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RestrictedZonesPage,
});

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors", on ? "bg-primary" : "bg-muted")}>
      <span className={cn("h-4 w-4 rounded-full bg-white shadow transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

function RestrictedZonesPage() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(rooms.map((r) => [r.id, r.restricted]))
  );

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Restricted Zones</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          You'll be notified when a restricted room is entered.
        </p>
      </div>

      <Card className="p-0">
        {rooms.map((r, i) => (
          <div key={r.id} className={cn("flex items-center gap-3 px-4 py-3.5", i < rooms.length - 1 && "border-b border-border")}>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium">{r.label}</span>
              <span className={cn("block text-[11px]", state[r.id] ? "text-coral" : "text-muted-foreground")}>
                {state[r.id] ? "Restricted" : "Allowed"}
              </span>
            </span>
            <Toggle on={state[r.id]} onClick={() => setState((s) => ({ ...s, [r.id]: !s[r.id] }))} />
          </div>
        ))}
      </Card>

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-[13px] font-medium active:scale-[0.98]">
        <Plus className="h-4 w-4" /> Add Restricted Zone
      </button>
    </div>
  );
}
