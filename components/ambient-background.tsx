"use client";

import { useEffect, useState } from "react";

export default function AmbientBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg-base">
      {/* Global dot grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot-color) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px"
        }}
      />
      
      {/* Ambient Glows */}
      {/* Top right engineering accent */}
      <div 
        className="absolute top-[10%] -right-[15%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.08] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      
      {/* Middle left PM accent */}
      <div 
        className="absolute top-[45%] -left-[15%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full opacity-[0.06] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--pm-accent) 0%, transparent 70%)" }}
      />
      
      {/* Bottom right subtle green */}
      <div 
        className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full opacity-[0.05] blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--green) 0%, transparent 70%)" }}
      />
      
      {/* Vignette mask to fade out the edges slightly and make text more readable */}
      <div className="absolute inset-0" style={{ background: "var(--vignette-color)", maskImage: "radial-gradient(ellipse_at_center,transparent_20%,black_100%)", WebkitMaskImage: "radial-gradient(ellipse at center, transparent 20%, black 100%)" }} />
    </div>
  );
}
