import Nav from "@/components/nav";
import Hero from "@/components/hero";
import ProofBanner from "@/components/proof-banner";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Decisions from "@/components/decisions";
import Skills from "@/components/skills";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import EasterEgg from "@/components/easter-egg";
import SandSimulator from "@/components/sand-simulator";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full">
        <Hero />
        <ProofBanner />
        <Projects />
        <div className="section-divider" />
        <Experience />
        <div className="section-divider" />
        <Decisions />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <div className="portfolio-playground">
          <SandSimulator />
        </div>
        <Contact />
      </main>
      <Footer />
      <EasterEgg />
    </div>
  );
}
