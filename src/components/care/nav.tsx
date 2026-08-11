import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  MessageCircle,
  Sparkles,
  Users,
  HeartHandshake,
  HeartPulse,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/companion", label: "Companion", icon: MessageCircle },
  { to: "/twin", label: "Twin", icon: Sparkles },
  { to: "/family", label: "Family", icon: Users },
  { to: "/care", label: "Care Plan", icon: HeartPulse },
  { to: "/care-team", label: "Care Team", icon: HeartHandshake },
] as const;

const HIDE_ON = ["/", "/onboarding", "/auth"];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (HIDE_ON.some((p) => pathname === p)) return null;
  return (
    <nav className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[440px] justify-center pb-[max(env(safe-area-inset-bottom),8px)]">
      <div className="glass mx-3 mb-2 flex w-full items-center justify-around rounded-3xl px-2 py-2 soft-shadow">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-0.5 py-1.5 text-center text-[9.5px] leading-tight font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
              <span>{label}</span>
              {active && <span className="absolute -top-1 h-1 w-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function FloatingAI() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (HIDE_ON.some((p) => pathname === p) || pathname.startsWith("/companion")) return null;
  return (
    <Link
      to="/companion"
      aria-label="Open AI Companion"
      className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-teal to-blue text-white soft-shadow idle-pulse"
    >
      <Bot className="h-6 w-6" />
    </Link>
  );
}
