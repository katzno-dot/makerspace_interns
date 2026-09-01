/* ============================================================
   THE MAKERSPACE — interactions
   Content data lives in the arrays below — edit here to revise copy.
============================================================= */

const DISCOVERY = [
  { q: "What is the tool called?", a: "Every entry starts with a clear name — no mystery machines in the catalogue." },
  { q: "Where is it found?", a: "Future interns need to actually locate it, not just know it exists." },
  { q: "What is its purpose?", a: "The job the tool was built to do, in plain language." },
  { q: "What are its important parts?", a: "Naming the parts helps you talk about the tool accurately and safely." },
  { q: "How does it work?", a: "The basic mechanism — enough to understand it, not a full manual." },
  { q: "What materials can and cannot be used?", a: "Using the wrong material is one of the fastest ways to cause damage or injury." },
  { q: "What hazards and safety features should we notice?", a: "Spotting risks before you start is what keeps the whole space safe." },
  { q: "What permission, supervision, or PPE is required?", a: "Some tools need a teacher present, some need goggles — know before you go." },
  { q: "What can we safely test or make?", a: "A safe, appropriate first project keeps exploration low-risk." },
  { q: "Where did our information come from?", a: "Good catalogues cite reliable sources, not guesses." },
  { q: "What are we certain about — and what's still unclear?", a: "Strong investigators are honest about the edges of their knowledge." },
];

const STEPS = [
  { title: "Observe", body: "Observe the tool without rushing to touch it. Slow down and look first." },
  { title: "Record", body: "Record clues, labels, questions, and possible hazards you notice." },
  { title: "Research", body: "Research reliable sources to fill in what observation alone can't tell you." },
  { title: "Learn Safety", body: "Learn the safety requirements before anything is powered on or picked up." },
  { title: "Plan a Test", body: "Plan a teacher-approved test — nothing hands-on happens without a plan." },
  { title: "Explore", body: "Explore what the tool can do, within the boundaries you've planned." },
  { title: "Make or Test", body: "Make or test something when appropriate, applying what you've learned." },
  { title: "Catalogue It", body: "Create the first catalogue entry so the next intern benefits from your work." },
];

const CYCLE = [
  "Explore the space",
  "Choose a tool",
  "Observe and research",
  "Check safety",
  "Test and make",
  "Add it to the catalogue",
  "Improve the guide",
  "Begin the next mission",
];

/* ---------- nav toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener("click", () => navMenu?.classList.remove("is-open"));
});

/* ---------- scroll progress ---------- */
const progressFill = document.getElementById("progressFill");
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  progressFill.style.width = max > 0 ? `${(scrolled / max) * 100}%` : "0%";
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* ---------- trail navigation ---------- */
document.querySelectorAll(".trail__node").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ---------- hero sunburst rays ---------- */
(function buildBurst() {
  const g = document.querySelector(".burst-rays");
  if (!g) return;
  const rayCount = 24;
  const colors = ["#CB5A28", "#2B6E6B", "#E3A72D", "#A63D2F"];
  for (let i = 0; i < rayCount; i++) {
    const angle = (360 / rayCount) * i;
    const long = i % 2 === 0;
    const len = long ? 210 : 165;
    const width = long ? 16 : 9;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 300 - width / 2);
    rect.setAttribute("y", 300 - len);
    rect.setAttribute("width", width);
    rect.setAttribute("height", len - 130);
    rect.setAttribute("rx", width / 2);
    rect.setAttribute("fill", colors[i % colors.length]);
    rect.setAttribute("opacity", "0.85");
    rect.setAttribute("transform", `rotate(${angle} 300 300)`);
    g.appendChild(rect);
  }
})();

/* ---------- discovery guide flip cards ---------- */
(function buildDiscoveryGuide() {
  const grid = document.getElementById("discovery-guide");
  if (!grid) return;
  DISCOVERY.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Question ${i + 1}: ${item.q}. Activate to reveal why it matters.`);
    card.innerHTML = `
      <div class="flip-card__inner">
        <div class="flip-card__face flip-card__face--front">
          <span class="flip-card__hint">Question ${i + 1}</span>
          <span class="flip-card__q">${item.q}</span>
          <span class="flip-card__hint">Tap to flip</span>
        </div>
        <div class="flip-card__face flip-card__face--back">
          <span class="flip-card__hint">Why it matters</span>
          <span class="flip-card__a">${item.a}</span>
        </div>
      </div>`;
    const flip = () => card.classList.toggle("is-flipped");
    card.addEventListener("click", flip);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    grid.appendChild(card);
  });
})();

/* ---------- stepper (mission 5) ---------- */
(function buildStepper() {
  const panel = document.getElementById("stepperPanel");
  const dots = Array.from(document.querySelectorAll(".stepper__dot"));
  const prevBtn = document.getElementById("stepPrev");
  const nextBtn = document.getElementById("stepNext");
  if (!panel) return;
  let current = 0;

  function render() {
    const step = STEPS[current];
    panel.innerHTML = `<h3>Step ${current + 1} — ${step.title}</h3><p>${step.body}</p>`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      dot.classList.toggle("is-done", i < current);
    });
    prevBtn.disabled = current === 0;
    prevBtn.style.opacity = current === 0 ? 0.4 : 1;
    nextBtn.textContent = current === STEPS.length - 1 ? "Done" : "Next";
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => { current = i; render(); }));
  prevBtn.addEventListener("click", () => { if (current > 0) { current--; render(); } });
  nextBtn.addEventListener("click", () => {
    if (current < STEPS.length - 1) { current++; render(); }
  });
  render();
})();

/* ---------- review checklist (mission 6) ---------- */
document.querySelectorAll(".check-card").forEach(card => {
  card.addEventListener("click", () => card.classList.toggle("is-checked"));
});

/* ---------- cycle diagram ---------- */
(function buildCycle() {
  const nodesWrap = document.getElementById("cycleNodes");
  const indexEl = document.getElementById("cycleIndex");
  const labelEl = document.getElementById("cycleLabel");
  const progressRing = document.getElementById("cycleProgress");
  if (!nodesWrap) return;

  const R = 190, CX = 240, CY = 240;
  const circumference = 2 * Math.PI * R;
  progressRing.style.strokeDasharray = `${circumference}`;

  const nodeEls = CYCLE.map((label, i) => {
    const angle = (360 / CYCLE.length) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x = CX + R * Math.cos(rad);
    const y = CY + R * Math.sin(rad);
    const node = document.createElement("button");
    node.className = "cycle__node";
    node.style.left = `${(x / 480) * 100}%`;
    node.style.top = `${(y / 480) * 100}%`;
    node.textContent = i + 1;
    node.setAttribute("aria-label", label);
    nodesWrap.appendChild(node);
    return node;
  });

  let active = 0;
  let timer;

  function setActive(i) {
    active = i;
    nodeEls.forEach((n, idx) => n.classList.toggle("is-active", idx === i));
    indexEl.textContent = String(i + 1).padStart(2, "0");
    labelEl.textContent = CYCLE[i];
    const offset = circumference - (circumference * (i + 1)) / CYCLE.length;
    progressRing.style.strokeDashoffset = offset;
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => setActive((active + 1) % CYCLE.length), 2600);
  }

  nodeEls.forEach((node, i) => {
    node.addEventListener("click", () => { setActive(i); startAuto(); });
  });

  setActive(0);
  startAuto();

  const cycleSection = document.getElementById("cycle");
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) clearInterval(timer); else startAuto(); });
  }, { threshold: 0.2 });
  if (cycleSection) io.observe(cycleSection);
})();

/* ---------- scroll reveal ---------- */
(function scrollReveal() {
  const targets = document.querySelectorAll(
    ".mission__intro, .trait-grid, .zone-grid, .catalogue-card, .flip-grid, .stepper, .check-card-list, .chip-grid, .mission-final__inner"
  );
  targets.forEach(t => t.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
})();
