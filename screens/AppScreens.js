// AppScreens.js — Home, Track, Journal screens + Profile drawer + Desktop panels
import { t } from '../i18n/strings.js';
import { getXP, getStreak, countComplete, isComplete, isUnlocked } from '../components/ProgressTracker.js';
import { getTheme, getTextSize } from '../components/theme.js';

// ── THEME TOGGLE BUTTON ──
function themeToggleHTML(lang) {
  const theme = getTheme();
  const icons  = { dark: '🌙', light: '☀️', system: '💻' };
  const labels = {
    dark:   t('themeDark', lang),
    light:  t('themeLight', lang),
    system: t('themeSystem', lang),
  };
  return `
    <button class="theme-toggle" onclick="cycleTheme()" title="Toggle theme">
      <span class="theme-toggle-icon">${icons[theme]}</span>
      <span>${labels[theme]}</span>
    </button>`;
}

// ── BOTTOM NAV ──
function renderBottomNav(active, lang) {
  const items = [
    { id: 'home',    icon: '🏠', label: t('navHome', lang),    onclick: "showScreen('home')" },
    { id: 'track',   icon: '📚', label: t('navTrack', lang),   onclick: "showScreen('track')" },
    { id: 'journal', icon: '📓', label: t('navJournal', lang), onclick: "showScreen('journal')" },
  ];
  return `
    <div class="bottom-nav">
      ${items.map(item => `
        <button class="nav-item ${item.id === active ? 'active' : ''}" onclick="${item.onclick}">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `).join('')}
    </div>`;
}

// ── HOME SCREEN ──
export function renderHome(lang, userName, nextLesson) {
  const streak = getStreak();
  const xp = getXP();
  const done = countComplete();

  return `
    <div id="home-screen" class="screen active" style="display:flex; flex-direction:column; min-height:100vh;">

      <!-- Topbar -->
      <div class="topbar">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="logo-circle-sm">
            <img class="alif-logo" src="assets/images/Alif-Dark.png" alt="Alif" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);">Alif</span>
        </div>
        <div class="topbar-actions">
          ${themeToggleHTML(lang)}
          <button class="icon-btn" onclick="showProfile()" title="${t('profile', lang)}" style="font-size:1.125em;">👤</button>
        </div>
      </div>

      <div class="scroll-content" style="padding-bottom:80px;">

        <!-- Greeting -->
        <div class="stagger" style="padding:24px 24px 16px; text-align:center;">
          <div style="font-size:0.8125em; color:var(--text-muted); margin-bottom:2px;">${t('welcomeBack', lang)}</div>
          <h1 style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:400; color:var(--text-primary); margin-bottom:2px;">
            ${userName || 'Student'}
          </h1>
          <div style="font-size:0.8125em; color:var(--text-muted); font-style:italic;">${t('tagline', lang)}</div>
        </div>

        <!-- Stats row (mobile only — desktop shows in right sidebar) -->
        <div class="home-stats-mobile stagger" style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0 20px 24px;">
          ${[
            { val: streak, label: t('streak', lang),          icon: '🔥' },
            { val: xp,     label: t('xpEarned', lang),        icon: '✦'  },
            { val: done,   label: t('lessonsComplete', lang),  icon: '📖' },
          ].map(s => `
            <div class="lift" style="background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:14px 10px; text-align:center; box-shadow:var(--shadow); cursor:default;">
              <div style="font-size:1.25em; margin-bottom:4px;">${s.icon}</div>
              <div style="font-family:'Cormorant Garamond',serif; font-size:1.625em; font-weight:600; color:var(--crimson); line-height:1; margin-bottom:4px;">${s.val}</div>
              <div style="font-size:0.625em; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Continue card -->
        <div style="margin:0 20px 24px;" class="anim-fadeUp" style="animation-delay:0.15s;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:10px;">
            ${t('todayLesson', lang)}
          </div>
          ${nextLesson ? `
            <div class="lift" style="background:var(--bg-card); border:1px solid var(--border); border-left:3px solid var(--crimson); border-radius:14px; padding:18px 20px; cursor:pointer; box-shadow:var(--shadow);"
              onclick="loadAndStartLesson('${nextLesson.id}')">
              <div style="font-size:0.625em; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--crimson); margin-bottom:6px;">${t('continueLesson', lang)}</div>
              <div style="font-size:1.125em; font-weight:500; color:var(--text-primary); margin-bottom:2px;">${nextLesson.title}</div>
              <div style="font-size:0.8125em; color:var(--text-muted);">${nextLesson.track} · +${nextLesson.xp} XP</div>
              <div style="float:right; margin-top:-34px; font-size:1.375em; color:var(--text-muted);">→</div>
            </div>
          ` : `
            <div style="background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:14px; padding:20px; text-align:center;">
              <div style="font-family:'Amiri',serif; font-size:1.625em; direction:rtl; color:var(--text-arabic); margin-bottom:6px;">الحمد للہ</div>
              <div style="font-size:0.875em; color:var(--text-muted);">All available lessons complete. More coming soon.</div>
            </div>
          `}
        </div>

        <!-- Ayah of the Day -->
        <div style="margin:0 20px 24px;" class="anim-fadeUp" style="animation-delay:0.2s;">
          <div style="font-size:0.6875em; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted); margin-bottom:10px;">
            ${t('ayahOfDay', lang)}
          </div>
          <div class="lift" style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:16px; padding:20px; box-shadow:var(--shadow);">
            <div style="font-family:'Amiri',serif; font-size:1.375em; direction:rtl; color:var(--text-arabic); line-height:1.9; text-align:right; margin-bottom:10px;">
              إِنَّ مَعَ الْعُسْرِ يُسْرًا
            </div>
            <div style="font-size:0.8125em; color:var(--text-muted); font-style:italic; margin-bottom:4px;">
              "Verily, with hardship comes ease." — Al-Inshirah 94:6
            </div>
          </div>
        </div>

      </div>

      ${renderBottomNav('home', lang)}
    </div>
  `;
}

// ── TRACK SCREEN ──
export function renderTrack(lang, allLessons) {
  const tracks = [
    { key: 'huroof',   icon: 'ح', label: t('trackHuroof', lang),   arabic: 'حُرُوف' },
    { key: 'kalimaat', icon: 'ك', label: t('trackKalimaat', lang), arabic: 'كَلِمَات' },
    { key: 'qawaid',   icon: 'ق', label: t('trackQawaid', lang),   arabic: 'قَوَاعِد' },
  ];

  return `
    <div id="track-screen" class="screen active" style="display:flex; flex-direction:column; min-height:100vh;">

      <div class="topbar">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);">${t('trackTitle', lang)}</span>
        <div class="topbar-actions">
          ${themeToggleHTML(lang)}
          <button class="icon-btn" onclick="showProfile()">👤</button>
        </div>
      </div>

      <div class="scroll-content" style="padding:16px 20px 100px;">
        ${tracks.map((track, tIdx) => {
          const trackLessons = allLessons.filter(l => l.track === track.key);
          const doneCount = trackLessons.filter(l => isComplete(l.id)).length;
          const pct = trackLessons.length ? Math.round((doneCount / trackLessons.length) * 100) : 0;
          // Auto-expand the first track that has an unlocked lesson; collapse the rest
          const hasActive = trackLessons.some(l => !isComplete(l.id) && isUnlocked(l, trackLessons));
          const isExpanded = tIdx === 0 || hasActive;
          const collapseId = `track-collapse-${track.key}`;
          const arrowId    = `track-arrow-${track.key}`;

          return `
            <div class="anim-fadeUp" style="animation-delay:${tIdx * 0.08}s; margin-bottom:16px; background:var(--bg-card); border:1px solid var(--border); border-radius:18px; overflow:hidden; box-shadow:var(--shadow);">

              <!-- Track header — tap to collapse/expand -->
              <div onclick="toggleTrack('${collapseId}','${arrowId}')"
                style="display:flex; align-items:center; gap:12px; padding:16px 18px; cursor:pointer; user-select:none;">

                <!-- Arabic icon badge -->
                <div style="width:44px; height:44px; border-radius:14px; background:var(--accent-bg); border:1px solid var(--border-gold); display:flex; align-items:center; justify-content:center; font-family:'Amiri',serif; font-size:1.375em; color:var(--crimson); flex-shrink:0;">${track.icon}</div>

                <div style="flex:1; min-width:0;">
                  <div style="font-family:'Cormorant Garamond',serif; font-size:1.0625em; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${track.label}</div>
                  <div style="font-size:0.6875em; color:var(--text-muted); margin-top:2px;">${doneCount} / ${trackLessons.length} · ${pct}%</div>
                </div>

                <!-- Arabic label -->
                <div style="font-family:'Amiri',serif; font-size:1.125em; color:var(--gold-dim); direction:rtl; margin-right:4px;">${track.arabic}</div>

                <!-- Collapse arrow -->
                <div id="${arrowId}" style="font-size:0.8125em; color:var(--text-muted); transition:transform 0.25s ease; transform:rotate(${isExpanded ? '0' : '-90'}deg); flex-shrink:0;">▼</div>
              </div>

              <!-- Progress bar (always visible) -->
              <div style="height:3px; background:var(--progress-bg); margin:0 18px;">
                <div style="height:3px; background:var(--progress-fill); width:${pct}%; transition:width 0.8s ease; border-radius:2px;"></div>
              </div>

              <!-- Collapsible lesson list -->
              <div id="${collapseId}" style="display:${isExpanded ? 'block' : 'none'}; padding:12px 14px 14px;">
                ${trackLessons.map((lesson, lIdx) => {
                  const complete = isComplete(lesson.id);
                  const unlocked = isUnlocked(lesson, allLessons);
                  const nodeTitle = lesson.type === 'huroof'
                    ? `${lesson.letter?.name?.en || lesson.id} · ${lesson.letter?.arabic || ''}`
                    : lesson.type === 'kalimaat'
                      ? `${lesson.word?.arabic || ''} — ${lesson.word?.meaning?.en || lesson.id}`
                      : lesson.title?.en || lesson.id;

                  return `
                    <div class="${unlocked && !complete ? 'lift' : ''}"
                      style="display:flex; align-items:center; gap:12px; background:var(--bg-secondary); border:1px solid ${complete ? 'var(--border-gold)' : 'var(--border)'}; border-radius:12px; padding:12px 14px; margin-bottom:6px; cursor:${unlocked ? 'pointer' : 'default'}; opacity:${unlocked ? '1' : '0.38'}; transition:all 0.15s;"
                      onclick="${unlocked ? `loadAndStartLesson('${lesson.id}')` : ''}">

                      <!-- Status circle -->
                      <div style="width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-family:'Amiri',serif; font-size:1.125em; transition:all 0.2s;
                        background:${complete ? 'rgba(201,168,76,0.15)' : unlocked ? 'rgba(120,15,0,0.08)' : 'var(--bg-card)'};
                        color:${complete ? 'var(--gold)' : unlocked ? 'var(--crimson)' : 'var(--text-muted)'};">
                        ${complete ? '✓' : unlocked ? (lesson.letter?.arabic || lesson.word?.arabic || lesson.order || '?') : '🔒'}
                      </div>

                      <!-- Title + XP -->
                      <div style="flex:1; min-width:0;">
                        <div style="font-size:0.875em; font-weight:500; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${nodeTitle}</div>
                        <div style="font-size:0.6875em; color:var(--text-muted); margin-top:1px;">+${lesson.xp} XP</div>
                      </div>

                      <!-- State pill -->
                      <div style="font-size:0.6875em; font-weight:600; padding:3px 10px; border-radius:20px; flex-shrink:0; white-space:nowrap;
                        background:${complete ? 'rgba(201,168,76,0.15)' : unlocked ? 'var(--crimson)' : 'transparent'};
                        color:${complete ? 'var(--gold)' : unlocked ? 'white' : 'var(--text-muted)'};
                        border:1px solid ${complete ? 'var(--border-gold)' : unlocked ? 'transparent' : 'var(--border)'};">
                        ${complete ? '✓ Done' : unlocked ? (lang === 'ur' ? 'شروع' : lang === 'hi' ? 'शुरू' : 'Start') : '🔒'}
                      </div>
                    </div>`;
                }).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>

      ${renderBottomNav('track', lang)}
    </div>
  `;
}

// ── JOURNAL SCREEN ──
export function renderJournal(lang) {
  const journal = JSON.parse(localStorage.getItem('alif_journal') || '[]');

  return `
    <div id="journal-screen" class="screen active" style="display:flex; flex-direction:column; min-height:100vh;">

      <div class="topbar">
        <span style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--crimson);">${t('journalTitle', lang)}</span>
        <div class="topbar-actions">
          ${themeToggleHTML(lang)}
          <button class="icon-btn" onclick="showProfile()">👤</button>
        </div>
      </div>

      <div class="scroll-content" style="padding:20px 20px 100px;">
        ${journal.length === 0 ? `
          <div class="anim-fadeUp" style="text-align:center; padding:60px 24px;">
            <div style="font-size:48px; margin-bottom:16px; opacity:0.3;">📝</div>
            <div style="font-size:1em; color:var(--text-muted); margin-bottom:6px;">${t('journalEmpty', lang)}</div>
            <div style="font-size:0.875em; color:var(--text-muted); opacity:0.7;">${t('journalEmptySub', lang)}</div>
          </div>
        ` : journal.map((entry, i) => `
          <div class="anim-fadeUp" style="animation-delay:${i * 0.06}s; background:var(--bg-card); border:1px solid var(--border); border-left:3px solid var(--gold); border-radius:14px; padding:16px 18px; margin-bottom:12px; box-shadow:var(--shadow);">
            <div style="font-size:0.6875em; color:var(--text-muted); margin-bottom:8px; display:flex; justify-content:space-between;">
              <span style="font-weight:500;">${entry.lessonTitle || entry.tag}</span>
              <span>${entry.date}</span>
            </div>
            <div style="font-size:0.875em; color:var(--text-secondary); line-height:1.7;">${entry.text}</div>
          </div>
        `).join('')}
      </div>

      ${renderBottomNav('journal', lang)}
    </div>
  `;
}

// ── PROFILE DRAWER ──
export function renderProfileDrawer(lang, userName, userEmail) {
  const theme = getTheme();
  const currentTextSize = getTextSize();
  const themeOptions = [
    { val: 'dark',   icon: '🌙', label: t('themeDark', lang) },
    { val: 'light',  icon: '☀️', label: t('themeLight', lang) },
    { val: 'system', icon: '💻', label: t('themeSystem', lang) },
  ];
  const langOptions = [
    { val: 'en', label: 'English' },
    { val: 'hi', label: 'हिंदी' },
    { val: 'ur', label: 'اردو' },
  ];
  const textSizeOptions = [
    { val: 'normal', label: 'A',   labelFull: { en: 'Normal', ur: 'معمول', hi: 'सामान्य' } },
    { val: 'large',  label: 'A+',  labelFull: { en: 'Large',  ur: 'بڑا',   hi: 'बड़ा' } },
    { val: 'xlarge', label: 'A++', labelFull: { en: 'Larger', ur: 'بہت بڑا', hi: 'और बड़ा' } },
  ];
  const currentLang = window.APP_STATE?.lang || 'en';

  return `
    <div class="drawer-overlay" onclick="closeProfile()"></div>
    <div class="drawer">
      <div class="drawer-header">
        <div>
          <div style="font-family:'Cormorant Garamond',serif; font-size:1.25em; font-weight:600; color:var(--text-primary);">${t('profile', lang)}</div>
          <div style="font-size:0.8125em; color:var(--text-muted); margin-top:2px;">${userEmail || ''}</div>
        </div>
        <button class="icon-btn" onclick="closeProfile()">✕</button>
      </div>

      <div class="drawer-body">

        <!-- User info -->
        <div class="drawer-section">
          <div class="drawer-section-label">${t('account', lang)}</div>
          <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-md); padding:16px 18px; display:flex; align-items:center; gap:14px;">
            <div style="width:44px; height:44px; border-radius:50%; background:var(--accent-bg); border:1px solid var(--border-gold); display:flex; align-items:center; justify-content:center; font-size:1.25em; flex-shrink:0;">
              🕌
            </div>
            <div>
              <div style="font-size:1em; font-weight:500; color:var(--text-primary);">${userName || 'Student'}</div>
              <div style="font-size:0.75em; color:var(--text-muted);">${userEmail || 'Local account'}</div>
            </div>
          </div>
        </div>

        <!-- Theme -->
        <div class="drawer-section">
          <div class="drawer-section-label">${t('themeLabel', lang)}</div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
            ${themeOptions.map(opt => `
              <button onclick="setThemeFromDrawer('${opt.val}')"
                style="background:${theme === opt.val ? 'var(--accent-bg)' : 'var(--bg-card)'}; border:1.5px solid ${theme === opt.val ? 'var(--border-gold)' : 'var(--border)'}; border-radius:var(--r-md); padding:12px 8px; cursor:pointer; text-align:center; transition:all 0.18s; font-family:var(--font-body);">
                <div style="font-size:1.375em; margin-bottom:4px;">${opt.icon}</div>
                <div style="font-size:0.75em; font-weight:500; color:${theme === opt.val ? 'var(--gold)' : 'var(--text-muted)'};">${opt.label}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Language -->
        <div class="drawer-section">
          <div class="drawer-section-label">${t('langLabel', lang)}</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${langOptions.map(opt => `
              <button onclick="setLangFromDrawer('${opt.val}')"
                style="background:${currentLang === opt.val ? 'var(--accent-bg)' : 'var(--bg-card)'}; border:1.5px solid ${currentLang === opt.val ? 'var(--border-gold)' : 'var(--border)'}; border-radius:var(--r-md); padding:13px 16px; cursor:pointer; text-align:left; display:flex; justify-content:space-between; align-items:center; transition:all 0.18s; font-family:var(--font-body);">
                <span style="font-size:0.9375em; color:var(--text-primary); font-weight:${currentLang === opt.val ? '600' : '400'};">${opt.label}</span>
                ${currentLang === opt.val ? '<span style="color:var(--gold); font-size:1em;">✓</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Text Size -->
        <div class="drawer-section">
          <div class="drawer-section-label">${lang === 'ur' ? 'متن کا سائز' : lang === 'hi' ? 'टेक्स्ट साइज़' : 'Text Size'}</div>
          <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
            ${textSizeOptions.map(opt => `
              <button onclick="setTextSize('${opt.val}')"
                style="background:${currentTextSize === opt.val ? 'var(--accent-bg)' : 'var(--bg-card)'}; border:1.5px solid ${currentTextSize === opt.val ? 'var(--border-gold)' : 'var(--border)'}; border-radius:var(--r-md); padding:14px 8px; cursor:pointer; text-align:center; transition:all 0.18s; font-family:var(--font-body);">
                <div style="font-size:${opt.val === 'normal' ? '18px' : opt.val === 'large' ? '22px' : '27px'}; font-weight:700; color:${currentTextSize === opt.val ? 'var(--gold)' : 'var(--text-primary)'}; margin-bottom:4px; line-height:1;">${opt.label}</div>
                <div style="font-size:0.6875rem; color:${currentTextSize === opt.val ? 'var(--gold)' : 'var(--text-muted)'}; font-weight:${currentTextSize === opt.val ? '600' : '400'};">${opt.labelFull[lang] || opt.labelFull.en}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Sign out -->
        <div class="drawer-section">
          <button class="drawer-signout" onclick="handleSignOut()">
            ${t('signOut', lang)}
          </button>
        </div>

      </div>
    </div>
  `;
}
