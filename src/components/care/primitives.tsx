import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import type { ReactNode } from "react";
import type { Status } from "@/data/mock";
import { Link } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const statusRing: Record<Status, string> = {
  good: "text-emerald",
  caution: "text-amber",
  alert: "text-coral",
};
export const statusBg: Record<Status, string> = {
  good: "bg-emerald/10 text-emerald",
  caution: "bg-amber/15 text-amber",
  alert: "bg-coral/10 text-coral",
};
export const statusDot: Record<Status, string> = {
  good: "bg-emerald",
  caution: "bg-amber",
  alert: "bg-coral",
};

export function Card({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card-surface p-4 rise-in", className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  action,
  hint,
}: {
  title: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-1">
      <div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusChip({ status, children }: { status: Status; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        statusBg[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])} />
      {children}
    </span>
  );
}

export function TrendBadge({ value, unit = "" }: { value: number; unit?: string }) {
  const good = value > 0;
  const flat = value === 0;
  const Icon = flat ? Minus : good ? TrendingUp : TrendingDown;
  const tone = flat
    ? "text-muted-foreground bg-muted"
    : good
      ? "text-emerald bg-emerald/10"
      : "text-coral bg-coral/10";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone,
      )}
    >
      <Icon className="h-3 w-3" />
      {value > 0 ? "+" : ""}
      {value}
      {unit}
    </span>
  );
}

// Radial score ring with gradient fill
export function RadialScore({
  value,
  size = 172,
  stroke = 12,
  label,
  sub,
  gradient = ["var(--teal)", "var(--blue)"],
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  gradient?: [string, string];
}) {
  const animated = useCountUp(value, 1000);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, animated));
  const dash = (pct / 100) * c;
  const id = `g-${label ?? "s"}-${size}`.replace(/\s/g, "");
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 200ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-[42px] font-semibold leading-none">{Math.round(animated)}</span>
        {label && (
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
        {sub && <span className="mt-1 text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

// Small circular progress used in Twin body systems grid
export function RingProgress({
  value,
  size = 64,
  stroke = 6,
  color = "var(--teal)",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const animated = useCountUp(value, 900);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, animated)) / 100) * c;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? <span className="num text-sm font-semibold">{Math.round(animated)}</span>}
      </div>
    </div>
  );
}

// Minimal gradient-filled sparkline
export function Sparkline({
  data,
  width = 96,
  height = 32,
  color = "var(--teal)",
  fill = true,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const path = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Weekly bar chart
export function BarChart({
  data,
  labels,
  height = 120,
}: {
  data: number[];
  labels?: string[];
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-teal/60 to-blue/70 transition-all"
              style={{ height: `${(v / max) * 100}%`, animation: `rise-in 500ms ${i * 60}ms both` }}
            />
          </div>
          {labels && <span className="text-[10px] text-muted-foreground">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("card-surface h-24 shimmer", className)} />;
}

export function IconTile({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "blue" | "emerald" | "amber" | "coral";
}) {
  const map: Record<string, string> = {
    teal: "bg-teal/10 text-teal",
    blue: "bg-blue/10 text-blue",
    emerald: "bg-emerald/10 text-emerald",
    amber: "bg-amber/15 text-amber",
    coral: "bg-coral/10 text-coral",
  };
  return (
    <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", map[tone])}>
      {children}
    </div>
  );
}

export function LinkCard({
  to,
  children,
  className,
  ...rest
}: { to: string; children: ReactNode; className?: string } & Record<string, unknown>) {
  return (
    <Link
      to={to}
      className={cn("card-surface block p-4 transition-transform active:scale-[0.98]", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
