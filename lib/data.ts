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
  image?: string;            // path to project mockup/screenshot
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

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
}

// ─── PROJECTS ───────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "interview-ace",
    number: "001",
    status: "live",
    name: "AI Interview Coach",
    tagline: "Local-first AI for anxiety-free interview prep.",
    userProblem: "Interview prep is either passive (reading) or expensive (mock interviews). Users need a low-pressure way to practice real-time speech and get instant feedback without cloud latency or cost.",
    outcome: "Achieved 100% local speech-to-text and AI analysis. Reduced feedback latency to <500ms by processing everything on-device via MediaPipe and Ollama.",
    whatIBuilt: "Built a React + TypeScript frontend integrated with MediaPipe for facial expression analysis and the Web Speech API for transcription. Orchestrated local LLM calls via Ollama to generate context-aware follow-up questions.",
    decisions: [
      {
        id: "ia-local-llm",
        date: "Feb 2025",
        context: "architecture",
        statement: "Local Ollama vs. OpenAI API for analysis",
        optionA: { label: "Local Ollama", why: "Zero cost per session, maximum privacy for user data." },
        optionB: { label: "OpenAI GPT-4o", why: "Higher quality reasoning and better instruction following." },
        chose: "A",
        because: "Privacy is paramount for interview prep. Users are more honest when they know their practice sessions aren't being sent to a cloud server. Local Llama-3.1-8B is fast enough for real-time coaching.",
        wouldDoDifferently: "Optimize the MediaPipe initialization as it currently blocks the main thread for ~1.2s on startup."
      }
    ],
    stack: ["React", "TypeScript", "Ollama", "MediaPipe", "Web Speech API", "Tailwind CSS"],
    image: "/projects/Interview-practice.png",
    links: {
      github: "https://github.com/solmyst/AI-Powered-Interview-Coaching",
      live: "https://solmyst.github.io/AI-Powered-Interview-Coaching/",
    },
    featured: true,
  },
  {
    id: "resume-tailor",
    number: "002",
    status: "live",
    name: "AI Resume Tailor",
    tagline: "Beat the ATS with AI-optimized resumes.",
    userProblem: "Generic resumes fail ATS filters. Manually tailoring resumes for every job application is slow and error-prone for students and job seekers.",
    outcome: "Built a pipeline that generates fully tailored resumes in <15 seconds. Implemented a robust parsing engine that extracts skills and maps them to JD requirements with high accuracy.",
    whatIBuilt: "Developed a Python Flask backend utilizing spaCy and BERT for semantic matching. Built a React 18 frontend with a smooth drag-and-drop upload interface and real-time tailoring progress tracking.",
    decisions: [
      {
        id: "rt-backend-choice",
        date: "Jan 2025",
        context: "build",
        statement: "Python/Flask vs. Node.js for the tailoring engine",
        optionA: { label: "Python/Flask", why: "Rich NLP ecosystem (spaCy, Transformers) and easy model integration." },
        optionB: { label: "Node.js", why: "Consistent stack with the frontend, faster for I/O bound tasks." },
        chose: "A",
        because: "The core value of this app is NLP accuracy. Python's mature libraries for PDF parsing and semantic analysis saved months of dev time compared to building equivalent logic in Node.",
        wouldDoDifferently: "Use a task queue like Celery for the tailoring process to avoid blocking the API worker during heavy AI inference."
      }
    ],
    stack: ["React 18", "Python Flask", "spaCy", "Tailwind CSS", "OpenAI GPT", "TypeScript"],
    image: "/projects/AI-resume-tailor.png",
    links: {
      github: "https://github.com/solmyst/ai-resume-tailor",
      live: "https://solmyst.github.io/ai-resume-tailor/",
    },
    featured: true,
  },
  {
    id: "memeforge",
    number: "003",
    status: "live",
    name: "MemeForge AI",
    tagline: "Local-first AI meme generation. Snap, Roast, Repeat.",
    userProblem: "Meme creation tools are often generic or require cloud APIs. Users want to roast their own photos with culturally specific humor without sending data to servers.",
    outcome: "100% local inference via Ollama. Features multiple humor personalities including 'GenZ Brainrot' and 'Desi Roast'. Works offline and is PWA-ready.",
    whatIBuilt: "Next.js 14 app hitting local Ollama (Llava/Moondream) for vision-to-caption. Custom HTML5 Canvas engine for baking captions onto images. PWA manifest for native-like installation.",
    decisions: [
      {
        id: "mf-local-vs-cloud",
        date: "Dec 2024",
        context: "architecture",
        statement: "Ollama vs. OpenAI Vision",
        optionA: { label: "Local Ollama", why: "Zero cost, private, works offline." },
        optionB: { label: "OpenAI API", why: "Better accuracy, no local GPU requirement." },
        chose: "A",
        because: "The 'Privacy and Performance' trade-off favored local. For a meme app, the fun is in the speed and 'unhinged' local model outputs.",
        wouldDoDifferently: "Implement a WebGL-based image editor for more complex filters before captioning."
      }
    ],
    stack: ["Next.js 14", "Ollama", "PWA", "TypeScript", "Tailwind CSS", "Canvas API"],
    image: "/projects/memeforge.png",
    links: {
      github: "https://github.com/solmyst/MemeForge-AI",
      live: "https://solmyst.github.io/MemeForge-AI/",
    },
    featured: true,
  },
  {
    id: "f1-dashboard",
    number: "004",
    status: "live",
    name: "F1 Pit Wall Dashboard",
    tagline: "Immersive race tracking for the ultimate fan.",
    userProblem: "F1 fans want a cinematic way to track race weekends that goes beyond simple text tables, needing something that feels like a real team telemetry wall.",
    outcome: "Engineered a unique 'Morphing Window' that shrinks from a full dashboard to a compact desktop widget. Implemented dynamic team-based theming for all 11 F1 teams.",
    whatIBuilt: "Native desktop app via Electron. Built a high-fidelity UI with vanilla JS and CSS keyframe animations for that 'racing feel'. Integrated a live race simulation and team radio ticker.",
    decisions: [
      {
        id: "f1-electron-vs-web",
        date: "Nov 2024",
        context: "architecture",
        statement: "Electron vs. Standard Web App",
        optionA: { label: "Electron Native", why: "Allows 'Always-on-Top' widgets and frameless windows." },
        optionB: { label: "Web PWA", why: "Better cross-platform compatibility, no install needed." },
        chose: "A",
        because: "The 'Pit Wall' widget mode required native OS features like frameless windows and being able to stay on top of other apps while the user works.",
        wouldDoDifferently: "Use a lighter framework like Tauri to reduce the bundle size from 80MB to <10MB."
      }
    ],
    stack: ["Electron", "Vanilla JS", "CSS3 Animations", "PWA", "Node.js"],
    image: "/projects/F1.png",
    links: {
      github: "https://github.com/solmyst/f1-dashboard",
      live: "https://solmyst.github.io/f1-dashboard/",
    },
    featured: false,
  },
  {
    id: "trip-helper",
    number: "005",
    status: "shipped",
    name: "Trip Helper (Indian Roads)",
    tagline: "Road trip planning with accurate toll and fuel estimates.",
    userProblem: "Indian highway travelers struggle with unpredictable toll costs and fuel estimation. Generic maps don't provide a granular expense breakdown for specific car models.",
    outcome: "Built an end-to-end trip planner that estimates tolls, fuel, and even food expenses. Integrated standard Indian emergency services and highway helplines.",
    whatIBuilt: "Flutter mobile app with a Spring Boot (Java) backend. Implemented a Haversine-based distance calculation and a custom toll plaza matching algorithm. Persistent user data via MySQL.",
    decisions: [
      {
        id: "th-spring-boot",
        date: "Oct 2024",
        context: "architecture",
        statement: "Spring Boot vs. Firebase for Backend",
        optionA: { label: "Spring Boot + MySQL", why: "Relational data for complex trip models, total control over logic." },
        optionB: { label: "Firebase", why: "Real-time updates, no server management, faster prototyping." },
        chose: "A",
        because: "I wanted to master the enterprise Java stack. The structured nature of trip data (users, cars, tolls, segments) fit perfectly with a relational database and Spring's robust API patterns.",
        wouldDoDifferently: "Integrate a real-time toll API (like FASTag data) instead of relying on a hardcoded plaza database."
      }
    ],
    stack: ["Flutter", "Dart", "Spring Boot", "MySQL", "Java", "Provider"],
    image: "/projects/trip-optimizer.png",
    links: {
      github: "https://github.com/solmyst/Trip_Helper",
    },
    featured: false,
  },
  {
    id: "sand-art",
    number: "006",
    status: "live",
    name: "Interactive Sand Simulator",
    tagline: "Physics-based particle art in your browser.",
    userProblem: "Most browser experiments lack realistic physics. I wanted to create a zen-like experience that correctly simulates gravity, friction, and particle collision.",
    outcome: "Fluid 60FPS simulation of thousands of sand particles. Implemented Rainbow and Mirror modes for symmetrical art creation.",
    whatIBuilt: "Built with p5.js using a grid-based particle system. Optimized for performance by only calculating physics for 'active' particles. Responsive canvas that adapts to screen size.",
    decisions: [
      {
        id: "sa-p5js",
        date: "Aug 2024",
        context: "build",
        statement: "p5.js vs. Vanilla Canvas API",
        optionA: { label: "p5.js", why: "Excellent abstractions for particle math and easy input handling." },
        optionB: { label: "Vanilla Canvas", why: "Absolute maximum performance, zero dependency weight." },
        chose: "A",
        because: "p5.js allowed me to focus on the 'fun' (the physics algorithms) rather than the boilerplate of canvas management. The overhead was negligible for this scale.",
        wouldDoDifferently: "Move the physics calculations to a Web Worker to keep the UI perfectly smooth regardless of particle count."
      }
    ],
    stack: ["JavaScript", "p5.js", "HTML5 Canvas", "CSS3"],
    image: "/projects/sand-art.png",
    links: {
      github: "https://github.com/solmyst/Sand-falling-project",
      live: "https://solmyst.github.io/Sand-falling-project/",
    },
    featured: false,
  },
  {
    id: "ascii-camera",
    number: "007",
    status: "live",
    name: "ASCII Video Filter",
    tagline: "The world through a developer's eyes.",
    userProblem: "Boring video feeds. I wanted to turn reality into code in real-time.",
    outcome: "Zero-latency ASCII transformation of live video. Correctly maps pixel luminosity to character density.",
    whatIBuilt: "TypeScript implementation using a hidden canvas for pixel sampling. Optimized character lookup using a pre-calculated density string. Fully responsive camera interface.",
    decisions: [
      {
        id: "ac-ts-choice",
        date: "July 2024",
        context: "build",
        statement: "TypeScript vs. JavaScript",
        optionA: { label: "TypeScript", why: "Type safety for complex pixel buffer manipulations." },
        optionB: { label: "JavaScript", why: "Zero build step, faster 'edit-and-refresh' cycle." },
        chose: "A",
        because: "Pixel manipulation code is notoriously buggy. Having types for the `Uint8ClampedArray` and canvas contexts saved countless hours of debugging 'undefined' values in the render loop.",
        wouldDoDifferently: "Use WebGL shaders to perform the ASCII mapping on the GPU for even higher resolution support."
      }
    ],
    stack: ["TypeScript", "Canvas API", "Webcam API", "CSS Grid"],
    image: "/projects/ASCII.png",
    links: {
      github: "https://github.com/solmyst/ascii-camera",
      live: "https://solmyst.github.io/ascii-camera/",
    },
    featured: false,
  },
];

// ─── STANDALONE DECISIONS LOG ─────────────────────────────────────────────────

export const decisionsLog: Decision[] = [
  projects[0].decisions[0], // Interview: local vs cloud
  projects[1].decisions[0], // Resume: Python vs Node
  projects[2].decisions[0], // MemeForge: local vs cloud
  projects[3].decisions[0], // F1: Electron vs Web
  {
    id: "global-state-management",
    date: "Feb 2025",
    context: "architecture",
    statement: "Context API vs. Zustand for Global State",
    optionA: { label: "React Context API", why: "No extra dependencies, built-in to React core." },
    optionB: { label: "Zustand", why: "Minimal boilerplate, optimized re-renders out of the box." },
    chose: "B",
    because: "For complex apps like the AI Interview Coach, managing state transitions (listening, processing, speaking) with Context led to unnecessary re-renders of the entire UI. Zustand's selector-based approach kept the 60FPS requirement intact.",
    wouldDoDifferently: "Use a more structured state machine (like XState) for the interview flow to handle edge cases in voice interruption better."
  },
  {
    id: "ui-styling-strategy",
    date: "Jan 2025",
    context: "build",
    statement: "Tailwind CSS vs. Styled Components",
    optionA: { label: "Tailwind CSS", why: "Rapid prototyping, zero runtime overhead, consistent design tokens." },
    optionB: { label: "Styled Components", why: "True CSS-in-JS, better for component-specific logic." },
    chose: "A",
    because: "Iterative design is key for my projects. Tailwind allowed me to tweak high-fidelity Bento layouts in real-time without context-switching to CSS files. The production bundle size wins were also significant.",
    wouldDoDifferently: "Establish a more rigid set of design tokens earlier to avoid 'utility bloat' in the JSX."
  }
];

export const experiences: Experience[] = [
  {
    id: "park-plus-product",
    role: "Product Intern",
    company: "Park+",
    period: "June 2025 - August 2025",
    location: "Gurugram, India",
    description: "Scaled Motor Insurance product from early stage to rapid expansion, driving significant user growth and engagement through data-driven product optimization.",
    achievements: [
      "Achieved 180% user growth in 8 weeks by scaling Motor Insurance from early stage to rapid expansion",
      "Increased DAUs by enhancing UI/UX and driving engagement through WhatsApp-based user journeys",
      "Improved conversion funnel (Quotes → Proposals → Purchase), significantly boosting purchase rates",
      "Designed a sales dashboard and integrated new product features to enhance scalability and operational efficiency"
    ],
    tech: ["Product Strategy", "Growth Hacking", "WhatsApp API", "Data Analytics", "Sales Dashboards"]
  }
];

// ─── SKILLS ──────────────────────────────────────────────────────────────────

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    mode: "engineering",
    skills: [
      { name: "C / C++", level: "primary", note: "DSA + competitive programming" },
      { name: "Java", level: "production", note: "Spring Boot ecosystem" },
      { name: "Python", level: "production", note: "NLP + Flask backends" },
      { name: "Go", level: "production", note: "High-concurrency systems" },
      { name: "TypeScript / JS", level: "production", note: "Fullstack core" },
      { name: "Dart", level: "production", note: "Flutter mobile" },
    ],
  },
  {
    label: "Backend & Systems",
    mode: "engineering",
    skills: [
      { name: "Spring Boot", level: "production" },
      { name: "Flask", level: "production" },
      { name: "Gin (Golang)", level: "production" },
      { name: "PostgreSQL / MySQL", level: "production" },
      { name: "JWT / OAuth2", level: "production" },
      { name: "Docker", level: "production" },
      { name: "REST API Design", level: "primary" },
    ],
  },
  {
    label: "Frontend & Mobile",
    mode: "engineering",
    skills: [
      { name: "Next.js 14/15", level: "production" },
      { name: "React 18/19", level: "production" },
      { name: "Flutter", level: "production" },
      { name: "Tailwind CSS", level: "production" },
      { name: "Framer Motion", level: "production" },
      { name: "PWA", level: "production" },
      { name: "Electron", level: "production" },
    ],
  },
  {
    label: "AI / ML Integration",
    mode: "engineering",
    skills: [
      { name: "Ollama (Local LLMs)", level: "primary" },
      { name: "MediaPipe", level: "production" },
      { name: "spaCy / BERT", level: "production" },
      { name: "Prompt Engineering", level: "primary" },
      { name: "OpenAI API", level: "production" },
    ],
  },
  {
    label: "Product & Process",
    mode: "product",
    skills: [
      { name: "Product Strategy", level: "primary" },
      { name: "User Research", level: "production" },
      { name: "Growth Hacking", level: "primary" },
      { name: "Funnel Optimization", level: "production" },
      { name: "Go-to-Market Planning", level: "production" },
      { name: "Technical PRDs", level: "production" },
      { name: "Marketplace Dynamics", level: "production" },
      { name: "User Journey Mapping", level: "production" },
      { name: "System Architecture", level: "production" },
    ],
  },
];

// ─── PROOF BANNER ─────────────────────────────────────────────────────────────

export const proofStats = [
  { value: "7+", label: "Projects" },
  { value: "500+", label: "Commits" },
  { value: "500+", label: "DSA Problems Solved" },
  { value: "JECRC University", label: "B.Tech CSE (AI-ML XEBIA)" },
  { value: "2027", label: "Graduating" },
];

// ─── CURRENTLY BLOCK ─────────────────────────────────────────────────────────

export const currently = {
  building: "This Portfolio — focusing on Bento aesthetics and performance",
  learning: "System design at scale, Advanced Go patterns, LLM Agents",
  reading: "Inspired by Marty Cagan and Clean Architecture",
  listening: "Lofi Beats for deep work",
};

// ─── PERSONAL ─────────────────────────────────────────────────────────────────

export const personal = {
  name: "Anush Gupta",
  handle: "sol / solmyst",
  university: "JECRC University (AI-ML XEBIA)",
  year: "B.Tech CSE — 2nd year",
  graduating: "2027",
  email: "anushgupta105@gmail.com",
  github: "https://github.com/solmyst",
  linkedin: "https://linkedin.com/in/anushgupta105",
  twitter: "https://twitter.com/@GuptaAnush105",
  resume: "https://drive.google.com/file/d/18zozP6xXi940m8i99zVl4RNjaY051mlD/view?usp=drive_link",
  openTo: "internships + full-time roles",
  outsideCode: "I’m a guitarist, video editor, gamer, and F1 fan who loves the blend of high-performance engineering and premium design. I enjoy building products and experiences that I’d genuinely want to use every day.",
  certifications: [
    "Gen AI Academy (Google)",
    "Gemini & Imagen (Google)",
    "GenAI Apps - Gemini & Streamlit",
    "Gemini API in Vertex AI",
    "Career Essentials - Microsoft & LinkedIn",
    "Business Leaders - LinkedIn",
    "Gemini Multimodality & RAG"
  ]
};

export const timeline = [
  {
    year: "2026",
    title: "AI + Product",
    description: "learning new things : LLM Agents , System Design , AI + Product"
  },
  {
    year: "2025",
    title: "Product Intern @ Park+",
    description: "Achieved 180% user growth by scaling Motor Insurance and optimizing conversion funnels."
  },
  {
    year: "2024",
    title: "Hackathon Runner-up",
    description: "Secured 2nd position among 200+ teams; 2nd prize for startup pitch at XEBIA conclave."
  },
  {
    year: "2023",
    title: "B.Tech CSE (AI-ML)",
    description: "Started journey at JECRC University."
  }
];
