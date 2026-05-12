# Portfolio Upgrade Spec
## Theme · Cursor · Nav
**For: Anush Gupta (sol / solmyst)**
**Status: Implementation-ready. Read top to bottom before touching a file.**

---

## 0. The New Aesthetic Direction

**Concept: "Terminal that grew up."**

Not a dark-mode portfolio. Not a glassmorphism portfolio. Not a gradient-heavy portfolio.

This is the portfolio of someone who reads kernel docs for fun and also writes PRDs. The visual language is: **dense, precise, structural** — like a professional IDE mixed with a Bloomberg terminal. Everything sits on an invisible grid. The only color that isn't near-black or near-white is the accent, and it earns every pixel it touches.

The one thing a visitor will remember: **it feels like a tool, not a brochure.** And tools feel trustworthy.

---

## 1. New Color System

Replace everything in `globals.css `:root` with this:

```css
:root {
  /* ── BASE SURFACES ──────────────────────────────────── */
  --bg-base:       #04040b;   /* true dark — not #000, not #111 */
  --bg-surface:    #09090f;   /* cards, panels                  */
  --bg-elevated:   #0f0f1a;   /* hover states, code blocks      */
  --bg-overlay:    #16162a;   /* tooltips, active states        */

  /* ── BORDERS ─────────────────────────────────────────── */
  --border-micro:   rgba(255,255,255,0.035);
  --border-subtle:  rgba(255,255,255,0.07);
  --border-default: rgba(255,255,255,0.11);
  --border-strong:  rgba(255,255,255,0.20);

  /* ── TEXT ────────────────────────────────────────────── */
  --text-primary:   #f2f2fa;
  --text-secondary: #5a5a80;
  --text-muted:     #2e2e45;

  /* ── ACCENT — ONE, USED SURGICALLY ──────────────────── */
  --accent:         #4f46e5;       /* indigo 600 — deep, not electric */
  --accent-bright:  #818cf8;       /* indigo 400 — for text on dark   */
  --accent-dim:     rgba(79,70,229,0.08);
  --accent-border:  rgba(79,70,229,0.22);
  --accent-glow:    rgba(79,70,229,0.12);

  /* ── PM ACCENT — DISTINCT MODE SIGNAL ───────────────── */
  --pm:             #0891b2;       /* cyan 600                        */
  --pm-bright:      #67e8f9;       /* cyan 300 — for text on dark     */
  --pm-dim:         rgba(8,145,178,0.07);
  --pm-border:      rgba(8,145,178,0.20);

  /* ── SEMANTIC ────────────────────────────────────────── */
  --green:          #10b981;
  --amber:          #d97706;
  --red:            #e11d48;

  /* ── NOISE TEXTURE (CSS bg-image) ───────────────────── */
  --noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}
```

**Usage rules — enforce these or the theme breaks:**

- `--bg-base` is the only page background. Never use a gradient on the entire page.
- `--accent` (deep indigo) is for interactive borders, active states, and code-context elements only. Never fill a large surface with it.
- `--accent-bright` is for accent-colored text — the full `--accent` is too dark to read on `--bg-base`.
- `--pm-bright` is used only in the "Product Mode" card and PM-tagged sections. It is the visual signal that the reader has switched modes.
- One rule to tattoo: **if you're adding a second accent color, you're adding noise, not signal.**

---

## 2. Typography

**Replace the font stack entirely.** The spec called for Fragment Mono + Inter. Upgrade:

```css
/* In <head> */
<link href="https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&family=Syne:wght@700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
```

```css
/* In globals.css */
--font-display: 'Syne', sans-serif;        /* hero name, section titles  */
--font-mono:    'Fragment Mono', monospace; /* nav, labels, code, tags    */
--font-body:    'IBM Plex Sans', sans-serif;/* body text ONLY             */
```

**Why this works:**

- **Syne 800** is architectural — massive weight, tight tracking, looks carved not printed. Hero name at `font-size: clamp(4rem, 8vw, 7rem)` with `letter-spacing: -0.04em` will stop people.
- **Fragment Mono** stays as the spec intended — all labels, nav links, tags, code snippets. It reads "engineer" without trying.
- **IBM Plex Sans Light/Regular** is what engineers actually read in documentation. It has personality where Inter has none. Use weight 300 for body paragraphs, 500 for emphasis.

**Typographic scale — write these into a `typography.css` or add to `globals.css`:**

```css
/* Section label — appears above every section title */
.label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* Section title */
h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

/* Card / sub-heading */
h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Body */
p {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-secondary);
}

/* Inline code / tech pill text */
code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  padding: 2px 7px;
  border-radius: 3px;
  color: var(--accent-bright);
}
```

---

## 3. Custom Cursor

**This is the thing people will screenshot.**

The cursor system has two layers:
1. A small `4×4px` square (not circle — circles are played out) that sits exactly on the pointer, sharp-cornered, accent-colored.
2. A `32×32px` ring that follows with a `60ms` lerp delay — so it trails slightly behind fast movement.

The ring changes behavior based on which section the user is hovering:
- Default → `--accent` (indigo ring, engineering mode)
- Inside `.pm-section` or `.pm-card` → ring color becomes `--pm-bright` (cyan)
- Hovering any `<a>`, `<button>`, or `[data-cursor="link"]` → ring collapses to `8px`, fills with accent, rotates 45°
- Hovering `.project-card` → ring expands to `56px`, opacity drops to 0.5, shows text "VIEW" in Fragment Mono 8px centered

**Implementation — add this to `layout.tsx` or a `cursor.tsx` client component:**

```tsx
// components/cursor.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot  = dotRef.current!
    const rng  = ringRef.current!
    let raf: number

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`

      // Context detection
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const inPM      = el?.closest('.pm-section, .pm-card')
      const isLink    = el?.closest('a, button, [data-cursor="link"]')
      const isProject = el?.closest('.project-card')

      rng.dataset.ctx = isProject ? 'project' : isLink ? 'link' : inPM ? 'pm' : 'default'
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)
      rng.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <span className="cursor-label">VIEW</span>
      </div>
    </>
  )
}
```

**Cursor CSS — add to `globals.css`:**

```css
/* Hide native cursor sitewide */
*, *::before, *::after { cursor: none !important; }

/* Dot — the hot point */
.cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: 4px; height: 4px;
  background: var(--accent-bright);
  border-radius: 0;                  /* square — intentional */
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}

/* Ring — the trailing halo */
.cursor-ring {
  position: fixed;
  top: 0; left: 0;
  width: 32px; height: 32px;
  border: 1px solid var(--accent-bright);
  border-radius: 0;                  /* square ring — matches dot */
  pointer-events: none;
  z-index: 9998;
  will-change: transform;
  transition:
    width 220ms cubic-bezier(0.23, 1, 0.32, 1),
    height 220ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 300ms ease,
    background 220ms ease,
    opacity 220ms ease,
    border-radius 220ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* States */
.cursor-ring[data-ctx="pm"] {
  border-color: var(--pm-bright);
}
.cursor-ring[data-ctx="link"] {
  width: 8px;
  height: 8px;
  background: var(--accent-bright);
  border-color: var(--accent-bright);
  border-radius: 0;
}
.cursor-ring[data-ctx="project"] {
  width: 56px;
  height: 56px;
  border-radius: 50%;            /* only case it goes round — for contrast */
  border-color: var(--text-primary);
  opacity: 0.6;
}
.cursor-ring[data-ctx="project"] .cursor-label {
  opacity: 1;
}
.cursor-label {
  font-family: var(--font-mono);
  font-size: 7px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-primary);
  opacity: 0;
  transition: opacity 180ms ease;
  user-select: none;
}

/* Show native cursor only on mobile — no hover anyway */
@media (hover: none) {
  *, *::before, *::after { cursor: auto !important; }
  .cursor-dot, .cursor-ring { display: none; }
}
```

---

## 4. Navigation

**Kill the floating pill. Kill the centered list. This nav has an opinion.**

**Concept:** Left-rail feel on a top bar. The logo is flush left and behaves like a file path. Nav links sit right, spaced by `|` dividers in Fragment Mono so it reads like a terminal command chain. The Resume button is the only element with color.

A thin `1px` horizontal rule of `--accent` color sits at the very bottom of the nav — `2px` wide, animating from `0%` to `100%` width on page load (`1.2s` ease-out). This single line is the signature detail. It means: "you are reading a spec."

**HTML structure (nav.tsx):**

```tsx
<nav>
  <a href="/" className="nav-logo">
    sol<span className="logo-slash">/</span>dev
    <span className="logo-path">~anush</span>
  </a>

  <div className="nav-center-rule" aria-hidden />  {/* the animated accent line */}

  <div className="nav-right">
    <ul className="nav-links">
      <li><a href="#work">work</a></li>
      <li className="divider" aria-hidden>|</li>
      <li><a href="#thinking">thinking</a></li>
      <li className="divider" aria-hidden>|</li>
      <li><a href="#decisions">decisions</a></li>
      <li className="divider" aria-hidden>|</li>
      <li><a href="#about">about</a></li>
    </ul>
    <a href="/resume.pdf" className="nav-cta" target="_blank">
      <span>resume</span>
      <span className="cta-arrow" aria-hidden>↗</span>
    </a>
  </div>
</nav>
```

**Nav CSS:**

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 56px;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 4vw, 72px);

  /* Default — transparent */
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 400ms ease, border-color 400ms ease, backdrop-filter 400ms ease;
}

/* Scrolled state */
nav.scrolled {
  background: rgba(4, 4, 11, 0.88);
  backdrop-filter: blur(20px) saturate(140%);
  border-bottom-color: var(--border-micro);
}

/* THE signature detail: accent rule that draws itself on load */
.nav-accent-rule {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 1px;
  width: 0;
  background: var(--accent-bright);
  opacity: 0.6;
  animation: rule-draw 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
}

@keyframes rule-draw {
  from { width: 0; }
  to   { width: 100%; }
}

/* Logo */
.nav-logo {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: baseline;
  gap: 0;
}

.logo-slash {
  color: var(--accent-bright);
  margin: 0 1px;
}

.logo-path {
  color: var(--text-muted);
  font-size: 11px;
  margin-left: 6px;
  transition: color 250ms ease;
}

.nav-logo:hover .logo-path {
  color: var(--text-secondary);
}

/* Right cluster */
.nav-right {
  display: flex;
  align-items: center;
  gap: 28px;
}

/* Link list */
.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0;
}

.nav-links li a {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.10em;
  text-transform: lowercase;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0 14px;
  transition: color 200ms ease;
  position: relative;
}

/* Underline on active section — JS adds .active */
.nav-links li a.active {
  color: var(--text-primary);
}

.nav-links li a.active::after {
  content: '';
  position: absolute;
  bottom: -18px;
  left: 14px;
  right: 14px;
  height: 1px;
  background: var(--accent-bright);
}

.nav-links li a:hover {
  color: var(--text-primary);
}

.nav-links .divider {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  user-select: none;
  pointer-events: none;
}

/* CTA button */
.nav-cta {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.10em;
  color: var(--accent-bright);
  text-decoration: none;
  border: 1px solid var(--accent-border);
  padding: 6px 14px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease;
  white-space: nowrap;
}

.nav-cta:hover {
  background: var(--accent-dim);
  border-color: var(--accent-bright);
  color: var(--text-primary);
}

.cta-arrow {
  transition: transform 200ms ease;
}

.nav-cta:hover .cta-arrow {
  transform: translate(2px, -2px);
}

/* ── MOBILE NAV ─────────────────────────────── */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 4px;
  cursor: none;
}

.hamburger span {
  display: block;
  height: 1px;
  background: var(--text-secondary);
  transition: width 250ms ease, transform 250ms ease, opacity 250ms ease;
}

.hamburger span:nth-child(1) { width: 22px; }
.hamburger span:nth-child(2) { width: 14px; }   /* shorter — asymmetric on purpose */
.hamburger span:nth-child(3) { width: 18px; }

.hamburger.open span:nth-child(1) { width: 20px; transform: translateY(6px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { width: 20px; transform: translateY(-6px) rotate(-45deg); }

/* Mobile overlay */
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 199;
  background: var(--bg-base);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 clamp(28px, 8vw, 80px);
  gap: 0;
}

.mobile-menu.open { display: flex; }

/* Large stacked links — each with a number prefix */
.mobile-menu nav-item {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-micro);
  width: 100%;
  text-decoration: none;
}

/* Use this markup in the mobile overlay:
   <a href="#work" class="mobile-link">
     <span class="mobile-num">01</span>
     <span class="mobile-text">work</span>
   </a>
*/

.mobile-link {
  display: flex;
  align-items: baseline;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-micro);
  width: 100%;
  text-decoration: none;
}

.mobile-num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  min-width: 20px;
}

.mobile-text {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-secondary);
  transition: color 200ms ease;
}

.mobile-link:hover .mobile-text { color: var(--text-primary); }
.mobile-link:hover .mobile-num  { color: var(--accent-bright); }

.mobile-close {
  position: absolute;
  top: 18px;
  right: clamp(20px, 4vw, 72px);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  background: none;
  border: 1px solid var(--border-subtle);
  padding: 6px 12px;
  border-radius: 2px;
  cursor: none;
}

@media (max-width: 768px) {
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
}
```

**Nav JS (add to nav.tsx):**

```tsx
// Scroll detection
useEffect(() => {
  const nav = navRef.current
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60)
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])

// Active section highlighting via IntersectionObserver
useEffect(() => {
  const sections = document.querySelectorAll('section[id]')
  const links    = document.querySelectorAll('.nav-links a')

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'))
        document.querySelector(`.nav-links a[href="#${e.target.id}"]`)?.classList.add('active')
      }
    })
  }, { rootMargin: '-40% 0px -55% 0px' })

  sections.forEach(s => io.observe(s))
  return () => io.disconnect()
}, [])
```

---

## 5. Texture & Depth Layer

One global detail that makes the page feel handcrafted rather than generated.

Add this to `globals.css`. It renders a very subtle noise texture over the entire page:

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  background-image: var(--noise);
  background-repeat: repeat;
  background-size: 300px 300px;
  opacity: 0.028;
  mix-blend-mode: overlay;
}
```

Then on `<body>`, add `position: relative` and `isolation: isolate`. This layer is invisible unless you look for it — but it's the difference between "flat screen" and "printed surface."

---

## 6. Hero Background

**Remove any gradient background on the hero entirely.** Replace with this:

```css
#hero {
  position: relative;
  overflow: hidden;
}

/* Dot grid — CSS only, no canvas */
#hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 70% 80% at 65% 45%, black 0%, transparent 75%);
  pointer-events: none;
}

/* Single accent orb — right side only, near the dual-brain card */
#hero .hero-orb {
  position: absolute;
  top: 10%;
  right: -5%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle at center, rgba(79,70,229,0.07) 0%, transparent 68%);
  pointer-events: none;
}
```

No second orb. No cyan glow behind the hero. One light source. Restraint.

---

## 7. Section Styling Rules

Apply these consistently across all sections:

```css
/* Every section has identical rhythm */
section {
  padding: clamp(80px, 12vw, 140px) clamp(24px, 5vw, 80px);
  max-width: 1160px;
  margin: 0 auto;
}

/* Section label (appears above h2) */
.section-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-bright);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

/* The horizontal rule accent next to the label */
.section-label::before {
  content: '';
  display: block;
  width: 24px;
  height: 1px;
  background: var(--accent-bright);
  opacity: 0.5;
}

/* Divider between sections — very subtle */
.section-divider {
  width: 100%;
  height: 1px;
  background: var(--border-micro);
  margin: 0;
}
```

---

## 8. Card System

All cards across the site (project cards, skill cards, dual-identity cards) follow one rule set:

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;               /* not 8, not 16 — 4px, sharp-ish */
  padding: 28px 32px;
  transition: border-color 250ms ease, background 250ms ease;
  position: relative;
  overflow: hidden;
}

.card:hover {
  border-color: var(--border-default);
  background: var(--bg-elevated);
}

/* Engineering card accent */
.card.engineering {
  border-top: 2px solid var(--accent);
}

/* PM card accent */
.card.product {
  border-top: 2px solid var(--pm);
}

/* Featured project — extra left-border treatment */
.card.featured {
  border-left: 2px solid var(--accent-bright);
  border-top: 1px solid var(--border-subtle);
}
```

---

## 9. Tech Pill System

All stack tags use this. No `<Badge>` component library — raw CSS only:

```css
.pill {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  padding: 3px 9px;
  border-radius: 2px;
  display: inline-block;
  transition: border-color 180ms ease, color 180ms ease;
}

.pill:hover {
  border-color: var(--accent-border);
  color: var(--accent-bright);
}
```

---

## 10. Proof Banner

The strip between hero and projects. Full width, borderless, reads like a terminal status bar:

```css
.proof-banner {
  width: 100%;
  border-top: 1px solid var(--border-micro);
  border-bottom: 1px solid var(--border-micro);
  padding: 14px 0;
  overflow: hidden;
  white-space: nowrap;
}

.proof-track {
  display: inline-flex;
  gap: 0;
  animation: marquee 28s linear infinite;
}

.proof-item {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 48px;
  border-right: 1px solid var(--border-subtle);
}

.proof-value {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.proof-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

> **Note:** Duplicate the `.proof-track` content once in the HTML (two identical `<div class="proof-track">`) so the marquee loops seamlessly.

---

## 11. Scroll Animations

Add `data-animate` to any element that should fade up on scroll. One global observer handles all of them:

```tsx
// hooks/useScrollReveal.ts
'use client'
import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          const delay = el.dataset.delay ?? '0'
          el.style.transitionDelay = `${delay}ms`
          el.classList.add('revealed')
          io.unobserve(el)
        }
      })
    }, { threshold: 0.12 })

    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
```

```css
/* In globals.css */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-animate].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

Usage in JSX:
```tsx
<h2 data-animate data-delay="0">Shipped Work</h2>
<p  data-animate data-delay="80">4 projects that went from idea → live</p>
```

---

## 12. What NOT to Add

A list of temptations to refuse:

- No `box-shadow` anywhere except optional focus rings on inputs
- No `border-radius` above `6px` (the vibe is precise, not rounded)
- No hover color on the `--bg-base` page background
- No second accent color beyond `--accent` and `--pm`
- No particle effects, Three.js, WebGL
- No gradient on body or any large surface
- No skill bars (already in spec — repeating for emphasis)
- No second custom cursor variant beyond what's in section 3
- No entrance animation on the nav itself — it's always present

---

## 13. Implementation Order

1. `globals.css` → replace color tokens, add noise layer, add cursor CSS, add card system
2. `cursor.tsx` → build and import into `layout.tsx`
3. `nav.tsx` → rebuild with new structure and CSS
4. `layout.tsx` → import cursor, import Syne + IBM Plex Sans fonts
5. All section components → add `data-animate` attributes
6. Test: hover over nav links (active indicator), cross into PM section (cursor changes), hover project card (cursor expands with VIEW text)

---

*Everything in this file maps directly to files in the spec's section 10 file tree. No new files required except `cursor.tsx` and optionally `hooks/useScrollReveal.ts`.*
