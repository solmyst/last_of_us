import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { personal, heroData, featuredProjectIds, projects } from "@/lib/data";

export default function Hero() {
  return (
    <section id="hero" className="hero-section max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-[1.3fr_0.8fr] gap-12 lg:gap-20 items-center">
        <div>
          <p className="eyebrow mb-7">
            {personal.name} <span className="text-text-tertiary mx-2">/</span>{" "}
            Product × Engineering
          </p>
          <h1 className="hero-title">
            Thinks in users.
            <br />
            Builds in code.
            <br />
            <span className="text-accent">Ships with intent.</span>
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
        <aside className="builder-note">
          <div className="flex items-center justify-between border-b border-border-default pb-5">
            <p className="eyebrow !mb-0">On my workbench</p>
            <span className="text-xs text-text-tertiary font-mono">2026</span>
          </div>
          <p className="text-2xl font-medium tracking-tight mt-6 mb-6">
            Useful AI, from the
            <br />
            conversation onward.
          </p>
          {featuredProjectIds.map((id, index) => {
            const project = projects.find((item) => item.id === id)!;
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
          <div className="flex items-center justify-between pt-5 text-xs text-text-secondary">
            <span>Research → Build → Learn</span>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent inline-flex items-center gap-1 min-h-11"
            >
              GitHub <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
