// ── EMPLOYER TOOLS ──
// These functions are used on employer.html
// ── LANGUAGE ──
function setLang(lang) {
  document.body.className = 'lang-' + lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().toLowerCase() === lang ||
      (lang === 'ar' && b.textContent.trim() === 'عر') ||
      (lang === 'uk' && b.textContent.trim() === 'УК'));
  });
}

// ── SCREENS ──
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const map = {
    'screen-home': 0, 'screen-expat': 1, 'screen-employer': 1,
    'screen-asylum': 2, 'screen-family': 2,
    'screen-newlife': 3, 'screen-agency': 4
  };
  const navBtns = document.querySelectorAll('.bnav-btn');
  if (map[screenId] !== undefined) navBtns[map[screenId]]?.classList.add('active');
  // Reset expat path when revisiting
  if (screenId === 'screen-expat') {
    document.getElementById('expat-path').style.display = 'none';
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    document.getElementById('find-btn').disabled = true;
  }
}

// ── STEPS ──
function toggleStep(id) {
  document.getElementById(id).classList.toggle('open');
}

// ── CHIPS ──
const answers = {};
function selectChip(el, q, val) {
  const chips = el.parentElement.querySelectorAll('.chip');
  chips.forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  answers[q] = val;
  checkReady();
}

function checkReady() {
  const ready = answers.q1 && answers.q2 && answers.q3;
  document.getElementById('find-btn').disabled = !ready;
}

// ── SHOW PATH ──
function showExpatPath() {
  const path = document.getElementById('expat-path');
  path.style.display = 'block';
  path.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('s1').classList.add('open');
}

// ── EMPLOYER TOOLS ──
function showEmployerTool(toolId, chipEl) {
  ['cat-checker','expiry-tracker','doc-checklist'].forEach(id => {
    document.getElementById('tool-' + id).style.display = id === toolId ? 'block' : 'none';
  });
  chipEl.closest('.option-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  chipEl.classList.add('selected');
  document.getElementById('cat-result').style.display = 'none';
  document.querySelectorAll('[id^="eq"]').forEach(el => {});
}

// Category checker answers
const empAnswers = {};
const origSelectChip = window.selectChip;
function selectChip(el, q, val) {
  const chips = el.parentElement.querySelectorAll('.chip');
  chips.forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  if (q.startsWith('eq')) {
    empAnswers[q] = val;
    checkEmpReady();
  } else if (q.startsWith('dq')) {
    // doc list handled separately
  } else {
    answers[q] = val;
    checkReady();
  }
}

function checkEmpReady() {
  const ready = empAnswers.eq1 && empAnswers.eq2 && empAnswers.eq3;
  const btn = document.getElementById('emp-find-btn');
  if (btn) btn.disabled = !ready;
}

function showCategoryResult() {
  const age = empAnswers.eq1;
  const sni = empAnswers.eq2;
  const role = empAnswers.eq3;

  let cat, color, time, explanation, svExplanation;

  if (age === 'no') {
    cat = 'Category D'; color = '#b85c00';
    time = 'Target: not guaranteed — may exceed 120 days';
    explanation = 'Your company has been active for less than 12 months. Regardless of role type, Migrationsverket routes new-company applications to Category D — the highest-scrutiny queue. Additional financial documentation is required.';
    svExplanation = 'Ditt företag har varit aktivt i mindre än 12 månader. Migrationsverket dirigerar nya företagsansökningar till Kategori D oavsett rolltyp.';
  } else if (sni === 'risk') {
    cat = 'Category D'; color = '#b85c00';
    time = 'Target: not guaranteed — may exceed 120 days';
    explanation = 'Your company\'s SNI code falls in a high-scrutiny industry (cleaning, construction, hospitality, staffing, retail, agriculture, personal assistance, or automobile repair). These sectors have documented patterns of work permit misuse. Migrationsverket applies deeper investigation to all applications from these industries, regardless of role seniority.';
    svExplanation = 'Ditt företags SNI-kod faller inom en högriskbransch. Migrationsverket tillämpar djupare utredning för alla ansökningar från dessa branscher.';
  } else if (sni === 'unsure') {
    cat = 'Cannot determine'; color = '#7a7770';
    time = 'Determine your SNI code first';
    explanation = 'Your category cannot be determined without your SNI code. Find your SNI code on your Skatteverket registration certificate, or look it up at Bolagsverket.se using your organisation number. Return here once you have it.';
    svExplanation = 'Din kategori kan inte fastställas utan din SNI-kod. Hitta den på ditt Skatteverket-registreringsbevis.';
  } else if (role === 'special') {
    cat = 'Category B'; color = '#1a4a7a';
    time = 'EU Blue Card / ICT: 30 days | Researcher: 30 days | Others: varies';
    explanation = 'EU Blue Card, ICT transfers, and researcher permits are Category B. Processing time target for Blue Card and ICT has been reduced to 30 days (same as Category A) as of 2025. For artists, athletes, and trainees the timeline varies — check migrationsverket.se for your specific permit type.';
    svExplanation = 'EU Blue Card, ICT-överföringar och forskningstillstånd är Kategori B. Handläggningsmålet för Blue Card och ICT är 30 dagar från 2025.';
  } else if (role === 'qualified' && sni === 'safe') {
    cat = 'Category A'; color = '#1a5c3a';
    time = 'Target: 30 days (for complete applications only)';
    explanation = 'Your application should qualify for Category A — the fast track. This applies because your company is established (12+ months), your industry is not high-scrutiny, and the role requires higher education or is managerial (SSYK starting 1, 2, or 3). The 30-day clock starts only when both the employer and employee parts of the application are fully complete and submitted.';
    svExplanation = 'Din ansökan bör kvalificera för Kategori A — snabbspåret. 30-dagarsklockan börjar bara när BÅDA delarna av ansökan är fullt ifyllda och inlämnade.';
  } else {
    cat = 'Category C'; color = '#8a6a20';
    time = 'Target: not published — longer than Category A';
    explanation = 'Your application falls into Category C — skilled roles that do not require higher education, in industries not flagged as high-scrutiny. Migrationsverket has not published a specific processing time target for Category C. Expect longer than Category A (30 days) but shorter than Category D.';
    svExplanation = 'Din ansökan hamnar i Kategori C — kvalificerade roller som inte kräver högre utbildning, i branscher som inte är högrisk.';
  }

  const lang = document.body.className.replace('lang-', '');
  const showSv = lang === 'sv';

  document.getElementById('cat-result-inner').innerHTML = `
    <div style="border-left:4px solid ${color}; background:white; border:1px solid ${color}40; border-left:4px solid ${color}; padding:20px 24px; margin-bottom:0">
      <div style="font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${color}; margin-bottom:8px; font-family:'IBM Plex Mono',monospace">
        ${lang === 'sv' ? 'Ditt resultat' : 'Your result'}
      </div>
      <div style="font-family:'Source Serif 4',serif; font-size:26px; font-weight:600; color:var(--ink); margin-bottom:6px">${cat}</div>
      <div style="font-size:12px; color:var(--ink3); font-family:'IBM Plex Mono',monospace; margin-bottom:16px">${time}</div>
      <div style="font-size:14px; color:var(--ink2); line-height:1.7">${showSv ? svExplanation : explanation}</div>
      <div style="font-size:11px; color:var(--ink3); margin-top:12px; font-style:italic; border-top:1px solid var(--border); padding-top:10px">
        ${lang === 'sv'
          ? 'Kategorisering sker automatiskt av Migrationsverket vid inlämning. Klartväg kan inte garantera din faktiska kategori. Officiell källa: migrationsverket.se'
          : 'Categorisation is determined automatically by Migrationsverket upon submission. Klartväg cannot guarantee your actual assigned category. Official source: migrationsverket.se'}
      </div>
    </div>
  `;

  const resultEl = document.getElementById('cat-result');
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (cat === 'Category A' || cat === 'Category B' || cat === 'Category C' || cat === 'Category D') {
    setTimeout(() => document.getElementById('emp-s1').classList.add('open'), 400);
  }
}

// Permit expiry tracker
let trackerCount = 1;
function addTrackerRow() {
  const container = document.getElementById('tracker-entries');
  const newRow = document.getElementById('tracker-0').cloneNode(true);
  newRow.id = 'tracker-' + trackerCount++;
  newRow.querySelectorAll('input').forEach(i => i.value = '');
  container.appendChild(newRow);
}

function calculateExpiry(btn) {
  const row = btn.closest('.tracker-row');
  const name = row.querySelectorAll('input')[0].value || 'Employee';
  const type = row.querySelector('select').value;
  const expiry = row.querySelectorAll('input')[1].value;

  if (!expiry) { alert('Please enter the expiry date.'); return; }

  const expiryDate = new Date(expiry);
  const today = new Date();
  const daysLeft = Math.round((expiryDate - today) / (1000 * 60 * 60 * 24));

  // Official target processing times
  const processingDays = type.includes('Category A') || type.includes('Category B') ? 30
    : type.includes('Category C') ? 90
    : 120;

  const submitByDate = new Date(expiryDate);
  submitByDate.setDate(submitByDate.getDate() - processingDays - 14); // 14-day safety buffer

  const submitDaysFrom = Math.round((submitByDate - today) / (1000 * 60 * 60 * 24));

  let status, statusColor, message;
  if (daysLeft < 0) {
    status = '🔴 EXPIRED'; statusColor = '#7a1a1a';
    message = 'Permit has already expired. Employee may not be legally working. Contact Migrationsverket immediately: 0771-235 235.';
  } else if (submitDaysFrom < 0) {
    status = '🔴 OVERDUE FOR RENEWAL'; statusColor = '#7a1a1a';
    message = `Based on the ${processingDays}-day target processing time, the renewal application should have been submitted already. Submit immediately.`;
  } else if (submitDaysFrom < 30) {
    status = '🟠 ACTION NEEDED NOW'; statusColor = '#b85c00';
    message = `Submit renewal application within ${submitDaysFrom} days. Based on ${processingDays}-day target processing time + 14-day buffer.`;
  } else if (submitDaysFrom < 90) {
    status = '🟡 UPCOMING'; statusColor = '#8a6a20';
    message = `Submit renewal by approximately ${submitByDate.toLocaleDateString('en-SE')} to allow ${processingDays} days processing + buffer.`;
  } else {
    status = '🟢 ON TRACK'; statusColor = '#1a5c3a';
    message = `${daysLeft} days until expiry. Recommended submit date: ${submitByDate.toLocaleDateString('en-SE')}.`;
  }

  const results = document.getElementById('expiry-results');
  const existing = document.getElementById('result-' + row.id);
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'result-' + row.id;
  div.style.cssText = `border:1px solid ${statusColor}40; border-left:3px solid ${statusColor}; padding:14px 16px; background:white; margin-bottom:8px;`;
  div.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px">
      <div>
        <div style="font-weight:500; color:var(--ink); margin-bottom:4px">${name}</div>
        <div style="font-size:11px; color:var(--ink3); margin-bottom:6px">${type} · Expires ${expiryDate.toLocaleDateString('en-SE')} · ${daysLeft} days remaining</div>
        <div style="font-size:12px; color:${statusColor}">${status}</div>
      </div>
    </div>
    <div style="font-size:12px; color:var(--ink2); margin-top:8px; line-height:1.6">${message}</div>
    <div style="font-size:10px; color:var(--ink3); margin-top:8px; font-style:italic">Processing time based on official target only. Verify current actual times at migrationsverket.se/en/contact-us/waiting-times.html</div>
  `;
  results.appendChild(div);
  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Doc list switcher
function showDocList(type) {
  ['standard','new','highrisk'].forEach(t => {
    const el = document.getElementById('doclist-' + t);
    if (el) el.style.display = t === type ? 'block' : 'none';
  });
}

// ── ASYLUM TOOLS ──
function showAsylumStep(stepId, chipEl) {
  ['as-apply','as-waiting','as-approved','as-rejected'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === stepId ? 'block' : 'none';
  });
  chipEl.closest('.option-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  chipEl.classList.add('selected');
  const firstCard = document.getElementById(stepId)?.querySelector('.step-card');
  if (firstCard) firstCard.classList.add('open');
}

function calculateAppealDeadline() {
  const input = document.getElementById('decision-date').value;
  if (!input) { alert('Please enter the date you received the decision.'); return; }
  const decisionDate = new Date(input);
  const deadlineDate = new Date(decisionDate);
  deadlineDate.setDate(deadlineDate.getDate() + 21);

  const today = new Date();
  today.setHours(0,0,0,0);
  const daysLeft = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));
  const fmt = d => d.toLocaleDateString('en-SE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  let urgency, urgencyColor, urgencyBg, message;
  if (daysLeft < 0) {
    urgency = 'DEADLINE PASSED'; urgencyColor = '#7a1a1a'; urgencyBg = '#f5e0e0';
    message = 'The 3-week appeal window has passed. Contact a legal aid organisation immediately: Röda Korset (redcross.se) or UNHCR Sweden (unhcr.org/se).';
  } else if (daysLeft === 0) {
    urgency = 'TODAY IS THE DEADLINE'; urgencyColor = '#7a1a1a'; urgencyBg = '#f5e0e0';
    message = 'Your appeal must be submitted today. Send it to the address in your decision letter immediately.';
  } else if (daysLeft <= 3) {
    urgency = `${daysLeft} DAY${daysLeft===1?'':'S'} LEFT — URGENT`; urgencyColor = '#7a1a1a'; urgencyBg = '#f5e0e0';
    message = 'You have very little time. Submit your appeal immediately to the address in your decision letter.';
  } else if (daysLeft <= 7) {
    urgency = `${daysLeft} DAYS LEFT — ACT NOW`; urgencyColor = '#b85c00'; urgencyBg = '#fff3e0';
    message = 'Submit your appeal this week. If you need legal help, contact Röda Korset or UNHCR Sweden immediately.';
  } else {
    urgency = `${daysLeft} DAYS REMAINING`; urgencyColor = '#1a5c3a'; urgencyBg = '#e0f0e8';
    message = 'You still have time, but do not delay. Prepare your appeal letter now.';
  }

  const lang = document.body.className.replace('lang-','');
  const label = lang==='sv' ? 'Din överklagningsdeadline' : lang==='ar' ? 'الموعد النهائي لاستئنافك' : lang==='uk' ? 'Ваш дедлайн апеляції' : 'Your appeal deadline';
  const disclaimer = lang==='sv' ? 'Beräknat enligt 3-veckorsregeln i svensk lag. Klartväg är inte juridisk rådgivning.'
    : lang==='ar' ? 'محسوب وفق قاعدة 3 أسابيع. كلارتفاغ ليس استشارة قانونية.'
    : lang==='uk' ? 'Розраховано за правилом 3 тижнів. Klartväg не є юридичною консультацією.'
    : 'Calculated based on the official 3-week rule in Swedish law. Klartväg is not legal advice.';

  document.getElementById('appeal-result').style.display = 'block';
  document.getElementById('appeal-result').innerHTML = `
    <div style="border:2px solid ${urgencyColor}; background:${urgencyBg}; padding:20px 24px; margin-bottom:16px">
      <div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${urgencyColor}; margin-bottom:8px">${label}</div>
      <div style="font-family:'Source Serif 4',serif; font-size:26px; font-weight:600; color:var(--ink); margin-bottom:4px">${fmt(deadlineDate)}</div>
      <div style="font-size:13px; font-weight:600; color:${urgencyColor}; margin-bottom:12px; font-family:'IBM Plex Mono',monospace; letter-spacing:0.08em">${urgency}</div>
      <div style="font-size:13px; color:var(--ink2); line-height:1.7">${message}</div>
      <div style="font-size:11px; color:var(--ink3); margin-top:12px; padding-top:10px; border-top:1px solid ${urgencyColor}30; font-style:italic">${disclaimer}</div>
    </div>`;
  document.getElementById('appeal-result').scrollIntoView({ behavior:'smooth', block:'start' });
}