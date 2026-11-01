"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { projects } from "@/lib/data";

const CANVAS_SIZE = 400;
const GRID_SIZE = 80;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

export default function SandSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<number[][]>(
    Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0)),
  );
  const nextGridRef = useRef<number[][]>(
    Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0)),
  );
  const [hue, setHue] = useState(200);
  const hueRef = useRef(hue);
  const pointerDown = useRef(false);
  const [paused, setPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView || paused) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      const currentGrid = gridRef.current;
      const nextGrid = nextGridRef.current;

      // Reset next grid
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          nextGrid[i][j] = 0;
        }
      }

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          const state = currentGrid[i][j];
          if (state > 0) {
            if (i < GRID_SIZE - 1) {
              const below = currentGrid[i + 1][j];
              const dir = Math.random() < 0.5 ? 1 : -1;
              const belowA =
                j + dir >= 0 && j + dir < GRID_SIZE
                  ? currentGrid[i + 1][j + dir]
                  : -1;
              const belowB =
                j - dir >= 0 && j - dir < GRID_SIZE
                  ? currentGrid[i + 1][j - dir]
                  : -1;

              if (below === 0) {
                nextGrid[i + 1][j] = state;
              } else if (belowA === 0) {
                nextGrid[i + 1][j + dir] = state;
              } else if (belowB === 0) {
                nextGrid[i + 1][j - dir] = state;
              } else {
                nextGrid[i][j] = state;
              }
            } else {
              nextGrid[i][j] = state;
            }
          }
        }
      }

      // Swap grids
      gridRef.current = nextGrid;
      nextGridRef.current = currentGrid;

      render(ctx, nextGrid);
      animationFrameId = requestAnimationFrame(update);
    };

    const render = (context: CanvasRenderingContext2D, g: number[][]) => {
      context.fillStyle = "#0a121b";
      context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          const state = g[i][j];
          if (state > 0) {
            context.fillStyle = `hsl(${state}, 80%, 60%)`;
            context.fillRect(
              j * CELL_SIZE,
              i * CELL_SIZE,
              CELL_SIZE,
              CELL_SIZE,
            );
          }
        }
      }
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, paused]);

  function handleInteraction(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!pointerDown.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    addSand(
      Math.floor(((event.clientX - rect.left) / rect.width) * GRID_SIZE),
      Math.floor(((event.clientY - rect.top) / rect.height) * GRID_SIZE),
    );
  }

  function addSand(gridX: number, gridY: number) {
    if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
      const currentGrid = gridRef.current;
      const brushSize = 3;
      for (let di = -brushSize; di <= brushSize; di++) {
        for (let dj = -brushSize; dj <= brushSize; dj++) {
          if (Math.random() > 0.1) {
            const ni = gridY + di;
            const nj = gridX + dj;
            if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
              if (currentGrid[ni][nj] === 0) {
                currentGrid[ni][nj] =
                  hueRef.current + (Math.random() * 20 - 10);
              }
            }
          }
        }
      }
    }
  }

  function resetSand() {
    gridRef.current.forEach((row) => row.fill(0));
    nextGridRef.current.forEach((row) => row.fill(0));
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.fillStyle = "#0a121b";
      context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  }

  const project = projects.find((item) => item.id === "sand-art");
  return (
    <section
      id="sand"
      ref={sectionRef}
      className="portfolio-section sand-section"
    >
      <div className="sand-intro">
        <p className="eyebrow">After hours / The playground</p>
        <h2 className="section-title">A little room to play.</h2>
        <p className="text-text-secondary leading-7 mt-5 max-w-md">
          A small falling-sand experiment. Draw a trail, change the color, and
          watch a grid of particles find its way down.
        </p>
        <p id="sand-help" className="text-sm text-text-tertiary leading-7 mt-4">
          Drag on the canvas, or use the Add sand button. Pause to inspect a
          pattern; reset for a clean canvas.
        </p>
        {project?.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent min-h-11 mt-5"
          >
            Explore the full experiment
            <ArrowUpRight className="w-4 h-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
      <div className="sand-workspace">
        <div className="sand-toolbar">
          <span className="text-xs text-text-secondary">
            Sand study / 80 × 80
          </span>
          <button
            type="button"
            onClick={resetSand}
            className="sand-icon"
            aria-label="Reset sand canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="sand-canvas"
          role="img"
          aria-label="Interactive falling-sand canvas"
          aria-describedby="sand-help"
          onPointerDown={(event) => {
            pointerDown.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            handleInteraction(event);
          }}
          onPointerMove={handleInteraction}
          onPointerUp={() => {
            pointerDown.current = false;
          }}
          onPointerCancel={() => {
            pointerDown.current = false;
          }}
          onLostPointerCapture={() => {
            pointerDown.current = false;
          }}
        />
        <div className="sand-controls">
          <div className="sand-colors" role="group" aria-label="Sand color">
            {[
              { hue: 200, name: "Blue" },
              { hue: 30, name: "Amber" },
              { hue: 280, name: "Violet" },
              { hue: 150, name: "Jade" },
            ].map((color) => (
              <button
                type="button"
                key={color.hue}
                aria-label={`${color.name} sand`}
                aria-pressed={hue === color.hue}
                style={{ backgroundColor: `hsl(${color.hue},80%,60%)` }}
                onClick={() => {
                  setHue(color.hue);
                  hueRef.current = color.hue;
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                addSand(GRID_SIZE / 2, 5);
                setPaused(false);
              }}
              className="sand-add"
            >
              <Plus className="w-4 h-4" />
              Add sand
            </button>
            <button
              type="button"
              className="sand-icon"
              aria-label={
                paused ? "Resume sand simulation" : "Pause sand simulation"
              }
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
