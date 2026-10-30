import { ArrowUp } from "lucide-react";
import { personal, footerData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="portfolio-footer">
      <div>
        <a href="#hero" className="font-medium text-text-primary">
          {personal.name}
          <span className="text-accent">.</span>
        </a>
        <span className="text-xs text-text-tertiary">
          {footerData.location} · Product × Engineering
        </span>
      </div>
      <a
        href="#hero"
        className="inline-flex items-center gap-2 text-xs text-text-secondary min-h-11"
      >
        Back to top
        <ArrowUp className="w-4 h-4" aria-hidden="true" />
      </a>
    </footer>
  );
}
