import * as THREE from "three";
import type { SceneKit } from "./scene-kit";
// Day (0) → sunset (0.5) → night (1) keyframes for the sky and the lighting.
const keys = [
  { top: "#6fa8c4", horizon: "#d3e4df", sun: "#fff1d6", elevation: 0.85, ambient: 2.7, light: 3.5, env: 0.65 },
  { top: "#3d5b85", horizon: "#f4a36c", sun: "#ff9a5c", elevation: 0.06, ambient: 1.7, light: 2.4, env: 0.5 },
  { top: "#040b14", horizon: "#12314a", sun: "#9fb8ff", elevation: 0.6, ambient: 1.1, light: 0.7, env: 0.35 },
];
export function createSky(scene: THREE.Scene, kit: SceneKit) {
  const uniforms = {
    top: { value: new THREE.Color() },
    horizon: { value: new THREE.Color() },
    sunColor: { value: new THREE.Color() },
    sunDirection: { value: new THREE.Vector3() },
    glow: { value: 1 },
  };
  const dome = new THREE.Mesh(
    kit.track(new THREE.SphereGeometry(450, 32, 16)),
    kit.track(
      new THREE.ShaderMaterial({
        uniforms,
        side: THREE.BackSide,
        depthWrite: false,
        vertexShader: `varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.z = gl_Position.w;
}`,
        fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 sunColor; uniform vec3 sunDirection; uniform float glow;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y, 0.0, 1.0);
  vec3 color = mix(horizon, top, pow(h, 0.55));
  float sun = max(dot(vDir, sunDirection), 0.0);
  color += sunColor * (pow(sun, 900.0) * 2.0 + pow(sun, 12.0) * 0.35 * glow);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`,
      }),
    ),
  );
  dome.renderOrder = -1;
  scene.add(dome);
  const mix = <K extends "top" | "horizon" | "sun">(t: number, key: K, out: THREE.Color) => {
    const [a, b, f] = t < 0.5 ? [keys[0], keys[1], t * 2] : [keys[1], keys[2], t * 2 - 1];
    return out.set(a[key]).lerp(new THREE.Color(b[key]), f);
  };
  const lerp = (t: number, key: "elevation" | "ambient" | "light" | "env") => {
    const [a, b, f] = t < 0.5 ? [keys[0], keys[1], t * 2] : [keys[1], keys[2], t * 2 - 1];
    return a[key] + (b[key] - a[key]) * f;
  };
  return {
    // Apply time of day t to the dome and the scene's lights and fog.
    apply(
      t: number,
      lights: { ambient: THREE.HemisphereLight; sun: THREE.DirectionalLight },
    ) {
      mix(t, "top", uniforms.top.value);
      mix(t, "horizon", uniforms.horizon.value);
      mix(t, "sun", uniforms.sunColor.value);
      uniforms.glow.value = 1 + Math.sin(t * Math.PI) * 2.5;
      // The sun sets in the west; after dusk the moon rises opposite.
      const elevation = lerp(t, "elevation");
      const azimuth = t < 0.75 ? -0.8 : 2.3;
      uniforms.sunDirection.value
        .set(Math.cos(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.sin(azimuth) * Math.cos(elevation))
        .normalize();
      lights.sun.position.copy(uniforms.sunDirection.value).multiplyScalar(80);
      lights.sun.color.copy(uniforms.sunColor.value);
      lights.sun.intensity = lerp(t, "light");
      lights.ambient.intensity = lerp(t, "ambient");
      scene.environmentIntensity = lerp(t, "env");
      (scene.fog as THREE.Fog).color.copy(uniforms.horizon.value);
    },
  };
}
