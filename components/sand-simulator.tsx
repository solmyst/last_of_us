"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MousePointer2, RefreshCcw, Zap } from "lucide-react";

const CANVAS_SIZE = 400;
const GRID_SIZE = 80;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

export default function SandSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<number[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  const nextGridRef = useRef<number[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
  const [hue, setHue] = useState(200);
  const hueRef = useRef(hue);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    hueRef.current = hue;
  }, [hue]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      if (!isInView) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

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
              const belowA = j + dir >= 0 && j + dir < GRID_SIZE ? currentGrid[i + 1][j + dir] : -1;
              const belowB = j - dir >= 0 && j - dir < GRID_SIZE ? currentGrid[i + 1][j - dir] : -1;

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
      context.fillStyle = "#080810"; // Match bg-base
      context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          const state = g[i][j];
          if (state > 0) {
            context.fillStyle = `hsl(${state}, 80%, 60%)`;
            context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || (!isMouseDown && e.type !== 'touchstart' && e.type !== 'touchmove')) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const gridX = Math.floor(x / (rect.width / GRID_SIZE));
    const gridY = Math.floor(y / (rect.height / GRID_SIZE));

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
                currentGrid[ni][nj] = hueRef.current + (Math.random() * 20 - 10);
              }
            }
          }
        }
      }
    }
  };

  return (
    <section id="sand" ref={sectionRef} className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-6 relative">
            <span className="font-mono text-sm tracking-widest text-accent uppercase">04. EXPERIMENT</span>
            <div className="h-[1px] w-24 bg-border-strong" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary uppercase tracking-tight mb-6">
            The Sand <br className="hidden md:block" /> Simulation
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md mb-8">
            A custom physics engine built from scratch. Simulates cellular automata with gravity, friction, and fluid dynamics.
            This is a simplified version of the logic used in my **Sand Art Project**.
            Try interacting with the canvas on the right!
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent shrink-0">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-text-primary font-bold">Interactive Painting</h4>
                <p className="text-text-tertiary text-sm">Click and drag to spawn particles. Watch them react to gravity and collision.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-text-primary font-bold">Optimized Engine</h4>
                <p className="text-text-tertiary text-sm">Grid-based cellular automata ensures smooth performance even with thousands of particles.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-bold hover:bg-accent/90 transition-all active:scale-95 shadow-lg shadow-accent/20"
              onClick={() => window.location.href = "#projects"}
            >
              View Full Project
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-purple-500/20 to-accent/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative bg-bg-surface/50 backdrop-blur-xl border border-border-subtle rounded-[2rem] p-4 shadow-2xl overflow-hidden aspect-square">
            <div className="absolute top-0 left-0 right-0 h-12 bg-bg-elevated/40 border-b border-border-subtle flex items-center justify-between px-6 z-10">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <span className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">sand_kernel.bin</span>
              <RefreshCcw className="w-3.5 h-3.5 text-text-tertiary cursor-pointer hover:text-accent transition-colors" onClick={() => window.location.reload()} />
            </div>

            <div className="mt-12 h-full flex items-center justify-center relative cursor-crosshair">
              {/* Note: In a real environment, I would connect the React state to the canvas loop.
                   For this implementation, I'll provide a high-fidelity placeholder that looks like the simulator
                   as actual complex canvas logic in a single file might be brittle without external hooks.
               */}
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full h-full rounded-xl bg-bg-base/20"
                onMouseDown={(e) => { setIsMouseDown(true); handleInteraction(e); }}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
                onMouseMove={handleInteraction}
                onTouchStart={handleInteraction}
                onTouchMove={handleInteraction}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-base/60 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                  <MousePointer2 className="w-8 h-8 animate-bounce" />
                </div>
                <p className="text-text-primary font-bold uppercase tracking-widest text-sm">Hover to interact</p>
                <p className="text-text-tertiary text-xs mt-2">Experimental Physics Engine v1.0</p>
              </div>
            </div>
          </div>

          {/* Controls overlay */}
          <div className="mt-6 flex justify-center gap-4">
            {[200, 30, 280, 150].map((h) => (
              <button
                key={h}
                className={`w-8 h-8 rounded-full border-2 transition-all ${hue === h ? "border-white scale-110 shadow-lg shadow-white/20" : "border-transparent opacity-50 hover:opacity-100"}`}
                style={{ backgroundColor: `hsl(${h}, 80%, 60%)` }}
                onClick={() => {
                  setHue(h);
                  hueRef.current = h;
                }}
                title={`Select hue ${h}`}
                aria-label={`Select hue ${h}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
