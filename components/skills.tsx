"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/data";
import { Star, Zap, Circle, Activity } from "lucide-react";

interface Skill {
  name: string;
  level: string;
  note?: string;
}

interface SkillGroup {
  label: string;
  mode: string;
  skills: Skill[];
}

function LevelIndicator({ level }: { level: string }) {
  switch (level) {
    case "primary":
      return (
        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
      );
    case "production":
      return (
        <Zap className="w-3.5 h-3.5 text-green fill-green/20" />
      );
    case "learning":
      return (
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-pm-accent animate-ping opacity-20" />
          <Circle className="w-3.5 h-3.5 text-pm-accent relative z-10" />
        </div>
      );
    case "exploring":
      return (
        <Activity className="w-3.5 h-3.5 text-text-tertiary" />
      );
    default:
      return null;
  }
}

export default function Skills() {
  return (
    <section id="tech" className="py-24 max-w-7xl mx-auto px-6 relative">
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-4 relative">
          <span className="font-mono text-sm tracking-widest text-accent uppercase">05. TECH</span>
          <div className="h-[1px] w-24 bg-border-subtle" />
          <span className="font-mono text-[10px] text-text-tertiary absolute -top-4 right-0 opacity-40">{"/* runtime_inventory.ts */"}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">Tech Inventory</h2>
        <p className="text-text-secondary mt-2 font-mono text-xs uppercase opacity-60">Filtered by proficiency & application</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {skillGroups.map((group: SkillGroup, groupIdx: number) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIdx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
            }}
            className={`group relative p-8 rounded-3xl bg-bg-surface/40 border border-border-subtle hover:border-accent/40 hover:bg-bg-surface/60 transition-all duration-500 overflow-hidden ${
              groupIdx === 0 ? "lg:col-span-2" : ""
            }`}
          >
            {/* Animated Spotlight Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(108,99,255,0.08),transparent_40%)]" 
                   style={{ 
                     "--mouse-x": "50%", 
                     "--mouse-y": "50%" 
                   } as React.CSSProperties}
              />
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] group-hover:opacity-[0.08] transition-all duration-500" />
            
            <h3 className="font-mono text-xs tracking-[0.3em] text-text-tertiary uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-border-default" />
              {group.label}
            </h3>

            <div className={`grid gap-x-8 gap-y-4 ${groupIdx === 0 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {group.skills.map((skill: Skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 py-2 group/skill cursor-default relative"
                >
                  <div className="shrink-0 flex items-center justify-center w-5 transition-all duration-150 group-hover/skill:scale-125">
                    <LevelIndicator level={skill.level} />
                  </div>
                  
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-[15px] font-medium text-text-secondary group-hover/skill:text-accent transition-colors duration-150 whitespace-nowrap">
                      {skill.name}
                    </span>
                    
                    <span className={`
                      text-[11px] font-mono uppercase tracking-widest transition-all duration-150 whitespace-nowrap
                      opacity-0 -translate-x-3 group-hover/skill:opacity-100 group-hover/skill:translate-x-0
                      ${skill.note ? "text-accent font-bold" : "text-text-tertiary"}
                    `}>
                      {skill.note || "Verified"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-20 pt-10 border-t border-border-subtle grid grid-cols-2 md:flex md:justify-center gap-x-8 gap-y-6">
        <div className="flex items-center gap-3 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          <LevelIndicator level="primary" /> Primary Tool
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          <LevelIndicator level="production" /> Production Experience
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          <LevelIndicator level="learning" /> Building Projects
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
          <LevelIndicator level="exploring" /> In Exploration
        </div>
      </div>
    </section>
  );
}
