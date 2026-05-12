// lib/data.ts
// All portfolio content lives here. Components just render this data.
// Update here only — never hardcode content in JSX.

export type ProjectStatus = "live" | "shipped" | "wip" | "academic";

export interface Project {
  id: string;
  number: string;
  status: ProjectStatus;
  name: string;
  tagline: string;
  userProblem: string;       // PM voice — what user pain does this solve?
  outcome: string;           // measurable or technical win
  whatIBuilt: string;        // engineer voice — the technical description
  decisions: Decision[];     // the key architectural/product decisions made
  stack: string[];
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  featured?: boolean;
}

export interface Decision {
  id: string;
  date: string;              // e.g. "Jan 2025"
  context: "architecture" | "product" | "build" | "scope";
  statement: string;         // "I chose X over Y"
  optionA: { label: string; why: string };
  optionB: { label: string; why: string };
  chose: "A" | "B";
  because: string;           // honest reasoning including tradeoffs
  wouldDoDifferently: string;
}

export interface SkillGroup {
  label: string;
  mode: "engineering" | "product" | "both";
  skills: Array<{
    name: string;
    level: "primary" | "production" | "learning" | "exploring";
    note?: string;
  }>;
}

// ─── PROJECTS ───────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "memeforge",
    number: "001",
    status: "live",
    name: "MemeForge AI — Meme Bhandar",
    tagline: "Local-first AI meme generation. No cloud. No cost.",
    userProblem:
      "Meme creation tools either require a paid API (OpenAI, Replicate) or send your images to someone else's server. Power users and privacy-conscious people have no good option.",
    outcome:
      "100% local inference via Ollama — zero API cost, works offline, PWA-installable. Image in, meme out in under 2 seconds on a consumer GPU.",
    whatIBuilt:
      "Next.js 14 frontend with React 18, hitting a local Ollama instance running llava/moondream for vision + caption generation. PWA manifest + service worker for installability. No backend server — the user's machine IS the backend.",
    decisions: [
      {
        id: "mf-local-vs-cloud",
        date: "Dec 2024",
        context: "architecture",
        statement: "Local inference (Ollama) vs. OpenAI Vision API",
        optionA: {
          label: "Local — Ollama + llava",
          why: "Zero ongoing cost, privacy by default, works offline, no API rate limits",
        },
        optionB: {
          label: "Cloud — OpenAI Vision API",
          why: "Better model quality, simpler setup, no GPU requirement for users",
        },
        chose: "A",
        because:
          "The target user is a developer or power user who already has a capable machine. For them, setup friction is a one-time cost — zero API cost and privacy are permanent wins. A meme app does not need GPT-4V quality; llava is good enough and the latency is acceptable.",
        wouldDoDifferently:
          "Add a cloud fallback mode for users without a dedicated GPU. The app currently fails silently on CPU-only machines with slow inference.",
      },
      {
        id: "mf-nextjs-vs-spa",
        date: "Dec 2024",
        context: "build",
        statement: "Next.js 14 App Router vs. plain React SPA (Vite)",
        optionA: {
          label: "Next.js 14",
          why: "PWA support, API routes for future server features, SSR potential, ecosystem",
        },
        optionB: {
          label: "Vite + React SPA",
          why: "Simpler, smaller bundle, no server overhead for a local-only app",
        },
        chose: "A",
        because:
          "PWA installability was a core requirement — I wanted users to install this like a native app. Next.js has better PWA tooling via next-pwa. Also, if I add a cloud mode later, the API routes are already there. Overkill for now, but forward-compatible.",
        wouldDoDifferently:
          "Vite + vite-plugin-pwa is actually lighter and would've been fine. Next.js added complexity without delivering much for a zero-server app. Classic over-engineering call.",
      },
    ],
    stack: ["Next.js 14", "React 18", "Ollama", "llava", "moondream", "Tailwind CSS", "PWA", "TypeScript"],
    links: {
      live: "https://",      // FILL IN
      github: "https://",    // FILL IN
      caseStudy: "/work/memeforge",
    },
    featured: true,
  },

  {
    id: "trip-optimizer",
    number: "002",
    status: "shipped",
    name: "Trip Cost + Route Optimizer",
    tagline: "Group trip planning with real cost splitting and multi-stop routing.",
    userProblem:
      "Groups planning trips spend hours manually calculating costs across shared rides, hotels, and food — with no tool that combines routing AND cost splitting in one place.",
    outcome:
      "Spring Boot REST API with graph-based multi-stop routing and per-person cost breakdown. JWT auth, MySQL persistence, handles variable transport modes.",
    whatIBuilt:
      "Java backend with Spring Boot exposing a REST API. Implemented Dijkstra's algorithm adapted for multi-stop routing with weighted cost edges (fuel, tolls, transit fares). Frontend consumption via documented Swagger spec. Deployed on a local server for demo.",
    decisions: [
      {
        id: "trip-routing-algo",
        date: "Oct 2024",
        context: "architecture",
        statement: "Roll a custom routing algorithm vs. integrate Google Maps / OSRM",
        optionA: {
          label: "Custom graph algorithm (Dijkstra variant)",
          why: "Full control over cost model, no API quotas, deep learning value",
        },
        optionB: {
          label: "Google Maps Directions API",
          why: "Production-quality routing, handles real road networks, far less code",
        },
        chose: "A",
        because:
          "For a portfolio project, implementing Dijkstra's and understanding graph data structures is worth more than calling an API. The custom cost model (fuel cost per km × passengers) is also something Google Maps doesn't expose. Real production app? I'd use OSRM.",
        wouldDoDifferently:
          "Build a proper adapter layer so the routing engine is swappable — right now it's tightly coupled to the Spring service layer.",
      },
    ],
    stack: ["Java", "Spring Boot", "MySQL", "JWT", "Dijkstra's Algorithm", "REST API", "Swagger"],
    links: {
      github: "https://",    // FILL IN
    },
  },

];

// ─── STANDALONE DECISIONS LOG ─────────────────────────────────────────────────
// These are the 4 decisions that appear in the main Decisions Log section.
// Pull from project decisions above OR add standalone ones.

export const decisionsLog: Decision[] = [
  projects[0].decisions[0], // MemeForge: local vs cloud
  projects[1].decisions[0], // Route: algorithm choice
  projects[2].decisions[0], // KapdaCraft: supply-first
  projects[0].decisions[1], // MemeForge: Next.js vs Vite
];

// ─── SKILLS ──────────────────────────────────────────────────────────────────

export const skillGroups: SkillGroup[] = [
  {
    label: "Systems & Backend",
    mode: "engineering",
    skills: [
      { name: "Java", level: "primary" },
      { name: "Spring Boot", level: "production", note: "used in 3 projects" },
      { name: "REST API design", level: "production" },
      { name: "MySQL / PostgreSQL", level: "production" },
      { name: "JWT / Auth patterns", level: "production" },
      { name: "Docker", level: "learning" },
    ],
  },
  {
    label: "Frontend & UI",
    mode: "engineering",
    skills: [
      { name: "Next.js 14", level: "production" },
      { name: "React 18", level: "production" },
      { name: "TypeScript", level: "production" },
      { name: "Tailwind CSS", level: "production" },
      { name: "Framer Motion", level: "learning" },
      { name: "PWA", level: "production", note: "shipped one" },
    ],
  },
  {
    label: "Languages",
    mode: "engineering",
    skills: [
      { name: "C++", level: "primary", note: "DSA heavy" },
      { name: "Java", level: "primary" },
      { name: "JavaScript / TS", level: "production" },
      { name: "Go", level: "exploring" },
    ],
  },
  {
    label: "AI / LLM",
    mode: "engineering",
    skills: [
      { name: "Ollama + local inference", level: "production", note: "shipped MemeForge" },
      { name: "LangChain", level: "learning" },
      { name: "Prompt engineering", level: "learning" },
      { name: "LLM application architecture", level: "learning" },
    ],
  },
  {
    label: "Product skills",
    mode: "product",
    skills: [
      { name: "PRD writing", level: "learning" },
      { name: "User story mapping", level: "learning" },
      { name: "North star metrics", level: "learning" },
      { name: "Competitive analysis", level: "learning" },
      { name: "Roadmap prioritization", level: "learning" },
      { name: "Marketplace dynamics", level: "learning", note: "applied in KapdaCraft" },
    ],
  },
  {
    label: "Tools & Process",
    mode: "both",
    skills: [
      { name: "Git / GitHub", level: "primary" },
      { name: "VS Code", level: "primary" },
      { name: "Postman", level: "production" },
      { name: "Figma", level: "learning" },
    ],
  },
];

// ─── PROOF BANNER ─────────────────────────────────────────────────────────────

export const proofStats = [
  { value: "5+", label: "projects shipped" },
  { value: "340+", label: "GitHub commits" },        // UPDATE TO REAL NUMBER
  { value: "620+", label: "DSA problems solved" },   // UPDATE TO REAL NUMBER
  { value: "3rd year", label: "B.Tech CSE, Jaipur" },
  { value: "2027", label: "graduating" },            // UPDATE IF NEEDED
];

// ─── CURRENTLY BLOCK (for About section) ─────────────────────────────────────

export const currently = {
  building: "MemeForge AI v2 — adding cloud fallback mode",
  learning: "System design, LangChain agents, Docker",
  reading: "Inspired by Marty Cagan",
  listening: "lo-fi + whatever's on my Spotify",
};

// ─── PERSONAL ─────────────────────────────────────────────────────────────────

export const personal = {
  name: "Anush Gupta",
  handle: "sol / solmyst",
  university: "JECRC University, Jaipur",
  year: "B.Tech CSE — 3rd year",
  graduating: "2027",                               // UPDATE
  email: "[EMAIL_ADDRESS]",                       // FILL IN
  github: "https://github.com/solmyst",             // FILL IN
  linkedin: "https://linkedin.com/in/anushgupta105",             // FILL IN
  twitter: "https://twitter.com/anushgupta",                  // FILL IN (or remove)
  resume: "https://drive.google.com/file/d/1L_3R8t6P9-T2U5lX7G7Y2V9U2W6T9R8A/view?usp=sharing",                            // wil put google drive link
  openTo: "SDE internship + full-time roles",
};
