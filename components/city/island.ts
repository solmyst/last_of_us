import * as THREE from "three";
import { cityProps, islandEdge, ringRoad } from "@/lib/city-layout";
import type { SceneKit } from "./scene-kit";
const road = "#304650";
const paint = "#c6c8aa";
// Island ground, streets, ring highway, beach, ocean and the waterfront landmarks.
export function buildIsland(city: THREE.Group, scene: THREE.Scene, kit: SceneKit) {
  const size = islandEdge * 2 + 2;
  kit.box(city, [size, 1.6, size], [0, -0.95, 0], "#304e5a");
  kit.box(city, [size - 2, 0.2, size - 2], [0, -0.05, 0], "#688c87");
  // Beach band between the highway and the water.
  for (const side of [-1, 1]) {
    kit.box(city, [size - 2, 0.22, 2.8], [0, -0.03, side * (islandEdge - 0.4)], "#e3cf9f");
    kit.box(city, [2.8, 0.22, size - 2], [side * (islandEdge - 0.4), -0.03, 0], "#e3cf9f");
  }
  const reach = ringRoad + 3;
  for (const p of [-15, 0, 15]) {
    kit.box(city, [p === 0 ? 6 : 3.5, 0.035, reach * 2], [p, 0.075, 0], road);
    kit.box(city, [reach * 2, 0.035, p === 0 ? 6 : 3.5], [0, 0.077, p], road);
  }
  for (let i = -39; i <= 39; i += 3) {
    kit.box(city, [0.08, 0.012, 1.2], [0, 0.101, i], paint);
    kit.box(city, [1.2, 0.012, 0.08], [i, 0.102, 0], paint);
  }
  // Ring highway with a dashed centre line.
  for (const side of [-1, 1]) {
    kit.box(city, [reach * 2, 0.04, 6], [0, 0.079, side * ringRoad], road);
    kit.box(city, [6, 0.04, reach * 2], [side * ringRoad, 0.08, 0], road);
    for (let i = -ringRoad + 2; i <= ringRoad - 2; i += 3) {
      kit.box(city, [1.2, 0.012, 0.08], [i, 0.104, side * ringRoad], paint);
      kit.box(city, [0.08, 0.012, 1.2], [side * ringRoad, 0.105, i], paint);
    }
  }
  // Street lamps on the inner kerb of the highway; their heads glow at night.
  for (let i = -36; i <= 36; i += 12)
    for (const [x, z] of [
      [i, -ringRoad + 3.6],
      [i, ringRoad - 3.6],
      [-ringRoad + 3.6, i],
      [ringRoad - 3.6, i],
    ]) {
      if (Math.abs(x) < 3.5 || Math.abs(z) < 3.5) continue;
      kit.cylinder(city, 0.08, 4.4, [x, 2.2, z], "#5b7077", 8);
      kit.box(city, [0.8, 0.14, 0.5], [x, 4.45, z], "#ffe2a8", true);
    }
  // Palms along the beach.
  for (let i = -42; i <= 42; i += 14)
    for (const [x, z] of [
      [i + 4, -islandEdge + 0.6],
      [i - 3, islandEdge - 0.6],
      [-islandEdge + 0.6, i + 2],
      [islandEdge - 0.6, i - 5],
    ]) {
      const palm = new THREE.Group();
      palm.position.set(x, 0, z);
      palm.rotation.y = x * 0.37 + z;
      city.add(palm);
      for (let k = 0; k < 5; k++)
        kit.cylinder(palm, 0.16 - k * 0.015, 0.95, [k * 0.12, 0.5 + k * 0.9, 0], "#9a7b55", 8);
      for (let leaf = 0; leaf < 6; leaf++) {
        const frond = kit.box(palm, [2.2, 0.06, 0.5], [0.6, 4.7, 0], "#4f9a6c");
        frond.rotation.set(0, (leaf / 6) * Math.PI * 2, -0.35);
        frond.position.set(0.6 + Math.cos((leaf / 6) * Math.PI * 2) * 0.9, 4.7, -Math.sin((leaf / 6) * Math.PI * 2) * 0.9);
      }
    }
  // Pier into the south bay with a kiosk at the end.
  for (let z = islandEdge; z < islandEdge + 14; z += 1)
    kit.box(city, [3.4, 0.14, 0.9], [8, 0.15, z + 0.5], "#b98a5e");
  for (let z = islandEdge + 1; z < islandEdge + 14; z += 3)
    for (const x of [6.5, 9.5]) kit.cylinder(city, 0.12, 2, [x, -0.6, z], "#6b5038", 8);
  kit.box(city, [3, 1.8, 2.4], [8, 1.1, islandEdge + 12.5], "#e69a6f");
  kit.box(city, [3.6, 0.2, 3], [8, 2.1, islandEdge + 12.5], "#f2c46d");

  // Ocean: a wide plane whose surface swells in the vertex shader.
  const waves = { value: 0 };
  const oceanMaterial = kit.track(
    new THREE.MeshStandardMaterial({ color: "#2f7d8c", roughness: 0.3, metalness: 0.2 }),
  );
  oceanMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uWaves = waves;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uWaves;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\ntransformed.z += sin(position.x * 0.09 + uWaves) * 0.22 + cos(position.y * 0.12 + uWaves * 0.8) * 0.18;",
      );
  };
  const ocean = new THREE.Mesh(
    kit.track(new THREE.PlaneGeometry(1100, 1100, 160, 160)),
    oceanMaterial,
  );
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -0.55;
  ocean.receiveShadow = true;
  scene.add(ocean);

  // Ferris wheel on the north waterfront.
  const ferrisProp = cityProps.find((prop) => prop.id === "ferris-wheel")!;
  const ferris = new THREE.Group();
  ferris.position.set(ferrisProp.x, 0, ferrisProp.z);
  city.add(ferris);
  for (const x of [-1.6, 1.6])
    for (const z of [-0.9, 0.9]) {
      const leg = kit.box(ferris, [0.25, 8.4, 0.25], [x * 0.5, 3.9, z], "#d9e2df");
      leg.rotation.z = x > 0 ? -0.2 : 0.2;
    }
  const wheel = new THREE.Group();
  wheel.position.y = 7.8;
  ferris.add(wheel);
  for (const z of [-0.45, 0.45]) {
    const rim = new THREE.Mesh(
      kit.track(new THREE.TorusGeometry(6, 0.09, 8, 64)),
      kit.material("#f4f1e8"),
    );
    rim.position.z = z;
    wheel.add(rim);
  }
  const bulbs = ["#f2c46d", "#b9e5ce", "#e69a6f", "#cab4e8"];
  const gondolas: THREE.Group[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const spoke = kit.box(wheel, [0.08, 6, 0.08], [Math.cos(angle) * 3, Math.sin(angle) * 3, 0], "#d9e2df");
    spoke.rotation.z = angle - Math.PI / 2;
    kit.sphere(wheel, 0.16, [Math.cos(angle + 0.26) * 6, Math.sin(angle + 0.26) * 6, 0.5], bulbs[i % 4]).material = kit.material(bulbs[i % 4], true);
    const gondola = new THREE.Group();
    gondola.position.set(Math.cos(angle) * 6, Math.sin(angle) * 6, 0);
    wheel.add(gondola);
    kit.box(gondola, [0.9, 0.8, 0.8], [0, -0.75, 0], bulbs[i % 4]);
    kit.box(gondola, [0.95, 0.1, 0.85], [0, -0.3, 0], "#1d2b33");
    gondolas.push(gondola);
  }
  kit.cylinder(wheel, 0.35, 1.4, [0, 0, 0], "#1d2b33", 16).rotation.x = Math.PI / 2;

  // Lighthouse with a sweeping beam after dark.
  const lightProp = cityProps.find((prop) => prop.id === "lighthouse")!;
  const lighthouse = new THREE.Group();
  lighthouse.position.set(lightProp.x, 0, lightProp.z);
  city.add(lighthouse);
  for (let i = 0; i < 5; i++)
    kit.cylinder(lighthouse, 1.5 - i * 0.14, 2, [0, 1 + i * 2, 0], i % 2 ? "#d1495b" : "#f4f1e8", 24, 1.36 - i * 0.14);
  kit.cylinder(lighthouse, 0.85, 1.2, [0, 10.6, 0], "#fff1c2").material = kit.material("#fff1c2", true);
  kit.cylinder(lighthouse, 1.1, 0.25, [0, 10, 0], "#1d2b33", 24);
  kit.cylinder(lighthouse, 1.05, 1, [0, 11.7, 0], "#1d2b33", 8, 0.05);
  const beam = new THREE.Mesh(
    kit.track(new THREE.ConeGeometry(3.4, 34, 24, 1, true)),
    kit.track(
      new THREE.MeshBasicMaterial({
        color: 0xfff1c2,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  beam.geometry.translate(0, -17, 0);
  beam.rotation.z = Math.PI / 2 + 0.06;
  const beamPivot = new THREE.Group();
  beamPivot.position.y = 10.6;
  beamPivot.add(beam);
  beamPivot.visible = false;
  lighthouse.add(beamPivot);

  return {
    update(elapsed: number) {
      waves.value = elapsed * 1.2;
      wheel.rotation.z = elapsed * 0.12;
      for (const gondola of gondolas) gondola.rotation.z = -wheel.rotation.z;
      beamPivot.rotation.y = elapsed * 0.8;
    },
    setNight(value: boolean) {
      beamPivot.visible = value;
    },
  };
}
