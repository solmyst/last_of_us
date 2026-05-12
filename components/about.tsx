"use client";

import { motion } from "framer-motion";
import { currently, personal } from "@/lib/data";

export default function About() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6 border-t border-border-subtle">
      <div className="grid md:grid-cols-[1fr_300px] gap-16 md:gap-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-mono text-sm tracking-widest text-text-tertiary uppercase mb-8">About</h2>
          
          <div className="space-y-6 text-[15px] leading-relaxed text-text-secondary font-serif-optional">
            <p>
              I&apos;m a {personal.year.split("—")[1].trim()} student at {personal.university}.
            </p>
            <p>
              I build full-stack systems and think about them like a PM.
              That&apos;s not a common combination — most engineers don&apos;t care
              about the &quot;why&quot;, most PMs can&apos;t implement the &quot;how&quot;. I try to do both.
            </p>
            <p>
              Currently: finishing my degree, building MemeForge AI, grinding
              LeetCode, and reading everything I can about system design
              and product strategy.
            </p>
            <p>
              Looking for: an <strong className="text-text-primary font-medium">{personal.openTo}</strong> where I can
              ship fast, learn from people who are better than me, and
              eventually move into a hybrid eng/PM track.
            </p>
            <p>
              <span className="text-accent italic">Not looking for:</span> a job where &quot;the requirements are fixed&quot;.
            </p>
            <p>
              Outside work: guitar, anime, video editing, hackathons.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6 font-mono text-[11px] md:text-xs"
        >
          <div className="bg-bg-surface border border-border-default rounded p-4">
            <span className="block text-text-tertiary uppercase tracking-wider mb-2">Currently Building</span>
            <span className="text-accent">{currently.building}</span>
          </div>

          <div className="bg-bg-surface border border-border-default rounded p-4">
            <span className="block text-text-tertiary uppercase tracking-wider mb-2">Currently Learning</span>
            <span className="text-pm-accent">{currently.learning}</span>
          </div>

          <div className="bg-bg-surface border border-border-default rounded p-4">
            <span className="block text-text-tertiary uppercase tracking-wider mb-2">Currently Reading</span>
            <span className="text-amber">{currently.reading}</span>
          </div>

          <div className="bg-bg-surface border border-border-default rounded p-4">
            <span className="block text-text-tertiary uppercase tracking-wider mb-2">Currently Listening</span>
            <span className="text-green">{currently.listening}</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
