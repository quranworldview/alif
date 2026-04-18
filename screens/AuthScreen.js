// AuthScreen.js
// Login screen only. No registration — Alif is a gated app.
// Account creation happens via the QWV platform (quranworldview.pages.dev).
// Gate-blocked screen shown when user is authenticated but not yet
// granted access to Alif (gate_status.alif !== 'unlocked').

import { t } from '../i18n/strings.js';

// ── LOGIN SCREEN ───────────────────────────────────────────────

export function renderLogin(lang) {
  return `
    <div id="login-screen" class="screen active">

      <!-- Topbar -->
      <div style="display:flex; align-items:center; padding:16px 20px; gap:12px; border-bottom:1px solid var(--border);">
        <button class="icon-btn" onclick="showScreen('welcome')" aria-label="Back">←</button>
        <img class="alif-logo" src="assets/images/Alif-Dark.png" alt="Alif"
          style="width:32px; height:32px; object-fit:contain;">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);" data-theme-text>Alif</span>
      </div>

      <div class="scroll-content" style="padding:32px 24px;">

        <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.875em; font-weight:400; color:var(--text-primary); margin-bottom:6px;">
          ${t('signIn', lang)}
        </h2>
        <p style="font-size:0.875em; color:var(--text-muted); margin-bottom:32px; line-height:1.6;">
          ${lang === 'ur'
            ? 'اپنے QWV اکاؤنٹ سے سائن ان کریں۔'
            : lang === 'hi'
            ? 'अपने QWV अकाउंट से साइन इन करें।'
            : 'Sign in with your QWV account.'}
        </p>

        <!-- Error -->
        <div id="login-error"
          style="display:none; background:var(--wrong-bg); border:1px solid var(--wrong-border); color:var(--wrong-text); border-radius:12px; padding:12px 16px; font-size:0.875em; margin-bottom:20px;">
        </div>

        <!-- Email -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('email', lang)}
          </label>
          <input type="email" id="login-email" autocomplete="email"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s; box-sizing:border-box;"
            onfocus="this.style.borderColor='var(--crimson)'"
            onblur="this.style.borderColor='var(--border)'"
            placeholder="your@email.com">
        </div>

        <!-- Password -->
        <div style="margin-bottom:8px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('password', lang)}
          </label>
          <input type="password" id="login-password" autocomplete="current-password"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s; box-sizing:border-box;"
            onfocus="this.style.borderColor='var(--crimson)'"
            onblur="this.style.borderColor='var(--border)'"
            placeholder="••••••••"
            onkeydown="if(event.key==='Enter') handleLogin()">
        </div>

        <div style="text-align:right; margin-bottom:28px;">
          <button class="btn-ghost" style="font-size:0.8125em; padding:4px 0;" onclick="handleForgotPassword()">
            ${t('forgotPassword', lang)}
          </button>
        </div>

        <button class="btn btn-primary" id="login-btn" onclick="handleLogin()">
          ${t('loginBtn', lang)}
        </button>

        <!-- Not a member yet -->
        <div style="margin-top:32px; padding:20px; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:16px; text-align:center;">
          <div style="font-family:'Amiri',serif; font-size:1.25em; direction:rtl; color:var(--gold); margin-bottom:8px; line-height:1.8;">
            اِقْرَأ بِاسْمِ رَبِّكَ
          </div>
          <p style="font-size:0.8125em; color:var(--text-muted); line-height:1.65; margin-bottom:14px;">
            ${lang === 'ur'
              ? 'Alif ایک گیٹڈ ایپ ہے۔ داخلہ QWV پلیٹ فارم سے ملتا ہے — سفر Iqra سے شروع ہوتا ہے۔'
              : lang === 'hi'
              ? 'Alif एक गेटेड ऐप है। दाख़िला QWV प्लेटफ़ॉर्म से मिलता है — सफ़र Iqra से शुरू होता है।'
              : 'Alif is a gated app. Access is granted through the QWV platform — the journey begins with Iqra.'}
          </p>
          <a href="https://quranworldview.pages.dev" target="_blank" rel="noopener"
            style="display:inline-block; background:var(--crimson); color:#fff; padding:10px 22px; border-radius:10px; font-size:0.875em; font-weight:600; text-decoration:none; letter-spacing:0.02em;">
            ${lang === 'ur' ? 'QWV سے جوائن کریں' : lang === 'hi' ? 'QWV से जुड़ें' : 'Begin the Journey →'}
          </a>
        </div>

      </div>
    </div>
  `;
}

// ── GATE BLOCKED SCREEN ────────────────────────────────────────
// Shown when user is authenticated but gate_status.alif !== 'unlocked'.
// pending_approval: they've applied, waiting for admin.
// locked: they haven't completed Iqra / haven't been granted access yet.

export function renderGateBlocked(lang, status, userName) {
  const isPending = status === 'pending_approval';

  const icon    = isPending ? '⏳' : '🔒';
  const title   = isPending
    ? (lang === 'ur' ? 'درخواست جمع ہے' : lang === 'hi' ? 'दरख़्वास्त जमा है' : 'Application Pending')
    : (lang === 'ur' ? 'ابھی رسائی نہیں' : lang === 'hi' ? 'अभी दाख़िला नहीं' : 'Access Not Yet Granted');

  const message = isPending
    ? (lang === 'ur'
        ? `${userName}، آپ کی Alif درخواست جمع ہے۔ ٹیم جلد جائزہ لے گی۔ جیسے ہی منظور ہو، آپ کو اطلاع ملے گی۔`
        : lang === 'hi'
        ? `${userName}، आपकी Alif दरख़्वास्त जमा है। टीम जल्द जायज़ा लेगी। मंज़ूरी मिलते ही आपको ख़बर होगी।`
        : `${userName}, your application for Alif is under review. You'll be notified as soon as it's approved.`)
    : (lang === 'ur'
        ? `${userName}، Alif میں داخلہ کے لیے پہلے Iqra مکمل کریں۔ Iqra QWV سفر کا پہلا قدم ہے — روزانہ قرآن پڑھنے کی عادت۔ جب تیار ہوں، واپس آئیں۔`
        : lang === 'hi'
        ? `${userName}، Alif में दाख़िले के लिए पहले Iqra मुकम्मल करें। Iqra QWV सफ़र का पहला क़दम है — रोज़ क़ुरआन पढ़ने की आदत। जब तैयार हों, वापस आएं।`
        : `${userName}, to enter Alif you first need to complete Iqra — the daily Qur'an reading habit. That's the foundation. Once you've built it, the door to Alif opens.`);

  return `
    <div id="gate-screen" class="screen active"
      style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:40px 28px; text-align:center; background:var(--bg-primary);">

      <div style="font-size:56px; margin-bottom:20px;">${icon}</div>

      <!-- Arabic -->
      <div style="font-family:'Amiri',serif; font-size:1.5em; direction:rtl; color:var(--gold); margin-bottom:16px; line-height:1.7;">
        ${isPending ? 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ' : 'اِقْرَأ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ'}
      </div>

      <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:600; color:var(--text-primary); margin-bottom:12px;">
        ${title}
      </h2>

      <p style="font-size:0.9375em; color:var(--text-muted); line-height:1.7; max-width:320px; margin-bottom:32px;">
        ${message}
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; width:100%; max-width:300px;">
        ${!isPending ? `
          <a href="https://quranworldview.pages.dev" target="_blank" rel="noopener"
            style="display:block; background:var(--crimson); color:#fff; padding:14px 22px; border-radius:14px; font-size:0.9375em; font-weight:600; text-decoration:none; text-align:center;">
            ${lang === 'ur' ? 'Iqra شروع کریں ←' : lang === 'hi' ? 'Iqra शुरू करें →' : 'Go to Iqra →'}
          </a>
        ` : ''}
        <button class="btn btn-secondary" onclick="handleSignOut()" style="width:100%;">
          ${lang === 'ur' ? 'سائن آؤٹ' : lang === 'hi' ? 'साइन आउट' : 'Sign Out'}
        </button>
      </div>

    </div>
  `;
}
