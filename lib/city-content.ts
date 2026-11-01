import {
  projects,
  experiences,
  skillGroups,
  decisionsLog,
  personal,
  timeline,
  currently,
  heroData,
} from "@/lib/data";
import { cityBuildings, type CityBuilding } from "@/lib/city-layout";
export type FloorContent = {
  title: string;
  subtitle: string;
  sections: { heading: string; text?: string; bullets?: string[] }[];
  links: { label: string; href: string }[];
};
export function floorContent(
  building: CityBuilding,
  floor: number,
): FloorContent {
  const level = Math.max(0, Math.min(building.floors.length - 1, floor));
  const result: FloorContent = {
    title: building.floors[level],
    subtitle: building.name,
    sections: [],
    links: [],
  };
  if (building.kind === "project") {
    const project = projects.find((item) => item.id === building.id);
    if (!project) return result;
    result.subtitle = project.tagline;
    if (level === 0)
      result.sections = [
        { heading: "The problem", text: project.userProblem },
        { heading: "What works today", text: project.outcome },
      ];
    else if (level === 1)
      result.sections = [
        { heading: "What I built", text: project.whatIBuilt },
        { heading: "Technology stack", bullets: project.stack },
      ];
    else
      result.sections = project.decisions.flatMap((decision) => [
        { heading: decision.statement, text: decision.because },
        {
          heading: "Chosen approach",
          text:
            decision.chose === "A"
              ? `${decision.optionA.label}: ${decision.optionA.why}`
              : `${decision.optionB.label}: ${decision.optionB.why}`,
        },
        { heading: "What I’d revisit", text: decision.wouldDoDifferently },
      ]);
    if (project.links.live)
      result.links.push({
        label: project.status === "pilot" ? "Open pilot" : "Open project",
        href: project.links.live,
      });
    if (project.links.github)
      result.links.push({
        label: "Source & documentation",
        href: project.links.github,
      });
  } else if (building.kind === "experience") {
    const experience = experiences[level];
    result.title = experience.role;
    result.subtitle = `${experience.company} · ${experience.period} · ${experience.location}`;
    result.sections = [
      { heading: "The work", text: experience.description },
      { heading: "Contributions & outcomes", bullets: experience.achievements },
      { heading: "Skills in practice", bullets: experience.tech },
    ];
  } else if (building.kind === "skills") {
    const group = skillGroups[level];
    result.title = group.label;
    result.subtitle = "The toolkit / from discovery to implementation";
    result.sections = [
      {
        heading: "Tools & skills",
        bullets: group.skills.map((skill) =>
          skill.note ? `${skill.name} — ${skill.note}` : skill.name,
        ),
      },
      {
        heading: "In context",
        text: "The project buildings show how I use these tools. Explore a project’s engineering floor for its actual stack and architecture.",
      },
    ];
  } else if (building.kind === "about") {
    if (level === 0) {
      result.title = personal.name;
      result.subtitle = "Product thinker × full-stack builder";
      result.sections = [
        { heading: "The short version", text: heroData.description },
        {
          heading: "Education",
          text: `${personal.university}. ${personal.year}. ${personal.educationPeriod}.`,
        },
        { heading: "Looking for", text: personal.openTo },
      ];
    } else if (level === 1)
      result.sections = timeline.map((item) => ({
        heading: `${item.year} / ${item.title}`,
        text: item.description,
      }));
    else
      result.sections = [
        { heading: "Away from the screen", text: personal.outsideCode },
        {
          heading: "Currently",
          bullets: Object.entries(currently).map(
            ([key, value]) => `${key}: ${value}`,
          ),
        },
        { heading: "Continued learning", bullets: personal.certifications },
      ];
  } else if (building.kind === "decisions") {
    const decision = decisionsLog[level];
    result.title = decision.statement;
    result.subtitle = `${decision.date} / ${decision.context}`;
    result.sections = [
      {
        heading: "Option A",
        text: `${decision.optionA.label}: ${decision.optionA.why}`,
      },
      {
        heading: "Option B",
        text: `${decision.optionB.label}: ${decision.optionB.why}`,
      },
      {
        heading: `Chosen: ${decision.chose === "A" ? decision.optionA.label : decision.optionB.label}`,
        text: decision.because,
      },
      { heading: "What I’d revisit", text: decision.wouldDoDifferently },
    ];
  } else {
    result.title = "Let’s build something useful.";
    result.subtitle = personal.openTo;
    result.sections = [
      {
        heading: "Start a conversation",
        text: `If you need someone who can connect the user problem, the product decision, and the implementation, let’s talk. ${personal.email}`,
      },
      {
        heading: "Elsewhere",
        bullets: [personal.github, personal.linkedin, personal.leetcode],
      },
    ];
  }
  if (building.kind !== "project")
    result.links = [
      { label: "Email Anush", href: `mailto:${personal.email}` },
      { label: "LinkedIn", href: personal.linkedin },
      { label: "Resume", href: personal.resume },
    ];
  return result;
}
export const cityProjectCount = cityBuildings.filter(
  (building) => building.kind === "project",
).length;
