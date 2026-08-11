import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/care/primitives";
import { geofenceAlerts } from "@/data/geofence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/geofence/alerts")({
  head: () => ({
    meta: [
      { title: "Geofence Activity — Movement timeline | careMP AIDE" },
      {
        name: "description",
        content:
          "A timeline of room entries, exits and boundary events detected by indoor beacons.",
      },
      { property: "og:title", content: "Geofence Activity — Movement timeline | careMP AIDE" },
      {
        property: "og:description",
        content: "Every room movement and boundary event, with timestamps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeofenceAlertsPage,
});

const dot: Record<string, string> = {
  good: "bg-emerald",
  caution: "bg-amber",
  alert: "bg-coral",
};

function GeofenceAlertsPage() {
  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Recent Activity</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Room movement and boundary events from today.
        </p>
      </div>

      <Card className="p-4">
        <div className="relative pl-6">
          <span className="absolute left-[5px] top-2 bottom-3 w-px bg-border" />
          {geofenceAlerts.map((a) => (
            <div key={a.id} className="relative mb-4 last:mb-0">
              <span
                className={cn(
                  "absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-card",
                  dot[a.tone],
                )}
              />
              <p className="text-[13.5px] font-medium">{a.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{a.detail}</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">{a.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
