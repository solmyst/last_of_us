"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { createProductScene } from "@/components/product-scene";

export default function ProductCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createProductScene>>();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    const element = canvas.current!;
    const onUnavailable = () => {
      setUnavailable(true);
      setReady(false);
    };
    element.addEventListener("scene-unavailable", onUnavailable);
    import("@/components/product-scene")
      .then(({ createProductScene }) => {
        if (cancelled) return;
        try {
          scene.current = createProductScene(element);
          setReady(true);
        } catch {
          setUnavailable(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });
    return () => {
      cancelled = true;
      preference.removeEventListener("change", syncPreference);
      element.removeEventListener("scene-unavailable", onUnavailable);
      scene.current?.dispose();
    };
  }, []);

  return (
    <figure className="product-figure">
      <div className="scene-topline">
        <span className="scene-kicker">The build loop</span>
        <span className="scene-edition">01 — 03</span>
      </div>
      <div className="product-stage">
        {!ready && (
          <div className="scene-fallback" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        )}
        <canvas
          ref={canvas}
          className={ready ? "scene-canvas is-ready" : "scene-canvas"}
          aria-hidden="true"
        />
        <div className="scene-coordinates" aria-hidden="true">
          RESEARCH
          <br />
          BUILD
          <br />
          ITERATE
        </div>
      </div>
      <figcaption className="scene-caption">
        <span>
          Good products are
          <br />
          <strong>built in layers.</strong>
        </span>
        {reduced && <span className="scene-kicker">Still mode</span>}
        {ready && !unavailable && !reduced && (
          <button
            type="button"
            className="scene-pause"
            aria-label={paused ? "Resume 3D animation" : "Pause 3D animation"}
            aria-pressed={paused}
            onClick={() => {
              const next = !paused;
              setPaused(next);
              scene.current?.setPaused(next);
            }}
          >
            {paused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        )}
      </figcaption>
      <p className="sr-only">
        An abstract three-dimensional stack represents research, building, and
        iteration. Decorative only; all portfolio content remains available
        without it.
      </p>
    </figure>
  );
}
