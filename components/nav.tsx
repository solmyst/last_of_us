"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "work", href: "#work" },
  { label: "thinking", href: "#thinking" },
  { label: "decisions", href: "#decisions" },
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
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-bg-base/80 backdrop-blur-md border-b border-border-subtle" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-mono text-text-primary text-sm font-medium" data-cursor="link">
            sol.dev
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="link"
                className={`text-[13px] uppercase tracking-wider relative group transition-colors ${
                  activeId === link.href.substring(1) ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--dynamic-accent)]"
                  initial={false}
                  animate={{ scaleX: activeId === link.href.substring(1) ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
                <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--dynamic-accent)] scale-x-0 origin-left transition-transform duration-250 ease-out group-hover:scale-x-100" />
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              data-cursor="link"
              className="flex items-center space-x-2 px-4 py-1.5 border border-accent rounded-full text-[13px] text-accent uppercase tracking-wider hover:bg-accent/10 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>→ resume</span>
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-primary p-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed inset-0 z-[60] bg-bg-base/95 backdrop-blur-xl flex flex-col p-6"
        >
          <div className="flex justify-between items-center h-10 mb-12">
            <span className="font-mono text-sm">sol.dev</span>
            <button className="p-2 text-text-secondary" onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 flex-1">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, ease: "easeOut" }}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-mono uppercase text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pb-10"
          >
            <a
              href="/resume.pdf"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-3 w-full py-4 border border-accent rounded-full text-accent uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>resume</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
