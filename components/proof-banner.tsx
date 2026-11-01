"use client";

import { proofStats, proofAttribution } from "@/lib/data";

export default function ProofBanner() {
  return (
    <div className="w-full border-y border-border-default bg-bg-base/50 relative overflow-hidden mb-6 group">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {proofStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold tracking-tight text-text-primary">
                {stat.value}
              </p>
              <p className="text-xs mt-2 text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mt-6 max-w-3xl">
          {proofAttribution}
        </p>
      </div>
    </div>
  );
}
