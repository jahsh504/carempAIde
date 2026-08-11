import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CalendarClock, Check } from "lucide-react";
import { Card } from "@/components/care/primitives";
import { reviews } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/review")({
  head: () => ({
    meta: [
      { title: "Doctor Review Reminder — Medication reviews | careMP AIDE" },
      {
        name: "description",
        content: "See which medications are due for a doctor review and set a gentle reminder.",
      },
      {
        property: "og:title",
        content: "Doctor Review Reminder — Medication reviews | careMP AIDE",
      },
      {
        property: "og:description",
        content: "Stay on top of medication reviews without booking anything.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DoctorReviewPage,
});

function DoctorReviewPage() {
  const [set, setSet] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Doctor Review Reminder</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          A quiet reminder when a prescription is due to be looked at again.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => {
          const soon = r.dueInDays <= 21;
          const done = set[r.id];
          return (
            <Card key={r.id}>
              <div className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl",
                    soon ? "bg-amber/10 text-amber" : "bg-teal/10 text-teal",
                  )}
                >
                  <CalendarClock className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold leading-tight">{r.name}</p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">{r.doctor}</p>
                </div>
              </div>

              <div className="mt-3.5 flex items-start justify-between border-t border-border pt-3">
                <div>
                  <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    Review due
                  </p>
                  <p className="num mt-0.5 text-[14px] font-semibold">{r.dueDate}</p>
                  <p
                    className={cn(
                      "mt-0.5 text-[11.5px] font-medium",
                      soon ? "text-amber" : "text-teal",
                    )}
                  >
                    In <span className="num">{r.dueInDays}</span> days
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    Last review
                  </p>
                  <p className="num mt-0.5 text-[14px] font-semibold">{r.lastReview}</p>
                </div>
              </div>

              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{r.note}</p>

              <button
                onClick={() => setSet((s) => ({ ...s, [r.id]: true }))}
                disabled={done}
                className={cn(
                  "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold active:scale-[0.98]",
                  done ? "bg-emerald/10 text-emerald" : "bg-primary text-primary-foreground",
                )}
              >
                {done ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={3} /> Reminder set
                  </>
                ) : (
                  <>
                    <BellRing className="h-3.5 w-3.5" /> Set Reminder
                  </>
                )}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
