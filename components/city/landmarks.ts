import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { type CityBuilding, floorHeight } from "@/lib/city-layout";
import type { SceneKit } from "./scene-kit";

export type Architecture = "interlock" | "pagoda" | "ribbon" | "origami" | "capsule" | "bridge" | "helix" | "speed" | "gateway" | "orbit" | "dune" | "pixels" | "library" | "lotus";
export const landmarkStyles: Record<string, Architecture> = {
  krate: "interlock", "interview-ace": "pagoda", "relay-voice": "ribbon",
  "resume-tailor": "origami", memeforge: "capsule", experience: "bridge",
  skills: "helix", "f1-dashboard": "speed", "trip-helper": "gateway",
  about: "orbit", "sand-art": "dune", "ascii-camera": "pixels",
  decisions: "library", contact: "lotus",
};

// A continuous curved roof: corners lift away from the central ridge.
// The mesh is original geometry, inspired by East Asian eaves rather than a replica.
function eave(kit: SceneKit, parent: THREE.Group, width: number, depth: number, y: number, color: string, lift = 0.65) {
  const vertices: number[] = [], indices: number[] = [], uv: number[] = [];
  const steps = 16;
  for (let j = 0; j <= steps; j++) for (let i = 0; i <= steps; i++) {
    const u = i / steps * 2 - 1, v = j / steps * 2 - 1;
    const ridge = 0.62 * Math.pow(1 - Math.abs(v), 1.3);
    const corner = lift * Math.pow(Math.abs(u * v), 2.5);
    vertices.push(u * width / 2, y + ridge + corner, v * depth / 2);
    uv.push(i / steps, j / steps);
    if (i < steps && j < steps) {
      const a = j * (steps + 1) + i, b = a + steps + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = kit.track(new THREE.BufferGeometry());
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = kit.finish(color, "metal");
  material.side = THREE.DoubleSide;
  const roof = new THREE.Mesh(geometry, material);
  roof.castShadow = roof.receiveShadow = true;
  parent.add(roof);
  return roof;
}

function torus(kit: SceneKit, parent: THREE.Group, radius: number, tube: number, y: number, color: string, tilt = 0) {
  const mesh = new THREE.Mesh(kit.track(new THREE.TorusGeometry(radius, tube, 12, 72)), kit.finish(color, "metal"));
  mesh.rotation.set(Math.PI / 2 + tilt, 0.25, 0);
  mesh.position.y = y;
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createLandmark(kit: SceneKit, root: THREE.Group, b: CityBuilding) {
  const style = landmarkStyles[b.id];
  const w = b.width, d = b.depth, n = b.floors.length;
  const ivory = "#e4dfce", dark = "#173b45", brass = "#ba9253";
  const glass = kit.finish(style === "pagoda" || style === "library" ? "#254b47" : "#286471", "glass");
  function box(parent: THREE.Group, size: [number, number, number], pos: [number, number, number], color: string, kind: "stone" | "metal" | "glass" | "wood" = "stone") {
    const mesh = kit.box(parent, size, pos, color);
    mesh.material = kind === "glass" ? glass : kit.finish(color, kind);
    return mesh;
  }
  function disc(parent: THREE.Group, radius: number, h: number, y: number, color: string, top = radius) {
    const mesh = kit.cylinder(parent, radius, h, [0, y, 0], color, 64, top);
    mesh.material = kit.finish(color, color === dark ? "glass" : "stone");
    return mesh;
  }
  function foliage(parent: THREE.Group, x: number, y: number, z: number, radius = 0.3) {
    box(parent, [radius * 2.6, 0.24, radius * 2.6], [x, y, z], "#8b8b6c");
    kit.sphere(parent, radius, [x, y + radius * 0.7, z], "#527b62");
  }
  const levels: THREE.Group[] = [];
  for (let floor = 0; floor < n; floor++) {
    const level = new THREE.Group();
    level.position.y = 0.5 + floor * floorHeight;
    level.userData = { buildingId: b.id, floor };
    root.add(level);
    levels.push(level);
    const t = floor / Math.max(1, n - 1);
    if (["ribbon", "helix", "orbit", "dune", "lotus"].includes(style)) {
      const radius = w * (style === "helix" ? 0.41 : style === "dune" ? 0.48 - t * 0.1 : 0.43);
      const shell = disc(level, radius, 2.85, 1.5, dark);
      shell.material = glass;
      shell.scale.z = style === "ribbon" ? 0.78 : 1;
      const slab = disc(level, radius + 0.5, 0.22, 0.1, ivory);
      slab.scale.z = style === "ribbon" ? 0.8 : 1;
      if (style === "helix" || style === "dune") {
        slab.scale.x = 1.22;
        slab.rotation.y = floor * 0.43;
        slab.position.x = Math.sin(floor * 0.6) * 0.32;
        foliage(level, Math.cos(floor * 0.7) * radius, 0.4, Math.sin(floor * 0.7) * radius);
      }
      for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5 + (style === "helix" ? floor * 0.18 : 0);
        const fin = box(level, [0.08, 2.85, 0.12], [Math.cos(angle) * (radius + 0.02), 1.5, Math.sin(angle) * radius * (style === "ribbon" ? 0.78 : 1)], style === "ribbon" ? brass : ivory, "metal");
        fin.rotation.y = -angle;
      }
      if (style === "ribbon") {
        const band = torus(kit, level, radius + 0.4, 0.12, 1.5, b.color, 0.28 + floor * 0.15);
        band.scale.z = 0.82;
      }
    } else if (style === "pagoda" || style === "library" || style === "gateway") {
      const taper = style === "library" ? 1 - t * 0.3 : 1 - t * 0.12;
      const span = w * taper;
      box(level, [span * 0.83, 2.75, d * 0.77 * taper], [0, 1.5, 0], dark, "glass");
      box(level, [span, 0.2, d * taper], [0, 0.1, 0], ivory);
      for (const side of [-1, 1]) {
        for (let i = -2; i <= 2; i++) {
          box(level, [0.075, 2.65, 0.09], [i * span * 0.16, 1.5, side * d * 0.39 * taper], "#a88458", "wood");
        }
        box(level, [span * 0.9, 0.12, 0.15], [0, 1.5, side * d * 0.4 * taper], brass, "wood");
      }
      eave(kit, level, span + 1.6, d * taper + 1.1, 2.8, style === "library" ? "#345b58" : "#3d726c");
      if (floor === 0) {
        for (const x of [-1.2, 1.2]) box(level, [0.18, 2.8, 0.18], [x, 1.4, d / 2 + 0.2], "#a87e50", "wood");
        box(level, [3, 0.25, 0.3], [0, 2.65, d / 2 + 0.2], brass, "wood");
      }
    } else if (style === "bridge") {
      // Two inhabited piers with an open central atrium and a high sky room.
      for (const side of [-1, 1]) {
        box(level, [w * 0.32, 2.9, d * 0.83], [side * w * 0.32, 1.5, 0], dark, "glass");
        box(level, [w * 0.36, 0.25, d], [side * w * 0.32, 0.12, 0], ivory);
        box(level, [0.22, 3.0, d * 0.9], [side * w * 0.49, 1.5, 0], ivory);
      }
      if (floor === n - 1 || floor === 0) {
        box(level, [w, 2.5, d * 0.66], [0, 1.5, 0], b.color, "metal");
        box(level, [w * 0.87, 1.6, 0.08], [0, 1.6, d * 0.34], dark, "glass");
      }
    } else if (style === "pixels") {
      box(level, [w * 0.78, 2.6, d * 0.75], [0, 1.4, 0], dark, "glass");
      for (let i = 0; i < 3; i++) {
        const side = (floor + i) % 2 ? -1 : 1;
        box(level, [w * 0.38, 2.35, d * 0.4], [(i - 1) * 1.9, 1.4, side * 1.45], i === 1 ? ivory : b.color, "metal");
        box(level, [1.1, 1.2, 0.08], [(i - 1) * 1.9, 1.5, side * (1.45 + d * 0.2 + 0.03)], dark, "glass");
      }
    } else {
      // Offset inhabitable volumes: a different massing rhythm for each address.
      const offset = style === "capsule" ? (floor % 2 ? 0.8 : -0.6) : style === "interlock" ? (floor - 1) * 0.55 : 0;
      const length = style === "speed" ? w * 1.1 : w * 0.9;
      const volume = new THREE.Group();
      volume.position.x = offset;
      if (style === "origami") volume.rotation.y = floor * 0.24 - 0.24;
      if (style === "interlock") volume.rotation.y = floor % 2 ? Math.PI / 2 : 0;
      level.add(volume);
      box(volume, [length, 2.65, d * 0.78], [0, 1.5, 0], dark, "glass");
      box(volume, [length + 0.35, 0.3, d * 0.9], [0, 0.15, 0], ivory);
      box(volume, [length + 0.35, 0.3, d * 0.9], [0, 2.98, 0], style === "interlock" ? b.color : ivory);
      for (const side of [-1, 1]) {
        box(volume, [0.24, 2.65, d * 0.9], [side * length / 2, 1.5, 0], b.color, "metal");
        for (let i = -2; i <= 2; i++) box(volume, [0.06, 2.4, 0.08], [i * length * 0.17, 1.5, side * d * 0.4], brass, "metal");
      }
      if (style === "speed" || style === "origami") {
        const wing = box(level, [w + 1.4, 0.14, d + 0.5], [0, 3.05, 0], b.color, "metal");
        wing.rotation.z = style === "origami" ? (floor % 2 ? 0.14 : -0.14) : -0.09;
        wing.rotation.y = style === "origami" ? 0.35 : 0;
      }
      if (style === "capsule") foliage(level, offset > 0 ? -2.6 : 2.6, 0.4, 1.7, 0.45);
    }
  }
  const roofY = 0.5 + n * floorHeight;
  if (style === "orbit") {
    const dome = new THREE.Mesh(kit.track(new THREE.SphereGeometry(w * 0.43, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2)), kit.finish("#c3caca", "metal"));
    dome.position.y = roofY;
    dome.castShadow = true;
    root.add(dome);
    torus(kit, root, w * 0.58, 0.12, roofY + 1.2, brass, 0.5);
    torus(kit, root, w * 0.49, 0.07, roofY + 1.9, b.color, -0.65);
  } else if (style === "lotus") {
    // Radial leaf shells meet at the centre and rise to six smooth tips.
    for (let i = 0; i < 6; i++) {
      const points: number[] = [], indices: number[] = [];
      const rows = 20, cols = 12;
      for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
        const v = r / rows, u = c / cols * 2 - 1;
        points.push(u * Math.sin(Math.PI * v) * w * 0.24,
          roofY + 0.2 + 1.8 * v * v + 0.4 * u * u * Math.sin(Math.PI * v),
          v * d * 0.64);
        if (r < rows && c < cols) {
          const a = r * (cols + 1) + c, b = a + cols + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
      const geometry = kit.track(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const material = kit.finish(ivory, "metal");
      material.side = THREE.DoubleSide;
      const shell = new THREE.Mesh(geometry, material);
      shell.rotation.y = i * Math.PI / 3;
      shell.castShadow = shell.receiveShadow = true;
      root.add(shell);
    }
  } else if (style === "helix") {
    const path = new THREE.CatmullRomCurve3(Array.from({ length: 100 }, (_, i) => {
      const t = i / 99, angle = t * Math.PI * 3.5;
      return new THREE.Vector3(Math.cos(angle) * w * 0.51, 0.7 + t * (roofY - 0.4), Math.sin(angle) * w * 0.51);
    }));
    const ribbon = new THREE.Mesh(kit.track(new THREE.TubeGeometry(path, 180, 0.17, 8, false)), kit.finish(brass, "metal"));
    ribbon.castShadow = true;
    root.add(ribbon);
    torus(kit, root, w * 0.44, 0.15, roofY + 0.8, brass, 0.4);
    torus(kit, root, w * 0.35, 0.1, roofY + 1.2, ivory, -0.45);
  } else if (style === "ribbon") {
    torus(kit, root, w * 0.5, 0.2, roofY + 1.1, brass, 0.7);
  } else if (style === "origami") {
    const wing = box(root, [w * 1.25, 0.22, d], [0, roofY + 0.4, 0], ivory);
    wing.rotation.set(0, 0.35, 0.24);
  } else if (style === "pagoda" || style === "library") {
    kit.cylinder(root, 0.11, 2.1, [0, roofY + 0.9, 0], brass, 24, 0.025);
    torus(kit, root, 0.38, 0.07, roofY + 0.5, brass);
  } else if (style === "dune") {
    const dome = kit.sphere(root, 2, [0, roofY - 0.1, 0], ivory);
    dome.scale.set(1.15, 0.5, 0.85);
  } else {
    box(root, [w * 0.6, 0.25, d * 0.6], [0, roofY, 0], ivory);
    foliage(root, 0, roofY + 0.2, 0, 0.65);
  }
  // Merge static architecture by finish *within each floor*. This retains
  // floor-level ray picking while avoiding a draw call for every facade fin.
  for (const level of levels) {
    level.updateWorldMatrix(true, true);
    const inverse = level.matrixWorld.clone().invert();
    const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
    level.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || Array.isArray(object.material)) return;
      const clone = object.geometry.clone();
      const geometry = clone.index ? clone.toNonIndexed() : clone;
      if (geometry !== clone) clone.dispose();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld));
      const batch = batches.get(object.material) ?? [];
      batch.push(geometry);
      batches.set(object.material, batch);
    });
    level.clear();
    for (const [material, geometries] of Array.from(batches.entries())) {
      const merged = mergeGeometries(geometries, false);
      geometries.forEach((geometry) => geometry.dispose());
      if (!merged) throw new Error(`Cannot batch the architecture of ${b.id}`);
      const mesh = new THREE.Mesh(kit.track(merged), material);
      mesh.castShadow = mesh.receiveShadow = true;
      level.add(mesh);
    }
  }
  return { floors: levels, glass, style };
}
