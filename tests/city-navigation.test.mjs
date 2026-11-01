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

const dataSource = readFileSync(
  new URL("../lib/data.ts", import.meta.url),
  "utf8",
);
const dataCode = ts.transpileModule(dataSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const dataUrl = `data:text/javascript;base64,${Buffer.from(dataCode).toString("base64")}`;
const layoutUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const contentSource = readFileSync(
  new URL("../lib/city-content.ts", import.meta.url),
  "utf8",
)
  .replaceAll('"@/lib/data"', JSON.stringify(dataUrl))
  .replaceAll('"@/lib/city-layout"', JSON.stringify(layoutUrl));
const contentCode = ts.transpileModule(contentSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { floorContent } = await import(
  `data:text/javascript;base64,${Buffer.from(contentCode).toString("base64")}`
);

test("every physical floor resolves real written content", () => {
  let floorCount = 0;
  for (const building of cityBuildings)
    for (let floor = 0; floor < building.floors.length; floor++) {
      const content = floorContent(building, floor);
      floorCount++;
      assert.ok(content.title.length > 0, `${building.id}/${floor}: title`);
      assert.ok(
        content.sections.length > 0,
        `${building.id}/${floor}: sections`,
      );
      assert.ok(
        content.sections.every(
          (section) => section.text?.length || section.bullets?.length,
        ),
        `${building.id}/${floor}: actual content`,
      );
      assert.ok(
        content.links.every((link) =>
          /^(https:\/\/|mailto:|\/)/.test(link.href),
        ),
        `${building.id}/${floor}: link`,
      );
    }
  assert.equal(floorCount, 50);
});
test("project floors separate the problem, implementation, and decisions", () => {
  const interview = cityBuildings.find(
    (building) => building.id === "interview-ace",
  );
  assert.equal(floorContent(interview, 0).sections[0].heading, "The problem");
  assert.equal(floorContent(interview, 1).sections[0].heading, "What I built");
  assert.match(floorContent(interview, 2).sections[0].text, /Answer Lab/);
});
