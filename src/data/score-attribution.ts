export type ScoreFactor = {
  metric: string;
  direction: "up" | "down";
  text: string;
  tone: "emerald" | "amber" | "coral";
};

export const scoreAttributionData: ScoreFactor[] = [
  {
    metric: "Sleep",
    direction: "down",
    text: "You've been sleeping less than usual lately.",
    tone: "amber",
  },
  {
    metric: "Stress",
    direction: "down",
    text: "You've had more stressful days recently.",
    tone: "amber",
  },
  {
    metric: "Activity",
    direction: "up",
    text: "You've been moving more than usual.",
    tone: "emerald",
  },
  {
    metric: "Recovery",
    direction: "up",
    text: "Your body has been bouncing back well.",
    tone: "emerald",
  },
];
