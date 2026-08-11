import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Radio, ShieldCheck, Bell, Ban, Settings2, ChevronRight } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { patient, currentLocation, currentRoomId, rooms, beacons, signalBars, signalLabel } from "@/data/geofence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geofence/")({
  head: () => ({
    meta: [
      { title: "Geofence — Indoor safety tracking | careMP AIDE" },
      { name: "description", content: "Room-level indoor tracking with beacons, restricted zones and gentle alerts for dementia care." },
      { property: "og:title", content: "Geofence — Indoor safety tracking | careMP AIDE" },
      { property: "og:description", content: "Know which room they're in, with calm alerts when it matters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeofenceHome,
});

function Bars({ rssi }: { rssi: number }) {
  const bars = signalBars(rssi);
  return (
    <span className="flex items-end gap-0.5">
      {[1, 2, 3].map((b) => (
        <span
          key={b}
          className={cn("w-1 rounded-full", b <= bars ? "bg-teal" : "bg-muted")}
          style={{ height: 4 + b * 3 }}
        />
      ))}
    </span>
  );
}

const links = [
  { to: "/geofence/alerts", label: "Recent Activity", hint: "Room movement and boundary events", icon: Bell },
  { to: "/geofence/zones", label: "Restricted Zones", hint: "Choose which rooms are off-limits", icon: Ban },
  { to: "/geofence/settings", label: "Geofence Settings", hint: "Tracking, alerts and scan frequency", icon: Settings2 },
] as const;

function GeofenceHome() {
  return (
    <div className="space-y-5 px-4 pb-6">
      {/* Patient */}
      <Card>
        <div className="flex items-center gap-3.5">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal to-blue text-[15px] font-semibold text-white">
            {patient.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold">{patient.name}</p>
            <p className="text-[11px] text-muted-foreground">{patient.relation}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-emerald">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              {patient.status}
            </p>
          </div>
        </div>
        <p className="mt-3 border-t border-border pt-2.5 text-[11px] text-muted-foreground">{patient.lastUpdated}</p>
      </Card>

      {/* Current location */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal">
          <MapPin className="h-3.5 w-3.5" /> Current location
        </p>
        <p className="mt-2 text-[20px] font-semibold">{currentLocation.room}</p>
        <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-[11.5px] text-muted-foreground">
          <p className="inline-flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" /> Detected via {currentLocation.beacon}</p>
          <p className="inline-flex items-center gap-1.5">
            <Bars rssi={currentLocation.rssi} /> {currentLocation.signalLabel} (<span className="num">{currentLocation.rssi}</span> dBm)
          </p>
        </div>
      </Card>

      {/* Home layout */}
      <div>
        <SectionHeader title="Home layout" hint="Live room position" />
        <Card>
          <div className="grid grid-cols-3 gap-2">
            {rooms.map((r) => {
              const here = r.id === currentRoomId;
              return (
                <div
                  key={r.id}
                  style={{ gridColumn: `span ${r.colSpan}`, gridRow: `span ${r.rowSpan}` }}
                  className={cn(
                    "relative flex min-h-[76px] flex-col justify-between rounded-2xl border p-2.5",
                    here ? "border-teal/40 bg-teal/10" : r.restricted ? "border-dashed border-coral/30 bg-coral/5" : "border-border bg-muted/40"
                  )}
                >
                  <p className={cn("text-[11.5px] font-medium", here ? "text-teal" : "text-muted-foreground")}>{r.label}</p>
                  {r.restricted && !here && <p className="text-[10px] text-coral">Restricted</p>}
                  {here && (
                    <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal to-blue text-[10px] font-semibold text-white soft-shadow">
                      {patient.initials}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Beacons */}
      <div>
        <SectionHeader title="Nearby beacons" hint={`${beacons.length} detected`} />
        <Card className="p-0">
          {beacons.map((b, i) => (
            <div key={b.id} className={cn("flex items-center gap-3 px-4 py-3.5", i < beacons.length - 1 && "border-b border-border")}>
              <Bars rssi={b.rssi} />
              <span className="min-w-0 flex-1 truncate text-[13px]">{b.label}</span>
              <span className="text-[11px] text-muted-foreground">{signalLabel(b.rssi)}</span>
              <span className="num w-[56px] text-right text-[11.5px] text-muted-foreground">{b.rssi} dBm</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Sub pages */}
      <div className="space-y-2.5">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 active:scale-[0.99]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal/10 text-teal"><l.icon className="h-4 w-4" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium">{l.label}</span>
              <span className="block text-[11px] text-muted-foreground">{l.hint}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Status */}
      <Card className="border-emerald/20 bg-emerald/5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald/15 text-emerald"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <p className="text-[14px] font-semibold text-emerald">All systems normal</p>
            <p className="text-[11.5px] text-muted-foreground">Indoor tracking active</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
