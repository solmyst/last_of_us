import * as THREE from "three";
import { projects, proofStats, experienceIntro } from "@/lib/data";
import { cityBuildings, type CityPoint } from "@/lib/city-layout";
import type { SceneKit } from "./scene-kit";
import { createCharacter, crowdLook } from "./characters";
// Sidewalk lanes chosen to clear every building footprint and the street trees.
const lanes: Array<{ axis: "x" | "z"; at: number }> = [
  ...[-17.8, -12.2, 3.8, 12.2, 17.8].map((at) => ({ axis: "z" as const, at })),
  ...[-17.8, -12.2, -3.8, 3.8].map((at) => ({ axis: "x" as const, at })),
];
// Every line comes from the real portfolio content, never invented activity.
function crowdLines() {
  const lines = projects.map((project) => {
    const building = cityBuildings.find((item) => item.id === project.id);
    return `${building?.name ?? project.name}? ${project.tagline}`;
  });
  for (const stat of proofStats) lines.push(`Heard? ${stat.value} ${stat.label}.`);
  lines.push(experienceIntro.split(",")[0] + ".");
  lines.push("Read a floor's dossier to raise your Hire Level ★");
  return lines;
}
function bubble(kit: SceneKit, text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 200;
  const context = canvas.getContext("2d")!;
  context.font = "600 30px Arial";
  const words = text.split(" ");
  const rows: string[] = [""];
  for (const word of words) {
    const next = `${rows[rows.length - 1]} ${word}`.trim();
    if (context.measureText(next).width > 560 && rows.length < 3) rows.push(word);
    else rows[rows.length - 1] = next;
  }
  context.fillStyle = "#fffdf5";
  context.strokeStyle = "#102431";
  context.lineWidth = 5;
  context.beginPath();
  context.roundRect(6, 6, 628, 40 + rows.length * 40, 22);
  context.fill();
  context.stroke();
  context.fillStyle = "#102431";
  context.textBaseline = "top";
  rows.forEach((row, i) => context.fillText(row, 30, 26 + i * 40, 580));
  const texture = kit.track(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    kit.track(new THREE.SpriteMaterial({ map: texture, depthTest: false })),
  );
  sprite.scale.set(3.6, 1.125, 1);
  sprite.center.set(0.5, 1 - (46 + rows.length * 40) / 200);
  sprite.renderOrder = 10;
  sprite.visible = false;
  return sprite;
}
export function createCrowd(parent: THREE.Object3D, kit: SceneKit, count = 16) {
  const lines = crowdLines();
  const people = Array.from({ length: count }, (_, i) => {
    const lane = lanes[i % lanes.length];
    const character = createCharacter(kit, crowdLook(i + 3));
    character.root.scale.setScalar(0.72 * (0.92 + (i % 4) * 0.04));
    const speech = bubble(kit, lines[i % lines.length]);
    speech.position.y = 2.35;
    character.root.add(speech);
    parent.add(character.root);
    return {
      lane,
      character,
      speech,
      offset: ((i * 37) % 48) - 24,
      direction: i % 2 ? 1 : -1,
      speed: 1.1 + (i % 5) * 0.12,
    };
  });
  return {
    update(
      delta: number,
      time: number,
      player: CityPoint,
      running: boolean,
      danger: CityPoint | null = null,
    ) {
      for (const person of people) {
        const { root } = person.character;
        const x = person.lane.axis === "z" ? person.lane.at : person.offset;
        const z = person.lane.axis === "z" ? person.offset : person.lane.at;
        // A speeding car sends pedestrians leaping out of the way.
        const scared =
          !!danger && Math.hypot(danger.x - x, danger.z - z) < 3.4;
        const near = !scared && Math.hypot(player.x - x, player.z - z) < 2.8;
        person.speech.visible = near;
        if (scared) {
          root.rotation.y = Math.atan2(x - danger.x, z - danger.z);
          person.character.animate(delta, 0, true, time);
        } else if (near) {
          root.rotation.y = Math.atan2(player.x - x, player.z - z);
          person.character.animate(delta, 0, false, time);
        } else if (running) {
          person.offset += person.direction * person.speed * delta;
          if (Math.abs(person.offset) > 24) {
            person.offset = Math.sign(person.offset) * 24;
            person.direction *= -1;
          }
          const dx = person.lane.axis === "x" ? person.direction : 0;
          const dz = person.lane.axis === "z" ? person.direction : 0;
          root.rotation.y = Math.atan2(dx, dz);
          person.character.animate(delta, person.speed * 0.75, false, time);
        }
        root.position.set(x, scared ? 0.7 : 0.1, z);
      }
    },
  };
}
