"use client";

import { personal } from "@/lib/data";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 max-w-[1000px] mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-4 relative max-w-xs mx-auto">
            <span className="font-mono text-sm tracking-widest text-accent uppercase">05. REACH</span>
            <div className="h-[1px] w-12 bg-border-subtle" />
            <span className="font-mono text-[10px] text-text-tertiary absolute -top-4 opacity-40">--ping --t 500ms</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary uppercase tracking-tight">Let&apos;s build something.</h2>
        </div>
        
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
          If you&apos;re building something hard and need someone who
          can write the PRD <em className="text-text-primary not-italic">&amp;</em> the API — I&apos;m interested.
        </p>

        <a 
          href={`mailto:${personal.email}`}
          data-cursor="link"
          className="inline-block text-2xl md:text-3xl font-mono text-accent hover:text-white transition-colors mb-20 relative group"
        >
          {personal.email}
          <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-accent group-hover:bg-white transition-colors" />
        </a>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 font-mono text-[13px] text-text-secondary uppercase tracking-wider">
          <a href={personal.github} target="_blank" data-cursor="link" className="hover:text-text-primary transition-colors flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> GITHUB ↗
          </a>
          <a href={personal.linkedin} target="_blank" data-cursor="link" className="hover:text-text-primary transition-colors flex items-center gap-2">
            LinkedIn ↗
          </a>
          <a href={personal.twitter} target="_blank" data-cursor="link" className="hover:text-text-primary transition-colors flex items-center gap-2">
            Twitter ↗
          </a>
          <a href={personal.resume} target="_blank" data-cursor="link" className="hover:text-text-primary transition-colors flex items-center gap-2">
            Resume PDF ↗
          </a>
        </div>
      </motion.div>
    </section>
  );
}
