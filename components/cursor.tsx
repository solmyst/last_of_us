"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

type CursorState = "default" | "link" | "project" | "code" | "expand" | "collapse";

export default function Cursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true to prevent SSR hydration mismatch

  // Motion values for exact mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the trailing ring
  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  // Faster springs for the core dot
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 800, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 800, mass: 0.1 });

  useEffect(() => {
    // Enable cursor only on non-touch devices
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
      setIsTouchDevice(false);
      document.body.classList.add("has-custom-cursor");
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Contextual interaction detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let cursorType: string | null = null;
      let el: HTMLElement | null = target;
      
      while (el && el !== document.body) {
        if (el.hasAttribute('data-cursor')) {
          cursorType = el.getAttribute('data-cursor');
          break;
        }
        if (!cursorType && (el.tagName === 'A' || el.tagName === 'BUTTON')) {
          cursorType = "link";
          break;
        }
        el = el.parentElement;
      }

      if (cursorType && ["link", "project", "code", "expand", "collapse"].includes(cursorType)) {
        setCursorState(cursorType as CursorState);
      } else {
        setCursorState("default");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    const handleMouseLeave = () => setCursorState("default");
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(108, 99, 255, 0)",
      borderColor: "rgba(108, 99, 255, 0.3)",
      borderRadius: "50%",
    },
    link: {
      width: 52,
      height: 52,
      backgroundColor: "rgba(108, 99, 255, 0.12)",
      borderColor: "var(--accent)",
      borderRadius: "50%",
    },
    project: {
      width: 72,
      height: 72,
      backgroundColor: "rgba(108, 99, 255, 0.12)",
      borderColor: "var(--accent)",
      borderRadius: "50%",
    },
    expand: {
      width: 48,
      height: 48,
      backgroundColor: "var(--bg-elevated)",
      borderColor: "var(--border-strong)",
      borderRadius: "50%",
    },
    collapse: {
      width: 72,
      height: 72,
      backgroundColor: "rgba(108, 99, 255, 0.12)",
      borderColor: "var(--accent)",
      borderRadius: "50%",
    },
    code: {
      width: 4,
      height: 24,
      backgroundColor: "var(--accent)",
      borderColor: "transparent",
      borderRadius: 2,
    }
  };

  const dotVariants = {
    default: { scale: 1, opacity: 1 },
    link: { scale: 0, opacity: 0 },
    project: { scale: 0, opacity: 0 },
    expand: { scale: 0, opacity: 0 },
    collapse: { scale: 0, opacity: 0 },
    code: { scale: 0, opacity: 0 }
  };

  return (
    <>
      {/* Core Dot */}
      <motion.div 
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-accent pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        variants={dotVariants}
        animate={cursorState}
        transition={{ duration: 0.2 }}
      />

      <motion.div 
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center font-mono text-[11px] tracking-wider text-accent border border-accent overflow-hidden"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        variants={ringVariants}
        animate={cursorState}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <AnimatePresence mode="wait">
          {cursorState === "link" && (
            <motion.div 
              key="link" 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <ArrowRight className="w-5 h-5 text-accent" />
            </motion.div>
          )}
          {cursorState === "project" && (
            <motion.div 
              key="project" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-accent font-medium uppercase"
            >
              view
            </motion.div>
          )}
          {cursorState === "collapse" && (
            <motion.div 
              key="collapse" 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-accent font-medium uppercase text-[10px]"
            >
              close
            </motion.div>
          )}
          {cursorState === "expand" && (
            <motion.div 
              key="expand" 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.5 }} 
              transition={{ duration: 0.15 }}
            >
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
