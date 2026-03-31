// OnboardingScreen.js — Warm welcome + 3-slide orientation for first-time users.
// Designed for complete beginners, non-tech-savvy, ages 5–95.
// No jargon. Simple words. Bolchaal always.
import { t } from '../i18n/strings.js';

const SLIDES = [
  {
    id: 'welcome',
    icon: '🕌',
    title: {
      en: "Assalamu Alaikum",
      hi: "अस्सलामु अलैकुम",
      ur: "السلام علیکم",
    },
    body: {
      en: "Welcome to Alif — your Arabic learning companion.\n\nAlif will help you understand the Qur'an in the language it was revealed — one step at a time.",
      hi: "अलिफ़ में आपका स्वागत है — आपका अरबी सीखने का साथी।\n\nअलिफ़ आपको क़ुरआन को उसी ज़बान में समझने में मदद करेगा जिसमें वो नाज़िल हुआ — एक क़दम एक बार।",
      ur: "الف میں خوش آمدید — آپ کا عربی سیکھنے کا ساتھی۔\n\nالف آپ کو قرآن کو اس زبان میں سمجھنے میں مدد کرے گا جس میں وہ نازل ہوا — ایک قدم ایک بار۔",
    },
    arabic: "ٱقْرَأْ",
    arabicNote: {
      en: "The first word revealed to our Prophet ﷺ. It means: Read.",
      hi: "हमारे नबी ﷺ पर सबसे पहले नाज़िल हुआ लफ़्ज़। मतलब है: पढ़ो।",
      ur: "ہمارے نبی ﷺ پر سب سے پہلے نازل ہونے والا لفظ۔ مطلب: پڑھو۔",
    },
  },
  {
    id: 'how',
    icon: '📖',
    title: {
      en: "How Alif works",
      hi: "अलिफ़ कैसे काम करता है",
      ur: "الف کیسے کام کرتا ہے",
    },
    body: {
      en: "Every lesson takes just 5 minutes.\n\nYou will see an ayah from the Qur'an, learn something new, do a quick exercise, and reflect. That's it.",
      hi: "हर सबक़ सिर्फ़ 5 मिनट का है।\n\nआप एक आयत देखेंगे, कुछ नया सीखेंगे, एक छोटी सी मश्क़ करेंगे, और सोचेंगे। बस।",
      ur: "ہر سبق صرف 5 منٹ کا ہے۔\n\nآپ ایک آیت دیکھیں گے، کچھ نیا سیکھیں گے، ایک چھوٹی سی مشق کریں گے، اور سوچیں گے۔ بس۔",
    },
    steps: [
      { icon: '🌙', label: { en: 'Open — an ayah from the Qur\'an', hi: 'शुरुआत — क़ुरआन की एक आयत', ur: 'شروع — قرآن کی ایک آیت' } },
      { icon: '📚', label: { en: 'Learn — the letter, word, or rule', hi: 'सीखें — हर्फ़, लफ़्ज़, या क़ायदा', ur: 'سیکھیں — حرف، لفظ یا قاعدہ' } },
      { icon: '✏️', label: { en: 'Practice — a quick exercise', hi: 'मश्क़ — एक छोटा सवाल', ur: 'مشق — ایک چھوٹا سوال' } },
      { icon: '💭', label: { en: 'Reflect — think about the ayah', hi: 'सोचें — आयत पर ग़ौर करें', ur: 'سوچیں — آیت پر غور کریں' } },
      { icon: '⭐', label: { en: 'Seal — XP earned, lesson done!', hi: 'मुकम्मल — XP मिला, सबक़ पूरा!', ur: 'مکمل — XP ملا، سبق پورا!' } },
    ],
  },
  {
    id: 'tracks',
    icon: '🗺️',
    title: {
      en: "Three tracks, one journey",
      hi: "तीन रास्ते, एक सफ़र",
      ur: "تین راستے، ایک سفر",
    },
    body: {
      en: "Alif teaches Arabic through three connected tracks. You go through them in order — each one opens the next.",
      hi: "अलिफ़ तीन जुड़े हुए रास्तों से अरबी सिखाता है। आप उन्हें क्रम से पूरा करते हैं — हर एक अगला खोलता है।",
      ur: "الف تین جڑے ہوئے راستوں سے عربی سکھاتا ہے۔ آپ انہیں ترتیب سے مکمل کرتے ہیں — ہر ایک اگلا کھولتا ہے۔",
    },
    tracks: [
      {
        arabic: 'حُرُوف', name: { en: 'Huroof — The Alphabet', hi: 'हुरूफ़ — अक्षर', ur: 'حروف — حروف تہجی' },
        desc: { en: 'Learn the 28 Arabic letters. See them. Hear them. Recognise them anywhere.', hi: '28 अरबी हर्फ़ सीखें। देखें। सुनें। कहीं भी पहचानें।', ur: '28 عربی حروف سیکھیں۔ دیکھیں۔ سنیں۔ کہیں بھی پہچانیں۔' },
        color: '#C9A84C',
      },
      {
        arabic: 'كَلِمَات', name: { en: 'Kalimaat — The Words', hi: 'कलिमात — शब्द', ur: 'کلمات — الفاظ' },
        desc: { en: 'The 300 most common Qur\'anic words. Learn these and you\'ll understand ~70% of the Qur\'an.', hi: 'क़ुरआन के 300 सबसे आम शब्द। इन्हें सीखें और क़ुरआन का ~70% समझ जाएंगे।', ur: 'قرآن کے 300 سب سے عام الفاظ۔ انہیں سیکھیں اور قرآن کا ~70% سمجھ جائیں گے۔' },
        color: '#780f00',
      },
      {
        arabic: 'قَوَاعِد', name: { en: 'Qawaid — The Grammar', hi: 'क़वाइद — व्याकरण', ur: 'قواعد — گرامر' },
        desc: { en: 'The building blocks of Arabic sentences. Simple, practical, Qur\'an-focused.', hi: 'अरबी जुमलों की बुनियाद। सादा, काम का, क़ुरआन पर केंद्रित।', ur: 'عربی جملوں کی بنیاد۔ سادہ، کام کا، قرآن پر مرکوز۔' },
        color: '#2a6b3c',
      },
    ],
  },
  {
    id: 'ready',
    icon: '✨',
    title: {
      en: "You're ready. Bismillah.",
      hi: "आप तैयार हैं। बिस्मिल्लाह।",
      ur: "آپ تیار ہیں۔ بسم اللہ۔",
    },
    body: {
      en: "We'll ask you 6 quick questions to find your best starting point. There are no wrong answers — just an honest picture of where you are today.",
      hi: "हम आपसे 6 छोटे सवाल पूछेंगे ताकि आपका सही शुरुआती मुक़ाम ढूंढ सकें। कोई ग़लत जवाब नहीं है — बस एक सच्ची तस्वीर कि आप आज कहाँ हैं।",
      ur: "ہم آپ سے 6 چھوٹے سوال پوچھیں گے تاکہ آپ کا صحیح شروعاتی مقام ڈھونڈ سکیں۔ کوئی غلط جواب نہیں ہے — بس ایک سچی تصویر کہ آپ آج کہاں ہیں۔",
    },
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  },
];

let onboardSlide = 0;

export function renderOnboarding(lang) {
  onboardSlide = 0;
  return `
    <div id="onboarding-screen" class="screen active" style="min-height:100vh; display:flex; flex-direction:column; background:var(--bg-primary);">
      ${renderSlide(SLIDES[0], lang)}
    </div>
  `;
}

function renderSlide(slide, lang) {
  const total = SLIDES.length;
  const current = onboardSlide + 1;
  const isLast = onboardSlide === total - 1;

  const dots = Array.from({length: total}, (_, i) =>
    `<div style="width:${i === onboardSlide ? '20px' : '8px'}; height:8px; border-radius:4px; background:${i === onboardSlide ? 'var(--crimson)' : 'var(--border-strong)'}; transition:all 0.3s;"></div>`
  ).join('');

  let content = '';

  if (slide.id === 'welcome') {
    content = `
      <div style="text-align:center; padding:0 8px;">
        <div style="font-family:'Amiri',serif; font-size:64px; direction:rtl; color:var(--gold); margin-bottom:12px; animation:scaleIn 0.5s ease both;">${slide.arabic}</div>
        <div style="font-size:0.75em; color:var(--text-muted); font-style:italic; margin-bottom:28px;">${slide.arabicNote[lang] || slide.arabicNote.en}</div>
        <p style="font-size:0.9375em; color:var(--text-secondary); line-height:1.8; white-space:pre-line;">${slide.body[lang] || slide.body.en}</p>
      </div>
    `;
  } else if (slide.id === 'how') {
    content = `
      <div style="padding:0 4px;">
        <p style="font-size:0.9375em; color:var(--text-secondary); line-height:1.7; margin-bottom:20px; white-space:pre-line;">${slide.body[lang] || slide.body.en}</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${slide.steps.map((s, i) => `
            <div class="anim-fadeUp" style="animation-delay:${i * 0.08}s; display:flex; align-items:center; gap:14px; background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:12px 16px;">
              <span style="font-size:1.375em; flex-shrink:0;">${s.icon}</span>
              <span style="font-size:0.875em; color:var(--text-primary); font-weight:500;">${s.label[lang] || s.label.en}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (slide.id === 'tracks') {
    content = `
      <div style="padding:0 4px;">
        <p style="font-size:0.875em; color:var(--text-secondary); line-height:1.7; margin-bottom:20px;">${slide.body[lang] || slide.body.en}</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${slide.tracks.map((tr, i) => `
            <div class="anim-fadeUp" style="animation-delay:${i * 0.1}s; background:var(--bg-card); border:1px solid var(--border); border-left:3px solid ${tr.color}; border-radius:14px; padding:14px 16px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                <span style="font-family:'Amiri',serif; font-size:1.375em; direction:rtl; color:${tr.color};">${tr.arabic}</span>
                <span style="font-size:0.875em; font-weight:600; color:var(--text-primary);">${tr.name[lang] || tr.name.en}</span>
              </div>
              <p style="font-size:0.8125em; color:var(--text-muted); line-height:1.5; margin:0;">${tr.desc[lang] || tr.desc.en}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (slide.id === 'ready') {
    content = `
      <div style="text-align:center; padding:0 8px;">
        <div style="font-family:'Amiri',serif; font-size:1.5em; direction:rtl; color:var(--gold); margin-bottom:20px; line-height:1.9; animation:scaleIn 0.5s ease both;">
          ${slide.arabic}
        </div>
        <p style="font-size:0.9375em; color:var(--text-secondary); line-height:1.8;">${slide.body[lang] || slide.body.en}</p>
        <div style="margin-top:24px; background:var(--accent-bg); border:1px solid var(--border-gold); border-radius:14px; padding:16px; font-size:0.875em; color:var(--text-muted); line-height:1.6;">
          💡 ${lang === 'ur' ? 'آپ کسی بھی وقت اپنی زبان یا سطح بدل سکتے ہیں۔' : lang === 'hi' ? 'आप कभी भी अपनी भाषा या स्तर बदल सकते हैं।' : 'You can change your language or level at any time from your profile.'}
        </div>
      </div>
    `;
  }

  return `
    <!-- Slide ${current} of ${total} -->
    <div style="flex:1; display:flex; flex-direction:column; padding:32px 24px 24px; animation:fadeIn 0.3s ease both;">

      <!-- Skip -->
      <div style="display:flex; justify-content:flex-end; margin-bottom:24px;">
        <button class="btn-ghost" style="font-size:0.8125em;" onclick="skipOnboarding()">
          ${lang === 'ur' ? 'چھوڑیں' : lang === 'hi' ? 'छोड़ें' : 'Skip'}
        </button>
      </div>

      <!-- Icon + Title -->
      <div style="text-align:center; margin-bottom:24px;">
        <div style="font-size:52px; margin-bottom:14px; animation:scaleIn 0.4s cubic-bezier(0.34,1.06,0.64,1) both;">${slide.icon}</div>
        <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.75em; font-weight:400; color:var(--text-primary); line-height:1.3;">
          ${slide.title[lang] || slide.title.en}
        </h2>
      </div>

      <!-- Body content -->
      <div style="flex:1; overflow-y:auto;">
        ${content}
      </div>

      <!-- Nav footer -->
      <div style="padding-top:24px;">
        <!-- Dot indicators -->
        <div style="display:flex; gap:6px; justify-content:center; align-items:center; margin-bottom:20px;">
          ${dots}
        </div>

        <!-- Buttons -->
        <button class="btn btn-primary" onclick="onboardNext()">
          ${isLast
            ? (lang === 'ur' ? 'شروع کریں →' : lang === 'hi' ? 'शुरू करें →' : 'Let\'s Begin →')
            : (lang === 'ur' ? 'آگے →' : lang === 'hi' ? 'आगे →' : 'Next →')
          }
        </button>

        ${onboardSlide > 0 ? `
          <button class="btn btn-ghost" style="margin-top:8px;" onclick="onboardBack()">
            ${lang === 'ur' ? '← پیچھے' : lang === 'hi' ? '← पीछे' : '← Back'}
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

export function onboardNext(lang) {
  const resolvedLang = lang || window.APP_STATE?.lang || 'en';
  if (onboardSlide < SLIDES.length - 1) {
    onboardSlide++;
    const screen = document.getElementById('onboarding-screen');
    if (screen) screen.innerHTML = renderSlide(SLIDES[onboardSlide], resolvedLang);
  } else {
    // Done — go to placement
    localStorage.setItem('alif_onboarding_done', '1');
    window.showScreen('placement');
  }
}

export function onboardBack(lang) {
  const resolvedLang = lang || window.APP_STATE?.lang || 'en';
  if (onboardSlide > 0) {
    onboardSlide--;
    const screen = document.getElementById('onboarding-screen');
    if (screen) screen.innerHTML = renderSlide(SLIDES[onboardSlide], resolvedLang);
  }
}

export function isOnboardingDone() {
  return !!localStorage.getItem('alif_onboarding_done');
}
