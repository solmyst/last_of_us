import { ChevronDown, MapPin } from "lucide-react";
import { experiences, experienceIntro } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Experience() {
  return (
    <section id="experience" className="portfolio-section">
      <SectionHeading
        eyebrow="02 / Experience"
        title="Closer to the problem. More ownership."
      >
        {experienceIntro}
      </SectionHeading>
      <div className="experience-list">
        {experiences.map((experience, index) => (
          <article key={experience.id} className="experience-entry">
            <div className="experience-meta">
              <span className="index-label">0{index + 1}</span>
              <p className="text-sm text-text-primary font-medium">
                {experience.company}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {experience.period}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {experience.location}
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-medium tracking-tight">
                {experience.role}
              </h3>
              <p className="text-text-secondary leading-relaxed mt-3 max-w-3xl">
                {experience.description}
              </p>
              <details className="experience-details mt-5" open={index === 0}>
                <summary className="inline-flex items-center gap-3 text-sm cursor-pointer min-h-11">
                  Contributions & outcomes
                  <ChevronDown
                    className="details-chevron w-4 h-4 text-text-tertiary"
                    aria-hidden="true"
                  />
                </summary>
                <ul className="achievement-list">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </details>
              <ul
                className="tag-list mt-5"
                aria-label={`${experience.role} skills`}
              >
                {experience.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
