import { useSyncExternalStore } from "react";
import { markMedicationTaken, addEventTimelineItem } from "@/data/wellness-timeline";

export type FoodRule = "Before food" | "After food" | "With food" | "Anytime";

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  minutesFromNow: number;
  food: FoodRule;
  when: string;
  taken: boolean;
};

export type Inventory = {
  id: string;
  name: string;
  strength: string;
  form: string;
  frequency: string;
  remaining: number;
  capacity: number;
  perDay: number;
  finishBy: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  doctor: string;
  dueInDays: number;
  dueDate: string;
  lastReview: string;
  note: string;
};

let schedule: Medication[] = [
  { id: "m1", name: "Metformin", dosage: "1 tablet", time: "8:00 AM", minutesFromNow: -240, food: "After food", when: "After breakfast", taken: true },
  { id: "m2", name: "Vitamin D3", dosage: "1 capsule", time: "12:30 PM", minutesFromNow: -30, food: "After food", when: "After lunch", taken: true },
  { id: "m3", name: "Atorvastatin", dosage: "10 mg", time: "2:30 PM", minutesFromNow: 85, food: "After food", when: "Afternoon", taken: false },
  { id: "m4", name: "Amlodipine", dosage: "5 mg", time: "6:00 PM", minutesFromNow: 295, food: "Before food", when: "Before dinner", taken: false },
  { id: "m5", name: "Omega-3", dosage: "1 capsule", time: "9:00 PM", minutesFromNow: 475, food: "After food", when: "After dinner", taken: true },
];

let inventory: Inventory[] = [
  { id: "m1", name: "Metformin", strength: "500 mg", form: "1 Tablet", frequency: "Twice daily", remaining: 12, capacity: 60, perDay: 2, finishBy: "24 Aug 2026" },
  { id: "m3", name: "Atorvastatin", strength: "10 mg", form: "1 Tablet", frequency: "Once daily", remaining: 6, capacity: 30, perDay: 1, finishBy: "18 Aug 2026" },
  { id: "m4", name: "Amlodipine", strength: "5 mg", form: "1 Tablet", frequency: "Once daily", remaining: 28, capacity: 30, perDay: 1, finishBy: "9 Sep 2026" },
  { id: "m5", name: "Omega-3", strength: "1000 mg", form: "1 Capsule", frequency: "Once daily", remaining: 40, capacity: 60, perDay: 1, finishBy: "21 Sep 2026" },
];

export const reviews: ReviewItem[] = [
  { id: "m4", name: "Blood Pressure Medication", doctor: "Dr. Vikram Sethi", dueInDays: 3, dueDate: "15 Aug 2026", lastReview: "15 Feb 2026", note: "Blood pressure log to be shared beforehand." },
  { id: "m1", name: "Metformin", doctor: "Dr. Nadia Rahman", dueInDays: 14, dueDate: "21 Aug 2026", lastReview: "21 Feb 2026", note: "Six-month dose review with fasting glucose panel." },
  { id: "m3", name: "Atorvastatin", doctor: "Dr. Nadia Rahman", dueInDays: 31, dueDate: "7 Sep 2026", lastReview: "7 Mar 2026", note: "Lipid profile before the next review." },
];

export const adherence = 82;

export const historyByRange = {
  day: [
    { label: "Today", entries: [
      { time: "8:00 AM", name: "Metformin", done: true },
      { time: "12:30 PM", name: "Vitamin D3", done: true },
      { time: "2:30 PM", name: "Atorvastatin", done: false },
      { time: "6:00 PM", name: "Amlodipine", done: false },
      { time: "9:00 PM", name: "Omega-3", done: true },
    ] },
  ],
  week: [
    { label: "Yesterday", entries: [
      { time: "8:00 AM", name: "Metformin", done: true },
      { time: "12:30 PM", name: "Vitamin D3", done: true },
      { time: "9:00 PM", name: "Omega-3", done: false },
    ] },
    { label: "Wednesday", entries: [
      { time: "8:00 AM", name: "Metformin", done: true },
      { time: "2:30 PM", name: "Atorvastatin", done: true },
      { time: "6:00 PM", name: "Amlodipine", done: true },
    ] },
    { label: "Tuesday", entries: [
      { time: "8:00 AM", name: "Metformin", done: true },
      { time: "12:30 PM", name: "Vitamin D3", done: false },
      { time: "9:00 PM", name: "Omega-3", done: true },
    ] },
  ],
  month: [
    { label: "This week", entries: [
      { time: "34 of 35 doses", name: "All medications", done: true },
      { time: "Missed 1", name: "Vitamin D3 · Tuesday", done: false },
    ] },
    { label: "Last week", entries: [
      { time: "31 of 35 doses", name: "All medications", done: true },
      { time: "Missed 4", name: "Evening doses", done: false },
    ] },
    { label: "Two weeks ago", entries: [
      { time: "35 of 35 doses", name: "All medications", done: true },
    ] },
  ],
} as const;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function getSchedule() { return schedule; }
export function getInventory() { return inventory; }

export function toggleMedication(id: string) {
  const target = schedule.find((m) => m.id === id);
  const willBeTaken = target ? !target.taken : false;
  schedule = schedule.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m));
  if (willBeTaken && target) {
    markMedicationTaken(`${target.name} (${target.dosage})`);
  }
  emit();
}

export function takeMedication(id: string) {
  const target = schedule.find((m) => m.id === id);
  schedule = schedule.map((m) => (m.id === id ? { ...m, taken: true } : m));
  if (target) {
    markMedicationTaken(`${target.name} (${target.dosage})`);
  }
  emit();
}

export function addMedication(m: Omit<Medication, "id" | "taken" | "minutesFromNow">) {
  const newMed: Medication = { ...m, id: `m${Date.now()}`, taken: false, minutesFromNow: 600 };
  schedule = [...schedule, newMed];
  
  // 1. Log to Daily Timeline
  markMedicationTaken(`Started ${m.name} (${m.dosage})`);

  // 2. Log to Event Timeline
  const todayStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const isoDate = new Date().toISOString().split("T")[0];
  addEventTimelineItem({
    title: `${m.name} (${m.dosage}) started`,
    category: "medication",
    date: todayStr,
    timestamp: isoDate,
    source: "User",
    context: `New medication added to daily schedule: ${m.dosage}, ${m.when} (${m.food}).`,
    icon: "pill",
    beforeAfterComparison: {
      periodBefore: "Baseline prior to starting",
      periodAfter: "Regimen active",
      metrics: [
        { label: "Adherence Target", before: "Pending", after: "100% Scheduled", change: "Active", trend: "positive" },
        { label: "Daily Doses", before: "0", after: m.dosage, change: "+1 regimen", trend: "positive" },
      ],
      summary: `You started taking ${m.name} (${m.dosage}) on ${todayStr}. Schedule: ${m.when} (${m.food}).`,
    },
  });

  emit();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Demo "today" for the static prototype.
const TODAY = new Date(2026, 7, 7);

export function daysLeft(i: Inventory) {
  return Math.max(0, Math.floor(i.remaining / Math.max(1, i.perDay)));
}

export function finishDate(i: Inventory) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + daysLeft(i));
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function refill(id: string, tablets: number) {
  inventory = inventory.map((i) => {
    if (i.id !== id) return i;
    const remaining = i.remaining + tablets;
    const next = { ...i, remaining, capacity: Math.max(i.capacity, remaining) };
    return { ...next, finishBy: finishDate(next) };
  });
  emit();
}

export const smartReminder = {
  usualTime: "8:18 AM",
  note: "You usually take your morning medication around 8:18 AM. Preparing reminders accordingly.",
  forgetRate: 8,
  forgetLabel: "Low",
  forgetNote: "You're doing great.",
  timeline: [
    { time: "8:00 AM", label: "Initial", sent: true },
    { time: "8:10 AM", label: "Gentle", sent: true },
    { time: "8:20 AM", label: "Persistent", sent: false },
    { time: "8:30 AM", label: "Nudge", sent: false },
  ],
};

export type Course = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  totalDays: number;
  currentDay: number;
};

export const courses: Course[] = [
  { id: "c1", name: "Amoxicillin", dosage: "500 mg · 3 times daily", duration: "7 day course", totalDays: 7, currentDay: 5 },
  { id: "c2", name: "Vitamin B12", dosage: "1500 mcg · Once daily", duration: "10 day course", totalDays: 10, currentDay: 3 },
  { id: "c3", name: "Azithromycin", dosage: "250 mg · Once daily", duration: "5 day course", totalDays: 5, currentDay: 5 },
];

export type PastMedication = {
  id: string;
  name: string;
  dosage: string;
  whenTaken: string;
  courseDuration?: string;
  status: "Completed course" | "Discontinued";
};

export const pastMedications: PastMedication[] = [
  { id: "p1", name: "Amoxicillin 500mg", dosage: "1 capsule · 3 times daily", whenTaken: "1 Jul 2026 - 7 Jul 2026", courseDuration: "7 day course", status: "Completed course" },
  { id: "p2", name: "Prednisone 10mg", dosage: "1 tablet · Once daily", whenTaken: "15 May 2026 - 29 May 2026", courseDuration: "14 day course", status: "Discontinued" },
  { id: "p3", name: "Ciprofloxacin 250mg", dosage: "1 tablet · Twice daily", whenTaken: "10 Mar 2026 - 17 Mar 2026", courseDuration: "7 day course", status: "Completed course" },
];


export function useSchedule() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => schedule,
    () => schedule
  );
}

export function useInventory() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => inventory,
    () => inventory
  );
}

export function formatRemaining(minutes: number) {
  if (minutes <= 0) return "Due now";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `In ${h} hr ${m} mins` : `In ${m} mins`;
}

export const todayLabel = "Friday, 7 August";
