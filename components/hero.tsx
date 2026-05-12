"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import DualBrainCard from "@/components/dual-brain-card";
import { GitBranch } from "lucide-react";

export default function Hero() {
  const nameChars = "Anush Gupta".split("");

  return (
    <section className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-center">
        {/* Left Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="pt-12 lg:pt-0"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
            }}
            className="inline-block px-3 py-1 border border-border-strong rounded-full text-[11px] font-mono tracking-widest text-text-secondary mb-6 lg:mb-8"
          >
            FULL STACK ENGINEER × PRODUCT MANAGER
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium leading-[1.1] mb-6">
            <div className="flex overflow-hidden pb-2">
              {nameChars.map((char, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "110%", opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: { delay: 0.35 + i * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                </span>
              ))}
            </div>
            
            <div className="flex flex-col gap-1 mt-1 text-text-secondary">
              <span className="overflow-hidden">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "100%" },
                    visible: { y: 0, transition: { delay: 0.8, duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  builds systems.
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
                  ships products.
                </motion.span>
              </span>
            </div>
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.95, duration: 0.6 } }
            }}
            className="text-lg text-text-secondary max-w-md leading-relaxed mb-10"
          >
            I think in user flows and implement in Spring Boot.
            Currently at JECRC University — looking for where
            both skill sets create maximum leverage.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.6 } }
            }}
            className="flex flex-wrap items-center gap-6 text-sm font-mono"
          >
            <a href="#work" data-cursor="link" className="text-text-primary hover:text-accent transition-colors flex items-center gap-2 group">
              → <span className="underline decoration-border-strong underline-offset-4 group-hover:decoration-accent transition-colors">see my work</span>
            </a>
            <a href="https://github.com/solmyst" target="_blank" data-cursor="link" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 group">
              <GitBranch className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> GITHUB
            </a>
            <a href="https://linkedin.com/in/anushgupta105" target="_blank" data-cursor="link" className="text-text-secondary hover:text-text-primary transition-colors">
              ↗ linkedin
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
