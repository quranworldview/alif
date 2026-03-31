// app.js — Boot, routing, global state.
// All screen transitions go through showScreen(). No direct DOM manipulation elsewhere.

import { initTheme, applyTheme, getTheme, initTextSize, applyTextSize, getTextSize, cycleTextSize } from './components/theme.js';
import { t } from './i18n/strings.js';
import { renderWelcome, initStars } from './screens/WelcomeScreen.js';
import { renderLogin, renderRegister } from './screens/AuthScreen.js';
import {
  renderPlacement, handlePlacementAnswer as _handlePlacementAnswer,
  nextPlacementQuestion as _nextPlacementQuestion,
  showManualLevelChoice
} from './screens/PlacementScreen.js';
import { renderHome, renderTrack, renderJournal, renderProfileDrawer } from './screens/AppScreens.js';
import {
  renderOnboarding, onboardNext as _onboardNext,
  onboardBack as _onboardBack, isOnboardingDone
} from './screens/OnboardingScreen.js';
import {
  renderLessonScreen, renderStep, nextStep as lessonNextStep,
  checkRecognize as _checkRecognize, checkMCQ as _checkMCQ,
  checkClassify as _checkClassify, checkSpotInWord as _checkSpotInWord,
  saveReflectionAndNext as _saveReflection,
  startLesson, setLessonLang
} from './components/LessonRenderer.js';
import {
  isComplete, isPlacementDone, setPlacementDone, setLevel, getLevel,
  getProgress, isUnlocked
} from './components/ProgressTracker.js';

// ── GLOBAL STATE ──
window.APP_STATE = {
  lang: localStorage.getItem('qwv_lang') || 'hi',
  user: null, // populated after auth
  userName: '',
  allLessons: [],
};

// ── LESSON REGISTRY ──
// Lessons are loaded lazily. Add new lessons here as they're authored.
const LESSON_FILES = [
  // Huroof — all 28 letters
  './lessons/huroof/huroof-01-alif.json',
  './lessons/huroof/huroof-02-ba.json',
  './lessons/huroof/huroof-03-ta.json',
  './lessons/huroof/huroof-04-tha.json',
  './lessons/huroof/huroof-05-jeem.json',
  './lessons/huroof/huroof-06-ha.json',
  './lessons/huroof/huroof-07-kha.json',
  './lessons/huroof/huroof-08-dal.json',
  './lessons/huroof/huroof-09-dhal.json',
  './lessons/huroof/huroof-10-ra.json',
  './lessons/huroof/huroof-11-zay.json',
  './lessons/huroof/huroof-12-sin.json',
  './lessons/huroof/huroof-13-shin.json',
  './lessons/huroof/huroof-14-sad.json',
  './lessons/huroof/huroof-15-dad.json',
  './lessons/huroof/huroof-16-taa.json',
  './lessons/huroof/huroof-17-dhaa.json',
  './lessons/huroof/huroof-18-ayn.json',
  './lessons/huroof/huroof-19-ghayn.json',
  './lessons/huroof/huroof-20-fa.json',
  './lessons/huroof/huroof-21-qaf.json',
  './lessons/huroof/huroof-22-kaf.json',
  './lessons/huroof/huroof-23-lam.json',
  './lessons/huroof/huroof-24-meem.json',
  './lessons/huroof/huroof-25-nun.json',
  './lessons/huroof/huroof-26-halight.json',
  './lessons/huroof/huroof-27-waw.json',
  './lessons/huroof/huroof-28-ya.json',
  // Kalimaat — top words
  './lessons/kalimaat/kalimaat-01-allah.json',
  './lessons/kalimaat/kalimaat-02-huwa.json',
  './lessons/kalimaat/kalimaat-03-min.json',
  './lessons/kalimaat/kalimaat-04-fi.json',
  './lessons/kalimaat/kalimaat-05-ala.json',
  './lessons/kalimaat/kalimaat-06-inna.json',
  './lessons/kalimaat/kalimaat-07-wa.json',
  './lessons/kalimaat/kalimaat-08-ila.json',
  './lessons/kalimaat/kalimaat-09-an.json',
  './lessons/kalimaat/kalimaat-10-la.json',
  './lessons/kalimaat/kalimaat-11-bi.json',
  './lessons/kalimaat/kalimaat-12-li.json',
  // Qawaid — grammar
  './lessons/qawaid/qawaid-01-ism-fil-harf.json',
];

async function loadAllLessons() {
  const lessons = await Promise.all(
    LESSON_FILES.map(f => fetch(f).then(r => r.json()).catch(() => null))
  );
  window.APP_STATE.allLessons = lessons.filter(Boolean);
  return window.APP_STATE.allLessons;
}

// ── SCREEN ROUTER ──
window.showScreen = function(screen) {
  const main = document.getElementById('app-main'); // center column only
  const lang = window.APP_STATE.lang;

  switch (screen) {
    case 'onboarding':
      main.innerHTML = renderOnboarding(lang);
      break;

    case 'welcome':
      main.innerHTML = renderWelcome(lang);
      setTimeout(initStars, 100);
      break;

    case 'login':
      main.innerHTML = renderLogin(lang);
      break;

    case 'register':
      main.innerHTML = renderRegister(lang);
      break;

    case 'placement':
      main.innerHTML = renderPlacement(lang);
      break;

    case 'home':
      (async () => {
        const lessons = window.APP_STATE.allLessons.length
          ? window.APP_STATE.allLessons
          : await loadAllLessons();
        const next = findNextLesson(lessons);
        main.innerHTML = renderHome(lang, window.APP_STATE.userName, next);
        updateSidebarStats();
        updateSidebarNav('home');
      })();
      break;

    case 'track':
      (async () => {
        const lessons = window.APP_STATE.allLessons.length
          ? window.APP_STATE.allLessons
          : await loadAllLessons();
        main.innerHTML = renderTrack(lang, lessons);
        updateSidebarStats();
        updateSidebarNav('track');
      })();
      break;

    case 'journal':
      main.innerHTML = renderJournal(lang);
      updateSidebarStats();
      updateSidebarNav('journal');
      break;
  }

  // Re-apply logo after DOM change
  applyTheme(getTheme());
  updateSidebarStats();
};

// ── AUTH HANDLERS ──
window.handleLogin = function() {
  const email = document.getElementById('login-email')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  const lang = window.APP_STATE.lang;

  if (!email || !password) {
    showAuthError('login', lang === 'ur' ? 'ای میل اور پاسورڈ ضروری ہے۔' : lang === 'hi' ? 'ईमेल और पासवर्ड ज़रूरी है।' : 'Email and password are required.');
    return;
  }

  const btn = document.getElementById('login-btn');
  btn.textContent = t('loading', lang);
  btn.disabled = true;

  // Firebase auth — when Firebase is wired, replace this block
  // firebase.auth().signInWithEmailAndPassword(email, password)
  //   .then(cred => { onAuthSuccess(cred.user); })
  //   .catch(err => { showAuthError('login', mapFirebaseError(err, lang)); btn.textContent = t('loginBtn', lang); btn.disabled = false; });

  // TEMP: localStorage mock for development
  const stored = JSON.parse(localStorage.getItem('alif_user') || 'null');
  if (stored && stored.email === email) {
    window.APP_STATE.user = stored;
    window.APP_STATE.userName = stored.name || 'Student';
    onAuthSuccess();
  } else {
    setTimeout(() => {
      showAuthError('login', t('wrongPassword', lang));
      btn.textContent = t('loginBtn', lang);
      btn.disabled = false;
    }, 600);
  }
};

window.handleRegister = function() {
  const name = document.getElementById('reg-name')?.value?.trim();
  const email = document.getElementById('reg-email')?.value?.trim();
  const password = document.getElementById('reg-password')?.value;
  const lang = window.APP_STATE.lang;

  if (!name || !email || !password) {
    showAuthError('register', lang === 'ur' ? 'تمام خانے بھریں۔' : lang === 'hi' ? 'सभी खाने भरें।' : 'Please fill in all fields.');
    return;
  }
  if (password.length < 6) {
    showAuthError('register', lang === 'ur' ? 'پاسورڈ کم از کم 6 حروف کا ہو۔' : lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षर का हो।' : 'Password must be at least 6 characters.');
    return;
  }

  const btn = document.getElementById('register-btn');
  btn.textContent = t('loading', lang);
  btn.disabled = true;

  // TEMP: localStorage mock
  const user = { name, email, uid: 'local_' + Date.now(), createdAt: new Date().toISOString() };
  localStorage.setItem('alif_user', JSON.stringify(user));
  window.APP_STATE.user = user;
  window.APP_STATE.userName = name;
  setTimeout(() => onAuthSuccess(), 500);
};

window.handleForgotPassword = function() {
  const lang = window.APP_STATE.lang;
  alert(lang === 'ur' ? 'پاسورڈ ری سیٹ کی سہولت جلد آئے گی۔' : lang === 'hi' ? 'पासवर्ड रीसेट की सुविधा जल्द आएगी।' : 'Password reset coming soon.');
};

function showAuthError(type, message) {
  const el = document.getElementById(`${type}-error`);
  if (el) { el.textContent = message; el.style.display = 'block'; }
}

function onAuthSuccess() {
  if (!isOnboardingDone()) {
    showScreen('onboarding');
  } else if (!isPlacementDone() && !getLevel()) {
    showScreen('placement');
  } else {
    showScreen('home');
  }
}

// ── PLACEMENT HANDLERS ──
window.handlePlacementAnswer = function(btn, isCorrect) {
  _handlePlacementAnswer(btn, isCorrect);
};
window.nextPlacementQuestion = function() {
  _nextPlacementQuestion();
};
window.skipPlacement = function() {
  setLevel('zero');
  setPlacementDone(0, 'zero', 'zero');
  showScreen('home');
};
window.confirmPlacement = function(level, startLessonId) {
  setLevel(level);
  setPlacementDone(0, level, level);
  showScreen('home');
};
window.chooseLevelManually = function() {
  showManualLevelChoice();
};

// ── LESSON HANDLERS ──
window.loadAndStartLesson = async function(lessonId) {
  const lessons = window.APP_STATE.allLessons.length
    ? window.APP_STATE.allLessons
    : await loadAllLessons();
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    console.error('Lesson not found:', lessonId);
    return;
  }

  const main = document.getElementById('app-main');
  const lang = window.APP_STATE.lang;

  // 1. Build the shell with the lesson object (so XP badge renders correctly)
  main.innerHTML = renderLessonScreen(lesson);

  // 2. Set lesson state
  startLesson(lesson, lang);

  // 3. NOW the DOM exists — render the first step into #lesson-body
  renderStep();
};

window.nextStep = function() { lessonNextStep(); };
window.checkRecognize = function(btn, chosen, correct) { _checkRecognize(btn, chosen, correct); };
window.checkMCQ = function(btn, isCorrect) { _checkMCQ(btn, isCorrect); };
window.checkClassify = function(btn, chosen, correct) { _checkClassify(btn, chosen, correct); };
window.checkSpotInWord = function(span, tappedIdx, correctIdx) { _checkSpotInWord(span, tappedIdx, correctIdx); };
window.saveReflectionAndNext = function() { _saveReflection(); };

window.exitLesson = function() { showScreen('track'); };

// ── ONBOARDING HANDLERS ──
window.onboardNext = function() { _onboardNext(window.APP_STATE.lang); };
window.onboardBack = function() { _onboardBack(window.APP_STATE.lang); };
window.skipOnboarding = function() {
  localStorage.setItem('alif_onboarding_done', '1');
  showScreen('placement');
};

// ── PROFILE DRAWER ──
window.showProfile = function() {
  const lang = window.APP_STATE.lang;
  const user = window.APP_STATE.user;
  const drawer = document.createElement('div');
  drawer.id = 'profile-drawer-container';
  drawer.innerHTML = renderProfileDrawer(lang, user?.name || 'Student', user?.email || '');
  document.body.appendChild(drawer);
};

window.closeProfile = function() {
  const el = document.getElementById('profile-drawer-container');
  if (el) el.remove();
};

window.setThemeFromDrawer = function(mode) {
  applyTheme(mode);
  window.closeProfile();
  // Small delay so theme CSS transition completes before drawer re-renders
  setTimeout(() => window.showProfile(), 80);
};

window.setLangFromDrawer = function(lang) {
  window.closeProfile();           // close drawer first
  window.APP_STATE.lang = lang;    // update global state
  localStorage.setItem('qwv_lang', lang);
  // If inside a lesson, update lesson state and re-render current step instantly
  const current = document.querySelector('#app-main .screen');
  const screenId = current?.id?.replace('-screen', '');
  if (screenId === 'lesson') {
    setLessonLang(lang);
  } else if (screenId && ['home','track','journal','welcome','login','register','onboarding','placement'].includes(screenId)) {
    showScreen(screenId);
  }
  updateSidebarStats();
};

window.handleSignOut = function() {
  const lang = window.APP_STATE.lang;
  const msg = t('signOutConfirm', lang);
  if (!confirm(msg)) return;
  localStorage.removeItem('alif_user');
  localStorage.removeItem('alif_onboarding_done');
  localStorage.removeItem('alif_placement');
  localStorage.removeItem('alif_level');
  window.APP_STATE.user = null;
  window.APP_STATE.userName = '';
  window.closeProfile();
  showScreen('welcome');
};

// ── SIDEBAR STATS (desktop right panel) ──
function updateSidebarStats() {
  try {
    const streak = parseInt(localStorage.getItem('alif_streak') || '0');
    const xp     = parseInt(localStorage.getItem('alif_xp')     || '0');
    const prog   = JSON.parse(localStorage.getItem('alif_progress') || '{}');
    const done   = Object.values(prog).filter(v => v?.complete).length;

    const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    el('stat-streak',  streak);
    el('stat-xp',      xp);
    el('stat-lessons', done);

    // Username in right sidebar
    const nameEl = document.getElementById('sidebar-username');
    if (nameEl) nameEl.textContent = window.APP_STATE.userName || '—';

    // Tagline language update in left sidebar
    const taglineEl = document.getElementById('sidebar-tagline');
    if (taglineEl) taglineEl.textContent = t('tagline', window.APP_STATE.lang);

  } catch(e) { /* silent fail */ }
}
window.updateSidebarStats = updateSidebarStats;

// Update sidebar nav active state
function updateSidebarNav(screen) {
  ['home','track','journal'].forEach(s => {
    const btn = document.getElementById('snav-' + s);
    if (btn) btn.classList.toggle('active', s === screen);
  });
}
window.updateSidebarNav = updateSidebarNav;

// ── TEXT SIZE ──
window.setTextSize = function(size) {
  applyTextSize(size);
  // Re-render profile drawer to update active state
  const drawer = document.getElementById('profile-drawer-container');
  if (drawer) {
    window.closeProfile();
    setTimeout(() => window.showProfile(), 60);
  }
};

// ── TRACK COLLAPSE ──
window.toggleTrack = function(collapseId, arrowId) {
  const body  = document.getElementById(collapseId);
  const arrow = document.getElementById(arrowId);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display  = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
};

// ── LANG & THEME ──
window.setLang = function(lang) {
  window.APP_STATE.lang = lang;
  localStorage.setItem('qwv_lang', lang);
  // If inside a lesson, update lesson state and re-render current step instantly
  const current = document.querySelector('#app-main .screen');
  const screenId = current?.id?.replace('-screen', '');
  if (screenId === 'lesson') {
    setLessonLang(lang);
  } else if (screenId && ['home','track','journal','welcome','login','register','onboarding','placement'].includes(screenId)) {
    showScreen(screenId);
  }
  // Update persistent sidebar elements
  updateSidebarStats();
};

window.cycleTheme = function() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
  applyTheme(next);
  const icons  = { dark: '🌙', light: '☀️', system: '💻' };
  const labels = { dark: 'Dark', light: 'Light', system: 'System' };
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const iconEl  = btn.querySelector('.theme-toggle-icon');
    const labelEl = btn.querySelector('span:last-child');
    if (iconEl)  iconEl.textContent  = icons[next];
    if (labelEl) labelEl.textContent = labels[next];
  });
  updateSidebarStats();
};
// ── HELPERS ──
function findNextLesson(lessons) {
  // Find first unlocked, incomplete lesson
  for (const lesson of lessons) {
    if (!isComplete(lesson.id) && isUnlocked(lesson, lessons)) {
      return {
        id: lesson.id,
        title: lesson.type === 'huroof'
          ? `${lesson.letter?.name?.en || lesson.id}`
          : lesson.type === 'kalimaat'
            ? `${lesson.word?.arabic} — ${lesson.word?.meaning?.en}`
            : lesson.title?.en || lesson.id,
        track: lesson.track.charAt(0).toUpperCase() + lesson.track.slice(1),
        xp: lesson.xp,
      };
    }
  }
  return null;
}

// ── BOOT ──
async function boot() {
  initTheme();
  initTextSize();

  // Check for stored user session
  const storedUser = JSON.parse(localStorage.getItem('alif_user') || 'null');
  if (storedUser) {
    window.APP_STATE.user = storedUser;
    window.APP_STATE.userName = storedUser.name || 'Student';
    loadAllLessons();
    updateSidebarStats();
    onAuthSuccess();
  } else {
    showScreen('welcome');
  }
}

boot();
