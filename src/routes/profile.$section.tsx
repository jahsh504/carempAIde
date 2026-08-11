import { createFileRoute } from "@tanstack/react-router";
import { Card, SectionHeader } from "@/components/care/primitives";
import { wearables, goals } from "@/data/mock";

export const Route = createFileRoute("/profile/$section")({
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.section)} — careMP` },
      { name: "description", content: `Manage your ${params.section}.` },
    ],
  }),
  component: Section,
});

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Section() {
  const { section } = Route.useParams();
  return (
    <div className="px-4 pb-6 space-y-3">
      {section === "info" && (
        <Card className="p-0">
          {[
            ["Full name", "Aarav Mehta"],
            ["Date of birth", "12 Aug 1987"],
            ["Email", "aarav@caremp.app"],
            ["Phone", "+91 98800 12345"],
            ["Blood group", "O+"],
            ["Emergency contact", "Priya Mehta · +91 98801 22222"],
          ].map(([k, v], i, a) => (
            <div
              key={k}
              className={`flex items-center justify-between px-4 py-3.5 ${i < a.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="text-xs text-muted-foreground">{k}</span>
              <span className="text-sm font-medium">{v}</span>
            </div>
          ))}
        </Card>
      )}
      {section === "goals" && (
        <div className="grid grid-cols-2 gap-2.5">
          {goals.map((g, i) => (
            <div
              key={g}
              className={`rounded-2xl border p-3 text-sm ${i < 3 ? "border-primary bg-primary/5 text-primary font-medium" : "border-border bg-card"}`}
            >
              {g}
            </div>
          ))}
        </div>
      )}
      {section === "wearables" && (
        <div className="space-y-2">
          {wearables.map((w) => (
            <Card key={w.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{w.name}</p>
                  <p className="text-[11px] text-muted-foreground">{w.detail}</p>
                </div>
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${w.status === "Connected" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"}`}
                >
                  {w.status === "Connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {section === "privacy" && (
        <Card className="p-0">
          {[
            ["Share vitals with family", true],
            ["Anonymous data for research", false],
            ["Location during emergencies", true],
            ["Personalized insights", true],
            ["Marketing communications", false],
          ].map(([k, on], i, a) => (
            <div
              key={k as string}
              className={`flex items-center justify-between px-4 py-3.5 ${i < a.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="text-sm">{k as string}</span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full ${on ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow ${on ? "translate-x-4" : "translate-x-0.5"} transition-transform`}
                />
              </span>
            </div>
          ))}
        </Card>
      )}
      {section === "medications" && (
        <div className="space-y-2">
          {[
            { n: "Atorvastatin 10 mg", t: "Daily · 8:30 PM", s: "12-day streak" },
            { n: "Vitamin D3 60k", t: "Weekly · Sunday", s: "5-week streak" },
          ].map((m) => (
            <Card key={m.n}>
              <p className="text-sm font-semibold">{m.n}</p>
              <p className="text-[11px] text-muted-foreground">
                {m.t} · {m.s}
              </p>
            </Card>
          ))}
        </div>
      )}
      {section === "subscription" && (
        <Card>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Current plan</p>
          <p className="text-lg font-semibold">Premium · ₹399/mo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Renews on Nov 3, 2025 · Apple Pay ••4821
          </p>
          <button className="mt-4 w-full rounded-full border border-border py-2.5 text-sm font-medium">
            Manage plan
          </button>
        </Card>
      )}
      {section === "settings" && (
        <>
          <Card className="p-0">
            {["Caregiver Support", "Geofencing", "Recovery Insights", "Glucose Monitoring"].map(
              (k, i, a) => (
                <div
                  key={k}
                  className={`flex items-center justify-between px-4 py-3.5 ${i < a.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span className="text-sm">{k}</span>
                  <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                    <span className="h-4 w-4 translate-x-4 rounded-full bg-white shadow transition-transform" />
                  </span>
                </div>
              ),
            )}
          </Card>
          <Card className="mt-3 p-0">
            {[
              ["Language", "English"],
              ["Units", "Metric"],
              ["Time zone", "Asia/Kolkata"],
              ["Theme", "System"],
              ["Version", "1.4.2 (build 218)"],
            ].map(([k, v], i, a) => (
              <div
                key={k}
                className={`flex items-center justify-between px-4 py-3.5 ${i < a.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-sm">{k}</span>
                <span className="text-xs text-muted-foreground">{v}</span>
              </div>
            ))}
          </Card>
        </>
      )}
      {(section === "records" || section === "family") && (
        <Card>
          <p className="text-sm">Coming soon in this preview.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            This section is wired up but not part of the demo walkthrough.
          </p>
        </Card>
      )}
    </div>
  );
}
