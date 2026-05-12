"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { staggerContainer } from "@/lib/animations";
import DualBrainCard from "./dual-brain-card";

export default function Hero() {
  const nameChars = "Anush Gupta".split("");
  
  // Parallax grid state
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1);
      setMouseY((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
      {/* Background Grid & Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: mouseX * -8, y: mouseY * -8 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute inset-[-5%] w-[110%] h-[110%]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        <motion.div
          animate={{ x: mouseX * 15, y: mouseY * 15 }}
          transition={{ type: "spring", stiffness: 40, damping: 30 }}
          className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: mouseX * 5, y: mouseY * 5 }}
          transition={{ type: "spring", stiffness: 20, damping: 40 }}
          className="absolute bottom-0 -left-40 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

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
            <a href="https://github.com/solmyst" target="_blank" data-cursor="link" className="text-text-secondary hover:text-text-primary transition-colors">
              ↗ github
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
