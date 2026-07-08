"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { dualIdentityData } from "@/lib/data";

export default function DualIdentity() {
  const { title, subtitle, engineer, product } = dualIdentityData;

  return (
    <section id="thinking" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="text-center mb-16"
      >
        <h2 className="text-sm font-mono text-text-tertiary uppercase tracking-widest mb-4">{title}</h2>
        <p className="text-2xl md:text-3xl text-text-secondary">{subtitle}</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-5xl mx-auto relative">
        {/* Engineer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-bg-surface border border-border-default rounded-2xl p-8 relative overflow-hidden group"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-[0.03] rounded-full blur-[80px] group-hover:opacity-[0.06] transition-opacity duration-500" />
          
          <div className="flex items-center gap-3 mb-8">
            <span className="text-accent text-xl">⬡</span>
            <h3 className="font-mono text-sm tracking-widest text-text-primary uppercase">{engineer.title}</h3>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-text-secondary mb-10">
            <p>{engineer.intro}</p>
            <ul className="space-y-2">
              {engineer.bullets.map((b, idx) => (
                <li key={idx} className="flex gap-3"><span className="text-accent">→</span> {b}</li>
              ))}
            </ul>
          </div>

          <div className="font-mono text-[13px] text-text-tertiary border-t border-border-subtle pt-6">
            <p className="mb-2"><strong className="text-text-secondary font-medium">Stack:</strong> {engineer.stack}</p>
            <p><strong className="text-text-secondary font-medium">Currently learning:</strong> {engineer.learning}</p>
          </div>
        </motion.div>

        {/* Connector Element */}
        <div className="hidden md:flex flex-col justify-center items-center px-2 z-10">
          <div className="bg-bg-base p-2 border border-border-subtle rounded-full text-text-tertiary">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mt-4 writing-vertical rotate-180">one person</span>
        </div>

        {/* PM Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-bg-surface border border-border-default rounded-2xl p-8 relative overflow-hidden group"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pm-accent opacity-[0.03] rounded-full blur-[80px] group-hover:opacity-[0.06] transition-opacity duration-500" />
          
          <div className="flex items-center gap-3 mb-8">
            <span className="text-pm-accent text-xl">◈</span>
            <h3 className="font-mono text-sm tracking-widest text-text-primary uppercase">{product.title}</h3>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-text-secondary mb-10">
            <p>{product.intro}</p>
            <ul className="space-y-2">
              {product.bullets.map((b, idx) => (
                <li key={idx} className="flex gap-3"><span className="text-pm-accent">→</span> {b}</li>
              ))}
            </ul>
          </div>

          <div className="font-mono text-[13px] text-text-tertiary border-t border-border-subtle pt-6">
            <p className="mb-2"><strong className="text-text-secondary font-medium">Tools:</strong> {product.tools}</p>
            <p><strong className="text-text-secondary font-medium">Currently reading:</strong> {product.reading}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
