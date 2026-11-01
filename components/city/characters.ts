import * as THREE from "three";
import type { SceneKit } from "./scene-kit";
export type Look = {
  skin: string;
  hair: string;
  top: string;
  accent: string;
  bottom: string;
  shoes: string;
  hairStyle: "short" | "long" | "bun" | "cap";
  backpack?: string;
};
export const heroLook: Look = {
  skin: "#c8976f",
  hair: "#1d1a1c",
  top: "#1f3b4a",
  accent: "#b9e5ce",
  bottom: "#2b3f63",
  shoes: "#eef2ea",
  hairStyle: "short",
  backpack: "#e69a6f",
};
const skins = ["#f0c9a5", "#d7a57f", "#b77b55", "#8d5a3c", "#e3b48e", "#6e4630"];
const hairs = ["#1d1a1c", "#3b2a20", "#6b4a2e", "#c9a46a", "#a24b32", "#d8d4cc"];
const tops = ["#e07a5f", "#3d7ea6", "#f2cc8f", "#81b29a", "#9b6fbf", "#e9e4d8", "#2f4858", "#d1495b"];
const bottoms = ["#2b3f63", "#3a3a3a", "#6b705c", "#a5a58d", "#1f2b38", "#8a5a44"];
const styles: Look["hairStyle"][] = ["short", "long", "bun", "cap"];
// Deterministic so the same crowd greets every visitor.
export function crowdLook(seed: number): Look {
  const pick = <T,>(list: T[], salt: number) =>
    list[(seed * 7 + salt * 13 + ((seed * salt) % 5)) % list.length];
  return {
    skin: pick(skins, 1),
    hair: pick(hairs, 2),
    top: pick(tops, 3),
    accent: pick(tops, 5),
    bottom: pick(bottoms, 4),
    shoes: pick(["#eef2ea", "#2a2a2a", "#c76b4a", "#4a6fa5"], 6),
    hairStyle: pick(styles, 7),
    backpack: seed % 3 === 0 ? pick(tops, 8) : undefined,
  };
}
export function createCharacter(kit: SceneKit, look: Look) {
  const root = new THREE.Group();
  root.scale.setScalar(0.72);
  const pivot = (parent: THREE.Object3D, x: number, y: number, z = 0) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  };
  const body = pivot(root, 0, 0.95);
  const legs = [-0.13, 0.13].map((x) => {
    const hip = pivot(body, x, 0);
    kit.box(hip, [0.2, 0.48, 0.22], [0, -0.22, 0], look.bottom);
    const knee = pivot(hip, 0, -0.45);
    kit.box(knee, [0.18, 0.42, 0.2], [0, -0.2, 0], look.bottom);
    kit.box(knee, [0.22, 0.12, 0.34], [0, -0.44, 0.05], look.shoes);
    return { hip, knee };
  });
  const torso = pivot(body, 0, 0);
  kit.box(torso, [0.56, 0.64, 0.32], [0, 0.34, 0], look.top);
  kit.box(torso, [0.18, 0.5, 0.03], [0, 0.34, 0.16], look.accent);
  kit.box(torso, [0.58, 0.08, 0.34], [0, 0.04, 0], look.bottom);
  if (look.backpack) {
    kit.box(torso, [0.42, 0.46, 0.18], [0, 0.36, -0.25], look.backpack);
    kit.box(torso, [0.3, 0.14, 0.06], [0, 0.24, -0.35], look.accent, true);
  }
  const arms = [-1, 1].map((side) => {
    const shoulder = pivot(torso, side * 0.36, 0.6);
    kit.box(shoulder, [0.15, 0.32, 0.17], [0, -0.14, 0], look.top);
    const elbow = pivot(shoulder, 0, -0.3);
    kit.box(elbow, [0.13, 0.28, 0.15], [0, -0.13, 0], look.top);
    kit.sphere(elbow, 0.085, [0, -0.32, 0], look.skin);
    return { shoulder, elbow };
  });
  const head = pivot(torso, 0, 0.68);
  kit.cylinder(head, 0.08, 0.1, [0, 0.02, 0], look.skin, 10);
  kit.box(head, [0.42, 0.44, 0.4], [0, 0.28, 0], look.skin);
  for (const x of [-0.09, 0.09])
    kit.box(head, [0.06, 0.08, 0.02], [x, 0.3, 0.2], "#16222a");
  kit.box(head, [0.46, 0.14, 0.44], [0, 0.5, -0.01], look.hair);
  kit.box(head, [0.46, 0.3, 0.1], [0, 0.36, -0.18], look.hair);
  if (look.hairStyle === "long")
    kit.box(head, [0.46, 0.5, 0.12], [0, 0.18, -0.2], look.hair);
  if (look.hairStyle === "bun") kit.sphere(head, 0.12, [0, 0.62, -0.12], look.hair);
  if (look.hairStyle === "cap") {
    kit.box(head, [0.48, 0.14, 0.46], [0, 0.56, 0], look.accent);
    kit.box(head, [0.4, 0.04, 0.22], [0, 0.5, 0.3], look.accent);
  }
  let phase = 0;
  return {
    root,
    // speed: 0 idle, 1 walk, ~1.8 sprint. airborne overrides the gait with a tuck.
    animate(delta: number, speed: number, airborne = false, time = 0) {
      phase += delta * (4 + speed * 5);
      const amount = Math.min(speed, 1.6) * 0.55;
      const swing = Math.sin(phase) * amount;
      legs.forEach(({ hip, knee }, i) => {
        const s = i ? -swing : swing;
        hip.rotation.x = airborne ? -0.7 + i * 0.4 : s;
        knee.rotation.x = airborne ? 1.1 : Math.max(0, -Math.sin(phase + i * Math.PI)) * amount * 1.4;
      });
      arms.forEach(({ shoulder, elbow }, i) => {
        shoulder.rotation.x = airborne ? -2.4 : i ? swing : -swing;
        shoulder.rotation.z = airborne ? (i ? -0.5 : 0.5) : 0;
        elbow.rotation.x = airborne ? 0 : -0.25 - amount * 0.7;
      });
      torso.rotation.x = Math.min(speed, 1.8) * 0.09;
      body.position.y = 0.95 + Math.abs(Math.sin(phase)) * 0.06 * Math.min(speed, 1.6) + (speed ? 0 : Math.sin(time * 2) * 0.008);
      head.rotation.y = speed ? 0 : Math.sin(time * 0.6) * 0.25;
    },
  };
}
export type Character = ReturnType<typeof createCharacter>;
