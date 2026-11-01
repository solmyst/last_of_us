import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  cityBuildings,
  moveCitizen,
  nearestDoor,
  driveCar,
  isBlocked,
  type CarState,
  floorHeight,
  type CityBuilding,
  type CityPoint,
} from "@/lib/city-layout";
import { createSceneKit } from "./scene-kit";
import { buildDistrict, createFloorRoom } from "./architecture";
import { buildGardens } from "./gardens";
import { createCharacter, heroLook } from "./characters";
import { createCrowd } from "./crowd";
import { createHeroCar } from "./vehicles";
export type CitySnapshot = {
  mode: "overview" | "street" | "room" | "building";
  position: CityPoint;
  nearby: string | null;
  heading: number;
  sprinting: boolean;
  driving: boolean;
  nearCar: boolean;
  car: CarState;
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
  const hero = createCharacter(kit, heroLook);
  const player = hero.root;
  scene.add(player);
  const crowd = createCrowd(city, kit);
  const heroCar = createHeroCar(kit);
  city.add(heroCar.root);
  let carState: CarState = { x: -6, z: 1.5, heading: Math.PI / 2, speed: 0 };
  let driving = false;
  heroCar.root.position.set(carState.x, 0.1, carState.z);
  heroCar.root.rotation.y = carState.heading;
  // GTA-style checkpoint: a glowing column at the current mission stop.
  const checkpoint = new THREE.Mesh(
    kit.track(new THREE.CylinderGeometry(1.3, 1.3, 7, 40, 1, true)),
    kit.track(
      new THREE.MeshBasicMaterial({
        color: 0xf2c46d,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  checkpoint.visible = false;
  scene.add(checkpoint);
  const citizenRing = kit.ring(player, 0.6, [0, 0.04, 0], "#dcecc7");
  let position: CityPoint = { x: 0, z: 7 };
  // The central plaza disc is raised; everywhere else is street level.
  const groundY = (point: CityPoint) =>
    Math.hypot(point.x, point.z - 5) < 5.2 ? 0.2 : 0.1;
  const velocity = new THREE.Vector2();
  // Building volumes the street camera must not pass through.
  const blockers = cityBuildings.map(
    (building) =>
      new THREE.Box3(
        new THREE.Vector3(building.x - building.width / 2 - 0.4, 0, building.z - building.depth / 2 - 0.4),
        new THREE.Vector3(building.x + building.width / 2 + 0.4, building.floors.length * floorHeight + 6, building.z + building.depth / 2 + 0.4),
      ),
  );
  const cameraRay = new THREE.Ray();
  const cameraHit = new THREE.Vector3();
  let preferredDistance = 10,
    cameraPulled = false;
  // Pull the camera in front of any building between it and the hero, then let it ease back out.
  function avoidWalls() {
    const offset = camera.position.clone().sub(controls.target);
    if (!cameraPulled) preferredDistance = offset.length();
    cameraRay.set(controls.target, offset.clone().normalize());
    let nearest = preferredDistance;
    for (const box of blockers)
      if (cameraRay.intersectBox(box, cameraHit))
        nearest = Math.min(nearest, cameraHit.distanceTo(controls.target) - 0.4);
    const current = offset.length();
    const next =
      nearest < preferredDistance
        ? Math.max(1.6, nearest)
        : current + (preferredDistance - current) * 0.15;
    cameraPulled = next < preferredDistance - 0.05;
    camera.position.copy(controls.target).add(offset.setLength(next));
  }
  const wrapAngle = (angle: number) =>
    THREE.MathUtils.euclideanModulo(angle + Math.PI, Math.PI * 2) - Math.PI;
  let jumpY = 0,
    jumpSpeed = 0,
    sprinting = false,
    lastDrag = -Infinity;
  player.position.set(position.x, groundY(position), position.z);
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
      sprinting,
      driving,
      nearCar: !driving && carDistance() < 3.4,
      car: { ...carState },
    });
  }
  function carDistance() {
    return Math.hypot(position.x - carState.x, position.z - carState.z);
  }
  // Step out on whichever side of the car is clear.
  function parkHero() {
    if (!driving) return;
    driving = false;
    player.visible = true;
    carState.speed = 0;
    velocity.set(0, 0);
    const side = { x: Math.cos(carState.heading), z: -Math.sin(carState.heading) };
    const spot = [1.8, -1.8]
      .map((d) => ({ x: carState.x + side.x * d, z: carState.z + side.z * d }))
      .find((point) => Math.abs(point.x) < 32 && Math.abs(point.z) < 32 && !isBlocked(point, 0.45));
    position = spot ?? { x: carState.x, z: carState.z };
    player.rotation.y = carState.heading;
  }
  function toggleCar() {
    if (blocked || flight || mode === "room") return;
    if (driving) parkHero();
    else if (carDistance() < 3.4) {
      driving = true;
      player.visible = false;
      sprinting = false;
      jumpY = jumpSpeed = 0;
      if (mode !== "street") {
        clearRoom();
        active = null;
        mode = "street";
        controls.minDistance = 5;
        controls.maxDistance = 32;
      }
      position = { x: carState.x, z: carState.z };
      setFlight(
        new THREE.Vector3(
          carState.x - Math.sin(carState.heading) * 10,
          4.8,
          carState.z - Math.cos(carState.heading) * 10,
        ),
        new THREE.Vector3(carState.x, 1.3, carState.z),
      );
    }
    update();
  }
  function setFlight(point: THREE.Vector3, target: THREE.Vector3) {
    options.onHover("");
    lastHover = "";
    controls.enabled = false;
    cameraPulled = false;
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
    parkHero();
    if (active && room)
      position = { x: active.x, z: active.z + active.depth / 2 + 1.2 };
    player.position.set(position.x, groundY(position), position.z);
    clearRoom();
    active = null;
    mode = "overview";
    controls.minDistance = 15;
    controls.maxDistance = 330;
    setFlight(overviewPosition(), new THREE.Vector3(0, 5, 0));
    update();
  }
  function walk() {
    parkHero();
    // Leaving a door: face the street and frame the hero from the front-side.
    const exiting = !!active;
    if (active) {
      position = { x: active.x, z: active.z + active.depth / 2 + 1.2 };
      player.rotation.y = 0;
    }
    clearRoom();
    active = null;
    mode = "street";
    player.position.set(position.x, groundY(position), position.z);
    controls.minDistance = 5;
    controls.maxDistance = 32;
    setFlight(
      exiting
        ? new THREE.Vector3(position.x + 5, 4.5, position.z + 8)
        : new THREE.Vector3(
            position.x - Math.sin(player.rotation.y) * 9,
            5.5,
            position.z - Math.cos(player.rotation.y) * 9,
          ),
      new THREE.Vector3(position.x, 1.4, position.z),
    );
    update();
  }
  function inspect(id: string) {
    parkHero();
    const building = cityBuildings.find((item) => item.id === id);
    if (!building) return;
    clearRoom();
    active = building;
    position = { x: building.x, z: building.z + building.depth / 2 + 1.2 };
    player.position.set(position.x, groundY(position), position.z);
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
    parkHero();
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
  // Bloom only runs at night, where emissive windows, lamps and lights glow neon.
  let composer: EffectComposer | null = null,
    night = false;
  function bloom() {
    if (!composer) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.45, 0.9),
      );
      composer.addPass(new OutputPass());
      const size = renderer.getSize(new THREE.Vector2());
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(size.x, size.y);
    }
    return composer;
  }
  function draw() {
    if (lost) return;
    if (night) bloom().render();
    else renderer.render(scene, camera);
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
    const raw = {
      x:
        pad.x +
        (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
        (keys.has("a") || keys.has("arrowleft") ? 1 : 0),
      z:
        pad.z +
        (keys.has("s") || keys.has("arrowdown") ? 1 : 0) -
        (keys.has("w") || keys.has("arrowup") ? 1 : 0),
    };
    const azimuth = Math.atan2(
      camera.position.x - controls.target.x,
      camera.position.z - controls.target.z,
    );
    const previous = { ...position };
    let facing = player.rotation.y,
      moved = false;
    if (driving) {
      const steer = THREE.MathUtils.clamp(raw.x, -1, 1);
      if (canMove)
        carState = driveCar(
          carState,
          {
            throttle: THREE.MathUtils.clamp(-raw.z, -1, 1),
            steer,
            boost: keys.has("shift"),
            brake: keys.has(" "),
          },
          delta,
        );
      heroCar.animate(preference.matches ? 0 : delta, carState.speed, steer);
      heroCar.root.position.set(carState.x, 0.1, carState.z);
      heroCar.root.rotation.y = carState.heading;
      position = { x: carState.x, z: carState.z };
      facing = carState.heading;
      moved = carState.speed !== 0;
      sprinting = keys.has("shift") && Math.abs(carState.speed) > 15;
    } else {
      // Input is relative to where the camera looks, like a third-person game.
      const forward = { x: -Math.sin(azimuth), z: -Math.cos(azimuth) };
      const right = { x: -forward.z, z: forward.x };
      const desired = canMove
        ? new THREE.Vector2(
            right.x * raw.x - forward.x * raw.z,
            right.z * raw.x - forward.z * raw.z,
          )
        : new THREE.Vector2();
      if (desired.length() > 1) desired.normalize();
      sprinting = canMove && keys.has("shift") && desired.length() > 0.1;
      velocity.lerp(desired, 1 - Math.exp(-(desired.length() ? 12 : 16) * delta));
      if (velocity.length() < 0.01) velocity.set(0, 0);
      if (canMove && keys.has(" ") && jumpY === 0 && !preference.matches)
        jumpSpeed = 7;
      if (jumpY > 0 || jumpSpeed > 0) {
        jumpSpeed -= 24 * delta;
        jumpY = Math.max(0, jumpY + jumpSpeed * delta);
        if (jumpY === 0) jumpSpeed = 0;
      }
      const pace = velocity.length() * (sprinting ? 1.8 : 1);
      hero.animate(preference.matches ? 0 : delta, preference.matches ? 0 : pace, jumpY > 0, time / 1000);
      if (velocity.length() && canMove) {
        if (mode === "overview" || mode === "building") {
          mode = "street";
          clearRoom();
          active = null;
          controls.minDistance = 5;
          controls.maxDistance = 32;
        }
        const input = { x: velocity.x, z: velocity.y };
        if (mode === "room" && active && room) {
          const step = delta * (sprinting ? 5.5 : 3.5);
          position = {
            x: THREE.MathUtils.clamp(
              position.x + input.x * step,
              active.x - active.width / 2 + 0.7,
              active.x + active.width / 2 - 0.7,
            ),
            z: THREE.MathUtils.clamp(
              position.z + input.z * step,
              active.z - active.depth / 2 + 0.7,
              active.z + active.depth / 2 - 0.7,
            ),
          };
        } else position = moveCitizen(position, input, delta, sprinting ? 11 : 6);
        // Ease the turn instead of snapping to the new heading.
        const turn = wrapAngle(Math.atan2(input.x, input.z) - player.rotation.y);
        player.rotation.y += turn * (1 - Math.exp(-14 * delta));
        facing = player.rotation.y;
        moved = true;
      }
    }
    if (moved && mode === "street") {
      const shift = new THREE.Vector3(
        position.x - previous.x,
        0,
        position.z - previous.z,
      );
      const anchor = new THREE.Vector3(position.x, 0, position.z);
      if (camera.position.distanceTo(anchor) > 34) {
        camera.position.copy(anchor).add(new THREE.Vector3(0, 5.5, 9));
        controls.target.copy(anchor).add(new THREE.Vector3(0, 1.4, 0));
      } else {
        camera.position.add(shift);
        controls.target.add(shift);
      }
      // Swing the camera behind the hero (or car) unless the visitor is steering it.
      const behind = wrapAngle(facing + Math.PI - azimuth);
      const reversing = driving && carState.speed < 0;
      if (time - lastDrag > 1200 && !reversing && Math.abs(behind) < (driving ? Math.PI : 1.9)) {
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          behind * (1 - Math.exp(-(driving ? 4 : sprinting ? 3 : 1.6) * delta)),
        );
        camera.position.copy(controls.target).add(offset);
      }
      controls.update();
    }
    player.position.set(
      position.x,
      (room ? room.floorY + 0.18 : groundY(position)) + jumpY,
      position.z,
    );
    const fov = preference.matches
      ? 48
      : driving
        ? 48 + Math.min(Math.abs(carState.speed), 30) * 0.4
        : sprinting
          ? 58
          : 48;
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov += (fov - camera.fov) * (1 - Math.exp(-6 * delta));
      camera.updateProjectionMatrix();
    }
    if (checkpoint.visible && !preference.matches) {
      checkpoint.scale.set(1 + Math.sin(time * 0.004) * 0.08, 1, 1 + Math.sin(time * 0.004) * 0.08);
      checkpoint.rotation.y = time * 0.001;
    }
    if (!paused && !preference.matches && !blocked) {
      elapsed += delta;
      cars.forEach((car, i) => {
        const z = ((elapsed * 2.5 + i * 17) % 66) - 33;
        car.position.set(i % 2 ? 1.5 : -1.5, 0, z);
        car.rotation.y = i % 2 ? Math.PI : 0;
      });
      citizenRing.rotation.z = elapsed * 0.2;
      crowd.update(
        delta,
        elapsed,
        position,
        true,
        driving && Math.abs(carState.speed) > 4 ? carState : null,
      );
    } else if (!blocked) {
      crowd.update(0, elapsed, position, false);
    }
    if (!flight && controls.enabled) controls.update();
    if (mode === "street" && !flight) avoidWalls();
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
    composer?.setSize(rect.width, rect.height);
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
    // Space still activates a focused button.
    if (key === " " && (event.target as HTMLElement)?.closest("button,a")) return;
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
        "shift",
        " ",
      ].includes(key)
    ) {
      event.preventDefault();
      keys.add(key);
    }
    if (key === "f" && !event.repeat) toggleCar();
    if (key === "e" && !event.repeat && !driving) {
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
    lastDrag = performance.now();
    dragged = false;
    canvas.focus({ preventScroll: true });
  }
  function pointerMove(event: PointerEvent) {
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5)
      dragged = true;
    if (event.buttons) lastDrag = performance.now();
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
    toggleCar,
    setCheckpoint(point: CityPoint | null) {
      checkpoint.visible = !!point;
      if (point) checkpoint.position.set(point.x, 3.5, point.z);
    },
    setAttract(value: boolean) {
      controls.autoRotate = value && !preference.matches;
      controls.autoRotateSpeed = 0.45;
    },
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
      night = value;
      scene.background = new THREE.Color(value ? "#081721" : "#b9ced0");
      scene.fog = new THREE.Fog(value ? "#081721" : "#b9ced0", 200, 500);
      ambient.intensity = value ? 1.1 : 2.7;
      sun.intensity = value ? 0.7 : 3.5;
      stars.visible = value;
      scene.environmentIntensity = value ? 0.35 : 0.65;
      district.setNight(value);
      heroCar.setNight(value);
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
      composer?.dispose();
      renderer.dispose();
    },
  };
}
