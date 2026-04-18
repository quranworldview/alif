// ProgressTracker.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for all Alif progress.
// Strategy: localStorage as fast local cache (instant UI),
// write-through to Firestore on every event (persistent, cross-device).
// On login, Firestore data hydrates localStorage via firestore.js.
// ─────────────────────────────────────────────────────────────

import {
  syncLessonComplete,
  syncStreak,
  syncPlacement,
  syncLastLesson,
  syncJournal,
  syncXP,
  syncCelebration,
} from '../js/firestore.js';

const KEYS = {
  progress:   'alif_progress',
  xp:         'alif_xp',
  streak:     'alif_streak',
  lastDate:   'alif_last_date',
  journal:    'alif_journal',
  level:      'alif_level',
  placement:  'alif_placement',
  lastLesson: 'alif_last_lesson',
};

function load(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ── LESSON PROGRESS ──────────────────────────────────────────

export function isComplete(lessonId) {
  const p = load(KEYS.progress, {});
  return !!p[lessonId]?.complete;
}

export function markComplete(lessonId, xp) {
  const p = load(KEYS.progress, {});
  if (!p[lessonId]?.complete) {
    p[lessonId] = { complete: true, date: new Date().toISOString() };
    save(KEYS.progress, p);
    addXP(xp || 0);
    updateStreak();
    // Write-through to Firestore (fire and forget — UI never waits)
    syncLessonComplete(lessonId, xp, p, getXP());
  }
}

export function getProgress() {
  return load(KEYS.progress, {});
}

export function countComplete() {
  return Object.values(load(KEYS.progress, {})).filter(v => v.complete).length;
}

// ── XP ────────────────────────────────────────────────────────

export function getXP() { return load(KEYS.xp, 0); }

export function addXP(amount) {
  if (!amount) return;
  const newXP = getXP() + amount;
  save(KEYS.xp, newXP);
  // XP is synced as part of syncLessonComplete — no extra call needed here.
  // If called standalone (celebration bonus), sync separately.
}

export function addXPAndSync(amount) {
  if (!amount) return;
  const newXP = getXP() + amount;
  save(KEYS.xp, newXP);
  syncXP(newXP);
}

// ── STREAK ────────────────────────────────────────────────────

export function getStreak() { return load(KEYS.streak, 0); }

export function updateStreak() {
  const today     = new Date().toDateString();
  const last      = localStorage.getItem(KEYS.lastDate);
  if (last === today) return; // already updated today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const current   = load(KEYS.streak, 0);
  const newStreak = last === yesterday ? current + 1 : 1;
  save(KEYS.streak, newStreak);
  localStorage.setItem(KEYS.lastDate, today);
  // Write-through
  syncStreak(newStreak, new Date().toISOString().slice(0, 10));
}

// ── JOURNAL ───────────────────────────────────────────────────

export function getJournal() { return load(KEYS.journal, []); }

export function addJournalEntry(tag, text, lessonTitle) {
  const journal = getJournal();
  journal.unshift({
    id: Date.now(),
    tag,
    text,
    lessonTitle,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  });
  save(KEYS.journal, journal);
  // Write-through
  syncJournal(journal);
}

// ── LEVEL / PLACEMENT ─────────────────────────────────────────

export function getLevel() { return localStorage.getItem(KEYS.level) || null; }
export function setLevel(level) { localStorage.setItem(KEYS.level, level); }

export function isPlacementDone() { return !!localStorage.getItem(KEYS.placement); }

export function setPlacementDone(score, assigned, actual) {
  const data = { score, assigned, actual, date: new Date().toISOString() };
  localStorage.setItem(KEYS.placement, JSON.stringify(data));
  const level = localStorage.getItem(KEYS.level) || actual;
  // Write-through
  syncPlacement(data, level);
}

export function getPlacement() { return load(KEYS.placement, null); }

// ── LAST LESSON ───────────────────────────────────────────────

export function setLastLesson(lessonId) {
  localStorage.setItem(KEYS.lastLesson, lessonId);
  // Write-through
  syncLastLesson(lessonId);
}

export function getLastLesson() {
  return localStorage.getItem(KEYS.lastLesson) || null;
}

// ── CELEBRATION FLAGS ─────────────────────────────────────────
// Called from app.js celebration handlers after bonus XP awarded.

export function syncL1Celebration() { syncCelebration('l1'); }
export function syncL2Celebration() { syncCelebration('l2'); }

// ── UNLOCK LOGIC ──────────────────────────────────────────────

export function isUnlocked(lesson, allLessons) {
  if (!lesson.prerequisite) return true;
  return isComplete(lesson.prerequisite);
}

// ── CLEAR ALL (sign out) ──────────────────────────────────────
// Wipes the local cache. Firestore data is the persistent source.

export function clearLocalProgress() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem('alif_kalimaat_l1_celebrated');
  localStorage.removeItem('alif_kalimaat_l1_bonus_xp');
  localStorage.removeItem('alif_kalimaat_l2_celebrated');
  localStorage.removeItem('alif_kalimaat_l2_bonus_xp');
  localStorage.removeItem('alif_onboarding_done');
}
