import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { decisionsLog, type Decision } from "@/lib/data";
import SectionHeading from "@/components/section-heading";
import DualIdentity from "@/components/dual-identity";

export default function Decisions() {
  return (
    <section id="decisions" className="portfolio-section">
      <SectionHeading
        eyebrow="03 / How I think"
        title="The decisions behind the work."
      >
        A product lens and an engineering lens. The interesting part is where
        they meet.
      </SectionHeading>
      <DualIdentity />
      <div className="decision-list">
        {decisionsLog.map((decision) => (
          <DecisionEntry key={decision.id} decision={decision} />
        ))}
      </div>
    </section>
  );
}

function DecisionEntry({ decision }: { decision: Decision }) {
  return (
    <details className="decision-entry">
      <summary className="decision-summary">
        <span className="decision-meta">
          <span>{decision.date}</span>
          <span className="decision-context">{decision.context}</span>
        </span>
        <h3 className="text-base md:text-lg font-medium leading-relaxed">
          {decision.statement}
        </h3>
        <ChevronDown
          className="details-chevron w-5 h-5 text-text-tertiary"
          aria-hidden="true"
        />
      </summary>
      <div className="decision-body">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {(["A", "B"] as const).map((option) => {
            const choice = option === "A" ? decision.optionA : decision.optionB;
            const chosen = decision.chose === option;
            return (
              <div
                className={
                  chosen ? "decision-option is-chosen" : "decision-option"
                }
                key={option}
              >
                <p className="flex gap-2 items-center text-xs text-text-secondary mb-3">
                  {chosen ? (
                    <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  )}
                  {chosen ? "Chosen approach" : "Alternative considered"}
                </p>
                <h4 className="font-medium text-sm mb-2">{choice.label}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {choice.why}
                </p>
              </div>
            );
          })}
        </div>
        <h4 className="case-label">The tradeoff</h4>
        <p className="text-sm text-text-secondary leading-7">
          {decision.because}
        </p>
        <div className="decision-next">
          <h4 className="case-label">What I’d revisit</h4>
          <p className="text-sm text-text-secondary leading-7">
            {decision.wouldDoDifferently}
          </p>
        </div>
      </div>
    </details>
  );
}
