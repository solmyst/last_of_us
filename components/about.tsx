"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { timeline, personal } from "@/lib/data";
import { GitBranch } from "lucide-react";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end 0.2"]
  });

  // Waterfall line spring for smoothness
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="about" ref={containerRef} className="py-24 max-w-6xl mx-auto px-6 border-t border-border-subtle overflow-hidden">
      <div className="flex flex-col gap-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-4 mb-4 relative">
            <span className="font-mono text-sm tracking-widest text-accent uppercase">04. CONTEXT</span>
            <div className="h-[1px] w-24 bg-border-subtle" />
            <span className="font-mono text-[10px] text-text-tertiary absolute -top-4 right-0 opacity-40">--read_only --human</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">The story so far</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left: Waterfall Timeline Section */}
          <div className="relative pl-6 md:pl-12">
            {/* Waterfall Line Background */}
            <div className="absolute left-0 top-2 w-[2px] h-full bg-border-subtle/30 rounded-full" />
            
            {/* Animated Flowing Line */}
            <motion.div 
              style={{ scaleY: pathLength }}
              className="absolute left-0 top-2 w-[2px] h-full bg-gradient-to-b from-accent via-pm-accent to-transparent origin-top rounded-full shadow-[0_0_15px_rgba(108,99,255,0.5)] z-10"
            />
            
            <div className="flex flex-col gap-16">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>

          {/* Right: Terminal Profile Section */}
          <div className="sticky top-24">
            <TerminalWindow />
          </div>
        </div>

        {/* Footer: Outside Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl pt-12"
        >
          <div className="flex items-start gap-4 p-6 bg-bg-surface/30 border border-border-subtle rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <GitBranch className="w-12 h-12" />
             </div>
             <div className="w-1 h-12 bg-accent/40 rounded-full shrink-0" />
             <p className="text-text-tertiary text-[15px] leading-relaxed font-mono italic relative z-10">
              Outside code: <span className="text-text-secondary not-italic font-sans">{personal.outsideCode}</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function TimelineItem({ item, index, progress }: { item: any, index: number, progress: any }) {
  // Each item lights up based on scroll progress
  const opacity = useTransform(progress, [index * 0.2, index * 0.2 + 0.1], [0.3, 1]);
  const scale = useTransform(progress, [index * 0.2, index * 0.2 + 0.1], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative group"
    >
      {/* Waterfall Splash/Point */}
      <div className="absolute -left-[28px] md:-left-[52px] top-1.5 w-4 h-4 rounded-full border-2 border-accent bg-bg-base z-20 group-hover:scale-125 group-hover:bg-accent transition-all duration-300 shadow-[0_0:10px_rgba(108,99,255,0.3)]" />
      
      <span className="block font-mono text-xs text-accent mb-2 tracking-widest font-bold">{item.year}</span>
      <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
      <p className="text-[15px] text-text-tertiary leading-relaxed max-w-md font-sans">
        {item.description}
      </p>
    </motion.div>
  );
}

function TerminalWindow() {
  const [text, setText] = useState("");
  const [inputBuffer, setInputBuffer] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const fullText = `// profile initialization
const sol: Profile = {
  role: "SDE" | "PM",
  status: "Shipping Obsessed",
  university: "JECRC, Jaipur",
  year: 4,
  stack: ["Next.js", "Ollama", "Spring Boot"],
  learning: ["System Design", "DevOps"],
  openTo: "internships + full-time"
};

// result: optimized for impact.
// hint: try 'init' in the console.
console.log("Ready to build.");`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only listen if the terminal is "focused" or we want it to be responsive
      // For a portfolio, global listener when in view is often better UX
      if (!isFocused) return;

      if (e.key === "Enter") {
        if (inputBuffer.toLowerCase() === "init") {
          window.dispatchEvent(new CustomEvent("activate-easter-egg"));
        }
        setInputBuffer("");
      } else if (e.key === "Backspace") {
        setInputBuffer(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setInputBuffer(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputBuffer, isFocused]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`bg-[#0d1117] border rounded-xl overflow-hidden shadow-2xl font-mono transition-colors duration-300 ${isFocused ? "border-accent ring-1 ring-accent/20" : "border-border-subtle"}`}
      onClick={() => setIsFocused(true)}
    >
      {/* Terminal Header */}
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-border-subtle">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <GitBranch className="w-3 h-3" />
          <span className="text-[10px] text-text-tertiary uppercase tracking-widest">
            {isFocused ? "interactive_session" : "bash — 80x24"}
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 text-[13px] leading-relaxed min-h-[350px] relative cursor-text">
        <div className="flex gap-3 mb-2">
          <span className="text-green">➜</span>
          <span className="text-accent">~</span>
          <span className="text-text-primary">cat anush.profile.ts</span>
        </div>
        
        <pre className="whitespace-pre-wrap text-text-secondary mb-6">
          {text}
        </pre>

        {/* Interactive Prompt */}
        <div className="mt-4 pt-4 border-t border-border-subtle/30">
          <div className="flex gap-3 items-center">
            <span className="text-green">➜</span>
            <span className="text-accent">~</span>
            <div className="flex items-center gap-2">
              <span className="text-text-primary">{inputBuffer}</span>
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-accent inline-block"
              />
            </div>
          </div>
          {!isFocused && (
             <p className="text-[10px] text-text-tertiary mt-2 italic opacity-50 animate-pulse">
               [ Click to interact ]
             </p>
          )}
        </div>

        {/* Ambient Terminal Glow */}
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-accent/5 blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
