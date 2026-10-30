# Portfolio design direction — October 30, 2026

## Intent

Continue the portfolio concept on `feat/portfolio-design-direction`, branched from `feat/portfolio-project-refresh`. Keep the original draft available while taking this version toward a richer professional identity, a genuine interactive 3D canvas, and a coherent page from introduction to contact.

## Palette

| Role | Dark | Light |
| --- | --- | --- |
| Canvas | Midnight `#0a121b` | Warm ivory `#f7f4ed` |
| Surface | Navy `#101c27` | Soft white `#fffdf7` |
| Primary text | Ivory `#f5f2e9` | Ink `#1c262a` |
| Accent | Champagne `#e1c38f` | Bronze `#7e5720` |
| Secondary accent | Jade `#7cc5b5` | Deep jade `#256d65` |

CSS variables define both palettes. Tailwind now maps the portfolio's semantic background, text, accent, and border classes to those variables; the previous configuration only declared background/foreground. Body copy uses Inter, metadata uses JetBrains Mono, and a restrained serif italic gives the hero and contact headings a warmer finish.

## 3D and motion

- A procedural Three.js scene shows three connected layers for research, building, and iteration. A small orbiting node and pointer response add movement without placing essential information inside the canvas.
- The scene is dynamically imported; no external models, image textures, credentials, or asset services are required.
- Rendering is capped at 30fps and device pixel ratio 1.5. The animation loop stops while the scene is off-screen, the document is hidden, motion is paused, or the OS requests reduced motion.
- ResizeObserver updates the camera and renderer. Cleanup disconnects observers/listeners and disposes geometries, materials, and renderer resources.
- A CSS illustration remains available when WebGL cannot initialize or the context is lost. Portfolio text and links are independent of 3D support.
- A labelled pause/resume control is keyboard-accessible. Reduced-motion users see a static composition and a Still mode label.
- Brief hero entrance animations and small action/link hover responses complement the scene. CSS disables these transitions for reduced motion.

Implementation references: [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer), [resource cleanup](https://threejs.org/manual/pages/cleanup.html).

## Page composition

1. Introduction and 3D build loop, with direct links to the two featured projects.
2. Attributed experience metrics and the InterviewAce / Relay Voice case studies inherited from the first draft.
3. Experience as a compact editorial list; the first role's contributions are open initially, and all achievements remain available.
4. Product and engineering lenses alongside native decision disclosures. Both alternatives remain readable; the selected approach has an explicit text label.
5. Toolkit as grouped rows rather than large animated skill cards.
6. About as a readable timeline and a current-work note. Certification and personal-interest content is retained.
7. Sand playground after the professional story, with keyboard-friendly Add sand, color, pause, and reset controls. Pointer input works from the first press, including touch; reset does not reload the page.
8. A clear email/resume/contact panel and a quiet footer. Removed the unverified Lighthouse badge rather than presenting it as measured performance.

## Verification

- Production static export, lint/type validation, dedicated TypeScript check, and `git diff --check`.
- Browser validation at 320, 768, 1024, and 1440px; tablet sand-control overflow corrected with wrapping.
- Actual WebGL scene observed, with a clean preview console.
- Compared two canvas-region screenshots while paused: identical image hashes. Resume control restores the running state.
- Keyboard activation of experience and decision disclosures; selected decision option label checked.
- Mobile menu opening and Escape closing; light/dark switching.
- Sand added through keyboard input, visible color changes, pause state, and a visibly empty canvas after reset.

## Boundaries

No production deployment, domain/DNS change, analytics, fabricated metrics, video demos, or external calling integration is included. The previous draft remains open. Reduced-motion and WebGL-fallback paths are implemented but were not forced through browser emulation in this pass. This is not a full accessibility audit or a controlled performance benchmark; the on-demand 3D bundle adds work on capable devices. Existing dependency audit findings remain unchanged after adding Three.js.
