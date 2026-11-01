"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, GitBranch, X } from "lucide-react";
import { type Project } from "@/lib/data";
import { tourIds, projectDistrict, buildOrder } from "@/lib/buildverse";

export default function BuildverseDialog({
  project,
  onClose,
  touring,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  touring: boolean;
  onNext: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState("Story");
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = dialog.current!;
    if (!project) return;
    setTab("Story");
    if (!element.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      element.showModal();
    }
    close.current?.focus({ preventScroll: true });
    if (story.current) story.current.scrollTop = 0;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [project]);
  useEffect(() => {
    if (!project && dialog.current?.open) {
      dialog.current.close();
      returnFocus.current?.focus();
    }
  }, [project]);
  const index = project ? buildOrder.indexOf(project.id) + 1 : 0;
  const tourIndex = project ? tourIds.indexOf(project.id) : -1;
  return (
    <dialog
      ref={dialog}
      className="build-dialog"
      aria-labelledby="build-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="build-dialog-content">
          <div className="dialog-top">
            <span className="verse-label">
              FIELD NOTE / {String(index).padStart(2, "0")}
            </span>
            <button
              ref={close}
              type="button"
              className="dialog-close"
              aria-label="Close project story"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div
            className={`dialog-banner district-${projectDistrict(project.id).replaceAll(" ", "-").replace("&", "and").toLowerCase()}`}
          >
            <span className="dialog-stamp">
              <Check size={14} />
              STORY DISCOVERED
            </span>
            <div className="dialog-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <p>{projectDistrict(project.id)}</p>
          </div>
          <div className="dialog-story" ref={story}>
            <span className="dialog-project-status">
              {project.status === "pilot"
                ? "Working pilot"
                : project.status === "demo"
                  ? "Browser voice demo"
                  : project.status === "live"
                    ? "Live project"
                    : project.status}
            </span>
            <h2 id="build-dialog-title">{project.name}</h2>
            <p className="dialog-tagline">{project.tagline}</p>
            <div
              className="dialog-tabs"
              role="group"
              aria-label="Project story view"
            >
              {["Story", "The build", "Decisions"].map((label) => (
                <button
                  type="button"
                  key={label}
                  aria-pressed={tab === label}
                  onClick={() => setTab(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dialog-tab-content" aria-live="polite">
              {tab === "Story" && (
                <>
                  <h3>The question that started it</h3>
                  <p>{project.userProblem}</p>
                  <h3>What works today</h3>
                  <p>{project.outcome}</p>
                </>
              )}
              {tab === "The build" && (
                <>
                  <h3>Under the hood</h3>
                  <p>{project.whatIBuilt}</p>
                  <ul className="dialog-stack">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </>
              )}
              {tab === "Decisions" &&
                project.decisions.map((decision) => (
                  <div key={decision.id}>
                    <h3>{decision.statement}</h3>
                    <p>{decision.because}</p>
                    <h3>What I’d revisit</h3>
                    <p>{decision.wouldDoDifferently}</p>
                  </div>
                ))}
            </div>
            <div className="dialog-links">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.status === "pilot" ? "Open pilot" : "Open project"}
                  <ArrowUpRight size={16} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitBranch size={16} />
                  Source & docs
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          {touring && (
            <div className="tour-dialog-footer">
              <span>
                QUICK TOUR / {tourIndex + 1} OF {tourIds.length}
              </span>
              <button type="button" onClick={onNext}>
                {tourIndex === tourIds.length - 1
                  ? "Finish the tour"
                  : "Next stop"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
