import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
export function createSceneKit() {
  const resources: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };
  const cube = track(new RoundedBoxGeometry(1, 1, 1, 2, 0.045));
  const mats = new Map<string, THREE.MeshStandardMaterial>();
  const labels = new Map<string, THREE.Texture>();
  const finishes = new Map<string, THREE.MeshStandardMaterial>();
  // Deterministic micro-grain gives stone a surface without downloading textures.
  const grain = new Uint8Array(128 * 128 * 4);
  for (let i = 0; i < 128 * 128; i++) {
    const value = 170 + ((i * 73 + (i >> 7) * 19) % 70);
    grain.set([value, value, value, 255], i * 4);
  }
  const roughness = track(new THREE.DataTexture(grain, 128, 128));
  roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;
  roughness.magFilter = THREE.LinearFilter;
  roughness.needsUpdate = true;
  function finish(color: string, kind: "stone" | "metal" | "glass" | "wood" = "stone") {
    const key = kind + color;
    if (!finishes.has(key)) finishes.set(key, track(new THREE.MeshStandardMaterial({
      color,
      roughness: kind === "glass" ? 0.17 : kind === "metal" ? 0.29 : 0.78,
      metalness: kind === "glass" ? 0.58 : kind === "metal" ? 0.75 : 0.05,
      ...(kind === "stone" || kind === "wood" ? { roughnessMap: roughness } : {}),
      ...(kind === "glass" ? { emissive: color, emissiveIntensity: 0.12 } : {}),
    })));
    return finishes.get(key)!;
  }
  function material(color: string, emissive = false) {
    const key = color + emissive;
    if (!mats.has(key))
      mats.set(
        key,
        track(
          new THREE.MeshStandardMaterial({
            color,
            roughness: 0.72,
            metalness: 0.08,
            ...(emissive ? { emissive: color, emissiveIntensity: 0.45 } : {}),
          }),
        ),
      );
    return mats.get(key)!;
  }
  function box(
    parent: THREE.Object3D,
    size: [number, number, number],
    position: [number, number, number],
    color: string,
    emissive = false,
  ) {
    const mesh = new THREE.Mesh(cube, material(color, emissive));
    mesh.scale.set(...size);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(
    parent: THREE.Object3D,
    radius: number,
    height: number,
    position: [number, number, number],
    color: string,
    vertices = 48,
    top = radius,
  ) {
    const geometry = track(
      new THREE.CylinderGeometry(top, radius, height, vertices),
    );
    const mesh = new THREE.Mesh(geometry, material(color));
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function sphere(
    parent: THREE.Object3D,
    radius: number,
    position: [number, number, number],
    color: string,
  ) {
    const mesh = new THREE.Mesh(
      track(new THREE.SphereGeometry(radius, 32, 20)),
      material(color),
    );
    mesh.position.set(...position);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function textTexture(text: string, color = "#e8eee8") {
    const key = text + color;
    if (labels.has(key)) return labels.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#122733";
    context.beginPath();
    context.roundRect(4, 4, 760, 120, 20);
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.stroke();
    context.font = "600 34px Arial";
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 384, 66, 700);
    const texture = track(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    labels.set(key, texture);
    return texture;
  }
  function label(
    parent: THREE.Object3D,
    text: string,
    position: [number, number, number],
    color: string,
    width = 8,
  ) {
    const sprite = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: textTexture(text, color),
          depthTest: true,
        }),
      ),
    );
    sprite.position.set(...position);
    sprite.scale.set(width, width / 6, 1);
    parent.add(sprite);
    return sprite;
  }
  function ring(
    parent: THREE.Object3D,
    radius: number,
    position: [number, number, number],
    color: string,
  ) {
    const mesh = new THREE.Mesh(
      track(new THREE.TorusGeometry(radius, 0.035, 6, 48)),
      material(color, true),
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  function screenTexture(
    title: string,
    subtitle: string,
    text: string,
    color: string,
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#0d202c";
    context.fillRect(0, 0, 1024, 640);
    context.fillStyle = color;
    context.fillRect(0, 0, 1024, 10);
    context.font = "22px monospace";
    context.fillText(subtitle.toUpperCase(), 55, 75, 920);
    context.font = "bold 49px Arial";
    const titleWords = title.split(" ");
    let line = "",
      y = 155;
    for (const word of titleWords) {
      if (context.measureText(line + word).width > 900) {
        context.fillText(line, 55, y);
        y += 58;
        line = "";
      }
      line += word + " ";
    }
    context.fillText(line, 55, y);
    y += 70;
    context.font = "27px Arial";
    context.fillStyle = "#bacdd1";
    line = "";
    for (const word of text.slice(0, 290).split(" ")) {
      if (context.measureText(line + word).width > 900) {
        context.fillText(line, 55, y);
        y += 40;
        line = "";
        if (y > 500) break;
      }
      line += word + " ";
    }
    if (y <= 500) context.fillText(line, 55, y);
    context.font = "22px monospace";
    context.fillStyle = color;
    context.fillText(
      "SELECT THIS DISPLAY TO OPEN THE COMPLETE DOSSIER  ↗",
      55,
      590,
      920,
    );
    const texture = track(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }
  return {
    track,
    box,
    cylinder,
    sphere,
    label,
    ring,
    material,
    finish,
    screenTexture,
    dispose() {
      resources.forEach((resource) => resource.dispose());
    },
  };
}
export type SceneKit = ReturnType<typeof createSceneKit>;
