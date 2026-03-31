// AuthScreen.js — Email/password auth. Shared Firebase project across all QWV apps.
import { t } from '../i18n/strings.js';

export function renderLogin(lang) {
  return `
    <div id="login-screen" class="screen active">

      <!-- Back + Logo topbar -->
      <div style="display:flex; align-items:center; padding:16px 20px; gap:12px; border-bottom:1px solid var(--border);">
        <button class="icon-btn" onclick="showScreen('welcome')" aria-label="Back">←</button>
        <img class="alif-logo" src="assets/images/Alif-Dark.png" alt="Alif" style="width:32px; height:32px; object-fit:contain;">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);" data-theme-text>Alif</span>
      </div>

      <div class="scroll-content" style="padding:32px 24px;">

        <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.875em; font-weight:400; color:var(--text-primary); margin-bottom:6px;">
          ${t('signIn', lang)}
        </h2>
        <p style="font-size:0.875em; color:var(--text-muted); margin-bottom:32px;">
          ${t('hasAccount', lang)}
        </p>

        <!-- Error message -->
        <div id="login-error" style="display:none; background:var(--wrong-bg); border:1px solid var(--wrong-border); color:var(--wrong-text); border-radius:12px; padding:12px 16px; font-size:0.875em; margin-bottom:20px;"></div>

        <!-- Email -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('email', lang)}
          </label>
          <input type="email" id="login-email" autocomplete="email"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"
            placeholder="your@email.com">
        </div>

        <!-- Password -->
        <div style="margin-bottom:8px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('password', lang)}
          </label>
          <input type="password" id="login-password" autocomplete="current-password"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"
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

        <div style="text-align:center; margin-top:24px; font-size:0.875em; color:var(--text-muted);">
          ${t('noAccount', lang)}
          <button class="btn-ghost" style="color:var(--crimson); font-size:0.875em; padding:0 4px; text-decoration:underline; text-underline-offset:3px;" onclick="showScreen('register')">
            ${t('createAccount', lang)}
          </button>
        </div>

      </div>
    </div>
  `;
}

export function renderRegister(lang) {
  return `
    <div id="register-screen" class="screen active">

      <div style="display:flex; align-items:center; padding:16px 20px; gap:12px; border-bottom:1px solid var(--border);">
        <button class="icon-btn" onclick="showScreen('welcome')" aria-label="Back">←</button>
        <img class="alif-logo" src="assets/images/Alif-Dark.png" alt="Alif" style="width:32px; height:32px; object-fit:contain;">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);">Alif</span>
      </div>

      <div class="scroll-content" style="padding:32px 24px;">

        <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.875em; font-weight:400; color:var(--text-primary); margin-bottom:6px;">
          ${t('createAccount', lang)}
        </h2>
        <p style="font-size:0.875em; color:var(--text-muted); margin-bottom:32px;">
          One account. All QWV apps.
        </p>

        <div id="register-error" style="display:none; background:var(--wrong-bg); border:1px solid var(--wrong-border); color:var(--wrong-text); border-radius:12px; padding:12px 16px; font-size:0.875em; margin-bottom:20px;"></div>

        <!-- Name -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('name', lang)}
          </label>
          <input type="text" id="reg-name" autocomplete="name"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"
            placeholder="Yusuf">
        </div>

        <!-- Email -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('email', lang)}
          </label>
          <input type="email" id="reg-email" autocomplete="email"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"
            placeholder="your@email.com">
        </div>

        <!-- Password -->
        <div style="margin-bottom:32px;">
          <label style="display:block; font-size:0.75em; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:8px;">
            ${t('password', lang)}
          </label>
          <input type="password" id="reg-password" autocomplete="new-password"
            style="width:100%; background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; padding:14px 16px; font-family:var(--font-body); font-size:0.9375em; color:var(--text-primary); outline:none; transition:border-color 0.2s;"
            onfocus="this.style.borderColor='var(--crimson)'" onblur="this.style.borderColor='var(--border)'"
            placeholder="At least 6 characters"
            onkeydown="if(event.key==='Enter') handleRegister()">
        </div>

        <button class="btn btn-primary" id="register-btn" onclick="handleRegister()">
          ${t('registerBtn', lang)}
        </button>

        <div style="text-align:center; margin-top:24px; font-size:0.875em; color:var(--text-muted);">
          ${t('hasAccount', lang)}
          <button class="btn-ghost" style="color:var(--crimson); font-size:0.875em; padding:0 4px; text-decoration:underline; text-underline-offset:3px;" onclick="showScreen('login')">
            ${t('signIn', lang)}
          </button>
        </div>

        <p style="font-size:0.6875em; color:var(--text-muted); text-align:center; margin-top:24px; line-height:1.5;">
          By creating an account you agree to use this app sincerely, for the sake of Allah.
        </p>

      </div>
    </div>
  `;
}
