export type District = "All builds" | "AI & voice" | "Systems" | "Playground";
export const districts: District[] = [
  "All builds",
  "AI & voice",
  "Systems",
  "Playground",
];

export const landmarks = [
  {
    id: "interview-ace",
    label: "Interview studio",
    short: "InterviewAce",
    type: "studio",
    x: -2.1,
    z: -1.7,
    color: "#a2dfca",
    category: "AI & voice",
    description: "Practice. Reflect. Try again.",
  },
  {
    id: "relay-voice",
    label: "Voice tower",
    short: "Relay Voice",
    type: "tower",
    x: 1.6,
    z: -1.8,
    color: "#eeaa8e",
    category: "AI & voice",
    description: "Conversations with a next step.",
  },
  {
    id: "krate",
    label: "Container yard",
    short: "krate",
    type: "containers",
    x: -2.7,
    z: 1.6,
    color: "#e4c68f",
    category: "Systems",
    description: "Small boxes. Deep systems.",
  },
  {
    id: "resume-tailor",
    label: "Resume workshop",
    short: "Resume Tailor",
    type: "workshop",
    x: 0.8,
    z: 1.9,
    color: "#a8c9ec",
    category: "AI & voice",
    description: "Experience, translated to opportunity.",
  },
  {
    id: "sand-art",
    label: "The sandbox",
    short: "Sand Art",
    type: "sandbox",
    x: 3.8,
    z: 0.6,
    color: "#cebae8",
    category: "Playground",
    description: "A little gravity. A lot of possibility.",
  },
] as const;

export const tourIds = ["interview-ace", "relay-voice", "krate"];
export function projectDistrict(id: string): Exclude<District, "All builds"> {
  if (
    ["interview-ace", "relay-voice", "resume-tailor", "memeforge"].includes(id)
  )
    return "AI & voice";
  if (["krate", "trip-helper"].includes(id)) return "Systems";
  return "Playground";
}

export const buildOrder = [
  "interview-ace",
  "relay-voice",
  "krate",
  "resume-tailor",
  "memeforge",
  "f1-dashboard",
  "trip-helper",
  "sand-art",
  "ascii-camera",
];
