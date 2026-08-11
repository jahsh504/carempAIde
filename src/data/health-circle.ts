// Health Circle catalog — two sections, each service has its own accent and flow route.

export type Accent = "teal" | "blue" | "emerald" | "amber" | "coral" | "violet" | "rose";

export const accentClass: Record<
  Accent,
  { bg: string; text: string; ring: string; grad: string; soft: string }
> = {
  teal: {
    bg: "bg-teal",
    text: "text-teal",
    ring: "ring-teal/30",
    grad: "from-teal to-blue",
    soft: "bg-teal/10",
  },
  blue: {
    bg: "bg-blue",
    text: "text-blue",
    ring: "ring-blue/30",
    grad: "from-blue to-teal",
    soft: "bg-blue/10",
  },
  emerald: {
    bg: "bg-emerald",
    text: "text-emerald",
    ring: "ring-emerald/30",
    grad: "from-emerald to-teal",
    soft: "bg-emerald/10",
  },
  amber: {
    bg: "bg-amber",
    text: "text-amber",
    ring: "ring-amber/30",
    grad: "from-amber to-coral",
    soft: "bg-amber/15",
  },
  coral: {
    bg: "bg-coral",
    text: "text-coral",
    ring: "ring-coral/30",
    grad: "from-coral to-amber",
    soft: "bg-coral/10",
  },
  violet: {
    bg: "bg-[oklch(0.62_0.18_295)]",
    text: "text-[oklch(0.62_0.18_295)]",
    ring: "ring-[oklch(0.62_0.18_295)]/30",
    grad: "from-[oklch(0.62_0.18_295)] to-blue",
    soft: "bg-[oklch(0.62_0.18_295)]/10",
  },
  rose: {
    bg: "bg-[oklch(0.68_0.17_15)]",
    text: "text-[oklch(0.68_0.17_15)]",
    ring: "ring-[oklch(0.68_0.17_15)]/30",
    grad: "from-[oklch(0.68_0.17_15)] to-coral",
    soft: "bg-[oklch(0.68_0.17_15)]/10",
  },
};

export type OnlineService = "doctor" | "nutritionist" | "dietitian" | "counselor" | "coach";
export type OfflineService =
  "clinic" | "nurse" | "physio" | "caregiver" | "lab" | "pharmacy" | "ambulance";

export const onlineServices: {
  key: OnlineService;
  label: string;
  tagline: string;
  icon: string;
  accent: Accent;
  from: number;
  eta: string;
}[] = [
  {
    key: "doctor",
    label: "Doctor Video Consult",
    tagline: "General & specialist care, on video",
    icon: "video",
    accent: "teal",
    from: 499,
    eta: "In 15 min",
  },
  {
    key: "nutritionist",
    label: "Nutritionist",
    tagline: "Personalised plans from your labs",
    icon: "apple",
    accent: "emerald",
    from: 399,
    eta: "Today",
  },
  {
    key: "dietitian",
    label: "Dietitian",
    tagline: "Structured diets for conditions",
    icon: "salad",
    accent: "amber",
    from: 449,
    eta: "Today",
  },
  {
    key: "counselor",
    label: "Mental Health Counselor",
    tagline: "Confidential therapy sessions",
    icon: "brain",
    accent: "violet",
    from: 799,
    eta: "Today",
  },
  {
    key: "coach",
    label: "Wellness Coach",
    tagline: "Habits, sleep, stress, movement",
    icon: "sparkles",
    accent: "blue",
    from: 349,
    eta: "This week",
  },
];

export const offlineServices: {
  key: OfflineService;
  label: string;
  tagline: string;
  icon: string;
  accent: Accent;
  from: number;
  eta: string;
}[] = [
  {
    key: "clinic",
    label: "Clinic Appointment",
    tagline: "Book a slot near you",
    icon: "hospital",
    accent: "teal",
    from: 299,
    eta: "Today",
  },
  {
    key: "nurse",
    label: "Home Nurse",
    tagline: "Trained nurses at your door",
    icon: "heart-pulse",
    accent: "rose",
    from: 899,
    eta: "In 45 min",
  },
  {
    key: "physio",
    label: "Physiotherapist",
    tagline: "Recovery & mobility at home",
    icon: "activity",
    accent: "blue",
    from: 799,
    eta: "Same day",
  },
  {
    key: "caregiver",
    label: "Caregiver",
    tagline: "Long-term or short-term support",
    icon: "hand-heart",
    accent: "violet",
    from: 1200,
    eta: "Tomorrow",
  },
  {
    key: "lab",
    label: "Lab Sample Collection",
    tagline: "Home draw or centre visit",
    icon: "test-tube",
    accent: "emerald",
    from: 199,
    eta: "In 30 min",
  },
  {
    key: "pharmacy",
    label: "Medicine Delivery",
    tagline: "Prescriptions, tracked live",
    icon: "pill",
    accent: "amber",
    from: 0,
    eta: "In 60 min",
  },
  {
    key: "ambulance",
    label: "Ambulance",
    tagline: "One-tap dispatch, GPS-tracked",
    icon: "siren",
    accent: "coral",
    from: 1499,
    eta: "In 12 min",
  },
];

// Online providers per service
export const onlineProviders: Record<
  OnlineService,
  {
    id: string;
    name: string;
    credential: string;
    rating: number;
    reviews: number;
    nextSlot: string;
    price: number;
    languages: string;
    years: number;
  }[]
> = {
  doctor: [
    {
      id: "d1",
      name: "Dr. Ananya Iyer",
      credential: "MBBS, MD Internal Medicine",
      rating: 4.9,
      reviews: 1284,
      nextSlot: "Today 4:30 PM",
      price: 599,
      languages: "EN · HI · KN",
      years: 12,
    },
    {
      id: "d2",
      name: "Dr. Karthik Rao",
      credential: "MBBS, DNB Cardiology",
      rating: 4.8,
      reviews: 942,
      nextSlot: "Today 6:00 PM",
      price: 899,
      languages: "EN · HI · TA",
      years: 15,
    },
    {
      id: "d3",
      name: "Dr. Vikram Shah",
      credential: "MBBS, MD Family Medicine",
      rating: 4.7,
      reviews: 612,
      nextSlot: "Tomorrow 9:00 AM",
      price: 499,
      languages: "EN · HI · GU",
      years: 9,
    },
  ],
  nutritionist: [
    {
      id: "n1",
      name: "Ritika Malhotra",
      credential: "M.Sc Clinical Nutrition",
      rating: 4.9,
      reviews: 528,
      nextSlot: "Today 5:00 PM",
      price: 449,
      languages: "EN · HI",
      years: 8,
    },
    {
      id: "n2",
      name: "Aisha Kapoor",
      credential: "Registered Dietitian",
      rating: 4.8,
      reviews: 341,
      nextSlot: "Tomorrow 11:00 AM",
      price: 399,
      languages: "EN · HI",
      years: 6,
    },
  ],
  dietitian: [
    {
      id: "di1",
      name: "Sneha Reddy",
      credential: "PG Dip Dietetics, Diabetes",
      rating: 4.9,
      reviews: 402,
      nextSlot: "Today 7:00 PM",
      price: 499,
      languages: "EN · TE · HI",
      years: 10,
    },
    {
      id: "di2",
      name: "Anjali Menon",
      credential: "M.Sc Dietetics",
      rating: 4.7,
      reviews: 214,
      nextSlot: "Tomorrow 10:00 AM",
      price: 449,
      languages: "EN · ML",
      years: 7,
    },
  ],
  counselor: [
    {
      id: "c1",
      name: "Dr. Meera Sundaram",
      credential: "PsyD, Clinical Psychology",
      rating: 4.9,
      reviews: 683,
      nextSlot: "Today 8:00 PM",
      price: 999,
      languages: "EN · TA",
      years: 14,
    },
    {
      id: "c2",
      name: "Rahul Bose",
      credential: "M.Phil, CBT Therapist",
      rating: 4.8,
      reviews: 412,
      nextSlot: "Tomorrow 6:30 PM",
      price: 799,
      languages: "EN · HI · BN",
      years: 9,
    },
  ],
  coach: [
    {
      id: "co1",
      name: "Vivaan Sharma",
      credential: "Precision Nutrition L2",
      rating: 4.8,
      reviews: 289,
      nextSlot: "Today 6:00 PM",
      price: 349,
      languages: "EN · HI",
      years: 6,
    },
    {
      id: "co2",
      name: "Neha Iyer",
      credential: "Sleep & Habits Coach",
      rating: 4.9,
      reviews: 371,
      nextSlot: "Tomorrow 8:00 AM",
      price: 399,
      languages: "EN",
      years: 5,
    },
  ],
};

// Nearby clinics
export const clinics = [
  {
    id: "cl1",
    name: "Manipal Whitefield",
    specialty: "Multi-specialty",
    distance: "2.1 km",
    rating: 4.7,
    nextSlot: "Today 3:30 PM",
    fee: 600,
    address: "ITPL Main Rd, Whitefield",
  },
  {
    id: "cl2",
    name: "Cloudnine Bellandur",
    specialty: "Women & Child",
    distance: "3.4 km",
    rating: 4.8,
    nextSlot: "Today 5:00 PM",
    fee: 750,
    address: "Sarjapur Rd, Bellandur",
  },
  {
    id: "cl3",
    name: "Sakra World Hospital",
    specialty: "Cardiology",
    distance: "4.0 km",
    rating: 4.9,
    nextSlot: "Tomorrow 10:00 AM",
    fee: 900,
    address: "Marathahalli-Sarjapur ORR",
  },
  {
    id: "cl4",
    name: "Apollo Clinic ITPL",
    specialty: "General Physician",
    distance: "1.2 km",
    rating: 4.6,
    nextSlot: "Today 2:00 PM",
    fee: 450,
    address: "ITPL Rd, Whitefield",
  },
];

// Home care professionals per service (nurse/physio/caregiver)
export const homeProfessionals: Record<
  "nurse" | "physio" | "caregiver",
  {
    id: string;
    name: string;
    credential: string;
    rating: number;
    reviews: number;
    years: number;
    eta: string;
    price: number;
  }[]
> = {
  nurse: [
    {
      id: "hn1",
      name: "Sister Fatima N.",
      credential: "RN · IV & wound care",
      rating: 4.9,
      reviews: 512,
      years: 8,
      eta: "40 min",
      price: 899,
    },
    {
      id: "hn2",
      name: "Sister Divya R.",
      credential: "RN · Elderly & post-op",
      rating: 4.8,
      reviews: 388,
      years: 6,
      eta: "55 min",
      price: 999,
    },
  ],
  physio: [
    {
      id: "hp1",
      name: "Rohan Kulkarni",
      credential: "MPT · Sports rehab",
      rating: 4.8,
      reviews: 231,
      years: 7,
      eta: "Today 6 PM",
      price: 799,
    },
    {
      id: "hp2",
      name: "Ananya Das",
      credential: "MPT · Neuro rehab",
      rating: 4.9,
      reviews: 168,
      years: 9,
      eta: "Tomorrow AM",
      price: 899,
    },
  ],
  caregiver: [
    {
      id: "hc1",
      name: "Lakshmi P.",
      credential: "GDA · 5 yrs elder care",
      rating: 4.9,
      reviews: 142,
      years: 5,
      eta: "Tomorrow",
      price: 1200,
    },
    {
      id: "hc2",
      name: "Rekha S.",
      credential: "GDA · Post-op recovery",
      rating: 4.8,
      reviews: 96,
      years: 4,
      eta: "Tomorrow",
      price: 1150,
    },
  ],
};

// Lab tests catalogue
export const labTests = [
  { id: "lt1", code: "CBC", name: "Complete Blood Count", price: 349, fasting: false, tat: "6h" },
  { id: "lt2", code: "LIPID", name: "Lipid Profile", price: 599, fasting: true, tat: "8h" },
  { id: "lt3", code: "HBA1C", name: "HbA1c (Diabetes)", price: 499, fasting: false, tat: "8h" },
  { id: "lt4", code: "TSH", name: "Thyroid — TSH", price: 399, fasting: false, tat: "6h" },
  { id: "lt5", code: "VITD", name: "Vitamin D", price: 899, fasting: false, tat: "12h" },
  { id: "lt6", code: "LFT", name: "Liver Function", price: 549, fasting: true, tat: "8h" },
  { id: "lt7", code: "KFT", name: "Kidney Function", price: 549, fasting: false, tat: "8h" },
  { id: "lt8", code: "URINE", name: "Urine Routine", price: 199, fasting: false, tat: "4h" },
];

// Saved medications for pharmacy
export const savedMeds = [
  {
    id: "m1",
    name: "Atorvastatin 10 mg",
    pack: "30 tablets",
    price: 189,
    refillsIn: "3 days",
    auto: true,
  },
  {
    id: "m2",
    name: "Vitamin D3 60K",
    pack: "4 sachets",
    price: 249,
    refillsIn: "12 days",
    auto: false,
  },
  {
    id: "m3",
    name: "Metformin 500 mg",
    pack: "60 tablets",
    price: 129,
    refillsIn: "18 days",
    auto: false,
  },
  {
    id: "m4",
    name: "Omega 3 1000 mg",
    pack: "60 capsules",
    price: 749,
    refillsIn: "22 days",
    auto: true,
  },
];

export const ambulanceTypes = [
  {
    key: "bls",
    label: "Basic Life Support",
    desc: "Stable transport, oxygen",
    eta: "12 min",
    price: 1499,
  },
  {
    key: "als",
    label: "Advanced Life Support",
    desc: "Cardiac monitor, paramedic on board",
    eta: "14 min",
    price: 2499,
  },
  {
    key: "icu",
    label: "ICU Ambulance",
    desc: "Ventilator, ICU-trained team",
    eta: "18 min",
    price: 4999,
  },
];

// AI recommendations powered by health signals (mock)
export type Recommendation = {
  id: string;
  reason: string; // one-line reason
  cta: string; // action button label
  service: OnlineService | OfflineService;
  section: "online" | "offline";
  accent: Accent;
  attached?: string; // optional attached context (e.g. "Lipid report")
};

export const aiRecommendations: Recommendation[] = [
  {
    id: "ar1",
    reason: "Sleep dropped 18% and stress spiked mid-week",
    cta: "Talk to a Counselor",
    service: "counselor",
    section: "online",
    accent: "violet",
  },
  {
    id: "ar2",
    reason: "Your LDL is 138 — 8 pts above target",
    cta: "Consult with report",
    service: "doctor",
    section: "online",
    accent: "teal",
    attached: "Lipid Profile · Sep 12",
  },
  {
    id: "ar3",
    reason: "Atorvastatin refill runs out in 3 days",
    cta: "Order refill",
    service: "pharmacy",
    section: "offline",
    accent: "amber",
  },
  {
    id: "ar4",
    reason: "Fibre intake trending low for 10 days",
    cta: "See a Nutritionist",
    service: "nutritionist",
    section: "online",
    accent: "emerald",
  },
];
