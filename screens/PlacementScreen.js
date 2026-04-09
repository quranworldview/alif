// PlacementScreen.js — Option B Placement System
// Phase 1: 2 huroof questions  → auto-credit all 28 huroof if pass
// Phase 2: 10 kalimaat L1 MCQs → ≥8/10 skips to L2 (credits all L1)
//                               → <8/10 places at first wrong word in L1
// Non-stressful: no timer, no score shown mid-quiz, calm language throughout.

import { t } from '../i18n/strings.js';

// ─────────────────────────────────────────────
// PHASE 1 — Huroof recognition (2 questions)
// ─────────────────────────────────────────────
const HUROOF_QUESTIONS = [
  {
    id: 'h1',
    phase: 'huroof',
    prompt: {
      en: 'Which of these is the Arabic letter Meem (م)?',
      ur: 'ان میں سے عربی حرف "م" کون سا ہے؟',
      hi: 'इनमें से अरबी हर्फ़ "م" कौन सा है?',
    },
    type: 'recognize',
    choices: ['م', 'ن', 'ف', 'ق'],
    correct: 'م',
  },
  {
    id: 'h2',
    phase: 'huroof',
    prompt: {
      en: 'Which of these is the Arabic letter Alif (ا)?',
      ur: 'ان میں سے عربی حرف "ا" کون سا ہے؟',
      hi: 'इनमें से अरबी हर्फ़ "ا" कौन सा है?',
    },
    type: 'recognize',
    choices: ['و', 'ز', 'ا', 'ر'],
    correct: 'ا',
  },
];

// ─────────────────────────────────────────────
// PHASE 2 — Kalimaat L1 review (10 questions)
// Sampled across L1 frequency range (words 1–50).
// lessonId maps each question to its L1 lesson for placement.
// ─────────────────────────────────────────────
const KALIMAAT_QUESTIONS = [
  {
    id: 'k1', phase: 'kalimaat', lessonId: 'kalimaat-01',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'ٱللَّهُ',
    choices: [
      { label: { en: 'Allah — The Only God', ur: 'اللہ — معبودِ حقیقی', hi: 'अल्लाह — एकमात्र पूज्य' }, correct: true },
      { label: { en: 'The Prophet', ur: 'نبی', hi: 'नबी' }, correct: false },
      { label: { en: 'The Book', ur: 'کتاب', hi: 'किताब' }, correct: false },
      { label: { en: 'The Day', ur: 'دن', hi: 'दिन' }, correct: false },
    ],
  },
  {
    id: 'k2', phase: 'kalimaat', lessonId: 'kalimaat-04',
    prompt: { en: 'What does this preposition mean?', ur: 'اس حرف جر کا مطلب کیا ہے؟', hi: 'इस हर्फ़ का क्या मतलब है?' },
    arabic: 'فِي',
    choices: [
      { label: { en: 'In / Inside', ur: 'میں / اندر', hi: 'में / अंदर' }, correct: true },
      { label: { en: 'On / Upon', ur: 'پر / اوپر', hi: 'पर / ऊपर' }, correct: false },
      { label: { en: 'From / Of', ur: 'سے / کا', hi: 'से / का' }, correct: false },
      { label: { en: 'To / Towards', ur: 'کو / طرف', hi: 'को / तरफ़' }, correct: false },
    ],
  },
  {
    id: 'k3', phase: 'kalimaat', lessonId: 'kalimaat-10',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'لَا',
    choices: [
      { label: { en: 'No / Not', ur: 'نہیں / مت', hi: 'नहीं / मत' }, correct: true },
      { label: { en: 'Yes / Indeed', ur: 'ہاں / بے شک', hi: 'हाँ / ज़रूर' }, correct: false },
      { label: { en: 'And / With', ur: 'اور / کے ساتھ', hi: 'और / के साथ' }, correct: false },
      { label: { en: 'Or / Either', ur: 'یا / یا تو', hi: 'या / अथवा' }, correct: false },
    ],
  },
  {
    id: 'k4', phase: 'kalimaat', lessonId: 'kalimaat-16',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'رَبّ',
    choices: [
      { label: { en: 'Lord / Sustainer', ur: 'رب / پروردگار', hi: 'रब / पालनहार' }, correct: true },
      { label: { en: 'Prophet / Messenger', ur: 'نبی / رسول', hi: 'नबी / रसूल' }, correct: false },
      { label: { en: 'Angel / Spirit', ur: 'فرشتہ / روح', hi: 'फ़रिश्ता / रूह' }, correct: false },
      { label: { en: 'King / Ruler', ur: 'بادشاہ / حاکم', hi: 'बादशाह / हाकिम' }, correct: false },
    ],
  },
  {
    id: 'k5', phase: 'kalimaat', lessonId: 'kalimaat-20',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'نَفْس',
    choices: [
      { label: { en: 'Soul / Self', ur: 'نفس / روح / ذات', hi: 'नफ़्स / आत्मा / स्वयं' }, correct: true },
      { label: { en: 'Heart / Mind', ur: 'دل / ذہن', hi: 'दिल / मन' }, correct: false },
      { label: { en: 'Body / Form', ur: 'جسم / صورت', hi: 'जिस्म / रूप' }, correct: false },
      { label: { en: 'Eye / Spring', ur: 'آنکھ / چشمہ', hi: 'आँख / चश्मा' }, correct: false },
    ],
  },
  {
    id: 'k6', phase: 'kalimaat', lessonId: 'kalimaat-27',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'أَرْض',
    choices: [
      { label: { en: 'Earth / Land', ur: 'زمین / سرزمین', hi: 'ज़मीन / धरती' }, correct: true },
      { label: { en: 'Sky / Heaven', ur: 'آسمان / جنت', hi: 'आसमान / जन्नत' }, correct: false },
      { label: { en: 'Sea / River', ur: 'سمندر / دریا', hi: 'समुंदर / दरिया' }, correct: false },
      { label: { en: 'Mountain / Hill', ur: 'پہاڑ / ٹیلہ', hi: 'पहाड़ / टीला' }, correct: false },
    ],
  },
  {
    id: 'k7', phase: 'kalimaat', lessonId: 'kalimaat-33',
    prompt: { en: 'What does this verb mean?', ur: 'اس فعل کا مطلب کیا ہے؟', hi: 'इस फ़ेल का क्या मतलब है?' },
    arabic: 'آمَنَ',
    choices: [
      { label: { en: 'He believed / had faith', ur: 'اس نے ایمان لایا', hi: 'उसने ईमान लाया' }, correct: true },
      { label: { en: 'He worshipped', ur: 'اس نے عبادت کی', hi: 'उसने इबादत की' }, correct: false },
      { label: { en: 'He repented', ur: 'اس نے توبہ کی', hi: 'उसने तौबा की' }, correct: false },
      { label: { en: 'He created', ur: 'اس نے پیدا کیا', hi: 'उसने पैदा किया' }, correct: false },
    ],
  },
  {
    id: 'k8', phase: 'kalimaat', lessonId: 'kalimaat-41',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'حَقّ',
    choices: [
      { label: { en: 'Truth / Right / Justice', ur: 'حق / سچ / انصاف', hi: 'हक़ / सच / न्याय' }, correct: true },
      { label: { en: 'Falsehood / Lie', ur: 'باطل / جھوٹ', hi: 'बातिल / झूठ' }, correct: false },
      { label: { en: 'Command / Order', ur: 'حکم / امر', hi: 'हुक्म / अमर' }, correct: false },
      { label: { en: 'Promise / Pledge', ur: 'وعدہ / عہد', hi: 'वादा / अहद' }, correct: false },
    ],
  },
  {
    id: 'k9', phase: 'kalimaat', lessonId: 'kalimaat-46',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'آيَة',
    choices: [
      { label: { en: 'Sign / Verse / Miracle', ur: 'آیت / نشانی / معجزہ', hi: 'आयत / निशानी / मोजज़ा' }, correct: true },
      { label: { en: 'Prayer / Salah', ur: 'نماز / صلاۃ', hi: 'नमाज़ / सलात' }, correct: false },
      { label: { en: 'Chapter / Surah', ur: 'سورت / باب', hi: 'सूरत / अध्याय' }, correct: false },
      { label: { en: 'Book / Scripture', ur: 'کتاب / صحیفہ', hi: 'किताब / सहीफ़ा' }, correct: false },
    ],
  },
  {
    id: 'k10', phase: 'kalimaat', lessonId: 'kalimaat-50',
    prompt: { en: 'What does this word mean?', ur: 'اس لفظ کا مطلب کیا ہے؟', hi: 'इस शब्द का क्या मतलब है?' },
    arabic: 'آخِرَة',
    choices: [
      { label: { en: 'The Hereafter / The Next world', ur: 'آخرت / اگلی دنیا', hi: 'आख़िरत / अगली दुनिया' }, correct: true },
      { label: { en: 'This world / The present', ur: 'دنیا / موجودہ زندگی', hi: 'दुनिया / यह ज़िंदगी' }, correct: false },
      { label: { en: 'The Last Day / Qiyamah', ur: 'قیامت / آخری دن', hi: 'क़ियामत / आख़िरी दिन' }, correct: false },
      { label: { en: 'Paradise / Garden', ur: 'جنت / باغ', hi: 'जन्नत / बाग़' }, correct: false },
    ],
  },
];

const ALL_QUESTIONS = [...HUROOF_QUESTIONS, ...KALIMAAT_QUESTIONS];
const TOTAL = ALL_QUESTIONS.length; // 12

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let state = {
  current: 0,
  answered: false,
  huroof: { correct: 0 },
  kalimaat: { correct: 0, firstWrongLessonId: null },
};

function resetState() {
  state = {
    current: 0,
    answered: false,
    huroof: { correct: 0 },
    kalimaat: { correct: 0, firstWrongLessonId: null },
  };
}

// ─────────────────────────────────────────────
// MAIN RENDER
// ─────────────────────────────────────────────
export function renderPlacement(lang) {
  resetState();

  return `
    <div id="placement-screen" class="screen active" style="display:flex; flex-direction:column; min-height:100vh; background:var(--bg-primary);">

      <div style="padding:16px 20px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:14px;">
        <button class="icon-btn" onclick="showScreen('welcome')" style="flex-shrink:0;">←</button>
        <div style="flex:1;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:5px;" id="placement-step-label">
            ${_stepLabel(0, lang)}
          </div>
          <div class="progress-bar" style="height:5px;">
            <div class="progress-fill" id="placement-progress" style="width:${_pct(0)}%; transition:width 0.35s ease;"></div>
          </div>
        </div>
      </div>

      <div id="placement-phase-label" style="padding:14px 24px 0; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.09em; color:var(--gold);">
        ${_phaseLabel(ALL_QUESTIONS[0], lang)}
      </div>

      <div class="scroll-content" style="padding:20px 24px 32px; flex:1;" id="placement-body">
        ${_renderQuestion(0, lang)}
      </div>

      <div style="padding:0 24px 28px; text-align:center;">
        <button class="btn-ghost" style="font-size:0.8125em; color:var(--text-muted);" onclick="skipPlacement()">
          ${t('skipPlacement', lang)}
        </button>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────────────
// QUESTION RENDERER
// ─────────────────────────────────────────────

// Simple Fisher-Yates shuffle — produces a new array, never mutates the source.
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _renderQuestion(idx, lang) {
  const q = ALL_QUESTIONS[idx];
  const isRecognize = q.type === 'recognize';

  const arabicBlock = q.arabic ? `
    <div style="text-align:center; margin:20px 0; padding:22px 20px; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:16px;">
      <span style="font-family:'Amiri',serif; font-size:52px; direction:rtl; color:var(--text-arabic); line-height:1.4;">${q.arabic}</span>
    </div>` : '';

  // Shuffle choices so the correct answer is never always position 1
  const shuffledChoices = _shuffle(q.choices);

  const choicesHtml = isRecognize
    ? shuffledChoices.map(c => `
        <button class="choice-btn" data-correct="${c === q.correct}"
          onclick="handlePlacementAnswer(this, ${JSON.stringify(c === q.correct)})"
          style="font-family:'Amiri',serif; font-size:2em; direction:rtl; padding:14px;">
          ${c}
        </button>`).join('')
    : shuffledChoices.map(c => `
        <button class="choice-btn text-choice" data-correct="${c.correct}"
          onclick="handlePlacementAnswer(this, ${JSON.stringify(c.correct)})">
          ${c.label[lang] || c.label.en}
        </button>`).join('');

  const isLast = idx === TOTAL - 1;
  const nextLabel = isLast
    ? (lang === 'ur' ? 'نتیجہ دیکھیں' : lang === 'hi' ? 'नतीजा देखें' : 'See Your Level')
    : (lang === 'ur' ? 'اگلا سوال ←' : lang === 'hi' ? 'अगला सवाल →' : 'Next →');

  return `
    <p style="font-size:1.0625em; font-weight:500; color:var(--text-primary); line-height:1.55; margin-bottom:4px;">
      ${q.prompt[lang] || q.prompt.en}
    </p>
    ${arabicBlock}
    <div class="choices-grid" style="${isRecognize ? '' : ''}">
      ${choicesHtml}
    </div>
    <div class="feedback-box" id="placement-feedback"></div>
    <div id="placement-next" style="display:none; margin-top:8px;">
      <button class="btn btn-primary" onclick="nextPlacementQuestion()">${nextLabel}</button>
    </div>
  `;
}

// ─────────────────────────────────────────────
// ANSWER HANDLER
// ─────────────────────────────────────────────
export function handlePlacementAnswer(btn, isCorrect) {
  if (state.answered) return;
  state.answered = true;

  const correct = isCorrect === true || isCorrect === 'true';
  const q = ALL_QUESTIONS[state.current];

  document.querySelectorAll('#placement-body .choice-btn').forEach(b => {
    b.disabled = true;
  });

  btn.classList.add(correct ? 'correct-choice' : 'wrong-choice');
  if (!correct) {
    document.querySelectorAll('#placement-body .choice-btn').forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct-choice');
    });
  }

  if (q.phase === 'huroof') {
    if (correct) state.huroof.correct++;
  } else {
    if (correct) {
      state.kalimaat.correct++;
    } else if (!state.kalimaat.firstWrongLessonId) {
      state.kalimaat.firstWrongLessonId = q.lessonId;
    }
  }

  document.getElementById('placement-next').style.display = 'block';
}

// ─────────────────────────────────────────────
// NEXT QUESTION
// ─────────────────────────────────────────────
export function nextPlacementQuestion() {
  state.current++;
  state.answered = false;

  if (state.current >= TOTAL) {
    _showResult();
    return;
  }

  const lang = window.APP_STATE?.lang || 'en';
  const idx = state.current;
  const q = ALL_QUESTIONS[idx];

  document.getElementById('placement-body').innerHTML = _renderQuestion(idx, lang);
  document.getElementById('placement-step-label').textContent = _stepLabel(idx, lang);
  document.getElementById('placement-progress').style.width = `${_pct(idx)}%`;
  document.getElementById('placement-phase-label').textContent = _phaseLabel(q, lang);
}

// ─────────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────────
function _showResult() {
  const lang = window.APP_STATE?.lang || 'en';

  const passedHuroof    = state.huroof.correct >= 1;
  const kScore          = state.kalimaat.correct;
  const passedKalimaat  = kScore >= 8;

  let placement;
  if (!passedHuroof) {
    placement = 'zero';
  } else if (passedKalimaat) {
    placement = 'intermediate';
  } else {
    placement = 'beginner';
  }

  const results = {
    zero: {
      icon: '🌱',
      label: { en: 'Complete Beginner', ur: 'بالکل ابتدائی', hi: 'बिल्कुल शुरुआती' },
      desc: {
        en: "No problem at all — every expert was once here. We'll start from the Arabic alphabet and build everything step by step.",
        ur: 'کوئی بات نہیں — ہر ماہر کبھی یہاں تھا۔ ہم عربی حروف سے شروع کریں گے اور سب کچھ قدم بہ قدم بنائیں گے۔',
        hi: 'कोई बात नहीं — हर माहिर एक बार यहाँ था। हम अरबी हुरूफ़ से शुरू करेंगे और सब कुछ क़दम दर क़दम बनाएंगे।',
      },
      startId: 'huroof-01',
      creditHuroof: false,
      creditL1: false,
    },
    beginner: {
      icon: '📖',
      label: { en: 'Can Read Arabic', ur: 'عربی پڑھ سکتے ہیں', hi: 'अरबी पढ़ सकते हैं' },
      desc: {
        en: "You can read the letters — that's the foundation. We'll skip the alphabet and start building your Qur'anic vocabulary.",
        ur: 'آپ حروف پڑھ سکتے ہیں — یہ بنیاد ہے۔ ہم حروف چھوڑیں گے اور قرآنی الفاظ بنانا شروع کریں گے۔',
        hi: 'आप हुरूफ़ पढ़ सकते हैं — यही बुनियाद है। हम हुरूफ़ छोड़ेंगे और क़ुरआनी अल्फ़ाज़ बनाना शुरू करेंगे।',
      },
      startId: state.kalimaat.firstWrongLessonId || 'kalimaat-01',
      creditHuroof: true,
      creditL1: false,
    },
    intermediate: {
      icon: '✨',
      label: { en: 'Strong Foundation', ur: 'مضبوط بنیاد', hi: 'मज़बूत बुनियाद' },
      desc: {
        en: "You know your core Qur'anic vocabulary well. We'll credit Level 1 and start you at Level 2 — where the real depth begins.",
        ur: 'آپ قرآن کے بنیادی الفاظ اچھی طرح جانتے ہیں۔ لیول ۱ کریڈٹ ہو گا اور آپ لیول ۲ سے شروع کریں گے — جہاں سے گہرائی شروع ہوتی ہے۔',
        hi: 'आप क़ुरआन के बुनियादी अल्फ़ाज़ अच्छी तरह जानते हैं। लेवल 1 क्रेडिट होगा और आप लेवल 2 से शुरू करेंगे — जहाँ से असली गहराई शुरू होती है।',
      },
      startId: 'kalimaat-51',
      creditHuroof: true,
      creditL1: true,
    },
  };

  const r = results[placement];

  const scoreHtml = passedHuroof ? `
    <div style="background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:14px; padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between;">
      <div style="font-size:0.8125em; color:var(--text-muted); text-align:left;">
        ${lang === 'ur' ? 'قرآنی الفاظ (۱۰ میں سے)' : lang === 'hi' ? 'क़ुरआनी अल्फ़ाज़ (10 में से)' : "Qur'anic vocabulary (out of 10)"}
      </div>
      <div style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:700; color:${kScore >= 8 ? 'var(--crimson)' : 'var(--text-primary)'};">
        ${kScore}<span style="font-size:0.5em; color:var(--text-muted); font-family:'DM Sans',sans-serif;">/10</span>
      </div>
    </div>` : '';

  document.getElementById('placement-screen').innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 28px; text-align:center; min-height:100vh;">

      <div style="font-size:64px; margin-bottom:16px;">${r.icon}</div>

      <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:8px;">
        ${lang === 'ur' ? 'آپ کا شروعاتی مرحلہ' : lang === 'hi' ? 'आपका शुरुआती स्तर' : 'Your starting level'}
      </div>

      <h2 style="font-family:'Cormorant Garamond',serif; font-size:2em; font-weight:600; color:var(--text-primary); margin-bottom:12px;">
        ${r.label[lang] || r.label.en}
      </h2>

      <p style="font-size:0.9em; color:var(--text-muted); line-height:1.65; max-width:300px; margin-bottom:24px;">
        ${r.desc[lang] || r.desc.en}
      </p>

      ${scoreHtml}

      <div style="width:100%; max-width:340px; display:flex; flex-direction:column; gap:12px;">
        <button class="btn btn-primary" onclick="confirmPlacement('${placement}', '${r.startId}', ${r.creditHuroof}, ${r.creditL1})">
          ${lang === 'ur' ? 'شروع کریں' : lang === 'hi' ? 'शुरू करें' : 'Begin Here'}
        </button>
        <button class="btn btn-secondary" onclick="chooseLevelManually()">
          ${lang === 'ur' ? 'خود مرحلہ چنیں' : lang === 'hi' ? 'ख़ुद स्तर चुनें' : 'Choose my level instead'}
        </button>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────────────
// MANUAL LEVEL CHOOSER
// ─────────────────────────────────────────────
export function showManualLevelChoice() {
  const lang = window.APP_STATE?.lang || 'en';

  const options = [
    {
      placement: 'zero', icon: '🌱',
      label:   { en: 'Complete Beginner', ur: 'بالکل ابتدائی', hi: 'बिल्कुल शुरुआती' },
      desc:    { en: 'Start from the Arabic alphabet', ur: 'عربی حروف سے شروع کریں', hi: 'अरबी हुरूफ़ से शुरू करें' },
      startId: 'huroof-01', creditHuroof: false, creditL1: false,
    },
    {
      placement: 'beginner', icon: '📖',
      label:   { en: 'Can Read Arabic', ur: 'عربی پڑھ سکتے ہیں', hi: 'अरबी पढ़ सकते हैं' },
      desc:    { en: "Skip letters — start on Qur'anic words", ur: 'حروف چھوڑیں — الفاظ سے شروع کریں', hi: 'हुरूफ़ छोड़ें — अल्फ़ाज़ से शुरू करें' },
      startId: 'kalimaat-01', creditHuroof: true, creditL1: false,
    },
    {
      placement: 'intermediate', icon: '✨',
      label:   { en: 'Know Core Vocabulary', ur: 'بنیادی الفاظ جانتے ہیں', hi: 'बुनियादी अल्फ़ाज़ जानते हैं' },
      desc:    { en: 'Skip Level 1 — start on Level 2 words', ur: 'لیول ۱ چھوڑیں — لیول ۲ سے شروع کریں', hi: 'लेवल 1 छोड़ें — लेवल 2 से शुरू करें' },
      startId: 'kalimaat-51', creditHuroof: true, creditL1: true,
    },
  ];

  document.getElementById('placement-screen').innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; padding:32px 24px; min-height:100vh;">

      <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:600; color:var(--text-primary); margin-bottom:6px; text-align:center;">
        ${lang === 'ur' ? 'اپنا مرحلہ چنیں' : lang === 'hi' ? 'अपना स्तर चुनें' : 'Choose your level'}
      </h2>
      <p style="font-size:0.875em; color:var(--text-muted); text-align:center; margin-bottom:28px;">
        ${lang === 'ur' ? 'آپ یہ بعد میں بھی بدل سکتے ہیں۔' : lang === 'hi' ? 'आप इसे बाद में भी बदल सकते हैं।' : 'You can always change this later.'}
      </p>

      <div style="display:flex; flex-direction:column; gap:14px;">
        ${options.map(opt => `
          <button onclick="confirmPlacement('${opt.placement}', '${opt.startId}', ${opt.creditHuroof}, ${opt.creditL1})"
            style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:16px; padding:18px 20px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:16px; box-shadow:var(--shadow); transition:border-color 0.18s;"
            onmouseover="this.style.borderColor='var(--crimson)'"
            onmouseout="this.style.borderColor='var(--border)'">
            <span style="font-size:1.75em; flex-shrink:0;">${opt.icon}</span>
            <div>
              <div style="font-size:1em; font-weight:600; color:var(--text-primary); margin-bottom:3px;">${opt.label[lang] || opt.label.en}</div>
              <div style="font-size:0.8125em; color:var(--text-muted);">${opt.desc[lang] || opt.desc.en}</div>
            </div>
          </button>
        `).join('')}
      </div>

    </div>
  `;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function _stepLabel(idx, lang) {
  const n = idx + 1;
  if (lang === 'ur') return `سوال ${n} / ${TOTAL}`;
  if (lang === 'hi') return `सवाल ${n} / ${TOTAL}`;
  return `Question ${n} of ${TOTAL}`;
}

function _pct(idx) {
  return Math.round(((idx + 1) / TOTAL) * 100);
}

function _phaseLabel(q, lang) {
  if (q.phase === 'huroof') {
    if (lang === 'ur') return 'حروف — عربی حروفِ تہجی';
    if (lang === 'hi') return 'हुरूफ़ — अरबी अक्षर';
    return 'Huroof — Arabic Alphabet';
  }
  if (lang === 'ur') return 'کَلِمَات — قرآنی الفاظ';
  if (lang === 'hi') return 'कलिमात — क़ुरआनी अल्फ़ाज़';
  return "Kalimaat — Qur'anic Words";
}
