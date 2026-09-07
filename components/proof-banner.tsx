"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { proofStats, proofAttribution } from "@/lib/data";
import { GitBranch } from "lucide-react";

function AnimatedNumber({ value }: { value: string }) {
  const numMatch = value.match(/^(\d+)(.*)$/);
  const isNumber = !!numMatch;
  const target = isNumber ? parseInt(numMatch[1], 10) : 0;
  const suffix = isNumber ? numMatch[2] : "";
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(target);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView && isNumber) {
      count.set(0);
      animate(count, target, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView, count, target, isNumber]);

  if (!isNumber) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function ProofBanner() {
  return (
    <div className="w-full border-y border-border-default bg-bg-base/50 relative overflow-hidden my-10 md:my-24 group">
      {/* Desktop view */}
      <div className="hidden md:flex flex-wrap justify-center items-center py-4 px-6 gap-6 font-mono text-[13px] text-text-secondary tracking-wide">
        {proofStats.map((stat, i) => (
          <div key={i} className="flex items-center">
            <span className="text-text-primary mr-2">
              <AnimatedNumber value={stat.value} />
            </span>
            <span className="flex items-center gap-1.5">
              {stat.label.toLowerCase().includes("github") && <GitBranch className="w-3.5 h-3.5" />}
              {stat.label}
            </span>
            {i !== proofStats.length - 1 && (
              <span className="text-border-strong mx-4"> | </span>
            )}
          </div>
        ))}
      </div>

      {/* Mobile marquee view */}
      <div className="flex md:hidden py-4 font-mono text-[12px] text-text-secondary tracking-wide whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex gap-8 pr-8">
          {[...proofStats, ...proofStats].map((stat, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="text-text-primary mr-2">{stat.value}</span>
              <span className="flex items-center gap-1.5">
                {stat.label.toLowerCase().includes("github") && <GitBranch className="w-3 h-3" />}
                {stat.label}
              </span>
              <span className="text-border-strong mx-6"> | </span>
            </div>
          ))}
        </div>
      </div>
      <p className="max-w-4xl mx-auto px-6 pb-4 text-center text-xs leading-relaxed text-text-secondary">{proofAttribution}</p>
    </div>
  );
}
