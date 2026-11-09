import type { Language } from './storage';

const messages = {
  ar: {
    brand: 'نَسِيج', tagline: 'خط واحد. تناظر لا نهائي.', home: 'الرئيسية', collection: 'مجموعتي',
    heroEyebrow: 'مساحة صغيرة من الهدوء', heroTitle: 'ارسم خيطًا، واصنع تناظرًا.', heroBody: 'ارسم نصف النقش بخط واحد، ودع الجانب الآخر يكتمل بانعكاسه.',
    play: 'ابدأ النسج', continue: 'متابعة اللعب', daily: 'تحدّي اليوم', dailySub: 'نقش جديد كل يوم، للجميع.', collectionTitle: 'معرض النقوش', viewAll: 'عرض الكل',
    patterns: 'نقش مكتمل', progress: 'التقدم', levels: 'المراحل', level: 'المرحلة', of: 'من', drawTitle: 'أكمل النمط', drawHelp: 'ابدأ من النقطة المضيئة، ثم اتبع النقاط بالترتيب.',
    tapStart: 'المس نقطة البداية', wrong: 'هذه ليست النقطة التالية. جرّب نقطة أخرى.', hint: 'تلميح', undo: 'تراجع', reset: 'إعادة',
    complete: 'اكتمل النقش', completeBody: 'تحوّل خيطك إلى تناظر جديد. أحسنت.', next: 'النقش التالي', share: 'مشاركة البطاقة', replay: 'إعادة اللعب', back: 'رجوع',
    locked: 'مقفلة', unlocked: 'متاحة', settings: 'الإعدادات', language: 'اللغة', arabic: 'العربية', english: 'English',
    sound: 'الصوت', soundOff: 'لا توجد موسيقى أو أصوات في هذه النسخة.', close: 'إغلاق', dailyDone: 'أنجزت تحدي اليوم!', dailyLabel: 'تحدي يومي',
    noPatterns: 'ستظهر نقوشك هنا بعد إكمال المراحل.', collectionBody: 'كل نقش مكتمل هو قطعة جديدة في مجموعتك.',
    first: 'أول خيط يبدأ هنا', start: 'ابدأ من جديد', shareTitle: 'نقشي من نَسِيج', shareBody: 'أنهيت نقشًا هندسيًا في نَسِيج. هل تستطيع إكماله؟',
    progressLabel: 'خطوات', difficulty: ['هادئ', 'سهل', 'متوسط', 'متقدم', 'خبير'],
  },
  en: {
    brand: 'NASEEJ', tagline: 'One line. Endless symmetry.', home: 'Home', collection: 'Collection',
    heroEyebrow: 'A little space to unwind', heroTitle: 'Draw a thread. Create symmetry.', heroBody: 'Trace one half of a pattern and watch the other side complete itself.',
    play: 'Start weaving', continue: 'Continue', daily: 'Daily pattern', dailySub: 'A new pattern every day, for everyone.', collectionTitle: 'Pattern gallery', viewAll: 'View all',
    patterns: 'Patterns made', progress: 'Progress', levels: 'Levels', level: 'Level', of: 'of', drawTitle: 'Complete the pattern', drawHelp: 'Start at the glowing point, then follow the dots in order.',
    tapStart: 'Tap the start point', wrong: 'Not the next point. Try another one.', hint: 'Hint', undo: 'Undo', reset: 'Reset',
    complete: 'Pattern complete', completeBody: 'Your thread became a new symmetry. Beautifully done.', next: 'Next pattern', share: 'Share card', replay: 'Play again', back: 'Back',
    locked: 'Locked', unlocked: 'Available', settings: 'Settings', language: 'Language', arabic: 'العربية', english: 'English',
    sound: 'Sound', soundOff: 'No music or sound effects in this version.', close: 'Close', dailyDone: 'Daily pattern complete!', dailyLabel: 'Daily challenge',
    noPatterns: 'Your patterns will appear here as you complete levels.', collectionBody: 'Every completed pattern is a new piece in your collection.',
    first: 'Your first thread starts here', start: 'Start again', shareTitle: 'My NASEEJ pattern', shareBody: 'I completed a geometric pattern in NASEEJ. Can you weave it?',
    progressLabel: 'Steps', difficulty: ['Calm', 'Easy', 'Medium', 'Advanced', 'Expert'],
  },
} as const;

export type MessageKey = keyof typeof messages.ar;
export function t(key: MessageKey, language: Language): string {
  return String(messages[language][key] ?? messages.ar[key]);
}
export function direction(language: Language): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr';
}
