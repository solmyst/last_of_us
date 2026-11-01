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
export function isBlocked(point: CityPoint, margin: number) {
  return cityBuildings.some(
    (building) =>
      Math.abs(point.x - building.x) < building.width / 2 + margin &&
      Math.abs(point.z - building.z) < building.depth / 2 + margin,
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
    Math.abs(x) <= 33 && Math.abs(z) <= 33 && !isBlocked({ x, z }, 1.1);
  const x = car.x + Math.sin(heading) * step,
    z = car.z + Math.cos(heading) * step;
  if (free(x, z)) return { x, z, heading, speed };
  // Scrape along a wall when one axis is still open, bounce off a head-on hit.
  if (free(x, car.z)) return { x, z: car.z, heading, speed: speed * 0.7 };
  if (free(car.x, z)) return { x: car.x, z, heading, speed: speed * 0.7 };
  return { x: car.x, z: car.z, heading, speed: -speed * 0.25 };
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
  let x = Math.max(-32, Math.min(32, position.x + dx));
  if (blocked(x, position.z)) x = position.x;
  let z = Math.max(-32, Math.min(32, position.z + dz));
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
