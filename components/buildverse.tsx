"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Flag,
  Map,
  Mail,
  Route,
  Sparkles,
} from "lucide-react";
import { personal, projects } from "@/lib/data";
import { landmarks, tourIds } from "@/lib/buildverse";
import BuildverseMap from "@/components/buildverse-map";
import BuildverseGuide from "@/components/buildverse-guide";
import BuildverseDialog from "@/components/buildverse-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

const storageKey = "anush-buildverse-discoveries";
export default function Buildverse({ children }: { children: ReactNode }) {
  const [visited, setVisited] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved))
        setVisited(
          Array.from(
            new Set(
              saved.filter(
                (id: unknown): id is string =>
                  typeof id === "string" &&
                  projects.some((project) => project.id === id),
              ),
            ),
          ),
        );
    } catch {
      /* Discovery is optional when browser storage is unavailable. */
    }
  }, []);
  function discover(id: string) {
    if (!projects.some((project) => project.id === id)) return;
    setSelected(id);
    setVisited((current) => {
      const next = current.includes(id) ? current : [...current, id];
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* The map still works without storage. */
      }
      return next;
    });
  }
  function selectProject(id: string) {
    setTouring(false);
    discover(id);
  }
  function closeProject() {
    setSelected(null);
    setTouring(false);
  }
  function startTour() {
    setFinished(false);
    setTouring(true);
    discover(tourIds[0]);
  }
  function nextStop() {
    const index = tourIds.indexOf(selected ?? "");
    if (index < tourIds.length - 1) discover(tourIds[index + 1]);
    else {
      closeProject();
      setFinished(true);
    }
  }
  const mapVisited = landmarks.filter((place) =>
    visited.includes(place.id),
  ).length;
  const project = projects.find((item) => item.id === selected) ?? null;
  return (
    <>
      <header className="verse-nav verse-container">
        <a className="verse-logo" href="#hero" aria-label="Anush Gupta home">
          <span>
            a<span className="logo-star">✳</span>
          </span>
          <div>
            ANUSH GUPTA<small>PRODUCT × CODE × CURIOSITY</small>
          </div>
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">The builds</a>
          <a href="#experience">The journey</a>
          <a href="#about">The human</a>
        </nav>
        <div className="verse-nav-actions">
          <ThemeToggle />
          <a
            href={`mailto:${personal.email}`}
            aria-label="Email Anush Gupta"
            className="verse-contact-shortcut"
          >
            <Mail size={16} />
          </a>
          <a
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="verse-resume"
          >
            Resume
            <ArrowUpRight size={15} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section id="hero" className="verse-hero verse-container">
          <div className="verse-hero-copy">
            <p className="verse-label">
              <span className="verse-status-dot" />A PORTFOLIO YOU CAN WANDER
              THROUGH
            </p>
            <h1>
              Ideas don’t
              <br />
              build themselves<span className="verse-asterisk">✳</span>
              <span className="verse-hero-punchline">
                I get my hands dirty.
              </span>
            </h1>
            <p className="verse-intro">
              I’m Anush. Product thinker, full-stack builder, and a collector of{" "}
              <em>“what if?”</em> moments. Welcome to my little corner of the
              internet.
            </p>
            <div className="verse-hero-actions">
              <button
                type="button"
                onClick={startTour}
                className="verse-primary"
              >
                <Route size={17} />
                Take the quick tour
                <ArrowRight size={17} />
              </button>
              <a href="#projects" className="verse-text-link">
                Explore on my own
                <ArrowDown size={15} />
              </a>
            </div>
            <div className="verse-hero-facts">
              <span>4 product internships @ Park+</span>
              <span>Class of ’27</span>
              <span>Always building</span>
            </div>
          </div>
          <BuildverseMap
            onSelect={selectProject}
            visited={visited}
            selected={selected}
          />
        </section>
        <div className="verse-world-footer verse-container">
          <span>
            <Compass size={16} />A small world of things I’ve made.
          </span>
          <a href="#portfolio">
            Just here for the professional story?
            <ArrowDown size={14} />
          </a>
        </div>
        <section
          className="verse-quest verse-container"
          aria-label="Exploration progress"
        >
          <div className="quest-icon">
            <Flag size={21} />
          </div>
          <div className="quest-copy">
            <span className="verse-label">YOUR OPTIONAL SIDE QUEST</span>
            <h2>
              {mapVisited === landmarks.length
                ? "You’ve been around the buildverse."
                : "A little curiosity goes a long way."}
            </h2>
            <p>
              Step inside the five places on the map. Every stop tells a
              different story.
            </p>
          </div>
          <div className="quest-progress">
            <div
              aria-label={`${mapVisited} of ${landmarks.length} places discovered`}
            >
              {landmarks.map((place) => (
                <span
                  key={place.id}
                  className={visited.includes(place.id) ? "found" : ""}
                >
                  {visited.includes(place.id) ? <Check size={12} /> : null}
                </span>
              ))}
            </div>
            <span>{mapVisited} / 5 places discovered</span>
          </div>
        </section>
        {finished && (
          <div className="verse-tour-complete verse-container" role="status">
            <Sparkles size={18} />
            <span>
              Tour complete. Three builds, three different ways of thinking.
              There’s more to explore below.
            </span>
            <button
              type="button"
              onClick={() => setFinished(false)}
              aria-label="Dismiss tour completion message"
            >
              Got it
              <Check size={14} />
            </button>
          </div>
        )}
        <BuildverseGuide onSelect={selectProject} visited={visited} />
        <div className="verse-interlude verse-container">
          <Map size={22} />
          <p>
            Explore the work.
            <br />
            <strong>Then meet the person who made it.</strong>
          </p>
          <a href="#experience">
            The story continues
            <ArrowDown size={16} />
          </a>
        </div>
        {children}
      </main>
      <BuildverseDialog
        project={project}
        onClose={closeProject}
        touring={touring}
        onNext={nextStop}
      />
    </>
  );
}
