import { skillGroups } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

export default function Skills() {
  return (
    <section id="tech" className="portfolio-section">
      <SectionHeading
        eyebrow="04 / Toolkit"
        title="From discovery to delivery."
      >
        The tools I reach for across research, product decisions, design, and
        implementation.
      </SectionHeading>
      <div className="toolkit-grid">
        {skillGroups.map((group) => (
          <div key={group.label} className="toolkit-group">
            <h3 className="text-base font-medium mb-4">{group.label}</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-3">
              {group.skills.map((skill) => (
                <li key={skill.name} className="text-sm text-text-secondary">
                  {skill.name}
                  {skill.note && (
                    <span className="block text-xs text-text-tertiary mt-1">
                      {skill.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-tertiary mt-6">
        Skills listed in my resume. See the projects above for how I put them to
        work.
      </p>
    </section>
  );
}
