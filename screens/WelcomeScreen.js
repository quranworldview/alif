// WelcomeScreen.js — First impression. Circular logo. Animations. Desktop aware.
import { t } from '../i18n/strings.js';

export function renderWelcome(lang) {
  return `
    <div id="welcome-screen" class="screen active" style="position:relative; overflow:hidden; min-height:100vh; display:flex; flex-direction:column;">

      <div class="star-field" id="star-field"></div>

      <!-- Lang pills top right -->
      <div style="padding:16px 20px 0; display:flex; justify-content:flex-end; position:relative; z-index:2;">
        <div class="lang-pills anim-fadeIn">
          <button class="lang-pill ${lang==='en'?'active':''}" onclick="setLang('en')">EN</button>
          <button class="lang-pill ${lang==='hi'?'active':''}" onclick="setLang('hi')">HI</button>
          <button class="lang-pill ${lang==='ur'?'active':''}" onclick="setLang('ur')">UR</button>
        </div>
      </div>

      <!-- Hero -->
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px 32px 0; position:relative; z-index:2; text-align:center;">

        <!-- Circular logo -->
        <div class="logo-circle" style="width:148px; height:148px; margin-bottom:28px; animation: logoFloat 4s ease-in-out infinite, goldPulse 4s ease-in-out infinite, scaleIn 0.5s cubic-bezier(0.34,1.06,0.64,1) both;">
          <img class="alif-logo" src="assets/images/Alif-Dark.png" alt="Alif" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <!-- Bismillah -->
        <div class="anim-fadeUp" style="animation-delay:0.2s; font-family:'Amiri',serif; font-size:1.25em; direction:rtl; color:var(--gold); margin-bottom:18px; opacity:0.9;">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        <h1 class="anim-fadeUp" style="animation-delay:0.3s; font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:400; color:var(--text-primary); margin-bottom:10px; line-height:1.25;">
          ${t('welcomeTitle', lang)}
        </h1>

        <p class="anim-fadeUp" style="animation-delay:0.4s; font-size:0.9375em; color:var(--text-muted); font-style:italic; line-height:1.6; max-width:280px;">
          ${t('tagline', lang)}
        </p>
      </div>

      <!-- Ayah teaser -->
      <div class="anim-fadeUp" style="animation-delay:0.5s; margin:24px 24px 0; padding:18px 20px; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:20px; text-align:center; position:relative; z-index:2;">
        <div style="font-family:'Amiri',serif; font-size:1.375em; direction:rtl; color:var(--text-arabic); line-height:1.9; margin-bottom:8px;">
          ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ
        </div>
        <div style="font-size:0.75em; color:var(--text-muted); font-style:italic;">
          "Read! In the name of your Lord who created." — Al-Alaq 96:1
        </div>
      </div>

      <!-- Auth buttons -->
      <div class="anim-fadeUp" style="animation-delay:0.6s; padding:24px 24px max(28px, env(safe-area-inset-bottom)); display:flex; flex-direction:column; gap:12px; position:relative; z-index:2;">
        <button class="btn btn-primary lift" onclick="showScreen('register')">${t('createAccount', lang)}</button>
        <button class="btn btn-secondary lift" onclick="showScreen('login')">${t('signIn', lang)}</button>
      </div>

    </div>
  `;
}

// Generate star field for dark mode
export function initStars() {
  const container = document.getElementById('star-field');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      --delay:${Math.random()*4}s;
    `;
    container.appendChild(star);
  }
}
