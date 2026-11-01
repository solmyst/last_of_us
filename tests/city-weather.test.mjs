import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = ts.transpileModule(readFileSync(new URL("../lib/city-weather.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { cityWeather } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
test("the simulated world cycles through night, day and rain with bounded temperatures", () => {
  const states = Array.from({ length: 1201 }, (_, i) => cityWeather(i));
  assert.ok(states.some(s => s.night));
  assert.ok(states.some(s => !s.night));
  assert.ok(states.some(s => s.condition === "Rain"));
  assert.ok(states.some(s => s.condition === "Clear"));
  for (const s of states) {
    assert.ok(s.hour >= 0 && s.hour < 24);
    assert.ok(s.temperature >= 15 && s.temperature <= 28);
    assert.ok(s.rain >= 0 && s.rain <= 1);
  }
  assert.equal(cityWeather(0).hour, cityWeather(600).hour);
  assert.equal(cityWeather(-20).hour, cityWeather(0).hour);
});
