"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GitBranch, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { personal } from "@/lib/data";

const NAV_LINKS = [
  // { label: "Home", href: "#hero" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [sectionIds]);

  return activeId;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(NAV_LINKS.map((l) => l.href.substring(1)));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            w-full max-w-4xl h-16 rounded-full flex items-center justify-between px-8
            transition-all duration-500 border border-border-default
            bg-bg-surface/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]
            dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
            relative overflow-hidden
          `}
        >
          {/* Glass Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-white/[0.05] to-transparent dark:via-white/[0.01] pointer-events-none" />

          {/* Logo */}
          <a href="#" className="font-bold text-text-primary text-[16px] tracking-tight hover:opacity-80 transition-opacity">
            {personal.name}
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors relative py-1 ${activeId === link.href.substring(1) ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-border-subtle">
              <ThemeToggle />
              <a
                href={personal.github}
                target="_blank"
                data-cursor="external"
                className="p-1.5 text-text-secondary hover:text-text-primary transition-colors"
                title="View Source"
              >
                <GitBranch className="w-4 h-4" />
              </a>
            </div>

            <a
              href={personal.resume}
              target="_blank"
              data-cursor="external"
              className="hidden sm:flex items-center gap-2 bg-[#0ea5e9] text-white px-5 py-2 rounded-full text-[14px] font-bold hover:bg-[#0ea5e9]/90 transition-all shadow-lg shadow-[#0ea5e9]/20 active:scale-95 group"
            >
              Resume <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shrink-0 animate-pulse" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-bg-base/95 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <button
              className="absolute top-8 right-8 p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <nav className="flex flex-col items-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-4xl font-bold text-text-primary hover:text-[#0ea5e9] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col items-center gap-8 mt-8 pt-8 border-t border-border-subtle w-full"
              >
                <div className="flex items-center gap-10">
                  <ThemeToggle />
                  <a href={personal.github} target="_blank" className="text-text-secondary hover:text-text-primary transition-colors">
                    <GitBranch className="w-8 h-8" />
                  </a>
                </div>

                <a
                  href={personal.resume}
                  target="_blank"
                  data-cursor="external"
                  className="flex items-center gap-2 bg-[#0ea5e9] text-white px-8 py-3 rounded-full text-lg font-bold"
                >
                  Resume <ExternalLink className="w-5 h-5" />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
