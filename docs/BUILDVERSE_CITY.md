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

Pure navigation tests cover project/building coverage, movement speed bounds, collision/edge sliding, nearby entrances, and valid/invalid floor deep links. Browser tests must cover actual room changes, dossier content, URL navigation, walking, mobile HUD, and canvas rendering.

Three.js reference: https://threejs.org/docs/pages/OrbitControls.html and https://threejs.org/docs/pages/Raycaster.html. No downloaded 3D models or copied portfolio assets.
