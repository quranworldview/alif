// app.js — Boot, routing, global state.
// All screen transitions go through showScreen(). No direct DOM manipulation elsewhere.

import { initTheme, applyTheme, getTheme, initTextSize, applyTextSize, getTextSize, cycleTextSize } from './components/theme.js';
import { t } from './i18n/strings.js';
import { renderWelcome, initStars } from './screens/WelcomeScreen.js';
import { renderLogin, renderGateBlocked } from './screens/AuthScreen.js';
import {
  renderPlacement, handlePlacementAnswer as _handlePlacementAnswer,
  nextPlacementQuestion as _nextPlacementQuestion,
  showManualLevelChoice, isQuizInProgress,
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
  getProgress, isUnlocked, setLastLesson, getLastLesson, markComplete,
  clearLocalProgress, syncL1Celebration, syncL2Celebration, addXPAndSync,
} from './components/ProgressTracker.js';
import { auth } from './js/firebase.js';
import {
  loadProgressFromFirestore,
  hydrateLocalStorage,
  initProgressDoc,
} from './js/firestore.js';

// ── GLOBAL STATE ──
window.APP_STATE = {
  lang: localStorage.getItem('qwv_lang') || 'hi',
  user: null,
  userName: '',
  allLessons: [],
  navLocked: false,   // true during onboarding, placement quiz, placement result
};

// ── NAV LOCK ──────────────────────────────────────────────────
// Physically disables sidebar nav buttons and suppresses bottom nav clicks.
// Called whenever the user is in a flow that must not be interrupted.
function lockNav() {
  window.APP_STATE.navLocked = true;
  ['snav-home','snav-track','snav-journal'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.disabled = true; btn.style.opacity = '0.3'; btn.style.pointerEvents = 'none'; }
  });
}

function unlockNav() {
  window.APP_STATE.navLocked = false;
  ['snav-home','snav-track','snav-journal'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.pointerEvents = ''; }
  });
}
window.lockNav   = lockNav;
window.unlockNav = unlockNav;
// Drive CSS font/direction switching via data-lang on <html>
document.documentElement.setAttribute('data-lang', window.APP_STATE.lang);

// ── LESSON REGISTRY ──
// Lessons are loaded lazily. Add new lessons here as they're authored.
// ── LESSON BUNDLES ──
// Each bundle is a single JSON file containing { lessons: [...] }.
// Add new bundles here as new tracks/levels are created.
// Individual lesson files no longer exist — everything lives in bundles.
const LESSON_BUNDLES = [
  './lessons/bundles/huroof.json',       // 28 lessons
  './lessons/bundles/kalimaat-l1.json',  // words 1–50
  './lessons/bundles/kalimaat-l2.json',  // words 51–100
  './lessons/bundles/kalimaat-l3.json',  // words 101–150
  './lessons/bundles/kalimaat-l4.json',  // words 151–160
  './lessons/bundles/qawaid.json',       // 20 grammar lessons
  // Future: kalimaat-l4 continues to 200, then l5–l6, sarf.json, etc.
];

async function loadAllLessons() {
  const bundles = await Promise.all(
    LESSON_BUNDLES.map(f => fetch(f).then(r => r.json()).catch(() => null))
  );
  // Flatten bundle arrays, filter null (failed fetches), sort by track+order
  const lessons = bundles
    .filter(Boolean)
    .flatMap(b => b.lessons || []);
  window.APP_STATE.allLessons = lessons;
  return lessons;
}

// ── SCREEN ROUTER ──
window.showScreen = function(screen) {
  const main = document.getElementById('app-main');
  const lang = window.APP_STATE.lang;

  // ── Nav lock guard ────────────────────────────────────────────
  // During onboarding, placement quiz, or placement result the user
  // must use the dedicated CTAs — not the nav. All other navigation
  // is silently blocked. Explicit exits (exitPlacementQuiz, skipOnboarding)
  // call unlockNav() themselves before routing.
  const UNLOCKED_SCREENS = ['placement', 'onboarding', 'welcome', 'login', 'gate'];
  if (window.APP_STATE.navLocked && !UNLOCKED_SCREENS.includes(screen)) {
    return; // silent block — no confirm, no jank
  }

  switch (screen) {
    case 'onboarding':
      lockNav();
      main.innerHTML = renderOnboarding(lang);
      break;

    case 'welcome':
      unlockNav();
      main.innerHTML = renderWelcome(lang);
      setTimeout(initStars, 100);
      break;

    case 'login':
      unlockNav();
      main.innerHTML = renderLogin(lang);
      break;

    case 'placement':
      lockNav();
      main.innerHTML = renderPlacement(lang);
      break;

    case 'home':
      (async () => {
        unlockNav();
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
        unlockNav();
        const lessons = window.APP_STATE.allLessons.length
          ? window.APP_STATE.allLessons
          : await loadAllLessons();
        main.innerHTML = renderTrack(lang, lessons);
        updateSidebarStats();
        updateSidebarNav('track');
        scrollTrackToActive();
      })();
      break;

    case 'journal':
      unlockNav();
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
  const email    = document.getElementById('login-email')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  const lang     = window.APP_STATE.lang;

  if (!email || !password) {
    showAuthError('login',
      lang === 'ur' ? 'ای میل اور پاسورڈ ضروری ہے۔'
      : lang === 'hi' ? 'ईमेल और पासवर्ड ज़रूरी है।'
      : 'Email and password are required.');
    return;
  }

  const btn = document.getElementById('login-btn');
  btn.textContent = t('loading', lang);
  btn.disabled    = true;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      btn.textContent = t('loginBtn', lang);
      btn.disabled    = false;
      showAuthError('login', mapFirebaseError(err, lang));
    });
  // On success, onAuthStateChanged fires → handles routing
};

window.handleForgotPassword = function() {
  const lang  = window.APP_STATE.lang;
  const email = document.getElementById('login-email')?.value?.trim();

  if (!email) {
    showAuthError('login',
      lang === 'ur' ? 'پہلے اپنا ای میل لکھیں۔'
      : lang === 'hi' ? 'पहले अपना ईमेल लिखें।'
      : 'Enter your email address above first.');
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      showAuthError('login',
        lang === 'ur' ? `ری سیٹ لنک ${email} پر بھیجا گیا۔`
        : lang === 'hi' ? `रीसेट लिंक ${email} पर भेजा गया।`
        : `Password reset link sent to ${email}.`);
    })
    .catch(err => {
      showAuthError('login', mapFirebaseError(err, lang));
    });
};

function mapFirebaseError(err, lang) {
  const code = err.code || '';
  if (lang === 'ur') {
    if (code === 'auth/user-not-found')     return 'یہ ای میل ہمارے سسٹم میں نہیں ہے۔';
    if (code === 'auth/wrong-password')     return 'پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔';
    if (code === 'auth/invalid-email')      return 'ای میل کا فارمیٹ درست نہیں۔';
    if (code === 'auth/too-many-requests')  return 'کئی ناکام کوششیں۔ کچھ دیر بعد کوشش کریں۔';
    if (code === 'auth/network-request-failed') return 'نیٹ ورک مسئلہ۔ انٹرنیٹ چیک کریں۔';
    return 'کچھ غلط ہوا۔ دوبارہ کوشش کریں۔';
  }
  if (lang === 'hi') {
    if (code === 'auth/user-not-found')     return 'यह ईमेल हमारे सिस्टम में नहीं है।';
    if (code === 'auth/wrong-password')     return 'पासवर्ड ग़लत है। दोबारा कोशिश करें।';
    if (code === 'auth/invalid-email')      return 'ईमेल का फ़ॉर्मेट सही नहीं।';
    if (code === 'auth/too-many-requests')  return 'कई नाकाम कोशिशें। थोड़ी देर बाद कोशिश करें।';
    if (code === 'auth/network-request-failed') return 'नेटवर्क समस्या। इंटरनेट चेक करें।';
    return 'कुछ ग़लत हुआ। दोबारा कोशिश करें।';
  }
  if (code === 'auth/user-not-found')     return 'No account found with this email.';
  if (code === 'auth/wrong-password')     return 'Incorrect password. Please try again.';
  if (code === 'auth/invalid-email')      return 'Email address format is invalid.';
  if (code === 'auth/too-many-requests')  return 'Too many failed attempts. Please wait a moment.';
  if (code === 'auth/network-request-failed') return 'Network error. Check your connection.';
  return 'Something went wrong. Please try again.';
}

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
window.exitPlacementQuiz = function() {
  const lang = window.APP_STATE.lang;
  if (isQuizInProgress()) {
    const msg = lang === 'ur'
      ? 'کوئز جاری ہے۔ کیا آپ واقعی چھوڑنا چاہتے ہیں؟ آپ کو شروع سے شروع کرنا ہوگا۔'
      : lang === 'hi'
      ? 'क्विज़ जारी है। क्या आप सच में छोड़ना चाहते हैं? आपको शुरू से शुरू करना होगा।'
      : "Quiz in progress. If you leave now you'll have to start over. Are you sure?";
    if (!confirm(msg)) return;
  }
  unlockNav();
  showScreen('welcome');
};
window.skipPlacement = function() {
  unlockNav();
  setLevel('zero');
  setPlacementDone(0, 'zero', 'zero');
  showScreen('home');
};
window.confirmPlacement = function(placement, startLessonId, creditHuroof, creditL1) {
  unlockNav();
  setLevel(placement);
  setPlacementDone(0, placement, placement);

  // ── Credit huroof lessons silently ──
  // Marks all 28 huroof complete so the unlock chain works.
  // XP is 0 (placement credit, not earned).
  if (creditHuroof) {
    const huroof = window.APP_STATE.allLessons.filter(l => l.track === 'huroof');
    huroof.forEach(l => markComplete(l.id, 0));
  }

  // ── Credit kalimaat L1 lessons silently ──
  // If full pass (intermediate): credit all 50 L1 words.
  // If partial pass (beginner with firstWrongLessonId): credit all L1 words
  //   up to (but not including) the startLessonId, so the student
  //   starts exactly at their first gap.
  if (creditL1) {
    // Full L1 credit — intermediate placement
    const l1 = window.APP_STATE.allLessons.filter(l => l.track === 'kalimaat' && l.order <= 50);
    l1.forEach(l => markComplete(l.id, 0));
  } else if (creditHuroof && startLessonId && startLessonId.startsWith('kalimaat-')) {
    // Partial L1 credit — beginner placement with firstWrongLessonId
    // Find the order of the start lesson and credit everything before it
    const startLesson = window.APP_STATE.allLessons.find(l => l.id === startLessonId);
    if (startLesson && startLesson.order > 1) {
      const toCredit = window.APP_STATE.allLessons.filter(
        l => l.track === 'kalimaat' && l.order < startLesson.order
      );
      toCredit.forEach(l => markComplete(l.id, 0));
    }
  }

  // Set the start lesson as the last touched so Track screen opens there
  if (startLessonId) setLastLesson(startLessonId);

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

  // Persist last touched lesson — used by Track screen to restore state
  setLastLesson(lessonId);

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
  // nav stays locked — placement will be shown next which is also locked
  showScreen('placement');
};

// ── PROFILE DRAWER ──
window.showProfile = function() {
  // Don't open profile drawer mid-quiz — it contains navigation links
  if (isQuizInProgress()) return;
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
  document.documentElement.setAttribute('data-lang', lang);
  // If inside a lesson, update lesson state and re-render current step instantly
  const current = document.querySelector('#app-main .screen');
  const screenId = current?.id?.replace('-screen', '');
  if (screenId === 'lesson') {
    setLessonLang(lang);
  } else if (screenId && ['home','track','journal','welcome','login','onboarding','placement'].includes(screenId)) {
    showScreen(screenId);
  }
  updateSidebarStats();
};

window.handleSignOut = function() {
  const lang = window.APP_STATE.lang;
  const msg  = t('signOutConfirm', lang);
  if (!confirm(msg)) return;

  auth.signOut().then(() => {
    // Clear local cache — Firestore is the source of truth
    clearLocalProgress();
    localStorage.removeItem('alif_onboarding_done');
    window.APP_STATE.user     = null;
    window.APP_STATE.userName = '';
    window.closeProfile?.();
    showScreen('welcome');
  }).catch(err => {
    console.error('[Alif] signOut failed:', err);
  });
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

// ── LEVEL 1 CELEBRATION ──
window.dismissL1Celebration = function(goToL2) {
  localStorage.setItem('alif_kalimaat_l1_celebrated', '1');
  const modal = document.getElementById('l1-celebration-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
  // Award the 500 bonus XP once
  const bonusKey = 'alif_kalimaat_l1_bonus_xp';
  if (!localStorage.getItem(bonusKey)) {
    localStorage.setItem(bonusKey, '1');
    addXPAndSync(500);
  }
  syncL1Celebration();
  if (goToL2) showScreen('track');
};

// ── LEVEL 2 CELEBRATION ──
window.dismissL2Celebration = function(keepGoing) {
  localStorage.setItem('alif_kalimaat_l2_celebrated', '1');
  const modal = document.getElementById('l2-celebration-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  }
  // Award the 750 bonus XP once
  const bonusKey = 'alif_kalimaat_l2_bonus_xp';
  if (!localStorage.getItem(bonusKey)) {
    localStorage.setItem(bonusKey, '1');
    addXPAndSync(750);
  }
  syncL2Celebration();
  if (keepGoing) showScreen('track');
};

// ── SCROLL TRACK TO ACTIVE LESSON ──
function scrollTrackToActive() {
  setTimeout(() => {
    const activeNode = document.querySelector('[data-active-lesson="true"]');
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 200);
}

// ── LANG & THEME ──
window.setLang = function(lang) {
  window.APP_STATE.lang = lang;
  localStorage.setItem('qwv_lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  // If inside a lesson, update lesson state and re-render current step instantly
  const current = document.querySelector('#app-main .screen');
  const screenId = current?.id?.replace('-screen', '');
  if (screenId === 'lesson') {
    setLessonLang(lang);
  } else if (screenId && ['home','track','journal','welcome','login','onboarding','placement'].includes(screenId)) {
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

// ── BOOT ──────────────────────────────────────────────────────
// Firebase onAuthStateChanged is the single entry point for auth state.
// It fires once on page load (with the persisted session if any),
// and again whenever the user signs in or out.

async function boot() {
  initTheme();
  initTextSize();

  // Load lessons immediately (bundles, no auth needed)
  loadAllLessons();

  auth.onAuthStateChanged(async (firebaseUser) => {
    if (!firebaseUser) {
      // Not signed in — show welcome screen
      window.APP_STATE.user     = null;
      window.APP_STATE.userName = '';
      showScreen('welcome');
      return;
    }

    // ── Signed in — check gate status ──────────────────────────
    const lang = window.APP_STATE.lang;
    const main = document.getElementById('app-main');

    // Show a subtle loading state while we fetch from Firestore
    if (main) {
      main.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; min-height:100vh; flex-direction:column; gap:16px;">
          <div class="logo-circle" style="width:60px; height:60px; animation: goldPulse 1.5s ease-in-out infinite;">
            <img src="assets/images/Alif-Light.png" alt="Alif" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="font-size:13px; color:var(--text-muted);">
            ${lang === 'ur' ? 'لوڈ ہو رہا ہے…' : lang === 'hi' ? 'लोड हो रहा है…' : 'Loading…'}
          </div>
        </div>`;
    }

    try {
      // Fetch the user's profile from users/{uid}
      const userSnap = await firebase.firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get();

      if (!userSnap.exists) {
        // No QWV profile — they have Firebase Auth but never completed onboarding
        window.APP_STATE.user     = null;
        window.APP_STATE.userName = '';
        main.innerHTML = renderGateBlocked(lang, 'locked', 'there');
        return;
      }

      const userData = userSnap.data();

      // ── Gate check ────────────────────────────────────────────
      const gateStatus = userData?.gate_status?.alif || 'locked';

      if (gateStatus !== 'unlocked') {
        // User exists but not granted access to Alif
        const name = userData.name || firebaseUser.displayName || 'there';
        main.innerHTML = renderGateBlocked(lang, gateStatus, name);
        return;
      }

      // ── Access granted ────────────────────────────────────────
      const name = userData.name || firebaseUser.displayName || 'Student';
      window.APP_STATE.user = {
        uid:   firebaseUser.uid,
        email: firebaseUser.email,
        name,
      };
      window.APP_STATE.userName = name;

      // Always clear the local cache first before loading this user's data.
      // This prevents a previous user's localStorage from leaking into a new session
      // on the same browser — every sign-in starts from Firestore state only.
      clearLocalProgress();

      // Sync preferred language from Firestore if not already set
      if (userData.language && !localStorage.getItem('qwv_lang')) {
        window.APP_STATE.lang = userData.language;
        localStorage.setItem('qwv_lang', userData.language);
        document.documentElement.setAttribute('data-lang', userData.language);
      }

      // Load Firestore progress → hydrate localStorage
      const progressData = await loadProgressFromFirestore();
      if (progressData) {
        hydrateLocalStorage(progressData);
      } else {
        // First time on Alif — create the progress doc
        await initProgressDoc(name, userData.language || lang);
      }

      updateSidebarStats();

      // Route to the right screen
      onAuthSuccess();

    } catch (err) {
      console.error('[Alif] boot auth check failed:', err);
      // Network error — fall back to welcome so they can retry
      showScreen('welcome');
    }
  });
}

boot();
