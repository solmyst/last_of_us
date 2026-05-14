# Animation & Interaction Spec — sol.dev
## The "How is this a student portfolio?" Layer
## Read PORTFOLIO_SPEC.md first. This file layers on top of it.

---

## Philosophy

Three rules before writing any animation:
1. **Physics over timing** — spring() over duration wherever possible. Real objects have mass.
2. **Information over decoration** — every animation should make the content clearer, not just prettier.
3. **One signature moment** — one animation so good that someone screenshots it. Everything else serves that moment.

The signature moment for this portfolio: **the hero dual-brain card** — a live code typing animation synced to a product thinking animation. Both panels animate simultaneously showing "two modes, one person."

---

## Framer Motion Setup

```bash
npm install framer-motion
```

```typescript
// lib/animations.ts
// Single source of truth for all motion variants.
// Import from here, never define inline in components.

import { Variants, Transition } from "framer-motion";

// ─── BASE TRANSITIONS ──────────────────────────────────────────────────────

export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  bouncy: { type: "spring", stiffness: 300, damping: 15, mass: 1.2 },
  slow: { type: "spring", stiffness: 60, damping: 20, mass: 1.5 },
} satisfies Record<string, Transition>;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,          // expo out — fast start, slow end
  inOut: [0.76, 0, 0.24, 1] as const,       // strong inOut
  gentle: [0.25, 0.46, 0.45, 0.94] as const, // standard smooth
};

// ─── REUSABLE VARIANTS ────────────────────────────────────────────────────

// Standard fade up — used for most scroll reveals
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.65, ease: ease.out },
  },
};

// Fade in only — for things that shouldn't move
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: ease.gentle } },
};

// Slide from right — hero card
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(6px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease: ease.out, delay: 0.3 },
  },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// Stagger item (use inside staggerContainer)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

// Scale pop — for badges, tags, buttons on hover
export const scalePop: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: spring.snappy },
  tap: { scale: 0.97, transition: spring.snappy },
};

// Underline expand — for nav links
export const underlineExpand: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.25, ease: ease.out } },
};

// Border glow — for project cards
export const cardHover: Variants = {
  rest: { borderColor: "rgba(255,255,255,0.09)" },
  hover: { borderColor: "rgba(108,99,255,0.4)", transition: { duration: 0.2 } },
};

// Number count-up (use with useMotionValue + useTransform)
// See implementation in components/proof-banner.tsx

// Accordion open/close
export const accordionContent: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.3, ease: ease.inOut } },
  open: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: ease.out } },
};

export const accordionChevron: Variants = {
  collapsed: { rotate: 0 },
  open: { rotate: 180, transition: spring.snappy },
};
```

---

## Section 1 — Hero (The Signature Moment)

### 1.1 Name Entrance

```typescript
// components/hero.tsx

// The name enters character by character using a split-text technique.
// NOT a typewriter (typewriters look cheap). This is a mask reveal.

// Each letter is wrapped in a span with overflow: hidden.
// Letters slide up from below the mask with staggered delay.

const nameChars = "Anush Gupta".split("");

// In JSX:
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {"Anush Gupta".split("").map((char, i) => (
    <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
      <motion.span
        display="inline-block"
        variants={{
          hidden: { y: "110%", opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              delay: i * 0.035,           // 35ms per character
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],   // expo out
            },
          },
        }}
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  ))}
</motion.div>

// "builds systems. ships products." enters as full words, staggered.
// 0.6s after name completes.
```

### 1.2 The Dual Brain Card — THE Signature Moment

```typescript
// components/dual-brain-card.tsx
//
// This is the most important component on the site.
// Two panels: left = code editor, right = product thinking.
// They animate simultaneously, synchronized, like two modes of the same brain.
//
// WHAT HAPPENS ON LOAD:
// 1. Card slides in from right (0.4s after name)
// 2. Left panel: code types in line by line (typewriter, but for code — different feel)
// 3. Right panel: product checklist items appear one by one with checkmark animations
// 4. After both complete: a cursor blinks on the code side, a subtle pulse on the PM side
// 5. On hover: panels slightly diverge (3px gap opens), glow intensifies

// The code to type (REAL snippet from MemeForge):
const CODE_LINES = [
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
];

// The PM items to appear:
const PM_ITEMS = [
  { text: "User problem identified", done: true },
  { text: "Riskiest assumption: GPU availability", done: true },
  { text: "MVP scope locked", done: true },
  { text: "Privacy requirement: local-only", done: true },
  { text: "Success metric: zero API cost", done: true },
  { text: "Ship. Iterate.", done: false, active: true },
];

// IMPLEMENTATION NOTES:
// - Code types at ~30ms per character, faster than a human types
// - Each line appears after previous line completes + 80ms pause
// - PM items appear one by one, 400ms apart, starting 200ms after code starts
// - Each PM item has a small checkmark that draws itself (SVG stroke animation)
// - The glowing divider line between panels has a slow pulse animation (opacity 0.4 → 0.8)

// Hover behavior:
// whileHover on the outer card:
//   - left panel translateX: -3px
//   - right panel translateX: +3px
//   - divider glow intensifies
//   - spring transition

// SVG checkmark draw animation (for PM items):
// Use strokeDasharray + strokeDashoffset technique:
<svg width="12" height="12" viewBox="0 0 12 12">
  <motion.path
    d="M2 6 L5 9 L10 3"
    stroke="var(--green)"
    strokeWidth="1.5"
    fill="none"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.3, ease: ease.out, delay: itemDelay }}
  />
</svg>
```

### 1.3 Background Grid — Parallax Dot Field

```typescript
// Not a static grid. The dots move subtly with mouse position.
// Creates depth without WebGL or Three.js.

// In hero component:
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const gridX = useTransform(mouseX, [-1, 1], [-8, 8]);
const gridY = useTransform(mouseY, [-1, 1], [-8, 8]);

// Track normalized mouse position (-1 to 1):
useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("mousemove", handleMove);
  return () => window.removeEventListener("mousemove", handleMove);
}, []);

// Apply to background grid:
<motion.div
  style={{ x: gridX, y: gridY }}
  className="absolute inset-0 pointer-events-none"
>
  {/* CSS dot grid via background-image: radial-gradient */}
  {/* 40px spacing, dots are 1.5px, opacity 0.15 */}
</motion.div>

// Also: a larger, slower parallax layer — two concentric glow orbs
// Orb 1: x = gridX * 1.5, y = gridY * 1.5  (closer, moves more)
// Orb 2: x = gridX * 0.5, y = gridY * 0.5  (farther, moves less)
// Both: radial-gradient from --accent at 0% opacity to transparent
// Orb 1 diameter: 500px, Orb 2: 800px
// This creates a subtle depth effect with zero GPU cost
```

### 1.4 Proof Banner — Animated Number Count-Up

```typescript
// components/proof-banner.tsx
// Numbers count up when scrolled into view using Framer's useInView + useMotionValue

import { useInView, useMotionValue, useTransform, animate } from "framer-motion";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// Usage: <AnimatedNumber target={340} suffix="+" />

// Banner also has a horizontal marquee on mobile:
// CSS animation: @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
// Two copies of the content side by side for seamless loop
// animation-duration: 20s, linear, infinite
// Pauses on hover: animation-play-state: paused
```

---

## Section 2 — Navigation Micro-interactions

```typescript
// components/nav.tsx

// 1. Nav links — underline expand on hover
// Each link has a ::after pseudo-element OR a motion.div as underline
// scaleX: 0 → 1 on hover, originX: left, spring transition

// 2. Active section highlight
// Use useScrollSpy hook (custom) that updates active section ID
// Active link: color changes from --text-secondary to --text-primary + underline visible

// 3. Resume button — a "live" pulsing dot before the text
// <span style={{
//   display: 'inline-block', width: 6, height: 6,
//   borderRadius: '50%', background: 'var(--green)',
//   animation: 'pulse 2s infinite'  // CSS keyframe
// }} />

// 4. Mobile nav — the overlay open/close
// Overlay: opacity 0 → 1 + scale 0.95 → 1, spring.soft
// Links: stagger fade-up from bottom when overlay opens
// Close: reverse — overlay scale 1 → 0.97 + opacity out

// Custom useScrollSpy hook:
function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [sectionIds]);

  return activeId;
}
```

---

## Section 3 — Projects — The Card Reveal System

```typescript
// components/projects.tsx
//
// Projects don't just fade in. Each project entry has a layered reveal:
//
// 1. The left accent bar animates height 0 → 100% (top to bottom)
// 2. Project number fades in
// 3. Title slides up
// 4. The two-column (problem / outcome) layout fades in from their respective sides
// 5. Stack pills appear with stagger, each with a subtle scale pop
// 6. Links appear last

// The reveal is triggered by IntersectionObserver, staggered between projects.

// Accent bar animation:
<motion.div
  initial={{ scaleY: 0, originY: 0 }}
  whileInView={{ scaleY: 1 }}
  transition={{ duration: 0.6, ease: ease.out }}
  viewport={{ once: true }}
  style={{
    width: 2,
    background: "var(--accent)",
    position: "absolute",
    left: 0, top: 0, bottom: 0,
  }}
/>

// Stack pills — each pill:
<motion.span
  initial={{ opacity: 0, scale: 0.85 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ delay: index * 0.05, ...spring.snappy }}
  viewport={{ once: true }}
  whileHover={{ scale: 1.06, transition: spring.snappy }}
  whileTap={{ scale: 0.97 }}
>
  {tech}
</motion.span>

// FEATURED PROJECT (MemeForge) special treatment:
// On hover, a subtle "terminal scanline" animation plays over the card.
// This is a CSS animation — a semi-transparent line that sweeps top to bottom:
// @keyframes scanline {
//   0% { transform: translateY(-100%) }
//   100% { transform: translateY(200%) }
// }
// The line is a div with: position absolute, height 40%, width 100%
// background: linear-gradient(transparent, rgba(108,99,255,0.03), transparent)
// Triggers on parent :hover via CSS (no JS needed)

// Decision text expand — the "DECISIONS I MADE" field
// Truncated to 2 lines by default (CSS line-clamp: 2)
// "Read decision →" button expands to full height
// Use Framer's AnimatePresence + height: auto animation:
<AnimatePresence>
  {expanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: ease.inOut }}
      style={{ overflow: "hidden" }}
    >
      {fullDecisionText}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Section 4 — Decisions Log Accordion

```typescript
// components/decisions.tsx
// This section has the most complex interaction on the page.

// Each decision entry is an accordion with:
// - Header: always visible — date, context tag, decision statement
// - Body: expandable — options considered, choice, reasoning, retrospective

// Context tag has a color-coded left border:
// architecture → --accent (indigo)
// product → --pm-accent (cyan)
// build → --amber
// scope → --green

// The tag itself has a small animated dot that pulses in its color.

// HEADER micro-interaction:
// On hover: the entire row translates 4px to the right (spring.snappy)
// The chevron rotates 180° when open (motion.div with rotate variant)
// Left border height animates: 0 → 100% of the card when open

// BODY reveal:
// Height animates open/close (AnimatePresence)
// Inside: the "Options considered" section has a visual binary split —
// Option A and B cards appear side by side
// The CHOSEN option gets a checkmark that draws itself (SVG pathLength animation)
// The REJECTED option gets a subtle strikethrough line that draws across

// Strikethrough animation for rejected option:
<motion.div
  initial={{ scaleX: 0, originX: 0 }}
  animate={{ scaleX: isChosen ? 0 : 1 }}
  transition={{ duration: 0.4, delay: 0.3, ease: ease.out }}
  style={{
    position: "absolute",
    height: 1,
    background: "var(--text-tertiary)",
    top: "50%",
    left: 0,
    right: 0,
  }}
/>

// "What I'd do differently" — appears with a typewriter effect AFTER
// the main content has rendered. Creates a "realtime thought" feeling.
// Use a simple setInterval character-by-character approach (not a library).
// Delay: 800ms after accordion opens.
```

---

## Section 5 — Skills Table — Not Boring

```typescript
// components/skills.tsx

// The skill table reveals row by row as you scroll.
// Each row slides in from the left with stagger.

// Level indicators:
// "primary" → filled dot ●, --text-primary color
// "production" → half dot (use a div: left half filled, right empty), --accent
// "learning" → empty dot ○, --pm-accent
// "exploring" → dash —, --text-tertiary

// On hover over any skill row:
// Row background: subtle --accent-dim glow
// Note text (if any) slides in from the right: width 0 → auto, opacity 0 → 1

// Group headers have a line that expands left to right on scroll enter:
<motion.div
  initial={{ scaleX: 0, originX: 0 }}
  whileInView={{ scaleX: 1 }}
  transition={{ duration: 0.6, ease: ease.out }}
  viewport={{ once: true }}
  style={{
    height: 1,
    background: "var(--border-default)",
    marginBottom: 12,
  }}
/>
```

---

## Section 6 — The "Context Switch" Scroll Effect

```typescript
// This is the most technically interesting scroll effect.
// As the user scrolls from "Projects" (engineering) to "How I Think" (decisions, PM),
// the nav accent color transitions from --accent (indigo) to --pm-accent (cyan).
// This reinforces the dual-identity concept through color.

// Implementation using Framer's useScroll + useTransform:

const { scrollYProgress } = useScroll();

// Map scroll position to color
// Between 0.3 (entering projects) and 0.6 (entering decisions):
const accentColor = useTransform(
  scrollYProgress,
  [0, 0.3, 0.6, 1],
  ["#6c63ff", "#6c63ff", "#06b6d4", "#06b6d4"]
);

// Apply to a CSS variable via motion.div style:
<motion.div style={{ "--dynamic-accent": accentColor } as any}>
  {/* All nav link underlines use var(--dynamic-accent) */}
</motion.div>

// Note: this is a subtle effect. Don't overdo it. The color change should
// feel environmental, not like a mode toggle the user consciously activates.
```

---

## Section 7 — Page Load Sequence (Orchestrated)

```typescript
// The entire page load is one orchestrated sequence.
// Timing in ms from page load:

// 0ms:     Background grid fades in (opacity 0 → 0.15)
// 100ms:   Nav slides down from top (y: -60 → 0)
// 200ms:   Hero tag badge fades in
// 350ms:   Name character reveal starts (runs for ~450ms at 35ms/char × 13 chars)
// 800ms:   "builds systems. ships products." slides up
// 950ms:   Bio fades up
// 1100ms:  CTA buttons stagger in
// 1200ms:  Dual brain card slides in from right
// 1400ms:  Code typing starts inside card
// 1500ms:  PM checklist items start appearing (staggered with code typing)
// 2200ms:  Both card panels complete → cursor blink activates on code side

// Everything below the fold: IntersectionObserver reveals
// Nothing auto-plays below fold (performance + UX: user controls the pace)

// Implementation: don't use setTimeout chains manually.
// Use Framer's delay property + AnimatePresence with initial={false} for
// content that should NOT animate on re-render.

// The sequence is a single <motion.div variants={staggerContainer}> at the
// hero level, with nested variants that cascade through children.
// Framer handles the orchestration automatically via stagger + delay.
```

---

## Section 8 — Scroll-Linked Effects (Beyond Reveals)

### 8.1 Section Title — Sticky Scrub

```typescript
// Section numbers (01, 02, 03...) are sticky-positioned on desktop.
// As you scroll through a section, the number slowly moves upward (scrub).
// This creates a sense of depth and progress.

const { scrollYProgress } = useScroll({ target: sectionRef });
const yOffset = useTransform(scrollYProgress, [0, 1], [0, -40]);

<motion.div style={{ y: yOffset, position: "sticky", top: "2rem" }}>
  <span className="section-number">02</span>
</motion.div>
```

### 8.2 Project Cards — Progressive Blur

```typescript
// As the user scrolls DOWN through the project list,
// the PREVIOUS project card slightly blurs and dims (scale: 1 → 0.99, opacity: 1 → 0.6)
// while the upcoming card sharpens.
// This creates a focus effect — you always know which project you're looking at.

// Implementation: each project card tracks its own scroll position using
// useScroll({ target: cardRef, offset: ["start end", "end start"] })
// and useTransform to map to opacity + filter values.
// The effect is subtle: opacity never goes below 0.55, blur max 2px.
```

### 8.3 Decisions Log — Left Border Scrub

```typescript
// The vertical timeline line on the left of the decisions section
// fills in from top to bottom as you scroll through it.
// Uses a clip-path or scaleY technique:

const { scrollYProgress } = useScroll({ target: decisionsSectionRef });
const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

<div style={{ position: "relative" }}>
  {/* Background line (always visible, dim) */}
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1,
    background: "var(--border-subtle)" }} />
  {/* Filled line (scroll-driven) */}
  <motion.div style={{
    position: "absolute", left: 0, top: 0, width: 1,
    background: "var(--accent)", height: lineHeight,
    transformOrigin: "top"
  }} />
</div>
```

---

## Section 9 — Cursor (Desktop Only)

```typescript
// components/cursor.tsx
// Custom cursor. Only renders on desktop (window.matchMedia check).
// Two elements: inner dot (8px) + outer ring (28px, lags behind).

// The lag effect creates a sense of weight — it feels physical.
// NOT a spring on the outer ring — use lerp (linear interpolation) for smoothness.

// The REAL interesting part: context-aware cursor states.

type CursorState = "default" | "link" | "project" | "code" | "expand";

// default: small dot + ring
// link: dot scales to 0, ring expands to 48px + shows "→" text inside (using ::after or a child span)
// project: ring expands to 64px + fills with --accent-dim + shows "view" text
// code: ring becomes a blinking rectangle (cursor: text visual) — only on code blocks
// expand: ring + chevron icon visible (for decisions accordion headers)

// Implementation:
// Add data-cursor="project" to project cards
// Add data-cursor="code" to code blocks
// Add data-cursor="expand" to accordion headers
// useEffect listens for mouseover on elements with data-cursor attribute
// Updates cursorState via useState

// The text that appears inside the ring ("view", "→") uses
// AnimatePresence so it fades in/out correctly during state transitions.

// CSS:
// .cursor-dot: width 8px, height 8px, border-radius 50%, background --accent
//   position fixed, pointer-events none, z-index 9999
//   transition: transform 0.1s (for scale)
// .cursor-ring: width 28px, height 28px, border 1px solid rgba(108,99,255,0.5)
//   border-radius 50%, position fixed, pointer-events none, z-index 9998
//   display flex, align-items center, justify-content center
//   font-size 10px, color --accent, letter-spacing 0.05em
//   LERP applied via requestAnimationFrame (see below)

// LERP implementation:
let ringX = 0, ringY = 0;
const LERP_FACTOR = 0.12;

function animateCursor() {
  ringX += (targetX - ringX) * LERP_FACTOR;
  ringY += (targetY - ringY) * LERP_FACTOR;
  ringEl.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateCursor);
}

// Note: on touch devices, hide the cursor entirely.
// Check: 'ontouchstart' in window || navigator.maxTouchPoints > 0
```

---

## Section 10 — The "Easter Egg" (Konami Code / Secret)

```typescript
// Every great portfolio has one.
// Implement the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
// On success: the entire site briefly switches to a "debug mode" visual —
// all layout boundaries are shown with neon outlines (box-shadow: 0 0 0 1px red)
// and a terminal overlay appears with a message:

// The message:
const easterEggMessage = [
  "$ you found it.",
  "$ running diagnostic...",
  "$ checking if sol is hire-worthy...",
  "$ analyzing: ships fast ✓",
  "$ analyzing: thinks in systems ✓",
  "$ analyzing: documents decisions ✓",
  "$ analyzing: anime taste ✓",
  "$ result: probably hire him",
  "$ source code: github.com/solmyst",
  "$ now stop snooping and send an email.",
];

// The overlay:
// Full-screen dark overlay (rgba 0,0,0,0.92) with the message typed out line by line
// Click anywhere or press Escape to dismiss
// AnimatePresence handles mount/unmount

// Implementation:
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      triggerEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
```

---

## Section 11 — Performance Rules (Don't Kill It)

```
NEVER do this:
- blur() filter on large elements during scroll (expensive, causes paint storms)
- box-shadow animation (triggers layout — use outline or pseudo-element instead)
- animating width/height (use transform: scale or clip-path instead)
- will-change on more than 4 elements simultaneously
- JS-driven animation on scroll without throttling

DO this:
- will-change: transform on animated elements (cards, cursor)
- transform and opacity ONLY for animations (GPU-composited)
- useReducedMotion() from Framer — respect prefers-reduced-motion
- Lazy load sections below fold
- Keep animation JS out of the critical render path

Reduced motion implementation (REQUIRED):
import { useReducedMotion } from "framer-motion";

function MyComponent() {
  const shouldReduce = useReducedMotion();
  
  const variants = shouldReduce ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } : fadeUp;  // use full animation for normal users
  
  return <motion.div variants={variants}>...</motion.div>;
}

Lighthouse target: 90+ on Performance.
The animations should ADD to this, not detract.
Animation is not an excuse for a slow site.
```

---

## Section 12 — The Tech Stack Signal in the Footer

```typescript
// The footer should itself be a portfolio piece.
// Instead of "built with Next.js", show the actual build stats:

// Footer content:
// built by sol in [city] · next.js 14 · framer motion · deployed on vercel
// [build time: ~2.1s] [lighthouse: 96] [last deploy: X days ago]

// The "last deploy" is populated at build time via a getStaticProps or
// a build-time environment variable: process.env.NEXT_PUBLIC_BUILD_TIME
// This automatically updates every time you push — shows the site is alive.

// The lighthouse score badge:
// A small green badge: [⬤ 96] — color coded green/amber/red
// Link it to your actual Lighthouse report (export as HTML, host in /public)

// This footer says: "I care about performance, I measure things, I ship regularly."
// Three hire signals in six lines of footer.
```

---

## Summary — What Makes This Portfolio's Animation Layer Unique

1. **Character-level name reveal** — not a typewriter, not a fade. A mask reveal per character.
2. **Synchronized dual-brain card** — code types + PM checklist checks simultaneously.
3. **Context-aware cursor** with state machine (5 states) and lerp-based lag.
4. **Color transition on scroll** — indigo → cyan as you move from engineering to product sections.
5. **Scroll-driven timeline fill** — the decisions log timeline fills as you read it.
6. **Progressive blur** on project cards — focus on what you're reading.
7. **SVG checkmark + strikethrough** draw animations in decision log.
8. **Animated number count-up** in proof banner using Framer's useMotionValue.
9. **Konami code easter egg** with typed terminal response.
10. **Build stats in footer** — live data, not static copy.

None of these are Three.js particles. None are WebGL. All are Framer Motion + CSS.
That restraint is itself a signal: good engineers know what not to build.
