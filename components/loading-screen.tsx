"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadingScreenData, personal } from "@/lib/data";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [showName, setShowName] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("anush_portfolio_visited");
    if (hasVisited) return;

    setIsVisible(true);
    const totalTime = 5200;
    const startTime = Date.now();

    // Terminal sequence
    loadingScreenData.lines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, line.delay);
    });

    // Progress bar
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / (totalTime * 0.88)) * 100, 97);
      setProgress(p);
      if (elapsed >= totalTime * 0.88) clearInterval(progressInterval);
    }, 50);

    // End sequence
    setTimeout(() => {
      setProgress(100);
      setShowName(true);
      
      setTimeout(() => {
        setIsExiting(true);
        sessionStorage.setItem("anush_portfolio_visited", "true");
        // Completely unmount after animation
        setTimeout(() => setIsVisible(false), 800);
      }, 1800);
    }, 4900);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[9999] bg-[#04040b] flex flex-col items-center justify-center font-mono overflow-hidden"
        >
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" 
               style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />

          {/* Corners */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-indigo-500/40" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-indigo-500/40" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-indigo-500/40" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-indigo-500/40" />

          {/* System Path */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-white/10 uppercase">
            SOL / DEV — INIT v2.4.1
          </div>

          <div 
            ref={terminalRef}
            className="w-full max-w-2xl px-12 z-20 transition-all duration-400 max-h-[400px] overflow-y-auto scrollbar-hide"
            style={{ opacity: showName ? 0 : 1, transform: showName ? 'translateY(-12px)' : 'translateY(0)' }}
          >
            <div className="flex flex-col gap-0">
              {loadingScreenData.lines.map((line, i) => (
                <TerminalLine key={i} line={line} isVisible={visibleLines.includes(i)} />
              ))}
              {visibleLines.length > 18 && (
                <div className="flex items-center gap-4 text-[12px] mt-1">
                   <span className="w-12 shrink-0" />
                   <motion.div 
                     animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                     className="w-1.5 h-3 bg-indigo-500"
                   />
                </div>
              )}
            </div>
          </div>

          <NameReveal visible={showName} />

          {/* Progress */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
            <div 
              className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="absolute bottom-6 right-8 text-[10px] font-mono tracking-widest text-white/20">
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface Line {
  type?: string;
  prefix?: string;
  text?: string;
  cls?: string;
  tag?: string;
}

// Helper to split fullname safely
const nameParts = personal.name.split(" ");
const firstName = nameParts[0] || "Anush";
const lastName = nameParts.slice(1).join(" ") || "Gupta";

function TerminalLine({ line, isVisible }: { line: Line, isVisible: boolean }) {
  if (line.type === 'spacer') return <div className="h-4" />;
  return (
    <div className={`flex items-center gap-4 text-[12px] leading-relaxed transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <span className="w-12 text-[10px] text-indigo-500/60 tracking-wider font-bold shrink-0">{line.prefix}</span>
      <span className={`${line.cls} truncate`}>{line.text}</span>
      {line.tag && isVisible && (
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ml-2 ${line.tag === 'ENG' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
          {line.tag}
        </span>
      )}
    </div>
  );
}

function NameReveal({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 bg-[#04040b] z-30 flex flex-col items-center justify-center pointer-events-none px-6 text-center"
    >
      <motion.h1 
        layoutId="hero-name"
        className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 flex gap-x-4"
      >
        <motion.span 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : "100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {firstName}
        </motion.span>
        <motion.span 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : "100%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
        >
          {lastName}
        </motion.span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ delay: 0.7 }}
        className="text-[11px] tracking-[0.3em] uppercase text-white/25 font-mono"
      >
        full stack engineer · product mind
      </motion.p>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: visible ? "100%" : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        className="absolute bottom-0 left-0 h-px bg-indigo-500/50"
      />
    </motion.div>
  );
}
