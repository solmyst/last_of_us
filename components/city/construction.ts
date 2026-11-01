import * as THREE from "three";
import type { SceneKit } from "./scene-kit";
import { createCharacter, crowdLook } from "./characters";
import { currently } from "@/lib/data";
export function createConstruction(parent: THREE.Object3D, kit: SceneKit) {
  const root = new THREE.Group();
  root.position.set(-33, 0, 22);
  root.userData = { buildingId: "about", floor: 2 };
  parent.add(root);
  kit.box(root, [8, 0.18, 10], [0, 0.15, 0], "#ac9b79");
  for (let floor = 0; floor < 3; floor++) {
    kit.box(root, [5, 0.2, 5], [0, 0.4 + floor * 2.7, -1], "#b8bab0");
    for (const x of [-2.2, 2.2]) for (const z of [-3.2, 1.2])
      kit.box(root, [0.2, 2.7, 0.2], [x, 1.8 + floor * 2.7, z], "#728b8c");
  }
  for (const x of [-3.8, 3.8]) for (let z = -4; z <= 4; z += 2) {
    kit.box(root, [0.08, 1.4, 0.08], [x, 0.9, z], "#d9a951");
    kit.box(root, [0.08, 0.5, 1.9], [x, 0.9, z], "#5b706a");
  }
  const crane = new THREE.Group();
  crane.position.set(-2.8, 0, -3.8); root.add(crane);
  kit.box(crane, [0.45, 13, 0.45], [0, 6.5, 0], "#e5b657");
  const boom = new THREE.Group(); boom.position.y = 12.5; crane.add(boom);
  kit.box(boom, [9, 0.35, 0.35], [2.5, 0, 0], "#e5b657");
  kit.box(boom, [1, 0.8, 0.8], [-1.5, -0.4, 0], "#42616b");
  const cable = kit.cylinder(boom, 0.025, 5, [5, -2.5, 0], "#344d58", 8);
  const load = kit.box(boom, [0.9, 0.4, 0.7], [5, -5, 0], "#ab9071");
  for (let i = 0; i < 4; i++) kit.box(root, [1.6, 0.22, 0.6], [1, 0.4 + i * 0.23, 3.8], "#af8a61");
  kit.label(root, "CURRENTLY BUILDING", [0, 10, 0], "#edca83", 6);
  kit.label(root, currently.learning, [0, 8.8, 0], "#edca83", 8);
  const workers = [0, 1, 2, 3].map((i) => {
    const look = { ...crowdLook(i + 30), top: "#dc9f3c", accent: "#e8e5ba", hairStyle: "cap" as const };
    const person = createCharacter(kit, look); root.add(person.root);
    kit.sphere(person.root, 0.27, [0, 2.22, 0], "#ecc35c");
    const tool = kit.box(person.root, [0.08, 0.65, 0.08], [0.45, 1.1, 0.2], "#788a8b");
    return { person, tool, i };
  });
  return { update(time: number, delta: number) {
    boom.rotation.y = Math.sin(time * 0.08) * 0.5;
    const lift = Math.sin(time * 0.3) * 1.1;
    cable.scale.y = (5 + lift) / 5; cable.position.y = -(5 + lift) / 2;
    load.position.y = -5 - lift;
    workers.forEach(({ person, tool, i }) => {
      const walking = i % 2 === 0;
      person.root.position.set(walking ? Math.sin(time * 0.3 + i) * 2.3 : 2, i === 3 ? 3.2 : 0.3, walking ? 2.6 : -1 + i * 0.4);
      person.root.rotation.y = walking ? Math.cos(time * 0.3 + i) > 0 ? Math.PI / 2 : -Math.PI / 2 : -Math.PI / 2;
      person.animate(delta, walking ? 0.8 : 0, false, time);
      tool.rotation.x = walking ? 0 : Math.sin(time * 3 + i) * 0.6;
    });
  }};
}
