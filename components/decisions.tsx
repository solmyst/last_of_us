"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { decisionsLog, Decision } from "@/lib/data";

const CONTEXT_COLORS = {
  architecture: "var(--accent)",
  product: "var(--pm-accent)",
  build: "var(--amber)",
  scope: "var(--green)",
};

function TypewriterText({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && <span className="animate-pulse">_</span>}
    </span>
  );
}

function DecisionAccordion({ decision }: { decision: Decision }) {
  const [isOpen, setIsOpen] = useState(false);
  const color = CONTEXT_COLORS[decision.context];

  return (
    <div 
      className="relative pl-10 md:pl-12 group"
      data-cursor="expand"
    >
      {/* Dynamic left border for this item when open */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute left-0 top-0 w-[2px]"
        style={{ background: color }}
      />

      {/* Header */}
      <motion.button
        className="w-full text-left py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 hover:bg-bg-elevated/30 transition-colors px-4 -ml-4 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ x: 4, transition: { type: "spring", stiffness: 400, damping: 30 } }}
      >
        <div className="flex items-center gap-4 min-w-[180px] shrink-0">
          <span className="font-mono text-sm text-text-secondary">{decision.date}</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }}></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">{decision.context}</span>
          </div>
        </div>
        
        <div className="flex-1 text-lg md:text-xl font-medium text-text-primary pr-8 relative">
          {decision.statement}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 text-text-tertiary"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="py-6 border-t border-border-subtle">
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {/* Option A */}
                <div className="bg-bg-surface border border-border-default rounded p-5 relative overflow-hidden">
                  {decision.chose === "B" && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                      className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-tertiary origin-left z-10"
                    />
                  )}
                  <div className={`relative z-0 ${decision.chose === "B" ? "opacity-40" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-sm text-text-secondary">Option A</span>
                      {decision.chose === "A" && (
                        <svg width="14" height="14" viewBox="0 0 12 12" className="overflow-visible">
                          <motion.path
                            d="M2 6 L5 9 L10 3"
                            stroke="var(--green)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-[15px] font-medium text-text-primary mb-2">{decision.optionA.label}</h4>
                    <p className="text-sm text-text-tertiary">{decision.optionA.why}</p>
                  </div>
                </div>

                {/* Option B */}
                <div className="bg-bg-surface border border-border-default rounded p-5 relative overflow-hidden">
                  {decision.chose === "A" && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                      className="absolute top-1/2 left-0 right-0 h-[1px] bg-text-tertiary origin-left z-10"
                    />
                  )}
                  <div className={`relative z-0 ${decision.chose === "A" ? "opacity-40" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-sm text-text-secondary">Option B</span>
                      {decision.chose === "B" && (
                        <svg width="14" height="14" viewBox="0 0 12 12" className="overflow-visible">
                          <motion.path
                            d="M2 6 L5 9 L10 3"
                            stroke="var(--green)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-[15px] font-medium text-text-primary mb-2">{decision.optionB.label}</h4>
                    <p className="text-sm text-text-tertiary">{decision.optionB.why}</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-elevated/50 p-5 rounded border border-border-subtle mb-6">
                <span className="font-mono text-xs text-text-tertiary uppercase block mb-2">The Tradeoff</span>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  {decision.because}
                </p>
              </div>

              <div className="font-mono text-sm text-accent">
                <span className="text-text-tertiary mr-2">$</span>
                <TypewriterText text={decision.wouldDoDifferently} startDelay={600} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Decisions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="decisions" ref={sectionRef} className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-4 mb-4 relative">
            <span className="font-mono text-sm tracking-widest text-accent uppercase">05. CONTEXT</span>
            <div className="h-[1px] w-24 bg-border-strong" />
            <span className="font-mono text-[10px] text-text-secondary absolute -top-4 right-0 opacity-60">--read_only --human</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">Decisions Log</h2>
        </motion.div>
        <p className="text-text-secondary mt-6 max-w-2xl">
          Technical and product decisions — with reasoning. 
          No right answers, just honest tradeoffs.
        </p>
      </div>

      <div className="relative">
        {/* The background static line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border-subtle" />
        
        {/* The animated filled line */}
        <motion.div 
          className="absolute left-0 top-0 w-[2px] bg-border-strong origin-top"
          style={{ height: lineHeight }}
        />

        <div className="flex flex-col gap-2">
          {decisionsLog.map((decision) => (
            <DecisionAccordion key={decision.id} decision={decision} />
          ))}
        </div>
      </div>
    </section>
  );
}
