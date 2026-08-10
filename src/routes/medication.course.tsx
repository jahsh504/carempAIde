import { createFileRoute } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { courses, type Course } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/course")({
  head: () => ({
    meta: [
      { title: "Course Completion — Finish every course | careMP AIDE" },
      { name: "description", content: "Track day-by-day progress through each medication course and see which ones are complete." },
      { property: "og:title", content: "Course Completion — Finish every course | careMP AIDE" },
      { property: "og:description", content: "Day-by-day progress through every medication course." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourseCompletionPage,
});

function CourseCard({ c }: { c: Course }) {
  const pct = Math.round((c.currentDay / c.totalDays) * 100);
  const done = c.currentDay >= c.totalDays;

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[16px] font-semibold leading-tight">{c.name}</p>
        {done && <span className="rounded-full bg-emerald/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald">Completed</span>}
      </div>
      <p className="mt-1 text-[11.5px] text-muted-foreground">{c.dosage}</p>
      <p className="text-[11.5px] text-muted-foreground">{c.duration}</p>

      <div className="mt-3.5 flex items-baseline justify-between">
        <p className="text-[14px] font-semibold">Day <span className="num">{c.currentDay}</span> of <span className="num">{c.totalDays}</span></p>
        <p className={cn("num text-[12.5px] font-medium", done ? "text-emerald" : "text-teal")}>{pct}% Complete</p>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald to-teal" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: c.totalDays }, (_, idx) => {
          const day = idx + 1;
          const complete = day < c.currentDay || done;
          const current = !done && day === c.currentDay;
          return (
            <div key={day} className="flex w-9 flex-col items-center gap-1">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border text-[11px] font-medium",
                  complete && "border-transparent bg-gradient-to-br from-emerald to-teal text-white",
                  current && "border-teal text-teal",
                  !complete && !current && "border-border text-muted-foreground"
                )}
              >
                {complete ? <Check className="h-3.5 w-3.5" strokeWidth={4} /> : current ? "•" : day}
              </span>
              <span className="num text-[9.5px] text-muted-foreground">D{day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CourseCompletionPage() {
  const active = courses.filter((c) => c.currentDay < c.totalDays);
  const completed = courses.filter((c) => c.currentDay >= c.totalDays);

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Course Completion</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Keep going until the last day — that's where the benefit is.
        </p>
      </div>

      <div>
        <SectionHeader title="Active courses" />
        <div className="space-y-3">
          {active.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>
      </div>

      {completed.length > 0 && (
        <div>
          <SectionHeader title="Completed courses" />
          <div className="space-y-3">
            {completed.map((c) => <CourseCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      <Card className="border-teal/20 bg-teal/5">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
            <Info className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[13px] font-semibold">Why finishing an antibiotic course matters</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Stopping early can leave the strongest bacteria behind, letting the infection return and making it harder
              to treat next time. Take every dose, even once you feel better.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
