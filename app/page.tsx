"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import ProofBanner from "@/components/proof-banner";
import DualIdentity from "@/components/dual-identity";
import Projects from "@/components/projects";
import Decisions from "@/components/decisions";
import Skills from "@/components/skills";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import EasterEgg from "@/components/easter-egg";

import Experience from "@/components/experience";
import SandSimulator from "@/components/sand-simulator";

export default function Home() {
  const { scrollYProgress } = useScroll();

  // Map scroll position to color for the context switch effect
  const dynamicAccent = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#6c63ff", "#6c63ff", "#06b6d4", "#06b6d4"]
  );

  return (
    <motion.div 
      style={{ "--dynamic-accent": dynamicAccent } as React.CSSProperties}
      className="min-h-screen bg-bg-base flex flex-col"
    >
      <Nav />
      
      <main className="flex-1 w-full">
        <Hero />
        <ProofBanner />
        <DualIdentity />
        
        <div className="w-full h-px bg-border-subtle max-w-7xl mx-auto my-12" />
        
        <Experience />
        
        <div className="w-full h-px bg-border-subtle max-w-7xl mx-auto my-12" />
        
        <Projects />
        
        <div className="w-full h-px bg-border-subtle max-w-7xl mx-auto my-12" />
        
        <Decisions />
        
        <div className="w-full h-px bg-border-subtle max-w-7xl mx-auto my-12" />
        
        <SandSimulator />
        
        <div className="w-full h-px bg-border-subtle max-w-7xl mx-auto my-12" />
        
        <Skills />
        <About />
        <Contact />
      </main>

      <Footer />
      <EasterEgg />
    </motion.div>
  );
}
