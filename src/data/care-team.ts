// Care Team module — resident-facing view of caregivers from the Caregiver App.
// Mock data only; shaped so each block can be swapped for a live API.

export type JourneyState =
  | "assigned"
  | "traveling"
  | "arrived"
  | "checked-in"
  | "in-visit"
  | "completed";

export const journeyOrder: JourneyState[] = [
  "assigned",
  "traveling",
  "arrived",
  "checked-in",
  "in-visit",
  "completed",
];

export type JourneyCopy = {
  badge: string;
  title: string;
  line: string;
  detailLabel?: string;
  detailValue?: string;
  progress: number; // 0-100
  tone: "muted" | "blue" | "amber" | "emerald";
};

export const journeyCopy: Record<JourneyState, JourneyCopy> = {
  assigned: {
    badge: "Assigned",
    title: "Waiting to begin journey",
    line: "Priya is assigned to today's visit and will set off shortly.",
    progress: 8,
    tone: "muted",
  },
  traveling: {
    badge: "On the way",
    title: "Priya is travelling to you",
    line: "Last updated 2 min ago",
    detailLabel: "Estimated arrival",
    detailValue: "14 minutes",
    progress: 42,
    tone: "blue",
  },
  arrived: {
    badge: "Arrived",
    title: "Outside your home",
    line: "Waiting for check-in",
    detailLabel: "Arrived at",
    detailValue: "9:58 AM",
    progress: 68,
    tone: "amber",
  },
  "checked-in": {
    badge: "Checked in",
    title: "Today's visit has started",
    line: "Check-in was completed using secure verification.",
    detailLabel: "Checked in",
    detailValue: "10:02 AM",
    progress: 82,
    tone: "emerald",
  },
  "in-visit": {
    badge: "Visit in progress",
    title: "Care is underway",
    line: "Priya is working through today's planned care.",
    detailLabel: "Started at",
    detailValue: "10:02 AM",
    progress: 92,
    tone: "emerald",
  },
  completed: {
    badge: "Completed",
    title: "Today's care completed successfully",
    line: "Priya finished the visit and left a note for you.",
    detailLabel: "Completed",
    detailValue: "11:45 AM",
    progress: 100,
    tone: "emerald",
  },
};

export type Caregiver = {
  id: string;
  name: string;
  initials: string;
  role: string;
  shift: string;
  availableUntil: string;
  online: boolean;
  experience: string;
  languages: string[];
  specialties: string[];
  tone: "teal" | "blue" | "emerald" | "amber";
};

export const primaryCaregiver: Caregiver = {
  id: "priya-nair",
  name: "Priya Nair",
  initials: "PN",
  role: "Primary Caregiver",
  shift: "On Morning Shift",
  availableUntil: "Available until 2:00 PM",
  online: true,
  experience: "8 years",
  languages: ["English", "Hindi", "Malayalam"],
  specialties: ["Elder care", "Post-surgery recovery", "Medication management"],
  tone: "teal",
};

export const caregivers: Caregiver[] = [
  primaryCaregiver,
  {
    id: "ravi-desai",
    name: "Ravi Desai",
    initials: "RD",
    role: "Evening Caregiver",
    shift: "Evening Shift · 4:00 – 9:00 PM",
    availableUntil: "Starts at 4:00 PM",
    online: false,
    experience: "5 years",
    languages: ["English", "Gujarati", "Hindi"],
    specialties: ["Mobility support", "Vitals monitoring"],
    tone: "blue",
  },
  {
    id: "anita-george",
    name: "Anita George",
    initials: "AG",
    role: "Physiotherapy Assistant",
    shift: "Tue & Fri · 11:00 AM",
    availableUntil: "Next visit Friday",
    online: false,
    experience: "11 years",
    languages: ["English", "Tamil"],
    specialties: ["Gait training", "Strength & balance"],
    tone: "emerald",
  },
  {
    id: "sana-kapoor",
    name: "Sana Kapoor",
    initials: "SK",
    role: "Weekend Relief Caregiver",
    shift: "Sat & Sun · 9:00 AM – 6:00 PM",
    availableUntil: "Available Saturday",
    online: false,
    experience: "3 years",
    languages: ["English", "Hindi", "Punjabi"],
    specialties: ["Companionship", "Meal preparation"],
    tone: "amber",
  },
];

export type CareItem = { id: string; title: string; time: string; done: boolean };

export const todaysCare: CareItem[] = [
  { id: "c1", title: "Morning medication", time: "9:55 AM", done: true },
  { id: "c2", title: "Blood pressure", time: "10:14 AM", done: true },
  { id: "c3", title: "Afternoon walk", time: "1:00 PM", done: false },
  { id: "c4", title: "Hydration check", time: "Through the day", done: false },
  { id: "c5", title: "Evening medication", time: "8:30 PM", done: false },
];

export type ActivityEntry = { time: string; text: string; day: "Today" | "Yesterday" };

export const recentActivity: ActivityEntry[] = [
  { time: "10:14", text: "Blood pressure checked", day: "Today" },
  { time: "9:55", text: "Medication completed", day: "Today" },
  { time: "9:40", text: "Caregiver checked in", day: "Today" },
  { time: "9:31", text: "Caregiver arrived", day: "Today" },
  { time: "9:05", text: "Caregiver started journey", day: "Today" },
  { time: "8:35 PM", text: "Evening medication completed", day: "Yesterday" },
];

export const careTeamSummary =
  "Today's visit is progressing well. Priya completed all morning tasks on time, and your recovery remains stable.";

export const caregiverNote =
  "Blood pressure read 124/78 — steady since Monday. Encouraged an extra glass of water before the afternoon walk.";
