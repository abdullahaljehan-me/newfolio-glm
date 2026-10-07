/* ═══════════════════════════════════════════════════════
   jehan — portfolio v3.0 · vanilla JS, zero dependencies
   ═══════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GH_USER = 'abdullahaljehan-me';
const W3F_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // TODO: paste your Web3Forms access key

/* ── THEME ──────────────────────────────────────────── */
const themeBtn = $('#themeBtn');
const setTheme = t => {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('jehan-theme', t);
};
setTheme(localStorage.getItem('jehan-theme') || 'dark');
themeBtn.addEventListener('click', () =>
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ── CUSTOM CURSOR ──────────────────────────────────── */
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced) {
  const dot = document.createElement('div'), ring = document.createElement('div');
  dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
  const wrap = document.createElement('div');
  wrap.className = 'cursor'; wrap.append(dot, ring); document.body.appendChild(wrap);
  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  const hot = 'a,button,input,textarea,summary,.proj,.int,.gh,.tl-card';
  document.addEventListener('mouseover', e => { if (e.target.closest(hot)) ring.classList.add('hot'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hot)) ring.classList.remove('hot'); });
}

/* ── NAV: scrolled state, mobile, scrollspy ─────────── */
const nav = $('#navbar');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
nav.classList.toggle('scrolled', scrollY > 10);

const burger = $('#hamburger'), links = $('#navLinks');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
 $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); burger.classList.remove('open');
}));

const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting)
    $$('#navLinks a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
 $$('main section[id]').forEach(s => spy.observe(s));

/* ── PROGRESS BAR ───────────────────────────────────── */
const bar = $('#progressBar');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* ── REVEAL ON SCROLL ───────────────────────────────── */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
 $$('.reveal').forEach(el => io.observe(el));

/* ── COUNTERS ───────────────────────────────────────── */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  cio.unobserve(e.target);
  const el = e.target, target = parseFloat(el.dataset.target);
  const dec = +(el.dataset.dec || 0), pad = +(el.dataset.pad || 0);
  const fmt = v => (pad ? String(Math.round(v)).padStart(pad, '0') : v.toFixed(dec));
  if (reduced) { el.textContent = fmt(target); return; }
  const t0 = performance.now(), dur = 1300;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * ease);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: .6 });
 $$('.stat-n').forEach(el => cio.observe(el));

/* ── HERO: typed roles ──────────────────────────────── */
const roles = [
  'embedded systems explorer', 'C programmer', 'Linux tinkerer',
  'IoT builder', 'robotics enthusiast', 'Founding Advisor @ Kynatium Labs'
];
const typedEl = $('#typed');
if (reduced) { typedEl.textContent = roles[0]; }
else {
  let ri = 0, ci = 0, del = false;
  (function type() {
    const w = roles[ri];
    typedEl.textContent = w.slice(0, ci);
    if (!del && ci < w.length) { ci++; setTimeout(type, 55); }
    else if (!del) { del = true; setTimeout(type, 1900); }
    else if (ci > 0) { ci--; setTimeout(type, 26); }
    else { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); }
  })();
}

/* ── HERO: boot sequence ────────────────────────────── */
const boot = [
  { t: 'whoami', c: 'cmd' },
  { t: 'abdullah-al-jehan · dhaka, bd', c: '' },
  { t: 'cat focus.txt', c: 'cmd' },
  { t: 'embedded systems · iot · c · linux', c: 'hi' },
  { t: './mission.sh --run', c: 'cmd' },
  { t: 'bridging code with the physical world…', c: '' },
  { t: 'status: building ▊', c: 'grn' }
];
const bootPre = $('#bootPre');
if (reduced) {
  bootPre.innerHTML = boot.map(l => `<span class="${l.c}">${l.t}</span>`).join('\n');
} else {
  let li = 0;
  const nextLine = () => {
    if (li >= boot.length) return;
    const l = boot[li++], span = document.createElement('span');
    span.className = l.c; bootPre.appendChild(span);
    let k = 0;
    (function ch() {
      span.textContent = l.t.slice(0, ++k);
      if (k < l.t.length) setTimeout(ch, l.c === 'cmd' ? 34 : 14);
      else { bootPre.appendChild(document.createTextNode('\n')); setTimeout(nextLine, 240); }
    })();
  };
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) { o.disconnect(); nextLine(); }
  }, { threshold: .4 }).observe(bootPre);
}

/* ── NAV LINK TEXT SCRAMBLE ─────────────────────────── */
const CHARS = '!<>-_\\/[]{}—=+*^?#________';
if (!reduced) $$('#navLinks .nl-txt').forEach(el => {
  let frame;
  el.parentElement.addEventListener('mouseenter', () => {
    const orig = el.textContent; let i = 0;
    cancelAnimationFrame(frame);
    (function step() {
      el.textContent = orig.split('').map((c, j) =>
        j < i ? orig[j] : CHARS[Math.random() * CHARS.length | 0]).join('');
      i += 1 / 2;
      if (i <= orig.length) frame = requestAnimationFrame(step);
      else el.textContent = orig;
    })();
  });
});

/* ── COPY EMAIL ─────────────────────────────────────── */
 $('#copyEmail').addEventListener('click', async e => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText('abdullahaljehan.me@gmail.com'); }
  catch { /* fallback */ const ta = document.createElement('textarea');
    ta.value = 'abdullahaljehan.me@gmail.com'; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove(); }
  btn.textContent = '✓'; btn.style.color = 'var(--acc2)';
  setTimeout(() => { btn.textContent = '⧉'; btn.style.color = ''; }, 1600);
});

/* ── CONTACT FORM (Web3Forms + mailto fallback) ─────── */
 $('#contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, st = $('#formStatus'), btn = $('#formBtn');
  if (f.botcheck.checked) return; // honeypot
  st.className = 'form-status'; btn.disabled = true;
  const data = Object.fromEntries(new FormData(f));
  if (W3F_KEY.startsWith('YOUR_')) {
    st.textContent = '↪ mail client opening (configure Web3Forms key for direct delivery)';
    location.href = `mailto:abdullahaljehan.me@gmail.com?subject=${encodeURIComponent(data.name + ' — portfolio contact')}&body=${encodeURIComponent(data.message + '\n\n— ' + data.name + ' <' + data.email + '>')}`;
    btn.disabled = false; return;
  }
  st.textContent = 'transmitting…';
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: W3F_KEY, ...data })
    });
    if (!r.ok) throw 0;
    st.className = 'form-status ok';
    st.textContent = '✓ message received — I usually reply within 24–48h.';
    f.reset();
  } catch {
    st.className = 'form-status err';
    st.textContent = '✕ transmission failed — email me directly instead.';
  }
  btn.disabled = false;
});

/* ── LIVE GITHUB FEED (5-min cache, honest fallback) ── */
const LANG_COLOR = { C:'#5ec8e5','C++':'#f34b7d',HTML:'#e34c26',CSS:'#8b5cf6',
  JavaScript:'#f1e05a',Shell:'#89e051',Arduino:'#bd79d8',Python:'#3572A5',Makefile:'#427819' };
const FALLBACK = [
  { name:'obstacle-avoiding-robot', description:'Autonomous robot firmware — HC-SR04 + L298N real-time avoidance.', language:'C++', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me?tab=repositories', updated_at:'2026-08-01' },
  { name:'contact-management-system', description:'CLI contact records with binary file I/O in C.', language:'C', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me?tab=repositories', updated_at:'2026-07-01' },
  { name:'digital-clock-cli-suite', description:'Flicker-free real-time clock, stopwatch & alarm in pure C.', language:'C', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me?tab=repositories', updated_at:'2026-06-01' },
  { name:'calendar-utility-c', description:'Leap years, weekday math, Gregorian calendars — zero deps.', language:'C', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me?tab=repositories', updated_at:'2026-05-01' },
  { name:'c-projects-roadmap', description:'A living roadmap of C projects toward systems programming.', language:'C', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me?tab=repositories', updated_at:'2026-04-01' },
  { name:'portfolio', description:'This site — vanilla HTML/CSS/JS, OKLCH, zero build step.', language:'HTML', stargazers_count:0, html_url:'https://github.com/abdullahaljehan-me/portfolio', updated_at:'2026-09-01' }
];
const ghGrid = $('#ghGrid'), ghStatus = $('#ghStatus');
const repoCard = r => {
  const el = document.createElement('article');
  el.className = 'gh';
  const col = LANG_COLOR[r.language] || '#8b98a9';
  const date = new Date(r.updated_at).toLocaleDateString('en-US', { month:'short', year:'numeric' });
  el.innerHTML = `
    <a class="gh-name" href="${r.html_url}" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>
      ${r.name}</a>
    <p class="gh-desc">${r.description || '// no description — the code speaks'}</p>
    <div class="gh-meta">
      ${r.language ? `<span class="gh-lang"><i style="background:${col}"></i>${r.language}</span>` : ''}
      <span>★ ${r.stargazers_count}</span><span>upd ${date}</span>
    </div>`;
  return el;
};
const renderGH = repos => {
  ghGrid.innerHTML = '';
  repos.slice(0, 6).forEach(r => ghGrid.appendChild(repoCard(r)));
};
(async () => {
  const KEY = 'gh_repos_v3', TTL = 5 * 60 * 1000;
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (cached && Date.now() - cached.ts < TTL) {
      renderGH(cached.data); ghStatus.textContent = `// cached feed · ${cached.data.length} repos`;
      return;
    }
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=10`);
    if (!res.ok) throw 0;
    const repos = (await res.json()).filter(r => !r.fork);
    sessionStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data: repos }));
    renderGH(repos);
    ghStatus.textContent = `// live from api.github.com · ${repos.length} public repos`;
  } catch {
    renderGH(FALLBACK);
    ghStatus.textContent = '// api unreachable — showing cached snapshot of shipped work';
  }
})();

/* ── TERMINAL DRAWER ────────────────────────────────── */
const term = $('#terminal'), tOut = $('#termOut'),
      tBody = $('#termBody'), tInput = $('#termInput');
const tPrint = (txt, cls = '') => {
  const d = document.createElement('div');
  d.className = 't-line ' + cls; d.textContent = txt;
  tOut.appendChild(d); tBody.scrollTop = tBody.scrollHeight;
};
const tHTML = html => {
  const d = document.createElement('div');
  d.className = 't-line'; d.innerHTML = html;
  tOut.appendChild(d); tBody.scrollTop = tBody.scrollHeight;
};
const openTerm = () => {
  term.hidden = false;
  requestAnimationFrame(() => { term.classList.add('open'); tInput.focus(); });
  if (!tOut.childElementCount) {
    tPrint("⚡ jehan-shell v3.0 — interactive systems shell", 'acc');
    tPrint("type 'help' for commands · 'neofetch' for specs · 'exit' to close", '');
    tPrint('', '');
  }
};
const closeTerm = () => { term.classList.remove('open');
  setTimeout(() => { term.hidden = true; }, 280); };
 $('#termFab').addEventListener('click', () =>
  term.classList.contains('open') ? closeTerm() : openTerm());
 $('#termClose').addEventListener('click', closeTerm);
addEventListener('keydown', e => {
  if (e.key === '`' && e.ctrlKey) { e.preventDefault();
    term.classList.contains('open') ? closeTerm() : openTerm(); }
  if (e.key === 'Escape') { closeTerm(); links.classList.remove('open'); burger.classList.remove('open'); }
});

const SECTIONS = ['home','about','journey','stack','projects','writing','interests','activity','credentials','contact'];
const hueCycle = [null,'hue1','hue2','hue3'];
let hueIdx = 0;

const CMDS = {
  help: () => tPrint(
`available commands:
  bio · skills · projects · journey · education · writing
  contact · socials · neofetch · open <section> · ls
  theme · whoami · date · echo <msg> · clear · exit
psst: try 'sudo make me a sandwich'`, 'acc'),

  whoami: () => tPrint('abdullah-al-jehan — human. mostly.', 'grn'),
  bio: () => tPrint(
`Aspiring engineer from Dhaka, Bangladesh. Science student
(math + physics core) going deep on embedded systems, IoT,
C and Linux. Founding Advisor @ Kynatium Labs — making
embedded education accessible across Bangladesh.
Mindset: build → break → iterate.`),
  skills: () => tPrint(
`CORE     : C · CLI workflows · VS Code
WORKING  : Linux (Debian/Kubuntu) · Git · Bash · HTML/CSS · JS
           Arduino · HC-SR04 · L298N
LEARNING : C++ (OOP) · Linux admin · sensor integration
RADAR    : robotics · AI/ML · automotive engineering`),
  projects: () => tPrint(
`01 obstacle-avoiding-robot   (C++/Arduino)  ★hardware
02 contact-management-system (C)
03 digital-clock-cli-suite   (C, real-time)
04 calendar-utility-c        (C)
05 c-projects-roadmap        (C)
06 this-website              (vanilla JS v3)
→ run 'open projects' to see case studies`),
  journey: () => tPrint(
`2026–now  Founding Advisor @ Kynatium Labs
2023–2025 HSC · Govt Science College · GPA 5.00
2025      Presidency Univ–Prothom Alo GPA-5 Reception
2021–2023 SSC · GPA 5.00`),
  education: () => CMDS.journey(),
  writing: () => tPrint(
`[LinkedIn] Leveling Up My Linux Journey: Zorin → Kubuntu (Jan 2025)
[LinkedIn] From Windows to Linux: First Steps with Zorin 18 (Nov 2024)
research: 3 topics drafting — see 'open writing'`),
  contact: () => tHTML(`email → <span class="grn">abdullahaljehan.me@gmail.com</span>
base   → Dhaka, Bangladesh (UTC+6)
status → ● open to research &amp; collaboration`),
  socials: () => tPrint('github.com/abdullahaljehan-me · linkedin.com/in/abdullahaljehan'),
  ls: () => tPrint(SECTIONS.join('  '), 'acc'),
  date: () => tPrint(new Date().toString()),
  theme: () => { $('#themeBtn').click();
    tPrint('theme → ' + document.documentElement.dataset.theme, 'grn'); },
  neofetch: () => tHTML(
`<span class="acc">    ┌───────────┐</span>   <span class="grn">jehan@embedded-sys</span>
<span class="acc">    │  ○     ○  │</span>   ─────────────────────
<span class="acc">    │     ▽     │</span>   OS      : Kubuntu (Linux x86_64)
<span class="acc">    └──┬─┬─┬──┘</span>   Shell   : jehan-shell v3.0
<span class="acc">      ─┤ ▦ ├─</span>      Editor  : VS Code
<span class="acc">    ┌──┴─┴─┴──┐</span>   Focus   : Embedded · IoT · C
<span class="acc">    └─────────┘</span>   Uptime  : building since 2021
                  Mission : code × physical world`),
  clear: () => { tOut.innerHTML = ''; },
  exit: closeTerm,
  quit: closeTerm,
  sudo: () => tPrint('nice try. incident reported to /dev/null 😄', 'err'),
  rm: () => tPrint('permission denied — I protect my dotfiles with my life.', 'err'),
  coffee: () => tHTML(`<span class="amb">      ( (
       ) )
    ┌───────┐
    │       │╮
    │       │ │
    └───────┘╯
 brewing… jehan is now 12% more productive</span>`),
  konami: () => { tPrint('↑ ↑ ↓ ↓ ← → ← → B A — do it on the page itself.', 'amb'); },
  hello: () => tPrint('hello, traveler 👋 — welcome to my little corner of the web.', 'grn'),
  ping: () => tPrint('pong. latency: friendship ms.'),
};

 $('#termForm').addEventListener('submit', e => {
  e.preventDefault();
  const raw = tInput.value.trim();
  if (!raw) return;
  tPrint(raw, 'cmd');
  tInput.value = '';
  const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
  if (cmd === 'echo') return tPrint(args.join(' '));
  if (cmd === 'open' || cmd === 'cd') {
    const target = args[0];
    if (SECTIONS.includes(target)) {
      if (target === 'home') scrollTo({ top: 0, behavior: 'smooth' });
      else $('#' + target)?.scrollIntoView({ behavior: 'smooth' });
      tPrint(`→ navigating to #${target}`, 'grn');
    } else tPrint(`open: unknown section '${target}'. try 'ls'.`, 'err');
    return;
  }
  if (CMDS[cmd]) return CMDS[cmd]();
  tPrint(`jehan-shell: command not found: ${cmd} — try 'help'`, 'err');
});

/* ── KONAMI → accent hue cycle ──────────────────────── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;
addEventListener('keydown', e => {
  ki = (e.key === KONAMI[ki]) ? ki + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (ki === KONAMI.length) {
    ki = 0;
    hueIdx = (hueIdx + 1) % hueCycle.length;
    document.body.classList.remove('hue1','hue2','hue3');
    if (hueCycle[hueIdx]) document.body.classList.add(hueCycle[hueIdx]);
    tPrint(` Cheat unlocked: accent hue ${hueIdx || 'default'} ▸`, 'amb');
  }
});

/* ── FOOTER YEAR ────────────────────────────────────── */
 $('#year').textContent = new Date().getFullYear();

})();
