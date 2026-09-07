"use client";

import { motion } from "framer-motion";
import { experiences, experienceIntro } from "@/lib/data";
import { MapPin, Calendar, Briefcase } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        className="mb-16 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-4 relative">
          <span className="font-mono text-sm tracking-widest text-accent uppercase">01. CAREER</span>
          <div className="h-[1px] w-24 bg-border-subtle" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">Professional Experience</h2>
        <p className="text-text-secondary mt-2 max-w-2xl">
          {experienceIntro}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative group bg-bg-surface/40 border border-border-subtle hover:border-accent/30 rounded-3xl p-8 md:p-10 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
            
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 relative z-10">
              <div className="flex flex-col gap-4 min-w-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                      <span className="text-lg font-medium text-text-secondary">{exp.company}</span>
                      <span className="text-text-tertiary hidden md:inline">•</span>
                      <div className="flex items-center gap-1.5 text-text-tertiary font-mono text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-text-secondary text-lg leading-relaxed max-w-3xl mt-2">
                  {exp.description}
                </p>

                <ul className="space-y-3 mt-4">
                  {exp.achievements.map((achievement, j) => (
                    <li key={j} className="flex items-start gap-3 text-text-secondary text-[15px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-bg-elevated/80 border border-border-subtle text-[11px] font-mono text-text-primary uppercase tracking-wider group-hover:border-accent/20 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col xl:items-end shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated/50 border border-border-subtle text-accent font-mono text-xs font-bold uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
