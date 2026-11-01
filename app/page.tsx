import Buildverse from "@/components/buildverse";
import Experience from "@/components/experience";
import Decisions from "@/components/decisions";
import Skills from "@/components/skills";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import SandSimulator from "@/components/sand-simulator";
import EasterEgg from "@/components/easter-egg";
import "./buildverse.css";

export default function Home() {
  return (
    <div className="buildverse">
      <Buildverse>
        <div
          id="portfolio"
          className="verse-professional-story"
          role="region"
          aria-label="Professional portfolio"
        >
          <Experience />
          <div className="section-divider" />
          <Decisions />
          <div className="section-divider" />
          <Skills />
          <div className="section-divider" />
          <About />
          <div className="portfolio-playground">
            <SandSimulator />
          </div>
          <Contact />
        </div>
      </Buildverse>
      <Footer />
      <EasterEgg />
    </div>
  );
}
