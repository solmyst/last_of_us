"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

const easterEggMessage = [
  "$ you found it.",
  "$ running diagnostic...",
  "$ checking if sol is hire-worthy...",
  "$ analyzing: ships fast ✓",
  "$ analyzing: thinks in systems ✓",
  "$ analyzing: documents decisions ✓",
  "$ analyzing: anime taste ✓",
  "$ result: probably hire him",
  "$ source code: github.com/solmyst",
  "$ now stop snooping and send an email.",
];

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (active) {
        if (e.key === "Escape") setActive(false);
        return;
      }

      if (e.key === KONAMI[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) {
          setActive(true);
          setVisibleLines(0);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  useEffect(() => {
    if (!active) {
      document.body.classList.remove("debug-mode");
      return;
    }

    // Add debug class to body to show layout boundaries
    document.body.classList.add("debug-mode");

    // Type out message lines
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= easterEggMessage.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("debug-mode");
    };
  }, [active]);

  // Global style for debug mode
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .debug-mode * { outline: 1px solid rgba(255, 0, 0, 0.2); }
      .debug-mode div { outline: 1px solid rgba(0, 255, 0, 0.2); }
      .debug-mode section { outline: 1px solid rgba(0, 0, 255, 0.2); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-bg-base/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setActive(false)}
        >
          <div className="max-w-2xl w-full bg-[#0a0a0a] border border-[#333] rounded-lg shadow-2xl overflow-hidden font-mono text-sm text-green cursor-default" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-text-tertiary text-xs">diagnostic_terminal</span>
            </div>
            <div className="p-6 h-[300px] overflow-y-auto flex flex-col gap-2">
              {easterEggMessage.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {line}
                </motion.div>
              ))}
              {visibleLines < easterEggMessage.length && (
                <motion.div 
                  className="w-2 h-4 bg-green"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
            </div>
            <div className="px-6 py-4 bg-[#111] border-t border-[#333] text-xs text-text-tertiary flex justify-between">
              <span>[Click anywhere to dismiss]</span>
              <span>[ESC to exit]</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
