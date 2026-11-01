import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
// Test the actual TypeScript module using the repository's existing compiler.
// This keeps the tests compatible with the Node 20 CI runtime without another runner.
const source = readFileSync(
  new URL("../lib/city-layout.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { cityBuildings, moveCitizen, nearestDoor, parseCityRoute, cityRoute } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );

test("the city gives each project its own building and houses the whole portfolio", () => {
  assert.equal(
    cityBuildings.filter((building) => building.kind === "project").length,
    9,
  );
  assert.equal(
    new Set(cityBuildings.map((building) => building.id)).size,
    cityBuildings.length,
  );
  for (const kind of ["experience", "skills", "about", "decisions", "contact"])
    assert.ok(cityBuildings.some((building) => building.kind === kind));
  assert.ok(cityBuildings.every((building) => building.floors.length > 0));
});
test("movement is frame-time safe and stays inside the district", () => {
  const moved = moveCitizen({ x: 0, z: 0 }, { x: 1, z: 1 }, 1);
  assert.ok(Math.hypot(moved.x, moved.z) <= 1.21);
  let position = { x: 0, z: 0 };
  for (let i = 0; i < 2000; i++)
    position = moveCitizen(position, { x: 1, z: 0 }, 0.1);
  assert.ok(position.x <= 32 && position.x >= -32);
});
test("a citizen cannot walk through buildings, but can slide along their edge", () => {
  const building = cityBuildings[0];
  const start = { x: building.x - building.width / 2 - 0.5, z: building.z };
  const blocked = moveCitizen(start, { x: 1, z: 0 }, 0.1);
  assert.equal(blocked.x, start.x);
  const slide = moveCitizen(start, { x: 1, z: 1 }, 0.1);
  assert.ok(slide.z > start.z);
  assert.equal(slide.x, start.x);
});
test("interaction chooses a nearby entrance, rather than a distant building", () => {
  assert.equal(nearestDoor({ x: 0, z: 0 }), null);
  const building = cityBuildings[0];
  assert.equal(
    nearestDoor({ x: building.x, z: building.z + building.depth / 2 + 1 })?.id,
    building.id,
  );
});
test("deep links round-trip floors and reading mode and reject invalid destinations", () => {
  const building = cityBuildings.find(
    (building) => building.id === "relay-voice",
  );
  const route = { id: building.id, floor: 1, reading: true };
  assert.deepEqual(parseCityRoute(cityRoute(route)), route);
  assert.equal(parseCityRoute("#city/not-a-building/1"), null);
  assert.equal(parseCityRoute("#city/relay-voice/999"), null);
  assert.equal(parseCityRoute("#city/relay-voice/NaN"), null);
  assert.equal(parseCityRoute("#city/relay-voice/-1"), null);
  assert.equal(parseCityRoute("#city/relay-voice/1/unknown"), null);
});
