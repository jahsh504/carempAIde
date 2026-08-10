import { useState } from "react";
import { Check, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CareTask } from "@/data/care";

export function TaskRow({
  task,
  onToggle,
}: {
  task: CareTask;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card px-3 py-2.5 transition-colors",
        task.done && "border-emerald/30 bg-emerald/5"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          aria-label={task.done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
          onClick={() => onToggle(task.id)}
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all active:scale-90",
            task.done
              ? "border-transparent bg-gradient-to-br from-emerald to-teal text-white scale-in"
              : "border-border bg-background text-transparent"
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </button>
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className={cn("truncate text-[13px] font-medium", task.done && "text-muted-foreground line-through")}>
            {task.title}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            {task.minutes > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.minutes} min
              </span>
            )}
            {task.reminder && (
              <span className="inline-flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {task.reminder}
              </span>
            )}
          </div>
        </button>
      </div>
      {open && (
        <p className="rise-in mt-2 border-t border-border pt-2 text-[11px] leading-relaxed text-muted-foreground">
          {task.why}
        </p>
      )}
    </div>
  );
}

export function MiniLine({
  data,
  color,
  width = 120,
  height = 36,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r={3} fill={color} />
    </svg>
  );
}
