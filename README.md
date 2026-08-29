# Makerspace Internship — Course Story Map

An interactive, single-scroll story map that walks a Grade 6–8 class through the entire *Makerspace Internship* course framework — from the central course question, through the Tool Discovery Cycle, the semester architecture, and team roles, ending in a fully interactive project rubric.

Built as a static site: **no build step, no dependencies to install.** Open `index.html` in a browser, or publish the folder with GitHub Pages.

## Files

- `index.html` — page structure and content scaffolding
- `styles.css` — the full design system (see below)
- `script.js` — all interactivity and the course content data (cycle stages, catalogue modules, semester phases, rubric criteria, etc.)

## Design direction

The visual language is a deliberate fusion of two aesthetics, each assigned a specific job so they reinforce rather than compete:

- **Bento Box** governs the *structural logic*: modular rounded cards, grid-based sections, icon + label clarity, and small hover/flip/expand micro-interactions.
- **Neo-Brutalism** governs the *palette and edge treatment*: a warm neutral cream base punched through with four bold accents (cobalt blue, amber, crimson red, green), thick black ink borders, and hard offset drop-shadows instead of soft blur.
- **Typography** bridges both: Space Grotesk (bold, geometric, confident) for headlines and UI labels, Inter (clean, humanist, highly readable) for body copy.

## Interactive / animated elements

- Animated scroll-progress rail and active-section navigation highlighting
- A clickable, auto-advancing circular diagram for the 8-stage **Tool Discovery Cycle**, with a progress ring and detail panel
- 12 expandable tiles for the **shared tool-catalogue structure**
- Flip cards for **portfolio reflection prompts** and **team roles**
- An expandable **7-phase semester timeline**
- An animated **donut chart** breaking down the 70-minute class rhythm
- A **level picker** that swaps live text across the 4-standard assessment framework
- A finale **interactive rubric**: drag-to-score sliders across Criteria A–D with a live animated point total (out of 32), a full expandable accordion of every rubric level and evidence type, a clickable Intern Habits table, and self-assessment prompt cards
- Scroll-reveal animations throughout, with `prefers-reduced-motion` respected

## Source content

All course content (course purpose, the Tool Discovery Cycle, catalogue structure, portfolio guidance, semester architecture, class rhythm, team roles, assessment framework, Workspace structure, and the full 4-criterion / 32-point rubric plus Intern Habits and self-assessment prompts) is drawn directly from the two source documents:

- *Makerspace Internship: Course Framework*
- *Makerspace Internship Project Rubric*

## Customizing

- Swap the accent colors by editing the CSS custom properties at the top of `styles.css` (`--blue`, `--amber`, `--red`, `--green`).
- All copy lives in the data arrays at the top of each section in `script.js` (e.g. `CYCLE`, `CATALOGUE`, `PHASES`, `CRITERIA`) — edit the arrays, not the markup, to update content.
- Fonts and the GSAP/ScrollTrigger animation library load from CDN (Google Fonts + cdnjs); no local install needed, but an internet connection is required for those enhancements. The page still functions fully without them (system-font fallback, and all interactivity is vanilla JS).

## Deploying with GitHub Pages

1. Push this folder to a repository.
2. In the repo settings, enable **Pages** and point it at the branch/root containing `index.html`.
3. Done — no build step required.
