# Portfolio Website — Implementation Specification
## For: Anush Gupta (sol / solmyst) — Full Stack Engineer + Product Manager
## Builder note: This file is the complete source of truth. Read every section before writing a single line of code.

---

## 0. The Core Idea (Don't Lose This)

This portfolio must answer one question a senior engineer asks in the first 10 seconds:

> "Does this person understand the *whole system* — user problem → product decision → architecture → shipping?"

Most dev portfolios show code. Most PM portfolios show decks. This one shows **both thinking modes in one person** — and that is rare enough to be a hire signal.

The visual metaphor: **a technical spec document that is also beautiful**. Think Linear's website crossed with a Notion engineering blog. Serious. Dense with signal. Zero fluff.

---

## 1. Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS custom properties for theme tokens
- **Animations**: Framer Motion for page transitions, scroll reveals, and micro-interactions
- **Icons**: Lucide React (consistent, minimal)
- **Fonts**:
  - Display/headings: `Fragment Mono` (Google Fonts) — technical, editorial, unexpected
  - Body: `Inter` (only acceptable here because it reads at small sizes — used ONLY for body paragraphs)
  - Code blocks: `JetBrains Mono`
- **Deployment**: Vercel (mention this — it signals you actually ship)
- **No UI component library** — everything hand-coded. This IS the portfolio.

---

## 2. Color System

```css
:root {
  /* Background layers — dark theme only, no toggle */
  --bg-base: #080810;       /* deepest — page background */
  --bg-surface: #0e0e1a;    /* cards, panels */
  --bg-elevated: #14141f;   /* hover states, code blocks */
  --bg-overlay: #1c1c2e;    /* modals, tooltips */

  /* Borders */
  --border-subtle: rgba(255,255,255,0.05);
  --border-default: rgba(255,255,255,0.09);
  --border-strong: rgba(255,255,255,0.16);

  /* Text */
  --text-primary: #f0f0f8;
  --text-secondary: #8888a8;
  --text-tertiary: #44445a;

  /* Accent — ONE accent color, used sparingly */
  --accent: #6c63ff;        /* electric indigo */
  --accent-dim: rgba(108,99,255,0.12);
  --accent-border: rgba(108,99,255,0.3);

  /* Semantic */
  --green: #3ecf8e;
  --amber: #f59e0b;
  --red: #f43f5e;

  /* PM mode accent (used in PM-specific sections) */
  --pm-accent: #06b6d4;     /* cyan — distinct from engineering purple */
  --pm-dim: rgba(6,182,212,0.1);
}
```

**Rule**: `--accent` (indigo) = engineering/code context. `--pm-accent` (cyan) = product/user context. This color language teaches the reader which mode they're in without labels.

---

## 3. Page Structure & Sections

### 3.1 Navigation

Fixed top nav. Ultra-minimal.

```
[sol.dev]                    [work] [thinking] [decisions] [contact]   [→ resume]
```

- Logo: `sol.dev` in Fragment Mono, no styling tricks
- Links: 13px, `--text-secondary`, uppercase letter-spacing
- `→ resume` : only interactive element — outline button, `--accent` border
- On mobile: hamburger → full-screen overlay nav
- Scroll behavior: nav gets `backdrop-filter: blur(12px)` + subtle bottom border after 80px scroll
- Active section highlighted via IntersectionObserver

### 3.2 Hero

**Not** a standard "Hi I'm X, I do Y" section. This one opens like a technical brief.

**Layout**: Full viewport height, two columns on desktop (60/40 split), single column on mobile.

**Left column content:**

```
[small tag: FULL STACK ENGINEER × PRODUCT MANAGER]

Anush Gupta
builds systems.
ships products.

[two-line bio — max 280 chars]
I think in user flows and implement in Spring Boot.
Currently at JECRC University — looking for where
both skill sets create maximum leverage.

[CTA row]
[→ see my work]  [↗ github]  [↗ linkedin]
```

**Right column — the "dual brain" visual:**

A split terminal/PRD card. Left half looks like a code editor (dark, monospace, shows a real git diff or architecture snippet). Right half looks like a product spec (clean, has "User Problem:", "Success Metric:", "Decision:"). They're separated by a glowing vertical line. This single element communicates the dual identity better than any text can.

On mobile, the dual card stacks vertically, code editor on top.

**Hero animations (Framer Motion):**
- Name fades up with 0.3s delay
- Each line of bio fades up with 0.1s stagger
- The dual card slides in from right with 0.5s delay
- A subtle grid of dots in the background (CSS only, `radial-gradient` technique)

### 3.3 "What I Am" — The Dual Identity Explainer

This is the section that doesn't exist on normal portfolios and will make people stop.

**Layout**: Two cards side by side (stack on mobile), centered, max-width 860px.

**Card 1 — Engineer card** (left, `--accent` color theme):
```
⬡  ENGINEER MODE

When I see a problem, I think:
→ What's the data model?
→ Where are the failure points?
→ What's the O(n) here?
→ Can this be stateless?

Stack: Java / Spring Boot / Next.js /
       Go / PostgreSQL / Docker / LLMs

Currently learning: system design at scale,
distributed systems, LangChain agents
```

**Card 2 — PM card** (right, `--pm-accent` cyan theme):
```
◈  PRODUCT MODE

When I see a problem, I think:
→ Who is this actually for?
→ What does success look like in 90 days?
→ What's the riskiest assumption?
→ What's the MVP surface area?

Tools: user story mapping, PRD writing,
       north star metrics, A/B framing

Currently reading: Inspired (Cagan),
shaped thinking, outcome-based roadmaps
```

**Between the cards**: A small connector element — an SVG arrow pointing both ways with label "one person" in `--text-tertiary`.

### 3.4 Projects — Case Study Format

This is the heaviest section. **Not a grid of cards**. More like a curated list of case studies with expandable detail.

**Section header:**
```
SHIPPED WORK
4 projects that went from idea → live
```

**Each project entry structure** (alternating layout — image/visual left then right):

```
[PROJECT NUMBER]  [STATUS BADGE: LIVE / WIP / SHIPPED]

PROJECT NAME
─────────────────────────────────────

THE PROBLEM          THE OUTCOME
[user problem        [measurable result
 in PM language]      or technical win]

WHAT I BUILT         DECISIONS I MADE
[technical           [1-2 explicit
 description]         architecture/product
                      decisions with why]

[TECH STACK PILLS]

[→ case study]  [→ github]  [↗ live]
```

**The "DECISIONS I MADE" column is the secret weapon**. This is what senior engineers actually want to read. Example for MemeForge:
> "Chose local-first (Ollama) over API-based (OpenAI) because: zero ongoing cost for users, no data privacy concern, works offline. Tradeoff: higher setup friction. Decided setup friction was acceptable for target users (devs)."

That one paragraph shows more engineering + product judgment than any skill bar ever could.

**Projects to include (in this order):**

1. **MemeForge AI** — featured, full case study treatment
   - Problem: "Meme creation tools require internet + paid APIs"
   - Outcome: "100% local inference, zero API cost, PWA installable"
   - Decision: "Ollama over OpenAI — why"
   - Stack: Next.js 14, React 18, Ollama, llava/moondream, Tailwind, PWA

2. **Trip Cost + Route Optimizer**
   - Problem: "No lightweight tool for group trip cost splitting + route planning"
   - Outcome: "Spring Boot API serving multi-stop routing with cost breakdown"
   - Decision: "Graph-based routing vs. third-party Maps API — why I rolled my own"
   - Stack: Spring Boot, Java, MySQL, REST, JWT

3. **KapdaCraft — Custom Clothing Platform**
   - Problem: "Local tailors have no digital presence or order system"
   - Outcome: "Full platform from DB schema → vendor dashboard → customer UI"
   - Decision: "Why I chose this as a product concept — TAM thinking"
   - Stack: Next.js, Spring Boot, PostgreSQL, Tailwind

4. **Medical Reminder App** (academic, team project)
   - Add team size, your specific role (PM lead? backend? both?)
   - Problem: "Medication non-adherence in elderly patients"
   - Stack: React Native, Node.js, MongoDB

5. **Sudoku Web App** (small but shows CS fundamentals)
   - Mention the backtracking algorithm explicitly — this is a CS signal
   - "Zero dependencies" — say this loud, it's a flex

### 3.5 "How I Think" — The Decisions Log

This section does not exist on any junior portfolio. It will make senior engineers lean forward.

**Concept**: A mini blog / log of 3–4 engineering/product decisions you've made, explained clearly.

**Section header:**
```
DECISIONS LOG
Technical and product decisions — with reasoning.
No right answers, just honest tradeoffs.
```

**Each entry** (simple expandable/accordion):

Entry format:
```
[DATE]  [CONTEXT TAG: ARCHITECTURE / PRODUCT / BUILD]

Decision: [One-sentence statement of the choice made]

Options considered:
  A. [Option A] — [why it was tempting]
  B. [Option B] — [why it was tempting]

Chose A because: [honest reasoning — include the tradeoff]

What I'd do differently: [intellectual honesty = maturity signal]
```

**Write these 4 entries:**

**Entry 1 — MemeForge: Local vs. Cloud AI**
- Decision: Run LLM inference locally (Ollama) vs. call OpenAI API
- Chose: Local
- Because: cost is zero forever, privacy, offline-capable — tradeoff is GPU requirement on user machine
- Would do differently: add a cloud fallback for users without GPU

**Entry 2 — Route Optimizer: Roll vs. Buy**
- Decision: Implement graph routing algorithm myself vs. use Google Maps API
- Chose: Roll my own
- Because: learning > convenience at this stage, no API quota limits, full control of cost calculation logic
- Would do differently: probably use OSRM for production

**Entry 3 — MemeForge: Framework Choice**
- Decision: Next.js 14 App Router vs. pure React SPA
- Chose: Next.js
- Because: PWA support, future SSR potential, API routes for future backend additions
- Tradeoff: overkill for a local app with no server

**Entry 4 — KapdaCraft: Scope Decision (PM mode)**
- Decision: Build vendor dashboard first vs. customer-facing UI first
- Chose: Vendor first
- Because: supply-side (tailors) is the harder constraint — no supply = no product. Classic marketplace thinking.
- Product framework used: identify riskiest assumption, test it first

### 3.6 Skills — As a System Diagram, Not Bars

Skill bars are meaningless. Replace with a visual dependency tree.

**Layout**: An SVG/canvas "tech map" showing skills grouped by layer — infrastructure → backend → frontend → AI/LLM — with lines connecting related skills.

Alternatively (simpler to implement, equally effective): a clean two-column table with grouping headers:

```
SYSTEMS & BACKEND          FRONTEND & UI
─────────────────          ─────────────
Java (primary)             Next.js 14
Spring Boot                React 18
REST API design            Tailwind CSS
MySQL / PostgreSQL         Framer Motion
JWT / Auth patterns        PWA

LANGUAGES                  AI / LLM (actively learning)
─────────                  ──────────────────────────
C++ (DSA heavy)            Ollama + local inference
Go (exploring)             LangChain
JavaScript                 Prompt engineering
                           LLM application architecture

TOOLS & PROCESS            PRODUCT SKILLS
────────────────           ──────────────
Git / GitHub               PRD writing
VS Code                    User story mapping
Docker (learning)          North star metrics
Postman                    Competitive analysis
                           Roadmap prioritization
```

No bars. No percentages. Just honest grouping. Add a small note at bottom: `"actively learning" = I have projects in progress, not just watched a tutorial`.

### 3.7 About — Short, Signal-Dense

**Max 200 words**. Senior engineers don't read long bios.

```
I'm a 4th-year CSE student at JECRC University, Jaipur.

I build full-stack systems and think about them like a PM.
That's not a common combination — most engineers don't care
about the "why", most PMs can't implement the "how". I try to do both.

Currently: finishing B.Tech, building MemeForge AI, grinding
LeetCode, and reading everything I can about system design
and product strategy.

Looking for: internship or full-time SDE role where I can
ship fast, learn from people who are better than me, and
eventually move into a hybrid eng/PM track.

Not looking for: a job where "the requirements are fixed".

Outside work: guitar, anime, video editing, hackathons.
```

Then a clean "currently reading / currently building / currently learning" three-column strip.

### 3.8 Contact

Dead simple. No contact form.

```
LET'S TALK

If you're building something hard and need someone who
can write the PRD and the API — I'm interested.

anush@[email]

[GitHub ↗]  [LinkedIn ↗]  [Twitter ↗]  [Resume PDF ↗]
```

---

## 4. Full Responsive Breakpoints

```
Mobile:  < 640px   — single column everything, 16px base font
Tablet:  640–1024px — some 2-col layouts collapse, nav stays
Desktop: > 1024px  — full experience
Wide:    > 1440px  — max-width: 1200px centered, no wider
```

**Mobile-specific rules:**
- Nav becomes hamburger → full-screen dark overlay with large tap targets (min 48px)
- Hero: name drops to 2.5rem, dual-brain card stacks vertically
- Project entries: all single column, decision text still visible (don't hide it behind "read more")
- Decisions log: accordion works on mobile too
- No horizontal scroll anywhere — test this aggressively
- Bottom padding on last section: 80px (thumb nav clearance)

**Touch considerations:**
- All interactive elements: min 44×44px tap target
- Hover states also have active/focus equivalents
- No hover-only information

---

## 5. Animations — The Ones That Matter

Use Framer Motion. **Restraint is the rule** — only animate things that help the user orient.

```javascript
// Standard fade-up — use for section reveals
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Stagger container — for lists of items
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};
```

**Things to animate:**
1. Hero name + bio — stagger fade-up on mount
2. The dual-brain card — slides in from right on mount
3. Section titles — fade-up on scroll enter (IntersectionObserver + Framer)
4. Project entries — fade-up with stagger as you scroll into the section
5. Decisions log entries — height animation on accordion expand/collapse
6. Nav — `backdrop-filter` and border fade in on scroll (pure CSS)

**Things to NOT animate:**
- Skill table (static is fine)
- Contact section (just text)
- Colors on hover (use CSS transitions, not Framer)

**The one hero animation that makes the site memorable:**

On the dual-brain card in the hero: a subtle "typing" animation plays in the code editor side — a cursor blinks, then a few lines of code appear character by character. It should feel like someone is actually working. Use a `useEffect` with `setTimeout` chains, not a library. The code it types should be real — a snippet from MemeForge AI or the route optimizer.

---

## 6. The "Proof of Work" Banner

Between the hero and the projects section, add a full-width horizontal strip:

```
[  8+ projects shipped  ]  [  340+ GitHub commits  ]  [  4th year B.Tech CSE  ]  [  Jaipur, India → Anywhere  ]
```

These are separated by `|` dividers, scrolling horizontally on mobile (overflow-x: auto, no scrollbar visible). Font: Fragment Mono, 13px, `--text-secondary`. Subtle top/bottom border, no background fill. This strip communicates "this person ships" without bragging.

---

## 7. The Case Study Detail Page (Optional but Powerful)

For MemeForge AI specifically, build a `/work/memeforge` page. Structure:

```
← back to work

MEMEFORGE AI                                    [↗ live]  [github]
Local-first AI meme generation

─────────────────────────────────────────────────────────

THE BRIEF
[2–3 sentence problem statement in PM voice]

THE SYSTEM
[architecture diagram — Next.js → Ollama → llava → response]
[This diagram alone proves you think in systems]

THE DECISIONS
[Same decision log format from main page, but expanded]

THE CODE
[2–3 real code snippets — the interesting parts, not boilerplate]
[Show the Ollama API call, show the PWA manifest, show something clever]

WHAT I LEARNED
[Honest retrospective — 3 bullet points max]
```

This page is what gets forwarded. "Have you seen this guy's MemeForge writeup?" is the goal.

---

## 8. SEO + Meta

```html
<title>Anush Gupta — Full Stack Engineer & Product Manager</title>
<meta name="description" content="B.Tech CSE student building full-stack systems and thinking in user flows. Spring Boot, Next.js, LLMs. Open to SDE internships and full-time roles." />
<meta property="og:title" content="Anush Gupta — sol.dev" />
<meta property="og:image" content="/og-image.png" />
```

OG image: 1200×630, dark background, name in Fragment Mono, subtitle "Full Stack × Product", and the two-color accent line. Generate this as a static PNG — don't use dynamic OG generation for now.

---

## 9. Performance Requirements

- Lighthouse score: ≥ 90 on all four metrics
- No layout shift (CLS) from font loading — use `font-display: optional` or preload
- Images: use `next/image` with proper `width`/`height` for all project screenshots
- No client-side fetch on initial load — everything static/SSG
- Bundle: no unnecessary libraries. Framer Motion is the only "heavy" dep and it's justified.

---

## 10. File Structure

```
/
├── app/
│   ├── layout.tsx          ← fonts, metadata, nav wrapper
│   ├── page.tsx            ← home — all sections
│   └── work/
│       └── memeforge/
│           └── page.tsx    ← case study detail
├── components/
│   ├── nav.tsx
│   ├── hero.tsx            ← including dual-brain card
│   ├── proof-banner.tsx
│   ├── dual-identity.tsx   ← the two-card section
│   ├── projects.tsx        ← case study list
│   ├── decisions.tsx       ← accordion log
│   ├── skills.tsx          ← the table layout
│   ├── about.tsx
│   └── contact.tsx
├── lib/
│   └── data.ts             ← all content as typed objects, NOT hardcoded in JSX
├── public/
│   ├── og-image.png
│   └── resume.pdf
└── styles/
    └── globals.css         ← CSS custom properties + resets
```

**`lib/data.ts` is important**: All project data, decision log entries, and skill lists should be exported as typed TypeScript arrays/objects from this file. This means:
1. Easy to update content without touching component files
2. Shows you know how to separate data from presentation
3. Type-safe content = no runtime surprises

---

## 11. Content Checklist (Fill These In Before Launch)

- [ ] Real email address
- [ ] Real GitHub URL
- [ ] Real LinkedIn URL  
- [ ] Resume PDF (updated, matches portfolio positioning)
- [ ] At least one project with a live URL
- [ ] At least one project with a real GitHub repo (not private)
- [ ] MemeForge case study page written
- [ ] OG image generated
- [ ] Domain: `solmyst.dev` or `anushgupta.dev` — buy one, redirect the other
- [ ] Google Analytics or Plausible (lightweight) — know who visits
- [ ] Deployed to Vercel — include the deployment URL in GitHub README

---

## 12. Things to Explicitly NOT Do

- No skill bars or percentage circles
- No "I am passionate about technology" anywhere in the copy
- No stock illustrations or undraw.co images
- No hero image of yourself (unless it's a high-quality photo — otherwise skip entirely)
- No dark/light toggle (pick dark, commit, it signals taste)
- No "under construction" sections — if a project isn't ready to show, don't list it
- No lorem ipsum at launch
- No "feel free to contact me" — just the email
- No three.js particles or heavy WebGL effects — they scream "I watched a tutorial"
- No testimonials section (you're a student, you don't have credible ones yet — it'll look fake)

---

## 13. The One Thing That Will Make This Portfolio Different

Every section should answer: **"Why did you make that choice?"**

Not what you built. Why you built it that way. That question separates engineers who follow instructions from engineers who have judgment. Judgment is what gets hired.

Put this thinking everywhere:
- Project descriptions → include one decision
- Skills list → annotate with "primary", "learning", "used in production"  
- About section → say what you're looking for and why, specifically
- Contact → say what kind of work interests you

The portfolio should feel like a conversation with someone who has opinions, not a resume formatted as a website.
