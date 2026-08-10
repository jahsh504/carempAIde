import { createFileRoute } from "@tanstack/react-router";
import { notifications } from "@/data/mock";
import { SectionHeader } from "@/components/care/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — careMP" }, { name: "description", content: "Health alerts, medication, appointments, family, system." }] }),
  component: Notifs,
});

function Notifs() {
  return (
    <div className="px-4 pb-6 space-y-5">
      {notifications.map((group) => (
        <div key={group.group}>
          <SectionHeader title={group.group} />
          <div className="space-y-2">
            {group.items.map((n, i) => (
              <div key={i} className={cn("relative overflow-hidden rounded-2xl border border-border bg-card p-3", n.unread && "bg-teal/5")}>
                {n.unread && <span className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal" />}
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className={cn("text-sm", n.unread ? "font-semibold" : "font-medium")}>{n.title}</p>
                    <span className={cn("shrink-0 h-1.5 w-1.5 rounded-full mt-2",
                      n.tone === "good" ? "bg-emerald" : n.tone === "caution" ? "bg-amber" : "bg-coral")} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
