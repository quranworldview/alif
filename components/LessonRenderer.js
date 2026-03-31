// LessonRenderer.js — The 5-step lesson engine.
// Open → Learn → Practice → Reflect → Seal
// All exercise types handled here. Rule 3: exercises are typed, never freeform.
import { t } from '../i18n/strings.js';
import { ArabicText, ArabicInline } from './ArabicText.js';
import { markComplete, addJournalEntry } from './ProgressTracker.js';

let lessonState = { step: 0, answered: false, lesson: null };

export function startLesson(lesson, lang, onExit) {
  lessonState = { step: 0, answered: false, lesson, lang, onExit };
  // Caller must invoke renderStep() after the DOM shell is in place
}

function totalSteps(lesson) {
  return 1 + 1 + (lesson.exercises?.length || 0) + 1 + 1;
  // open + learn + exercises + reflect + seal
}

function progressPct() {
  const total = totalSteps(lessonState.lesson);
  return Math.round(((lessonState.step + 1) / total) * 100);
}

export function renderLessonScreen(lesson) {
  // lesson passed explicitly — don't read from lessonState which isn't set yet
  return `
    <div id="lesson-screen" class="screen active" style="background:var(--bg-lesson); display:flex; flex-direction:column; min-height:100vh;">

      <!-- Lesson topbar -->
      <div style="display:flex; align-items:center; padding:14px 20px; gap:12px; background:var(--bg-lesson); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:50;">
        <button style="background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:1.375em; padding:0; display:flex; align-items:center;"
          onclick="exitLesson()">✕</button>
        <div class="progress-bar" style="flex:1;">
          <div class="progress-fill" id="lesson-progress-fill" style="width:0%;"></div>
        </div>
        <div class="xp-badge">✦ ${lesson?.xp || 0} XP</div>
      </div>

      <!-- Lesson body — filled by renderStep() after startLesson() sets state -->
      <div id="lesson-body" class="scroll-content" style="padding:24px 20px 40px;">
        <div style="display:flex; align-items:center; justify-content:center; min-height:200px; color:var(--text-muted); font-size:0.875em;">
          Loading lesson…
        </div>
      </div>

    </div>
  `;
}

export function renderStep() {
  const { lesson, lang, step } = lessonState;
  const exCount = lesson.exercises?.length || 0;
  const body = document.getElementById('lesson-body');
  if (!body) return;
  body.scrollTo(0, 0);

  // Update progress bar
  const fill = document.getElementById('lesson-progress-fill');
  if (fill) fill.style.width = progressPct() + '%';

  if (step === 0) {
    renderOpen(lesson, lang, body);
  } else if (step === 1) {
    renderLearn(lesson, lang, body);
  } else if (step >= 2 && step < 2 + exCount) {
    const exIdx = step - 2;
    renderExercise(lesson.exercises[exIdx], exIdx, exCount, lang, body);
  } else if (step === 2 + exCount) {
    renderReflect(lesson, lang, body);
  } else {
    renderSeal(lesson, lang, body);
  }
}

export function nextStep() {
  lessonState.step++;
  lessonState.answered = false;
  renderStep();
}

// ── STEP 1: OPEN — Qur'anic hook ──
function renderOpen(lesson, lang, body) {
  const h = lesson.quranic_hook;
  body.innerHTML = `
    <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--crimson); margin-bottom:20px;" class="label-accent">
      ${t('stepOpen', lang)}
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:20px; padding:24px 20px; text-align:center; margin-bottom:20px; box-shadow:var(--shadow);">
      <div style="font-family:'Amiri',serif; font-size:1.875em; direction:rtl; color:var(--text-arabic); line-height:1.9; margin-bottom:16px;">
        ${h.ayah}
      </div>
      <div style="font-size:0.8125em; color:var(--text-muted); font-style:italic; margin-bottom:6px;">
        ${h.translation[lang] || h.translation.en}
      </div>
      <div style="font-size:0.6875em; color:var(--text-muted); opacity:0.7;">
        — ${h.surah[lang] || h.surah.en}
      </div>
    </div>

    <div style="background:var(--accent-bg); border:1px solid var(--border); border-radius:14px; padding:16px 18px; font-size:0.875em; line-height:1.8; color:var(--text-secondary); margin-bottom:28px;">
      ${h.hook_explanation[lang] || h.hook_explanation.en}
    </div>

    <button class="btn btn-primary" onclick="nextStep()">
      ${lang === 'ur' ? 'سیکھنا شروع کریں →' : lang === 'hi' ? 'सीखना शुरू करें →' : 'Start Learning →'}
    </button>
  `;
}

// ── STEP 2: LEARN ──
function renderLearn(lesson, lang, body) {
  if (lesson.type === 'huroof') {
    const ltr = lesson.letter;
    const forms = lesson.forms;
    body.innerHTML = `
      <div class="label-accent" style="margin-bottom:20px;">${t('stepLearn', lang)}</div>

      <div style="text-align:center; margin-bottom:24px;">
        <span style="font-family:'Amiri',serif; font-size:96px; line-height:1.1; color:var(--crimson); display:block; margin-bottom:4px;">${ltr.arabic}</span>
        <div style="font-family:'Cormorant Garamond',serif; font-size:1.5em; font-weight:400; color:var(--text-primary);">${ltr.name[lang] || ltr.name.en}</div>
        <div style="font-size:0.875em; color:var(--text-muted); margin-top:2px;">${ltr.transliteration}</div>
      </div>

      <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:14px 16px; font-size:0.875em; color:var(--text-secondary); line-height:1.6; margin-bottom:20px;">
        ${ltr.sound_description[lang] || ltr.sound_description.en}
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px;">
        ${Object.entries(forms).map(([key, f]) => `
          <div style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:14px; padding:14px 12px; text-align:center; box-shadow:var(--shadow);">
            <div style="font-family:'Amiri',serif; font-size:32px; line-height:1.4; color:var(--text-arabic); margin-bottom:6px; direction:rtl;">${f.arabic}</div>
            <div style="font-size:0.625em; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--crimson); margin-bottom:4px;">${key}</div>
            <div style="font-size:0.6875em; color:var(--text-muted); line-height:1.4;">${f.note[lang] || f.note.en}</div>
          </div>
        `).join('')}
      </div>

      ${lesson.root_family ? `
        <div style="background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:14px; padding:16px; margin-bottom:24px;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--gold-dim); margin-bottom:10px;">Root Family · ${lesson.root_family.root}</div>
          <div style="font-size:0.8125em; color:var(--text-muted); margin-bottom:12px;">${lesson.root_family.meaning[lang] || lesson.root_family.meaning.en}</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${lesson.root_family.words.map(w => `
              <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:6px 12px; text-align:center;">
                <div style="font-family:'Amiri',serif; font-size:1.125em; direction:rtl; color:var(--text-arabic);">${w.arabic}</div>
                <div style="font-size:0.6875em; color:var(--text-muted);">${w.meaning[lang] || w.meaning.en}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <button class="btn btn-primary" onclick="nextStep()">${t('practiceBtn', lang)}</button>
    `;

  } else if (lesson.type === 'kalimaat') {
    const w = lesson.word;
    body.innerHTML = `
      <div class="label-accent" style="margin-bottom:20px;">${t('stepLearn', lang)}</div>

      <div style="text-align:center; background:var(--bg-card); border:1px solid var(--border-gold); border-radius:20px; padding:28px 20px; margin-bottom:20px; box-shadow:var(--shadow-md);">
        <div style="font-family:'Amiri',serif; font-size:64px; line-height:1.2; color:var(--text-arabic); direction:rtl; margin-bottom:12px;">${w.arabic}</div>
        <div style="font-size:1.375em; font-weight:500; color:var(--text-primary); margin-bottom:4px;">${w.meaning[lang] || w.meaning.en}</div>
        <div style="font-size:0.875em; color:var(--text-muted); margin-bottom:12px;">${w.transliteration}</div>
        <div style="display:inline-block; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:50px; padding:4px 14px; font-size:0.75em; color:var(--gold-dim);">
          ★ ${(w.frequency_note || w.freq_note)?.[lang] || (w.frequency_note || w.freq_note)?.en || ''}
        </div>
      </div>

      ${lesson.root?.letters ? `
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:14px 16px; margin-bottom:20px;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:6px;">3-Letter Root</div>
          <div style="font-family:'Amiri',serif; font-size:1.5em; direction:rtl; color:var(--text-arabic); margin-bottom:4px;">${lesson.root.letters}</div>
          ${lesson.root.note ? `<div style="font-size:0.75em; color:var(--text-muted); margin-top:6px; line-height:1.5;">${lesson.root.note[lang] || lesson.root.note.en}</div>` : ''}
        </div>
      ` : ''}

      <button class="btn btn-primary" onclick="nextStep()">${t('practiceBtn', lang)}</button>
    `;

  } else if (lesson.type === 'qawaid') {
    const blocks = lesson.blocks;
    body.innerHTML = `
      <div class="label-accent" style="margin-bottom:20px;">${t('stepLearn', lang)}</div>

      ${blocks.map(b => `
        <div style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:16px; padding:20px; margin-bottom:14px; box-shadow:var(--shadow);">
          <div style="font-family:'Amiri',serif; font-size:40px; direction:rtl; color:var(--crimson); text-align:center; margin-bottom:8px;">${b.arabic}</div>
          <div style="font-family:'Cormorant Garamond',serif; font-size:1.375em; font-weight:600; color:var(--text-primary); text-align:center; margin-bottom:10px;">${b.name[lang] || b.name.en}</div>
          <div style="font-size:0.875em; color:var(--text-secondary); line-height:1.7; margin-bottom:14px;">${b.def[lang] || b.def.en}</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">
            ${b.examples.map(e => `
              <span style="background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:50px; padding:4px 14px; font-family:'Amiri',serif; font-size:1.125em; direction:rtl; color:var(--text-arabic);">${e}</span>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div style="margin-top:8px;">
        <button class="btn btn-primary" onclick="nextStep()">${t('practiceBtn', lang)}</button>
      </div>
    `;
  }
}

// ── STEPS 3+: EXERCISES ──
function renderExercise(ex, exIdx, exCount, lang, body) {
  lessonState.answered = false;
  const promptText = ex.prompt[lang] || ex.prompt.en;

  let choicesHTML = '';

  if (ex.type === 'recognize') {
    choicesHTML = `<div class="choices-grid">
      ${ex.choices.map(c => `
        <button class="choice-btn" onclick="checkRecognize(this, '${c}', '${ex.correct}')">${c}</button>
      `).join('')}
    </div>`;

  } else if (ex.type === 'mcq_meaning' || ex.type === 'mcq_concept') {
    const shuffled = [...ex.choices].sort(() => Math.random() - 0.5);
    choicesHTML = `<div class="choices-grid">
      ${shuffled.map(c => {
        // Support both boolean c.correct AND string c.value === 'correct'
        const isCorrect = (c.correct === true) || (c.value === 'correct');
        return `<button class="choice-btn text-choice" onclick="checkMCQ(this, ${isCorrect})">${c.label[lang] || c.label.en}</button>`;
      }).join('')}
    </div>`;

  } else if (ex.type === 'classify') {
    // Classify a word as Ism / Fi'l / Harf — choices use value strings
    const shuffled = [...ex.choices].sort(() => Math.random() - 0.5);
    choicesHTML = `<div class="choices-grid">
      ${shuffled.map(c => {
        const isCorrect = c.value === ex.correct;
        return `<button class="choice-btn text-choice" onclick="checkMCQ(this, ${isCorrect})">${c.label[lang] || c.label.en}</button>`;
      }).join('')}
    </div>`;

  } else if (ex.type === 'identify_form') {
    // Show a letter form, student picks which position it is (Isolated/Initial/Medial/Final)
    const shuffled = [...ex.choices].sort(() => Math.random() - 0.5);
    choicesHTML = `<div class="choices-grid">
      ${shuffled.map(c => {
        const isCorrect = c.value === ex.correct;
        return `<button class="choice-btn text-choice" onclick="checkMCQ(this, ${isCorrect})">${c.label[lang] || c.label.en}</button>`;
      }).join('')}
    </div>`;

  } else if (ex.type === 'spot_in_ayah') {
    // Tap the target WORD inside a full ayah — words split by spaces
    const ayah = ex.ayah || '';
    const targetPos = ex.target_position ?? 0; // 0-based index of target word
    const words = ayah.split(/\s+/);
    const spansHTML = words.map((word, i) => `
      <span onclick="checkSpotInWord(this, ${i}, ${targetPos})"
        style="font-family:'Amiri',serif; font-size:1.875em; direction:rtl; color:var(--text-arabic); cursor:pointer; padding:6px 10px; border-radius:10px; transition:all 0.15s; display:inline-block; line-height:1.8;"
        onmouseover="this.style.background='var(--accent-bg)'; this.style.transform='scale(1.08)'"
        onmouseout="if(!this.dataset.answered){this.style.background=''; this.style.transform='scale(1)'}"
      >${word}</span>
    `).join(' ');
    choicesHTML = `
      <div style="text-align:center; background:var(--bg-card); border:1px solid var(--border-gold); border-radius:16px; padding:24px 16px; margin-bottom:20px; direction:rtl; line-height:2.2;">
        ${spansHTML}
      </div>
      <div style="font-size:0.75em; color:var(--text-muted); text-align:center; margin-bottom:16px; font-style:italic;">
        ${lang === 'ur' ? 'لفظ کو چھو کر منتخب کریں' : lang === 'hi' ? 'शब्द को छूकर चुनें' : 'Tap the word to select it'}
      </div>
    `;

  } else if (ex.type === 'spot_in_word') {
    // Tap the target letter inside a word — letters rendered as tappable spans
    const word = ex.word || '';
    const targetIdx = ex.target_index ?? 0;
    const letters = [...word]; // split by Unicode chars to handle Arabic correctly
    const spansHTML = letters.map((ch, i) => `
      <span onclick="checkSpotInWord(this, ${i}, ${targetIdx})"
        style="font-family:'Amiri',serif; font-size:52px; direction:rtl; color:var(--text-arabic); cursor:pointer; padding:4px 6px; border-radius:8px; transition:all 0.15s; display:inline-block; line-height:1.4;"
        onmouseover="this.style.background='var(--accent-bg)'"
        onmouseout="if(!this.dataset.answered) this.style.background=''"
      >${ch}</span>
    `).join('');
    choicesHTML = `
      <div style="text-align:center; background:var(--bg-card); border:1px solid var(--border-gold); border-radius:16px; padding:20px; margin-bottom:20px; direction:rtl;">
        ${spansHTML}
      </div>
      ${ex.highlight_hint ? `<div style="font-size:0.8125em; color:var(--text-muted); font-style:italic; margin-bottom:16px; text-align:center;">${ex.highlight_hint[lang] || ex.highlight_hint.en}</div>` : ''}
    `;

  } else {
    // Unknown exercise type — skip gracefully with a continue button
    choicesHTML = `<div style="color:var(--text-muted); font-size:0.875em; margin-bottom:20px; font-style:italic;">Exercise type: ${ex.type}</div>`;
    // Auto-show continue button
    setTimeout(() => {
      const next = document.getElementById('exercise-next');
      if (next) next.style.display = 'block';
    }, 100);
  }

  // spot_in_ayah renders the ayah inside choicesHTML — don't double-render it
  const shownArabic = (ex.type === 'spot_in_ayah') ? null : (ex.shown_letter || ex.word || null);

  body.innerHTML = `
    <div class="label-accent" style="margin-bottom:4px;">${t('stepPractice', lang)} · ${exIdx + 1}/${exCount}</div>

    <div style="font-size:1.0625em; font-weight:500; color:var(--text-primary); margin-bottom:${shownArabic ? '16px' : '24px'}; line-height:1.4; margin-top:16px;">
      ${promptText}
    </div>

    ${shownArabic ? `
      <div style="text-align:center; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:14px; padding:16px; margin-bottom:24px;">
        <span style="font-family:'Amiri',serif; font-size:48px; direction:rtl; color:var(--text-arabic); line-height:1.4;">${shownArabic}</span>
      </div>
    ` : ''}

    ${choicesHTML}

    <div class="feedback-box" id="exercise-feedback"></div>
    <div id="exercise-next" style="display:none; margin-top:4px;">
      <button class="btn btn-primary" onclick="nextStep()">${t('continueBtn', lang)}</button>
    </div>
  `;
}

// ── STEP: REFLECT ──
function renderReflect(lesson, lang, body) {
  const r = lesson.reflection;
  body.innerHTML = `
    <div class="label-accent" style="margin-bottom:20px;">${t('stepReflect', lang)}</div>

    <div style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:16px; padding:20px; margin-bottom:20px; box-shadow:var(--shadow);">
      <div style="font-family:'Cormorant Garamond',serif; font-size:1.125em; line-height:1.7; color:var(--text-primary); font-style:italic;">
        ${r.prompt[lang] || r.prompt.en}
      </div>
    </div>

    <textarea id="reflect-input" style="width:100%; min-height:130px; background:var(--bg-card); border:1.5px solid var(--border); border-radius:14px; padding:14px 16px; font-family:var(--font-body); font-size:0.875em; color:var(--text-primary); resize:vertical; outline:none; transition:border-color 0.2s; margin-bottom:14px;"
      placeholder="${t('reflectPlaceholder', lang)}"
      onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"></textarea>

    <div class="btn-row">
      <button class="btn btn-primary" onclick="saveReflectionAndNext()">
        ${t('reflectSave', lang)}
      </button>
      <button class="btn btn-secondary" onclick="nextStep()">
        ${t('reflectSkip', lang)}
      </button>
    </div>
  `;
}

// ── STEP: SEAL ──
function renderSeal(lesson, lang, body) {
  markComplete(lesson.id, lesson.xp);
  const nextId = lesson.unlocks?.[0];

  body.innerHTML = `
    <div style="text-align:center; padding:20px 0;">
      <div style="font-size:64px; margin-bottom:8px; animation:screenIn 0.4s ease;">✨</div>
      <div style="font-family:'Amiri',serif; font-size:36px; color:var(--crimson); margin-bottom:4px; display:block;">الحمد للہ</div>
      <div style="font-family:'Cormorant Garamond',serif; font-size:1.875em; font-weight:400; color:var(--text-primary); margin-bottom:6px;">
        ${t('alhamdulillah', lang)}
      </div>
      <div style="font-size:0.9375em; color:var(--text-muted); margin-bottom:28px;">${t('lessonDone', lang)}</div>

      <div class="xp-badge xp-pop" style="font-size:1.125em; padding:10px 28px; margin:0 auto 32px; display:inline-flex; animation-delay:0.2s;">
        ✦ +${lesson.xp} ${t('xpGained', lang)}
      </div>

      <div class="btn-row" style="max-width:320px; margin:0 auto;">
        ${nextId ? `<button class="btn btn-primary" onclick="loadAndStartLesson('${nextId}')">${t('nextLesson', lang)}</button>` : ''}
        <button class="btn ${nextId ? 'btn-secondary' : 'btn-primary'}" onclick="exitLesson()">
          ${t('backToTrack', lang)}
        </button>
      </div>
    </div>
  `;
}

// ── EXERCISE CHECKS ──
export function checkSpotInWord(span, tappedIdx, correctIdx) {
  if (lessonState.answered) return;
  lessonState.answered = true;
  const lang = lessonState.lang;
  const ex = lessonState.lesson.exercises[lessonState.step - 2];
  span.dataset.answered = 'true';

  // Disable all spans
  document.querySelectorAll('#lesson-body span[onclick]').forEach(s => {
    s.style.pointerEvents = 'none';
    s.onmouseover = null;
  });

  if (tappedIdx === correctIdx) {
    span.style.background = 'var(--correct-bg)';
    span.style.color = 'var(--correct-text)';
    span.style.border = '1px solid var(--correct-border)';
    showExFeedback(true, ex.feedback_correct ? (ex.feedback_correct[lang] || ex.feedback_correct.en) : t('correct', lang));
  } else {
    span.style.background = 'var(--wrong-bg)';
    span.style.color = 'var(--wrong-text)';
    // Highlight the correct one
    const allSpans = document.querySelectorAll('#lesson-body span[onclick]');
    if (allSpans[correctIdx]) {
      allSpans[correctIdx].style.background = 'var(--correct-bg)';
      allSpans[correctIdx].style.color = 'var(--correct-text)';
      allSpans[correctIdx].style.border = '1px solid var(--correct-border)';
    }
    showExFeedback(false, t('tryAgain', lang));
  }
  document.getElementById('exercise-next').style.display = 'block';
}

export function checkRecognize(btn, chosen, correct) {
  if (lessonState.answered) return;
  lessonState.answered = true;
  const lang = lessonState.lang;
  const allBtns = document.querySelectorAll('#lesson-body .choice-btn');
  allBtns.forEach(b => b.disabled = true);
  const ex = lessonState.lesson.exercises[lessonState.step - 2];
  if (chosen === correct) {
    btn.classList.add('correct-choice');
    showExFeedback(true, ex.feedback_correct ? (ex.feedback_correct[lang] || ex.feedback_correct.en) : t('correct', lang));
  } else {
    btn.classList.add('wrong-choice');
    allBtns.forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct-choice'); });
    showExFeedback(false, t('tryAgain', lang));
  }
  document.getElementById('exercise-next').style.display = 'block';
}

export function checkMCQ(btn, isCorrect) {
  if (lessonState.answered) return;
  lessonState.answered = true;
  const lang = lessonState.lang;
  const allBtns = document.querySelectorAll('#lesson-body .choice-btn');
  allBtns.forEach(b => b.disabled = true);
  const ex = lessonState.lesson.exercises[lessonState.step - 2];
  if (isCorrect) {
    btn.classList.add('correct-choice');
    showExFeedback(true, ex.feedback_correct ? (ex.feedback_correct[lang] || ex.feedback_correct.en) : t('correct', lang));
  } else {
    btn.classList.add('wrong-choice');
    showExFeedback(false, t('tryAgain', lang));
  }
  document.getElementById('exercise-next').style.display = 'block';
}

export function checkClassify(btn, chosen, correct) {
  if (lessonState.answered) return;
  lessonState.answered = true;
  const lang = lessonState.lang;
  const allBtns = document.querySelectorAll('#lesson-body .choice-btn');
  allBtns.forEach(b => b.disabled = true);
  const ex = lessonState.lesson.exercises[lessonState.step - 2];
  if (chosen === correct) {
    btn.classList.add('correct-choice');
    showExFeedback(true, ex.feedback_correct ? (ex.feedback_correct[lang] || ex.feedback_correct.en) : t('correct', lang));
  } else {
    btn.classList.add('wrong-choice');
    showExFeedback(false, t('tryAgain', lang));
  }
  document.getElementById('exercise-next').style.display = 'block';
}

function showExFeedback(correct, text) {
  const fb = document.getElementById('exercise-feedback');
  if (!fb) return;
  fb.className = 'feedback-box ' + (correct ? 'correct' : 'wrong');
  fb.textContent = text;
}

export function saveReflectionAndNext() {
  const input = document.getElementById('reflect-input');
  const text = input?.value?.trim();
  if (text) {
    const { lesson, lang } = lessonState;
    const title = lesson.type === 'huroof'
      ? (lesson.letter?.name[lang] || lesson.letter?.name.en)
      : lesson.type === 'kalimaat'
        ? (lesson.word?.arabic)
        : (lesson.title?.[lang] || lesson.id);
    addJournalEntry(lesson.reflection?.journal_tag || lesson.id, text, title);
    // Flash saved confirmation
    const btn = document.querySelector('#lesson-body .btn-primary');
    if (btn) { btn.textContent = t('reflectSaved', lang); btn.disabled = true; }
    setTimeout(() => nextStep(), 800);
  } else {
    nextStep();
  }
}

export { lessonState };

// Called by app.js when user changes language mid-lesson
export function setLessonLang(lang) {
  if (!lessonState.lesson) return; // no active lesson
  lessonState.lang = lang;
  lessonState.answered = false;    // reset answered so re-render doesn't lock buttons
  renderStep();
}
