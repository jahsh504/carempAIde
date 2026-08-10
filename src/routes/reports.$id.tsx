import { createFileRoute, Link } from "@tanstack/react-router";
import { reportDetail } from "@/data/mock";
import { Card, SectionHeader } from "@/components/care/primitives";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports/$id")({
  head: () => ({ meta: [{ title: `${reportDetail.title} — careMP` }, { name: "description", content: `AI-summarized ${reportDetail.title}.` }] }),
  component: ReportDetail,
});

function ReportDetail() {
  return (
    <div className="px-4 pb-6 space-y-4">
      <Card>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{reportDetail.lab}</p>
        <p className="text-lg font-semibold">{reportDetail.title}</p>
      </Card>

      <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">AI summary</p>
        <p className="mt-2 text-sm leading-relaxed">{reportDetail.summary}</p>
        <Link to="/companion" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
          <MessageCircle className="h-3.5 w-3.5" /> Ask AI about this report
        </Link>
      </Card>

      <SectionHeader title="Key values" />
      <div className="space-y-2.5">
        {reportDetail.values.map((v) => {
          const pct = Math.min(100, Math.max(2, (v.value / (v.range[1] * 1.4)) * 100));
          const okStart = (v.range[0] / (v.range[1] * 1.4)) * 100;
          const okEnd = (v.range[1] / (v.range[1] * 1.4)) * 100;
          return (
            <Card key={v.label}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{v.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={cn("num text-lg font-semibold", v.flag === "high" ? "text-amber" : "text-emerald")}>{v.value}</span>
                  <span className="text-[10px] text-muted-foreground">{v.unit}</span>
                </div>
              </div>
              <div className="relative mt-3 h-2 rounded-full bg-muted">
                <div className="absolute inset-y-0 rounded-full bg-emerald/25" style={{ left: `${okStart}%`, width: `${okEnd - okStart}%` }} />
                <div className={cn("absolute -top-1 h-4 w-1 rounded-full", v.flag === "high" ? "bg-amber" : "bg-emerald")} style={{ left: `calc(${pct}% - 2px)` }} />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Reference: {v.range[0]}–{v.range[1]} {v.unit}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
