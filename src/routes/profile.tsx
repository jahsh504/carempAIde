import { createFileRoute, Link } from "@tanstack/react-router";
import { user } from "@/data/mock";
import { Card } from "@/components/care/primitives";
import { ChevronRight, User as UserIcon, Target, FileText, Pill, Settings as SettingsIcon, LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — careMP" }, { name: "description", content: "Your profile, health goals, wearables, and settings." }] }),
  component: Profile,
});

const sections = [
  { to: "info", label: "Personal info", icon: UserIcon },
  { to: "goals", label: "Health goals", icon: Target },
  { to: "records", label: "Medical records", icon: FileText },
  { to: "medications", label: "Medications", icon: Pill },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

function Profile() {
  return (
    <div className="px-4 pb-6 space-y-4">
      <Card>
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal to-blue text-white text-lg font-semibold">{user.avatarInitials}</div>
          <div className="flex-1">
            <p className="text-base font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground">{user.location} · {user.plan} plan</p>
          </div>
          <Link to="/premium" className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Manage</Link>
        </div>
      </Card>

      <Card className="p-0">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={s.to} to="/profile/$section" params={{ section: s.to }} className={`flex items-center gap-3 px-4 py-3.5 ${i < sections.length - 1 ? "border-b border-border" : ""}`}>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted"><Icon className="h-4 w-4" /></div>
              <span className="flex-1 text-sm">{s.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </Card>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 text-sm font-medium text-coral">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  );
}
