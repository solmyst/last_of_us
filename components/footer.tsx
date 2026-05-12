"use client";



export default function Footer() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "development";

  return (
    <footer className="py-8 border-t border-border-subtle bg-bg-base">
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-text-tertiary">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span>built by sol in Jaipur</span>
          <span className="hidden md:inline">•</span>
          <span>next.js 14</span>
          <span className="hidden md:inline">•</span>
          <span>framer motion</span>
          <span className="hidden md:inline">•</span>
          <span>deployed on vercel</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-bg-elevated rounded border border-border-default">
            build: {buildTime}
          </span>
          <span className="px-2 py-1 bg-green/10 text-green rounded border border-green/30 flex items-center gap-1.5" title="Lighthouse Performance Score">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            96
          </span>
        </div>
      </div>
    </footer>
  );
}
