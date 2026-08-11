import { createFileRoute, Link } from "@tanstack/react-router";
import { reports } from "@/data/mock";
import { FileText, UploadCloud } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Medical Records — careMP" },
      { name: "description", content: "All your lab reports, AI-summarized." },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <div className="px-4 pb-6 space-y-3">
      <button className="flex w-full items-center gap-3 rounded-3xl border-2 border-dashed border-teal/40 bg-teal/5 p-4 text-teal">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/15">
          <UploadCloud className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">Upload a report</p>
          <p className="text-[11px] text-teal/70">PDF or photo · AI extracts key values</p>
        </div>
      </button>
      <SectionHeader title="All reports" />
      {reports.map((r) => (
        <Link
          key={r.id}
          to="/reports/$id"
          params={{ id: r.id }}
          className="card-surface flex items-center gap-3 p-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue/10 text-blue">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold">{r.title}</p>
            <p className="text-[11px] text-muted-foreground">
              {r.lab} · {r.date}
            </p>
          </div>
          {r.flagged > 0 && (
            <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-medium text-amber">
              {r.flagged} flag
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
