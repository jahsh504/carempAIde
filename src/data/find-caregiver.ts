// Find a Caregiver — intelligent matching mock data + in-memory request store.
import { useSyncExternalStore } from "react";

export type Availability = "now" | "30min" | "today";

export type MatchCaregiver = {
  id: string;
  name: string;
  initials: string;
  role: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  etaMinutes: number;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  availability: Availability;
  availabilityLabel: string;
  responseTime: string;
  certifications: string[];
  bio: string;
  matchScore: number;
  matchReasons: string[];
  tone: "teal" | "blue" | "emerald" | "amber" | "coral";
  patientReviews: { by: string; when: string; text: string; stars: number }[];
};

export const caregiverMatches: MatchCaregiver[] = [
  {
    id: "priya-nair",
    name: "Priya Nair",
    initials: "PN",
    role: "Primary Caregiver",
    rating: 4.9,
    reviews: 168,
    distanceKm: 2.1,
    etaMinutes: 20,
    experienceYears: 8,
    languages: ["English", "Malayalam", "Hindi"],
    specialties: ["Elder Care", "Diabetes", "Post Surgery", "Medication Support"],
    availability: "now",
    availabilityLabel: "Available in 20 minutes",
    responseTime: "Usually replies in 4 min",
    certifications: ["Certified Nursing Assistant", "BLS & First Aid", "Diabetes Care Level 2"],
    bio:
      "Priya has spent eight years supporting seniors at home, with a focus on recovery after surgery and steady day-to-day diabetes management. She keeps families informed with clear, gentle updates.",
    matchScore: 94,
    matchReasons: [
      "Experience with hypertension",
      "Familiar with recovery monitoring",
      "High patient satisfaction",
      "Available today",
    ],
    tone: "teal",
    patientReviews: [
      { by: "Meera R.", when: "2 weeks ago", stars: 5, text: "Calm, punctual and explained every reading to my father." },
      { by: "Arjun S.", when: "1 month ago", stars: 5, text: "Made post-surgery days far less stressful for us." },
    ],
  },
  {
    id: "rahul-menon",
    name: "Rahul Menon",
    initials: "RM",
    role: "Home Nurse",
    rating: 4.8,
    reviews: 121,
    distanceKm: 3.4,
    etaMinutes: 35,
    experienceYears: 8,
    languages: ["English", "Hindi", "Malayalam"],
    specialties: ["Diabetes", "Mobility Support", "Medication Support", "Dementia"],
    availability: "30min",
    availabilityLabel: "Can arrive in 35 min",
    responseTime: "Usually replies in 9 min",
    certifications: ["Registered Nurse", "Dementia Care Certified"],
    bio: "Rahul works with families managing long-term conditions, and is known for patient, unhurried mobility support.",
    matchScore: 88,
    matchReasons: ["Strong medication routines", "Nearby this week", "Dementia trained"],
    tone: "blue",
    patientReviews: [{ by: "Latha P.", when: "3 weeks ago", stars: 5, text: "Very gentle with my mother's walking practice." }],
  },
  {
    id: "anita-george",
    name: "Anita George",
    initials: "AG",
    role: "Physiotherapy Assistant",
    rating: 4.9,
    reviews: 203,
    distanceKm: 1.4,
    etaMinutes: 25,
    experienceYears: 11,
    languages: ["English", "Tamil"],
    specialties: ["Physiotherapy", "Post Surgery", "Elder Care"],
    availability: "now",
    availabilityLabel: "Available now",
    responseTime: "Usually replies in 6 min",
    certifications: ["BPT", "Geriatric Rehab Specialist"],
    bio: "Anita builds slow, sustainable strength and balance routines for older adults recovering from procedures.",
    matchScore: 86,
    matchReasons: ["Gait and balance focus", "Closest to your home"],
    tone: "emerald",
    patientReviews: [{ by: "Sunil K.", when: "1 week ago", stars: 5, text: "My balance improved within a fortnight." }],
  },
  {
    id: "sana-kapoor",
    name: "Sana Kapoor",
    initials: "SK",
    role: "Companion Caregiver",
    rating: 4.7,
    reviews: 74,
    distanceKm: 2.8,
    etaMinutes: 30,
    experienceYears: 3,
    languages: ["English", "Hindi", "Punjabi"],
    specialties: ["Elder Care", "Medication Support"],
    availability: "30min",
    availabilityLabel: "Can arrive in 30 min",
    responseTime: "Usually replies in 12 min",
    certifications: ["Home Care Aide"],
    bio: "Sana focuses on companionship, meal preparation and keeping daily routines warm and consistent.",
    matchScore: 78,
    matchReasons: ["Great for companion visits", "Flexible weekend hours"],
    tone: "amber",
    patientReviews: [{ by: "Devi N.", when: "2 months ago", stars: 5, text: "Lovely company for my aunt every afternoon." }],
  },
  {
    id: "joseph-thomas",
    name: "Joseph Thomas",
    initials: "JT",
    role: "Cardiac Care Nurse",
    rating: 4.9,
    reviews: 156,
    distanceKm: 5.6,
    etaMinutes: 45,
    experienceYears: 13,
    languages: ["English", "Malayalam"],
    specialties: ["Cardiac Recovery", "Post Surgery", "Medication Support"],
    availability: "today",
    availabilityLabel: "Available later today",
    responseTime: "Usually replies in 15 min",
    certifications: ["Registered Nurse", "ACLS Certified"],
    bio: "Joseph supports cardiac recovery at home, with careful vitals monitoring and escalation protocols.",
    matchScore: 84,
    matchReasons: ["Cardiac recovery specialist", "Vitals monitoring depth"],
    tone: "coral",
    patientReviews: [{ by: "Ramesh V.", when: "1 month ago", stars: 5, text: "Reassuring through my father's recovery." }],
  },
  {
    id: "fatima-sheikh",
    name: "Fatima Sheikh",
    initials: "FS",
    role: "Dementia Care Specialist",
    rating: 4.8,
    reviews: 98,
    distanceKm: 4.2,
    etaMinutes: 40,
    experienceYears: 9,
    languages: ["English", "Hindi", "Urdu"],
    specialties: ["Dementia", "Elder Care", "Companion Visit"],
    availability: "today",
    availabilityLabel: "Available from 4:00 PM",
    responseTime: "Usually replies in 10 min",
    certifications: ["Dementia Care Level 3", "First Aid"],
    bio: "Fatima creates predictable, calming routines for people living with memory changes.",
    matchScore: 75,
    matchReasons: ["Memory-care routines", "Evening availability"],
    tone: "blue",
    patientReviews: [{ by: "Imran A.", when: "5 weeks ago", stars: 5, text: "Endless patience and warmth." }],
  },
  {
    id: "deepa-rao",
    name: "Deepa Rao",
    initials: "DR",
    role: "Home Nurse",
    rating: 4.6,
    reviews: 62,
    distanceKm: 1.9,
    etaMinutes: 22,
    experienceYears: 6,
    languages: ["English", "Kannada", "Hindi"],
    specialties: ["Diabetes", "Medication Support", "Elder Care"],
    availability: "now",
    availabilityLabel: "Available now",
    responseTime: "Usually replies in 8 min",
    certifications: ["GNM Nursing"],
    bio: "Deepa is meticulous with medication schedules and glucose logging.",
    matchScore: 80,
    matchReasons: ["Medication accuracy", "Very close by"],
    tone: "teal",
    patientReviews: [{ by: "Kiran M.", when: "3 weeks ago", stars: 4, text: "Reliable and organised." }],
  },
  {
    id: "vikram-shetty",
    name: "Vikram Shetty",
    initials: "VS",
    role: "Mobility Support Aide",
    rating: 4.7,
    reviews: 88,
    distanceKm: 6.3,
    etaMinutes: 50,
    experienceYears: 7,
    languages: ["English", "Kannada", "Tulu"],
    specialties: ["Mobility Support", "Physiotherapy", "Post Surgery"],
    availability: "today",
    availabilityLabel: "Available from 2:00 PM",
    responseTime: "Usually replies in 18 min",
    certifications: ["Home Care Aide", "Manual Handling Certified"],
    bio: "Vikram assists with transfers, walking practice and safe home movement.",
    matchScore: 72,
    matchReasons: ["Transfer and lifting expertise"],
    tone: "emerald",
    patientReviews: [{ by: "Nandita B.", when: "2 months ago", stars: 5, text: "Strong, careful and respectful." }],
  },
  {
    id: "leela-krishnan",
    name: "Leela Krishnan",
    initials: "LK",
    role: "Senior Caregiver",
    rating: 5.0,
    reviews: 240,
    distanceKm: 7.1,
    etaMinutes: 55,
    experienceYears: 15,
    languages: ["English", "Tamil", "Malayalam"],
    specialties: ["Elder Care", "Post Surgery", "Dementia", "Medication Support"],
    availability: "today",
    availabilityLabel: "Available tomorrow morning",
    responseTime: "Usually replies in 20 min",
    certifications: ["Certified Nursing Assistant", "Palliative Care Training"],
    bio: "Fifteen years of home care experience across recovery, memory care and long-term support.",
    matchScore: 82,
    matchReasons: ["Highest rated in your area", "Broad experience"],
    tone: "amber",
    patientReviews: [{ by: "Gopal S.", when: "1 month ago", stars: 5, text: "The most experienced caregiver we've had." }],
  },
  {
    id: "arun-pillai",
    name: "Arun Pillai",
    initials: "AP",
    role: "Wellness Caregiver",
    rating: 4.5,
    reviews: 41,
    distanceKm: 3.9,
    etaMinutes: 38,
    experienceYears: 4,
    languages: ["English", "Malayalam"],
    specialties: ["General Wellness Check", "Companion Visit", "Elder Care"],
    availability: "30min",
    availabilityLabel: "Can arrive in 38 min",
    responseTime: "Usually replies in 11 min",
    certifications: ["First Aid", "Home Care Aide"],
    bio: "Arun handles wellness checks, light exercise company and daily reporting.",
    matchScore: 68,
    matchReasons: ["Good for routine wellness visits"],
    tone: "blue",
    patientReviews: [{ by: "Sheeba T.", when: "6 weeks ago", stars: 4, text: "Friendly and dependable." }],
  },
];

export const recommendedCaregiverId = "priya-nair";

export const recommendationReasons = [
  "Experienced with diabetes management",
  "Has worked with seniors recovering from surgery",
  "Speaks English & Malayalam",
  "Familiar with your medications",
];

export const availabilityFilters: { id: Availability; label: string }[] = [
  { id: "now", label: "Available Now" },
  { id: "30min", label: "Within 30 min" },
  { id: "today", label: "Today" },
];

export const specializationFilters = [
  "Elder Care",
  "Diabetes",
  "Cardiac Recovery",
  "Physiotherapy",
  "Dementia",
  "Post Surgery",
  "Medication Support",
];

export const distanceFilters = [
  { id: "nearby", label: "Nearby" },
  { id: "any", label: "Any Distance" },
] as const;

export const languageFilters = ["English", "Hindi", "Malayalam", "Tamil", "Kannada"];

export const assistanceReasons = [
  "Daily Care",
  "Medication Assistance",
  "Mobility Support",
  "Companion Visit",
  "Post Surgery Recovery",
  "General Wellness Check",
  "Other",
];

export function getCaregiver(id: string) {
  return caregiverMatches.find((c) => c.id === id);
}

// ---- In-memory active request store ----

export const requestStatuses = [
  "Request Sent",
  "Accepted",
  "Started Journey",
  "Arriving",
  "Checked In",
  "Visit In Progress",
  "Visit Completed",
] as const;

export type RequestStatus = (typeof requestStatuses)[number];

export type CareRequest = {
  caregiverId: string;
  caregiverName: string;
  reason: string;
  notes: string;
  etaMinutes: number;
  status: RequestStatus;
};

let current: CareRequest | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function setCareRequest(req: CareRequest | null) {
  current = req;
  emit();
}

export function advanceCareRequest() {
  if (!current) return;
  const i = requestStatuses.indexOf(current.status);
  if (i < requestStatuses.length - 1) {
    current = { ...current, status: requestStatuses[i + 1] };
    emit();
  }
}

export function useCareRequest() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => null
  );
}

export const avatarTone: Record<string, string> = {
  teal: "from-teal to-blue",
  blue: "from-blue to-teal",
  emerald: "from-emerald to-teal",
  amber: "from-amber to-coral",
  coral: "from-coral to-amber",
};
