import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { user } from "@/data/mock";
import { cn } from "@/lib/utils";

const HIDE_ON = ["/", "/onboarding", "/auth"];

const TITLES: Record<string, string> = {
  "/home": "",
  "/companion": "AI Companion",
  "/twin": "My Health Twin",
  "/family": "Family Circle",
  "/care": "Care Plan",
  "/medication": "Medication",
  "/medication/add": "Add Medication",
  "/medication/refills": "Refill Reminders",
  "/medication/reminders": "AI Smart Reminder",
  "/medication/course": "Course Completion",
  "/medication/review": "Doctor Review Reminder",
  "/medication/history": "Medication History",
  "/geofence": "Geofence",
  "/geofence/alerts": "Recent Activity",
  "/geofence/zones": "Restricted Zones",
  "/geofence/settings": "Geofence Settings",
  "/care-team": "Care Team",
  "/care-team/caregivers": "Assigned Caregivers",
  "/records": "Medical Records",
  "/notifications": "Notifications",
  "/reports": "Medical Records",
  "/premium": "Upgrade",
  "/profile": "Profile",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  if (HIDE_ON.includes(pathname)) return null;
  const isHome = pathname === "/home";
  const showBack =
    !isHome &&
    !["/companion", "/twin", "/family", "/care", "/care-team"].includes(pathname);
  const title = TITLES[pathname] ?? "";

  return (
    <header className="sticky top-0 z-30 mx-auto flex max-w-[440px] items-center justify-between gap-3 bg-background/80 px-4 py-3 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? (
          <button
            onClick={() => window.history.back()}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full bg-card border border-border"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-blue text-white">
            <span className="text-[13px] font-semibold">c</span>
          </div>
        )}
        {isHome ? (
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">careMP AIDE</p>
            <p className="truncate text-sm font-semibold">Good morning, {user.firstName}</p>
          </div>
        ) : (
          title && <h1 className="truncate text-[15px] font-semibold">{title}</h1>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full bg-card border border-border"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-coral" />
        </Link>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Profile menu"
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue to-teal text-white text-[12px] font-semibold"
          >
            {user.avatarInitials}
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-popover soft-shadow rise-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.plan} plan</p>
                </div>
                {[
                  { to: "/profile/info", label: "Personal Info" },
                  { to: "/profile/goals", label: "Health Goals" },
                  { to: "/records", label: "Medical Records" },
                  { to: "/medication", label: "Medication" },
                  { to: "/geofence", label: "Geofence" },
                  { to: "/profile/settings", label: "Settings" },
                ].map((i) => (
                  <Link
                    key={i.to}
                    to={i.to}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-muted"
                  >
                    {i.label}
                  </Link>
                ))}
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block border-t border-border px-4 py-2.5 text-sm text-coral hover:bg-muted",
                  )}
                >
                  Log out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
