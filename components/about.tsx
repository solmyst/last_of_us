import { ArrowUpRight } from "lucide-react";
import { currently, timeline, personal } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function About() {
  return (
    <section id="about" className="portfolio-section">
      <SectionHeading
        eyebrow="05 / A little context"
        title="The person behind the products."
      >
        A growing practice in product, a foundation in engineering, and plenty
        of curiosity in between.
      </SectionHeading>
      <div className="about-grid">
        <div className="story-timeline">
          {timeline.map((item) => (
            <article key={`${item.year}-${item.title}`} className="story-entry">
              <p className="index-label mb-3">{item.year}</p>
              <h3 className="text-lg font-medium tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-7">
                {item.description}
              </p>
            </article>
          ))}
        </div>
        <aside className="about-note">
          <p className="eyebrow">Currently / in progress</p>
          <h3 className="text-2xl tracking-tight font-medium mb-7">
            Always a work in progress.
          </h3>
          <dl className="current-list">
            {Object.entries(currently).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="outside-note">
            <h3 className="case-label">Away from the screen</h3>
            <p className="text-sm text-text-secondary leading-7">
              {personal.outsideCode}
            </p>
          </div>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent min-h-11 mt-4"
          >
            Connect on LinkedIn
            <ArrowUpRight className="w-4 h-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </aside>
      </div>
      <div className="certifications">
        <h3 className="case-label">Continued learning</h3>
        <ul className="grid md:grid-cols-3 gap-6">
          {personal.certifications.map((certification) => (
            <li
              key={certification}
              className="text-sm text-text-secondary leading-relaxed"
            >
              {certification}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
