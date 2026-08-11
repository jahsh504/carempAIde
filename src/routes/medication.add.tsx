import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/care/primitives";
import { addMedication, type FoodRule } from "@/data/medication";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/medication/add")({
  head: () => ({
    meta: [
      { title: "Add Medication — careMP AIDE" },
      { name: "description", content: "Add a medication with dosage, frequency, food timing and reminder schedule." },
      { property: "og:title", content: "Add Medication — careMP AIDE" },
      { property: "og:description", content: "Add a medication to your careMP schedule in a few taps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AddMedicationPage,
});

const foodOptions: FoodRule[] = ["Before food", "After food", "With food", "Anytime"];
const frequencies = ["Once daily", "Twice daily", "Three times daily", "Weekly", "As needed"];

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-border bg-card px-3.5 py-2.5 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-teal";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

function AddMedicationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [food, setFood] = useState<FoodRule>("After food");
  const [time, setTime] = useState("08:00");
  const [isCourse, setIsCourse] = useState(false);
  const [duration, setDuration] = useState("");
  const [start, setStart] = useState("2026-08-07");
  const [end, setEnd] = useState("");

  const save = () => {
    if (!name.trim()) return;
    const [h, m] = time.split(":").map(Number);
    const label = `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    addMedication({ name: name.trim(), dosage: dosage.trim() || "1 tablet", time: label, food, when: frequency });
    navigate({ to: "/medication" });
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="px-1 pt-1">
        <h1 className="text-[22px] font-semibold leading-tight">Add Medication</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          We'll remind you at the right time and keep it in your adherence record.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <label className={labelClass}>Medication name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Metformin" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dosage</label>
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="1 tablet · 500 mg" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
            {frequencies.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Food timing</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {foodOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFood(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11.5px] font-medium",
                  food === f ? "border-transparent bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </div>

        {/* Treatment course toggle */}
        <div className="rounded-2xl border border-border bg-muted/40 p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="course-toggle" className="text-[13px] font-medium cursor-pointer">
              Track as a treatment course
            </label>
            <input
              id="course-toggle"
              type="checkbox"
              checked={isCourse}
              onChange={(e) => setIsCourse(e.target.checked)}
              className="h-4.5 w-4.5 rounded accent-teal cursor-pointer"
            />
          </div>
          <p className="text-[11.5px] leading-normal text-muted-foreground">
            Track this medication toward a defined course with a start and end date.
          </p>
        </div>

        {isCourse && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Start date</label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End date</label>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Course duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 7 day course"
                className={inputClass}
              />
            </div>
          </div>
        )}

        <button
          onClick={save}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Save
        </button>
      </Card>
    </div>
  );
}
