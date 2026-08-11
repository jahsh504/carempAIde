export const user = {
  firstName: "Aarav",
  lastName: "Mehta",
  age: 38,
  biologicalAge: 34,
  avatarInitials: "AM",
  location: "Bengaluru, IN",
  plan: "Premium",
};

export const scores = {
  overall: 82,
  overallTrend: +3,
  recovery: 76,
  recoveryTrend: +5,
  twinHealth: 84,
  twinConfidence: 78,
  state: "Recovering" as const,
};

export type VitalKey = "heart-rate" | "blood-pressure" | "sleep" | "activity" | "spo2" | "glucose";
export type Status = "good" | "caution" | "alert";

export const vitals: Record<
  VitalKey,
  {
    key: VitalKey;
    label: string;
    value: string;
    unit: string;
    status: Status;
    trend: number;
    series: number[];
    context: string;
  }
> = {
  "heart-rate": {
    key: "heart-rate",
    label: "Resting Heart Rate",
    value: "68",
    unit: "bpm",
    status: "good",
    trend: -4,
    series: [72, 71, 73, 70, 69, 70, 68],
    context: "Down 4 bpm week over week",
  },
  "blood-pressure": {
    key: "blood-pressure",
    label: "Blood Pressure",
    value: "118/76",
    unit: "mmHg",
    status: "good",
    trend: -2,
    series: [124, 122, 120, 121, 119, 118, 118],
    context: "Within your target range",
  },
  sleep: {
    key: "sleep",
    label: "Sleep",
    value: "7h 32m",
    unit: "",
    status: "good",
    trend: +12,
    series: [6.2, 7.1, 6.8, 7.5, 7.2, 7.8, 7.5],
    context: "Deep sleep up 12% this week",
  },
  activity: {
    key: "activity",
    label: "Activity",
    value: "8,240",
    unit: "steps",
    status: "caution",
    trend: -8,
    series: [9100, 8800, 9400, 7800, 8600, 8000, 8240],
    context: "Below your 10k daily goal",
  },
  spo2: {
    key: "spo2",
    label: "Blood Oxygen",
    value: "98",
    unit: "%",
    status: "good",
    trend: 0,
    series: [98, 97, 98, 98, 99, 98, 98],
    context: "Stable overnight",
  },
  glucose: {
    key: "glucose",
    label: "Glucose",
    value: "108",
    unit: "mg/dL",
    status: "good",
    trend: -3,
    series: [116, 121, 109, 132, 104, 112, 108],
    context: "Stable · updated 10 mins ago",
  },
};

export const cgm = {
  connected: true,
  source: "careMP CGM",
  updated: "10 mins ago",
  trend: "steady" as "rising" | "steady" | "falling",
  timeInRange: 86,
  daily: [102, 98, 112, 141, 126, 109, 104, 118, 133, 121, 110, 108],
  dailyLabels: ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "Now"],
};

export const vitalsList = Object.values(vitals);

export const insight = {
  headline: "Your resting heart rate dropped 4 bpm this week — sleep consistency is paying off.",
  why: "Over the last 7 nights you fell asleep within 22 minutes of a consistent bedtime, and deep sleep averaged 1h 42m. This has correlated with lower morning resting heart rate and steadier HRV. Keep protecting the window between 10:30 and 11:00 PM.",
};

export const mission = {
  title: "20 minute easy walk",
  why: "Post-meal walks improve glucose regulation and mid-afternoon focus.",
  minutes: 20,
};

export const medication = {
  name: "Atorvastatin",
  dose: "10 mg",
  time: "8:30 PM",
  streak: 12,
};

export const appointment = {
  doctor: "Dr. Nadia Rahman",
  specialty: "Cardiology",
  when: "Thursday, 3:30 PM",
  location: "Manipal Health, Whitefield",
};

export const alerts: { id: string; kind: Status; title: string; time: string }[] = [];

export const weeklyTrend = [64, 68, 72, 70, 75, 78, 82];

export const bodySystems = [
  {
    key: "cardiovascular",
    label: "Cardiovascular",
    score: 88,
    status: "good",
    trend: +3,
    note: "Resting HR trending down",
  },
  {
    key: "respiratory",
    label: "Respiratory",
    score: 92,
    status: "good",
    trend: +1,
    note: "SpO2 stable, VO2 improving",
  },
  {
    key: "mental",
    label: "Mental Wellness",
    score: 74,
    status: "caution",
    trend: -2,
    note: "Stress spikes on weekdays",
  },
  {
    key: "activity",
    label: "Activity & Mobility",
    score: 79,
    status: "good",
    trend: +4,
    note: "Consistent movement",
  },
  {
    key: "recovery",
    label: "Recovery",
    score: 76,
    status: "good",
    trend: +5,
    note: "HRV improving overnight",
  },
  {
    key: "glucose",
    label: "Glucose",
    score: 86,
    status: "good",
    trend: +2,
    note: "86% time in range today",
  },
] as const;

export const twinSummary =
  "I've noticed you sleep best when you finish dinner before 8 PM — your recovery jumps 14% on those nights. On days you skip your afternoon walk, your evening heart rate stays elevated. You're improving steadily, and your cardiovascular system is your strongest signal right now.";

export const twinChanges = [
  { label: "Sleep", delta: "+12%", tone: "good" as const },
  { label: "Stress", delta: "-18%", tone: "good" as const },
  { label: "Resting HR", delta: "-4 bpm", tone: "good" as const },
  { label: "Steps", delta: "-8%", tone: "caution" as const },
  { label: "Deep Sleep", delta: "+9%", tone: "good" as const },
];

export const healthMemory = [
  { date: "Mar 2022", title: "Started at Cult.Fit", icon: "dumbbell" },
  { date: "Nov 2022", title: "Lost 10 kg", icon: "trending-down" },
  { date: "Apr 2023", title: "Blood pressure improved to 118/76", icon: "heart" },
  { date: "Jul 2023", title: "Recovered from viral fever", icon: "leaf" },
  { date: "Jan 2024", title: "Started Atorvastatin 10 mg", icon: "pill" },
  { date: "Sep 2024", title: "Completed annual checkup", icon: "check-circle" },
];

export const dataSources = [
  { label: "careMP Band (7 days)", pct: 95 },
  { label: "Sleep tracker", pct: 88 },
  { label: "Lab results (3 months)", pct: 72 },
  { label: "Symptom logs", pct: 54 },
  { label: "Nutrition tracking", pct: 41 },
];

export const family = [
  {
    id: "meera",
    name: "Meera Mehta",
    relation: "Mother",
    age: 66,
    score: 71,
    status: "caution" as Status,
    avatar: "MM",
    note: "BP slightly elevated today",
  },
  {
    id: "raghav",
    name: "Raghav Mehta",
    relation: "Father",
    age: 70,
    score: 78,
    status: "good" as Status,
    avatar: "RM",
    note: "Steady this week",
  },
  {
    id: "priya",
    name: "Priya Mehta",
    relation: "Spouse",
    age: 36,
    score: 86,
    status: "good" as Status,
    avatar: "PM",
    note: "Recovery trending up",
  },
  {
    id: "kiaan",
    name: "Kiaan Mehta",
    relation: "Son (8)",
    age: 8,
    score: 92,
    status: "good" as Status,
    avatar: "KM",
    note: "All vitals normal",
  },
];

export const supportCategories = [
  { key: "doctor", label: "Doctor Consultation", icon: "stethoscope", eta: "In 20 min", from: 499 },
  { key: "nurse", label: "Home Nurse", icon: "heart-pulse", eta: "In 45 min", from: 899 },
  { key: "physio", label: "Physiotherapist", icon: "activity", eta: "Same day", from: 799 },
  { key: "caregiver", label: "Caregiver", icon: "hand-heart", eta: "Tomorrow", from: 1200 },
  { key: "lab", label: "Lab Sample Collection", icon: "test-tube", eta: "In 30 min", from: 199 },
  { key: "pharmacy", label: "Medicine Delivery", icon: "pill", eta: "In 60 min", from: 0 },
  { key: "ambulance", label: "Ambulance", icon: "siren", eta: "In 12 min", from: 1499 },
];

export const providers = [
  {
    id: "p1",
    name: "Dr. Ananya Iyer",
    credential: "MBBS, MD (Internal Medicine)",
    rating: 4.9,
    reviews: 1284,
    distance: "1.2 km",
    eta: "15 min",
    price: 599,
    available: true,
    category: "doctor",
  },
  {
    id: "p2",
    name: "Dr. Karthik Rao",
    credential: "MBBS, DNB Cardiology",
    rating: 4.8,
    reviews: 942,
    distance: "2.4 km",
    eta: "22 min",
    price: 899,
    available: true,
    category: "doctor",
  },
  {
    id: "p3",
    name: "Sister Fatima N.",
    credential: "RN, 8 yrs home care",
    rating: 4.9,
    reviews: 512,
    distance: "3.1 km",
    eta: "40 min",
    price: 999,
    available: true,
    category: "nurse",
  },
  {
    id: "p4",
    name: "Rohan Physio Studio",
    credential: "MPT, Sports Rehab",
    rating: 4.7,
    reviews: 318,
    distance: "1.9 km",
    eta: "Same day",
    price: 799,
    available: true,
    category: "physio",
  },
  {
    id: "p5",
    name: "PathLabs Home Draw",
    credential: "NABL accredited",
    rating: 4.8,
    reviews: 2210,
    distance: "—",
    eta: "30 min",
    price: 249,
    available: true,
    category: "lab",
  },
];

export const reports = [
  { id: "r1", title: "Complete Blood Count", lab: "PathLabs", date: "Sep 12, 2025", flagged: 1 },
  { id: "r2", title: "Lipid Profile", lab: "PathLabs", date: "Sep 12, 2025", flagged: 2 },
  { id: "r3", title: "HbA1c", lab: "Metropolis", date: "Aug 02, 2025", flagged: 0 },
  { id: "r4", title: "Vitamin D, B12", lab: "Thyrocare", date: "Jun 18, 2025", flagged: 1 },
];

export const reportDetail = {
  id: "r2",
  title: "Lipid Profile",
  lab: "PathLabs · Sep 12, 2025",
  values: [
    {
      label: "Total Cholesterol",
      value: 214,
      unit: "mg/dL",
      range: [0, 200] as [number, number],
      flag: "high" as const,
    },
    {
      label: "LDL",
      value: 138,
      unit: "mg/dL",
      range: [0, 130] as [number, number],
      flag: "high" as const,
    },
    {
      label: "HDL",
      value: 52,
      unit: "mg/dL",
      range: [40, 60] as [number, number],
      flag: "ok" as const,
    },
    {
      label: "Triglycerides",
      value: 118,
      unit: "mg/dL",
      range: [0, 150] as [number, number],
      flag: "ok" as const,
    },
  ],
  summary:
    "Your LDL is mildly elevated. Combined with your current Atorvastatin regimen, this is trending in the right direction from your March reading of 156 mg/dL. Continue medication and revisit in 3 months.",
};

export const notifications = [
  {
    group: "Health Alerts",
    items: [
      {
        title: "Elevated evening heart rate detected",
        time: "2h ago",
        unread: true,
        tone: "caution" as Status,
      },
      {
        title: "Geofence Alert — Patient approaching restricted kitchen area",
        time: "Just now",
        unread: true,
        tone: "alert" as Status,
      },
      {
        title: "Geofence Alert — Mary exited the garden boundary",
        time: "10 mins ago",
        unread: true,
        tone: "caution" as Status,
      },
      {
        title: "Sleep debt cleared this week",
        time: "Yesterday",
        unread: false,
        tone: "good" as Status,
      },
    ],
  },
  {
    group: "Medication",
    items: [
      {
        title: "Atorvastatin 10 mg — 8:30 PM",
        time: "In 3h",
        unread: true,
        tone: "good" as Status,
      },
    ],
  },
  {
    group: "Appointments",
    items: [
      {
        title: "Dr. Nadia Rahman — Thursday 3:30 PM",
        time: "In 2 days",
        unread: false,
        tone: "good" as Status,
      },
    ],
  },
  {
    group: "Family",
    items: [
      {
        title: "Meera's blood pressure is slightly elevated",
        time: "1h ago",
        unread: true,
        tone: "caution" as Status,
      },
      {
        title: "Priya completed her morning run",
        time: "5h ago",
        unread: false,
        tone: "good" as Status,
      },
    ],
  },
  {
    group: "Care Team",
    items: [
      {
        title: "Priya checked in for today's visit",
        time: "10:02 AM",
        unread: true,
        tone: "good" as Status,
      },
      {
        title: "Caregiver arriving in 15 minutes",
        time: "9:45 AM",
        unread: false,
        tone: "good" as Status,
      },
      {
        title: "Priya started her journey to you",
        time: "9:05 AM",
        unread: false,
        tone: "good" as Status,
      },
      {
        title: "New caregiver note available",
        time: "Yesterday",
        unread: false,
        tone: "good" as Status,
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        title: "careMP Band synced 240 new data points",
        time: "8h ago",
        unread: false,
        tone: "good" as Status,
      },
    ],
  },
];

export const chatSeed = [
  {
    role: "ai" as const,
    text: "Good morning, Aarav. Your recovery is up 5 points overnight — a great day to push activity a bit.",
  },
  { role: "user" as const, text: "Why is my resting heart rate lower this week?" },
  {
    role: "ai" as const,
    text: "Two things stand out: your sleep midpoint has been within a 20-minute window, and you cut evening caffeine on 5 of 7 days. Both correlate strongly with your lower morning HR.",
    rich: "hr-explainer" as const,
  },
];

export const suggestedQuestions = [
  "Explain my latest lipid report",
  "Am I sleeping well enough?",
  "What should I eat today?",
  "Is my blood pressure normal for my age?",
];

export const goals = [
  "Sleep better",
  "Lower stress",
  "Improve heart health",
  "Manage weight",
  "Recover from illness",
  "Stay active longer",
  "Support my family's health",
  "Manage a chronic condition",
];

export const wearables = [
  { name: "careMP Band", status: "Connected", detail: "Paired · Synced 8m ago · Battery 84%" },
];

// Per-member detail for the Family Member Details screen
export type FamilyDetail = {
  statusLabel: string;
  todayStatus: string;
  recovery: number;
  sleep: string;
  steps: string;
  twinSummary: string;
  trends: { key: string; label: string; delta: number; caption: string; metric: VitalKey }[];
  events: { when: string; text: string }[];
  insight: string;
};

export const familyDetails: Record<string, FamilyDetail> = {
  meera: {
    statusLabel: "Needs attention",
    todayStatus: "Blood pressure slightly elevated.",
    recovery: 71,
    sleep: "6h 40m",
    steps: "3,120",
    twinSummary:
      "Based on the last few weeks, her health twin suggests taking today gently — rest and hydration matter more than activity.",
    trends: [
      { key: "recovery", label: "Recovery", delta: -2, caption: "Slight decline", metric: "sleep" },
      { key: "sleep", label: "Sleep", delta: 0, caption: "Stable", metric: "sleep" },
      {
        key: "heart",
        label: "Heart health",
        delta: -3,
        caption: "Slight decline",
        metric: "blood-pressure",
      },
    ],
    events: [
      { when: "Today", text: "Blood pressure slightly elevated" },
      { when: "Today", text: "Amlodipine taken at 8:15 AM" },
      { when: "Yesterday", text: "Evening walk, 32 min" },
      { when: "Yesterday", text: "Sleep goal missed by 40 min" },
    ],
    insight: "A short walk after dinner has helped her readings settle on similar days.",
  },
  raghav: {
    statusLabel: "Good",
    todayStatus: "Everything looks normal today.",
    recovery: 78,
    sleep: "7h 10m",
    steps: "5,480",
    twinSummary:
      "Based on the last few weeks, his health twin thinks today is a good day for a longer walk.",
    trends: [
      { key: "recovery", label: "Recovery", delta: 3, caption: "Improving", metric: "sleep" },
      { key: "sleep", label: "Sleep", delta: 0, caption: "Stable", metric: "sleep" },
      { key: "heart", label: "Heart health", delta: 2, caption: "Improving", metric: "heart-rate" },
    ],
    events: [
      { when: "Today", text: "Metformin dose completed" },
      { when: "Today", text: "Walked 3.4 km" },
      { when: "Yesterday", text: "Completed sleep goal" },
      { when: "Yesterday", text: "Recovery improved" },
    ],
    insight: "His sleep has been steady for six nights — recovery usually follows within a week.",
  },
  priya: {
    statusLabel: "Good",
    todayStatus: "Everything looks normal today.",
    recovery: 86,
    sleep: "7h 45m",
    steps: "8,240",
    twinSummary:
      "Based on the last few weeks, her health twin thinks today is a good recovery day.",
    trends: [
      { key: "recovery", label: "Recovery", delta: 6, caption: "Improving", metric: "sleep" },
      { key: "sleep", label: "Sleep", delta: 4, caption: "Improving", metric: "sleep" },
      { key: "heart", label: "Heart health", delta: 0, caption: "Stable", metric: "heart-rate" },
    ],
    events: [
      { when: "Today", text: "Completed sleep goal" },
      { when: "Today", text: "Morning run, 4.1 km" },
      { when: "Yesterday", text: "Walked 5.2 km" },
      { when: "Yesterday", text: "Recovery improved" },
    ],
    insight: "Her sleep has improved for four consecutive nights.",
  },
  kiaan: {
    statusLabel: "Good",
    todayStatus: "Everything looks normal today.",
    recovery: 92,
    sleep: "9h 05m",
    steps: "6,842",
    twinSummary:
      "Based on the last few weeks, his health twin sees a steady, healthy rhythm — nothing to worry about.",
    trends: [
      { key: "recovery", label: "Recovery", delta: 2, caption: "Improving", metric: "sleep" },
      { key: "sleep", label: "Sleep", delta: 0, caption: "Stable", metric: "sleep" },
      { key: "heart", label: "Heart health", delta: 0, caption: "Stable", metric: "heart-rate" },
    ],
    events: [
      { when: "Today", text: "Completed sleep goal" },
      { when: "Today", text: "Active play, 48 min" },
      { when: "Yesterday", text: "Walked 2.6 km" },
      { when: "Yesterday", text: "Recovery improved" },
    ],
    insight: "Bedtime has been consistent all week — that's driving his high recovery.",
  },
};
