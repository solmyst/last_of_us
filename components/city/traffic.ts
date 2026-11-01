import * as THREE from "three";
import {
  laneLength,
  lanePoint,
  ringRoad,
  type CityPoint,
  type TrafficLane,
} from "@/lib/city-layout";
import type { SceneKit } from "./scene-kit";
const lanes: Array<{ lane: TrafficLane; cars: number; speed: number }> = [
  { lane: { kind: "ring", radius: ringRoad - 1.5, direction: 1 }, cars: 5, speed: 10 },
  { lane: { kind: "ring", radius: ringRoad + 1.5, direction: -1 }, cars: 5, speed: 11 },
  { lane: { kind: "street", axis: "z", at: -1.5, direction: 1 }, cars: 2, speed: 6 },
  { lane: { kind: "street", axis: "z", at: 1.5, direction: -1 }, cars: 2, speed: 6 },
  { lane: { kind: "street", axis: "x", at: 1.5, direction: 1 }, cars: 2, speed: 6 },
  { lane: { kind: "street", axis: "x", at: -1.5, direction: -1 }, cars: 2, speed: 6 },
];
const paints = ["#91bdbb", "#e7b58a", "#cab4e8", "#f4f1e8", "#d1495b", "#3d7ea6", "#f2cc8f", "#2f4858"];
function makeCar(kit: SceneKit, color: string, van: boolean) {
  const car = new THREE.Group();
  car.scale.setScalar(0.9);
  kit.box(car, [1, van ? 0.9 : 0.5, 2], [0, van ? 0.75 : 0.55, 0], color);
  kit.box(car, [0.86, 0.36, van ? 0.6 : 0.95], [0, van ? 1.3 : 0.95, van ? 0.55 : -0.1], "#203b47");
  for (const x of [-0.32, 0.32]) {
    kit.box(car, [0.22, 0.1, 0.04], [x, 0.6, 1.01], "#fff4d6", true);
    kit.box(car, [0.22, 0.1, 0.04], [x, 0.6, -1.01], "#ff4d5a", true);
  }
  for (const x of [-0.52, 0.52])
    for (const z of [-0.62, 0.62]) {
      const wheel = kit.cylinder(car, 0.22, 0.16, [x, 0.27, z], "#162f3b", 10);
      wheel.rotation.z = Math.PI / 2;
    }
  return car;
}
// Ambient traffic that follows lanes, keeps its distance and stops for the visitor.
export function createTraffic(parent: THREE.Object3D, kit: SceneKit) {
  let n = 0;
  const cars = lanes.flatMap(({ lane, cars: count, speed }, laneIndex) =>
    Array.from({ length: count }, (_, i) => {
      const root = makeCar(kit, paints[n % paints.length], n++ % 5 === 4);
      parent.add(root);
      return {
        lane,
        laneIndex,
        root,
        cruise: speed * (0.9 + (i % 3) * 0.08),
        speed: speed,
        s: (laneLength(lane) / count) * i + laneIndex * 7,
      };
    }),
  );
  const ahead = new THREE.Vector3();
  return {
    positions: () => cars.map(({ root }) => ({ x: root.position.x, z: root.position.z })),
    update(delta: number, obstacles: CityPoint[]) {
      for (const car of cars) {
        const length = laneLength(car.lane);
        // Gap to the next car in the same lane, measured along the lane.
        let gap = Infinity;
        for (const other of cars)
          if (other !== car && other.laneIndex === car.laneIndex)
            gap = Math.min(gap, (((other.s - car.s) % length) + length) % length || Infinity);
        const point = lanePoint(car.lane, car.s);
        ahead.set(point.x + Math.sin(point.heading) * 3, 0, point.z + Math.cos(point.heading) * 3);
        const yielding = obstacles.some(
          (obstacle) => Math.hypot(obstacle.x - ahead.x, obstacle.z - ahead.z) < 2.4,
        );
        const target = yielding || gap < 4.5 ? 0 : gap < 8 ? car.cruise * 0.5 : car.cruise;
        car.speed += (target - car.speed) * Math.min(1, delta * (target < car.speed ? 6 : 2));
        car.s += car.speed * delta;
        const next = lanePoint(car.lane, car.s);
        car.root.position.set(next.x, 0.02, next.z);
        car.root.rotation.y = next.heading;
      }
    },
  };
}
