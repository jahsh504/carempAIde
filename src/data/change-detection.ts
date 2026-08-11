export type TrendState = "Improving" | "Declining" | "Stable" | "Emerging change";
export type TimeRange = "7D" | "14D" | "30D" | "90D";

export type MetricDataPoint = {
  date: string;
  actual: number;
  baseline: number;
  unit: string;
  formattedActual: string;
  formattedBaseline: string;
  differenceFormatted: string;
  isChangeDetected?: boolean;
};

export type ChangeDetectionOutput = {
  metricKey: string;
  metricName: string;
  unit: string;
  currentValue: string;
  baselineValue: string;
  direction: "up" | "down" | "flat";
  magnitude: string;
  duration: string;
  persistence: string;
  significance: "high" | "medium" | "low";
  confidence: number;
  trendState: TrendState;
  interpretation: string;
  changeEvent?: {
    title: string;
    description: string;
    startLabel: string;
    endLabel: string;
  };
  series: Record<TimeRange, MetricDataPoint[]>;
};

export const changeDetectionMetrics: Record<string, ChangeDetectionOutput> = {
  sleep: {
    metricKey: "sleep",
    metricName: "Sleep",
    unit: "hrs",
    currentValue: "7h 48m",
    baselineValue: "7h 10m",
    direction: "up",
    magnitude: "+12% vs your baseline",
    duration: "9 days",
    persistence: "Sustained over 9 consecutive nights",
    significance: "high",
    confidence: 94,
    trendState: "Improving",
    interpretation: "Your sleep duration and quality have remained consistently above your usual personal baseline for the last 9 days.",
    changeEvent: {
      title: "Sustained Improvement",
      description: "Sleep consistency & deep sleep duration improved (+38 min deep sleep avg).",
      startLabel: "Aug 3",
      endLabel: "Aug 11",
    },
    series: {
      "7D": [
        { date: "Aug 5", actual: 7.2, baseline: 7.15, unit: "hrs", formattedActual: "7h 12m", formattedBaseline: "7h 09m", differenceFormatted: "+3 min" },
        { date: "Aug 6", actual: 7.5, baseline: 7.15, unit: "hrs", formattedActual: "7h 30m", formattedBaseline: "7h 09m", differenceFormatted: "+21 min", isChangeDetected: true },
        { date: "Aug 7", actual: 7.8, baseline: 7.15, unit: "hrs", formattedActual: "7h 48m", formattedBaseline: "7h 09m", differenceFormatted: "+39 min", isChangeDetected: true },
        { date: "Aug 8", actual: 8.0, baseline: 7.15, unit: "hrs", formattedActual: "8h 00m", formattedBaseline: "7h 09m", differenceFormatted: "+51 min", isChangeDetected: true },
        { date: "Aug 9", actual: 7.6, baseline: 7.15, unit: "hrs", formattedActual: "7h 36m", formattedBaseline: "7h 09m", differenceFormatted: "+27 min", isChangeDetected: true },
        { date: "Aug 10", actual: 7.7, baseline: 7.15, unit: "hrs", formattedActual: "7h 42m", formattedBaseline: "7h 09m", differenceFormatted: "+33 min", isChangeDetected: true },
        { date: "Aug 11", actual: 7.8, baseline: 7.15, unit: "hrs", formattedActual: "7h 48m", formattedBaseline: "7h 09m", differenceFormatted: "+39 min", isChangeDetected: true },
      ],
      "14D": [
        { date: "Jul 29", actual: 6.8, baseline: 7.15, unit: "hrs", formattedActual: "6h 48m", formattedBaseline: "7h 09m", differenceFormatted: "-21 min" },
        { date: "Jul 31", actual: 7.0, baseline: 7.15, unit: "hrs", formattedActual: "7h 00m", formattedBaseline: "7h 09m", differenceFormatted: "-9 min" },
        { date: "Aug 2", actual: 7.1, baseline: 7.15, unit: "hrs", formattedActual: "7h 06m", formattedBaseline: "7h 09m", differenceFormatted: "-3 min" },
        { date: "Aug 4", actual: 7.4, baseline: 7.15, unit: "hrs", formattedActual: "7h 24m", formattedBaseline: "7h 09m", differenceFormatted: "+15 min", isChangeDetected: true },
        { date: "Aug 6", actual: 7.5, baseline: 7.15, unit: "hrs", formattedActual: "7h 30m", formattedBaseline: "7h 09m", differenceFormatted: "+21 min", isChangeDetected: true },
        { date: "Aug 8", actual: 8.0, baseline: 7.15, unit: "hrs", formattedActual: "8h 00m", formattedBaseline: "7h 09m", differenceFormatted: "+51 min", isChangeDetected: true },
        { date: "Aug 10", actual: 7.7, baseline: 7.15, unit: "hrs", formattedActual: "7h 42m", formattedBaseline: "7h 09m", differenceFormatted: "+33 min", isChangeDetected: true },
      ],
      "30D": [
        { date: "Jul 13", actual: 6.9, baseline: 7.15, unit: "hrs", formattedActual: "6h 54m", formattedBaseline: "7h 09m", differenceFormatted: "-15 min" },
        { date: "Jul 20", actual: 7.1, baseline: 7.15, unit: "hrs", formattedActual: "7h 06m", formattedBaseline: "7h 09m", differenceFormatted: "-3 min" },
        { date: "Jul 27", actual: 6.7, baseline: 7.15, unit: "hrs", formattedActual: "6h 42m", formattedBaseline: "7h 09m", differenceFormatted: "-27 min" },
        { date: "Aug 3", actual: 7.5, baseline: 7.15, unit: "hrs", formattedActual: "7h 30m", formattedBaseline: "7h 09m", differenceFormatted: "+21 min", isChangeDetected: true },
        { date: "Aug 10", actual: 7.8, baseline: 7.15, unit: "hrs", formattedActual: "7h 48m", formattedBaseline: "7h 09m", differenceFormatted: "+39 min", isChangeDetected: true },
      ],
      "90D": [
        { date: "May 15", actual: 6.8, baseline: 7.15, unit: "hrs", formattedActual: "6h 48m", formattedBaseline: "7h 09m", differenceFormatted: "-21 min" },
        { date: "Jun 15", actual: 7.0, baseline: 7.15, unit: "hrs", formattedActual: "7h 00m", formattedBaseline: "7h 09m", differenceFormatted: "-9 min" },
        { date: "Jul 15", actual: 7.1, baseline: 7.15, unit: "hrs", formattedActual: "7h 06m", formattedBaseline: "7h 09m", differenceFormatted: "-3 min" },
        { date: "Aug 11", actual: 7.8, baseline: 7.15, unit: "hrs", formattedActual: "7h 48m", formattedBaseline: "7h 09m", differenceFormatted: "+39 min", isChangeDetected: true },
      ],
    },
  },

  activity: {
    metricKey: "activity",
    metricName: "Activity",
    unit: "steps",
    currentValue: "8,840",
    baselineValue: "7,500",
    direction: "up",
    magnitude: "+17.8% vs your baseline",
    duration: "12 days",
    persistence: "Consistently active 6 of last 7 days",
    significance: "high",
    confidence: 91,
    trendState: "Improving",
    interpretation: "Your daily movement and active minutes have consistently exceeded your baseline over the past 2 weeks.",
    changeEvent: {
      title: "Increased Daily Mobility",
      description: "Daily step count shift: baseline increased by 1,340 steps per day.",
      startLabel: "Jul 30",
      endLabel: "Aug 11",
    },
    series: {
      "7D": [
        { date: "Aug 5", actual: 7600, baseline: 7500, unit: "steps", formattedActual: "7,600", formattedBaseline: "7,500", differenceFormatted: "+100 steps" },
        { date: "Aug 6", actual: 8200, baseline: 7500, unit: "steps", formattedActual: "8,200", formattedBaseline: "7,500", differenceFormatted: "+700 steps", isChangeDetected: true },
        { date: "Aug 7", actual: 8900, baseline: 7500, unit: "steps", formattedActual: "8,900", formattedBaseline: "7,500", differenceFormatted: "+1,400 steps", isChangeDetected: true },
        { date: "Aug 8", actual: 9400, baseline: 7500, unit: "steps", formattedActual: "9,400", formattedBaseline: "7,500", differenceFormatted: "+1,900 steps", isChangeDetected: true },
        { date: "Aug 9", actual: 8100, baseline: 7500, unit: "steps", formattedActual: "8,100", formattedBaseline: "7,500", differenceFormatted: "+600 steps", isChangeDetected: true },
        { date: "Aug 10", actual: 8600, baseline: 7500, unit: "steps", formattedActual: "8,600", formattedBaseline: "7,500", differenceFormatted: "+1,100 steps", isChangeDetected: true },
        { date: "Aug 11", actual: 8840, baseline: 7500, unit: "steps", formattedActual: "8,840", formattedBaseline: "7,500", differenceFormatted: "+1,340 steps", isChangeDetected: true },
      ],
      "14D": [
        { date: "Jul 29", actual: 7100, baseline: 7500, unit: "steps", formattedActual: "7,100", formattedBaseline: "7,500", differenceFormatted: "-400 steps" },
        { date: "Jul 31", actual: 7400, baseline: 7500, unit: "steps", formattedActual: "7,400", formattedBaseline: "7,500", differenceFormatted: "-100 steps" },
        { date: "Aug 2", actual: 8100, baseline: 7500, unit: "steps", formattedActual: "8,100", formattedBaseline: "7,500", differenceFormatted: "+600 steps", isChangeDetected: true },
        { date: "Aug 4", actual: 8500, baseline: 7500, unit: "steps", formattedActual: "8,500", formattedBaseline: "7,500", differenceFormatted: "+1,000 steps", isChangeDetected: true },
        { date: "Aug 6", actual: 8200, baseline: 7500, unit: "steps", formattedActual: "8,200", formattedBaseline: "7,500", differenceFormatted: "+700 steps", isChangeDetected: true },
        { date: "Aug 8", actual: 9400, baseline: 7500, unit: "steps", formattedActual: "9,400", formattedBaseline: "7,500", differenceFormatted: "+1,900 steps", isChangeDetected: true },
        { date: "Aug 10", actual: 8840, baseline: 7500, unit: "steps", formattedActual: "8,840", formattedBaseline: "7,500", differenceFormatted: "+1,340 steps", isChangeDetected: true },
      ],
      "30D": [
        { date: "Jul 13", actual: 7300, baseline: 7500, unit: "steps", formattedActual: "7,300", formattedBaseline: "7,500", differenceFormatted: "-200 steps" },
        { date: "Jul 20", actual: 7200, baseline: 7500, unit: "steps", formattedActual: "7,200", formattedBaseline: "7,500", differenceFormatted: "-300 steps" },
        { date: "Jul 27", actual: 7400, baseline: 7500, unit: "steps", formattedActual: "7,400", formattedBaseline: "7,500", differenceFormatted: "-100 steps" },
        { date: "Aug 3", actual: 8300, baseline: 7500, unit: "steps", formattedActual: "8,300", formattedBaseline: "7,500", differenceFormatted: "+800 steps", isChangeDetected: true },
        { date: "Aug 10", actual: 8840, baseline: 7500, unit: "steps", formattedActual: "8,840", formattedBaseline: "7,500", differenceFormatted: "+1,340 steps", isChangeDetected: true },
      ],
      "90D": [
        { date: "May 15", actual: 7100, baseline: 7500, unit: "steps", formattedActual: "7,100", formattedBaseline: "7,500", differenceFormatted: "-400 steps" },
        { date: "Jun 15", actual: 7300, baseline: 7500, unit: "steps", formattedActual: "7,300", formattedBaseline: "7,500", differenceFormatted: "-200 steps" },
        { date: "Jul 15", actual: 7400, baseline: 7500, unit: "steps", formattedActual: "7,400", formattedBaseline: "7,500", differenceFormatted: "-100 steps" },
        { date: "Aug 11", actual: 8840, baseline: 7500, unit: "steps", formattedActual: "8,840", formattedBaseline: "7,500", differenceFormatted: "+1,340 steps", isChangeDetected: true },
      ],
    },
  },

  "resting-hr": {
    metricKey: "resting-hr",
    metricName: "Resting HR",
    unit: "bpm",
    currentValue: "62 bpm",
    baselineValue: "64 bpm",
    direction: "down",
    magnitude: "-2 bpm vs your baseline",
    duration: "14 days",
    persistence: "Steady within normal boundaries",
    significance: "medium",
    confidence: 96,
    trendState: "Stable",
    interpretation: "Your resting heart rate is calm and steady, hovering slightly below your 30-day baseline.",
    series: {
      "7D": [
        { date: "Aug 5", actual: 64, baseline: 64, unit: "bpm", formattedActual: "64 bpm", formattedBaseline: "64 bpm", differenceFormatted: "0 bpm" },
        { date: "Aug 6", actual: 63, baseline: 64, unit: "bpm", formattedActual: "63 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-1 bpm" },
        { date: "Aug 7", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
        { date: "Aug 8", actual: 61, baseline: 64, unit: "bpm", formattedActual: "61 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-3 bpm" },
        { date: "Aug 9", actual: 63, baseline: 64, unit: "bpm", formattedActual: "63 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-1 bpm" },
        { date: "Aug 10", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
        { date: "Aug 11", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
      ],
      "14D": [
        { date: "Jul 29", actual: 65, baseline: 64, unit: "bpm", formattedActual: "65 bpm", formattedBaseline: "64 bpm", differenceFormatted: "+1 bpm" },
        { date: "Jul 31", actual: 64, baseline: 64, unit: "bpm", formattedActual: "64 bpm", formattedBaseline: "64 bpm", differenceFormatted: "0 bpm" },
        { date: "Aug 2", actual: 63, baseline: 64, unit: "bpm", formattedActual: "63 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-1 bpm" },
        { date: "Aug 4", actual: 63, baseline: 64, unit: "bpm", formattedActual: "63 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-1 bpm" },
        { date: "Aug 6", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
        { date: "Aug 8", actual: 61, baseline: 64, unit: "bpm", formattedActual: "61 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-3 bpm" },
        { date: "Aug 10", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
      ],
      "30D": [
        { date: "Jul 13", actual: 65, baseline: 64, unit: "bpm", formattedActual: "65 bpm", formattedBaseline: "64 bpm", differenceFormatted: "+1 bpm" },
        { date: "Jul 20", actual: 64, baseline: 64, unit: "bpm", formattedActual: "64 bpm", formattedBaseline: "64 bpm", differenceFormatted: "0 bpm" },
        { date: "Jul 27", actual: 64, baseline: 64, unit: "bpm", formattedActual: "64 bpm", formattedBaseline: "64 bpm", differenceFormatted: "0 bpm" },
        { date: "Aug 3", actual: 63, baseline: 64, unit: "bpm", formattedActual: "63 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-1 bpm" },
        { date: "Aug 10", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
      ],
      "90D": [
        { date: "May 15", actual: 66, baseline: 64, unit: "bpm", formattedActual: "66 bpm", formattedBaseline: "64 bpm", differenceFormatted: "+2 bpm" },
        { date: "Jun 15", actual: 65, baseline: 64, unit: "bpm", formattedActual: "65 bpm", formattedBaseline: "64 bpm", differenceFormatted: "+1 bpm" },
        { date: "Jul 15", actual: 64, baseline: 64, unit: "bpm", formattedActual: "64 bpm", formattedBaseline: "64 bpm", differenceFormatted: "0 bpm" },
        { date: "Aug 11", actual: 62, baseline: 64, unit: "bpm", formattedActual: "62 bpm", formattedBaseline: "64 bpm", differenceFormatted: "-2 bpm" },
      ],
    },
  },

  stress: {
    metricKey: "stress",
    metricName: "Stress",
    unit: "pts",
    currentValue: "34 pts",
    baselineValue: "45 pts",
    direction: "down",
    magnitude: "-24.4% vs your baseline",
    duration: "7 days",
    persistence: "Lower evening stress scores",
    significance: "medium",
    confidence: 88,
    trendState: "Improving",
    interpretation: "Your stress and strain index has shown a steady downward reduction over the past week.",
    changeEvent: {
      title: "Stress Reduction Detected",
      description: "Evening stress scores dropped 11 points below your 30-day baseline.",
      startLabel: "Aug 5",
      endLabel: "Aug 11",
    },
    series: {
      "7D": [
        { date: "Aug 5", actual: 44, baseline: 45, unit: "pts", formattedActual: "44 pts", formattedBaseline: "45 pts", differenceFormatted: "-1 pt" },
        { date: "Aug 6", actual: 40, baseline: 45, unit: "pts", formattedActual: "40 pts", formattedBaseline: "45 pts", differenceFormatted: "-5 pts", isChangeDetected: true },
        { date: "Aug 7", actual: 38, baseline: 45, unit: "pts", formattedActual: "38 pts", formattedBaseline: "45 pts", differenceFormatted: "-7 pts", isChangeDetected: true },
        { date: "Aug 8", actual: 35, baseline: 45, unit: "pts", formattedActual: "35 pts", formattedBaseline: "45 pts", differenceFormatted: "-10 pts", isChangeDetected: true },
        { date: "Aug 9", actual: 36, baseline: 45, unit: "pts", formattedActual: "36 pts", formattedBaseline: "45 pts", differenceFormatted: "-9 pts", isChangeDetected: true },
        { date: "Aug 10", actual: 32, baseline: 45, unit: "pts", formattedActual: "32 pts", formattedBaseline: "45 pts", differenceFormatted: "-13 pts", isChangeDetected: true },
        { date: "Aug 11", actual: 34, baseline: 45, unit: "pts", formattedActual: "34 pts", formattedBaseline: "45 pts", differenceFormatted: "-11 pts", isChangeDetected: true },
      ],
      "14D": [
        { date: "Jul 29", actual: 48, baseline: 45, unit: "pts", formattedActual: "48 pts", formattedBaseline: "45 pts", differenceFormatted: "+3 pts" },
        { date: "Jul 31", actual: 46, baseline: 45, unit: "pts", formattedActual: "46 pts", formattedBaseline: "45 pts", differenceFormatted: "+1 pt" },
        { date: "Aug 2", actual: 45, baseline: 45, unit: "pts", formattedActual: "45 pts", formattedBaseline: "45 pts", differenceFormatted: "0 pts" },
        { date: "Aug 4", actual: 43, baseline: 45, unit: "pts", formattedActual: "43 pts", formattedBaseline: "45 pts", differenceFormatted: "-2 pts" },
        { date: "Aug 6", actual: 40, baseline: 45, unit: "pts", formattedActual: "40 pts", formattedBaseline: "45 pts", differenceFormatted: "-5 pts", isChangeDetected: true },
        { date: "Aug 8", actual: 35, baseline: 45, unit: "pts", formattedActual: "35 pts", formattedBaseline: "45 pts", differenceFormatted: "-10 pts", isChangeDetected: true },
        { date: "Aug 10", actual: 34, baseline: 45, unit: "pts", formattedActual: "34 pts", formattedBaseline: "45 pts", differenceFormatted: "-11 pts", isChangeDetected: true },
      ],
      "30D": [
        { date: "Jul 13", actual: 49, baseline: 45, unit: "pts", formattedActual: "49 pts", formattedBaseline: "45 pts", differenceFormatted: "+4 pts" },
        { date: "Jul 20", actual: 47, baseline: 45, unit: "pts", formattedActual: "47 pts", formattedBaseline: "45 pts", differenceFormatted: "+2 pts" },
        { date: "Jul 27", actual: 46, baseline: 45, unit: "pts", formattedActual: "46 pts", formattedBaseline: "45 pts", differenceFormatted: "+1 pt" },
        { date: "Aug 3", actual: 41, baseline: 45, unit: "pts", formattedActual: "41 pts", formattedBaseline: "45 pts", differenceFormatted: "-4 pts", isChangeDetected: true },
        { date: "Aug 10", actual: 34, baseline: 45, unit: "pts", formattedActual: "34 pts", formattedBaseline: "45 pts", differenceFormatted: "-11 pts", isChangeDetected: true },
      ],
      "90D": [
        { date: "May 15", actual: 52, baseline: 45, unit: "pts", formattedActual: "52 pts", formattedBaseline: "45 pts", differenceFormatted: "+7 pts" },
        { date: "Jun 15", actual: 48, baseline: 45, unit: "pts", formattedActual: "48 pts", formattedBaseline: "45 pts", differenceFormatted: "+3 pts" },
        { date: "Jul 15", actual: 46, baseline: 45, unit: "pts", formattedActual: "46 pts", formattedBaseline: "45 pts", differenceFormatted: "+1 pt" },
        { date: "Aug 11", actual: 34, baseline: 45, unit: "pts", formattedActual: "34 pts", formattedBaseline: "45 pts", differenceFormatted: "-11 pts", isChangeDetected: true },
      ],
    },
  },

  glucose: {
    metricKey: "glucose",
    metricName: "Glucose",
    unit: "mg/dL",
    currentValue: "96 mg/dL",
    baselineValue: "98 mg/dL",
    direction: "flat",
    magnitude: "-2 mg/dL vs baseline",
    duration: "30 days",
    persistence: "Steady fasting levels within target",
    significance: "low",
    confidence: 95,
    trendState: "Stable",
    interpretation: "Fasting glucose recovery remains stable and well within your personal baseline range.",
    series: {
      "7D": [
        { date: "Aug 5", actual: 98, baseline: 98, unit: "mg/dL", formattedActual: "98 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "0 mg/dL" },
        { date: "Aug 6", actual: 97, baseline: 98, unit: "mg/dL", formattedActual: "97 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-1 mg/dL" },
        { date: "Aug 7", actual: 95, baseline: 98, unit: "mg/dL", formattedActual: "95 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-3 mg/dL" },
        { date: "Aug 8", actual: 99, baseline: 98, unit: "mg/dL", formattedActual: "99 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+1 mg/dL" },
        { date: "Aug 9", actual: 96, baseline: 98, unit: "mg/dL", formattedActual: "96 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-2 mg/dL" },
        { date: "Aug 10", actual: 95, baseline: 98, unit: "mg/dL", formattedActual: "95 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-3 mg/dL" },
        { date: "Aug 11", actual: 96, baseline: 98, unit: "mg/dL", formattedActual: "96 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-2 mg/dL" },
      ],
      "14D": [
        { date: "Jul 29", actual: 100, baseline: 98, unit: "mg/dL", formattedActual: "100 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+2 mg/dL" },
        { date: "Jul 31", actual: 99, baseline: 98, unit: "mg/dL", formattedActual: "99 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+1 mg/dL" },
        { date: "Aug 2", actual: 97, baseline: 98, unit: "mg/dL", formattedActual: "97 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-1 mg/dL" },
        { date: "Aug 4", actual: 98, baseline: 98, unit: "mg/dL", formattedActual: "98 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "0 mg/dL" },
        { date: "Aug 6", actual: 97, baseline: 98, unit: "mg/dL", formattedActual: "97 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-1 mg/dL" },
        { date: "Aug 8", actual: 99, baseline: 98, unit: "mg/dL", formattedActual: "99 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+1 mg/dL" },
        { date: "Aug 10", actual: 96, baseline: 98, unit: "mg/dL", formattedActual: "96 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-2 mg/dL" },
      ],
      "30D": [
        { date: "Jul 13", actual: 101, baseline: 98, unit: "mg/dL", formattedActual: "101 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+3 mg/dL" },
        { date: "Jul 20", actual: 99, baseline: 98, unit: "mg/dL", formattedActual: "99 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+1 mg/dL" },
        { date: "Jul 27", actual: 98, baseline: 98, unit: "mg/dL", formattedActual: "98 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "0 mg/dL" },
        { date: "Aug 3", actual: 97, baseline: 98, unit: "mg/dL", formattedActual: "97 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-1 mg/dL" },
        { date: "Aug 10", actual: 96, baseline: 98, unit: "mg/dL", formattedActual: "96 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-2 mg/dL" },
      ],
      "90D": [
        { date: "May 15", actual: 102, baseline: 98, unit: "mg/dL", formattedActual: "102 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+4 mg/dL" },
        { date: "Jun 15", actual: 100, baseline: 98, unit: "mg/dL", formattedActual: "100 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "+2 mg/dL" },
        { date: "Jul 15", actual: 98, baseline: 98, unit: "mg/dL", formattedActual: "98 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "0 mg/dL" },
        { date: "Aug 11", actual: 96, baseline: 98, unit: "mg/dL", formattedActual: "96 mg/dL", formattedBaseline: "98 mg/dL", differenceFormatted: "-2 mg/dL" },
      ],
    },
  },
};
