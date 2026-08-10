// Care module — mock Digital Twin generated plan data.
// Structured so each section can be swapped for a Twin/backend API with minimal changes.

export type TaskCategory = "movement" | "nutrition" | "recovery" | "medication" | "mind";

export type CareTask = {
  id: string;
  title: string;
  minutes: number;
  category: TaskCategory;
  reminder?: string;
  done: boolean;
  why: string;
};

export type CarePlan = {
  id: string;
  goal: string;
  focusTitle: string;
  focusLine: string;
  score: number;
  day: number;
  totalDays: number;
  streak: number;
  tasks: CareTask[];
  reasoning: string;
  adjustment: string;
};

export const activePlan: CarePlan = {
  id: "plan-recovery",
  goal: "Improve recovery & sleep quality",
  focusTitle: "Improve Recovery",
  focusLine:
    "Your recovery is likely to improve if you sleep before 10:45 PM tonight.",
  score: 68,
  day: 12,
  totalDays: 30,
  streak: 7,
  reasoning:
    "Your recovery has decreased for three days because sleep quality dropped. Today's plan focuses on improving sleep before increasing activity.",
  adjustment:
    "My Twin lowered today's training load by 20% — your HRV is 11ms below your 30-day baseline.",
  tasks: [
    { id: "t1", title: "20 minute easy walk", minutes: 20, category: "movement", reminder: "5:30 PM", done: true, why: "Zone-1 movement raises recovery without adding strain." },
    { id: "t2", title: "Drink 2L water", minutes: 1, category: "nutrition", done: false, why: "You averaged 1.3L last week — hydration lifts resting HR." },
    { id: "t3", title: "Hit 95g protein", minutes: 1, category: "nutrition", done: false, why: "Protein has trailed your target 4 of 7 days." },
    { id: "t4", title: "Take Vitamin D", minutes: 1, category: "medication", reminder: "9:00 AM", done: false, why: "Your last panel showed 22 ng/mL — below optimal." },
    { id: "t5", title: "Stretch for 5 minutes", minutes: 5, category: "recovery", done: false, why: "Evening mobility improved your deep sleep by 14 min." },
    { id: "t6", title: "Sleep before 10:45 PM", minutes: 0, category: "recovery", reminder: "10:15 PM", done: false, why: "Your best recovery days all began with a pre-11 PM bedtime." },
  ],
};

export type WeeklyMetric = {
  key: string;
  label: string;
  unit: string;
  data: number[];
  delta: number;
  color: string;
};

export const weeklyMetrics: WeeklyMetric[] = [
  { key: "recovery", label: "Recovery", unit: "", data: [72, 69, 64, 61, 63, 66, 68], delta: -4, color: "var(--teal)" },
  { key: "sleep", label: "Sleep", unit: "h", data: [7.4, 6.9, 6.2, 6.0, 6.6, 7.1, 7.3], delta: 0.4, color: "var(--blue)" },
  { key: "stress", label: "Stress", unit: "", data: [38, 44, 51, 55, 48, 42, 39], delta: -6, color: "var(--amber)" },
  { key: "activity", label: "Activity", unit: "k", data: [8.2, 6.1, 9.4, 5.5, 7.8, 10.2, 6.9], delta: 1.1, color: "var(--emerald)" },
  { key: "weight", label: "Weight", unit: "kg", data: [78.4, 78.2, 78.3, 78.0, 77.8, 77.7, 77.5], delta: -0.9, color: "var(--coral)" },
];

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  tone: "teal" | "blue" | "emerald" | "amber" | "coral";
};

export const recommendations: Recommendation[] = [
  { id: "r1", title: "Increase protein by 15g today", reason: "My Twin noticed your intake fell short on 4 of the last 7 days.", tone: "emerald" },
  { id: "r2", title: "Move bedtime 20 minutes earlier", reason: "Based on the last 30 days, this is your strongest recovery lever.", tone: "blue" },
  { id: "r3", title: "Skip caffeine after 4 PM", reason: "Late caffeine days cut your deep sleep by 22 minutes on average.", tone: "amber" },
  { id: "r4", title: "Your resting HR is improving", reason: "Down 3 bpm over 30 days — keep the evening walks going.", tone: "teal" },
  { id: "r5", title: "Drink more water before lunch", reason: "Predicted afternoon fatigue risk is elevated on low-hydration days.", tone: "coral" },
];

export type Program = {
  key: string;
  label: string;
  tagline: string;
  icon: string;
  weeks: number;
  twinNote: string;
};

export const programs: Program[] = [
  { key: "weight-loss", label: "Weight Loss", tagline: "Sustainable fat loss", icon: "trending-down", weeks: 12, twinNote: "Your weight trend is already -0.9kg this week." },
  { key: "muscle-gain", label: "Muscle Gain", tagline: "Strength & lean mass", icon: "dumbbell", weeks: 16, twinNote: "Protein intake is your main gap." },
  { key: "healthy-ageing", label: "Healthy Ageing", tagline: "Lower your health age", icon: "leaf", weeks: 24, twinNote: "Health age 34 vs actual 38." },
  { key: "heart-health", label: "Heart Health", tagline: "BP, lipids & cardio fitness", icon: "heart", weeks: 12, twinNote: "Resting HR improving for 30 days." },
  { key: "diabetes", label: "Diabetes", tagline: "Glucose stability", icon: "droplet", weeks: 20, twinNote: "HbA1c 5.7 — early prevention window." },
  { key: "hypertension", label: "Hypertension", tagline: "Bring BP into range", icon: "gauge", weeks: 12, twinNote: "Evening readings run 8 points high." },
  { key: "stress-recovery", label: "Stress Recovery", tagline: "Calm the nervous system", icon: "brain", weeks: 8, twinNote: "Weekday stress spikes detected." },
  { key: "sleep", label: "Sleep Improvement", tagline: "Deeper, earlier sleep", icon: "moon", weeks: 6, twinNote: "Bedtime varies by 82 minutes." },
  { key: "womens-health", label: "Women's Health", tagline: "Cycle-aware guidance", icon: "flower", weeks: 12, twinNote: "Syncs plans to cycle phase." },
  { key: "senior-care", label: "Senior Care", tagline: "Mobility, meds & safety", icon: "hand-heart", weeks: 24, twinNote: "Shareable with your Family Circle." },
];

export const streakMilestones = [
  "7 Day Care Streak",
  "Recovery improving",
  "5 consecutive sleep goals achieved",
];
