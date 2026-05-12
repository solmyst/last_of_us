"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

type CursorState = "default" | "link" | "project" | "code" | "expand";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if it's a touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    setIsVisible(true);
    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    const LERP_FACTOR = 0.12;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    let animationFrameId: number;
    const animateRing = () => {
      ringX += (mouseX - ringX) * LERP_FACTOR;
      ringY += (mouseY - ringY) * LERP_FACTOR;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMouseMove);
    animationFrameId = requestAnimationFrame(animateRing);

    // Interactive element detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Look up the tree for data-cursor attribute
      let cursorType: string | null = null;
      let el: HTMLElement | null = target;
      
      while (el && el !== document.body) {
        if (el.hasAttribute('data-cursor')) {
          cursorType = el.getAttribute('data-cursor');
          break;
        }
        
        // Auto-detect a tags and buttons if no specific cursor is set
        if (!cursorType && (el.tagName === 'A' || el.tagName === 'BUTTON')) {
          cursorType = "link";
          break;
        }
        
        el = el.parentElement;
      }

      if (cursorType && ["link", "project", "code", "expand"].includes(cursorType)) {
        setCursorState(cursorType as CursorState);
      } else {
        setCursorState("default");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    // Also handle case where an element might be removed while hovered
    const handleMouseLeave = () => setCursorState("default");
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  // Determine styles based on state
  let ringStyle = {};
  let dotStyle = {};
  
  switch (cursorState) {
    case "link":
      dotStyle = { transform: "translate(-50%, -50%) scale(0)" };
      ringStyle = { width: 48, height: 48, background: "var(--accent-dim)", borderColor: "var(--accent)" };
      break;
    case "project":
      dotStyle = { transform: "translate(-50%, -50%) scale(0)" };
      ringStyle = { width: 64, height: 64, background: "var(--accent-dim)", borderColor: "var(--accent)" };
      break;
    case "code":
      dotStyle = { transform: "translate(-50%, -50%) scale(0)" };
      ringStyle = { 
        width: 4, 
        height: 24, 
        borderRadius: 2,
        background: "var(--accent)", 
        borderColor: "transparent",
        animation: "pulse 1s infinite" 
      };
      break;
    case "expand":
      dotStyle = { transform: "translate(-50%, -50%) scale(0)" };
      ringStyle = { width: 48, height: 48, background: "var(--bg-elevated)", borderColor: "var(--border-strong)" };
      break;
    default:
      // default state uses CSS defaults
      break;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={dotStyle} />
      <div ref={ringRef} className="cursor-ring" style={ringStyle}>
        <span style={{ opacity: cursorState === "link" ? 1 : 0, position: 'absolute' }}>
          <ArrowRight className="w-4 h-4" />
        </span>
        <span style={{ opacity: cursorState === "project" ? 1 : 0, position: 'absolute' }}>
          view
        </span>
        <span style={{ opacity: cursorState === "expand" ? 1 : 0, position: 'absolute', color: "var(--text-secondary)" }}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </div>
    </>
  );
}
