"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import DualBrainCard from "@/components/dual-brain-card";
import { GitBranch } from "lucide-react";
import { personal, heroData } from "@/lib/data";

const nameParts = personal.name.split(" ");
const firstName = nameParts[0] || "Anush";
const lastName = nameParts.slice(1).join(" ") || "Gupta";
const taglineParts = heroData.tagline.split(". ");

export default function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("anush_portfolio_visited");
    if (hasVisited) {
      setShouldAnimate(true);
    } else {
      // Delay hero animation to match the 5s loader + name reveal
      const timer = setTimeout(() => setShouldAnimate(true), 6700);
      return () => clearTimeout(timer);
    }
  }, []);

  const animationState = shouldAnimate ? "visible" : "hidden";

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-center">
        {/* Left Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={animationState}
          className="pt-12 lg:pt-0"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
            }}
            className="inline-block px-3 py-1 border border-border-strong rounded-full text-[11px] font-mono tracking-widest text-text-secondary mb-6 lg:mb-8"
          >
            {heroData.roles.join(" × ")}
          </motion.div>

          <motion.h1
            layoutId="hero-name"
            className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter leading-[1.1] mb-6 flex gap-x-3 text-text-primary"
          >
            <span>{firstName}</span>
            <span>{lastName}</span>
          </motion.h1>

          <div className="flex flex-col gap-1 mt-1 text-text-secondary">
            <span className="overflow-hidden">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0, transition: { delay: 0.8, duration: 0.5, ease: "easeOut" } }
                }}
              >
                {taglineParts[0] ? `${taglineParts[0]}.` : ""}
              </motion.span>
            </span>
            <span className="overflow-hidden">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0, transition: { delay: 0.88, duration: 0.5, ease: "easeOut" } }
                }}
              >
                {taglineParts[1] ? `${taglineParts[1]}` : ""}
              </motion.span>
            </span>
          </div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.95, duration: 0.6 } }
            }}
            className="text-lg text-text-secondary max-w-md leading-relaxed mb-10"
          >
            {heroData.description}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.6 } }
            }}
            className="flex flex-wrap items-center gap-6 text-sm font-mono"
          >
            <a href="#projects" data-cursor="link" className="text-text-primary hover:text-accent transition-colors flex items-center gap-3 group relative">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_15px_#0ea5e9] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shrink-0 animate-pulse" />
              <span className="underline decoration-border-strong underline-offset-4 group-hover:decoration-accent transition-colors">see my work</span>
            </a>
            <a href={personal.github} target="_blank" rel="noopener noreferrer" data-cursor="external" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 group">
              <GitBranch className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> GITHUB
            </a>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="external" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group">
              LINKEDIN <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] shadow-[0_0_12px_#0ea5e9] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shrink-0 animate-pulse" />
            </a>
            <a href={personal.leetcode} target="_blank" rel="noopener noreferrer" data-cursor="external" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group">
              LEETCODE <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] shadow-[0_0_12px_#0ea5e9] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shrink-0 animate-pulse" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column - Dual Brain Card */}
        <motion.div
          initial={{ opacity: 0, x: 60, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto"
        >
          <DualBrainCard />
        </motion.div>
      </div>
    </section>
  );
}
