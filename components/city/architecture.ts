import * as THREE from "three";
import {
  cityBuildings,
  floorHeight,
  type CityBuilding,
} from "@/lib/city-layout";
import { floorContent } from "@/lib/city-content";
import { createSceneKit, type SceneKit } from "./scene-kit";
import { createLandmark } from "./landmarks";
export type BuiltBlock = {
  root: THREE.Group;
  floors: THREE.Group[];
  beacon: THREE.Mesh;
  name: THREE.Sprite;
};
export function buildDistrict(parent: THREE.Group, kit: SceneKit) {
  const blocks = new Map<string, BuiltBlock>();
  const glasses: THREE.MeshStandardMaterial[] = [];
  for (const building of cityBuildings) {
    const root = new THREE.Group();
    root.position.set(building.x, 0, building.z);
    root.userData.buildingId = building.id;
    parent.add(root);
    const w = building.width, d = building.depth;
    kit.box(root, [w + 2, 0.2, d + 2], [0, 0.1, 0], "#738b82");
    kit.box(root, [w + 0.5, 0.25, d + 0.5], [0, 0.32, 0], "#c8c9b5");
    kit.box(root, [1.7, 0.22, 1.8], [0, 0.5, d / 2 + 0.55], "#d6d3bc");
    const landmark = createLandmark(kit, root, building);
    glasses.push(landmark.glass);
    const roof = 0.5 + building.floors.length * floorHeight;
    const name = kit.label(root, building.name, [0, roof + 4.3, 0], building.color, 8);
    name.userData = { buildingId: building.id, floor: 0 };
    const beacon = kit.ring(root, Math.max(w, d) * 0.72, [0, 0.25, 0], building.color);
    beacon.visible = false;
    blocks.set(building.id, { root, floors: landmark.floors, beacon, name });
  }
  return {
    blocks,
    setNight(night: boolean) {
      for (const glass of glasses) glass.emissiveIntensity = night ? 0.32 : 0.08;
    },
  };
}
export function createFloorRoom(building: CityBuilding, floor: number) {
  const kit = createSceneKit();
  const root = new THREE.Group();
  const floorY = 0.5 + floor * floorHeight;
  root.position.set(building.x, floorY, building.z);
  const width = building.width,
    depth = building.depth,
    content = floorContent(building, floor);
  kit.box(root, [width + 0.4, 0.2, depth + 0.4], [0, 0.05, 0], "#adc4bd");
  for (let i = -3; i <= 3; i++) {
    kit.box(root, [0.018, 0.005, depth], [i, 0.156, 0], "#809c98");
    kit.box(root, [width, 0.005, 0.018], [0, 0.156, i], "#809c98");
  }
  kit.box(root, [width, 2.85, 0.16], [0, 1.5, -depth / 2], "#183542");
  kit.box(root, [0.12, 2.85, depth], [-width / 2, 1.5, 0], "#365361");
  // The front and right walls are cut away, so this is a real open 3D room.
  for (const x of [-width / 2, width / 2])
    for (const z of [-depth / 2, depth / 2])
      kit.box(root, [0.12, 3.1, 0.12], [x, 1.6, z], building.color);
  kit.box(root, [width, 0.12, 0.1], [0, 3.1, -depth / 2], building.color);
  kit.box(root, [0.1, 0.12, depth], [-width / 2, 3.1, 0], building.color);
  const display = new THREE.Mesh(
    kit.track(new THREE.PlaneGeometry(width * 0.79, 2.5)),
    kit.track(
      new THREE.MeshBasicMaterial({
        map: kit.screenTexture(
          content.title,
          `${building.name} / Floor ${floor + 1}`,
          content.sections[0]?.text ??
            content.sections[0]?.bullets?.join(" · ") ??
            content.subtitle,
          building.color,
        ),
      }),
    ),
  );
  display.position.set(0, 1.7, -depth / 2 + 0.1);
  display.userData.action = "read";
  root.add(display);
  const desk = kit.box(
    root,
    [width * 0.57, 0.14, 1.2],
    [-0.3, 1.02, -0.55],
    "#c1a782",
  );
  desk.userData.action = "read";
  for (const x of [-1.4, 0.8])
    for (const z of [-1, 0.0])
      kit.box(root, [0.09, 0.9, 0.09], [x, 0.55, z], "#33525a");
  kit.box(
    root,
    [0.75, 0.55, 0.065],
    [-0.3, 1.4, -0.65],
    "#102e3e",
  ).userData.action = "read";
  kit.box(root, [0.85, 0.06, 0.55], [-0.3, 1.13, -0.35], "#718c94");
  kit.box(root, [0.7, 0.12, 0.7], [-0.3, 0.6, 0.65], "#476f74");
  kit.box(root, [0.7, 0.75, 0.1], [-0.3, 0.92, 1.02], "#476f74");
  kit.box(
    root,
    [0.12, 2.2, 1.2],
    [-width / 2 + 0.45, 1.25, -1],
    building.color,
  );
  for (let i = 0; i < 3; i++) {
    kit.box(
      root,
      [0.9, 0.07, 1.2],
      [-width / 2 + 0.8, 0.5 + i * 0.7, -1],
      "#a1b1a1",
    );
    for (let j = 0; j < 3; j++)
      kit.box(
        root,
        [0.16, 0.4, 0.22],
        [-width / 2 + 0.57 + j * 0.22, 0.72 + i * 0.7, -0.7],
        j % 2 ? building.color : "#ddcfaf",
      );
  }
  kit.cylinder(
    root,
    0.3,
    0.42,
    [width / 2 - 0.65, 0.36, -depth / 2 + 0.65],
    "#bca788",
  );
  kit.sphere(root, 0.5, [width / 2 - 0.65, 1.05, -depth / 2 + 0.65], "#6ba78d");
  kit.label(
    root,
    `F${String(floor + 1).padStart(2, "0")} / ${building.floors[floor]}`,
    [0, 3.9, -depth / 2],
    building.color,
    7,
  );
  const halo = kit.ring(root, 0.6, [0, 0.18, depth / 2 - 0.75], building.color);
  halo.userData.action = "exit";
  return { root, kit, floorY };
}
