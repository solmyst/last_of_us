"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Check, Compass, Pause, Play } from "lucide-react";
import { landmarks } from "@/lib/buildverse";
import type { createBuildverse } from "@/components/buildverse-world";

type Props = {
  onSelect: (id: string) => void;
  visited: string[];
  selected: string | null;
};
export default function BuildverseMap({ onSelect, visited, selected }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pinRefs = useRef(new Map<string, HTMLButtonElement>());
  const engine = useRef<ReturnType<typeof createBuildverse>>();
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    let disposed = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    import("@/components/buildverse-world")
      .then(({ createBuildverse }) => {
        if (disposed) return;
        try {
          engine.current = createBuildverse(canvas.current!, {
            onSelect: (id) => selectRef.current(id),
            onUnavailable: () => {
              setFallback(true);
              setReady(false);
            },
            onProject: (pins) =>
              pins.forEach((pin) => {
                const button = pinRefs.current.get(pin.id);
                if (button) {
                  button.style.left = `${pin.x}px`;
                  button.style.top = `${pin.y}px`;
                }
              }),
          });
          setReady(true);
        } catch {
          setFallback(true);
        }
      })
      .catch(() => {
        if (!disposed) setFallback(true);
      });
    return () => {
      disposed = true;
      preference.removeEventListener("change", syncPreference);
      engine.current?.dispose();
    };
  }, []);
  useEffect(() => {
    engine.current?.setSelected(selected ?? "");
  }, [selected]);
  const discovered = landmarks.filter((item) =>
    visited.includes(item.id),
  ).length;
  return (
    <div className={`buildverse-map ${fallback ? "map-is-fallback" : ""}`}>
      <div className="map-topline">
        <span>
          <i />
          Live from the buildverse
        </span>
        <span className="map-version">EST. 2023 / STILL BUILDING</span>
      </div>
      <div className="map-viewport">
        {!ready && (
          <div className="map-placeholder" aria-hidden="true">
            <div className="map-placeholder-island">
              <Compass />
            </div>
            <span>
              {fallback
                ? "A map of the things I make"
                : "Mapping a few good ideas…"}
            </span>
          </div>
        )}
        <canvas
          ref={canvas}
          className={ready ? "world-canvas ready" : "world-canvas"}
          aria-hidden="true"
        />
        <div className="world-pins" aria-label="Explore project landmarks">
          {landmarks.map((place, index) => (
            <button
              key={place.id}
              ref={(element) => {
                if (element) pinRefs.current.set(place.id, element);
                else pinRefs.current.delete(place.id);
              }}
              type="button"
              className={`world-pin ${visited.includes(place.id) ? "is-discovered" : ""}`}
              style={
                {
                  "--place-color": place.color,
                  left: `${[26, 68, 20, 53, 85][index]}%`,
                  top: `${[30, 23, 66, 70, 53][index]}%`,
                  "--fallback-x": `${[26, 68, 20, 53, 85][index]}%`,
                  "--fallback-y": `${[30, 23, 66, 70, 53][index]}%`,
                } as CSSProperties
              }
              onClick={() => onSelect(place.id)}
              aria-label={`Explore ${place.short}: ${place.label}${visited.includes(place.id) ? ", visited" : ""}`}
            >
              <b>
                {visited.includes(place.id) ? (
                  <Check size={13} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </b>
              <span>
                <strong>{place.short}</strong>
                <small>{place.label}</small>
              </span>
              <ArrowUpRight size={13} className="pin-arrow" />
            </button>
          ))}
        </div>
      </div>
      <div className="map-bottomline">
        <span>
          <span className="map-discover-count">
            {discovered}
            <span>/05</span>
          </span>
          places discovered
        </span>
        <span className="map-hint">Select a landmark to step inside ↗</span>
        {ready && !reduced && (
          <button
            type="button"
            className="world-motion"
            aria-label={
              paused ? "Resume world animation" : "Pause world animation"
            }
            aria-pressed={paused}
            onClick={() => {
              const next = !paused;
              setPaused(next);
              engine.current?.setPaused(next);
            }}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
        {reduced && <span className="map-version">STILL MODE</span>}
      </div>
      <div className="mobile-map-key">
        {landmarks.map((place, index) => (
          <button
            type="button"
            key={place.id}
            onClick={() => onSelect(place.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {place.short}
            <ArrowUpRight size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}
