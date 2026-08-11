import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Building2, User, CalendarDays } from "lucide-react";
import { Card, SectionHeader } from "@/components/care/primitives";
import { categories, documents, type RecordCategory } from "@/data/records";

export const Route = createFileRoute("/records/$category")({
  head: ({ params }) => {
    const c = categories.find((x) => x.key === params.category);
    const label = c?.label ?? "Records";
    return {
      meta: [
        { title: `${label} — Medical Records | careMP AIDE` },
        {
          name: "description",
          content: `${label} stored in your careMP AIDE health vault: ${c?.blurb ?? "your documents"}.`,
        },
        { property: "og:title", content: `${label} — Medical Records | careMP AIDE` },
        {
          property: "og:description",
          content: `Browse your ${label.toLowerCase()} with hospital, doctor and date details.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const meta = categories.find((c) => c.key === category);
  const docs = documents.filter((d) => d.category === (category as RecordCategory));

  return (
    <div className="space-y-3 px-4 pb-6">
      <SectionHeader
        title={meta?.label ?? "Records"}
        hint={`${docs.length} document${docs.length === 1 ? "" : "s"} · ${meta?.lastUpdated ?? ""}`}
      />
      {docs.map((d) => (
        <Link
          key={d.id}
          to="/records/doc/$id"
          params={{ id: d.id }}
          className="card-surface flex items-start gap-3 p-3.5 active:scale-[0.99]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
            <FileText className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold">{d.title}</span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {d.hospital}
              </span>
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" /> {d.doctor}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> {d.date}
              </span>
            </span>
          </span>
          {d.tag && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {d.tag}
            </span>
          )}
        </Link>
      ))}
      {docs.length === 0 && (
        <Card className="text-center text-xs text-muted-foreground">
          Nothing here yet — upload a record to get started.
        </Card>
      )}
    </div>
  );
}
