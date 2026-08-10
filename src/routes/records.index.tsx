import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FlaskConical, Scan, Pill, Folder, Search, Plus, X, Camera, ScanLine,
  FileText, Image as ImageIcon, FolderOpen, Sparkles, Lock, ChevronRight, Clock,
} from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { categories, documents, countFor, recordsSummary, twinUsageLine } from "@/data/records";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/records/")({
  head: () => ({
    meta: [
      { title: "Medical Records — Your secure health vault | careMP AIDE" },
      { name: "description", content: "Browse lab reports, imaging, prescriptions and documents in one calm, encrypted health vault." },
      { property: "og:title", content: "Medical Records — Your secure health vault | careMP AIDE" },
      { property: "og:description", content: "Lab reports, imaging, prescriptions and documents — organised and private." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordsHome,
});

const catIcon: Record<string, typeof Folder> = { flask: FlaskConical, scan: Scan, pill: Pill, folder: Folder };
const catTone: Record<string, string> = {
  teal: "bg-teal/10 text-teal",
  blue: "bg-blue/10 text-blue",
  emerald: "bg-emerald/10 text-emerald",
  amber: "bg-amber/15 text-amber",
};

const uploadItems = [
  { label: "Take Photo", icon: Camera },
  { label: "Scan Document", icon: ScanLine },
  { label: "Choose PDF", icon: FileText },
  { label: "Choose Image", icon: ImageIcon },
  { label: "Import from Files", icon: FolderOpen },
];

function RecordsHome() {
  const [tab, setTab] = useState<"categories" | "timeline">("categories");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return documents.filter((d) =>
      [d.title, d.hospital, d.doctor, d.date, d.tag ?? "", d.category, ...(d.medications ?? [])]
        .join(" ").toLowerCase().includes(s)
    );
  }, [q]);

  const timeline = useMemo(() => {
    const sorted = [...documents].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
    const groups: { label: string; docs: typeof documents }[] = [];
    for (const d of sorted) {
      const label = d.date === "Today" ? "Today" : d.date;
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.docs.push(d);
      else groups.push({ label, docs: [d] });
    }
    return groups;
  }, []);

  const startUpload = (label: string) => {
    setSheet(false);
    setProcessing(label);
    setExtracted(false);
    setTimeout(() => { setProcessing(null); setExtracted(true); }, 1800);
  };

  return (
    <div className="relative space-y-5 px-4 pb-24">
      <div className="rise-in">
        <h1 className="text-xl font-semibold">Medical Records</h1>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Your secure health history</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search hospital, doctor, document…"
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear search" className="text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {q ? (
        <div className="space-y-2">
          <SectionHeader title="Results" hint={`${results.length} document${results.length === 1 ? "" : "s"}`} />
          {results.map((d) => (
            <DocRow key={d.id} id={d.id} title={d.title} sub={`${d.hospital} · ${d.date}`} tag={d.tag} />
          ))}
          {results.length === 0 && (
            <Card className="text-center text-xs text-muted-foreground">No records match that search.</Card>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1.5">
            {(["categories", "timeline"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-medium capitalize transition-colors",
                  tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {(processing || extracted) && (
            <Card className={cn("rise-in", extracted && "border-emerald/30 bg-emerald/5")}>
              {processing ? (
                <>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal border-t-transparent" />
                    Processing…
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Reading your {processing.toLowerCase()} and extracting details.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-emerald">Details extracted</p>
                  <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                    <p>Apollo Hospital · Dr. Nadia Rahman</p>
                    <p>March 2026 · Lab report · Haemoglobin 14.2 g/dL</p>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">The original document is stored unchanged.</p>
                </>
              )}
            </Card>
          )}

          {tab === "categories" ? (
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((c) => {
                const Icon = catIcon[c.icon] ?? Folder;
                return (
                  <Link
                    key={c.key}
                    to="/records/$category"
                    params={{ category: c.key }}
                    className="card-surface p-4 active:scale-[0.98]"
                  >
                    <span className={cn("grid h-10 w-10 place-items-center rounded-xl", catTone[c.tone])}>
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-3 text-[14px] font-semibold">{c.label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{c.blurb}</p>
                    <p className="num mt-2.5 text-[11px] text-muted-foreground">
                      {countFor(c.key)} files · {c.lastUpdated}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((g) => (
                <div key={g.label}>
                  <p className="mb-2 inline-flex items-center gap-1.5 px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Clock className="h-3 w-3" /> {g.label}
                  </p>
                  <div className="space-y-2">
                    {g.docs.map((d) => (
                      <DocRow key={d.id} id={d.id} title={d.title} sub={`${d.hospital} · ${d.doctor}`} tag={d.tag} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI summary */}
          <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal">
              <Sparkles className="h-3.5 w-3.5" /> From your Twin
            </p>
            {recordsSummary.map((s) => (
              <p key={s} className="mt-2 text-[13px] leading-relaxed">{s}</p>
            ))}
            <p className="mt-2 text-[11px] text-muted-foreground">{twinUsageLine}</p>
          </Card>

          {/* Privacy */}
          <Card className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
              <Lock className="h-4 w-4" />
            </span>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Your medical records are encrypted and only shared with people you explicitly authorize.
            </p>
          </Card>
        </>
      )}

      {/* Upload FAB */}
      <button
        onClick={() => setSheet(true)}
        className="fixed bottom-[184px] right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-teal to-blue px-4 py-3 text-[13px] font-semibold text-white soft-shadow active:scale-95"
      >
        <Plus className="h-4 w-4" /> Upload Record
      </button>

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" onClick={() => setSheet(false)} />
          <div className="rise-in relative mx-3 mb-4 w-full max-w-[440px] overflow-hidden rounded-3xl border border-border bg-card soft-shadow">
            <div className="px-4 pb-1 pt-4">
              <p className="text-sm font-semibold">Upload Record</p>
              <p className="text-[11px] text-muted-foreground">Scanned documents are read automatically.</p>
            </div>
            {uploadItems.map((u) => (
              <button
                key={u.label}
                onClick={() => startUpload(u.label)}
                className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5 text-left active:bg-muted"
              >
                <u.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-[13px]">{u.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            <button onClick={() => setSheet(false)} className="w-full border-t border-border py-3.5 text-[13px] font-medium text-muted-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DocRow({ id, title, sub, tag }: { id: string; title: string; sub: string; tag?: string }) {
  return (
    <Link to="/records/doc/$id" params={{ id }} className="card-surface flex items-center gap-3 p-3 active:scale-[0.99]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
        <FileText className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{title}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{sub}</span>
      </span>
      {tag && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>}
    </Link>
  );
}
