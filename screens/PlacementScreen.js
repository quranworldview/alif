// PlacementScreen.js — Routes student to correct starting level.
// Non-stressful by design: no timer, no score shown mid-quiz, calm transitions.
import { t } from '../i18n/strings.js';
import { ArabicText } from '../components/ArabicText.js';

const QUESTIONS = [
  {
    id: 'p1',
    prompt: { en: 'Which of these is the Arabic letter Ba (ب)?', ur: 'ان میں سے عربی حرف "ب" کون سا ہے؟', hi: 'इनमें से अरबी हर्फ़ "ب" कौन सा है?' },
    type: 'recognize',
    choices: ['ب', 'ن', 'ت', 'ث'],
    correct: 'ب',
    weight: 'zero',
  },
  {
    id: 'p2',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا کیا مطلب ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'اللّٰه',
    type: 'mcq',
    choices: [
      { label: { en: 'Allah (God)', ur: 'اللہ', hi: 'अल्लाह (ईश्वर)' }, correct: true },
      { label: { en: 'The Book', ur: 'کتاب', hi: 'किताब' }, correct: false },
      { label: { en: 'The Prophet', ur: 'نبی', hi: 'नबी' }, correct: false },
      { label: { en: 'The Day', ur: 'دن', hi: 'दिन' }, correct: false },
    ],
    weight: 'beginner',
  },
  {
    id: 'p3',
    prompt: { en: 'Which form of the letter is shown?', ur: 'حرف کی کون سی شکل دکھائی گئی ہے؟', hi: 'हर्फ़ की कौन सी शकल दिखाई गई है?' },
    arabic: 'ـبـ',
    type: 'mcq',
    choices: [
      { label: { en: 'Isolated', ur: 'منفرد', hi: 'अकेला' }, correct: false },
      { label: { en: 'Initial', ur: 'ابتدائی', hi: 'शुरुआती' }, correct: false },
      { label: { en: 'Medial', ur: 'درمیانی', hi: 'बीच का' }, correct: true },
      { label: { en: 'Final', ur: 'آخری', hi: 'आखिरी' }, correct: false },
    ],
    weight: 'zero',
  },
  {
    id: 'p4',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا کیا مطلب ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'رَحْمَة',
    type: 'mcq',
    choices: [
      { label: { en: 'Mercy', ur: 'رحمت', hi: 'रहमत' }, correct: true },
      { label: { en: 'Prayer', ur: 'نماز', hi: 'नमाज़' }, correct: false },
      { label: { en: 'Faith', ur: 'ایمان', hi: 'ईमान' }, correct: false },
      { label: { en: 'Knowledge', ur: 'علم', hi: 'इल्म' }, correct: false },
    ],
    weight: 'beginner',
  },
  {
    id: 'p5',
    prompt: { en: 'In Arabic grammar, what is an Ism (اِسْم)?', ur: 'عربی قواعد میں اِسم کیا ہوتا ہے؟', hi: 'अरबी व्याकरण में इस्म (اِسْم) क्या होता है?' },
    type: 'mcq',
    choices: [
      { label: { en: 'A noun — a name, person, or thing', ur: 'اسم — نام، شخص یا چیز', hi: 'इस्म — नाम, व्यक्ति या चीज़' }, correct: true },
      { label: { en: 'A verb — an action', ur: 'فعل — عمل', hi: 'फ़ेल — एक काम' }, correct: false },
      { label: { en: 'A preposition', ur: 'حرف جر', hi: 'हर्फ़ — एक जोड़ने वाला शब्द' }, correct: false },
      { label: { en: 'A sentence', ur: 'جملہ', hi: 'जुमला' }, correct: false },
    ],
    weight: 'intermediate',
  },
  {
    id: 'p6',
    prompt: { en: 'Can you read this word?', ur: 'کیا آپ یہ لفظ پڑھ سکتے ہیں؟', hi: 'क्या आप यह शब्द पढ़ सकते हैं?' },
    arabic: 'كِتَاب',
    type: 'mcq',
    choices: [
      { label: { en: 'Kitaab — Book', ur: 'کِتاب — کتاب', hi: 'किताब — किताब' }, correct: true },
      { label: { en: 'Kalb — Heart', ur: 'قلب — دل', hi: 'क़ल्ब — दिल' }, correct: false },
      { label: { en: 'Kalam — Speech', ur: 'کلام — بات', hi: 'कलाम — बात' }, correct: false },
      { label: { en: 'Kabeer — Great', ur: 'کبیر — بڑا', hi: 'कबीर — बड़ा' }, correct: false },
    ],
    weight: 'beginner',
  },
];

let placementState = { current: 0, scores: { zero: 0, beginner: 0, intermediate: 0 }, answered: false };

export function renderPlacement(lang) {
  placementState = { current: 0, scores: { zero: 0, beginner: 0, intermediate: 0 }, answered: false };
  return `
    <div id="placement-screen" class="screen active" style="background:var(--bg-primary);">
      <div style="padding:20px 20px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px;">
        <button class="icon-btn" onclick="showScreen('welcome')">←</button>
        <div style="flex:1;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:4px;" id="placement-step-label">
            ${t('placementQ', lang)} 1 ${t('placementOf', lang)} ${QUESTIONS.length}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="placement-progress" style="width:${(1/QUESTIONS.length)*100}%;"></div>
          </div>
        </div>
      </div>

      <div class="scroll-content" style="padding:32px 24px 40px;" id="placement-body">
        ${renderQuestion(0, lang)}
      </div>

      <!-- Skip option -->
      <div style="padding:0 24px 24px; text-align:center;">
        <button class="btn-ghost" style="font-size:0.8125em; color:var(--text-muted);" onclick="skipPlacement()">
          ${t('skipPlacement', lang)}
        </button>
      </div>
    </div>
  `;
}

function renderQuestion(idx, lang) {
  const q = QUESTIONS[idx];
  const arabicHtml = q.arabic ? `
    <div style="text-align:center; margin:20px 0; padding:20px; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:16px;">
      <span style="font-family:'Amiri',serif; font-size:48px; direction:rtl; color:var(--text-arabic); line-height:1.5;">${q.arabic}</span>
    </div>` : '';

  const choices = q.choices.map(c => {
    const label = typeof c === 'string' ? c : (c.label[lang] || c.label.en);
    const isArabic = typeof c === 'string';
    return `<button class="choice-btn ${isArabic ? '' : 'text-choice'}"
      onclick="handlePlacementAnswer(this, ${typeof c === 'string' ? `'${c}'` : c.correct})"
      data-correct="${typeof c === 'string' ? c === q.correct : c.correct}">
      ${label}
    </button>`;
  }).join('');

  return `
    <div style="margin-bottom:24px;">
      <p style="font-size:1.0625em; font-weight:500; color:var(--text-primary); line-height:1.5; margin-bottom:4px;">
        ${q.prompt[lang] || q.prompt.en}
      </p>
    </div>
    ${arabicHtml}
    <div class="choices-grid" style="${q.choices.length > 2 ? '' : 'grid-template-columns:1fr;'}">
      ${choices}
    </div>
    <div class="feedback-box" id="placement-feedback"></div>
    <div id="placement-next" style="display:none; margin-top:8px;">
      <button class="btn btn-primary" onclick="nextPlacementQuestion()">
        ${idx < QUESTIONS.length - 1 ? (lang === 'ur' ? 'اگلا سوال →' : lang === 'hi' ? 'अगला सवाल →' : 'Next Question →') : (lang === 'ur' ? 'نتیجہ دیکھیں' : lang === 'hi' ? 'नतीजा देखें' : 'See Your Level')}
      </button>
    </div>
  `;
}

export function handlePlacementAnswer(btn, isCorrect) {
  if (placementState.answered) return;
  placementState.answered = true;

  const allBtns = document.querySelectorAll('#placement-body .choice-btn');
  allBtns.forEach(b => b.disabled = true);

  if (isCorrect === true || isCorrect === 'true') {
    btn.classList.add('correct-choice');
    const q = QUESTIONS[placementState.current];
    placementState.scores[q.weight]++;
  } else {
    btn.classList.add('wrong-choice');
    allBtns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct-choice'); });
  }

  document.getElementById('placement-next').style.display = 'block';
}

export function nextPlacementQuestion() {
  placementState.current++;
  placementState.answered = false;

  if (placementState.current >= QUESTIONS.length) {
    showPlacementResult();
    return;
  }

  const lang = window.APP_STATE?.lang || 'en';
  const idx = placementState.current;
  document.getElementById('placement-body').innerHTML = renderQuestion(idx, lang);
  document.getElementById('placement-step-label').textContent =
    `${t('placementQ', lang)} ${idx + 1} ${t('placementOf', lang)} ${QUESTIONS.length}`;
  document.getElementById('placement-progress').style.width =
    `${((idx + 1) / QUESTIONS.length) * 100}%`;
}

function showPlacementResult() {
  const lang = window.APP_STATE?.lang || 'en';
  const { scores } = placementState;

  let level;
  if (scores.intermediate >= 1) level = 'intermediate';
  else if (scores.beginner >= 2 || scores.zero >= 3) level = 'beginner';
  else level = 'zero';

  const levelLabels = {
    zero:         { label: t('levelZero', lang),        desc: t('levelZeroDesc', lang),         icon: '🌱', start: 'huroof-01' },
    beginner:     { label: t('levelBeginner', lang),    desc: t('levelBeginnerDesc', lang),      icon: '📖', start: 'huroof-01' },
    intermediate: { label: t('levelIntermediate', lang),desc: t('levelIntermediateDesc', lang),  icon: '✨', start: 'kalimaat-01' },
  };
  const info = levelLabels[level];

  document.getElementById('placement-screen').innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 28px; text-align:center;">

      <div style="font-size:64px; margin-bottom:16px; animation:screenIn 0.4s ease;">${info.icon}</div>

      <div style="font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:8px;">
        ${t('placementResult', lang)}
      </div>

      <h2 style="font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:400; color:var(--text-primary); margin-bottom:12px;">
        ${info.label}
      </h2>

      <p style="font-size:0.9375em; color:var(--text-muted); line-height:1.6; max-width:280px; margin-bottom:40px;">
        ${info.desc}
      </p>

      <div style="width:100%; display:flex; flex-direction:column; gap:12px;">
        <button class="btn btn-primary" onclick="confirmPlacement('${level}', '${info.start}')">
          ${t('startLevel', lang)}
        </button>
        <button class="btn btn-secondary" onclick="chooseLevelManually()">
          ${t('changeLevel', lang)}
        </button>
      </div>
    </div>
  `;
}

export function showManualLevelChoice() {
  const lang = window.APP_STATE?.lang || 'en';
  document.getElementById('placement-screen').innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; padding:40px 24px;">

      <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:400; color:var(--text-primary); margin-bottom:8px; text-align:center;">
        Choose your level
      </h2>
      <p style="font-size:0.875em; color:var(--text-muted); text-align:center; margin-bottom:32px;">
        You can always change this later.
      </p>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${[
          { level:'zero', icon:'🌱', label: t('levelZero', lang), desc: t('levelZeroDesc', lang), start:'huroof-01' },
          { level:'beginner', icon:'📖', label: t('levelBeginner', lang), desc: t('levelBeginnerDesc', lang), start:'huroof-01' },
          { level:'intermediate', icon:'✨', label: t('levelIntermediate', lang), desc: t('levelIntermediateDesc', lang), start:'kalimaat-01' },
        ].map(opt => `
          <button onclick="confirmPlacement('${opt.level}', '${opt.start}')"
            style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:16px; padding:18px 20px; text-align:left; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:16px; box-shadow:var(--shadow);"
            onmouseover="this.style.borderColor='var(--border-strong)'"
            onmouseout="this.style.borderColor='var(--border)'">
            <span style="font-size:1.75em;">${opt.icon}</span>
            <div>
              <div style="font-size:1em; font-weight:600; color:var(--text-primary); margin-bottom:3px;">${opt.label}</div>
              <div style="font-size:0.8125em; color:var(--text-muted);">${opt.desc}</div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
