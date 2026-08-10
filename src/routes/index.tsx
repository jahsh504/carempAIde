import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "careMP — Your health, understood." }] }),
  component: Splash,
});

function Splash() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative -mx-0 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[35%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal/40 via-blue/25 to-transparent blur-3xl breathing" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-teal to-blue text-white soft-shadow">
          <span className="text-3xl font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>c</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          careMP <span className="text-teal">AIDE</span>
        </h1>
        <p className="mt-2 max-w-[280px] text-sm text-muted-foreground">Your AI Health Companion for Every Stage of Life</p>
        <div className="mt-10 flex flex-col items-center gap-3">
          {!ready ? (
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal [animation-delay:300ms]" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 fade-in">
              <Link to="/onboarding" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground soft-shadow">
                Get started
              </Link>
              <Link to="/auth" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                I already have an account
              </Link>
            </div>
          )}
        </div>
      </div>
      <p className="absolute bottom-6 text-[11px] text-muted-foreground">Preventive intelligence · Digital Twin · Family care</p>
    </div>
  );
}
