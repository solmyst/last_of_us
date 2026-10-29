"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  ChevronDown,
  GitBranch,
  Mic,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { projects, featuredProjectIds, type Project } from "@/lib/data";

const featured = featuredProjectIds.flatMap((id) =>
  projects.filter((project) => project.id === id),
);
const archive = projects.filter(
  (project) => !featuredProjectIds.includes(project.id),
);
const statusLabels = {
  live: "Live project",
  shipped: "Built",
  wip: "In progress",
  academic: "Academic",
  pilot: "Working pilot",
  demo: "Browser voice demo",
};

export default function Projects() {
  return (
    <section id="projects" className="py-20 max-w-7xl mx-auto px-6">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / Selected work</p>
          <h2 className="section-title">
            From user problem
            <br />
            to working product.
          </h2>
        </div>
        <p className="max-w-sm text-text-secondary leading-relaxed">
          Two AI products I’m building end to end. The experience, the systems
          behind it, and the decisions that connect them.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {featured.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </div>
      <details className="project-archive mt-10 border-y border-border-default">
        <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer text-text-primary">
          <span>
            More things I’ve built{" "}
            <span className="font-mono text-xs text-text-secondary ml-2">
              / {archive.length} projects
            </span>
          </span>
          <ChevronDown className="details-chevron w-5 h-5" />
        </summary>
        <div className="grid sm:grid-cols-2 gap-x-10 pb-6">
          {archive.map((project) => (
            <article
              key={project.id}
              className="border-t border-border-default py-6"
            >
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-text-secondary mt-2 mb-4 leading-relaxed">
                {project.tagline}
              </p>
              <ProjectLinks project={project} />
              <ProjectCaseStudy project={project} />
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

function FeaturedProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      id={project.id}
      className="project-feature overflow-hidden rounded-2xl border border-border-default bg-bg-surface"
    >
      <div className="project-cover">
        {project.image ? (
          <figure className="h-full">
            <div className="relative h-full overflow-hidden">
              <Image
                src={project.image}
                alt="Relay Voice dashboard with agent management, call studio, and conversation history"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="cover-caption">
              Early demo interface · simulated example data
            </figcaption>
          </figure>
        ) : (
          <InterviewOverview />
        )}
      </div>
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center gap-4 mb-5 font-mono text-xs">
          <span className="text-text-tertiary">0{index + 1} / AI PRODUCTS</span>
          <span className="project-status">{statusLabels[project.status]}</span>
        </div>
        <h3 className="text-3xl font-semibold tracking-tight">
          {project.name}
        </h3>
        <p className="text-text-primary text-lg mt-3 leading-relaxed">
          {project.tagline}
        </p>
        <p className="text-text-secondary mt-4 text-sm leading-7">
          {project.userProblem}
        </p>
        <ul
          aria-label={`${project.name} technologies`}
          className="flex flex-wrap gap-2 mt-6 mb-6"
        >
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md bg-bg-elevated px-2.5 py-1.5 text-xs text-text-secondary"
            >
              {tech}
            </li>
          ))}
        </ul>
        <ProjectLinks project={project} />
        <ProjectCaseStudy project={project} />
      </div>
    </article>
  );
}

function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <details className="case-study mt-6 border-t border-border-default">
      <summary className="py-5 flex items-center justify-between cursor-pointer font-medium text-sm">
        Explore the case study{" "}
        <ChevronDown className="details-chevron w-4 h-4" />
      </summary>
      <div className="space-y-6 pb-4 text-sm leading-7 text-text-secondary">
        <div>
          <h4 className="case-label">What I built</h4>
          <p>{project.whatIBuilt}</p>
        </div>
        <div>
          <h4 className="case-label">What works today</h4>
          <p>{project.outcome}</p>
        </div>
        {project.decisions.map((decision) => (
          <div key={decision.id} className="decision-note">
            <h4 className="case-label">The product decision</h4>
            <p className="font-semibold text-text-primary mb-3">
              {decision.statement}
            </p>
            <p>{decision.because}</p>
            <p className="mt-3">
              <strong className="text-text-primary">Next:</strong>{" "}
              {decision.wouldDoDifferently}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
      {project.links.live && (
        <a
          className="inline-flex min-h-11 items-center gap-2 text-accent hover:underline underline-offset-4"
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.status === "pilot" ? "Open pilot" : "Open project"}{" "}
          <ArrowUpRight className="w-4 h-4" />
          <span className="sr-only">: {project.name} (opens in new tab)</span>
        </a>
      )}
      {project.links.github && (
        <a
          className="inline-flex min-h-11 items-center gap-2 text-text-secondary hover:text-text-primary"
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitBranch className="w-4 h-4" />
          Source & docs
          <span className="sr-only">: {project.name} (opens in new tab)</span>
        </a>
      )}
    </div>
  );
}

function InterviewOverview() {
  return (
    <div
      className="interview-overview h-full p-6 md:p-8 flex flex-col justify-between"
      aria-label="InterviewAce workflow illustration"
    >
      <div className="flex items-center justify-between text-xs font-mono">
        <span>InterviewAce</span>
        <span className="opacity-70">THE PRACTICE LOOP</span>
      </div>
      <div className="flex items-center gap-4 my-5">
        <div className="voice-mark">
          <Mic className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xl font-semibold">
            A better answer
            <br />
            starts with practice.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="workflow-step">
          <Mic className="w-4 h-4 mb-2" />
          01 · Speak
        </div>
        <div className="workflow-step">
          <MessageSquare className="w-4 h-4 mb-2" />
          02 · Reflect
        </div>
        <div className="workflow-step">
          <RotateCcw className="w-4 h-4 mb-2" />
          03 · Retry
        </div>
      </div>
      <p className="text-[11px] mt-3 opacity-70">
        Workflow illustration · Interview → Report → Answer Lab
      </p>
    </div>
  );
}
