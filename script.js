/* ==========================================================================
   MAKERSPACE INTERNSHIP — COURSE STORY MAP
   All interactive behavior + course content data.
   ========================================================================== */

(function(){
"use strict";

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); }

/* ==========================================================================
   1. NAV — scroll progress, active link, mobile toggle
   ========================================================================== */
const progressFill = document.getElementById('progressFill');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressFill.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive:true });
updateProgress();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded','false');
}));

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach(s => navObserver.observe(s));

/* ==========================================================================
   2. SCROLL REVEAL — [data-reveal]
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

function observeReveals(root){
  root.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   3. TOOL DISCOVERY CYCLE
   ========================================================================== */
const CYCLE = [
  {
    name:'Notice', copy:'Students encounter and observe the tool before operating it. This stage encourages curiosity without unsafe trial and error.',
    items:['What do we notice?','What might it do?','What clues can we find in its shape, controls, labels, location, or accessories?','What do we already think we know?','What should we not assume?']
  },
  {
    name:'Question', copy:'The team creates an initial list of questions and sorts them into categories. Students identify which questions must be answered before the tool can be turned on or used.',
    items:['Purpose','Parts and controls','Inputs and outputs','Materials','Setup','Operation','Safety','Quality and accuracy','Cleanup and storage','Maintenance','Common problems','Possible uses']
  },
  {
    name:'Investigate', copy:'Students gather information from several kinds of evidence, and learn to distinguish manufacturer instructions from local rules, team observations, and unverified ideas.',
    items:['Labels and markings on the tool','Manufacturer manuals','Teacher or expert demonstrations','Printed reference materials','Short, selected videos','Careful observation','Existing makerspace procedures','Controlled testing']
  },
  {
    name:'Prepare for Safe Use', copy:'Inquiry has a safety boundary: students may discover uses, settings, and techniques — but not hazards through unstructured experimentation. The teacher sets non-negotiable safety requirements first.',
    items:['Likely hazards','Required personal protective equipment','Clothing, hair, jewelry, and workspace expectations','Safe and unsafe materials','Setup and inspection procedures','Operating boundaries','What requires teacher assistance','How to stop the tool','What to do if something goes wrong','Cleanup, shutdown, and storage procedures']
  },
  {
    name:'Practice & Test', copy:'Students begin with small, low-cost, teacher-approved tests. A test should change one meaningful variable at a time, and every test gets recorded.',
    items:['Material','Tool attachment','Speed or setting','Pressure','Measurement','File type','Design choice','Technique','Record: what changed, what we expected, what happened, evidence, what we’d change next']
  },
  {
    name:'Make', copy:'The team creates a small product or demonstration that shows an authentic use of the tool. It need not be elaborate — it needs to show real understanding.',
    items:['Choose an appropriate use','Plan before acting','Follow safety procedures','Apply what they learned through testing','Evaluate the result','Explain their decisions']
  },
  {
    name:'Teach', copy:'Students prepare an explanation for a novice. Teaching reveals misconceptions that may remain hidden when students only make something.',
    items:['A live demonstration','A tool orientation card','An annotated photograph','A diagram','A short procedure','A troubleshooting guide','A materials chart','A brief teacher-approved video']
  },
  {
    name:'Reflect & Publish', copy:'The team improves and submits its catalogue entry. Each student separately updates their portfolio. The teacher verifies safety-critical information before anything is published.',
    items:['Team revises and improves the catalogue entry','Each student updates their individual portfolio','Teacher verifies safety-critical information','Entry is published as an approved makerspace resource']
  }
];

const cycleNodesEl = document.getElementById('cycleNodes');
const cycleDetailEl = document.getElementById('cycleDetail');
const cycleCenterNum = document.getElementById('cycleCenterNum');
const cycleCenterName = document.getElementById('cycleCenterName');
const cycleProgressRing = document.getElementById('cycleProgressRing');
const CYCLE_CIRCUMFERENCE = 2 * Math.PI * 248;

CYCLE.forEach((stage, i) => {
  const node = document.createElement('button');
  node.className = 'cycle-node';
  node.type = 'button';
  node.innerHTML = `<span class="n">STAGE ${i+1}</span><span class="t">${stage.name}</span>`;
  node.dataset.index = i;
  node.setAttribute('aria-label', `Stage ${i+1}: ${stage.name}`);
  cycleNodesEl.appendChild(node);
});

function layoutCycleNodes(){
  const wrap = document.querySelector('.cycle-wrap');
  if (!wrap) return;
  const size = wrap.clientWidth;
  const center = size / 2;
  const radius = size * (248/640);
  const nodes = cycleNodesEl.querySelectorAll('.cycle-node');
  nodes.forEach((node, i) => {
    const angle = (-90 + i * (360/CYCLE.length)) * Math.PI / 180;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    node.style.left = x + 'px';
    node.style.top = y + 'px';
  });
}

function renderCycleDetail(i){
  const stage = CYCLE[i];
  cycleCenterNum.textContent = String(i+1).padStart(2,'0');
  cycleCenterName.textContent = stage.name;
  cycleDetailEl.innerHTML = `
    <span class="cycle-detail-eyebrow">Stage ${i+1} of ${CYCLE.length}</span>
    <h3 class="cycle-detail-title">${stage.name}</h3>
    <p class="cycle-detail-copy">${stage.copy}</p>
    <ul class="cycle-detail-list">${stage.items.map(it => `<li>${it}</li>`).join('')}</ul>
  `;
  const offset = CYCLE_CIRCUMFERENCE * (1 - (i+1)/CYCLE.length);
  cycleProgressRing.style.strokeDashoffset = offset;
  cycleNodesEl.querySelectorAll('.cycle-node').forEach(n => n.classList.toggle('active', Number(n.dataset.index) === i));
}

let cycleActive = 0;
cycleNodesEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.cycle-node');
  if (!btn) return;
  cycleActive = Number(btn.dataset.index);
  renderCycleDetail(cycleActive);
});

let cycleAuto = null;
function startCycleAuto(){
  if (reduceMotion) return;
  cycleAuto = setInterval(() => {
    cycleActive = (cycleActive + 1) % CYCLE.length;
    renderCycleDetail(cycleActive);
  }, 4200);
}
function stopCycleAuto(){ if (cycleAuto) clearInterval(cycleAuto); }
document.querySelector('.cycle-wrap').addEventListener('mouseenter', stopCycleAuto);
document.getElementById('cycleDetail').addEventListener('mouseenter', stopCycleAuto);
document.querySelector('.cycle-wrap').addEventListener('mouseleave', startCycleAuto);

window.addEventListener('resize', layoutCycleNodes);
layoutCycleNodes();
renderCycleDetail(0);
startCycleAuto();

/* ==========================================================================
   4. CATALOGUE STRUCTURE — 12 modules
   ========================================================================== */
const CATALOGUE = [
  { icon:'🪪', title:'Tool identity', body:'Common and official name, photograph, location, manufacturer and model when relevant.' },
  { icon:'🎯', title:'Purpose', body:'What it does, what it does not do, and typical uses.' },
  { icon:'⚙️', title:'How it works', body:'Important parts, controls, inputs and outputs, and a simple explanation of the underlying process.' },
  { icon:'🧵', title:'Materials & accessories', body:'Appropriate materials, prohibited or questionable materials, and attachments, bits, blades, files, or consumables.' },
  { icon:'🧰', title:'Before use', body:'Inspection, workspace preparation, setup, and required permission and supervision.' },
  { icon:'🦺', title:'Safety', body:'Hazards, PPE, safe operating boundaries, emergency stop or shutdown, and what requires teacher help.' },
  { icon:'🔁', title:'Basic workflow', body:'Prepare, set up, operate, inspect the result, shut down, clean and store.' },
  { icon:'🎚️', title:'Variables that affect results', body:'Settings, materials, technique, measurements, and environmental factors if relevant.' },
  { icon:'🧯', title:'Troubleshooting', body:'Common symptoms, likely causes, safe next steps, and when to stop and ask for help.' },
  { icon:'🔗', title:'Evidence & sources', body:'Manual, manufacturer information, test results, expert consulted, and date checked.' },
  { icon:'🧩', title:'Examples', body:'Student test pieces, possible projects, and limitations discovered.' },
  { icon:'✅', title:'Review status', body:'Draft, peer reviewed, teacher verified, and revision date.' }
];
const catalogueGrid = document.getElementById('catalogueGrid');
CATALOGUE.forEach((mod, i) => {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'cat-tile';
  tile.setAttribute('data-reveal','');
  tile.innerHTML = `
    <span class="cat-tile-num">MODULE ${String(i+1).padStart(2,'0')}</span>
    <span class="cat-tile-title"><span class="cat-tile-icon">${mod.icon}</span>${mod.title}</span>
    <span class="cat-tile-body">${mod.body}</span>
  `;
  tile.addEventListener('click', () => tile.classList.toggle('open'));
  catalogueGrid.appendChild(tile);
});

/* ==========================================================================
   5. PORTFOLIO — reflection flip cards
   ========================================================================== */
const REFLECTIONS = [
  { q:'What did I believe at first that I later changed?' },
  { q:'Which evidence most influenced our decisions?' },
  { q:'What can I now do or explain that I could not do before?' },
  { q:'Where do I still need supervision or practice?' },
  { q:'What did I contribute to the team?' },
  { q:'What should the next group investigate?' }
];
const reflectCards = document.getElementById('reflectCards');
REFLECTIONS.forEach((r, i) => {
  const card = document.createElement('div');
  card.className = 'flip-card';
  card.innerHTML = `
    <div class="flip-card-inner">
      <div class="flip-face flip-front">Prompt ${i+1}</div>
      <div class="flip-face flip-back">${r.q}</div>
    </div>`;
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  reflectCards.appendChild(card);
});

/* ==========================================================================
   6. SEMESTER ARCHITECTURE — 7-phase timeline
   ========================================================================== */
const PHASES = [
  { title:'Becoming Makerspace Interns', duration:'~2 weeks', items:[
    'Explore the meaning of “maker,” “makerspace,” and “intern.”',
    'Tour and map the space.',
    'Notice tool families and possible ways to categorize them.',
    'Examine how rules protect people, tools, materials, and the environment.',
    'Practice routines for entry, setup, cleanup, damaged equipment, and emergencies.',
    'Co-create an initial list of “What someone needs to know about a tool.”'
  ]},
  { title:'Guided Whole-Class Investigation', duration:'~2 weeks', items:[
    'The class investigates one accessible tool together.',
    'Teacher models: observing before touching, generating questions, using a manual.',
    'Teacher models: identifying hazards, designing a controlled test, recording evidence.',
    'Teacher models: creating a simple product, drafting and reviewing a catalogue entry.',
    'This becomes the class’s example entry.'
  ]},
  { title:'Tool Cycle One', duration:'~3 weeks', items:[
    'Students work in small teams with substantial teacher guidance.',
    'Emphasis: following the complete process.',
    'Emphasis: learning productive team roles.',
    'Emphasis: creating reliable documentation.',
    'Emphasis: receiving and applying feedback.'
  ]},
  { title:'Mid-Semester Audit', duration:'~1 week', items:[
    'Teams review entries produced by others.',
    'Ask: could a beginner understand this? Is safety information easy to find?',
    'Ask: which claims have evidence? What is confusing or incomplete?',
    'Ask: does the entry help without pretending to replace supervision?',
    'The class revises its catalogue template based on what it has learned.'
  ]},
  { title:'Tool Cycle Two', duration:'~3 weeks', items:[
    'Students move into new teams and investigate another tool with greater responsibility.',
    'The teacher shifts from director to consultant, while still controlling access and safety.'
  ]},
  { title:'Tool Cycle Three — or Catalogue Improvement', duration:'~2–3 weeks', items:[
    'If the class meets closer to three times per week, students complete a third investigation.',
    'If time is tighter, they deepen, verify, and improve existing entries instead.',
    'Possible advanced work: comparing related tools, creating troubleshooting resources.',
    'Possible advanced work: testing different materials or settings.',
    'Possible advanced work: improving accessibility and clarity, producing orientation demonstrations.'
  ]},
  { title:'Handoff & Exhibition', duration:'~1 week', items:[
    'Students present a tool they investigated and something they made.',
    'Students present a discovery or failure that changed their thinking.',
    'Students present their contribution to the catalogue and evidence of individual growth.',
    'The class conducts a final handoff audit so the catalogue is useful to future makerspace users.'
  ]}
];
const timelineEl = document.getElementById('timeline');
PHASES.forEach((p, i) => {
  const item = document.createElement('div');
  item.className = 'tl-item';
  item.setAttribute('data-reveal','');
  item.innerHTML = `
    <div class="tl-head">
      <div class="tl-head-left">
        <span class="tl-phase-num">${i+1}</span>
        <span class="tl-title">${p.title}</span>
      </div>
      <div style="display:flex;align-items:center;">
        <span class="tl-duration">${p.duration}</span>
        <span class="tl-caret">▾</span>
      </div>
    </div>
    <div class="tl-body"><ul>${p.items.map(it => `<li>${it}</li>`).join('')}</ul></div>
  `;
  const head = item.querySelector('.tl-head');
  const body = item.querySelector('.tl-body');
  head.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    item.classList.toggle('open', willOpen);
    body.style.maxHeight = willOpen ? body.scrollHeight + 'px' : '0px';
  });
  timelineEl.appendChild(item);
});

/* ==========================================================================
   7. 70-MINUTE RHYTHM — donut chart
   ========================================================================== */
const RHYTHM = [
  { label:'Arrival, tool check, safety focus, team goal', mins:10, color:'var(--blue)' },
  { label:'Observation, discussion, demo, or targeted research', mins:12.5, color:'var(--amber)' },
  { label:'Hands-on investigation, testing, or making', mins:37.5, color:'var(--red)' },
  { label:'Cleanup, tool check, notebook reflection, next steps', mins:10, color:'var(--green)' }
];
const donutSvg = document.getElementById('rhythmDonut');
const rhythmLegend = document.getElementById('rhythmLegend');
const R = 90, CX = 100, CY = 100, CIRC = 2 * Math.PI * R;
let acc = 0;
RHYTHM.forEach(seg => {
  const frac = seg.mins / 70;
  const dash = frac * CIRC;
  const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
  circle.setAttribute('cx', CX); circle.setAttribute('cy', CY); circle.setAttribute('r', R);
  circle.setAttribute('fill','none');
  circle.setAttribute('stroke', seg.color.replace('var(','').replace(')','').trim().startsWith('--') ? getComputedStyle(document.documentElement).getPropertyValue(seg.color.replace('var(','').replace(')','')) : seg.color);
  circle.style.stroke = seg.color;
  circle.setAttribute('stroke-width','22');
  circle.setAttribute('stroke-dasharray', `${dash} ${CIRC - dash}`);
  circle.setAttribute('stroke-dashoffset', -acc);
  circle.style.transition = 'stroke-dasharray 1s ease';
  donutSvg.appendChild(circle);
  acc += dash;

  const row = document.createElement('div');
  row.className = 'rhythm-legend-item';
  row.setAttribute('data-reveal','');
  row.innerHTML = `
    <span class="rhythm-dot" style="background:${seg.color}"></span>
    <span class="rhythm-legend-text"><strong>${Math.round(seg.mins)} min</strong><span>${seg.label}</span></span>
  `;
  rhythmLegend.appendChild(row);
});

/* ==========================================================================
   8. ROTATING TEAM ROLES
   ========================================================================== */
const ROLES = [
  { icon:'🦺', name:'Safety Lead', body:'Checks readiness, workspace, PPE, and shutdown before and after every session.' },
  { icon:'🔍', name:'Tool Investigator', body:'Leads questions about the tool’s function and operation during Notice and Question.' },
  { icon:'🧪', name:'Test Designer', body:'Helps define variables and evidence for every controlled test.' },
  { icon:'🛠️', name:'Operator / Maker', body:'Performs the current supervised action on the tool.' },
  { icon:'📷', name:'Documentarian', body:'Records observations, diagrams, and photographs for the portfolio and catalogue.' },
  { icon:'📦', name:'Materials Manager', body:'Organizes materials, accessories, and cleanup for the whole team.' }
];
const rolesGrid = document.getElementById('rolesGrid');
const roleColors = ['var(--blue)','var(--red)','var(--green)','var(--amber)','var(--blue-deep)','var(--red-deep)'];
ROLES.forEach((r, i) => {
  const card = document.createElement('div');
  card.className = 'role-flip';
  card.setAttribute('data-reveal','');
  card.innerHTML = `
    <div class="role-flip-inner">
      <div class="role-face role-front" style="background:${i % 2 === 0 ? 'var(--paper)' : 'var(--cream)'}">
        <span class="role-icon">${r.icon}</span>
        <span class="role-name">${r.name}</span>
        <span class="role-cue">Click to see the role →</span>
      </div>
      <div class="role-face role-back" style="background:${roleColors[i % roleColors.length]}">
        <p>${r.body}</p>
      </div>
    </div>`;
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  rolesGrid.appendChild(card);
});

/* ==========================================================================
   9. ASSESSMENT FRAMEWORK — 4 standards x 4 levels
   ========================================================================== */
const STANDARDS = [
  { name:'Investigate and Understand', myp:'MYP: Inquiring and analysing', statement:'I ask useful questions and use trustworthy evidence to understand a tool and its users.' },
  { name:'Plan and Develop', myp:'MYP: Developing ideas', statement:'I plan safe tests and develop ideas based on what I discover.' },
  { name:'Make Responsibly', myp:'MYP: Creating the solution', statement:'I use tools, time, materials, and feedback responsibly to create and improve something.' },
  { name:'Evaluate and Communicate', myp:'MYP: Evaluating', statement:'I evaluate results, explain my learning, and create documentation that helps others.' }
];
const LEVELS = [
  { name:'Beginning', text:'I need substantial guidance and my evidence is incomplete.' },
  { name:'Developing', text:'I can complete parts of the process with prompts.' },
  { name:'Capable', text:'I can complete the process reliably and explain my decisions.' },
  { name:'Extending', text:'I apply the process in a new situation, improve the team’s work, and help others understand.' }
];
const standardsGrid = document.getElementById('standardsGrid');
function renderStandards(levelIndex){
  standardsGrid.innerHTML = STANDARDS.map((s, i) => `
    <div class="standard-card" data-standard="${i}" data-reveal>
      <span class="standard-name">${s.name}</span>
      <span class="standard-myp">${s.myp}</span>
      <p class="standard-quote">${levelIndex === null ? '“' + s.statement + '”' : '<strong>' + LEVELS[levelIndex].name + ':</strong> “' + LEVELS[levelIndex].text + '”'}</p>
    </div>
  `).join('');
  observeReveals(standardsGrid);
  standardsGrid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in-view'));
}
renderStandards(null);

const levelPicker = document.getElementById('levelPicker');
LEVELS.forEach((lvl, i) => {
  const btn = levelPicker.querySelector(`[data-level="${i}"]`);
  if (btn) btn.addEventListener('click', () => {
    const alreadyActive = btn.classList.contains('active');
    levelPicker.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    if (alreadyActive){ renderStandards(null); return; }
    btn.classList.add('active');
    renderStandards(i);
  });
});

/* ==========================================================================
   10. GOOGLE WORKSPACE STRUCTURE
   ========================================================================== */
const WORKSPACE = [
  { icon:'📁', name:'Google Drive', desc:'Manuals, photographs, evidence, and shared assets.' },
  { icon:'📊', name:'Google Sheet', desc:'Master tool index, team assignments, review status, and links.' },
  { icon:'📄', name:'Docs or Slides', desc:'Standard catalogue-entry template.' },
  { icon:'🌐', name:'Google Sites', desc:'Optional public-facing catalogue once entries are verified.' },
  { icon:'🗂️', name:'Individual Slides', desc:'Digital portfolio, supported by a physical maker notebook.' }
];
const workspaceGrid = document.getElementById('workspaceGrid');
WORKSPACE.forEach(w => {
  const card = document.createElement('div');
  card.className = 'ws-card';
  card.setAttribute('data-reveal','');
  card.innerHTML = `<span class="ws-icon">${w.icon}</span><span class="ws-name">${w.name}</span><span class="ws-desc">${w.desc}</span>`;
  workspaceGrid.appendChild(card);
});

/* ==========================================================================
   11. RUBRIC — score calculator
   ========================================================================== */
const CRITERIA = [
  {
    letter:'A', name:'Discover and Investigate', question:'How well did I investigate the tool before using it?',
    topLabel:'Thorough investigator',
    levels:[
      { band:'7–8 · Thorough investigator', desc:'I clearly explain the tool, its purpose, and why it is useful. I ask detailed questions about how it works, safety, materials, settings, and possible uses. I use several trustworthy sources, including a manual or expert when available. I compare information, notice disagreements, and separate verified facts from guesses.' },
      { band:'5–6 · Capable investigator', desc:'I clearly explain what the tool does and identify most of the important things we need to learn. I ask useful questions and use more than one appropriate source. I record important information about operation, materials, and safety.' },
      { band:'3–4 · Developing investigator', desc:'I give a basic explanation of the tool and ask some useful questions. My research may depend on only one source or leave important questions unanswered.' },
      { band:'1–2 · Beginning investigator', desc:'I identify the tool or give a limited description of it. My questions are very general or incomplete. Important information about purpose, operation, or safety is missing.' },
      { band:'0 · Not yet shown', desc:'I have not provided enough evidence to show this skill.' }
    ],
    evidence:['Initial observations','Questions','Labeled sketches','Manual notes','Source list','Interviews / demo notes','Material research','Portfolio research page']
  },
  {
    letter:'B', name:'Plan and Develop', question:'How well did I turn my research into a safe and workable plan?',
    topLabel:'Thoughtful planner',
    levels:[
      { band:'7–8 · Thoughtful planner', desc:'I create clear and measurable success criteria that include function, quality, safety, and user needs. My plan clearly identifies steps, materials, settings, responsibilities, time, safety checks, and required supervision. Another person could follow my plan.' },
      { band:'5–6 · Capable planner', desc:'I create appropriate success criteria and develop a workable idea or testing method. My plan includes the main steps, materials, settings, safety checks, and team responsibilities.' },
      { band:'3–4 · Developing planner', desc:'I identify some success criteria and create a basic idea or test. My plan may be unclear, incomplete, or missing important safety and preparation details.' },
      { band:'1–2 · Beginning planner', desc:'I create a limited idea or plan with substantial help. My success criteria are very general or missing.' },
      { band:'0 · Not yet shown', desc:'I have not provided enough evidence to show this skill.' }
    ],
    evidence:['Success criteria','Test plans','Design sketches','Materials list','Setting / file choices','Safety checklist','Team-role plan','Step-by-step procedure','Project proposal']
  },
  {
    letter:'C', name:'Create and Use Responsibly', question:'How responsibly and skillfully did I carry out the plan?',
    topLabel:'Responsible and skilled maker',
    note:'Safety is a requirement, not just a score. Unsafe work is stopped immediately and retaught. A high score never gives permission to use restricted equipment without required supervision.',
    levels:[
      { band:'7–8 · Responsible & skilled maker', desc:'I consistently prepare and work safely, including asking for required supervision. When a problem occurs, I stop, think, ask for help, and make a reasoned change. I produce a successful result or a valuable, well-documented test.' },
      { band:'5–6 · Capable maker', desc:'I follow safety procedures and use the tool responsibly with appropriate supervision. I record results and make reasonable changes when problems occur.' },
      { band:'3–4 · Developing maker', desc:'I follow basic safety procedures but sometimes need reminders about preparation, organization, or correct technique.' },
      { band:'1–2 · Beginning maker', desc:'I need frequent support to prepare, work safely, follow the plan, or use materials appropriately.' },
      { band:'0 · Not yet shown', desc:'I have not provided enough evidence to show this skill.' }
    ],
    evidence:['Teacher observations','Safety demonstrations','Test samples','Process photographs','Completed product','Test data','Change log','Maker-notebook entries','Cleanup / shutdown routines']
  },
  {
    letter:'D', name:'Evaluate and Share', question:'How well did I use evidence to evaluate my work and help other people learn?',
    topLabel:'Evidence-based evaluator & teacher',
    levels:[
      { band:'7–8 · Evidence-based evaluator & teacher', desc:'I use appropriate tests and detailed evidence to evaluate every important success criterion. My catalogue contribution is accurate, organized, easy for a beginner to understand, and supported by trustworthy sources.' },
      { band:'5–6 · Capable evaluator & communicator', desc:'I use suitable tests and evidence to evaluate most success criteria. My catalogue contribution is clear, mostly complete, and useful to a beginner.' },
      { band:'3–4 · Developing evaluator & communicator', desc:'I describe some testing or feedback and identify basic strengths and problems. My catalogue contribution may be unclear, incomplete, or insufficiently verified.' },
      { band:'1–2 · Beginning evaluator & communicator', desc:'I give a simple opinion about the result with little supporting evidence. My catalogue contribution or reflection is very limited.' },
      { band:'0 · Not yet shown', desc:'I have not provided enough evidence to show this skill.' }
    ],
    evidence:['Product / test results','Measurements','User or peer feedback','Success-criteria evaluation','Suggested improvements','Catalogue entry','Tool demonstration','Final reflection','Portfolio selection']
  }
];

/* --- score sliders --- */
const scoreSlidersEl = document.getElementById('scoreSliders');
const scoreState = { A:0, B:0, C:0, D:0 };
CRITERIA.forEach(c => {
  const row = document.createElement('div');
  row.className = 'score-slider-row';
  row.innerHTML = `
    <span class="score-slider-label">Criterion ${c.letter}<span>${c.name}</span></span>
    <input type="range" min="0" max="8" step="1" value="0" class="score-slider" data-crit="${c.letter}" aria-label="Criterion ${c.letter} score">
    <span class="score-slider-val" data-val="${c.letter}">0</span>
  `;
  scoreSlidersEl.appendChild(row);
});

const scoreRingFill = document.getElementById('scoreRingFill');
const scoreTotalNum = document.getElementById('scoreTotalNum');
const scoreTotalLabel = document.getElementById('scoreTotalLabel');
const SCORE_CIRC = 2 * Math.PI * 70;

function bandLabel(val, topLabel){
  if (val === 0) return 'Not yet shown';
  if (val <= 2) return 'Beginning';
  if (val <= 4) return 'Developing';
  if (val <= 6) return 'Capable';
  return topLabel;
}
function totalMessage(total){
  if (total === 0) return 'Not yet shown — move a slider to begin.';
  if (total <= 8) return 'Just getting started — there’s a lot more evidence to gather.';
  if (total <= 16) return 'Developing steadily — you’re building real evidence across the cycle.';
  if (total <= 24) return 'Capable across the board — reliable, evidence-based work.';
  return 'Thorough, responsible, and ready to teach a beginner. That’s the whole point of the internship.';
}
function updateScoreTotal(){
  const total = scoreState.A + scoreState.B + scoreState.C + scoreState.D;
  scoreTotalNum.textContent = total;
  scoreTotalLabel.textContent = totalMessage(total);
  const offset = SCORE_CIRC * (1 - total/32);
  scoreRingFill.style.strokeDashoffset = offset;
}
scoreSlidersEl.addEventListener('input', (e) => {
  const input = e.target;
  if (!input.classList.contains('score-slider')) return;
  const crit = input.dataset.crit;
  scoreState[crit] = Number(input.value);
  scoreSlidersEl.querySelector(`[data-val="${crit}"]`).textContent = input.value;
  updateScoreTotal();
});
updateScoreTotal();

/* --- criteria accordion --- */
const criteriaAccordion = document.getElementById('criteriaAccordion');
CRITERIA.forEach(c => {
  const item = document.createElement('div');
  item.className = 'crit-item';
  item.dataset.crit = c.letter;
  item.setAttribute('data-reveal','');
  item.innerHTML = `
    <div class="crit-head">
      <span class="crit-letter">${c.letter}</span>
      <span class="crit-titles">
        <span class="crit-name">${c.name}</span>
        <span class="crit-question">${c.question}</span>
      </span>
      <span class="crit-caret">▾</span>
    </div>
    <div class="crit-body">
      <div class="crit-body-inner">
        <div class="crit-levels">
          ${c.levels.map(l => `
            <div class="crit-level-row">
              <span class="crit-level-band">${l.band}</span>
              <span class="crit-level-desc">${l.desc}</span>
            </div>`).join('')}
        </div>
        ${c.note ? `<div class="callout callout-warn" style="margin-top:4px;"><span class="callout-icon">⚠️</span><p>${c.note}</p></div>` : ''}
        <div class="crit-evidence">
          <span class="crit-evidence-label">Possible evidence</span>
          ${c.evidence.map(e => `<span class="evidence-tag">${e}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  const head = item.querySelector('.crit-head');
  const body = item.querySelector('.crit-body');
  head.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    item.classList.toggle('open', willOpen);
    body.style.maxHeight = willOpen ? body.scrollHeight + 'px' : '0px';
  });
  criteriaAccordion.appendChild(item);
});

/* ==========================================================================
   12. INTERN HABITS TABLE
   ========================================================================== */
const HABITS = [
  'I arrive ready to participate.',
  'I care for tools, materials, and the workspace.',
  'I complete my assigned role responsibly.',
  'I listen to and support my teammates.',
  'I share tool access and learning opportunities fairly.',
  'I respond positively to feedback.',
  'I ask for help when I am unsure.',
  'I contribute evidence to my individual portfolio.'
];
const HABIT_COLS = ['Consistently','Usually','Sometimes','Not yet'];
const habitsTable = document.getElementById('habitsTable');
const headRow = document.createElement('div');
headRow.className = 'habit-row';
headRow.innerHTML = `<span></span>${HABIT_COLS.map(c => `<span class="habit-col-head">${c}</span>`).join('')}`;
habitsTable.appendChild(headRow);
HABITS.forEach((h, hi) => {
  const row = document.createElement('div');
  row.className = 'habit-row';
  row.innerHTML = `<span class="habit-name">${h}</span>${HABIT_COLS.map((c, ci) => `<span class="habit-dot-wrap"><button class="habit-dot" data-row="${hi}" data-col="${ci}" aria-label="${h} — ${c}"></button></span>`).join('')}`;
  habitsTable.appendChild(row);
});
habitsTable.addEventListener('click', (e) => {
  const dot = e.target.closest('.habit-dot');
  if (!dot) return;
  const row = dot.dataset.row;
  habitsTable.querySelectorAll(`.habit-dot[data-row="${row}"]`).forEach(d => {
    d.style.background = 'transparent';
  });
  const colors = ['var(--green)','var(--blue)','var(--amber)','var(--red)'];
  dot.style.background = colors[Number(dot.dataset.col)];
});

/* ==========================================================================
   13. SELF-ASSESSMENT PROMPTS
   ========================================================================== */
const PROMPTS = [
  'The strongest evidence in my portfolio is…',
  'One important thing I discovered is…',
  'One choice I made using evidence is…',
  'One skill I improved is…',
  'One way I helped my team is…',
  'One catalogue contribution I am proud of is…',
  'One part I should improve during the next cycle is…',
  'During the next cycle, my goal is…'
];
const promptGrid = document.getElementById('promptGrid');
PROMPTS.forEach(p => {
  const card = document.createElement('div');
  card.className = 'prompt-card';
  card.textContent = p;
  promptGrid.appendChild(card);
});

/* ==========================================================================
   14. FINAL: observe all dynamically injected reveal elements
   ========================================================================== */
observeReveals(document);

/* GSAP polish: subtle hero chip parallax on scroll (guarded) */
if (window.gsap && window.ScrollTrigger && !reduceMotion){
  gsap.utils.toArray('.chip').forEach((chip, i) => {
    gsap.to(chip, {
      y: (i % 2 === 0 ? -40 : 40),
      ease:'none',
      scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
    });
  });
}

})();
