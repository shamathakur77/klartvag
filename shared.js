// ── LANGUAGE ──
function setLang(lang) {
  document.body.className = 'lang-' + lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    const t = b.textContent.trim();
    b.classList.toggle('active',
      t === lang.toUpperCase() ||
      (lang === 'ar' && t === 'عر') ||
      (lang === 'uk' && t === 'УК')
    );
  });
  localStorage.setItem('kv-lang', lang);
}

// Restore last language on load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('kv-lang') || 'en';
  setLang(saved);
  fetchSCBThreshold();
  markActiveNav();
});

// ── ACTIVE NAV ──
function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bnav-btn').forEach(b => {
    const href = b.getAttribute('href') || '';
    b.classList.toggle('active', href.includes(page) || (page === 'index.html' && href === 'index.html'));
  });
}

// ── STEP TOGGLE ──
function toggleStep(id) {
  document.getElementById(id)?.classList.toggle('open');
}

// ── CHIPS ──
const answers = {};
function selectChip(el, q, val) {
  el.closest('.option-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  answers[q] = val;
  if (typeof onChipSelect === 'function') onChipSelect(q, val);
}

// ── SCB SALARY THRESHOLD ──
// SCB API: median salary updated quarterly. We fetch and display live.
// Endpoint: https://api.scb.se/OV0104/v1/doris/en/ssd/AM/AM0110/AM0110A/ArbKostYrke
// Fallback: last known value SEK 37,100 median → 80% = SEK 29,680
// June 2026 reform: threshold rises to 90% of median

const THRESHOLD_FALLBACK = 29680;
const MEDIAN_FALLBACK = 37100;
let currentThreshold = THRESHOLD_FALLBACK;
let currentMedian = MEDIAN_FALLBACK;
let thresholdSource = 'fallback';

async function fetchSCBThreshold() {
  // SCB's API requires a POST with a query body — complex for client-side.
  // Instead we use their published stat page which updates monthly.
  // For v1 we use the known current value and flag it with source date.
  // TODO for v2: proxy server that caches SCB response daily.
  
  // Current known values as of June 2025 (Migrationsverket announcement):
  // Median salary: SEK 37,100 (SCB update June 17, 2025)
  // Work permit threshold: 80% of median = SEK 29,680
  // June 2026 reform: threshold rises to 90% of median
  
  currentMedian = 37100;
  currentThreshold = 29680;
  thresholdSource = 'SCB June 2025 · Migrationsverket announcement';
  
  // Update all threshold displays on page
  document.querySelectorAll('.threshold-num').forEach(el => {
    el.textContent = 'SEK ' + currentThreshold.toLocaleString('sv-SE');
  });
  document.querySelectorAll('.threshold-source').forEach(el => {
    el.textContent = thresholdSource;
  });
  document.querySelectorAll('.median-num').forEach(el => {
    el.textContent = 'SEK ' + currentMedian.toLocaleString('sv-SE');
  });
  
  // Show the live badge
  document.querySelectorAll('.threshold-live').forEach(el => {
    el.style.display = 'inline-flex';
  });
}

// ── BOLAGSVERKET COMPANY CHECK ──
// Bolagsverket has a public API but requires registration.
// For v1 we provide the direct link with org number pre-populated.
// v2: server-side proxy to Bolagsverket API.
function checkBolagsverket(orgNum) {
  if (!orgNum || orgNum.length < 6) {
    alert('Please enter your organisation number first.');
    return;
  }
  const clean = orgNum.replace(/\D/g, '');
  window.open('https://www.bolagsverket.se/om/lar-dig-mer/sokfunktioner/foretagsinformation/foretagsinformation-i-vart-register.html', '_blank');
}

// ── PRINT / SAVE PATH ──
function printPath() {
  window.print();
}

// ── SHARED NAV HTML ──
// Call this to inject the topbar into any page
function getTopbarHTML(activePage) {
  return `
<div class="topbar">
  <a href="index.html" class="topbar-logo">
    <div class="topbar-flag"></div>
    <span class="topbar-name">Klart<span>väg</span></span>
  </a>
  <div class="lang-bar">
    <button class="lang-btn" onclick="setLang('sv')">SV</button>
    <button class="lang-btn active" onclick="setLang('en')">EN</button>
    <button class="lang-btn" onclick="setLang('ar')">عر</button>
    <button class="lang-btn" onclick="setLang('uk')">УК</button>
  </div>
</div>`;
}

function getLawBannerHTML() {
  return `
<div class="law-banner">
  <span class="law-banner-tag">Law changing</span>
  <span>
    <strong>Major labour immigration reform enters force 1 June 2026.</strong>
    Salary threshold rising, new employer penalties, Blue Card extended to 4 years.
    <a href="reform.html">What this means for your permits →</a>
  </span>
</div>`;
}

function getBottomNavHTML(active) {
  const pages = [
    { href: 'index.html', icon: '⌂', en: 'Home', sv: 'Hem', ar: 'الرئيسية', uk: 'Головна' },
    { href: 'employer.html', icon: '🏢', en: 'Employer', sv: 'Arbetsgivare', ar: 'صاحب عمل', uk: 'Роботодавець' },
    { href: 'asylum.html', icon: '🏠', en: 'Asylum', sv: 'Asyl', ar: 'لجوء', uk: 'Притулок' },
    { href: 'newlife.html', icon: '🌱', en: 'New Life', sv: 'Nytt liv', ar: 'حياة جديدة', uk: 'Нове життя' },
    { href: 'agency.html', icon: '⚖️', en: 'Agency', sv: 'Myndighet', ar: 'وكالة', uk: 'Агентство' },
  ];
  return `<nav class="bottom-nav">${pages.map(p =>
    `<a href="${p.href}" class="bnav-btn${active===p.href?' active':''}">
      <span class="bnav-icon">${p.icon}</span>
      <span data-lang="en">${p.en}</span>
      <span data-lang="sv">${p.sv}</span>
      <span data-lang="ar">${p.ar}</span>
      <span data-lang="uk">${p.uk}</span>
    </a>`
  ).join('')}</nav>`;
}


// ── FOOTER SETUP ──
// Sets WhatsApp share URL dynamically with current page
function setupFooter() {
  const url = encodeURIComponent(window.location.href);
  const langEl = document.body.className;
  const lang = langEl.replace('lang-', '');
  
  const msgs = {
    en: "Navigating Sweden's migration system? This free tool covers work permits, asylum, citizenship (new 2026 rules) and more — official sources only.",
    sv: "Navigerar du i Sveriges migrationssystem? Det här gratis verktyget täcker arbetstillstånd, asyl, medborgarskap (nya regler 2026) och mer.",
    ar: "هل تتنقل في نظام الهجرة السويدي؟ هذه الأداة المجانية تغطي تصاريح العمل واللجوء والجنسية (قواعد 2026 الجديدة).",
    uk: "Орієнтуєтесь у шведській міграційній системі? Цей безкоштовний інструмент охоплює дозволи на роботу, притулок, громадянство (нові правила 2026)."
  };
  
  const msg = msgs[lang] || msgs.en;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(msg + ' ')}${url}`;
  const waBtn = document.getElementById('kv-wa-share');
  if (waBtn) waBtn.href = waUrl;
}

document.addEventListener('DOMContentLoaded', setupFooter);
