# Portfolio review — October 29, 2026

## Implemented

- Updated AI Interview Coach to InterviewAce using the current project README: voice-first interviews, adaptive follow-ups, Answer Lab, persistent learning history, and the hosted speech/model stack. Linked the documented Azure pilot instead of the outdated GitHub Pages prototype.
- Added Relay Voice from `solmyst/calling-sas`. Described browser conversations, interruption, session memory, and local follow-up review. Labelled it a demo; no telephone dialing or external CRM/calendar action is implied. No public demo link was invented.
- Featured these two projects directly after the introduction and proof strip. Retained all seven other projects and their case studies in an expandable archive.
- Replaced the first-visit loading screen and its 6.7-second hero delay with immediately rendered content. Removed the custom cursor from the page shell so standard pointer and text-selection behavior remain available.
- Gave the opening a clearer typographic hierarchy and direct work/resume actions. Retained the dark identity, indigo accent, light mode, personal content, experience, decisions log, and interactive experiment.
- Replaced cards that resized and collapsed other projects with independent native disclosures. Source links remain visible, and opening a case study does not change the other cards.
- Added a skip link, focus indicators, anchor offsets, Escape handling for the mobile navigation, and reduced-motion CSS. Improved secondary and tertiary text colors. Replaced the mobile stats marquee with a static grid and displayed team attribution beside the Park+ metrics.
- Updated the decisions log, current work, and timeline to reflect both projects. Kept project decision references stable by ID.

## Content sources

- InterviewAce: https://github.com/solmyst/AI-Powered-Interview-Coaching/blob/main/README.md
- Relay Voice: https://github.com/solmyst/calling-sas/blob/main/README.md
- Relay interface image: `calling-sas/docs/dashboard.png`, labelled as an early interface with simulated example data. It is not a claim about production activity or the current deployed dashboard.

## Next improvements, in priority order

1. **Show the products in use.** Record a short InterviewAce session showing a spoken answer, evidence-based report, and Answer Lab retry. Record a Relay interruption, corrected preference, and reviewed follow-up. Use synthetic demo input and captions. A current screenshot can replace InterviewAce's clearly labelled workflow illustration.
2. **Strengthen case-study evidence.** Add your role, development period, constraints, one difficult tradeoff, and what changed after user feedback. Include measured usage or learning outcomes only when collected; do not substitute test counts or technical features for user impact.
3. **Make the long page more focused.** Test whether recruiters reach the contact section. Consider consolidating the dual-identity explanation and decisions log, and moving the sand experiment into the project archive. Preserve the playful identity while reducing repeated positioning.
4. **Unify the remaining visual system.** Extend the new heading hierarchy and restrained borders to the older experience, skills, about, and contact components. Review the terminal flourishes and very small labels on real phones; retain details that help communicate your work.
5. **Add sharing assets and settle the canonical domain.** The repository's CNAME and metadata use `anush.tech`, while its GitHub homepage says `anushgupta.tech`. Confirm the intended production domain before changing redirects, canonical metadata, sitemap, or DNS. Add a real Open Graph image for better link previews.
6. **Measure navigation and contact intent.** If wanted, add privacy-conscious analytics for resume opens, project opens, and email-link clicks. Use the results to tune ordering and content. No analytics or third-party tracking was added in this update.
7. **Schedule dependency maintenance.** The unchanged lockfile reports 10 audit findings (1 moderate, 8 high, 1 critical). Triage the actual affected paths and supported Next.js upgrade separately, with build and browser regression checks. This refresh does not change dependencies.

## Acceptance and verification

- Production static export: `npm run build`, including Next.js lint/type validation.
- Dedicated type check: `npm run type-check`.
- Local static preview returns HTTP 200.
- Browser review at 320, 768, 1024, and 1440 pixels: no horizontal overflow observed in the hero, project section, or navigation.
- Tested case studies using Enter, including simultaneous expansion; tested project archive, mobile menu, Escape closing, and light/dark switching.
- No portfolio-origin console errors observed in the inspected browser log.

## Limits

This is a focused source and UI update, not a complete WCAG audit, cross-browser certification, performance benchmark, or end-to-end verification of the linked AI applications. Existing project outcomes and experience claims outside the two updated projects were preserved rather than independently revalidated. The screenshot is an early demo image. GitHub Pages production remains unchanged until the review branch is merged through the existing deployment workflow.
