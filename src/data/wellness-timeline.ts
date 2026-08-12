export type TimelineEventSource =
  | "User"
  | "Twin"
  | "Health data"
  | "Medical record"
  | "Medication record"
  | "Companion"
  | "User + Companion";

export type DailyTimelineItem = {
  id: string;
  icon: "check-circle" | "dumbbell" | "heart" | "leaf" | "pill" | "activity" | "stethoscope" | "shield";
  title: string;
  date: string;
  category: "medication" | "activity" | "vitals" | "sleep" | "system";
};

export type BeforeAfterMetric = {
  label: string;
  before: string;
  after: string;
  change: string;
  trend: "positive" | "neutral" | "negative";
};

export type BeforeAfterComparison = {
  periodBefore: string;
  periodAfter: string;
  metrics: BeforeAfterMetric[];
  summary: string;
};

export type EventTimelineItem = {
  id: string;
  title: string;
  category: "lifestyle" | "medication" | "clinical" | "symptom" | "wellness";
  date: string;
  timestamp: string;
  source: TimelineEventSource;
  context?: string;
  icon: "dumbbell" | "pill" | "stethoscope" | "activity" | "heart" | "check-circle" | "leaf";
  beforeAfterComparison?: BeforeAfterComparison;
};

// Initial Daily Timeline items
const initialDailyTimeline: DailyTimelineItem[] = [
  { id: "d-1", icon: "check-circle", title: "Doses completed on time", date: "Today · 8:00 AM", category: "medication" },
  { id: "d-2", icon: "dumbbell", title: "Morning walk 2.4 km", date: "Today · 10:30 AM", category: "activity" },
  { id: "d-3", icon: "heart", title: "Sleep score 85/100 · 7.5 hrs", date: "Today · 7:30 AM", category: "sleep" },
  { id: "d-4", icon: "leaf", title: "Baseline vitals recorded", date: "Yesterday", category: "vitals" },
];

// Initial Event Timeline items
const initialEventTimeline: EventTimelineItem[] = [
  {
    id: "evt-gym",
    title: "Gym & active workout routine started",
    category: "lifestyle",
    date: "July 12, 2026",
    timestamp: "2026-07-12",
    source: "User + Companion",
    context: "User confirmed 3x/week workout routine after Twin detected elevated daily movement.",
    icon: "dumbbell",
    beforeAfterComparison: {
      periodBefore: "30 days prior (Jun 12 – Jul 11)",
      periodAfter: "30 days after (Jul 12 – Aug 11)",
      metrics: [
        { label: "Resting Heart Rate", before: "72 bpm", after: "68 bpm", change: "-4 bpm", trend: "positive" },
        { label: "Daily Activity", before: "3,200 steps / 32m active", after: "7,800 steps / 54m active", change: "+22 mins (+68%)", trend: "positive" },
        { label: "Deep Sleep Duration", before: "1h 12m", after: "1h 35m", change: "+23 mins (+32%)", trend: "positive" },
        { label: "Average Stress Level", before: "48/100", after: "36/100", change: "-12 pts (-25%)", trend: "positive" },
      ],
      summary: "Since you started going to the gym on July 12, your average resting heart rate has decreased by 4 bpm, daily active time increased by 22 minutes, and deep sleep improved by 32%.",
    },
  },
  {
    id: "evt-vitd",
    title: "Vitamin D3 supplement started (2,000 IU)",
    category: "medication",
    date: "August 1, 2026",
    timestamp: "2026-08-01",
    source: "User",
    context: "Daily morning vitamin supplement added to routine.",
    icon: "pill",
    beforeAfterComparison: {
      periodBefore: "10 days prior",
      periodAfter: "10 days after",
      metrics: [
        { label: "Readiness / Energy Score", before: "72/100", after: "81/100", change: "+9 pts (+12.5%)", trend: "positive" },
        { label: "Sleep Continuity", before: "82%", after: "89%", change: "+7%", trend: "positive" },
      ],
      summary: "Since you started taking Vitamin D on August 1, your overall readiness score has increased by 9 points and sleep continuity improved by 7%.",
    },
  },
  {
    id: "evt-checkup",
    title: "Annual wellness health checkup completed",
    category: "clinical",
    date: "August 5, 2026",
    timestamp: "2026-08-05",
    source: "Medical record",
    context: "Routine exam & blood panel with Dr. Sarah Jenkins.",
    icon: "stethoscope",
    beforeAfterComparison: {
      periodBefore: "6 months prior",
      periodAfter: "Recent panel",
      metrics: [
        { label: "LDL Cholesterol", before: "156 mg/dL", after: "138 mg/dL", change: "-18 mg/dL", trend: "positive" },
        { label: "Blood Pressure", before: "124/82 mmHg", after: "118/76 mmHg", change: "-6/-6 mmHg", trend: "positive" },
      ],
      summary: "Since your health checkup on August 5, your blood pressure settled nicely to 118/76 mmHg and your LDL cholesterol dropped by 18 points.",
    },
  },
];

// Reactive stores
let dailyStore: DailyTimelineItem[] = [...initialDailyTimeline];
let eventStore: EventTimelineItem[] = [...initialEventTimeline];

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeTimeline(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDailyTimeline(): DailyTimelineItem[] {
  return dailyStore;
}

export function getEventTimeline(): EventTimelineItem[] {
  return eventStore;
}

export function markMedicationTaken(medName: string = "Metformin 500mg"): DailyTimelineItem {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const timeStr = `Today · ${formattedHours}:${minutes} ${ampm}`;

  const newItem: DailyTimelineItem = {
    id: `d-${Date.now()}`,
    icon: "check-circle",
    title: `Medication taken · ${medName}`,
    date: timeStr,
    category: "medication",
  };

  dailyStore = [newItem, ...dailyStore];
  notify();
  return newItem;
}

export function addEventTimelineItem(eventData: Omit<EventTimelineItem, "id">): EventTimelineItem {
  const newEvent: EventTimelineItem = {
    id: `evt-${Date.now()}`,
    ...eventData,
  };
  eventStore = [newEvent, ...eventStore];
  notify();
  return newEvent;
}

export function findTimelineEvent(query: string): EventTimelineItem | undefined {
  const q = query.toLowerCase();
  return eventStore.find((evt) => {
    const titleMatch = evt.title.toLowerCase().includes(q);
    const catMatch = evt.category.toLowerCase().includes(q);
    const contextMatch = evt.context?.toLowerCase().includes(q) || false;

    if (q.includes("gym") || q.includes("workout") || q.includes("exercise") || q.includes("active")) {
      return evt.id === "evt-gym" || titleMatch || contextMatch;
    }
    if (q.includes("vitamin") || q.includes("supplement") || q.includes("vitamin d")) {
      return evt.id === "evt-vitd" || titleMatch;
    }
    if (q.includes("checkup") || q.includes("doctor") || q.includes("exam") || q.includes("blood test")) {
      return evt.id === "evt-checkup" || titleMatch;
    }
    return titleMatch || catMatch || contextMatch;
  });
}
