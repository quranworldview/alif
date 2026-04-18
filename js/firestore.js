// js/firestore.js
// ─────────────────────────────────────────────────────────────
// ALL Firestore reads and writes for Alif go through here.
// No other file calls db.collection() directly for writes.
// Rule: Page code → calls firestore.js → firestore.js writes to Firestore.
// ─────────────────────────────────────────────────────────────

import { db, auth, COLLECTIONS } from './firebase.js';

// ── LOAD PROGRESS ─────────────────────────────────────────────
// Called once on login. Fetches the user's alif_progress document
// and hydrates localStorage so the rest of the app runs instantly
// from cache. Returns the raw Firestore data (or null if no doc yet).

export async function loadProgressFromFirestore() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  try {
    const snap = await db.collection(COLLECTIONS.ALIF_PROGRESS).doc(uid).get();
    if (!snap.exists) return null;
    return snap.data();
  } catch (err) {
    console.error('[Alif] loadProgress failed:', err);
    return null;
  }
}

// Hydrate localStorage from a Firestore progress document.
// Called after loadProgressFromFirestore() on login.
export function hydrateLocalStorage(data) {
  if (!data) return;

  // Lesson progress — stored as { lessonId: { complete, date } }
  if (data.lesson_progress) {
    localStorage.setItem('alif_progress', JSON.stringify(data.lesson_progress));
  }
  if (typeof data.xp === 'number') {
    localStorage.setItem('alif_xp', String(data.xp));
  }
  if (typeof data.streak === 'number') {
    localStorage.setItem('alif_streak', String(data.streak));
  }
  if (data.last_active_date) {
    localStorage.setItem('alif_last_date', data.last_active_date);
  }
  if (data.placement) {
    localStorage.setItem('alif_placement', JSON.stringify(data.placement));
  }
  if (data.level) {
    localStorage.setItem('alif_level', data.level);
  }
  if (data.last_lesson) {
    localStorage.setItem('alif_last_lesson', data.last_lesson);
  }
  if (Array.isArray(data.journal)) {
    localStorage.setItem('alif_journal', JSON.stringify(data.journal));
  }
  // Celebration flags
  if (data.l1_celebrated) {
    localStorage.setItem('alif_kalimaat_l1_celebrated', '1');
    localStorage.setItem('alif_kalimaat_l1_bonus_xp', '1');
  }
  if (data.l2_celebrated) {
    localStorage.setItem('alif_kalimaat_l2_celebrated', '1');
    localStorage.setItem('alif_kalimaat_l2_bonus_xp', '1');
  }
}

// ── WRITE HELPERS ──────────────────────────────────────────────
// All write helpers use set/update with merge:true so partial
// updates never clobber other fields.

function progressRef() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  return db.collection(COLLECTIONS.ALIF_PROGRESS).doc(uid);
}

function userRef() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  return db.collection(COLLECTIONS.USERS).doc(uid);
}

// ── MARK LESSON COMPLETE ───────────────────────────────────────
// Called by ProgressTracker.markComplete() — writes the full
// lesson_progress map and XP in one merge update.

export async function syncLessonComplete(lessonId, xp, allProgress, totalXP) {
  const ref = progressRef();
  if (!ref) return;

  try {
    await ref.set({
      lesson_progress: allProgress,
      xp: totalXP,
      last_active_date: new Date().toISOString().slice(0, 10),
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Update users/{uid} last_active
    const uRef = userRef();
    if (uRef) {
      uRef.update({ last_active: firebase.firestore.FieldValue.serverTimestamp() })
          .catch(() => {});
    }
  } catch (err) {
    console.error('[Alif] syncLessonComplete failed:', err);
  }
}

// ── SYNC STREAK ────────────────────────────────────────────────
export async function syncStreak(streak, lastDate) {
  const ref = progressRef();
  if (!ref) return;
  try {
    await ref.set({
      streak,
      last_active_date: lastDate,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncStreak failed:', err);
  }
}

// ── SYNC PLACEMENT ─────────────────────────────────────────────
export async function syncPlacement(placementData, level) {
  const ref = progressRef();
  if (!ref) return;
  try {
    await ref.set({
      placement: placementData,
      level,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncPlacement failed:', err);
  }
}

// ── SYNC LAST LESSON ───────────────────────────────────────────
export async function syncLastLesson(lessonId) {
  const ref = progressRef();
  if (!ref) return;
  try {
    await ref.set({
      last_lesson: lessonId,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncLastLesson failed:', err);
  }
}

// ── SYNC JOURNAL ENTRY ─────────────────────────────────────────
// Journals are stored as an array in the progress doc.
// We write the entire array each time (journals are small).
export async function syncJournal(journalArray) {
  const ref = progressRef();
  if (!ref) return;
  try {
    await ref.set({
      journal: journalArray,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncJournal failed:', err);
  }
}

// ── SYNC CELEBRATION FLAGS ─────────────────────────────────────
export async function syncCelebration(level) {
  const ref = progressRef();
  if (!ref) return;
  const field = level === 'l1' ? { l1_celebrated: true } : { l2_celebrated: true };
  try {
    await ref.set({
      ...field,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncCelebration failed:', err);
  }
}

// ── SYNC XP ────────────────────────────────────────────────────
export async function syncXP(xp) {
  const ref = progressRef();
  if (!ref) return;
  try {
    await ref.set({
      xp,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('[Alif] syncXP failed:', err);
  }
}

// ── INITIALISE PROGRESS DOC ────────────────────────────────────
// Called on first login if no progress doc exists yet.
// Creates a blank doc so future set/merge calls have a target.
export async function initProgressDoc(userName, language) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const ref = db.collection(COLLECTIONS.ALIF_PROGRESS).doc(uid);
  try {
    await ref.set({
      lesson_progress:  {},
      xp:               0,
      streak:           0,
      last_active_date: new Date().toISOString().slice(0, 10),
      placement:        null,
      level:            null,
      last_lesson:      null,
      journal:          [],
      l1_celebrated:    false,
      l2_celebrated:    false,
      created_at:       firebase.firestore.FieldValue.serverTimestamp(),
      updated_at:       firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }); // merge: true so we never overwrite if it already exists
  } catch (err) {
    console.error('[Alif] initProgressDoc failed:', err);
  }
}
