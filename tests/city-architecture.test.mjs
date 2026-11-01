import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import * as THREE from "three";
const require = createRequire(import.meta.url);
function compile(path, replacements = {}) {
  let source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [from, to] of Object.entries(replacements)) source = source.replaceAll(`"${from}"`, `"${to}"`);
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}
const moduleUrl = (name) => name === "three"
  ? new URL("./three.module.js", pathToFileURL(require.resolve(name))).href
  : pathToFileURL(require.resolve(name)).href;
const layoutUrl = compile("../lib/city-layout.ts");
const { cityBuildings } = await import(layoutUrl);
const { createSceneKit } = await import(compile("../components/city/scene-kit.ts", {
  three: moduleUrl("three"),
  "three/examples/jsm/geometries/RoundedBoxGeometry.js": moduleUrl("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
}));
const { createLandmark, landmarkStyles } = await import(compile("../components/city/landmarks.ts", {
  three: moduleUrl("three"), "@/lib/city-layout": layoutUrl,
  "three/examples/jsm/utils/BufferGeometryUtils.js": moduleUrl("three/examples/jsm/utils/BufferGeometryUtils.js"),
}));
test("every address has a distinct landmark with finite geometry and pickable floors", () => {
  assert.equal(new Set(cityBuildings.map((b) => landmarkStyles[b.id])).size, cityBuildings.length);
  for (const building of cityBuildings) {
    const kit = createSceneKit(), root = new THREE.Group();
    const { floors } = createLandmark(kit, root, building);
    assert.equal(floors.length, building.floors.length);
    for (const [index, floor] of floors.entries()) {
      assert.deepEqual(floor.userData, { buildingId: building.id, floor: index });
      assert.ok(floor.children.length > 0 && floor.children.length <= 7, `${building.id} facade batching`);
    }
    root.traverse((object) => {
      if (!object.isMesh) return;
      const positions = object.geometry.getAttribute("position");
      assert.ok(Array.from(positions.array).every(Number.isFinite), building.id);
      object.geometry.computeBoundingSphere();
      assert.ok(Number.isFinite(object.geometry.boundingSphere.radius));
    });
    const bounds = new THREE.Box3().setFromObject(root);
    assert.ok(bounds.max.y >= building.floors.length * 3, building.id);
    kit.dispose();
  }
});
