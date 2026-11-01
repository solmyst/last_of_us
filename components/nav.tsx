"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { personal } from "@/lib/data";

const links = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-nav fixed top-0 inset-x-0 z-50 bg-bg-base/95 backdrop-blur-xl border-b border-border-default">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <a
          href="#hero"
          className="font-semibold tracking-tight text-base"
          onClick={() => setOpen(false)}
        >
          anush<span className="text-accent">.</span>
        </a>
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-8"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary py-3"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-text-primary border border-border-strong rounded-lg px-4 min-h-11"
          >
            Resume <ArrowUpRight className="w-4 h-4" />
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <button
            ref={menuButton}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden p-3"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
        className="md:hidden border-t border-border-default px-6 pb-5"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="block py-3 text-text-secondary"
          >
            {link.label}
          </a>
        ))}
        <a
          href={personal.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="block py-3 text-accent"
          onClick={() => setOpen(false)}
        >
          View resume ↗
        </a>
      </nav>
    </header>
  );
}
