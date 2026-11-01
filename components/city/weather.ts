import * as THREE from "three";
import type { SceneKit } from "./scene-kit";
import type { cityWeather } from "@/lib/city-weather";
export function createWeather(parent: THREE.Object3D, kit: SceneKit) {
  const root = new THREE.Group(); parent.add(root);
  const clouds = Array.from({ length: 7 }, (_, i) => {
    const cloud = new THREE.Group(); root.add(cloud);
    for (let j = 0; j < 3; j++) {
      const puff = kit.sphere(cloud, 3 + j * 0.6, [(j - 1) * 3.5, j % 2, 0], "#ccd4d0");
      puff.scale.set(1.4, 0.45, 0.8); puff.castShadow = false;
    }
    cloud.position.set(i * 17 - 50, 34 + i % 3 * 3, (i % 3 - 1) * 29);
    return cloud;
  });
  const positions = new Float32Array(500 * 3);
  const geometry = kit.track(new THREE.BufferGeometry());
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = kit.track(new THREE.PointsMaterial({ color: "#c1dbe4", size: 0.09, transparent: true, opacity: 0.6 }));
  const rain = new THREE.Points(geometry, material); rain.frustumCulled = false; root.add(rain);
  root.visible = false;
  return { update(time: number, state: ReturnType<typeof cityWeather> | null) {
    root.visible = state !== null;
    if (!state) return;
    clouds.forEach((cloud, i) => {
      cloud.position.x = ((i * 17 + time * 0.5) % 140) - 70;
      cloud.scale.setScalar(0.4 + state.cloud * 0.8);
    });
    rain.visible = state.rain > 0.05;
    if (rain.visible) {
      material.opacity = state.rain * 0.65;
      for (let i = 0; i < 500; i++) {
        positions[i * 3] = ((i * 47.3 + time * 1.5) % 96) - 48;
        positions[i * 3 + 1] = 0.4 + ((i * 7.1 - time * 16) % 35 + 35) % 35;
        positions[i * 3 + 2] = ((i * 29.7) % 96) - 48;
      }
      geometry.attributes.position.needsUpdate = true;
    }
  }};
}
