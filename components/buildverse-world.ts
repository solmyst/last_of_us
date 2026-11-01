import * as THREE from "three";
import { landmarks } from "@/lib/buildverse";

type Pin = { id: string; x: number; y: number };
type WorldOptions = {
  onSelect: (id: string) => void;
  onProject: (pins: Pin[]) => void;
  onUnavailable: () => void;
};

export function createBuildverse(
  canvas: HTMLCanvasElement,
  options: WorldOptions,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-9, 9, 7, -7, 0.1, 100);
  camera.position.set(12, 12, 15);
  camera.lookAt(0, 0.3, 0);
  scene.add(new THREE.AmbientLight(0xd8e9eb, 2.8));
  const sun = new THREE.DirectionalLight(0xffe4bc, 4.5);
  sun.position.set(-5, 10, 6);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x98dccb, 3);
  rim.position.set(5, 3, -5);
  scene.add(rim);
  const world = new THREE.Group();
  world.rotation.y = -0.16;
  scene.add(world);
  const resources: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(value: T): T => {
    resources.push(value);
    return value;
  };
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  function material(color: string, metalness = 0.15) {
    if (!materials.has(color))
      materials.set(
        color,
        track(
          new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness }),
        ),
      );
    return materials.get(color)!;
  }
  function box(
    parent: THREE.Object3D,
    size: [number, number, number],
    position: [number, number, number],
    color: string,
  ) {
    const mesh = new THREE.Mesh(
      track(new THREE.BoxGeometry(...size)),
      material(color),
    );
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  function cylinder(
    parent: THREE.Object3D,
    radius: number,
    height: number,
    position: [number, number, number],
    color: string,
    top = radius,
  ) {
    const mesh = new THREE.Mesh(
      track(new THREE.CylinderGeometry(top, radius, height, 32)),
      material(color),
    );
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  function ring(
    parent: THREE.Object3D,
    radius: number,
    color: string,
    position: [number, number, number],
    thickness = 0.018,
  ) {
    const mesh = new THREE.Mesh(
      track(new THREE.TorusGeometry(radius, thickness, 6, 64)),
      material(color, 0.6),
    );
    mesh.position.set(...position);
    mesh.rotation.x = Math.PI / 2;
    parent.add(mesh);
    return mesh;
  }
  function line(points: THREE.Vector3[], color: string, opacity = 1) {
    const geometry = track(new THREE.BufferGeometry().setFromPoints(points));
    const object = new THREE.Line(
      geometry,
      track(new THREE.LineBasicMaterial({ color, transparent: true, opacity })),
    );
    world.add(object);
    return object;
  }
  // A hand-built octagonal terrain, with a lighter rim and a floating foundation.
  const terrain = new THREE.Mesh(
    track(new THREE.CylinderGeometry(6.1, 5.8, 0.5, 8)),
    material("#234048"),
  );
  terrain.position.y = -0.35;
  terrain.rotation.y = Math.PI / 8;
  terrain.scale.z = 0.82;
  world.add(terrain);
  const lowerTerrain = new THREE.Mesh(
    track(new THREE.CylinderGeometry(5.8, 4.9, 0.65, 8)),
    material("#122a34"),
  );
  lowerTerrain.position.y = -0.9;
  lowerTerrain.rotation.y = Math.PI / 8;
  lowerTerrain.scale.z = 0.82;
  world.add(lowerTerrain);
  const edge = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(terrain.geometry)),
    track(
      new THREE.LineBasicMaterial({
        color: 0x89b8aa,
        transparent: true,
        opacity: 0.4,
      }),
    ),
  );
  edge.position.copy(terrain.position);
  edge.rotation.copy(terrain.rotation);
  edge.scale.copy(terrain.scale);
  world.add(edge);
  ring(world, 6.5, "#4f7773", [0, -1.6, 0], 0.008).scale.z = 0.82;

  // A circuit-like path connects the five stops; it is a map of actual work.
  const route = [
    new THREE.Vector3(-2.1, -0.075, -1.7),
    new THREE.Vector3(1.6, -0.075, -1.8),
    new THREE.Vector3(3.8, -0.075, 0.6),
    new THREE.Vector3(0.8, -0.075, 1.9),
    new THREE.Vector3(-2.7, -0.075, 1.6),
    new THREE.Vector3(-2.1, -0.075, -1.7),
  ];
  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i],
      end = route[i + 1];
    const middle = new THREE.Vector3(end.x, -0.075, start.z);
    line([start, middle, end], "#8caa9d", 0.65);
  }
  const sceneStops = new Map<
    string,
    { group: THREE.Group; halo: THREE.Mesh; anchor: THREE.Vector3 }
  >();
  const animated: THREE.Mesh[] = [];
  for (const landmark of landmarks) {
    const group = new THREE.Group();
    group.position.set(landmark.x, 0, landmark.z);
    group.userData.projectId = landmark.id;
    world.add(group);
    cylinder(group, 1.08, 0.11, [0, -0.04, 0], "#152f39");
    const halo = ring(group, 1.04, landmark.color, [0, 0.028, 0], 0.018);
    sceneStops.set(landmark.id, {
      group,
      halo,
      anchor: new THREE.Vector3(landmark.x, 2.05, landmark.z),
    });
    if (landmark.type === "studio") {
      box(group, [1.45, 0.85, 1.15], [0, 0.42, 0], "#a2dfca");
      box(group, [1.62, 0.14, 1.3], [0, 0.91, 0], "#edddbb");
      box(group, [1.12, 0.48, 0.035], [0, 0.5, 0.594], "#153c42");
      for (const x of [-0.4, -0.2, 0, 0.2, 0.4])
        box(
          group,
          [0.06, 0.14 + (0.5 - Math.abs(x)) * 0.35, 0.025],
          [x, 0.5, 0.62],
          "#a2dfca",
        );
      cylinder(group, 0.07, 0.5, [0.44, 1.21, 0], "#edddbb");
      const orb = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.19, 16, 12)),
        material("#a2dfca"),
      );
      orb.position.set(0.44, 1.55, 0);
      group.add(orb);
      animated.push(orb);
    } else if (landmark.type === "tower") {
      cylinder(group, 0.48, 0.18, [0, 0.08, 0], "#ecbe9e");
      const mast = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.08, 0.23, 1.85, 8)),
        material("#eeaa8e"),
      );
      mast.position.y = 1.05;
      group.add(mast);
      cylinder(group, 0.42, 0.18, [0, 1.9, 0], "#edddbb");
      const beacon = new THREE.Mesh(
        track(new THREE.OctahedronGeometry(0.22)),
        material("#f0b699"),
      );
      beacon.position.y = 2.25;
      group.add(beacon);
      animated.push(beacon);
      for (const radius of [0.42, 0.69, 0.95]) {
        const signal = ring(group, radius, "#eeaa8e", [0, 1.55, 0], 0.012);
        signal.rotation.x = 0.5;
        animated.push(signal);
      }
      sceneStops.get(landmark.id)!.anchor.y = 2.9;
    } else if (landmark.type === "containers") {
      for (let i = 0; i < 3; i++) {
        const container = box(
          group,
          [1.25, 0.48, 0.48],
          [0, 0.25 + i * 0.5, (i % 2) * 0.13],
          i === 1 ? "#91bfb3" : "#d6b375",
        );
        if (i === 2) container.rotation.y = 0.17;
        for (let n = -3; n <= 3; n++)
          box(container, [0.025, 0.37, 0.018], [n * 0.16, 0, 0.25], "#6b6b51");
      }
      box(group, [0.1, 1.6, 0.1], [0.88, 0.8, -0.5], "#edddbb");
      box(group, [1.4, 0.1, 0.1], [0.24, 1.6, -0.5], "#edddbb");
    } else if (landmark.type === "workshop") {
      box(group, [1.5, 0.78, 1.1], [0, 0.4, 0], "#8caac7");
      box(group, [1.6, 0.15, 1.2], [0, 0.86, 0], "#d5dfde");
      box(group, [1.05, 0.25, 0.08], [0, 0.5, 0.59], "#153c42");
      const page = box(group, [0.7, 0.85, 0.035], [0, 1.12, 0.1], "#f0e6cc");
      page.rotation.x = -0.2;
      for (let n = 0; n < 3; n++)
        box(page, [0.45, 0.025, 0.01], [0, 0.2 - n * 0.14, 0.022], "#688c8b");
      box(group, [0.75, 0.035, 0.45], [0, 0.11, 0.83], "#f0e6cc");
    } else {
      box(group, [1.6, 0.18, 1.3], [0, 0.03, 0], "#b8a1ce");
      box(group, [1.35, 0.12, 1.05], [0, 0.17, 0], "#e8c68a");
      for (let i = 0; i < 3; i++) {
        const mound = new THREE.Mesh(
          track(new THREE.ConeGeometry(0.3 - i * 0.04, 0.45 + i * 0.14, 8)),
          material(i === 1 ? "#a2dfca" : "#e9ce99"),
        );
        mound.position.set((i - 1) * 0.36, 0.45, (i % 2) * 0.2);
        group.add(mound);
      }
      const flag = box(
        group,
        [0.35, 0.22, 0.025],
        [0.45, 1.25, -0.35],
        "#b8a1ce",
      );
      animated.push(flag);
      box(group, [0.03, 1.3, 0.03], [0.25, 0.7, -0.35], "#edddbb");
    }
  }
  // A tiny F1 silhouette and trees make the world personal, without imported assets.
  const car = new THREE.Group();
  car.position.set(-0.25, 0.15, -3.35);
  car.rotation.y = 0.1;
  world.add(car);
  box(car, [0.35, 0.18, 1.15], [0, 0.1, 0], "#e6a58a");
  box(car, [0.78, 0.08, 0.18], [0, 0.05, 0.56], "#edddbb");
  box(car, [0.72, 0.12, 0.18], [0, 0.2, -0.48], "#edddbb");
  for (const x of [-0.28, 0.28])
    for (const z of [-0.33, 0.33]) {
      const wheel = cylinder(car, 0.14, 0.12, [x, 0.04, z], "#0b1824");
      wheel.rotation.z = Math.PI / 2;
    }
  for (const [x, z] of [
    [-4, -1],
    [-0.4, 3.4],
    [3, -2.9],
    [4, 1.9],
  ] as const) {
    cylinder(world, 0.04, 0.45, [x, 0.2, z], "#bca988");
    const tree = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.32, 0.8, 7)),
      material("#5f9985"),
    );
    tree.position.set(x, 0.7, z);
    world.add(tree);
  }
  const courier = new THREE.Mesh(
    track(new THREE.IcosahedronGeometry(0.09, 1)),
    track(new THREE.MeshBasicMaterial({ color: 0xf2e5b6 })),
  );
  world.add(courier);
  const stars = new Float32Array(90 * 3);
  for (let i = 0; i < 90; i++) {
    stars[i * 3] = (Math.random() - 0.5) * 24;
    stars[i * 3 + 1] = -2.5 - Math.random() * 3;
    stars[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const starGeometry = track(new THREE.BufferGeometry());
  starGeometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starGeometry,
      track(
        new THREE.PointsMaterial({
          color: 0x7daaa4,
          size: 0.035,
          transparent: true,
          opacity: 0.5,
        }),
      ),
    ),
  );

  let paused = false,
    visible = false,
    lost = false,
    lastTime = 0,
    elapsed = 0,
    pointerX = 0,
    pointerY = 0,
    selected = "";
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const raycaster = new THREE.Raycaster();
  function projectPins() {
    const rect = canvas.getBoundingClientRect();
    world.updateMatrixWorld(true);
    options.onProject(
      Array.from(sceneStops).map(([id, stop]) => {
        const projected = stop.anchor
          .clone()
          .applyMatrix4(world.matrixWorld)
          .project(camera);
        return {
          id,
          x: ((projected.x + 1) / 2) * rect.width,
          y: ((1 - projected.y) / 2) * rect.height,
        };
      }),
    );
  }
  function render(time = 0) {
    if (time && time - lastTime < 1000 / 30) return;
    if (time && lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (!paused && !preference.matches) {
      world.rotation.y += (-0.16 + pointerX * 0.09 - world.rotation.y) * 0.04;
      world.rotation.x += (pointerY * 0.025 - world.rotation.x) * 0.04;
      world.position.y = Math.sin(elapsed * 0.45) * 0.045;
      animated.forEach((object, i) => {
        if (object.geometry instanceof THREE.TorusGeometry)
          object.rotation.z = elapsed * 0.12;
        else object.rotation.y = Math.sin(elapsed * 0.6 + i) * 0.15;
      });
      const segment = Math.floor(elapsed * 0.27) % (route.length - 1),
        progress = (elapsed * 0.27) % 1;
      courier.position.lerpVectors(
        route[segment],
        route[segment + 1],
        progress,
      );
      courier.position.y = 0.08;
    }
    sceneStops.forEach((stop, id) => {
      const target = id === selected ? 1.16 : 1;
      stop.halo.scale.setScalar(target);
    });
    renderer.render(scene, camera);
    projectPins();
  }
  function sync() {
    renderer.setAnimationLoop(null);
    lastTime = 0;
    if (lost) return;
    render();
    if (!paused && !preference.matches && visible && !document.hidden)
      renderer.setAnimationLoop(render);
  }
  const resize = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height || lost) return;
    const aspect = rect.width / rect.height;
    const halfWidth = aspect < 1 ? 8 : 9;
    const halfHeight = halfWidth / aspect;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
    render();
  });
  resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(canvas);
  function pointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  }
  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
  }
  function select(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    for (const intersection of raycaster.intersectObjects(
      world.children,
      true,
    )) {
      let object: THREE.Object3D | null = intersection.object;
      while (object && !object.userData.projectId) object = object.parent;
      if (object?.userData.projectId) {
        options.onSelect(object.userData.projectId);
        break;
      }
    }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    renderer.setAnimationLoop(null);
    options.onUnavailable();
  }
  canvas.addEventListener("pointermove", pointer);
  canvas.addEventListener("pointerleave", resetPointer);
  canvas.addEventListener("click", select);
  canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", sync);
  preference.addEventListener("change", sync);
  return {
    setPaused(value: boolean) {
      paused = value;
      sync();
    },
    setSelected(id: string) {
      selected = id;
      if (!lost) render();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointermove", pointer);
      canvas.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("click", select);
      canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
    },
  };
}
