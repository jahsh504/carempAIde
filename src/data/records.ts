// Medical Records — resident's secure health vault (mock data).

export type RecordCategory = "lab" | "imaging" | "prescriptions" | "other";

export type CategoryMeta = {
  key: RecordCategory;
  label: string;
  blurb: string;
  icon: string;
  tone: "teal" | "blue" | "emerald" | "amber";
  lastUpdated: string;
};

export const categories: CategoryMeta[] = [
  { key: "lab", label: "Lab Reports", blurb: "Blood tests · Urine tests · Diagnostics", icon: "flask", tone: "teal", lastUpdated: "March 2026" },
  { key: "imaging", label: "Imaging", blurb: "X-ray · MRI · CT · Ultrasound", icon: "scan", tone: "blue", lastUpdated: "February 2026" },
  { key: "prescriptions", label: "Prescriptions", blurb: "Current & past doctor prescriptions", icon: "pill", tone: "emerald", lastUpdated: "Today" },
  { key: "other", label: "Other Documents", blurb: "Vaccinations · Insurance · Discharge · Referrals", icon: "folder", tone: "amber", lastUpdated: "January 2026" },
];

export type MedicalDoc = {
  id: string;
  title: string;
  category: RecordCategory;
  hospital: string;
  doctor: string;
  date: string;
  sortDate: string; // YYYY-MM-DD
  tag?: string;
  kind: "PDF" | "Image" | "Scan";
  twin: boolean;
  medications?: string[];
  values?: { label: string; value: string; flag?: "high" | "low" | "ok" }[];
};

export const documents: MedicalDoc[] = [
  {
    id: "d1", title: "Complete Blood Count", category: "lab", hospital: "Apollo Hospital", doctor: "Dr. Nadia Rahman",
    date: "March 2026", sortDate: "2026-03-18", tag: "CBC", kind: "PDF", twin: true,
    values: [
      { label: "Haemoglobin", value: "14.2 g/dL", flag: "ok" },
      { label: "WBC", value: "6.8 ×10³/µL", flag: "ok" },
      { label: "Platelets", value: "232 ×10³/µL", flag: "ok" },
    ],
  },
  {
    id: "d2", title: "Lipid Profile", category: "lab", hospital: "Apollo Hospital", doctor: "Dr. Nadia Rahman",
    date: "March 2026", sortDate: "2026-03-18", tag: "Cholesterol", kind: "PDF", twin: true,
    values: [
      { label: "Total cholesterol", value: "198 mg/dL", flag: "ok" },
      { label: "LDL", value: "138 mg/dL", flag: "high" },
      { label: "HDL", value: "52 mg/dL", flag: "ok" },
    ],
  },
  {
    id: "d3", title: "Vitamin D & B12 Panel", category: "lab", hospital: "Metropolis Labs", doctor: "Dr. Karan Shah",
    date: "January 2026", sortDate: "2026-01-09", tag: "Micronutrients", kind: "Scan", twin: true,
    values: [{ label: "Vitamin D", value: "22 ng/mL", flag: "low" }, { label: "B12", value: "410 pg/mL", flag: "ok" }],
  },
  {
    id: "d4", title: "Chest X-Ray", category: "imaging", hospital: "Fortis Healthcare", doctor: "Dr. Meera Iyer",
    date: "February 2026", sortDate: "2026-02-14", tag: "X-ray", kind: "Image", twin: true,
  },
  {
    id: "d5", title: "Knee MRI — Left", category: "imaging", hospital: "Fortis Healthcare", doctor: "Dr. Meera Iyer",
    date: "February 2026", sortDate: "2026-02-02", tag: "MRI", kind: "Image", twin: false,
  },
  {
    id: "d6", title: "Abdominal Ultrasound", category: "imaging", hospital: "City Diagnostics", doctor: "Dr. Anil Verma",
    date: "November 2025", sortDate: "2025-11-21", tag: "Ultrasound", kind: "Image", twin: true,
  },
  {
    id: "d7", title: "Atorvastatin 10 mg", category: "prescriptions", hospital: "Apollo Hospital", doctor: "Dr. Nadia Rahman",
    date: "Today", sortDate: "2026-08-05", tag: "Current", kind: "PDF", twin: true, medications: ["Atorvastatin 10 mg", "Vitamin D3 60k"],
  },
  {
    id: "d8", title: "Post-viral recovery script", category: "prescriptions", hospital: "Clinic 24", doctor: "Dr. Sameer Roy",
    date: "December 2025", sortDate: "2025-12-04", tag: "Past", kind: "Scan", twin: false, medications: ["Azithromycin 500 mg"],
  },
  {
    id: "d9", title: "Annual Health Check Summary", category: "other", hospital: "Apollo Hospital", doctor: "Dr. Nadia Rahman",
    date: "January 2026", sortDate: "2026-01-06", tag: "Health check", kind: "PDF", twin: true,
  },
  {
    id: "d10", title: "Health Insurance Policy", category: "other", hospital: "Star Health", doctor: "—",
    date: "April 2025", sortDate: "2025-04-11", tag: "Insurance", kind: "PDF", twin: false,
  },
  {
    id: "d11", title: "Influenza Vaccination", category: "other", hospital: "Clinic 24", doctor: "Dr. Sameer Roy",
    date: "October 2025", sortDate: "2025-10-19", tag: "Vaccination", kind: "Image", twin: true,
  },
];

export const countFor = (key: RecordCategory) => documents.filter((d) => d.category === key).length;

export const recordsSummary = [
  "Your last cholesterol test improved compared to January.",
  "Blood pressure has remained stable across the last three reports.",
];

export const twinUsageLine = `Your Digital Twin is using ${documents.filter((d) => d.twin).length} verified medical records.`;

export const uploadOptions = [
  { key: "photo", label: "Take Photo", icon: "camera" },
  { key: "scan", label: "Scan Document", icon: "scan-line" },
  { key: "pdf", label: "Choose PDF", icon: "file-text" },
  { key: "image", label: "Choose Image", icon: "image" },
  { key: "files", label: "Import from Files", icon: "folder-open" },
];
