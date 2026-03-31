// ALIF — All UI strings. Rule 2: All three languages in every user-facing string.
// t(key, lang) is the single translation function used everywhere.

export const strings = {
  // App identity
  appName:        { en: "Alif", ur: "الف", hi: "अलिफ़" },
  tagline:        { en: "Arabic is the door, and Alif is the first step.", ur: "عربی دروازہ ہے، اور الف پہلا قدم۔", hi: "अरबी दरवाज़ा है, और अलिफ़ पहला क़दम।" },
  bismillah:      { en: "Bismillah", ur: "بسم اللہ", hi: "बिस्मिल्लाह" },

  // Welcome / Onboarding
  welcomeTitle:   { en: "Begin your Arabic journey", ur: "اپنا عربی سفر شروع کریں", hi: "अपना अरबी सफ़र शुरू करें" },
  welcomeSub:     { en: "Understand the Qur'an, word by word.", ur: "قرآن کو لفظ بہ لفظ سمجھیں۔", hi: "क़ुरआन को शब्द दर शब्द समझें।" },
  signIn:         { en: "Sign In", ur: "سائن ان کریں", hi: "साइन इन करें" },
  createAccount:  { en: "Create Account", ur: "اکاؤنٹ بنائیں", hi: "अकाउंट बनाएं" },
  email:          { en: "Email", ur: "ای میل", hi: "ईमेल" },
  password:       { en: "Password", ur: "پاسورڈ", hi: "पासवर्ड" },
  name:           { en: "Your Name", ur: "آپ کا نام", hi: "आपका नाम" },
  loginBtn:       { en: "Sign In", ur: "داخل ہوں", hi: "साइन इन करें" },
  registerBtn:    { en: "Create Account", ur: "اکاؤنٹ بنائیں", hi: "अकाउंट बनाएं" },
  noAccount:      { en: "New here?", ur: "نئے ہیں؟", hi: "नए हैं?" },
  hasAccount:     { en: "Already have an account?", ur: "پہلے سے اکاؤنٹ ہے؟", hi: "पहले से अकाउंट है?" },
  forgotPassword: { en: "Forgot password?", ur: "پاسورڈ بھول گئے؟", hi: "पासवर्ड भूल गए?" },
  orContinueWith: { en: "or", ur: "یا", hi: "या" },
  authError:      { en: "Something went wrong. Please try again.", ur: "کچھ غلط ہوا۔ دوبارہ کوشش کریں۔", hi: "कुछ गलत हुआ। दोबारा कोशिश करें।" },
  wrongPassword:  { en: "Incorrect email or password.", ur: "ای میل یا پاسورڈ غلط ہے۔", hi: "ईमेल या पासवर्ड गलत है।" },
  emailInUse:     { en: "An account with this email already exists.", ur: "یہ ای میل پہلے سے رجسٹرڈ ہے۔", hi: "यह ईमेल पहले से रजिस्टर है।" },

  // Placement quiz
  placementTitle: { en: "Let's find your starting point", ur: "آپ کا شروعاتی مقام دیکھتے ہیں", hi: "आपका शुरुआती मुक़ाम देखते हैं" },
  placementSub:   { en: "A few quick questions. No pressure.", ur: "بس چند سوال۔ کوئی دباؤ نہیں۔", hi: "बस कुछ सवाल। कोई दबाव नहीं।" },
  placementQ:     { en: "Question", ur: "سوال", hi: "सवाल" },
  placementOf:    { en: "of", ur: "میں سے", hi: "में से" },
  placementResult:{ en: "Your starting level", ur: "آپ کا شروعاتی مرحلہ", hi: "आपका शुरुआती स्तर" },
  levelZero:      { en: "Beginner", ur: "ابتدائی", hi: "शुरुआती" },
  levelBeginner:  { en: "Elementary", ur: "بنیادی", hi: "बुनियादी" },
  levelIntermediate:{ en: "Intermediate", ur: "درمیانی", hi: "मध्यवर्ती" },
  levelZeroDesc:  { en: "We'll start from the very first letter.", ur: "ہم سب سے پہلے حرف سے شروع کریں گے۔", hi: "हम सबसे पहले हर्फ़ से शुरू करेंगे।" },
  levelBeginnerDesc:{ en: "You know some letters — we'll build on that.", ur: "آپ کچھ حروف جانتے ہیں — ہم اس پر آگے بڑھیں گے۔", hi: "आप कुछ हर्फ़ जानते हैं — हम उससे आगे बढ़ेंगे।" },
  levelIntermediateDesc:{ en: "You can read — time to understand.", ur: "آپ پڑھ سکتے ہیں — اب سمجھنے کا وقت ہے۔", hi: "आप पढ़ सकते हैं — अब समझने का वक़्त है।" },
  startLevel:     { en: "Begin at this level", ur: "اس مرحلے سے شروع کریں", hi: "इस स्तर से शुरू करें" },
  changeLevel:    { en: "Choose a different level", ur: "مختلف مرحلہ چنیں", hi: "अलग स्तर चुनें" },
  skipPlacement:  { en: "Skip — I'll start from the beginning", ur: "چھوڑیں — میں شروع سے شروع کروں گا", hi: "छोड़ें — मैं शुरू से शुरू करूँगा" },

  // Navigation
  navHome:        { en: "Home", ur: "ہوم", hi: "होम" },
  navTrack:       { en: "Track", ur: "راستہ", hi: "रास्ता" },
  navJournal:     { en: "Journal", ur: "جرنل", hi: "जर्नल" },

  // Home screen
  welcomeBack:    { en: "Assalamu Alaikum", ur: "السلام علیکم", hi: "अस्सलामु अलैकुम" },
  streak:         { en: "Day Streak", ur: "لگاتار دن", hi: "लगातार दिन" },
  xpEarned:       { en: "XP", ur: "XP", hi: "XP" },
  lessonsComplete:{ en: "Lessons", ur: "سبق", hi: "सबक़" },
  continueLesson: { en: "Continue", ur: "جاری رکھیں", hi: "जारी रखें" },
  startJourney:   { en: "Begin your journey", ur: "اپنا سفر شروع کریں", hi: "अपना सफ़र शुरू करें" },
  todayLesson:    { en: "Today's Lesson", ur: "آج کا سبق", hi: "आज का सबक़" },
  yourTracks:     { en: "Your Tracks", ur: "آپ کے راستے", hi: "आपके रास्ते" },
  ayahOfDay:      { en: "Ayah of the Day", ur: "آج کی آیت", hi: "आज की आयत" },

  // Track screen
  trackTitle:     { en: "Your Track", ur: "آپ کا راستہ", hi: "आपका रास्ता" },
  trackHuroof:    { en: "Huroof — The Alphabet", ur: "حروف — حروف تہجی", hi: "हुरूफ़ — अक्षर" },
  trackKalimaat:  { en: "Kalimaat — The Words", ur: "کلمات — الفاظ", hi: "कलिमात — शब्द" },
  trackQawaid:    { en: "Qawaid — The Grammar", ur: "قواعد — گرامر", hi: "क़वाइद — व्याकरण" },
  locked:         { en: "Complete previous lesson to unlock", ur: "پچھلا سبق مکمل کریں", hi: "पिछला सबक़ पूरा करें" },
  lessonComplete: { en: "Complete", ur: "مکمل", hi: "पूरा" },
  lessonStart:    { en: "Start", ur: "شروع", hi: "शुरू" },
  lessonResume:   { en: "Resume", ur: "جاری رکھیں", hi: "जारी रखें" },
  lessonsOf:      { en: "of", ur: "میں سے", hi: "में से" },

  // Lesson — 5 steps
  stepOpen:       { en: "The Qur'anic Connection", ur: "قرآنی تعلق", hi: "क़ुरआनी संबंध" },
  stepLearn:      { en: "Learn", ur: "سیکھیں", hi: "सीखें" },
  stepPractice:   { en: "Practice", ur: "مشق", hi: "अभ्यास" },
  stepReflect:    { en: "Reflect", ur: "سوچیں", hi: "सोचें" },
  stepSeal:       { en: "Alhamdulillah!", ur: "الحمد للہ!", hi: "अलहम्दुलिल्लाह!" },
  practiceCount:  { en: "Exercise", ur: "مشق", hi: "अभ्यास" },
  continueBtn:    { en: "Continue", ur: "آگے →", hi: "आगे →" },
  practiceBtn:    { en: "Practice →", ur: "مشق کریں →", hi: "अभ्यास करें →" },

  // Exercise feedback
  correct:        { en: "Correct! ✓", ur: "بالکل صحیح! ✓", hi: "बिल्कुल सही! ✓" },
  tryAgain:       { en: "Not quite — look at the correct answer above.", ur: "ٹھیک نہیں — اوپر صحیح جواب دیکھیں۔", hi: "ठीक नहीं — ऊपर सही जवाब देखें।" },
  tapCorrect:     { en: "Tap the correct answer", ur: "صحیح جواب پر ٹیپ کریں", hi: "सही जवाब पर टैप करें" },

  // Reflection
  reflectPromptDefault: {
    en: "What does this lesson mean to you personally?",
    ur: "یہ سبق آپ کے لیے ذاتی طور پر کیا معنی رکھتا ہے؟",
    hi: "यह सबक़ आपके लिए निजी तौर पर क्या मायने रखता है?"
  },
  reflectSkip:    { en: "Skip for now", ur: "ابھی چھوڑیں", hi: "अभी छोड़ें" },
  reflectSave:    { en: "Save to Journal", ur: "جرنل میں محفوظ کریں", hi: "जर्नल में सेव करें" },
  reflectSaved:   { en: "Saved ✓", ur: "محفوظ ✓", hi: "सेव हो गया ✓" },
  reflectPlaceholder: {
    en: "Write your thoughts…",
    ur: "اپنے خیالات لکھیں…",
    hi: "अपने विचार लिखें…"
  },

  // Seal
  alhamdulillah:  { en: "Alhamdulillah", ur: "الحمد للہ", hi: "अलहम्दुलिल्लाह" },
  lessonDone:     { en: "Lesson Complete", ur: "سبق مکمل", hi: "सबक़ पूरा" },
  xpGained:       { en: "XP gained", ur: "XP ملا", hi: "XP मिला" },
  nextLesson:     { en: "Next Lesson →", ur: "اگلا سبق →", hi: "अगला सबक़ →" },
  backToTrack:    { en: "Back to Track", ur: "واپس جائیں", hi: "वापस जाएं" },

  // Journal
  journalTitle:   { en: "My Journal", ur: "میرا جرنل", hi: "मेरा जर्नल" },
  journalEmpty:   { en: "Your reflections will appear here.", ur: "آپ کے خیالات یہاں نظر آئیں گے۔", hi: "आपके विचार यहाँ दिखेंगे।" },
  journalEmptySub:{ en: "Complete a lesson and save your reflection.", ur: "سبق مکمل کریں اور اپنا خیال محفوظ کریں۔", hi: "सबक़ पूरा करें और अपना विचार सेव करें।" },
  from:           { en: "from", ur: "سے", hi: "से" },

  // Settings / theme
  language:       { en: "Language", ur: "زبان", hi: "भाषा" },
  theme:          { en: "Theme", ur: "تھیم", hi: "थीम" },
  themeDark:      { en: "Dark", ur: "ڈارک", hi: "डार्क" },
  themeLight:     { en: "Light", ur: "لائٹ", hi: "लाइट" },
  themeSystem:    { en: "System", ur: "سسٹم", hi: "सिस्टम" },

  // Misc
  loading:        { en: "Loading…", ur: "لوڈ ہو رہا ہے…", hi: "लोड हो रहा है…" },
  error:          { en: "Something went wrong.", ur: "کچھ غلط ہوا۔", hi: "कुछ गलत हुआ।" },
  signOut:        { en: "Sign Out", ur: "سائن آؤٹ", hi: "साइन आउट" },
  profile:        { en: "Profile", ur: "پروفائل", hi: "प्रोफ़ाइल" },
  settings:       { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },
  account:        { en: "Account", ur: "اکاؤنٹ", hi: "अकाउंट" },
  displayName:    { en: "Name", ur: "نام", hi: "नाम" },
  themeLabel:     { en: "Theme", ur: "تھیم", hi: "थीम" },
  langLabel:      { en: "Language", ur: "زبان", hi: "भाषा" },
  themeDark:      { en: "Dark", ur: "ڈارک", hi: "डार्क" },
  themeLight:     { en: "Light", ur: "لائٹ", hi: "लाइट" },
  themeSystem:    { en: "System", ur: "سسٹم", hi: "सिस्टम" },
  signOutConfirm: { en: "Sign out of Alif?", ur: "الف سے سائن آؤٹ کریں؟", hi: "अलिफ़ से साइन आउट करें?" },
};

export function t(key, lang = 'en') {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}
