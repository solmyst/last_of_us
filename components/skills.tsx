"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";

function LevelIndicator({ level }: { level: string }) {
  switch (level) {
    case "primary":
      return (
        <div className="w-3 h-3 rounded-full bg-text-primary flex items-center justify-center" title="Primary">
          <div className="w-1.5 h-1.5 bg-bg-base rounded-full" />
        </div>
      );
    case "production":
      return (
        <div className="w-3 h-3 rounded-full border border-accent flex overflow-hidden" title="Production">
          <div className="w-1/2 h-full bg-accent" />
        </div>
      );
    case "learning":
      return (
        <div className="w-3 h-3 rounded-full border border-pm-accent" title="Learning" />
      );
    case "exploring":
      return (
        <div className="w-3 h-[2px] bg-text-tertiary" title="Exploring" />
      );
    default:
      return null;
  }
}

export default function Skills() {
  return (
    <section className="py-24 max-w-[1000px] mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        {skillGroups.map((group) => (
          <div key={group.label}>
            {/* Animated Header Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="h-[1px] bg-border-default mb-4 origin-left"
            />
            
            <h3 className="font-mono text-sm tracking-widest text-text-tertiary uppercase mb-8">
              {group.label}
            </h3>

            <div className="flex flex-col gap-3">
              {group.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group relative flex items-center gap-4 py-2 px-3 -mx-3 rounded transition-colors hover:bg-bg-elevated/30"
                >
                  <div className="w-4 flex justify-center shrink-0">
                    <LevelIndicator level={skill.level} />
                  </div>
                  <span className="text-[15px] text-text-secondary group-hover:text-text-primary transition-colors">
                    {skill.name}
                  </span>
                  
                  {skill.note && (
                    <span className="ml-auto text-[11px] font-mono text-text-tertiary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      {skill.note}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 font-mono text-xs text-text-tertiary flex gap-6 items-center justify-center flex-wrap">
        <div className="flex items-center gap-2"><LevelIndicator level="primary" /> Primary Tool</div>
        <div className="flex items-center gap-2"><LevelIndicator level="production" /> Shipped to Prod</div>
        <div className="flex items-center gap-2"><LevelIndicator level="learning" /> Actively Learning*</div>
        <div className="flex items-center gap-2"><LevelIndicator level="exploring" /> Exploring</div>
      </div>
      <p className="text-center font-mono text-[10px] text-text-tertiary mt-4">
        * &quot;actively learning&quot; = building projects with it, not just watching tutorials
      </p>
    </section>
  );
}
