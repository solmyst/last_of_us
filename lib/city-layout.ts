export type CityKind =
  "project" | "experience" | "skills" | "about" | "decisions" | "contact";
export type CityBuilding = {
  id: string;
  name: string;
  kind: CityKind;
  x: number;
  z: number;
  width: number;
  depth: number;
  color: string;
  floors: string[];
  style:
    "studio" | "tower" | "warehouse" | "academy" | "observatory" | "terminal";
};
const projectFloors = [
  "The problem & outcome",
  "Engineering & architecture",
  "Decisions & tradeoffs",
];
export const cityBuildings: CityBuilding[] = [
  {
    id: "krate",
    name: "krate Works",
    kind: "project",
    x: -22,
    z: -22,
    width: 6,
    depth: 6,
    color: "#e2bb72",
    floors: projectFloors,
    style: "warehouse",
  },
  {
    id: "interview-ace",
    name: "InterviewAce Studios",
    kind: "project",
    x: -8,
    z: -22,
    width: 6,
    depth: 6,
    color: "#9fdfc8",
    floors: projectFloors,
    style: "studio",
  },
  {
    id: "relay-voice",
    name: "Relay Voice Tower",
    kind: "project",
    x: 8,
    z: -22,
    width: 6,
    depth: 6,
    color: "#eeab91",
    floors: projectFloors,
    style: "tower",
  },
  {
    id: "resume-tailor",
    name: "Resume Tailor Atelier",
    kind: "project",
    x: 22,
    z: -22,
    width: 6,
    depth: 6,
    color: "#a6c9ed",
    floors: projectFloors,
    style: "studio",
  },
  {
    id: "memeforge",
    name: "MemeForge House",
    kind: "project",
    x: -22,
    z: -8,
    width: 6,
    depth: 6,
    color: "#cab4e8",
    floors: projectFloors,
    style: "studio",
  },
  {
    id: "experience",
    name: "Experience HQ",
    kind: "experience",
    x: -8,
    z: -8,
    width: 7,
    depth: 7,
    color: "#e7cf96",
    floors: [
      "Motor Insurance / Park+",
      "Automotive & Discovery",
      "Execution & Growth",
      "Onboarding & Foundations",
    ],
    style: "tower",
  },
  {
    id: "skills",
    name: "Skills Academy",
    kind: "skills",
    x: 8,
    z: -8,
    width: 7,
    depth: 7,
    color: "#91c5db",
    floors: [
      "Product",
      "Data",
      "Design",
      "Languages",
      "Frameworks",
      "Tools",
      "Databases",
      "Concepts",
    ],
    style: "academy",
  },
  {
    id: "f1-dashboard",
    name: "Pit Wall Garage",
    kind: "project",
    x: 22,
    z: -8,
    width: 6,
    depth: 6,
    color: "#e79881",
    floors: projectFloors,
    style: "warehouse",
  },
  {
    id: "trip-helper",
    name: "Trip Helper Station",
    kind: "project",
    x: -22,
    z: 8,
    width: 6,
    depth: 6,
    color: "#a9ce97",
    floors: projectFloors,
    style: "terminal",
  },
  {
    id: "about",
    name: "The Observatory",
    kind: "about",
    x: 8,
    z: 8,
    width: 7,
    depth: 7,
    color: "#c2b7e7",
    floors: ["Meet Anush", "The journey", "Outside the screen"],
    style: "observatory",
  },
  {
    id: "sand-art",
    name: "Sand Lab",
    kind: "project",
    x: 22,
    z: 8,
    width: 6,
    depth: 6,
    color: "#ebce8d",
    floors: projectFloors,
    style: "studio",
  },
  {
    id: "ascii-camera",
    name: "ASCII Camera Club",
    kind: "project",
    x: -22,
    z: 22,
    width: 6,
    depth: 6,
    color: "#9ad6c9",
    floors: projectFloors,
    style: "studio",
  },
  {
    id: "decisions",
    name: "Decisions Library",
    kind: "decisions",
    x: -8,
    z: 22,
    width: 7,
    depth: 7,
    color: "#adbdc7",
    floors: [
      "Coaching into practice",
      "Conversation before automation",
      "Go vs. Rust",
      "The tailoring engine",
      "Local vision models",
      "State management",
      "Styling systems",
    ],
    style: "academy",
  },
  {
    id: "contact",
    name: "Contact Terminal",
    kind: "contact",
    x: 8,
    z: 22,
    width: 7,
    depth: 7,
    color: "#a8dfbe",
    floors: ["Start a conversation"],
    style: "terminal",
  },
];
export type CityPoint = { x: number; z: number };
export type CityRoute = { id: string; floor: number; reading: boolean };
export const floorHeight = 3.2;
// The district sits on an island; a ring highway circles it inside the beach.
export const islandEdge = 49;
export const ringRoad = 44;
// Solid landmarks outside the building grid, as footprint boxes.
export const cityProps = [
  { id: "ferris-wheel", x: -28, z: -38.5, width: 13, depth: 2.4 },
  { id: "lighthouse", x: 38.5, z: -38.5, width: 3.4, depth: 3.4 },
];
export function isBlocked(point: CityPoint, margin: number) {
  return [...cityBuildings, ...cityProps].some(
    (item) =>
      Math.abs(point.x - item.x) < item.width / 2 + margin &&
      Math.abs(point.z - item.z) < item.depth / 2 + margin,
  );
}
export type CarState = { x: number; z: number; heading: number; speed: number };
export type CarInput = {
  throttle: number;
  steer: number;
  boost: boolean;
  brake: boolean;
};
// Arcade handling: heading is the yaw whose forward vector is (sin, cos).
export function driveCar(car: CarState, input: CarInput, delta: number): CarState {
  const dt = Math.min(Math.max(delta, 0), 0.1);
  const top = input.boost ? 30 : 20;
  let speed = car.speed;
  if (input.throttle) {
    const braking = speed && Math.sign(input.throttle) !== Math.sign(speed);
    speed += input.throttle * (braking ? 32 : input.boost ? 22 : 14) * dt;
  } else speed -= Math.sign(speed) * Math.min(Math.abs(speed), 6 * dt);
  if (input.brake) speed -= Math.sign(speed) * Math.min(Math.abs(speed), 26 * dt);
  speed = Math.max(-8, Math.min(speed, Math.max(top, car.speed - 20 * dt)));
  const grip = Math.max(-1, Math.min(1, speed / 6));
  const heading =
    car.heading - input.steer * (input.brake ? 3.4 : 2.3) * grip * dt;
  const step = speed * dt;
  const free = (x: number, z: number) =>
    Math.abs(x) <= islandEdge - 1 &&
    Math.abs(z) <= islandEdge - 1 &&
    !isBlocked({ x, z }, 1.1);
  const x = car.x + Math.sin(heading) * step,
    z = car.z + Math.cos(heading) * step;
  if (free(x, z)) return { x, z, heading, speed };
  // Scrape along a wall when one axis is still open, bounce off a head-on hit.
  if (free(x, car.z)) return { x, z: car.z, heading, speed: speed * 0.7 };
  if (free(car.x, z)) return { x: car.x, z, heading, speed: speed * 0.7 };
  return { x: car.x, z: car.z, heading, speed: -speed * 0.25 };
}
// Ambient traffic: a point and heading at distance s along a lane.
export type TrafficLane =
  | { kind: "ring"; radius: number; direction: 1 | -1 }
  | { kind: "street"; axis: "x" | "z"; at: number; direction: 1 | -1 };
export function laneLength(lane: TrafficLane) {
  return lane.kind === "ring" ? lane.radius * 8 : ringRoad * 2;
}
export function lanePoint(lane: TrafficLane, s: number) {
  const length = laneLength(lane);
  const d = ((s % length) + length) % length;
  if (lane.kind === "street") {
    const along = (d - ringRoad) * lane.direction;
    return lane.axis === "z"
      ? { x: lane.at, z: along, heading: lane.direction > 0 ? 0 : Math.PI }
      : { x: along, z: lane.at, heading: (lane.direction * Math.PI) / 2 };
  }
  // Walk the square ring clockwise (direction 1) or counter-clockwise.
  const r = lane.radius,
    side = 2 * r;
  const t = lane.direction > 0 ? d : length - d;
  const leg = Math.min(3, Math.floor(t / side)),
    u = t - leg * side - r;
  const corners = [
    { x: u, z: -r, heading: Math.PI / 2 },
    { x: r, z: u, heading: 0 },
    { x: -u, z: r, heading: -Math.PI / 2 },
    { x: -r, z: -u, heading: Math.PI },
  ][leg];
  return lane.direction > 0
    ? corners
    : { ...corners, heading: corners.heading + Math.PI };
}
export const cityMissions = [
  {
    id: "recruiter",
    title: "The Recruiter's Tour",
    stops: ["about", "interview-ace", "relay-voice", "contact"],
  },
  {
    id: "engineer",
    title: "Under the Hood",
    stops: ["krate", "skills", "decisions"],
  },
];
export function doorPoint(id: string): CityPoint | null {
  const building = cityBuildings.find((item) => item.id === id);
  return building
    ? { x: building.x, z: building.z + building.depth / 2 + 1.2 }
    : null;
}
export function moveCitizen(
  position: CityPoint,
  input: CityPoint,
  delta: number,
  speed = 6,
): CityPoint {
  const length = Math.hypot(input.x, input.z);
  if (!length) return { ...position };
  const distance = Math.min(Math.max(delta, 0), 0.2) * speed;
  const dx = (input.x / Math.max(length, 1)) * distance,
    dz = (input.z / Math.max(length, 1)) * distance;
  const blocked = (x: number, z: number) => isBlocked({ x, z }, 0.45);
  let x = Math.max(-islandEdge, Math.min(islandEdge, position.x + dx));
  if (blocked(x, position.z)) x = position.x;
  let z = Math.max(-islandEdge, Math.min(islandEdge, position.z + dz));
  if (blocked(x, z)) z = position.z;
  return { x, z };
}
export function nearestDoor(position: CityPoint): CityBuilding | null {
  let nearest: CityBuilding | null = null,
    distance = 3;
  for (const building of cityBuildings) {
    const candidate = Math.hypot(
      position.x - building.x,
      position.z - (building.z + building.depth / 2 + 1),
    );
    if (candidate < distance) {
      distance = candidate;
      nearest = building;
    }
  }
  return nearest;
}
export function cityRoute(route: CityRoute) {
  return `#city/${encodeURIComponent(route.id)}/${route.floor + 1}${route.reading ? "/read" : ""}`;
}
export function parseCityRoute(hash: string): CityRoute | null {
  const match = /^#city\/([a-z0-9-]+)\/(\d+)(\/read)?$/.exec(hash);
  if (!match) return null;
  const building = cityBuildings.find((item) => item.id === match[1]);
  const floor = Number(match[2]) - 1;
  return building &&
    Number.isSafeInteger(floor) &&
    floor >= 0 &&
    floor < building.floors.length
    ? { id: building.id, floor, reading: !!match[3] }
    : null;
}
