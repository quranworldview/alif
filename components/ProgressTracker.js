// ProgressTracker.js — All progress reads/writes go through here.
// Rule 3: One service handles all progress. No other file writes progress directly.
// localStorage now — Firebase slot-in when auth is wired.

const KEYS = {
  progress: 'alif_progress',
  xp:       'alif_xp',
  streak:   'alif_streak',
  lastDate: 'alif_last_date',
  journal:  'alif_journal',
  level:    'alif_level',
  placement:'alif_placement',
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

// ── LESSON PROGRESS ──
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
  }
}

export function getProgress() {
  return load(KEYS.progress, {});
}

export function countComplete() {
  return Object.values(load(KEYS.progress, {})).filter(v => v.complete).length;
}

// ── XP ──
export function getXP() { return load(KEYS.xp, 0); }
export function addXP(amount) { save(KEYS.xp, getXP() + amount); }

// ── STREAK ──
export function getStreak() { return load(KEYS.streak, 0); }

export function updateStreak() {
  const today = new Date().toDateString();
  const last  = localStorage.getItem(KEYS.lastDate);
  if (last === today) return; // Already updated today
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const current = load(KEYS.streak, 0);
  save(KEYS.streak, last === yesterday ? current + 1 : 1);
  localStorage.setItem(KEYS.lastDate, today);
}

// ── JOURNAL ──
export function getJournal() { return load(KEYS.journal, []); }

export function addJournalEntry(tag, text, lessonTitle) {
  const journal = getJournal();
  journal.unshift({
    id: Date.now(),
    tag,
    text,
    lessonTitle,
    date: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
  });
  save(KEYS.journal, journal);
}

// ── LEVEL / PLACEMENT ──
export function getLevel() { return localStorage.getItem(KEYS.level) || null; }
export function setLevel(level) { localStorage.setItem(KEYS.level, level); }
export function isPlacementDone() { return !!localStorage.getItem(KEYS.placement); }
export function setPlacementDone(score, assigned, actual) {
  localStorage.setItem(KEYS.placement, JSON.stringify({ score, assigned, actual, date: new Date().toISOString() }));
}
export function getPlacement() { return load(KEYS.placement, null); }

// ── UNLOCK LOGIC ──
// A lesson is unlocked if: it has no prerequisite, OR its prerequisite is complete
export function isUnlocked(lesson, allLessons) {
  if (!lesson.prerequisite) return true;
  return isComplete(lesson.prerequisite);
}
