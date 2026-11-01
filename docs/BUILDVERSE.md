# Buildverse — November 1, 2026

## Direction

A bespoke explorable product diorama, not a streaming-service clone. Use the interaction principle of a portfolio-as-place while making the objects, navigation, and writing specific to Anush's projects. Keep the earlier design on its branch.

## Acceptance

- A genuine Three.js world with five project landmarks, visible names, pointer selection, and equivalent keyboard-accessible buttons.
- InterviewAce studio, Relay Voice tower, krate container yard, Resume Tailor press, and the Sand experiment each open the correct project story.
- The quick tour steps through three real projects; discovery progress reflects visited stories, never fabricated proficiency or professional metrics.
- Project field guide includes all projects, working category filters, saved visited states for the browser session, and direct live/source links.
- Native project dialog supports Escape, closing, focus containment, and return to the opening control.
- Resume, contact, and a straightforward text portfolio remain available without completing a game or using WebGL.
- Motion can pause; OS reduced-motion is respected. The world does not render continuously off-screen or in hidden tabs, and GPU resources are disposed on unmount.
- Responsive at 320, 768, 1024, 1440 pixels, no blocked content when WebGL fails, no console errors, build/type/lint gates pass.

## References

- https://bruno-simon.com/ — interaction reference: a portfolio can be a place to explore; do not copy the driving game, world, assets, or layout.
- https://brittanychiang.com/ — information clarity reference: make work and professional context immediately accessible.
- Netflix-inspired portfolio search results were reviewed for interaction patterns and rejected as the visual direction following the user's correction.

## Scope

Procedural local assets, existing Next.js/Three.js/Framer Motion dependencies, existing verified project content. No accounts, external analytics, sound autoplay, new provider integrations, or production deployment.

## Implementation and verification notes

- Built the diorama procedurally in Three.js: studio, voice antenna, container yard, resume workshop, sandbox, trees, and a small F1 silhouette. No external models or copied artwork.
- Added drag-to-turn, a bird's-eye/isometric camera switch, rotation reset, pause, reduced-motion handling, and an interactive fallback map. Project labels remain ordinary accessible buttons, independent of WebGL hit testing.
- Session discovery tracks opened project stories. Five map stops and all nine field-guide entries use the existing project records; the three-stop tour is InterviewAce → Relay Voice → krate.
- Native modal: story/build/decisions views, visible tour controls, contained scrolling, Escape, focus return, and original source/live links.
- Browser checks: tour sequence and completion; field-guide district counts (AI 4, Systems 2, Playground 3); no-results recovery to all 9; session progress after reload; keyboard opening/Escape focus restoration; five-stop discovery completion.
- Responsive checks at 320/768/1024/1440 pixels found no horizontal overflow. The mobile view uses numbered map pins with a labelled project key.
- Production export and TypeScript checks pass. The existing caniuse-lite data emits a maintenance notice during build; dependencies were not changed in this iteration.

This is a focused creative implementation, not a guarantee that no other website shares any concept. The world is intentionally small and the professional portfolio is one click away. WebGL fallback and reduced-motion behavior are implemented; browser emulation of unavailable WebGL and the OS motion setting was not performed.

Final interaction checks also covered selecting an actual 3D building (Resume Tailor), dragging the world without accidentally opening a story, the alternate camera view, rotation reset, and explicit backward/forward focus wrapping in the modal. The full professional story is inside the main landmark. No runtime console errors or warnings were observed in the final inspected preview.

The final build also verifies that the world pause freezes the rendered viewport (matching screenshot hashes), and that closing a story opened through a 3D object returns focus to its corresponding labelled map pin.
