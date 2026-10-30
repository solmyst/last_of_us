import * as THREE from "three";

/** A small, procedural scene: no model, texture, or network asset requests. */
export function createProductScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(5.5, 4.5, 7.5);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xe7efec, 2.5));
  const key = new THREE.DirectionalLight(0xffe2ae, 5);
  key.position.set(3, 6, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7cc5b5, 4);
  rim.position.set(-4, 1, -2);
  scene.add(rim);

  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const resources: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };
  const plateGeometry = track(new THREE.BoxGeometry(2.8, 0.13, 1.85));
  const edgeGeometry = track(new THREE.EdgesGeometry(plateGeometry));
  const gold = track(
    new THREE.LineBasicMaterial({
      color: 0xe1c38f,
      transparent: true,
      opacity: 0.8,
    }),
  );
  const colors = [0x214f4c, 0x243f54, 0x6c624c];
  const plates: THREE.Group[] = [];

  for (let layer = 0; layer < 3; layer++) {
    const plate = new THREE.Group();
    const material = track(
      new THREE.MeshStandardMaterial({
        color: colors[layer],
        roughness: 0.28,
        metalness: 0.65,
      }),
    );
    plate.add(new THREE.Mesh(plateGeometry, material));
    plate.add(new THREE.LineSegments(edgeGeometry, gold));
    plate.position.y = (layer - 1) * 0.85;
    plate.rotation.y = (layer - 1) * 0.14;
    sculpture.add(plate);
    plates.push(plate);
    // Circuit-like paths and nodes on each layer suggest an interconnected system.
    const traceMaterial = track(
      new THREE.MeshBasicMaterial({ color: layer === 1 ? 0x95d5c1 : 0xe1c38f }),
    );
    const path = track(new THREE.BoxGeometry(1.7, 0.012, 0.018));
    const line = new THREE.Mesh(path, traceMaterial);
    line.position.set(0, 0.078, 0);
    plate.add(line);
    const nodeGeometry = track(new THREE.SphereGeometry(0.065, 12, 8));
    for (const x of [-0.85, 0, 0.85]) {
      const node = new THREE.Mesh(nodeGeometry, traceMaterial);
      node.position.set(x, 0.1, 0);
      plate.add(node);
    }
    const smallPath = track(new THREE.BoxGeometry(0.018, 0.012, 0.75));
    const branch = new THREE.Mesh(smallPath, traceMaterial);
    branch.position.set(0, 0.078, 0.37);
    plate.add(branch);
  }
  const ringMaterial = track(
    new THREE.MeshStandardMaterial({
      color: 0xc8ac7e,
      metalness: 0.7,
      roughness: 0.3,
    }),
  );
  const ring = new THREE.Mesh(
    track(new THREE.TorusGeometry(2.2, 0.012, 6, 96)),
    ringMaterial,
  );
  ring.rotation.x = Math.PI / 2.5;
  ring.rotation.y = -0.3;
  sculpture.add(ring);
  const satellite = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.11, 1)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xa1dfc8,
        emissive: 0x2d6155,
        emissiveIntensity: 0.8,
      }),
    ),
  );
  sculpture.add(satellite);

  let paused = false;
  let visible = false;
  let lost = false;
  let elapsed = 0;
  let lastTime = 0;
  let pointerX = 0;
  let pointerY = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function render(time = 0) {
    if (time && time - lastTime < 1000 / 30) return;
    if (time && lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    const moving = !paused && !reducedMotion.matches;
    if (moving) {
      sculpture.rotation.y +=
        (pointerX * 0.25 +
          Math.sin(elapsed * 0.18) * 0.12 -
          sculpture.rotation.y) *
        0.05;
      sculpture.rotation.x += (pointerY * 0.12 - sculpture.rotation.x) * 0.05;
      plates.forEach((plate, i) => {
        plate.position.y =
          (i - 1) * 0.85 + Math.sin(elapsed * 0.65 + i * 0.7) * 0.06;
      });
    }
    const angle = elapsed * 0.25 + 0.6;
    satellite.position.set(
      Math.cos(angle) * 2.2,
      Math.sin(angle) * 0.65,
      Math.sin(angle) * 1.9,
    );
    renderer.render(scene, camera);
  }
  function syncLoop() {
    renderer.setAnimationLoop(null);
    lastTime = 0;
    if (lost) return;
    render();
    if (!paused && !reducedMotion.matches && visible && !document.hidden)
      renderer.setAnimationLoop(render);
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height || lost) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  });
  resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncLoop();
  });
  observer.observe(canvas);
  function onPointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }
  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
  }
  function onLost(event: Event) {
    event.preventDefault();
    lost = true;
    renderer.setAnimationLoop(null);
    canvas.dispatchEvent(new Event("scene-unavailable"));
  }
  canvas.addEventListener("pointermove", onPointer);
  canvas.addEventListener("pointerleave", resetPointer);
  canvas.addEventListener("webglcontextlost", onLost);
  document.addEventListener("visibilitychange", syncLoop);
  reducedMotion.addEventListener("change", syncLoop);
  return {
    setPaused(value: boolean) {
      paused = value;
      syncLoop();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", syncLoop);
      reducedMotion.removeEventListener("change", syncLoop);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
    },
  };
}
