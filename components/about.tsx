"use client";

import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { timeline, personal } from "@/lib/data";
import { GitBranch } from "lucide-react";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end 0.85"]
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
            <span className="font-mono text-sm tracking-widest text-accent uppercase">06. ABOUT</span>
            <div className="h-[1px] w-24 bg-border-strong" />
            <span className="font-mono text-[10px] text-text-secondary absolute -top-4 right-0 opacity-60">--read_only --human</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">The story so far</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Left: Waterfall Timeline Section */}
          <div className="relative pl-6 md:pl-12">
            {/* Waterfall Line Background */}
            <div className="absolute left-[-20px] md:left-[-44px] top-2 w-[2px] h-full bg-border-subtle/30 rounded-full" />

            {/* Animated Flowing Line */}
            <div className="absolute left-[-20px] md:left-[-44px] top-2 h-full z-10">
              {/* Core stream */}
              <motion.div
                style={{ scaleY: pathLength }}
                className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-accent via-pm-accent to-transparent origin-top rounded-full shadow-[0_0_15px_rgba(108,99,255,0.5)]"
              />

              {/* Shimmering surface */}
              <motion.div
                style={{
                  scaleY: pathLength,
                  backgroundImage: "linear-gradient(180deg, rgba(108,99,255,0) 0%, rgba(108,99,255,0.6) 30%, rgba(108,99,255,0.15) 60%, rgba(108,99,255,0) 100%)",
                  backgroundSize: "100% 60%"
                }}
                animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                className="absolute left-[-1px] top-0 w-[4px] h-full origin-top rounded-full opacity-70"
              />

              {/* Misty glow */}
              <motion.div
                style={{ scaleY: pathLength }}
                className="absolute left-[-6px] top-0 w-[14px] h-full origin-top rounded-full bg-accent/10 blur-[10px]"
              />

              {/* Droplets */}
              {[0.2, 0.5, 0.75].map((pos, i) => (
                <motion.span
                  key={i}
                  style={{ top: `${pos * 100}%` }}
                  animate={{ y: [0, 10, 0], opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-[5px] w-2 h-2 rounded-full bg-accent/50 blur-[1px]"
                />
              ))}
            </div>

            <div className="flex flex-col gap-16">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Right: Terminal Profile Section */}
          <div className="sticky top-24">
            <TerminalWindow />
          </div>
        </div>

        {/* Footer: Outside Code & Certs */}
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full pt-12"
          >
            <div className="flex items-start gap-4 p-6 bg-bg-surface/30 border border-border-subtle rounded-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <GitBranch className="w-12 h-12" />
              </div>
              <div className="w-1 h-12 bg-accent/40 rounded-full shrink-0" />
              <p className="text-text-tertiary text-[15px] leading-relaxed font-mono italic relative z-10">
                Outside code: <span className="text-text-secondary not-italic font-sans">{personal.outsideCode}</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-12"
          >
            <div className="p-6 border border-border-subtle rounded-2xl bg-bg-surface/10 h-full">
              <h4 className="text-xs font-mono tracking-widest text-accent uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Certifications
              </h4>
              <ul className="flex flex-col gap-2">
                {(personal as { certifications?: string[] }).certifications?.map((cert, i) => (
                  <li key={i} className="text-[13px] text-text-secondary flex items-center gap-2 group cursor-default">
                    <span className="text-accent opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                    <span className="truncate">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function TimelineItem({ item }: { item: { year: string, title: string, description: string } }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, {
    margin: "0px 0px -20% 0px",
    amount: 0.4,
    once: false
  });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0.2, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
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
  const profile = (personal as {
    terminalProfile?: {
      roles: string[];
      status: string;
      stack: string[];
      learning: string[];
    };
  }).terminalProfile || {
    roles: ["Product Intern", "Full Stack"],
    status: "Shipping Obsessed",
    stack: ["Next.js", "Spring Boot", "Growth Hacking"],
    learning: ["LLM Agents", "System Design"]
  };

  const text = `// profile initialization
const sol: Profile = {
  role: "${profile.roles.join('" | "')}",
  status: "${profile.status}",
  university: "${personal.university.split(" (")[0]}",
  year: ${personal.year.match(/\d+/)?.[0] || '4'},
  stack: ${JSON.stringify(profile.stack)},
  learning: ${JSON.stringify(profile.learning)},
  openTo: "${personal.openTo.split(" roles")[0]}"
};

// result: optimized for impact.
console.log("Ready to build.");`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`bg-[#0d1117] border rounded-xl overflow-hidden shadow-2xl font-mono transition-colors duration-300 border-border-subtle`}
    >
      {/* Terminal Header */}
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-border-subtle">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <GitBranch className="w-3 h-3 text-[#9ca3af]" />
            bash — 80x24
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 text-[13px] leading-relaxed min-h-[350px] relative cursor-text">
        <div className="flex gap-3 mb-2">
          <span className="text-green">➜</span>
          <span className="text-accent">~</span>
          <span className="text-gray-100">cat anush.profile.ts</span>
        </div>

        <pre className="whitespace-pre-wrap text-gray-400 mb-6">
          {text}
        </pre>

        {/* Static Prompt */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-3 items-center">
            <span className="text-green">➜</span>
            <span className="text-accent">~</span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-accent inline-block"
              />
            </div>
          </div>
        </div>

        {/* Ambient Terminal Glow */}
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-accent/5 blur-3xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
