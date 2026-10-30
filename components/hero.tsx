import ProductCanvas from "@/components/product-canvas";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { personal, heroData, featuredProjectIds, projects } from "@/lib/data";

export default function Hero() {
  return (
    <section id="hero" className="hero-section max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="hero-copy">
          <p className="eyebrow mb-7">
            {personal.name} <span className="text-text-tertiary mx-2">/</span>{" "}
            Product × Engineering
          </p>
          <h1 className="hero-title">
            Thinks in users.
            <br />
            Builds in code.
            <br />
            <span className="hero-emphasis">Ships with intent.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed mt-7">
            {heroData.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a href="#projects" className="primary-action">
              Explore my work <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href={personal.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-action"
            >
              <FileText className="w-4 h-4" /> View resume{" "}
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
          <p className="flex items-center gap-2 mt-7 text-xs text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-green" /> Open to{" "}
            {personal.openTo}
          </p>
        </div>
        <aside className="hero-studio">
          <ProductCanvas />
          <div className="studio-projects">
            {featuredProjectIds.map((id, index) => {
              const project = projects.find((item) => item.id === id);
              if (!project) return null;
              return (
                <a key={id} href={`#${id}`} className="workbench-link group">
                  <span className="font-mono text-xs text-text-tertiary">
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-text-primary">
                      {project.name}
                    </span>
                    <span className="block text-xs text-text-secondary mt-1">
                      {id === "interview-ace"
                        ? "Voice-first interview coaching"
                        : "AI conversations & follow-up review"}
                    </span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-text-tertiary group-hover:text-accent" />
                </a>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
