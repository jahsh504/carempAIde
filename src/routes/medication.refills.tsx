import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/care/primitives";
import { useInventory, refill, daysLeft } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/refills")({
  head: () => ({
    meta: [
      { title: "Refill Reminders — Medication inventory | careMP AIDE" },
      { name: "description", content: "See how many tablets are left for each medication, when they run out, and record refills." },
      { property: "og:title", content: "Refill Reminders — Medication inventory | careMP AIDE" },
      { property: "og:description", content: "Never run out — track remaining tablets and estimated finish dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefillsPage,
});

function RefillsPage() {
  const inventory = useInventory();
  const [openId, setOpenId] = useState<string | null>(null);
  const [qty, setQty] = useState("30");

  const save = () => {
    if (openId) refill(openId, Number(qty) || 0);
    setOpenId(null);
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Refill Reminders</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          We'll nudge you a week before anything runs out.
        </p>
      </div>

      <div className="space-y-3">
        {inventory.map((i) => {
          const days = daysLeft(i);
          const pct = Math.max(4, Math.min(100, Math.round((i.remaining / i.capacity) * 100)));
          const low = days <= 7;
          return (
            <Card key={i.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[17px] font-semibold leading-tight">{i.name}</p>
                <span className="num shrink-0 text-[12.5px] font-medium text-muted-foreground">{i.strength}</span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{i.form} • {i.frequency}</p>

              <div className="mt-4 flex items-start justify-between">
                <div>
                  <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Remaining</p>
                  <p className="mt-0.5 text-[15px] font-semibold"><span className="num">{i.remaining}</span> Tablets</p>
                </div>
                <div className="text-right">
                  <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Est. to finish in</p>
                  <p className={cn("mt-0.5 text-[15px] font-semibold", low ? "text-amber" : "")}>
                    <span className="num">{days}</span> Days
                  </p>
                </div>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", low ? "bg-amber" : "bg-gradient-to-r from-emerald to-teal")}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11.5px] text-muted-foreground">Refill by {i.finishBy}</p>
                <button
                  onClick={() => { setOpenId(i.id); setQty("30"); }}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground active:scale-[0.98]"
                >
                  Mark Refilled
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {openId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button aria-label="Close" onClick={() => setOpenId(null)} className="absolute inset-0 bg-foreground/30" />
          <div className="relative w-full max-w-[440px] rounded-t-3xl border border-border bg-card p-5 pb-8 soft-shadow">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <p className="text-[15px] font-semibold">How many tablets were added?</p>
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              autoFocus
              className="num mt-3 w-full rounded-2xl border border-border bg-card px-3.5 py-3 text-[15px] outline-none focus:border-teal"
            />
            <button
              onClick={save}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
