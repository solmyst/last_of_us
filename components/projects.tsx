"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import Image from "next/image";
import { GitBranch, ExternalLink, Code2 } from "lucide-react";

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="work" className="py-24 max-w-7xl mx-auto px-6">
      <motion.div 
        className="mb-16 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-4 mb-4 relative">
          <span className="font-mono text-sm tracking-widest text-accent uppercase">02. WORK</span>
          <div className="h-[1px] w-24 bg-border-subtle" />
          <span className="font-mono text-[10px] text-text-tertiary absolute -top-4 right-0 opacity-40 select-none">
            // hint: try typing 'init' in the terminal_
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">SHIPPED WORK</h2>
        <p className="text-text-secondary mt-2 max-w-2xl">
          A selection of projects where I handled the full lifecycle from system design to production deployment. 
          Focusing on performance, privacy, and high-fidelity UX.
        </p>
      </motion.div>

      {/* Dynamic Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        {projects.map((project, i) => (
          <ProjectEntry 
            key={project.id} 
            project={project} 
            isExpanded={expandedId === project.id}
            isThumbnail={expandedId !== null && expandedId !== project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectEntry({ 
  project, 
  isExpanded,
  isThumbnail, 
  onToggle,
  index 
}: { 
  project: typeof projects[0], 
  isExpanded: boolean,
  isThumbnail: boolean,
  onToggle: () => void,
  index: number
}) {
  // Dynamic grid span based on state
  const colSpanClass = isExpanded ? "lg:col-span-2" : "lg:col-span-1";

  // THUMBNAIL STATE (When another card is expanded)
  if (isThumbnail) {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`col-span-1 relative group flex items-center gap-4 bg-bg-surface/30 border border-border-subtle hover:border-border-default rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:bg-bg-elevated/40`}
        onClick={onToggle}
      >
        <motion.div layout="position" className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-bg-elevated">
          {project.image ? (
            <Image src={project.image} alt={project.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
          ) : (
             <div className="w-full h-full bg-border-subtle flex items-center justify-center">
               <Code2 className="w-5 h-5 text-text-tertiary/20" />
             </div>
          )}
        </motion.div>
        <motion.div layout="position" className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-mono text-text-tertiary mb-1 uppercase tracking-wider">
            {project.number} — {project.status}
          </span>
          <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
            {project.name}
          </h3>
        </motion.div>
      </motion.div>
    );
  }

  // NORMAL & EXPANDED STATES
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group flex flex-col bg-bg-surface/40 border border-border-subtle hover:border-border-default rounded-3xl p-6 md:p-8 transition-all duration-300 ${isExpanded ? "bg-bg-surface/80 shadow-2xl z-20" : "hover:bg-bg-surface/60"} ${colSpanClass}`}
      data-cursor={isExpanded ? "collapse" : "project"}
      onClick={onToggle}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

      {/* Header Section */}
      <motion.div layout="position" className="flex flex-col mb-6 relative z-10">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-bg-elevated/80 border border-border-subtle flex items-center justify-center font-mono text-sm text-accent shadow-inner">
              {project.number}
            </div>
            
            <div className="flex flex-col">
              <h3 className={`font-bold text-text-primary leading-tight transition-all ${isExpanded ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                {project.name}
              </h3>
              <span className="font-mono text-[10px] text-text-tertiary opacity-60 mt-1 select-none">
                // {project.id}.config.ts
              </span>
            </div>
          </div>
        </div>

        {/* Status & Tech Stack Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-2.5 py-1 rounded-md border text-[9px] font-mono uppercase tracking-widest inline-flex items-center gap-1.5 ${
            project.status === "live" ? "border-green/30 bg-green/10 text-green" :
            project.status === "shipped" ? "border-accent/30 bg-accent/10 text-accent" :
            project.status === "wip" ? "border-amber/30 bg-amber/10 text-amber" :
            "border-text-tertiary/30 bg-text-tertiary/10 text-text-secondary"
          }`}>
            <span className={`w-1 h-1 rounded-full animate-pulse ${project.status === "live" ? "bg-green" : project.status === "shipped" ? "bg-accent" : project.status === "wip" ? "bg-amber" : "bg-text-tertiary"}`} /> 
            {project.status === "live" ? "PRODUCTION" : project.status}
          </span>

          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, isExpanded ? 10 : 3).map((tech) => (
              <span key={tech} className="px-2 py-1 rounded border border-border-subtle bg-bg-elevated/50 text-[9px] font-mono text-text-secondary uppercase tracking-wider">
                {tech}
              </span>
            ))}
            {!isExpanded && project.stack.length > 3 && (
              <span className="px-2 py-1 rounded border border-border-subtle bg-bg-elevated/50 text-[9px] font-mono text-text-tertiary">
                +{project.stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Front Body: Image + Description */}
      <motion.div layout="position" className="flex flex-col xl:flex-row gap-8 relative z-10">
        {/* Left Image / Placeholder */}
        <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-bg-elevated shrink-0 border border-border-subtle transition-all duration-500 group-hover:border-accent/30 ${isExpanded ? "xl:w-[55%]" : "xl:w-[45%]"}`}>
          {project.image ? (
            <Image 
              src={project.image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-bg-elevated/50">
              <Code2 className="w-12 h-12 text-text-tertiary/20" />
              <span className="font-mono text-[10px] text-text-tertiary tracking-widest uppercase">system_preview.sh</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>
        
        {/* Right Description */}
        <div className="flex-1 flex flex-col justify-start py-2">
          <p className="text-[15px] leading-relaxed text-text-secondary">
            <span className="text-text-primary font-bold block mb-3 text-lg">{project.tagline}</span>
            <span className={isExpanded ? "" : "line-clamp-4"}>{project.userProblem}</span>
          </p>

          {/* Front Quick Links */}
          {!isExpanded && (
            <div className="flex items-center gap-5 mt-6 font-mono text-[10px] tracking-widest uppercase">
              {project.links.github && (
                <a href={project.links.github} target="_blank" onClick={(e) => e.stopPropagation()} className="text-text-tertiary hover:text-accent transition-all flex items-center gap-2 group/link">
                  <GitBranch className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform" /> 
                  <span className="border-b border-transparent group-hover/link:border-accent/50 pb-0.5">SOURCE</span>
                </a>
              )}
              {project.links.live && (
                <a href={project.links.live} target="_blank" onClick={(e) => e.stopPropagation()} className="text-text-tertiary hover:text-accent transition-all flex items-center gap-2 group/link">
                  <ExternalLink className="w-3.5 h-3.5" /> 
                  <span className="border-b border-transparent group-hover/link:border-accent/50 pb-0.5">DEPLOYMENT</span>
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Expanded Content: KEY FEATURES */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="pt-10 mt-10 border-t border-border-subtle/50">
              
              {/* Heading */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-accent rounded-full" />
                  <h4 className="font-mono text-xs font-bold text-text-primary tracking-widest uppercase">Technical Brief</h4>
                </div>

                <div className="flex items-center gap-4 font-mono text-[10px]">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-elevated/50 text-text-secondary hover:text-accent hover:border-accent/30 transition-all flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5" /> REPOSITORY
                    </a>
                  )}
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-elevated/50 text-text-secondary hover:text-accent hover:border-accent/30 transition-all flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5" /> LIVE PREVIEW
                    </a>
                  )}
                </div>
              </div>
              
              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureBox title="THE BUILD" text={project.whatIBuilt} icon={<Code2 className="w-4 h-4" />} />
                <FeatureBox title="THE OUTCOME" text={project.outcome} icon={<div className="w-1.5 h-1.5 rounded-full bg-green" />} />
                
                {/* Decision Insight */}
                <div className="md:col-span-2 bg-accent/5 border border-accent/10 rounded-2xl p-6 md:p-8">
                   <h5 className="font-mono text-[10px] text-accent font-bold uppercase tracking-[0.2em] mb-4">Architectural Decision Log</h5>
                   <p className="text-[14px] leading-relaxed text-text-primary/80 italic font-medium">
                     "{project.decisions[0].statement}"
                   </p>
                   <p className="text-[13px] leading-relaxed text-text-secondary mt-4">
                     {project.decisions[0].because}
                   </p>
                   <div className="mt-6 flex gap-4 text-[10px] font-mono text-text-tertiary">
                     <span className="flex items-center gap-1.5 text-accent/70"><div className="w-1 h-1 rounded-full bg-accent" /> Chose A over B</span>
                     <span className="opacity-40">|</span>
                     <span>Lesson: {project.decisions[0].wouldDoDifferently}</span>
                   </div>
                </div>
              </div>

              {/* Bottom padding for bento balance */}
              <div className="h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function FeatureBox({ title, text, icon }: { title: string, text: string, icon: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated/30 border border-border-subtle/50 rounded-2xl p-6 flex flex-col gap-4 hover:bg-bg-elevated/50 transition-colors group/box">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-text-tertiary group-hover/box:text-accent transition-colors">
          {icon}
        </div>
        <h5 className="font-mono text-[10px] text-text-tertiary font-bold uppercase tracking-widest">{title}</h5>
      </div>
      <p className="text-[13.5px] leading-relaxed text-text-secondary">{text}</p>
    </div>
  );
}
