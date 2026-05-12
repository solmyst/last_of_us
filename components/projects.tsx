"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="work" className="py-24 max-w-[1000px] mx-auto px-6">
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-mono mb-4 text-text-primary">SHIPPED WORK</h2>
        <p className="text-text-secondary">Projects that went from idea → live. Select works only.</p>
      </div>

      <div className="space-y-32">
        {projects.map((project) => (
          <ProjectEntry key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectEntry({ project }: { project: typeof projects[0] }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`relative pl-8 md:pl-12 group ${project.featured ? "scanline-hover" : ""}`}
      data-cursor="project"
    >
      <div className="scanline-effect" />
      
      {/* Animated Accent Left Border */}
      <motion.div
        initial={{ scaleY: 0, originY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent"
      />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-sm text-text-tertiary"
          >
            {project.number}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${
              project.status === "live" ? "border-green/30 text-green bg-green/5" :
              project.status === "wip" ? "border-amber/30 text-amber bg-amber/5" :
              "border-text-tertiary/30 text-text-secondary bg-text-tertiary/5"
            }`}
          >
            {project.status}
          </motion.span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-medium text-text-primary mb-2">{project.name}</h3>
          <p className="text-lg text-text-secondary font-mono tracking-tight">{project.tagline}</p>
        </motion.div>
      </div>

      <div className="w-full h-[1px] bg-border-subtle mb-10" />

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-3">The Problem</h4>
          <p className="text-[15px] leading-relaxed text-text-secondary">{project.userProblem}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-3">The Outcome</h4>
          <p className="text-[15px] leading-relaxed text-text-primary font-medium">{project.outcome}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-3">What I Built</h4>
          <p className="text-[15px] leading-relaxed text-text-secondary">{project.whatIBuilt}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-3">Decisions I Made</h4>
          {project.decisions.length > 0 ? (
            <div className="bg-bg-surface border border-border-default rounded p-4 text-[14px] text-text-secondary leading-relaxed relative">
              <div className={`overflow-hidden transition-all duration-300 ${!expanded ? "line-clamp-2" : ""}`}>
                <span className="font-medium text-text-primary mr-2">Chose {project.decisions[0].optionA.label.split(' ')[0]} over {project.decisions[0].optionB.label.split(' ')[0]}:</span>
                {project.decisions[0].because}
              </div>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-accent text-sm font-mono hover:underline decoration-accent underline-offset-4"
              >
                {expanded ? "← collapse" : "Read decision →"}
              </button>
            </div>
          ) : (
            <p className="text-[15px] text-text-secondary italic">Standard implementation.</p>
          )}
        </motion.div>
      </div>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.stack.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06 }}
            className="px-3 py-1 bg-bg-elevated border border-border-subtle rounded-full text-xs font-mono text-text-secondary hover:text-text-primary hover:border-border-default cursor-default transition-colors"
          >
            {tech}
          </motion.span>
        ))}
      </div>

      {/* Links */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center gap-6 font-mono text-[13px]"
      >
        {project.links.caseStudy && (
          <a href={project.links.caseStudy} className="text-accent hover:text-white transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-white transition-colors" />
            Case Study →
          </a>
        )}
        {project.links.live && (
          <a href={project.links.live} target="_blank" className="text-text-secondary hover:text-text-primary transition-colors">
            ↗ Live
          </a>
        )}
        {project.links.github && (
          <a href={project.links.github} target="_blank" className="text-text-secondary hover:text-text-primary transition-colors">
            ↗ GitHub
          </a>
        )}
      </motion.div>
    </div>
  );
}
