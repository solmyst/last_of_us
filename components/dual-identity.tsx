import { dualIdentityData } from "@/lib/data";

/** A compact introduction to the decisions below, rather than a second pitch. */
export default function DualIdentity() {
  const { engineer, product } = dualIdentityData;
  return (
    <div id="thinking" className="thinking-grid">
      {[product, engineer].map((mode, index) => (
        <div key={mode.title} className="thinking-lens">
          <p className="index-label mb-4">
            {index === 0 ? "The product lens" : "The engineering lens"}
          </p>
          <h3 className="text-xl font-medium tracking-tight mb-4">
            {mode.intro}
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
            {mode.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="text-accent" aria-hidden="true">
                  ↗
                </span>
                {bullet}
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-secondary leading-6 mt-5 pt-5 border-t border-border-default">
            {"tools" in mode ? mode.tools : mode.stack}
          </p>
          <p className="text-xs text-text-tertiary leading-6 mt-2">
            {"reading" in mode
              ? `Reading: ${mode.reading}`
              : `Learning: ${mode.learning}`}
          </p>
        </div>
      ))}
    </div>
  );
}
