import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  Mic,
  Paperclip,
  Search,
  Bot,
  User as UserIcon,
  HeartPulse,
  Sparkle,
  X,
  ChevronRight,
  Pill,
  Brain,
} from "lucide-react";
import { chatSeed } from "@/data/mock";
import {
  addEventTimelineItem,
  findTimelineEvent,
  type EventTimelineItem,
} from "@/data/wellness-timeline";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/companion")({
  head: () => ({
    meta: [
      { title: "AI Companion — careMP AIDE" },
      {
        name: "description",
        content: "Chat with your careMP AI companion about vitals, reports, and daily wellness.",
      },
    ],
  }),
  component: Companion,
});

type Rec = { kind: "counselor" | "pharmacy"; reason: string };
type Msg = { role: "user" | "ai"; text: string; rich?: "hr-explainer"; rec?: Rec };

const seededChat: Msg[] = [
  {
    role: "ai",
    text: "I noticed your daily activity has increased significantly over the past 2 weeks (+68%). Did you start a new routine or activity?",
  },
  {
    role: "ai",
    text: "Also — your sleep dropped 18% this week and stress spiked mid-week.",
    rec: { kind: "counselor", reason: "Sleep –18% · stress trending up" },
  },
  {
    role: "ai",
    text: "And a heads-up on your medication timeline:",
    rec: { kind: "pharmacy", reason: "Refill needed by Fri · Atorvastatin runs out in 3 days." },
  },
];

const companionSuggestedQuestions = [
  "I started going to the gym. What changed after that?",
  "I started taking Vitamin D yesterday",
  "How is my resting heart rate trending?",
  "Compare my vitals before and after checkup",
];

function Companion() {
  const [messages, setMessages] = useState<Msg[]>(seededChat);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: processCompanionMessage(text) }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="mx-4 mb-2 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
        <Search className="h-3.5 w-3.5" />
        <input placeholder="Search chat history" className="w-full bg-transparent outline-none" />
      </div>

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {messages.map((m, i) =>
          dismissed.includes(i) ? null : (
            <Bubble key={i} msg={m} onDismiss={() => setDismissed((d) => [...d, i])} />
          ),
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <Avatar ai />
            <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {companionSuggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-teal/40 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-background/95 px-3 pb-24 pt-2 backdrop-blur">
        {listening ? (
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-teal/15 to-blue/15 px-4 py-3">
            <div className="flex flex-1 items-center gap-1">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full bg-teal"
                  style={{
                    height: `${8 + Math.random() * 22}px`,
                    animation: `breathing ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 40}ms infinite`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setListening(false)}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Stop
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <button
              aria-label="Attach"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card border border-border"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <div className="flex-1 rounded-3xl border border-border bg-card px-3 py-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about your health…"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setListening(true)}
              aria-label="Voice"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card border border-border"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={() => send(input)}
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ ai }: { ai?: boolean }) {
  return (
    <div
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
        ai ? "bg-gradient-to-br from-teal to-blue text-white" : "bg-muted text-foreground",
      )}
    >
      {ai ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
    </div>
  );
}

function Bubble({ msg, onDismiss }: { msg: Msg; onDismiss?: () => void }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end rise-in">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2 rise-in">
      <Avatar ai />
      <div className="max-w-[80%] space-y-2">
        <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed">
          {msg.text}
        </div>
        {msg.rich === "hr-explainer" && <HRExplainer />}
        {msg.rec && <RecCard rec={msg.rec} onDismiss={onDismiss} />}
      </div>
    </div>
  );
}

function RecCard({ rec, onDismiss }: { rec: Rec; onDismiss?: () => void }) {
  const config =
    rec.kind === "counselor"
      ? {
          icon: Brain,
          label: "Health Suggestion",
          accent: "bg-[oklch(0.62_0.18_295)]/10 text-[oklch(0.62_0.18_295)]",
        }
      : {
          icon: Pill,
          label: "Refill Reminder",
          accent: "bg-amber/15 text-amber",
        };
  const Icon = config.icon;
  return (
    <div className="relative rounded-2xl border border-border bg-card p-3">
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-center gap-2">
        <div className={cn("grid h-8 w-8 place-items-center rounded-xl", config.accent)}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {config.label}
        </p>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{rec.reason}</p>
    </div>
  );
}

function HRExplainer() {
  return (
    <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/5 to-blue/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-teal/15 text-teal">
          <HeartPulse className="h-3.5 w-3.5" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal">
          Resting heart rate
        </p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="num text-2xl font-semibold">68</span>
        <span className="text-xs text-muted-foreground">bpm · reference 60–75</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
        <div className="h-full w-[46%] rounded-full bg-gradient-to-r from-emerald to-teal" />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Down from 72 bpm last week.</p>
      <div className="mt-3 flex gap-2">
        <Link
          to="/vitals/$metric"
          params={{ metric: "heart-rate" }}
          className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground"
        >
          See full trend
        </Link>
      </div>
    </div>
  );
}

function processCompanionMessage(q: string): string {
  const s = q.toLowerCase();

  // 1. User replying to Twin proactive prompt / confirming workout/gym routine
  if (
    (s.includes("yeah") || s.includes("yes") || s.includes("sure") || s.includes("started") || s.includes("going")) &&
    (s.includes("gym") || s.includes("workout") || s.includes("exercise") || s.includes("running") || s.includes("swimming"))
  ) {
    const title = s.includes("gym")
      ? "Gym & workout routine started"
      : s.includes("swimming")
      ? "Swimming routine started"
      : "Active exercise routine started";

    addEventTimelineItem({
      title,
      category: "lifestyle",
      date: "Today (Aug 12)",
      timestamp: new Date().toISOString().split("T")[0],
      source: "User + Companion",
      context: "User confirmed new routine to Companion after Twin activity discovery.",
      icon: "dumbbell",
      beforeAfterComparison: {
        periodBefore: "30 days prior",
        periodAfter: "30 days after",
        metrics: [
          { label: "Resting Heart Rate", before: "72 bpm", after: "68 bpm", change: "-4 bpm", trend: "positive" },
          { label: "Daily Active Time", before: "32 mins", after: "54 mins", change: "+22 mins (+68%)", trend: "positive" },
          { label: "Deep Sleep Duration", before: "1h 12m", after: "1h 35m", change: "+23 mins (+32%)", trend: "positive" },
          { label: "Stress Level", before: "48/100", after: "36/100", change: "-12 pts (-25%)", trend: "positive" },
        ],
        summary: "Since you started going to the gym on July 12, your average resting heart rate has decreased by 4 bpm, daily active time increased by 22 minutes, and deep sleep improved by 32%.",
      },
    });

    return `Got it! I've recorded "${title}" into your Wellness Timeline (Date: Aug 12 · Source: User + Companion).\n\nAs your Digital Twin continues gathering vitals and sleep data, I'll track your health signals before and after this milestone.`;
  }

  // 2. User asking about past Timeline events & Before/After comparison
  if (
    s.includes("what changed") ||
    s.includes("how did") ||
    s.includes("compare") ||
    s.includes("since i") ||
    s.includes("after i") ||
    s.includes("after that")
  ) {
    const matched = findTimelineEvent(s);
    if (matched && matched.beforeAfterComparison) {
      return matched.beforeAfterComparison.summary;
    } else if (matched) {
      return `I found "${matched.title}" recorded on ${matched.date}. Your Digital Twin is currently collecting post-event vitals to track your progress over the coming days!`;
    }
  }

  // 3. User direct event reporting (User -> Timeline)
  if (
    s.startsWith("i started") ||
    s.startsWith("i had") ||
    s.startsWith("i took") ||
    s.startsWith("i stopped") ||
    s.startsWith("i was sick") ||
    s.includes("started taking") ||
    s.includes("health checkup")
  ) {
    let title = "User event logged";
    let category: EventTimelineItem["category"] = "wellness";
    let icon: EventTimelineItem["icon"] = "activity";

    if (s.includes("vitamin") || s.includes("supplement")) {
      title = "Vitamin D supplement started (2,000 IU)";
      category = "medication";
      icon = "pill";
    } else if (s.includes("gym") || s.includes("workout")) {
      title = s.includes("stopped") ? "Gym routine paused" : "Gym & workout routine started";
      category = "lifestyle";
      icon = "dumbbell";
    } else if (s.includes("checkup") || s.includes("doctor")) {
      title = "Health checkup & blood panel completed";
      category = "clinical";
      icon = "stethoscope";
    } else if (s.includes("sick")) {
      title = "Illness & recovery episode logged";
      category = "symptom";
      icon = "heart";
    }

    addEventTimelineItem({
      title,
      category,
      date: s.includes("yesterday") ? "Yesterday" : s.includes("last week") ? "Last week" : "Today (Aug 12)",
      timestamp: new Date().toISOString().split("T")[0],
      source: "User",
      context: "Directly logged by user via Companion chat.",
      icon,
    });

    return `I've added "${title}" to your Wellness Timeline (Source: User · Category: ${category}).\n\nYour Digital Twin will now use this event as context when analyzing future changes in your vitals, sleep, and activity signals.`;
  }

  // 4. Default query fallbacks
  if (s.includes("sleep"))
    return "Your sleep has averaged 7h 20m this week — 22 minutes above your monthly baseline. Deep sleep is your biggest gain.";
  if (s.includes("lipid") || s.includes("report"))
    return "Your latest lipid panel shows LDL at 138 (slightly high) and HDL at 52 (healthy). Compared to March, LDL is down 18 points — good direction.";
  if (s.includes("blood pressure"))
    return "Your average BP over 14 days is 118/76 — within the ideal range for your age.";
  if (s.includes("eat") || s.includes("diet"))
    return "Based on your activity today, aim for ~2,300 kcal with 100g protein. Add fiber — you've been low this week.";

  return "Good question. Based on your Digital Twin baseline, everything looks steady. I'll flag anything that drifts or connect new timeline milestones to your health signals.";
}

