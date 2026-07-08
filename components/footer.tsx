"use client";
import { GitBranch } from "lucide-react";
import { personal, footerData } from "@/lib/data";

export default function Footer() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "production";
  const repoName = `${personal.handle.split(" / ")[1] || "solmyst"}/portfolio`;

  return (
    <footer className="py-8 border-t border-border-subtle bg-bg-base">
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-text-tertiary">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <a href={personal.github} target="_blank" className="flex items-center gap-2 hover:text-accent transition-colors group">
            <GitBranch className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>{repoName}</span>
          </a>
          <span className="hidden md:inline text-border-default">|</span>
          <span>{footerData.location}</span>
          <span className="hidden md:inline text-border-default">|</span>
          <span>{footerData.status}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-bg-elevated rounded border border-border-default">
            build: {buildTime}
          </span>
          <span className="px-2 py-1 bg-green/10 text-green rounded border border-green/30 flex items-center gap-1.5" title="Lighthouse Performance Score">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            {footerData.lighthouseScore}
          </span>
        </div>
      </div>
    </footer>
  );
}
