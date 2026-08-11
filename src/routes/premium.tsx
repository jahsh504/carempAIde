import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Upgrade — careMP" },
      {
        name: "description",
        content: "Unlock your deeper Digital Twin, unlimited AI, priority care, and family seats.",
      },
    ],
  }),
  component: Premium,
});

const tiers = [
  {
    name: "Free",
    price: "₹0",
    tag: "Get started",
    features: [
      "Basic health score",
      "Limited AI questions (5/day)",
      "Manual vitals only",
      "1 family member",
    ],
  },
  {
    name: "Premium",
    price: "₹399",
    per: "/mo",
    featured: true,
    tag: "Most popular",
    features: [
      "Deep Digital Twin (full body systems)",
      "Unlimited AI companion",
      "Wearable + lab integration",
      "Priority booking (15% off)",
      "3 family members",
    ],
  },
  {
    name: "Family",
    price: "₹899",
    per: "/mo",
    tag: "Care for everyone",
    features: [
      "Everything in Premium",
      "Up to 6 family members",
      "Elder care & caregiver mode",
      "Shared reports & alerts",
      "24×7 emergency line",
    ],
  },
];

function Premium() {
  return (
    <div className="px-4 pb-6 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-teal to-blue p-5 text-white soft-shadow">
        <Sparkles className="h-6 w-6" />
        <h1 className="mt-3 text-xl font-semibold">Go deeper with careMP</h1>
        <p className="mt-1 text-sm opacity-90">
          A more accurate Twin, unlimited AI, priority care.
        </p>
      </div>

      {tiers.map((t) => (
        <div
          key={t.name}
          className={cn("card-surface p-5", t.featured && "border-teal ring-2 ring-teal/30")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.tag}</p>
              <p className="text-lg font-semibold">{t.name}</p>
            </div>
            <div className="text-right">
              <span className="num text-2xl font-semibold">{t.price}</span>
              {t.per && <span className="text-xs text-muted-foreground">{t.per}</span>}
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    t.featured ? "text-teal" : "text-emerald",
                  )}
                />
                {f}
              </li>
            ))}
          </ul>
          {t.featured && (
            <button className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground soft-shadow">
              Upgrade to Premium
            </button>
          )}
        </div>
      ))}
      <p className="pt-2 text-center text-[10px] text-muted-foreground">
        Cancel anytime · Encrypted, HIPAA-aligned storage
      </p>
    </div>
  );
}
