"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CODE_LINES = [
  { text: "// memeforge — local inference", type: "comment" },
  { text: "import { Ollama } from 'ollama'", type: "import" },
  { text: "", type: "blank" },
  { text: "const generateMeme = async (", type: "code" },
  { text: "  image: File,", type: "code" },
  { text: "  context: string", type: "code" },
  { text: ") => {", type: "code" },
  { text: "  const model = new Ollama()", type: "code" },
  { text: "  // zero api cost. always.", type: "comment" },
  { text: "  return model.vision({", type: "code" },
  { text: "    model: 'llava',", type: "code" },
  { text: "    image, context", type: "code" },
  { text: "  })", type: "code" },
  { text: "}", type: "code" },
];

const PM_ITEMS = [
  { text: "User problem identified", done: true },
  { text: "Riskiest assumption: GPU availability", done: true },
  { text: "MVP scope locked", done: true },
  { text: "Privacy req: local-only", done: true },
  { text: "Success metric: zero API cost", done: true },
  { text: "Ship. Iterate.", done: false, active: true },
];

export default function DualBrainCard() {
  const [typedLines, setTypedLines] = useState<string[]>(Array(CODE_LINES.length).fill(""));
  const [currentLineIdx, setCurrentLineIdx] = useState(-1); // -1 means hasn't started
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [pmItemsVisible, setPmItemsVisible] = useState(0);

  // Orchestrate the whole animation
  useEffect(() => {
    // Start after card slides in
    const startDelay = setTimeout(() => {
      setCurrentLineIdx(0);
    }, 400); // 1.2s + 0.4s = 1.6s from page load

    // PM items start appearing
    const pmStart = setTimeout(() => {
      const pmInterval = setInterval(() => {
        setPmItemsVisible(prev => {
          if (prev >= PM_ITEMS.length) {
            clearInterval(pmInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(pmInterval);
    }, 800); // slightly after code starts

    return () => {
      clearTimeout(startDelay);
      clearTimeout(pmStart);
    };
  }, []);

  // Code typing effect
  useEffect(() => {
    if (currentLineIdx >= 0 && currentLineIdx < CODE_LINES.length) {
      const fullText = CODE_LINES[currentLineIdx].text;
      
      if (currentCharIdx < fullText.length) {
        const charTimer = setTimeout(() => {
          setTypedLines(prev => {
            const newLines = [...prev];
            newLines[currentLineIdx] = fullText.substring(0, currentCharIdx + 1);
            return newLines;
          });
          setCurrentCharIdx(prev => prev + 1);
        }, 30); // fast typing speed
        return () => clearTimeout(charTimer);
      } else {
        // Move to next line
        const lineTimer = setTimeout(() => {
          setCurrentLineIdx(prev => prev + 1);
          setCurrentCharIdx(0);
        }, 80);
        return () => clearTimeout(lineTimer);
      }
    } else if (currentLineIdx === CODE_LINES.length) {
      // Done typing
      setCursorVisible(true);
    }
  }, [currentLineIdx, currentCharIdx]);

  return (
    <motion.div
      className="relative flex flex-col sm:flex-row w-full bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-2xl"
      whileHover="hover"
      initial="rest"
    >
      {/* Code Side */}
      <motion.div
        className="w-full sm:w-1/2 p-5 border-b sm:border-b-0 sm:border-r border-border-default bg-[#0a0a10]"
        variants={{
          rest: { x: 0 },
          hover: { x: -3, transition: { type: "spring", stiffness: 400, damping: 30 } }
        }}
      >
        <div className="flex items-center gap-1.5 mb-4 opacity-50">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[10px] text-text-secondary uppercase">engineer_mode</span>
        </div>
        
        <div className="font-mono text-[11px] md:text-xs leading-[1.6] text-[#a9b1d6]">
          {CODE_LINES.map((line, i) => (
            <div key={i} className="min-h-[1.6em]">
              <span className={
                line.type === "comment" ? "text-[#565f89] italic" :
                line.type === "import" ? "text-[#bb9af7]" :
                line.type === "code" && line.text.includes("generateMeme") ? "text-[#7aa2f7]" :
                line.type === "code" && line.text.includes("Ollama") ? "text-[#e0af68]" :
                ""
              }>
                {typedLines[i]}
              </span>
              {currentLineIdx === i && <span className="inline-block w-2 h-3.5 ml-1 bg-accent/70 animate-pulse" />}
            </div>
          ))}
          {cursorVisible && <span className="inline-block w-2 h-3.5 bg-accent/70 animate-pulse mt-1" />}
        </div>
      </motion.div>

      {/* Center Divider line (glow) */}
      <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] hidden sm:flex justify-center w-[2px]">
        <motion.div 
          className="w-[1px] h-full bg-accent"
          variants={{
            rest: { opacity: 0.3, boxShadow: "0 0 10px rgba(108,99,255,0.2)" },
            hover: { opacity: 0.8, boxShadow: "0 0 20px rgba(108,99,255,0.6)" }
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Product Side */}
      <motion.div
        className="w-full sm:w-1/2 p-5 bg-[#0b0e14]"
        variants={{
          rest: { x: 0 },
          hover: { x: 3, transition: { type: "spring", stiffness: 400, damping: 30 } }
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[10px] text-text-secondary uppercase opacity-70">product_mode</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pm-accent animate-pulse" />
        </div>

        <div className="space-y-3 font-mono text-xs">
          {PM_ITEMS.map((item, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 transition-opacity duration-300 ${i < pmItemsVisible ? "opacity-100" : "opacity-0"}`}
            >
              <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                item.active ? "border-pm-accent bg-pm-accent/10" :
                item.done ? "border-border-strong bg-border-subtle" : "border-border-default"
              }`}>
                {item.done && (
                  <svg width="10" height="10" viewBox="0 0 12 12" className="overflow-visible">
                    <motion.path
                      d="M2 6 L5 9 L10 3"
                      stroke="var(--text-primary)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={i < pmItemsVisible ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                    />
                  </svg>
                )}
                {item.active && <span className="w-1 h-1 bg-pm-accent rounded-full animate-ping" />}
              </div>
              <span className={`${item.done ? "text-text-secondary line-through decoration-text-tertiary" : "text-text-primary"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
