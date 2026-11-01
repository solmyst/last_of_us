"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Search, Sparkles } from "lucide-react";
import { projects } from "@/lib/data";
import { buildOrder, districts, projectDistrict, type District } from "@/lib/buildverse";

const ordered = buildOrder.flatMap((id) =>
  projects.filter((project) => project.id === id),
);
export default function BuildverseGuide({
  onSelect,
  visited,
}: {
  onSelect: (id: string) => void;
  visited: string[];
}) {
  const [district, setDistrict] = useState<District>("All builds");
  const [query, setQuery] = useState("");
  const filtered = ordered.filter(
    (project) =>
      (district === "All builds" || projectDistrict(project.id) === district) &&
      `${project.name} ${project.tagline} ${project.stack.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section id="projects" className="verse-guide verse-container">
      <div className="verse-section-heading">
        <div>
          <p className="verse-label">THE FIELD GUIDE</p>
          <h2>
            Follow your curiosity<span>.</span>
          </h2>
        </div>
        <p>
          Made with curiosity. Kept honest by tradeoffs.
          <br />
          {projects.length} builds, and a few lessons along the way.
        </p>
      </div>
      <div className="guide-toolbar">
        <div
          className="guide-filters"
          role="group"
          aria-label="Filter projects by district"
        >
          {districts.map((label) => (
            <button
              type="button"
              key={label}
              aria-pressed={district === label}
              onClick={() => setDistrict(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="guide-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a build or a technology"
            aria-label="Search projects"
          />
        </label>
      </div>
      <p className="guide-result-count" role="status">
        {filtered.length} {filtered.length === 1 ? "build" : "builds"} to
        explore
      </p>
      <div className="guide-grid">
        {filtered.map((project) => (
          <button
            type="button"
            className={`guide-card guide-${projectDistrict(project.id).replaceAll(" ", "-").replace("&", "and").toLowerCase()}`}
            key={project.id}
            onClick={() => onSelect(project.id)}
            aria-label={`Explore ${project.name}${visited.includes(project.id) ? ", visited" : ""}`}
          >
            <div className="guide-card-art">
              {project.image ? (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 390px, (min-width:640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="guide-interview-art">
                  <div className="guide-voice">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>InterviewAce</span>
                  <small>Practice → Feedback → Answer Lab</small>
                </div>
              )}
              <span className="guide-type">{projectDistrict(project.id)}</span>
              <span className="guide-card-plus">
                {visited.includes(project.id) ? (
                  <Check size={18} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </span>
            </div>
            <div className="guide-card-copy">
              <span className="verse-label">
                BUILD{" "}
                {String(
                  ordered.findIndex((item) => item.id === project.id) + 1,
                ).padStart(2, "0")}{" "}
                / {visited.includes(project.id) ? "DISCOVERED" : "STEP INSIDE"}
              </span>
              <h3>{project.name}</h3>
              <p>{project.tagline}</p>
              <span className="guide-stack">
                {project.stack.slice(0, 3).join(" / ")}
              </span>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="guide-empty">
          <Sparkles size={26} />
          <h3>No builds on this trail.</h3>
          <p>Try another technology or reset the field guide.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDistrict("All builds");
            }}
          >
            Show all builds
          </button>
        </div>
      )}
    </section>
  );
}
