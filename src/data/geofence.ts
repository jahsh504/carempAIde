// Geofence — indoor beacon tracking mock data (dementia care).
export type Room = {
  id: string;
  label: string;
  restricted: boolean;
  // grid placement in a simplified home layout
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
};

export const patient = {
  name: "Mary Thomas",
  initials: "MT",
  relation: "Mother · 74",
  status: "Safe indoors",
  lastUpdated: "Updated 12 seconds ago",
};

export const currentRoomId = "living";

export const currentLocation = {
  room: "Living Room",
  beacon: "Living Room Beacon",
  signalLabel: "Strong",
  rssi: -48,
};

export const rooms: Room[] = [
  { id: "bedroom", label: "Bedroom", restricted: false, col: 1, row: 1, colSpan: 1, rowSpan: 1 },
  { id: "bathroom", label: "Bathroom", restricted: false, col: 2, row: 1, colSpan: 1, rowSpan: 1 },
  { id: "kitchen", label: "Kitchen", restricted: true, col: 3, row: 1, colSpan: 1, rowSpan: 1 },
  { id: "living", label: "Living Room", restricted: false, col: 1, row: 2, colSpan: 2, rowSpan: 1 },
  { id: "garden", label: "Garden", restricted: false, col: 3, row: 2, colSpan: 1, rowSpan: 1 },
  {
    id: "front-door",
    label: "Front Door",
    restricted: true,
    col: 1,
    row: 3,
    colSpan: 3,
    rowSpan: 1,
  },
];

export const beacons = [
  { id: "living", label: "Living Room Beacon", rssi: -48 },
  { id: "kitchen", label: "Kitchen Beacon", rssi: -72 },
  { id: "bedroom", label: "Bedroom Beacon", rssi: -76 },
  { id: "front-door", label: "Front Door Beacon", rssi: -84 },
];

export function signalBars(rssi: number) {
  if (rssi >= -55) return 3;
  if (rssi >= -75) return 2;
  return 1;
}

export function signalLabel(rssi: number) {
  const b = signalBars(rssi);
  return b === 3 ? "Strong" : b === 2 ? "Moderate" : "Weak";
}

export const geofenceAlerts: {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "good" | "caution" | "alert";
}[] = [
  {
    id: "a1",
    title: "Entered Kitchen",
    detail: "Kitchen is a restricted zone",
    time: "Just now",
    tone: "alert",
  },
  {
    id: "a2",
    title: "Exited Safe Zone",
    detail: "Left the garden boundary",
    time: "10 mins ago",
    tone: "caution",
  },
  {
    id: "a3",
    title: "Approached Front Door",
    detail: "Stayed for 40 seconds, then returned",
    time: "42 mins ago",
    tone: "caution",
  },
  {
    id: "a4",
    title: "Exited Bedroom",
    detail: "Moved to the living room",
    time: "1 hr 20 mins ago",
    tone: "good",
  },
  {
    id: "a5",
    title: "Low beacon signal",
    detail: "Bathroom beacon dropped to -88 dBm",
    time: "2 hrs ago",
    tone: "caution",
  },
  {
    id: "a6",
    title: "Entered Living Room",
    detail: "Detected via Living Room Beacon",
    time: "3 hrs ago",
    tone: "good",
  },
];
