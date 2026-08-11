import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  Share2,
  Printer,
  Trash2,
  PencilLine,
  FileText,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { Card } from "@/components/care/primitives";
import { documents, categories } from "@/data/records";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/records/doc/$id")({
  head: ({ params }) => {
    const d = documents.find((x) => x.id === params.id);
    const title = d?.title ?? "Document";
    return {
      meta: [
        { title: `${title} — Medical Records | careMP AIDE` },
        {
          name: "description",
          content: `${title}${d ? ` from ${d.hospital}, ${d.date}` : ""} — stored securely in your careMP AIDE health vault.`,
        },
        { property: "og:title", content: `${title} — Medical Records | careMP AIDE` },
        {
          property: "og:description",
          content: "Preview, share and control Digital Twin access for this medical document.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DocPage,
});

const flagTone: Record<string, string> = {
  high: "text-coral",
  low: "text-amber",
  ok: "text-emerald",
};

function DocPage() {
  const { id } = Route.useParams();
  const doc = documents.find((d) => d.id === id);
  const [name, setName] = useState(doc?.title ?? "Document");
  const [renaming, setRenaming] = useState(false);
  const [twin, setTwin] = useState(doc?.twin ?? false);

  if (!doc) {
    return (
      <div className="px-4 pb-6">
        <Card className="text-center text-sm text-muted-foreground">
          This document is no longer available.
          <Link to="/records" className="mt-3 block text-teal">
            Back to Medical Records
          </Link>
        </Card>
      </div>
    );
  }

  const cat = categories.find((c) => c.key === doc.category);

  return (
    <div className="space-y-4 px-4 pb-6">
      <Link
        to="/records/$category"
        params={{ category: doc.category }}
        className="inline-flex items-center gap-1 text-[12px] text-muted-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> {cat?.label}
      </Link>

      {/* Preview */}
      <div className="rise-in overflow-hidden rounded-3xl border border-border bg-muted/50">
        <div className="grid aspect-[3/4] place-items-center">
          <div className="w-[74%] rounded-2xl bg-card p-4 soft-shadow">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <FileText className="h-4 w-4 text-blue" />
              <p className="truncate text-[11px] font-semibold">{name}</p>
            </div>
            <div className="mt-3 space-y-1.5">
              {[100, 88, 94, 70, 82, 60, 90, 46].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
              ))}
            </div>
            <p className="mt-3 text-[9px] uppercase tracking-wider text-muted-foreground">
              {doc.kind} · {doc.hospital}
            </p>
          </div>
        </div>
      </div>

      <div>
        {renaming ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setRenaming(false)}
            onKeyDown={(e) => e.key === "Enter" && setRenaming(false)}
            className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-[16px] font-semibold outline-none"
          />
        ) : (
          <h1 className="text-lg font-semibold">{name}</h1>
        )}
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          {doc.hospital} · {doc.date}
        </p>
      </div>

      {/* Metadata */}
      <Card className="p-0">
        {[
          ["Hospital", doc.hospital],
          ["Doctor", doc.doctor],
          ["Date", doc.date],
          ["Category", cat?.label ?? doc.category],
          ["File type", doc.kind],
        ].map(([k, v], i, a) => (
          <div
            key={k}
            className={cn(
              "flex items-center justify-between px-4 py-3",
              i < a.length - 1 && "border-b border-border",
            )}
          >
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="text-[13px] font-medium">{v}</span>
          </div>
        ))}
      </Card>

      {doc.values && (
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Extracted values
          </p>
          <div className="mt-2 space-y-2">
            {doc.values.map((v) => (
              <div key={v.label} className="flex items-center justify-between">
                <span className="text-[13px]">{v.label}</span>
                <span className={cn("num text-[13px] font-semibold", flagTone[v.flag ?? "ok"])}>
                  {v.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Twin toggle */}
      <Card className={cn(twin && "border-teal/25 bg-teal/5")}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-teal" />
              {twin ? "Available to Digital Twin" : "Excluded from AI analysis"}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {twin
                ? "This record contributes to your Twin's insights."
                : "This record is stored, but never used for insights."}
            </p>
          </div>
          <button
            onClick={() => setTwin((v) => !v)}
            aria-label="Toggle Digital Twin access"
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
              twin ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "h-5 w-5 rounded-full bg-white shadow transition-transform",
                twin ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Download", icon: Download },
          { label: "Share", icon: Share2 },
          { label: "Print", icon: Printer },
        ].map((a) => (
          <button
            key={a.label}
            className="card-surface flex flex-col items-center gap-1.5 py-3 active:scale-[0.98]"
          >
            <a.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] font-medium">{a.label}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2.5">
        <button
          onClick={() => setRenaming(true)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-2.5 text-[12px] font-medium active:scale-[0.98]"
        >
          <PencilLine className="h-3.5 w-3.5" /> Rename
        </button>
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-coral/30 bg-coral/5 py-2.5 text-[12px] font-medium text-coral active:scale-[0.98]">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
