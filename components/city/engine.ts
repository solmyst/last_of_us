import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  cityBuildings,
  moveCitizen,
  nearestDoor,
  floorHeight,
  type CityBuilding,
  type CityPoint,
} from "@/lib/city-layout";
import { createSceneKit } from "./scene-kit";
import { buildDistrict, createFloorRoom } from "./architecture";
import { buildGardens } from "./gardens";
export type CitySnapshot = {
  mode: "overview" | "street" | "room" | "building";
  position: CityPoint;
  nearby: string | null;
  heading: number;
};
type Options = {
  onEnter: (id: string, floor: number) => void;
  onRead: () => void;
  onExit: () => void;
  onUpdate: (state: CitySnapshot) => void;
  onHover: (text: string) => void;
  onUnavailable: () => void;
};
export function createCity(canvas: HTMLCanvasElement, options: Options) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 768 ? 1.75 : 2),
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = innerWidth >= 900;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const roomEnvironment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(roomEnvironment, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  roomEnvironment.dispose();
  pmrem.dispose();
  scene.background = new THREE.Color("#b9ced0");
  scene.fog = new THREE.Fog("#b9ced0", 200, 500);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 600);
  camera.position.set(60, 52, 68);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.7;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minPolarAngle = 0.18;
  controls.minDistance = 8;
  controls.maxDistance = 330;
  controls.update();
  const ambient = new THREE.HemisphereLight(0xe7f0ef, 0x416373, 2.7);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe3bf, 3.5);
  sun.position.set(-25, 60, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -40,
    right: 40,
    top: 40,
    bottom: -40,
    near: 0.1,
    far: 140,
  });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 3;
  scene.add(sun);
  const kit = createSceneKit();
  const city = new THREE.Group();
  scene.add(city);
  kit.box(city, [73, 1.6, 73], [0, -0.95, 0], "#304e5a");
  kit.box(city, [71, 0.2, 71], [0, -0.05, 0], "#688c87");
  for (const p of [-15, 0, 15]) {
    kit.box(city, [p === 0 ? 6 : 3.5, 0.035, 71], [p, 0.075, 0], "#304650");
    kit.box(city, [71, 0.035, p === 0 ? 6 : 3.5], [0, 0.077, p], "#304650");
  }
  for (let i = -33; i <= 33; i += 3) {
    kit.box(city, [0.08, 0.012, 1.2], [0, 0.101, i], "#c6c8aa");
    kit.box(city, [1.2, 0.012, 0.08], [i, 0.102, 0], "#c6c8aa");
  }
  kit.cylinder(city, 5.2, 0.13, [0, 0.13, 5], "#83a59a", 48);
  kit.ring(city, 4.6, [0, 0.21, 5], "#bad7b7");
  const district = buildDistrict(city, kit);
  for (const x of [-30, -15, 0, 15, 30])
    for (const z of [-30, 30]) {
      kit.cylinder(city, 0.08, 4, [x, 0.0 + 2, z], "#5b7077");
      kit.box(city, [0.7, 0.12, 0.7], [x, 4.1, z], "#d9ead3", true);
    }
  for (const [x, z] of [
    [-31, -4],
    [-30, 4],
    [-4, -31],
    [4, -31],
    [30, 17],
    [30, 23],
    [19, 26],
    [23, 27],
    [27, 25],
    [-4, 13],
    [-4, 18],
  ] as const) {
    kit.cylinder(city, 0.1, 1, [x, 0.6, z], "#877b65");
    kit.sphere(city, 1, [x, 1.9, z], "#64a58a");
  }
  const park = kit.box(city, [10, 0.13, 10], [23, 0.16, 23], "#719b85");
  park.receiveShadow = true;
  buildGardens(city, kit);
  for (const offset of [-2, 2]) {
    kit.box(city, [2, 0.18, 0.7], [23 + offset, 0.6, 28], "#b8a380");
    for (const x of [-0.7, 0.7])
      kit.box(city, [0.1, 0.5, 0.5], [23 + offset + x, 0.3, 28], "#3d5a5e");
  }
  const player = new THREE.Group();
  scene.add(player);
  kit.box(player, [0.55, 0.65, 0.35], [0, 1, 0], "#e69a6f");
  const leftLeg = kit.box(
    player,
    [0.2, 0.6, 0.25],
    [-0.17, 0.37, 0],
    "#203f50",
  );
  const rightLeg = kit.box(
    player,
    [0.2, 0.6, 0.25],
    [0.17, 0.37, 0],
    "#203f50",
  );
  const leftArm = kit.box(
    player,
    [0.16, 0.55, 0.22],
    [-0.38, 0.97, 0],
    "#db966d",
  );
  const rightArm = kit.box(
    player,
    [0.16, 0.55, 0.22],
    [0.38, 0.97, 0],
    "#db966d",
  );
  kit.sphere(player, 0.25, [0, 1.59, 0], "#e1c7a2");
  kit.sphere(player, 0.28, [0, 1.75, 0], "#a7ddc2");
  const citizenRing = kit.ring(player, 0.6, [0, 0.04, 0], "#dcecc7");
  let position: CityPoint = { x: 0, z: 7 };
  player.position.set(position.x, 0.22, position.z);
  const cars: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const car = new THREE.Group();
    kit.box(car, [0.9, 0.45, 1.8], [0, 0.5, 0], i % 2 ? "#e7b58a" : "#91bdbb");
    kit.box(car, [0.75, 0.3, 0.85], [0, 0.86, -0.15], "#2c525e");
    for (const x of [-0.5, 0.5])
      for (const z of [-0.55, 0.55]) {
        const wheel = kit.cylinder(car, 0.2, 0.14, [x, 0.27, z], "#162f3b", 10);
        wheel.rotation.z = Math.PI / 2;
      }
    city.add(car);
    cars.push(car);
  }
  const starsGeometry = kit.track(new THREE.BufferGeometry());
  const starsArray = new Float32Array(160 * 3);
  for (let i = 0; i < 160; i++) {
    starsArray[i * 3] = (Math.random() - 0.5) * 180;
    starsArray[i * 3 + 1] = 35 + Math.random() * 60;
    starsArray[i * 3 + 2] = (Math.random() - 0.5) * 180;
  }
  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starsArray, 3),
  );
  const stars = new THREE.Points(
    starsGeometry,
    kit.track(new THREE.PointsMaterial({ color: 0xd6e9e8, size: 0.12 })),
  );
  stars.visible = false;
  scene.add(stars);
  let mode: CitySnapshot["mode"] = "overview",
    room: ReturnType<typeof createFloorRoom> | null = null,
    active: CityBuilding | null = null;
  let paused = false,
    visible = true,
    lost = false,
    blocked = false,
    lastTime = 0,
    elapsed = 0,
    lastEmit = 0;
  let pad: CityPoint = { x: 0, z: 0 };
  const keys = new Set<string>();
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let flight: { position: THREE.Vector3; target: THREE.Vector3 } | null = null;
  const raycaster = new THREE.Raycaster();
  let press = { x: 0, y: 0 },
    dragged = false,
    lastHover = "";
  function update() {
    options.onUpdate({
      mode,
      position: { ...position },
      nearby:
        mode === "room"
          ? (active?.id ?? null)
          : (nearestDoor(position)?.id ?? null),
      heading: Math.atan2(
        camera.position.x - controls.target.x,
        camera.position.z - controls.target.z,
      ),
    });
  }
  function setFlight(point: THREE.Vector3, target: THREE.Vector3) {
    options.onHover("");
    lastHover = "";
    controls.enabled = false;
    flight = { position: point, target };
    if (paused || preference.matches) {
      camera.position.copy(point);
      controls.target.copy(target);
      flight = null;
      controls.enabled = !blocked;
      controls.update();
      draw();
    }
  }
  function clearRoom() {
    if (room) {
      scene.remove(room.root);
      room.kit.dispose();
      room = null;
    }
    district.blocks.forEach((block) => {
      block.root.visible = true;
      block.beacon.visible = false;
      block.name.visible = true;
    });
  }
  function overview() {
    if (active && room)
      position = { x: active.x, z: active.z + active.depth / 2 + 1.2 };
    player.position.set(position.x, 0.22, position.z);
    clearRoom();
    active = null;
    mode = "overview";
    controls.minDistance = 15;
    controls.maxDistance = 330;
    setFlight(overviewPosition(), new THREE.Vector3(0, 5, 0));
    update();
  }
  function walk() {
    if (active)
      position = { x: active.x, z: active.z + active.depth / 2 + 1.2 };
    clearRoom();
    active = null;
    mode = "street";
    player.position.set(position.x, 0.22, position.z);
    controls.minDistance = 5;
    controls.maxDistance = 32;
    setFlight(
      new THREE.Vector3(position.x + 8, 9, position.z + 12),
      new THREE.Vector3(position.x, 1, position.z),
    );
    update();
  }
  function inspect(id: string) {
    const building = cityBuildings.find((item) => item.id === id);
    if (!building) return;
    clearRoom();
    active = building;
    position = { x: building.x, z: building.z + building.depth / 2 + 1.2 };
    player.position.set(position.x, 0.22, position.z);
    mode = "building";
    district.blocks.get(id)!.beacon.visible = true;
    district.blocks.forEach((block, key) => { block.name.visible = key === id; });
    const height = building.floors.length * floorHeight;
    const distance = Math.max(24, height * 1.8);
    controls.minDistance = 8;
    controls.maxDistance = 80;
    setFlight(
      new THREE.Vector3(building.x + distance * 0.66, height * 0.45 + distance * 0.45, building.z + distance * 0.85),
      new THREE.Vector3(building.x, height * 0.45, building.z),
    );
    update();
  }
  function enter(id: string, floor: number) {
    const building = cityBuildings.find((item) => item.id === id);
    if (!building || floor < 0 || floor >= building.floors.length) return;
    clearRoom();
    active = building;
    mode = "room";
    district.blocks.get(id)!.root.visible = false;
    district.blocks.forEach((block) => { block.name.visible = false; });
    room = createFloorRoom(building, floor);
    scene.add(room.root);
    position = { x: building.x, z: building.z + 1.8 };
    player.position.set(position.x, room.floorY + 0.18, position.z);
    player.rotation.y = Math.PI;
    controls.minDistance = 4;
    controls.maxDistance = 19;
    const target = new THREE.Vector3(
      building.x,
      room.floorY + 1.25,
      building.z,
    );
    setFlight(
      new THREE.Vector3(building.x + 7.5, room.floorY + 6, building.z + 10),
      target,
    );
    update();
  }
  function leave() {
    if (active)
      position = { x: active.x, z: active.z + active.depth / 2 + 1.2 };
    walk();
  }
  function draw() {
    if (lost) return;
    renderer.render(scene, camera);
  }
  function frame(time: number) {
    if (time - lastTime < 1000 / 60 - 1) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
    lastTime = time;
    if (flight) {
      const smoothing = 1 - Math.exp(-7 * delta);
      camera.position.lerp(flight.position, smoothing);
      controls.target.lerp(flight.target, smoothing);
      if (
        camera.position.distanceTo(flight.position) < 0.05 &&
        controls.target.distanceTo(flight.target) < 0.05
      ) {
        camera.position.copy(flight.position);
        controls.target.copy(flight.target);
        flight = null;
        controls.enabled = !blocked;
      }
      controls.update();
    }
    const canMove = !blocked && !flight && !paused;
    const input = {
      x:
        pad.x +
        (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
        (keys.has("a") || keys.has("arrowleft") ? 1 : 0),
      z:
        pad.z +
        (keys.has("s") || keys.has("arrowdown") ? 1 : 0) -
        (keys.has("w") || keys.has("arrowup") ? 1 : 0),
    };
    const stride =
      canMove && (input.x || input.z) && !preference.matches
        ? Math.sin(time * 0.012) * 0.4
        : 0;
    leftLeg.rotation.x = stride;
    rightLeg.rotation.x = -stride;
    leftArm.rotation.x = -stride;
    rightArm.rotation.x = stride;
    if (canMove && (input.x || input.z)) {
      if (mode === "overview" || mode === "building") {
        mode = "street";
        clearRoom();
        active = null;
        controls.minDistance = 5;
        controls.maxDistance = 32;
      }
      const previous = { ...position };
      if (mode === "room" && active && room) {
        const magnitude = Math.max(1, Math.hypot(input.x, input.z));
        position = {
          x: THREE.MathUtils.clamp(
            position.x + (input.x / magnitude) * delta * 3.5,
            active.x - active.width / 2 + 0.7,
            active.x + active.width / 2 - 0.7,
          ),
          z: THREE.MathUtils.clamp(
            position.z + (input.z / magnitude) * delta * 3.5,
            active.z - active.depth / 2 + 0.7,
            active.z + active.depth / 2 - 0.7,
          ),
        };
      } else position = moveCitizen(position, input, delta);
      player.position.set(
        position.x,
        room ? room.floorY + 0.18 : 0.22,
        position.z,
      );
      player.rotation.y = Math.atan2(input.x, input.z);
      if (mode === "street") {
        const shift = new THREE.Vector3(
          position.x - previous.x,
          0,
          position.z - previous.z,
        );
        if (camera.position.distanceTo(player.position) > 30) {
          camera.position
            .copy(player.position)
            .add(new THREE.Vector3(8, 8, 12));
          controls.target.copy(player.position).add(new THREE.Vector3(0, 1, 0));
        } else {
          camera.position.add(shift);
          controls.target.add(shift);
        }
        controls.update();
      }
    }
    if (!paused && !preference.matches && !blocked) {
      elapsed += delta;
      cars.forEach((car, i) => {
        const z = ((elapsed * 2.5 + i * 17) % 66) - 33;
        car.position.set(i % 2 ? 1.5 : -1.5, 0, z);
        car.rotation.y = i % 2 ? Math.PI : 0;
      });
      citizenRing.rotation.z = elapsed * 0.2;
    }
    if (!flight && controls.enabled) controls.update();
    draw();
    if (time - lastEmit > 180) {
      lastEmit = time;
      update();
    }
  }
  function sync() {
    renderer.setAnimationLoop(null);
    lastTime = 0;
    if (lost) return;
    draw();
    if (visible && !document.hidden && !paused)
      renderer.setAnimationLoop(frame);
  }
  function drawOnControlChange() {
    if (paused) draw();
  }
  controls.addEventListener("change", drawOnControlChange);
  function overviewPosition() {
    return new THREE.Vector3(60, 52, 68).multiplyScalar(Math.max(1, 1.25 / camera.aspect));
  }
  const resize = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
    if (mode === "overview") {
      if (flight) flight.position.copy(overviewPosition());
      else {
        camera.position.copy(overviewPosition());
        controls.target.set(0, 5, 0);
        controls.update();
      }
    }
    draw();
  });
  resize.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersection.observe(canvas);
  function keyDown(event: KeyboardEvent) {
    if (
      blocked ||
      (event.target as HTMLElement)?.closest(
        "input,textarea,dialog,[contenteditable=true]",
      )
    )
      return;
    const key = event.key.toLowerCase();
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
      ].includes(key)
    ) {
      event.preventDefault();
      keys.add(key);
    }
    if (key === "e" && !event.repeat) {
      if (mode === "room") options.onRead();
      else {
        const building = nearestDoor(position);
        if (building) options.onEnter(building.id, 0);
      }
    }
  }
  function keyUp(event: KeyboardEvent) {
    keys.delete(event.key.toLowerCase());
  }
  function blur() {
    keys.clear();
    pad = { x: 0, z: 0 };
  }
  function pointerDown(event: PointerEvent) {
    press = { x: event.clientX, y: event.clientY };
    dragged = false;
    canvas.focus({ preventScroll: true });
  }
  function pointerMove(event: PointerEvent) {
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5)
      dragged = true;
    if (event.buttons || blocked || flight) return;
    const hit = pick(event);
    const object = hit?.object;
    let target: THREE.Object3D | null = object ?? null;
    while (target && !target.userData.buildingId && !target.userData.action)
      target = target.parent;
    const building = cityBuildings.find(
      (item) => item.id === target?.userData.buildingId,
    );
    const text =
      target?.userData.action === "read"
        ? "Open this floor’s dossier"
        : building
          ? `${building.name} / F${String((target?.userData.floor ?? 0) + 1).padStart(2, "0")}`
          : "";
    if (text !== lastHover) {
      lastHover = text;
      options.onHover(text);
    }
    canvas.style.cursor = text ? "pointer" : "grab";
  }
  function pick(event: MouseEvent | PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    const targets = room ? [room.root, ...city.children] : city.children;
    return raycaster.intersectObjects(targets, true).find((hit) => {
      let ancestor: THREE.Object3D | null = hit.object;
      while (ancestor) {
        if (!ancestor.visible) return false;
        ancestor = ancestor.parent;
      }
      let object: THREE.Object3D | null = hit.object;
      while (object && !object.userData.buildingId && !object.userData.action)
        object = object.parent;
      return !!object;
    });
  }
  function click(event: MouseEvent) {
    if (dragged || blocked || flight) return;
    const hit = pick(event);
    if (!hit) return;
    let object: THREE.Object3D | null = hit.object;
    while (object && !object.userData.buildingId && !object.userData.action)
      object = object.parent;
    if (object?.userData.action === "read") options.onRead();
    else if (object?.userData.action === "exit") options.onExit();
    else if (object?.userData.buildingId)
      options.onEnter(object.userData.buildingId, object.userData.floor ?? 0);
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    renderer.setAnimationLoop(null);
    options.onUnavailable();
  }
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("click", click);
  canvas.addEventListener("webglcontextlost", contextLost);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("blur", blur);
  document.addEventListener("visibilitychange", sync);
  preference.addEventListener("change", sync);
  sync();
  update();
  return {
    overview,
    walk,
    inspect,
    enter,
    leave,
    setMovement(value: CityPoint) {
      pad = value;
    },
    setBlocked(value: boolean) {
      blocked = value;
      controls.enabled = !value && !flight;
      blur();
    },
    setPaused(value: boolean) {
      paused = value;
      if (value && flight) {
        camera.position.copy(flight.position);
        controls.target.copy(flight.target);
        flight = null;
        controls.enabled = !blocked;
        controls.update();
      }
      sync();
    },
    setNight(value: boolean) {
      scene.background = new THREE.Color(value ? "#081721" : "#b9ced0");
      scene.fog = new THREE.Fog(value ? "#081721" : "#b9ced0", 200, 500);
      ambient.intensity = value ? 1.1 : 2.7;
      sun.intensity = value ? 0.7 : 3.5;
      stars.visible = value;
      scene.environmentIntensity = value ? 0.35 : 0.65;
      district.setNight(value);
      draw();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      intersection.disconnect();
      controls.removeEventListener("change", drawOnControlChange);
      controls.dispose();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("click", click);
      canvas.removeEventListener("webglcontextlost", contextLost);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      room?.kit.dispose();
      kit.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
