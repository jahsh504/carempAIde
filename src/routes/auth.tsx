import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Apple, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — careMP" }, { name: "description", content: "Sign in to your careMP account." }] }),
  component: Auth,
});

function Auth() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-24 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal/30 to-blue/20 blur-3xl" />
      </div>
      <div className="relative z-10 w-full card-surface p-6 rise-in">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal to-blue text-white">
            <span className="text-xl font-semibold">c</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-xs text-muted-foreground">Sign in to continue your health journey.</p>
        </div>
        <div className="space-y-3">
          <label className="block">
            <span className="text-[11px] font-medium text-muted-foreground">Email</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input defaultValue="aarav@caremp.app" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="text-[11px] font-medium text-muted-foreground">Password</span>
            <input type="password" defaultValue="••••••••" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none" />
          </label>
          <Link to="/home" className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">
            Sign in
          </Link>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium">
            <Apple className="h-4 w-4" /> Continue with Apple
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-blue to-teal text-[9px] font-bold text-white">G</span>
            Continue with Google
          </button>
          <label className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-xs">
            <span className="flex items-center gap-2 font-medium">
              <Fingerprint className="h-4 w-4 text-teal" /> Enable biometric login
            </span>
            <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
              <span className="ml-4 h-4 w-4 rounded-full bg-white shadow" />
            </span>
          </label>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link to="/onboarding" className="font-medium text-primary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
