# The Makerspace — Internship Mission Guide

An interactive, animated mission guide built from the *Internship Mission: The Makerspace* document, for grade 6–8 students. Mid-century modern visual theme (mustard, burnt orange, teal, avocado, cream, walnut ink) with a sunburst hero, a clickable mission trail, flip cards, a step-through investigation walkthrough, and an animated internship-cycle diagram.

## Files
- `index.html` — page structure and copy
- `styles.css` — mid-century modern design system (colors, type, layout)
- `script.js` — all interactivity; **content arrays live at the top of this file** (`DISCOVERY`, `STEPS`, `CYCLE`) — edit there to change copy without touching markup
- `README.md` — this file

## How to view
Open `index.html` directly in any modern browser, or for the best experience serve the folder locally (e.g. `python3 -m http.server`) and visit it in your browser.

## Publish on GitHub Pages
1. Create a new GitHub repository and upload these four files to the root (or push them with git).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch," branch `main`, folder `/ (root)`.
4. Save — GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Structure of the page
1. **Hero** — title, tagline, animated sunburst
2. **Mission Trail** — clickable overview of all 8 stops (Missions 1–7 + Final)
3. **Mission 1 — Join the Team** — intern traits grid
4. **Mission 2 — Map the Makerspace** — zone cards (Building, Textiles, Digital Fabrication, Cooking, Growing)
5. **Mission 3 — Plan the Tool Catalogue** — what the catalogue will contain
6. **Mission 4 — Build the Tool Discovery Guide** — 11 flip cards (question front, "why it matters" back)
7. **Mission 5 — Complete the First Tool Investigation** — 8-step interactive stepper
8. **Mission 6 — Review and Upgrade** — tappable review checklist
9. **Mission 7 — Lead a New Investigation** — responsibility chips
10. **Final Mission — Pass It On** — closing statement
11. **The Internship Cycle** — animated circular diagram of the 8-stage loop, auto-advances and is clickable
12. **Footer**

## Design notes
- Type: Poppins (display) + Work Sans (body)
- Motion: ambient hero sunburst rotation, scroll-triggered reveals, auto-advancing cycle diagram (pauses off-screen), all animation respects `prefers-reduced-motion`
- Fully responsive from mobile through desktop; keyboard-focusable interactive elements (flip cards, stepper, checklist, cycle nodes)
