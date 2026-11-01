"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  Footprints,
  Home,
  Info,
  Map,
  Moon,
  Pause,
  Play,
  Sun,
  X,
} from "lucide-react";
import {
  cityBuildings,
  cityRoute,
  parseCityRoute,
  type CityRoute,
} from "@/lib/city-layout";
import { personal } from "@/lib/data";
import type { createCity, CitySnapshot } from "./engine";
import CityDirectory from "./directory";
import Dossier from "./dossier";
import CityMinimap from "./minimap";
import DirectionPad from "./dpad";
const initialSnapshot: CitySnapshot = {
  mode: "overview",
  position: { x: 0, z: 7 },
  nearby: null,
  heading: 0,
};
const visitKey = "anush-buildverse-city-addresses";
export default function CityApp() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ReturnType<typeof createCity>>();
  const actions = useRef<{
    enter: (id: string, floor: number) => void;
    read: () => void;
    exit: () => void;
  }>({
    enter: () => {},
    read: () => {},
    exit: () => {},
  });
  const routeRef = useRef<CityRoute | null>(null);
  const [route, setRoute] = useState<CityRoute | null>(null);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [ready, setReady] = useState(false),
    [unavailable, setUnavailable] = useState(false);
  const [directory, setDirectory] = useState(false),
    [help, setHelp] = useState(true),
    [expanded, setExpanded] = useState(false);
  const [night, setNight] = useState(false),
    [paused, setPaused] = useState(false);
  const [hover, setHover] = useState("");
  const [travel, setTravel] = useState<"overview" | "walk">("overview");
  const [enterVersion, setEnterVersion] = useState(0);
  const [visited, setVisited] = useState<string[]>([]);
  const active =
    cityBuildings.find((building) => building.id === route?.id) ?? null;
  const floor = route?.floor ?? 0;
  function updateRoute(next: CityRoute | null, replace = false) {
    routeRef.current = next;
    setRoute(next);
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      next ? cityRoute(next) : "#city",
    );
  }
  function visit(id: string, level = 0, reading = false) {
    const building = cityBuildings.find((item) => item.id === id);
    if (!building || level < 0 || level >= building.floors.length) return;
    setDirectory(false);
    setHelp(false);
    setExpanded(window.innerWidth > 650);
    updateRoute({ id, floor: level, reading: reading || unavailable });
    setEnterVersion((current) => current + 1);
    setVisited((current) => {
      const next = current.includes(id) ? current : [...current, id];
      try {
        sessionStorage.setItem(visitKey, JSON.stringify(next));
      } catch {
        /* Exploration works without browser storage. */
      }
      return next;
    });
  }
  function openDossier() {
    if (routeRef.current) updateRoute({ ...routeRef.current, reading: true });
  }
  function closeDossier() {
    if (routeRef.current)
      updateRoute({ ...routeRef.current, reading: false }, true);
  }
  function goOverview() {
    setHelp(false);
    setTravel("overview");
    updateRoute(null);
    engine.current?.overview();
  }
  function goWalking() {
    setHelp(false);
    setTravel("walk");
    updateRoute(null);
    engine.current?.walk();
  }
  actions.current = { enter: visit, read: openDossier, exit: goWalking };
  useEffect(() => {
    const synchronize = () => {
      const next = parseCityRoute(window.location.hash);
      if (
        next?.id !== routeRef.current?.id ||
        next?.floor !== routeRef.current?.floor
      )
        setEnterVersion((value) => value + 1);
      if (!next) setTravel("overview");
      routeRef.current = next;
      setRoute(next);
      if (next) {
        setHelp(false);
        setExpanded(window.innerWidth > 650);
      }
    };
    synchronize();
    window.addEventListener("hashchange", synchronize);
    window.addEventListener("popstate", synchronize);
    try {
      const saved = JSON.parse(sessionStorage.getItem(visitKey) ?? "[]");
      if (Array.isArray(saved))
        setVisited(
          Array.from(
            new Set(
              saved.filter(
                (id: unknown): id is string =>
                  typeof id === "string" &&
                  cityBuildings.some((building) => building.id === id),
              ),
            ),
          ),
        );
    } catch {
      /* Optional local passport. */
    }
    return () => {
      window.removeEventListener("hashchange", synchronize);
      window.removeEventListener("popstate", synchronize);
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    import("./engine")
      .then(({ createCity }) => {
        if (cancelled) return;
        try {
          engine.current = createCity(canvas.current!, {
            onEnter: (id, level) => actions.current.enter(id, level),
            onRead: () => actions.current.read(),
            onExit: () => actions.current.exit(),
            onUpdate: setSnapshot,
            onHover: setHover,
            onUnavailable: () => {
              setUnavailable(true);
              setDirectory(true);
            },
          });
          setReady(true);
        } catch {
          setUnavailable(true);
          setDirectory(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUnavailable(true);
          setDirectory(true);
        }
      });
    return () => {
      cancelled = true;
      engine.current?.dispose();
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (route?.id) engine.current?.enter(route.id, route.floor);
    else if (travel === "walk") engine.current?.walk();
    else engine.current?.overview();
  }, [ready, route?.id, route?.floor, travel, enterVersion]);
  useEffect(() => {
    engine.current?.setBlocked(directory || !!route?.reading);
  }, [ready, directory, route?.reading]);
  useEffect(() => {
    engine.current?.setNight(night);
  }, [ready, night]);
  useEffect(() => {
    engine.current?.setPaused(paused);
  }, [ready, paused]);
  const nearby = cityBuildings.find(
    (building) => building.id === snapshot.nearby,
  );
  return (
    <main
      id="main-content"
      className={`city-app ${ready ? "city-ready" : ""} ${night ? "city-night" : ""}`}
      tabIndex={-1}
    >
      <h1 className="sr-only">
        Anush Gupta’s Buildverse City — an explorable 3D portfolio
      </h1>
      <canvas
        ref={canvas}
        className="city-canvas"
        tabIndex={0}
        role="application"
        aria-label="Buildverse City. Drag to orbit, scroll to zoom, use W A S D or arrow keys to walk, E to enter a nearby building or read a room display. The city directory provides keyboard navigation to every destination."
      />
      {!ready && !unavailable && (
        <div className="city-loading" role="status">
          <span className="city-loading-mark">
            a<span>✳</span>
          </span>
          <h2>Opening the district.</h2>
          <p>Fourteen buildings. A whole portfolio inside.</p>
          <i />
        </div>
      )}
      {unavailable && (
        <div className="city-unavailable">
          <Building2 size={34} />
          <h2>The city is still open.</h2>
          <p>
            The 3D view is unavailable on this device. Use the directory to
            enter every building and read its floors.
          </p>
          <button type="button" onClick={() => setDirectory(true)}>
            Open city directory
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      <header className="city-topbar">
        <button
          type="button"
          className="city-brand"
          onClick={goOverview}
          aria-label="Return to city overview"
        >
          <span>
            a<span>✳</span>
          </span>
          <div>
            BUILDVERSE<span>ANUSH GUPTA / PRODUCT × CODE</span>
          </div>
        </button>
        <div className="city-top-location">
          <span className="city-signal" />
          {active ? active.name : "A SOCIETY OF IDEAS"}
          <small>
            {active
              ? `F${String(floor + 1).padStart(2, "0")} / ${snapshot.mode === "building" ? "EXTERIOR" : "INTERIOR"}`
              : "EST. 2023 · ALWAYS BUILDING"}
          </small>
        </div>
        <div className="city-top-actions">
          <button
            type="button"
            className="city-icon"
            onClick={() => setNight(!night)}
            aria-label={night ? "Switch to daylight" : "Switch to night"}
          >
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="city-icon"
            aria-label={
              paused ? "Resume city animation" : "Pause city animation"
            }
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <button
            type="button"
            className="city-icon"
            onClick={() => setHelp(!help)}
            aria-label="Show game controls"
            aria-pressed={help}
          >
            <Info size={18} />
          </button>
          <a
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="city-resume"
          >
            Resume
            <ArrowUpRight size={14} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </header>
      {help && !active && (
        <aside className="city-welcome">
          <button
            type="button"
            className="city-icon welcome-close"
            aria-label="Hide welcome panel"
            onClick={() => setHelp(false)}
          >
            <X size={15} />
          </button>
          <p className="city-kicker">WELCOME TO MY DATA SOCIETY</p>
          <h2>
            Every building
            <br />
            has a story.
          </h2>
          <p>
            Projects are places. Floors are chapters. There’s a whole portfolio
            behind these doors.
          </p>
          <div>
            <button type="button" className="city-primary" onClick={goWalking}>
              <Footprints size={16} />
              Walk the streets
            </button>
            <button
              type="button"
              className="city-secondary"
              onClick={() => setDirectory(true)}
            >
              Choose an address
              <ArrowUpRight size={15} />
            </button>
          </div>
          <ul>
            <li>
              <kbd>DRAG</kbd>Orbit the city
            </li>
            <li>
              <kbd>SCROLL</kbd>Zoom in & out
            </li>
            <li>
              <kbd>W A S D</kbd>Walk · arrows work too
            </li>
            <li>
              <kbd>E</kbd>Enter / read the display
            </li>
          </ul>
        </aside>
      )}
      {active && (
        <aside
          className={`city-floor-panel ${expanded ? "is-expanded" : ""}`}
          style={{ "--district-color": active.color } as React.CSSProperties}
        >
          <button
            type="button"
            className="city-floor-heading"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="city-floor-list"
          >
            <span>
              <small>
                {snapshot.mode === "building"
                  ? "BUILDING EXTERIOR"
                  : "YOU ARE INSIDE"}
              </small>
              <strong>{active.name}</strong>
            </span>
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>
          <div
            id="city-floor-list"
            className="city-floor-list"
            role="group"
            aria-label={`Floors in ${active.name}`}
          >
            {active.floors.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={floor === index && snapshot.mode === "room"}
                onClick={() => visit(active.id, index)}
              >
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="city-floor-actions">
            <button
              type="button"
              className="city-primary"
              onClick={() =>
                snapshot.mode === "building"
                  ? visit(active.id, floor)
                  : openDossier()
              }
            >
              <BookOpen size={15} />
              {snapshot.mode === "building" ? "Enter floor" : "Read dossier"}
            </button>
            <button
              type="button"
              className="city-secondary"
              onClick={() => engine.current?.inspect(active.id)}
            >
              <Building2 size={15} />
              Exterior
            </button>
            <button
              type="button"
              className="city-secondary"
              onClick={goWalking}
            >
              <ArrowDown size={15} />
              Exit to street
            </button>
          </div>
        </aside>
      )}
      <CityMinimap
        position={snapshot.position}
        active={active?.id ?? null}
        onOpen={() => setDirectory(true)}
      />
      {(snapshot.mode === "street" || snapshot.mode === "room") && (
        <DirectionPad onMove={(point) => engine.current?.setMovement(point)} />
      )}
      <div className="city-hover-note" role="status">
        {hover && (
          <>
            <span className="city-signal" />
            {hover}
          </>
        )}
      </div>
      <footer className="city-bottom-hud">
        <div className="city-travel-controls">
          <button
            type="button"
            onClick={goOverview}
            className={snapshot.mode === "overview" ? "active" : ""}
          >
            <Home size={17} />
            <span>City overview</span>
          </button>
          <button
            type="button"
            onClick={goWalking}
            className={snapshot.mode === "street" ? "active" : ""}
          >
            <Footprints size={17} />
            <span>Walk</span>
          </button>
          <button type="button" onClick={() => setDirectory(true)}>
            <Map size={17} />
            <span>Directory</span>
          </button>
        </div>
        <div className="city-interact">
          {snapshot.mode === "room" ? (
            <button type="button" onClick={openDossier}>
              <kbd>E</kbd>Read this floor’s dossier
              <ArrowUpRight size={14} />
            </button>
          ) : nearby ? (
            <button type="button" onClick={() => visit(nearby.id, 0)}>
              <kbd>E</kbd>Enter {nearby.name}
              <ArrowUpRight size={14} />
            </button>
          ) : (
            <span>
              {snapshot.mode === "street"
                ? "WASD / ARROWS TO WALK · FIND A DOOR"
                : "SELECT A BUILDING OR A FACADE FLOOR TO ENTER"}
            </span>
          )}
        </div>
        <div className="city-passport">
          <span>
            {String(visited.length).padStart(2, "0")}
            <small> / {cityBuildings.length}</small>
          </span>
          <p>ADDRESSES DISCOVERED</p>
        </div>
      </footer>
      <CityDirectory
        open={directory}
        onClose={() => setDirectory(false)}
        onVisit={(id) => visit(id, 0)}
        visited={visited}
      />
      <Dossier
        building={active}
        floor={floor}
        open={!!route?.reading}
        onClose={closeDossier}
        onFloor={(next) => active && visit(active.id, next, true)}
      />
    </main>
  );
}
