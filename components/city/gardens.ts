import * as THREE from "three";
import type { SceneKit } from "./scene-kit";

export function buildGardens(parent: THREE.Group, kit: SceneKit) {
  const garden = new THREE.Group();
  parent.add(garden);
  const pond = kit.cylinder(garden, 3.4, 0.08, [23, 0.27, 23], "#4f9296", 64);
  pond.scale.z = 0.7;
  pond.material = kit.finish("#487e81", "glass");
  for (let i = 0; i < 3; i++) {
    const ripple = kit.ring(garden, 0.45 + i * 0.35, [24, 0.33, 23.2], "#8ebbb1");
    ripple.scale.z = 0.7;
  }
  // An arched footbridge is modelled from short tangent segments.
  for (let i = 0; i < 12; i++) {
    const t = i / 11, x = 19.5 + t * 7;
    const y = 0.45 + Math.sin(t * Math.PI) * 0.9;
    const plank = kit.box(garden, [0.65, 0.12, 1.1], [x, y, 22], "#af7954");
    plank.rotation.z = Math.cos(t * Math.PI) * 0.35;
    for (const side of [-1, 1]) {
      kit.cylinder(garden, 0.04, 0.65, [x, y + 0.32, 22 + side * 0.55], "#7c5c43", 8);
    }
  }
  for (const [x, z, size] of [[29, 27, 1.3], [19, 28, 1], [-29, -27, 1], [-29, 17, 1.2], [3, 28, 1.1]] as const) {
    kit.cylinder(garden, 0.11, 1.8, [x, 1.1, z], "#897365", 16);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 0.4;
      const crown = kit.sphere(garden, size * 0.78, [x + Math.cos(angle) * size * 0.55, 2.4 + (i % 2) * 0.4, z + Math.sin(angle) * size * 0.55], i % 2 ? "#dfbdbe" : "#eacdc9");
      crown.scale.y = 0.75;
    }
  }
  for (let i = 0; i < 9; i++) {
    const stone = kit.sphere(garden, 0.42, [18.5 + i * 0.65, 0.3, 26 + Math.sin(i * 0.6) * 0.7], "#afb5a1");
    stone.scale.set(1, 0.22, 0.65);
  }
  // A small bamboo grove frames the eastern arrival path.
  for (let i = 0; i < 12; i++) {
    const x = 29 + (i % 3) * 0.45, z = -27 + Math.floor(i / 3) * 0.5;
    const h = 2.4 + (i % 4) * 0.35;
    kit.cylinder(garden, 0.045, h, [x, h / 2, z], "#68866b", 8);
    const leaves = kit.sphere(garden, 0.36, [x, h * 0.8, z], "#597c60");
    leaves.scale.set(1.3, 0.35, 0.8);
  }
}
