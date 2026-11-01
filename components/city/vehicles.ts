import * as THREE from "three";
import type { SceneKit } from "./scene-kit";
// The hero's coupe. Forward is +z, matching the character and driveCar heading.
export function createHeroCar(kit: SceneKit) {
  const root = new THREE.Group();
  root.scale.setScalar(0.65);
  const body = new THREE.Group();
  root.add(body);
  kit.box(body, [1.9, 0.42, 3.9], [0, 0.55, 0], "#e69a6f");
  kit.box(body, [1.94, 0.12, 3.95], [0, 0.36, 0], "#1d2b33");
  kit.box(body, [1.55, 0.46, 1.9], [0, 0.98, -0.25], "#1c3440");
  kit.box(body, [1.6, 0.06, 1.7], [0, 1.22, -0.3], "#e69a6f");
  for (const x of [-0.32, 0.32])
    kit.box(body, [0.16, 0.02, 3.92], [x, 0.77, 0], "#b9e5ce");
  kit.box(body, [1.7, 0.08, 0.35], [0, 1.05, -1.85], "#1d2b33");
  for (const x of [-0.7, 0.7]) {
    kit.box(body, [0.08, 0.3, 0.08], [x, 0.88, -1.8], "#1d2b33");
    kit.box(body, [0.42, 0.14, 0.06], [x, 0.6, 1.96], "#fff6d8", true);
    kit.box(body, [0.42, 0.12, 0.06], [x, 0.6, -1.96], "#ff4d5a", true);
  }
  const wheels = [-1, 1].flatMap((side) =>
    [-1.25, 1.25].map((z) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.95, 0.38, z);
      body.add(pivot);
      const tyre = kit.cylinder(pivot, 0.38, 0.3, [0, 0, 0], "#111a20", 18);
      tyre.rotation.z = Math.PI / 2;
      const rim = kit.cylinder(pivot, 0.2, 0.32, [0, 0, 0], "#d9e2df", 12);
      rim.rotation.z = Math.PI / 2;
      return { pivot, spin: [tyre, rim], front: z > 0 };
    }),
  );
  // Hidden by day so every material isn't shading an extra light for nothing.
  const headlight = new THREE.SpotLight(0xfff1cc, 60, 34, 0.55, 0.6, 1.2);
  headlight.visible = false;
  headlight.position.set(0, 0.7, 1.9);
  headlight.target.position.set(0, 0, 9);
  root.add(headlight, headlight.target);
  let roll = 0;
  return {
    root,
    setNight(value: boolean) {
      headlight.visible = value;
    },
    animate(delta: number, speed: number, steer: number) {
      for (const wheel of wheels) {
        for (const part of wheel.spin) part.rotation.x += (speed * delta) / (0.38 * 0.65);
        if (wheel.front) wheel.pivot.rotation.y = -steer * 0.45;
      }
      // Body leans out of corners and squats under speed for weight.
      roll += (steer * Math.min(Math.abs(speed), 20) * 0.006 - roll) * Math.min(1, delta * 8);
      body.rotation.z = roll;
      body.rotation.x = -Math.min(Math.abs(speed), 30) * 0.0015;
    },
  };
}
