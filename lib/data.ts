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
    level: "primary" | "production" | "learning" | "exploring" | "listed";
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
    id: "krate",
    number: "001",
    status: "live",
    name: "krate",
    tagline: "A container runtime built from scratch in Go.",
    userProblem: "Docker abstracts everything, but understanding containerization requires diving into Linux primitives. Developers need a clear, minimal implementation of namespaces, cgroups, and overlay FS to understand container runtimes without the bloat.",
    outcome: "Successfully implemented process isolation (UTS/PID/NS/NET), resource limiting (cgroups v2), and copy-on-write filesystem (OverlayFS) with a Web Dashboard running at 60 FPS under a custom Go HTTP daemon.",
    whatIBuilt: "Written in Go, utilizing raw system calls (clone, pivot_root, mount, unshare). Built a CLI with Cobra, a REST API with Gin, and a minimal Web UI dashboard for monitoring container memory and CPU usage in real-time.",
    decisions: [
      {
        id: "krate-go-vs-rust",
        date: "March 2025",
        context: "architecture",
        statement: "Go vs. Rust for container runtime from scratch",
        optionA: { label: "Go", why: "Better compatibility with Kubernetes ecosystems, faster prototyping, and native support for system calls via standard library package `syscall`." },
        optionB: { label: "Rust", why: "Superior safety guarantees and closer mapping to C system interfaces." },
        chose: "A",
        because: "Since standard runtimes like runc are built in Go, using Go allowed me to directly study and implement the same patterns (like the double-fork execution model) while keeping the code accessible to other backend engineers.",
        wouldDoDifferently: "Implement a proper network bridge (veth pairs) rather than just local unshare to allow containers to talk to the host network."
      }
    ],
    stack: ["Go", "Linux Namespaces", "cgroups v2", "OverlayFS", "Cobra", "Gin", "HTML5/JS"],
    links: {
      github: "https://github.com/solmyst/krate",
    },
    featured: true,
  },
  {
    id: "interview-ace",
    number: "002",
    status: "live",
    name: "AI Interview Coach",
    tagline: "Local-first AI for anxiety-free interview prep.",
    userProblem: "Interview prep is either passive (reading) or expensive (mock interviews). Users need a low-pressure way to practice real-time speech and get instant feedback without cloud latency or cost.",
    outcome: "Built a local-first mock interview tool with a complete recording, AI analysis, and critique flow. Chose local inference so personal recordings stay on the user's device.",
    whatIBuilt: "Designed the end-to-end interview practice experience, from recording a response to reviewing AI-generated feedback, with Ollama powering local inference.",
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
    number: "003",
    status: "live",
    name: "AI Resume Tailor",
    tagline: "Tailor a resume to the role, with context.",
    userProblem: "I noticed students spending hours manually tweaking resumes for different job descriptions. Instead of generic keyword stuffing, they needed a smart engine that understands semantic context and maps skills directly to JD requirements automatically.",
    outcome: "Built and launched a platform that improves ATS alignment through automated scoring, job-description-based optimization, and RAG-driven semantic matching.",
    whatIBuilt: "Designed a resume-tailoring workflow that compares a candidate's experience with a job description, scores alignment, and uses retrieval-augmented generation to support relevant edits.",
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
    number: "004",
    status: "live",
    name: "MemeForge AI",
    tagline: "Local-first AI meme generation. Snap, Roast, Repeat.",
    userProblem: "I wanted to build a native-feeling app for generating culturally specific, 'unhinged' memes. The challenge was doing this entirely on-device to ensure maximum privacy without relying on expensive, generic cloud APIs.",
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
    number: "005",
    status: "live",
    name: "F1 Pit Wall Dashboard",
    tagline: "High-performance Electron telemetry widget with CSS3 animations.",
    userProblem: "To create a cinematic, 'Always-on-Top' race tracking experience, standard web apps fall short. The technical goal was to engineer a native desktop widget that delivers real-time telemetry with zero lag and frameless OS integration.",
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
    number: "006",
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
    number: "007",
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
    number: "008",
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
  projects[0].decisions[0], // krate: Go vs Rust
  projects[1].decisions[0], // Interview: local vs cloud
  projects[2].decisions[0], // Resume: Python vs Node
  projects[3].decisions[0], // MemeForge: local vs cloud
  projects[4].decisions[0], // F1: Electron vs Web
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

export const featuredProjectIds = ["interview-ace", "resume-tailor"];

export const experienceIntro = "Four product internships at Park+, with increasing ownership across motor insurance, automotive discovery, and consumer trust.";

export const experiences: Experience[] = [
  {
    id: "park-plus-product",
    role: "Product Intern, Motor Insurance",
    company: "Park+",
    period: "June 2025 - August 2025",
    location: "Gurugram, India",
    description: "Part of the core team that grew Motor Insurance from soft launch to 7× DAU and 12× daily policy sales in eight weeks.",
    achievements: [
      "Joined the Motor Insurance team during the soft-launch phase, conducting 60–80 customer feedback calls daily (1,000+ total interactions) to identify friction points across the insurance purchase journey.",
      "Translated user insights into PRDs, user flows, and wireframes, redesigning key parts of the funnel including vehicle verification, quote discovery, policy comparison, and pricing presentation before the full-scale launch.",
      "Pitched and launched a WhatsApp re-engagement channel, segmenting users based on policy-expiry behavior and delivering 49K+ targeted messages that generated 3K+ app opens (~6% open rate) and reactivated high-intent users.",
      "Part of the core team that scaled the Motor Insurance vertical from 2,000 to 14,000 DAU (7x) and daily policy sales from 5 to 60 (12x) within 8 weeks, while building internal tooling and workflow automations that drove 15+ additional policy conversions per day."
    ],
    tech: ["User Research", "PRDs", "Funnel Optimization", "User Flows", "Re-engagement"]
  },
  {
    id: "park-plus-growth",
    role: "Product Intern, Execution & Growth",
    company: "Park+",
    period: "June 2024 - August 2024",
    location: "Gurugram, India",
    description: "Turned a trust barrier in the test-drive journey into Phonebook, a social-discovery feature built around people users already knew.",
    achievements: [
      "Identified that users lacked confidence in dealers and vehicle recommendations, limiting trust in the test-drive journey.",
      "Proposed and launched Phonebook to surface trusted contacts who owned a car or had taken a test drive through Park+.",
      "Scaled the feature to 4,000+ DAU by syncing and matching 1Cr+ user contacts against the Park+ network.",
      "Built prototypes and collaborated on contact-sync infrastructure and matching logic to enable trust-based discovery."
    ],
    tech: ["Product Discovery", "Prototyping", "Social Discovery", "Feature Rollout"]
  },
  {
    id: "park-plus-discovery",
    role: "Product Intern, Automotive & Discovery",
    company: "Park+",
    period: "January 2024 - March 2024",
    location: "Gurugram, India",
    description: "Improved test-drive booking and helped build the dealer and vehicle review ecosystem with product, design, and engineering teams.",
    achievements: [
      "Analysed friction in test-drive booking and lead management, informing a funnel redesign that grew daily bookings from 50 to 100+ (2×).",
      "Defined user flows and feature specifications for Dealer Review and Test Drive Review, generating 150+ reviews in the first week and scaling to 200+ dealer reviews and 250+ vehicle reviews daily."
    ],
    tech: ["Funnel Analysis", "User Flows", "Feature Specifications", "Stakeholder Management"]
  },
  {
    id: "park-plus-foundations",
    role: "Product Intern, Onboarding & Foundations",
    company: "Park+",
    period: "January 2024 - February 2024",
    location: "Gurugram, India",
    description: "Built a foundation in product management through product discovery, planning, and execution discussions.",
    achievements: [
      "Participated in product discovery, planning, and execution discussions to understand how ideas become features.",
      "Developed technical understanding by collaborating closely with engineering teams during feature development."
    ],
    tech: ["Product Discovery", "Planning", "Engineering Collaboration"]
  }
];

// ─── SKILLS ──────────────────────────────────────────────────────────────────

export const skillGroups: SkillGroup[] = [
  {
    label: "Product",
    mode: "product",
    skills: ["PRDs", "Funnel Optimization", "A/B Thinking", "User Research", "GTM", "Feature Rollout", "Stakeholder Management"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Data",
    mode: "both",
    skills: ["SQL", "Metabase", "Funnel Analysis", "Excel", "Google Sheets"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Design",
    mode: "product",
    skills: ["Figma", "Visily", "Wireframing", "Prototyping", "User Flows"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Languages",
    mode: "engineering",
    skills: ["C++", "Python", "JavaScript", "TypeScript"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Frameworks",
    mode: "engineering",
    skills: ["React", "Next.js", "Node.js", "FastAPI", "Flask"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Tools",
    mode: "both",
    skills: ["Git", "Docker", "GCP", "Firebase", "Vercel", "GitHub Actions", "Jira", "Notion", "Postman", "MoEngage"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Databases",
    mode: "engineering",
    skills: ["PostgreSQL", "SQLite", "Redis", "ChromaDB"].map(name => ({ name, level: "listed" as const })),
  },
  {
    label: "Concepts",
    mode: "engineering",
    skills: ["DSA", "System Design", "LLM Integration", "RAG", "REST APIs", "CI/CD"].map(name => ({ name, level: "listed" as const })),
  },
];

// ─── PROOF BANNER ─────────────────────────────────────────────────────────────

export const proofStats = [
  { value: "4", label: "Product Internships" },
  { value: "7×", label: "Motor Insurance DAU" },
  { value: "12×", label: "Daily Policy Sales" },
  { value: "10+", label: "Projects Built" },
  { value: "500+", label: "DSA Problems Solved" },
];

export const proofAttribution = "Motor Insurance results achieved as part of the Park+ core team: 2K → 14K DAU and 5 → 60 daily policy sales in eight weeks.";

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
  university: "JECRC University (CS, AI & ML — Xebia Specialization)",
  year: "B.Tech CS (AI & ML) — Class of 2027",
  educationPeriod: "August 2023 - April 2027",
  graduating: "2027",
  email: "anushgupta105@gmail.com",
  github: "https://github.com/solmyst",
  leetcode: "https://leetcode.com/anushgupta105/",
  linkedin: "https://linkedin.com/in/anushgupta105",
  twitter: "https://x.com/GuptaAnush105",
  resume: "/Anush-Gupta-Product-Resume.pdf",
  openTo: "product management internships + full-time roles",
  outsideCode: "I’m a guitarist, video editor, gamer, and F1 fan who loves the blend of high-performance engineering and premium design. I enjoy building products and experiences that I’d genuinely want to use every day.",
  certifications: [
    "Google Cloud — RAG; GenAI Apps with Gemini and Streamlit",
    "JPMorgan Chase (Forage) — Software Engineering Job Simulation",
    "Microsoft & LinkedIn — Career Essentials in Software Development"
  ],
  terminalProfile: {
    roles: ["Product Manager", "Full-Stack Builder"],
    status: "Thinks in funnels. Measures outcomes.",
    stack: ["React", "Next.js", "Python", "SQL"],
    learning: ["System Design", "LLM Integration", "RAG"]
  }
};

export const timeline = [
  {
    year: "2025",
    title: "AI products, built end to end",
    description: "Built AI Interview Coach for local-first practice and AI Resume Tailor for ATS alignment, job-description-based optimization, and semantic matching."
  },
  {
    year: "2025",
    title: "Motor Insurance @ Park+",
    description: "Part of the core team that grew DAU from 2,000 to 14,000 and daily policy sales from 5 to 60 in eight weeks. Connected customer research, funnel improvements, and re-engagement."
  },
  {
    year: "2024",
    title: "Discovery, trust & growth @ Park+",
    description: "Helped double daily test-drive bookings, built the review ecosystem with cross-functional teams, and launched Phonebook, scaling it to 4,000+ DAU."
  },
  {
    year: "August 2023 - April 2027",
    title: "B.Tech, CS (AI & ML)",
    description: "JECRC University, Xebia Specialization. Building technical depth in data structures, system design, full-stack development, and AI integration."
  }
];

// ─── NEW CENTRALIZED DATA ───────────────────────────────────────────────────

export const heroData = {
  roles: ["PRODUCT MANAGER", "FULL-STACK BUILDER"],
  tagline: "Thinks in funnels. Builds in code. Measures in outcomes.",
  description: "Four product internships at Park+. Increasing ownership across insurance, automotive discovery, and consumer trust. I connect user research and product decisions with the technical depth to build and ship.",
};

export const dualIdentityData = {
  title: "What I Am",
  subtitle: "Two mindsets. One builder.",
  engineer: {
    title: "Engineer Mode",
    intro: "When I see a problem, I think:",
    bullets: [
      "What's the data model?",
      "Where are the failure points?",
      "What's the O(n) here?",
      "Can this be stateless?",
    ],
    stack: "C++ / Python / TypeScript / React / Next.js / PostgreSQL / Docker",
    learning: "system design, LLM integration, retrieval-augmented generation",
  },
  product: {
    title: "Product Mode",
    intro: "When I see a problem, I think:",
    bullets: [
      "Who is this actually for?",
      "What does success look like in 90 days?",
      "What's the riskiest assumption?",
      "What's the MVP surface area?",
    ],
    tools: "PRDs, funnel optimization, user research, GTM, feature rollout, stakeholder management",
    reading: "Inspired (Cagan), shaped thinking, outcome-based roadmaps",
  },
};

export const dualBrainData = {
  codeLines: [
    { text: "// memeforge — local inference", type: "comment" },
    { text: "import { Ollama } from 'ollama'", type: "import" },
    { text: "", type: "blank" },
    { text: "const generateMeme = async (", type: "code" },
    { text: "  image: File,", type: "code" },
    { text: "  context: string", type: "code" },
    { text: ") => {", type: "code" },
    { text: "  const model = new Ollama()", type: "code" },
    { text: "  // zero api cost. always.", type: "comment" },
    { text: "  return model.vision({", type: "code" },
    { text: "    model: 'llava',", type: "code" },
    { text: "    image, context", type: "code" },
    { text: "  })", type: "code" },
    { text: "}", type: "code" },
  ],
  pmItems: [
    { text: "User problem identified", done: true },
    { text: "Riskiest assumption: GPU availability", done: true },
    { text: "MVP scope locked", done: true },
    { text: "Privacy req: local-only", done: true },
    { text: "Success metric: zero API cost", done: true },
    { text: "Ship. Iterate.", done: false, active: true },
  ],
};

export const loadingScreenData = {
  lines: [
    { delay: 0,    dur: 0,    type: 'spacer' },
    { delay: 100,  dur: 400,  prefix: 'SYS',   cls: 'text-white/20',    text: 'initializing runtime environment...' },
    { delay: 560,  dur: 280,  prefix: 'OK',     cls: 'text-emerald-400',     text: 'product thinking · engineering depth' },
    { delay: 900,  dur: 0,    type: 'spacer' },
    { delay: 950,  dur: 340,  prefix: 'LOAD',   cls: 'text-white/20',    text: 'reading subject profile...' },
    { delay: 1340, dur: 220,  prefix: 'FIELD',  cls: 'text-white/50',    text: `name           anush gupta` },
    { delay: 1600, dur: 220,  prefix: 'FIELD',  cls: 'text-white/50',    text: `alias          sol / solmyst` },
    { delay: 1860, dur: 220,  prefix: 'FIELD',  cls: 'text-white/50',    text: `degree         b.tech cse — graduating 2027` },
    { delay: 2120, dur: 220,  prefix: 'FIELD',  cls: 'text-white/50',    text: 'location       india' },
    { delay: 2380, dur: 0,    type: 'spacer' },
    { delay: 2440, dur: 300,  prefix: 'SCAN',   cls: 'text-white/20',    text: 'detecting active modes...' },
    { delay: 2780, dur: 160,  prefix: 'MODE',   cls: 'text-indigo-400', text: 'engineering    python · next.js · llm integration', tag: 'ENG' },
    { delay: 2980, dur: 160,  prefix: 'MODE',   cls: 'text-cyan-400',     text: 'product        prd writing · user flows · decisions',  tag: 'PM' },
    { delay: 3180, dur: 0,    type: 'spacer' },
    { delay: 3240, dur: 280,  prefix: 'CHECK',  cls: 'text-white/20',    text: 'verifying shipped work...' },
    { delay: 3560, dur: 140,  prefix: 'OK',     cls: 'text-emerald-400',     text: '4 internships  increasing product ownership' },
    { delay: 3740, dur: 140,  prefix: 'OK',     cls: 'text-emerald-400',     text: '10+ projects   built end-to-end' },
    { delay: 3920, dur: 140,  prefix: 'WARN',   cls: 'text-amber-500',   text: 'internship     socket: open — accepting connections' },
    { delay: 4100, dur: 0,    type: 'spacer' },
    { delay: 4180, dur: 320,  prefix: 'BOOT',   cls: 'text-white/80',   text: 'all systems nominal. launching portfolio...' },
  ]
};

export const easterEggData = {
  messages: [
    "$ system.init()",
    `$ loading_profile: solmyst`,
    "$ status: building_the_future",
    "$ diagnostic: checking_core_vitals...",
    "$ ----------------------------------",
    "$ engineering: [####################] 100%",
    "$ product_sense: [##################--] 90%",
    "$ aesthetic: [####################] 100%",
    "$ caffeination: [####################] 100%",
    "$ ----------------------------------",
    "$ recommendation: hire_immediately",
    `$ follow_link: github.com/solmyst`,
    `$ contact_established: anushgupta105@gmail.com`,
    "$ system: mission_accomplished.",
    "$ press ESC to return to reality",
  ]
};

export const footerData = {
  location: "Jaipur, RJ",
  status: "SHINE",
  lighthouseScore: "20.08"
};
