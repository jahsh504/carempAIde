import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Check, CircleCheckBig, Clock } from "lucide-react";
import { Card } from "@/components/care/primitives";
import { requestStatuses, useCareRequest, advanceCareRequest } from "@/data/find-caregiver";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/care-team/request-sent")({
  head: () => ({
    meta: [
      { title: "Care Request Sent — Tracking your caregiver | careMP AIDE" },
      { name: "description", content: "Your care request has been sent. Follow the live status from accepted through to visit completed." },
      { property: "og:title", content: "Care Request Sent — Tracking your caregiver | careMP AIDE" },
      { property: "og:description", content: "Live status of your caregiver request, from accepted to visit completed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestSentPage,
});

function RequestSentPage() {
  const req = useCareRequest();

  // Gently move the request to "Accepted" so the Care Team module reflects it.
  useEffect(() => {
    const t = setTimeout(() => advanceCareRequest(), 3500);
    return () => clearTimeout(t);
  }, []);

  if (!req) {
    return (
      <div className="px-4 pb-6">
        <Card>
          <p className="text-[13px] text-muted-foreground">No active care request.</p>
          <Link to="/care-team/find" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground">
            Find a caregiver
          </Link>
        </Card>
      </div>
    );
  }

  const activeIdx = requestStatuses.indexOf(req.status);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal/10 to-blue/10 px-5 py-8 text-center rise-in">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-4 h-40 w-40 -translate-x-1/2 rounded-full bg-teal/20 blur-3xl breathing" />
        </div>
        <div className="relative">
          <span className="scale-in mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald to-teal text-white soft-shadow">
            <CircleCheckBig className="h-9 w-9" strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[20px] font-semibold">Care Request Sent</h1>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            We've notified {req.caregiverName.split(" ")[0]}. She'll confirm shortly.
          </p>
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 soft-shadow">
            <Clock className="h-3.5 w-3.5 text-teal" />
            <span className="text-[11px] text-muted-foreground">Estimated arrival</span>
            <span className="num text-[12.5px] font-semibold">{req.etaMinutes} minutes</span>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
        <div className="relative pl-6">
          <span className="absolute left-[6px] top-2 bottom-3 w-px bg-border" />
          {requestStatuses.map((s, i) => {
            const done = i <= activeIdx;
            return (
              <div key={s} className="relative mb-3.5 last:mb-0">
                <span
                  className={cn(
                    "absolute -left-6 top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-card",
                    done ? "bg-gradient-to-br from-emerald to-teal text-white" : "bg-muted"
                  )}
                >
                  {done && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                </span>
                <p className={cn("text-[13px]", done ? "font-medium" : "text-muted-foreground")}>{s}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Request details</p>
        <p className="mt-2 text-[13px] font-medium">{req.reason}</p>
        {req.notes && <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{req.notes}</p>}
      </Card>

      <Link
        to="/care-team"
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
      >
        Return to Care Team
      </Link>
    </div>
  );
}
