// js/firebase.js
// ─────────────────────────────────────────────────────────────
// Firebase v8 compat SDK — loaded via CDN script tags in index.html.
// Do NOT use import/require. Do NOT use v10 syntax (getDoc, getAuth, etc.)
// This file assumes firebase-app.js, firebase-auth.js, firebase-firestore.js
// are already loaded as <script> tags before app.js.
// ─────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            'AIzaSyCqxgyulLw6nitLSjn89M1u0A7bxbWlt_U',
  authDomain:        'quranworldview-home.firebaseapp.com',
  projectId:         'quranworldview-home',
  storageBucket:     'quranworldview-home.appspot.com',
  messagingSenderId: '349899904697',
  appId:             '1:349899904697:web:b78d66af8f9af2cb80ad68',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db   = firebase.firestore();
export const auth = firebase.auth();

// Collection name constants — prevents typos, matches QWV platform standard
export const COLLECTIONS = {
  USERS:          'users',
  ALIF_PROGRESS:  'alif_progress',
};
