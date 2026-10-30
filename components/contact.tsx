import { ArrowUpRight, Mail } from "lucide-react";
import { personal } from "@/lib/data";

const socialLinks = [
  { label: "LinkedIn", href: personal.linkedin },
  { label: "GitHub", href: personal.github },
  { label: "LeetCode", href: personal.leetcode },
  { label: "X / Twitter", href: personal.twitter },
];

export default function Contact() {
  return (
    <section id="contact" className="portfolio-section">
      <div className="contact-panel">
        <div>
          <p className="eyebrow">06 / What’s next?</p>
          <h2 className="contact-title">
            A useful problem.
            <br />
            <em>A good place to start.</em>
          </h2>
          <p className="max-w-lg text-text-secondary leading-7 mt-6">
            If you need someone who can connect the user problem, the product
            decision, and the implementation — let’s talk.
          </p>
          <p className="text-sm text-text-secondary mt-5">
            Open to {personal.openTo}.
          </p>
        </div>
        <div className="contact-actions">
          <a href={`mailto:${personal.email}`} className="contact-email">
            <Mail className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{personal.email}</span>
            <ArrowUpRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </a>
          <div className="contact-socials">
            {socialLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
          <a
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-action mt-5"
          >
            View resume
            <ArrowUpRight className="w-4 h-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
