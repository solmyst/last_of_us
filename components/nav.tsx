"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GitBranch, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { personal } from "@/lib/data";

const NAV_LINKS = [
  { label: "work", href: "#work" },
  { label: "tech", href: "#tech" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
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
      <div className="fixed top-4 left-0 right-0 z-50 px-6 flex justify-center">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            w-full max-w-3xl h-11 rounded-full flex items-center justify-between px-5 md:px-7
            transition-all duration-300 border
            ${scrolled
              ? "bg-bg-base/70 backdrop-blur-xl border-border-subtle shadow-2xl scale-[1.01]"
              : "bg-bg-surface/30 backdrop-blur-md border-border-subtle/40"
            }
          `}
        >
          {/* Logo */}
          <a href="#" className="font-bold text-text-primary text-[13px] tracking-tight hover:opacity-80 transition-opacity">
            {personal.name}
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[12px] font-medium transition-colors relative py-1 ${activeId === link.href.substring(1) ? "text-text-primary" : "text-text-tertiary hover:text-text-primary"
                  }`}
              >
                {link.label}
                {activeId === link.href.substring(1) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-accent"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-border-subtle/30">
              <ThemeToggle />
              <a
                href={personal.github}
                target="_blank"
                className="p-1.5 text-text-tertiary hover:text-accent transition-colors"
                title="View Source"
              >
                <GitBranch className="w-3.5 h-3.5" />
              </a>
            </div>

            <a
              href="/resume.pdf"
              target="_blank"
              className="flex items-center gap-1.5 bg-accent text-white px-3 py-1 rounded-full text-[12px] font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95"
            >
              Resume <ExternalLink className="w-2.5 h-2.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-primary"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
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
            className="fixed inset-0 z-[60] bg-bg-base/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <button
              className="absolute top-8 right-8 p-2 text-text-secondary"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-3xl font-bold text-text-secondary hover:text-accent transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col items-center gap-6 mt-8 pt-8 border-t border-border-subtle w-full"
              >
                <div className="flex items-center gap-8">
                  <ThemeToggle />
                  <a href={personal.github} target="_blank" className="text-text-tertiary hover:text-accent">
                    <GitBranch className="w-6 h-6" />
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
