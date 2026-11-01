# Buildverse City

The whole portfolio becomes one spatial experience. There is no scrolling landing page, project grid, or professional section beneath the canvas. Fourteen destinations house all nine projects, experience, skills, biography, decisions, and contact. Each project has three physical floors: problem/outcome, engineering, and decisions. Public buildings use content-driven floor counts.

## Interaction contract

- Full-viewport 3D city with perspective camera, zoom/orbit, streets, an avatar, and multi-storey buildings.
- Click a facade floor or use the directory to visit it. Enter the floor for a furnished, cutaway 3D room. Select the room display to read its complete dossier.
- WASD/arrow keys move the citizen, bounded by the district and blocked by building footprints; E enters a nearby doorway. A touch direction pad provides the same movement.
- The floor selector works as an elevator. City overview, exit, camera reset, day/night, animation pause, and minimap remain reachable.
- Floor/dossier URLs are shareable hashes. Browser back/forward resolves the same destination. Unknown floors do not crash the city.
- Readable HTML pages and HUD controls are allowed when entering a place, as requested. They are not a second 2D portfolio. A directory is also the keyboard and WebGL-unavailable navigation path.
- Actual career/project content is reused, not replaced with decorative or invented activity. No account, chat API, fake player count, or production deployment.

## Verification

Eight automated tests cover project/building coverage, all 50 floors’ written content, movement speed bounds, collision/edge sliding, nearby entrances, valid/invalid floor deep links, and finite/pickable architectural geometry at every address. These tests also run in CI. The production static export, ESLint, and TypeScript checks pass.

Browser verification covers rendered city and furnished rooms, clicking the physical display, elevators (including the eighth skills floor), dossier content, back/forward routes, walking, E door entry, return to street, day/night, and native dialog focus wrapping. Responsive checks cover 320, 375, 768, 1024, and 1440 pixel widths. The production browser console is free of errors and warnings. The avatar uses footprint collision outdoors and bounded movement indoors; furniture is decorative rather than a physics simulation.

Three.js reference: https://threejs.org/docs/pages/OrbitControls.html and https://threejs.org/docs/pages/Raycaster.html. No downloaded 3D models or copied portfolio assets.

## Architecture and rendering

Each address has its own massing: interlocked workshop volumes, curved-eave studios, ribbon tower, folded atelier, offset capsules, twin-pier headquarters, helical academy, aerodynamic garage, timber gateway, orbital observatory, dune terraces, pixel clusters, tiered library, and lotus terminal. The roofs are original generated meshes inspired by East Asian architectural forms. All 50 content floors retain their own picking identity after static facade meshes are batched by material.

Rounded edges, smooth cylinders, procedural roughness, distinct stone/wood/metal/glass materials, and a locally generated environment map improve surface quality. Rendering targets 60 frames per second with time-based camera easing and damped orbit/zoom. Desktop pixel ratio is capped at 2 and mobile at 1.75; actual frame rate depends on the device. A pond, curved footbridge, bamboo, and blossom trees frame the district.

Rendering references: https://threejs.org/docs/pages/WebGLRenderer.html and https://threejs.org/docs/pages/RoomEnvironment.html.
